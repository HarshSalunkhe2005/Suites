import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import '../App.css';
import './ImageResizer.css';

const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const PdfMerger = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    if (selected.length > 0) {
      setFiles(prev => [...prev, ...selected]);
      setError('');
      setResult(null);
    } else {
      setError('Please select valid PDF files.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (dropped.length > 0) {
      setFiles(prev => [...prev, ...dropped]);
      setError('');
      setResult(null);
    } else {
      setError('Please select valid PDF files.');
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setFiles(prev => {
      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[index - 1];
      newFiles[index - 1] = temp;
      return newFiles;
    });
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[index + 1];
      newFiles[index + 1] = temp;
      return newFiles;
    });
  };

  const processMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setResult({
        url,
        size: blob.size,
        pageCount: mergedPdf.getPageCount()
      });
      
    } catch (err) {
      console.error(err);
      setError('Failed to merge PDFs. One of the files might be encrypted or corrupted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card image-resizer">
      <h2>Merge PDFs</h2>
      <p className="subtitle">Combine multiple PDF files into one single document instantly. 100% offline.</p>
      
      <div 
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          accept="application/pdf" 
          multiple
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <p>Drag & Drop PDFs here or click to select</p>
      </div>

      {error && <p className="error-message" style={{color: 'red', marginTop: '1rem'}}>{error}</p>}

      {files.length > 0 && !result && (
        <div className="workspace" style={{marginTop: '1.5rem'}}>
          <h3 style={{marginBottom: '1rem'}}>Files to Merge ({files.length})</h3>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem'}}>
            {files.map((file, index) => (
              <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px'}}>
                <div style={{display: 'flex', alignItems: 'center', overflow: 'hidden'}}>
                  <span style={{fontWeight: 700, marginRight: '1rem', color: '#64748b'}}>{index + 1}.</span>
                  <span className="file-name" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px'}}>{file.name}</span>
                  <span className="file-size" style={{marginLeft: '1rem', fontSize: '0.8rem', color: '#64748b'}}>{formatSize(file.size)}</span>
                </div>
                
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button onClick={() => moveUp(index)} disabled={index === 0} style={{padding: '0.25rem 0.5rem', cursor: index === 0 ? 'not-allowed' : 'pointer'}}>↑</button>
                  <button onClick={() => moveDown(index)} disabled={index === files.length - 1} style={{padding: '0.25rem 0.5rem', cursor: index === files.length - 1 ? 'not-allowed' : 'pointer'}}>↓</button>
                  <button onClick={() => removeFile(index)} style={{padding: '0.25rem 0.5rem', color: 'red', cursor: 'pointer', marginLeft: '0.5rem', border: 'none', background: 'none'}}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="actions">
            <button onClick={() => setFiles([])} className="btn btn-secondary" disabled={loading}>Clear All</button>
            <button onClick={processMerge} className="btn btn-primary" disabled={loading || files.length < 2}>
              {loading ? 'Merging...' : 'Merge PDFs'}
            </button>
          </div>
          {files.length < 2 && <p style={{fontSize: '0.85rem', color: '#64748b', textAlign: 'left', marginTop: '0.5rem'}}>Need at least 2 files to merge.</p>}
        </div>
      )}

      {result && (
        <div className="workspace" style={{marginTop: '1.5rem'}}>
          <div className="success-banner" style={{padding: '1.5rem', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5', marginBottom: '1rem'}}>
            <h3 style={{color: '#065f46', marginTop: 0, marginBottom: '0.5rem'}}>Merge Complete! 🎉</h3>
            <p style={{color: '#064e3b'}}>Successfully combined {files.length} files into a single {result.pageCount}-page document.</p>
            <p style={{color: '#064e3b', fontWeight: 600, marginTop: '0.5rem'}}>Final Size: {formatSize(result.size)}</p>
          </div>
          <div className="actions">
            <a href={result.url} download="merged_document.pdf" className="btn btn-primary" style={{textDecoration: 'none'}}>
              Download Merged PDF
            </a>
            <button onClick={() => { setFiles([]); setResult(null); }} className="btn btn-secondary">
              Merge More PDFs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfMerger;
