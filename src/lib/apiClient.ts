/**
 * BeneDecor Fast API Client with Cache & Retry Support for Slow Networks
 */

interface CacheEntry {
  data: any;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30000; // 30 seconds memory cache

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  backoffMs = 1000
): Promise<Response> {
  let lastError: any = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s per request timeout

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, backoffMs * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error(`Network request failed for ${url}`);
}

export async function fetchJsonCached<T = any>(
  url: string,
  options: RequestInit = {},
  bypassCache = false
): Promise<{ success: boolean; data?: T; error?: string }> {
  const now = Date.now();

  // Check Memory Cache if GET request
  const isGet = !options.method || options.method.toUpperCase() === "GET";
  if (isGet && !bypassCache) {
    const cached = memoryCache.get(url);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return { success: true, data: cached.data };
    }
  }

  try {
    const res = await fetchWithRetry(url, options);
    const contentType = res.headers.get("content-type") || "";

    if (res.ok && contentType.includes("application/json")) {
      const json = await res.json();
      if (isGet && json.success) {
        memoryCache.set(url, { data: json, timestamp: Date.now() });
      }
      return { success: true, data: json };
    }

    return {
      success: false,
      error: `Server error (${res.status}). Please check your connection.`,
    };
  } catch (err: any) {
    console.error(`fetchJsonCached error for ${url}:`, err);
    return {
      success: false,
      error: err.name === "AbortError" ? "Request timed out. Please retry." : "Network connection unstable.",
    };
  }
}

export function clearApiCache(urlPattern?: string) {
  if (!urlPattern) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(urlPattern)) {
      memoryCache.delete(key);
    }
  }
}
