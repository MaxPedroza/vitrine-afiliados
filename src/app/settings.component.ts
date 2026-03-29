import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false
})
export class SettingsComponent implements OnInit, OnDestroy {
  // Aba ativa
  abaSelecionada: 'senha' | 'email' = 'senha';

  // Dados do usuário
  emailAtual: string = '';

  // Formulário de senha
  senhaAtualSenha: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';
  senhaAtualVisivel: boolean = false;
  novaSenhaVisivel: boolean = false;
  confSenhaVisivel: boolean = false;
  erroSenha: string = '';
  sucessoSenha: string = '';

  // Formulário de email
  senhaAtualEmail: string = '';
  novoEmail: string = '';
  emailVisivel: boolean = false;
  erroEmail: string = '';
  sucessoEmail: string = '';

  // Observables do serviço
  loading$;
  error$;

  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private notify: NotificationService
  ) {
    this.loading$ = this.authService.loading$;
    this.error$ = this.authService.error$;
  }

  ngOnInit(): void {
    // Obtém dados do usuário autenticado
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.emailAtual = user.email || '';
          this.novoEmail = user.email || '';
        }
      });
  }

  // ===== MÉTODOS DE SENHA =====
  alterarSenha(): void {
    this.erroSenha = '';
    this.sucessoSenha = '';

    // Validação
    if (!this.novaSenha.trim()) {
      this.erroSenha = 'Digite uma nova senha';
      return;
    }

    if (this.novaSenha.length < 6) {
      this.erroSenha = 'A nova senha deve ter pelo menos 6 caracteres';
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.erroSenha = 'As senhas não conferem';
      return;
    }

    // Faz requisição para alterar senha
    this.authService.alterarSenha(this.novaSenha)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.sucessoSenha = '✅ Senha alterada com sucesso!';
          this.notify.show('Senha alterada! 🔐', 'success');
          
          // Limpa formulário
          this.novaSenha = '';
          this.confirmarSenha = '';
          this.senhaAtualSenha = '';
          
          setTimeout(() => this.sucessoSenha = '', 3000);
        },
        error: (err) => {
          const msg = this.authService.error$.value;
          this.erroSenha = msg || 'Erro ao alterar senha';
          this.notify.show(this.erroSenha, 'error');
          console.error('❌ Erro ao alterar senha:', err);
        }
      });
  }

  alternarVisibilidadeSenhaAtual(): void {
    this.senhaAtualVisivel = !this.senhaAtualVisivel;
  }

  alternarVisibilidadeNovaSenha(): void {
    this.novaSenhaVisivel = !this.novaSenhaVisivel;
  }

  alternarVisibilidadeConfSenha(): void {
    this.confSenhaVisivel = !this.confSenhaVisivel;
  }

  // ===== MÉTODOS DE EMAIL =====
  alterarEmail(): void {
    this.erroEmail = '';
    this.sucessoEmail = '';

    // Validação
    if (!this.novoEmail.trim()) {
      this.erroEmail = 'Digite um novo email';
      return;
    }

    if (this.novoEmail === this.emailAtual) {
      this.erroEmail = 'O novo email é igual ao atual';
      return;
    }

    // Validado email básico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.novoEmail)) {
      this.erroEmail = 'Email inválido';
      return;
    }

    // Faz requisição para alterar email
    this.authService.alterarEmail(this.novoEmail)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.sucessoEmail = '✅ Email alterado com sucesso!';
          this.notify.show('Email alterado! 📧', 'success');
          
          // Atualiza email atual
          this.emailAtual = this.novoEmail;
          
          // Limpa formulário
          this.senhaAtualEmail = '';
          
          setTimeout(() => this.sucessoEmail = '', 3000);
        },
        error: (err) => {
          const msg = this.authService.error$.value;
          this.erroEmail = msg || 'Erro ao alterar email';
          this.notify.show(this.erroEmail, 'error');
          console.error('❌ Erro ao alterar email:', err);
        }
      });
  }

  alternarVisibilidadeEmail(): void {
    this.emailVisivel = !this.emailVisivel;
  }

  selecionarAba(aba: 'senha' | 'email'): void {
    this.abaSelecionada = aba;
    this.erroSenha = '';
    this.sucessoSenha = '';
    this.erroEmail = '';
    this.sucessoEmail = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
