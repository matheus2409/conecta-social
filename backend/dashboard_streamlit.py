import requests
import streamlit as st

API_URL = 'http://localhost:3000/api/projetos' # Corrigido

st.title('Dashboard de Projetos')
response = requests.get(API_URL)
projetos = response.json()
if projetos:
    categorias = [p.get('categoria', 'Sem categoria') for p in projetos]
    st.bar_chart({cat: categorias.count(cat) for cat in set(categorias)})
    st.write(projetos)