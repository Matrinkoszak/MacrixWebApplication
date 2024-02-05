import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useRestAPI } from '../../Hooks/useRestAPI';
import styles from '../Table/Table.module.scss'
import { Person } from '../../Models/PersonModel';

const Table: FC = () => {
    const { getPeople } = useRestAPI();
    const [people, setPeople] = useState<Person[]>([]);

    useEffect(() => {
        getPeople().then(resp => {
            setPeople(resp as Person[]);
        }
        )
    }, [])

    const headers: { key: string, label: string }[] = [
        { key: "Id", label: "ID" },
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
        { key: "delete", label: "" }
    ];

    const GetAge = (birthDate: Dayjs): number => {
        return dayjs().diff(birthDate, 'year');
    }

    const ModifyPeople = <K extends keyof Person>(id: number, field: K, newValue: Person[K]) => {
        let tempPeople = people;
        let target = tempPeople.filter(x => x.Id === id)[0];
        target[field] = newValue;
        setPeople(tempPeople);
        console.log(people);
    }

    return (
        <div className={styles.TableComponent}>
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
                    {people.map((element) => {
                        return (
                            <tr key={element.Id} className={styles.tableRow}>
                                <td>{element.Id}</td>
                                <td>
                                    <input type="text" defaultValue={element.firstName} onChange={e => ModifyPeople<string>(element.Id, "firstName", e.target.value)} />
                                </td>
                                <td>{element.lastName}</td>
                                <td>{element.streetName}</td>
                                <td>{element.houseNumber}</td>
                                <td>{element.apartmentNumber}</td>
                                <td>{element.postalCode}</td>
                                <td>{element.town}</td>
                                <td>{element.phoneNumber}</td>
                                <td>{element.dateOfBirth.format('YYYY-MM-dd')}</td>
                                <td>{GetAge(element.dateOfBirth)}</td>
                                <td>{"Delete"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Table;