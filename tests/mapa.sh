#!/usr/bin/env bash
# Índice das partes do jogo em src/ (seções, classes, funções e constantes, com arquivo e nº de linha).
# Use para achar o trecho e ler só aquelas linhas da parte, em vez do arquivo inteiro.
# Uso: ./mapa.sh [filtro]   ex.: ./mapa.sh juice
cd "$(dirname "$0")/.."
grep -nE '^/\* =+|^   [A-ZÁÉÍÓÚÇÃÕ].*$|^(class|function) [A-Za-z_]+|^const [A-Z_]+ *=|^  [a-zA-Z_]+\(.*\)\{$|^ *<div class="ov|^@media' src/*.html src/*.css src/*.js \
  | grep -v '^[^:]*:[0-9]*: *=' | sed 's#^src/##' | sed 's/{$//' | grep -i -- "${1:-.}"
