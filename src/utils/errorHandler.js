export const handleApiError = (error) => {
  if (error && typeof error === 'object') {
    if (error.error && typeof error.error === 'string') return error.error;
    if (error.message) return error.message;
  }
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
};
