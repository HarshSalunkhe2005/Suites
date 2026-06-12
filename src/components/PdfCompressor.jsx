import React, { useState, useRef } from 'react';
import { compressBalanced, compressLossless, compressMax } from '@quicktoolsone/pdf-compress';
import * as pdfjsLib from 'pdfjs-dist';
import '../App.css';
import './ImageResizer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const PdfCompressor = () => {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState('balanced');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError('');
      setResult(null);
    } else {
      setError('Please select a valid PDF file.');
      setFile(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
      setError('');
      setResult(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const processCompression = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      let compressedBytes;
      if (level === 'lossless') {
        compressedBytes = await compressLossless(arrayBuffer);
      } else if (level === 'max') {
        compressedBytes = await compressMax(arrayBuffer);
      } else {
        compressedBytes = await compressBalanced(arrayBuffer);
      }
      
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setResult({
        url,
        originalSize: file.size,
        compressedSize: blob.size,
        savings: (((file.size - blob.size) / file.size) * 100).toFixed(1)
      });
      
    } catch (err) {
      console.error(err);
      setError('Failed to compress PDF. The file might be corrupted or unsupported.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card image-resizer">
      <h2>Compress PDF</h2>
      <p className="subtitle">Reduce your PDF file size without losing quality. Works 100% offline.</p>
      
      {!file && (
        <div 
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            accept="application/pdf" 
            hidden 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p>Drag & Drop a PDF here or click to select</p>
        </div>
      )}

      {error && <p className="error-message" style={{color: 'red', marginTop: '1rem'}}>{error}</p>}

      {file && !result && (
        <div className="workspace">
          <div className="file-info">
            <strong>Selected:</strong> {file.name} ({formatSize(file.size)})
          </div>
          
          <div className="controls">
            <div className="control-group">
              <label>Compression Level:</label>
              <select className="dropdown" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="lossless">Lossless (Best Quality)</option>
                <option value="balanced">Balanced (Recommended)</option>
                <option value="max">Max (Smallest File)</option>
              </select>
            </div>
          </div>

          <div className="actions">
            <button onClick={() => setFile(null)} className="btn btn-secondary" disabled={loading}>Cancel</button>
            <button onClick={processCompression} className="btn btn-primary" disabled={loading}>
              {loading ? 'Compressing...' : 'Compress PDF'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="workspace">
          <div className="success-banner" style={{padding: '1.5rem', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5'}}>
            <h3 style={{color: '#065f46', marginTop: 0, marginBottom: '1rem'}}>Compression Complete! 🎉</h3>
            <div className="stats-row" style={{display: 'flex', gap: '2rem'}}>
              <div className="stat-box">
                <span className="stat-label" style={{display: 'block', fontSize: '0.85rem', color: '#064e3b', fontWeight: 600}}>Original</span>
                <span className="stat-value" style={{fontSize: '1.25rem', fontWeight: 700}}>{formatSize(result.originalSize)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label" style={{display: 'block', fontSize: '0.85rem', color: '#064e3b', fontWeight: 600}}>Compressed</span>
                <span className="stat-value highlight" style={{fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)'}}>{formatSize(result.compressedSize)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label" style={{display: 'block', fontSize: '0.85rem', color: '#064e3b', fontWeight: 600}}>Saved</span>
                <span className="stat-value" style={{fontSize: '1.25rem', fontWeight: 700}}>{result.savings}%</span>
              </div>
            </div>
          </div>
          <div className="actions">
            <a href={result.url} download={`compressed_${file.name}`} className="btn btn-primary" style={{textDecoration: 'none'}}>
              Download PDF
            </a>
            <button onClick={() => { setFile(null); setResult(null); }} className="btn btn-secondary">
              Compress Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfCompressor;
