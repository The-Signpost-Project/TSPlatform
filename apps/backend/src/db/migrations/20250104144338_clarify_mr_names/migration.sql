/*
  Warnings:

  - You are about to drop the column `peddlerAId` on the `PeddlerMergeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `peddlerBId` on the `PeddlerMergeRequest` table. All the data in the column will be lost.
  - Added the required column `peddlerNewId` to the `PeddlerMergeRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peddlerOldId` to the `PeddlerMergeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PeddlerMergeRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peddlerNewId" TEXT NOT NULL,
    "peddlerOldId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    CONSTRAINT "PeddlerMergeRequest_peddlerNewId_fkey" FOREIGN KEY ("peddlerNewId") REFERENCES "Peddler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PeddlerMergeRequest_peddlerOldId_fkey" FOREIGN KEY ("peddlerOldId") REFERENCES "Peddler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PeddlerMergeRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PeddlerMergeRequest" ("id", "notes", "requestedById") SELECT "id", "notes", "requestedById" FROM "PeddlerMergeRequest";
DROP TABLE "PeddlerMergeRequest";
ALTER TABLE "new_PeddlerMergeRequest" RENAME TO "PeddlerMergeRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
