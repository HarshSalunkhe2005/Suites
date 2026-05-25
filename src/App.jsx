import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import ImageResizer from './components/ImageResizer';
import ImageCropper from './components/ImageCropper';
import ImageConverter from './components/ImageConverter';
import ImageToPdf from './components/ImageToPdf';
import PdfToImage from './components/PdfToImage';

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
            <Link to="/compress" className="nav-link">Compress IMAGE</Link>
            <Link to="/crop" className="nav-link">Crop IMAGE</Link>
            <Link to="/convert" className="nav-link">Convert to JPG</Link>
            <Link to="/img-to-pdf" className="nav-link">IMG to PDF</Link>
            <Link to="/pdf-to-img" className="nav-link">PDF to IMG</Link>
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
