# 🔐 Firebase Authentication Migration - Production Setup Guide

## ✅ Mudanças Implementadas

O app foi totalmente migrado de **localStorage inseguro** para **Firebase Authentication + Firestore**:

### Mudanças no Backend (Services)
- ✅ `auth.service.ts` - Completo rewrite com Firebase Auth SDK
  - `login(email, password)` → Observable-based com Firebase Auth
  - `alterarSenha(novaSenha)` → Firebase updatePassword()
  - `alterarEmail(novoEmail)` → Firebase updateEmail() + Firestore sync
  - Novo: `signup()` para registar novo admin
  - Novo: `obterToken()` → JWT token do Firebase
  - Novo: `obterDadosAdmin()` → Fetch from Firestore

### Mudanças na UI (Components)
- ✅ `login.component.ts` - Agora usa Observables
  - Subscreve a `auth.login()` Observable
  - Exibe loading/error states via `loading$` e `error$`
- ✅ `settings.component.ts` - Totalmente reescrito com Observables
  - `alterarSenha()` e `alterarEmail()` usam Firebase Observables
  - Cleanup com `ngOnDestroy` para evitar memory leaks
- ✅ `auth.guard.ts` - Observable-based route protection
  - Usa `auth.isAuthenticated()` Observable
  - Redireciona com returnUrl
- ✅ `app.ts` - Atualizado para usar Firebase Auth
  - `isAutenticado$` referencia `auth.isAuthenticated()`
  - `logout()` agora Observable

## 🚀 Setup Firebase (OBRIGATÓRIO)

### 1. Ativar Firebase Authentication

1. Vá para [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Va para **Autenticação** (Authentication)
4. Na aba **Método de login**, clique em **Email/Senha**
5. Ative **Email/Senha**
6. Clique em **Salvar**

### 2. Criar Firestore Database

1. No Firebase Console, vá para **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha modo de produção
4. Selecione a localização mais próxima (ex: southamerica-east1 para Brasil)
5. Clique em **Ativar**

### 3. Configurar Security Rules

Na aba **Rules** do Firestore, substitua o conteúdo por:

```firestore-security-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Admins podem ler/escrever apenas sua própria data
    match /admins/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Outros dados (produtos, lojas, etc) - públicos de leitura
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

6. Clique em **Publicar**

### 4. Verificar environment.ts

Seu arquivo `environment.ts` já deve ter a config do Firebase:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
  }
};
```

## 👤 Criar Primeiro Admin

2 formas:

### Opção A: Firebase Console (Mais fácil)

1. No Firebase Console, vá para **Autenticação**
2. Na aba **Usuários**, clique em **Adicionar usuário**
3. Digite email e senha (senha será gerada, copie!)
4. Clique em **Adicionar usuário**

### Opção B: Via SignUp da App

1. Acesse a rota `/login`
2. O app detectará se é novo admin e mostrará opção de signup
3. Preencha email, senha, e confirme

**NOTA:** Primeira vez sempre é signup. Depois apenas login.

## 🔑 Testar Login

1. Acesse http://localhost:4200/login
2. Digite o email e senha criado
3. Clique em "Acessar"
4. Observe console (NG logs com ✅ e ❌)
5. Se OK, será redirecionado para /admin
6. Menu aparece no topo/rodapé

## 🐛 Troubleshooting

### Erro: "auth/operation-not-allowed"
- Ative Email/Senha na Firebase Console → Autenticação

### Erro: "auth/weak-password"
- Use senha com 6+ caracteres

### Erro: "auth/email-already-in-use"
- Email já registrado, faça login em vez de signup

### Usuário não vê menu após login
- Verifique console do browser (F12)
- Refresh a página (Ctrl+R)
- Verifique se `isAutenticado$` está true

### Firestore permissões denied
- Verifique as Security Rules (passo 3 acima)
- Certifique-se que usuário está autenticado (`request.auth !== null`)

## 📝 Recovery: Reset Password

Firebase suporta reset de senha por email. Para ativar:

1. Firebase Console → Autenticação → Templates
2. Na template "Reset Password Email", customize a mensagem
3. Na app, implemente:

```typescript
// No auth.service.ts, adicione método:
resetSenha(email: string): Observable<void> {
  return from(sendPasswordResetEmail(this.auth, email));
}
```

## 🚢 Deploy para Produção

1. Atualize `environment.prod.ts` com credenciais produção Firebase
2. Build: `ng build --configuration production`
3. Deploy (Vercel, Netlify, Firebase Hosting, etc)

**IMPORTANTE:** Nunca commit credentials! Use Secret Management da sua plataforma.

## ✨ Próximos Passos Opcionais

- [ ] Ativar 2FA (Two-Factor Authentication)
- [ ] Email verification ao criar admin
- [ ] Password reset page
- [ ] Admin roles/permissions (Firestore document)
- [ ] Audit logs (Firestore collection 'logs')
- [ ] Social login (Google, GitHub optional)

---

**Status:** ✅ Production-Ready com Firebase Auth + Firestore
