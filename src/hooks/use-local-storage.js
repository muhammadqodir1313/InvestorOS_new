import { useState, useEffect } from 'react';

/**
 * LocalStorage hook - ma'lumotlarni brauzerda saqlash uchun
 * @param {string} key - localStorage kaliti
 * @param {any} initialValue - boshlang'ich qiymat
 * @returns {[any, function]} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // State ni localStorage dan olish
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Qiymatni o'zgartirish va localStorage ga saqlash
  const setValue = (value) => {
    try {
      // Function bo'lsa, uni chaqirish
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // localStorage ga saqlash
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * SessionStorage hook - sessiya davomida saqlash uchun
 * @param {string} key - sessionStorage kaliti
 * @param {any} initialValue - boshlang'ich qiymat
 * @returns {[any, function]} - [value, setValue]
 */
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (valueToStore === undefined) {
        window.sessionStorage.removeItem(key);
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
