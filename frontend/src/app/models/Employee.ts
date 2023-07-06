export class Employee {
    _id?: string;
    firstname?: string;
    lastname?: string;
    mail?: string;
    phone?: string;
    specialization?: string;

    constructor(firstname?: string, lastname?: string, mail?: string, phone?: string, specialization?: string) {
        this.firstname = firstname
        this.lastname = lastname
        this.mail = mail
        this.phone = phone
        this.specialization = specialization 
    }

    static clone(employee: Employee) {
        let newEmployee = new Employee(employee.firstname, employee.lastname, employee.mail, employee.phone, employee.specialization);
        newEmployee._id = newEmployee._id;
        return newEmployee;
    }
}