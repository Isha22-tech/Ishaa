import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="no-print bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">EduPaper AI</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Teacher's Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold rounded-full">
              <span>Created by</span>
              <span className="text-brand-900 font-extrabold">Isha Soni</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
