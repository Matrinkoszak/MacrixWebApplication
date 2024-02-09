import axios from 'axios';
import dayjs from 'dayjs';
import { Person } from '../Models/PersonModel';
import { PersonNetworkModel } from '../Models/PersonResponseModel';

export class RestApiService {

    public getPeople = () => {
        const url = "https://localhost:7212/api/People";
        return axios({
            method: 'get',
            url: url
        }).then((response) => {
            var result: Person[] = [];
            response.data.map((element: PersonNetworkModel) => {
                //console.log(element);
                const person: Person = {
                    Id: element.id,
                    firstName: element.firstName,
                    lastName: element.lastName,
                    streetName: element.streetName,
                    houseNumber: element.houseNumber,
                    apartmentNumber: element.apartmentNumber ? element.apartmentNumber : undefined,
                    postalCode: element.postalCode,
                    town: element.town,
                    phoneNumber: element.phoneNumber,
                    dateOfBirth: dayjs(element.dateOfBirth),
                    isTemp: false,
                    isModified: false,
                    isDeleted: false
                };
                result.push(person);
            }).catch((error: { response: { data: any; status: any; headers: any; }; request: any; message: any; }) => {
                if (error.response) {
                    alert("Error! Couldn't download data. Error code: " + error.response.status + " with message: " + error.message);
                } else if (error.request) {
                    alert("Error! Couldn't connect to server!")
                } else {
                    alert("Error! " + error.message);
                }
            });
            //console.log(result);
            return result;
        })
    }

    public updatePerson = async (person: Person): Promise<void> => {
        const url = "https://localhost:7212/api/People/" + person.Id;
        const personModel: PersonNetworkModel = {
            id: person.Id,
            firstName: person.firstName,
            lastName: person.lastName,
            streetName: person.streetName,
            houseNumber: person.houseNumber,
            apartmentNumber: person.apartmentNumber,
            postalCode: person.postalCode,
            town: person.town,
            phoneNumber: person.phoneNumber,
            dateOfBirth: person.dateOfBirth?.toISOString()
        }
        await axios.put(url, personModel).catch((error: { response: { data: any; status: any; headers: any; }; request: any; message: any; }) => {
            if (error.response) {
                alert("Error! Couldn't download data. Error code: " + error.response.status + " with message: " + error.message);
            } else if (error.request) {
                alert("Error! Couldn't connect to server!")
            } else {
                alert("Error! " + error.message);
            }
        });

    }

    public deletePerson = async (person: Person): Promise<void> => {
        const url = "https://localhost:7212/api/People/" + person.Id;
        await axios.delete(url).catch((error: { response: { data: any; status: any; headers: any; }; request: any; message: any; }) => {
            if (error.response) {
                alert("Error! Couldn't download data. Error code: " + error.response.status + " with message: " + error.message);
            } else if (error.request) {
                alert("Error! Couldn't connect to server!")
            } else {
                alert("Error! " + error.message);
            }
        });
    }

    public addPeople = async (people: Person[]): Promise<void> => {
        const url = "https://localhost:7212/api/People/";
        let peopleModel: PersonNetworkModel[] = [];
        people.map(person => {
            const personModel: PersonNetworkModel = {
                id: person.Id,
                firstName: person.firstName,
                lastName: person.lastName,
                streetName: person.streetName,
                houseNumber: person.houseNumber,
                apartmentNumber: person.apartmentNumber,
                postalCode: person.postalCode,
                town: person.town,
                phoneNumber: person.phoneNumber,
                dateOfBirth: person.dateOfBirth?.toISOString()
            }
            peopleModel.push(personModel);

        })
        await axios.post(url, peopleModel).catch((error: { response: { data: any; status: any; headers: any; }; request: any; message: any; }) => {
            if (error.response) {
                alert("Error! Couldn't download data. Error code: " + error.response.status + " with message: " + error.message);
            } else if (error.request) {
                alert("Error! Couldn't connect to server!")
            } else {
                alert("Error! " + error.message);
            }
        });

    }
}