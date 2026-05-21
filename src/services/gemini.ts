import { GoogleGenAI, Type } from "@google/genai";
import { PaperConfig, QuestionPaper } from "../types";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const PAPER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    subject: { type: Type.STRING },
    board: { type: Type.STRING },
    grade: { type: Type.STRING },
    totalMarks: { type: Type.NUMBER },
    timeAllowed: { type: Type.STRING },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Only for MCQ. Include 4 options."
                },
                marks: { type: Type.NUMBER },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["id", "type", "question", "marks", "correctAnswer"]
            }
          }
        },
        required: ["title", "questions"]
      }
    }
  },
  required: ["id", "title", "subject", "board", "grade", "totalMarks", "sections"]
};

export async function generateQuestionPaper(config: PaperConfig): Promise<QuestionPaper> {
  const isCompetitive = config.examType === 'competitive';
  
  const prompt = `
    Generate a highly professional, accurate, and syllabus-aligned question paper with the following requirements:
    - Category: ${isCompetitive ? 'Competitive Entrance Exam Preparation' : 'Academic School/Board Exam'}
    - Subject: ${config.subject}
    - Board or Exam Spec: ${config.board}
    - Class / Grade Target: ${config.grade}
    - Total Marks: ${config.totalMarks}
    ${config.customTopic ? `- Specific Chapters / Custom Focus Topics: ${config.customTopic}` : ""}
    
    Question Distribution:
    ${config.questionDistribution.map(d => `- ${d.type}: ${d.count} questions, ${d.marksPerQuestion} marks each`).join("\n")}
    
    Board and Exam Alignments:
    1. For "Informatics Practices (IP - Code 065)" (CBSE Senior School): Focus heavily on Python Pandas (DataFrames, Series), NumPy, Data Visualization using Matplotlib, SQL Select queries (aggregate functions, GROUP BY, JOINs), and Societal Impacts.
    2. For "Computer Science (CS - Code 083)" (CBSE Senior School): Focus on Python basics, nested loops, list/dictionary comprehensions, functions, file handling (text, binary, CSV files), Stacks using lists, SQL queries, and Computer Networks protocols.
    3. For "Information Technology (IT - Code 402)" (CBSE Secondary): Focus on Employability Skills, Digital Documentation, Advanced Spreadsheets, DBMS basics, and Web Applications and Security.
    4. For "JEE Mains" and "JEE Advanced": Generate complex, conceptually deep, rigorous, and formula-backed multiple-choice or reasoning questions adhering to the NTA syllabus. Math should cover topics like calculus, vectors, coordinate geometry; Physics covers rotatory dynamics, thermo, electromagnetism; Chemistry covers organic mechanism, thermodynamics, equilibrium. General questions must include authentic option distractors.
    5. For "NEET": Generate questions perfectly aligned with the NCERT curriculum. Biology must focus on taxonomy, genetics, human/plant physiology, ecology; Physics and Chemistry must be NCERT-grounded medical entrance difficulty.
    
    Output Rules:
    - For Assertion & Reason questions: Provide both statements ("Assertion: ..." and "Reason: ...") in the main question field.
    - Total marks must count up to exactly ${config.totalMarks}.
    - Time allowed should be set realistically (e.g. "45 Mins", "1.5 Hours", "3 Hours") based on total marks and question counting.
    - Provide a complete Answer Key with precise answers and detailed, educational explanations that help teachers and students understand the logic.
    - Output strictly valid JSON conforming exactly to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: PAPER_SCHEMA,
        systemInstruction: "You are an elite educational researcher, school teacher, and expert question designer for CBSE school subjects (CS, IP, IT) and national-level competitive preps (JEE Mains, JEE Advanced, NEET). You generate incredibly high-quality, syllabus-accurate content to help teachers assess and prepare students."
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text) as QuestionPaper;
  } catch (error) {
    console.error("Error generating paper:", error);
    throw error;
  }
}
