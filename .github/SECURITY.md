# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| main    | ✅        |

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues.**

Instead:
1. Email piotr@sobiecki.org with details
2. Include steps to reproduce if possible
3. Allow reasonable time for a fix before public disclosure

## What to Report

- Any path where a generated private key or seed could leave the browser
  (network requests, logging, analytics, service workers)
- Weaknesses in the address/key generation logic (predictable randomness,
  non-cryptographic RNG use)
- XSS or injection vulnerabilities
- Secrets exposed in code, build output, or logs
- Docker/nginx or Railway deployment misconfigurations

## Response

We aim to:
- Acknowledge receipt within 48 hours
- Provide an initial assessment within 1 week
- Release a fix as soon as practical

## Security Best Practices for Contributors

- Never commit secrets, API keys, or credentials
- Generated private keys and addresses must never be sent off-device —
  all generation stays client-side
- Use environment variables for any sensitive config
- Validate all user input
