import { useState } from "react";
import { Download, Printer, Eye, EyeOff, CheckCircle2, ChevronRight } from "lucide-react";
import { QuestionPaper, QuestionType } from "../types";
import { motion } from "motion/react";

interface PaperDisplayProps {
  paper: QuestionPaper;
}

export function PaperDisplay({ paper }: PaperDisplayProps) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="no-print flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className="btn-secondary flex items-center gap-2"
          >
            {showAnswerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnswerKey ? "Hide Answer Key" : "Show Answer Key"}
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      <div className="print-container bg-white shadow-xl min-h-[11in] p-8 lg:p-16 border border-slate-200 rounded-2xl">
        {/* Header Section */}
        <div className="text-center space-y-4 border-b-2 border-slate-900 pb-8 mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">{paper.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-bold uppercase tracking-wider text-slate-600">
            <div className="border-r border-slate-200 last:border-0 pb-2 md:pb-0">
              <span className="block text-[10px] text-slate-400">Subject</span>
              {paper.subject}
            </div>
            <div className="border-r border-slate-200 last:border-0 pb-2 md:pb-0">
              <span className="block text-[10px] text-slate-400">Board</span>
              {paper.board}
            </div>
            <div className="border-r border-slate-200 last:border-0 pb-2 md:pb-0">
              <span className="block text-[10px] text-slate-400">Grade</span>
              {paper.grade}
            </div>
            <div className="last:border-0 pb-2 md:pb-0">
              <span className="block text-[10px] text-slate-400">Time / Marks</span>
              {paper.timeAllowed} | {paper.totalMarks} Marks
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {paper.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-900 text-white px-4 py-2 rounded-md">
                <span className="font-black text-xl">{String.fromCharCode(65 + sIdx)}</span>
                <h3 className="font-bold uppercase tracking-widest">{section.title}</h3>
              </div>

              <div className="space-y-8">
                {section.questions.map((q, qIdx) => (
                  <div key={q.id} className="relative group">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex gap-3">
                        <span className="font-bold text-slate-900">Q{qIdx + 1}.</span>
                        <div className="space-y-4 font-medium text-slate-800 leading-relaxed">
                          <p>{q.question}</p>
                          
                          {q.type === QuestionType.MCQ && q.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4 ml-2">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex gap-2">
                                  <span className="font-bold opacity-50">({String.fromCharCode(97 + oIdx)})</span>
                                  <span>{opt}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {q.type === QuestionType.ASSERTION_REASON && (
                            <div className="space-y-2 text-sm mt-4 italic text-slate-600">
                              <p>(A) Both Assertion and Reason are correct and Reason is the correct explanation.</p>
                              <p>(B) Both Assertion and Reason are correct but Reason is NOT the correct explanation.</p>
                              <p>(C) Assertion is correct but Reason is incorrect.</p>
                              <p>(D) Assertion is incorrect but Reason is correct.</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 text-xs font-bold border border-slate-200 px-2 py-1 rounded bg-slate-50 uppercase tracking-tighter">
                        {q.marks} Marks
                      </div>
                    </div>

                    {showAnswerKey && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="no-print mt-4 p-4 bg-brand-50 border-l-4 border-brand-500 rounded-r-lg space-y-2"
                      >
                        <div className="flex items-center gap-2 text-brand-700 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Correct Answer: {q.correctAnswer}
                        </div>
                        {q.explanation && (
                          <p className="text-xs text-slate-600 leading-relaxed pl-6">
                            <span className="font-bold text-slate-700">Explanation:</span> {q.explanation}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400 uppercase tracking-widest">
          End of Question Paper • Generated by EduPaper AI assistant
        </div>
      </div>

      {showAnswerKey && (
        <div className="print-container bg-white shadow-xl min-h-[11in] p-8 lg:p-16 border border-slate-200 rounded-2xl page-break-before-always">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 underline decoration-brand-500 underline-offset-8">Detailed Answer Key</h2>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{paper.title} - {paper.subject}</p>
          </div>

          <div className="space-y-6">
            {paper.sections.flatMap(s => s.questions).map((q, idx) => (
              <div key={idx} className="pb-4 border-b border-slate-100 last:border-0">
                <div className="flex items-start gap-4">
                  <span className="font-bold text-brand-600 shrink-0">Q{idx + 1}.</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900">Answer:</span>
                      <span className="px-2 py-0.5 bg-brand-600 text-white text-xs font-bold rounded">{q.correctAnswer}</span>
                    </div>
                    {q.explanation && (
                      <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-4 mt-2">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
