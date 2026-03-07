#!/bin/zsh
pyenv shell 3.11.8

# Python auto-format (line length 79)
if [ -f backend/requirements.txt ]; then
  echo "Running black for Python..."
  BLACK_PATH=$(pyenv which black)
  $BLACK_PATH backend/app --line-length 79 || exit 1
  echo "Running flake8 for Python..."
  FLAKE8_PATH=$(pyenv which flake8)
  $FLAKE8_PATH backend/app || exit 1
fi

# TypeScript auto-fix
if [ -f frontend/package.json ]; then
  echo "Running eslint --fix for TypeScript..."
  cd frontend && npx eslint src --ext .ts,.tsx --fix && cd ..
  echo "Running eslint for TypeScript..."
  cd frontend && npx eslint src --ext .ts,.tsx || exit 1
  cd ..
fi

echo "Lint checks passed!"
