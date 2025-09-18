#!/bin/bash

set -e

echo "🔁 Gerando arquivo llms-full.txt..."
python3 .helper-scripts/llms/generate_llms_full.py

if [ -f llms-full.txt ]; then
  echo "✅ Arquivo gerado com sucesso. Adicionando ao commit..."

  git add llms-full.txt

  # Faz commit somente se houver mudanças no arquivo gerado
  if ! git diff --cached --quiet; then
    git commit -m "chore: auto-update llms-full.txt"
  else
    echo "⚠️ Nenhuma mudança detectada no arquivo. Não foi feito novo commit."
  fi
else
  echo "❌ Arquivo llms-full.txt não encontrado. Abortando push."
  exit 1
fi
