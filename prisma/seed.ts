import { PrismaClient, Role, TaskStatus, TaskPriority } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Mock Data Arrays
const firstNames = ['Ahmed', 'Sara', 'Omar', 'Fatima', 'Mohamed', 'Nour', 'Youssef', 'Layla', 'Ali', 'Mona', 'Khaled', 'Hana', 'Tariq', 'Dina', 'Mahmoud', 'Salma', 'Hassan', 'Rana', 'Karim', 'Yasmin', 'Mostafa', 'Aya', 'Ibrahim', 'Nada', 'Ziad'];
const lastNames = ['Hassan', 'Mohamed', 'Ali', 'Ibrahim', 'Ahmed', 'Mahmoud', 'Hussein', 'Kamal', 'Fahmy', 'Sayed', 'Nasser', 'Taha', 'Mansour', 'Zaki', 'Adel', 'Samir', 'Hamed', 'Rashad', 'Fouad', 'Gaber', 'Shawky', 'Hifny', 'Ridha', 'Fathy', 'Anwar'];

const projectTemplates = [
  { name: 'Formula Student Chassis Design', desc: 'Design and build the chassis for the racing car' },
  { name: 'Aerodynamics Package', desc: 'Design front and rear wings for maximum downforce' },
  { name: 'Electric Powertrain', desc: 'Develop the motor and battery management system' },
  { name: 'Suspension & Steering', desc: 'Optimize handling and driver feedback' },
  { name: 'Brake System Overhaul', desc: 'Design a high-performance, lightweight braking system' },
  { name: 'Telemetry Software', desc: 'Real-time data acquisition and dashboard development' },
  { name: 'Sponsorship & Marketing', desc: 'Create pitch decks and manage sponsor relationships' },
  { name: 'Composite Materials Testing', desc: 'Test carbon fiber and fiberglass tensile strength' },
  { name: 'Vehicle Dynamics Simulation', desc: 'Run MATLAB/Simulink models for vehicle behavior' },
  { name: 'Regulations & Compliance', desc: 'Ensure all designs meet Formula Student rules' },
];

const taskTemplates = [
  { title: 'Draft initial CAD design', desc: 'Create 3D model of the component', status: 'DONE' as TaskStatus, priority: 'HIGH' as TaskPriority },
  { title: 'Review material specifications', desc: 'Research optimal material options', status: 'IN_PROGRESS' as TaskStatus, priority: 'MEDIUM' as TaskPriority },
  { title: 'Run simulation analysis', desc: 'Perform FEA or CFD simulations', status: 'TODO' as TaskStatus, priority: 'HIGH' as TaskPriority },
  { title: 'Prototype manufacturing', desc: '3D print or machine the first prototype', status: 'TODO' as TaskStatus, priority: 'MEDIUM' as TaskPriority },
  { title: 'Testing and validation', desc: 'Test the component under load', status: 'TODO' as TaskStatus, priority: 'HIGH' as TaskPriority },
  { title: 'Documentation update', desc: 'Update technical reports and drawings', status: 'DONE' as TaskStatus, priority: 'LOW' as TaskPriority },
];

async function main() {
  console.log('🌱 Starting large-scale database seeding...');

  // 1. Check if already seeded
  const existingUser = await prisma.user.findUnique({ where: { email: 'owner@example.com' } });
  if (existingUser) {
    console.log('✅ Database is already seeded. Skipping...');
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);
  const users: any[] = [];

  // 2. Create 25 Users
  console.log('👥 Creating 25 users...');
  for (let i = 0; i < 25; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const email = i === 0 ? 'owner@example.com' : `user${i + 1}@example.com`;
    
    const user = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users`);

  // 3. Create 10 Projects with Members and Tasks
  console.log('📁 Creating 10 projects with members and tasks...');
  for (let i = 0; i < 10; i++) {
    const template = projectTemplates[i];
    // Assign a different owner for each project (cycling through the first 5 users)
    const owner = users[i % 5]; 
    
    // Create Project
    const project = await prisma.project.create({
      data: {
        name: template.name,
        description: template.desc,
        ownerId: owner.id,
      },
    });

    // Add Owner as MEMBER with role OWNER
    await prisma.projectMember.create({
      data: { projectId: project.id, userId: owner.id, role: 'OWNER' }
    });

    // Add 2-3 random members to each project
    const availableMembers = users.filter(u => u.id !== owner.id);
    const shuffledMembers = availableMembers.sort(() => 0.5 - Math.random());
    const projectMembers = shuffledMembers.slice(0, 3); // Pick 3 random members

    for (const member of projectMembers) {
      await prisma.projectMember.create({
        data: { projectId: project.id, userId: member.id, role: 'MEMBER' }
      });
    }

    // Create 3-4 random tasks for each project
    const shuffledTasks = taskTemplates.sort(() => 0.5 - Math.random());
    const projectTasks = shuffledTasks.slice(0, 4); // Pick 4 random tasks

    for (const task of projectTasks) {
      // Randomly assign to one of the project members (or leave unassigned)
      const randomAssignee = Math.random() > 0.2 ? projectMembers[Math.floor(Math.random() * projectMembers.length)] : null;

      await prisma.task.create({
        data: {
          title: task.title,
          description: task.desc,
          status: task.status,
          priority: task.priority,
          projectId: project.id,
          assigneeId: randomAssignee?.id || null,
        },
      });
    }
    
    console.log(`   ✅ Created: "${project.name}" (${projectMembers.length} members, 4 tasks)`);
  }

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📊 Database Summary:');
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Projects: 10`);
  console.log(`   - Project Memberships: ~40`);
  console.log(`   - Tasks: ~40`);
  console.log('\n🔐 Test Credentials (All use the same password):');
  console.log('   Password: password123');
  console.log('   Owner Email: owner@example.com');
  console.log('   Member Email: user2@example.com');
  console.log('   Member Email: user10@example.com');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });