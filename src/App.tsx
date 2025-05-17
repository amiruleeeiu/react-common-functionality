import { Box, Heading } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import AdminBoundaryMap from "./components/AdminBoundaryMap";

function App() {
  // const onRegionClick = () => {};

  return (
    <Box>
      <AdminBoundaryMap />
      {/* <FileUploadWithProgress />
      
      <Video /> */}
      <Heading>Hellow world</Heading>
    </Box>
  );
}

export default App;
