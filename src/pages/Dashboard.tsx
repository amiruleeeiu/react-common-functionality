import { Box, Button, Center } from "@chakra-ui/react";
import { useAuth } from "../context/AuthProvider";

function Dashboard() {
  const { token, doLogout } = useAuth();

  console.log(token);
  return (
    <Center h={"full"}>
      <Box>Dashboard
      <br />
      <Button
        colorPalette={"red"}
        onClick={() => {
          if (doLogout) {
            doLogout();
          }
        }}
      >
        Logout
      </Button></Box>
    </Center>
  );
}

export default Dashboard;
