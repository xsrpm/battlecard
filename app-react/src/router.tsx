import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from './pages/ErrorPage'
import Welcome from './pages/Welcome'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
    errorElement: <ErrorPage />
  }
])
