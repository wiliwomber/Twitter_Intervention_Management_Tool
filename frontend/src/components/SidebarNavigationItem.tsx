import React from 'react'
import { NavLink } from 'react-router-dom'
import { Text } from '@chakra-ui/react'
import './Sidebar.scss'

type Props = {
  project: {
    name: string;
    id: string;
  }
}

const SidebarNavigationItem = ({ project }: Props) => {
  return (
    <NavLink
      activeClassName="is-active"
      className="sidebar-lists-item"
      tabIndex={0}
      to={`/project/${project.id}`}
    >
      <Text mb="0.5rem" fontSize="lg" className="sidebar-lists-item-title">
        {project.name}
      </Text>
    </NavLink>
  )
}

export default SidebarNavigationItem
