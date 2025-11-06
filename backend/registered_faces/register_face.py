import cv2
import pandas as pd
import os
from datetime import datetime

# folders and files
os.makedirs("registered_faces", exist_ok=True)
csv_file = "students.csv"

# camera feed
url = "http://10.201.61.145:8080/video"
cap = cv2.VideoCapture(url)

# student details
reg_no = input("Enter Register Number: ")
roll_no = input("Enter Roll Number: ")
section = input("Enter Section: ")

count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break

    cv2.imshow("Capture Student Face", frame)

    # press 's' to save face
    if cv2.waitKey(1) & 0xFF == ord('s'):
        filename = f"registered_faces/{reg_no}_{count}.jpg"
        cv2.imwrite(filename, frame)
        print(f"Saved {filename}")
        count += 1

    # press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# save details in CSV
data = {
    "Register_No": [reg_no],
    "Roll_No": [roll_no],
    "Section": [section],
    "Timestamp": [datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
}
df = pd.DataFrame(data)
if os.path.exists(csv_file):
    df.to_csv(csv_file, mode="a", header=False, index=False)
else:
    df.to_csv(csv_file, index=False)

print("✅ Student registered successfully!")
