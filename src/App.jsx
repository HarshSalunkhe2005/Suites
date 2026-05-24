import './App.css';
import ImageResizer from './components/ImageResizer';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container header-content">
          <div className="logo-section">
            <h1 className="logo">Suites.</h1>
            <span className="badge">PWA Local</span>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          <ImageResizer />
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
