import React, { useState } from "react"
import "react-bulma-components/dist/react-bulma-components.min.css"
import "./App.scss"
import Sidebar from "./components/Sidebar"
import AppContainer from "./components/AppContainer"
import { Login } from "./components/Login"
import cookie from "cookie"

const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    cookie.parse(document.cookie).authorized || false
  )
  return !isAuthorized ? (
    <Login handleLogin={setIsAuthorized} />
  ) : (
    <div className="App">
      <Sidebar />
      <AppContainer />
    </div>
  )
}

export default App
