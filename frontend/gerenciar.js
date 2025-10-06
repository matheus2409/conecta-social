// frontend/gerenciar.js (Corrigido)

document.addEventListener('DOMContentLoaded', () => {
    // Proteção de rota
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return;
    }

    const tabelaProjetosBody = document.getElementById('lista-projetos'); // ID corrigido para corresponder ao HTML
    
    async function carregarProjetosParaGerenciar() {
        try {
            tabelaProjetosBody.innerHTML = '<tr><td colspan="3" class="text-center">A carregar...</td></tr>';
            
            // Usa a função fetchFromAPI para buscar os projetos
            const projetos = await fetchFromAPI('/projetos');

            tabelaProjetosBody.innerHTML = '';

            if (projetos.length === 0) {
                tabelaProjetosBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum projeto registado.</td></tr>';
                return;
            }

            projetos.forEach(projeto => {
                const linhaHTML = `
                    <tr id="projeto-${projeto.id}">
                        <td>${projeto.nome || 'Sem nome'}</td>
                        <td>${projeto.categoria || 'Sem categoria'}</td>
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
            
            if (confirm('Tem a certeza de que deseja apagar este projeto?')) {
                try {
                    botao.disabled = true;
                    botao.textContent = 'A apagar...';
                    
                    // Usa a função fetchFromAPI para apagar o projeto
                    await fetchFromAPI(`/projetos/${projetoId}`, { method: 'DELETE' });
                    
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