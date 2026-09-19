import os
from flask import Flask, redirect, render_template, request, url_for, jsonify, send_from_directory
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

# Plant2 Model (22 Classes - 99.12% Accuracy)
plant2_model = None
plant2_classes = []
plant2_classes_path = os.path.join(BASE_DIR, "plant2_classes.json")
plant2_model_path = os.path.join(BASE_DIR, "plant2_disease_model.pt")

if os.path.exists(plant2_classes_path) and os.path.exists(plant2_model_path):
    try:
        import json
        with open(plant2_classes_path, 'r', encoding='utf-8') as f:
            cdata = json.load(f)
            plant2_classes = cdata.get('classes', [])
        plant2_model = CNN.CNN(K=len(plant2_classes), pretrained=False)
        plant2_model.load_state_dict(torch.load(plant2_model_path, map_location=device))
        plant2_model.to(device)
        plant2_model.eval()
        print(f"[OK] Successfully loaded Plant2 model (99.12% Acc) with {len(plant2_classes)} classes.")
    except Exception as e:
        print("[!] Warning: Could not load plant2 model:", e)

def prediction(image_path):
    image = Image.open(image_path)
    try:
        image = ImageOps.exif_transpose(image)
    except Exception:
        pass
    image = image.convert('RGB')
    image = image.resize((224, 224))
    input_data = TF.to_tensor(image)
    input_data = input_data.view((-1, 3, 224, 224)).to(device)
    with torch.no_grad():
        output = model(input_data)
        probabilities = torch.softmax(output, dim=1)
        conf_val, pred_val = torch.max(probabilities, dim=1)
    return pred_val.item(), conf_val.item() * 100

def prediction_plant2(image_path):
    image = Image.open(image_path)
    try:
        image = ImageOps.exif_transpose(image)
    except Exception:
        pass
    image = image.convert('RGB')
    image = image.resize((224, 224))
    input_data = TF.to_tensor(image)
    input_data = input_data.view((-1, 3, 224, 224)).to(device)
    with torch.no_grad():
        output = plant2_model(input_data)
        probabilities = torch.softmax(output, dim=1)
        conf_val, pred_val = torch.max(probabilities, dim=1)
    return pred_val.item(), conf_val.item() * 100

app = Flask(__name__, static_folder='static', static_url_path='/static')

try:
    from flask_cors import CORS
    CORS(app)
except Exception:
    pass

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

@app.route('/api/health', methods=['GET'])
def api_health():
    return jsonify({
        "status": "ok",
        "message": "Plant Disease AI Server running",
        "classes_count": len(disease_info),
        "plant2_available": plant2_model is not None,
        "plant2_classes_count": len(plant2_classes)
    })

@app.route('/api/models', methods=['GET'])
def api_models():
    models_list = [
        {
            "id": "unified",
            "name": "Unified Dual-Engine AI",
            "accuracy": "99.12%",
            "classes_count": len(disease_info) + len(plant2_classes),
            "is_default": True,
            "description": "Unified neural scanner analyzing across 26 plant species & 61 disease categories"
        }
    ]
    return jsonify(models_list)

@app.route('/api/diseases', methods=['GET'])
def api_diseases():
    result = []
    for idx, row in disease_info.iterrows():
        supp_row = supplement_info.iloc[idx] if idx < len(supplement_info) else None
        supp_name = str(supp_row['supplement name']) if supp_row is not None and pd.notna(supp_row['supplement name']) else None
        supp_img = str(supp_row['supplement image']) if supp_row is not None and pd.notna(supp_row['supplement image']) else None
        supp_buy = str(supp_row['buy link']) if supp_row is not None and pd.notna(supp_row['buy link']) else None
        
        disease_name = str(row['disease_name'])
        parts = disease_name.split(' : ') if ' : ' in disease_name else [disease_name, disease_name]
        crop = parts[0].strip() if len(parts) > 1 else 'General'
        condition = parts[1].strip() if len(parts) > 1 else disease_name
        is_healthy = 'healthy' in condition.lower()

        result.append({
            "id": int(row['index']),
            "disease_name": disease_name,
            "crop": crop,
            "condition": condition,
            "is_healthy": is_healthy,
            "description": str(row['description']),
            "prevent": str(row['Possible Steps']),
            "image_url": str(row['image_url']),
            "supplement": {
                "name": supp_name,
                "image": supp_img,
                "buy_link": supp_buy
            } if supp_name else None
        })
    return jsonify(result)

@app.route('/api/market', methods=['GET'])
def api_market():
    result = []
    for idx, row in supplement_info.iterrows():
        dis_name = str(disease_info['disease_name'][idx]) if idx < len(disease_info) else ""
        supp_name = str(row['supplement name']) if pd.notna(row['supplement name']) else ""
        supp_img = str(row['supplement image']) if pd.notna(row['supplement image']) else ""
        buy_link = str(row['buy link']) if pd.notna(row['buy link']) else ""
        
        if supp_name and supp_name != "nan":
            parts = dis_name.split(' : ') if ' : ' in dis_name else [dis_name, dis_name]
            crop = parts[0].strip() if len(parts) > 1 else 'General'
            result.append({
                "id": int(row['index']),
                "disease_name": dis_name,
                "crop": crop,
                "supplement_name": supp_name,
                "supplement_image": supp_img,
                "buy_link": buy_link
            })
    return jsonify(result)

def format_plant2_result(pred, confidence, user_image_url):
    class_str = plant2_classes[pred] if pred < len(plant2_classes) else "Unknown"
    parts = class_str.split(' - ')
    raw_crop = parts[0].strip()
    condition_status = parts[1].strip() if len(parts) > 1 else 'Analyzed'
    is_healthy = 'healthy' in condition_status.lower()

    clean_crop = raw_crop.split(' (')[0].strip() if ' (' in raw_crop else raw_crop
    title = f"{clean_crop} : {'Healthy Specimen' if is_healthy else 'Foliage Infection / Disease'}"

    if is_healthy:
        description = f"The {clean_crop} foliage demonstrates normal vegetative vigor, uniform chlorophyll distribution, and no pathogenic lesions or fungal spotting."
        prevent = f"1. Maintain regular balanced irrigation at the root base.\n2. Ensure proper spacing between canopies for airflow.\n3. Conduct periodic checks during high-humidity seasons."
        supplement = None
    else:
        description = f"Symptoms of pathological foliar stress detected on {clean_crop} leaf. Common infections include fungal leaf blight, bacterial leaf spot, or anthracnose causing chlorotic halos and necrotic lesions."
        prevent = f"1. Prune and safely dispose of severely spotted foliage.\n2. Apply broad-spectrum bio-fungicide or copper oxychloride spray early morning.\n3. Avoid overhead sprinkler irrigation to keep the foliage dry.\n4. Enrich soil with balanced micronutrients and organic compost to stimulate natural disease resistance."
        supplement = {
            "name": "Katyayani Copper Oxychloride 50% WP Broad Spectrum Fungicide",
            "image": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRfq9MLrPL9tFkuFbGb98fMGDdl67v4I2iDLYCVprdsdGaXURCl9UNEr8v_65X1hKrYF5NjSvB01HOGexg-3CJxjkVSu9zPNJ2AunP09vPa0gjEILskTILx&usqp=CAE",
            "buy_link": "https://agribegri.com/products/buy-copper-oxychloride-50-wp-fungicide-online.php"
        }

    return {
        "success": True,
        "engine_source": "Plant2 AI Engine (99.12% Accuracy)",
        "pred_id": int(pred),
        "confidence": round(float(confidence), 1),
        "title": title,
        "crop": clean_crop,
        "condition": 'Healthy Leaf' if is_healthy else 'Infection Detected',
        "is_healthy": is_healthy,
        "description": description,
        "prevent": prevent,
        "reference_image_url": user_image_url,
        "user_image_url": user_image_url,
        "supplement": supplement
    }

def format_plantvillage_result(pred, confidence, user_image_url):
    title = str(disease_info['disease_name'][pred])
    description = str(disease_info['description'][pred])
    prevent = str(disease_info['Possible Steps'][pred])
    image_url = str(disease_info['image_url'][pred])
    
    sname = str(supplement_info['supplement name'][pred]) if pd.notna(supplement_info['supplement name'][pred]) else None
    simage = str(supplement_info['supplement image'][pred]) if pd.notna(supplement_info['supplement image'][pred]) else None
    buy_link = str(supplement_info['buy link'][pred]) if pd.notna(supplement_info['buy link'][pred]) else None
    
    parts = title.split(' : ') if ' : ' in title else [title, title]
    crop = parts[0].strip() if len(parts) > 1 else 'General'
    condition = parts[1].strip() if len(parts) > 1 else title
    is_healthy = 'healthy' in condition.lower()

    return {
        "success": True,
        "engine_source": "PlantVillage AI Engine (98.4% Accuracy)",
        "pred_id": int(pred),
        "confidence": round(float(confidence), 1),
        "title": title,
        "crop": crop,
        "condition": condition,
        "is_healthy": is_healthy,
        "description": description,
        "prevent": prevent,
        "reference_image_url": image_url,
        "user_image_url": user_image_url,
        "supplement": {
            "name": sname,
            "image": simage,
            "buy_link": buy_link
        } if sname else None
    }

@app.route('/api/predict', methods=['POST'])
def api_predict():
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image file provided"}), 400
    
    image = request.files['image']
    if image.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
    
    filename = image.filename
    upload_dir = os.path.join(BASE_DIR, 'static', 'uploads')
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, filename)
    image.save(file_path)
    
    model_choice = request.form.get('model', 'unified').lower()
    
    try:
        user_image_url = url_for('static', filename='uploads/' + filename, _external=True)

        # Single Unified Mode (evaluates across both engines automatically)
        if model_choice in ['unified', 'auto', 'both', '']:
            p2_result = None
            p1_result = None

            if plant2_model is not None:
                p2_pred, p2_conf = prediction_plant2(file_path)
                p2_result = format_plant2_result(p2_pred, p2_conf, user_image_url)

            p1_pred, p1_conf = prediction(file_path)
            p1_result = format_plantvillage_result(p1_pred, p1_conf, user_image_url)

            # Compare confidence between both models to select best diagnosis
            if p2_result and (p2_result['confidence'] >= p1_result['confidence']):
                winner = p2_result
                runner_up = p1_result
            else:
                winner = p1_result
                runner_up = p2_result

            winner["model_used"] = f"Unified Dual-Engine AI ({winner['engine_source']})"
            if runner_up:
                winner["alternative"] = {
                    "crop": runner_up["crop"],
                    "condition": runner_up["condition"],
                    "confidence": runner_up["confidence"],
                    "engine": runner_up["engine_source"]
                }
            return jsonify(winner)

        elif model_choice == 'plant2' and plant2_model is not None:
            pred, confidence = prediction_plant2(file_path)
            res = format_plant2_result(pred, confidence, user_image_url)
            res["model_used"] = "Plant2 AI Model (99.12% Accuracy)"
            return jsonify(res)
        else:
            pred, confidence = prediction(file_path)
            res = format_plantvillage_result(pred, confidence, user_image_url)
            res["model_used"] = "PlantVillage AI Model (98.4% Accuracy)"
            return jsonify(res)

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/')
def home_page():
    react_dist = os.path.join(BASE_DIR, 'dist')
    if os.path.exists(os.path.join(react_dist, 'index.html')):
        return send_from_directory(react_dist, 'index.html')
    return render_template('home.html')

@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory(os.path.join(BASE_DIR, 'dist', 'assets'), path)

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
    app.run(debug=True, host='0.0.0.0', port=5000)

