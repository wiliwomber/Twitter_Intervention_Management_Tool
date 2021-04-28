import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useHistory } from 'react-router-dom'
import { Button, Text, Flex, Spacer } from '@chakra-ui/react'
import { AddIcon, RepeatIcon } from '@chakra-ui/icons'
import SidebarNavigationItem from './SidebarNavigationItem'
import { fetchProjects } from '../store/projects/effects'
import './Sidebar.scss'
import api from '../utils/api'

const Sidebar = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  useEffect(() => {
    dispatch<any>(fetchProjects())
  }, [])
  const projects = useSelector((state:any) => state.projects)
  
  const resetProjects = async () => {
    await api.projects.reset()
    history.push('/')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Text fontWeight="300" fontSize="3xl">
          Twitter Intervention Management Tool
        </Text>
      </div>
      <Flex alignItems="center">
        <Text fontWeight="300" fontSize="xl" ml="1.3rem">
          Projects
        </Text>
        <Spacer />
        <Link to="/create-project">
          <Button
            className="add-project-button"
            size="sm"
            variant="outline"
            mr="0.5rem"
          >
            <AddIcon />
          </Button>
        </Link>
        <Button
          className="add-project-button"
          size="sm"
          variant="outline"
          onClick={resetProjects}
          mr="1rem"
        >
          <RepeatIcon />
        </Button>
      </Flex>

      <div className="sidebar-menu">
        {projects.map((project) => (
          <SidebarNavigationItem key={project.id} project={project} />
        ))}
      </div>
      <NavLink
        activeClassName="is-active"
        className="sidebar-responses-item"
        tabIndex={0}
        to="/interventions"
      >
        <Text
          fontWeight="300"
          mt="2rem"
          ml="1rem"
          fontSize="xl"
          className="sidebar-lists-item-title"
        >
          Interventions
        </Text>
      </NavLink>
      <NavLink
        activeClassName="is-active"
        className="sidebar-credentials-item"
        tabIndex={0}
        to="/credentials"
      >
        <Text
          fontWeight="300"
          mt="2rem"
          ml="1rem"
          fontSize="xl"
          className="sidebar-lists-item-title"
        >
          Credentials
        </Text>
      </NavLink>
    </div>
  )
}

export default Sidebar
