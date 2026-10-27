import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/models';
export const authGuard:CanActivateFn=()=>{const a=inject(AuthService);return a.user()?true:inject(Router).parseUrl('/login')};
export const roleGuard=(role:Role):CanActivateFn=>()=>{const a=inject(AuthService);return a.role()===role?true:inject(Router).parseUrl('/login')};
