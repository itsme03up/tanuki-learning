#!/bin/zsh
pyenv shell 3.11.8

# Python lint
if [ -f backend/requirements.txt ]; then
  echo "Running flake8 for Python..."
  FLAKE8_PATH=$(pyenv which flake8)
  BLACK_PATH=$(pyenv which black)
  $FLAKE8_PATH backend/app || exit 1
  echo "Running black for Python..."
  $BLACK_PATH backend/app || exit 1
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
