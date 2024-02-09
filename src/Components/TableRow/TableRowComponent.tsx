import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//import { useRestAPI } from '../../Hooks/useRestAPI';
import styles from '../TableRow/TableRow.module.scss'
import { Person } from '../../Models/PersonModel';
import { ITableRowProps } from './ITableRowProps';
import { usePersonTools } from '../../Hooks/usePersonTools';

const POLISH_PHONE_NUMBER_LENGTH = 9;

const TableRow: FC<ITableRowProps> = (props) => {
    const { getAge, isPhoneNumberImproper, isPostalCodeImproper, isRequiredFieldEmpty } = usePersonTools();
    const [areThereEmptyFields, setAreThereEmptyFields] = useState<boolean>(false);
    const [isPhoneNumberIncorrect, setIsPhoneNumberIncorrect] = useState<boolean>(false);
    const [isPostalCodeIncorrect, setIsPostalCodeIncorrect] = useState<boolean>(false);

    useEffect(() => {
        checkForEmptyFields();
        CheckForProperPostalCode();
        CheckForProperPhoneNumber();
    }, [JSON.stringify(props.person)])


    ///the 3 below functions have set statements for the state in if statements to prevent infinite rerender loops
    const getDefaultRequiredCellStyle = <K extends keyof Person>(field: K) => {
        if (isRequiredFieldEmpty(props.person, field)) {
            return styles.incorrectCell;
        }
        return styles.outerCell;
    }

    const checkForEmptyFields = () => {
        if (isRequiredFieldEmpty(props.person, "firstName")
            || isRequiredFieldEmpty(props.person, "lastName")
            || isRequiredFieldEmpty(props.person, "streetName")
            || isRequiredFieldEmpty(props.person, "houseNumber")
            || isRequiredFieldEmpty(props.person, "postalCode")
            || isRequiredFieldEmpty(props.person, "town")
            || isRequiredFieldEmpty(props.person, "phoneNumber")
        ) {
            setAreThereEmptyFields(true);
        }
        else {
            setAreThereEmptyFields(false);
        }
    }

    const getPostalCodeCellStyle = () => {
        if (isPostalCodeImproper(props.person)) {
            return styles.incorrectCell;
        }
        return styles.outerCell;
    }

    const CheckForProperPostalCode = () => {
        if (isPostalCodeImproper(props.person)) {
            setIsPostalCodeIncorrect(true);
        }
        else {
            setIsPostalCodeIncorrect(false);
        }
    }

    const getPhoneNumberCellStyle = () => {
        if (isPhoneNumberImproper(props.person)) {
            return styles.incorrectCell;
        }
        return styles.outerCell;
    }

    const CheckForProperPhoneNumber = () => {
        if (isPhoneNumberImproper(props.person)) {
            setIsPhoneNumberIncorrect(true);
        }
        else {
            setIsPhoneNumberIncorrect(false);
        }
    }

    const ModifyPerson = <K extends keyof Person>(field: K, newValue: Person[K]) => {
        let tempPerson = props.person;
        tempPerson[field] = newValue;
        tempPerson.isModified = true;
        props.setPerson(tempPerson);
        //console.log(props.person);
    }

    return (
        <div className={styles.TableRowComponent} >
            <div className={styles.TableRow} >
                <div className={getDefaultRequiredCellStyle("firstName")} >
                    <input type="text" style={{ height: "45px" }} defaultValue={props.person.firstName ? props.person.firstName : ""} onChange={e => ModifyPerson<"firstName">("firstName", e.target.value)} />
                </div>
                <div className={getDefaultRequiredCellStyle("lastName")} >
                    <input type="text" style={{ height: "45px" }} defaultValue={props.person.lastName ? props.person.lastName : ""} onChange={e => ModifyPerson<"lastName">("lastName", e.target.value)} />
                </div>
                <div className={getDefaultRequiredCellStyle("streetName")} >
                    <input type="text" style={{ height: "45px" }} defaultValue={props.person.streetName ? props.person.streetName : ""} onChange={e => ModifyPerson<"streetName">("streetName", e.target.value)} />
                </div>
                <div className={getDefaultRequiredCellStyle("houseNumber")} >
                    <input type="text" style={{ height: "45px" }} defaultValue={props.person.houseNumber !== undefined ? props.person.houseNumber.toString() : ""} onChange={e => ModifyPerson<"houseNumber">("houseNumber", Number(e.target.value))} />
                </div>
                <div className={styles.outerCell} >
                    <input type="text" style={{ height: "45px" }} defaultValue={props.person.apartmentNumber !== undefined ? props.person.apartmentNumber.toString() : ""} onChange={e => ModifyPerson<"apartmentNumber">("apartmentNumber", Number(e.target.value))} />
                </div>
                <div className={getPostalCodeCellStyle()} >
                    <input type="text" style={{ height: "45px"}} defaultValue={props.person.postalCode ? props.person.postalCode : ""} onChange={e => ModifyPerson<"postalCode">("postalCode", e.target.value)} />
                </div>
                <div className={getDefaultRequiredCellStyle("town")} >
                    <input type="text" style={{ height: "45px" }} defaultValue={props.person.town ? props.person.town : ""} onChange={e => ModifyPerson<"town">("town", e.target.value)} />
                </div>
                <div className={getPhoneNumberCellStyle()} >
                    <input type="text" style={{ height: "45px" }} defaultValue={props.person.phoneNumber !== undefined ? props.person.phoneNumber : ""} onChange={e => ModifyPerson<"phoneNumber">("phoneNumber", Number(e.target.value))} />
                </div>
                <div className={styles.outerCell} >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={props.person.dateOfBirth}
                            onChange={(newValue) => ModifyPerson<"dateOfBirth">("dateOfBirth", newValue ? newValue : dayjs())}
                        />
                    </LocalizationProvider>
                </div>
                <div className={styles.ageCell} >
                    {props.person.dateOfBirth ? getAge(props.person.dateOfBirth) : ""}
                </div>
                <div className={styles.outerCell} >
                    <button onClick={() => ModifyPerson<"isDeleted">("isDeleted", true)} > Delete </button>
                </div>
            </div>
            <div className={styles.errorSpace} >
                {areThereEmptyFields && (
                    <div>
                        There are required fields which are empty!
                    </div>
                )}
                {isPhoneNumberIncorrect && (
                    <div>
                        The phone number has inproper length!
                    </div>
                )}
                {isPostalCodeIncorrect && (
                    <div>
                        The postal code is in incorrect format!
                    </div>
                )}
            </div>
        </div>
    );
}

export default TableRow;