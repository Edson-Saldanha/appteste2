/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DbUser, 
  DbForm, 
  DbFormQuestion, 
  DbFormQuestionOption, 
  DbConditionalRule, 
  DbLead, 
  DbLeadAnswer, 
  DbLeadTag, 
  DbLeadNote, 
  DbLeadEvent,
  LeadStatus,
  LeadTemperature,
  FormStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FORMS,
  INITIAL_QUESTIONS,
  INITIAL_QUESTION_OPTIONS,
  INITIAL_CONDITIONAL_RULES,
  INITIAL_LEADS,
  INITIAL_LEAD_ANSWERS,
  INITIAL_LEAD_TAGS,
  INITIAL_LEAD_NOTES,
  INITIAL_LEAD_EVENTS
} from '../utils/initialData';

interface DbContextType {
  users: DbUser[];
  forms: DbForm[];
  questions: DbFormQuestion[];
  questionOptions: DbFormQuestionOption[];
  conditionalRules: DbConditionalRule[];
  leads: DbLead[];
  leadAnswers: DbLeadAnswer[];
  leadTags: DbLeadTag[];
  leadNotes: DbLeadNote[];
  leadEvents: DbLeadEvent[];
  currentUser: DbUser;
  
  // Forms api
  createForm: (form: Omit<DbForm, 'id' | 'created_at' | 'updated_at'>) => DbForm;
  updateForm: (id: string, updates: Partial<DbForm>) => void;
  deleteForm: (id: string) => void;
  
  // Questions api
  addQuestion: (question: Omit<DbFormQuestion, 'id' | 'created_at'>) => DbFormQuestion;
  updateQuestion: (id: string, updates: Partial<DbFormQuestion>) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  
  // Options api
  addQuestionOption: (option: Omit<DbFormQuestionOption, 'id'>) => DbFormQuestionOption;
  updateQuestionOption: (id: string, text: string) => void;
  deleteQuestionOption: (id: string) => void;
  
  // Rules api
  addConditionalRule: (rule: Omit<DbConditionalRule, 'id' | 'created_at'>) => DbConditionalRule;
  deleteConditionalRule: (id: string) => void;
  
  // Leads api
  submitPublicForm: (formId: string, fields: Record<string, string>) => DbLead;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  updateLeadTemperature: (leadId: string, newTemperature: LeadTemperature) => void;
  assignLeadResponsible: (leadId: string, userId: string | null) => void;
  addLeadNote: (leadId: string, noteText: string) => void;
  deleteLeadNote: (noteId: string) => void;
  addLeadTag: (leadId: string, tagName: string) => void;
  removeLeadTag: (leadId: string, tagName: string) => void;
  deleteLead: (leadId: string) => void;
  updateLeadDetails: (leadId: string, updates: Partial<DbLead>) => void;

  // Global reset
  resetToDefaults: () => void;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state or fallback to initial data
  const [users, setUsers] = useState<DbUser[]>(() => {
    const saved = localStorage.getItem('form_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [forms, setForms] = useState<DbForm[]>(() => {
    const saved = localStorage.getItem('form_forms');
    return saved ? JSON.parse(saved) : INITIAL_FORMS;
  });

  const [questions, setQuestions] = useState<DbFormQuestion[]>(() => {
    const saved = localStorage.getItem('form_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [questionOptions, setQuestionOptions] = useState<DbFormQuestionOption[]>(() => {
    const saved = localStorage.getItem('form_question_options');
    return saved ? JSON.parse(saved) : INITIAL_QUESTION_OPTIONS;
  });

  const [conditionalRules, setConditionalRules] = useState<DbConditionalRule[]>(() => {
    const saved = localStorage.getItem('form_conditional_rules');
    return saved ? JSON.parse(saved) : INITIAL_CONDITIONAL_RULES;
  });

  const [leads, setLeads] = useState<DbLead[]>(() => {
    const saved = localStorage.getItem('form_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [leadAnswers, setLeadAnswers] = useState<DbLeadAnswer[]>(() => {
    const saved = localStorage.getItem('form_lead_answers');
    return saved ? JSON.parse(saved) : INITIAL_LEAD_ANSWERS;
  });

  const [leadTags, setLeadTags] = useState<DbLeadTag[]>(() => {
    const saved = localStorage.getItem('form_lead_tags');
    return saved ? JSON.parse(saved) : INITIAL_LEAD_TAGS;
  });

  const [leadNotes, setLeadNotes] = useState<DbLeadNote[]>(() => {
    const saved = localStorage.getItem('form_lead_notes');
    return saved ? JSON.parse(saved) : INITIAL_LEAD_NOTES;
  });

  const [leadEvents, setLeadEvents] = useState<DbLeadEvent[]>(() => {
    const saved = localStorage.getItem('form_lead_events');
    return saved ? JSON.parse(saved) : INITIAL_LEAD_EVENTS;
  });

  const currentUser = users[0] || INITIAL_USERS[0];

  // Save to LocalStorage whenever structures change
  useEffect(() => {
    localStorage.setItem('form_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('form_forms', JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('form_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('form_question_options', JSON.stringify(questionOptions));
  }, [questionOptions]);

  useEffect(() => {
    localStorage.setItem('form_conditional_rules', JSON.stringify(conditionalRules));
  }, [conditionalRules]);

  useEffect(() => {
    localStorage.setItem('form_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('form_lead_answers', JSON.stringify(leadAnswers));
  }, [leadAnswers]);

  useEffect(() => {
    localStorage.setItem('form_lead_tags', JSON.stringify(leadTags));
  }, [leadTags]);

  useEffect(() => {
    localStorage.setItem('form_lead_notes', JSON.stringify(leadNotes));
  }, [leadNotes]);

  useEffect(() => {
    localStorage.setItem('form_lead_events', JSON.stringify(leadEvents));
  }, [leadEvents]);

  // Form utilities
  const createForm = (formSeed: Omit<DbForm, 'id' | 'created_at' | 'updated_at'>) => {
    const newId = 'form-' + Math.random().toString(36).substring(2, 9);
    const newForm: DbForm = {
      ...formSeed,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setForms(prev => [newForm, ...prev]);
    return newForm;
  };

  const updateForm = (id: string, updates: Partial<DbForm>) => {
    setForms(prev => prev.map(f => f.id === id ? { ...f, ...updates, updated_at: new Date().toISOString() } : f));
  };

  const deleteForm = (id: string) => {
    setForms(prev => prev.filter(f => f.id !== id));
    setQuestions(prev => prev.filter(q => q.form_id !== id));
    // Also clear associated leads
    const affectedLeads = leads.filter(l => l.form_id === id).map(l => l.id);
    setLeads(prev => prev.filter(l => l.form_id !== id));
    setLeadAnswers(prev => prev.filter(a => !affectedLeads.includes(a.lead_id)));
    setLeadTags(prev => prev.filter(t => !affectedLeads.includes(t.lead_id)));
    setLeadNotes(prev => prev.filter(n => !affectedLeads.includes(n.lead_id)));
    setLeadEvents(prev => prev.filter(e => !affectedLeads.includes(e.lead_id)));
    setConditionalRules(prev => prev.filter(r => r.form_id !== id));
  };

  // Questions api
  const addQuestion = (qSeed: Omit<DbFormQuestion, 'id' | 'created_at'>) => {
    const qId = 'q-' + Math.random().toString(36).substring(2, 9);
    const newQuestion: DbFormQuestion = {
      ...qSeed,
      id: qId,
      created_at: new Date().toISOString()
    };
    setQuestions(prev => [...prev, newQuestion]);
    return newQuestion;
  };

  const updateQuestion = (id: string, updates: Partial<DbFormQuestion>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    setQuestionOptions(prev => prev.filter(o => o.question_id !== id));
    setConditionalRules(prev => prev.filter(r => r.source_question_id !== id && r.target_question_id !== id));
  };

  const duplicateQuestion = (id: string) => {
    const target = questions.find(q => q.id === id);
    if (!target) return;
    const newId = 'q-' + Math.random().toString(36).substring(2, 9);
    const newOrder = target.order_index + 1;
    
    // Shift others
    setQuestions(prev => prev.map(q => q.order_index >= newOrder ? { ...q, order_index: q.order_index + 1 } : q));
    
    const duplicated: DbFormQuestion = {
      ...target,
      id: newId,
      question_text: `${target.question_text} (Cópia)`,
      order_index: newOrder,
      created_at: new Date().toISOString()
    };
    
    // Duplicate options if present
    const sourceOptions = questionOptions.filter(o => o.question_id === id);
    const duplicatedOptions = sourceOptions.map((o, idx) => ({
      id: 'opt-' + Math.random().toString(36).substring(2, 9),
      question_id: newId,
      option_text: o.option_text,
      order_index: idx
    }));

    setQuestions(prev => [...prev, duplicated]);
    if (duplicatedOptions.length > 0) {
      setQuestionOptions(prev => [...prev, ...duplicatedOptions]);
    }
  };

  // Options api
  const addQuestionOption = (optSeed: Omit<DbFormQuestionOption, 'id'>) => {
    const optId = 'opt-' + Math.random().toString(36).substring(2, 9);
    const newOption: DbFormQuestionOption = {
      ...optSeed,
      id: optId
    };
    setQuestionOptions(prev => [...prev, newOption]);
    return newOption;
  };

  const updateQuestionOption = (id: string, text: string) => {
    setQuestionOptions(prev => prev.map(o => o.id === id ? { ...o, option_text: text } : o));
  };

  const deleteQuestionOption = (id: string) => {
    setQuestionOptions(prev => prev.filter(o => o.id !== id));
  };

  // Rules api
  const addConditionalRule = (ruleSeed: Omit<DbConditionalRule, 'id' | 'created_at'>) => {
    const ruleId = 'rule-' + Math.random().toString(36).substring(2, 9);
    const newRule: DbConditionalRule = {
      ...ruleSeed,
      id: ruleId,
      created_at: new Date().toISOString()
    };
    setConditionalRules(prev => [...prev, newRule]);
    return newRule;
  };

  const deleteConditionalRule = (id: string) => {
    setConditionalRules(prev => prev.filter(r => r.id !== id));
  };

  // Leads submission & Intelligent logic processing
  const submitPublicForm = (formId: string, fields: Record<string, string>) => {
    const leadId = 'lead-' + Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toISOString();

    // 1. Map core fields (Name, Phone, Email)
    // Find questions corresponding to Name, Phone, Email to extract values
    const formQs = questions.filter(q => q.form_id === formId);
    
    let extractedName = 'Visitante';
    let extractedPhone = '';
    let extractedEmail = '';

    // Search for matching field types or typical question texts
    formQs.forEach(q => {
      const value = fields[q.id];
      if (value) {
        if (q.field_type === 'email' || q.question_text.toLowerCase().includes('email') || q.question_text.toLowerCase().includes('e-mail')) {
          extractedEmail = value;
        } else if (q.field_type === 'telefone' || q.question_text.toLowerCase().includes('whatsapp') || q.question_text.toLowerCase().includes('telefone') || q.question_text.toLowerCase().includes('fone')) {
          extractedPhone = value.replace(/\D/g, ''); // dry numbers only
        } else if (q.order_index === 0 || q.question_text.toLowerCase().includes('nome')) {
          extractedName = value;
        }
      }
    });

    // 2. Add Answers
    const answersToInsert: DbLeadAnswer[] = [];
    Object.entries(fields).forEach(([qId, val]) => {
      answersToInsert.push({
        id: 'ans-' + Math.random().toString(36).substring(2, 9),
        lead_id: leadId,
        question_id: qId,
        answer_value: val,
        created_at: timestamp
      });
    });

    // 3. Process Rules
    const activeRules = conditionalRules.filter(r => r.form_id === formId);
    const tagsApplied: string[] = [];
    let derivedTemperature: LeadTemperature = 'Morno';
    let derivedStatus: LeadStatus = 'Novo';

    activeRules.forEach(rule => {
      const userValue = fields[rule.source_question_id];
      if (userValue && userValue.trim().toLowerCase() === rule.condition_value.trim().toLowerCase()) {
        if (rule.action_type === 'adicionar_tag' && rule.tag_to_add) {
          if (!tagsApplied.includes(rule.tag_to_add)) {
            tagsApplied.push(rule.tag_to_add);
          }
        } else if (rule.action_type === 'definir_temperatura' && rule.temperature_to_set) {
          derivedTemperature = rule.temperature_to_set;
        } else if (rule.action_type === 'definir_status_inicial' && rule.status_to_set) {
          derivedStatus = rule.status_to_set;
        }
      }
    });

    // 4. Generate intelligent human summary from user responses
    let summaryParts: string[] = [];
    
    // Custom logic to summarize based on popular answers
    const hasShopeeAnswer = Object.entries(fields).find(([qid]) => qid === 'q-vende');
    const faturamentoAnswer = Object.entries(fields).find(([qid]) => qid === 'q-faturamento');
    const dificuldadeAnswer = Object.entries(fields).find(([qid]) => qid === 'q-dificuldade');
    const metaAnswer = Object.entries(fields).find(([qid]) => qid === 'q-meta');
    const programaAnswer = Object.entries(fields).find(([qid]) => qid === 'q-programa');

    summaryParts.push(`Lead ${extractedName}`);

    if (hasShopeeAnswer) {
      const vende = hasShopeeAnswer[1];
      summaryParts.push(vende === 'Sim' ? 'já vende ativamente na Shopee' : 'ainda não vende profissionalmente na Shopee');
    }

    if (faturamentoAnswer) {
      summaryParts.push(`faturando em média ${faturamentoAnswer[1]}`);
    }

    if (dificuldadeAnswer && dificuldadeAnswer[1]) {
      summaryParts.push(`relatou sua maior dificuldade hoje como: "${dificuldadeAnswer[1]}"`);
    }

    if (metaAnswer && metaAnswer[1]) {
      summaryParts.push(`planeja atingir um patamar de faturamento correspondente a "${metaAnswer[1]}"`);
    }

    if (programaAnswer && programaAnswer[1]) {
      summaryParts.push(`está buscando principalmente apoio focado em "${programaAnswer[1]}"`);
    }

    summaryParts.push(`Temperatura inicial identificada: ${derivedTemperature}.`);

    const finalSummary = summaryParts.join(', ').replace(', faturando', ' e faturando') + '.';

    // Create DbLead
    const newLead: DbLead = {
      id: leadId,
      form_id: formId,
      name: extractedName,
      phone: extractedPhone || 'Não fornecido',
      email: extractedEmail || 'Não fornecido',
      status: derivedStatus,
      temperature: derivedTemperature,
      responsible_user_id: null, // initially unassigned
      summary: finalSummary,
      created_at: timestamp,
      updated_at: timestamp
    };

    // Commit to simulation database
    setLeads(prev => [newLead, ...prev]);
    setLeadAnswers(prev => [...prev, ...answersToInsert]);
    
    // Insert Tags
    const tagsToInsert = tagsApplied.map(tagName => ({
      id: 'tag-' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      tag_name: tagName,
      created_at: timestamp
    }));
    setLeadTags(prev => [...prev, ...tagsToInsert]);

    // Insert Initial Event log
    const initialEvent: DbLeadEvent = {
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      event_type: 'novo_lead',
      old_value: '',
      new_value: `Entrada pelo formulário "${forms.find(f => f.id === formId)?.name || 'Formulário'}"`,
      created_at: timestamp
    };
    setLeadEvents(prev => [...prev, initialEvent]);

    return newLead;
  };

  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    const timestamp = new Date().toISOString();
    
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus, updated_at: timestamp } : l));

    // Log event
    const event: DbLeadEvent = {
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      event_type: 'status_change',
      old_value: lead.status,
      new_value: newStatus,
      created_at: timestamp
    };
    setLeadEvents(prev => [...prev, event]);
  };

  const updateLeadTemperature = (leadId: string, newTemperature: LeadTemperature) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.temperature === newTemperature) return;

    const timestamp = new Date().toISOString();
    
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, temperature: newTemperature, updated_at: timestamp } : l));

    // Log event
    const event: DbLeadEvent = {
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      event_type: 'temperature_change',
      old_value: lead.temperature,
      new_value: newTemperature,
      created_at: timestamp
    };
    setLeadEvents(prev => [...prev, event]);
  };

  const assignLeadResponsible = (leadId: string, userId: string | null) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const userObj = users.find(u => u.id === userId);
    const oldUserObj = users.find(u => u.id === lead.responsible_user_id);
    
    const timestamp = new Date().toISOString();
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, responsible_user_id: userId, updated_at: timestamp } : l));

    const event: DbLeadEvent = {
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      event_type: 'assigned',
      old_value: oldUserObj ? oldUserObj.name : 'Ninguém',
      new_value: userObj ? userObj.name : 'Ninguém',
      created_at: timestamp
    };
    setLeadEvents(prev => [...prev, event]);
  };

  const addLeadNote = (leadId: string, noteText: string) => {
    const noteId = 'note-' + Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toISOString();

    const newNote: DbLeadNote = {
      id: noteId,
      lead_id: leadId,
      user_id: currentUser.id,
      note: noteText,
      created_at: timestamp
    };

    setLeadNotes(prev => [...prev, newNote]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, updated_at: timestamp } : l));

    // Log event
    const event: DbLeadEvent = {
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      event_type: 'note_added',
      old_value: '',
      new_value: 'Observação interna adicionada',
      created_at: timestamp
    };
    setLeadEvents(prev => [...prev, event]);
  };

  const deleteLeadNote = (noteId: string) => {
    setLeadNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const addLeadTag = (leadId: string, tagName: string) => {
    const exists = leadTags.some(t => t.lead_id === leadId && t.tag_name.toLowerCase() === tagName.toLowerCase());
    if (exists) return;

    const tagId = 'tag-' + Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toISOString();

    const newTag: DbLeadTag = {
      id: tagId,
      lead_id: leadId,
      tag_name: tagName,
      created_at: timestamp
    };

    setLeadTags(prev => [...prev, newTag]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, updated_at: timestamp } : l));

    // Log event
    const event: DbLeadEvent = {
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      event_type: 'tag_added',
      old_value: '',
      new_value: tagName,
      created_at: timestamp
    };
    setLeadEvents(prev => [...prev, event]);
  };

  const removeLeadTag = (leadId: string, tagName: string) => {
    setLeadTags(prev => prev.filter(t => !(t.lead_id === leadId && t.tag_name.toLowerCase() === tagName.toLowerCase())));
    
    // Log event
    const event: DbLeadEvent = {
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      lead_id: leadId,
      event_type: 'tag_removed',
      old_value: tagName,
      new_value: '',
      created_at: new Date().toISOString()
    };
    setLeadEvents(prev => [...prev, event]);
  };

  const deleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    setLeadAnswers(prev => prev.filter(a => a.lead_id !== leadId));
    setLeadTags(prev => prev.filter(t => t.lead_id !== leadId));
    setLeadNotes(prev => prev.filter(n => n.lead_id !== leadId));
    setLeadEvents(prev => prev.filter(e => e.lead_id !== leadId));
  };

  const updateLeadDetails = (leadId: string, updates: Partial<DbLead>) => {
    const timestamp = new Date().toISOString();
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates, updated_at: timestamp } : l));
  };

  const resetToDefaults = () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações originais e limpar simulações adicionais?')) {
      localStorage.removeItem('form_users');
      localStorage.removeItem('form_forms');
      localStorage.removeItem('form_questions');
      localStorage.removeItem('form_question_options');
      localStorage.removeItem('form_conditional_rules');
      localStorage.removeItem('form_leads');
      localStorage.removeItem('form_lead_answers');
      localStorage.removeItem('form_lead_tags');
      localStorage.removeItem('form_lead_notes');
      localStorage.removeItem('form_lead_events');

      setUsers(INITIAL_USERS);
      setForms(INITIAL_FORMS);
      setQuestions(INITIAL_QUESTIONS);
      setQuestionOptions(INITIAL_QUESTION_OPTIONS);
      setConditionalRules(INITIAL_CONDITIONAL_RULES);
      setLeads(INITIAL_LEADS);
      setLeadAnswers(INITIAL_LEAD_ANSWERS);
      setLeadTags(INITIAL_LEAD_TAGS);
      setLeadNotes(INITIAL_LEAD_NOTES);
      setLeadEvents(INITIAL_LEAD_EVENTS);
    }
  };

  return (
    <DbContext.Provider value={{
      users,
      forms,
      questions,
      questionOptions,
      conditionalRules,
      leads,
      leadAnswers,
      leadTags,
      leadNotes,
      leadEvents,
      currentUser,
      
      createForm,
      updateForm,
      deleteForm,
      
      addQuestion,
      updateQuestion,
      deleteQuestion,
      duplicateQuestion,
      
      addQuestionOption,
      updateQuestionOption,
      deleteQuestionOption,
      
      addConditionalRule,
      deleteConditionalRule,
      
      submitPublicForm,
      updateLeadStatus,
      updateLeadTemperature,
      assignLeadResponsible,
      addLeadNote,
      deleteLeadNote,
      addLeadTag,
      removeLeadTag,
      deleteLead,
      updateLeadDetails,
      
      resetToDefaults
    }}>
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (!context) {
    throw new Error('useDb must be used within a DbProvider');
  }
  return context;
};
