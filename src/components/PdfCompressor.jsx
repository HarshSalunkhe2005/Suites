import React, { useState } from 'react';
import { compressBalanced, compressLossless, compressMax } from '@quicktoolsone/pdf-compress';
import '../App.css';

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
      const uint8Array = new Uint8Array(arrayBuffer);
      
      let compressedBytes;
      if (level === 'lossless') {
        compressedBytes = await compressLossless(uint8Array);
      } else if (level === 'max') {
        compressedBytes = await compressMax(uint8Array);
      } else {
        compressedBytes = await compressBalanced(uint8Array);
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
    <div className="tool-container">
      <h2>Compress PDF</h2>
      <p className="tool-desc">Reduce your PDF file size without losing quality. Works 100% offline.</p>
      
      {!file && (
        <div 
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            id="file-upload" 
            accept="application/pdf" 
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" className="upload-btn">
            Choose PDF
          </label>
          <p>or drag and drop here</p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {file && !result && (
        <div className="processing-section">
          <div className="file-info">
            <span className="file-name">{file.name}</span>
            <span className="file-size">{formatSize(file.size)}</span>
          </div>
          
          <div className="options-group" style={{marginTop: '1rem', marginBottom: '1rem'}}>
            <label style={{marginRight: '1rem', fontWeight: 600}}>Compression Level:</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc'}}>
              <option value="lossless">Lossless (Best Quality)</option>
              <option value="balanced">Balanced (Recommended)</option>
              <option value="max">Max (Smallest File)</option>
            </select>
          </div>

          <div className="action-buttons">
            <button onClick={() => setFile(null)} className="btn-secondary" disabled={loading}>Cancel</button>
            <button onClick={processCompression} className="btn-primary" disabled={loading}>
              {loading ? 'Compressing...' : 'Compress PDF'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="result-section">
          <div className="success-banner" style={{padding: '1.5rem', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5', marginBottom: '2rem'}}>
            <h3 style={{color: '#065f46', marginTop: 0}}>Compression Complete! 🎉</h3>
            <div className="stats-row" style={{display: 'flex', gap: '2rem', marginTop: '1rem'}}>
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
          <div className="action-buttons">
            <a href={result.url} download={`compressed_${file.name}`} className="btn-primary" style={{textDecoration: 'none', display: 'inline-block'}}>
              Download PDF
            </a>
            <button onClick={() => { setFile(null); setResult(null); }} className="btn-secondary">
              Compress Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfCompressor;
