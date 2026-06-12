import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import '../App.css';

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
    <div className="tool-container">
      <h2>Merge PDFs</h2>
      <p className="tool-desc">Combine multiple PDF files into one single document instantly. 100% offline.</p>
      
      <div 
        className="drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{ marginBottom: '2rem', padding: '1.5rem' }}
      >
        <input 
          type="file" 
          id="file-upload" 
          accept="application/pdf" 
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className="upload-btn">
          Add PDFs
        </label>
        <p style={{marginTop: '0.5rem', marginBottom: 0}}>or drag and drop here</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      {files.length > 0 && !result && (
        <div className="processing-section">
          <h3 style={{marginBottom: '1rem'}}>Files to Merge ({files.length})</h3>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem'}}>
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
                  <button onClick={() => removeFile(index)} style={{padding: '0.25rem 0.5rem', color: 'red', cursor: 'pointer', marginLeft: '0.5rem'}}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={() => setFiles([])} className="btn-secondary" disabled={loading}>Clear All</button>
            <button onClick={processMerge} className="btn-primary" disabled={loading || files.length < 2}>
              {loading ? 'Merging...' : 'Merge PDFs'}
            </button>
          </div>
          {files.length < 2 && <p style={{fontSize: '0.85rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem'}}>Need at least 2 files to merge.</p>}
        </div>
      )}

      {result && (
        <div className="result-section">
          <div className="success-banner" style={{padding: '1.5rem', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5', marginBottom: '2rem'}}>
            <h3 style={{color: '#065f46', marginTop: 0}}>Merge Complete! 🎉</h3>
            <p style={{color: '#064e3b'}}>Successfully combined {files.length} files into a single {result.pageCount}-page document.</p>
            <p style={{color: '#064e3b', fontWeight: 600}}>Final Size: {formatSize(result.size)}</p>
          </div>
          <div className="action-buttons">
            <a href={result.url} download="merged_document.pdf" className="btn-primary" style={{textDecoration: 'none', display: 'inline-block'}}>
              Download Merged PDF
            </a>
            <button onClick={() => { setFiles([]); setResult(null); }} className="btn-secondary">
              Merge More PDFs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfMerger;
