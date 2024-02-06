import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRestAPI } from '../../Hooks/useRestAPI';
import styles from '../Table/Table.module.scss'
import { Person } from '../../Models/PersonModel';

const POLISH_PHONE_NUMBER_LENGTH = 9;

const Table: FC = () => {
    const { getPeople } = useRestAPI();
    const [people, setPeople] = useState<Person[]>([]);
    const [wrongNumbers, setWrongNumbers] = useState<number[]>([]);
    const [showNumbersSection, setShowNumbersSection] = useState<boolean>(false);
    const [wrongPostalCodes, setWrongPostalCodes] = useState<number[]>([]);
    const [showCodesSection, setShowCodesSection] = useState<boolean>(false);
    const [emptyFieldsRows, setEmptyFieldsRows] = useState<number[]>([]);
    const [showEmptyFieldsSection, setShowEmptyFieldsSection] = useState<boolean>(false);

    useEffect(() => {
        getPeople().then(resp => {
            setPeople(resp as Person[]);
        });
    }, [])

    const headers: { key: string, label: string }[] = [
        { key: "id", label: "ID" },
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "streetName", label: "Street Name" },
        { key: "houseNumber", label: "House Number" },
        { key: "apartmentNumber", label: "Apartment Number" },
        { key: "postalCode", label: "Postal Code" },
        { key: "town", label: "Town" },
        { key: "phoneNumber", label: "Phone Number" },
        { key: "dateOfBirth", label: "Birth Date" },
        { key: "age", label: "Age" },
        { key: "delete", label: "Add/Delete" }
    ];

    const GetAge = (birthDate: Dayjs): number => {
        return dayjs().diff(birthDate, 'year');
    }

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
            isModified: false
        });
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
        setWrongNumbers(tempWrongNumbers);
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
        setWrongPostalCodes(tempWrongCodes);
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
        setEmptyFieldsRows(tempEmptyIds);
        if (tempEmptyIds.length > 0) {
            setShowEmptyFieldsSection(true);
        }
        else {
            setShowEmptyFieldsSection(false);
        }
    }



    const ModifyPeople = <K extends keyof Person>(id: number, field: K, newValue: Person[K]) => {
        let tempPeople = [...people];
        let target = tempPeople.filter(x => x.Id === id)[0];
        target[field] = newValue;
        target.isModified = true;
        setPeople(tempPeople);
        console.log(people);

        AreThereEmptyFields();

        //checking for phoneNumber correctness
        if (field === "phoneNumber") {
            ArePhoneNumbersCorrect();
        }

        //checking for postalCode correctness
        if (field === "postalCode") {
            ArePostalCodesCorrect();
        }
    }

    return (
        <div className={styles.TableComponent}>
            {showNumbersSection && (
                <div>
                    {"The elements with id " + wrongNumbers.toString() + " have phone numbers of incorrect length"}
                </div>
            )}
            {showCodesSection && (
                <div>
                    {"The elements with id " + wrongPostalCodes.toString() + " have inproper Postal Code."}
                </div>
            )}
            {showEmptyFieldsSection && (
                <div>
                    {"The elements with id " + emptyFieldsRows.toString() + " have empty fields that are required."}
                </div>
            )}
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        {headers.map((row) => {
                            return <td key={row.key} className={styles.tableHeaderCell} >
                                <div className={styles.tableCell}>
                                    {row.label}
                                </div>
                            </td>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {people.map((element, index) => {
                        return (
                            <tr key={element.Id} className={styles.tableRow}>
                                <td>{element.Id}</td>
                                <td>
                                    <input type="text" style={{ height: "45px" }} defaultValue={element.firstName ? element.firstName : ""} onChange={e => ModifyPeople<"firstName">(element.Id, "firstName", e.target.value)} />
                                </td>
                                <td>
                                    <input type="text" style={{ height: "45px" }} defaultValue={element.lastName ? element.lastName : ""} onChange={e => ModifyPeople<"lastName">(element.Id, "lastName", e.target.value)} />
                                </td>
                                <td>
                                    <input type="text" style={{ height: "45px" }} defaultValue={element.streetName ? element.streetName : ""} onChange={e => ModifyPeople<"streetName">(element.Id, "streetName", e.target.value)} />
                                </td>
                                <td>
                                    <input type="text" style={{ height: "45px" }} defaultValue={element.houseNumber !== undefined ? element.houseNumber.toString() : ""} onChange={e => ModifyPeople<"houseNumber">(element.Id, "houseNumber", Number(e.target.value))} />
                                </td>
                                <td>
                                    <input type="text" style={{ height: "45px" }} defaultValue={element.apartmentNumber !== undefined ? element.apartmentNumber.toString() : ""} onChange={e => ModifyPeople<"apartmentNumber">(element.Id, "apartmentNumber", Number(e.target.value))} />
                                </td>
                                <td>
                                    <input type="text" style={{ height: "45px" }} defaultValue={element.postalCode ? element.postalCode : ""} onChange={e => ModifyPeople<"postalCode">(element.Id, "postalCode", e.target.value)} />
                                </td>
                                <td>
                                    <input type="text" style={{ height: "45px" }} defaultValue={element.town ? element.town : ""} onChange={e => ModifyPeople<"town">(element.Id, "town", e.target.value)} />
                                </td>
                                <td>
                                    <input type="text" style={{ height: "45px" }} defaultValue={element.phoneNumber !== undefined ? element.phoneNumber : ""} onChange={e => ModifyPeople<"phoneNumber">(element.Id, "phoneNumber", Number(e.target.value))} />
                                </td>
                                <td>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            value={element.dateOfBirth}
                                            onChange={(newValue) => ModifyPeople<"dateOfBirth">(element.Id, "dateOfBirth", newValue ? newValue : dayjs())}
                                        />
                                    </LocalizationProvider>
                                </td>
                                <td>{element.dateOfBirth ? GetAge(element.dateOfBirth) : ""}</td>
                                <td>{index+1 === people.length ? "Add" : "Delete"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div>
                {/*<Button
                    onPress={onPressLearnMore}
                    title="Refresh"
                />*/}
                <button onClick={() => AddEmptyRow()} > Add </button>
                {/*<Button
                    onPress={onPressLearnMore}
                    title="Save"
                />
                <Button
                    onPress={onPressLearnMore}
                    title="Add"
                />*/}
            </div>
        </div>
    );
}

export default Table;