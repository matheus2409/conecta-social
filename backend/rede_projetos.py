import requests
import networkx as nx
import matplotlib.pyplot as plt

API_URL = 'http://localhost:3000/api/projetos' # Corrigido

response = requests.get(API_URL)
projetos = response.json()
G = nx.Graph()
for p in projetos:
    nome = p.get('nome', '')
    colaboradores = p.get('colaboradores', '').split(',') if p.get('colaboradores') else []
    for colab in colaboradores:
        G.add_edge(nome, colab.strip())
plt.figure(figsize=(10,7))
nx.draw(G, with_labels=True, node_color='#2193b0', font_size=10)
plt.savefig('rede_projetos.png')
print('Rede de projetos gerada em rede_projetos.png')