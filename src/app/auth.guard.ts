import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          console.log('✅ Usuário autenticado, permitindo acesso');
          return true;
        } else {
          console.log('❌ Usuário não autenticado, redirecionando para login');
          // Redireciona para login with returnUrl
          return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url }
          });
        }
      })
    );
  }
}
