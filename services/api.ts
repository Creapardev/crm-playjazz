import { Lead, Student, Payment, Unit, SystemConfig } from '../types';
import { MOCK_LEADS, MOCK_STUDENTS, MOCK_PAYMENTS, MOCK_USERS, DEFAULT_CONFIG } from '../constants';

// Simula um delay de rede (como se fosse um banco de dados real)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==============================================================================
// INSTRUÇÕES PARA CONEXÃO REAL:
// Quando você tiver seu Backend (Node/Laravel) ou Supabase pronto,
// substitua o conteúdo destas funções pelas chamadas reais.
// Exemplo com fetch:
// return fetch('https://api.seusite.com/leads').then(res => res.json());
// ==============================================================================

export const api = {
    // --- LEADS ---
    getLeads: async (unitId?: string): Promise<Lead[]> => {
        await delay(500); // Simulando latência
        // Aqui entraria: const { data } = await supabase.from('leads').select('*');
        if (unitId) {
            return MOCK_LEADS.filter(l => l.unitId === unitId);
        }
        return MOCK_LEADS;
    },

    createLead: async (lead: Lead): Promise<Lead> => {
        await delay(300);
        // Aqui entraria: await axios.post('/api/leads', lead);
        console.log('API: Lead criado', lead);
        return lead;
    },

    updateLead: async (lead: Lead): Promise<Lead> => {
        await delay(300);
        console.log('API: Lead atualizado', lead);
        return lead;
    },

    deleteLead: async (id: string): Promise<void> => {
        await delay(300);
        console.log('API: Lead deletado', id);
    },

    // --- STUDENTS ---
    getStudents: async (unitId?: string): Promise<Student[]> => {
        await delay(600);
        if (unitId) {
            return MOCK_STUDENTS.filter(s => s.unitId === unitId);
        }
        return MOCK_STUDENTS;
    },

    createStudent: async (student: Student): Promise<Student> => {
        await delay(400);
        return student;
    },

    deleteStudent: async (id: string): Promise<void> => {
        await delay(300);
    },

    // --- FINANCIAL ---
    getPayments: async (unitId?: string): Promise<Payment[]> => {
        await delay(400);
        if (unitId) {
            return MOCK_PAYMENTS.filter(p => p.unitId === unitId);
        }
        return MOCK_PAYMENTS;
    },

    // --- CONFIG & USERS ---
    getUsers: async () => {
        await delay(300);
        return MOCK_USERS;
    },

    getConfig: async (): Promise<SystemConfig> => {
        await delay(200);
        // Tentar ler do localStorage para persistir configurações no navegador por enquanto
        const saved = localStorage.getItem('playjazz_config');
        return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    },

    saveConfig: async (config: SystemConfig): Promise<void> => {
        await delay(300);
        localStorage.setItem('playjazz_config', JSON.stringify(config));
    }
};