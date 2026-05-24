import { useState, useRef, useEffect } from 'react';
import { readImageFile, downloadDataUrl } from '../utils/fileHelpers';
import './ImageResizer.css';

export default function ImageWatermark() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('© Suites');
  const [color, setColor] = useState('#FFFFFF');
  const [position, setPosition] = useState('bottom-right');
  const [opacity, setOpacity] = useState(0.8);
  const [previewData, setPreviewData] = useState('');
  
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

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
      imgRef.current = img;
      setFile(selectedFile);
      updatePreview();
    } catch (err) {
      console.error(err);
      alert("Failed to load image");
    } finally {
      setIsLoading(false);
    }
  };

  const applyWatermark = (canvas, ctx, img) => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const fontSize = Math.max(img.width * 0.05, 20); // 5% of width or at least 20px
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;

    // Add slight shadow for readability
    ctx.shadowColor = "black";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const padding = fontSize;

    let x, y;
    if (position === 'bottom-right') {
      x = img.width - textWidth - padding;
      y = img.height - padding;
    } else if (position === 'bottom-left') {
      x = padding;
      y = img.height - padding;
    } else if (position === 'top-right') {
      x = img.width - textWidth - padding;
      y = padding + fontSize;
    } else if (position === 'top-left') {
      x = padding;
      y = padding + fontSize;
    } else { // center
      x = (img.width - textWidth) / 2;
      y = img.height / 2 + fontSize / 2;
    }

    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1.0;
    ctx.shadowColor = "transparent";
  };

  const updatePreview = () => {
    if (!imgRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    applyWatermark(canvas, ctx, imgRef.current);
    // Keep preview small
    const previewCanvas = document.createElement('canvas');
    const scale = Math.min(800 / canvas.width, 1);
    previewCanvas.width = canvas.width * scale;
    previewCanvas.height = canvas.height * scale;
    const pCtx = previewCanvas.getContext('2d');
    pCtx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);
    setPreviewData(previewCanvas.toDataURL());
  };

  useEffect(() => {
    updatePreview();
  }, [text, color, position, opacity]);

  const handleProcess = () => {
    if (!imgRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    applyWatermark(canvas, ctx, imgRef.current);
    
    const format = file.type === 'image/png' ? 'png' : 'jpeg';
    downloadDataUrl(canvas.toDataURL(`image/${format}`, 1.0), `suites-watermark-${file.name}`);
  };

  return (
    <div className="card image-resizer">
      <h2>Watermark Image</h2>
      <p className="subtitle">Stamp your images with custom text offline.</p>
      
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
          <div className="controls">
            <div className="control-group">
              <label>Watermark Text:</label>
              <input type="text" className="dropdown" value={text} onChange={e => setText(e.target.value)} />
            </div>
            
            <div className="control-group">
              <label>Position:</label>
              <select className="dropdown" value={position} onChange={e => setPosition(e.target.value)}>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="center">Center</option>
              </select>
            </div>

            <div className="control-group">
              <label>Color:</label>
              <input type="color" className="dropdown" style={{height: '42px', padding: '0.2rem'}} value={color} onChange={e => setColor(e.target.value)} />
            </div>

            <div className="control-group">
              <label>Opacity:</label>
              <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} />
            </div>
          </div>
          
          <div className="preview-container" style={{ textAlign: 'center', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
            {previewData && <img src={previewData} style={{ maxHeight: '50vh', maxWidth: '100%', objectFit: 'contain' }} alt="Preview" />}
          </div>
          
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => {setFile(null); setPreviewData('');}}>Cancel</button>
            <button className="btn btn-primary" onClick={handleProcess}>Add Watermark & Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
