/**
 * useThemeOverrides Hook
 * 
 * Manages theme token overrides with localStorage persistence.
 * Provides methods to get, set, and reset individual tokens,
 * and applies changes live to CSS variables.
 */

import * as React from "react";

const STORAGE_KEY = "wex-theme-overrides";

export interface ThemeOverrides {
  light: Record<string, string>;
  dark: Record<string, string>;
}

const defaultOverrides: ThemeOverrides = {
  light: {},
  dark: {},
};

/**
 * Load overrides from localStorage
 */
function loadFromStorage(): ThemeOverrides {
  if (typeof window === "undefined") return defaultOverrides;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to load theme overrides from localStorage:", e);
  }
  
  return defaultOverrides;
}

/**
 * Save overrides to localStorage
 */
function saveToStorage(overrides: ThemeOverrides): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.warn("Failed to save theme overrides to localStorage:", e);
  }
}

/**
 * Apply overrides to CSS variables on the document root
 */
function applyToDOM(overrides: ThemeOverrides): void {
  if (typeof window === "undefined") return;
  
  const root = document.documentElement;
  const isDark = root.classList.contains("dark");
  const activeOverrides = isDark ? overrides.dark : overrides.light;
  
  // Apply each override as a CSS variable
  Object.entries(activeOverrides).forEach(([token, value]) => {
    root.style.setProperty(token, value);
  });
}

/**
 * Remove all custom CSS variable overrides from DOM
 */
function clearFromDOM(overrides: ThemeOverrides): void {
  if (typeof window === "undefined") return;
  
  const root = document.documentElement;
  
  // Remove all overridden tokens
  [...Object.keys(overrides.light), ...Object.keys(overrides.dark)].forEach((token) => {
    root.style.removeProperty(token);
  });
}

export function useThemeOverrides() {
  const [overrides, setOverrides] = React.useState<ThemeOverrides>(defaultOverrides);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = loadFromStorage();
    setOverrides(stored);
    applyToDOM(stored);
    setIsLoaded(true);
  }, []);

  // Listen for theme changes to re-apply overrides
  React.useEffect(() => {
    if (!isLoaded) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          applyToDOM(overrides);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, [overrides, isLoaded]);

  /**
   * Set a single token value
   */
  const setToken = React.useCallback((token: string, value: string, mode: "light" | "dark") => {
    setOverrides((prev) => {
      const next = {
        ...prev,
        [mode]: {
          ...prev[mode],
          [token]: value,
        },
      };
      saveToStorage(next);
      applyToDOM(next);
      return next;
    });
  }, []);

  /**
   * Get a token value (returns override if exists, otherwise undefined)
   */
  const getToken = React.useCallback((token: string, mode: "light" | "dark"): string | undefined => {
    return overrides[mode][token];
  }, [overrides]);

  /**
   * Remove a single token override
   */
  const removeToken = React.useCallback((token: string, mode: "light" | "dark") => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[mode][token];
      saveToStorage(next);
      
      // Remove from DOM
      if (typeof window !== "undefined") {
        document.documentElement.style.removeProperty(token);
      }
      
      return next;
    });
  }, []);

  /**
   * Reset all overrides to defaults
   */
  const resetAll = React.useCallback(() => {
    clearFromDOM(overrides);
    setOverrides(defaultOverrides);
    saveToStorage(defaultOverrides);
  }, [overrides]);

  /**
   * Get all overrides for export
   */
  const getAllOverrides = React.useCallback(() => {
    return overrides;
  }, [overrides]);

  /**
   * Check if there are any overrides
   */
  const hasOverrides = React.useMemo(() => {
    return Object.keys(overrides.light).length > 0 || Object.keys(overrides.dark).length > 0;
  }, [overrides]);

  /**
   * Export overrides as Style Dictionary compatible JSON
   */
  const exportAsJSON = React.useCallback((): string => {
    const styleDictionary: Record<string, unknown> = { wex: {} };
    
    // Process light mode tokens
    Object.entries(overrides.light).forEach(([token, value]) => {
      const cleanToken = token.replace("--wex-", "").replace(/-/g, ".");
      setNestedProperty(styleDictionary.wex as Record<string, unknown>, cleanToken, {
        value,
        type: "color",
      });
    });
    
    // Process dark mode tokens (with .dark suffix)
    Object.entries(overrides.dark).forEach(([token, value]) => {
      const cleanToken = token.replace("--wex-", "").replace(/-/g, ".") + ".dark";
      setNestedProperty(styleDictionary.wex as Record<string, unknown>, cleanToken, {
        value,
        type: "color",
      });
    });
    
    return JSON.stringify(styleDictionary, null, 2);
  }, [overrides]);

  return {
    overrides,
    isLoaded,
    setToken,
    getToken,
    removeToken,
    resetAll,
    getAllOverrides,
    hasOverrides,
    exportAsJSON,
  };
}

/**
 * Helper to set nested property by dot-notation path
 */
function setNestedProperty(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  
  current[keys[keys.length - 1]] = value;
}

