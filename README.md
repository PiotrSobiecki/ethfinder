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
- **No Network Requests**: Complete offline functionality
- **Open Source**: Fully auditable codebase
- **CSP Headers**: Content Security Policy protection
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options, etc.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
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

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Export static files
npm run export

# Serve with nginx or any static server
```

### Docker Deployment

```bash
# Build Docker image
docker build -t ethfinder .

# Run container
docker run -p 80:80 ethfinder
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

- **Batch Processing**: 5,000 addresses per batch
- **UI Responsiveness**: Non-blocking generation with `setTimeout` yielding
- **Memory Efficient**: Results streamed to UI, not stored in memory
- **Mobile Optimized**: Works smoothly on mobile devices

## 🔍 Pattern Difficulty Guide

| Characters | Case Sensitive      | Case Insensitive    | Est. Time\*    |
| ---------- | ------------------- | ------------------- | -------------- |
| 1 char     | ~22 attempts        | ~16 attempts        | < 1 second     |
| 2 chars    | ~484 attempts       | ~256 attempts       | < 1 second     |
| 3 chars    | ~10,648 attempts    | ~4,096 attempts     | 1-5 seconds    |
| 4 chars    | ~234,256 attempts   | ~65,536 attempts    | 30-120 seconds |
| 5 chars    | ~5,153,632 attempts | ~1,048,576 attempts | 15-30 minutes  |

\*Times are estimates and vary based on device performance and luck

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
