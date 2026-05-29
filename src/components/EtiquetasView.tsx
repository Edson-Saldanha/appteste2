/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Package, CheckSquare, Square, Printer, Search, MapPin, User, Hash } from 'lucide-react';

interface ChecklistItem {
  produto: string;
  variacao: string;
  qnt: number;
  sku: string;
  checked: boolean;
}

interface Etiqueta {
  id: string;
  nf: string;
  serie: string;
  emissao: string;
  chaveNF: string;
  rota1: string;
  rota2: string;
  cidade: string;
  extra?: string;
  pedidoId: string;
  tipo: 'RESIDENCIAL' | 'COMERCIAL' | '';
  destinatario: {
    nome: string;
    endereco: string;
    bairro: string;
    cep: string;
  };
  rastreio: string;
  envio: string;
  checklist: ChecklistItem[];
}

const ETIQUETAS_INICIAIS: Etiqueta[] = [
  {
    id: '132529',
    nf: '132529',
    serie: '1',
    emissao: '28-05-2026 18:59:03',
    chaveNF: '31260508296887000119550010001325291710527587',
    rota1: 'SP5 -2',
    rota2: 'LMG-48',
    cidade: 'Catalão',
    extra: 'Guilhe 6/3\nTLZ-01',
    pedidoId: '260527GTCQ93PB',
    tipo: 'RESIDENCIAL',
    destinatario: {
      nome: 'DAIANNY ALVES MARIANO SILVA',
      endereco: 'Rua Pedro Afonso, 294, Casa 2 portão de garagem verde, Catalão, Goiás',
      bairro: 'Pio Gomes',
      cep: '75712-120',
    },
    rastreio: 'BR265123809634A',
    envio: '29/05/2026',
    checklist: [
      { produto: 'Teclado Mouse Gamer Multimídia Lateral USB ABNT2 Teclas Destacadas', variacao: 'CONJUNTO GAMER - VERMELHO', qnt: 1, sku: 'KITTEMG3', checked: false },
    ],
  },
  {
    id: '132530',
    nf: '132530',
    serie: '1',
    emissao: '28-05-2026 18:59:05',
    chaveNF: '31260508296887000119550010001325301710527618',
    rota1: 'BA2 -2',
    rota2: 'LBA-18',
    cidade: 'Salvador',
    pedidoId: '260529KXYFXBXC',
    tipo: 'RESIDENCIAL',
    destinatario: {
      nome: 'Sérgio Luis Santos',
      endereco: 'Rua Samuel, 369, Salvador, Bahia',
      bairro: 'Sussuarana',
      cep: '41213-470',
    },
    rastreio: 'BR262111821486L',
    envio: '29/05/2026',
    checklist: [
      { produto: 'Alicate de Crimpar RJ45/RJ12/RJ11 Internet Telefone Decapador Cabo Kit Plug RJ45', variacao: 'ALICATE + 10 PLUG RJ45', qnt: 1, sku: 'ALIGRI10P2', checked: false },
    ],
  },
  {
    id: '132531',
    nf: '132531',
    serie: '1',
    emissao: '28-05-2026 18:59:07',
    chaveNF: '31260508296887000119550010001325311710527666',
    rota1: 'BA2 -2',
    rota2: 'LBA-18',
    cidade: 'Salvador',
    pedidoId: '260529KYQEN8Y0',
    tipo: 'RESIDENCIAL',
    destinatario: {
      nome: 'Valquiria Reis',
      endereco: 'Avenida Hilda, 25, Casa, Salvador, Bahia',
      bairro: 'Ribeira',
      cep: '40420-010',
    },
    rastreio: 'BR261073568028M',
    envio: '29/05/2026',
    checklist: [
      { produto: 'Cabo Hdmi 2.0 Fullhd 1080p 1,5 Metros Compatível Com Consoles Tv Nootbook Computador', variacao: '', qnt: 2, sku: 'CBOHDMIII', checked: false },
    ],
  },
  {
    id: '132532',
    nf: '132532',
    serie: '1',
    emissao: '28-05-2026 18:59:09',
    chaveNF: '31260508296887000119550010001325321710527671',
    rota1: 'RJ2 -2',
    rota2: 'LES-01',
    cidade: 'Itapemirim',
    pedidoId: '260529M0431K4E',
    tipo: 'RESIDENCIAL',
    destinatario: {
      nome: 'Geraldo José Farias Barboza',
      endereco: 'Rua Castro Alves, 426, Entrar ao lado do Banestes, Itapemirim, Espírito Santo',
      bairro: 'Itaipava',
      cep: '29330-000',
    },
    rastreio: 'BR269185547770G',
    envio: '29/05/2026',
    checklist: [
      { produto: 'Cabo Rede De Internet CAT5E Velocidade Alta 30 Metros Azul Rj45', variacao: '30 Metros', qnt: 1, sku: 'CRB30M7', checked: false },
    ],
  },
  {
    id: '132533',
    nf: '132533',
    serie: '1',
    emissao: '28-05-2026 18:59:11',
    chaveNF: '31260508296887000119550010001325331710527687',
    rota1: 'RJ2 -2',
    rota2: 'LRJ-23',
    cidade: 'Niterói',
    pedidoId: '260529M4E1JEJV',
    tipo: 'COMERCIAL',
    destinatario: {
      nome: 'Gleucia De Sousa Feitosa',
      endereco: 'Rua Mato Grosso, 205, Padaria do Mário, Niterói, Rio de Janeiro',
      bairro: 'Sapê',
      cep: '24315-460',
    },
    rastreio: 'BR2651460594860',
    envio: '29/05/2026',
    checklist: [
      { produto: 'Antena Digital Tv Interna Externa Amplificada 5 Metros HDTV 4k Exbom', variacao: 'ANTENA 5M REFORÇADA', qnt: 1, sku: 'ANDI5MGREX1', checked: false },
    ],
  },
  {
    id: '132534',
    nf: '132534',
    serie: '1',
    emissao: '28-05-2026 18:59:13',
    chaveNF: '31260508296887000119550010001325341710527714',
    rota1: '3PL-08',
    rota2: 'LMG-62',
    cidade: 'Betim',
    pedidoId: '260529M52KJU7B',
    tipo: '',
    destinatario: {
      nome: 'Ronaldo Quirino',
      endereco: 'Rua Vitória, 242 B, Betim, Minas Gerais',
      bairro: 'Jardim Teresópolis',
      cep: '32681-526',
    },
    rastreio: 'BR265250462797W',
    envio: '29/05/2026',
    checklist: [
      { produto: 'Kit CABO SATA 3.0 6Gb/s Flexível com Trava de Segurança Alta Velocidade HDs SSDs Computador', variacao: 'Vermelho, 3 uni.', qnt: 1, sku: 'CSATA3U3', checked: false },
    ],
  },
];

export const EtiquetasView: React.FC = () => {
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>(ETIQUETAS_INICIAIS);
  const [busca, setBusca] = useState('');

  const toggleItem = (etiquetaId: string, itemIdx: number) => {
    setEtiquetas(prev =>
      prev.map(et => {
        if (et.id !== etiquetaId) return et;
        return {
          ...et,
          checklist: et.checklist.map((item, i) =>
            i === itemIdx ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
  };

  const filtradas = etiquetas.filter(et =>
    busca === '' ||
    et.destinatario.nome.toLowerCase().includes(busca.toLowerCase()) ||
    et.pedidoId.toLowerCase().includes(busca.toLowerCase()) ||
    et.nf.includes(busca) ||
    et.rastreio.toLowerCase().includes(busca.toLowerCase())
  );

  const totalItens = etiquetas.reduce((acc, et) => acc + et.checklist.length, 0);
  const totalChecados = etiquetas.reduce((acc, et) => acc + et.checklist.filter(i => i.checked).length, 0);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="font-display text-2xl font-bold text-slate-800 tracking-tight">Etiquetas de Envio</h2>
        <p className="text-sm text-slate-500 mt-1">
          Visualize cada etiqueta de envio e confirme os itens do checklist de carregamento antes de despachar.
        </p>
      </div>

      {/* STATS + SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block">Pedidos</span>
            <span className="text-lg font-black text-slate-800 font-mono">{etiquetas.length}</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block">Itens Conferidos</span>
            <span className="text-lg font-black font-mono">
              <span className={totalChecados === totalItens && totalItens > 0 ? 'text-emerald-600' : 'text-slate-800'}>
                {totalChecados}
              </span>
              <span className="text-slate-300 text-sm"> / {totalItens}</span>
            </span>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, pedido, NF, rastreio..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-lime-500 text-slate-700"
          />
        </div>
      </div>

      {/* ETIQUETAS LIST */}
      <div className="space-y-8">
        {filtradas.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400 text-sm font-semibold">
            Nenhuma etiqueta encontrada.
          </div>
        )}

        {filtradas.map(et => {
          const allChecked = et.checklist.length > 0 && et.checklist.every(i => i.checked);
          const someChecked = et.checklist.some(i => i.checked);

          return (
            <div key={et.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">

              {/* ─── ETIQUETA ─── */}
              <div className="border-b border-dashed border-slate-300 bg-white p-5">

                {/* NF header bar */}
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-3xs font-black uppercase tracking-widest text-slate-400">DANFE SIMPLIFICADO · ETIQUETA</span>
                    <span className="text-3xs font-mono bg-slate-100 rounded px-1.5 py-0.5 text-slate-500">1 - Saída</span>
                  </div>
                  <div className="flex items-center gap-3 text-3xs text-slate-400 font-mono">
                    <span><strong className="text-slate-600">NF:</strong> {et.nf}</span>
                    <span><strong className="text-slate-600">Série:</strong> {et.serie}</span>
                    <span><strong className="text-slate-600">Emissão:</strong> {et.emissao}</span>
                  </div>
                </div>

                {/* Chave NF */}
                <div className="text-center font-mono text-3xs text-slate-400 tracking-widest mb-4 break-all">
                  {et.chaveNF}
                </div>

                <div className="flex gap-4 flex-col sm:flex-row">
                  {/* LEFT: Destinatário */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xs font-black uppercase tracking-widest bg-slate-800 text-white px-2 py-0.5 rounded-sm">DESTINATÁRIO</span>
                      {et.tipo && (
                        <span className="text-3xs font-bold border border-slate-400 rounded px-1.5 py-0.5 text-slate-600 uppercase tracking-wide">
                          {et.tipo}
                        </span>
                      )}
                    </div>
                    <p className="font-black text-slate-800 text-sm uppercase leading-tight">{et.destinatario.nome}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{et.destinatario.endereco}</p>
                    <div className="mt-2 space-y-0.5 text-xs text-slate-600">
                      <div><span className="font-bold">Bairro:</span> {et.destinatario.bairro}</div>
                      <div><span className="font-bold">CEP:</span> {et.destinatario.cep}</div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">Pedido:</span>
                        <span className="font-mono text-slate-700">{et.pedidoId}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Rotas + cidade */}
                  <div className="flex flex-col items-center gap-2 sm:min-w-[160px]">
                    <div className="w-full rounded-lg bg-slate-900 text-white text-center py-3 px-4">
                      <span className="text-2xl font-black font-mono tracking-tight">{et.rota1}</span>
                    </div>
                    <div className="w-full rounded-lg bg-slate-900 text-white text-center py-3 px-4">
                      <span className="text-2xl font-black font-mono tracking-tight">{et.rota2}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">{et.cidade}</span>
                    {et.extra && (
                      <span className="text-xs font-bold text-slate-500 text-center whitespace-pre-line">{et.extra}</span>
                    )}
                  </div>
                </div>

                {/* Rastreio + COLETA + REMETENTE */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-3xs font-black uppercase tracking-widest bg-slate-800 text-white px-2 py-0.5 rounded-sm block mb-1">REMETENTE</span>
                    <p className="text-xs font-bold text-slate-700">Sestape Store</p>
                    <p className="text-xs text-slate-500">Rua Perdigão, 286, Chamar no interno, Nova Serrana, Minas Gerais</p>
                    <p className="text-xs text-slate-500"><span className="font-bold">CEP:</span> 35522154</p>
                    <p className="text-xs text-slate-500"><span className="font-bold">Envio previsto:</span> {et.envio}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-black text-xl text-slate-800 tracking-widest border border-slate-300 rounded px-3 py-1">
                      COLETA
                    </span>
                    <span className="font-mono text-xs text-slate-500">{et.rastreio}</span>
                    <div className="rounded border border-slate-300 px-2 py-1 text-center">
                      <span className="text-3xs font-black text-slate-600 block">SOC</span>
                      <span className="text-3xs font-black text-slate-600 block">MG2</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── CHECKLIST DE CARREGAMENTO ─── */}
              <div className={`p-5 ${allChecked ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className={`h-4 w-4 ${allChecked ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Checklist de Carregamento
                    </span>
                    <span className="text-3xs font-mono text-slate-400">— ID Pedido: {et.pedidoId} package 1</span>
                  </div>
                  {allChecked ? (
                    <span className="text-3xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full px-2.5 py-0.5">
                      ✓ Conferido
                    </span>
                  ) : someChecked ? (
                    <span className="text-3xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2.5 py-0.5">
                      Parcial
                    </span>
                  ) : (
                    <span className="text-3xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-0.5">
                      Pendente
                    </span>
                  )}
                </div>

                <p className="text-3xs text-slate-400 font-semibold mb-3 italic">
                  Atenção vendedor: esta lista não deverá ser anexada aos seus pacotes. Seu uso deve ser unicamente para o controle dos seus envios.
                </p>

                {/* Table header */}
                <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 gap-y-1 items-center">
                  <div className="text-3xs font-black uppercase tracking-wider text-slate-400 col-span-1" />
                  <div className="text-3xs font-black uppercase tracking-wider text-slate-400">Produto</div>
                  <div className="text-3xs font-black uppercase tracking-wider text-slate-400">Variação</div>
                  <div className="text-3xs font-black uppercase tracking-wider text-slate-400 text-center">Qnt</div>
                  <div className="text-3xs font-black uppercase tracking-wider text-slate-400">SKU</div>

                  {et.checklist.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleItem(et.id, idx)}
                        className="flex items-center justify-center h-5 w-5 rounded transition"
                        title={item.checked ? 'Desmarcar' : 'Marcar como conferido'}
                      >
                        {item.checked
                          ? <CheckSquare className="h-5 w-5 text-emerald-600" />
                          : <Square className="h-5 w-5 text-slate-300 hover:text-slate-500" />
                        }
                      </button>

                      {/* Produto */}
                      <span className={`text-xs leading-snug ${item.checked ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>
                        {item.produto}
                      </span>

                      {/* Variação */}
                      <span className={`text-xs ${item.checked ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.variacao || '—'}
                      </span>

                      {/* Qnt */}
                      <span className={`text-xs font-bold text-center ${item.checked ? 'text-slate-400' : 'text-slate-800'}`}>
                        {item.qnt}
                      </span>

                      {/* SKU */}
                      <span className={`text-xs font-mono ${item.checked ? 'text-slate-400' : 'text-slate-600 font-bold'}`}>
                        {item.sku}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
