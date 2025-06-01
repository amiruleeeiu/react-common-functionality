// src/App.tsx
import { Box } from "@chakra-ui/react";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import Loading from "./components/Loading";
import router from "./router/router";

const App = () => {
  return (
    <Box minH={"100vh"}>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </Box>
  );
};

export default App;
