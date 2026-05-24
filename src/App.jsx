import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import ImageResizer from './components/ImageResizer';
import ImageCropper from './components/ImageCropper';
import ImageWatermark from './components/ImageWatermark';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-section" style={{textDecoration: 'none'}}>
            <h1 className="logo">Suites.</h1>
          </Link>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compress" element={<ImageResizer />} />
            <Route path="/crop" element={<ImageCropper />} />
            <Route path="/watermark" element={<ImageWatermark />} />
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
