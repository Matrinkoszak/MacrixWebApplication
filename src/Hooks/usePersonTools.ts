import { Dayjs } from "dayjs";
import { Person } from "../Models/PersonModel";
import { PersonToolsService } from "../Services/PersonToolsService";

export const usePersonTools = () => {
    const personToolsService = new PersonToolsService();

    const getAge = (birthDate: Dayjs) => {
        return personToolsService.GetAge(birthDate);
    }

    const isRequiredFieldEmpty = <K extends keyof Person>(person: Person, field: K) => {
        return personToolsService.IsRequiredFieldEmpty(person, field);
    }

    const isPostalCodeImproper = (person: Person) => {
        return personToolsService.IsPostalCodeImproper(person);
    }

    const isPhoneNumberImproper = (person: Person) => {
        return personToolsService.IsPhoneNumberImproper(person);
    }

    return {
        getAge,
        isRequiredFieldEmpty,
        isPhoneNumberImproper,
        isPostalCodeImproper
    };
};