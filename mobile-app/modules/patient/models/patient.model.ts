export interface PatientData {
  id: string;
  name: string;
  relation: string;
  bloodGroupName: string;
  dateOfBirth: string;
  photoUrl: string;
  phoneNumbers: PhoneNumber[];
  email: string;
  managedByUser: ManagedByUser;
  isSelfRegistered: boolean;
  bloodDonationRequests: BloodDonationRequest[];
  createdAt: string;
  updatedAt: string;
}
interface BloodDonationRequest {
  id: string;
  medicalNotes: string;
  prescriptionFiles: PrescriptionFile[];
  hospitalName: string;
  hospitalAddress: string;
  hospitalLocation: Location;
  bloodNeededBefore: string;
  bagsNeeded: number;
  bagsReceived: number;
  bloodDonationRequestStatus: BloodDonationRequestStatus[];
  createdAt: string;
  updatedAt: string;
}
interface BloodDonationRequestStatus {
  id: string;
  donorId: string;
  canDonateBloodBagUpto: number;
  timestamp: string;
  donorResponse: string;
  donorReachedAt: string;
  bloodBagDonated: number;
  isDismissed: boolean;
  isConfirmedByPatient: boolean;
  isRejectedByPatient: boolean;
  bloodDonationRequestUpdates: BloodDonationRequestUpdate[];
}
interface BloodDonationRequestUpdate {
  id: string;
  requestStatusName: string;
  timestamp: string;
}
interface PrescriptionFile {
  id: string;
  name: string;
  url: string;
}
interface ManagedByUser {
  id: string;
  email: string;
  profile: Profile;
}
interface Profile {
  id: string;
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
interface Location {
  id: string;
  latitude: number;
  longitude: number;
}
interface PhoneNumber {
  id: string;
  number: string;
}

export interface PatientPayload {
  name: string;
  email?: string;
  relation?: string;
  bloodGroupName: string;
  dateOfBirth?: string;
  photoUrl?: string;
  phoneNumbers: string[];
}
