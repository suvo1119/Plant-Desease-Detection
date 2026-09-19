# 🌿 FloraVision AI — Flask Web Application Backend

This directory contains the Python Flask server for real-time plant disease detection using PyTorch Deep Learning models.

---

## ⚡ Prerequisites

- **Python**: Version 3.8 or higher
- **Dependencies**: Install required packages via root requirements:
  ```bash
  pip install -r ../requirements.txt
  ```
- **Model Weights**: `plant_disease_model_1_latest.pt` (included in this folder).

---

## 🚀 Running the Server

From this directory (`Flask Deployed App/`), execute:

```bash
python app.py
```

Open your web browser and navigate to: **`http://127.0.0.1:5000`**

---

## 🔬 Model Specifications

| Attribute | Detail |
| :--- | :--- |
| **Model Architecture** | ResNet-34 (Transfer Learning from ImageNet) |
| **Model File** | `plant_disease_model_1_latest.pt` |
| **Classes** | 39 Output Classes (38 Crop Diseases + Healthy Conditions + Background) |
| **Validation Accuracy** | **99.89%** |
| **Validation Loss** | **0.0041** |
| **Secondary Model** | `plant2_disease_model.pt` (22 Classes, 99.12% Accuracy) |

---

## 👨‍💻 Developer & Contact

**Suvadip Mondal**  
*Machine Learning & Artificial Intelligence Developer*

- 🌐 **GitHub**: [github.com/suvo1119](https://github.com/suvo1119)
- 💼 **LinkedIn**: [linkedin.com/in/suvadip-mondal-sm](https://www.linkedin.com/in/suvadip-mondal-sm/)
- 📧 **Email**: [suvadipmondal614@gmail.com](mailto:suvadipmondal614@gmail.com)
