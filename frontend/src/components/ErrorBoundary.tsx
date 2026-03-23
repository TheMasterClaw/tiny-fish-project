import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary for CoralGuard
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log to console
    console.error('CoralGuard Error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Track error in analytics (if available)
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.trackError(error.message, {
        componentStack: errorInfo.componentStack,
        stack: error.stack
      });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-blue-950 to-teal-950 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Animated Coral Icon */}
            <div className="mb-6 relative">
              <div className="text-6xl animate-pulse">🪸</div>
              <div className="absolute inset-0 text-6xl animate-ping opacity-20">🪸</div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Reef Alert!
            </h1>
            
            <p className="text-cyan-200 mb-6">
              Something went wrong in the coral ecosystem. Our guardians are working to restore the reef.
            </p>
            
            {this.state.error && (
              <div className="bg-black/30 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-400 text-sm font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-teal-400 transition-all transform hover:scale-105"
              >
                🔄 Reload Reef
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
              >
                🏠 Go Home
              </button>
            </div>
            
            <p className="mt-6 text-cyan-400/60 text-sm">
              If this keeps happening, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
