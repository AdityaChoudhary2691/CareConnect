export type Role = 'patient' | 'doctor' | 'admin';
export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type OrderStatus = 'Ordered' | 'In Progress' | 'Completed' | 'Cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  password: string;
  role: Role;
  active: boolean;
  phone?: string;
}
export interface Patient extends User { role:'patient'; dob:string; gender:string; address:string; emergency:string; bloodGroup:string; medicalHistory:string; }
export interface Doctor extends User { role:'doctor'; specialization:string; }
export interface Appointment { id:string; patientId:string; doctorId:string; patientName:string; doctorName:string; specialization:string; date:string; time:string; reason:string; status:AppointmentStatus; }
export interface Medication { name:string; dosage:string; frequency:string; duration:string; instructions:string; precautions:string; }
export interface Prescription { id:string; patientId:string; doctorId:string; doctorName:string; date:string; medicines:Medication[]; }
export interface MedicalRecord { id:string; patientId:string; doctorId:string; doctorName:string; date:string; symptoms:string; diagnosis:string; observations:string; clinicalNotes:string; treatmentPlan:string; suggestions:string; precautions:string; followUp:string; }
export interface TestOrder { id:string; patientId:string; doctorId:string; patientName:string; testType:string; orderDate:string; remarks:string; priority:'Normal'|'Urgent'; status:OrderStatus; }
export interface TestResult { id:string; patientId:string; doctorId:string; patientName:string; testName:string; testDate:string; result:string; doctor:string; remarks:string; status:string; }
