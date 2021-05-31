import { Box, Input, Button } from "@chakra-ui/react"
import React from "react"

export const Login = ({ handleLogin }) => {
  const p = "W3rAfDmAg$t1nkT!"
  const [value, setValue] = React.useState("")
  const handleChange = (e) => setValue(e.target.value)
  const handleSubmit = () => {
    if (p !== value) return
    let now = new Date()
    let time = now.getTime()
    let expireTime = time + 1000 * 36000
    now.setTime(expireTime)
    document.cookie = "authorized=true;expires=" + now.toUTCString() + ";path=/"
    handleLogin(true)
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#55acee"
      w="100vw"
      h="100vh"
    >
      <Box
        display="flex"
        justfy="center"
        bg="white"
        w="20rem"
        p="2rem"
        borderRadius="1rem"
      >
        <Input
          placeholder="Enter password"
          value={value}
          onChange={handleChange}
          type="password"
          w="100%"
          bg="white"
          size="md"
        />
        <Button variant="outline" colorScheme="twitter" onClick={handleSubmit}>
          Enter
        </Button>
      </Box>
    </Box>
  )
}
