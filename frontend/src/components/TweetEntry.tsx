import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  Image,
  Grid,
  GridItem,
  Button,
  Text,
  Select,
} from '@chakra-ui/react'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { fetchResponses } from '../store/responses/effects'
import { updateTweet } from '../store/tweets/effects'
import './TweetEntry.scss'
import api from '../utils/api'

type TweetProps = {
  tweet: {
    tweet_data: {
      id: string
      text: string
      users: any
      created_at: Date
    }
    project_id: string
    has_intervention: boolean
  }
}
const TweetEntry = (props: TweetProps) => {
  const { tweet } = props
  const [responses, setResponses] = useState([])
  const [hasIntervention, setHasIntervention] = useState(tweet.has_intervention)
  const [selectedResponse, setSelectedResponse] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    const getResponses = async () => {
      const data = await dispatch<any>(fetchResponses())
      if (data) {
        setResponses(data)
        setSelectedResponse(data[0].id)
      }
    }
    getResponses()
  }, [])

  const sendResponse = async () => {
    if (!selectedResponse) {
      console.log('Error')
      return
    }
    api.projects.intervene({
      tweetId: tweet.tweet_data.id,
      userName: tweet.tweet_data.users[0].username,
      responseId: selectedResponse,
      projectId: tweet.project_id,
    })
    await dispatch<any>(updateTweet({ ...tweet, has_intervention: true }))
    setHasIntervention(true)
  }

  const handleResponseSelection = (data) => {
    setSelectedResponse(data)
  }

  const handleIgnore = async () => {
    await dispatch<any>(updateTweet({ ...tweet, has_intervention: false }))
    setHasIntervention(false)
  }

  return (
    <Box key={tweet.tweet_data.id}>
      <Grid
        className="tweet-entry"
        gap={4}
        templateColumns="repeat(12, 1fr)"
        m="1px"
      >
        <GridItem colSpan={4}>
          <Text>{tweet.tweet_data.text}</Text>
        </GridItem>
        <GridItem colSpan={1}>
          <Image
            borderRadius="full"
            boxSize="40px"
            src={tweet.tweet_data.users[0].profile_image_url}
            alt="Profile picture"
            m="auto"
          />
          <Text align="center">{tweet.tweet_data.users[0].name}</Text>
        </GridItem>
        <GridItem colSpan={3}>
          <Text>{tweet.tweet_data.users[0].description}</Text>
        </GridItem>
        {responses && responses.length > 0 ? (
          <>
            {hasIntervention === undefined ? (
              <>
                <GridItem m="auto" colSpan={2}>
                  <Select
                    borderColor="twitter.500"
                    name="response"
                    onChange={(e) => handleResponseSelection(e.target.value)}
                  >
                    {responses.map((response) => (
                      <option key={response.id} value={response.id}>
                        {response.name}
                      </option>
                    ))}
                  </Select>
                </GridItem>
                <GridItem m="auto" colSpan={1}>
                  <Button
                    onClick={sendResponse}
                    colorScheme="twitter"
                    variant="outline"
                  >
                    Send
                  </Button>
                </GridItem>
                <GridItem m="auto" colSpan={1}>
                  <Button
                    variant="outline"
                    colorScheme="red"
                    onClick={handleIgnore}
                  >
                    Ignore
                  </Button>
                </GridItem>
              </>
            ) : (
              <>
                <GridItem m="auto" colSpan={4}>
                  {hasIntervention ? (
                    <CheckIcon boxSize={7} color="twitter.500" />
                  ) : (
                    <CloseIcon boxSize={7} color="red.500" />
                  )}
                </GridItem>
              </>
            )}
          </>
        ) : (
          <GridItem colSpan={2}>
            <Text>
              In order to send a response you need to set it up first. Click on
              responses in the sidebar.
            </Text>
          </GridItem>
        )}
      </Grid>
      <div className="divider" />
    </Box>
  )
}

export default TweetEntry
