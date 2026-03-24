import './styles/main.scss';
import { createRoot } from 'react-dom/client'
import { ShapeProvider } from './ShapeProvider.tsx'
import { StrictMode } from 'react'
import { ThemeProvider } from '@syren-dev-tech/confects/providers';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ShapeProvider>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </ShapeProvider>
    </StrictMode>,
)
