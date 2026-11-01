#!/usr/bin/env bash
# Índice das partes do jogo em src/ (seções, classes, funções, métodos e constantes, com arquivo e nº de linha).
# Use para achar o trecho e ler só aquelas linhas da parte, em vez do arquivo inteiro.
# Uso: ./mapa.sh [filtro]   ex.: ./mapa.sh save
cd "$(dirname "$0")/.."
grep -nE '^/\* =+|^(class|function) [A-Za-z_$]+|^const [A-Za-z_$]+ *=|^  (get )?[a-zA-Z_]+\(.*\) *\{|^ *<section id=|^@media' src/*.html src/*.css src/*.js \
  | sed 's#^src/##' | sed 's/ *{$//' | cut -c1-140 | grep -i -- "${1:-.}"
