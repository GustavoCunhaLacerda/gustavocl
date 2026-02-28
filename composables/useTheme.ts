const THEME_KEY = 'preferred-theme'

export function useTheme() {
  const theme = useState<'dark' | 'light'>('theme', () => 'dark')

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    apply(theme.value)
    try { localStorage.setItem(THEME_KEY, theme.value) } catch {}
  }

  const apply = (t: 'dark' | 'light') => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', t)
    }
  }

  const init = () => {
    if (!import.meta.client) return
    try {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'light' || stored === 'dark') {
        theme.value = stored
      } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        theme.value = 'light'
      }
    } catch {}
    apply(theme.value)
  }

  return { theme, toggle, init }
}
