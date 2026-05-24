export const readImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const resizeImage = (img, scale, format, quality) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(`image/${format}`, quality);
};

export const downloadDataUrl = (dataUrl, filename) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const compressToTargetSize = async (img, targetKB, format) => {
  let minQ = 0.0;
  let maxQ = 1.0;
  let bestDataUrl = null;
  let currentQ = 0.9;
  
  const targetBytes = targetKB * 1024;
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 8; i++) { // Max 8 iterations for binary search
    const dataUrl = canvas.toDataURL(`image/${format}`, currentQ);
    // Rough estimate of base64 size to bytes
    const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
    
    bestDataUrl = dataUrl;
    
    if (sizeInBytes > targetBytes) {
      maxQ = currentQ;
    } else {
      minQ = currentQ;
    }
    currentQ = (minQ + maxQ) / 2;
    
    // Break early if we hit exactly within 5% below target
    if (sizeInBytes <= targetBytes && sizeInBytes > targetBytes * 0.95) {
      break;
    }
  }
  
  return bestDataUrl;
};
