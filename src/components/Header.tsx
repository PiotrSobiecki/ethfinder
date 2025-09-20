import { Shield, Zap } from "lucide-react";

export default function Header() {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="flex items-center justify-center space-x-4">
        <div className="relative">
          <Shield className="w-16 h-16 text-indigo-600" />
          <Zap className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Ethereum Address Generator
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Generate secure Ethereum addresses with custom prefixes and suffixes.
          All operations are performed locally in your browser for maximum
          security.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Client-side only</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>No data collection</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span>Open source</span>
        </div>
      </div>
    </div>
  );
}
