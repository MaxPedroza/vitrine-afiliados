import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  id: string;
  email: string;
  senha: string; // Armazenada como hash simples
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    // Carrega usuário do localStorage se existir
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Faz hash simples da senha (para desenvolvimento)
   * Em produção, usar bcrypt, argon2, etc via backend
   */
  private hashSenha(senha: string): string {
    // Hash simples usando btoa (base64) + transformação
    return btoa(senha).split('').reverse().join('');
  }

  /**
   * Verifica se a senha corresponde ao hash
   */
  private verificarSenha(senha: string, hash: string): boolean {
    return this.hashSenha(senha) === hash;
  }

  /**
   * Faz login com email e senha
   */
  login(email: string, senha: string): boolean {
    const usuarioAdmin = this.obterUsuarioAdmin();
    
    if (email === usuarioAdmin.email && this.verificarSenha(senha, usuarioAdmin.senha)) {
      const user: User = {
        id: usuarioAdmin.id,
        email: usuarioAdmin.email,
        senha: usuarioAdmin.senha
      };
      
      // Salva no localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      
      console.log('✅ Login bem-sucedido!');
      return true;
    }
    
    console.warn('❌ Email ou senha incorretos');
    return false;
  }

  /**
   * Faz logout
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('✅ Logout realizado');
  }

  /**
   * Verifica se usuário está autenticado
   */
  estaAutenticado(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Retorna usuário atual
   */
  obterUsuarioAtual(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Altera senha do admin
   */
  alterarSenha(senhaAtual: string, novaSenha: string): boolean {
    const usuarioAtual = this.obterUsuarioAtual();
    
    if (!usuarioAtual) {
      console.warn('❌ Usuário não autenticado');
      return false;
    }

    // Verifica se senha atual está correta
    if (!this.verificarSenha(senhaAtual, usuarioAtual.senha)) {
      console.warn('❌ Senha atual incorreta');
      return false;
    }

    // Atualiza senha
    const novoHash = this.hashSenha(novaSenha);
    this.atualizarSenhaNoStorage(novoHash);
    
    console.log('✅ Senha alterada com sucesso!');
    return true;
  }

  /**
   * Altera email do admin
   */
  alterarEmail(senhaAtual: string, novoEmail: string): boolean {
    const usuarioAtual = this.obterUsuarioAtual();
    
    if (!usuarioAtual) {
      console.warn('❌ Usuário não autenticado');
      return false;
    }

    // Verifica se senha atual está correta
    if (!this.verificarSenha(senhaAtual, usuarioAtual.senha)) {
      console.warn('❌ Senha incorreta');
      return false;
    }

    // Validar e-mail
    if (!this.validarEmail(novoEmail)) {
      console.warn('❌ Email inválido');
      return false;
    }

    // Atualiza email
    usuarioAtual.email = novoEmail;
    localStorage.setItem('currentUser', JSON.stringify(usuarioAtual));
    this.currentUserSubject.next(usuarioAtual);

    // Atualiza também no localStorage de configuração do admin
    const adminConfig = JSON.parse(localStorage.getItem('adminConfig') || '{}');
    adminConfig.email = novoEmail;
    localStorage.setItem('adminConfig', JSON.stringify(adminConfig));

    console.log('✅ Email alterado com sucesso!');
    return true;
  }

  /**
   * Valida formato de email
   */
  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Atualiza a senha no localStorage
   */
  private atualizarSenhaNoStorage(novoHash: string): void {
    const usuarioAtual = this.obterUsuarioAtual();
    if (usuarioAtual) {
      usuarioAtual.senha = novoHash;
      localStorage.setItem('currentUser', JSON.stringify(usuarioAtual));
      this.currentUserSubject.next(usuarioAtual);
    }

    // Atualiza também no localStorage de configuração do admin
    const adminConfig = JSON.parse(localStorage.getItem('adminConfig') || '{}');
    adminConfig.senhaHash = novoHash;
    localStorage.setItem('adminConfig', JSON.stringify(adminConfig));
  }

  /**
   * Retorna dados do admin (lê ou cria padrão)
   */
  private obterUsuarioAdmin(): User {
    let adminConfig = JSON.parse(localStorage.getItem('adminConfig') || '{}');

    // Se não existe admin configurado, cria padrão
    if (!adminConfig.id) {
      adminConfig = {
        id: '1',
        email: 'admin@loja.com',
        senhaHash: this.hashSenha('123456') // Senha padrão: 123456
      };
      localStorage.setItem('adminConfig', JSON.stringify(adminConfig));
    }

    return {
      id: adminConfig.id,
      email: adminConfig.email,
      senha: adminConfig.senhaHash
    };
  }

  /**
   * Reinicia admin com valores padrão
   */
  resetarAdmin(): void {
    const adminPadrao = {
      id: '1',
      email: 'admin@loja.com',
      senhaHash: this.hashSenha('123456')
    };
    localStorage.setItem('adminConfig', JSON.stringify(adminPadrao));
    console.log('✅ Admin resetado para padrão');
  }
}
