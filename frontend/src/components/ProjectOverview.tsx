import React, { useState, useEffect } from 'react'
import { useParams, NavLink, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { orderBy } from 'lodash'
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Spacer,
  Text,
} from '@chakra-ui/react'
import {
  EditIcon,
  DeleteIcon,
  DownloadIcon,
  RepeatIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'
import {
  fetchProject,
  updateProject,
  deleteProject,
} from '../store/projects/effects'
import { fetchProjectTweets } from '../store/tweets/effects'
import api from '../utils/api'
import TweetEntry from './TweetEntry'
import MessageModal from './MessageModal'
import ExportModal from './ExportModal'
import './ProjectOverview.scss'

interface Project {
  name: string
  id?: string
  running: boolean
  query?: {
    q: string
    credentials: string
  }
  responses: any
}

const ProjectOverview: React.FC = () => {
  const [project, setProject] = useState(undefined)
  const [tweets, setTweets] = useState([])
  const [statistics, setStatistics] = useState({
    all: 0,
    outstanding: 0,
    interventions: 0,
    ignored: 0,
  })
  const [displayedTweets, setDisplayedTweets] = useState([])
  const [triggerFetch, setTriggerFetch] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [messageModalData, setMessageModalData] = useState({
    isOpen: false,
    title: '',
    text: '',
    isConfirm: false,
    onConfirm: undefined,
  })
  const dispatch = useDispatch()
  const history = useHistory()
  const { id } = useParams()

  const getStatistics = () => {
    const all = tweets.length
    let outstanding = 0
    let interventions = 0
    let ignored = 0
    tweets.forEach((tweet) => {
      switch (tweet.has_intervention) {
        case undefined:
          outstanding += 1
          break
        case false:
          ignored += 1
          break
        case true:
          interventions += 1
          break
        default:
          break
      }
    })
    setStatistics({ all, outstanding, interventions, ignored })
  }

  const getDisplayedTweets = () => {
    let counter = 0
    const filteredTweets = tweets.filter((tweet) => {
      if (tweet.has_intervention === undefined && counter < 20) {
        counter += 1
        return tweet
      }
    })
    setDisplayedTweets(filteredTweets)
  }

  useEffect(() => {
    const getTweets = async () => {
      const newTweets = await dispatch<any>(fetchProjectTweets(id))
      const sortedTweets = orderBy(newTweets, ['id'], ['asc'])
      setTweets(sortedTweets)
      getStatistics()
      if (!displayedTweets.length) {
        getDisplayedTweets()
      }
    }
    getTweets()
  }, [triggerFetch])

  useEffect(() => {
    const fetchTweetsLoop = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (project && !project.running) {
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
      setTriggerFetch(!triggerFetch)
    }
    fetchTweetsLoop()
  }, [triggerFetch])

  useEffect(() => {
    const getProject = async () => {
      const data = await dispatch<any>(fetchProject(id))
      if (data) setProject(data)
    }
    setTriggerFetch(!triggerFetch)
    setProject(undefined)
    setTweets([])
    getProject()
  }, [id])

  const removeProject = async () => {
    await dispatch<any>(deleteProject(id))
    setMessageModalData({
      ...messageModalData,
      isOpen: false,
      onConfirm: undefined,
    })
    history.push('/')
  }

  const handleDeleteProject = () => {
    setMessageModalData({
      isOpen: true,
      title: 'Confirm Delete',
      text:
        'Are you sure that you want to delete this project, along with ALL connected data? Tweets and interventions collected from this project will be unreversibly deleted.',
      isConfirm: true,
      onConfirm: removeProject,
    })
  }

  const handleRunProject = async () => {
    let updatedProject
    if (project.running) {
      updatedProject = await api.projects.stop(id)
    } else {
      updatedProject = await api.projects.start(id)
    }
    if (updatedProject.error) {
      setMessageModalData({
        isOpen: true,
        title: 'Error',
        text: updatedProject.error,
        isConfirm: false,
        onConfirm: 'undefined',
      })
      return
    }
    await dispatch<any>(updateProject(updatedProject))
    setProject(updatedProject)
  }
  return (
    <>
      <MessageModal
        isOpen={messageModalData.isOpen}
        onClose={() => {
          setMessageModalData({
            ...messageModalData,
            isOpen: false,
            onConfirm: undefined,
          })
        }}
        title={messageModalData.title}
        text={messageModalData.text}
        isConfirm={messageModalData.isConfirm}
        onConfirm={messageModalData.onConfirm}
      />
      <ExportModal
        id={id}
        name={project?.name}
        isOpen={showExport}
        onClose={() => {
          setShowExport(false)
        }}
      />
      {project === undefined ? (
        <Flex h="100%" w="100%" alignItems="center" justifyContent="center">
          <Text fontSize="4xl" fontWeight="300">
            Loading...
          </Text>
        </Flex>
      ) : (
        <div>
          <Flex>
            <Box>
              <Text fontSize="3xl" fontWeight="300">
                {project.name}
              </Text>
              <Flex>
                <ChevronRightIcon
                  m="auto 0.3rem"
                  boxSize="1.5rem"
                  color="twitter.500"
                />
                <Box>
                  <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                    <GridItem colSpan={1} mr="1.5rem">
                      <Text>{`Tweets collected: ${statistics.all}`}</Text>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <Text>{`Interventions: ${statistics.interventions}`}</Text>
                    </GridItem>
                    <GridItem colSpan={1} mr="1.5rem">
                      <Text>{`To be processed: ${statistics.outstanding}`}</Text>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <Text>{`Ignored: ${statistics.ignored}`}</Text>
                    </GridItem>
                  </Grid>
                </Box>
              </Flex>
            </Box>
            <Spacer />
            <Flex justify="end">
              {!project.running && (
                <Flex>
                  <Button
                    m="0.2rem"
                    variant="outline"
                    colorScheme="red"
                    onClick={handleDeleteProject}
                    leftIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                  <Button
                    m="0.2rem"
                    loadingText="Preparing"
                    variant="outline"
                    colorScheme="twitter"
                    onClick={() => setShowExport(true)}
                    leftIcon={<DownloadIcon />}
                  >
                    Export
                  </Button>
                  <NavLink to={`/project-settings/${id}`}>
                    <Button
                      m="0.2rem"
                      variant="outline"
                      colorScheme="twitter"
                      leftIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </NavLink>
                </Flex>
              )}
              <Button
                m="0.2rem"
                variant="outline"
                colorScheme="twitter"
                onClick={handleRunProject}
              >
                {project.running ? 'Stop Fetching' : 'Start Fetching'}
              </Button>
            </Flex>
          </Flex>
          <Grid
            mt="2rem"
            gap={4}
            fontWeight="200"
            fontSize="xl"
            templateColumns="repeat(12, 1fr)"
          >
            <GridItem colSpan={4}>
              <Text fontSize="md">Tweet</Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text fontSize="md">Author</Text>
            </GridItem>
            <GridItem colSpan={3}>
              <Text fontSize="md">Profile Description</Text>
            </GridItem>
            <GridItem m="auto" colSpan={4}>
              <Text fontSize="md">Intervention</Text>
            </GridItem>
          </Grid>
          <Divider
            h="2px"
            mt="0.4rem"
            mb="0.8rem"
            borderRadius="1rem"
            bg="#55acee"
            opacity="1"
          />
          {tweets.length > 0 ? (
            <>
              <Box h="75vh" overflow="auto">
                {displayedTweets.map((tweet) => (
                  <TweetEntry key={tweet.id} tweet={tweet} />
                ))}
                <Flex justify="center">
                  <Button
                    m="0.2rem"
                    mt="1rem"
                    variant="outline"
                    colorScheme="twitter"
                    leftIcon={<RepeatIcon />}
                    onClick={getDisplayedTweets}
                  >
                    More Tweets
                  </Button>
                </Flex>
              </Box>
            </>
          ) : (
            <Box align="center">
              <Text mt="3rem">No Tweets filtered so far</Text>
            </Box>
          )}
        </div>
      )}
    </>
  )
}

export default ProjectOverview
