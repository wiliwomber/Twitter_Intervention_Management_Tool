import React from 'react'
import { Box, Flex, Text, Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const Intro = () => (
  <Flex h="100%" w="100%" alignItems="center" justifyContent="center">
    <Box maxW="450px" textAlign="center">
      <Text fontSize="4xl" fontWeight="300">
        Welcome to the
      </Text>
      <Text fontSize="4xl" fontWeight="300">
        Twitter Intervention Management Tool
      </Text>
      <Text mt="3rem" fontSize="xl" fontWeight="300">
        Choose a project from the sidebar or create a new one to get started.
      </Text>
      <Text mt="3rem" fontSize="xl" fontWeight="300">
        For a tutorial on how to build high quality filters to fetch Tweets in
        real time visit:{' '}
        <Link
          href="https://developer.twitter.com/en/docs/tutorials/building-high-quality-filters"
          isExternal
        >
          Build High Quality Filter <ExternalLinkIcon mx="2px" />
        </Link>
      </Text>
    </Box>
  </Flex>
)

export default Intro
