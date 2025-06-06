// import { Theme } from "@chakra-ui/react";
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
// import { store } from "../app/store.ts";
// import App from "./App.tsx";
// import { Provider as ChakraProvider } from "./components/ui/provider.tsx";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <ChakraProvider>
//       <Theme appearance="light">
//         <Provider store={store}>
//           <App />
//         </Provider>
//       </Theme>
//     </ChakraProvider>
//   </StrictMode>
// );
// main.tsx

import { Theme } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../app/store.ts";
import App from "./App.tsx";
import { Provider as ChakraProvider } from "./components/ui/provider.tsx";
import { AuthProvider } from "./context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ChakraProvider>
      <Theme appearance="light">
        <Provider store={store}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Provider>
      </Theme>
    </ChakraProvider>
  </AuthProvider>
);
