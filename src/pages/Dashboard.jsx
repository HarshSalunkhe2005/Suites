import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="home-title">
        <h2>Every tool you need to edit images.</h2>
        <p>100% Offline. Zero Data Tracking.</p>
      </div>
      
      <div className="tools-grid">
        <Link to="/compress" className="tool-card">
          <div className="tool-icon compress-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
          </div>
          <h3>Compress Image</h3>
          <p>Compress JPG, PNG, and WebP instantly using exact target sizes.</p>
        </Link>
        
        <Link to="/crop" className="tool-card">
          <div className="tool-icon crop-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"></path><path d="M18 22V8a2 2 0 0 0-2-2H2"></path></svg>
          </div>
          <h3>Crop Image</h3>
          <p>Visual cropping tool to cut out precisely what you need.</p>
        </Link>

        <Link to="/convert" className="tool-card">
          <div className="tool-icon" style={{backgroundColor: '#FFF3E0', color: '#E65100'}}>
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
          </div>
          <h3>Convert Image</h3>
          <p>Auto-detects WEBP, PNG, JPG, GIF and converts them instantly.</p>
        </Link>
      </div>
    </div>
  );
}
