import '@testing-library/jest-dom';
import dayjs, { Dayjs } from 'dayjs';
import { Person } from '../Models/PersonModel';
import { PersonToolsService } from "../Services/PersonToolsService";

describe("PersonToolsService functions", () => {
    it("should give correct current age for provided date", () => {
        const service = new PersonToolsService();
        const threeYearsPrior: Dayjs = dayjs().subtract(3, 'year');
        expect(service.GetAge(threeYearsPrior)).toEqual(3);
    });
    it("should correctly check for filled field by field name alone in provided Person entity that was modified", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, firstName: "name", isDeleted: false, isModified: true, isTemp: false }
        expect(service.IsRequiredFieldEmpty(person, "firstName")).toEqual(false);
    });
    it("should correctly check for empty field by field name alone in provided Person entity that was modified", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, firstName: "name", isDeleted: false, isModified: true, isTemp: false }
        expect(service.IsRequiredFieldEmpty(person, "lastName")).toEqual(true);
    });
    it("should correctly check proper Postal Code form of provided Person entity", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, postalCode: "12-123", isDeleted: false, isModified: true, isTemp: true }
        expect(service.IsPostalCodeImproper(person)).toEqual(false);
    });
    it("should correctly check improper Postal Code form of provided Person entity", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, postalCode: "123456", isDeleted: false, isModified: true, isTemp: true }
        expect(service.IsPostalCodeImproper(person)).toEqual(true);
    });
    it("should correctly check empty Postal Code form of provided Person entity", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, isDeleted: false, isModified: true, isTemp: true }
        expect(service.IsPostalCodeImproper(person)).toEqual(true);
    });
    it("should correctly check proper Phone Number form of provided Person entity", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, phoneNumber: 123456789, isDeleted: false, isModified: true, isTemp: true }
        expect(service.IsPhoneNumberImproper(person)).toEqual(false);
    });
    it("should correctly check improper Phone Number form of provided Person entity", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, phoneNumber: 12345, isDeleted: false, isModified: true, isTemp: true }
        expect(service.IsPhoneNumberImproper(person)).toEqual(true);
    });
    it("should correctly check empty Phone Number form of provided Person entity", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, isDeleted: false, isModified: true, isTemp: true }
        expect(service.IsPhoneNumberImproper(person)).toEqual(true);
    });
    it("should correctly check modified status form of provided Person entity while checking phone number", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, isDeleted: false, isModified: false, isTemp: true }
        expect(service.IsPhoneNumberImproper(person)).toEqual(false);
    });
    it("should correctly check modified status form of provided Person entity while checking post code", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, isDeleted: false, isModified: false, isTemp: true }
        expect(service.IsPostalCodeImproper(person)).toEqual(false);
    });
    it("should correctly check modified status form of provided Person entity while checking empty field", () => {
        const service = new PersonToolsService();
        const person: Person = { Id: 0, isDeleted: false, isModified: false, isTemp: true }
        expect(service.IsRequiredFieldEmpty(person, "firstName")).toEqual(false);
    });
});