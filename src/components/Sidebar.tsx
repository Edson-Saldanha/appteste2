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
  RefreshCw,
  Tag,
} from 'lucide-react';
import { useDb } from '../context/DbContext';

export type ActiveTab = 'dashboard' | 'forms' | 'rules' | 'leads' | 'kanban' | 'simulator' | 'etiquetas';

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
    { id: 'simulator', label: 'Simulador Público', icon: Eye, badge: 'Testar' },
    { id: 'etiquetas', label: 'Etiquetas de Envio', icon: Tag, badge: null }
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
          className="fixed inset-0 z-40 bg-blue-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpenMobileMenu(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-blue-950 px-5 py-4 transition-transform duration-300 lg:static lg:translate-x-0 border-r border-blue-900
        ${openMobileMenu ? 'translate-x-0' : '-translate-x-full'}
      `} id="app-sidebar">

        {/* LOGO */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-blue-800/60">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400 text-blue-950 font-mono text-sm font-black shadow-md shadow-lime-400/20">
            AF
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-white tracking-tight leading-none">Aplix FORM</h1>
            <span className="text-4xs text-blue-300 font-bold uppercase tracking-wider block mt-1">Smart CRM Platform</span>
          </div>
        </div>

        {/* ACTIVE MODULE HIGHLIGHT */}
        <div className="mt-4 rounded-xl bg-blue-900/60 p-3 border border-blue-800/50">
          <div className="flex items-center justify-between text-xs text-blue-300 font-medium">
            <span>Status da Operação</span>
            <span className="flex h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-blue-100">Formulários Ativos:</span>
            <span className="font-mono text-sm font-bold text-lime-400">{activeFormsCount}</span>
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
                    ? 'bg-lime-400/15 text-lime-300 border border-lime-400/30'
                    : 'text-blue-200 hover:bg-blue-800/50 hover:text-white border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${isActive ? 'text-lime-400' : 'text-blue-400 group-hover:text-blue-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`
                    rounded-full px-2 py-0.5 text-2xs font-mono font-bold
                    ${isActive
                      ? 'bg-lime-400/25 text-lime-300'
                      : (typeof item.badge === 'string' ? 'bg-lime-400 text-blue-950 animate-bounce' : 'bg-blue-800 text-blue-300')}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* PRO PLAN BOX */}
        <div className="mt-4 p-4 rounded-xl bg-blue-900 border border-blue-800 text-white text-xs">
          <p className="font-semibold text-white opacity-90">Plano Pro Ativo</p>
          <p className="text-blue-300 text-3xs mt-0.5">1.240 / 5.000 leads captados</p>
          <div className="w-full bg-blue-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-lime-400 h-full w-[24.8%]"></div>
          </div>
        </div>

        {/* SEPARATOR */}
        <div className="h-px bg-blue-800/60 my-4" />

        {/* SEED DATA RESTORE BUTTON */}
        <button
          id="btn-sidebar-reset"
          onClick={resetToDefaults}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-900/20 hover:text-red-300 transition"
        >
          <RefreshCw className="h-4.5 w-4.5 text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Resetar Dados de Exemplo</span>
        </button>

        {/* USER PROFILE INFO FOOTER */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-900/60 p-3 border border-blue-800/50">
          <div className="flex items-center gap-2.5">
            <img
              referrerPolicy="no-referrer"
              src={currentUser.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full border-2 border-lime-400/30 object-cover"
            />
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-white leading-tight">{currentUser.name}</p>
              <p className="truncate text-4xs font-mono text-blue-300 mt-0.5">{currentUser.email}</p>
              <span className="inline-block rounded-md bg-lime-400/15 px-1.5 py-0.5 text-5xs font-semibold text-lime-300 capitalize mt-1">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
