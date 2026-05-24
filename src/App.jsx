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
            <h1 className="logo"><span style={{fontWeight: 400}}>iLove</span>IMG</h1>
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
