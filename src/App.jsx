import HomePage from './pages/HomePage'
import ThemeToggle from './components/ThemeToggle'
import { useTheme } from './theme/theme'

function App() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <>
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      <HomePage />
    </>
  )
}

export default App
