# check_encoding.py
import pickle

with open("student-encodings.pkl", "rb") as f:
    data = pickle.load(f)

for roll, enc_list in data.items():
    print(f"Roll: {roll}")
    print("Type of enc_list:", type(enc_list))
    if isinstance(enc_list, list):
        print("Length:", len(enc_list))
        if len(enc_list) > 0:
            print("First encoding shape:", len(enc_list[0]))
        else:
            print("[⚠️] Empty list!")
    elif hasattr(enc_list, "shape"):
        print("Shape:", enc_list.shape)
    else:
        print("[❌] Unknown encoding format")
