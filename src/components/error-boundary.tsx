/**
 * Error Boundary component for catching and displaying errors
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary class component
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: sendToErrorService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-destructive">Oops!</h1>
              <h2 className="text-xl text-muted-foreground">
                Something went wrong
              </h2>
            </div>
            
            <div className="bg-muted p-4 rounded-lg text-left">
              <p className="text-sm font-medium mb-2">Error details:</p>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                {this.state.error?.message}
              </pre>
            </div>

            <div className="space-y-2">
              <Button onClick={this.handleReset} className="w-full">
                Try again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Reload page
              </Button>
            </div>

            {import.meta.env.DEV && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Stack trace (development only)
                </summary>
                <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
