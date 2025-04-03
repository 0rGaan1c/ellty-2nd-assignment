/*
  Warnings:

  - The `operation` column on the `Thread` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Operation" AS ENUM ('ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE');

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "operation",
ADD COLUMN     "operation" "Operation";
