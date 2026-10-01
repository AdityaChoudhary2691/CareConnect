import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/guards';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AdminSetupComponent } from './auth/admin-setup.component';
import { PortalComponent } from './portal.component';

const portal = (path: string) => ({
  path,
  component: PortalComponent,
});

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'setup-admin', component: AdminSetupComponent },

  {
    path: 'patient',
    canActivate: [authGuard, roleGuard('patient')],
    children: [
      portal('dashboard'),
      portal('profile'),
      portal('appointments'),
      portal('medical-records'),
      portal('prescriptions'),
      portal('test-results'),
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },

  {
    path: 'doctor',
    canActivate: [authGuard, roleGuard('doctor')],
    children: [
      portal('dashboard'),
      portal('patients'),
      portal('appointments'),
      portal('medical-records'),
      portal('prescriptions'),
      portal('cpoe'),
      portal('test-results'),
      portal('consultation'),
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('admin')],
    children: [
      portal('dashboard'),
      portal('patients'),
      portal('doctors'),
      portal('users'),
      portal('appointments'),
      portal('system'),
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },

  { path: '**', redirectTo: '' },
];
