import dayjs, { Dayjs } from "dayjs";
import { Person } from "../Models/PersonModel";

const POLISH_PHONE_NUMBER_LENGTH = 9;

export class PersonToolsService {
    public GetAge = (birthDate: Dayjs): number => {
        return dayjs().diff(birthDate, 'year');
    }

    public IsRequiredFieldEmpty = <K extends keyof Person>(person: Person, field: K) => {
        if (person.isModified && person[field] === undefined) {
            return true;
        }
        return false
    }

    public IsPostalCodeImproper = (person: Person) => {
        let regexp = new RegExp('^[0-9]{2}-[0-9]{3}$');
        if (person.isModified && (!person.postalCode || !regexp.test(person.postalCode))) {
            return true;
        }
        return false
    }

    public IsPhoneNumberImproper = (person: Person) => {
        if (person.isModified && (!person.phoneNumber || person.phoneNumber.toString().length !== POLISH_PHONE_NUMBER_LENGTH)) {
            return true;
        }
        return false
    }
    
}