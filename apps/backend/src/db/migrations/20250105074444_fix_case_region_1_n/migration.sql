/*
  Warnings:

  - You are about to drop the `CaseRegion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `region` on the `Case` table. All the data in the column will be lost.
  - Added the required column `regionId` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CaseRegion";
PRAGMA foreign_keys=on;

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
INSERT INTO "new_Case" ("createdAt", "createdById", "firstInteraction", "id", "importance", "interactionDate", "location", "notes", "peddlerId", "photoPath", "updatedAt") SELECT "createdAt", "createdById", "firstInteraction", "id", "importance", "interactionDate", "location", "notes", "peddlerId", "photoPath", "updatedAt" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
