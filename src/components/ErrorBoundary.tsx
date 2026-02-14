import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg border border-red-100">
                        <div className="flex flex-col items-center text-center text-red-600 mb-4">
                            <AlertTriangle size={48} className="mb-2" />
                            <h2 className="text-xl font-bold">Something went wrong</h2>
                        </div>
                        <div className="bg-gray-100 p-4 rounded text-sm font-mono overflow-auto max-h-48 text-gray-800">
                            {this.state.error?.message}
                        </div>
                        <button
                            className="mt-6 w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            onClick={() => window.location.reload()}
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
