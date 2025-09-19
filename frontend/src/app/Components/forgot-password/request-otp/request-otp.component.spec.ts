import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RequestOtpComponent } from './request-otp.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('RequestOtpComponent', () => {
  let component: RequestOtpComponent;
  let fixture: ComponentFixture<RequestOtpComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [RequestOtpComponent],
    });

    fixture = TestBed.createComponent(RequestOtpComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form - invalid if empty', () => {
    component.form.setValue({ email: '' });
    expect(component.form.valid).toBeFalse();
  });

  it('should validate form - valid if proper email is entered', () => {
    component.form.setValue({ email: 'test@example.com' });
    expect(component.form.valid).toBeTrue();
  });

  it('should make API call on form submit', fakeAsync(() => {
    const email = 'user@example.com';
    component.form.setValue({ email });

    component.requestOtp();
    const req = httpMock.expectOne(`http://localhost:8080/api/employees/reset-password/request-otp?email=${email}`);
    expect(req.request.method).toBe('POST');

    req.flush({ message: 'OTP sent' });

    tick();
    httpMock.verify();
  }));
});
