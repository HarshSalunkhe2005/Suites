import { useState, useRef } from 'react';
import { readImageFile, resizeImage, downloadDataUrl } from '../utils/fileHelpers';
import './ImageResizer.css';

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState('jpeg');
  const [quality, setQuality] = useState(0.9);
  
  const fileInputRef = useRef(null);

  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.type.startsWith('image/')) {
        alert("Security: Invalid file type. Please drop a valid image file.");
        return;
      }
      loadFile(droppedFile);
    }
  };

  const loadFile = async (selectedFile) => {
    setIsLoading(true);
    try {
      // Just verifying it can be read as an image
      await readImageFile(selectedFile);
      setFile(selectedFile);
      
      // Auto-suggest target format based on detection
      if (selectedFile.type === 'image/jpeg') setTargetFormat('png');
      else setTargetFormat('jpeg');
      
    } catch (err) {
      console.error(err);
      alert("Failed to load image. Ensure it's a valid image file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // UI update delay
      const img = await readImageFile(file);
      // use scale 1 to keep original dimensions, convert format
      // Map format string to correct mime type for canvas
      const mimeType = targetFormat === 'jpg' ? 'jpeg' : targetFormat;
      const dataUrl = resizeImage(img, 1, mimeType, quality);
      
      downloadDataUrl(dataUrl, `suites-converted-${file.name.split('.')[0]}.${targetFormat}`);
    } catch (err) {
      console.error(err);
      alert("Failed to convert image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getSourceFormatName = (mimeType) => {
    if (!mimeType) return 'Unknown';
    return mimeType.split('/')[1].toUpperCase();
  };

  return (
    <div className="card image-resizer">
      <h2>Convert Image</h2>
      <p className="subtitle">Convert WEBP, PNG, JPG, or GIF to your desired format locally.</p>
      
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
          <div className="file-info" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <strong>Selected:</strong> {file.name} 
            <span style={{ marginLeft: '10px', padding: '4px 8px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
              Detected: {getSourceFormatName(file.type)}
            </span>
          </div>
          
          <div className="controls">
            <div className="control-group">
              <label>Convert To:</label>
              <select className="dropdown" value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
                <option value="jpg">JPG</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
            
            {(targetFormat === 'jpg' || targetFormat === 'jpeg' || targetFormat === 'webp') && (
              <div className="control-group">
                <label>Quality:</label>
                <select className="dropdown" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))}>
                  <option value={0.6}>Standard (60%)</option>
                  <option value={0.8}>High (80%)</option>
                  <option value={0.9}>Very High (90%)</option>
                  <option value={1.0}>Maximum (100%)</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => setFile(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleProcess} disabled={isProcessing}>
              {isProcessing ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
