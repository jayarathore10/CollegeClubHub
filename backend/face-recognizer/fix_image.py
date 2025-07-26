from PIL import Image
import sys
import os

if len(sys.argv) < 3:
    print("Usage: python fix_image.py input_path output_path")
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2]

try:
    with Image.open(input_path) as img:
        rgb_img = img.convert("RGB")
        rgb_img.save(output_path, "JPEG", quality=95)
    print("✅ Image resaved successfully as clean RGB JPEG.")
except Exception as e:
    print(f"❌ Failed to fix image: {e}")
