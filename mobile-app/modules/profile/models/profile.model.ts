export interface ProfileData {
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
  location: RootObjectLocation;
  phoneNumbers: RootObjectPhoneNumbers[];
  donorProfile: RootObjectDonorProfile;
  user: RootObjectUser;
}
export interface RootObjectLocation {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}
export interface RootObjectPhoneNumbers {
  id: string;
  number: string;
  createdAt: string;
  updatedAt: string;
}
export interface RootObjectDonorProfile {
  id: string;
  profileId: string;
  lastDonatedAt: string;
  IsNationalIdVerified: boolean;
  isBirthCertificateNumberVerified: boolean;
  isHealthIdVerified: boolean;
  createdAt: string;
  updatedAt: string;
  verificationFiles: any[];
}
export interface RootObjectUserPatientPhoneNumbers {
  id: string;
  number: string;
  createdAt: string;
  updatedAt: string;
}
export interface RootObjectUserPatient {
  id: string;
  name: string;
  relation: string;
  bloodGroupName: string;
  dateOfBirth: string;
  photoUrl: string;
  email: string;
  isSelfRegistered: boolean;
  createdAt: string;
  updatedAt: string;
  phoneNumbers: RootObjectUserPatientPhoneNumbers[];
}
export interface RootObjectUser {
  id: string;
  email: string;
  password: string;
  refreshToken: string;
  registeredAt: string;
  patient: RootObjectUserPatient[];
}

interface CreateLocationDto {
  latitude: number;
  longitude: number;
}

export interface ProfilePayload {
  name: string;
  dateOfBirth: Date;
  bloodGroupName: string;
  email?: string;
  photoUrl?: string;
  homeAddress?: string;
  permanentAddress?: string;
  location?: CreateLocationDto;
  phoneNumbers: string[];
}

export interface UpdateProfilePayload {
  name?: string;
  dateOfBirth?: Date;
  bloodGroupName?: string;
  email?: string;
  photoUrl?: string;
  homeAddress?: string;
  permanentAddress?: string;
}

export interface UpdateLocationPayload {
  latitude: number;
  longitude: number;
}
