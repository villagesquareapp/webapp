"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

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

const DEFAULT_CACHE_DURATION = 5; // 5 minutes

export const DataCacheProvider = ({ children }: { children: React.ReactNode }) => {
  const [cache, setCache] = useState<Map<string, CacheEntry<any>>>(new Map());
  const [scrollPositions, setScrollPositions] = useState<Map<string, number>>(new Map());

  const getCachedData = useCallback(<T,>(key: string): T | null => {
    const entry = cache.get(key);
    return entry ? entry.data : null;
  }, [cache]);

  const setCachedData = useCallback(<T,>(key: string, data: T) => {
    setCache((prev) => {
      const newCache = new Map(prev);
      newCache.set(key, {
        data,
        timestamp: Date.now(),
      });
      return newCache;
    });
  }, []);

  const isCacheValid = useCallback((key: string, maxAgeMinutes: number = DEFAULT_CACHE_DURATION): boolean => {
    const entry = cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    const ageInMinutes = (now - entry.timestamp) / (1000 * 60);
    return ageInMinutes < maxAgeMinutes;
  }, [cache]);

  const clearCache = useCallback((key?: string) => {
    if (key) {
      setCache((prev) => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
    } else {
      setCache(new Map());
    }
  }, []);

  const getScrollPosition = useCallback((key: string): number => {
    return scrollPositions.get(key) || 0;
  }, [scrollPositions]);

  const setScrollPosition = useCallback((key: string, position: number) => {
    setScrollPositions((prev) => {
      const newScroll = new Map(prev);
      newScroll.set(key, position);
      return newScroll;
    });
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
