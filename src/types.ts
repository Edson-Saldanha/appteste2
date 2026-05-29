/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DbUser {
  id: string; // UUID in Supabase
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

export type FormStatus = 'rascunho' | 'ativo' | 'pausado';

export interface DbForm {
  id: string;
  name: string;
  description: string;
  status: FormStatus;
  logo_url: string;
  primary_color: string; // hex
  secondary_color: string; // hex
  button_text: string;
  initial_message: string;
  final_message: string;
  public_slug: string;
  created_at: string;
  updated_at: string;
}

export type QuestionFieldType = 
  | 'texto_curto'
  | 'texto_longo'
  | 'telefone'
  | 'email'
  | 'numero'
  | 'escolha_unica'
  | 'multipla_escolha'
  | 'caixa_selecao'
  | 'data';

export interface DbFormQuestion {
  id: string;
  form_id: string;
  question_text: string;
  question_description: string;
  field_type: QuestionFieldType;
  is_required: boolean;
  order_index: number;
  created_at: string;
}

export interface DbFormQuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  order_index: number;
}

export type RuleActionType = 
  | 'ir_para_pergunta'
  | 'adicionar_tag'
  | 'definir_temperatura'
  | 'definir_status_inicial';

export type LeadTemperature = 'Frio' | 'Morno' | 'Quente' | 'Muito quente';

export type LeadStatus = 
  | 'Novo'
  | 'Em atendimento'
  | 'Qualificado'
  | 'Agendado'
  | 'Comprou'
  | 'Perdido'
  | 'Sem resposta';

export interface DbConditionalRule {
  id: string;
  form_id: string;
  source_question_id: string;
  condition_value: string; // text representation of option or exact match
  action_type: RuleActionType;
  target_question_id: string | null; // used if action_type is 'ir_para_pergunta'
  tag_to_add: string | null;          // used if action_type is 'adicionar_tag'
  temperature_to_set: LeadTemperature | null; // 'definir_temperatura'
  status_to_set: LeadStatus | null;           // 'definir_status_inicial'
  created_at: string;
}

export interface DbLead {
  id: string;
  form_id: string;
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  temperature: LeadTemperature;
  responsible_user_id: string | null;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface DbLeadAnswer {
  id: string;
  lead_id: string;
  question_id: string;
  answer_value: string; // JSON or comma-separated if multiple choice
  created_at: string;
}

export interface DbLeadTag {
  id: string;
  lead_id: string;
  tag_name: string;
  created_at: string;
}

export interface DbLeadNote {
  id: string;
  lead_id: string;
  user_id: string;
  note: string;
  created_at: string;
}

export interface DbLeadEvent {
  id: string;
  lead_id: string;
  event_type: string; // e.g. 'status_change', 'temperature_change', 'note_added', 'assigned'
  old_value: string;
  new_value: string;
  created_at: string;
}
