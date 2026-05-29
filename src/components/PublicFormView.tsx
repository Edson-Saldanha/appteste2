/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileCode, 
  Send, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Smartphone, 
  Tag, 
  Flame, 
  CheckCircle2, 
  CornerDownRight, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useDb } from '../context/DbContext';
import { DbForm, DbFormQuestion, DbFormQuestionOption } from '../types';

interface PublicFormViewProps {
  initialFormId?: string | null;
}

export const PublicFormView: React.FC<PublicFormViewProps> = ({ initialFormId }) => {
  const { 
    forms, 
    questions, 
    questionOptions, 
    submitPublicForm, 
    conditionalRules 
  } = useDb();

  const [formId, setFormId] = useState<string>(() => {
    if (initialFormId && forms.some(f => f.id === initialFormId)) {
      return initialFormId;
    }
    return forms[0]?.id || '';
  });

  // Sync state if prop changes
  useEffect(() => {
    if (initialFormId && forms.some(f => f.id === initialFormId)) {
      setFormId(initialFormId);
    }
  }, [initialFormId, forms]);

  // Selected Form
  const activeForm = useMemo(() => {
    return forms.find(f => f.id === formId) || forms[0];
  }, [forms, formId]);

  // Questions
  const activeQuestions = useMemo(() => {
    if (!activeForm) return [];
    return questions
      .filter(q => q.form_id === activeForm.id)
      .sort((a, b) => a.order_index - b.order_index);
  }, [questions, activeForm]);

  // Step manager for conversational Typeform style questionnaire experience!
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Accumulated answers values
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Submit complete flag
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastCreatedLeadId, setLastCreatedLeadId] = useState<string | null>(null);

  // Restart questionnaire
  const handleResetForm = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsSubmitted(false);
    setLastCreatedLeadId(null);
  };

  // Validation
  const currentQuestion = activeQuestions[currentStep];
  const isCurrentStepValide = useMemo(() => {
    if (!currentQuestion) return true;
    if (!currentQuestion.is_required) return true;
    const value = answers[currentQuestion.id];
    return value !== undefined && value.trim() !== '';
  }, [currentQuestion, answers]);

  // Next step click
  const handleNext = () => {
    if (!isCurrentStepValide) {
      alert('Este campo é obrigatório. Por favor, forneça uma resposta válida.');
      return;
    }
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Submit trigger
  const handleSubmitFormAnswers = () => {
    if (!activeForm) return;

    // Check all required questions
    const missing = activeQuestions.filter(q => {
      if (!q.is_required) return false;
      const ansVal = answers[q.id];
      return !ansVal || ansVal.trim() === '';
    });

    if (missing.length > 0) {
      alert(`Falta preencher perguntas obrigatórias: "${missing[0].question_text}"`);
      // jump to first missing step
      const missingIdx = activeQuestions.findIndex(q => q.id === missing[0].id);
      if (missingIdx !== -1) {
        setCurrentStep(missingIdx);
      }
      return;
    }

    // Submit and register lead in our simulation DB Context
    const createdLead = submitPublicForm(activeForm.id, answers);
    setLastCreatedLeadId(createdLead.id);
    setIsSubmitted(true);
  };

  // Get active rules for active values to show a real-time logical evaluation trace
  const activeTriggeredRules = useMemo(() => {
    if (!activeForm) return [];
    const formRules = conditionalRules.filter(r => r.form_id === activeForm.id);
    return formRules.filter(rule => {
      const userVal = answers[rule.source_question_id];
      return userVal && userVal.trim().toLowerCase() === rule.condition_value.trim().toLowerCase();
    });
  }, [answers, conditionalRules, activeForm]);

  // Helper values
  const progressRatio = useMemo(() => {
    if (activeQuestions.length === 0) return 0;
    return Math.round(((currentStep + (isSubmitted ? 1 : 0)) / activeQuestions.length) * 100);
  }, [currentStep, activeQuestions, isSubmitted]);

  return (
    <div className="space-y-6" id="simulator-root">
      {/* HEADER BAR SELECTOR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight">Simulador Público</h2>
          <p className="text-sm text-slate-500">
            Experimente o formulário como um visitante. Teste as lógicas em tempo real e crie novos leads para o Kanban.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-1.5 rounded-xl border border-slate-220 shadow-3xs">
          <span className="text-[10px] font-black uppercase text-slate-400 px-2">Visualizar formulário:</span>
          <select
            id="sim-form-select"
            className="rounded-lg border border-slate-150 p-1.5 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none"
            value={formId}
            onChange={(e) => {
              setFormId(e.target.value);
              handleResetForm();
            }}
          >
            {forms.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {activeForm ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 max-w-5xl mx-auto">
          
          {/* LEFT CONTAINER COL: ACTIVE QUESTIONNAIRE SHELF */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-150 bg-white shadow-md p-6 sm:p-10 min-h-[460px] flex flex-col justify-between relative overflow-hidden" id="public-form-frame-sim">
              
              {/* TOP HEADER BRAND LOGO */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <img 
                  referrerPolicy="no-referrer"
                  src={activeForm.logo_url} 
                  alt="Logo" 
                  className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=128&auto=format&fit=crop";
                  }}
                />
                <div>
                  <h3 className="font-display font-extrabold text-slate-800 text-base leading-tight tracking-tight">
                    {activeForm.name}
                  </h3>
                  <span className="text-5xs font-mono font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                    Preview Público: link público simulado
                  </span>
                </div>
              </div>

              {/* LIVE CONVERSATIONAL STEPS PANELS */}
              {!isSubmitted ? (
                /* MAIN FORM STEPS FILLING AREA */
                activeQuestions.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400 text-xs">
                    <FileCode className="h-10 w-10 text-slate-350 mb-3" />
                    <p className="font-bold">Nenhum campo de perguntas cadastrado.</p>
                    <p className="text-4xs mt-1 max-w-[260px]">Configure campos de perguntas no "Criador de Formulários" e atualize para testar a captura.</p>
                  </div>
                ) : (
                  <div className="flex-1 py-8 flex flex-col justify-between">
                    <div className="space-y-5">
                      
                      {/* STEP CHRONOMETER PROGRESS */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-4xs font-mono font-bold uppercase tracking-wider text-slate-450">
                          <span>Pergunta {currentStep + 1} de {activeQuestions.length}</span>
                          <span style={{ color: activeForm.primary_color || '#ff4500' }}>{progressRatio}% Concluído</span>
                        </div>
                        {/* Interactive animation bar of form color theme */}
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${progressRatio}%`,
                              backgroundColor: activeForm.primary_color || '#ff4500' 
                            }}
                          />
                        </div>
                      </div>

                      {/* THE ACTIVE INLINE FORM INPUT RENDERER WITH LOGICAL COLOR THEME */}
                      <div className="space-y-3.5 pt-4 animate-fadeIn" key={currentQuestion.id}>
                        {/* Title text */}
                        <div className="space-y-1">
                          <span className="text-2xs font-bold text-slate-400 block font-mono">CAMPO QUALIFICADOR:</span>
                          <h4 className="font-display font-extrabold text-slate-855 text-lg leading-tight tracking-tight">
                            {currentQuestion.question_text}
                            {currentQuestion.is_required && <span className="text-red-500 font-serif ml-1.5">*</span>}
                          </h4>
                          {currentQuestion.question_description && (
                            <p className="text-xs text-slate-500 leading-normal font-medium">{currentQuestion.question_description}</p>
                          )}
                        </div>

                        {/* INPUT FIELD SWITCH ACCORDING TO FIELD TYPE CATEGORIES */}
                        <div className="pt-2">
                          
                          {/* 1. TEXTO CURTO OR NUMEROS */}
                          {(currentQuestion.field_type === 'texto_curto' || currentQuestion.field_type === 'numero') && (
                            <input
                              id={`pub-q-inp-text-${currentQuestion.id}`}
                              type={currentQuestion.field_type === 'numero' ? 'number' : 'text'}
                              placeholder="Digite sua resposta aqui..."
                              className="w-full rounded-xl border border-slate-310 p-3 text-sm focus:outline-none focus:ring-1 bg-white shadow-3xs"
                              value={answers[currentQuestion.id] || ''}
                              onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                              style={{ 
                                borderColor: answers[currentQuestion.id] ? activeForm.primary_color : '#cbd5e1'
                              }}
                            />
                          )}

                          {/* 2. TEXTO LONGO */}
                          {currentQuestion.field_type === 'texto_longo' && (
                            <textarea
                              id={`pub-q-inp-textarea-${currentQuestion.id}`}
                              rows={4}
                              placeholder="Explique detalhadamente..."
                              className="w-full rounded-xl border border-slate-310 p-3 text-sm focus:outline-none focus:ring-1 bg-white shadow-3xs"
                              value={answers[currentQuestion.id] || ''}
                              onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                              style={{ 
                                borderColor: answers[currentQuestion.id] ? activeForm.primary_color : '#cbd5e1'
                              }}
                            />
                          )}

                          {/* 3. EMAIL */}
                          {currentQuestion.field_type === 'email' && (
                            <input
                              id={`pub-q-inp-email-${currentQuestion.id}`}
                              type="email"
                              placeholder="exemplo@email.com"
                              className="w-full rounded-xl border border-slate-310 p-3 text-sm focus:outline-none focus:ring-1 bg-white shadow-3xs"
                              value={answers[currentQuestion.id] || ''}
                              onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                            />
                          )}

                          {/* 4. TELEFONE */}
                          {currentQuestion.field_type === 'telefone' && (
                            <input
                              id={`pub-q-inp-phone-${currentQuestion.id}`}
                              type="tel"
                              placeholder="DDD + Número (Ex: 11999998888)"
                              className="w-full rounded-xl border border-slate-310 p-3 text-sm focus:outline-none focus:ring-1 bg-white shadow-3xs font-mono font-bold"
                              value={answers[currentQuestion.id] || ''}
                              onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                            />
                          )}

                          {/* 5. DATA */}
                          {currentQuestion.field_type === 'data' && (
                            <input
                              id={`pub-q-inp-date-${currentQuestion.id}`}
                              type="date"
                              className="w-full rounded-xl border border-slate-310 p-3 text-sm focus:outline-none bg-white shadow-3xs"
                              value={answers[currentQuestion.id] || ''}
                              onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                            />
                          )}

                          {/* 6. CAIXA SELECAO ACEITE TERMO (CHECKBOX UNICO) */}
                          {currentQuestion.field_type === 'caixa_selecao' && (
                            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition">
                              <input
                                id={`pub-q-inp-checkbox-single-${currentQuestion.id}`}
                                type="checkbox"
                                className="h-5 w-5 rounded text-indigo-600 border-slate-300 pointer-events-auto"
                                checked={answers[currentQuestion.id] === 'Aceito'}
                                onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.checked ? 'Aceito' : '' }))}
                              />
                              <span className="text-xs font-semibold text-slate-650 leading-snug">
                                Declaro que li e concordo com os termos de consentimento informados para análise de perfil.
                              </span>
                            </label>
                          )}

                          {/* 7. ESCOLHA UNICA OR MULTIPLAS OPCOES OUTSIDE GRIDS */}
                          {('escolha_unica' === currentQuestion.field_type || 'multipla_escolha' === currentQuestion.field_type) && (
                            <div className="space-y-2 mt-1">
                              {questionOptions.filter(o => o.question_id === currentQuestion.id).map((opt) => {
                                const isChecked = 'multipla_escolha' === currentQuestion.field_type 
                                  ? (answers[currentQuestion.id] || '').split(', ').includes(opt.option_text)
                                  : answers[currentQuestion.id] === opt.option_text;

                                return (
                                  <div 
                                    id={`pub-opt-btn-${opt.id}`}
                                    key={opt.id}
                                    onClick={() => {
                                      if ('multipla_escolha' === currentQuestion.field_type) {
                                        let currentList = (answers[currentQuestion.id] || '').split(', ').filter(x => x.trim() !== '');
                                        if (currentList.includes(opt.option_text)) {
                                          currentList = currentList.filter(v => v !== opt.option_text);
                                        } else {
                                          currentList.push(opt.option_text);
                                        }
                                        setAnswers(prev => ({ ...prev, [currentQuestion.id]: currentList.join(', ') }));
                                      } else {
                                        setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt.option_text }));
                                      }
                                    }}
                                    className={`
                                      flex items-center gap-3 w-full rounded-2xl border p-4.5 text-xs font-bold text-left cursor-pointer transition
                                      ${isChecked 
                                        ? 'border-slate-500 shadow-sm' 
                                        : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50'}
                                    `}
                                    style={{
                                      borderColor: isChecked ? activeForm.primary_color : '',
                                      backgroundColor: isChecked ? `${activeForm.primary_color}0a` : ''
                                    }}
                                  >
                                    <div className={`
                                      h-5 w-5 flex items-center justify-center border
                                      ${'escolha_unica' === currentQuestion.field_type ? 'rounded-full' : 'rounded'}
                                    `}
                                    style={{ 
                                      borderColor: isChecked ? activeForm.primary_color : '#cbd5e1',
                                      backgroundColor: isChecked ? activeForm.primary_color : '#ffffff'
                                    }}>
                                      {isChecked && <Check className="h-3 w-3 text-white stroke-[4]" />}
                                    </div>
                                    <span style={{ color: isChecked ? activeForm.primary_color : '#1e293b' }}>{opt.option_text}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      </div>

                    </div>

                    {/* ACTION CONTROLS FOOTER PANEL */}
                    <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                      <button
                        id="btn-sim-prev"
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-45"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Voltar</span>
                      </button>

                      {currentStep === activeQuestions.length - 1 ? (
                        <button
                          id="btn-sim-submit"
                          onClick={handleSubmitFormAnswers}
                          className="flex items-center gap-2 rounded-xl text-white px-5 py-2.5 text-xs font-bold shadow-lg transition"
                          style={{ 
                            backgroundColor: activeForm.primary_color || '#ff4500',
                            boxShadow: `0 4px 10px ${activeForm.primary_color}25`
                          }}
                        >
                          <span>{activeForm.button_text}</span>
                          <Send className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          id="btn-sim-next"
                          onClick={handleNext}
                          className="flex items-center gap-1.5 rounded-xl text-white px-5 py-2.5 text-xs font-bold transition shadow-sm"
                          style={{ 
                            backgroundColor: activeForm.primary_color || '#ff4500' 
                          }}
                        >
                          <span>Avançar</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* MOUNT THANK-YOU SUCCESS SCREEN CONFIG */
                <div className="flex-1 flex flex-col justify-center items-center py-10 text-center animate-scaleIn">
                  <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 p-2 shadow-xs mb-4 animate-bounce">
                    <CheckCircle2 className="h-10 w-10 shrink-0" />
                  </div>

                  <h3 className="font-display font-extrabold text-slate-800 text-lg leading-tight mb-2">Respostas Recebidas!</h3>
                  <div className="text-xs text-slate-600 max-w-sm leading-relaxed p-4 border border-slate-100 rounded-2xl bg-slate-50/70">
                    "{activeForm.final_message}"
                  </div>

                  {/* Feedback summary metadata */}
                  {lastCreatedLeadId && (
                    <div className="mt-5 text-4xs font-mono text-slate-400 bg-white px-3 py-1.5 border rounded-lg max-w-xs text-left space-y-1">
                      <div className="font-black text-slate-800 uppercase text-center border-b pb-1 mb-1 tracking-wider">Simulação Salva</div>
                      <div>• Lead ID: {lastCreatedLeadId.toUpperCase()}</div>
                      <div>• Status Inicial: Novo</div>
                      {activeTriggeredRules.length > 0 && (
                        <div className="text-indigo-600 font-bold">• {activeTriggeredRules.length} lógicas foram aplicadas!</div>
                      )}
                    </div>
                  )}

                  <button
                    id="btn-sim-restart"
                    onClick={handleResetForm}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-slate-800 text-white px-4 py-2.5 text-xs font-bold hover:bg-slate-700 transition"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Iniciar Nova Simulação</span>
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT CONTAINER COL: LIVE BACKGROUND RULES DEBUG PANEL (INFORMATIVE ONLY) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-indigo-50">
                <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                <h4 className="font-display font-bold text-slate-705 text-xs uppercase tracking-wider">Lógicas Ativas de Captura</h4>
              </div>

              <p className="text-4xs text-slate-405 leading-relaxed">
                Este painel revela quais regras de segmentação serão executadas quando as respostas forem preenchidas no formulário.
              </p>

              {/* Live list indicator trace of evaluate rules */}
              <div className="mt-4 space-y-2">
                {conditionalRules.filter(r => r.form_id === activeForm.id).length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic py-2">Nenhuma regra associada a este formulário.</p>
                ) : (
                  conditionalRules.filter(r => r.form_id === activeForm.id).map(rule => {
                    const matchedQ = questions.find(q => q.id === rule.source_question_id);
                    const isEvaluatingTrue = answers[rule.source_question_id] && answers[rule.source_question_id].trim().toLowerCase() === rule.condition_value.trim().toLowerCase();

                    return (
                      <div 
                        key={rule.id} 
                        className={`rounded-lg border p-2.5 text-4xs transition
                          ${isEvaluatingTrue 
                            ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-50 text-slate-700' 
                            : 'bg-slate-50/50 border-slate-150 text-slate-500'}
                        `}
                      >
                        <div className="flex items-center justify-between font-mono mb-1.5 text-3xs font-black">
                          <span>REGRA DE DIAGNÓSTICO</span>
                          <span>
                            {isEvaluatingTrue ? '🟢 EXECUÇÃO ATIVA' : '⚪ AGUARDANDO'}
                          </span>
                        </div>
                        <p className="leading-tight">
                          Se <span className="font-bold">[{matchedQ ? matchedQ.question_text : 'Pergunta'}]</span> for igual a <span className="font-bold">"{rule.condition_value}"</span>...
                        </p>
                        <div className="mt-1.5 flex items-center gap-1 bg-white p-1 rounded border">
                          <CornerDownRight className="h-3 w-3 shrink-0" />
                          <span className="font-semibold leading-none truncate block">
                            {rule.action_type === 'adicionar_tag' && `Adicionar Tag: ${rule.tag_to_add}`}
                            {rule.action_type === 'definir_temperatura' && `Classifica Calor como: ${rule.temperature_to_set}`}
                            {rule.action_type === 'definir_status_inicial' && `Rotaciona Status como: ${rule.status_to_set}`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white border rounded-2xl p-10 text-center">
          <AlertCircle className="h-10 w-10 text-slate-400 mx-auto" />
          <p className="text-slate-650 font-bold mt-2">Nenhum formulário ativo para testar no simulador.</p>
        </div>
      )}
    </div>
  );
};
