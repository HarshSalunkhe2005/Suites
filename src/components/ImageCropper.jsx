import { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { readImageFile, downloadDataUrl } from '../utils/fileHelpers';
import './ImageResizer.css';

export default function ImageCropper() {
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const loadFile = async (selectedFile) => {
    setIsLoading(true);
    try {
      const img = await readImageFile(selectedFile);
      setImgSrc(img.src);
      setFile(selectedFile); // Set file only after image is loaded
    } catch (err) {
      console.error(err);
      alert("Failed to load image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = () => {
    if (!completedCrop || !imgRef.current) return;
    
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    const format = file.type === 'image/png' ? 'png' : 'jpeg';
    const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
    downloadDataUrl(dataUrl, `suites-cropped-${file.name}`);
  };

  return (
    <div className="card image-resizer">
      <h2>Crop Image</h2>
      <p className="subtitle">Visually crop your images. 100% offline.</p>
      
      {!file ? (
        <div 
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current.click()}
        >
          <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={(e) => loadFile(e.target.files[0])} />
          <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          <p>{isLoading ? 'Loading Image...' : 'Drag & Drop an image here or click to select'}</p>
        </div>
      ) : (
        <div className="workspace">
          <div className="file-info">
            <strong>Selected:</strong> {file.name}
          </div>
          
          <div className="crop-container" style={{ textAlign: 'center', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
            {imgSrc && (
              <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)}>
                <img 
                  ref={imgRef} 
                  src={imgSrc} 
                  style={{ maxWidth: '100%', maxHeight: '60vh', display: 'block', margin: '0 auto' }} 
                  alt="Crop preview" 
                />
              </ReactCrop>
            )}
          </div>
          
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => setFile(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleProcess}>Crop & Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
