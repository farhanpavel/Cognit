export interface BloodRequest {
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
  bloodDonationRequestStatus: BloodDonationRequestStatus[];
  createdAt: string;
  updatedAt: string;
  locationId: string;
  patientProfile: PatientProfile;
}
interface PatientProfile {
  id: string;
  name: string;
  relation: string;
  bloodGroupName: string;
  dateOfBirth: string;
  photoUrl: string;
  phoneNumbers: PhoneNumber2[];
  email: string;
  managedByUserId: string;
  isSelfRegistered: boolean;
  createdAt: string;
  updatedAt: string;
  managedByUser: ManagedByUser;
}
interface ManagedByUser {
  id: string;
  email: string;
  password: string;
  refreshToken?: any;
  registeredAt: string;
  profile: Profile;
}
interface PhoneNumber2 {
  id: string;
  patientId: string;
  number: string;
  createdAt: string;
  updatedAt: string;
}
export interface BloodDonationRequestStatus {
  id: string;
  donorId: string;
  canDonateBloodBagUpto: number;
  bloodDonationRequestId: string;
  timestamp: string;
  donorResponse: string;
  donorReachedAt: string;
  bloodBagDonated: number;
  donor: Donor;
  isDismissed: boolean;
  isConfirmedByPatient: boolean;
  isRejectedByPatient: boolean;
  bloodDonationRequestUpdates: BloodDonationRequestUpdate[];
}
export interface BloodDonationRequestUpdate {
  id: string;
  bloodDonationRequestStatusId: string;
  requestStatusName: string;
  timestamp: string;
}
export interface Donor {
  id: string;
  profileId: string;
  lastDonatedAt: string;
  IsNationalIdVerified: boolean;
  isBirthCertificateNumberVerified: boolean;
  isHealthIdVerified: boolean;
  verificationFiles: any[];
  createdAt: string;
  updatedAt: string;
  profile: Profile;
}
interface Profile {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  bloodGroupName: string;
  email: string;
  photoUrl: string;
  homeAddress: string;
  permanentAddress: string;
  location: Location;
  phoneNumbers: PhoneNumber[];
  createdAt: string;
  updatedAt: string;
}
interface PhoneNumber {
  id: string;
  profileId: string;
  number: string;
  createdAt: string;
  updatedAt: string;
}
interface Location {
  id: string;
  profileId: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}
interface HospitalLocation {
  id: string;
  profileId?: any;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}
interface PrescriptionFile {
  id: string;
  bloodDonationRequestId: string;
  donorId?: any;
  name: string;
  url: string;
  createdAt: string;
}

export interface PrescriptionFilePayload {
  name: string;
  url: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface BloodRequestPayload {
  medicalNotes?: string;
  hospitalName: string;
  hospitalAddress: string;
  bloodNeededBefore: string;
  bagsNeeded: number;
  hospitalLocation: ILocation;
  prescriptionFiles?: PrescriptionFilePayload[];
  patientId: string;
}

export interface BloodRequestAcceptPayload {
  canDonateBloodBagUpto?: number;
  bloodDonationRequestId: string;
  donateBloodBag?: number;
  donorId?: string;
}

export interface ExtendRequestPayload {
  sessionEnd: Date;
  bloodDonationRequestId: string;
}
