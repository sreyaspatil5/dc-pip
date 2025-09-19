import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface Employee {
  employeeId: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface JwtPayload {
  id?: string;
  userId?: string;
  sub?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface HrSignupPayload {
  name: string;
  email: string;
  password: string;
  employeeId: string;
  department: string;
  role: string;
}

export interface PerformanceReviewPayload {
  employeeId: string;
  reviewerId: string;
  reviewPeriod: string;
  reviewDate: string;
  scores: {
    technical: number;
    communication: number;
    teamwork: number;
  };
  overallRating: number;
  comments: string;
  reviewType: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  getNotificationsByUserId(userId: string, token: string) {
    throw new Error('Method not implemented.');
  }
  getNonAdminEmployees(token: string) {
    throw new Error('Method not implemented.');
  }
  getEmployeeReport() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = environment.apiUrl;
  private stompClient!: Client;
  private notificationSubject = new Subject<any>();
  notifications$ = this.notificationSubject.asObservable();

  constructor(private http: HttpClient) { }

  /** 🔐 Login */
  login(email: string, password: string, expectedRole: string): Observable<any> {
    const payload = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return this.http.post(`${this.apiUrl}/employees/login`, payload, { headers });
  }

  /** 🔒 Password APIs */
  resetPassword(employeeId: string, oldPassword: string, newPassword: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = { employeeId, oldPassword, newPassword };
    return this.http.put(`${this.apiUrl}/employees/reset-password`, {}, { headers, params });
  }

  resetForgotPassword(email: string, newPassword: string): Observable<any> {
    const params = { email, newPassword };
    return this.http.put(`${this.apiUrl}/employees/forgot-password`, {}, { params });
  }

  requestOtp(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/employees/reset-password/request-otp`, null, {
      params,
      responseType: 'text',
      observe: 'response',
    });
  }

  verifyOtpAndReset(email: string, otp: string, newPassword: string): Observable<any> {
    const payload = { email, otp, newPassword };
    return this.http.put(`${this.apiUrl}/employees/reset-password/verify-otp-reset`, payload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' as 'json',
    });
  }

  requestResetLink(email: string, baseUrl: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees/reset-password/request-link`, { email, baseUrl });
  }

  resetPasswordWithToken(token: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/employees/reset-password/reset-with-token`, { token, newPassword });
  }

  requestResetToken(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees/reset-password/request-token`, { email });
  }

  /** 🙋‍♀️ Signup / Add Employee */
  signupHR(payload: HrSignupPayload, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/employees/signup`, payload, { headers });
  }

  addEmployee(payload: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/employees/signup`, payload, { headers });
  }

  assignManager(employeeId: string, managerId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/employees/assign-manager?employeeId=${employeeId}&managerId=${managerId}`, null, {
      headers,
    });
  }

  createPip(pipData: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/pip/create`, pipData, { headers });
  }

  getTeamMembers(managerId: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/employees/team/${managerId}`, { headers });
  }

  addSkillGap(skillGapData: any, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/skill-gap`, skillGapData, {
      headers,
      responseType: 'text' as 'json',
    });
  }

  // emplyee dashbord  skill gap 
  getEmployeeSkillGaps(empId: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/skill-gap/employee/${empId}`, { headers });
  }

  /** Feedback */
  addFeedback(payload: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/feedbacks/add`, payload, { headers });
  }

  submitFeedback(data: any, requestHeaders: HttpHeaders): Observable<any> {
    return this.http.post(`${this.apiUrl}/feedbacks/add`, data, { headers: requestHeaders });
  }

  /** ✅ Performance Reviews */
  getAssignedEmployees(): Observable<Employee[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Employee[]>(`${this.apiUrl}/employees/assigned`, { headers });
  }

  submitPerformanceReview(payload: any, token: string) {
    return this.http.post(`${environment.apiUrl}/performance-reviews`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getPerformanceReviewsByEmployeeId(employeeId: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/performance-reviews/employee/${employeeId}`, { headers });
  }

  /** ✅ JWT Helpers */
  decodeUserFromToken(): JwtPayload | null {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getReviewerIdFromToken(): string | null {
    const payload = this.decodeUserFromToken();
    return payload?.id || payload?.userId || payload?.sub || null;
  }

  /** Generic Employee APIs */
  getAllEmployees(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/employees/all`, { headers });
  }

  updateEmployee(id: string, data: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/employees/update/${id}`, data, { headers });
  }

  deleteEmployee(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  getEmployeesByRole(role: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/employees/role/${role}`, { headers });
  }

  getEmployeesByStatus(status: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/employees/status/${status}`, { headers });
  }

  addToPip(pipEntry: {}, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/pip/start`, pipEntry, { headers });
  }

  getAllPipEntries(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/pip/all`, { headers });
  }

  getTeam(managerId: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/employees/my-team/${managerId}`, { headers });
  }

  getEmployees(employeeId: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/employees/team/${employeeId}`, { headers });
  }

  getManagerPIPList(managerId: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/pip/list/${managerId}`, { headers });
  }

  getFeedbacksReceived(id: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/feedbacks/toUser/${id}`, { headers });
  }

  getReportsByManager(managerId: string, token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/manager/${managerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // ✅ Upload file
  uploadFile(file: File, token: string): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<{ url: string }>(`${this.apiUrl}/reports/upload`, formData, { headers });
  }

  // ✅ Create report
  createReport(payload: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/reports`, payload, { headers });
  }

  updateReport(reportId: string, formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<any>(`${this.apiUrl}/reports/${reportId}`, formData, { headers });
  }

  // ✅ Delete report
  deleteReport(reportId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/reports/${reportId}`, { headers });
  }

  getAllReports(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/reports/all`, { headers });
  }

  downloadReport(reportId: number, token: string): Observable<Blob> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}/reports/${reportId}/download`;
    return this.http.get(url, {
      headers,
      responseType: 'blob',
    });
  }



  // websocket notification
  /** 🔔 Connect WebSocket for real-time notifications */
  connectWebSocket(userEmail: string, token: string) {

    this.stompClient = new Client({

      webSocketFactory: () => new SockJS(`${this.apiUrl.replace('/api', '')}/ws`),

      reconnectDelay: 5000,

      debug: (msg: string) => console.log('[STOMP]', msg),

      connectHeaders: {

        Authorization: `Bearer ${token}`,

      },

    });

    this.stompClient.onConnect = () => {

      console.log('✅ WebSocket connected for:', userEmail);

      this.stompClient.subscribe(`/user/${userEmail}/queue/notifications`, (message: IMessage) => {

        try {

          const notification = JSON.parse(message.body);

          this.notificationSubject.next(notification);

        } catch (e) {

          console.error('Failed to parse notification:', message.body, e);

        }

      });

    };

    this.stompClient.activate();

  }


  /** 🔌 Disconnect WebSocket */
  disconnectWebSocket() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('🔌 WebSocket disconnected');
    }
  }


getNotificationsByEmail(email: string, token: string): Observable<any[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const encodedEmail = encodeURIComponent(email);
  return this.http.get<any[]>(`${this.apiUrl}/notifications/user/email/${encodedEmail}`, { headers });
}

getNotificationsById(userId: string, token: string): Observable<any[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`${this.apiUrl}/notifications/user/id/${userId}`, { headers });
}



}