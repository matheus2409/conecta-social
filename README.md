# 🚀 Conecta Social

Bem-vindo ao Conecta Social, uma plataforma web full-stack para conectar voluntários a projetos sociais, desenvolvida como um projeto de estudo.

## ✨ Sobre o Projeto

O Conecta Social é uma aplicação completa que permite a visualização e o gerenciamento de projetos sociais. Possui um frontend interativo, um backend robusto com uma API RESTful e um painel de administração para controle total do conteúdo (CRUD).

### Tecnologias Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Banco de Dados:** Supabase (PostgreSQL)
- **Hospedagem:** Render

---

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto no seu ambiente de desenvolvimento.

### **Pré-requisitos**
Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas:
-   [**Node.js**](https://nodejs.org/) (versão 18 ou superior), que inclui o **npm** (gerenciador de pacotes do Node).
-   [**Git**](https://git-scm.com/) para clonar o repositório.

### **Passos para Instalação**

1.  **Clone o repositório:**
    Abra o seu terminal e execute o seguinte comando para clonar o projeto:
    ```bash
    git clone [https://github.com/matheus2409/conecta-social.git](https://github.com/matheus2409/conecta-social.git)
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd conecta-social
    ```

3.  **Instale as dependências do backend:**
    Navegue até a pasta do backend e instale todas as dependências necessárias.
    ```bash
    cd backend
    npm install
    ```

4.  **Configure as variáveis de ambiente:**
    -   Ainda na pasta `backend`, crie uma cópia do arquivo `.env.example` e renomeie-a para `.env`.
    -   Abra o arquivo `.env` e preencha as variáveis `SUPABASE_URL` e `SUPABASE_KEY` com as suas credenciais do Supabase.

5.  **Inicie o servidor:**
    Com tudo configurado, inicie o servidor do backend.
    ```bash
    node server.js
    ```
    O servidor estará rodando em `http://localhost:3000`.

6.  **Acesse a aplicação:**
    Abra o seu navegador e acesse a URL abaixo para ver o projeto em funcionamento:
    [http://localhost:3000](http://localhost:3000)

    *Observação: O frontend é construído com HTML, CSS e JavaScript puros, portanto, não requer um passo de compilação ou instalação de dependências.*

---

## 🤝 Contribuição

Este é um projeto de estudo, mas sugestões e melhorias são sempre bem-vindas! Se você tiver alguma ideia para melhorar o projeto, sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

---

## 📜 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.