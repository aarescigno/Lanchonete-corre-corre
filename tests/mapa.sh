#!/usr/bin/env bash
# Índice de lanchonete.html (seções, classes, funções e constantes com nº de linha).
# Use para achar o trecho e ler só aquelas linhas, em vez do arquivo inteiro (~145 KB).
# Uso: ./mapa.sh [filtro]   ex.: ./mapa.sh juice
cd "$(dirname "$0")/.."
grep -nE '^/\* =+|^   [A-ZÁÉÍÓÚÇÃÕ].*$|^(class|function) [A-Za-z_]+|^const [A-Z_]+ *=|^  [a-zA-Z_]+\(.*\)\{$|^ *<div class="ov|^@media' lanchonete.html \
  | grep -v '^\S*: *=' | sed 's/{$//' | grep -i -- "${1:-.}"
