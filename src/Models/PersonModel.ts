import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pl';

dayjs.locale('pl');

export interface Person {
    Id: number;
    firstName: string;
    lastName: string;
    streetName: string;
    houseNumber: number;
    apartmentNumber?: number;
    postalCode: string;
    town: string;
    phoneNumber: number;
    dateOfBirth: Dayjs;
}