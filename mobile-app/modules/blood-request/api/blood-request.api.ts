import { api } from "@/api";
import { Response } from "@/modules/core/models/core.model";
import {
  BloodRequest,
  BloodRequestAcceptPayload,
  BloodRequestPayload,
  ExtendRequestPayload
} from "@/modules/blood-request/models/blood-request.model";
import { BloodDonationRequestsStatus } from "@/modules/donor/models/donor.model";

const bloodRequestApi = api.injectEndpoints({
  endpoints: (build) => ({
    createBloodRequest: build.mutation<{ message: string; bloodRequest: BloodRequest }, BloodRequestPayload>({
      query: (data) => ({
        url: `/blood-request/${data.patientId}`,
        method: "POST",
        body: data
      })
    }),
    getActiveBloodRequests: build.mutation<Array<BloodRequest>, void>({
      query: () => ({
        url: "/blood-request/active-request/get",
        method: "GET"
      })
    }),
    getAllActiveBloodRequests: build.mutation<Array<BloodRequest>, void>({
      query: () => ({
        url: "/blood-request/active-request/get/all",
        method: "GET"
      })
    }),
    getAssignedBloodRequests: build.mutation<Array<BloodRequest>, void>({
      query: () => ({
        url: "/blood-request/assigned-request/get",
        method: "GET"
      })
    }),
    getMyBloodRequests: build.query<Array<BloodRequest>, void>({
      query: () => ({
        url: "/blood-request/my-request/get",
        method: "GET"
      })
    }),
    getSingleBloodRequest: build.query<BloodRequest, string>({
      query: (id: string) => ({
        url: `/blood-request/${id}`,
        method: "GET"
      })
    }),
    getAllBloodRequests: build.query<Array<BloodRequest>, number>({
      query: (range: number) => ({
        url: "/blood-request",
        method: "GET",
        params: {
          range
        }
      })
    }),
    getMyPreviousDonation: build.query<Array<BloodRequest>, void>({
      query: () => ({
        url: "/blood-request/my-donation/previous/get",
        method: "GET"
      })
    }),
    acceptBloodRequest: build.mutation<
      Response<BloodDonationRequestsStatus>,
      BloodRequestAcceptPayload
    >({
      query: (data) => ({
        url: `/blood-request/${data.bloodDonationRequestId}/accept`,
        method: "POST",
        body: {
          canDonateBloodBagUpto: data.canDonateBloodBagUpto,
          requestStatus: "Accepted"
        }
      })
    }),
    dismissBloodRequest: build.mutation<
      { message: string },
      BloodRequestAcceptPayload
    >({
      query: (data) => ({
        url: `/blood-request/${data.bloodDonationRequestId}/dissmiss-donor/${data.donorId}`,
        method: "PUT"
      })
    }),
    extendBloodRequest: build.mutation<
      { message: string; bloodRequest: BloodRequest },
      ExtendRequestPayload
    >({
      query: (data) => ({
        url: `/blood-request/${data.bloodDonationRequestId}/extend-session`,
        method: "PUT",
        body: {
          sessionEnd: data.sessionEnd
        }
      })
    }),
    dismissBloodRequestClient: build.mutation<
      { message: string },
      { id: string }
    >({
      query: (data) => ({
        url: `/blood-request/${data.id}/end-session`,
        method: "PUT"
      })
    }),
    markAsDoneDonorRequest: build.mutation<
      { message: string },
      BloodRequestAcceptPayload
    >({
      query: (data) => ({
        url: `/blood-request/${data.bloodDonationRequestId}/dissmiss-donor/${data.donorId}`,
        method: "PUT",
        body: {
          donateBloodBag: data.donateBloodBag
        }
      })
    }),
    confirmDonation: build.mutation<
      { message: string },
      {
        donorId: string;
        bloodRequestId: string;
        donatedBloodBag: number;
        confirm: boolean;
      }
    >({
      query: (data) => ({
        url: `/blood-request/${data.bloodRequestId}/confirm-donation/${data.donorId}`,
        method: "PUT",
        body: {
          donatedBags: data.donatedBloodBag,
          confirm: data.confirm
        }
      })
    })
  }),
  overrideExisting: true
});

export const {
  useGetActiveBloodRequestsMutation,
  useGetAssignedBloodRequestsMutation,
  useCreateBloodRequestMutation,
  useGetMyBloodRequestsQuery,
  useGetSingleBloodRequestQuery,
  useGetAllBloodRequestsQuery,
  useGetMyPreviousDonationQuery,
  useGetAllActiveBloodRequestsMutation,
  useAcceptBloodRequestMutation,
  useDismissBloodRequestMutation,
  useExtendBloodRequestMutation,
  useDismissBloodRequestClientMutation,
  useMarkAsDoneDonorRequestMutation,
  useConfirmDonationMutation
} = bloodRequestApi;
