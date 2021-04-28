import React, { useEffect, useState } from 'react'
import { find } from 'lodash'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useDispatch } from 'react-redux'
import { fetchCredentials } from '../store/credentials/effects'

import {
  createResponse,
  fetchResponses,
  deleteResponse,
  updateResponse,
} from '../store/responses/effects'

const ResponseForm = ({ setShowForm }) => {
  const { errors, handleSubmit, register } = useForm()
  const [credentials, setCredentials] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    const getData = async () => {
      const credentialsData = await dispatch<any>(fetchCredentials())
      if (credentialsData) setCredentials(credentialsData)
    }
    getData()
  }, [])

  const onSubmit = async (data) => {
    const selectedCredential = credentials.filter(
      ({ id }) => id === data.credential_id
    )
    const responseData = {
      ...data,
      credential_name: selectedCredential[0].name,
    }
    await dispatch<any>(createResponse(responseData))
    setShowForm(false)
  }

  const validateCredentials = (c) => {
    if (!c) return 'Please select account credentials.'
    return true
  }

  const validateText = (text) => {
    if (!text) return 'Please enter a response.'
    if (text.length > 280)
      return 'The maximum response length is 280 characters'
    return true
  }

  const handleCancel = () => {
    setShowForm(false)
  }

  return (
    <Box mt="2rem" height="100%" overflow="auto">
      <Text fontSize="2xl" fontWeight="300">
        Interventions
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack mt="1rem">
          <Box>
            <FormControl isInvalid={errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                focusBorderColor="twitter.400"
                name="name"
                placeholder="Required"
                ref={register({ required: true, maxLength: 50 })}
              />
              <FormErrorMessage>This field is required</FormErrorMessage>
              <FormHelperText>
                <Box px={4}>
                  The assigned name is used to choose a response in the project
                  tab.
                </Box>
              </FormHelperText>
            </FormControl>
          </Box>

          <Box>
            <FormControl isInvalid={errors.text}>
              <FormLabel>Text</FormLabel>
              <Input
                focusBorderColor="twitter.400"
                name="text"
                placeholder="Required"
                ref={register({ validate: validateText })}
              />
              <FormErrorMessage>
                {errors.text && errors.text.message}
              </FormErrorMessage>
            </FormControl>
          </Box>

          <Box>
            <FormControl isInvalid={errors.credential_id}>
              <FormLabel>API Credentials</FormLabel>
              <Select
                name="credential_id"
                ref={register({ validate: validateCredentials })}
              >
                {credentials.map((credential) => (
                  <option value={credential.id}>{credential.name}</option>
                ))}
              </Select>
              <FormHelperText>
                <Box px={4}>
                  Select the account credentials based on which the responses
                  are made.
                </Box>
              </FormHelperText>
              <FormErrorMessage>
                {errors.credential_id && errors.credential_id.message}
              </FormErrorMessage>
            </FormControl>
          </Box>

          <Flex mt={8} direction="row" justify="center">
            <Button
              mx={2}
              variant="outline"
              colorScheme="twitter"
              type="submit"
            >
              <Text>Submit</Text>
            </Button>
            <Button
              mx={2}
              variant="outline"
              colorScheme="red"
              onClick={handleCancel}
            >
              <Text>Cancel</Text>
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  )
}
type ResponseProps = {
  response: {
    id: string
    name: string
    text: string
    credential_id: string
    credential_name: string
  }
  removeResponse: any
}
const ResponseEntry = (props: ResponseProps) => {
  const { response, removeResponse } = props
  return (
    <>
      <Grid gap={4} templateColumns="repeat(7, 1fr)">
        <GridItem m="auto 0" colSpan={1}>
          <Text>{response.name}</Text>
        </GridItem>
        <GridItem m="auto 0" colSpan={4}>
          <Text>{response.text}</Text>
        </GridItem>
        <GridItem m="auto 0" colSpan={1}>
          <Text>{response.credential_name}</Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Button
            variant="outline"
            colorScheme="red"
            onClick={() => removeResponse(response.id)}
          >
            <DeleteIcon />
          </Button>
        </GridItem>
      </Grid>
      <Divider mx="0.1rem" my="0.5rem" h="1px" bg="#55acee" />
    </>
  )
}

const Responses = () => {
  const dispatch = useDispatch()
  const [showForm, setShowForm] = useState(false)
  const [responses, setResponses] = useState([])
  const [credentials, setCredentials] = useState([])

  const removeResponse = (id) => {
    dispatch(deleteResponse(id))
    const updatedResponses = responses.filter((response) => response.id !== id)
    setResponses(updatedResponses)
  }

  useEffect(() => {
    const getData = async () => {
      const responsesData = await dispatch<any>(fetchResponses())
      if (responsesData) {
        setResponses(responsesData)
      }
      const credentialsData = await dispatch<any>(fetchResponses())
      if (credentialsData) {
        setCredentials(credentialsData)
      }
    }
    getData()
  }, [showForm])

  return (
    <Box>
      <Flex>
        <Text fontSize="3xl" fontWeight="300">
          Interventions
        </Text>
        <Spacer />

        {!showForm && (
          <Button
            m="0.2rem"
            variant="outline"
            colorScheme="twitter"
            leftIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            <Text>Add Interventions</Text>
          </Button>
        )}
      </Flex>

      {showForm && (
        <ResponseForm setShowForm={setShowForm}/>
      )}
      {!showForm && responses.length > 0 && credentials.length > 0 && (
        <>
          <Grid
            mt="2rem"
            fontWeight="200"
            fontSize="xl"
            gap={4}
            templateColumns="repeat(7, 1fr)"
          >
            <GridItem colSpan={1}>
              <Text>Name</Text>
            </GridItem>
            <GridItem colSpan={4}>
              <Text>Text</Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>Credentials</Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>Remove</Text>
            </GridItem>
          </Grid>
          <Divider
            h="4px"
            mt="0.4rem"
            mb="0.8rem"
            borderRadius="1rem"
            bg="#bfc7cf"
          />
          {responses.map((response) => (
            <ResponseEntry
              key={response.id}
              response={response}
              removeResponse={removeResponse}
            />
          ))}
        </>
      )}
    </Box>
  )
}

export default Responses
