/**
 * Production-safe logging utility
 * Only logs errors in development mode or with specific error tracking in production
 */

const isDev = process.env.NODE_ENV === 'development';
const isClient = typeof window !== 'undefined';

export const logger = {
  error: (message: string, error?: any) => {
    if (isDev) {
      console.error(message, error);
    } else if (isClient && error?.response?.status >= 500) {
      // Only log server errors in production
      console.error('[Error]', message);
    }
  },

  warn: (message: string, data?: any) => {
    if (isDev) {
      console.warn(message, data);
    }
  },

  info: (message: string, data?: any) => {
    if (isDev) {
      console.info(message, data);
    }
  },

  debug: (message: string, data?: any) => {
    if (isDev) {
      console.debug(message, data);
    }
  },
};

export default logger;
