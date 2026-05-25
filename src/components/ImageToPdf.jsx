import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { readImageFile } from '../utils/fileHelpers';
import './ImageResizer.css';

export default function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSelectFiles = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        let pdfImage;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          pdfImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // If it's WebP/GIF, we need to convert it to JPEG first using our canvas helper
          const img = await readImageFile(file);
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          const base64Jpeg = canvas.toDataURL('image/jpeg', 0.95);
          const jpegBytes = await fetch(base64Jpeg).then(res => res.arrayBuffer());
          pdfImage = await pdfDoc.embedJpg(jpegBytes);
        }

        // Add page matching image dimensions
        const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: pdfImage.width,
          height: pdfImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `suites-merged-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to create PDF. Some images might be corrupted or unsupported.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card image-resizer">
      <h2>Image to PDF</h2>
      <p className="subtitle">Convert multiple JPG, PNG, and WEBP images into a single PDF document.</p>
      
      <div 
        className="dropzone"
        style={{ marginBottom: '1.5rem', minHeight: files.length > 0 ? '120px' : '250px' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input type="file" accept="image/*" multiple hidden ref={fileInputRef} onChange={handleSelectFiles} />
        <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        <p>Drag & Drop multiple images here or click to add</p>
      </div>

      {files.length > 0 && (
        <div className="workspace">
          <div className="file-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {files.map((f, idx) => (
              <div key={idx} style={{ position: 'relative', border: '1px solid #ddd', borderRadius: '8px', padding: '0.5rem', textAlign: 'center', backgroundColor: '#fafafa' }}>
                <span 
                  style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'red', color: 'white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                  onClick={() => removeFile(idx)}
                >
                  &times;
                </span>
                <div style={{ wordBreak: 'break-word', fontSize: '0.8rem', marginTop: '0.5rem' }}>{f.name}</div>
              </div>
            ))}
          </div>
          
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => setFiles([])}>Clear All</button>
            <button className="btn btn-primary" onClick={handleProcess} disabled={isProcessing}>
              {isProcessing ? 'Merging to PDF...' : 'Convert to PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
