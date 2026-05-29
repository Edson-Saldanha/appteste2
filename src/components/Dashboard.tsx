/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle, 
  HelpCircle, 
  Flame, 
  Filter,
  Layers,
  ChevronDown,
  Percent,
  TrendingDown
} from 'lucide-react';
import { useDb } from '../context/DbContext';
import { LeadStatus, LeadTemperature } from '../types';

type DateFilterOption = 'hoje' | '7d' | '30d' | 'mes' | 'todo';

export const Dashboard: React.FC = () => {
  const { leads, forms } = useDb();
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('todo');

  // Custom Date range filter implementation
  const filteredLeads = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = todayStart - 30 * 24 * 60 * 60 * 1000;
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return leads.filter(lead => {
      const leadTime = new Date(lead.created_at).getTime();
      switch (dateFilter) {
        case 'hoje':
          return leadTime >= todayStart;
        case '7d':
          return leadTime >= sevenDaysAgo;
        case '30d':
          return leadTime >= thirtyDaysAgo;
        case 'mes':
          return leadTime >= thisMonthStart;
        case 'todo':
        default:
          return true;
      }
    });
  }, [leads, dateFilter]);

  // Calculations for Metrics
  const metrics = useMemo(() => {
    const total = filteredLeads.length;
    
    // Calculate Today, last 7, Monthly limits inside active set
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
    
    const countToday = leads.filter(l => new Date(l.created_at).getTime() >= todayStart).length;
    const count7d = leads.filter(l => new Date(l.created_at).getTime() >= sevenDaysAgo).length;
    const countMonth = leads.filter(l => {
      const d = new Date(l.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const activeFormsCount = forms.filter(f => f.status === 'ativo').length;
    const qualifiedCount = filteredLeads.filter(l => l.status === 'Qualificado').length;
    const pendingCount = filteredLeads.filter(l => l.status === 'Novo').length;

    // Conversion rate: status was Comprou
    const wins = filteredLeads.filter(l => l.status === 'Comprou').length;
    const losses = filteredLeads.filter(l => l.status === 'Perdido').length;
    const closedCount = wins + losses;
    
    // Client-side simulated conversion rate: closed deals or total leads
    const conversionRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    return {
      total,
      countToday,
      count7d,
      countMonth,
      activeFormsCount,
      qualifiedCount,
      pendingCount,
      conversionRate,
      wins
    };
  }, [filteredLeads, leads, forms]);

  // Charts data aggregation inside filtered set
  const temperatureChartData = useMemo(() => {
    const dataset: Record<LeadTemperature, number> = {
      'Frio': 0,
      'Morno': 0,
      'Quente': 0,
      'Muito quente': 0
    };
    filteredLeads.forEach(l => {
      if (dataset[l.temperature] !== undefined) {
        dataset[l.temperature]++;
      }
    });
    return Object.entries(dataset) as [LeadTemperature, number][];
  }, [filteredLeads]);

  const statusChartData = useMemo(() => {
    const dataset: Record<LeadStatus, number> = {
      'Novo': 0,
      'Em atendimento': 0,
      'Qualificado': 0,
      'Agendado': 0,
      'Comprou': 0,
      'Perdido': 0,
      'Sem resposta': 0
    };
    filteredLeads.forEach(l => {
      if (dataset[l.status] !== undefined) {
        dataset[l.status]++;
      }
    });
    return Object.entries(dataset) as [LeadStatus, number][];
  }, [filteredLeads]);

  const formChartData = useMemo(() => {
    const dataset: Record<string, number> = {};
    // Seed with names from available forms
    forms.forEach(f => {
      dataset[f.name] = 0;
    });
    filteredLeads.forEach(l => {
      const matchForm = forms.find(f => f.id === l.form_id);
      const name = matchForm ? matchForm.name : 'Outro';
      dataset[name] = (dataset[name] || 0) + 1;
    });
    return Object.entries(dataset).sort((a,b) => b[1] - a[1]);
  }, [filteredLeads, forms]);

  // Aggregate leads by day (last 7 calendar days)
  const leadsByDayData = useMemo(() => {
    const result: { dateLabel: string; count: number }[] = [];
    const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = weekdayLabels[d.getDay()];
      const dayString = d.getDate().toString().padStart(2, '0') + '/' + (d.getMonth() + 1).toString().padStart(2, '0');
      
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      
      const count = leads.filter(l => {
        const time = new Date(l.created_at).getTime();
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        const end = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate()).getTime();
        return time >= start && time < end;
      }).length;

      result.push({
        dateLabel: `${dayName} (${dayString})`,
        count
      });
    }
    return result;
  }, [leads]);

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* HEADER SECTION WITH FILTER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight" id="dashboard-title">Dashboard Analítico</h2>
          <p className="text-sm text-slate-500">Métricas de performance, taxa de fechamento e conversões em tempo real.</p>
        </div>
        
        {/* Date Filter selector */}
        <div className="flex items-center gap-2 self-start bg-white rounded-xl border border-slate-200 p-1 shadow-xs">
          {(
            [
              { id: 'todo', label: 'Tudo' },
              { id: 'hoje', label: 'Hoje' },
              { id: '7d', label: '7 Dias' },
              { id: '30d', label: '30 Dias' },
              { id: 'mes', label: 'Este Mês' }
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              id={`btn-filter-${opt.id}`}
              onClick={() => setDateFilter(opt.id)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all
                ${dateFilter === opt.id 
                  ? 'bg-blue-950 text-lime-400 shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL LEADS */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-150 shadow-xs hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total de Leads</span>
            <div className="rounded-xl bg-lime-50/75 p-2.5 text-lime-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-slate-800 font-mono tracking-tight">{metrics.total}</span>
            <span className="text-xs font-mono text-slate-400">filtrados</span>
          </div>
          <div className="mt-2 text-2xs text-slate-500 font-medium">
            Entradas totais acumuladas no sistema
          </div>
        </div>

        {/* CADENCE METRICS (TODAY VS 7 DAYS) */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-150 shadow-xs hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Taxa de Captação</span>
            <div className="rounded-xl bg-lime-50 p-2.5 text-lime-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Hoje:</span>
              <span className="font-mono text-sm font-bold text-emerald-600">+{metrics.countToday} leads</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Últimos 7 dias:</span>
              <span className="font-mono text-sm font-bold text-lime-600">+{metrics.count7d}</span>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-2 text-5xs font-mono text-slate-400 uppercase tracking-widest text-right">
            acumulado mês: {metrics.countMonth}
          </div>
        </div>

        {/* QUALIFIED & WAITING */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-150 shadow-xs hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Qualificação Comercial</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Qualificados:</span>
              <span className="font-mono text-sm font-bold text-slate-800">{metrics.qualifiedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Aguardando atendimento:</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-lime-600">
                {metrics.pendingCount}
                <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
              </span>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-2 text-5xs font-mono text-slate-400 uppercase tracking-widest text-right">
            formulários ativos: {metrics.activeFormsCount}
          </div>
        </div>

        {/* CONVERSION RATIO */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 to-blue-700 p-5 text-white shadow-md shadow-blue-950/10 hover:shadow-lg transition duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-lime-100">Conversão de Vendas</span>
            <div className="rounded-xl bg-white/20 p-2.5 text-white">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-display font-extrabold tracking-tight">{metrics.conversionRate}%</span>
            <span className="text-xs font-medium text-lime-100">da base</span>
          </div>
          <div className="mt-2 text-2xs text-lime-200 leading-relaxed font-semibold">
            {metrics.wins} contratos fechados de {metrics.total} leads na amostragem geral.
          </div>
        </div>
      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* LEADS BY DAY HISTOGRAM - SVG POWERED */}
        <div className="rounded-2xl border border-slate-150 bg-white p-5 lg:col-span-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-bold text-slate-700">Leads por Dia</h3>
              <p className="text-2xs text-slate-400">Total de inscrições recebidas de forma contínua nos últimos 7 dias.</p>
            </div>
            <div className="flex items-center gap-1.5 text-2xs text-slate-400 font-semibold font-mono bg-slate-50 border border-slate-200 rounded px-2 py-0.5">
              <Calendar className="h-3 w-3" />
              <span>Semanal</span>
            </div>
          </div>

          <div className="mt-6 flex h-60 items-end justify-between px-3 relative">
            {/* Grid background lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-3xs font-mono text-slate-300">
              <div className="border-b border-dashed border-slate-100 w-full" />
              <div className="border-b border-dashed border-slate-100 w-full" />
              <div className="border-b border-dashed border-slate-100 w-full" />
              <div className="w-full" /> {/* label baseline spacer */}
            </div>

            {leadsByDayData.map((day, idx) => {
              const maxCount = Math.max(...leadsByDayData.map(d => d.count), 1);
              const percentHeight = Math.max((day.count / maxCount) * 75, 4); // minimum visual height for zeros
              return (
                <div key={idx} className="group relative flex flex-1 flex-col items-center z-10">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-800 text-white font-mono text-2xs font-bold rounded py-1 px-2.5 shadow-md pointer-events-none whitespace-nowrap">
                    {day.count} {day.count === 1 ? 'lead' : 'leads'}
                  </div>
                  
                  {/* Dynamic height bar */}
                  <div 
                    className="w-8 rounded-t-md bg-lime-500 group-hover:bg-lime-400 transition-all duration-300 shadow-sm shadow-blue-950/10 group-hover:shadow-md group-hover:shadow-lime-400/20"
                    style={{ height: `${percentHeight}%` }}
                  />
                  
                  {/* Labels */}
                  <span className="mt-3 font-semibold text-2xs text-slate-500 group-hover:text-slate-800 transition">
                    {day.dateLabel.split(' ')[0]}
                  </span>
                  <span className="font-mono text-3xs text-slate-400 mt-0.5">
                    {day.dateLabel.split(' ')[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STATUS DISTRIBUTION & TEMPERATURE BREAKDOWN CO-GRID */}
        <div className="rounded-2xl border border-slate-150 bg-white p-5 lg:col-span-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-slate-700">Temperatura da Base</h3>
              <p className="text-2xs text-slate-400">Pontuação termométrica calculada via regras inteligentes.</p>
            </div>
            
            {/* Horizontal progress indicators */}
            <div className="mt-5 space-y-4">
              {temperatureChartData.map(([temp, val]) => {
                const totalFiltered = filteredLeads.length || 1;
                const ratio = Math.round((val / totalFiltered) * 100);
                
                // Colors dictionary
                const colorMap = {
                  'Frio': { bg: 'bg-blue-500/10', bar: 'bg-blue-500', text: 'text-blue-700 border-blue-200' },
                  'Morno': { bg: 'bg-yellow-500/10', bar: 'bg-amber-500', text: 'text-amber-700 border-amber-200' },
                  'Quente': { bg: 'bg-orange-500/10', bar: 'bg-orange-500', text: 'text-orange-700 border-orange-200' },
                  'Muito quente': { bg: 'bg-red-500/10', bar: 'bg-red-600', text: 'text-red-700 border-red-200' }
                };

                const styled = colorMap[temp];

                return (
                  <div key={temp} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Flame className={`h-3.5 w-3.5 ${styled.bar.replace('bg-', 'text-')}`} />
                        <span>{temp}</span>
                      </div>
                      <div className="font-mono text-slate-400">
                        <span className="font-bold text-slate-700">{val}</span> ({ratio}%)
                      </div>
                    </div>
                    {/* Visual Bar tracks */}
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${styled.bar} transition-all duration-500`}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between text-3xs font-mono text-slate-400 uppercase tracking-wider">
              <span>Leads Quentes</span>
              <span className="font-bold text-lime-600 block">
                {filteredLeads.filter(l => l.temperature === 'Quente' || l.temperature === 'Muito quente').length}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* LOWER GRIDS: BY FORM SOURCE, AND STEP DISTRIBUTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEADS BY FORM */}
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-xs">
          <h3 className="font-display font-bold text-slate-750 pb-2 border-b border-slate-100">Leads por Canal / Formulário</h3>
          <p className="text-2xs text-slate-400 mt-1">Identificação das fontes de tráfego que mais engajam e captam dados.</p>
          
          <div className="mt-5 space-y-3.5">
            {formChartData.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">Nenhum dado captado para o período selecionado.</p>
            ) : (
              formChartData.map(([formName, count]) => {
                const totalFiltered = filteredLeads.length || 1;
                const ratio = Math.round((count / totalFiltered) * 100);
                return (
                  <div key={formName} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                        <span className="truncate max-w-[280px]">{formName}</span>
                        <span className="font-mono text-2xs text-slate-500">{count} leads ({ratio}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div 
                          className="h-full bg-lime-500 rounded-full transition-all duration-500" 
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* STATUS DISTRIB LIST WITH CODES */}
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-xs">
          <h3 className="font-display font-bold text-slate-750 pb-2 border-b border-slate-100">Fluxo do Funil de Atendimento</h3>
          <p className="text-2xs text-slate-400 mt-1">Mapeamento das etapas ativas e taxas de retenção no funil comercial.</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {statusChartData.map(([statusName, val]) => {
              const totalFiltered = filteredLeads.length || 1;
              const ratio = Math.round((val / totalFiltered) * 100);
              
              // Custom colors matching Kanban columns
              const statusColors: Record<LeadStatus, string> = {
                'Novo': 'border-l-blue-800 bg-lime-50/40 text-blue-900',
                'Em atendimento': 'border-l-sky-500 bg-sky-50/40 text-sky-700',
                'Qualificado': 'border-l-teal-500 bg-teal-50/40 text-teal-700',
                'Agendado': 'border-l-purple-500 bg-purple-50/40 text-purple-700',
                'Comprou': 'border-l-emerald-500 bg-emerald-50/40 text-emerald-700',
                'Perdido': 'border-l-rose-500 bg-rose-50/40 text-rose-700',
                'Sem resposta': 'border-l-slate-400 bg-slate-100/60 text-slate-600'
              };

              return (
                <div 
                  key={statusName} 
                  className={`border-l-3 rounded-r-xl p-3 flex flex-col justify-between hover:shadow-xs transition duration-150 ${statusColors[statusName as LeadStatus]}`}
                >
                  <span className="text-xs font-bold leading-tight">{statusName}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-mono text-sm font-black">{val}</span>
                    <span className="font-mono text-3xs font-semibold opacity-70">{ratio}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
