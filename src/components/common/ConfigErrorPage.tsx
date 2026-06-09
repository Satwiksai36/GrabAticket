import React, { useState } from 'react';
import { Database, AlertCircle, Copy, Check, RefreshCw } from 'lucide-react';

export const ConfigErrorPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  const envCode = `VITE_SUPABASE_PROJECT_ID="your_project_id_here"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key_here"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 selection:text-white relative">
      {/* Background decorative glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-850 rounded-2xl shadow-2xl p-6 md:p-10 overflow-hidden">
        {/* Top bar branding */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-6 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Database className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">GrabAticket</h1>
            <p className="text-xs text-slate-400">Database Setup Required</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Not Connected
          </span>
        </div>

        {/* Hero message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Connect your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Supabase Backend</span>
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            The application is currently offline because the Supabase configuration variables are not set. Follow the steps below to configure your database and launch the ticketing system.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-8 text-sm md:text-base">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
              1
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-white">Create a `.env` file</h3>
              <p className="text-slate-400 text-sm">
                Create a file named <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs font-semibold">.env</code> in the project root directory.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
              2
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Add credentials</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              <p className="text-slate-400 text-sm">
                Copy the code below into your newly created <code className="text-xs bg-slate-800 px-1 rounded">.env</code> file, replacing the placeholder values with your Supabase credentials.
              </p>
              <pre className="relative bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-350 overflow-x-auto select-all leading-relaxed">
                {envCode}
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
              3
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-white">Database Setup</h3>
              <p className="text-slate-400 text-sm">
                Make sure you run the SQL script in <code className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono text-xs">supabase_setup.sql</code> in your Supabase dashboard SQL editor to create all tables and setup Row Level Security (RLS) policies.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={handleRetry}
            disabled={checking}
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/60 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-650/20"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            {checking ? 'Checking backend connection...' : 'Check Configuration & Reload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigErrorPage;
