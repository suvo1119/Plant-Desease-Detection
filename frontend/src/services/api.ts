export interface SupplementInfo {
  name: string;
  image: string;
  buy_link: string;
}

export interface DiseasePrediction {
  success: boolean;
  model_used?: string;
  engine_source?: string;
  pred_id: number;
  confidence: number;
  title: string;
  crop: string;
  condition: string;
  is_healthy: boolean;
  description: string;
  prevent: string;
  reference_image_url: string;
  user_image_url: string;
  supplement: SupplementInfo | null;
  alternative?: {
    crop: string;
    condition: string;
    confidence: number;
    engine: string;
  };
  error?: string;
}

export interface AIModelOption {
  id: string;
  name: string;
  accuracy: string;
  classes_count: number;
  is_default: boolean;
  description: string;
}

export interface DiseaseItem {
  id: number;
  disease_name: string;
  crop: string;
  condition: string;
  is_healthy: boolean;
  description: string;
  prevent: string;
  image_url: string;
  supplement: SupplementInfo | null;
}

export interface MarketSupplement {
  id: number;
  disease_name: string;
  crop: string;
  supplement_name: string;
  supplement_image: string;
  buy_link: string;
}

const API_BASE = '/api';

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    return data.status === 'ok';
  } catch (err) {
    console.warn('API health check failed:', err);
    return false;
  }
}

export async function fetchAvailableModels(): Promise<AIModelOption[]> {
  try {
    const res = await fetch(`${API_BASE}/models`);
    if (!res.ok) throw new Error('Failed to fetch models');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching models:', err);
    return [
      {
        id: 'plant2',
        name: 'Plant2 AI Model',
        accuracy: '99.12%',
        classes_count: 22,
        is_default: true,
        description: 'Mango, Lemon, Pomegranate, Guava, Jamun, Basil, Arjun, Bael, Chinar, Jatropha, Pongamia, Alstonia'
      },
      {
        id: 'plant1',
        name: 'PlantVillage AI Model',
        accuracy: '98.40%',
        classes_count: 39,
        is_default: false,
        description: 'Apple, Tomato, Corn, Grape, Potato, Strawberry, Peach, Cherry, Pepper Bell, Soybean, Squash'
      }
    ];
  }
}

export async function fetchAllDiseases(): Promise<DiseaseItem[]> {
  try {
    const res = await fetch(`${API_BASE}/diseases`);
    if (!res.ok) throw new Error('Failed to fetch diseases');
    return await res.json();
  } catch (err) {
    console.error('Error fetching diseases:', err);
    return [];
  }
}

export async function fetchMarketSupplements(): Promise<MarketSupplement[]> {
  try {
    const res = await fetch(`${API_BASE}/market`);
    if (!res.ok) throw new Error('Failed to fetch market supplements');
    return await res.json();
  } catch (err) {
    console.error('Error fetching market:', err);
    return [];
  }
}

export async function predictDisease(file: File, modelType: string = 'unified'): Promise<DiseasePrediction> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('model', modelType);

  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Server prediction failed' }));
    throw new Error(errorData.error || `HTTP ${res.status}: Server error`);
  }

  return await res.json();
}

