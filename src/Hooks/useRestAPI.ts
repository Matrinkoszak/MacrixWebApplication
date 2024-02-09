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

    const deletePerson = async (person: Person): Promise<void> => {
        await restAPIService.deletePerson(person);
    }

    const updatePerson = async (person: Person): Promise<void> => {
        await restAPIService.updatePerson(person);
    }

    const addPeople = async (people: Person[]): Promise<void> => {
        await restAPIService.addPeople(people);
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
            deletePerson(person);
        })

        peopleToUpdate.map(person => {
            updatePerson(person);
        })

        addPeople(peopleToAdd);

    }

    return {
        getPeople,
        saveChanges
    };
};