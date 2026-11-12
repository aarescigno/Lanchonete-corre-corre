# Pesquisa: salários da equipe (12/11/2026)

Para calibrar a diária de cada funcionário e da música (spec `docs/spec-v10.5.md`). Os números são **médias de anúncios e de admissões** (Indeed, Portal Salário/CAGED), não pisos de convenção, e servem para a **proporção** entre os cargos. A pesquisa não achou o piso da convenção de bares e restaurantes da capital paulista de 2026; o do Grande ABC (2025/2026) é de R$ 2.098 (com REPIS) a R$ 2.560.

## Como a conta foi feita
- **Custo por dia trabalhado** = salário do mês × 1,33 (encargos de empresa do Simples Nacional, sem benefícios: FGTS e as provisões de 13º, férias e terço) ÷ 26 dias (escala 6x1).
- **Escala do jogo:** ~80% do custo real (decidido em 12/11), arredondado. O aluguel dos pontos ficou em ~100% do real (`docs/pesquisa-aluguel.md`); os salários ficam um pouco abaixo para o jogo seguir dando lucro.
- Salário mínimo de 2026: R$ 1.621 (diário R$ 54,04; hora R$ 7,37). Mínimo regional de SP desde 1º/6/2026: R$ 1.874,36.

| Quem no jogo | Cargo real de referência | Salário do mês (fontes) | Custo por dia | ×80% | Antes (R$/dia) | Agora (R$/dia) |
|---|---|---|---|---|---|---|
| Tonhão | cozinheiro (níveis 0 a 2) → chefe de cozinha (3 e 4) | cozinha em SP ~R$ 2.000–2.600; chefe de cozinha em SP mediana R$ 3.000 (P90 R$ 5.052) | 102–133 → 153 | 82–106 → 123 | 0 · 15 · 20 · 25 · 30 | 50 · 65 · 80 · 100 · 120 |
| Dani | jovem aprendiz, 30 h por semana | R$ 1.000–1.150 (piso de R$ 7,37 por hora); encargos menores (FGTS de 2%) | ~50 | ~40 | 0 · 15 · 20 · 25 | 15 · 25 · 32 · 40 |
| Joca | auxiliar de serviços gerais | ~R$ 1.874 (mínimo regional) a R$ 2.000 | 96–102 | 77–82 | 45 · 60 · 75 | 65 · 78 · 90 |
| Cami | garçonete (1 a 3) → chefe de salão (4) | garçom: Brasil R$ 1.791–2.195, anúncios em SP R$ 2.000–2.700 (sem os 10%); chefe de salão ~R$ 3.500–4.000 | 102–138 → 179–205 | 82–110 → 143–164 | 120 · 140 · 160 · 190 | 95 · 115 · 135 · 160 |
| Anselmo | bartender (2) → mixologista (3) | bartender em SP R$ 2.565 (Indeed, ago/2026); mixologista R$ 3.500–5.000 | 131 → 179–256 | 105 → 143–205 | 90 · 130 | 105 · 150 |
| Lia | auxiliar de cozinha | ~R$ 1.820 | 93 | 74 | 80 | 80 (mantém: restaurante fino paga um pouco acima) |
| Couvert | voz e violão, por noite | sem tabela; pedidos avulsos de R$ 300–400 por noite; o couvert do cliente fica entre R$ 5 e R$ 10 ou mais | ~250–400 | 200–320 | 80 (cliente R$ 3) | 200 (cliente R$ 8) |
| Pianista | pianista solo, por noite | sem tabela pública; estimativa R$ 300–500 | — | ~300 | 120 + 30 de afinação | 300 + 5 de afinação |
| Afinação do piano | afinador, a cada 3 meses | ~R$ 300 por afinação | ~3–4 | — | 30 | 5 |
| Trio de cordas (era quarteto) | grupo de cordas, por evento | quarteto em sites de casamento: a partir de R$ 550 a R$ 2.000 | trio ~R$ 450–1.500 | — | 150 (quarteto) | 500 (trio) |

TV, som e as TVs da área industrial são conta de luz, não salário: não mudam.

## Fontes
- Salário mínimo de 2026: [Band, decreto de R$ 1.621](https://www.band.com.br/economia/noticias/decreto-do-governo-estabelece-valor-do-salario-minimo-a-partir-de-1-de-janeiro-em-r-162100-202512241121); [Jornal Opção](https://www.jornalopcao.com.br/ultimas-noticias/governo-oficializa-salario-minimo-de-r-1-621-em-2026-777562/).
- Mínimo regional de SP: [O Povo](https://opovo.com.br/trends/sao-paulo-tem-piso-regional-acima-do-salario-minimo-nacional-para-algumas-categorias/). Convenção do ABC: [ABC do ABC](https://abcdoabc.com.br/convencao-coletiva-de-trabalho-pisos-salariais-definidos/), [acordo para 2026](https://abcdoabc.com.br/hoteis-restaurantes-abc-fecham-acordo-2026/).
- Cozinha: [Indeed, quanto ganha cozinha em São Paulo](https://br.indeed.com/mercado/quanto-ganha-cozinha-são-paulo,-sp); [Portal Salário, cozinheiro geral](https://www.salario.com.br/profissao/cozinheiro-geral-cbo-513205); [Numerando, chefe de cozinha em SP](https://numerando.com.br/salarios/chefe-de-cozinha/sao-paulo).
- Garçom: [Portal Salário, garçom](https://www.salario.com.br/profissao/garcom-cbo-513405/); vagas em SP no [Indeed](https://br.indeed.com/cmp/Rh-Meta/salaries).
- Bartender: [Indeed, salários de bartender](https://br.indeed.com/career/bartender/salaries); [Portal Salário, atendente de bar](https://www.salario.com.br/profissao/atendente-de-bar-cbo-513420).
- Aprendiz: [Sebrae PR, aprendiz em 2026](https://sebraepr.com.br/comunidade/artigo/quanto-ganha-um-jovem-aprendiz-de-14-anos-veja-os-valores-reais-em-2026); [Serasa](https://www.serasaexperian.com.br/carreiras/blog-carreiras/quanto-ganha-um-jovem-aprendiz/).
- Auxiliar de cozinha: [vaga em SP, Idealist](https://www.idealist.org/es/ong-empleo/60cd888ec88d48959d6640843669ca2f-auxiliar-de-cozinha-asa-associacao-santo-agostinho-sao-paulo).
- Encargos no Simples: [Valor Final, estudo](https://valorfinal.com.br/estudos/quanto-custa-um-funcionario-clt); [Contajá](https://contaja.com.br/lp/?p=534); [sum.money](https://sum.money/br/custo-funcionario/).
- Música: [couvert artístico, Jornal Contábil](https://jornalcontabil.com.br/noticia/quais-as-regras-para-o-couvert-artistico-sou-obrigado-a-pagar/); [GetNinjas, pedidos de músicos](https://www.getninjas.com.br/eventos/bandas-e-cantores/mpb); [quarteto de cordas, Casamentos.com.br](https://www.casamentos.com.br/musica-de-casamento/quarteto-de-cordas--e227736).
