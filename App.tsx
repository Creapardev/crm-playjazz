import React, { useState, useMemo, useEffect } from 'react';
import { UNITS } from './constants';
import { Unit, Lead, Student, Payment, User, SystemConfig } from './types';
import { api } from './services/api'; // Importando o novo serviço
import Dashboard from './components/Dashboard';
import SalesCRM from './components/SalesCRM';
import Students from './components/Students';
import Financial from './components/Financial';
import Settings from './components/Settings';
import { LayoutDashboard, Users, GraduationCap, DollarSign, Music, Menu, Settings as SettingsIcon, Loader2 } from 'lucide-react';

type View = 'dashboard' | 'sales' | 'students' | 'financial' | 'settings';

function App() {
  const [currentUnit, setCurrentUnit] = useState<Unit>(UNITS[0]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Global State (agora iniciam vazios e são preenchidos pela API)
  const [leads, setLeads] = useState<Lead[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  
  // Efeito inicial para carregar dados do "Banco de Dados"
  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        try {
            // Promise.all permite carregar tudo em paralelo
            const [fetchedLeads, fetchedStudents, fetchedPayments, fetchedUsers, fetchedConfig] = await Promise.all([
                api.getLeads(),
                api.getStudents(),
                api.getPayments(),
                api.getUsers(),
                api.getConfig()
            ]);

            setLeads(fetchedLeads);
            setStudents(fetchedStudents);
            setPayments(fetchedPayments);
            setUsers(fetchedUsers);
            setConfig(fetchedConfig);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            alert("Erro ao conectar com o servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    loadData();
  }, []);

  // Data Segregation Logic (The "Golden Rule")
  const filteredLeads = useMemo(() => leads.filter(l => l.unitId === currentUnit.id), [leads, currentUnit.id]);
  const filteredStudents = useMemo(() => students.filter(s => s.unitId === currentUnit.id), [students, currentUnit.id]);
  const filteredPayments = useMemo(() => payments.filter(p => p.unitId === currentUnit.id), [payments, currentUnit.id]);

  // Handlers for Leads
  const handleUpdateLead = async (updatedLead: Lead) => {
    // Otimistic Update (atualiza tela antes do servidor confirmar)
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    await api.updateLead(updatedLead);
  };

  const handleAddLead = async (newLead: Lead) => {
    const created = await api.createLead(newLead);
    setLeads(prev => [...prev, created]);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lead?')) {
      await api.deleteLead(leadId);
      setLeads(prev => prev.filter(l => l.id !== leadId));
    }
  };

  // Handlers for Students
  const handleAddStudent = async (newStudent: Student) => {
    const created = await api.createStudent(newStudent);
    setStudents(prev => [...prev, created]);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno? Todos os dados serão perdidos.')) {
      await api.deleteStudent(studentId);
      setStudents(prev => prev.filter(s => s.id !== studentId));
    }
  };

  // Handlers for Settings (Users & Config)
  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    // Adicionar chamada api.createUser(newUser) aqui futuramente
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Tem certeza que deseja remover este usuário? Ele perderá o acesso imediatamente.')) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        // Adicionar chamada api.deleteUser(userId) aqui futuramente
    }
  };

  const handleSaveConfig = async (newConfig: SystemConfig) => {
    setConfig(newConfig);
    await api.saveConfig(newConfig);
  };

  const NavItem = ({ view, label, icon: Icon }: { view: View, label: string, icon: any }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm mb-1
        ${currentView === view ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  if (isLoading) {
      return (
          <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
              <p className="font-medium">Carregando dados do sistema...</p>
          </div>
      );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-2 mb-10 px-2 mt-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PlayJazz CRM</span>
          </div>

          <nav className="flex-1">
            <NavItem view="dashboard" label="Dashboard" icon={LayoutDashboard} />
            <NavItem view="sales" label="Comercial (Leads)" icon={Users} />
            <NavItem view="students" label="Alunos" icon={GraduationCap} />
            <NavItem view="financial" label="Financeiro" icon={DollarSign} />
          </nav>

          <div className="mt-auto border-t border-slate-700 pt-4">
             <NavItem view="settings" label="Configurações" icon={SettingsIcon} />
             
             <div className="flex items-center gap-3 px-2 mt-4 pt-4 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                    AD
                </div>
                <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-slate-400">Super Admin</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700">
                <Menu className="w-6 h-6" />
             </button>
             
             {/* Unit Selector - Critical Requirement */}
             <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden sm:block">Unidade:</span>
                <select 
                    value={currentUnit.id}
                    onChange={(e) => {
                        const unit = UNITS.find(u => u.id === e.target.value);
                        if (unit) setCurrentUnit(unit);
                    }}
                    className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-1.5 font-medium"
                >
                    {UNITS.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Additional Header Items (Notifications, etc) could go here */}
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-6 relative">
          {currentView === 'dashboard' && (
            <Dashboard 
                currentUnit={currentUnit} 
                leads={filteredLeads} 
                students={filteredStudents}
                payments={filteredPayments}
            />
          )}
          
          {currentView === 'sales' && (
            <SalesCRM 
                leads={filteredLeads} 
                currentUnitId={currentUnit.id}
                onUpdateLead={handleUpdateLead} 
                onAddLead={handleAddLead}
                onDeleteLead={handleDeleteLead}
            />
          )}

          {currentView === 'students' && (
            <Students 
                students={filteredStudents} 
                currentUnitId={currentUnit.id}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
            />
          )}

          {currentView === 'financial' && (
            <Financial 
                payments={filteredPayments} 
                students={filteredStudents} 
            />
          )}

          {currentView === 'settings' && config && (
            <Settings 
                config={config}
                onSaveConfig={handleSaveConfig}
                users={users}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
                units={UNITS}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;