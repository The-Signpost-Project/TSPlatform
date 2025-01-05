/*
  Warnings:

  - You are about to drop the column `mainRegion` on the `Peddler` table. All the data in the column will be lost.
  - Added the required column `mainRegionId` to the `Peddler` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Peddler" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codename" TEXT NOT NULL,
    "mainRegionId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Peddler_mainRegionId_fkey" FOREIGN KEY ("mainRegionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Peddler" ("birthYear", "codename", "createdAt", "firstName", "id", "lastName", "race", "sex") SELECT "birthYear", "codename", "createdAt", "firstName", "id", "lastName", "race", "sex" FROM "Peddler";
DROP TABLE "Peddler";
ALTER TABLE "new_Peddler" RENAME TO "Peddler";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
