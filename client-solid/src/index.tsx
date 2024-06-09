/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { ThemeProvider } from './providers/ThemeProvider'

const root = document.getElementById('root')

render(() => (
  <ThemeProvider mode='dark'>
    <App />
  </ThemeProvider>
), root!)
