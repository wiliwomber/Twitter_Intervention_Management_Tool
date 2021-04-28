import React from 'react'
import {
  Box,
  Stack,
  Flex,
  FormLabel,
  CheckboxGroup,
  Checkbox,
  Text,
} from '@chakra-ui/react'

const FieldsForm = ({ tweetFields, userFields, setTweetFields, setUserFields }) => {
  return (
    <Box>
      <Flex>
        <Stack minW="400px">
          <CheckboxGroup
            colorScheme="twitter"
            onChange={(e) => setTweetFields(e)}
            value={tweetFields}
          >
            <FormLabel m={0}>Tweet Fields</FormLabel>
            <Text>Tweet id and tweet text are fetched by default</Text>
            <Checkbox value="attachments">Attachments</Checkbox>
            <Checkbox value="author_id">Author ID</Checkbox>
            <Checkbox value="context_annotations">Context Annotations</Checkbox>
            <Checkbox value="conversation_id">Conversation ID</Checkbox>
            <Checkbox value="created_at">Created at</Checkbox>
            <Checkbox value="entities">
              Entities (Text with special meaning)
            </Checkbox>
            <Checkbox value="geo">Tagged Geolocation</Checkbox>
            <Checkbox value="in_reply_to_user_id">In reply to user ID</Checkbox>
            <Checkbox value="lang">Language</Checkbox>
            <Checkbox value="public_metrics">
              Public Metrics (Likes, Retweets..)
            </Checkbox>
            <Checkbox value="referenced_tweets">Referenced tweets</Checkbox>
            <Checkbox value="reply_settings">Reply Settings</Checkbox>
            <Checkbox value="source">
              Name of app the user tweeted from
            </Checkbox>
            <Checkbox value="withheld">Withheld</Checkbox>
            <Text mt="1rem!important">Metrics that require user context authentication:</Text>
            <Checkbox value="non_public_metrics">Non Public Metrics</Checkbox>
            <Checkbox value="organic_metrics">Organic Metrics</Checkbox>
            <Checkbox value="possibly_sensitive">Possibly sensitive</Checkbox>
            <Checkbox value="promoted_metrics">Promoted metrics</Checkbox>
          </CheckboxGroup>
        </Stack>
        <Stack minW="400px">
          <CheckboxGroup
            colorScheme="twitter"
            onChange={(e) => setUserFields(e)}
            value={userFields}
          >
            <FormLabel m={0}>User Fields</FormLabel>
            <Text>User id, name and screen name are fetched by default</Text>
            <Checkbox value="created_at">Account created at</Checkbox>
            <Checkbox value="description">Account description</Checkbox>
            <Checkbox value="entities">
              Entities (Text in Description with special meaning)
            </Checkbox>
            <Checkbox value="location">Location in profile</Checkbox>
            <Checkbox value="pinned_tweet_id">Pinned tweet ID</Checkbox>
            <Checkbox value="profile_image_url">Profile image</Checkbox>
            <Checkbox value="protected">Has private tweets</Checkbox>
            <Checkbox value="public_metrics">
              Public metrics (Followers, tweets count etc.)
            </Checkbox>
            <Checkbox value="url">Url in description</Checkbox>
            <Checkbox value="verified">Has verified profile</Checkbox>
            <Checkbox value="withheld">Withheld</Checkbox>
          </CheckboxGroup>
        </Stack>
      </Flex>
    </Box>
  )
}

export default FieldsForm
