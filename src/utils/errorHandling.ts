
export const handleApiError = (error: any, defaultMessage: string): string => {
  console.error('API Error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
};

export const logError = (context: string, error: any, additionalData?: any) => {
  console.error(`=== ERROR IN ${context.toUpperCase()} ===`);
  console.error('Error:', error);
  if (additionalData) {
    console.error('Additional data:', additionalData);
  }
  console.error('Stack trace:', error?.stack);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};
