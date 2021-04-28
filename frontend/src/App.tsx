import React from 'react'
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './App.scss'
import Sidebar from './components/Sidebar'
import AppContainer from './components/AppContainer'

const App = () => (
  <div className="App">
    <Sidebar />
    <AppContainer />
  </div>
)

export default App
