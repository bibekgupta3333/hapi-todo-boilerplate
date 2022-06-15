/*
  Warnings:

  - The primary key for the `SubTask` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `status` to the `SubTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskId` to the `SubTask` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubTask" DROP CONSTRAINT "SubTask_id_fkey";

-- AlterTable
ALTER TABLE "SubTask" DROP CONSTRAINT "SubTask_pkey",
ADD COLUMN     "status" "StatusType" NOT NULL,
ADD COLUMN     "taskId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SubTask_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SubTask_id_seq";

-- AlterTable
ALTER TABLE "Task" DROP CONSTRAINT "Task_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Task_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Task_id_seq";

-- AddForeignKey
ALTER TABLE "SubTask" ADD CONSTRAINT "SubTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
