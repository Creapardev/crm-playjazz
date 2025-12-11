// Enums
export enum LeadStatus {
    NEW = 'Novo Lead',
    CONTACTED = 'Contato Feito',
    TRIAL = 'Aula Exp. Agendada',
    NEGOTIATION = 'Negociação',
    WON = 'Matriculado',
    LOST = 'Perdido'
}
  
export enum PaymentStatus {
    PENDING = 'Pendente',
    PAID = 'Pago',
    OVERDUE = 'Atrasado'
}

export enum LogType {
    SYSTEM = 'Sistema',
    WHATSAPP = 'WhatsApp',
    FINANCIAL = 'Financeiro',
    NOTE = 'Nota'
}

// Interfaces
export interface Unit {
    id: string;
    name: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager';
    unitId?: string; // If manager, restricted to this unit
}

export interface SystemConfig {
    whatsapp: {
        provider: 'cloud_api' | 'gateway';
        baseUrl?: string;
        apiKey?: string;
        phoneNumberId?: string;
    };
    gemini: {
        apiKey: string;
    };
    notificationEmail?: string;
}

export interface Lead {
    id: string;
    unitId: string;
    name: string;
    phone: string;
    email: string;
    instrument: string;
    source: 'Instagram' | 'Google' | 'Indicação';
    status: LeadStatus;
    createdAt: string;
}

export interface TimelineLog {
    id: string;
    date: string;
    type: LogType;
    message: string;
}

export interface Student {
    id: string;
    unitId: string;
    name: string;
    phone: string;
    email: string;
    birthDate: string;
    responsibleName?: string;
    course: string;
    status: 'Active' | 'Inactive';
    timeline: TimelineLog[];
}

export interface Payment {
    id: string;
    studentId: string;
    unitId: string;
    amount: number;
    dueDate: string;
    status: PaymentStatus;
    description: string;
}