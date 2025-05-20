import { api } from "@/api";
import {
  ProfileData,
  ProfilePayload,
  UpdateLocationPayload,
  UpdateProfilePayload
} from "@/modules/profile/models/profile.model";
import { Response } from "@/modules/core/models/core.model";
const profileApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMyProfile: builder.mutation<any, null>({
      query: () => ({
        url: "/api/user/profile",
        method: "GET"
      })
    }),

    createProfile: builder.mutation<Response<ProfileData>, ProfilePayload>({
      query: (body) => ({
        url: "/profile",
        method: "POST",
        body: body
      })
    }),

    updateProfile: builder.mutation<
      Response<ProfileData>,
      UpdateProfilePayload
    >({
      query: (body) => ({
        url: `/profile`,
        method: "PUT",
        body: body
      })
    }),

    updateLocation: builder.mutation<
      Response<ProfileData>,
      UpdateLocationPayload
    >({
      query: (body) => ({
        url: `/profile/location`,
        method: "PUT",
        body: body
      })
    })
  })
});

export const {
  useGetMyProfileMutation,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useUpdateLocationMutation
} = profileApi;
