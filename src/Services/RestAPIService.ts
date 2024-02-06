import axios from 'axios';
import dayjs from 'dayjs';
import { Person } from '../Models/PersonModel';
import { PersonNetworkModel } from '../Models/PersonResponseModel';
import { useRestAPI } from '../Hooks/useRestAPI';

export class RestApiService {

    public getPeople = () => {
        const url = "https://localhost:7212/api/People";
        return axios({
            method: 'get',
            url: url
        }).then((response) => {
            var result: Person[] = [];
            response.data.map((element: PersonNetworkModel) => {
                console.log(element);
                const person: Person = {
                    Id: element.id,
                    firstName: element.firstName,
                    lastName: element.lastName,
                    streetName: element.streetName,
                    houseNumber: element.houseNumber,
                    apartmentNumber: element.apartmentNumber,
                    postalCode: element.postalCode,
                    town: element.town,
                    phoneNumber: element.phoneNumber,
                    dateOfBirth: dayjs(element.dateOfBirth),
                    isTemp: false,
                    isModified: false
                };
                result.push(person);
            })
            console.log(result);
            return result;
        })
    }

    /*public updatePerson = (person: Person) => {
        const url = "https://localhost:7212/api/People/" + person.Id;
        const personModel: PersonNetworkModel = {
            id: person.Id,
            firstName: person.firstName?,
            lastName: person.lastName
        }
        return axios({
            method: 'put',
            url: url
        }).then((response) => {
            var result: Person[] = [];
            response.data.map((element: PersonNetworkModel) => {
                console.log(element);
                const person: Person = {
                    Id: element.id,
                    firstName: element.firstName,
                    lastName: element.lastName,
                    streetName: element.streetName,
                    houseNumber: element.houseNumber,
                    apartmentNumber: element.apartmentNumber,
                    postalCode: element.postalCode,
                    town: element.town,
                    phoneNumber: element.phoneNumber,
                    dateOfBirth: dayjs(element.dateOfBirth),
                    isTemp: false,
                    isModified: false
                };
                result.push(person);
            })
            console.log(result);
            return result;
        })

    }*/
}