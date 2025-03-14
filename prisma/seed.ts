import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator role with full access',
      isDefault: false,
    },
  });

  const teacherRole = await prisma.role.upsert({
    where: { name: 'TEACHER' },
    update: {},
    create: {
      name: 'TEACHER',
      description: 'Default user role',
      isDefault: false,
    },
  });
 await prisma.role.upsert({
    where: { name: 'STUDENT' },
    update: {},
    create: {
      name: 'STUDENT',
      description: 'Default user role',
      isDefault: true,
    },
  });




  // Create default users
  const adminPassword = await hash('admin1234', 12);
  const userPassword = await hash('teacher1234', 12);

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      displayName: 'Admin User',
      username: 'admin',
      roleId: adminRole.id,
      emailVerified: new Date(),
      active: true,
    },
  });

  // Create regular user
  await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      passwordHash: userPassword,
      displayName: 'Teacher User',
      username: 'teacher',
      roleId: teacherRole.id,
      emailVerified: new Date(),
      active: true,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });