/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  Flame, 
  User, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  Eye, 
  Tag, 
  DollarSign, 
  ChevronRight,
  Sparkles,
  Calendar,
  X
} from 'lucide-react';
import { useDb } from '../context/DbContext';
import { DbLead, LeadStatus, LeadTemperature, DbUser } from '../types';
import { LeadManager } from './LeadManager';

export const LeadKanban: React.FC = () => {
  const { 
    leads, 
    forms, 
    users, 
    leadTags,
    updateLeadStatus,
    assignLeadResponsible,
    addLeadNote
  } = useDb();

  // Drag state representing the lead ID currently being moved
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  
  // Quick observation dialog inside Kanban
  const [noteModalLead, setNoteModalLead] = useState<DbLead | null>(null);
  const [quickNoteText, setQuickNoteText] = useState('');

  // Local helper for column keys
  const COLUMNS: LeadStatus[] = [
    'Novo',
    'Em atendimento',
    'Qualificado',
    'Agendado',
    'Comprou',
    'Perdido',
    'Sem resposta'
  ];

  // Helper translations for Column Headers
  const columnSubtitles: Record<LeadStatus, string> = {
    'Novo': 'Espera inicial',
    'Em atendimento': 'Primeiro contato',
    'Qualificado': 'Perfil ideal',
    'Agendado': 'Call marcada',
    'Comprou': 'Ganho (Fechado)',
    'Perdido': 'Perdido',
    'Sem resposta': 'Follow-up pendente'
  };

  // Draggable Event Handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggingLeadId(leadId);
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // necessary to enable dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggingLeadId;
    if (leadId) {
      updateLeadStatus(leadId, targetStatus);
    }
    setDraggingLeadId(null);
  };

  // Calculate alert level based on last updated timestamp in milliseconds
  // Returns: 'normal' | 'warning' (>24h) | 'danger' (>48h)
  const getDelayTier = (updatedAtStr: string) => {
    const elapsedMs = Date.now() - new Date(updatedAtStr).getTime();
    const elapsedHours = elapsedMs / (3600 * 1000);
    
    if (elapsedHours >= 48) {
      return 'danger';
    } else if (elapsedHours >= 24) {
      return 'warning';
    }
    return 'normal';
  };

  const elapsedText = (updatedAtStr: string) => {
    const elapsedMs = Date.now() - new Date(updatedAtStr).getTime();
    const hours = Math.floor(elapsedMs / (3600 * 1000));
    if (hours < 1) return 'Há menos de 1h';
    if (hours < 24) return `Há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Há ${days} dias`;
  };

  const getFormName = (formId: string) => {
    const f = forms.find(item => item.id === formId);
    return f ? f.name : 'Formulário';
  };

  const handleQuickNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModalLead || !quickNoteText.trim()) return;
    addLeadNote(noteModalLead.id, quickNoteText.trim());
    setQuickNoteText('');
    setNoteModalLead(null);
  };

  // Temperature graphics
  const tempColors: Record<LeadTemperature, { text: string; bg: string; dot: string }> = {
    'Frio': { text: 'text-blue-700', bg: 'bg-blue-50/80', dot: 'bg-blue-500' },
    'Morno': { text: 'text-amber-700', bg: 'bg-amber-50/80', dot: 'bg-amber-500' },
    'Quente': { text: 'text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-500' },
    'Muito quente': { text: 'text-red-700 font-extrabold', bg: 'bg-red-50/90 border border-red-150', dot: 'bg-red-600' }
  };

  return (
    <div className="space-y-6" id="kanban-commercial-root">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight">Kanban de Atendimento</h2>
        <p className="text-sm text-slate-500">Arraste os cards para atualizar o status do lead no funil de vendas. Os tempos de ociosidade alertam para ações rápidas de follow-up.</p>
      </div>

      {/* PIPELINE COLUMNS horizontal scroll container */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start h-[calc(100vh-220px)] min-h-[500px]" id="kanban-board-scroll">
        {COLUMNS.map((col) => {
          // Filter leads matching this column status
          const colLeads = leads.filter(l => l.status === col);

          // Columns visual status colors
          const headerBorderColor: Record<LeadStatus, string> = {
            'Novo': 'border-l-indigo-500',
            'Em atendimento': 'border-l-sky-500',
            'Qualificado': 'border-l-teal-500',
            'Agendado': 'border-l-purple-500',
            'Comprou': 'border-l-emerald-500',
            'Perdido': 'border-l-rose-500',
            'Sem resposta': 'border-l-slate-400'
          };

          return (
            <div 
              key={col}
              id={`col-stage-${col}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col)}
              className="flex-1 min-w-[280px] max-w-[325px] flex flex-col max-h-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 h-full overflow-hidden"
            >
              {/* COLUMN HEADER */}
              <div className={`border-l-3 rounded-r-lg bg-white p-2.5 shadow-3xs flex items-center justify-between mb-4 ${headerBorderColor[col]}`}>
                <div>
                  <h3 className="font-bold text-slate-700 text-xs tracking-tight">{col}</h3>
                  <span className="text-5xs text-slate-455 font-semibold font-mono tracking-wide block leading-none mt-1 uppercase">{columnSubtitles[col]}</span>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-3xs font-mono font-bold text-slate-600 border border-slate-200/55">
                  {colLeads.length}
                </span>
              </div>

              {/* CARDS LIST CONTAINER */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                {colLeads.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center flex flex-col justify-center items-center h-full">
                    <span className="text-slate-350 text-5xs font-bold uppercase tracking-wider block">Solte leads aqui</span>
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const tier = getDelayTier(lead.updated_at);
                    const tagList = leadTags.filter(t => t.lead_id === lead.id);
                    const tempStyle = tempColors[lead.temperature] || tempColors['Morno'];

                    // Delay alerting card wrappers
                    const delayBorderClasses = 
                      tier === 'danger' ? 'border-red-300 bg-red-50/20 ring-1 ring-red-100 hover:border-red-400' :
                      tier === 'warning' ? 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-100 hover:border-amber-400' :
                      'border-slate-200 bg-white hover:border-slate-350 shadow-3xs';

                    return (
                      <div
                        key={lead.id}
                        id={`kanban-card-${lead.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className={`rounded-xl border p-3.5 transition-all duration-200 select-none cursor-grab active:cursor-grabbing relative ${delayBorderClasses}`}
                      >
                        {/* DELAY METRICS WARNING HEADER DISPLAY */}
                        {tier !== 'normal' && (
                          <div className={`flex items-center gap-1 text-[10px] font-bold mb-2 rounded px-1.5 py-0.5
                            ${tier === 'danger' ? 'text-red-700 bg-red-100/60' : 'text-amber-700 bg-amber-100/60'}
                          `}>
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            <span>Sem interação {elapsedText(lead.updated_at)}</span>
                          </div>
                        )}

                        {/* NAME */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-black text-slate-800 text-sm leading-tight uppercase tracking-tight text-left select-all">
                            {lead.name}
                          </h4>
                        </div>

                        {/* ORIGIN FORM FROM */}
                        <span className="text-5xs text-slate-400 font-bold block mt-1 uppercase leading-none truncate max-w-[200px]">
                          {getFormName(lead.form_id)}
                        </span>

                        {/* HEAT BADGE + MAIN TAG */}
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-5xs font-bold uppercase tracking-wider ${tempStyle.bg} ${tempStyle.text}`}>
                            <Flame className="h-2.5 w-2.5 inline" />
                            <span>{lead.temperature}</span>
                          </span>

                          {tagList.slice(0, 1).map(t => (
                            <span key={t.id} className="rounded bg-slate-50 border border-slate-150 px-1 py-0.5 text-5xs font-bold uppercase text-slate-500">
                              {t.tag_name}
                            </span>
                          ))}
                        </div>

                        {/* ELAPSED STABLE CHRONO INDICATOR */}
                        <div className="mt-3.5 border-t border-slate-100 pt-2 flex items-center justify-between text-4xs font-mono text-slate-400">
                          <div className="flex items-center gap-1 font-semibold text-slate-600">
                            <Calendar className="h-3.5 w-3.5 text-slate-350" />
                            <span>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 font-semibold text-slate-400">
                            <Clock className="h-3.5 w-3.5 text-slate-300" />
                            <span>{elapsedText(lead.updated_at)}</span>
                          </div>
                        </div>

                        {/* QUICK CRM PICKERS */}
                        <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                          {/* WhatsApp icon helper directly */}
                          <a
                            href={`https://wa.me/${lead.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Conversar no WhatsApp"
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>

                          {/* Quick Add Note dialog trigger */}
                          <button
                            id={`btn-kb-note-${lead.id}`}
                            onClick={(e) => { e.stopPropagation(); setNoteModalLead(lead); }}
                            title="Escrever observação rápida"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </button>

                          {/* Operator Selector quick access dropdown */}
                          <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                            <select
                              id={`select-kb-auth-${lead.id}`}
                              className="w-full text-4xs font-bold text-slate-600 border border-slate-200 rounded p-1 bg-white focus:outline-none"
                              value={lead.responsible_user_id || ''}
                              onChange={(e) => assignLeadResponsible(lead.id, e.target.value || null)}
                            >
                              <option value="">Ninguém</option>
                              {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name.split(' ')[0]}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* QUICK INLINE COMMENT OBSERVATION OVERLAY DIALOG */}
      {noteModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-150 bg-white p-5 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-slate-750 text-sm">Anotação Rápida: {noteModalLead.name}</h3>
              <button
                onClick={() => { setNoteModalLead(null); setQuickNoteText(''); }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleQuickNoteSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Observações Internas comercial</label>
                <textarea
                  id="inp-kb-note-desc"
                  rows={3}
                  placeholder="Descreva detalhes obtidos na chamada ou follow-up comercial..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                  value={quickNoteText}
                  onChange={(e) => setQuickNoteText(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setNoteModalLead(null); setQuickNoteText(''); }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  id="btn-kb-note-submit"
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold transition shadow-md shadow-indigo-600/10"
                >
                  Salvar Comentário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
