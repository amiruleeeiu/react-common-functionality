import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";
import Loading from "./Loading";

interface PageProps {
  children: ReactNode;
  isLoading?: boolean;
}

function Page({ children, isLoading = false }: PageProps) {
  return (
    <Box>
      {children}
      {isLoading && <Loading />}
    </Box>
  );
}

export default Page;
