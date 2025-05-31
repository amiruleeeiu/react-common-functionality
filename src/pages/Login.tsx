import { Box, Button, Center } from "@chakra-ui/react";
import { useAuth } from "../context/AuthProvider";

// src/pages/Login.tsx
const Login = () => {
  const { doLogin } = useAuth();

  return (
    <Center h={"full"}>
      <Box>
        Dashboard
        <br />
        <Button
          colorPalette={"red"}
          onClick={() => {
            if (doLogin) {
              doLogin();
            }
          }}
        >
          Login
        </Button>
      </Box>
    </Center>
  );
};
export default Login;
