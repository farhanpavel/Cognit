import { api } from "@/api";
import {
  PatientData,
  PatientPayload
} from "@/modules/patient/models/patient.model";
import { Response } from "@/modules/core/models/core.model";

const patientApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPatient: builder.mutation<Response<PatientData>, PatientPayload>({
      query: (body) => ({
        url: "/patient",
        method: "POST",
        body: body
      })
    })
  })
});

export const { useCreatePatientMutation } = patientApi;
