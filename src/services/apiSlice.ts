/* eslint-disable @typescript-eslint/no-explicit-any */
// services/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COLORS = [
  "#FF5733", // red-orange
  "#33FF57", // green
  "#3357FF", // blue
  "#F333FF", // pink
  "#FF33A8", // hot pink
  "#33FFF6", // cyan
  "#A8FF33", // lime
  "#FFA833", // orange
  "#8D33FF", // purple
  "#FF3380", // magenta
  "#33A1FF", // light blue
  "#FFBD33", // gold
  "#33FFBD", // aquamarine
  "#C70039", // crimson
  "#900C3F", // dark magenta
  "#581845", // plum
  "#2ECC71", // emerald
  "#F1C40F", // yellow
  "#1ABC9C", // turquoise
  "#E67E22", // carrot orange
];

export const apiSlice = createApi({
  reducerPath: "api", // optional name for the slice
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    getDivisions: builder.query({
      query: () => "/divisions", // GET /posts
    }),
    getMapData: builder.query({
      query: (urlStr) => `/${urlStr}`, // GET /posts
      transformResponse: (response: { data: any[] }) => {
        const res = response?.data.map((feture, index) => ({
          ...feture,
          color2: COLORS[index % COLORS.length],
        }));

        return { ...response, data: res };
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetDivisionsQuery, useGetMapDataQuery } = apiSlice;
