import os
import sys
import time
import json
import random
import argparse
from collections import defaultdict

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
from PIL import Image

# Add Flask app directory to path to import CNN module
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
flask_app_dir = os.path.join(BASE_DIR, 'Flask Deployed App')
sys.path.append(flask_app_dir)
import CNN

# Ensure utf-8 output encoding on Windows consoles
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass


class LeafDataset(Dataset):
    """
    Robust PyTorch Dataset for loading leaf image samples with transforms.
    """
    def __init__(self, samples, transform=None):
        self.samples = samples  # List of tuples: (image_path, class_idx)
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, target = self.samples[idx]
        try:
            with Image.open(path) as img:
                img = img.convert('RGB')
        except Exception as e:
            # Fallback if image has minor header glitch
            img = Image.new('RGB', (224, 224), color=(0, 100, 0))

        if self.transform:
            img = self.transform(img)

        return img, target


def discover_plant2_data(data_root):
    """
    Scans the plant2 dataset structure: <Plant Species>/<diseased|healthy>/<image.jpg>
    Returns:
        samples_by_class: dict mapping class_name -> list of image file paths
        classes: sorted list of all unique class names
    """
    # If the user passed the parent plant2 folder, drill down to the actual dataset directory
    if os.path.isdir(data_root):
        inner_subdirs = [d for d in os.listdir(data_root) if os.path.isdir(os.path.join(data_root, d))]
        # Check if there's an inner folder (e.g. 'A Database of Leaf Images...')
        for d in inner_subdirs:
            test_path = os.path.join(data_root, d)
            nested = [sub for sub in os.listdir(test_path) if os.path.isdir(os.path.join(test_path, sub))]
            if any(os.path.isdir(os.path.join(test_path, sub, 'diseased')) or os.path.isdir(os.path.join(test_path, sub, 'healthy')) for sub in nested):
                data_root = test_path
                break

    valid_exts = ('.jpg', '.jpeg', '.png', '.bmp', '.JPG', '.JPEG', '.PNG')
    samples_by_class = defaultdict(list)

    for plant_name in sorted(os.listdir(data_root)):
        plant_path = os.path.join(data_root, plant_name)
        if not os.path.isdir(plant_path):
            continue

        for condition in ('diseased', 'healthy'):
            cond_path = os.path.join(plant_path, condition)
            if os.path.isdir(cond_path):
                # Clean class label: e.g. "Mango (P0) - diseased"
                class_label = f"{plant_name} - {condition}"
                for file_name in os.listdir(cond_path):
                    if file_name.endswith(valid_exts):
                        samples_by_class[class_label].append(os.path.join(cond_path, file_name))

    classes = sorted(list(samples_by_class.keys()))
    return samples_by_class, classes, data_root


def parse_args():
    default_plant2_dir = os.path.join(
        BASE_DIR,
        "plant2",
        "A Database of Leaf Images Practice towards Plant Conservation with Plant Pathology"
    )
    # Fallback to general plant2 folder if full path differs
    if not os.path.exists(default_plant2_dir):
        default_plant2_dir = os.path.join(BASE_DIR, "plant2")

    default_save_path = os.path.join(flask_app_dir, "plant2_disease_model.pt")

    parser = argparse.ArgumentParser(
        description="NVIDIA GPU Plant Disease Model Training Engine (Optimized for plant2 Dataset)"
    )
    parser.add_argument(
        "--data-dir",
        type=str,
        default=default_plant2_dir,
        help=f"Path to plant2 dataset directory (default: {default_plant2_dir})"
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=10,
        help="Number of training epochs (default: 10)"
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=32,
        help="Batch size (default: 32, tuned for 4GB VRAM like GTX 1650)"
    )
    parser.add_argument(
        "--lr",
        type=float,
        default=1e-4,
        help="Initial learning rate for AdamW (default: 0.0001)"
    )
    parser.add_argument(
        "--val-split",
        type=float,
        default=0.20,
        help="Validation split ratio (default: 0.20 for 80/20 train/val)"
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=0,
        help="DataLoader worker processes (default: 0 for optimal Windows GPU throughput)"
    )
    parser.add_argument(
        "--fast",
        action="store_true",
        help="Train on 10%% subsample for a quick 1-minute test cycle"
    )
    parser.add_argument(
        "--save-path",
        type=str,
        default=default_save_path,
        help=f"Path to save model weights (default: {default_save_path})"
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for deterministic train/val split (default: 42)"
    )
    return parser.parse_args()


def train_model():
    args = parse_args()

    print("\n" + "=" * 70)
    print("      NVIDIA GPU PLANT2 DISEASE DETECTION TRAINING ENGINE        ")
    print("=" * 70)

    # 1. Hardware & Compute Device Configuration
    if torch.cuda.is_available():
        device = torch.device("cuda:0")
        torch.cuda.set_device(device)
        torch.backends.cudnn.benchmark = True
        gpu_name = torch.cuda.get_device_name(0)
        total_vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
        cuda_version = torch.version.cuda
        print(f"[OK] Primary Device         : {device} ({gpu_name})")
        print(f"[OK] Dedicated GPU VRAM     : {total_vram_gb:.2f} GB")
        print(f"[OK] CUDA Version           : {cuda_version}")
    else:
        device = torch.device("cpu")
        print("[!] Warning: CUDA GPU not detected. Falling back to CPU training.")

    print(f"[OK] PyTorch Version        : {torch.__version__}")
    print(f"[OK] Training Epochs        : {args.epochs}")
    print(f"[OK] Batch Size             : {args.batch_size}")
    print(f"[OK] Initial Learning Rate  : {args.lr}")
    print(f"[OK] Model Save Path        : {args.save_path}")
    print("=" * 70, flush=True)

    # 2. Discover and Inspect Dataset
    print(f"\n[*] Scanning dataset directory: {args.data_dir} ...", flush=True)
    if not os.path.exists(args.data_dir):
        print(f"[!] Error: Dataset folder does not exist at: {args.data_dir}")
        sys.exit(1)

    samples_by_class, classes, resolved_data_root = discover_plant2_data(args.data_dir)
    num_classes = len(classes)

    if num_classes == 0:
        print("[!] Error: No valid image classes discovered in dataset directory.")
        sys.exit(1)

    total_images = sum(len(v) for v in samples_by_class.values())
    print(f"[OK] Discovered {num_classes} plant pathology classes across {total_images} total images:")
    for idx, c in enumerate(classes):
        print(f"     [{idx:02d}] {c} ({len(samples_by_class[c])} images)")

    # Save class mapping to JSON for inference reference
    class_mapping_path = os.path.join(flask_app_dir, "plant2_classes.json")
    mapping_data = {
        "num_classes": num_classes,
        "classes": classes,
        "idx_to_class": {str(i): c for i, c in enumerate(classes)},
        "class_to_idx": {c: i for i, c in enumerate(classes)}
    }
    with open(class_mapping_path, "w", encoding="utf-8") as f:
        json.dump(mapping_data, f, indent=2)
    print(f"[OK] Exported class mapping metadata -> {class_mapping_path}")

    # 3. Stratified Train / Validation Split
    random.seed(args.seed)
    train_samples = []
    val_samples = []

    for class_idx, class_name in enumerate(classes):
        img_paths = list(samples_by_class[class_name])
        random.shuffle(img_paths)

        split_idx = int(len(img_paths) * (1.0 - args.val_split))
        train_paths = img_paths[:split_idx]
        val_paths = img_paths[split_idx:]

        for p in train_paths:
            train_samples.append((p, class_idx))
        for p in val_paths:
            val_samples.append((p, class_idx))

    # Fast Mode: Subsample 10%
    if args.fast:
        print("\n[!] FAST MODE ACTIVE: Subsampling 10% of samples for rapid verification...", flush=True)
        train_samples = train_samples[::10]
        val_samples = val_samples[::10]

    print(f"\n[*] Training Set Images     : {len(train_samples)}")
    print(f"[*] Validation Set Images   : {len(val_samples)}")

    # 4. Data Augmentation Transforms
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15),
        transforms.ToTensor(),
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])

    train_dataset = LeafDataset(train_samples, transform=train_transform)
    val_dataset = LeafDataset(val_samples, transform=val_transform)

    train_loader = DataLoader(
        train_dataset,
        batch_size=args.batch_size,
        shuffle=True,
        num_workers=args.workers,
        pin_memory=torch.cuda.is_available()
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=args.batch_size,
        shuffle=False,
        num_workers=args.workers,
        pin_memory=torch.cuda.is_available()
    )

    print(f"[*] Batches per Epoch       : {len(train_loader)} training / {len(val_loader)} validation", flush=True)

    # 5. Initialize ResNet34 Model
    print(f"\n[*] Initializing ResNet34 Architecture with K={num_classes} output neurons...", flush=True)
    model = CNN.CNN(K=num_classes, pretrained=True).to(device)

    # Check for existing checkpoint weights compatible with this class count
    if os.path.exists(args.save_path):
        try:
            state_dict = torch.load(args.save_path, map_location=device)
            # Check for corrupted NaN weights
            if any(torch.isnan(v).any() for v in state_dict.values()):
                print(f"[*] Existing checkpoint had NaN values. Starting fresh training with ImageNet weights.", flush=True)
            else:
                model.load_state_dict(state_dict)
                print(f"[OK] Loaded existing weights checkpoint from: {args.save_path}", flush=True)
        except Exception:
            print(f"[*] Starting fresh training (checkpoint class dimensions differ or not found).", flush=True)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    epochs = args.epochs
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-6)

    best_acc = 0.0

    print("\n" + "=" * 70)
    print("           TRAINING PIPELINE STARTED (Press Ctrl+C to stop)      ")
    print("=" * 70 + "\n", flush=True)

    try:
        for epoch in range(epochs):
            epoch_start = time.time()
            model.train()
            running_loss = 0.0
            correct_train = 0
            total_train = 0

            step_t0 = time.time()

            for batch_idx, (images, labels) in enumerate(train_loader):
                images = images.to(device, non_blocking=True)
                labels = labels.to(device, non_blocking=True)

                optimizer.zero_grad(set_to_none=True)

                outputs = model(images)
                loss = criterion(outputs, labels)

                loss.backward()
                # Gradient clipping prevents gradient explosion and NaNs
                torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                optimizer.step()

                batch_size_cur = images.size(0)
                running_loss += loss.item() * batch_size_cur
                _, preds = torch.max(outputs, 1)
                correct_train += (preds == labels).sum().item()
                total_train += batch_size_cur

                # Progress report every 15 batches or at end of epoch
                if (batch_idx + 1) % 15 == 0 or (batch_idx + 1) == len(train_loader):
                    elapsed_step = time.time() - step_t0
                    img_per_sec = (15 * batch_size_cur) / max(elapsed_step, 1e-4)
                    step_t0 = time.time()
                    cur_acc = (correct_train / total_train) * 100

                    vram_info = ""
                    if torch.cuda.is_available():
                        vram_alloc = torch.cuda.memory_allocated(device) / (1024 ** 2)
                        vram_res = torch.cuda.memory_reserved(device) / (1024 ** 2)
                        vram_info = f" | VRAM: {vram_alloc:.0f}MB / {vram_res:.0f}MB"

                    print(
                        f"Epoch [{epoch+1:02d}/{epochs:02d}] "
                        f"Step [{batch_idx+1:03d}/{len(train_loader):03d}] | "
                        f"Loss: {loss.item():.4f} | "
                        f"Train Acc: {cur_acc:5.2f}%"
                        f"{vram_info} | "
                        f"Speed: {img_per_sec:4.1f} img/s",
                        flush=True
                    )

            train_loss = running_loss / max(total_train, 1)
            train_acc = (correct_train / max(total_train, 1)) * 100

            # Validation Phase
            model.eval()
            val_loss = 0.0
            correct_val = 0
            total_val = 0

            with torch.no_grad():
                for images, labels in val_loader:
                    images = images.to(device, non_blocking=True)
                    labels = labels.to(device, non_blocking=True)

                    outputs = model(images)
                    loss = criterion(outputs, labels)

                    val_loss += loss.item() * images.size(0)
                    _, preds = torch.max(outputs, 1)
                    correct_val += (preds == labels).sum().item()
                    total_val += images.size(0)

            val_loss = val_loss / max(total_val, 1)
            val_acc = (correct_val / max(total_val, 1)) * 100
            epoch_time = time.time() - epoch_start

            scheduler.step()

            print("\n" + "-" * 70)
            print(f"  EPOCH {epoch+1:02d}/{epochs:02d} COMPLETED  (Duration: {epoch_time:.1f}s / {epoch_time/60:.2f} min)")
            print(f"  Training   Loss: {train_loss:.4f}  |  Training Accuracy:   {train_acc:6.2f}%")
            print(f"  Validation Loss: {val_loss:.4f}  |  Validation Accuracy: {val_acc:6.2f}%")
            print("-" * 70)

            if val_acc > best_acc:
                best_acc = val_acc
                torch.save(model.state_dict(), args.save_path)
                print(f"  [+] NEW BEST ACCURACY: {val_acc:.2f}%! Weights saved -> {args.save_path}\n", flush=True)
            else:
                torch.save(model.state_dict(), args.save_path)
                print(f"  [OK] Model checkpoint saved -> {args.save_path}\n", flush=True)

    except KeyboardInterrupt:
        print("\n[!] Training paused by user (Ctrl+C). Current checkpoint is preserved.", flush=True)

    print("=" * 70)
    print(f"  TRAINING SESSION COMPLETE! Best Validation Accuracy: {best_acc:.2f}%")
    print(f"  Weights saved at: {args.save_path}")
    print(f"  Class labels at:  {class_mapping_path}")
    print("=" * 70 + "\n")


if __name__ == '__main__':
    train_model()
