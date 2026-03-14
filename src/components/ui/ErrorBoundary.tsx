import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 p-8 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {this.props.fallbackTitle ?? "Something went wrong"}
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
