import { Shield, ArrowLeft } from "lucide-react";

interface PrivacyPolicyProps {
  onClose: () => void;
}

export default function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-500 mb-6">
              Last updated: September 20, 2025
            </p>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                1. Information We Do NOT Collect
              </h3>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-4">
                <p className="text-green-800 font-medium">
                  🔒 Zero Data Collection Policy
                </p>
                <p className="text-green-700 mt-2">
                  This application operates entirely in your browser. We do not
                  collect, store, or transmit any personal information or
                  generated data.
                </p>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>No private keys are transmitted or stored</li>
                <li>No personal information is collected</li>
                <li>No usage analytics or tracking</li>
                <li>No cookies for tracking purposes</li>
                <li>No server-side logging of user activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                2. How the Application Works
              </h3>
              <p className="text-gray-700 mb-4">
                The Ethereum Address Generator is a client-side application
                that:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Runs entirely in your web browser</li>
                <li>Uses your browser's built-in cryptographic functions</li>
                <li>Generates addresses and private keys locally</li>
                <li>
                  Does not require internet connection for core functionality
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                3. Data Processing
              </h3>
              <p className="text-gray-700 mb-4">
                All cryptographic operations happen locally:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  Random number generation uses your browser's secure random API
                </li>
                <li>Private key derivation happens in browser memory</li>
                <li>Address generation is computed locally</li>
                <li>
                  No data leaves your device during the generation process
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                4. Third-Party Services
              </h3>
              <p className="text-gray-700 mb-4">This application may use:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  CDN services for faster loading (no personal data shared)
                </li>
                <li>Open-source cryptographic libraries</li>
                <li>No third-party analytics or tracking services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                5. Security Measures
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All operations performed client-side</li>
                <li>No server-side storage of sensitive data</li>
                <li>Secure random number generation</li>
                <li>HTTPS encryption for application delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                6. Your Responsibilities
              </h3>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                <p className="text-amber-800 font-medium">
                  🔐 Security Best Practices:
                </p>
                <ul className="list-disc list-inside text-amber-700 mt-2 space-y-1">
                  <li>Clear your browser's memory/cache after use</li>
                  <li>Use the application on a secure, private device</li>
                  <li>Do not share generated private keys</li>
                  <li>Store private keys securely offline</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                7. Changes to This Policy
              </h3>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. Any changes
                will be posted on this page with an updated revision date.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                8. Contact Us
              </h3>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please
                contact us at:{" "}
                <a
                  href="mailto:contact@ethfinder.org"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  contact@ethfinder.org
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
