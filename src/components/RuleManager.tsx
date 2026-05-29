/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  GitFork, 
  ArrowRight, 
  Tag, 
  Flame, 
  Settings2, 
  MoveRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useDb } from '../context/DbContext';
import { 
  DbForm, 
  DbFormQuestion, 
  DbConditionalRule, 
  RuleActionType, 
  LeadTemperature, 
  LeadStatus 
} from '../types';

export const RuleManager: React.FC = () => {
  const { 
    forms, 
    questions, 
    questionOptions, 
    conditionalRules, 
    addConditionalRule, 
    deleteConditionalRule 
  } = useDb();

  const [formIdFilter, setFormIdFilter] = useState<string>(() => {
    return forms[0]?.id || '';
  });

  // State elements for creating a new rule structure
  const [sourceQuestionId, setSourceQuestionId] = useState<string>('');
  const [conditionValue, setConditionValue] = useState<string>('');
  const [actionType, setActionType] = useState<RuleActionType>('adicionar_tag');
  
  const [targetQuestionId, setTargetQuestionId] = useState<string>('');
  const [tagToAdd, setTagToAdd] = useState<string>('');
  const [temperatureToSet, setTemperatureToSet] = useState<LeadTemperature>('Quente');
  const [statusToSet, setStatusToSet] = useState<LeadStatus>('Novo');

  // Currently selected Form
  const selectedForm = useMemo(() => {
    return forms.find(f => f.id === formIdFilter) || forms[0];
  }, [forms, formIdFilter]);

  // Sync Form Id
  useEffect(() => {
    if (selectedForm && selectedForm.id !== formIdFilter) {
      setFormIdFilter(selectedForm.id);
    }
  }, [selectedForm, formIdFilter]);

  // Questions for this selected Form
  const formQuestions = useMemo(() => {
    if (!selectedForm) return [];
    return questions.filter(q => q.form_id === selectedForm.id);
  }, [questions, selectedForm]);

  // Current rules for this selected form
  const formRules = useMemo(() => {
    if (!selectedForm) return [];
    return conditionalRules.filter(r => r.form_id === selectedForm.id);
  }, [conditionalRules, selectedForm]);

  // Options corresponding to current selected Source question (if choice based)
  const sourceOptions = useMemo(() => {
    if (!sourceQuestionId) return [];
    return questionOptions.filter(o => o.question_id === sourceQuestionId);
  }, [questionOptions, sourceQuestionId]);

  // Auto set defaults when source question changes
  React.useEffect(() => {
    if (sourceQuestionId === '' && formQuestions.length > 0) {
      // Pick first field with options
      const firstChoiceQ = formQuestions.find(q => q.field_type === 'escolha_unica' || q.field_type === 'multipla_escolha');
      const pickQ = firstChoiceQ || formQuestions[0];
      if (pickQ) {
        setSourceQuestionId(pickQ.id);
      }
    }
  }, [formQuestions, sourceQuestionId]);

  // Auto set default text for option values when source choices change
  React.useEffect(() => {
    if (sourceOptions.length > 0) {
      setConditionValue(sourceOptions[0].option_text);
    } else {
      setConditionValue('Sim');
    }
  }, [sourceOptions]);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm || !sourceQuestionId) {
      alert('Selecione primeiro um formulário e uma pergunta de origem.');
      return;
    }

    addConditionalRule({
      form_id: selectedForm.id,
      source_question_id: sourceQuestionId,
      condition_value: conditionValue,
      action_type: actionType,
      target_question_id: actionType === 'ir_para_pergunta' ? targetQuestionId : null,
      tag_to_add: actionType === 'adicionar_tag' ? tagToAdd : null,
      temperature_to_set: actionType === 'definir_temperatura' ? temperatureToSet : null,
      status_to_set: actionType === 'definir_status_inicial' ? statusToSet : null,
    });

    // Reset some inputs helper
    setTagToAdd('');
    setTargetQuestionId('');
  };

  // Helper selectors to output name on lists
  const getQuestionText = (qId: string) => {
    const q = questions.find(item => item.id === qId);
    return q ? q.question_text : 'Pergunta excluída';
  };

  return (
    <div className="space-y-6" id="rule-manager-container">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight">Regras de Lógica Condicional</h2>
        <p className="text-sm text-slate-500">Mapeie caminhos inteligentes: automatize o preenchimento, injete tags de interesse e classifique leads de forma instantânea.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: CONTEXT SELECTOR & ADD RULE FORM */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <Settings2 className="h-4.5 w-4.5 text-lime-600" />
              <h3 className="font-display font-bold text-slate-700 text-sm">Configurador de Regras</h3>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4">
              {/* Form selection filter */}
              <div>
                <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Selecionar Formulário</label>
                <select
                  id="select-rule-form"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-lime-500"
                  value={formIdFilter}
                  onChange={(e) => {
                    setFormIdFilter(e.target.value);
                    setSourceQuestionId('');
                  }}
                >
                  {forms.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {selectedForm ? (
                <>
                  <div className="bg-lime-50/40 rounded-xl p-3 border border-lime-100 text-3xs text-blue-900 flex gap-2">
                    <AlertCircle className="h-4 w-4 text-lime-600 shrink-0" />
                    <p className="leading-relaxed">
                      Configure comportamentos com base nas respostas dadas pelos contatos. As tags, status e temperaturas serão definidos de acordo com as escolhas de checkout.
                    </p>
                  </div>

                  {/* SOURCE QUESTION SELECTOR */}
                  <div>
                    <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Se a Pergunta...</label>
                    <select
                      id="inp-rule-source-q"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-700 focus:outline-none focus:border-lime-500 bg-white"
                      value={sourceQuestionId}
                      onChange={(e) => setSourceQuestionId(e.target.value)}
                    >
                      <option value="" disabled>Selecione uma pergunta de origem...</option>
                      {formQuestions.map(q => (
                        <option key={q.id} value={q.id}>
                          {q.question_text} ({q.field_type.replace('_', ' ')})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* EXPECTED ANSWER VALUE CONDITIONAL */}
                  <div>
                    <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">For Igual a...</label>
                    {sourceOptions.length > 0 ? (
                      <select
                        id="inp-rule-cond-val"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-lime-500 bg-white"
                        value={conditionValue}
                        onChange={(e) => setConditionValue(e.target.value)}
                      >
                        {sourceOptions.map(opt => (
                          <option key={opt.id} value={opt.option_text}>{opt.option_text}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="inp-rule-cond-val-text"
                        type="text"
                        placeholder="Ex: Sim"
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-lime-500"
                        value={conditionValue}
                        onChange={(e) => setConditionValue(e.target.value)}
                      />
                    )}
                  </div>

                  {/* ACTION TYPE SELECTOR */}
                  <div>
                    <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Ação Comercial</label>
                    <select
                      id="inp-rule-action"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-700 focus:outline-none focus:border-lime-500 bg-white"
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value as RuleActionType)}
                    >
                      <option value="adicionar_tag">Adicionar Tag de Interesse</option>
                      <option value="definir_temperatura">Definir Temperatura do Lead</option>
                      <option value="definir_status_inicial">Definir Status de Atendimento</option>
                    </select>
                  </div>

                  {/* ACTION DYNAMIC ALVOS FIELDS */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    {actionType === 'ir_para_pergunta' && (
                      <div>
                        <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Pular para Pergunta</label>
                        <select
                          id="inp-rule-target-q"
                          className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 focus:outline-none focus:border-lime-500 bg-white"
                          value={targetQuestionId}
                          onChange={(e) => setTargetQuestionId(e.target.value)}
                          required
                        >
                          <option value="">Selecione a pergunta de destino...</option>
                          {formQuestions
                            .filter(q => q.id !== sourceQuestionId)
                            .map(q => (
                              <option key={q.id} value={q.id}>{q.question_text}</option>
                            ))
                          }
                        </select>
                      </div>
                    )}

                    {actionType === 'adicionar_tag' && (
                      <div>
                        <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Nome da Tag</label>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center p-2 rounded-lg bg-lime-50 text-lime-600 border border-lime-100">
                            <Tag className="h-4.5 w-4.5" />
                          </div>
                          <input
                            id="inp-rule-tag"
                            type="text"
                            placeholder="Ex: Gestão, Iniciante, Mentoria"
                            className="flex-1 rounded-lg border border-slate-200 px-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-lime-500"
                            value={tagToAdd}
                            onChange={(e) => setTagToAdd(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {actionType === 'definir_temperatura' && (
                      <div>
                        <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Temperatura a ser Atribuída</label>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-600 border border-red-100">
                            <Flame className="h-4.5 w-4.5" />
                          </div>
                          <select
                            id="inp-rule-temp"
                            className="flex-1 rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-lime-500 bg-white"
                            value={temperatureToSet}
                            onChange={(e) => setTemperatureToSet(e.target.value as LeadTemperature)}
                          >
                            <option value="Frio">Frio (Iniciantes, sem investimento)</option>
                            <option value="Morno">Morno (Já opera, perfil indeciso)</option>
                            <option value="Quente">Quente (Faturamento interessante)</option>
                            <option value="Muito quente">Muito quente (Faturamento alto e decisor)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {actionType === 'definir_status_inicial' && (
                      <div>
                        <label className="text-4xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Novo Status do Funil de Atendimento</label>
                        <select
                          id="inp-rule-status"
                          className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-lime-500 bg-white"
                          value={statusToSet}
                          onChange={(e) => setStatusToSet(e.target.value as LeadStatus)}
                        >
                          <option value="Novo">Novo (Fila de espera geral)</option>
                          <option value="Em atendimento">Em atendimento</option>
                          <option value="Qualificado">Qualificado</option>
                          <option value="Agendado">Agendado</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    id="btn-save-rule"
                    type="submit"
                    className="flex w-full justify-center items-center gap-2 rounded-xl bg-lime-400 p-2.5 text-xs font-bold text-blue-950 shadow-md hover:bg-lime-300 transition duration-150 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Regra</span>
                  </button>
                </>
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">Crie primeiro um formulário para criar regras condicionais.</p>
              )}
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE RULES LOGICAL CHART/FLOWLIST */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <GitFork className="h-4.5 w-4.5 text-lime-600" />
                <h3 className="font-display font-bold text-slate-750 text-sm">Fluxograma de Regras Ativas</h3>
              </div>
              
              <span className="rounded-full bg-slate-100 px-3 py-0.5 text-3xs font-mono font-bold text-slate-500">
                {formRules.length} {formRules.length === 1 ? 'regra definida' : 'regras definidas'}
              </span>
            </div>

            {/* RULES FLOW LIST */}
            {formRules.length === 0 ? (
              <div className="text-center py-12">
                <GitFork className="h-10 w-10 text-slate-300 mx-auto" strokeWidth={1} />
                <p className="text-xs text-slate-400 mt-2 font-medium">Nenhuma regra de lógica condicional definida para este formulário.</p>
                <p className="text-5xs text-slate-400 mt-1 max-w-[280px] mx-auto">Configure acima: quando o lead selecionar determinado faturamento ou opção, inicie gatilhos para pré-atendimento.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formRules.map((rule) => {
                  return (
                    <div 
                      key={rule.id} 
                      className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-slate-350 hover:bg-white hover:shadow-xs transition duration-150 flex items-start justify-between gap-4"
                    >
                      {/* FLOW GRAPHICS OUTLINE */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-650 leading-loose">
                          <span className="font-semibold text-slate-500">Se a resposta para</span>
                          <span className="font-bold text-slate-800 bg-white border border-slate-200 rounded-md px-2 py-0.5 max-w-[220px] truncate block" title={getQuestionText(rule.source_question_id)}>
                            {getQuestionText(rule.source_question_id)}
                          </span>
                          <span className="font-semibold text-slate-500">for igual a</span>
                          <span className="font-bold text-lime-600 bg-lime-50 border border-lime-100 rounded-md px-2 py-0.5">
                            {rule.condition_value}
                          </span>
                        </div>

                        {/* ARROW TRIGGER INDICATING ACTION OUTCOME */}
                        <div className="flex items-center gap-2">
                          <div className="h-px bg-slate-200 flex-1" />
                          <div className="flex items-center gap-1.5 text-3xs font-black uppercase text-slate-400">
                            <span>Gatilho</span>
                            <MoveRight className="h-3.5 w-3.5" />
                          </div>
                          <div className="h-px bg-slate-200 flex-1" />
                        </div>

                        {/* RESULT BOX */}
                        <div className="rounded-lg bg-white border border-slate-200 p-2.5 flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2 text-xs">
                            {rule.action_type === 'adicionar_tag' && (
                              <>
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-lime-50 text-lime-600 border border-lime-200 shrink-0">
                                  <Tag className="h-3.5 w-3.5" />
                                </span>
                                <div>
                                  <p className="text-slate-400 text-3xs font-semibold leading-none">Ação comercial</p>
                                  <p className="font-bold text-slate-750 mt-0.5">Adicionar tag <span className="text-lime-600">"{rule.tag_to_add}"</span> ao Lead</p>
                                </div>
                              </>
                            )}

                            {rule.action_type === 'definir_temperatura' && (
                              <>
                                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md shrink-0 border
                                  ${rule.temperature_to_set === 'Muito quente' ? 'bg-red-50 text-red-650 border-red-200' :
                                    rule.temperature_to_set === 'Quente' ? 'bg-orange-50 text-orange-650 border-orange-200' :
                                    rule.temperature_to_set === 'Morno' ? 'bg-amber-50 text-amber-650 border-amber-200' : 'bg-blue-50 text-blue-650 border-blue-200'
                                  }
                                `}>
                                  <Flame className="h-3.5 w-3.5" />
                                </span>
                                <div>
                                  <p className="text-slate-400 text-3xs font-semibold leading-none">Classificação de Calor</p>
                                  <p className="font-bold text-slate-750 mt-0.5">Marcar Temperatura como <span className="text-orange-600">{rule.temperature_to_set}</span></p>
                                </div>
                              </>
                            )}

                            {rule.action_type === 'definir_status_inicial' && (
                              <>
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-55 border border-slate-200 shrink-0 text-slate-700">
                                  <Settings2 className="h-3.5 w-3.5" />
                                </span>
                                <div>
                                  <p className="text-slate-400 text-3xs font-semibold leading-none">Workflow do Funil</p>
                                  <p className="font-bold text-slate-750 mt-0.5">Definir status inicial como <span className="text-slate-800 font-black">"{rule.status_to_set}"</span></p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* TRASH CONTROL */}
                      <button
                        id={`btn-del-rule-${rule.id}`}
                        onClick={() => deleteConditionalRule(rule.id)}
                        className="text-slate-400 hover:text-red-500 rounded p-1.5 border border-slate-200 hover:bg-white group-hover:block transition"
                        title="Deletar regra"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
