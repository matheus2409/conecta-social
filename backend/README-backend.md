Conecta Social — Backend (instruções rápidas)

Pré-requisitos
- Node.js (>=16 recomendado)
- npm

Variáveis de ambiente (arquivo `.env`) — colocar em `backend/.env`
- SUPABASE_URL=
- SUPABASE_KEY=
- JWT_SECRET=
- ADMIN_USER=
- ADMIN_PASS= (deve conter o hash bcrypt usado pela aplicação)

Instalar dependências
```powershell
cd 'c:\Users\almeida.matheus\Desktop\conecta-social\backend'
npm.cmd install
```

Iniciar o servidor (desenvolvimento)
```powershell
cd 'c:\Users\almeida.matheus\Desktop\conecta-social\backend'
$env:PORT=3001
npm.cmd start
```

Rodar o script de testes (faz health, lista projetos/esportes e tenta criar/editar/excluir um projeto de teste)
> Abra um novo terminal (mantenha o servidor em execução no outro)
```powershell
cd 'c:\Users\almeida.matheus\Desktop\conecta-social\backend'
node test_requests.js
```

Problemas comuns
- Erro EADDRINUSE: significa que a porta (p.ex. 3001) já está em uso. Encontre o PID e mate o processo:
```powershell
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

- Login falha: confirme que `ADMIN_PASS` no `.env` é o hash bcrypt correspondente à senha que você usa no `login.html`. O backend compara a senha com `bcrypt.compare`.

Logs e debug
- Em desenvolvimento, o servidor adiciona logs de requisição ao console. Também existe um arquivo temporário `backend/debug.log` que contém erros de rotas quando ocorrem.

Se quiser que eu continue (rodar testes aqui, ajustar rotas, unificar o DB, ou remover logs de desenvolvimento), me diga qual ação deseja que eu execute na próxima sessão.