export interface PersonResponse {
    id: number;
    firstName: string;
    lastName: string;
    streetName: string;
    houseNumber: number;
    apartmentNumber?: number;
    postalCode: string;
    town: string;
    phoneNumber: number;
    dateOfBirth: string;
}