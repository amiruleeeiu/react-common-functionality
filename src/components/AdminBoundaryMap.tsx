/* eslint-disable @typescript-eslint/no-explicit-any */
import * as turf from "@turf/turf";

import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { LatLngBoundsExpression, Layer } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { MdEmail, MdOutlineArrowBackIos, MdPhone } from "react-icons/md";
import {
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useGetMapDataQuery } from "../../services/apiSlice";
import { convertToAbbreviation } from "../lib/convertToAbbreviation";

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

const FitBoundsHandler = ({ geoJsonData }: { geoJsonData: any }) => {
  const map = useMap();

  useEffect(() => {
    if (geoJsonData) {
      const layer = L.geoJSON(geoJsonData);
      const bounds: LatLngBoundsExpression = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] }); // padding দিলে একটু margin থাকবে
      }
    }
  }, [geoJsonData, map]);

  return null;
};

interface Properties {
  division_name?: string;
  district_name?: string;
  upazila_name?: string;
  union_name?: string;
  mauza_name?: string;
  value?: string;
}

const getName = (properties: Properties, mapTitle: string): string => {
  let name = "Unknown";

  const { value } = properties || {};
  if (mapTitle === "divisions" && properties?.division_name) {
    name = properties?.division_name + ` (${value})` || "Unknown";
  } else if (mapTitle === "districts") {
    name = properties?.district_name + ` (${value})` || "Unknown";
  } else if (mapTitle === "upazilas") {
    name = properties?.upazila_name || "Unknown";
  } else if (mapTitle === "unions") {
    name = properties?.union_name || "Unknown";
  } else if (mapTitle === "mouzas") {
    name = properties?.mauza_name || "Unknown";
  } else {
    name = properties?.mauza_name || "Unknown";
  }
  return name;
};

const AdminBoundaryMap = () => {
  const [mapState, setMapState] = useState<{
    map: "divisions" | "districts" | "upazilas" | "unions" | "mouzas";
    code: number[];
  }>({
    map: "divisions",
    code: [],
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isWidth, setIsWidth] = useState<boolean>(!isMobile);

  const [titles, setTitles] = useState<Array<string>>(["Bangladesh"]);

  const { data, isLoading, isFetching, isSuccess } = useGetMapDataQuery(
    `${mapState.map}/${mapState.code.join("/")}`
  );

  console.log(data);

  const geoJsonRef = useRef<any>(null);

  const color = {
    divisions: "#6666ff",
    districts: "#009999",
    upazilas: "#3056C9",
    unions: "#993366",
    mouzas: "#ff6666",
  };

  const COLORS = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F333FF",
    "#FF33A8",
    "#33FFF6",
    "#A8FF33",
    "#FFA833",
    "#8D33FF",
    "#FF3380",
  ];

  const getOnlyName = (properties: any) => {
    switch (mapState.map) {
      case "divisions":
        return properties?.division_name;
      case "districts":
        return properties?.district_name;
      case "upazilas":
        return properties?.upazila_name;
    }
    return "";
  };

  const getColorMap = (features: GeoJSON.Feature[]) => {
    const nameSet = new Set<string>();
    features.forEach((f) => nameSet.add(getOnlyName(f.properties)));

    const nameArray = Array.from(nameSet);
    const colorMap: Record<string, string> = {};

    nameArray.forEach((name, index) => {
      colorMap[name] = COLORS[index % COLORS.length]; // reuse colors if more items
    });

    return colorMap;
  };

  const featureColorMapRef = useRef(new Map<string, string>());

  const highlightFeature = (e: any) => {
    const layer = e.target;
    layer.setStyle({
      fillColor: "#ff9966",
      weight: 1,
      color: "#000",
      fillOpacity: 0.6,
    });
    layer.bringToFront();
  };

  const resetHighlight = (e: any) => {
    geoJsonRef.current?.resetStyle(e.target);
  };

  const handleClick = (properties: any) => {
    const {
      division_code: divisionCode,
      district_code: districtCode,
      upazila_code: upazilaCode,
      union_code: unionCode,
    } = properties || {};

    const name = getName(properties, mapState.map);

    if (divisionCode && !districtCode && !upazilaCode) {
      setMapState({ map: "districts", code: [divisionCode] });
      setTitles((prev) => [...prev, name]);
    } else if (districtCode && !upazilaCode) {
      setMapState({ map: "upazilas", code: [divisionCode, districtCode] });
      setTitles((prev) => [...prev, name]);
    } else if (upazilaCode && !unionCode) {
      setMapState({
        map: "unions",
        code: [divisionCode, districtCode, upazilaCode],
      });
      setTitles((prev) => [...prev, name]);
    } else if (unionCode) {
      setMapState({
        map: "mouzas",
        code: [divisionCode, districtCode, upazilaCode, unionCode],
      });
      if (titles.length < 5) {
        setTitles((prev) => [...prev, name]);
      }
    }
  };

  const featureColorMap = new Map<string, string>();

  const onEachFeature = (feature: any, layer: Layer) => {
    // const code = feature.properties?.division_code;
    // const featureColorMap = featureColorMapRef.current;

    // if (!featureColorMap.has(code)) {
    //   const index = featureColorMap.size;
    //   const assignedColor = COLORS[index % COLORS.length];
    //   featureColorMap.set(code, assignedColor);
    // }

    // console.log(featureColorMap);

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: () => {
        handleClick(feature?.properties);
      },
    });

    const name = getName(feature.properties, mapState.map);

    layer.bindTooltip(name, {
      sticky: true,
      direction: "top",
      className: "district-tooltip",
    });
  };

  const normalStyle = (feature: any) => {
    const { color2 } = feature || {};

    return {
      color: "#fff",
      weight: 1.3,
      fillColor: color2 || "#ccc",
      fillOpacity: 0.7,
    };
  };

  const zoom = {
    divisions: 7,
    districts: 8,
    upazilas: 10,
    unions: 11,
    mouzas: 11,
    villages: 12,
  };

  const handleBack = () => {
    if (mapState.map === "divisions") {
      return;
    } else if (mapState.map === "districts") {
      setMapState({ map: "divisions", code: [] });
    } else if (mapState.map === "upazilas") {
      setMapState({
        map: "districts",
        code: [mapState.code[0]],
      });
    } else if (mapState.map === "unions") {
      setMapState({
        map: "upazilas",
        code: [mapState.code[0], mapState.code[1]],
      });
    } else if (mapState.map === "mouzas") {
      setMapState({
        map: "unions",
        code: [mapState.code[0], mapState.code[1], mapState.code[2]],
      });
    }

    setTitles((prev) => {
      const newTitles = [...prev];

      newTitles.pop();

      return newTitles;
    });
  };

  const currentTitle = titles[titles.length - 1];

  const getTitleType = (mapType: string) => {
    switch (mapType) {
      case "divisions":
        return "";
      case "districts":
        return "Division";
      case "upazilas":
        return "District";
      case "unions":
        return "Upazila";
      case "mouzas":
        return "Union";
    }
    return "";
  };

  // useEffect(() => {
  //   setIsWidth(mapState?.map == "upazilas" ? "400px" : "300px");
  // }, [mapState?.map]);

  const getPosition = (feature: any) => {
    const centroid = turf.centroid(feature);

    return [centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]]; // [lat, lng]
  };

  const createLabelIcon = (feature: any) =>
    L.divIcon({
      className: "custom-div-icon",
      html: `
  <div style="
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  ">
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      color: rgb(11, 96, 182);
      min-width: 30px;
      height: 30px;
      padding: 0 6px;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      white-space: nowrap;
    ">
      ${convertToAbbreviation(feature?.properties?.value)}
    </div>
    <div style="
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      color: rgb(11, 96, 182);
      font-size: 10px;
      height: 20px;
      border-radius: 12px;
      font-weight: 400;
      text-align: center;
      margin-top: 5px;
      padding: 0 6px;
      white-space: nowrap;
      width: auto;
    ">
      ${getOnlyName(feature?.properties)}
    </div>
  </div>
`,
      iconAnchor: [15, 15],
    });

  return (
    <Box h={"100vh"}>
      <MapContainer
        key={`${mapState.code.join("-")}`}
        center={[23.685, 90.3563]}
        zoom={zoom[mapState.map]}
        style={{ height: "100vh", width: "100%", padding: "5px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution="&copy; OpenStreetMap contributors"
        />
        {data?.data && !isLoading && !isFetching && isSuccess && (
          <>
            <GeoJSON
              key={`${mapState.map}-${mapState.code.join("-")}-${
                data?.data?.features?.length || 0
              }`}
              data={data?.data}
              style={normalStyle}
              onEachFeature={onEachFeature}
              ref={(ref) => {
                geoJsonRef.current = ref;
              }}
            />

            <FitBoundsHandler geoJsonData={data?.data} />
          </>
        )}
        {data?.data &&
          !isLoading &&
          !isFetching &&
          isSuccess &&
          mapState.map != "upazilas" &&
          data?.data?.map((feature: any, index: number) => {
            return (
              <Marker
                position={getPosition(feature) as [number, number]}
                icon={createLabelIcon(feature)}
                key={index}
              ></Marker>
            );
          })}
      </MapContainer>
      {isFetching && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
        >
          <Spinner
            size="xl"
            color="blue.600"
            css={{ "--spinner-track-color": "colors.gray.200" }}
            borderWidth="5px"
          />
        </Box>
      )}

      <Box
        position="fixed"
        top={0}
        left={0}
        width={
          isWidth ? (mapState?.map == "upazilas" ? "350px" : "300px") : "60px"
        }
        transition="width 0.5s ease"
        height="100vh"
        bg="gray.100"
        shadow={"2xl"}
        zIndex={9999}
      >
        {isWidth ? (
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"space-between"}
            height="100%"
          >
            <Box px={3} shadow={"lg"}>
              <Flex
                justify="space-between"
                alignItems="center"
                position="sticky"
                top="0"
                zIndex={10}
                bg="gray.100"
                py={2}
              >
                <Heading size={"xl"}>
                  {currentTitle}
                  {/* {getTitleType(mapState.map) ? (
              <Box as={"span"} fontSize={"sm"} ml={1} color={"gray.700"}>
                ({getTitleType(mapState.map)})
              </Box>
            ) : (
              ""
            )} */}
                </Heading>

                <IconButton
                  variant="ghost"
                  size={"md"}
                  rounded="full"
                  onClick={() => setIsWidth((prevState: boolean) => !prevState)}
                  _hover={{ bg: "blue.100" }}
                >
                  <MdOutlineArrowBackIos />
                </IconButton>
              </Flex>
              {(mapState?.map == "divisions" ||
                mapState?.map == "districts") && (
                <HStack
                  justify={"space-between"}
                  pb={1}
                  borderBottom="1px solid"
                  borderColor="gray.300"
                >
                  <Text textStyle="sm">
                    {mapState?.map == "districts" ? "District" : "Division"}{" "}
                    Name
                  </Text>
                  <Text color={"gray.600"} textStyle="sm">
                    Members
                  </Text>
                </HStack>
              )}
              {(isLoading || isFetching) && (
                <Stack flex="1" mt={2}>
                  {Array(8)
                    .fill(0)
                    .map((i, index) => (
                      <Skeleton
                        height={mapState?.map == "upazilas" ? "24" : "12"}
                        key={index}
                      />
                    ))}
                </Stack>
              )}
            </Box>

            <Box>
              {!isFetching &&
                !isLoading &&
                mapState?.map == "upazilas" &&
                data?.employesInfo?.length == 0 && (
                  <Text p={3} textAlign={"center"}>
                    No data found!
                  </Text>
                )}
            </Box>

            <MotionBox px={3} py={2} overflow={"auto"} height="100%" flex={1}>
              {!isFetching &&
                !isLoading &&
                mapState?.map == "upazilas" &&
                data?.employesInfo?.map((i: any, index: number) => {
                  return (
                    <MotionFlex
                      flexDir={"column"}
                      gap="2"
                      key={index}
                      mb={3}
                      bg={"white"}
                      initial={{ opacity: 0, x: -60 }}
                      whileInView={{ scale: 1, opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    >
                      <Card.Root variant={"elevated"}>
                        <Card.Body gap="2" p={3}>
                          <HStack gap="4">
                            <Avatar.Root>
                              <Avatar.Fallback name={i?.name} />
                              <Avatar.Image src="" />
                            </Avatar.Root>
                            <Stack gap="0">
                              <Heading size={"sm"}>{i?.name}</Heading>
                              <Text textStyle="sm" display={"flex"} gap="1">
                                <Box as={"span"} color="blue.500" mt={0.5}>
                                  <FaGraduationCap size={16} />{" "}
                                </Box>{" "}
                                {i?.designation}
                              </Text>
                              <Text
                                color="fg.muted"
                                textStyle="sm"
                                display={"flex"}
                                gap="1"
                                alignItems="center"
                              >
                                <Box as={"span"} color="blue.500">
                                  <MdEmail size={15} />{" "}
                                </Box>{" "}
                                {i?.userEmail}
                              </Text>
                              <Text
                                color="fg.muted"
                                textStyle="sm"
                                display={"flex"}
                                gap="1"
                                alignItems="center"
                              >
                                <Box as={"span"} color="blue.500">
                                  <MdPhone size={15} />{" "}
                                </Box>{" "}
                                {i?.userPhone}
                              </Text>
                            </Stack>
                          </HStack>
                        </Card.Body>
                      </Card.Root>
                    </MotionFlex>
                  );
                })}

              {!isFetching &&
                !isLoading &&
                (mapState?.map == "divisions" ||
                  mapState?.map == "districts") &&
                data?.data?.map((i: any, index: number) => {
                  const title =
                    mapState?.map == "districts"
                      ? i?.properties?.district_name
                      : i?.properties?.division_name;
                  return (
                    <MotionFlex
                      flexDir={"column"}
                      gap="2"
                      mb={2}
                      bg={"white"}
                      key={index}
                      initial={{ opacity: 0, x: -60 }}
                      whileInView={{ scale: 1, opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      cursor={"pointer"}
                      onClick={() => handleClick(i?.properties)}
                    >
                      <Card.Root variant={"elevated"}>
                        <Card.Body
                          gap="2"
                          p={3}
                          bg={"white"}
                          border="1px solid"
                          borderColor="blue.50"
                          _hover={{
                            bg: "blue.50",
                            border: "1px solid",
                            borderColor: "blue.400",
                          }}
                          transition="all 0.2s ease-in-out"
                        >
                          <HStack
                            gap="4"
                            justifyContent={"space-between"}
                            // cursor={"pointer"}
                          >
                            <Heading size={"sm"}>{title}</Heading>

                            <Stack gap="0">
                              <Heading size={"sm"}>
                                {i?.properties?.value}
                              </Heading>
                            </Stack>
                          </HStack>
                        </Card.Body>
                      </Card.Root>
                    </MotionFlex>
                  );
                })}
            </MotionBox>
          </Box>
        ) : (
          <Center mt={3}>
            <IconButton
              variant="ghost"
              size={"lg"}
              rounded="full"
              onClick={() => setIsWidth((prevState: boolean) => !prevState)}
              _hover={{ bg: "blue.100" }}
            >
              <FiMenu />
            </IconButton>
          </Center>
        )}
      </Box>

      <Box
        position="fixed"
        top={5}
        left={0}
        right={5}
        display="flex"
        flexDir={"column"}
        justifyContent="center"
        alignItems={"end"}
        zIndex={999}
      >
        {isSuccess && mapState.map !== "divisions" && (
          <Button
            onClick={handleBack}
            disabled={isFetching || isLoading}
            colorPalette={"blue"}
            mb={2}
          >
            <Box fontSize="10px">
              <IoIosArrowBack />
            </Box>
            Back
          </Button>
        )}
        {/* <Box>
          <IconButton size={"sm"} variant="subtle">
            <GoPlus />
          </IconButton>
          &nbsp;
          <IconButton size={"sm"} variant="subtle">
            <FiMinus />
          </IconButton>
        </Box> */}
      </Box>
    </Box>
  );
};

export default AdminBoundaryMap;
