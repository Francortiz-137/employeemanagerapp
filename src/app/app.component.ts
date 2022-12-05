import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EmployeeManager'

  public employees: Employee[] = [];
  public editEmployee!: Employee;
  public deleteEmployee!: Employee;

  constructor(private employeeService: EmployeeService){}

  ngOnInit(){
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response:Employee[]) => {
        this.employees = response;
      },
      error: (error:HttpErrorResponse) => {
        alert(error.message)
      }
    });
  }

  public searchEmployees(key: string): void{
    const results: Employee[] = [];
    for (const employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
        ){
        results.push(employee)
      }
    }
  }

  public onAddEmployee(addForm: NgForm):void {
    document.getElementById('add-employee-form')?.click();
      this.employeeService.addEmployee(addForm.value).subscribe({
        next: (response: Employee) => {
          this.getEmployees();
          addForm.reset();
        },
        error: (error: HttpErrorResponse) =>{
          alert(error.message);
          addForm.reset();
        }
      });
  }

  public onUpdateEmployee(employee: Employee):void {
      this.employeeService.updateEmployee(employee).subscribe({
        next: (response: Employee) => {
          this.getEmployees();
        },
        error: (error: HttpErrorResponse) =>{
          alert(error.message);
        }
      });
  }

  public onDeleteEmployee(employeeId: number):void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (response: void) => {
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    });
}

  public onOpenModal( mode: string,employee?: Employee): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if(mode === 'add'){
      button.setAttribute('data-bs-target', '#addEmployeeModal');
    }
    if(mode === 'edit'){
      if(employee != undefined)
        this.editEmployee = employee;
      button.setAttribute('data-bs-target', '#editEmployeeModal');
    }
    if(mode === 'delete'){
      if(employee != undefined)
        this.deleteEmployee = employee;
      button.setAttribute('data-bs-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }
}
