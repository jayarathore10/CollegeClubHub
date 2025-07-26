from PIL import Image
import numpy as np
import sys

if len(sys.argv) < 3:
    print("❌ Usage: python fix_image_force.py <input_image> <output_image>")
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2]

try:
    img = Image.open(input_path).convert('RGB')
    arr = np.array(img)

    # Force dtype to uint8 cleanly
    if arr.dtype != np.uint8:
        print(f"⚠️ Fixing image dtype from {arr.dtype} to uint8")
        arr = arr.astype(np.uint8)

    # Save again using Pillow
    fixed_img = Image.fromarray(arr)
    fixed_img.save(output_path, format='JPEG')
    print("✅ Force-fixed and saved RGB image as JPEG.")
except Exception as e:
    print(f"❌ Failed to force-fix image: {e}")
