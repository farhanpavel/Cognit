import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError
} from "@reduxjs/toolkit/query/react";
import { env } from "@/config/app.config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "@react-native-firebase/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: env.apiUrl,
  credentials: "include",
  prepareHeaders: async (headers) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  }
});

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Try to refresh the token
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshResult = await fetch(`${env.apiUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken })
      }).then((res) => res.json());

      if (refreshResult.accessToken) {
        const { accessToken, refreshToken: newRefreshToken } = refreshResult;
        await AsyncStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem("refreshToken", newRefreshToken);
        }
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Token refresh failed");
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
      }
    } else {
      console.log("No refresh token available");
      await AsyncStorage.removeItem("accessToken");
    }
  }
  return result;
};

const baseQueryWithFirebaseAuth = fetchBaseQuery({
  baseUrl: env.apiUrl,
  credentials: "include",
  prepareHeaders: async (headers) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
          const token = await user.getIdToken();
          headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
  }
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [],
  endpoints: (builder) => ({})
});
