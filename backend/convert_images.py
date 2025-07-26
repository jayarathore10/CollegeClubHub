import cv2
import os
import numpy as np

students_dir = os.path.join("..", "uploads", "students")
fixed_dir = os.path.join("..", "uploads", "students_fixed")
os.makedirs(fixed_dir, exist_ok=True)

# Fix all student photos
for file in os.listdir(students_dir):
    if file.lower().endswith(('.jpg', '.jpeg', '.png')):
        img_path = os.path.join(students_dir, file)
        img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)

        if img is None:
            print(f"❌ Could not read {file}")
            continue

        # Convert all to BGR then RGB (8-bit)
        if img.dtype != np.uint8:
            img = cv2.convertScaleAbs(img)
        if len(img.shape) == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        if img.shape[2] == 4:
            img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        save_path = os.path.join(fixed_dir, file)
        cv2.imwrite(save_path, cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR))
        print(f"Fixed and saved: {save_path}")

# Fix class photo
class_photo_path = os.path.join("..", "uploads", "class.jpg")
if os.path.exists(class_photo_path):
    img = cv2.imread(class_photo_path, cv2.IMREAD_UNCHANGED)
    if img is not None:
        if img.dtype != np.uint8:
            img = cv2.convertScaleAbs(img)
        if len(img.shape) == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        if img.shape[2] == 4:
            img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        cv2.imwrite(os.path.join("..", "uploads", "class_fixed.jpg"),
                    cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR))
        print("Fixed and saved class photo")
