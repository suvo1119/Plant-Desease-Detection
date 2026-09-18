# 🌟 Model Architecture & Evaluation

The plant disease detection model uses a **ResNet-34** deep convolutional neural network initialized with ImageNet pre-trained weights and fine-tuned for 38 plant disease and healthy leaf classes (plus background class).

---

## 📊 Performance Metrics

- **Validation Accuracy**: **99.89%**
- **Validation Loss**: **0.0041**
- **Training Accuracy**: **99.91%**
- **Training Loss**: **0.0036**
- **Dataset**: PlantVillage Augmented Dataset (70,295 training / 17,572 validation images)
- **Model Checkpoint**: Saved as `plant_disease_model_1_latest.pt` in `Flask Deployed App/`

---

## ⚙️ Architecture Details

- **Backbone**: ResNet-34 (`torchvision.models.resnet34`)
- **Input Dimensions**: `(3, 224, 224)`
- **Normalization**: ImageNet Mean `[0.485, 0.456, 0.406]`, Std `[0.229, 0.224, 0.225]`
- **Head**:
  - Dropout (`p=0.3`)
  - Linear classifier (`512 -> 39` classes)
- **Loss Function**: Cross-Entropy Loss
- **Optimizer**: AdamW (`lr=1e-4`, weight decay `1e-4`) with Cosine Annealing scheduler
