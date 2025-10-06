import requests
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

API_URL = 'http://localhost:3001/api/projetos'

# Exemplo simples de classificação de projetos por descrição
response = requests.get(API_URL)
projetos = response.json()
descricoes = [p.get('descricao', '') for p in projetos]
categorias = [p.get('categoria', 'Sem categoria') for p in projetos]
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(descricoes)
clf = MultinomialNB()
clf.fit(X, categorias)
# Classificar novo projeto
nova_desc = ['Projeto de futebol para jovens']
X_new = vectorizer.transform(nova_desc)
pred = clf.predict(X_new)
print('Categoria prevista para novo projeto:', pred[0])
