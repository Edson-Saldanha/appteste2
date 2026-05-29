/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DbProvider, useDb } from './context/DbContext';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FormCreator } from './components/FormCreator';
import { RuleManager } from './components/RuleManager';
import { LeadManager } from './components/LeadManager';
import { LeadKanban } from './components/LeadKanban';
import { PublicFormView } from './components/PublicFormView';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const [selectedFormForTest, setSelectedFormForTest] = useState<string | null>(null);

  const { forms, leads } = useDb();

  const handleTestFormRedirect = (id: string) => {
    setSelectedFormForTest(id);
    setActiveTab('simulator');
  };

  return (
    <div className="flex min-h-screen bg-slate-100" id="app-shell">

      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'simulator') {
            setSelectedFormForTest(null);
          }
        }}
        openMobileMenu={openMobileMenu}
        setOpenMobileMenu={setOpenMobileMenu}
      />

      {/* CORE FRAME CONTENT */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* TOP NAV BAR */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8 shadow-sm z-30" id="app-header">
          <div className="flex items-center gap-4">
            {/* Hamburger Mobile Menu */}
            <button
              id="btn-mobile-hamburger"
              onClick={() => setOpenMobileMenu(prev => !prev)}
              className="rounded-lg p-1.5 text-blue-950 hover:bg-slate-100 transition lg:hidden"
            >
              {openMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Context title */}
            <div className="hidden sm:block">
              <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-widest leading-none">Ambiente Comercial</span>
              <h2 className="text-xs font-bold text-blue-950 mt-0.5" id="header-context-indicator">
                {activeTab === 'dashboard' && '📈 Monitor de Indicadores'}
                {activeTab === 'forms' && '🛠️ Painel de Customização de Formulários'}
                {activeTab === 'rules' && '🔀 Central de Regras e Lógica'}
                {activeTab === 'leads' && '👥 Feed de Contatos e Leads'}
                {activeTab === 'kanban' && '📋 Funil de Atendimento Comercial'}
                {activeTab === 'simulator' && '⚡ Simulador de Respostas do Lead'}
              </h2>
            </div>
          </div>

          {/* RIGHT METADATA */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 bg-blue-950 border border-blue-900 px-3 py-1.5 rounded-full text-4xs font-mono text-white font-bold uppercase tracking-wide">
              <span>Leads na Fila:</span>
              <span className="text-lime-400 block">{leads.filter(l => l.status === 'Novo').length}</span>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden md:block" />

            <div className="flex items-center gap-1.5 bg-lime-50 text-lime-700 border border-lime-200 px-3 py-1.5 rounded-full text-4xs font-black uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse" />
              <span>Base Local Pronta</span>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 z-10" id="app-main-viewport">
          <div className="w-full max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'forms' && <FormCreator onTestForm={handleTestFormRedirect} />}
            {activeTab === 'rules' && <RuleManager />}
            {activeTab === 'leads' && <LeadManager />}
            {activeTab === 'kanban' && <LeadKanban />}
            {activeTab === 'simulator' && <PublicFormView initialFormId={selectedFormForTest} />}
          </div>
        </main>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <DbProvider>
      <AppContent />
    </DbProvider>
  );
}
