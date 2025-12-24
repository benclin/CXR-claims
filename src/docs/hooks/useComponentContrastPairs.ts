/**
 * useComponentContrastPairs Hook
 *
 * Returns live contrast ratio data for a specific component's color pairings.
 * Filters CONTRAST_PAIRS by registryKey and computes ratios in real-time.
 */

import * as React from "react";
import {
  CONTRAST_PAIRS,
  getContrastData,
  type ContrastPair,
  type ContrastRating,
} from "@/docs/utils/contrast";

// ============================================================================
// Types
// ============================================================================

export interface ContrastPairResult {
  /** The contrast pair definition */
  pair: ContrastPair;
  /** Computed contrast ratio (e.g., 7.2) */
  ratio: number;
  /** WCAG rating: AAA, AA, AA-large, or Fail */
  rating: ContrastRating;
  /** Whether this pair passes WCAG AA (4.5:1) */
  passes: boolean;
}

export interface ComponentContrastState {
  /** All contrast pair results for this component */
  results: ContrastPairResult[];
  /** Number of pairs that pass */
  passCount: number;
  /** Number of pairs that fail */
  failCount: number;
  /** Total number of pairs checked */
  totalCount: number;
  /** Whether all pairs pass */
  allPass: boolean;
  /** The lowest (worst) contrast ratio among all pairs */
  lowestRatio: number | null;
  /** The rating of the lowest ratio pair */
  lowestRating: ContrastRating | null;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Get live contrast ratio data for a component's color pairings
 *
 * @param registryKey - The component's registry key (e.g., "button", "badge")
 * @returns ComponentContrastState with computed ratios and pass/fail status
 *
 * @example
 * ```tsx
 * const contrastData = useComponentContrastPairs("button");
 * 
 * if (contrastData.allPass) {
 *   // All color pairs pass WCAG AA
 * }
 * 
 * // Show lowest ratio
 * console.log(`Lowest: ${contrastData.lowestRatio}:1 (${contrastData.lowestRating})`);
 * ```
 */
export function useComponentContrastPairs(
  registryKey: string
): ComponentContrastState {
  const [results, setResults] = React.useState<ContrastPairResult[]>([]);

  // Filter pairs for this component
  const componentPairs = React.useMemo(() => {
    return CONTRAST_PAIRS.filter((pair) => pair.registryKey === registryKey);
  }, [registryKey]);

  // Compute contrast ratios
  const computeRatios = React.useCallback(() => {
    const computed: ContrastPairResult[] = [];

    for (const pair of componentPairs) {
      const data = getContrastData(pair.foreground, pair.background);

      if (data) {
        computed.push({
          pair,
          ratio: data.ratio,
          rating: data.rating,
          passes: data.rating !== "Fail",
        });
      }
    }

    setResults(computed);
  }, [componentPairs]);

  // Initial computation and observe for theme changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial computation
    computeRatios();

    // Watch for theme/style changes
    const observer = new MutationObserver(() => {
      requestAnimationFrame(computeRatios);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [computeRatios]);

  // Compute derived state
  const passCount = results.filter((r) => r.passes).length;
  const failCount = results.filter((r) => !r.passes).length;
  const totalCount = results.length;
  const allPass = failCount === 0 && totalCount > 0;

  // Find lowest ratio
  const lowestResult = results.length > 0
    ? results.reduce((min, r) => (r.ratio < min.ratio ? r : min), results[0])
    : null;

  return {
    results,
    passCount,
    failCount,
    totalCount,
    allPass,
    lowestRatio: lowestResult?.ratio ?? null,
    lowestRating: lowestResult?.rating ?? null,
  };
}

/**
 * Format a contrast ratio for display
 * @param ratio - The contrast ratio number
 * @returns Formatted string like "7.2:1"
 */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(1)}:1`;
}

