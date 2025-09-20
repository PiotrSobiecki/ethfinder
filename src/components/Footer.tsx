import {
  Github,
  Coffee,
  ExternalLink,
  Copy,
  Check,
  Mail,
  FileText,
  Shield,
} from "lucide-react";
import { useState } from "react";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";

export default function Footer() {
  const [copiedTip, setCopiedTip] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const copyTipAddress = async () => {
    try {
      await navigator.clipboard.writeText(
        "0xc0FFEE4fF6d0bE9D45AFa862456f9df95a978271"
      );
      setCopiedTip(true);
      setTimeout(() => setCopiedTip(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <footer className="mt-16 py-8 border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Expanded Coffee tip section */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-lg max-w-2xl">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Coffee className="w-8 h-8 text-amber-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Buy me a coffee? ☕
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Support the development of this free tool
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="font-mono text-sm text-amber-800 bg-amber-100 px-4 py-2 rounded-lg break-all flex-1 min-w-0">
                  0xc0FFEE4fF6d0bE9D45AFa862456f9df95a978271
                </div>
                <button
                  onClick={copyTipAddress}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 font-medium shadow-sm"
                  title="Copy tip address"
                >
                  {copiedTip ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                💡 Notice the address starts with "c0FFEE" - perfect for coffee
                tips! ☕
              </p>
            </div>
          </div>
        </div>

        {/* GitHub link - smaller and centered */}
        <div className="text-center mb-6">
          <a
            href="https://github.com/PiotrSobiecki/ethfinder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900 shadow-sm"
          >
            <Github className="w-4 h-4" />
            <span className="font-medium">View Source Code</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Bottom row - Legal links and contact */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Legal links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
              <a
                href="mailto:it@sobiecki.org"
                className="flex items-center space-x-1 hover:text-indigo-600 transition-colors duration-200"
              >
                <Mail className="w-3 h-3" />
                <span>Technical Support</span>
              </a>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => setShowTerms(true)}
                className="flex items-center space-x-1 hover:text-indigo-600 transition-colors duration-200"
              >
                <FileText className="w-3 h-3" />
                <span>Terms of Service</span>
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => setShowPrivacy(true)}
                className="flex items-center space-x-1 hover:text-indigo-600 transition-colors duration-200"
              >
                <Shield className="w-3 h-3" />
                <span>Privacy Policy</span>
              </button>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500 text-center">
              <p>
                © 2025 Ethereum Address Generator •
                <span className="font-medium">
                  {" "}
                  Client-side only • No data collection{" "}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTerms && <TermsOfService onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </footer>
  );
}
