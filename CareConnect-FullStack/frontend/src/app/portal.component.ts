import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutComponent } from './shared/components/layout.component';
import { AuthService } from './core/services/auth.service';
import { StorageService } from './core/services/storage.service';
import {
  Appointment,
  Doctor,
  MedicalRecord,
  Medication,
  Patient,
  Prescription,
  TestOrder,
  TestResult,
  User,
} from './core/models/models';

@Component({
  selector: 'cc-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LayoutComponent],
  template: ` ... `, // template omitted for brevity
})
export class PortalComponent {
  role = this.auth.role()!;
  page = 'dashboard';
  toast = '';
  search = '';
  selectedPatient: Patient | null = null;
  selectedResult: TestResult | null = null;
  consultPatient: Patient | null = null;
  rxPatientId = '';
  cart: Medication[] = [];

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];
  prescriptions: Prescription[] = [];
  records: MedicalRecord[] = [];
  orders: TestOrder[] = [];
  results: TestResult[] = [];

  menu = this.buildMenu();

  profileForm = this.fb.group({
    name: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
    ],
    email: ['', [Validators.required, Validators.email]],
    emergency: [''],
    bloodGroup: [''],
    address: [''],
    medicalHistory: [''],
  });

  appointmentForm = this.fb.group({
    doctorId: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    reason: ['', Validators.required],
  });

  consultForm = this.fb.group({
    symptoms: ['', Validators.required],
    diagnosis: ['', Validators.required],
    observations: [''],
    clinicalNotes: [''],
    treatmentPlan: [''],
    suggestions: [''],
    precautions: [''],
    followUp: [''],
  });

  medForm = this.fb.group({
    name: ['', Validators.required],
    dosage: ['', Validators.required],
    frequency: ['', Validators.required],
    duration: ['', Validators.required],
    instructions: [''],
    precautions: [''],
  });

  orderForm = this.fb.group({
    patientId: ['', Validators.required],
    testType: ['', Validators.required],
    orderDate: [this.today(), Validators.required],
    remarks: [''],
    priority: ['Normal', Validators.required],
  });

  resultForm = this.fb.group({
    patientId: ['', Validators.required],
    testName: ['', Validators.required],
    testDate: [this.today(), Validators.required],
    result: ['', Validators.required],
    remarks: [''],
    status: ['Completed', Validators.required],
  });

  doctorForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    username: [''],
    phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    specialization: ['', [Validators.required, Validators.minLength(2)]],
  });

  doctorSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private s: StorageService,
    private fb: FormBuilder
  ) {
    this.route.url.subscribe((parts) => {
      this.page = parts[0]?.path || 'dashboard';
      this.refresh();
    });
  }

  today() {
    return new Date().toISOString().slice(0, 10);
  }

  buildMenu() {
    if (this.role === 'patient')
      return [
        { label: 'Dashboard', path: '/patient/dashboard', icon: '⌂' },
        { label: 'My Profile', path: '/patient/profile', icon: '◉' },
        { label: 'Appointments', path: '/patient/appointments', icon: '▣' },
        { label: 'Medical Records', path: '/patient/medical-records', icon: '▤' },
        { label: 'Prescriptions', path: '/patient/prescriptions', icon: 'Rx' },
        { label: 'Test Results', path: '/patient/test-results', icon: '⌁' },
      ];

    if (this.role === 'doctor')
      return [
        { label: 'Dashboard', path: '/doctor/dashboard', icon: '⌂' },
        { label: 'Patients', path: '/doctor/patients', icon: '👥' },
        { label: 'Appointments', path: '/doctor/appointments', icon: '▣' },
        { label: 'Medical Records', path: '/doctor/medical-records', icon: '▤' },
        { label: 'Prescriptions', path: '/doctor/prescriptions', icon: 'Rx' },
        { label: 'CPOE', path: '/doctor/cpoe', icon: '⌁' },
        { label: 'Test Results', path: '/doctor/test-results', icon: '◫' },
        { label: 'Consultation', path: '/doctor/consultation', icon: '✚' },
      ];

    return [
      { label: 'Dashboard', path: '/admin/dashboard', icon: '⌂' },
      { label: 'Patients', path: '/admin/patients', icon: '👥' },
      { label: 'Doctors', path: '/admin/doctors', icon: '⚕' },
      { label: 'Users', path: '/admin/users', icon: '◉' },
      { label: 'Appointments', path: '/admin/appointments', icon: '▣' },
      { label: 'System Management', path: '/admin/system', icon: '⚙' },
    ];
  }

  refresh() {
    this.patients = this.s.patients();
    this.doctors = this.s.doctors();
    this.appointments = this.s.appointments();
    this.prescriptions = this.s.prescriptions();
    this.records = this.s.records();
    this.orders = this.s.orders();
    this.results = this.s.results();

    if (this.role === 'patient') {
      const p = this.currentPatient();
      if (p) this.profileForm.patchValue(p);
      if (this.doctors[0] && !this.appointmentForm.value.doctorId)
        this.appointmentForm.patchValue({ doctorId: this.doctors[0].id });
    }

    if (this.role === 'doctor') {
      const saved = localStorage.getItem('cc_selected_appointment');
      if (saved) {
        const a = this.appointments.find((x) => x.id === saved);
        if (a)
          this.consultPatient =
            this.patients.find((p) => p.id === a.patientId) || null;
      }
    }
  }

  currentPatient() {
    return this.patients.find((p) => p.id === this.auth.user()?.id);
  }

  // ... rest of methods unchanged, just formatted
}
