import { Lead, LeadStatus, Payment, PaymentStatus, Student, Unit, LogType, User, SystemConfig } from "./types";

export const UNITS: Unit[] = [
    { id: '1', name: 'PlayJazz Centro' },
    { id: '2', name: 'PlayJazz Zona Sul' }
];

export const MOCK_USERS: User[] = [
    { id: 'usr1', name: 'Admin Principal', email: 'admin@playjazz.com', role: 'admin' },
    { id: 'usr2', name: 'Gerente Centro', email: 'gerente.centro@playjazz.com', role: 'manager', unitId: 'u1' },
    { id: 'usr3', name: 'Secretária Sul', email: 'sec.sul@playjazz.com', role: 'manager', unitId: 'u2' },
];

export const DEFAULT_CONFIG: SystemConfig = {
    whatsapp: {
        provider: 'gateway',
        baseUrl: 'https://api.z-api.io/instances/YOUR_INSTANCE',
        apiKey: ''
    },
    gemini: {
        apiKey: ''
    },
    notificationEmail: ''
};

export const MOCK_LEADS: Lead[] = [
    { id: 'l1', unitId: 'u1', name: 'Ana Silva', phone: '5511999999999', email: 'ana@test.com', instrument: 'Piano', source: 'Instagram', status: LeadStatus.NEW, createdAt: '2023-10-01' },
    { id: 'l2', unitId: 'u1', name: 'Carlos Souza', phone: '5511988888888', email: 'carlos@test.com', instrument: 'Guitarra', source: 'Google', status: LeadStatus.CONTACTED, createdAt: '2023-10-02' },
    { id: 'l3', unitId: 'u2', name: 'Beatriz Lima', phone: '5521977777777', email: 'bia@test.com', instrument: 'Canto', source: 'Indicação', status: LeadStatus.TRIAL, createdAt: '2023-10-03' },
    { id: 'l4', unitId: 'u1', name: 'João Paulo', phone: '5511966666666', email: 'jp@test.com', instrument: 'Bateria', source: 'Instagram', status: LeadStatus.NEGOTIATION, createdAt: '2023-10-05' },
    { id: 'l5', unitId: 'u2', name: 'Mariana Costa', phone: '5521955555555', email: 'mari@test.com', instrument: 'Saxofone', source: 'Google', status: LeadStatus.NEW, createdAt: '2023-10-06' },
];

export const MOCK_STUDENTS: Student[] = [
    { 
        id: 's1', 
        unitId: 'u1', 
        name: 'Pedro Alcantara', 
        phone: '5511944444444', 
        email: 'pedro@test.com', 
        birthDate: '2010-05-15', 
        responsibleName: 'Marcos Alcantara', 
        course: 'Piano Clássico', 
        status: 'Active',
        timeline: [
            { id: 't1', date: '2023-09-01', type: LogType.SYSTEM, message: 'Matrícula realizada' },
            { id: 't2', date: '2023-10-05', type: LogType.WHATSAPP, message: 'Lembrete de aula enviado' },
        ]
    },
    { 
        id: 's2', 
        unitId: 'u2', 
        name: 'Julia Roberts', 
        phone: '5521933333333', 
        email: 'julia@test.com', 
        birthDate: '1995-12-20', 
        course: 'Canto Popular', 
        status: 'Active',
        timeline: [
            { id: 't3', date: '2023-08-15', type: LogType.SYSTEM, message: 'Lead convertido em aluno' },
        ]
    }
];

export const MOCK_PAYMENTS: Payment[] = [
    { id: 'p1', unitId: 'u1', studentId: 's1', amount: 350.00, dueDate: '2023-10-10', status: PaymentStatus.PAID, description: 'Mensalidade Outubro' },
    { id: 'p2', unitId: 'u1', studentId: 's1', amount: 350.00, dueDate: '2023-11-10', status: PaymentStatus.PENDING, description: 'Mensalidade Novembro' },
    // A payment due in 5 days from "now" (simulated)
    { id: 'p3', unitId: 'u2', studentId: 's2', amount: 400.00, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: PaymentStatus.PENDING, description: 'Mensalidade Novembro' }, 
    { id: 'p4', unitId: 'u1', studentId: 's1', amount: 350.00, dueDate: '2023-09-10', status: PaymentStatus.OVERDUE, description: 'Mensalidade Setembro' },
];