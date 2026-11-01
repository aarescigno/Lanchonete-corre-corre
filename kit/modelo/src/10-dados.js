
/* ========== Dados e números do jogo ==========
   Tudo que é número de balanceamento fica em CFG; tabelas de conteúdo, aqui também.
   O exemplo (liga, equipe, rodadas) é só um ponto de partida: troque pelo seu jogo. */
const VERSAO = 'v0.1';
const SAVE_V = 1;               // sobe quando o formato do estado muda (com uma função em MIGRA)
const CHAVE = '{{CHAVE}}';      // prefixo das chaves do localStorage

const CFG = {
  semanas: 10,                  // rodadas por temporada
  caixaInicial: 50000,
  salarioPorNivel: 12,          // salário semanal = nível × isto
  receitaVitoria: 9000, receitaEmpate: 5000, receitaDerrota: 3000,
  sorteJogo: 25,                // peso da sorte na força de cada rodada
  evolucaoChance: 0.15,         // chance semanal de um membro subir 1 nível
};

const NOMES = ['Ana','Bruno','Carla','Davi','Elisa','Fábio','Gabi','Hugo','Iara','João','Kátia','Luan','Marta','Nilo','Olga','Paulo'];
const RIVAIS = [
  {nome:'Estrela do Norte', forca:50},
  {nome:'União Serrana',    forca:46},
  {nome:'Porto Velho FC',   forca:53},
  {nome:'Atlético Vale',    forca:43},
];
