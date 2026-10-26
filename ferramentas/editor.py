#!/usr/bin/env python3
"""Editor de desenhos da abertura: ajuste os números do código arrastando pontos na cena.

Monta ferramentas/editor-montado.html com o jogo inteiro (lanchonete.html, montado de src/), um gancho para
trocar funções de desenho enquanto ele roda e a interface do editor (editor.js e editor.css). Os números das
funções de src/25-abertura.js (e dos outros arquivos passados) viram pontos e números arrastáveis.

Uso: python3 ferramentas/editor.py                abre em http://localhost:8765 (salva direto em src/)
     python3 ferramentas/editor.py --porta 9000   outra porta
     python3 ferramentas/editor.py --so-montar    só gera editor-montado.html (sem servidor: o editor
                                                  baixa o arquivo novo ou copia as mudanças para o chat)
     python3 ferramentas/editor.py --artifact     gera editor-artifact.html, sem invólucro (o publicador do
                                                  artifact do claude.ai envolve): baixa ou copia as mudanças
     python3 ferramentas/editor.py src/20-desenho-base.js   também edita as funções desse arquivo
"""
import http.server, json, os, subprocess, sys, webbrowser

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
SAIDA = os.path.join(AQUI, 'editor-montado.html')
ARQUIVOS = ['src/25-abertura.js'] + [a for a in sys.argv[1:] if a.startswith('src/') and a.endswith('.js')]
# o fim do código do jogo: o gancho entra antes, dentro do (function(){ ... })(), e enxerga as funções dele
FIM = 'window.requestAnimationFrame(frame);\n\n})();'
GANCHO = 'window.__ed = { ev: s => eval(s) };   // editor de desenhos: troca funções de desenho enquanto o jogo roda\n'


def montar():
    subprocess.run([sys.executable, os.path.join(RAIZ, 'montar.py')], check=True, stdout=subprocess.DEVNULL)
    jogo = open(os.path.join(RAIZ, 'lanchonete.html'), encoding='utf8').read()
    assert jogo.count(FIM) == 1, 'não achei o fim do código do jogo em lanchonete.html'
    jogo = jogo.replace(FIM, GANCHO + FIM)
    fontes = {a: open(os.path.join(RAIZ, a), encoding='utf8').read() for a in ARQUIVOS}
    ler = lambda n: open(os.path.join(AQUI, n), encoding='utf8').read()
    html = ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            # a abertura não toca sozinha no editor
            "<script>try{localStorage.setItem('lcc2_abertura','1')}catch(e){}</script></head><body>"
            + jogo + '<div id="ed"></div><style>' + ler('editor.css') + '</style><script>window.__ED_FONTES = '
            + json.dumps(fontes, ensure_ascii=False).replace('</', '<\\/')
            + ';window.__ED_SERVIDOR = location.protocol.startsWith("http");</script><script>'
            + ler('editor.js') + '</script></body></html>')
    open(SAIDA, 'w', encoding='utf8').write(html)
    return html


def montar_artifact():
    # o mesmo editor sem <!doctype>/<html>/<head>/<body>, começando pelo <title> (como o lanchonete.html)
    html = montar()
    corpo = html.split('<body>', 1)[1].rsplit('</body>', 1)[0]
    ini = corpo.index('<title>'); fim = corpo.index('</title>', ini) + len('</title>')
    corpo = corpo[:ini] + corpo[fim:]
    out = ('<title>Editor de desenhos</title>\n<meta name="viewport" content="width=device-width,initial-scale=1">'
           "<script>try{localStorage.setItem('lcc2_abertura','1')}catch(e){}window.__ED_ARTIFACT=true;</script>" + corpo)
    caminho = os.path.join(AQUI, 'editor-artifact.html')
    open(caminho, 'w', encoding='utf8').write(out)
    return caminho


class Pedidos(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a): pass

    def responder(self, cod, corpo, tipo='text/html; charset=utf-8'):
        b = corpo.encode('utf8')
        self.send_response(cod); self.send_header('Content-Type', tipo); self.send_header('Content-Length', str(len(b)))
        self.send_header('Cache-Control', 'no-store'); self.end_headers(); self.wfile.write(b)

    def do_GET(self):
        if self.path in ('/', '/index.html'): self.responder(200, montar())   # remonta a cada recarga: pega o src/ atual
        else: self.responder(404, 'não achei')

    def do_POST(self):
        if self.path != '/salvar': return self.responder(404, 'não achei')
        try:
            d = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))).decode('utf8'))
            if d.get('arquivo') not in ARQUIVOS: raise ValueError('arquivo fora da lista do editor')
            open(os.path.join(RAIZ, d['arquivo']), 'w', encoding='utf8').write(d['texto'])
            subprocess.run([sys.executable, os.path.join(RAIZ, 'montar.py')], check=True, stdout=subprocess.DEVNULL)
            print('salvo:', d['arquivo'], '(lanchonete.html montado de novo)')
            self.responder(200, json.dumps({'ok': True}), 'application/json')
        except Exception as e:
            self.responder(400, json.dumps({'ok': False, 'erro': str(e)}), 'application/json')


if __name__ == '__main__':
    if '--artifact' in sys.argv:
        print('montado:', montar_artifact()); sys.exit(0)
    montar()
    if '--so-montar' in sys.argv:
        print('montado:', SAIDA); sys.exit(0)
    porta = int(sys.argv[sys.argv.index('--porta') + 1]) if '--porta' in sys.argv else 8765
    url = 'http://localhost:%d/' % porta
    print('Editor de desenhos em', url, '(Ctrl+C para parar)')
    try: webbrowser.open(url)
    except Exception: pass
    http.server.ThreadingHTTPServer(('127.0.0.1', porta), Pedidos).serve_forever()
