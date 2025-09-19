import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EmployeeService } from '../../../../services/employee.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes'; 
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillSuggestions: string[] = ['Angular', 'Java', 'Spring Boot', 'Tailwind', 'JWT', 'RxJS', 'TypeScript'];
  selectedSkills: string[] = [];

  today: string = this.getTodayDate();

  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);

  employeeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['MANAGER', Validators.required],
    department: ['', [Validators.required, Validators.minLength(2), this.alphaOnlyValidator]],
    designation: ['', [Validators.required, Validators.minLength(2)]],
    skills: ['', [this.skillsValidator]],
    managerId: ['', [Validators.pattern(/^[\w\d-]{36}$/)]],
    joiningDate: [this.today, [Validators.required, this.pastOrTodayValidator]],
    status: ['ACTIVE', Validators.required]
  });

  get nameControl(): AbstractControl { return this.employeeForm.get('name')!; }
  get emailControl(): AbstractControl { return this.employeeForm.get('email')!; }
  get departmentControl(): AbstractControl { return this.employeeForm.get('department')!; }
  get designationControl(): AbstractControl { return this.employeeForm.get('designation')!; }

  alphaOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    return /^[A-Za-z ]+$/.test(value) ? null : { alphaOnly: true };
  }

  skillsValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    return /^[A-Za-z, ]*$/.test(value) ? null : { invalidSkills: true };
  }

  pastOrTodayValidator(control: AbstractControl): ValidationErrors | null {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate <= today ? null : { futureDate: true };
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  addSkill(event: any): void {
    const input = event.input;
    const value = event.value?.trim();
    if (value && /^[A-Za-z ]+$/.test(value) && !this.selectedSkills.includes(value)) {
      this.selectedSkills.push(value);
    }
    if (input) input.value = '';
    this.updateSkillsControl();
  }

  removeSkill(skill: string): void {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
    this.updateSkillsControl();
  }

  selectSuggestion(skill: string): void {
    if (!this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
      this.updateSkillsControl();
    }
  }

  updateSkillsControl(): void {
    this.employeeForm.get('skills')?.setValue(this.selectedSkills.join(', '));
  }

  onSubmit(): void {
    if (!this.employeeForm.valid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Token not found! Please login again.');
      return;
    }

    const rawForm = this.employeeForm.value;
    const payload = {
      ...rawForm,
      joiningDate: new Date(rawForm.joiningDate).toISOString()
    };

    if (!payload.managerId || payload.managerId.trim().length !== 36) {
      delete payload.managerId;
    }

    this.employeeService.addEmployee(payload, token).subscribe({
      next: () => {
        alert('✅ Employee added successfully!');
        this.employeeForm.reset();
        this.selectedSkills = [];
      },
      error: (err) => {
        console.error('❌ Error while adding employee:', err);
        const errorMsg = err?.status === 403
          ? 'HR is not authorized to create this role.'
          : 'Failed to add employee. Please try again.';
        alert(errorMsg);
      }
    });
  }
}
