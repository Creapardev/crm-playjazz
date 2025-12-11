import { db } from "./db";
import { units, users, leads, students, payments, timelineLogs } from "../shared/schema";

async function seed() {
  console.log("Seeding database...");

  const existingUnits = await db.select().from(units);
  if (existingUnits.length > 0) {
    console.log("Database already seeded, skipping.");
    process.exit(0);
  }

  const [unit1, unit2] = await db.insert(units).values([
    { name: 'PlayJazz Centro' },
    { name: 'PlayJazz Zona Sul' }
  ]).returning();

  await db.insert(users).values([
    { name: 'Admin Principal', email: 'admin@playjazz.com', role: 'admin' },
    { name: 'Gerente Centro', email: 'gerente.centro@playjazz.com', role: 'manager', unitId: unit1.id },
    { name: 'Secretária Sul', email: 'sec.sul@playjazz.com', role: 'manager', unitId: unit2.id },
  ]);

  await db.insert(leads).values([
    { unitId: unit1.id, name: 'Ana Silva', phone: '5511999999999', email: 'ana@test.com', instrument: 'Piano', source: 'Instagram', status: 'NEW' },
    { unitId: unit1.id, name: 'Carlos Souza', phone: '5511988888888', email: 'carlos@test.com', instrument: 'Guitarra', source: 'Google', status: 'CONTACTED' },
    { unitId: unit2.id, name: 'Beatriz Lima', phone: '5521977777777', email: 'bia@test.com', instrument: 'Canto', source: 'Indicação', status: 'TRIAL' },
    { unitId: unit1.id, name: 'João Paulo', phone: '5511966666666', email: 'jp@test.com', instrument: 'Bateria', source: 'Instagram', status: 'NEGOTIATION' },
    { unitId: unit2.id, name: 'Mariana Costa', phone: '5521955555555', email: 'mari@test.com', instrument: 'Saxofone', source: 'Google', status: 'NEW' },
  ]);

  const [student1, student2] = await db.insert(students).values([
    { 
      unitId: unit1.id, 
      name: 'Pedro Alcantara', 
      phone: '5511944444444', 
      email: 'pedro@test.com', 
      birthDate: '2010-05-15', 
      responsibleName: 'Marcos Alcantara', 
      course: 'Piano Clássico', 
      status: 'Active'
    },
    { 
      unitId: unit2.id, 
      name: 'Julia Roberts', 
      phone: '5521933333333', 
      email: 'julia@test.com', 
      birthDate: '1995-12-20', 
      course: 'Canto Popular', 
      status: 'Active'
    }
  ]).returning();

  await db.insert(timelineLogs).values([
    { studentId: student1.id, type: 'Sistema', message: 'Matrícula realizada' },
    { studentId: student1.id, type: 'WhatsApp', message: 'Lembrete de aula enviado' },
    { studentId: student2.id, type: 'Sistema', message: 'Lead convertido em aluno' },
  ]);

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 5);

  await db.insert(payments).values([
    { unitId: unit1.id, studentId: student1.id, amount: '350.00', dueDate: '2023-10-10', status: 'PAID', description: 'Mensalidade Outubro' },
    { unitId: unit1.id, studentId: student1.id, amount: '350.00', dueDate: '2023-11-10', status: 'PENDING', description: 'Mensalidade Novembro' },
    { unitId: unit2.id, studentId: student2.id, amount: '400.00', dueDate: futureDate.toISOString().split('T')[0], status: 'PENDING', description: 'Mensalidade Novembro' },
    { unitId: unit1.id, studentId: student1.id, amount: '350.00', dueDate: '2023-09-10', status: 'OVERDUE', description: 'Mensalidade Setembro' },
  ]);

  console.log("Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
