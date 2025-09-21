// Importa as funções do nosso serviço de API.
// Lembre-se de criar o arquivo 'apiService.js' que sugeri na resposta anterior.
import { getProjetos, deletarProjeto } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabelaProjetosBody = document.getElementById('tabela-projetos');

    // Função única e moderna para carregar os projetos na tela
    async function carregarProjetosNaTela() {
        try {
            // Limpa a tabela antes de carregar os novos dados
            tabelaProjetosBody.innerHTML = '<tr><td colspan="3" class="text-center">Carregando...</td></tr>';

            const projetos = await getProjetos(); // Chama a função da API

            tabelaProjetosBody.innerHTML = ''; // Limpa a mensagem de "Carregando..."

            if (projetos.length === 0) {
                tabelaProjetosBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum projeto cadastrado.</td></tr>';
                return;
            }

            projetos.forEach(projeto => {
                // Aqui usamos 'titulo' em vez de 'nome' para corresponder ao seu banco de dados
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

    // Usamos a delegação de eventos para gerenciar os cliques nos botões de apagar
    tabelaProjetosBody.addEventListener('click', async (event) => {
        // Verifica se o elemento clicado é um botão de apagar
        if (event.target.classList.contains('btn-deletar')) {
            const botao = event.target;
            const projetoId = botao.dataset.id;

            const confirmar = confirm('Você tem certeza que deseja apagar este projeto? Esta ação não pode ser desfeita.');

            if (confirmar) {
                try {
                    botao.disabled = true; // Desabilita o botão para evitar cliques múltiplos
                    botao.textContent = 'Apagando...';

                    await deletarProjeto(projetoId); // Chama a função da API

                    // Remove a linha da tabela com uma pequena animação de fade-out
                    const linhaParaRemover = document.getElementById(`projeto-${projetoId}`);
                    if(linhaParaRemover) {
                        linhaParaRemover.style.opacity = '0';
                        setTimeout(() => linhaParaRemover.remove(), 300); // Remove após a transição
                    }
                    
                    // Se não houver mais projetos, exibe a mensagem
                    if (tabelaProjetosBody.children.length === 1) { // A linha ainda está lá, mas invisível
                         setTimeout(() => {
                            if (tabelaProjetosBody.children.length === 0) {
                                tabelaProjetosBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum projeto cadastrado.</td></tr>';
                            }
                         }, 300);
                    }

                } catch (error) {
                    console.error('Erro ao apagar projeto:', error);
                    alert(`Não foi possível apagar o projeto: ${error.message}`);
                    botao.disabled = false;
                    botao.textContent = 'Apagar';
                }
            }
        }
    });

    // Chama a função para carregar os projetos assim que a página carregar
    carregarProjetosNaTela();
});