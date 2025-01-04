/*
  Warnings:

  - You are about to drop the column `roleId` on the `Policy` table. All the data in the column will be lost.
  - Added the required column `name` to the `Policy` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PolicyRole" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "policyId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    CONSTRAINT "PolicyRole_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PolicyRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Policy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL
);
INSERT INTO "new_Policy" ("action", "id", "resource") SELECT "action", "id", "resource" FROM "Policy";
DROP TABLE "Policy";
ALTER TABLE "new_Policy" RENAME TO "Policy";
CREATE UNIQUE INDEX "Policy_name_key" ON "Policy"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
