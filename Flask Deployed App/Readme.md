# 🌿 PlantCare AI - Web Application

This directory contains the Flask web application for real-time plant disease detection using Deep Learning.

---

### Prerequisites
- Python 3.8 or higher
- Dependencies installed via:
  ```bash
  pip install -r ../requirements.txt
  ```
- Pretrained model weights: `plant_disease_model_1_latest.pt` (located in this folder).

---

### Running the App
From this directory, execute:
```bash
python app.py
```
Open your web browser and navigate to: **`http://127.0.0.1:5000`**

---

### Model Information
- **Architecture**: ResNet-34 (Transfer Learning)
- **Model File**: `plant_disease_model_1_latest.pt`
- **Output Classes**: 39 classes (38 plant conditions + background)
- **Validation Accuracy**: 99.89%
