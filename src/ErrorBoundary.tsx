import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
    fallback?: ReactNode;
    children: ReactNode;
}

interface ErrorBoundaryState {
    error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Example of an error logging service
        console.log("Error caught by ErrorBoundary:", error, info);
        // You can send this info to a service like Sentry or another logging system
    }

    render() {
        if (this.state.error) {
            // You can render any custom fallback UI
            return this.props.fallback ?? this.state.error.message;
        }

        return this.props.children;
    }

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { error: null };
    }
}