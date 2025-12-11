import React, { useState } from 'react';
import { SystemConfig, User, Unit } from '../types';
import { Save, UserPlus, Trash2, Key, Users, Lock, Shield, Mail } from 'lucide-react';

interface SettingsProps {
    config: SystemConfig;
    onSaveConfig: (config: SystemConfig) => void;
    users: User[];
    units: Unit[];
    onAddUser: (user: User) => void;
    onDeleteUser: (userId: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onSaveConfig, users, units, onAddUser, onDeleteUser }) => {
    const [activeTab, setActiveTab] = useState<'integrations' | 'users'>('integrations');
    
    // Config State
    const [localConfig, setLocalConfig] = useState<SystemConfig>(config);
    const [savedSuccess, setSavedSuccess] = useState(false);

    // User Form State
    const [newUser, setNewUser] = useState<Partial<User>>({ role: 'manager', unitId: units[0].id });
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveConfig(localConfig);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUser.name && newUser.email) {
            onAddUser({
                id: Date.now().toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role as 'admin' | 'manager',
                unitId: newUser.role === 'admin' ? undefined : newUser.unitId
            });
            setIsUserModalOpen(false);
            setNewUser({ role: 'manager', unitId: units[0].id, name: '', email: '' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h2>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('integrations')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'integrations' 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Integrações (API)
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'users' 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Gestão de Usuários
                </button>
            </div>

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
                    <form onSubmit={handleSave} className="space-y-8">
                        {/* WhatsApp Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                    <MessageCircleIcon />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Configuração WhatsApp</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Integração</label>
                                    <select 
                                        value={localConfig.whatsapp.provider}
                                        onChange={e => setLocalConfig({...localConfig, whatsapp: {...localConfig.whatsapp, provider: e.target.value as any}})}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="gateway">Gateway (Z-API, Evolution, WPPConnect)</option>
                                        <option value="cloud_api">WhatsApp Cloud API (Meta Oficial)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Base URL / Endpoint</label>
                                    <input 
                                        type="text" 
                                        value={localConfig.whatsapp.baseUrl || ''}
                                        onChange={e => setLocalConfig({...localConfig, whatsapp: {...localConfig.whatsapp, baseUrl: e.target.value}})}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="https://api.gateway.com..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">API Key / Access Token</label>
                                    <div className="relative">
                                        <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                        <input 
                                            type="password" 
                                            value={localConfig.whatsapp.apiKey || ''}
                                            onChange={e => setLocalConfig({...localConfig, whatsapp: {...localConfig.whatsapp, apiKey: e.target.value}})}
                                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="Cole sua chave aqui"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gemini Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                                    <BrainIcon />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Inteligência Artificial (Google Gemini)</h3>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Gemini API Key</label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                    <input 
                                        type="password" 
                                        value={localConfig.gemini.apiKey}
                                        onChange={e => setLocalConfig({...localConfig, gemini: { apiKey: e.target.value}})}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="AIzaSy..."
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Usada para gerar mensagens automáticas e insights no CRM.</p>
                            </div>
                        </div>

                         {/* Notification Email Section */}
                         <div>
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Notificações do Sistema</h3>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email para Alertas</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                    <input 
                                        type="email" 
                                        value={localConfig.notificationEmail || ''}
                                        onChange={e => setLocalConfig({...localConfig, notificationEmail: e.target.value})}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="admin@escola.com"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Receba relatórios de automação financeira e alertas críticos.</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                            <button 
                                type="submit" 
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Salvar Configurações
                            </button>
                            {savedSuccess && <span className="text-emerald-600 font-medium text-sm animate-pulse">Salvo com sucesso!</span>}
                        </div>
                    </form>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Usuários do Sistema</h3>
                            <p className="text-sm text-slate-500">Gerencie quem tem acesso ao CRM</p>
                        </div>
                        <button 
                            onClick={() => setIsUserModalOpen(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" /> Adicionar Usuário
                        </button>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Nome / Email</th>
                                <th className="p-4">Nível de Acesso</th>
                                <th className="p-4">Unidade Vinculada</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(user => {
                                const unitName = units.find(u => u.id === user.unitId)?.name || 'Todas as Unidades';
                                const isSuperAdmin = user.role === 'admin';

                                return (
                                    <tr key={user.id} className="hover:bg-slate-50 transition">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-800">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ${isSuperAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {isSuperAdmin ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                                                {isSuperAdmin ? 'Super Admin' : 'Gerente / Secretária'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {unitName}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => onDeleteUser(user.id)}
                                                className="text-slate-400 hover:text-red-600 transition"
                                                title="Remover Usuário"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add User Modal */}
            {isUserModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Novo Usuário</h3>
                            <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="text-xl">×</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newUser.name}
                                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Email de Acesso</label>
                                <input 
                                    required
                                    type="email" 
                                    value={newUser.email}
                                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Permissão</label>
                                    <select 
                                        value={newUser.role}
                                        onChange={e => setNewUser({...newUser, role: e.target.value as any})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="manager">Gerente</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Unidade</label>
                                    <select 
                                        disabled={newUser.role === 'admin'}
                                        value={newUser.unitId}
                                        onChange={e => setNewUser({...newUser, unitId: e.target.value})}
                                        className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${newUser.role === 'admin' ? 'bg-slate-100 text-slate-400' : ''}`}
                                    >
                                        {units.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition">
                                    Criar Usuário
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple Icon Components
const MessageCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
);

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
);

export default Settings;