import { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import JSZip from 'jszip';
import './ImageResizer.css';

// Set up the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function PdfToImage() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);
      
      const zip = new JSZip();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Scale 2.0 for higher quality
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        
        // Convert canvas to JPG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
        
        // Add to zip
        zip.file(`page_${i}.jpg`, base64Data, {base64: true});
        setProgress(i);
      }

      // Generate Zip and Download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `suites-pdf-images-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Failed to convert PDF. The file might be corrupted or encrypted.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setTotalPages(0);
    }
  };

  return (
    <div className="card image-resizer">
      <h2>PDF to Image</h2>
      <p className="subtitle">Convert every page of a PDF into high-quality JPGs, packaged in a ZIP file.</p>
      
      {!file ? (
        <div 
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input type="file" accept="application/pdf" hidden ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} />
          <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          <p>Drag & Drop a PDF here or click to select</p>
        </div>
      ) : (
        <div className="workspace">
          <div className="file-info" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <strong>Selected PDF:</strong> {file.name}
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
          
          {isProcessing && totalPages > 0 && (
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <progress value={progress} max={totalPages} style={{ width: '100%', height: '20px' }}></progress>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)' }}>
                Processing page {progress} of {totalPages}...
              </div>
            </div>
          )}
          
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => !isProcessing && setFile(null)} disabled={isProcessing}>Cancel</button>
            <button className="btn btn-primary" onClick={handleProcess} disabled={isProcessing}>
              {isProcessing ? 'Zipping Images...' : 'Convert to JPG & Download'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
