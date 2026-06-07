import { useState, useEffect } from 'react'

/**
 * Returns a debounced copy of `value` that only updates after `delay`
 * milliseconds have elapsed since the last change.
 *
 * The timer is cleared and restarted on every value change, so rapid
 * input (e.g. typing in a price field) produces only one downstream
 * update per pause rather than one per keystroke.
 *
 * @template T
 * @param {T} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {T} The debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
