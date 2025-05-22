import { api } from "@/api";
import {
  AuthCredentials,
  AuthResponse
} from "@/modules/auth/models/auth.model";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, AuthCredentials>({
      query: (data: AuthCredentials) => ({
        url: "/api/user/login",
        method: "POST",
        body: data
      })
    }),

    register: builder.mutation<any, any>({
      query: (data: AuthCredentials) => ({
        url: "/api/user/register",
        method: "POST",
        body: data
      })
    }),

    test: builder.mutation({
      query: () => ({
        url: "/auth/test",
        method: "GET"
      })
    })
  })
});

export const { useLoginMutation, useRegisterMutation, useTestMutation } =
  authApi;
