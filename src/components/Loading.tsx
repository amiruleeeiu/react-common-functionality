import { Box, Spinner } from "@chakra-ui/react"

function Loading() {
  return (
    <Box>
        <Spinner
    color="red.500"
    css={{ "--spinner-track-color": "colors.gray.200" }}
  />
    </Box>
  )
}

export default Loading