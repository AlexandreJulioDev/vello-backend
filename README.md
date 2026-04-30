# 🚀 Vello SaaS - Gestão Inteligente para Provedores

**Vello** é uma plataforma de back-end robusta e escalável, desenvolvida para gerenciar ecossistemas de provedores de internet. O sistema utiliza uma arquitetura **SaaS (Software as a Service)** com isolamento total de dados entre diferentes provedores (*Multi-tenancy*).

---

## 🛠️ Tecnologias Utilizadas

*   **Framework:** [NestJS](https://nestjs.com/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Banco de Dados:** PostgreSQL
*   **Segurança:** JWT (JSON Web Token) & Bcrypt
*   **Documentação:** Swagger UI
*   **Validação:** Class-validator & Class-transformer

## ✨ Funcionalidades Principais

*   **Autenticação Segura:** Sistema de login com criptografia de senhas (Bcrypt).
*   **Isolamento de Dados (Multi-tenancy):** Cada provedor acessa apenas seus próprios clientes e planos, validado via Token JWT.
*   **Gestão de Planos e Clientes:** CRUDs completos com relacionamentos no banco de dados.
*   **Documentação Automática:** API totalmente documentada e testável via Swagger.
*   **Validação de Dados:** Proteção contra entradas inválidas em todas as rotas.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
*   Node.js (v18 ou superior)
*   Docker (ou instância local do PostgreSQL)

### Passo a Passo

1.  **Clone o repositório:**
    
```bash
    git clone [https://github.com/seu-usuario/vello-backend.git](https://github.com/seu-usuario/vello-backend.git)
    cd vello-backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Ambiente:**
    Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais:
    ```env
    DATABASE_URL="postgresql://usuario:senha@localhost:5432/vello_db"
    JWT_SECRET="sua_chave_secreta_aqui"
    ```

4.  **Execute as Migrations do Prisma:**
    ```bash
    npx prisma migrate dev
    ```

5.  **Inicie o Servidor:**
    ```bash
    npm run start:dev
    ```

6.  **Acesse a Documentação:**
    O servidor estará rodando em `http://localhost:3000`.
    Acesse a API interativa em: [http://localhost:3000/api](http://localhost:3000/api)

---

## 👨‍💻 Desenvolvedor

**Alexandre Silva**
*   Estudante de Engenharia de Computação - UNINASSAU
*   Foco em Desenvolvimento Fullstack & Arquitetura Cloud (AWS)
*   [LinkedIn](https://www.linkedin.com/in/alexandre-julio-dev) 
*   [Portfólio](https://meu-portfolio-chi-khaki.vercel.app/)

---
*Este projeto faz parte do ecossistema Vello para modernização de ISPs.*