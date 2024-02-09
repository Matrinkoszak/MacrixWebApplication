import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRestAPI } from '../../Hooks/useRestAPI';
import styles from '../Table/Table.module.scss'
import { Person } from '../../Models/PersonModel';
import TableRow from '../TableRow/TableRowComponent';

const POLISH_PHONE_NUMBER_LENGTH = 9;

const Table: FC = () => {
    const { getPeople, saveChanges } = useRestAPI();
    const [people, setPeople] = useState<Person[]>([]);
    const [areAllPhoneNumbersProper, setShowNumbersSection] = useState<boolean>(false);
    const [areAllCodesProper, setShowCodesSection] = useState<boolean>(false);
    const [areAllRequiredFieldsFilled, setShowEmptyFieldsSection] = useState<boolean>(false);

    useEffect(() => {
        ReloadData()
    }, [])

    const AddEmptyRow = () => {
        let tempPeople = [...people];
        tempPeople.push({
            Id: tempPeople.length ,
            firstName: undefined,
            lastName: undefined,
            streetName: undefined,
            houseNumber: undefined,
            postalCode: undefined,
            town: undefined,
            phoneNumber: undefined,
            dateOfBirth: dayjs(),
            isTemp: true,
            isModified: false,
            isDeleted: false
        });
        tempPeople.map(element => {
            element = correctID(element, tempPeople);
        })
        setPeople(tempPeople);
    }


    const ArePhoneNumbersCorrect = () => {
        let tempWrongNumbers: number[] = [];
        people.map((person) => {
            if (person.phoneNumber) {
                if (person.phoneNumber.toString().length !== POLISH_PHONE_NUMBER_LENGTH) {
                    tempWrongNumbers.push(person.Id);
                }
            }
            else if ((person.isModified && person.isTemp) || (!person.isTemp)) {
                tempWrongNumbers.push(person.Id);
            }
        })
        if (tempWrongNumbers.length > 0) {
            setShowNumbersSection(true);
        }
        else {
            setShowNumbersSection(false);
        }
    }

    const ArePostalCodesCorrect = () => {
        let tempWrongCodes: number[] = [];
        people.map((person) => {
            if (person.postalCode) {
                let regexp = new RegExp('^[0-9]{2}-[0-9]{3}$');
                if (!regexp.test(person.postalCode)) {
                    tempWrongCodes.push(person.Id);
                }
            }
            else if ((person.isModified && person.isTemp) || (!person.isTemp)) {
                tempWrongCodes.push(person.Id);
            }
        })
        if (tempWrongCodes.length > 0) {
            setShowCodesSection(true);
        }
        else {
            setShowCodesSection(false);
        }
    }

    const AreThereEmptyFields = () => {
        let tempEmptyIds: number[] = [];
        people.map((person) => {
            if ((person.firstName
                && person.lastName
                && person.streetName
                && person.houseNumber
                && person.postalCode
                && person.town
                && person.phoneNumber
                && person.dateOfBirth
                && (person.isTemp || !(person.isTemp && person.isModified)))
            === undefined) {
                tempEmptyIds.push(person.Id);
            }
        })
        if (tempEmptyIds.length > 0) {
            setShowEmptyFieldsSection(true);
        }
        else {
            setShowEmptyFieldsSection(false);
        }
    }

    const correctID = (element: Person, people: Person[]): Person => {
        const tempPeople: Person[] = [];
        people.map(person => {
            tempPeople.push(person);
        })
        if (element.isTemp) {
            const index = people.indexOf(element);
            tempPeople.splice(index, 1);
            if (tempPeople.filter(x => x.Id === element.Id).length > 0) {
                element.Id = element.Id + 1;
                return correctID(element, tempPeople);
            }
        }
        return element;
        
    }

    const Refresh = () => {
        let initialSize = people.length;
        let tempPeople: Person[] = [];
        people.map(person => {
            if (person.isTemp) {
                tempPeople.push(person);
                initialSize = initialSize - 1;
            }
        });
        setPeople([]);
        getPeople().then(resp => {
            let refreshedPeople = (resp as Person[]);
            refreshedPeople.map(refreshed => {
                tempPeople.push(refreshed);
            });

            tempPeople.map(element => {
                element = correctID(element, tempPeople);
            })

            setPeople(tempPeople.sort((a, b) => a.Id - b.Id));

            AreThereEmptyFields();
            ArePhoneNumbersCorrect();
            ArePostalCodesCorrect();
        });

        
    }

    const ReloadData = () => {
        setShowCodesSection(false);
        setShowEmptyFieldsSection(false);
        setShowNumbersSection(false);
        setPeople([]);
        getPeople().then(resp => {
            setPeople(resp as Person[]);
        });
    }

    const Save = () => {
        if (!areAllCodesProper && !areAllRequiredFieldsFilled && !areAllPhoneNumbersProper) {
            saveChanges(people).then(() => {
                let tempPeople: Person[] = [];
                people.map(person => {
                    if (person.isTemp && person.isModified) {
                        person.isTemp = false;
                    }
                    person.isModified = false;
                    tempPeople.push(person);
                })
                setPeople(tempPeople);
            });
        }
        else {
            alert("Cannot save with incorrect data!");
        }
        
    }

    const setPerson = (person: Person) => {
        const targetIndex = people.indexOf(person);
        let tempPeople = [...people];
        tempPeople.splice(targetIndex, 1);
        tempPeople.push(person);
        tempPeople.sort((a, b) => a.Id - b.Id);
        setPeople(tempPeople);
        console.log(people);
    }

    return (
        <div className={styles.TableComponent}>
            <div className={styles.HeaderSpace}>
                <div className={styles.HeaderCell}>
                    First Name
                </div>
                <div className={styles.HeaderCell}>
                    Last Name
                </div>
                <div className={styles.HeaderCell}>
                    Street Name
                </div>
                <div className={styles.HeaderCell}>
                    House Number
                </div>
                <div className={styles.HeaderCell}>
                    Apartment Number
                </div>
                <div className={styles.HeaderCell}>
                    Postal Code
                </div>
                <div className={styles.HeaderCell}>
                    Town
                </div>
                <div className={styles.HeaderCell}>
                    Phone Number
                </div>
                <div className={styles.CalendarHeaderCell}>
                    Date Of Birth
                </div>
                <div className={styles.AgeHeaderCell}>
                    Age
                </div>
                <div className={styles.DeleteHeaderCell}>
                    Delete
                </div>
            </div>
            {people.map((element) => {
                if (!element.isDeleted) {
                    return (
                        <TableRow key={element.Id} person={element} setPerson={setPerson} />
                    )
                }
            }
            )}
            <div>
                <button onClick={() => Refresh()} > Refresh </button>
                <button onClick={() => AddEmptyRow()} > Add </button>
                <button onClick={() => Save()} > Save </button>
                <button onClick={() => ReloadData()} > Cancel </button>
            </div>
        </div>
    );
}

export default Table;