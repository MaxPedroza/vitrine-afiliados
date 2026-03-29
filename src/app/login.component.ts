import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {
  email: string = '';
  senha: string = '';
  senhaVisivel: boolean = false;
  carregando: boolean = false;
  erro: string = '';
  returnUrl: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Se já está autenticado, redireciona para admin
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/admin']);
      return;
    }

    // Pega URL para redirecionar depois do login
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
  }

  fazerLogin(): void {
    // Validação
    if (!this.email.trim() || !this.senha.trim()) {
      this.erro = 'Email e senha são obrigatórios!';
      return;
    }

    this.carregando = true;
    this.erro = '';

    // Tenta fazer login
    setTimeout(() => {
      if (this.authService.login(this.email, this.senha)) {
        // Login bem-sucedido
        this.router.navigate([this.returnUrl]);
      } else {
        // Falha no login
        this.erro = 'Email ou senha incorretos!';
      }
      this.carregando = false;
    }, 500); // Simula delay de servidor
  }

  alternarVisibilidadeSenha(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }

  aoDirecionarEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.fazerLogin();
    }
  }
}
