import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, updateEmail, updatePassword, user } from '@angular/fire/auth';
import { Firestore, collection, setDoc, doc, getDoc, DocumentData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

interface AdminUser extends DocumentData {
  uid: string;
  email: string;
  displayName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Observable do usuário autenticado
  public user$ = user(this.auth);

  // Observable indicando se está carregando
  public loading$ = new BehaviorSubject<boolean>(false);

  // Observable do erro
  public error$ = new BehaviorSubject<string>('');

  constructor() {
    console.log('✅ AuthService iniciado com Firebase Authentication');
  }

  /**
   * Faz signup/registro de novo admin
   * Só pode ser feito uma vez - depois usar login
   */
  signup(email: string, password: string, displayName: string = 'Admin'): Observable<any> {
    this.loading$.next(true);
    this.error$.next('');

    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(credentials => {
        // Atualiza nome do usuário no Auth
        return from(updateProfile(credentials.user, { displayName })).pipe(
          switchMap(() => {
            // Salva dados no Firestore
            const userDocRef = doc(this.firestore, `admins/${credentials.user.uid}`);
            const userData: AdminUser = {
              uid: credentials.user.uid,
              email: credentials.user.email || email,
              displayName: displayName,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            return from(setDoc(userDocRef, userData));
          }),
          map(() => credentials.user),
          tap(() => {
            console.log('✅ Admin criado com sucesso!');
            this.loading$.next(false);
          }),
          catchError(err => {
            console.error('❌ Erro ao criar admin:', err);
            this.error$.next(err.message);
            this.loading$.next(false);
            throw err;
          })
        );
      })
    );
  }

  /**
   * Faz login com email e senha
   */
  login(email: string, password: string): Observable<any> {
    this.loading$.next(true);
    this.error$.next('');

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(credentials => {
        console.log('✅ Login bem-sucedido!', credentials.user.email);
        this.loading$.next(false);
      }),
      catchError(err => {
        const errorMsg = this.traduzirErroFirebase(err.code);
        console.error('❌ Erro no login:', errorMsg);
        this.error$.next(errorMsg);
        this.loading$.next(false);
        throw err;
      }),
      map(credentials => credentials.user)
    );
  }

  /**
   * Faz logout
   */
  logout(): Observable<void> {
    this.loading$.next(true);
    return from(signOut(this.auth)).pipe(
      tap(() => {
        console.log('✅ Logout realizado');
        this.loading$.next(false);
      }),
      catchError(err => {
        console.error('❌ Erro no logout:', err);
        this.loading$.next(false);
        throw err;
      })
    );
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)
    );
  }

  /**
   * Altera senha
   */
  alterarSenha(novaSenha: string): Observable<void> {
    const currentUser = this.auth.currentUser;
    
    if (!currentUser) {
      return of().pipe(
        tap(() => this.error$.next('Usuário não autenticado'))
      );
    }

    this.loading$.next(true);
    return from(updatePassword(currentUser, novaSenha)).pipe(
      tap(() => {
        console.log('✅ Senha alterada com sucesso!');
        this.loading$.next(false);
      }),
      catchError(err => {
        const errorMsg = this.traduzirErroFirebase(err.code);
        console.error('❌ Erro ao alterar senha:', errorMsg);
        this.error$.next(errorMsg);
        this.loading$.next(false);
        throw err;
      })
    );
  }

  /**
   * Altera email
   */
  alterarEmail(novoEmail: string): Observable<void> {
    const currentUser = this.auth.currentUser;
    
    if (!currentUser) {
      return of().pipe(
        tap(() => this.error$.next('Usuário não autenticado'))
      );
    }

    this.loading$.next(true);
    return from(updateEmail(currentUser, novoEmail)).pipe(
      switchMap(() => {
        // Atualiza também no Firestore
        const userDocRef = doc(this.firestore, `admins/${currentUser.uid}`);
        return from(setDoc(userDocRef, { email: novoEmail, updatedAt: new Date() }, { merge: true }));
      }),
      tap(() => {
        console.log('✅ Email alterado com sucesso!');
        this.loading$.next(false);
      }),
      catchError(err => {
        const errorMsg = this.traduzirErroFirebase(err.code);
        console.error('❌ Erro ao alterar email:', errorMsg);
        this.error$.next(errorMsg);
        this.loading$.next(false);
        throw err;
      })
    );
  }

  /**
   * Obtém dados do admin do Firestore
   */
  obterDadosAdmin(uid: string): Observable<AdminUser | null> {
    const userDocRef = doc(this.firestore, `admins/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map(docSnapshot => docSnapshot.data() as AdminUser | null),
      catchError(err => {
        console.error('❌ Erro ao buscar dados do admin:', err);
        return of(null);
      })
    );
  }

  /**
   * Obtém token JWT do usuário
   */
  obterToken(): Observable<string | null> {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }
        return from(user.getIdToken());
      })
    );
  }

  /**
   * Traduz erros do Firebase para português
   */
  private traduzirErroFirebase(code: string): string {
    const erros: { [key: string]: string } = {
      'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
      'auth/email-already-in-use': 'Este email já está registrado.',
      'auth/invalid-email': 'Email inválido.',
      'auth/user-not-found': 'Usuário não encontrado.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/user-disabled': 'Esta conta foi desativada.',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
      'auth/network-request-failed': 'Erro de rede. Verifique sua conexão.',
      'auth/requires-recent-login': 'Reautentica-se para realizar esta ação.'
    };

    return erros[code] || 'Erro ao autenticar. Tente novamente.';
  }
}
