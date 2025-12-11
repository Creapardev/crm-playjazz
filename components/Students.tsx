import React, { useState } from 'react';
import { Student, TimelineLog, LogType } from '../types';
import { Search, User, Calendar, MessageCircle, FileText, CheckCircle, X, Trash2, Plus } from 'lucide-react';

interface StudentsProps {
    students: Student[];
    currentUnitId: string;
    onAddStudent: (student: Student) => void;
    onDeleteStudent: (id: string) => void;
}

const TimelineItem: React.FC<{ log: TimelineLog }> = ({ log }) => {
    const getIcon = () => {
        switch(log.type) {
            case LogType.WHATSAPP: return <MessageCircle className="w-4 h-4 text-green-600" />;
            case LogType.FINANCIAL: return <CheckCircle className="w-4 h-4 text-emerald-600" />;
            default: return <FileText className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <div className="flex gap-4 pb-6 relative last:pb-0">
            <div className="flex-shrink-0 mt-1 relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {getIcon()}
                </div>
            </div>
            {/* Connector line */}
            <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200 -ml-px z-0 last:hidden"></div>
            
            <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex-1">
                <p className="text-sm text-slate-800">{log.message}</p>
                <div className="flex justify-between mt-2">
                    <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded">{log.type}</span>
                    <span className="text-xs text-slate-400">{new Date(log.date).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

const Students: React.FC<StudentsProps> = ({ students, currentUnitId, onAddStudent, onDeleteStudent }) => {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [newStudent, setNewStudent] = useState({
        name: '',
        phone: '',
        email: '',
        course: '',
        birthDate: '',
        responsibleName: ''
    });

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudent.name || !newStudent.phone) return;

        const student: Student = {
            id: Date.now().toString(),
            unitId: currentUnitId,
            status: 'Active',
            timeline: [{
                id: Date.now().toString() + 't',
                date: new Date().toISOString(),
                type: LogType.SYSTEM,
                message: 'Aluno cadastrado manualmente'
            }],
            ...newStudent
        };

        onAddStudent(student);
        setIsModalOpen(false);
        setNewStudent({ name: '', phone: '', email: '', course: '', birthDate: '', responsibleName: '' });
    };

    const handleDelete = () => {
        if (selectedStudent) {
            onDeleteStudent(selectedStudent.id);
            setSelectedStudent(null);
        }
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 relative">
            {/* List Section */}
            <div className={`${selectedStudent ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden`}>
                <div className="p-4 border-b border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                         <h2 className="text-lg font-bold text-slate-800">Alunos</h2>
                         <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-indigo-700 transition"
                            title="Novo Aluno"
                         >
                            <Plus className="w-4 h-4" />
                         </button>
                    </div>
                   
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar aluno..." 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredStudents.map(student => (
                        <div 
                            key={student.id} 
                            onClick={() => setSelectedStudent(student)}
                            className={`p-3 rounded-lg mb-2 cursor-pointer transition flex items-center gap-3 ${selectedStudent?.id === student.id ? 'bg-indigo-50 border-indigo-200 border' : 'hover:bg-slate-50 border border-transparent'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800">{student.name}</h3>
                                <p className="text-xs text-slate-500">{student.course}</p>
                            </div>
                        </div>
                    ))}
                    {filteredStudents.length === 0 && (
                        <p className="text-center text-slate-400 text-sm mt-8">Nenhum aluno encontrado.</p>
                    )}
                </div>
            </div>

            {/* Detail Section */}
            {selectedStudent ? (
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                                {selectedStudent.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{selectedStudent.name}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">Ativo</span>
                                    <span className="text-sm text-slate-500">• {selectedStudent.course}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleDelete}
                                className="p-2 text-slate-400 hover:text-red-600 transition"
                                title="Excluir Aluno"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button onClick={() => setSelectedStudent(null)} className="md:hidden p-2 text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Dados Pessoais</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <MessageCircle className="w-4 h-4" />
                                        {selectedStudent.phone}
                                        <a href={`https://wa.me/${selectedStudent.phone}`} target="_blank" rel="noreferrer" className="text-indigo-600 text-xs hover:underline ml-auto">WhatsApp</a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <User className="w-4 h-4" />
                                        {selectedStudent.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Calendar className="w-4 h-4" />
                                        Nasc: {new Date(selectedStudent.birthDate).toLocaleDateString()}
                                    </div>
                                    {selectedStudent.responsibleName && (
                                         <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <span className="font-semibold">Responsável:</span> {selectedStudent.responsibleName}
                                         </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Timeline de Atividades</h3>
                                <div className="pl-2">
                                    {selectedStudent.timeline.length > 0 ? (
                                        selectedStudent.timeline.map(log => <TimelineItem key={log.id} log={log} />)
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">Nenhuma atividade registrada.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 bg-slate-50 rounded-xl border border-dashed border-slate-300 items-center justify-center text-slate-400">
                    Selecione um aluno para ver detalhes
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Novo Aluno</h3>
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
                                    value={newStudent.name}
                                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">WhatsApp</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={newStudent.phone}
                                        onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="5511..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Curso</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={newStudent.course}
                                        onChange={e => setNewStudent({...newStudent, course: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        value={newStudent.email}
                                        onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Data Nascimento</label>
                                    <input 
                                        type="date" 
                                        value={newStudent.birthDate}
                                        onChange={e => setNewStudent({...newStudent, birthDate: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Nome do Responsável (Opcional)</label>
                                <input 
                                    type="text" 
                                    value={newStudent.responsibleName}
                                    onChange={e => setNewStudent({...newStudent, responsibleName: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition">
                                    Cadastrar Aluno
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;