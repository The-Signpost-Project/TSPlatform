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
    "notes" TEXT NOT NULL,
    "importance" INTEGER NOT NULL,
    "firstInteraction" BOOLEAN NOT NULL,
    "peddlerId" TEXT NOT NULL,
    CONSTRAINT "Case_peddlerId_fkey" FOREIGN KEY ("peddlerId") REFERENCES "Peddler" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Case_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Case_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Case" ("createdAt", "createdById", "firstInteraction", "id", "importance", "interactionDate", "location", "notes", "peddlerId", "regionId", "updatedAt") SELECT "createdAt", "createdById", "firstInteraction", "id", "importance", "interactionDate", "location", "notes", "peddlerId", "regionId", "updatedAt" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
CREATE TABLE "new_PeddlerMergeRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peddlerNewId" TEXT NOT NULL,
    "peddlerOldId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    CONSTRAINT "PeddlerMergeRequest_peddlerNewId_fkey" FOREIGN KEY ("peddlerNewId") REFERENCES "Peddler" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PeddlerMergeRequest_peddlerOldId_fkey" FOREIGN KEY ("peddlerOldId") REFERENCES "Peddler" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PeddlerMergeRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PeddlerMergeRequest" ("id", "notes", "peddlerNewId", "peddlerOldId", "requestedById") SELECT "id", "notes", "peddlerNewId", "peddlerOldId", "requestedById" FROM "PeddlerMergeRequest";
DROP TABLE "PeddlerMergeRequest";
ALTER TABLE "new_PeddlerMergeRequest" RENAME TO "PeddlerMergeRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
