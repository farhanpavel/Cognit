import { api } from "@/api";
import {
  HospitalLocation,
  HospitalQueryPayload,
  PlacesApiResponse,
  SearchPlaceResponse
} from "../models/map.model";

const mapApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getHospitals: builder.query<SearchPlaceResponse, HospitalQueryPayload>({
      query: (props: HospitalQueryPayload) => ({
        url: `https://maps.googleapis.com/maps/api/place/textsearch/json`,
        method: "GET",
        params: {
          key: "AIzaSyDjf_pQmDbNsuysGIKfRBHd0CoahRNXW9w",
          query: props.query,
          type: "hospital"
        }
      })
    }),
    getLocation: builder.query<SearchPlaceResponse, HospitalQueryPayload>({
      query: (props: HospitalQueryPayload) => ({
        url: `https://maps.googleapis.com/maps/api/place/textsearch/json`,
        method: "GET",
        params: {
          key: "AIzaSyDjf_pQmDbNsuysGIKfRBHd0CoahRNXW9w",
          query: props.query
        }
      })
    }),
    getMap: builder.query({
      query: () => ({
        url: "/map",
        method: "GET"
      })
    })
  })
});
export const {
  useGetMapQuery,
  useLazyGetHospitalsQuery,
  useLazyGetLocationQuery
} = mapApi;
