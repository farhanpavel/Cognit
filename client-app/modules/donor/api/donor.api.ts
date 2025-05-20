import { api } from "@/api";
import { Response } from "@/modules/core/models/core.model";
import {
  CreateDonorPayload,
  Donor,
  DonorStatistics
} from "../models/donor.model";

const donorApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDonors: builder.query<Donor[], void>({
      query: () => ({
        url: "/donor",
        method: "GET"
      })
    }),
    createDonorProfile: builder.mutation<Response<Donor>, CreateDonorPayload>({
      query: (body) => ({
        url: "/donor",
        method: "POST",
        body: body
      })
    }),
    getMyDonorProfile: builder.mutation<Response<Donor>, null>({
      query: () => ({
        url: "/donor/me/get",
        method: "GET"
      })
    }),
    getDonorStats: builder.mutation<DonorStatistics, void>({
      query: () => ({
        url: "/donor/stats/get",
        method: "GET"
      }) 
    })
  })
});

export const {
  useCreateDonorProfileMutation,
  useGetMyDonorProfileMutation,
  useGetDonorsQuery,
  useGetDonorStatsMutation
} = donorApi;
