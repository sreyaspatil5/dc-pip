import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetLinkComponent } from './reset-link.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('ResetLinkComponent', () => {
  let component: ResetLinkComponent;
  let fixture: ComponentFixture<ResetLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetLinkComponent, ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: new Map([['token', 'mock-token']]) } } },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
        { provide: EmployeeService, useValue: { resetPasswordWithToken: () => of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ResetLinkComponent', () => {
    expect(component).toBeTruthy();
  });
});
