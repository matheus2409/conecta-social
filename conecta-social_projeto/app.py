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

@app.route('/boxe')
def boxe():
    return render_template('boxe.html', page='boxe')

@app.route('/muay_thai')
def muay_thai():
    return render_template('muay_thai.html', page='muay_thai')

@app.route('/judo')
def judo():
    return render_template('judo.html', page='judo')

@app.route('/jiu_jitsu')
def jiu_jitsu():
    return render_template('jiu_jitsu.html', page='jiu_jitsu')

@app.route('/karate')
def karate():
    return render_template('karate.html', page='karate')

@app.route('/krav_maga')
def krav_maga():
    return render_template('krav_maga.html', page='krav_maga')

@app.route('/kung_fu')
def kung_fu():
    return render_template('kung_fu.html', page='kung_fu')

@app.route('/futebol_americano')
def futebol_americano():
    return render_template('futebol_americano.html', page='futebol_americano')

@app.route("/natacao")
def natacao():
    return render_template("natacao.html", page="natacao")

@app.route("/corrida")
def corrida():
    return render_template("corrida.html", page="corrida")

@app.route("/surfe")
def surfe():
    return render_template("surfe.html", page="surfe")

@app.route("/polo_aquatico")
def polo_aquatico():
    return render_template("polo_aquatico.html", page="polo_aquatico")

@app.route("/ciclismo")
def ciclismo():
    return render_template("ciclismo.html", page="ciclismo")

@app.route("/kitesurf")
def kitesurf():
    return render_template("kitesurf.html", page="kitesurf")

@app.route("/mergulho")
def mergulho():
    return render_template("mergulho.html", page="mergulho")

@app.route("/cricket")
def cricket():
    return render_template("cricket.html", page="cricket")

@app.route("/beisebol")
def beisebol():
    return render_template("beisebol.html", page="beisebol")

if __name__ == '__main__':
    app.run(debug=True)