/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Header } from "./components/Header";
import { PaperForm } from "./components/PaperForm";
import { PaperDisplay } from "./components/PaperDisplay";
import { PaperConfig, QuestionPaper } from "./types";
import { generateQuestionPaper } from "./services/gemini";
import { Sparkles, ArrowLeft, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (config: PaperConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedPaper = await generateQuestionPaper(config);
      setPaper(generatedPaper);
    } catch (err) {
      console.error(err);
      setError("Failed to generate question paper. Please try again or check your settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (confirm("Are you sure? You will lose the current generated paper.")) {
      setPaper(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <AnimatePresence mode="wait">
          {!paper ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  Powered by AI
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                  Design Question Papers <br />
                  <span className="text-brand-600 italic">In Seconds.</span>
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed">
                  Enter your requirements below, and our AI will craft a balanced, curriculum-aligned 
                  question paper complete with a detailed answer key and explanations.
                </p>
              </div>

              {error && (
                <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700 shadow-sm animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <PaperForm onGenerate={handleGenerate} isLoading={isLoading} />
              
              <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto shadow-sm font-bold text-slate-400">1</div>
                  <h4 className="font-bold text-slate-800">Set Board & Subject</h4>
                  <p className="text-xs text-slate-500">Curriculum-aligned questions for CBSE, ICSE, and more.</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto shadow-sm font-bold text-slate-400">2</div>
                  <h4 className="font-bold text-slate-800">Customize Styles</h4>
                  <p className="text-xs text-slate-500">Pick from MCQ, Assertion Type, Short/Long Answers.</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto shadow-sm font-bold text-slate-400">3</div>
                  <h4 className="font-bold text-slate-800">Instant Answer Key</h4>
                  <p className="text-xs text-slate-500">Get automatic answer keys with detailed explanations.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="no-print max-w-4xl mx-auto flex items-center justify-between">
                <button 
                  onClick={handleBack}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Create New Paper
                </button>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Preview Mode
                </div>
              </div>
              <PaperDisplay paper={paper} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="no-print mt-auto py-12 border-t border-slate-200 text-center space-y-4">
        <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
          EduPaper AI Assistant
        </p>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Created with ❤️ by <span className="text-brand-600 font-bold">Isha Soni</span> • 2026
        </p>
        <p className="text-xs text-slate-500 max-w-md mx-auto italic px-4 leading-relaxed">
          Disclaimer: AI-generated content may have inaccuracies. Please review all questions and answers 
          before distributing to students.
        </p>
      </footer>
    </div>
  );
}

