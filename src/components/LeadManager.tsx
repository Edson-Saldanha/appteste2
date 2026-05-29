/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  Tag, 
  Flame, 
  FileText, 
  Check, 
  Copy, 
  MessageSquare, 
  Clock, 
  Activity, 
  Send,
  Trash2,
  X,
  Plus,
  Compass,
  CornerDownRight,
  ClipboardCheck,
  UserCheck
} from 'lucide-react';
import { useDb } from '../context/DbContext';
import { DbLead, LeadStatus, LeadTemperature, DbUser } from '../types';

export const LeadManager: React.FC = () => {
  const { 
    leads, 
    forms, 
    users, 
    questions, 
    leadAnswers, 
    leadTags, 
    leadNotes, 
    leadEvents,
    updateLeadStatus,
    updateLeadTemperature,
    assignLeadResponsible,
    addLeadNote,
    deleteLeadNote,
    addLeadTag,
    removeLeadTag,
    deleteLead,
    updateLeadDetails
  } = useDb();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [formFilter, setFormFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tempFilter, setTempFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('todo'); // 'todo', 'hoje', '7d', '30d'

  // Selected Lead modal state
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  // Note inputs
  const [newNoteText, setNewNoteText] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  
  // Copied states for feedback
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Memo selected lead details
  const activeLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return leads.find(l => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Answers matching selected lead
  const activeLeadAnswers = useMemo(() => {
    if (!selectedLeadId) return [];
    return leadAnswers.filter(a => a.lead_id === selectedLeadId);
  }, [leadAnswers, selectedLeadId]);

  // Notes matching selected lead
  const activeLeadNotes = useMemo(() => {
    if (!selectedLeadId) return [];
    return leadNotes
      .filter(n => n.lead_id === selectedLeadId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [leadNotes, selectedLeadId]);

  // Events/Logs matching selected lead
  const activeLeadEvents = useMemo(() => {
    if (!selectedLeadId) return [];
    return leadEvents
      .filter(e => e.lead_id === selectedLeadId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [leadEvents, selectedLeadId]);

  // Tags matching selected lead
  const activeLeadTags = useMemo(() => {
    if (!selectedLeadId) return [];
    return leadTags.filter(t => t.lead_id === selectedLeadId);
  }, [leadTags, selectedLeadId]);

  // Main Lead Filtering logic
  const filteredLeads = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = todayStart - 30 * 24 * 60 * 60 * 1000;

    return leads.filter(lead => {
      // Search Box scanning
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // Dropdowns
      if (formFilter && lead.form_id !== formFilter) return false;
      if (statusFilter && lead.status !== statusFilter) return false;
      if (tempFilter && lead.temperature !== tempFilter) return false;
      if (responsibleFilter && lead.responsible_user_id !== responsibleFilter) return false;
      
      // Tag filter mapping
      if (tagFilter) {
        const associatedTags = leadTags.filter(t => t.lead_id === lead.id).map(t => t.tag_name.toLowerCase());
        if (!associatedTags.includes(tagFilter.toLowerCase())) return false;
      }

      // Date ranges filters
      const leadTime = new Date(lead.created_at).getTime();
      if (dateFilter === 'hoje') {
        if (leadTime < todayStart) return false;
      } else if (dateFilter === '7d') {
        if (leadTime < sevenDaysAgo) return false;
      } else if (dateFilter === '30d') {
        if (leadTime < thirtyDaysAgo) return false;
      }

      return true;
    });
  }, [leads, leadTags, searchTerm, formFilter, statusFilter, tempFilter, tagFilter, responsibleFilter, dateFilter]);

  // Copier trigger
  const handleCopyPhone = (leadId: string, phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(leadId);
    setTimeout(() => {
      setCopiedPhoneId(null);
    }, 1200);
  };

  const handleCopySummary = (summaryText: string) => {
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => {
      setCopiedSummary(false);
    }, 1500);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead || !newNoteText.trim()) return;
    addLeadNote(activeLead.id, newNoteText.trim());
    setNewNoteText('');
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead || !newTagInput.trim()) return;
    addLeadTag(activeLead.id, newTagInput.trim());
    setNewTagInput('');
  };

  const getFormName = (formId: string) => {
    const f = forms.find(item => item.id === formId);
    return f ? f.name : 'Formulário';
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return 'Sem responsável';
    const u = users.find(item => item.id === userId);
    return u ? u.name : 'Sem responsável';
  };

  // Convert raw status to beautiful classes
  const statusColors: Record<LeadStatus, { text: string, bg: string, ring: string }> = {
    'Novo': { text: 'text-indigo-700 font-bold', bg: 'bg-indigo-50', ring: 'ring-indigo-150' },
    'Em atendimento': { text: 'text-sky-700 font-bold', bg: 'bg-sky-50', ring: 'ring-sky-150' },
    'Qualificado': { text: 'text-teal-700 font-bold', bg: 'bg-teal-50', ring: 'ring-teal-150' },
    'Agendado': { text: 'text-purple-700 font-bold', bg: 'bg-purple-50', ring: 'ring-purple-150' },
    'Comprou': { text: 'text-emerald-700 font-bold', bg: 'bg-emerald-50', ring: 'ring-emerald-150' },
    'Perdido': { text: 'text-rose-700 font-bold', bg: 'bg-rose-50', ring: 'ring-rose-150' },
    'Sem resposta': { text: 'text-slate-600 font-bold', bg: 'bg-slate-100/60', ring: 'ring-slate-200' }
  };

  const tempColors: Record<LeadTemperature, { text: string, bg: string, bar: string }> = {
    'Frio': { text: 'text-blue-700', bg: 'bg-blue-50/70', bar: 'bg-blue-500' },
    'Morno': { text: 'text-amber-700', bg: 'bg-amber-50/75', bar: 'bg-amber-500' },
    'Quente': { text: 'text-orange-700', bg: 'bg-orange-50', bar: 'bg-orange-500' },
    'Muito quente': { text: 'text-red-700 font-black', bg: 'bg-red-50/90 border border-red-100', bar: 'bg-red-600' }
  };

  return (
    <div className="space-y-6" id="lead-manager-root">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight">Gestão de Leads Capatados</h2>
        <p className="text-sm text-slate-500">Acompanhe respostas, qualifique faturamentos, agende reuniões e envie pitches assertivos via WhatsApp.</p>
      </div>

      {/* FILTER & SEARCH ACCORDION HEADER */}
      <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-xs space-y-4">
        {/* UPPER ROW: SEARCH AND QUICK DATE RANGE */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="inp-leads-search"
              type="text"
              placeholder="Buscar por nome, telefone ou e-mail..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 mr-2">Data de entrada:</span>
            <select
              id="select-leads-date-filter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-slate-200 p-2 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
            >
              <option value="todo">Todo o período</option>
              <option value="hoje">Hoje</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
          </div>
        </div>

        {/* DETAILED COLUMN SELECTORS GRID */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5 pt-3 border-t border-slate-100">
          {/* Form Source filter */}
          <div>
            <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Formulário de Origem</label>
            <select
              id="filt-form"
              className="w-full rounded-lg border border-slate-205 p-1.5 text-2xs text-slate-600 bg-white focus:outline-none"
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {forms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Status Funil</label>
            <select
              id="filt-status"
              className="w-full rounded-lg border border-slate-205 p-1.5 text-2xs text-slate-600 bg-white focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Novo">Novo</option>
              <option value="Em atendimento">Em atendimento</option>
              <option value="Qualificado">Qualificado</option>
              <option value="Agendado">Agendado</option>
              <option value="Comprou">Comprou</option>
              <option value="Perdido">Perdido</option>
              <option value="Sem resposta">Sem resposta</option>
            </select>
          </div>

          {/* Temperature filter */}
          <div>
            <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Temperatura</label>
            <select
              id="filt-temp"
              className="w-full rounded-lg border border-slate-205 p-1.5 text-2xs text-slate-600 bg-white focus:outline-none"
              value={tempFilter}
              onChange={(e) => setTempFilter(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Frio">Frio</option>
              <option value="Morno">Morno</option>
              <option value="Quente">Quente</option>
              <option value="Muito quente">Muito quente</option>
            </select>
          </div>

          {/* Tag filter selector */}
          <div>
            <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Tag de Interesse</label>
            <select
              id="filt-tag"
              className="w-full rounded-lg border border-slate-205 p-1.5 text-2xs text-slate-600 bg-white focus:outline-none"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="">Todas</option>
              {Array.from(new Set(leadTags.map(t => t.tag_name))).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Responsible selector */}
          <div>
            <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Responsável Interno</label>
            <select
              id="filt-responsible"
              className="w-full rounded-lg border border-slate-205 p-1.5 text-2xs text-slate-600 bg-white focus:outline-none"
              value={responsibleFilter}
              onChange={(e) => setResponsibleFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* LEADS LIST DATA TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-150 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs" id="leads-data-table">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-4xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">Lead / Nome</th>
                <th className="px-5 py-3">Canais de Contato</th>
                <th className="px-5 py-3">Formulário de Entrada</th>
                <th className="px-5 py-3">Data de Entrada</th>
                <th className="px-5 py-3">Temperatura</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Responsável</th>
                <th className="px-5 py-3">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 italic">
                    Nenhum lead encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const currentStatus = statusColors[lead.status] || statusColors['Novo'];
                  const currentTemp = tempColors[lead.temperature] || tempColors['Morno'];
                  const creationDate = new Date(lead.created_at);
                  const daysAgo = Math.round((Date.now() - creationDate.getTime()) / (3600 * 24 * 1000));
                  
                  // Query associated tags
                  const associatedTags = leadTags.filter(t => t.lead_id === lead.id);

                  return (
                    <tr 
                      key={lead.id}
                      id={`lead-row-${lead.id}`}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="group/row cursor-pointer hover:bg-slate-50/80 transition duration-150"
                    >
                      {/* Name Card */}
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <span className="font-display font-black text-slate-800 text-sm group-hover/row:text-indigo-600 transition leading-tight">
                            {lead.name}
                          </span>
                          <span className="font-mono text-4xs text-slate-400 mt-1 uppercase tracking-widest">
                            ID: {lead.id.toUpperCase()}
                          </span>
                        </div>
                      </td>

                      {/* Contact fields & Quick Copy controls */}
                      <td className="px-5 py-3 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-semibold">{lead.phone}</span>
                          <button
                            id={`btn-copy-ph-tbl-${lead.id}`}
                            onClick={(e) => handleCopyPhone(lead.id, lead.phone, e)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition"
                            title="Copiar telefone"
                          >
                            {copiedPhoneId === lead.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-3xs text-slate-400 font-mono">
                          <Mail className="h-3 w-3 inline text-slate-300" />
                          <span>{lead.email}</span>
                        </div>
                      </td>

                      {/* Form original matching name */}
                      <td className="px-5 py-3 text-slate-500 font-medium">
                        {getFormName(lead.form_id)}
                      </td>

                      {/* Created date representation */}
                      <td className="px-5 py-3 text-slate-500">
                        <div className="flex flex-col">
                          <span className="font-bold">{creationDate.toLocaleDateString('pt-BR')}</span>
                          <span className="text-3xs text-slate-400 font-mono mt-0.5">
                            {creationDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      {/* Temperature Heat Badge */}
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-4xs font-bold uppercase tracking-wider ${currentTemp.bg} ${currentTemp.text}`}>
                          <Flame className="h-3 w-3" />
                          <span>{lead.temperature}</span>
                        </span>
                      </td>

                      {/* Pipeline Status */}
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-4xs font-black uppercase tracking-widest ring-1 ${currentStatus.bg} ${currentStatus.text} ${currentStatus.ring}`}>
                          {lead.status}
                        </span>
                      </td>

                      {/* Assigned responsible */}
                      <td className="px-5 py-3 font-semibold text-slate-700">
                        {getUserName(lead.responsible_user_id)}
                      </td>

                      {/* Tags list */}
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {associatedTags.length === 0 ? (
                            <span className="text-4xs text-slate-350 font-medium font-mono">--</span>
                          ) : (
                            associatedTags.slice(0, 2).map(tag => (
                              <span key={tag.id} className="rounded-md bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 text-5xs font-bold uppercase">
                                {tag.tag_name}
                              </span>
                            ))
                          )}
                          {associatedTags.length > 2 && (
                            <span className="rounded-md bg-slate-150 text-slate-600 px-1 py-0.5 text-5xs font-black">
                              +{associatedTags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL SIDE DRAWER SHEET OR MODAL */}
      {selectedLeadId && activeLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn" id="lead-full-drawer">
          <div 
            className="absolute inset-0"
            onClick={() => {
              setSelectedLeadId(null);
              setNewTagInput('');
              setNewNoteText('');
            }}
          />
          
          {/* Main card panel body */}
          <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl animate-slideOver overflow-hidden">
            
            {/* Modal header details */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-slate-50">
              <div className="space-y-0.5">
                <span className="text-4xs font-mono font-bold text-indigo-600 uppercase tracking-widest leading-none">Perfil do Lead Acadêmico/Comercial</span>
                <h3 className="font-display text-lg font-black text-slate-800 tracking-tight leading-tight">{activeLead.name}</h3>
                <p className="text-5xs font-mono text-slate-400 mt-0.5">Criado em {new Date(activeLead.created_at).toLocaleString('pt-BR')}</p>
              </div>
              <button
                id="btn-close-lead-drawer"
                onClick={() => {
                  setSelectedLeadId(null);
                  setNewTagInput('');
                  setNewNoteText('');
                }}
                className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* UPPER QUICK CRM METADATA ACTION BAR */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
                
                {/* 1. Edit Status column */}
                <div>
                  <label className="text-4xs font-black uppercase tracking-wider text-slate-400 block mb-1">Mover Status Funil</label>
                  <select
                    id="inp-lead-edit-status"
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 bg-white"
                    value={activeLead.status}
                    onChange={(e) => updateLeadStatus(activeLead.id, e.target.value as LeadStatus)}
                  >
                    <option value="Novo">Novo</option>
                    <option value="Em atendimento">Em atendimento</option>
                    <option value="Qualificado">Qualificado</option>
                    <option value="Agendado">Agendado</option>
                    <option value="Comprou">Comprou (Fechado/Ganho)</option>
                    <option value="Perdido">Perdido (Sem orçamento/Opção)</option>
                    <option value="Sem resposta">Sem resposta</option>
                  </select>
                </div>

                {/* 2. Edit Temperature */}
                <div>
                  <label className="text-4xs font-black uppercase tracking-wider text-slate-400 block mb-1">Temperatura Lead</label>
                  <select
                    id="inp-lead-edit-temp"
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-750 focus:outline-none focus:border-indigo-500 bg-white"
                    value={activeLead.temperature}
                    onChange={(e) => updateLeadTemperature(activeLead.id, e.target.value as LeadTemperature)}
                  >
                    <option value="Frio">Frio</option>
                    <option value="Morno">Morno</option>
                    <option value="Quente">Quente</option>
                    <option value="Muito quente">Muito quente</option>
                  </select>
                </div>

                {/* 3. Assign Responsible user */}
                <div>
                  <label className="text-4xs font-black uppercase tracking-wider text-slate-400 block mb-1">Atribuir Responsável</label>
                  <div className="flex items-center gap-1.5">
                    <select
                      id="inp-lead-edit-responsible"
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 bg-white"
                      value={activeLead.responsible_user_id || ''}
                      onChange={(e) => assignLeadResponsible(activeLead.id, e.target.value || null)}
                    >
                      <option value="">Ninguém</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role.split(' ')[0]})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* AUTOMATIC ADVANCED INTENT SUMMARY BOX */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-5 relative">
                <div className="absolute top-3.5 right-4 flex items-center gap-1.5">
                  <button
                    id="btn-copy-summary"
                    onClick={() => handleCopySummary(activeLead.summary)}
                    className="text-4xs text-indigo-700 hover:text-indigo-955 font-bold flex items-center gap-1 bg-white border border-indigo-200 rounded px-2 py-0.5 shadow-2xs hover:shadow-xs transition"
                  >
                    {copiedSummary ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedSummary ? 'Copiado!' : 'Copiar Resumo'}</span>
                  </button>
                </div>

                <div className="flex gap-2 mb-2">
                  <Compass className="h-4 w-4 text-indigo-600 inline shrink-0 mt-0.5" />
                  <span className="text-4xs font-black uppercase tracking-wider text-indigo-805">IA / Resumo Automático Qualificado</span>
                </div>
                
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  "{activeLead.summary}"
                </p>
                <div className="mt-3 text-5xs font-mono text-slate-400 lowercase italic">
                  * Gerado dinamicamente no checklist de entrada com base nas regras de negócio e respostas enviadas.
                </div>
              </div>

              {/* INTEGRATED CONTACT COMMUNICATE TRIGGERS */}
              <div className="flex flex-wrap gap-3">
                {/* WhatsApp Link button */}
                <a
                  href={`https://wa.me/${activeLead.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition shadow shadow-emerald-600/10"
                >
                  <Phone className="h-4 w-4" />
                  <span>Chamar no WhatsApp Web</span>
                </a>

                {/* Email launch handler */}
                <a
                  href={`mailto:${activeLead.email}`}
                  className="flex items-center gap-2 rounded-xl border border-slate-250 p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span>Enviar E-mail Comercial</span>
                </a>

                {/* Quick Clipboard summary detail copy */}
                <button
                  id="btn-copy-all-lead-resumo"
                  onClick={() => {
                    const ansStr = activeLeadAnswers.map(ans => {
                      const matchedQ = questions.find(q => q.id === ans.question_id);
                      return `${matchedQ ? matchedQ.question_text : 'Pergunta'}: ${ans.answer_value}`;
                    }).join('\n');
                    const fullSummary = `DADOS DO LEAD\nNome: ${activeLead.name}\nWhatsapp: ${activeLead.phone}\nE-mail: ${activeLead.email}\nStatus: ${activeLead.status}\nTemperatura: ${activeLead.temperature}\n\nRESPOSTAS DO FORMULÁRIO\n${ansStr}`;
                    navigator.clipboard.writeText(fullSummary);
                    alert('Dossiê completo do lead copiado para a área de transferência!');
                  }}
                  className="flex items-center gap-2 rounded-xl border border-slate-250 p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <ClipboardCheck className="h-4 w-4 text-slate-500" />
                  <span>Copiar Ficha Completa</span>
                </button>
              </div>

              {/* QUESTIONNAIRE ANSWERS MAPPED WITH DETAILED QUESTION HEADERS */}
              <div className="rounded-xl border border-slate-150 p-5 space-y-4 bg-white shadow-2xs">
                <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100">
                  <FileText className="h-4.5 w-4.5 text-indigo-500" />
                  <h4 className="font-display font-bold text-slate-750 text-sm">Questionário / Respostas do Lead</h4>
                </div>

                <div className="space-y-4">
                  {activeLeadAnswers.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Nenhum dado estruturado de respostas registrado para este lead.</p>
                  ) : (
                    activeLeadAnswers.map((ans, index) => {
                      const matchingQ = questions.find(q => q.id === ans.question_id);
                      if (!matchingQ) return null;
                      return (
                        <div key={ans.id} className="grid grid-cols-1 md:grid-cols-12 gap-1 items-start text-xs border-b border-dashed border-slate-100 pb-3 last:border-0 last:pb-0">
                          <div className="md:col-span-4 font-bold text-slate-550 leading-tight">
                            <span className="text-slate-350 pr-1">{index + 1}.</span>
                            {matchingQ.question_text}
                          </div>
                          <div className="md:col-span-8 bg-slate-50/70 border border-slate-150 rounded-lg p-2 font-mono text-xs font-bold text-slate-800 leading-normal whitespace-pre-wrap select-all">
                            {ans.answer_value}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* TAGS MANAGER (MUTABLE) */}
              <div className="rounded-xl border border-slate-150 p-5 space-y-3 bg-white shadow-2xs">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Tag className="h-4 w-4 text-indigo-500" />
                  <h4 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider">Mapeamento de Tags do Lead</h4>
                </div>

                {/* Tags stack */}
                <div className="flex flex-wrap gap-1.5">
                  {activeLeadTags.length === 0 ? (
                    <span className="text-xs italic text-slate-400">Nenhuma tag de qualificação inserida ainda.</span>
                  ) : (
                    activeLeadTags.map(tag => (
                      <span key={tag.id} className="relative inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-2xs font-bold uppercase text-slate-600">
                        <span>{tag.tag_name}</span>
                        <button
                          id={`btn-del-tag-${tag.id}`}
                          onClick={() => removeLeadTag(activeLead.id, tag.tag_name)}
                          className="font-black text-slate-400 hover:text-red-500 p-0.5"
                          title="Remover tag"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Inline Tag Adder form */}
                <form onSubmit={handleAddTag} className="flex gap-2 pt-2">
                  <input
                    id="inp-lead-add-tag-name"
                    type="text"
                    placeholder="Adicionar nova tag (ex: Reunião-1)"
                    className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                  />
                  <button
                    id="btn-lead-tags-add"
                    type="submit"
                    className="flex items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* OBSERVATIONS INTERNAL NOTES MANAGER */}
              <div className="rounded-xl border border-slate-150 p-5 space-y-4 bg-white shadow-2xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <MessageSquare className="h-4.5 w-4.5 text-indigo-600" />
                  <h4 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider">Anotações / Observações Internas</h4>
                </div>

                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    id="inp-lead-note-text"
                    rows={2}
                    placeholder="Escreva um comentário ou notas de follow-up sobre o contato..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 shadow-3xs"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                  />
                  <button
                    id="btn-lead-note-submit"
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 text-xs font-bold transition self-end shadow-2xs"
                  >
                    <Send className="h-3 w-3" />
                    <span>Adicionar Observação</span>
                  </button>
                </form>

                {/* Notes historical listing */}
                <div className="space-y-3 pt-2">
                  {activeLeadNotes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-2">Sem observações. Escreva a primeira anotação acima.</p>
                  ) : (
                    activeLeadNotes.map((note) => {
                      const noteAuthor = users.find(u => u.id === note.user_id) || { name: 'Comercial' };
                      return (
                        <div key={note.id} className="rounded-xl border border-slate-150 bg-slate-50/50 p-3.5 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-3xs font-mono text-slate-400">
                            <span className="font-bold text-slate-650">{noteAuthor.name}</span>
                            <div className="flex items-center gap-2">
                              <span>{new Date(note.created_at).toLocaleString('pt-BR')}</span>
                              <button
                                id={`btn-del-note-${note.id}`}
                                onClick={() => deleteLeadNote(note.id)}
                                className="text-slate-350 hover:text-red-500"
                                title="Deletar anotação"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-slate-700 leading-normal font-medium">{note.note}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* LOGS EVENT LIST TIMELINE */}
              <div className="rounded-xl border border-slate-150 p-5 space-y-4 bg-white shadow-2xs">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Activity className="h-4.5 w-4.5 text-slate-600" />
                  <h4 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider mobile-line">Histórico de Eventos & Logs de Auditoria</h4>
                </div>

                <div className="space-y-3.5 relative pl-4 border-l border-slate-200">
                  {activeLeadEvents.length === 0 ? (
                    <p className="text-xs text-slate-405 italic">Nenhum evento registrado.</p>
                  ) : (
                    activeLeadEvents.map((act) => {
                      const eventTime = new Date(act.created_at);
                      return (
                        <div key={act.id} className="relative text-xs">
                          {/* Circle placement */}
                          <div className="absolute -left-5 top-1 h-2 w-2 rounded-full bg-slate-400 border-2 border-white ring-1 ring-slate-200" />
                          
                          <div className="text-3xs font-semibold text-slate-400">
                            {eventTime.toLocaleDateString('pt-BR')} às {eventTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>

                          <p className="font-bold text-slate-700 mt-0.5">
                            {act.event_type === 'novo_lead' && '✅ Cadastro de Lead'}
                            {act.event_type === 'status_change' && `🔄 Mudança de Status: "${act.old_value}" ➔ "${act.new_value}"`}
                            {act.event_type === 'temperature_change' && `🔥 Mudança de Temperatura: "${act.old_value}" ➔ "${act.new_value}"`}
                            {act.event_type === 'assigned' && `👤 Atribuição de Operador: "${act.old_value}" ➔ "${act.new_value}"`}
                            {act.event_type === 'tag_added' && `🏷️ Tag Adicionada: "${act.new_value}"`}
                            {act.event_type === 'tag_removed' && `🗑️ Tag Removida: "${act.old_value}"`}
                            {act.event_type === 'note_added' && '📝 Nota interna gravada'}
                          </p>
                          {(act.event_type === 'novo_lead') && (
                            <p className="text-3xs text-slate-500 mt-0.5 leading-normal">{act.new_value}</p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ACTION DELETE LEAD PERMANENT */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  id="btn-delete-lead-permanent"
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir PERMANENTEMENTE o lead "${activeLead.name}"? Esta ação é irreversível!`)) {
                      deleteLead(activeLead.id);
                      setSelectedLeadId(null);
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 text-red-650 hover:bg-red-50 p-2.5 text-xs font-bold transition"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Excluir Lead de Forma Irreversível</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
