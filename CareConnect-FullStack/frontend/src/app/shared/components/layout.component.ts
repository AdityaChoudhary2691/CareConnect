import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
@Component({selector:'cc-layout',standalone:true,imports:[RouterLink,RouterLinkActive,TitleCasePipe],template:`
<div class="app-shell"><aside class="sidebar" [class.open]="mobileOpen"><div class="brand"><div class="logo">CC</div><div><b>CareConnect</b><small>EHR System</small></div></div><nav>@for(item of items;track item.path){<a [routerLink]="item.path" routerLinkActive="active" (click)="mobileOpen=false"><span>{{item.icon}}</span>{{item.label}}</a>}</nav><div class="user-box"><b>{{auth.user()?.name}}</b><small>{{auth.user()?.role|titlecase}}</small><button class="btn ghost full" (click)="auth.logout()">Logout</button></div></aside><div class="mobile-bar"><b>CareConnect</b><button class="btn ghost" (click)="mobileOpen=!mobileOpen">☰</button></div><main class="content"><ng-content></ng-content></main></div>`})
export class LayoutComponent{ @Input() items:{label:string;path:string;icon:string}[]=[]; mobileOpen=false; constructor(public auth:AuthService){} }
