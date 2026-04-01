"use client";

import React, { createContext, useContext, useCallback } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface DataCacheContextType {
  getCachedData: <T>(key: string) => T | null;
  setCachedData: <T>(key: string, data: T) => void;
  isCacheValid: (key: string, maxAgeMinutes?: number) => boolean;
  clearCache: (key?: string) => void;
  getScrollPosition: (key: string) => number;
  setScrollPosition: (key: string, position: number) => void;
}

const DataCacheContext = createContext<DataCacheContextType | undefined>(undefined);

const DEFAULT_CACHE_DURATION = 5;

// Module-level stores — survive React remounts and navigation
const dataCache = new Map<string, CacheEntry<any>>();
const scrollCache = new Map<string, number>();

export const DataCacheProvider = ({ children }: { children: React.ReactNode }) => {

  const getCachedData = useCallback(<T,>(key: string): T | null => {
    const entry = dataCache.get(key);
    return entry ? (entry.data as T) : null;
  }, []);

  const setCachedData = useCallback(<T,>(key: string, data: T) => {
    dataCache.set(key, { data, timestamp: Date.now() });
  }, []);

  const isCacheValid = useCallback((key: string, maxAgeMinutes: number = DEFAULT_CACHE_DURATION): boolean => {
    const entry = dataCache.get(key);
    if (!entry) return false;
    const ageInMinutes = (Date.now() - entry.timestamp) / (1000 * 60);
    return ageInMinutes < maxAgeMinutes;
  }, []);

  const clearCache = useCallback((key?: string) => {
    if (key) {
      dataCache.delete(key);
    } else {
      dataCache.clear();
    }
  }, []);

  const getScrollPosition = useCallback((key: string): number => {
    return scrollCache.get(key) || 0;
  }, []);

  const setScrollPosition = useCallback((key: string, position: number) => {
    scrollCache.set(key, position);
  }, []);

  return (
    <DataCacheContext.Provider
      value={{
        getCachedData,
        setCachedData,
        isCacheValid,
        clearCache,
        getScrollPosition,
        setScrollPosition,
      }}
    >
      {children}
    </DataCacheContext.Provider>
  );
};

export const useDataCache = () => {
  const context = useContext(DataCacheContext);
  if (!context) {
    throw new Error("useDataCache must be used within DataCacheProvider");
  }
  return context;
};
