# extract_encoding.py
import face_recognition
import pickle
import sys
import numpy as np
import os
from pathlib import Path
from PIL import Image

# -------- Args --------
if len(sys.argv) < 3:
    print("Usage: python face-recognizer/extract_encoding.py <image_path> <student_rollno>")
    sys.exit(1)

image_path = Path(sys.argv[1])
print("Image path being used:", image_path)
student_rollno = sys.argv[2]

# -------- Checks --------
if not image_path.exists():
    print(f"Image not found: {image_path}")
    sys.exit(1)

# -------- Encode --------
pil_img = Image.open(image_path).convert('RGB')
img = np.array(pil_img)
encodings = face_recognition.face_encodings(img)

if not encodings:
    print("No face detected in image")
    sys.exit(1)

# -------- Save / Update pkl --------
enc_file = Path(__file__).with_name("student-encodings.pkl")   # face-recognizer/student-encodings.pkl

# Load existing encodings if file exists
if enc_file.exists():
    with open(enc_file, "rb") as f:
        data = pickle.load(f)
else:
    data = {}

# ✅ Store as a list of encodings (even if just one)
data[student_rollno] = encodings  # encodings is already a list

# Save updated data
with open(enc_file, "wb") as f:
    pickle.dump(data, f)

print(f"[✅] Encoding saved for student: {student_rollno} -> {enc_file}")
