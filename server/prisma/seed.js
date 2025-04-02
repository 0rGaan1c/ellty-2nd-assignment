const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.calculation.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users
  const password = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      username: "user1",
      password
    }
  });

  const user2 = await prisma.user.create({
    data: {
      username: "user2",
      password
    }
  });

  // Create starting calculations (root nodes)
  const calc1 = await prisma.calculation.create({
    data: {
      value: 10,
      isRoot: true,
      userId: user1.id
    }
  });

  const calc2 = await prisma.calculation.create({
    data: {
      value: 25,
      isRoot: true,
      userId: user2.id
    }
  });

  // Add replies/operations to first calculation
  const reply1ToCalc1 = await prisma.calculation.create({
    data: {
      value: 15, // 10 + 5
      operation: "+",
      rightOperand: 5,
      parentId: calc1.id,
      userId: user2.id
    }
  });

  const reply2ToCalc1 = await prisma.calculation.create({
    data: {
      value: 20, // 10 * 2
      operation: "*",
      rightOperand: 2,
      parentId: calc1.id,
      userId: user1.id
    }
  });

  // Add nested reply
  await prisma.calculation.create({
    data: {
      value: 5, // 15 - 10
      operation: "-",
      rightOperand: 10,
      parentId: reply1ToCalc1.id,
      userId: user1.id
    }
  });

  await prisma.calculation.create({
    data: {
      value: 45, // 15 * 3
      operation: "*",
      rightOperand: 3,
      parentId: reply1ToCalc1.id,
      userId: user2.id
    }
  });

  // Add replies to second calculation
  await prisma.calculation.create({
    data: {
      value: 5, // 25 / 5
      operation: "/",
      rightOperand: 5,
      parentId: calc2.id,
      userId: user1.id
    }
  });

  await prisma.calculation.create({
    data: {
      value: 125, // 25 * 5
      operation: "*",
      rightOperand: 5,
      parentId: calc2.id,
      userId: user2.id
    }
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
