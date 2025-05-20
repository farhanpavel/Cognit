export interface DocumentRecord {
  name: string;
  url: string;
}

export interface CreateDonorPayload {
  verificationFiles: DocumentRecord[];
  lastDonatedAt?: string;
}

export interface Donor {
  id: string;
  profileId: string;
  lastDonatedAt: string;
  IsNationalIdVerified: boolean;
  isBirthCertificateNumberVerified: boolean;
  isHealthIdVerified: boolean;
  verificationFiles: VerificationFile[];
  createdAt: string;
  updatedAt: string;
  bloodDonationRequestsStatus: BloodDonationRequestsStatus[];
  profile: Profile;
}

export interface VerificationFile {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  bloodDonationRequestId: string;
  donorId: string;
}

export interface BloodDonationRequestsStatus {
  id: string;
  donorId: string;
  canDonateBloodBagUpto: number;
  bloodDonationRequestId: string;
  timestamp: string;
  donorResponse: string;
  donorReachedAt: string;
  bloodBagDonated: number;
  isConfirmedByPatient?: boolean;
  isRejectedByPatient?: boolean;
  bloodDonationRequest: BloodDonationRequest;
  bloodDonationRequestUpdates: BloodDonationRequestUpdate[];
}

export interface BloodDonationRequest {
  id: string;
  patientProfileId: string;
  medicalNotes: string;
  prescriptionFiles: PrescriptionFile[];
  hospitalName: string;
  hospitalAddress: string;
  hospitalLocation: HospitalLocation;
  bloodNeededBefore: string;
  bagsNeeded: number;
  bagsReceived: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionFile {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  bloodDonationRequestId: string;
  donorId: string;
}

export interface HospitalLocation {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  profileId: string;
}

export interface BloodDonationRequestUpdate {
  id: string;
  bloodDonationRequestStatusId: string;
  requestStatusName: string;
  timestamp: string;
  status: Status;
}

export interface Status {
  name: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  bloodGroupName: string;
  email: string;
  photoUrl: string;
  homeAddress: string;
  permanentAddress: string;
  createdAt: string;
  updatedAt: string;
  phoneNumbers: PhoneNumber[];
  location: Location;
}

export interface PhoneNumber {
  id: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  profileId: string;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  profileId: string;
}

export interface DonorStatistics {
  acceptedDonations: number;
  completedDonations: number;
  totalBloodBags: number;
  responseRate: number;
  lastDonation: string;
}
