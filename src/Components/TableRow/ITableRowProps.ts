import { Person } from "../../Models/PersonModel";

export interface ITableRowProps {
    person: Person;
    setPerson: (people: Person) => void;
}