/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `Team` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    "interactionDate" DATETIME NOT NULL,
    "regionId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "photoPath" TEXT,
    "notes" TEXT NOT NULL,
    "importance" INTEGER NOT NULL,
    "firstInteraction" BOOLEAN NOT NULL,
    "peddlerId" TEXT NOT NULL,
    CONSTRAINT "Case_peddlerId_fkey" FOREIGN KEY ("peddlerId") REFERENCES "Peddler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Case_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Case_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Case" ("createdAt", "createdById", "firstInteraction", "id", "importance", "interactionDate", "location", "notes", "peddlerId", "regionId", "updatedAt") SELECT "createdAt", "createdById", "firstInteraction", "id", "importance", "interactionDate", "location", "notes", "peddlerId", "regionId", "updatedAt" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
CREATE TABLE "new_Region" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "photoPath" TEXT
);
INSERT INTO "new_Region" ("id", "name") SELECT "id", "name" FROM "Region";
DROP TABLE "Region";
ALTER TABLE "new_Region" RENAME TO "Region";
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");
CREATE TABLE "new_Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "photoPath" TEXT
);
INSERT INTO "new_Team" ("id", "name") SELECT "id", "name" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
