# 🛍️ Vitrine de Afiliados

![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular)
![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-FFCA28?style=for-the-badge&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

Uma aplicação web de alta performance desenvolvida para gerenciar e exibir links de afiliados de forma elegante e organizada. O projeto foca em **User Experience (UX)** e **Integridade de Dados**, utilizando o ecossistema Angular 20 e Firebase.

---

## 🚀 Funcionalidades

### 📱 Vitrine do Usuário
- **Exposição Inteligente**: Visualização limpa e moderna dos produtos.
- **Filtro de Expiração**: Produtos com data de validade vencida são ocultados automaticamente da vitrine.
- **Redirecionamento Seguro**: Clique direto para a loja do afiliado com rastreamento de métricas.

### ⚙️ Painel Administrativo
- **Gestão de Produtos**: Cadastro completo com nome, imagem, link, loja e data de expiração.
- **Drag & Drop**: Reordenação visual dos produtos na vitrine utilizando `Angular CDK`.
- **Gerenciamento de Lojas**: Sistema dinâmico para cadastrar e remover lojas parceiras (Shopee, Amazon, Magalu, etc).
- **Limpeza Global**: Opção para resetar a base de dados de produtos.

### 📊 Analytics & Relatórios
- **Ranking de Performance**: Visualização em tempo real de quais produtos possuem mais cliques.
- **Contagem Atômica**: Incremento de cliques via transações Firebase para evitar perda de dados.

---

## 🎨 Design System

O projeto utiliza uma paleta de cores personalizada para transmitir modernidade e suavidade:
- **Lilás Suave** (`#f3f0ff`): Cor de fundo principal.
- **Branco Puro** (`#ffffff`): Cards e containers.
- **Verde Sucesso** (`#28a745`): Botões de ação positiva.
- **Laranja/Vermelho** (`#ff4700`): Alertas e exclusões.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** Angular 20
- **Banco de Dados:** Firebase Realtime Database
- **Estilização:** SCSS (Sass)
- **Componentes:** Angular CDK (Drag and Drop)
- **Gerenciamento de Estado:** RxJS (Observables para dados em tempo real)

---

## 📥 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/vitrine-afiliados.git
   cd vitrine-afiliados
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Firebase:**
   Certifique-se de que o arquivo `src/environments/environment.ts` contenha suas credenciais:
   ```typescript
   export const environment = {
     firebase: {
       apiKey: "...",
       databaseURL: "...",
       // ...
     }
   };
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   ng serve
   ```
   Acesse em: `http://localhost:4200`

---

## 📂 Estrutura de Pastas

```text
src/app/
 ├── models/            # Interfaces e tipos de dados
 ├── services/          # Lógica de comunicação com Firebase
 ├── admin/             # Componentes de gerenciamento de produtos
 ├── lojas/             # Componentes de gestão de lojas
 ├── analytics/         # Relatórios de performance
 └── vitrine/           # Interface pública para clientes
```

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

<p align="center">Desenvolvido com ❤️ para impulsionar vendas de afiliados.</p>