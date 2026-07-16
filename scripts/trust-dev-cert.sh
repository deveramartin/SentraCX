#!/usr/bin/env bash
set -euo pipefail

# SentraCX — Trust ASP.NET Core HTTPS Development Certificate (Cross-Platform)
# Usage: ./scripts/trust-dev-cert.sh
#
# Run ONCE after cloning the repo. The trust persists permanently:
#   - macOS:   Adds to login Keychain (survives reboots)
#   - Windows: Adds to CurrentUser certificate store (survives reboots)
#   - Linux:   Adds to ~/.aspnet/dev-certs/trust/ and appends SSL_CERT_DIR
#              + NODE_EXTRA_CA_CERTS to your shell profile (persists across sessions)

CERT_EXPORT_DIR="$HOME/.aspnet/dev-certs"
CERT_EXPORT_PATH="$CERT_EXPORT_DIR/https-dev-cert.pem"
TRUST_DIR="$CERT_EXPORT_DIR/trust"

detect_os() {
  case "$(uname -s)" in
    Darwin*)  echo "macos" ;;
    Linux*)   echo "linux" ;;
    MINGW*|MSYS*|CYGWIN*) echo "windows" ;;
    *)        echo "unknown" ;;
  esac
}

detect_shell_profile() {
  if [ -n "${ZSH_VERSION:-}" ] || [ -f "$HOME/.zshrc" ]; then
    echo "$HOME/.zshrc"
  elif [ -f "$HOME/.bashrc" ]; then
    echo "$HOME/.bashrc"
  elif [ -f "$HOME/.profile" ]; then
    echo "$HOME/.profile"
  else
    echo "$HOME/.bashrc"
  fi
}

already_configured() {
  local profile="$1"
  grep -q "SSL_CERT_DIR.*aspnet/dev-certs/trust" "$profile" 2>/dev/null
}

OS=$(detect_os)
echo "▶ Detected OS: $OS"
echo ""

# Step 1: Generate the certificate
echo "▶ Generating HTTPS development certificate..."
dotnet dev-certs https --clean 2>/dev/null || true
dotnet dev-certs https 2>/dev/null

# Step 2: Trust it (OS-specific persistence)
echo "▶ Trusting certificate..."

case "$OS" in
  macos)
    # macOS: --trust adds to login Keychain permanently. One-time, survives reboots.
    dotnet dev-certs https --trust
    echo "✓ Certificate added to macOS login Keychain (persistent)."
    ;;

  windows)
    # Windows (Git Bash/WSL calling Windows dotnet): --trust adds to CurrentUser cert store.
    dotnet dev-certs https --trust
    echo "✓ Certificate added to Windows certificate store (persistent)."
    ;;

  linux)
    # Linux: --trust places PEM in trust dir, but SSL_CERT_DIR must include it.
    dotnet dev-certs https --trust 2>/dev/null || true

    # Export PEM for Node.js / other non-OpenSSL clients
    dotnet dev-certs https --export-path "$CERT_EXPORT_PATH" --format Pem --no-password 2>/dev/null || true

    # If export failed, use the PEM already in trust dir
    if [ ! -f "$CERT_EXPORT_PATH" ]; then
      CERT_EXPORT_PATH=$(find "$TRUST_DIR" -name "*.pem" 2>/dev/null | head -1)
    fi

    PROFILE=$(detect_shell_profile)

    if already_configured "$PROFILE"; then
      echo "✓ Shell profile ($PROFILE) already configured. Nothing to do."
    else
      {
        echo ""
        echo "# SentraCX: ASP.NET Core HTTPS dev certificate trust (added by scripts/trust-dev-cert.sh)"
        echo "export SSL_CERT_DIR=\"\$HOME/.aspnet/dev-certs/trust:/etc/ssl/certs\""
        echo "export NODE_EXTRA_CA_CERTS=\"\$HOME/.aspnet/dev-certs/https-dev-cert.pem\""
      } >> "$PROFILE"
      echo "✓ Added SSL_CERT_DIR and NODE_EXTRA_CA_CERTS to $PROFILE (persistent)."
      echo ""
      echo "  To activate now:  source $PROFILE"
      echo "  (Future shells will pick it up automatically.)"
    fi
    ;;

  *)
    echo "⚠ Unknown OS. Attempting generic trust..."
    dotnet dev-certs https --trust || true
    ;;
esac

echo ""

# Step 3: Verify
echo "▶ Verifying..."
if [ "$OS" = "linux" ]; then
  # Source the profile vars for verification in this session
  export SSL_CERT_DIR="$HOME/.aspnet/dev-certs/trust:/etc/ssl/certs"
fi

dotnet dev-certs https --check --trust 2>&1 && STATUS="trusted" || STATUS="untrusted"

if [ "$STATUS" = "trusted" ]; then
  echo ""
  echo "✓ All done. The api-crm dev certificate (https://localhost:5005) is trusted."
  echo "  This is a one-time setup — no need to run again unless the cert expires."
else
  echo ""
  echo "⚠ Certificate generated but could not fully verify trust."
  echo "  On Linux, open a new terminal (or source your profile) and re-run:"
  echo "    dotnet dev-certs https --check --trust"
fi
