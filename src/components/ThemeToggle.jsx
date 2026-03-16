function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
      <path d="M12 2.8V5.1" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 18.9V21.2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2.8 12H5.1" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.9 12H21.2" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5.5 5.5L7.1 7.1" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.9 16.9L18.5 18.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.9 7.1L18.5 5.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5.5 18.5L7.1 16.9" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M19.1 13.5C18.2 17.1 14.9 19.7 11 19.7C6.4 19.7 2.7 16 2.7 11.4C2.7 7.5 5.3 4.2 8.9 3.3C7.9 4.6 7.3 6.2 7.3 8C7.3 12.4 10.9 16 15.3 16C17.1 16 18.7 15.4 20 14.4L19.1 13.5Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="theme-toggle fixed right-4 bottom-4 z-[60] flex items-center gap-2 rounded-full px-3 py-2 text-[0.8rem] font-semibold shadow-sm transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle__icon grid size-4 place-items-center rounded-full [&_svg]:size-4 [&_svg]:stroke-current">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

export default ThemeToggle
