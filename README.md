# Suites.

![Suites. Logo](./public/logo.png)

**Suites.** is a blazing-fast, strictly offline-first toolkit for manipulating Images and PDFs directly in your browser. 
No data ever leaves your device—everything is processed locally using WebAssembly and Canvas APIs.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-badge-id/deploy-status)](https://suites-app.netlify.app)

## Features

### Image Ecosystem
- **Compress IMAGE**: Intelligent downsizing and quality reduction for sharing online.
- **Crop IMAGE**: Precision cropping and aspect ratio constraints.
- **Convert to JPG**: Converts next-gen formats (WEBP) or standard formats (PNG, GIF) into standard JPGs instantly.

### PDF Bridge
- **IMG to PDF**: Merges multiple image files into a single, cohesive PDF document.
- **PDF to IMG**: Extracts high-quality pages out of massive PDF documents directly to your local disk.

## Tech Stack
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS Modules (No Tailwind)
- **PDF Engine**: `pdf-lib` and `pdfjs-dist`
- **Architecture**: Progressive Web App (PWA) configured for standalone Desktop/Mobile offline installation.

## Deployment & Installation

### Web Host (Netlify)
This project is configured out-of-the-box for Netlify deployment via the `netlify.toml` file (which handles React Router single-page redirects).

1. Run `npm run build`.
2. Drag and drop the `dist/` folder into Netlify Drop, or connect your GitHub repository directly to a Netlify project.

### Mobile & Desktop App (PWA)
Suites is a Progressive Web App (PWA). Once deployed:
- **On Desktop**: Open the site in Chrome/Edge and click the "Install App" icon in the URL bar to get a standalone desktop window and icon.
- **On Mobile**: Open the site in iOS Safari or Android Chrome and tap "Add to Home Screen" to install it as a native offline app.
- **Size**: Because it uses your native web engine, the entire installed app size is just ~2MB instead of 150MB+ like traditional Electron apps!

## Development
```bash
npm install
npm run dev
```
