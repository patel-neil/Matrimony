import { useState, useCallback } from 'react';

const useAutoSave = (data) => {
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  const handleAutoSave = useCallback((formData) => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    
    const timer = setTimeout(() => {
      localStorage.setItem('matrimonialFormData', JSON.stringify(formData));
    }, 1000);
    
    setAutoSaveTimer(timer);
  }, []);

  return { autoSaveTimer, handleAutoSave };
};

export default useAutoSave;
