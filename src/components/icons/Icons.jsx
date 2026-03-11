// All SVG icon components in one file.
// To add a new icon, create a new function and export it below.

export function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M3.5 5H5.7L7.5 14H17.8L19.8 8H8.8" />
      <circle cx="9.2" cy="18.2" r="1.1" />
      <circle cx="16.6" cy="18.2" r="1.1" />
    </svg>
  )
}

export function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 3.8L5 7.8L12 11.8L19 7.8L12 3.8Z" />
      <path d="M5 8V16L12 20L19 16V8" />
      <path d="M12 12V20" />
    </svg>
  )
}

export function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M12 3L18.5 5.5V11.4C18.5 15.3 15.8 18.7 12 20C8.2 18.7 5.5 15.3 5.5 11.4V5.5L12 3Z" />
    </svg>
  )
}
