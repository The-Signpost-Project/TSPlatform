-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PeddlerDisability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peddlerId" TEXT NOT NULL,
    "disabilityId" TEXT NOT NULL,
    CONSTRAINT "PeddlerDisability_peddlerId_fkey" FOREIGN KEY ("peddlerId") REFERENCES "Peddler" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PeddlerDisability_disabilityId_fkey" FOREIGN KEY ("disabilityId") REFERENCES "Disability" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PeddlerDisability" ("disabilityId", "id", "peddlerId") SELECT "disabilityId", "id", "peddlerId" FROM "PeddlerDisability";
DROP TABLE "PeddlerDisability";
ALTER TABLE "new_PeddlerDisability" RENAME TO "PeddlerDisability";
CREATE TABLE "new_PeddlerMergeRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peddlerNewId" TEXT NOT NULL,
    "peddlerOldId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    CONSTRAINT "PeddlerMergeRequest_peddlerNewId_fkey" FOREIGN KEY ("peddlerNewId") REFERENCES "Peddler" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PeddlerMergeRequest_peddlerOldId_fkey" FOREIGN KEY ("peddlerOldId") REFERENCES "Peddler" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PeddlerMergeRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PeddlerMergeRequest" ("id", "notes", "peddlerNewId", "peddlerOldId", "requestedById") SELECT "id", "notes", "peddlerNewId", "peddlerOldId", "requestedById" FROM "PeddlerMergeRequest";
DROP TABLE "PeddlerMergeRequest";
ALTER TABLE "new_PeddlerMergeRequest" RENAME TO "PeddlerMergeRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
