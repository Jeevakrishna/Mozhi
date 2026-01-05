import { useState } from 'react';

const MinimalProfessionalCompiler = () => {
  const [code, setCode] = useState(`karuthu "Hello Tanglish"
vaippu name = "Tamil"
kaattu "Vanakkam " + name`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-slate-900/90 backdrop-blur-lg border-b border-purple-500/20 shadow-2xl p-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Tanglish Professional Compiler
        </h1>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-xl border border-purple-500/20 p-4">
            <h2 className="text-white mb-4">Code Editor</h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-slate-900 text-green-400 p-4 rounded font-mono text-sm resize-none"
            />
          </div>
          
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-xl border border-purple-500/20 p-4">
            <h2 className="text-white mb-4">Output Console</h2>
            <div className="w-full h-full bg-slate-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto">
              Output will appear here...
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MinimalProfessionalCompiler;
