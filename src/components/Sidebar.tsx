/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  FileCode, 
  GitFork, 
  Users, 
  Trello, 
  Eye, 
  Settings2, 
  RefreshCw,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useDb } from '../context/DbContext';

export type ActiveTab = 'dashboard' | 'forms' | 'rules' | 'leads' | 'kanban' | 'simulator';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openMobileMenu: boolean;
  setOpenMobileMenu: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  openMobileMenu, 
  setOpenMobileMenu 
}) => {
  const { forms, leads, currentUser, resetToDefaults } = useDb();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'forms', label: 'Formulários', icon: FileCode, badge: forms.length },
    { id: 'rules', label: 'Regras Condicionais', icon: GitFork, badge: null },
    { id: 'leads', label: 'Gestão de Leads', icon: Users, badge: leads.length },
    { id: 'kanban', label: 'Kanban Comercial', icon: Trello, badge: leads.filter(l => l.status !== 'Comprou' && l.status !== 'Perdido').length },
    { id: 'simulator', label: 'Simulador Público', icon: Eye, badge: 'Testar' }
  ] as const;

  const handleNav = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setOpenMobileMenu(false);
  };

  const activeFormsCount = forms.filter(f => f.status === 'ativo').length;

  return (
    <>
      {/* Mobile Backdrop */}
      {openMobileMenu && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpenMobileMenu(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white px-5 py-4 transition-transform duration-300 lg:static lg:translate-x-0
        ${openMobileMenu ? 'translate-x-0' : '-translate-x-full'}
      `} id="app-sidebar">
        {/* LOGO */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-mono text-lg font-bold shadow-md shadow-indigo-600/20">
            LF
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-slate-800 tracking-tight leading-none">LeadFlow AI</h1>
            <span className="text-4xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Smart CRM Platform</span>
          </div>
        </div>

        {/* ACTIVE MODULE HIGHLIGHT */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Status da Operação</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-slate-650">Formulários Ativos:</span>
            <span className="font-mono text-sm font-bold text-indigo-600">{activeFormsCount}</span>
          </div>
        </div>

        {/* NAV LIST */}
        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`
                  flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all group
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-3xs font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`
                    rounded-full px-2 py-0.5 text-2xs font-mono font-bold
                    ${isActive 
                      ? 'bg-indigo-250 text-indigo-800' 
                      : (typeof item.badge === 'string' ? 'bg-indigo-600 text-white animate-bounce' : 'bg-slate-100 text-slate-600')}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* PRO PLAN BOX */}
        <div className="mt-4 p-4 rounded-xl bg-indigo-900 text-white text-xs">
          <p className="font-semibold opacity-90">Plano Pro Ativo</p>
          <p className="text-indigo-300 text-3xs mt-0.5">1.240 / 5.000 leads captados</p>
          <div className="w-full bg-indigo-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-indigo-400 h-full w-[24.8%]"></div>
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="h-px bg-slate-100 my-4" />

        {/* SEED DATA RESTORE BUTTON */}
        <button
          id="btn-sidebar-reset"
          onClick={resetToDefaults}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition"
        >
          <RefreshCw className="h-4.5 w-4.5 text-red-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Resetar Dados de Exemplo</span>
        </button>

        {/* USER PROFILE INFO FOOTER */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="flex items-center gap-2.5">
            <img 
              referrerPolicy="no-referrer"
              src={currentUser.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="truncate text-4xs font-mono text-slate-400 mt-0.5">{currentUser.email}</p>
              <span className="inline-block rounded-md bg-slate-200/60 px-1.5 py-0.5 text-5xs font-semibold text-slate-600 capitalize mt-1">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
