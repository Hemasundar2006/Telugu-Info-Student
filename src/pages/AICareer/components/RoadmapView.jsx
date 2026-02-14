import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from './Card';

const COLORS = ['#0F766E', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

export function RoadmapView({ roadmap }) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const skillData = (roadmap.careerInsights.keySkills || []).map((skill, idx) => ({
    name: skill,
    value: 95 - idx * 8,
  }));

  const handlePrint = () => window.print();

  const phase = roadmap.phases[activePhaseIndex] || roadmap.phases[0];

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Overview Header */}
      <Card className="p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-10 md:p-14 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 select-none no-print">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest">Recommended Path</span>
              <button
                type="button"
                onClick={handlePrint}
                className="no-print flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm font-bold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print Roadmap
              </button>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">{roadmap.roleName}</h2>
            <p className="text-xl opacity-90 max-w-3xl leading-relaxed font-medium">
              This {roadmap.estimatedTotalTime} roadmap is tailored to your background and goals.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-slate-900/40">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </span>
              Market Insights
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-500 uppercase tracking-tighter font-bold mb-1 block">Potential Salary</span>
                <span className="font-bold text-2xl text-emerald-400">{roadmap.careerInsights?.salaryRange || '—'}</span>
              </div>
              <div className="flex justify-between items-center p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-500 uppercase tracking-tighter font-bold mb-1 block">Industry Demand</span>
                <span className="font-bold text-2xl text-teal-400">{roadmap.careerInsights?.demand || '—'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </span>
              Critical Competencies
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData} layout="vertical" margin={{ left: -10, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={110} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                    {skillData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>

      {/* Phase navigation + content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-4 mb-6">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Journey Steps</h3>
            <span className="text-[10px] font-bold px-2 py-1 bg-slate-800 rounded-md border border-slate-700">{roadmap.difficulty} Intensity</span>
          </div>
          <div className="relative pl-8 space-y-4 before:absolute before:left-[1.25rem] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-800">
            {(roadmap.phases || []).map((ph, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhaseIndex(idx)}
                className={`w-full text-left p-5 rounded-2xl border transition-all relative flex flex-col ${
                  activePhaseIndex === idx
                    ? 'border-teal-500 bg-teal-500/10 shadow-xl shadow-teal-500/10 ring-1 ring-teal-500/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                }`}
              >
                <div className={`absolute left-[-2.25rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 z-20 transition-all duration-300 ${activePhaseIndex === idx ? 'bg-teal-500 border-slate-900 scale-125' : 'bg-slate-700 border-slate-900'}`} />
                <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activePhaseIndex === idx ? 'text-teal-400' : 'text-slate-500'}`}>
                  Phase 0{idx + 1} • {ph.duration}
                </div>
                <div className={`font-bold text-lg leading-tight ${activePhaseIndex === idx ? 'text-white' : 'text-slate-400'}`}>
                  {ph.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          {phase && (
            <Card className="min-h-[400px] border-t-8 border-t-teal-500 p-10 md:p-14">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 text-xs font-bold tracking-widest uppercase">Stage Details</span>
                  <h3 className="text-3xl md:text-4xl font-black text-white">{phase.title}</h3>
                </div>
                <div className="px-5 py-2.5 bg-slate-800 rounded-2xl border border-slate-700 text-slate-300 text-sm font-bold flex items-center gap-3">
                  <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {phase.duration}
                </div>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed mb-12 font-medium">{phase.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <section>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">Core Focus Topics</h4>
                  <ul className="space-y-4">
                    {(phase.topics || []).map((topic, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-200 font-semibold">
                        <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-[10px]">{i + 1}</div>
                        <span className="text-lg leading-tight">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">Success Milestones</h4>
                  <ul className="space-y-4">
                    {(phase.milestones || []).map((milestone, i) => (
                      <li key={i} className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-100 flex gap-4 items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="font-semibold text-sm leading-snug">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <section className="mt-14 pt-10 border-t border-slate-800/80">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">Curated Resources</h4>
                <div className="flex flex-wrap gap-4">
                  {(phase.resources || []).map((resource, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(resource.name)}`, '_blank')}
                      className="px-6 py-3 rounded-2xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700 hover:border-teal-500/50 transition-all text-sm font-bold flex items-center gap-3 text-left"
                    >
                      <span className="text-slate-200">{resource.name}</span>
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </button>
                  ))}
                </div>
              </section>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
