import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from './pages/ErrorPage'
import Hall from './pages/Hall'
import Welcome from './pages/Welcome'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
    errorElement: <ErrorPage />
  },
  {
    path: '/hall',
    element: <Hall />,
    errorElement: <ErrorPage />
  }
])
