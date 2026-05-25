import { useState, useRef } from 'react';
import { readImageFile, resizeImage, compressToTargetSize, downloadDataUrl } from '../utils/fileHelpers';
import './ImageResizer.css';

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('jpeg');
  const [mode, setMode] = useState('scale'); // 'scale' or 'target'
  const [scale, setScale] = useState(0.5);
  const [quality, setQuality] = useState(0.8);
  const [targetKB, setTargetKB] = useState(500);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.type.startsWith('image/')) {
        alert("Security: Invalid file type. Please drop a valid image file.");
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // Add a slight delay to allow UI to update to 'Processing...'
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const img = await readImageFile(file);
      let dataUrl;
      
      if (mode === 'target' && (format === 'jpeg' || format === 'webp')) {
        dataUrl = await compressToTargetSize(img, targetKB, format);
      } else {
        dataUrl = resizeImage(img, scale, format, quality);
      }
      
      downloadDataUrl(dataUrl, `suites-${file.name.split('.')[0]}.${format}`);
    } catch (err) {
      console.error("Error processing image:", err);
      alert("Failed to process image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card image-resizer">
      <h2>Image Resizer</h2>
      <p className="subtitle">Resize and compress images entirely offline.</p>
      
      {!file ? (
        <div 
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            accept="image/*" 
            hidden 
            ref={fileInputRef} 
            onChange={(e) => setFile(e.target.files[0])} 
          />
          <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p>Drag & Drop an image here or click to select</p>
        </div>
      ) : (
        <div className="workspace">
          <div className="file-info">
            <strong>Selected:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
          
          <div className="controls">
            <div className="control-group">
              <label>Output Format:</label>
              <select className="dropdown" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>

            <div className="control-group">
              <label>Mode:</label>
              <select className="dropdown" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="scale">Standard Scale</option>
                <option value="target" disabled={format === 'png'}>Target File Size (KB)</option>
              </select>
            </div>
            
            {mode === 'scale' ? (
              <>
                <div className="control-group">
                  <label>Scale dimension:</label>
                  <select className="dropdown" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))}>
                    <option value={0.25}>25%</option>
                    <option value={0.5}>50%</option>
                    <option value={0.75}>75%</option>
                    <option value={1}>100%</option>
                  </select>
                </div>
                
                {format === 'jpeg' && (
                  <div className="control-group">
                    <label>Quality:</label>
                    <select className="dropdown" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))}>
                      <option value={0.3}>Low (30%)</option>
                      <option value={0.6}>Medium (60%)</option>
                      <option value={0.8}>High (80%)</option>
                      <option value={1.0}>Max (100%)</option>
                    </select>
                  </div>
                )}
              </>
            ) : (
              <div className="control-group">
                <label>Target Size (KB):</label>
                <input 
                  type="number" 
                  className="dropdown" 
                  value={targetKB} 
                  onChange={(e) => setTargetKB(parseInt(e.target.value) || 500)}
                  min="10"
                />
              </div>
            )}
          </div>
          
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => setFile(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleProcess} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Resize & Download'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
