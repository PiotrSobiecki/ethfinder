# 🔐 ETHFinder - Ethereum Address Generator

A powerful, secure, and fast **Ethereum address generator** with customizable prefix and suffix patterns. Generate vanity addresses entirely in your browser - **no server communication, maximum security!**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

## ✨ Features

- 🎯 **Custom Patterns**: Generate addresses with specific prefixes and suffixes
- 🔒 **100% Client-Side**: All generation happens in your browser - keys never leave your device
- 🚀 **High Performance**: Optimized generation with batching and UI responsiveness
- 📊 **Smart Probability Calculator**: Get realistic time estimates for your patterns
- 🎨 **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- 📱 **Mobile Friendly**: Works perfectly on all devices
- 🔄 **Case Sensitivity Options**: Choose between exact case or case-insensitive matching
- 📥 **Export Options**: View on screen or download as file
- 🎛️ **Real-time Validation**: Hex input validation with helpful error messages
- 🎉 **Toast Notifications**: Non-intrusive feedback system

## 🔧 How It Works

1. **Enter your desired pattern**: Specify prefix (after 0x) and/or suffix
2. **Choose your options**: Case sensitivity, number of addresses, output method
3. **See the probability**: Get estimates for generation time and difficulty
4. **Generate securely**: All cryptographic operations happen locally in your browser
5. **Copy or download**: Get your generated addresses and private keys

## 🎯 Example Patterns

| Pattern                 | Example Address   | Difficulty |
| ----------------------- | ----------------- | ---------- |
| Prefix: `dead`          | `0xdead123...`    | Medium     |
| Suffix: `beef`          | `0x...1234beef`   | Medium     |
| Both: `c0ffee` + `dead` | `0xc0ffee...dead` | Very Hard  |

## 🔒 Security Features

- **Zero Server Communication**: Keys generated using `crypto.getRandomValues()`
- **No Network Requests**: No analytics, no third-party calls; fonts are
  self-hosted at build time
- **Open Source**: Fully auditable codebase
- **Security Headers**: CSP (without `unsafe-eval`), HSTS, `frame-ancestors 'none'`,
  `nosniff` and `Referrer-Policy`, all served by nginx - see
  `nginx-security-headers.conf`. They cannot come from the Next.js `metadata`
  export, which only renders inert `<meta>` tags.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Crypto**: Ethers.js for address generation
- **Icons**: Lucide React
- **Deployment**: Docker + Nginx for static hosting

## 📦 Getting Started

### Local Development

```bash
# Clone the repository
git clone https://github.com/PiotrSobiecki/ethfinder.git
cd ethfinder

# Install dependencies (pnpm, per "packageManager" in package.json)
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production - output: "export" writes the static site to ./out
pnpm build

# Serve ./out with nginx or any static server
```

### Docker Deployment

```bash
# Build Docker image
docker build -t ethfinder .

# Run container
docker run -p 3000:3000 ethfinder
```

### Railway Deployment

1. Fork this repository
2. Connect to Railway
3. Deploy automatically with `railway.toml` configuration

## 🎛️ Configuration

### Environment Variables

No environment variables needed - everything runs client-side!

### Customization

- Modify `src/utils/probabilityCalculator.ts` for different difficulty calculations
- Adjust batch sizes in `src/hooks/useEthereumGenerator.ts` for performance tuning
- Customize UI colors in `tailwind.config.js`

## 📊 Performance

- **Batch Processing**: 20,000 addresses per batch
- **UI Responsiveness**: Yields via `MessageChannel`, which keeps generating
  while the tab is minimized
- **Memory**: Matching results stay in React state because the UI has to show
  them; the random byte buffer each key is derived from is zeroed right after use
- **Mobile Optimized**: Works smoothly on mobile devices

## 🔍 Pattern Difficulty Guide

| Characters | Case sensitive (letters) | Case insensitive    | Est. time*          |
| ---------- | ------------------------ | ------------------- | ------------------- |
| 1 char     | ~32 attempts             | ~16 attempts        | < 1 second          |
| 2 chars    | ~1,024 attempts          | ~256 attempts       | < 1 second          |
| 3 chars    | ~32,768 attempts         | ~4,096 attempts     | 3-25 seconds        |
| 4 chars    | ~1,048,576 attempts      | ~65,536 attempts    | 45 seconds - 12 min |
| 5 chars    | ~33,554,432 attempts     | ~1,048,576 attempts | 12 minutes - 6 h    |

Digits have no upper/lower form, so a digit always costs ~16 attempts whether
or not case sensitivity is on. Only letters a-f pay the extra factor of two,
for matching the EIP-55 checksum case.

*Times are estimates and vary based on device performance and luck

## 📁 Reference files

`private.ts` and `index.html` are the prototypes this app grew out of: a Node.js
CLI generator and a single-file HTML version. They are versioned deliberately,
but excluded from the Next.js build (`tsconfig.json`) and from the Docker image
(`.dockerignore`). `private.ts` imports `ethereumjs-wallet`, which is not a
dependency here - install it separately if you want to run it.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

- **Use at your own risk**: This tool generates real Ethereum private keys
- **Security responsibility**: You are responsible for keeping your private keys secure
- **No warranty**: This software is provided "as is" without any warranties
- **Test thoroughly**: Always test with small amounts before using generated addresses

## 🙏 Acknowledgments

- [Ethers.js](https://docs.ethers.org/) for Ethereum utilities
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
- [Lucide](https://lucide.dev/) for clean icons

---

**🔐 Generate securely, generate locally, generate with confidence!**
