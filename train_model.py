import os
import sys
import time
import argparse
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# Add Flask app directory to path to import CNN module
flask_app_dir = os.path.join(os.path.dirname(__file__), 'Flask Deployed App')
sys.path.append(flask_app_dir)
import CNN

# Ensure utf-8 output encoding on Windows consoles
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

def parse_args():
    parser = argparse.ArgumentParser(description="GPU-Accelerated Plant Disease Model Training Engine")
    parser.add_argument("--fast", action="store_true", help="Train on 10%% dataset subset for fast verification")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs (default: 5)")
    parser.add_argument("--batch-size", type=int, default=32, help="Batch size (default: 32, tuned for 4GB VRAM)")
    parser.add_argument("--lr", type=float, default=1e-4, help="Learning rate (default: 0.0001)")
    parser.add_argument("--workers", type=int, default=0, help="DataLoader workers (default: 0 for optimal Windows GPU throughput)")
    parser.add_argument("--save-path", type=str, default=os.path.join(flask_app_dir, "plant_disease_model_1_latest.pt"),
                        help="Path to save trained weights")
    return parser.parse_args()

def train_model():
    args = parse_args()

    print("=" * 65)
    print("      NVIDIA GPU PLANT DISEASE DETECTION TRAINING ENGINE        ")
    print("=" * 65)

    # 1. Strictly Enforce CUDA GPU
    if not torch.cuda.is_available():
        print("\n[!] FATAL ERROR: CUDA-compatible GPU is NOT available.")
        print("[!] Please verify NVIDIA graphics drivers and CUDA installation.")
        sys.exit(1)

    device = torch.device("cuda:0")
    torch.cuda.set_device(device)
    torch.backends.cudnn.benchmark = True

    gpu_name = torch.cuda.get_device_name(0)
    total_vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
    cuda_version = torch.version.cuda
    pytorch_version = torch.__version__

    print(f"[OK] Primary Compute Device : {device}")
    print(f"[OK] GPU Hardware Model     : {gpu_name}")
    print(f"[OK] Dedicated GPU VRAM     : {total_vram_gb:.2f} GB")
    print(f"[OK] PyTorch / CUDA Version : {pytorch_version} / CUDA {cuda_version}")
    print(f"[OK] Batch Size / Workers   : {args.batch_size} / {args.workers}")
    print("=" * 65, flush=True)

    # Dataset Paths
    base_dataset_dir = r"c:\Users\user\Desktop\plant\Plant-Disease-Detection\archive\New Plant Diseases Dataset(Augmented)\New Plant Diseases Dataset(Augmented)"
    train_dir = os.path.join(base_dataset_dir, "train")
    valid_dir = os.path.join(base_dataset_dir, "valid")
    model_save_path = args.save_path

    if not os.path.exists(train_dir):
        print(f"[!] Error: Training dataset directory not found at {train_dir}")
        sys.exit(1)

    # High-Performance Data Transforms
    # Note: Archive dataset is already pre-augmented. High-speed transforms keep GPU fed 100%.
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.ToTensor(),
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])

    print("\n[*] Loading dataset from archive folder...", flush=True)
    train_dataset = datasets.ImageFolder(train_dir, transform=train_transform)
    valid_dataset = datasets.ImageFolder(valid_dir, transform=val_transform)

    train_classes = train_dataset.classes
    valid_classes = valid_dataset.classes

    if args.fast:
        print("[!] FAST MODE ACTIVE: Subsampling 10% of dataset for rapid cycle...", flush=True)
        train_indices = list(range(0, len(train_dataset), 10))
        valid_indices = list(range(0, len(valid_dataset), 10))
        train_dataset = torch.utils.data.Subset(train_dataset, train_indices)
        valid_dataset = torch.utils.data.Subset(valid_dataset, valid_indices)

    train_loader = DataLoader(
        train_dataset,
        batch_size=args.batch_size,
        shuffle=True,
        num_workers=args.workers,
        pin_memory=True
    )
    valid_loader = DataLoader(
        valid_dataset,
        batch_size=args.batch_size,
        shuffle=False,
        num_workers=args.workers,
        pin_memory=True
    )

    print(f"[*] Total Training Images   : {len(train_dataset)} across {len(train_classes)} folders")
    print(f"[*] Total Validation Images : {len(valid_dataset)} across {len(valid_classes)} folders")
    print(f"[*] Total Steps per Epoch   : {len(train_loader)} batches", flush=True)

    # Initialize ResNet34 Backbone CNN (K=39 classes)
    print("\n[*] Initializing ResNet34 Neural Network onto GPU...", flush=True)
    model = CNN.CNN(K=39, pretrained=True).to(device)

    # Check for existing weights compatible with ResNet34
    if os.path.exists(model_save_path):
        try:
            model.load_state_dict(torch.load(model_save_path, map_location=device))
            print(f"[*] Resumed weights from existing checkpoint: {model_save_path}", flush=True)
        except Exception:
            print("[*] Starting fresh training with ImageNet pretrained ResNet34 backbone.", flush=True)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    epochs = args.epochs
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-6)

    # Map dataset folder indices (38 classes) to model output indices (39 classes, index 4 is Background_without_leaves)
    folder_to_model_idx = torch.tensor([i if i < 4 else i + 1 for i in range(len(train_classes))], device=device)

    best_acc = 0.0

    print("\n" + "=" * 65)
    print("           GPU HIGH-THROUGHPUT TRAINING PIPELINE STARTED         ")
    print("=" * 65 + "\n", flush=True)

    for epoch in range(epochs):
        epoch_start = time.time()
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        step_t0 = time.time()

        for batch_idx, (images, labels) in enumerate(train_loader):
            # Direct non-blocking GPU memory copy
            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)
            remapped_labels = folder_to_model_idx[labels]

            optimizer.zero_grad(set_to_none=True)
            outputs = model(images)
            loss = criterion(outputs, remapped_labels)
            loss.backward()
            optimizer.step()

            batch_size_cur = images.size(0)
            running_loss += loss.item() * batch_size_cur
            _, preds = torch.max(outputs, 1)
            correct_train += (preds == remapped_labels).sum().item()
            total_train += batch_size_cur

            # Telemetry every 25 steps or last step
            if (batch_idx + 1) % 25 == 0 or (batch_idx + 1) == len(train_loader):
                elapsed_step = time.time() - step_t0
                img_per_sec = (25 * batch_size_cur) / max(elapsed_step, 1e-4)
                step_t0 = time.time()
                cur_acc = (correct_train / total_train) * 100
                vram_used_mb = torch.cuda.memory_allocated(device) / (1024 ** 2)
                vram_res_mb = torch.cuda.memory_reserved(device) / (1024 ** 2)

                print(
                    f"Epoch [{epoch+1:02d}/{epochs:02d}] "
                    f"Step [{batch_idx+1:04d}/{len(train_loader):04d}] | "
                    f"Loss: {loss.item():.4f} | "
                    f"Train Acc: {cur_acc:6.2f}% | "
                    f"GPU VRAM: {vram_used_mb:.0f}MB (Alloc) / {vram_res_mb:.0f}MB (Res) | "
                    f"Speed: {img_per_sec:5.1f} img/s",
                    flush=True
                )

            # Checkpoint backup every 500 batches
            if (batch_idx + 1) % 500 == 0:
                torch.save(model.state_dict(), model_save_path)

        train_loss = running_loss / total_train
        train_acc = (correct_train / total_train) * 100

        # GPU Validation Phase
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in valid_loader:
                images = images.to(device, non_blocking=True)
                labels = labels.to(device, non_blocking=True)
                remapped_labels = folder_to_model_idx[labels]

                outputs = model(images)
                loss = criterion(outputs, remapped_labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                correct_val += (preds == remapped_labels).sum().item()
                total_val += images.size(0)

        val_loss = val_loss / total_val
        val_acc = (correct_val / total_val) * 100
        epoch_time = time.time() - epoch_start

        scheduler.step()

        print("\n" + "-" * 65)
        print(f"  EPOCH {epoch+1}/{epochs} SUMMARY  (Completed in {epoch_time:.1f}s / {epoch_time/60:.2f} min)")
        print(f"  Train Loss: {train_loss:.4f}  |  Train Accuracy: {train_acc:.2f}%")
        print(f"  Val Loss:   {val_loss:.4f}  |  Val Accuracy:   {val_acc:.2f}%")
        print("-" * 65)

        if val_acc > best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), model_save_path)
            print(f"  [+] NEW BEST MODEL SAVED! Val Accuracy: {val_acc:.2f}% -> {model_save_path}\n", flush=True)
        else:
            torch.save(model.state_dict(), model_save_path)
            print(f"  [OK] Checkpoint saved -> {model_save_path}\n", flush=True)

    print("=" * 65)
    print(f"  GPU TRAINING FINISHED! Best Val Accuracy: {best_acc:.2f}%")
    print(f"  Final model saved to: {model_save_path}")
    print("=" * 65)

if __name__ == '__main__':
    train_model()
