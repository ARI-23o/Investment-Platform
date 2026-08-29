import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    try {
      localStorage.removeItem("gsp_current_user");
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fafcfb] flex items-center justify-center p-6 text-gray-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h1 className="text-xl font-black text-gray-900">Something interrupted the page</h1>
            <p className="text-sm text-gray-600">
              An unexpected render issue occurred. Click below to reload cleanly.
            </p>
            {this.state.error && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-left font-mono text-red-600 overflow-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="w-full py-3 px-6 rounded-full text-sm font-bold bg-[#0f4b32] hover:bg-[#093523] text-white transition-all cursor-pointer shadow-md"
            >
              Reload & Reset
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
