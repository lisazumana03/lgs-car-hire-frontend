import { toast } from 'react-hot-toast';

/**
 * Custom hook for showing notifications using react-hot-toast
 * @returns {object} Notification functions
 */
export const useNotification = () => {
  const showSuccess = (message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#fff3cd',
        color: '#856404',
      },
      ...options,
    });
  };

  const showLoading = (message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      ...options,
    });
  };

  const dismiss = (toastId) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  const promise = (promiseFunc, messages) => {
    return toast.promise(
      promiseFunc,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Error occurred',
      },
      {
        position: 'top-right',
      }
    );
  };

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    loading: showLoading,
    dismiss,
    promise,
  };
};

export default useNotification;
