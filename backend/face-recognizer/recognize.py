import sys
import face_recognition
import pickle
import numpy as np
from PIL import Image
import json

if len(sys.argv) != 3:
    print("Usage: python recognize.py <input_image> <encodings_file>", file=sys.stderr)
    sys.exit(1)

image_path = sys.argv[1]
encodings_path = sys.argv[2]

# Load and convert image
try:
    img = Image.open(image_path).convert("RGB")
    img_np = np.array(img)
    print(f"[INFO] Loaded image shape: {img_np.shape}, dtype: {img_np.dtype}", file=sys.stderr)
except Exception as e:
    print(f"[ERROR] Failed to load or convert image: {e}", file=sys.stderr)
    sys.exit(1)

# Detect faces and get encodings
face_locations = face_recognition.face_locations(img_np)
face_encodings = face_recognition.face_encodings(img_np, face_locations)

print(f"[INFO] Found {len(face_encodings)} face(s) in the image", file=sys.stderr)

# Load known student encodings
try:
    with open(encodings_path, "rb") as f:
        known_students = pickle.load(f)
except Exception as e:
    print(f"[ERROR] Could not load encodings: {e}", file=sys.stderr)
    sys.exit(1)

recognized = []
unknown_count = 0

# Match each detected face
for i, encoding in enumerate(face_encodings):
    matched = False
    for roll, enc_list in known_students.items():
        if not isinstance(enc_list, list) or not enc_list:
            print(f"[SKIP] Roll {roll} has invalid or empty encoding list.", file=sys.stderr)
            continue

        try:
            enc_array = np.array(enc_list)
            if len(enc_array.shape) != 2 or enc_array.shape[1] != 128:
                print(f"[SKIP] Roll {roll} encoding shape invalid: {enc_array.shape}", file=sys.stderr)
                continue

            results = face_recognition.compare_faces(enc_array, encoding, tolerance=0.6)
            if any(results):
                recognized.append(roll)
                matched = True
                print(f"[MATCH] Face {i+1} matched with roll: {roll}", file=sys.stderr)
                break

        except Exception as err:
            print(f"[ERROR] Matching failed for roll {roll}: {err}", file=sys.stderr)
            continue

    if not matched:
        print(f"[UNKNOWN] Face {i+1} did not match any student.", file=sys.stderr)
        unknown_count += 1

# ✅ Final output: ONLY valid JSON to stdout
output = {
    "recognized": recognized,
    "unknown": unknown_count,
    "total": len(face_encodings)
}
print(json.dumps(output))  # <-- This goes to stdout
