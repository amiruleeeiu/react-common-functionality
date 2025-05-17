import { Avatar, Box, Card, CloseButton, Flex, Heading, HStack, IconButton, Skeleton, Stack, Text } from "@chakra-ui/react";
import { FaGraduationCap } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

function Sidebar({mapType,title,}) {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width={mapType == "upazilas" ? "400px" : "300px"}
      height="100vh"
      bg="blue.50"
      shadow={"2xl"}
      zIndex={9999}
    >
      <Box px={3} py={2} overflow={"auto"} height="100%">
        <Flex justify={"space-between"} alignItems={"center"} mb={5}>
          <Heading size={"xl"} ps={2}>
            {currentTitle}
            {/* {getTitleType(mapState.map) ? (
              <Box as={"span"} fontSize={"sm"} ml={1} color={"gray.700"}>
                ({getTitleType(mapState.map)})
              </Box>
            ) : (
              ""
            )} */}
          </Heading>
          <IconButton variant="ghost" size={"md"} rounded="full">
            <CloseButton />
          </IconButton>
        </Flex>

        {(isLoading || isFetching) && !isSuccess && (
          <Stack flex="1">
            {Array(5)
              .fill(0)
              .map((i) => (
                <Skeleton
                  height={mapType == "upazilas" ? "20" : "10"}
                  key={i}
                />
              ))}
          </Stack>
        )}

        {!isFetching &&
          mapType == "upazilas" &&
          data?.employesInfo?.map((i: any) => {
            return (
              <Flex flexDir={"column"} gap="2" key={i} mb={3} bg={"white"}>
                <Card.Root>
                  <Card.Body gap="2" p={3}>
                    <Card.Description bg={"white"}>
                      <HStack gap="4">
                        <Avatar.Root>
                          <Avatar.Fallback name={i?.name} />
                          <Avatar.Image src="" />
                        </Avatar.Root>
                        <Stack gap="0">
                          <Heading size={"sm"}>{i?.name}</Heading>
                          <Text
                            color="fg.muted"
                            textStyle="sm"
                            display={"flex"}
                            gap="1"
                            alignItems="center"
                          >
                            <FaGraduationCap /> {i?.designation}
                          </Text>
                          <Text
                            color="fg.muted"
                            textStyle="sm"
                            display={"flex"}
                            gap="1"
                            alignItems="center"
                          >
                            <MdEmail /> {i?.userEmail}
                          </Text>
                          <Text
                            color="fg.muted"
                            textStyle="sm"
                            display={"flex"}
                            gap="1"
                            alignItems="center"
                          >
                            <MdPhone /> {i?.userPhone}
                          </Text>
                        </Stack>
                      </HStack>
                    </Card.Description>
                  </Card.Body>
                </Card.Root>
              </Flex>
            );
          })}

        {((!isFetching && mapType == "divisions") ||
          mapType == "districts") &&
          data?.data?.map((i: any) => {
            const title =
              mapType == "districts"
                ? i?.properties?.district_name
                : i?.properties?.division_name;
            return (
              <Flex flexDir={"column"} gap="2" key={i} mb={2} bg={"white"}>
                <Card.Root>
                  <Card.Body gap="2" p={3} bg={"white"}>
                    <Card.Description bg={"white"}>
                      <HStack gap="4" justifyContent={"space-between"}>
                        <Heading size={"sm"}>{title}</Heading>
                        <Stack gap="0">
                          <Heading size={"sm"}>{i?.properties?.value}</Heading>
                        </Stack>
                      </HStack>
                    </Card.Description>
                  </Card.Body>
                </Card.Root>
              </Flex>
            );
          })}
      </Box>
    </Box>
  );
}

export default Sidebar;
