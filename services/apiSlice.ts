// services/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // optional name for the slice
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
  }),
  endpoints: (builder) => ({
    getDivisions: builder.query({
      query: () => "/divisions", // GET /posts
    }),
    getMapData: builder.query({
      query: (urlStr) => `/${urlStr}`, // GET /posts
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetDivisionsQuery, useGetMapDataQuery } = apiSlice;
