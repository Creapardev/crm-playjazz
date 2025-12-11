import { Lead, Student, Payment, SystemConfig } from '../types';

const API_BASE = '/api';

async function fetchWithRetry(url: string, options?: RequestInit, retries = 3, delay = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status >= 500 && i < retries - 1) {
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      return response;
    } catch (error) {
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
  return fetch(url, options);
}

const statusMapping = {
  'Novo Lead': 'NEW',
  'Contato Feito': 'CONTACTED',
  'Aula Exp. Agendada': 'TRIAL',
  'Negociação': 'NEGOTIATION',
  'Matriculado': 'WON',
  'Perdido': 'LOST'
} as const;

const reverseStatusMapping = {
  'NEW': 'Novo Lead',
  'CONTACTED': 'Contato Feito',
  'TRIAL': 'Aula Exp. Agendada',
  'NEGOTIATION': 'Negociação',
  'WON': 'Matriculado',
  'LOST': 'Perdido'
} as const;

const paymentStatusMapping = {
  'Pendente': 'PENDING',
  'Pago': 'PAID',
  'Atrasado': 'OVERDUE'
} as const;

const reversePaymentStatusMapping = {
  'PENDING': 'Pendente',
  'PAID': 'Pago',
  'OVERDUE': 'Atrasado'
} as const;

function mapLeadFromDb(lead: any): Lead {
  return {
    id: String(lead.id),
    unitId: String(lead.unitId),
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    instrument: lead.instrument,
    source: lead.source,
    status: (reverseStatusMapping as any)[lead.status] || lead.status,
    createdAt: lead.createdAt ? new Date(lead.createdAt).toISOString().split('T')[0] : '',
  };
}

function mapLeadToDb(lead: Lead) {
  return {
    unitId: parseInt(lead.unitId),
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    instrument: lead.instrument,
    source: lead.source,
    status: (statusMapping as any)[lead.status] || lead.status,
  };
}

function mapStudentFromDb(student: any): Student {
  return {
    id: String(student.id),
    unitId: String(student.unitId),
    name: student.name,
    phone: student.phone,
    email: student.email,
    birthDate: student.birthDate,
    responsibleName: student.responsibleName,
    course: student.course,
    status: student.status,
    timeline: (student.timeline || []).map((log: any) => ({
      id: String(log.id),
      date: log.date ? new Date(log.date).toISOString().split('T')[0] : '',
      type: log.type,
      message: log.message,
    })),
  };
}

function mapPaymentFromDb(payment: any): Payment {
  return {
    id: String(payment.id),
    studentId: String(payment.studentId),
    unitId: String(payment.unitId),
    amount: parseFloat(payment.amount),
    dueDate: payment.dueDate,
    status: (reversePaymentStatusMapping as any)[payment.status] || payment.status,
    description: payment.description,
  };
}

export const api = {
  getLeads: async (unitId?: string): Promise<Lead[]> => {
    const url = unitId ? `${API_BASE}/leads?unitId=${unitId}` : `${API_BASE}/leads`;
    const response = await fetchWithRetry(url);
    const data = await response.json();
    return data.map(mapLeadFromDb);
  },

  createLead: async (lead: Lead): Promise<Lead> => {
    const response = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapLeadToDb(lead)),
    });
    const data = await response.json();
    return mapLeadFromDb(data);
  },

  updateLead: async (lead: Lead): Promise<Lead> => {
    const response = await fetch(`${API_BASE}/leads/${lead.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mapLeadToDb(lead)),
    });
    const data = await response.json();
    return mapLeadFromDb(data);
  },

  deleteLead: async (id: string): Promise<void> => {
    await fetch(`${API_BASE}/leads/${id}`, { method: 'DELETE' });
  },

  getStudents: async (unitId?: string): Promise<Student[]> => {
    const url = unitId ? `${API_BASE}/students?unitId=${unitId}` : `${API_BASE}/students`;
    const response = await fetchWithRetry(url);
    const data = await response.json();
    return data.map(mapStudentFromDb);
  },

  createStudent: async (student: Student): Promise<Student> => {
    const response = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unitId: parseInt(student.unitId),
        name: student.name,
        phone: student.phone,
        email: student.email,
        birthDate: student.birthDate,
        responsibleName: student.responsibleName,
        course: student.course,
        status: student.status,
      }),
    });
    const data = await response.json();
    return mapStudentFromDb(data);
  },

  deleteStudent: async (id: string): Promise<void> => {
    await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
  },

  getPayments: async (unitId?: string): Promise<Payment[]> => {
    const url = unitId ? `${API_BASE}/payments?unitId=${unitId}` : `${API_BASE}/payments`;
    const response = await fetchWithRetry(url);
    const data = await response.json();
    return data.map(mapPaymentFromDb);
  },

  getUsers: async () => {
    const response = await fetchWithRetry(`${API_BASE}/users`);
    return response.json();
  },

  getConfig: async (): Promise<SystemConfig> => {
    const response = await fetchWithRetry(`${API_BASE}/config`);
    return response.json();
  },

  saveConfig: async (config: SystemConfig): Promise<void> => {
    await fetch(`${API_BASE}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  }
};
