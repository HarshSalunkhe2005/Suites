import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import ImageResizer from './components/ImageResizer';
import ImageCropper from './components/ImageCropper';
import ImageConverter from './components/ImageConverter';
import ImageToPdf from './components/ImageToPdf';
import PdfToImage from './components/PdfToImage';
import PdfCompressor from './components/PdfCompressor';
import PdfMerger from './components/PdfMerger';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-section" style={{textDecoration: 'none'}}>
            <img src="/logo.png" alt="Suites Logo" style={{ width: '32px', height: '32px', marginRight: '8px', borderRadius: '6px' }} />
            <h1 className="logo">Suites.</h1>
          </Link>
          <nav className="main-nav">
            <div className="nav-dropdown">
              <button className="nav-dropbtn">Image Tools ▼</button>
              <div className="nav-dropdown-content">
                <Link to="/compress" className="nav-link">Compress Image</Link>
                <Link to="/crop" className="nav-link">Crop Image</Link>
                <Link to="/convert" className="nav-link">Convert Format</Link>
              </div>
            </div>
            
            <div className="nav-dropdown">
              <button className="nav-dropbtn">PDF Tools ▼</button>
              <div className="nav-dropdown-content">
                <Link to="/pdf-compress" className="nav-link">Compress PDF</Link>
                <Link to="/pdf-merge" className="nav-link">Merge PDFs</Link>
                <Link to="/img-to-pdf" className="nav-link">Image to PDF</Link>
                <Link to="/pdf-to-img" className="nav-link">PDF to Image</Link>
              </div>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compress" element={<ImageResizer />} />
            <Route path="/crop" element={<ImageCropper />} />
            <Route path="/convert" element={<ImageConverter />} />
            <Route path="/img-to-pdf" element={<ImageToPdf />} />
            <Route path="/pdf-to-img" element={<PdfToImage />} />
            <Route path="/pdf-compress" element={<PdfCompressor />} />
            <Route path="/pdf-merge" element={<PdfMerger />} />
          </Routes>
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p><strong>Privacy First:</strong> All files are processed entirely on your device. Nothing is uploaded to any server.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
