import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VerifyOtpResetComponent } from './verify-otp.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('VerifyOtpResetComponent', () => {
  let component: VerifyOtpResetComponent;
  let fixture: ComponentFixture<VerifyOtpResetComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [VerifyOtpResetComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ email: 'preset@example.com' })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(VerifyOtpResetComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should prefill email from queryParams', () => {
    expect(component.form.get('email')?.value).toBe('preset@example.com');
  });

  it('should submit and verify OTP', fakeAsync(() => {
    component.form.setValue({
      email: 'user@example.com',
      otp: '123456',
      newPassword: 'newPass@123'
    });

    component.verifyAndReset();

    const req = httpMock.expectOne(
      `http://localhost:8080/api/employees/reset-password/verify-otp-reset?email=user@example.com&otp=123456&newPassword=newPass@123`
    );

    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Success' });

    tick();
    httpMock.verify();
  }));
});
