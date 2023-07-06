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

  allEmployees: Employee[] = [AgencyEmployeesComponent.empl1, AgencyEmployeesComponent.empl2, AgencyEmployeesComponent.empl3];
  selectedIndex: number;
  selectedEmployee: Employee;

  editMode: boolean = false;
  deleteMode: boolean = false;

  errToastMsg: string;
  succToastMsg: string;

  constructor(private agencyService: AgencyService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem(GlobalConstants.LOCAL_STORAGE_LOGGED_USER));
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

}
