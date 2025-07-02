import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // duration in milliseconds
}

class CacheService {
  private static instance: CacheService;
  
  private constructor() {}
  
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Generate cache key
  private getCacheKey(key: string): string {
    return `stockx_cache_${key}`;
  }

  // Check if cache item is expired
  private isExpired(item: CacheItem<any>): boolean {
    const now = Date.now();
    return now > (item.timestamp + item.expiresIn);
  }

  // Store data in cache
  async set<T>(key: string, data: T, expiresInMs: number = 5 * 60 * 1000): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn: expiresInMs,
      };
      
      const cacheKey = this.getCacheKey(key);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      
      console.log(`Cache set for key: ${key}, expires in: ${expiresInMs / 1000}s`);
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  // Get data from cache
  async get<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = this.getCacheKey(key);
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) {
        console.log(`Cache miss for key: ${key}`);
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      if (this.isExpired(cacheItem)) {
        console.log(`Cache expired for key: ${key}`);
        await this.remove(key); // Clean up expired cache
        return null;
      }

      console.log(`Cache hit for key: ${key}`);
      return cacheItem.data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  // Remove specific cache entry
  async remove(key: string): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(key);
      await AsyncStorage.removeItem(cacheKey);
      console.log(`Cache removed for key: ${key}`);
    } catch (error) {
      console.error('Error removing cache:', error);
    }
  }

  // Clear all cache entries for this app
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('stockx_cache_'));
      
      if (appKeys.length > 0) {
        await AsyncStorage.multiRemove(appKeys);
        console.log(`Cleared ${appKeys.length} cache entries`);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Get cache info for debugging
  async getCacheInfo(): Promise<{ key: string; size: number; expiresAt: Date }[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith('stockx_cache_'));
      
      const info = await Promise.all(
        appKeys.map(async (key: string) => {
          const cached = await AsyncStorage.getItem(key);
          if (cached) {
            const cacheItem: CacheItem<any> = JSON.parse(cached);
            return {
              key: key.replace('stockx_cache_', ''),
              size: cached.length,
              expiresAt: new Date(cacheItem.timestamp + cacheItem.expiresIn),
            };
          }
          return null;
        })
      );

      return info.filter((item): item is { key: string; size: number; expiresAt: Date } => item !== null);
    } catch (error) {
      console.error('Error getting cache info:', error);
      return [];
    }
  }
}

export const cacheService = CacheService.getInstance(); 