
import { useState } from 'react'
import './App.css'
import Welcome from './pages/Welcome'

function App (): JSX.Element {
  const [actualPage, setActualPage] = useState('welcome')

  const changeActualPage = (pageName) => {
    setActualPage(pageName)
  }

  return (
    <div className="App">
      {
        actualPage === 'welcome' && <Welcome/>
      }
      {
        actualPage === 'welcome' && <Welcome />
      }
    </div>
  )
}

export default App
