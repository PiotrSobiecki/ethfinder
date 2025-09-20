import { FileText, ArrowLeft } from "lucide-react";

interface TermsOfServiceProps {
  onClose: () => void;
}

export default function TermsOfService({ onClose }: TermsOfServiceProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Terms of Service
            </h2>
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
                1. Acceptance of Terms
              </h3>
              <p className="text-gray-700 mb-4">
                By accessing and using the Ethereum Address Generator ("the
                Service"), you accept and agree to be bound by the terms and
                provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                2. Description of Service
              </h3>
              <p className="text-gray-700 mb-4">
                The Ethereum Address Generator is a client-side tool that
                generates Ethereum addresses with custom prefixes and suffixes.
                All operations are performed locally in your browser.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>No data is transmitted to external servers</li>
                <li>
                  Private keys are generated and displayed only in your browser
                </li>
                <li>
                  You are solely responsible for securing your generated private
                  keys
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                3. User Responsibilities
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  You are responsible for the security of any generated private
                  keys
                </li>
                <li>You must not use the service for illegal activities</li>
                <li>
                  You acknowledge that cryptocurrency transactions are
                  irreversible
                </li>
                <li>You understand the risks associated with cryptocurrency</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                4. Disclaimer of Warranties
              </h3>
              <p className="text-gray-700 mb-4">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE
                DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
                A PARTICULAR PURPOSE.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                5. Limitation of Liability
              </h3>
              <p className="text-gray-700 mb-4">
                IN NO EVENT SHALL WE BE LIABLE FOR ANY DIRECT, INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
                OUT OF YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                6. Security Notice
              </h3>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                <p className="text-amber-800 font-medium">
                  ⚠️ Important Security Notice:
                </p>
                <ul className="list-disc list-inside text-amber-700 mt-2 space-y-1">
                  <li>Never share your private keys with anyone</li>
                  <li>Store private keys securely offline</li>
                  <li>Use this tool on a secure, private computer</li>
                  <li>Clear your browser history after use</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                7. Contact Information
              </h3>
              <p className="text-gray-700">
                For technical support or questions about these terms, please
                contact us at:{" "}
                <a
                  href="mailto:it@sobiecki.org"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  it@sobiecki.org
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
