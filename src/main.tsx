import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js'
import App from './App'
import './index.css'

// Make MD3's typescale classes (md-typescale-*) available app-wide.
if (typescaleStyles.styleSheet) {
  document.adoptedStyleSheets.push(typescaleStyles.styleSheet)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
