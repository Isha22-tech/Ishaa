import { useState } from "react";
import { Plus, Trash2, FileText, Settings2, Sparkles, BookOpen } from "lucide-react";
import { PaperConfig, QuestionType } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface PaperFormProps {
  onGenerate: (config: PaperConfig) => void;
  isLoading: boolean;
}

const BOARDS_ACADEMIC = ["CBSE", "ICSE", "State Board", "IB", "IGCSE"];
const BOARDS_COMPETITIVE = ["JEE Mains", "JEE Advanced", "NEET"];

const GRADES_ACADEMIC = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const GRADES_COMPETITIVE = ["Class 11", "Class 12", "Repeater / Dropper"];

export function PaperForm({ onGenerate, isLoading }: PaperFormProps) {
  const [config, setConfig] = useState<PaperConfig>({
    examType: "academic",
    subject: "Mathematics",
    board: "CBSE",
    grade: "Grade 10",
    totalMarks: 50,
    questionDistribution: [
      { type: QuestionType.MCQ, count: 10, marksPerQuestion: 1 },
      { type: QuestionType.SHORT_ANSWER, count: 5, marksPerQuestion: 4 },
      { type: QuestionType.LONG_ANSWER, count: 2, marksPerQuestion: 10 }
    ]
  });

  const getSubjects = (type: 'academic' | 'competitive', board: string) => {
    if (type === "competitive") {
      if (board === "NEET") {
        return ["Biology", "Physics", "Chemistry", "Full NEET Mock (PCB)"];
      }
      return ["Mathematics", "Physics", "Chemistry", "Full JEE Mock (PCM)"];
    }

    if (board === "CBSE") {
      return [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "History",
        "Geography",
        "Computer Science (CS - Code 083)",
        "Informatics Practices (IP - Code 065)",
        "Information Technology (IT - Code 402)"
      ];
    }

    return ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science"];
  };

  const handleExamTypeChange = (type: 'academic' | 'competitive') => {
    const isAcademic = type === 'academic';
    const defaultBoard = isAcademic ? "CBSE" : "JEE Mains";
    const defaultGrade = isAcademic ? "Grade 10" : "Class 12";
    const subjects = getSubjects(type, defaultBoard);
    const defaultSubject = subjects[0];

    const defaultDistribution = isAcademic 
      ? [
          { type: QuestionType.MCQ, count: 10, marksPerQuestion: 1 },
          { type: QuestionType.SHORT_ANSWER, count: 5, marksPerQuestion: 4 },
          { type: QuestionType.LONG_ANSWER, count: 2, marksPerQuestion: 10 }
        ]
      : [
          { type: QuestionType.MCQ, count: 15, marksPerQuestion: 4 },
          { type: QuestionType.ASSERTION_REASON, count: 5, marksPerQuestion: 4 }
        ];

    const total = defaultDistribution.reduce((acc, curr) => acc + (curr.count * curr.marksPerQuestion), 0);

    setConfig({
      examType: type,
      board: defaultBoard,
      grade: defaultGrade,
      subject: defaultSubject,
      totalMarks: total,
      questionDistribution: defaultDistribution,
      customTopic: ""
    });
  };

  const handleBoardChange = (board: string) => {
    const subjects = getSubjects(config.examType, board);
    setConfig(prev => ({
      ...prev,
      board,
      subject: subjects.includes(prev.subject) ? prev.subject : subjects[0]
    }));
  };

  const addDistribution = () => {
    setConfig(prev => ({
      ...prev,
      questionDistribution: [
        ...prev.questionDistribution,
        { type: QuestionType.MCQ, count: 5, marksPerQuestion: 1 }
      ]
    }));
  };

  const removeDistribution = (index: number) => {
    setConfig(prev => {
      const newDist = prev.questionDistribution.filter((_, i) => i !== index);
      const total = newDist.reduce((acc, curr) => acc + (curr.count * curr.marksPerQuestion), 0);
      return {
        ...prev,
        questionDistribution: newDist,
        totalMarks: total
      };
    });
  };

  const updateDistribution = (index: number, field: string, value: any) => {
    setConfig(prev => {
      const newDist = [...prev.questionDistribution];
      newDist[index] = { ...newDist[index], [field]: value };
      const total = newDist.reduce((acc, curr) => acc + (curr.count * curr.marksPerQuestion), 0);
      return {
        ...prev,
        questionDistribution: newDist,
        totalMarks: total
      };
    });
  };

  const calculatedSum = config.questionDistribution.reduce((acc, curr) => acc + (curr.count * curr.marksPerQuestion), 0);

  const handleTotalMarksChange = (val: number) => {
    setConfig(prev => ({
      ...prev,
      totalMarks: Math.max(1, val)
    }));
  };

  const handleSyncSections = () => {
    if (calculatedSum === 0) return;
    const scaleFactor = config.totalMarks / calculatedSum;
    setConfig(prev => {
      const adjustedDist = prev.questionDistribution.map(dist => {
        const newCount = Math.max(1, Math.round(dist.count * scaleFactor));
        return {
          ...dist,
          count: newCount
        };
      });
      return {
        ...prev,
        questionDistribution: adjustedDist
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(config);
  };

  const activeSubjects = getSubjects(config.examType, config.board);

  // Helper notice for CBSE CS/IT/IP stream options
  const showCbseNotice = config.examType === "academic" && config.board === "CBSE" && 
    ["Grade 9", "Grade 10", "Grade 11", "Grade 12"].includes(config.grade);

  return (
    <div className="card max-w-2xl mx-auto p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-brand-600" />
          <h2 className="text-xl font-bold text-slate-800">Paper Configuration</h2>
        </div>
        <BookOpen className="w-5 h-5 text-slate-400" />
      </div>

      {/* Segment controller for Academic vs Competitive */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => handleExamTypeChange('academic')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            config.examType === 'academic'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          School & Board Exams
        </button>
        <button
          type="button"
          onClick={() => handleExamTypeChange('competitive')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            config.examType === 'competitive'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          JEE & NEET Preparation
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              {config.examType === "academic" ? "Board" : "Target Exam"}
            </label>
            <select 
              className="input-field"
              value={config.board}
              onChange={(e) => handleBoardChange(e.target.value)}
            >
              {(config.examType === "academic" ? BOARDS_ACADEMIC : BOARDS_COMPETITIVE).map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Subject</label>
            <select 
              className="input-field animate-fade-in"
              value={config.subject}
              onChange={(e) => setConfig({ ...config, subject: e.target.value })}
            >
              {activeSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              {config.examType === "academic" ? "Grade" : "Target Class / Cohort"}
            </label>
            <select 
              className="input-field"
              value={config.grade}
              onChange={(e) => setConfig({ ...config, grade: e.target.value })}
            >
              {(config.examType === "academic" ? GRADES_ACADEMIC : GRADES_COMPETITIVE).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Total Marks</label>
            <div className="relative">
              <input 
                type="number" 
                min="1"
                className="input-field font-bold text-brand-700 pr-12 text-sm"
                value={config.totalMarks}
                onChange={(e) => handleTotalMarksChange(parseInt(e.target.value) || 0)}
              />
              <span className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 select-none">Marks</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {[20, 40, 50, 100, 150, 200, 300].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleTotalMarksChange(m)}
                  className={`px-2 py-0.5 text-[10px] font-black rounded border transition-all cursor-pointer ${
                    config.totalMarks === m
                      ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showCbseNotice && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-brand-50 border border-brand-200 text-brand-800 rounded-lg text-xs flex gap-2"
          >
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-brand-600" />
            <div>
              <span className="font-bold">CBSE Specialization:</span> We support Informatics Practices (IP - Code 065), Computer Science (CS - Code 083) for senior classes, and Information Technology (IT - Code 402) for high-school.
            </div>
          </motion.div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">
            {config.examType === "competitive" ? "Syllabus Chapters / Main Topics (Optional)" : "Custom Topics / Focus Areas (Optional)"}
          </label>
          <textarea 
            className="input-field min-h-[80px]"
            placeholder={config.examType === "competitive" ? "e.g. Electromagnetism, Mole Concept, Coordinate Geometry..." : "e.g. Focus on Algebra and Geometry basics, exclude Calculus..."}
            value={config.customTopic || ""}
            onChange={(e) => setConfig({ ...config, customTopic: e.target.value })}
          />
        </div>

        {calculatedSum !== config.totalMarks && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm space-y-2 font-medium"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-amber-700">
                <span className="font-extrabold uppercase bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded text-[10px] shrink-0">Mismatch</span>
                <span>Section totals ({calculatedSum} Marks) don't match paper target ({config.totalMarks} Marks).</span>
              </div>
              <button
                type="button"
                onClick={handleSyncSections}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-1 shrink-0 self-start sm:self-center"
              >
                Auto-Scale Sections
              </button>
            </div>
            <p className="text-[10px] text-amber-600 font-normal leading-relaxed italic">
              Note: If left unsynced, the AI generator will gracefully scale question quantities automatically to meet your exact requested {config.totalMarks}-mark target.
            </p>
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Question Distribution</h3>
            <button 
              type="button"
              onClick={addDistribution}
              className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Section
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {config.questionDistribution.map((dist, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-12 gap-3 items-end bg-slate-50 p-3 rounded-lg border border-slate-200"
                >
                  <div className="col-span-12 md:col-span-5 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Type</label>
                    <select 
                      className="input-field h-9 text-sm py-1"
                      value={dist.type}
                      onChange={(e) => updateDistribution(idx, "type", e.target.value as QuestionType)}
                    >
                      {Object.values(QuestionType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-span-5 md:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Count</label>
                    <input 
                      type="number" 
                      className="input-field h-9 text-sm py-1"
                      value={dist.count}
                      onChange={(e) => updateDistribution(idx, "count", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-5 md:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Marks/Q</label>
                    <input 
                      type="number" 
                      className="input-field h-9 text-sm py-1"
                      value={dist.marksPerQuestion}
                      onChange={(e) => updateDistribution(idx, "marksPerQuestion", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex justify-center">
                    <button 
                      type="button"
                      onClick={() => removeDistribution(idx)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      disabled={config.questionDistribution.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-primary w-full h-12 flex items-center justify-center gap-2 text-lg shadow-lg shadow-brand-500/20 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Paper...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Generate Question Paper
            </>
          )}
        </button>
      </form>
    </div>
  );
}
