import axios from 'axios';
import dayjs from 'dayjs';
import { Person } from '../Models/PersonModel';
import { PersonResponse } from '../Models/PersonResponseModel';
import { useRestAPI } from '../Hooks/useRestAPI';

export class RestApiService {

    public getPeople = () => {
        const url = "https://localhost:7212/api/People";
        //console.log(url);
        return axios({
            method: 'get',
            url: url
        }).then((response) => {
            var result: Person[] = [];
            response.data.map((element: PersonResponse) => {
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
                    dateOfBirth: dayjs(element.dateOfBirth)
                };
                result.push(person);
            })
            console.log(result);
            return result;
        })
    }
}