"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  onReset?: () => void;
};

type State = { hasError: boolean };

export default class WizardErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[WizardErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 text-center sm:p-8"
          role="alert"
        >
          <p className="text-sm font-semibold text-foreground">
            אירעה שגיאה בטופס ההזמנה
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            נסו לרענן את הדף או לחזור לבחירת השירות.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-brand-red/40"
            >
              נסו שוב
            </button>
            {this.props.onReset ? (
              <button
                type="button"
                onClick={this.props.onReset}
                className="rounded-xl bg-brand-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-light"
              >
                חזרה לבחירת שירות
              </button>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
