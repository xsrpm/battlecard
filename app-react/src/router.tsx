import { createBrowserRouter } from 'react-router-dom'
import Welcome from './pages/Welcome'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />
  }
])
