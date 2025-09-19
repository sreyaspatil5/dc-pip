import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { RequestOtpComponent } from './request-otp/request-otp.component';
import { VerifyOtpResetComponent } from './verify-otp/verify-otp.component';
import { RequestLinkComponent } from './request-link/request-link.component';
import { ResetLinkComponent } from './reset-link/reset-link.component';
import { RequestTokenComponent } from './request-token/request-token.component';
import { ResetWithTokenComponent } from './reset-token/reset-token.component';

export const forgotPasswordRoutes: Routes = [
  { path: '', component: ForgotPasswordComponent },

  // 🔐 OTP Flow
  { path: 'request-otp', component: RequestOtpComponent },
  { path: 'verify-otp', component: VerifyOtpResetComponent },

  // 🔗 Email Link Flow
  { path: 'request-link', component: RequestLinkComponent },
  { path: 'reset-link', component: ResetLinkComponent },

  // 🧾 Token Flow
  { path: 'request-token', component: RequestTokenComponent },
  { path: 'reset-token', component: ResetWithTokenComponent }
];
