export class Employee {
    _id?: string;
    agencyId?: string;
    firstname?: string;
    lastname?: string;
    mail?: string;
    phone?: string;
    specialization?: string;

    constructor(firstname?: string, lastname?: string, mail?: string, phone?: string, specialization?: string, agencyId?: string) {
        this.firstname = firstname
        this.lastname = lastname
        this.mail = mail
        this.phone = phone
        this.specialization = specialization 
        this.agencyId = agencyId;
    }

    static clone(employee: Employee) {
        let newEmployee = new Employee(employee.firstname, employee.lastname, employee.mail, employee.phone, employee.specialization, employee.agencyId);
        newEmployee._id = employee._id;
        return newEmployee;
    }
}