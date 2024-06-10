/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import { ThemeProvider } from './providers/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'

const queryClient = new QueryClient();

const root = document.getElementById('root')

render(() => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider mode='dark'>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
), root!)
