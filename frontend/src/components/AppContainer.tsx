import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './AppContainer.scss'
import ProjectSettings from './ProjectSettings'
import ProjectOverview from './ProjectOverview'
import Responses from './Responses'
import Credentials from './Credentials'
import Intro from './Intro'

const AppContainer = () => {
  return (
    <div className="app-container">
      <Switch>
        <Route path="/" exact component={Intro} />
        <Route path="/create-project">
          <ProjectSettings />
        </Route>
        <Route path="/interventions">
          <Responses />
        </Route>
        <Route path="/credentials">
          <Credentials />
        </Route>
        <Route path="/project/:id">
          <ProjectOverview />
        </Route>
        <Route path="/project-settings/:id">
          <ProjectSettings />
        </Route>
      </Switch>
    </div>
  )
}

export default AppContainer
