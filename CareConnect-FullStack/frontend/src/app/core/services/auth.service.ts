import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { Role, User } from '../models/models';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = 'http://localhost:8082/api';

  constructor(
    private storage: StorageService,
    private router: Router,
    private http: HttpClient
  ) {}

  user(): User | null {
    const raw = localStorage.getItem('cc_session');
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  role(): Role | null {
    return this.user()?.role ?? null;
  }

  login(login: string, password: string, role: Role): Observable<boolean> {
    return this.http
      .post<User>(`${this.api}/auth/login`, { login, password, role })
      .pipe(
        tap((u) =>
          localStorage.setItem('cc_session', JSON.stringify(u))
        ),
        map((u) => {
          this.router.navigateByUrl(`/${role}/dashboard`);
          return !!u;
        })
      );
  }

  logout() {
    localStorage.removeItem('cc_session');
    this.router.navigateByUrl('/login');
  }

  syncSession() {
    const u = this.user();
    if (u) {
      const fresh = this.storage.users().find((x) => x.id === u.id);
      if (fresh) {
        localStorage.setItem('cc_session', JSON.stringify(fresh));
      }
    }
  }
}
