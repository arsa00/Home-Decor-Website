import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { GlobalConstants } from '../global-constants';
import { Employee } from '../models/Employee';
import { AgencyService } from '../services/agency.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-agency-employees',
  templateUrl: './agency-employees.component.html',
  styleUrls: ['./agency-employees.component.css']
})
export class AgencyEmployeesComponent implements OnInit {

  // dummy data

  static readonly empl1: Employee = new Employee("Radnik1 ime", "Radnik1 prezime", "Radnik1_mejl@gmail.com", "+38160543210", "moler");
  static readonly empl2: Employee = new Employee("Radnik2 ime", "Radnik2 prezime", "Radnik2_mejl@gmail.com", "+38161543210", "keramicar");
  static readonly empl3: Employee = new Employee("Radnik3 ime", "Radnik3 prezime", "Radnik3_mejl@gmail.com", "+38162543210", "parketar");
  // delete above dummy data

  loggedUser: User;


  allEmployees: Employee[] = [];
  selectedIndex: number;
  selectedEmployee: Employee;


  editMode: boolean = false;
  deleteMode: boolean = false;
  addNewEmployeeMode: boolean = false;


  loadingDialogActive: boolean = false;
  loadingHeaderTxt: string;


  newEmployeeFirstname: string;
  newEmployeeLastname: string;
  newEmployeeMail: string;
  newEmployeePhone: string;
  newEmployeeSpecialization: string;

  newEmployeeFirstnameErr: boolean = false;
  newEmployeeLastnameErr: boolean = false;
  newEmployeeMailErr: boolean = false;
  newEmployeePhoneErr: boolean = false;
  newEmployeeSpecializationErr: boolean = false;


  requestNewOpenPositionsMode: boolean = false;
  numOfNewOpenPositions: number = 0;

  numOfNewOpenPositionsErr: boolean = false;


  errToastMsg: string;
  succToastMsg: string;

  mailRegEx = new RegExp(GlobalConstants.REGEX_MAIL);
  phoneRegEx = new RegExp(GlobalConstants.REGEX_PHONE);


  constructor(private agencyService: AgencyService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));

    this.agencyService.getNumOfOpenedPositions(this.loggedUser.jwt, this.loggedUser._id).subscribe({
      next: (res) => {
        this.loggedUser.numOfOpenedPositions = res["numOfOpenedPositions"];
      },
      error: () => { 
        this.displayErrorToast("Došlo je do greške prilikom učitavanja agencije. Probajte da osvežite stranicu.") 
      }
    });

    this.agencyService.getAllEmployeesForAgency(this.loggedUser.jwt, this.loggedUser._id)
    .subscribe({
      next: (employees: Employee[]) => {
        this.allEmployees = employees;
      },
      error: () => { 
        this.displayErrorToast("Došlo je do greške prilikom učitavanja radnika. Probajte da osvežite stranicu.") 
      }
    });
  }

  displayErrorToast(msg: string) {
    this.errToastMsg = msg;
    new bootstrap.Toast(document.getElementById("err")).show(); 
  }

  displaySuccessfulToast(msg: string) {
    this.succToastMsg = msg;
    new bootstrap.Toast(document.getElementById("succ")).show(); 
  }

  setActive(index): void {
    if(this.selectedIndex == index) {
      if(!this.editMode) {
        this.selectedIndex = null;
        this.selectedEmployee = null;
      }
      return;
    }

    this.selectedIndex = index;
    this.selectedEmployee = Employee.clone(this.allEmployees[index]);
  }

  showActionButtons() {
    return !this.editMode && this.selectedIndex != null && this.selectedIndex != undefined;
  }

  showEditField(index): boolean {
    return this.editMode && this.selectedIndex == index;
  }

  hideDeleteDialog() {
    this.deleteMode = false;
  }

  showDeleteDialog() {
    this.deleteMode = true;
  }

  deleteEmployee() {
    this.hideDeleteDialog();
    this.showLoadingDialog("Brisanje radnika...");

    this.agencyService.deleteEmployee(this.loggedUser.jwt, this.loggedUser._id, this.selectedEmployee._id)
    .subscribe({
      next: () => {
        this.allEmployees.splice(this.selectedIndex, 1);
        this.selectedIndex = null;
        this.selectedEmployee = null;
        this.hideLoadingDialog();
      },
      error: () => { 
        this.displayErrorToast("Došlo je do greške prilikom brisanja radnika. Pokušajte ponovo.");
        this.hideLoadingDialog();
       }
    });
  }

  showAddNewEmployee() {
    this.addNewEmployeeMode = true;
  }

  hideAddNewEmployee() {
    this.addNewEmployeeMode = false;
    this.newEmployeeFirstname = undefined;
    this.newEmployeeLastname = undefined;
    this.newEmployeeMail = undefined;
    this.newEmployeePhone = undefined;
    this.newEmployeeSpecialization = undefined;
  }

  hideLoadingDialog() {
    this.loadingDialogActive = false;
  }

  private showLoadingDialog(msg: string) {
    this.loadingHeaderTxt = msg;
    this.loadingDialogActive = true;
  }

  addNewEmployee() {
    this.newEmployeeMailErr = false;
    this.newEmployeePhoneErr = false;
    this.newEmployeeLastnameErr = false;
    this.newEmployeeFirstnameErr = false;
    this.newEmployeeSpecializationErr = false;

    let isErrCatched: boolean = false;

    if(!this.newEmployeeFirstname) {
      this.newEmployeeFirstnameErr = true;
      isErrCatched = true;
    }

    if(!this.newEmployeeLastname) {
      this.newEmployeeLastnameErr = true;
      isErrCatched = true;
    }

    if(!this.newEmployeeMail || !this.mailRegEx.test(this.newEmployeeMail)) {
      this.newEmployeeMailErr = true;
      isErrCatched = true;
    }

    if(!this.newEmployeePhone || !this.phoneRegEx.test(this.newEmployeePhone)) {
      this.newEmployeePhoneErr = true;
      isErrCatched = true;
    }

    if(!this.newEmployeeSpecialization) {
      this.newEmployeeSpecializationErr = true;
      isErrCatched = true;
    }

    if(isErrCatched) return;

    this.addNewEmployeeMode = false;
    this.showLoadingDialog("Dodavanje novog radnika...");

    const newEmployee = new Employee(this.newEmployeeFirstname, this.newEmployeeLastname, this.newEmployeeMail,
                                      this.newEmployeePhone, this.newEmployeeSpecialization);

    this.agencyService.addEmployee(this.loggedUser.jwt, this.loggedUser._id, newEmployee).subscribe({
      next: (employee: Employee) => {
        this.allEmployees.push(employee);
        this.displaySuccessfulToast("Uspešno dodat radnik.");
        this.hideLoadingDialog();
        this.hideAddNewEmployee();
      },
      error: () => {
        this.displayErrorToast("Došlo je do greške prilikom dodavanja novog radnika. Pokušajte ponovo.");
        this.hideLoadingDialog();
      }
    });
  }

  activateEditMode() { 
    if(this.selectedIndex == undefined || this.selectedIndex == null) return;

    this.selectedEmployee = Employee.clone(this.allEmployees[this.selectedIndex]);
    this.editMode = true;
  }
  
  discardEdit() {
    this.editMode = false;
    this.selectedEmployee = Employee.clone(this.allEmployees[this.selectedIndex]);
  }

  submitEdit() {
    this.editMode = false;    
    this.updateEmployee();    
  }

  updateEmployee() {
    this.agencyService.updateEmployee(this.loggedUser.jwt, this.loggedUser._id, this.selectedEmployee).subscribe({
      next: (employee: Employee) => {
        this.allEmployees[this.selectedIndex] = employee;
        this.selectedEmployee = Employee.clone(employee);
        this.displaySuccessfulToast("Uspešno ažurirane informacije o radniku.");
      },
      error: () => { this.displayErrorToast("Došlo je do greške prilikom ažuriranja informacija o radniku. Pokušajte ponovo."); }
    });
  }

  isAnyPositionAvailable(): boolean {
    return (this.loggedUser.numOfOpenedPositions - this.allEmployees.length) > 0;
  }
  
  showNewOpenPositionsDialog() {
    this.requestNewOpenPositionsMode = true;
  }

  hideNewOpenPositionsDialog() {
    this.requestNewOpenPositionsMode = false;
  }

  requestNewOpenPositions() {
    if(!this.numOfNewOpenPositions || this.numOfNewOpenPositions <= 0) {
      this.numOfNewOpenPositionsErr = true;
      return;
    }

    return;
  }
}
