import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import ImageResizer from './components/ImageResizer';
import ImageCropper from './components/ImageCropper';
import ImageConverter from './components/ImageConverter';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-section" style={{textDecoration: 'none'}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#3CB6E2"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#3CB6E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="logo">Suites.</h1>
          </Link>
          <nav className="main-nav">
            <Link to="/compress" className="nav-link">Compress IMAGE</Link>
            <Link to="/crop" className="nav-link">Crop IMAGE</Link>
            <Link to="/convert" className="nav-link">Convert to JPG</Link>
            {/* PDF links will be uncommented once built */}
            {/* <Link to="/img-to-pdf" className="nav-link">IMG to PDF</Link> */}
            {/* <Link to="/pdf-to-img" className="nav-link">PDF to IMG</Link> */}
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
