/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Layout, 
  Palette, 
  Eye, 
  FileCode, 
  Settings, 
  Layers, 
  FolderPlus, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal,
  FolderLock
} from 'lucide-react';
import { useDb } from '../context/DbContext';
import { DbForm, DbFormQuestion, QuestionFieldType, FormStatus } from '../types';

interface FormCreatorProps {
  onTestForm: (formId: string) => void;
}

export const FormCreator: React.FC<FormCreatorProps> = ({ onTestForm }) => {
  const { 
    forms, 
    createForm, 
    updateForm, 
    deleteForm, 
    questions, 
    addQuestion, 
    updateQuestion, 
    deleteQuestion, 
    duplicateQuestion,
    questionOptions,
    addQuestionOption,
    deleteQuestionOption,
    updateQuestionOption
  } = useDb();

  const [selectedFormId, setSelectedFormId] = useState<string>(() => {
    return forms[0]?.id || '';
  });

  // Highlight and focus modes
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Selector for current form
  const currentForm = useMemo(() => {
    return forms.find(f => f.id === selectedFormId) || forms[0];
  }, [forms, selectedFormId]);

  // Keep selected ID in sync if form disappears
  useEffect(() => {
    if (currentForm && currentForm.id !== selectedFormId) {
      setSelectedFormId(currentForm.id);
    }
  }, [currentForm, selectedFormId]);

  // Get ordered questions for the selected form
  const formQuestions = useMemo(() => {
    if (!currentForm) return [];
    return questions
      .filter(q => q.form_id === currentForm.id)
      .sort((a, b) => a.order_index - b.order_index);
  }, [questions, currentForm]);

  // Handle Form creation
  const handleAddNewForm = () => {
    const newForm = createForm({
      name: 'Novo Formulário Inteligente ' + (forms.length + 1),
      description: 'Preencha dados para qualificação comercial imediata.',
      status: 'rascunho',
      logo_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=256&auto=format&fit=crop',
      primary_color: '#4f46e5',
      secondary_color: '#1e293b',
      button_text: 'Enviar meus dados',
      initial_message: 'Por favor, responda de forma sincera a este breve questionário.',
      final_message: 'Recebemos as suas respostas com sucesso! Em breve entraremos em contato.',
      public_slug: 'formulario-novo-' + Math.random().toString(36).substring(2, 6)
    });
    
    // Add default questions
    const q1 = addQuestion({
      form_id: newForm.id,
      question_text: 'Qual seu nome?',
      question_description: 'Digite seu nome completo',
      field_type: 'texto_curto',
      is_required: true,
      order_index: 0
    });

    addQuestion({
      form_id: newForm.id,
      question_text: 'Qual seu WhatsApp?',
      question_description: 'Com o código de área (DDD)',
      field_type: 'telefone',
      is_required: true,
      order_index: 1
    });

    setSelectedFormId(newForm.id);
    setEditingQuestionId(null);
  };

  const handleCopyLink = (slug: string) => {
    const fullMockUrl = `https://leadflow.ai/p/${slug}`;
    navigator.clipboard.writeText(fullMockUrl);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 1800);
  };

  // Add individual custom questions
  const handleAddQuestionToForm = () => {
    if (!currentForm) return;
    const nextOrderIdx = formQuestions.length;
    const newQ = addQuestion({
      form_id: currentForm.id,
      question_text: 'Pergunta nova ' + (nextOrderIdx + 1),
      question_description: 'Apoio opcional para o lead no preenchimento',
      field_type: 'texto_curto',
      is_required: false,
      order_index: nextOrderIdx
    });
    setEditingQuestionId(newQ.id);
  };

  // Move indices
  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (!currentForm) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formQuestions.length) return;

    const currentQ = formQuestions[index];
    const siblingQ = formQuestions[targetIdx];

    updateQuestion(currentQ.id, { order_index: siblingQ.order_index });
    updateQuestion(siblingQ.id, { order_index: currentQ.order_index });
  };

  // Field type options translator
  const translateFieldType = (type: QuestionFieldType) => {
    const types: Record<QuestionFieldType, string> = {
      'texto_curto': 'Texto curto',
      'texto_longo': 'Texto longo / Parágrafo',
      'telefone': 'Telefone / WhatsApp',
      'email': 'E-mail',
      'numero': 'Número',
      'escolha_unica': 'Múltipla escolha (Única)',
      'multipla_escolha': 'Seleção (Caixa de seleção)',
      'caixa_selecao': 'Aceite de Termos (Checkbox único)',
      'data': 'Data'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6" id="form-creator-root">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight">Criador de Formulários</h2>
          <p className="text-sm text-slate-500">Adicione perguntas, estilize cores da marca e configure a experiência pública do lead.</p>
        </div>
        
        <button
          id="btn-add-form"
          onClick={handleAddNewForm}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 transition duration-150 self-start"
        >
          <FolderPlus className="h-4.5 w-4.5" />
          <span>Novo Formulário</span>
        </button>
      </div>

      {currentForm ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* COLUMN 1: FORMS LIST & DESIGN DECORATORS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SELECTOR & BASIC DETAILS CARD */}
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                <FileCode className="h-4.5 w-4.5 text-indigo-600" />
                <h3 className="font-display font-bold text-slate-700">Formulário Ativo</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Selecionar Formulário</label>
                  <select
                    id="select-active-form"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-700 bg-slate-50 shadow-xs focus:outline-none focus:border-indigo-500"
                    value={selectedFormId}
                    onChange={(e) => {
                      setSelectedFormId(e.target.value);
                      setEditingQuestionId(null);
                    }}
                  >
                    {forms.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} {f.status === 'rascunho' ? '(Rascunho)' : f.status === 'pausado' ? '(Pausado)' : '(Ativo)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    id="btn-test-form-public"
                    onClick={() => onTestForm(currentForm.id)}
                    className="flex justify-center items-center gap-1.5 rounded-xl border border-slate-250 p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Testar Tela</span>
                  </button>

                  <button
                    id="btn-delete-active-form"
                    onClick={() => {
                      if (forms.length <= 1) {
                        alert('Você precisa ter pelo menos 1 formulário configurado no MVP.');
                        return;
                      }
                      if (window.confirm(`Excluir formulário "${currentForm.name}"? Isso removerá permanentemente as perguntas, regras condicionais e histórico de leads vinculados!`)) {
                        deleteForm(currentForm.id);
                      }
                    }}
                    className="flex justify-center items-center gap-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 p-2.5 text-xs font-bold transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>

            {/* FORM META CONFIGURATION CARD */}
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-indigo-50">
                <Settings className="h-4.5 w-4.5 text-indigo-500" />
                <h3 className="font-display font-bold text-slate-700">Configurações Gerais</h3>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Nome do Formulário</label>
                  <input
                    id="inp-form-name"
                    type="text"
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 shadow-xs"
                    value={currentForm.name}
                    onChange={(e) => updateForm(currentForm.id, { name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Descrição Comercial</label>
                  <textarea
                    id="inp-form-desc"
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-600 focus:outline-none focus:border-indigo-500 shadow-xs"
                    value={currentForm.description}
                    onChange={(e) => updateForm(currentForm.id, { description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Status</label>
                    <select
                      id="inp-form-status"
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 bg-white"
                      value={currentForm.status}
                      onChange={(e) => updateForm(currentForm.id, { status: e.target.value as FormStatus })}
                    >
                      <option value="ativo">Ativo</option>
                      <option value="pausado">Pausado</option>
                      <option value="rascunho">Rascunho</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Slug do Link</label>
                    <input
                      id="inp-form-slug"
                      type="text"
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono font-bold text-slate-700 focus:outline-none focus:border-indigo-500 shadow-xs"
                      value={currentForm.public_slug}
                      onChange={(e) => updateForm(currentForm.id, { public_slug: e.target.value.replace(/\s+/g, '-') })}
                    />
                  </div>
                </div>

                {/* COPY AND DEMO LINKS */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-4xs font-mono text-slate-400 select-all truncate max-w-[180px]">
                      leadflow.ai/p/{currentForm.public_slug}
                    </span>
                    <button
                      id="btn-copy-link"
                      onClick={() => handleCopyLink(currentForm.public_slug)}
                      className="text-4xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-2xs hover:shadow-xs"
                    >
                      {copiedLink ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                {/* BRAND STYLING INTEGRATION */}
                <div className="border-t border-slate-100 pt-3 space-y-3">
                  <div className="flex items-center gap-1 px-1">
                    <Palette className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="text-3xs font-black uppercase tracking-wider text-slate-500">Design & Cores</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Cor Primária</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          id="inp-form-color1"
                          type="color"
                          className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 cursor-pointer"
                          value={currentForm.primary_color}
                          onChange={(e) => updateForm(currentForm.id, { primary_color: e.target.value })}
                        />
                        <span className="font-mono text-xs text-slate-600 font-bold">{currentForm.primary_color}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Cor Secundária</label>
                      <div className="flex gap-1.5 items-center">
                        <input
                          id="inp-form-color2"
                          type="color"
                          className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 cursor-pointer"
                          value={currentForm.secondary_color}
                          onChange={(e) => updateForm(currentForm.id, { secondary_color: e.target.value })}
                        />
                        <span className="font-mono text-xs text-slate-600 font-bold">{currentForm.secondary_color}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">URL da Logo (Avatar/Ícone)</label>
                    <input
                      id="inp-form-logo"
                      type="text"
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-600 focus:outline-none focus:border-indigo-500 shadow-xs"
                      value={currentForm.logo_url}
                      onChange={(e) => updateForm(currentForm.id, { logo_url: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Texto do Botão Submit</label>
                    <input
                      id="inp-form-btn-text"
                      type="text"
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-indigo-500 shadow-xs"
                      value={currentForm.button_text}
                      onChange={(e) => updateForm(currentForm.id, { button_text: e.target.value })}
                    />
                  </div>
                </div>

                {/* MESSAGES CONFIG */}
                <div className="border-t border-slate-100 pt-3 space-y-3">
                  <div>
                    <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Mensagem Inicial (Header)</label>
                    <textarea
                      id="inp-form-initial-msg"
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-650 focus:outline-none focus:border-indigo-500 shadow-xs"
                      value={currentForm.initial_message}
                      onChange={(e) => updateForm(currentForm.id, { initial_message: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Mensagem Final (Sucesso/Agradecimento)</label>
                    <textarea
                      id="inp-form-final-msg"
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-650 focus:outline-none focus:border-indigo-500 shadow-xs"
                      value={currentForm.final_message}
                      onChange={(e) => updateForm(currentForm.id, { final_message: e.target.value })}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* COLUMN 2: QUESTIONS LIST MANAGER */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Layout className="h-4.5 w-4.5 text-indigo-600" />
                  <h3 className="font-display font-bold text-slate-700">Estruturação de Perguntas</h3>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-2xs font-mono font-bold text-slate-500">
                  {formQuestions.length} {formQuestions.length === 1 ? 'campo' : 'campos'}
                </span>
              </div>

              {/* QUESTIONS ITERABLE CARDS */}
              {formQuestions.length === 0 ? (
                <div className="text-center py-10">
                  <FileCode className="h-10 w-10 text-slate-300 mx-auto" strokeWidth={1} />
                  <p className="text-xs text-slate-400 mt-2 font-medium">Nenhuma pergunta cadastrada para este formulário.</p>
                  <button
                    id="btn-add-initial-q"
                    onClick={handleAddQuestionToForm}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-indigo-500 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Adicionar Primeira</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                  {formQuestions.map((q, idx) => {
                    const isExpanded = editingQuestionId === q.id;
                    const questionOptionsList = questionOptions.filter(o => o.question_id === q.id);

                    return (
                      <div 
                        key={q.id} 
                        className={`
                          rounded-xl border transition-all duration-200 p-4 relative bg-white
                          ${isExpanded 
                            ? 'border-indigo-500 shadow-md ring-1 ring-indigo-50/50 font-semibold' 
                            : 'border-slate-200 hover:border-slate-350 shadow-2xs'}
                        `}
                      >
                        {/* CARD CODES / CHEVRON TOP HEADER */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            {/* Drag handle or simple reorder controls */}
                            <div className="flex flex-col gap-1 pr-1">
                              <button
                                id={`btn-move-up-${q.id}`}
                                disabled={idx === 0}
                                onClick={(e) => { e.stopPropagation(); handleMoveQuestion(idx, 'up'); }}
                                className="p-0.5 rounded text-slate-350 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                id={`btn-move-down-${q.id}`}
                                disabled={idx === formQuestions.length - 1}
                                onClick={(e) => { e.stopPropagation(); handleMoveQuestion(idx, 'down'); }}
                                className="p-0.5 rounded text-slate-350 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </div>

                            <div 
                              className="cursor-pointer"
                              onClick={() => setEditingQuestionId(isExpanded ? null : q.id)}
                            >
                              <p className="text-xs font-bold text-slate-700 mb-0.5 max-w-[200px] truncate leading-tight">
                                {q.question_text || '(Instrução em branco)'}
                              </p>
                              <span className="inline-flex items-center gap-1 text-4xs font-semibold uppercase tracking-wider text-slate-400">
                                <span className="font-mono bg-slate-100 rounded px-1.5 py-0.5">{translateFieldType(q.field_type)}</span>
                                {q.is_required && <span className="text-xs text-red-500 font-bold font-serif">* Obrigatório</span>}
                              </span>
                            </div>
                          </div>

                          {/* Action controls */}
                          <div className="flex items-center gap-1">
                            <button
                              id={`btn-dup-q-${q.id}`}
                              onClick={() => duplicateQuestion(q.id)}
                              title="Duplicar pergunta"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>

                            <button
                              id={`btn-del-q-${q.id}`}
                              onClick={() => {
                                if (window.confirm(`Excluir pergunta "${q.question_text}"? Isso removerá as opções e as regras condicionais associadas.`)) {
                                  deleteQuestion(q.id);
                                }
                              }}
                              className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              id={`btn-toggle-expand-q-${q.id}`}
                              onClick={() => setEditingQuestionId(isExpanded ? null : q.id)}
                              className="text-2xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 select-none"
                            >
                              {isExpanded ? 'Recolher' : 'Editar'}
                            </button>
                          </div>
                        </div>

                        {/* EXPANDED DETAILED EDITOR PANEL */}
                        {isExpanded && (
                          <div className="mt-4 border-t border-slate-100 pt-3 space-y-3.5 animate-fadeIn">
                            {/* TITLE TEXT */}
                            <div>
                              <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Texto da Pergunta</label>
                              <input
                                id={`inp-q-text-${q.id}`}
                                type="text"
                                className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                                value={q.question_text}
                                onChange={(e) => updateQuestion(q.id, { question_text: e.target.value })}
                              />
                            </div>

                            {/* DESCRIPTION FIELD */}
                            <div>
                              <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Mensagem de Apoio / Placeholder</label>
                              <input
                                id={`inp-q-desc-${q.id}`}
                                type="text"
                                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-500 focus:outline-none focus:border-indigo-500"
                                value={q.question_description}
                                onChange={(e) => updateQuestion(q.id, { question_description: e.target.value })}
                              />
                            </div>

                            {/* TYPE & REQUIRED IN SAME ROW */}
                            <div className="grid grid-cols-2 gap-3 item-center">
                              <div>
                                <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Tipo de Entrada</label>
                                <select
                                  id={`inp-q-type-${q.id}`}
                                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 bg-white"
                                  value={q.field_type}
                                  onChange={(e) => {
                                    updateQuestion(q.id, { field_type: e.target.value as QuestionFieldType });
                                  }}
                                >
                                  <option value="texto_curto">Texto curto</option>
                                  <option value="texto_longo">Texto longo / Parágrafo</option>
                                  <option value="telefone">Telefone / WhatsApp</option>
                                  <option value="email">E-mail</option>
                                  <option value="numero">Número</option>
                                  <option value="escolha_unica">Escolha única (Rádio/Select)</option>
                                  <option value="multipla_escolha">Múltiplas opções (Checkboxes)</option>
                                  <option value="data">Data</option>
                                  <option value="caixa_selecao">Aceite de Termo único</option>
                                </select>
                              </div>

                              <div className="flex items-center mt-4">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    id={`inp-q-req-${q.id}`}
                                    type="checkbox"
                                    className="h-4 w-4 rounded text-indigo-600 border-slate-200 focus:ring-indigo-500"
                                    checked={q.is_required}
                                    onChange={(e) => updateQuestion(q.id, { is_required: e.target.checked })}
                                  />
                                  <span className="text-xs font-semibold text-slate-600">Campo Obrigatório</span>
                                </label>
                              </div>
                            </div>

                            {/* INLINE OPTIONS EDITOR (Only for Choice Types) */}
                            {('escolha_unica' === q.field_type || 'multipla_escolha' === q.field_type) && (
                              <div className="bg-slate-55 rounded-xl p-3 border border-slate-150 space-y-2">
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                                  <span className="text-3xs font-black uppercase tracking-wider text-slate-500">Opções de Resposta</span>
                                  <button
                                    id={`btn-add-opt-${q.id}`}
                                    onClick={() => {
                                      addQuestionOption({
                                        question_id: q.id,
                                        option_text: 'Nova opção ' + (questionOptionsList.length + 1),
                                        order_index: questionOptionsList.length
                                      });
                                    }}
                                    className="text-4xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1.5"
                                  >
                                    <Plus className="h-3 w-3" />
                                    <span>Adicionar Opção</span>
                                  </button>
                                </div>

                                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                  {questionOptionsList.length === 0 ? (
                                    <p className="text-4xs text-slate-400 italic">Nenhuma opção criada. Adicione uma para que as respostas possam aparecer no formulário.</p>
                                  ) : (
                                    questionOptionsList.map((opt) => (
                                      <div key={opt.id} className="flex items-center gap-2">
                                        <input
                                          id={`inp-opt-text-${opt.id}`}
                                          type="text"
                                          className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                                          value={opt.option_text}
                                          onChange={(e) => updateQuestionOption(opt.id, e.target.value)}
                                        />
                                        <button
                                          id={`btn-del-opt-${opt.id}`}
                                          onClick={() => deleteQuestionOption(opt.id)}
                                          className="text-slate-450 hover:text-red-500 p-1"
                                          title="Deletar opção"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CARD FOOTER SUB-ADDER */}
              {formQuestions.length > 0 && (
                <button
                  id="btn-add-question-bottom"
                  onClick={handleAddQuestionToForm}
                  className="mt-4 flex w-full justify-center items-center gap-1.5 rounded-xl border border-dashed border-slate-300 p-3 text-xs font-bold text-slate-650 hover:text-indigo-600 hover:bg-indigo-50/20 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4 animate-pulse text-indigo-600" />
                  <span>Adicionar Pergunta</span>
                </button>
              )}

            </div>
          </div>

          {/* COLUMN 3: REAL-TIME SIMULATOR DEVICE PREVIEW FRAME */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-150 bg-white p-4 shadow-xs flex flex-col items-center">
              <div className="flex items-center gap-1.5 pb-2 mb-3 border-b border-slate-100 w-full">
                <Smartphone className="h-4 w-4 text-indigo-600" />
                <h3 className="font-display font-black text-slate-700 text-xs uppercase tracking-wider">Device Real-Time Mock</h3>
              </div>

              {/* PHONE DEVICE BODY MOCK */}
              <div id="visual-phone-mock" className="w-full max-w-[260px] aspect-[9/18] rounded-3xl border-6 border-slate-800 bg-slate-100 shadow-xl overflow-hidden relative flex flex-col">
                
                {/* Speaker pill */}
                <div className="absolute top-1 right-1/2 translate-x-1/2 w-14 h-3 bg-slate-800 rounded-full z-20 flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-slate-600 rounded-full" />
                </div>

                {/* Device container inner */}
                <div className="flex-1 overflow-y-auto p-4 pt-6 text-3xs font-sans bg-slate-20 pointer-events-none relative flex flex-col justify-between">
                  <div>
                    {/* Brand header */}
                    <div className="flex flex-col items-center gap-2 pt-2 pb-3 text-center">
                      <img 
                        referrerPolicy="no-referrer"
                        src={currentForm.logo_url} 
                        alt="Logo" 
                        className="h-8 w-8 rounded-full border border-slate-200 object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=128&auto=format&fit=crop";
                        }}
                      />
                      <h4 className="font-display font-bold text-slate-800 leading-tight tracking-tight text-xs">
                        {currentForm.name || 'Nome do formulário'}
                      </h4>
                      <p className="text-slate-400 font-medium leading-normal text-4xs">
                        {currentForm.initial_message || 'Mensagem inicial do formulário'}
                      </p>
                    </div>

                    {/* Sim questions */}
                    <div className="space-y-2.5">
                      {formQuestions.slice(0, 3).map((q) => {
                        const options = questionOptions.filter(o => o.question_id === q.id);
                        return (
                          <div key={q.id} className="space-y-1">
                            <label className="font-bold text-slate-700 flex items-center gap-0.5">
                              {q.question_text || 'Qual a pergunta?'}
                              {q.is_required && <span className="text-red-500">*</span>}
                            </label>
                            
                            {/* Inputs switch representation */}
                            {q.field_type === 'texto_longo' ? (
                              <div className="w-full h-8 rounded border border-slate-200 bg-white" />
                            ) : q.field_type === 'escolha_unica' ? (
                              <div className="space-y-1">
                                {options.slice(0, 2).map((o, oidx) => (
                                  <div key={oidx} className="flex items-center gap-1">
                                    <div className="h-2.5 w-2.5 rounded-full border border-slate-350 bg-white" />
                                    <span className="text-slate-500 text-4xs">{o.option_text}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="w-full h-5.5 rounded border border-slate-200 bg-white flex items-center px-1.5 text-slate-400 select-none">
                                {q.question_description || '...'}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {formQuestions.length > 3 && (
                        <p className="text-slate-400 italic text-center pt-1 leading-none text-4xs">+ {formQuestions.length - 3} campos ocultados no preview</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button representation styled with BRAND color */}
                  <div className="pt-4 mt-auto">
                    <div 
                      className="w-full rounded-lg text-white font-bold py-2.5 shadow-sm flex items-center justify-center transition"
                      style={{ 
                        backgroundColor: currentForm.primary_color || '#ff4500' 
                      }}
                    >
                      {currentForm.button_text || 'Enviar'}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white border rounded-2xl p-10 text-center">
          <FolderLock className="h-10 w-10 text-slate-400 mx-auto" />
          <p className="text-slate-600 font-bold mt-2">Nenhum formulário encontrado no banco de simulação.</p>
          <button onClick={handleAddNewForm} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer">Começar</button>
        </div>
      )}
    </div>
  );
};
