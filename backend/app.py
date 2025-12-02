from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from cartoonify import cartoonify_image
import uuid
import os

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 👉 Serve the uploads folder as static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.post("/cartoonify")
async def cartoonify(file: UploadFile = File(...)):
    # Save uploaded file
    input_filename = f"{UPLOAD_FOLDER}/{uuid.uuid4()}_{file.filename}"
    output_filename = f"{UPLOAD_FOLDER}/cartoon_{uuid.uuid4()}.png"

    with open(input_filename, "wb") as f:
        f.write(await file.read())

    # Process image using cartoonify function
    cartoonify_image(input_filename, output_filename)

    return {
        "success": True,
        "output_image": f"/uploads/{os.path.basename(output_filename)}"
    }

