import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

import {
  Box,
  Button,
  Flex,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Progress,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Select,
  Stack,
  Text,
  FormControl,
} from '@chakra-ui/react'
import { InfoOutlineIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { useParams, useRouteMatch, useHistory } from 'react-router-dom'

import api from '../utils/api'
import {
  fetchProject,
  updateProject,
  createProject,
} from '../store/projects/effects'
import { fetchCredentials } from '../store/credentials/effects'
import MessageModal from './MessageModal'
import './ProjectSettings.scss'
import FieldsForm from './FieldsForm'

interface Project {
  name: string
  id?: string
  running: boolean
  query?: {
    q: string
    credentials: string
  }
  data_fields?: {
    on_intervention: {
      query?: string
      tweet_fields: any
      user_fields: any
    }
  }
  queryTweets?: any
}

const newDefaultProject = {
  name: 'New Project',
  running: false,
  data_fields: {
    on_intervention: {
      tweet_fields: [],
      user_fields: [],
    },
  },
}

const ProjectSettings = () => {
  const [project, setProject] = useState<Project>(newDefaultProject)
  const [credentials, setCredentials] = useState([])
  const [interventionData, setInterventionData] = useState({
    tweet: [],
    user: [],
  })
  const [isValidating, setIsValidating] = useState(false)
  const [messageModalData, setMessageModalData] = useState({
    isOpen: false,
    title: '',
    text: '',
    isConfirm: false,
    onConfirm: undefined,
  })

  const { register, handleSubmit, errors, setValue, watch } = useForm()
  const dispatch = useDispatch()
  const { path } = useRouteMatch()
  const { id } = useParams()
  const history = useHistory()
  const watchCredentials = watch('credentials', 'default')
  const query = watch('q', '')

  const getTypeOfCredentials = () => {
    const selectedCredential = credentials.filter(
      (cred) => cred.id === watchCredentials
    )
    if (selectedCredential.length && selectedCredential[0].type) {
      return selectedCredential[0].type
    }
    return 'standard'
  }

  const getQueryMaxLength = getTypeOfCredentials() === 'academic' ? 1024 : 512

  useEffect(() => {
    if (path === '/create-project') {
      setProject(newDefaultProject)
      setValue('name', newDefaultProject.name)
    }
    const getData = async () => {
      const projectData = await dispatch<any>(fetchProject(id))
      if (projectData) {
        setProject(projectData)
        setInterventionData({
          tweet: projectData.data_fields.on_intervention.tweet_fields,
          user: projectData.data_fields.on_intervention.user_fields,
        })
        setValue('name', projectData.name)
        setValue('q', projectData.query.q)
        setValue('credentials', projectData.query.credentials)
      }
      const credentialsData = await dispatch<any>(fetchCredentials())
      if (credentialsData) setCredentials(credentialsData)
    }
    getData()
  }, [id])

  const validateName = (name) => {
    if (name.length < 3) return 'Name must have at least 3 characters.'
    if (name.length >= 500) return 'Name must have at least 3 characters.'
    return true
  }

  const validateCredentials = (c) => {
    if (!c) return 'Please select account credentials.'
    return true
  }

  const validateQuery = (query) => {
    if (!query) return 'Please enter a query'
    if (query.length > getQueryMaxLength)
      return `The maximum amount of characters for this query is ${getQueryMaxLength}.`
    return true
  }

  const composeDataFieldQuery = () => {
    let fieldsQuery = ''
    if (interventionData.tweet.length) {
      let tweetFields = '&tweet.fields='
      interventionData.tweet.forEach((field) => (tweetFields += `${field},`))
      fieldsQuery += tweetFields.slice(0, -1) // remove last tailing coma
    }
    if (interventionData.user.length) {
      let userFields = '&expansions=author_id&user.fields='
      interventionData.user.forEach((field) => (userFields += `${field},`))
      fieldsQuery += userFields.slice(0, -1) // remove last tailing coma
    }
    return fieldsQuery
  }

  const onSubmit = async (data) => {
    const projectData = {
      name: data.name,
      id: project.id,
      running: project.running,
      query: {
        q: data.q,
        credentials: data.credentials,
      },
      data_fields: {
        on_intervention: {
          query: composeDataFieldQuery(),
          tweet_fields: interventionData.tweet,
          user_fields: interventionData.user,
        },
      },
    }
    setIsValidating(true)
    const test = await api.projects.testRules(project.id, {
      query: data.q,
      credentialId: data.credentials,
    })
    setIsValidating(false)

    if (test.error) {
      setMessageModalData({
        isOpen: true,
        title: 'Query Error',
        text: test.error[0].details,
        isConfirm: false,
        onConfirm: undefined,
      })
      return
    }
    if (path === '/create-project') {
      const newProject = await dispatch<any>(createProject(projectData))
      history.push(`/project/${newProject.id}`)
      return
    }
    await dispatch<any>(updateProject(projectData))
    history.push(`/project/${id}`)
  }

  const onError = (data) => console.log(data)

  return (
    <Box mx="4" h="100%">
      <MessageModal
        isOpen={messageModalData.isOpen}
        onClose={() =>
          setMessageModalData({ ...messageModalData, isOpen: false })
        }
        title={messageModalData.title}
        text={messageModalData.text}
        isConfirm={messageModalData.isConfirm}
        onConfirm={messageModalData.onConfirm}
      />
      <Text mb="1rem" fontSize="3xl" fontWeight="300">
        {path === '/create-project'
          ? 'Create New Project'
          : `Project Settings for ${project.name}`}
      </Text>

      <form
        className="project-settings"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Stack>
          <Text mt="1rem" mb="0.5rem" fontSize="2xl" fontWeight="300">
            General Settings
          </Text>
          <FormControl isInvalid={errors.name}>
            <FormLabel>Project Name</FormLabel>
            <Input
              focusBorderColor="twitter.400"
              name="name"
              ref={register({ validate: validateName })}
            />
            <FormErrorMessage>
              {errors.name && 'Name is required.'}
            </FormErrorMessage>
          </FormControl>

          <Box>
            <FormControl isInvalid={errors.credentials}>
              <FormLabel>API Credentials</FormLabel>
              <Select
                name="credentials"
                ref={register({ validate: validateCredentials })}
              >
                {credentials.map((credential) => (
                  <option value={credential.id}>{credential.name}</option>
                ))}
              </Select>
              <FormHelperText>
                <Box px={4}>
                  Select the account credentials based on which the requests are
                  made. Depending on the access type of the credentials,
                  different request features are available.
                </Box>
              </FormHelperText>
              <FormErrorMessage>
                {errors.credentials && errors.credentials.message}
              </FormErrorMessage>
            </FormControl>
          </Box>

          <Text mt="3rem!important" mb="0.5rem" fontSize="2xl" fontWeight="300">
            Query Parameters
          </Text>
          <Box className="query-parameter-form-fields">
            <Stack spacing={7}>
              <Box>
                <FormControl isInvalid={errors.q}>
                  <Flex align="center">
                    <FormLabel m={0}>Query Rule</FormLabel>
                    <Popover placement="right" colorScheme="twitter">
                      <PopoverTrigger>
                        <Button>
                          <InfoOutlineIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Query Info</PopoverHeader>
                        <PopoverBody>
                          <Text>
                            A tutorial on how to build queries can be found at{' '}
                            <Link
                              href="https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-query"
                              isExternal
                            >
                              Twitter Documentation{' '}
                              <ExternalLinkIcon mx="2px" />
                            </Link>{' '}
                            A comprehensive list of operators can be found{' '}
                            <Link
                              href="https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule#list"
                              isExternal
                            >
                              here <ExternalLinkIcon mx="2px" />
                            </Link>{' '}
                          </Text>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Flex>
                  <Input
                    focusBorderColor="twitter.400"
                    name="q"
                    ref={register({
                      validate: validateQuery,
                    })}
                  />
                  <FormErrorMessage>
                    {errors.q && errors.q.message}
                  </FormErrorMessage>
                  <FormHelperText>
                    <Box maxW="600px">
                      {`Due to the type of credentials, the length of the query is
                      limited to ${getQueryMaxLength} characters.`}
                      <Flex align="center">
                        {`Already used: ${query.length}/${getQueryMaxLength}`}
                        <Box
                          m={2}
                          p="0.1rem"
                          border="1px solid lightgrey"
                          colorTheme="twitter"
                          borderRadius="0.5rem"
                          minW="300px"
                        >
                          <Progress
                            borderRadius="0.5rem"
                            value={query.length}
                            max={getQueryMaxLength}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  </FormHelperText>
                </FormControl>
              </Box>
              <Text mt="3rem!important" mb="0" fontSize="2xl" fontWeight="300">
                Data to save on intervention
              </Text>
              <FieldsForm
                tweetFields={interventionData.tweet}
                userFields={interventionData.user}
                setTweetFields={(e) =>
                  setInterventionData({ tweet: e, user: interventionData.user })
                }
                setUserFields={(e) =>
                  setInterventionData({
                    tweet: interventionData.tweet,
                    user: e,
                  })
                }
              />
            </Stack>
          </Box>

          <Flex mt={8} direction="row" justify="center">
            <Button
              mx="0.2rem"
              my="1rem"
              isLoading={isValidating}
              loadingText="Validating"
              variant="outline"
              colorScheme="twitter"
              type="submit"
            >
              <Text>Submit</Text>
            </Button>
            <Button
              mx="0.2rem"
              my="1rem"
              variant="outline"
              colorScheme="orange"
              onClick={history.goBack}
            >
              <Text>Cancel</Text>
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  )
}

export default ProjectSettings
