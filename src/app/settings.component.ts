import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false
})
export class SettingsComponent implements OnInit {
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
  carregandoSenha: boolean = false;
  erroSenha: string = '';
  sucessoSenha: string = '';

  // Formulário de email
  senhaAtualEmail: string = '';
  novoEmail: string = '';
  emailVisivel: boolean = false;
  carregandoEmail: boolean = false;
  erroEmail: string = '';
  sucessoEmail: string = '';

  constructor(
    private authService: AuthService,
    private notify: NotificationService
  ) { }

  ngOnInit(): void {
    const usuario = this.authService.obterUsuarioAtual();
    if (usuario) {
      this.emailAtual = usuario.email;
      this.novoEmail = usuario.email;
    }
  }

  // ===== MÉTODOS DE SENHA =====
  alterarSenha(): void {
    this.erroSenha = '';
    this.sucessoSenha = '';

    // Validação
    if (!this.senhaAtualSenha.trim()) {
      this.erroSenha = 'Digite sua senha atual';
      return;
    }

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

    if (this.senhaAtualSenha === this.novaSenha) {
      this.erroSenha = 'A nova senha é igual à atual';
      return;
    }

    this.carregandoSenha = true;

    setTimeout(() => {
      const sucesso = this.authService.alterarSenha(this.senhaAtualSenha, this.novaSenha);
      
      if (sucesso) {
        this.sucessoSenha = '✅ Senha alterada com sucesso!';
        this.notify.show('Senha alterada! 🔐', 'success');
        
        // Limpa formulário
        this.senhaAtualSenha = '';
        this.novaSenha = '';
        this.confirmarSenha = '';
        
        setTimeout(() => this.sucessoSenha = '', 3000);
      } else {
        this.erroSenha = 'Senha atual incorreta';
        this.notify.show('Erro: Senha atual incorreta', 'error');
      }
      
      this.carregandoSenha = false;
    }, 300);
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
    if (!this.senhaAtualEmail.trim()) {
      this.erroEmail = 'Digite sua senha para confirmar';
      return;
    }

    if (!this.novoEmail.trim()) {
      this.erroEmail = 'Digite um novo email';
      return;
    }

    if (this.novoEmail === this.emailAtual) {
      this.erroEmail = 'O novo email é igual ao atual';
      return;
    }

    this.carregandoEmail = true;

    setTimeout(() => {
      const sucesso = this.authService.alterarEmail(this.senhaAtualEmail, this.novoEmail);
      
      if (sucesso) {
        this.sucessoEmail = '✅ Email alterado com sucesso!';
        this.notify.show('Email alterado! 📧', 'success');
        
        // Atualiza email atual
        this.emailAtual = this.novoEmail;
        
        // Limpa senha
        this.senhaAtualEmail = '';
        
        setTimeout(() => this.sucessoEmail = '', 3000);
      } else {
        this.erroEmail = 'Email inválido ou senha incorreta';
        this.notify.show('Erro ao alterar email', 'error');
      }
      
      this.carregandoEmail = false;
    }, 300);
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
}
