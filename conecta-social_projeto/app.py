from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', page='index')

@app.route('/futebol')
def futebol():
    return render_template('futebol.html', page='futebol')

@app.route('/basquete')
def basquete():
    return render_template('basquete.html', page='basquete')

@app.route('/volei')
def volei():
    return render_template('volei.html', page='volei')

@app.route('/rugby')
def rugby():
    return render_template('rugby.html', page='rugby')

@app.route('/projetos')
def projetos():
    return render_template('projetos.html', page='projetos')

@app.route('/futevolei')
def futevolei():
    return render_template('futevolei.html', page='futevolei')

@app.route('/handebol')
def handebol():
    return render_template('handebol.html', page='handebol')

@app.route('/futsal')
def futsal():
    return render_template('futsal.html', page='futsal')

@app.route('/volei_de_areia')
def volei_de_areia():
    return render_template('volei_de_areia.html', page='volei_de_areia')

@app.route('/tenis_de_mesa')
def tenis_de_mesa():
    return render_template('tenis_de_mesa.html', page='tenis_de_mesa')

if __name__ == '__main__':
    app.run(debug=True)