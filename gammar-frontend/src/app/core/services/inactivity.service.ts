import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private timeoutId: any;
  private readonly TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos
  private events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  private isListening = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {
    // Escuchar cambios en el login
    this.auth.user$.subscribe(user => {
      if (user) {
        this.startWatching();
      } else {
        this.stopWatching();
      }
    });
  }

  private startWatching() {
    if (this.isListening) return;
    this.isListening = true;
    
    // Correr los listeners fuera de Angular zone para no saturar change detection
    this.ngZone.runOutsideAngular(() => {
      this.events.forEach(event => window.addEventListener(event, this.resetTimer));
    });
    
    this.resetTimer();
  }

  private stopWatching() {
    this.isListening = false;
    this.events.forEach(event => window.removeEventListener(event, this.resetTimer));
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private resetTimer = () => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.ngZone.run(() => {
        this.logout();
      });
    }, this.TIMEOUT_MS);
  }

  private logout() {
    this.stopWatching();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
