#!/bin/sh
# Usage: . ./set-env.sh OR source ./set-env.sh
# Loads environment variables from .env in this directory

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
  echo "✅ Environment variables loaded from .env"
else
  echo "⚠️  .env file not found in $(pwd)"
fi
