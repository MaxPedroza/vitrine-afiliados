import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  senha: string = '';
  senhaVisivel: boolean = false;
  returnUrl: string = '';
  private destroy$ = new Subject<void>();

  // Observables do serviço
  loading$;
  error$;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loading$ = this.authService.loading$;
    this.error$ = this.authService.error$;
  }

  ngOnInit(): void {
    // Se já está autenticado, redireciona para admin
    this.authService.isAuthenticated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        if (isAuth) {
          this.router.navigate(['/admin']);
        }
      });

    // Pega URL para redirecionar depois do login
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
  }

  fazerLogin(): void {
    // Validação
    if (!this.email.trim() || !this.senha.trim()) {
      this.authService.error$.next('Email e senha são obrigatórios!');
      return;
    }

    // Faz login
    this.authService.login(this.email, this.senha)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Login bem-sucedido, redirecionando...');
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          console.error('❌ Erro no login:', err);
        }
      });
  }

  alternarVisibilidadeSenha(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }

  aoDirecionarEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.fazerLogin();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
