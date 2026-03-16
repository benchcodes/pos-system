import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'pos-system-theme'

function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme() {
  if (typeof window === 'undefined') {
    return null
  }

  const value = window.localStorage.getItem(THEME_STORAGE_KEY)
  return value === 'dark' || value === 'light' ? value : null
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') {
    return
  }

  const nextTheme = theme === 'dark' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', nextTheme)
}

export function useTheme() {
  const [theme, setTheme] = useState(() => getStoredTheme() ?? getSystemTheme())

  useEffect(() => {
    applyTheme(theme)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    }
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  }
}
