import { Box, Spinner } from "@chakra-ui/react";

function Loading() {
  return (
    <Box
      position={"fixed"}
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={"black/50"}
      zIndex={9999}
    >
      <Spinner
        color="blue.500"
        borderWidth="5px"
        size="xl"
        css={{ "--spinner-track-color": "colors.gray.200" }}
      />
    </Box>
  );
}

export default Loading;
