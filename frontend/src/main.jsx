import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AURA UI Error Boundary caught an exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] flex flex-col items-center justify-center p-6 space-y-4">
          <div className="bg-white border border-[#E8E4DC] p-8 rounded-sm max-w-lg w-full text-center space-y-4 shadow-xl">
            <h2 className="text-2xl font-serif text-[#C5A059]">AURA Haute Joaillerie</h2>
            <p className="text-xs font-sans text-charcoal-800">
              An unexpected display exception occurred. Please click below to refresh the boutique interface.
            </p>
            <div className="bg-cream-50 border border-cream-300 p-3 rounded font-mono text-[11px] text-charcoal-800 overflow-x-auto text-left">
              {this.state.error?.toString() || 'Unknown Error'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-charcoal-950 hover:bg-gold-600 text-cream-50 hover:text-charcoal-950 font-sans text-xs uppercase tracking-[0.2em] px-6 py-3 rounded shadow"
            >
              Reload Boutique
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
