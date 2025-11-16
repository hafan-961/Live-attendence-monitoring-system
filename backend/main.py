from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import cv2
import numpy as np
import base64
import os
import pickle
from datetime import datetime
from insightface.app import FaceAnalysis

# ---------------------- INIT APP ----------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------- INSIGHTFACE SETUP ----------------------
face_app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
face_app.prepare(ctx_id=0, det_size=(640, 640))

EMBEDDINGS_PATH = "embeddings.pkl"

if os.path.exists(EMBEDDINGS_PATH):
    with open(EMBEDDINGS_PATH, "rb") as f:
        known_faces = pickle.load(f)
else:
    known_faces = []


# ---------------------- CAMERA URL (NEW) ----------------------
@app.get("/camera_url")
def camera_url():
    return {
        "image_url": "http://10.217.72.237:8080/shot.jpg",
        "video_url": "http://10.217.72.237:8080/video"
    }




# ---------------------- REGISTER FACE ----------------------
@app.post("/register")
async def register_student(
    name: str = Form(...),
    reg_no: str = Form(...),
    roll_no: str = Form(...),
    section: str = Form(...),
    image: UploadFile = File(...)
):
    img_bytes = await image.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    faces = face_app.get(frame)

    if len(faces) == 0:
        return {"error": "No face detected"}

    face_embedding = faces[0].embedding.tolist()

    known_faces.append({
        "name": name,
        "register_no": reg_no,
        "roll_no": roll_no,
        "section": section,
        "embedding": face_embedding
    })

    with open(EMBEDDINGS_PATH, "wb") as f:
        pickle.dump(known_faces, f)

    return {"status": "success", "message": "Student registered successfully."}


# ---------------------- MARK ATTENDANCE ----------------------
@app.post("/mark_attendance")
async def mark_attendance(image: UploadFile = File(...)):
    img_bytes = await image.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    faces = face_app.get(frame)
    if len(faces) == 0:
        return {"status": "no_face"}

    detected = faces[0].embedding

    best_match = None
    best_score = 999

    for person in known_faces:
        db_emb = np.array(person["embedding"])
        distance = np.linalg.norm(detected - db_emb)

        if distance < best_score:
            best_score = distance
            best_match = person

    if best_score < 0.8:
        timestamp = datetime.now().strftime("%H:%M:%S")

        record = {
            "Register_No": best_match["register_no"],
            "Name": best_match["name"],
            "Roll_No": best_match["roll_no"],
            "Section": best_match["section"],
            "Time": timestamp,
            "Status": "Present"
        }

        return record

    else:
        return {"status": "unknown"}


# ---------------------- GET ATTENDANCE RECS ----------------------
@app.get("/attendance")
def get_attendance():
    # If you want full logging later, expand here
    return {"message": "Attendance endpoint working"}


# ---------------------- START SERVER ----------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
