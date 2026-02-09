import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getNextQuestion, generateFinalRoadmap } from '../../api/aiCareer';
import { handleApiError } from '../../utils/errorHandler';
import { AppState } from './aiCareerTypes';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { RoadmapView } from './components/RoadmapView';

const MAX_QUESTIONS = 6;

export default function AiCareer() {
  const [appState, setAppState] = useState(AppState.WELCOME);
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('To start, what is your current education level or job?');
  const [userInput, setUserInput] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const assistantCount = history.filter((h) => h.role === 'assistant').length;
  const questionCount = assistantCount + 1;

  const handleStart = () => {
    setAppState(AppState.QUESTIONNAIRE);
    setHistory([{ role: 'user', content: 'I am starting my career consultation. Please help me find a clear path.' }]);
    setCurrentQuestion('To start, what is your current education level or job?');
    setError(null);
  };

  const handleNext = async () => {
    if (!userInput.trim()) return;

    const assistantMessage = { role: 'assistant', content: currentQuestion };
    const newUserMessage = { role: 'user', content: userInput.trim() };
    const updatedHistory = [...history, assistantMessage, newUserMessage];
    setHistory(updatedHistory);
    setUserInput('');

    if (questionCount >= MAX_QUESTIONS) {
      handleFinalize(updatedHistory);
    } else {
      setAppState(AppState.THINKING);
      setError(null);
      try {
        const nextQ = await getNextQuestion(updatedHistory);
        setCurrentQuestion(nextQ);
        setAppState(AppState.QUESTIONNAIRE);
      } catch (err) {
        console.error(err);
        setError(handleApiError(err));
        toast.error(handleApiError(err));
        setAppState(AppState.QUESTIONNAIRE);
      }
    }
  };

  const handleFinalize = async (finalHistory) => {
    setAppState(AppState.THINKING);
    setError(null);
    try {
      const result = await generateFinalRoadmap(finalHistory);
      setRoadmap(result);
      setAppState(AppState.ROADMAP);
    } catch (err) {
      console.error(err);
      setError(handleApiError(err));
      toast.error(handleApiError(err));
      setAppState(AppState.QUESTIONNAIRE);
    }
  };

  useEffect(() => {
    if (appState === AppState.QUESTIONNAIRE && inputRef.current) {
      inputRef.current.focus();
    }
  }, [appState]);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 relative text-[var(--text-main)]">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      <header className="mb-12 text-center w-full max-w-4xl flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            AI Career Guidance
          </h1>
        </div>
        <p className="text-slate-400 text-sm md:text-base max-w-xl font-medium">
          by Telugu Info • Strategic Career Intelligence
        </p>
      </header>

      <main className="w-full max-w-3xl flex-grow flex flex-col">
        {appState === AppState.WELCOME && (
          <Card className="text-center my-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white">Your Future, Mapped Out.</h2>
              <p className="text-slate-400 leading-relaxed mb-10 text-lg">
                Answer {MAX_QUESTIONS} simple questions. Our AI will analyze your answers and build a step-by-step career plan.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-left">
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                  <div className="text-blue-400 font-bold mb-2">Education</div>
                  <p className="text-xs text-slate-500">Perfect for students after 10th or 12th grade.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                  <div className="text-purple-400 font-bold mb-2">Career</div>
                  <p className="text-xs text-slate-500">Find the right degree or professional path.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                  <div className="text-teal-400 font-bold mb-2">Growth</div>
                  <p className="text-xs text-slate-500">Step-by-step guides for long-term success.</p>
                </div>
              </div>
              <Button onClick={handleStart} className="w-full md:w-auto mx-auto text-xl px-16 py-5 rounded-2xl shadow-2xl shadow-blue-600/20">
                Start Consultation
              </Button>
            </div>
          </Card>
        )}

        {appState === AppState.QUESTIONNAIRE && (
          <Card className="relative overflow-hidden flex flex-col min-h-[450px]">
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Consultation Progress</span>
                  <span className="text-lg font-bold text-blue-400">Question {questionCount} of {MAX_QUESTIONS}</span>
                </div>
                <span className="text-xs font-bold text-slate-500">{Math.round((questionCount / MAX_QUESTIONS) * 100)}% Complete</span>
              </div>
              <div className="flex gap-2">
                {[...Array(MAX_QUESTIONS)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-grow rounded-full transition-all duration-500 ${
                      i + 1 < questionCount ? 'bg-blue-500' : i + 1 === questionCount ? 'bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8">{currentQuestion}</h3>
            <div className="mt-auto space-y-6">
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-32 bg-slate-900/60 border border-slate-700/80 rounded-2xl p-6 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none text-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-left">
                  <p className="text-xs text-slate-500 italic">Hint: Be as specific as you can for better results.</p>
                  {error && <p className="text-red-400 text-sm mt-1 font-semibold">{error}</p>}
                </div>
                <Button onClick={handleNext} disabled={!userInput.trim()} className="w-full sm:w-48 py-4 text-lg">
                  {questionCount === MAX_QUESTIONS ? 'Finish & Generate' : 'Continue'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {appState === AppState.THINKING && (
          <Card className="text-center py-24 flex flex-col items-center justify-center my-auto">
            <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 border-[6px] border-blue-500/10 rounded-full" />
              <div className="absolute inset-0 border-[6px] border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-4 bg-blue-500/5 rounded-full flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {questionCount >= MAX_QUESTIONS ? 'Creating Your Perfect Roadmap...' : 'Analyzing Your Profile...'}
            </h3>
            <p className="text-slate-400 text-lg max-w-sm">We are using your answers to find the best career steps.</p>
            <div className="flex justify-center gap-1 mt-4">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </Card>
        )}

        {appState === AppState.ROADMAP && roadmap && (
          <div className="w-full pb-20">
            <div className="flex justify-center mb-8">
              <Button onClick={handleStart} variant="outline" className="rounded-full px-10 py-3 text-sm font-bold border-slate-700 hover:border-white">
                Start New Consultation
              </Button>
            </div>
            <RoadmapView roadmap={roadmap} />
          </div>
        )}
      </main>

      <footer className="mt-auto py-10 text-slate-600 text-xs border-t border-slate-800/50 w-full flex justify-between items-center max-w-5xl px-4">
        <span>© {new Date().getFullYear()} Telugu Info • AI Career Guidance</span>
        <div className="flex gap-6">
          <span className="hover:text-slate-400 transition-colors">Academic Guidance</span>
          <span className="hover:text-slate-400 transition-colors">Career Pathing</span>
        </div>
      </footer>
    </div>
  );
}
