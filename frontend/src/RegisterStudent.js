import React, { useEffect, useRef, useState } from "react";

export default function RegisterStudent() {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraUrl, setCameraUrl] = useState("");
  const [capturedImage, setCapturedImage] = useState("");

  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [section, setSection] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  // ------------------ GET CAMERA URL (from backend) ------------------
  useEffect(() => {
    async function loadCameraUrl() {
      try {
        const res = await fetch("http://127.0.0.1:8000/camera_url");
        const data = await res.json();

        if (data.image_url) {
          setCameraUrl(data.image_url); // <-- correct field
        } else {
          setErrorMsg("Camera URL not found in backend response.");
        }
      } catch (err) {
        setErrorMsg("Failed to fetch camera URL.");
      }
    }

    loadCameraUrl();
  }, []);

  // ------------------ LIVE IMAGE STREAM ------------------
  useEffect(() => {
    if (!cameraUrl || !imgRef.current) return;

    const update = () => {
      imgRef.current.src = `${cameraUrl}?t=${Date.now()}`;
    };

    update();
    const interval = setInterval(update, 300);

    return () => clearInterval(interval);
  }, [cameraUrl]);

  // ------------------ CAPTURE IMAGE ------------------
  const captureFace = () => {
    if (!imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = imgRef.current.width;
    canvas.height = imgRef.current.height;

    ctx.drawImage(imgRef.current, 0, 0);

    const base64data = canvas.toDataURL("image/jpeg");
    setCapturedImage(base64data);
  };

  // ------------------ SUBMIT REGISTRATION ------------------
  const handleSubmit = async () => {
    if (!capturedImage) {
      alert("Please capture a face first!");
      return;
    }

    const blob = await (await fetch(capturedImage)).blob();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("reg_no", regNo);
    formData.append("roll_no", rollNo);
    formData.append("section", section);
    formData.append("image", blob, "face.jpg");

    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      alert(data.message || "Registered successfully!");
    } catch (err) {
      alert("Registration failed.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Register Student</h1>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {/* LIVE CAMERA FEED */}
      <img
        ref={imgRef}
        alt="Live Camera"
        width={400}
        height={300}
        style={{
          border: "2px solid black",
          background: "black",
          display: "block",
        }}
      />

      <button onClick={captureFace} style={{ marginTop: 10 }}>
        Capture Face
      </button>

      <h3>Captured Image</h3>
      {capturedImage ? (
        <img src={capturedImage} alt="Captured" width={200} />
      ) : (
        <p>No image captured</p>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <h3>Student Details</h3>

      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        placeholder="Register Number"
        value={regNo}
        onChange={(e) => setRegNo(e.target.value)}
      /><br /><br />

      <input
        placeholder="Roll Number"
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
      /><br /><br />

      <input
        placeholder="Section"
        value={section}
        onChange={(e) => setSection(e.target.value)}
      /><br /><br />

      <button
        onClick={handleSubmit}
        style={{
          background: "blue",
          color: "white",
          padding: "10px 20px",
        }}
      >
        Submit
      </button>
    </div>
  );
}
