import { PRODUCTS as DEFAULT_PRODUCTS } from './tuftlyConfig';

const STORAGE_KEY = 'tuftly_catalog_products_v1';
const AUTH_SESSION_KEY = 'tuftly_admin_unlocked_v1';

export const CATEGORY_LABELS = {
  rugs: 'Sculptural Rug',
  'wall-art': 'Gallery Wall Art',
  handbags: "Women's Handbag",
};

export function loadCatalogProducts() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Fallback to default starter catalog if storage is unavailable or corrupted
  }
  return DEFAULT_PRODUCTS;
}

export function saveCatalogProducts(products) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        'Browser storage is full (too many large photos). Try using a smaller photo or an image URL.',
      details: err,
    };
  }
}

export function resetCatalogProducts() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return DEFAULT_PRODUCTS;
}

export function isAdminSessionUnlocked() {
  try {
    return window.sessionStorage.getItem(AUTH_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function setAdminSessionUnlocked(unlocked) {
  try {
    if (unlocked) {
      window.sessionStorage.setItem(AUTH_SESSION_KEY, '1');
    } else {
      window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    }
  } catch {
    // ignore
  }
}

/**
 * Compresses an uploaded image file client-side to a crisp JPEG data URL
 * so real studio photos load fast and fit comfortably in localStorage.
 */
export function compressImageFile(file, maxDimension = 960, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported or corrupted image file.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
