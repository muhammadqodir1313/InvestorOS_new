import { useLocalStorage } from './use-local-storage';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Ma'lumotlarni avtomatik saqlash uchun hook
 * @param {string} key - localStorage kaliti
 * @param {any} initialValue - boshlang'ich qiymat
 * @param {boolean} persistToQuery - React Query ga ham saqlash kerakmi
 */
export const usePersistData = (key, initialValue, persistToQuery = true) => {
  const [data, setData] = useLocalStorage(key, initialValue);
  const queryClient = useQueryClient();

  // Ma'lumotni o'zgartirish
  const updateData = (newData) => {
    setData(newData);
    
    // React Query ga ham saqlash
    if (persistToQuery && queryClient) {
      queryClient.setQueryData([key], newData);
    }
  };

  // Ma'lumotni tozalash
  const clearData = () => {
    setData(initialValue);
    
    if (persistToQuery && queryClient) {
      queryClient.setQueryData([key], initialValue);
    }
  };

  return {
    data,
    setData: updateData,
    clearData,
    isLoading: false
  };
};

/**
 * Form ma'lumotlarini saqlash uchun hook
 * @param {string} key - localStorage kaliti
 * @param {object} initialForm - boshlang'ich form ma'lumotlari
 */
export const usePersistForm = (key, initialForm = {}) => {
  const [formData, setFormData] = useLocalStorage(key, initialForm);

  // Form field ni o'zgartirish
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Butun form ni o'zgartirish
  const updateForm = (newFormData) => {
    setFormData(newFormData);
  };

  // Form ni tozalash
  const resetForm = () => {
    setFormData(initialForm);
  };

  return {
    formData,
    updateField,
    updateForm,
    resetForm
  };
};

/**
 * User preferences ni saqlash uchun hook
 * @param {string} key - localStorage kaliti
 * @param {object} defaultPreferences - default sozlamalar
 */
export const useUserPreferences = (key = 'user-preferences', defaultPreferences = {}) => {
  const [preferences, setPreferences] = useLocalStorage(key, defaultPreferences);

  // Preference ni o'zgartirish
  const updatePreference = (preferenceKey, value) => {
    setPreferences(prev => ({
      ...prev,
      [preferenceKey]: value
    }));
  };

  // Bir nechta preference ni o'zgartirish
  const updatePreferences = (updates) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  };

  return {
    preferences,
    updatePreference,
    updatePreferences,
    setPreferences
  };
};
