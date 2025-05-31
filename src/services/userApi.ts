import type { User } from "../types/User";
import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET Users
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["users"],
    }),

    // GET by ID
    getUserById: builder.query<User, number>({
      query: (id) => `users/${id}`,
    }),

    // ✅ POST - Add User
    addUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: "users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["users"],
    }),

    // ✅ PUT - Update User
    updateUser: builder.mutation<User, { id: number; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
} = userApi;
