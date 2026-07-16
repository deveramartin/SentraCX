#!/usr/bin/env bash
set -euo pipefail

# SentraCX CRM Database Migration Script
# Usage:
#   ./scripts/migrate-crm.sh              Apply pending migrations
#   ./scripts/migrate-crm.sh add <Name>   Create a new migration
#   ./scripts/migrate-crm.sh remove       Remove the last migration
#   ./scripts/migrate-crm.sh status       Show migration status
#   ./scripts/migrate-crm.sh reset        Drop and recreate the database

PROJECT_DIR="$(cd "$(dirname "$0")/../apps/api-crm" && pwd)"
MIGRATIONS_DIR="Data/Migrations"

command="${1:-apply}"
shift || true

case "$command" in
  apply)
    echo "▶ Applying pending migrations..."
    dotnet ef database update --project "$PROJECT_DIR"
    echo "✓ Migrations applied successfully."
    ;;

  add)
    if [ -z "${1:-}" ]; then
      echo "✗ Usage: $0 add <MigrationName>"
      exit 1
    fi
    echo "▶ Creating migration: $1"
    dotnet ef migrations add "$1" --project "$PROJECT_DIR" --output-dir "$MIGRATIONS_DIR"
    echo "✓ Migration '$1' created in $MIGRATIONS_DIR/"
    ;;

  remove)
    echo "▶ Removing last migration..."
    dotnet ef migrations remove --project "$PROJECT_DIR"
    echo "✓ Last migration removed."
    ;;

  status)
    echo "▶ Migration status:"
    dotnet ef migrations list --project "$PROJECT_DIR"
    ;;

  reset)
    echo "⚠ This will DROP the database and recreate it from migrations."
    read -rp "Are you sure? (y/N): " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
      echo "▶ Dropping database..."
      dotnet ef database drop --project "$PROJECT_DIR" --force
      echo "▶ Applying all migrations..."
      dotnet ef database update --project "$PROJECT_DIR"
      echo "✓ Database reset complete."
    else
      echo "Cancelled."
    fi
    ;;

  *)
    echo "SentraCX CRM Migration Script"
    echo ""
    echo "Usage:"
    echo "  $0              Apply pending migrations"
    echo "  $0 add <Name>   Create a new migration"
    echo "  $0 remove       Remove the last migration"
    echo "  $0 status       Show migration status"
    echo "  $0 reset        Drop and recreate the database"
    exit 1
    ;;
esac
