import { createSelector } from 'reselect'
import { find } from 'lodash'

const getLocalState = (state) => state.bots

const makeSelectProject = () => createSelector(
  getLocalState,
  (_, props) => props,
  (projects, id) => find(projects, ['id', id]),
)

export default makeSelectProject
