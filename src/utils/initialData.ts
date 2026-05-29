/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  DbLeadEvent 
} from '../types';

export const INITIAL_USERS: DbUser[] = [
  {
    id: 'user-1',
    name: 'Edson Saldanha',
    email: 'trafegoedsonsaldanha@gmail.com',
    role: 'Administrador / Gestor',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    created_at: new Date('2026-05-01T08:00:00Z').toISOString()
  },
  {
    id: 'user-2',
    name: 'Bruna Oliveira',
    email: 'bruna.comercial@gmail.com',
    role: 'SDR / Pré-vendas',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
    created_at: new Date('2026-05-02T10:00:00Z').toISOString()
  },
  {
    id: 'user-3',
    name: 'Roberto Costa',
    email: 'roberto.closers@gmail.com',
    role: 'Closer / Comercial',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    created_at: new Date('2026-05-03T14:30:00Z').toISOString()
  }
];

export const INITIAL_FORMS: DbForm[] = [
  {
    id: 'form-shopee',
    name: 'Análise Gratuita de Loja',
    description: 'Formulário focado em diagnosticar lojas virtuais de vendedores da Shopee e direcionar para curso, mentoria ou serviço de consultoria/gestão completa.',
    status: 'ativo',
    logo_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=256&auto=format&fit=crop', // nice vector emblem style placeholder
    primary_color: '#ff4500', // Shopee orange
    secondary_color: '#2d3748',
    button_text: 'Quero minha Análise Gratuita 🚀',
    initial_message: 'Olá! Preencha as perguntas rápidas abaixo para que nosso time comercial ou especialistas de e-commerce possam analisar o potencial do seu negócio e traçar o melhor plano para você alavancar suas vendas!',
    final_message: 'Recebemos suas informações. Nossa equipe vai analisar seu perfil minuciosamente e chamar você diretamente no WhatsApp com um feedback personalizado!',
    public_slug: 'analise-gratis-shopee',
    created_at: new Date('2026-05-10T12:00:00Z').toISOString(),
    updated_at: new Date('2026-05-10T12:00:00Z').toISOString()
  },
  {
    id: 'form-outro',
    name: 'Captação Geral de Leads - Consultoria',
    description: 'Diagnóstico geral para e-commerce e tráfego pago.',
    status: 'rascunho',
    logo_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=256&auto=format&fit=crop',
    primary_color: '#4f46e5', // indigo
    secondary_color: '#1e293b',
    button_text: 'Falar com Especialista',
    initial_message: 'Conte-nos sobre o seu negócio e descubra se você está qualificado para a nossa Consultoria de Alavancagem.',
    final_message: 'Obrigado! Em breve entraremos em contato.',
    public_slug: 'captacao-consultoria',
    created_at: new Date('2026-05-20T15:00:00Z').toISOString(),
    updated_at: new Date('2026-05-20T15:00:00Z').toISOString()
  }
];

// Form questions for "Análise Gratuita de Loja"
export const INITIAL_QUESTIONS: DbFormQuestion[] = [
  {
    id: 'q-nome',
    form_id: 'form-shopee',
    question_text: 'Qual seu nome?',
    question_description: 'Digite seu nome completo',
    field_type: 'texto_curto',
    is_required: true,
    order_index: 0,
    created_at: new Date('2026-05-10T12:05:00Z').toISOString()
  },
  {
    id: 'q-whatsapp',
    form_id: 'form-shopee',
    question_text: 'Qual seu WhatsApp?',
    question_description: 'Com DDD, preferencialmente o número que você usa no comercial',
    field_type: 'telefone',
    is_required: true,
    order_index: 1,
    created_at: new Date('2026-05-10T12:06:00Z').toISOString()
  },
  {
    id: 'q-email',
    form_id: 'form-shopee',
    question_text: 'Qual seu melhor E-mail?',
    question_description: 'Vamos enviar materiais extras por lá',
    field_type: 'email',
    is_required: true,
    order_index: 2,
    created_at: new Date('2026-05-10T12:06:30Z').toISOString()
  },
  {
    id: 'q-vende',
    form_id: 'form-shopee',
    question_text: 'Você já vende na Shopee?',
    question_description: 'Selecione sua resposta',
    field_type: 'escolha_unica',
    is_required: true,
    order_index: 3,
    created_at: new Date('2026-05-10T12:07:00Z').toISOString()
  },
  {
    id: 'q-faturamento',
    form_id: 'form-shopee',
    question_text: 'Qual seu faturamento mensal atual?',
    question_description: 'Faturamento bruto médio na plataforma',
    field_type: 'escolha_unica',
    is_required: true,
    order_index: 4,
    created_at: new Date('2026-05-10T12:08:00Z').toISOString()
  },
  {
    id: 'q-dificuldade',
    form_id: 'form-shopee',
    question_text: 'Qual sua maior dificuldade hoje?',
    question_description: 'Explique brevemente onde você está travando',
    field_type: 'texto_longo',
    is_required: false,
    order_index: 5,
    created_at: new Date('2026-05-10T12:09:00Z').toISOString()
  },
  {
    id: 'q-meta',
    form_id: 'form-shopee',
    question_text: 'Qual sua meta de faturamento?',
    question_description: 'Qual valor deseja alcançar nos próximos 6 meses?',
    field_type: 'texto_curto',
    is_required: false,
    order_index: 6,
    created_at: new Date('2026-05-10T12:09:30Z').toISOString()
  },
  {
    id: 'q-decisor',
    form_id: 'form-shopee',
    question_text: 'Você é quem toma a decisão na empresa?',
    question_description: 'Ou precisa aprovar com sócio/parceiro?',
    field_type: 'escolha_unica',
    is_required: true,
    order_index: 7,
    created_at: new Date('2026-05-10T12:10:00Z').toISOString()
  },
  {
    id: 'q-programa',
    form_id: 'form-shopee',
    question_text: 'Você busca curso, mentoria ou gestão completa?',
    question_description: 'Qual formato mais se encaixa no seu momento?',
    field_type: 'escolha_unica',
    is_required: true,
    order_index: 8,
    created_at: new Date('2026-05-10T12:11:00Z').toISOString()
  }
];

export const INITIAL_QUESTION_OPTIONS: DbFormQuestionOption[] = [
  // Options for Vende na Shopee (q-vende):
  { id: 'opt-vende-sim', question_id: 'q-vende', option_text: 'Sim', order_index: 0 },
  { id: 'opt-vende-nao', question_id: 'q-vende', option_text: 'Não', order_index: 1 },

  // Options for Faturamento (q-faturamento):
  { id: 'opt-fat-0', question_id: 'q-faturamento', option_text: 'Iniciante (Não faturei)', order_index: 0 },
  { id: 'opt-fat-5k', question_id: 'q-faturamento', option_text: 'Até R$ 5.000', order_index: 1 },
  { id: 'opt-fat-5k20k', question_id: 'q-faturamento', option_text: 'Entre R$ 5.000 e R$ 20.000', order_index: 2 },
  { id: 'opt-fat-20k50k', question_id: 'q-faturamento', option_text: 'R$ 20.000 a R$ 50.000', order_index: 3 },
  { id: 'opt-fat-50kplus', question_id: 'q-faturamento', option_text: 'Acima de R$ 50.000', order_index: 4 },

  // Options for Decisor (q-decisor):
  { id: 'opt-dec-sim', question_id: 'q-decisor', option_text: 'Sim', order_index: 0 },
  { id: 'opt-dec-nao', question_id: 'q-decisor', option_text: 'Não', order_index: 1 },

  // Options for Programa (q-programa):
  { id: 'opt-prog-curso', question_id: 'q-programa', option_text: 'Curso', order_index: 0 },
  { id: 'opt-prog-mentoria', question_id: 'q-programa', option_text: 'Mentoria', order_index: 1 },
  { id: 'opt-prog-gestao', question_id: 'q-programa', option_text: 'Gestão Completa', order_index: 2 }
];

export const INITIAL_CONDITIONAL_RULES: DbConditionalRule[] = [
  {
    id: 'rule-shopee-nao',
    form_id: 'form-shopee',
    source_question_id: 'q-vende',
    condition_value: 'Não',
    action_type: 'adicionar_tag',
    target_question_id: null,
    tag_to_add: 'Iniciante',
    temperature_to_set: null,
    status_to_set: null,
    created_at: new Date('2026-05-10T12:15:00Z').toISOString()
  },
  {
    id: 'rule-shopee-sim',
    form_id: 'form-shopee',
    source_question_id: 'q-vende',
    condition_value: 'Sim',
    action_type: 'adicionar_tag',
    target_question_id: null,
    tag_to_add: 'Já vende',
    temperature_to_set: null,
    status_to_set: null,
    created_at: new Date('2026-05-10T12:15:30Z').toISOString()
  },
  // Faturamento Quente rule
  {
    id: 'rule-fat-quente',
    form_id: 'form-shopee',
    source_question_id: 'q-faturamento',
    condition_value: 'R$ 20.000 a R$ 50.000',
    action_type: 'definir_temperatura',
    target_question_id: null,
    tag_to_add: null,
    temperature_to_set: 'Quente',
    status_to_set: null,
    created_at: new Date('2026-05-10T12:16:00Z').toISOString()
  },
  // Faturamento Muito Quente rule
  {
    id: 'rule-fat-mquente',
    form_id: 'form-shopee',
    source_question_id: 'q-faturamento',
    condition_value: 'Acima de R$ 50.000',
    action_type: 'definir_temperatura',
    target_question_id: null,
    tag_to_add: null,
    temperature_to_set: 'Muito quente',
    status_to_set: null,
    created_at: new Date('2026-05-10T12:16:30Z').toISOString()
  },
  // Programa tags rule
  {
    id: 'rule-prog-gestao',
    form_id: 'form-shopee',
    source_question_id: 'q-programa',
    condition_value: 'Gestão Completa',
    action_type: 'adicionar_tag',
    target_question_id: null,
    tag_to_add: 'Gestão',
    temperature_to_set: null,
    status_to_set: 'Novo',
    created_at: new Date('2026-05-10T12:17:00Z').toISOString()
  },
  {
    id: 'rule-prog-mentoria',
    form_id: 'form-shopee',
    source_question_id: 'q-programa',
    condition_value: 'Mentoria',
    action_type: 'adicionar_tag',
    target_question_id: null,
    tag_to_add: 'Mentoria',
    temperature_to_set: null,
    status_to_set: null,
    created_at: new Date('2026-05-10T12:17:30Z').toISOString()
  },
  {
    id: 'rule-prog-curso',
    form_id: 'form-shopee',
    source_question_id: 'q-programa',
    condition_value: 'Curso',
    action_type: 'adicionar_tag',
    target_question_id: null,
    tag_to_add: 'Curso',
    temperature_to_set: null,
    status_to_set: null,
    created_at: new Date('2026-05-10T12:18:00Z').toISOString()
  }
];

export const INITIAL_LEADS: DbLead[] = [
  {
    id: 'lead-1',
    form_id: 'form-shopee',
    name: 'Henrique Vasconcelos',
    phone: '5511999998888',
    email: 'henrique.vasc@gmail.com',
    status: 'Qualificado',
    temperature: 'Muito quente',
    responsible_user_id: 'user-1',
    summary: 'Lead já vende na Shopee, fatura mais de R$50.000/mês. Tem dificuldade crônica em impulsionar com anúncios pagos (Shopee Ads) e deseja chegar a R$200.000/mês. Busca Gestão Completa.',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'lead-2',
    form_id: 'form-shopee',
    name: 'Carolina Mendes de Souza',
    phone: '5521981234567',
    email: 'carolmendes@hotmail.com',
    status: 'Em atendimento',
    temperature: 'Quente',
    responsible_user_id: 'user-2',
    summary: 'Já possui loja física e começou a vender na Shopee recentemente, faturamento entre R$20.000 e R$50.000/mês. Busca Mentoria para expandir sua malha logística e organizar fornecedores.',
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
    updated_at: new Date(Date.now() - 11 * 3600 * 1000).toISOString()
  },
  {
    id: 'lead-3',
    form_id: 'form-shopee',
    name: 'Carlos Alberto Guedes',
    phone: '5531977771234',
    email: 'carlos.guedes.dec@outlook.com',
    status: 'Novo',
    temperature: 'Morno',
    responsible_user_id: null,
    summary: 'Iniciante, não vende na Shopee. Faturamento atual Iniciante. Tem interesse em curso, busca compreender como abrir conta de forma profissional e encontrar nichos de produtos viáveis.',
    created_at: new Date(Date.now() - 25 * 3600 * 1000).toISOString(), // 25 hours ago (~1 day ago) - warning yellow!
    updated_at: new Date(Date.now() - 25 * 3600 * 1000).toISOString()
  },
  {
    id: 'lead-4',
    form_id: 'form-shopee',
    name: 'Felipe Santana Lima',
    phone: '5541991112222',
    email: 'felipe.lima22@gmail.com',
    status: 'Agendado',
    temperature: 'Quente',
    responsible_user_id: 'user-3',
    summary: 'Já vende na plataforma, fatura em média R$35.000/mês. Maior obstáculo é precificação correta devido a taxas de frete grátis adicionais. Agendou bate-papo de mentoria para quarta-feira.',
    created_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString(), // 50 hours ago (>48 hours ago) - warning red!
    updated_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString()
  },
  {
    id: 'lead-5',
    form_id: 'form-shopee',
    name: 'Amanda Silveira Prates',
    phone: '5581988887777',
    email: 'amanda.prates.shopee@gmail.com',
    status: 'Comprou',
    temperature: 'Muito quente',
    responsible_user_id: 'user-1',
    summary: 'Lead qualificada com faturamento superior a R$50.000/mês. Entrou há 5 dias, realizou chamada de diagnóstico e fechou contrato de Gestão Completa de Tráfego e posicionamento.',
    created_at: new Date(Date.now() - 120 * 3600 * 1000).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString()
  },
  {
    id: 'lead-6',
    form_id: 'form-shopee',
    name: 'José Ricardo Nunes',
    phone: '5511976543210',
    email: 'josericardo.dev@yahoo.com.br',
    status: 'Perdido',
    temperature: 'Frio',
    responsible_user_id: 'user-2',
    summary: 'Iniciante, não vende na Shopee. Sem faturamento. Buscava curso, mas considerou o valor do investimento fora de sua realidade atual. Foi marcado como perdido em virtude do orçamento.',
    created_at: new Date(Date.now() - 140 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 130 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_LEAD_ANSWERS: DbLeadAnswer[] = [
  // Answers for Henrique (lead-1)
  { id: 'ans-1-name', lead_id: 'lead-1', question_id: 'q-nome', answer_value: 'Henrique Vasconcelos', created_at: new Date().toISOString() },
  { id: 'ans-1-wa', lead_id: 'lead-1', question_id: 'q-whatsapp', answer_value: '11999998888', created_at: new Date().toISOString() },
  { id: 'ans-1-mail', lead_id: 'lead-1', question_id: 'q-email', answer_value: 'henrique.vasc@gmail.com', created_at: new Date().toISOString() },
  { id: 'ans-1-vende', lead_id: 'lead-1', question_id: 'q-vende', answer_value: 'Sim', created_at: new Date().toISOString() },
  { id: 'ans-1-fat', lead_id: 'lead-1', question_id: 'q-faturamento', answer_value: 'Acima de R$ 50.000', created_at: new Date().toISOString() },
  { id: 'ans-1-dif', lead_id: 'lead-1', question_id: 'q-dificuldade', answer_value: 'Minha conta está estagnada em faturamento bruto e não consigo performar em anúncios pagos (Shopee Ads). Sinto que queimo dinheiro.', created_at: new Date().toISOString() },
  { id: 'ans-1-meta', lead_id: 'lead-1', question_id: 'q-meta', answer_value: 'R$ 200.000 mensais com margem controlada', created_at: new Date().toISOString() },
  { id: 'ans-1-dec', lead_id: 'lead-1', question_id: 'q-decisor', answer_value: 'Sim', created_at: new Date().toISOString() },
  { id: 'ans-1-prog', lead_id: 'lead-1', question_id: 'q-programa', answer_value: 'Gestão Completa', created_at: new Date().toISOString() },

  // Answers for Carolina (lead-2)
  { id: 'ans-2-name', lead_id: 'lead-2', question_id: 'q-nome', answer_value: 'Carolina Mendes de Souza', created_at: new Date().toISOString() },
  { id: 'ans-2-wa', lead_id: 'lead-2', question_id: 'q-whatsapp', answer_value: '21981234567', created_at: new Date().toISOString() },
  { id: 'ans-2-mail', lead_id: 'lead-2', question_id: 'q-email', answer_value: 'carolmendes@hotmail.com', created_at: new Date().toISOString() },
  { id: 'ans-2-vende', lead_id: 'lead-2', question_id: 'q-vende', answer_value: 'Sim', created_at: new Date().toISOString() },
  { id: 'ans-2-fat', lead_id: 'lead-2', question_id: 'q-faturamento', answer_value: 'R$ 20.000 a R$ 50.000', created_at: new Date().toISOString() },
  { id: 'ans-2-dif', lead_id: 'lead-2', question_id: 'q-dificuldade', answer_value: 'Tenho dificuldades em contratar pessoas de confiança para a expedição e estruturar compras grandes de importadores.', created_at: new Date().toISOString() },
  { id: 'ans-2-meta', lead_id: 'lead-2', question_id: 'q-meta', answer_value: 'R$ 100k/mês', created_at: new Date().toISOString() },
  { id: 'ans-2-dec', lead_id: 'lead-2', question_id: 'q-decisor', answer_value: 'Sim', created_at: new Date().toISOString() },
  { id: 'ans-2-prog', lead_id: 'lead-2', question_id: 'q-programa', answer_value: 'Mentoria', created_at: new Date().toISOString() }
];

export const INITIAL_LEAD_TAGS: DbLeadTag[] = [
  { id: 'tag-1-1', lead_id: 'lead-1', tag_name: 'Já vende', created_at: new Date().toISOString() },
  { id: 'tag-1-2', lead_id: 'lead-1', tag_name: 'Gestão', created_at: new Date().toISOString() },
  { id: 'tag-2-1', lead_id: 'lead-2', tag_name: 'Já vende', created_at: new Date().toISOString() },
  { id: 'tag-2-2', lead_id: 'lead-2', tag_name: 'Mentoria', created_at: new Date().toISOString() },
  { id: 'tag-3-1', lead_id: 'lead-3', tag_name: 'Iniciante', created_at: new Date().toISOString() },
  { id: 'tag-3-2', lead_id: 'lead-3', tag_name: 'Curso', created_at: new Date().toISOString() },
  { id: 'tag-4-1', lead_id: 'lead-4', tag_name: 'Já vende', created_at: new Date().toISOString() },
  { id: 'tag-4-2', lead_id: 'lead-4', tag_name: 'Mentoria', created_at: new Date().toISOString() },
  { id: 'tag-5-1', lead_id: 'lead-5', tag_name: 'Já vende', created_at: new Date().toISOString() },
  { id: 'tag-5-2', lead_id: 'lead-5', tag_name: 'Gestão', created_at: new Date().toISOString() },
  { id: 'tag-6-1', lead_id: 'lead-6', tag_name: 'Iniciante', created_at: new Date().toISOString() },
  { id: 'tag-6-2', lead_id: 'lead-6', tag_name: 'Curso', created_at: new Date().toISOString() }
];

export const INITIAL_LEAD_NOTES: DbLeadNote[] = [
  {
    id: 'note-1-1',
    lead_id: 'lead-1',
    user_id: 'user-1',
    note: 'Lead extremamente qualificado e consciente. Reunião pré-agendada pela Bruna. Faremos o pitch de assessoria direta.',
    created_at: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString()
  },
  {
    id: 'note-2-1',
    lead_id: 'lead-2',
    user_id: 'user-2',
    note: 'Entrei em contato inicial. Carolina é simpática, mas está muito ocupada operando a loja física pela tarde. Prefere receber áudios e interações no WhatsApp pela manhã.',
    created_at: new Date(Date.now() - 11.5 * 3600 * 1000).toISOString()
  },
  {
    id: 'note-5-1',
    lead_id: 'lead-5',
    user_id: 'user-1',
    note: 'Contrato assinado! Enviando onboarding de faturamento e chaves de acesso do Shopee Ads.',
    created_at: new Date(Date.now() - 98 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_LEAD_EVENTS: DbLeadEvent[] = [
  {
    id: 'evt-1-1',
    lead_id: 'lead-1',
    event_type: 'status_change',
    old_value: 'Novo',
    new_value: 'Qualificado',
    created_at: new Date(Date.now() - 2.8 * 3600 * 1000).toISOString()
  },
  {
    id: 'evt-1-2',
    lead_id: 'lead-1',
    event_type: 'assigned',
    old_value: 'Sem responsável',
    new_value: 'Edson Saldanha',
    created_at: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString()
  },
  {
    id: 'evt-2-1',
    lead_id: 'lead-2',
    event_type: 'status_change',
    old_value: 'Novo',
    new_value: 'Em atendimento',
    created_at: new Date(Date.now() - 11.8 * 3600 * 1000).toISOString()
  },
  {
    id: 'evt-5-1',
    lead_id: 'lead-5',
    event_type: 'status_change',
    old_value: 'Agendado',
    new_value: 'Comprou',
    created_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString()
  }
];
