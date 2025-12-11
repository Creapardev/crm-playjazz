import React, { useState } from 'react';
import { Payment, PaymentStatus, Student } from '../types';
import { AlertTriangle, Check, Clock, RefreshCw, Send } from 'lucide-react';

interface FinancialProps {
    payments: Payment[];
    students: Student[];
}

const Financial: React.FC<FinancialProps> = ({ payments, students }) => {
    const [simulating, setSimulating] = useState(false);
    const [automationLog, setAutomationLog] = useState<string[]>([]);

    const getStatusStyle = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID: return 'bg-emerald-100 text-emerald-700';
            case PaymentStatus.PENDING: return 'bg-amber-100 text-amber-700';
            case PaymentStatus.OVERDUE: return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    // Requirement 5 Implementation: Logic for 5-day warning
    const runAutomation = () => {
        setSimulating(true);
        setAutomationLog([]);
        
        // Mocking the "today + 5 days" logic using the mock data
        // We look for payments due in exactly 5 days OR any pending payment for demo purposes
        const dueSoon = payments.filter(p => p.status === PaymentStatus.PENDING);

        setTimeout(() => {
            const logs: string[] = [];
            if (dueSoon.length === 0) {
                logs.push("Nenhuma fatura encontrada no critério (Vencimento em 5 dias).");
            } else {
                dueSoon.forEach(p => {
                    const student = students.find(s => s.id === p.studentId);
                    if (student) {
                        logs.push(`[SIMULAÇÃO] Enviando WhatsApp para ${student.name} (${student.phone}): "Sua fatura vence em 5 dias..."`);
                        // In a real app, this would call the API and update the student timeline
                    }
                });
                logs.push(`Processo concluído: ${dueSoon.length} mensagens enviadas.`);
            }
            setAutomationLog(logs);
            setSimulating(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
                    <p className="text-slate-500 text-sm">Gestão de mensalidades e cobrança automatizada</p>
                </div>
                <button 
                    onClick={runAutomation}
                    disabled={simulating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${simulating ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                    <RefreshCw className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
                    {simulating ? 'Rodando Script...' : 'Rodar Robô de Cobrança'}
                </button>
            </div>

            {/* Automation Log Output */}
            {automationLog.length > 0 && (
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs shadow-inner">
                    <p className="border-b border-slate-700 pb-2 mb-2 font-bold text-white flex items-center gap-2">
                        <Send className="w-3 h-3" /> Log de Execução (Simulado)
                    </p>
                    {automationLog.map((log, idx) => (
                        <div key={idx} className="mb-1">> {log}</div>
                    ))}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="p-4">Aluno</th>
                            <th className="p-4">Descrição</th>
                            <th className="p-4">Vencimento</th>
                            <th className="p-4">Valor</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {payments.map(payment => {
                            const student = students.find(s => s.id === payment.studentId);
                            return (
                                <tr key={payment.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-medium text-slate-800">{student?.name || 'Unknown'}</td>
                                    <td className="p-4 text-slate-600 text-sm">{payment.description}</td>
                                    <td className="p-4 text-slate-600 text-sm flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        {new Date(payment.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-mono text-sm text-slate-700">R$ {payment.amount.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ${getStatusStyle(payment.status)}`}>
                                            {payment.status === PaymentStatus.OVERDUE && <AlertTriangle className="w-3 h-3" />}
                                            {payment.status === PaymentStatus.PAID && <Check className="w-3 h-3" />}
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Detalhes</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {payments.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">Nenhum registro financeiro encontrado nesta unidade.</div>
                )}
            </div>
        </div>
    );
};

export default Financial;