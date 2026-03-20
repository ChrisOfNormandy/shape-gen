import { createRoot } from 'react-dom/client'
import { ShapeProvider } from './ShapeProvider.tsx'
import { StrictMode } from 'react'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ShapeProvider>
            <App />
        </ShapeProvider>
    </StrictMode>,
)
