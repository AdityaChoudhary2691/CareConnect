import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Appointment, Doctor, MedicalRecord, Patient, Prescription, TestOrder, TestResult, User } from '../models/models';

@Injectable({providedIn:'root'})
export class StorageService {
  private readonly api='http://localhost:8082/api';
  private dataReadySubject=new BehaviorSubject<boolean>(false);
  readonly dataReady$=this.dataReadySubject.asObservable();
  private _users:User[]=[]; private _patients:Patient[]=[]; private _doctors:Doctor[]=[];
  private _appointments:Appointment[]=[]; private _prescriptions:Prescription[]=[]; private _records:MedicalRecord[]=[]; private _orders:TestOrder[]=[]; private _results:TestResult[]=[];
  private known=new Set<string>();
  constructor(private http:HttpClient){this.initialize();}

  users(){return this._users} patients(){return this._patients} doctors(){return this._doctors} appointments(){return this._appointments}
  prescriptions(){return this._prescriptions} records(){return this._records} orders(){return this._orders} results(){return this._results}

  initialize():void {
    forkJoin({
      users:this.http.get<User[]>(`${this.api}/users`),
      appointments:this.http.get<Appointment[]>(`${this.api}/appointments`),
      prescriptions:this.http.get<Prescription[]>(`${this.api}/prescriptions`),
      records:this.http.get<MedicalRecord[]>(`${this.api}/medical-records`),
      orders:this.http.get<TestOrder[]>(`${this.api}/test-orders`),
      results:this.http.get<TestResult[]>(`${this.api}/test-results`)
    }).pipe(catchError(err=>{console.error('CareConnect API unavailable',err); return of(null);})).subscribe(data=>{
      if(data){
        this._users=data.users; this.rebuildUsers(); this._appointments=data.appointments; this._prescriptions=data.prescriptions;
        this._records=data.records; this._orders=data.orders; this._results=data.results;
        [...this._appointments,...this._prescriptions,...this._records,...this._orders,...this._results].forEach((x:any)=>this.known.add(x.id));
        this.dataReadySubject.next(true);
      }
    });
  }
  private rebuildUsers(){this._patients=this._users.filter(u=>u.role==='patient') as Patient[];this._doctors=this._users.filter(u=>u.role==='doctor') as Doctor[];}

  saveUsers(v:User[]){this._users=[...v];this.rebuildUsers();v.forEach(u=>this.http.put<User>(`${this.api}/users/${u.id}`,u).subscribe({error:e=>console.error(e)}));}
  savePatients(v:Patient[]){this._patients=[...v];const users=this._users.map(u=>{const p=v.find(x=>x.id===u.id);return p?{...u,...p}:u});this.saveUsers(users);}
  saveDoctors(v:Doctor[]){this._doctors=[...v];const users=this._users.map(u=>{const d=v.find(x=>x.id===u.id);return d?{...u,...d}:u});this.saveUsers(users);}
  saveAppointments(v:Appointment[]){const old=new Set(this._appointments.map(x=>x.id));this._appointments=[...v];v.forEach(x=>this.http.put<Appointment>(`${this.api}/appointments/${x.id}`,x).subscribe({error:e=>{if(!old.has(x.id))this.http.post<Appointment>(`${this.api}/appointments`,x).subscribe({error:ee=>console.error(ee)});}}));}
  savePrescriptions(v:Prescription[]){const old=new Set(this._prescriptions.map(x=>x.id));this._prescriptions=[...v];v.filter(x=>!old.has(x.id)).forEach(x=>this.http.post<Prescription>(`${this.api}/prescriptions`,x).subscribe({error:e=>console.error(e)}));}
  saveRecords(v:MedicalRecord[]){const old=new Set(this._records.map(x=>x.id));this._records=[...v];v.filter(x=>!old.has(x.id)).forEach(x=>this.http.post<MedicalRecord>(`${this.api}/medical-records`,x).subscribe({error:e=>console.error(e)}));}
  saveOrders(v:TestOrder[]){const old=new Set(this._orders.map(x=>x.id));this._orders=[...v];v.forEach(x=>this.http.put<TestOrder>(`${this.api}/test-orders/${x.id}`,x).subscribe({error:e=>{if(!old.has(x.id))this.http.post<TestOrder>(`${this.api}/test-orders`,x).subscribe({error:ee=>console.error(ee)});}}));}
  saveResults(v:TestResult[]){const old=new Set(this._results.map(x=>x.id));this._results=[...v];v.filter(x=>!old.has(x.id)).forEach(x=>this.http.post<TestResult>(`${this.api}/test-results`,x).subscribe({error:e=>console.error(e)}));}

  registerPatient(p:Patient):Observable<Patient>{return this.http.post<Patient>(`${this.api}/auth/register`,p).pipe(map(saved=>{this._users=[...this._users,saved];this.rebuildUsers();return saved;}));}
  registerFirstAdmin(a:User):Observable<User>{return this.http.post<User>(`${this.api}/auth/setup-admin`,a);}
  firstAdminAvailable():Observable<{available:boolean}>{return this.http.get<{available:boolean}>(`${this.api}/auth/first-admin-available`);}
  registerDoctor(d:User):Observable<User>{return this.http.post<User>(`${this.api}/users/doctors`,d);}
}
