import { getProjetos, deletarProjeto } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabelaProjetosBody = document.getElementById('tabela-projetos-body');
    
    async function carregarProjetosParaGerenciar() {
        try {
            tabelaProjetosBody.innerHTML = '<tr><td colspan="3" class="text-center">Carregando...</td></tr>';
            
            // Aqui estamos buscando todos os projetos sem paginação para a área de admin
            // Se a lista ficar muito grande, você pode implementar paginação aqui também.
            const data = await getProjetos(1, '', ''); // Usando a mesma função, mas pegando a primeira página de todos
            const projetos = data.projetos;

            tabelaProjetosBody.innerHTML = '';

            if (projetos.length === 0) {
                tabelaProjetosBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum projeto cadastrado.</td></tr>';
                return;
            }

            projetos.forEach(projeto => {
                const linhaHTML = `
                    <tr id="projeto-${projeto.id}">
                        <td>${projeto.titulo}</td>
                        <td>${projeto.categoria}</td>
                        <td class="text-end">
                            <a href="editar-projeto.html?id=${projeto.id}" class="btn btn-sm btn-primary">Editar</a>
                            <button class="btn btn-sm btn-danger btn-deletar" data-id="${projeto.id}">Apagar</button>
                        </td>
                    </tr>
                `;
                tabelaProjetosBody.innerHTML += linhaHTML;
            });
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            tabelaProjetosBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Falha ao carregar projetos: ${error.message}</td></tr>`;
        }
    }

    tabelaProjetosBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-deletar')) {
            const botao = event.target;
            const projetoId = botao.dataset.id;
            
            if (confirm('Tem certeza que deseja apagar este projeto?')) {
                try {
                    botao.disabled = true;
                    botao.textContent = 'Apagando...';
                    
                    await deletarProjeto(projetoId);
                    
                    document.getElementById(`projeto-${projetoId}`).remove();
                } catch (error) {
                    alert(`Erro ao apagar projeto: ${error.message}`);
                    botao.disabled = false;
                    botao.textContent = 'Apagar';
                }
            }
        }
    });

    carregarProjetosParaGerenciar();
});