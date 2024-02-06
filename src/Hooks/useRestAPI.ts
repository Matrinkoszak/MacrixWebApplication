import { error } from 'console';
import { Person } from '../Models/PersonModel';
import { RestApiService } from '../Services/RestAPIService';

export const useRestAPI = () => {
    const restAPIService = new RestApiService();

    const getPeople = async (): Promise<object> => {
        const response = await restAPIService.getPeople();
        //console.log(response);
        return response;
    }

    const deletePerson = async (person: Person): Promise<number> => {
        return await restAPIService.deletePerson(person);
    }

    const updatePerson = async (person: Person): Promise<number> => {
        return await restAPIService.updatePerson(person);
    }

    const addPeople = async (people: Person[]): Promise<number> => {
        return await restAPIService.addPeople(people);
    }

    const saveChanges = async (people: Person[]) => {
        let peopleToRemove: Person[] = [];
        let peopleToUpdate: Person[] = [];
        let peopleToAdd: Person[] = [];
        people.map(person => {
            if (person.isDeleted && !person.isTemp) {
                peopleToRemove.push(person);
            }
            else if (person.isModified && !person.isTemp) {
                peopleToUpdate.push(person);
            }
            else if (!person.isDeleted && person.isModified && person.isTemp) {
                peopleToAdd.push(person);
            }
        })

        peopleToRemove.map(person => {
            deletePerson(person).then(status => {
                if (status !== 204) {
                    alert("Removing person with id " + person.Id + " failed.");
                }
            })
        })

        peopleToUpdate.map(person => {
            updatePerson(person).then(status => {
                if (status !== 204) {
                    alert("Updating person with id " + person.Id + " failed.");
                }
            })
        })

        addPeople(peopleToAdd).then(status => {
            if (status !== 201) {
                alert("Uploading new people failed.");
            }
        })

    }

    return {
        getPeople,
        saveChanges
    };
};