const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.thread.deleteMany({});
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

  // Create starting threads (root nodes)
  const calc1 = await prisma.thread.create({
    data: {
      value: 10,
      userId: user1.id
    }
  });

  const calc2 = await prisma.thread.create({
    data: {
      value: 25,
      userId: user2.id
    }
  });

  // Add replies/operations to first thread
  const reply1ToCalc1 = await prisma.thread.create({
    data: {
      value: 15, // 10 + 5
      operation: "ADD",
      rightOperand: 5,
      parentId: calc1.id,
      userId: user2.id
    }
  });

  const reply2ToCalc1 = await prisma.thread.create({
    data: {
      value: 20, // 10 * 2
      operation: "MULTIPLY",
      rightOperand: 2,
      parentId: calc1.id,
      userId: user1.id
    }
  });

  // Add nested reply
  await prisma.thread.create({
    data: {
      value: 5, // 15 - 10
      operation: "SUBTRACT",
      rightOperand: 10,
      parentId: reply1ToCalc1.id,
      userId: user1.id
    }
  });

  await prisma.thread.create({
    data: {
      value: 45, // 15 * 3
      operation: "MULTIPLY",
      rightOperand: 3,
      parentId: reply1ToCalc1.id,
      userId: user2.id
    }
  });

  // Add replies to second thread
  await prisma.thread.create({
    data: {
      value: 5, // 25 / 5
      operation: "DIVIDE",
      rightOperand: 5,
      parentId: calc2.id,
      userId: user1.id
    }
  });

  await prisma.thread.create({
    data: {
      value: 125, // 25 * 5
      operation: "MULTIPLY",
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
