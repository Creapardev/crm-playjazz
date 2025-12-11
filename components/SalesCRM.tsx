import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus } from '../types';
import { MessageCircle, Trash2, Mail, Phone, Plus, X, Layers, Filter } from 'lucide-react';

interface SalesCRMProps {
    leads: Lead[];
    currentUnitId: string;
    onUpdateLead: (lead: Lead) => void;
    onAddLead: (lead: Lead) => void;
    onDeleteLead: (id: string) => void;
}

const COLUMN_ORDER = [
    LeadStatus.NEW,
    LeadStatus.CONTACTED,
    LeadStatus.TRIAL,
    LeadStatus.NEGOTIATION,
    LeadStatus.WON,
    LeadStatus.LOST
];

const SOURCES = ['Instagram', 'Google', 'Indicação'];

const SalesCRM: React.FC<SalesCRMProps> = ({ leads, currentUnitId, onUpdateLead, onAddLead, onDeleteLead }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupBySource, setGroupBySource] = useState(false);
    const [selectedInstrument, setSelectedInstrument] = useState<string>('');
    
    const [newLead, setNewLead] = useState({
        name: '',
        phone: '',
        email: '',
        instrument: '',
        source: 'Instagram' as const
    });

    // Extract unique instruments for the filter dropdown
    const availableInstruments = useMemo(() => {
        const instruments = new Set(leads.map(l => l.instrument).filter(Boolean));
        return Array.from(instruments).sort();
    }, [leads]);

    // Apply filters
    const filteredLeads = useMemo(() => {
        return leads.filter(lead => 
            selectedInstrument === '' || lead.instrument === selectedInstrument
        );
    }, [leads, selectedInstrument]);

    const handleWhatsApp = (phone: string, name: string) => {
        const message = `Olá ${name}, tudo bem? Falamos da PlayJazz! Gostaria de agendar sua aula experimental?`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleMove = (lead: Lead, newStatus: LeadStatus) => {
        onUpdateLead({ ...lead, status: newStatus });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLead.name || !newLead.phone) return;

        const lead: Lead = {
            id: Date.now().toString(),
            unitId: currentUnitId,
            status: LeadStatus.NEW,
            createdAt: new Date().toISOString().split('T')[0],
            source: newLead.source as any,
            name: newLead.name,
            phone: newLead.phone,
            email: newLead.email,
            instrument: newLead.instrument
        };

        onAddLead(lead);
        setIsModalOpen(false);
        setNewLead({ name: '', phone: '', email: '', instrument: '', source: 'Instagram' });
    };

    // Helper to render a single card to avoid code duplication in the grouping logic
    const renderLeadCard = (lead: Lead, isTerminal: boolean, currentStatus: LeadStatus) => (
        <div key={lead.id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition group relative mb-2 last:mb-0">
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    lead.source === 'Instagram' ? 'bg-pink-50 text-pink-700' :
                    lead.source === 'Google' ? 'bg-blue-50 text-blue-700' :
                    'bg-amber-50 text-amber-700'
                }`}>
                    {lead.source}
                </span>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteLead(lead.id); }}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Excluir Lead"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <h4 className="font-bold text-slate-800 text-sm truncate">{lead.name}</h4>
            <p className="text-xs text-slate-500 mb-2 truncate">{lead.instrument}</p>
            
            <div className="flex gap-1 mt-3 pt-2 border-t border-slate-50">
                <button 
                    onClick={() => handleWhatsApp(lead.phone, lead.name)}
                    className="flex-1 flex items-center justify-center p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition"
                    title="WhatsApp"
                >
                    <MessageCircle className="w-4 h-4" />
                </button>
                <button className="flex-1 flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition" title="Email">
                    <Mail className="w-4 h-4" />
                </button>
                <button className="flex-1 flex items-center justify-center p-1.5 bg-slate-50 text-slate-600 rounded hover:bg-slate-100 transition" title="Ligar">
                    <Phone className="w-4 h-4" />
                </button>
            </div>

            {/* Quick Move Simulation */}
            {!isTerminal && (
                <div className="mt-2 hidden group-hover:flex gap-1">
                        <button 
                        onClick={() => {
                            const idx = COLUMN_ORDER.indexOf(currentStatus);
                            if (idx < COLUMN_ORDER.length - 1) handleMove(lead, COLUMN_ORDER[idx + 1]);
                        }}
                        className="w-full text-[10px] bg-slate-800 text-white py-1 rounded hover:bg-slate-700"
                        >
                        Avançar >
                        </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col relative">
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800">Pipeline de Vendas</h2>
                    
                    {/* Instrument Filter */}
                    <div className="relative hidden md:block">
                        <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <select
                            value={selectedInstrument}
                            onChange={(e) => setSelectedInstrument(e.target.value)}
                            className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none shadow-sm cursor-pointer hover:bg-slate-50 transition"
                        >
                            <option value="">Todos os Instrumentos</option>
                            {availableInstruments.map(inst => (
                                <option key={inst} value={inst}>{inst}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={() => setGroupBySource(!groupBySource)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 border ${
                            groupBySource 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <Layers className="w-4 h-4" />
                        <span className="hidden sm:inline">{groupBySource ? 'Desagrupar' : 'Agrupar por Origem'}</span>
                    </button>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Novo Lead</span>
                    </button>
                </div>
            </div>
            
            {/* Mobile Filter (only visible on small screens) */}
            <div className="md:hidden mb-4">
                <select
                    value={selectedInstrument}
                    onChange={(e) => setSelectedInstrument(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todos os Instrumentos</option>
                    {availableInstruments.map(inst => (
                        <option key={inst} value={inst}>{inst}</option>
                    ))}
                </select>
            </div>
            
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex gap-4 h-full min-w-[1200px] pb-4">
                    {COLUMN_ORDER.map((status) => {
                        const columnLeads = filteredLeads.filter(l => l.status === status);
                        const isTerminal = status === LeadStatus.WON || status === LeadStatus.LOST;

                        return (
                            <div key={status} className="flex flex-col w-72 bg-slate-100 rounded-xl flex-shrink-0 max-h-full">
                                <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-200/50 rounded-t-xl">
                                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{status}</h3>
                                    <span className="bg-white text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
                                        {columnLeads.length}
                                    </span>
                                </div>
                                
                                <div className="p-2 flex-1 overflow-y-auto kanban-scroll">
                                    {groupBySource ? (
                                        // Grouped View
                                        <div className="space-y-4">
                                            {SOURCES.map(source => {
                                                const sourceLeads = columnLeads.filter(l => l.source === source);
                                                if (sourceLeads.length === 0) return null;

                                                return (
                                                    <div key={source} className="bg-slate-100/50">
                                                        <div className="flex items-center gap-2 mb-2 px-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                                source === 'Instagram' ? 'bg-pink-500' :
                                                                source === 'Google' ? 'bg-blue-500' :
                                                                'bg-amber-500'
                                                            }`} />
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                                {source} ({sourceLeads.length})
                                                            </span>
                                                            <div className="h-px bg-slate-200 flex-1"></div>
                                                        </div>
                                                        <div>
                                                            {sourceLeads.map(lead => renderLeadCard(lead, isTerminal, status))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        // Standard View
                                        <div className="space-y-2">
                                            {columnLeads.map(lead => renderLeadCard(lead, isTerminal, status))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Novo Lead</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Nome</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newLead.name}
                                    onChange={e => setNewLead({...newLead, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">WhatsApp</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newLead.phone}
                                    onChange={e => setNewLead({...newLead, phone: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="5511999999999"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        value={newLead.email}
                                        onChange={e => setNewLead({...newLead, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Instrumento</label>
                                    <input 
                                        type="text" 
                                        value={newLead.instrument}
                                        onChange={e => setNewLead({...newLead, instrument: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Origem</label>
                                <select 
                                    value={newLead.source}
                                    onChange={e => setNewLead({...newLead, source: e.target.value as any})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="Instagram">Instagram</option>
                                    <option value="Google">Google</option>
                                    <option value="Indicação">Indicação</option>
                                </select>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition">
                                    Cadastrar Lead
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesCRM;