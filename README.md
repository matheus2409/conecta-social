# 🚀 Conecta Social

Bem-vindo ao Conecta Social, uma plataforma web full-stack para conectar voluntários a projetos sociais, desenvolvida como um projeto de ano letivo.

## ✨ Sobre o Projeto

O Conecta Social é uma aplicação completa que permite a visualização e o gerenciamento de projetos sociais. Possui um frontend interativo, um backend robusto com uma API RESTful e um painel de administração para controle total do conteúdo (CRUD).

### Tecnologias Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Banco de Dados:** Supabase (PostgreSQL)
- **Hospedagem:** Render

---

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para configurar o ambiente de desenvolvimento.

**Pré-requisitos:**
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/matheus2409/conecta-social.git](https://github.com/matheus2409/conecta-social.git)
    cd conecta-social
    ```

2.  **Instale as dependências do backend:**
    ```bash
    cd backend
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Dentro da pasta `backend`, crie uma cópia do arquivo `.env.example` e renomeie-a para `.env`.
    - Preencha as variáveis `SUPABASE_URL` e `SUPABASE_KEY` com suas credenciais reais do Supabase.

4.  **Inicie o servidor:**
    - Ainda na pasta `backend`, execute:
    ```bash
    node server.js
    ```
    O servidor estará rodando em `http://localhost:3000`.

5.  **Acesse a aplicação:**
    Abra seu navegador e acesse `http://localhost:3000`.

---

## 🤝 Contribuição

Este é um projeto de estudo, mas sugestões e melhorias são sempre bem-vindas! Sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

---

## 📜 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.