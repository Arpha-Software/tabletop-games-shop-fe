'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { handleAuthError } from '@/utils/helpers';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Check if this is a 401 error and handle it
    if (handleAuthError(error)) {
      return; // Error was handled by redirecting to login
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Щось пішло не так
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Сталася неочікувана помилка. Спробуйте оновити сторінку.
              </p>
            </div>
            <div>
              <button
                onClick={() => window.location.reload()}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Оновити сторінку
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 