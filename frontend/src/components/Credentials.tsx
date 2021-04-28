import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
import {
  createCredential,
  fetchCredentials,
  deleteCredential,
} from '../store/credentials/effects'

const CredentialForm = ({ setShowForm }) => {
  const { errors, handleSubmit, register } = useForm()
  const dispatch = useDispatch()
  const onSubmit = async (data) => {
    await dispatch<any>(createCredential(data))
    setShowForm(false)
  }
  const handleCancel = () => {
    setShowForm(false)
  }

  return (
    <Box mt="2rem">
      <Text fontSize="2xl" fontWeight="300">
        Store new credentials
      </Text>
      <Text>
        You need to apply for research API access in order to get credentials
        from Twitter
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
                  For multi-bot experiments it is useful to assgin a name to
                  each set of credentials
                </Box>
              </FormHelperText>
            </FormControl>
          </Box>

          <Box>
            <FormControl isInvalid={errors.type}>
              <FormLabel>Access Type</FormLabel>
              <Select name="type" ref={register({ required: true })}>
                <option value="standard">Standard</option>
                <option value="academic">Academic</option>
              </Select>
              <FormHelperText>
                <Box px={4}>Select the type of your Twitter credentials.</Box>
              </FormHelperText>
              <FormErrorMessage>
                {errors.type && errors.type.message}
              </FormErrorMessage>
            </FormControl>
          </Box>

          <Box>
            <FormControl isInvalid={errors.consumer_key}>
              <FormLabel>Consumer Key</FormLabel>
              <Input
                focusBorderColor="twitter.400"
                name="consumer_key"
                placeholder="Required"
                ref={register({ required: true, maxLength: 100 })}
              />
              <FormErrorMessage>This field is required</FormErrorMessage>
            </FormControl>
          </Box>

          <Box>
            <FormControl isInvalid={errors.consumer_secret}>
              <FormLabel>Consumer Secret</FormLabel>
              <Input
                focusBorderColor="twitter.400"
                name="consumer_secret"
                placeholder="Required"
                ref={register({ required: true, maxLength: 100 })}
              />
              <FormErrorMessage>This field is required</FormErrorMessage>
            </FormControl>
          </Box>

          <Box>
            <FormControl isInvalid={errors.access_token_key}>
              <FormLabel>Access Token Key</FormLabel>
              <Input
                focusBorderColor="twitter.400"
                name="access_token_key"
                placeholder="Required"
                ref={register({ required: true, maxLength: 100 })}
              />
              <FormErrorMessage>This field is required</FormErrorMessage>
            </FormControl>
          </Box>

          <Box>
            <FormControl isInvalid={errors.access_token_secret}>
              <FormLabel>Access Token Secret</FormLabel>
              <Input
                focusBorderColor="twitter.400"
                name="access_token_secret"
                placeholder="Required"
                ref={register({ required: true, maxLength: 100 })}
              />
              <FormErrorMessage>This field is required</FormErrorMessage>
            </FormControl>
          </Box>

          <Box>
            <FormControl isInvalid={errors.bearer_token}>
              <FormLabel>Bearer Token</FormLabel>
              <Input
                focusBorderColor="twitter.400"
                name="bearer_token"
                placeholder="Required"
                ref={register({ required: true })}
              />
              <FormErrorMessage>This field is required</FormErrorMessage>
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
              colorScheme="twitter"
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
type CredentialProps = {
  credential: {
    id: string
    name: string
    consumer_key: string
  }
  removeCredential: any
}
const CredentialEntry = (props: CredentialProps) => {
  const { credential, removeCredential } = props
  return (
    <>
      <Grid gap={4} templateColumns="repeat(4, 1fr)">
        <GridItem m="auto 0" colSpan={1}>
          <Text>{credential.name}</Text>
        </GridItem>
        <GridItem m="auto 0" colSpan={2}>
          <Text>{credential.consumer_key}</Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Button
            variant="outline"
            colorScheme="red"
            onClick={() => removeCredential(credential.id)}
          >
            <DeleteIcon />
          </Button>
        </GridItem>
      </Grid>
      <Divider mx="0.1rem" my="0.5rem" h="1px" bg="#55acee" />
    </>
  )
}

const Credentials = () => {
  const dispatch = useDispatch()
  const [showForm, setShowForm] = useState(false)
  const [credentials, setCredentials] = useState([])

  const removeCredential = (id) => {
    dispatch<any>(deleteCredential(id))
    const updatedCredentials = credentials.filter(
      (credential) => credential.id !== id
    )
    setCredentials(updatedCredentials)
  }

  useEffect(() => {
    const getCredentials = async () => {
      const data = await dispatch<any>(fetchCredentials())
      if (data) {
        setCredentials(data)
      }
    }
    getCredentials()
  }, [showForm])


  return (
    <Box height="100%" overflow="auto">
      <Flex>
        <Text fontSize="3xl" fontWeight="300">
          Credentials
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
            <Text>Add Credentials</Text>
          </Button>
        )}
      </Flex>

      {showForm && <CredentialForm setShowForm={setShowForm} />}
      {!showForm && credentials.length > 0 && (
        <>
          <Grid
            mt="2rem"
            fontWeight="200"
            fontSize="xl"
            gap={4}
            templateColumns="repeat(4, 1fr)"
          >
            <GridItem colSpan={1}>
              <Text>Name</Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Text>Consumer Key</Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>Delete</Text>
            </GridItem>
          </Grid>
          <Divider
            h="4px"
            mt="0.4rem"
            mb="0.8rem"
            borderRadius="1rem"
            bg="#bfc7cf"
          />
          {credentials.map((credential) => (
            <CredentialEntry
              key={credential.id}
              credential={credential}
              removeCredential={removeCredential}
            />
          ))}
        </>
      )}
    </Box>
  )
}

export default Credentials
