import React from 'react';
import { Unit, Lead, Student, Payment, PaymentStatus, LeadStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardProps {
    currentUnit: Unit;
    leads: Lead[];
    students: Student[];
    payments: Payment[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ currentUnit, leads, students, payments }) => {
    
    // KPI Calculations
    const totalLeads = leads.length;
    const activeStudents = students.filter(s => s.status === 'Active').length;
    
    // Revenue logic: Sum of PAID payments in current month (simplified logic uses all paid for demo)
    const revenueRealized = payments
        .filter(p => p.status === PaymentStatus.PAID)
        .reduce((sum, p) => sum + p.amount, 0);

    const overdueCount = payments.filter(p => p.status === PaymentStatus.OVERDUE).length;

    // Chart Data Preparation
    const leadSourceData = [
        { name: 'Instagram', value: leads.filter(l => l.source === 'Instagram').length },
        { name: 'Google', value: leads.filter(l => l.source === 'Google').length },
        { name: 'Indicação', value: leads.filter(l => l.source === 'Indicação').length },
    ].filter(d => d.value > 0);

    // Mock trend data
    const enrollmentData = [
        { name: 'Jun', students: 12 },
        { name: 'Jul', students: 19 },
        { name: 'Ago', students: 15 },
        { name: 'Set', students: 22 },
        { name: 'Out', students: activeStudents }, // Current
    ];

    const KPICard = ({ title, value, sub, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                <p className={`text-xs mt-2 ${sub.includes('+') ? 'text-emerald-600' : 'text-slate-400'}`}>{sub}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">Visão Geral - {currentUnit.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    title="Leads Ativos" 
                    value={totalLeads} 
                    sub="+12% esse mês" 
                    icon={Users} 
                    color="bg-blue-500" 
                />
                <KPICard 
                    title="Alunos Matriculados" 
                    value={activeStudents} 
                    sub="Total na unidade" 
                    icon={TrendingUp} 
                    color="bg-indigo-500" 
                />
                <KPICard 
                    title="Receita Realizada" 
                    value={`R$ ${revenueRealized.toLocaleString('pt-BR')}`} 
                    sub="Mês atual" 
                    icon={DollarSign} 
                    color="bg-emerald-500" 
                />
                <KPICard 
                    title="Inadimplência" 
                    value={overdueCount} 
                    sub="Faturas atrasadas" 
                    icon={AlertCircle} 
                    color="bg-rose-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Crescimento de Alunos</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={enrollmentData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#f1f5f9'}} />
                                <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Source Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Origem dos Leads</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={leadSourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {leadSourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;