import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(_error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(_error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", _error, errorInfo);
        this.setState({ error: _error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
                    <h1>Something went wrong.</h1>
                    <p>Please refresh the page or try again later.</p>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px', color: '#ccc' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
