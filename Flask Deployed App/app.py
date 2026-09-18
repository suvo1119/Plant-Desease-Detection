import os
from flask import Flask, redirect, render_template, request, url_for
from PIL import Image, ImageOps
import torchvision.transforms.functional as TF
import CNN
import numpy as np
import torch
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

disease_info = pd.read_csv(os.path.join(BASE_DIR, 'disease_info.csv'), encoding='cp1252')
supplement_info = pd.read_csv(os.path.join(BASE_DIR, 'supplement_info.csv'), encoding='cp1252')

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = CNN.CNN(39)
model_path = os.path.join(BASE_DIR, "plant_disease_model_1_latest.pt")
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()

def prediction(image_path):
    image = Image.open(image_path)
    # Auto-orient smartphone photos based on EXIF metadata
    try:
        image = ImageOps.exif_transpose(image)
    except Exception:
        pass
    # Ensure RGB mode (prevents shape errors on RGBA PNGs or Grayscale)
    image = image.convert('RGB')
    image = image.resize((224, 224))
    input_data = TF.to_tensor(image)
    input_data = input_data.view((-1, 3, 224, 224)).to(device)
    with torch.no_grad():
        output = model(input_data)
        probabilities = torch.softmax(output, dim=1)
        conf_val, pred_val = torch.max(probabilities, dim=1)
    return pred_val.item(), conf_val.item() * 100


app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template('home.html')

@app.route('/contact')
def contact():
    return render_template('contact-us.html')

@app.route('/index')
def ai_engine_page():
    return render_template('index.html')

@app.route('/mobile-device')
def mobile_device_detected_page():
    return render_template('mobile-device.html')

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        image = request.files['image']
        filename = image.filename
        upload_dir = os.path.join(BASE_DIR, 'static', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, filename)
        image.save(file_path)
        print(file_path)
        pred, confidence = prediction(file_path)
        title = disease_info['disease_name'][pred]
        description = disease_info['description'][pred]
        prevent = disease_info['Possible Steps'][pred]
        image_url = disease_info['image_url'][pred]
        supplement_name = supplement_info['supplement name'][pred]
        supplement_image_url = supplement_info['supplement image'][pred]
        supplement_buy_link = supplement_info['buy link'][pred]
        user_image = url_for('static', filename='uploads/' + filename)
        return render_template('submit.html', title=title, desc=description, prevent=prevent, 
                               image_url=image_url, user_image=user_image, pred=pred,
                               confidence=round(confidence, 1),
                               sname=supplement_name, simage=supplement_image_url, buy_link=supplement_buy_link)

@app.route('/market', methods=['GET', 'POST'])
def market():
    return render_template('market.html', supplement_image = list(supplement_info['supplement image']),
                           supplement_name = list(supplement_info['supplement name']), disease = list(disease_info['disease_name']), buy = list(supplement_info['buy link']))

if __name__ == '__main__':
    app.run(debug=True)
