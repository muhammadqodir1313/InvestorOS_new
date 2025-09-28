import { QueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

/**
 * React Query cache ni localStorage da saqlash va yuklash uchun
 */
export const createPersistQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 daqiqa
        gcTime: 1000 * 60 * 30, // 30 daqiqa
      },
    },
  });

  // Cache ni localStorage dan yuklash
  const loadCache = () => {
    try {
      const cachedData = localStorage.getItem('react-query-cache');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        queryClient.setQueryData(['auth'], parsedData.auth);
        // Boshqa cache larni ham yuklash
        Object.entries(parsedData).forEach(([key, value]) => {
          if (key !== 'auth') {
            queryClient.setQueryData([key], value);
          }
        });
      }
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
    }
  };

  // Cache ni localStorage ga saqlash
  const saveCache = () => {
    try {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      const cacheData = {};
      
      queries.forEach((query) => {
        if (query.state.data !== undefined) {
          cacheData[query.queryKey[0]] = query.state.data;
        }
      });
      
      localStorage.setItem('react-query-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  };

  // Sahifa yuklanganda cache ni yuklash
  loadCache();

  // Cache o'zgarishlarini kuzatish va saqlash
  const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'updated' && event.query.state.data !== undefined) {
      saveCache();
    }
  });

  return { queryClient, saveCache, loadCache };
};

/**
 * Ma'lumotlarni localStorage da saqlash uchun hook
 * @param {string} key - localStorage kaliti
 * @param {any} initialValue - boshlang'ich qiymat
 * @param {object} queryClient - React Query client
 */
export const usePersistQuery = (key, initialValue, queryClient) => {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(`query-${key}`);
      return cached ? JSON.parse(cached) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    // Ma'lumot o'zgarganida localStorage ga saqlash
    localStorage.setItem(`query-${key}`, JSON.stringify(data));
    
    // React Query cache ga ham saqlash
    if (queryClient) {
      queryClient.setQueryData([key], data);
    }
  }, [data, key, queryClient]);

  return [data, setData];
};
