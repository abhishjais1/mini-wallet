import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './ui/Button.jsx';
import { Card, CardTitle, CardContent } from './ui/Card.jsx';
import { Icon } from './ui/Icon.jsx';

/**
 * ErrorBoundary component - catches React errors and displays fallback UI
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-void flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardContent className="p-8 text-center">
              <div className="mb-6 inline-flex p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <Icon name="alert-triangle" size="2xl" className="text-red-400" />
              </div>

              <CardTitle className="mb-3">Something went wrong</CardTitle>

              <p className="text-text-secondary mb-6">
                An unexpected error occurred. Please try refreshing the page.
              </p>

              {import.meta.env.MODE === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                    Error details
                  </summary>
                  <pre className="mt-3 p-4 bg-surface-elevated border border-border rounded-lg text-xs text-red-400 overflow-auto max-h-48">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 justify-center">
                <Button variant="secondary" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button variant="primary" onClick={this.handleReload}>
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
