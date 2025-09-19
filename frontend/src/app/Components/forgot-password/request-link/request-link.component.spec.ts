import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestLinkComponent } from './request-link.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RequestLinkComponent', () => {
  let component: RequestLinkComponent;
  let fixture: ComponentFixture<RequestLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestLinkComponent, ReactiveFormsModule],
      providers: [
        { provide: EmployeeService, useValue: { requestResetLink: () => of({}) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create RequestLinkComponent', () => {
    expect(component).toBeTruthy();
  });
});
