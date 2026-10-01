import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../core/services/storage.service';
import { User } from '../core/models/models';

@Component({selector:'cc-admin-setup',standalone:true,imports:[ReactiveFormsModule,RouterLink],template:`
<div class="auth-page"><div class="auth-card">
<a routerLink="/login" class="back">← Back to login</a>
<div class="auth-head"><div class="logo">CC</div><h1>Create First Admin</h1><p>Set up the initial administrator for CareConnect.</p></div>
@if(!checking && available){<form [formGroup]="form" (ngSubmit)="submit()" class="stack">
<label>Full Name<input class="input" formControlName="name" placeholder="Administrator name"></label>
<label>Email<input class="input" type="email" formControlName="email" placeholder="admin@example.com"></label>
<label>Username<input class="input" formControlName="username" placeholder="admin"></label>
<label>Phone<input class="input" formControlName="phone" placeholder="10 digit phone number"></label>
<label>Password<input class="input" type="password" formControlName="password" placeholder="Minimum 6 characters"></label>
@if(error){<div class="alert error">{{error}}</div>}
@if(message){<div class="alert">{{message}}</div>}
<button class="btn primary full" [disabled]="form.invalid || submitting">Create Admin Account</button>
</form>}@else if(!checking){<div class="alert">An Admin account already exists. First-admin setup is closed.</div><a routerLink="/login" class="btn primary full">Go to Login</a>}@else{<div class="empty">Checking administrator setup...</div>}
</div></div>`})
export class AdminSetupComponent {
 form=this.fb.group({name:['',[Validators.required,Validators.minLength(2)]],email:['',[Validators.required,Validators.email]],username:[''],phone:['',[Validators.pattern(/^[0-9]{10}$/)]],password:['',[Validators.required,Validators.minLength(6)]]});
 checking=true; available=false; submitting=false; error=''; message='';
 constructor(private fb:FormBuilder,private s:StorageService,private router:Router){this.s.firstAdminAvailable().subscribe({next:(r:any)=>{this.available=r.available;this.checking=false},error:()=>{this.checking=false;this.error='Could not connect to the CareConnect backend.'}})}
 submit(){if(this.form.invalid||this.submitting)return;this.submitting=true;this.error='';const v=this.form.getRawValue();const a:User={id:'a-'+Date.now(),name:v.name!,email:v.email!,username:v.username||undefined,password:v.password!,role:'admin',active:true,phone:v.phone||undefined};this.s.registerFirstAdmin(a).subscribe({next:()=>{this.submitting=false;this.message='Admin account created successfully. Redirecting to login...';this.available=false;setTimeout(()=>this.router.navigateByUrl('/login'),900)},error:(e:any)=>{this.submitting=false;this.error=e?.error?.message||'Could not create the first Admin account.';if(e?.status===409)this.available=false;}})}
}
