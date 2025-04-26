-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CasePhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "photoPath" TEXT NOT NULL,
    CONSTRAINT "CasePhoto_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CasePhoto" ("caseId", "id", "photoPath") SELECT "caseId", "id", "photoPath" FROM "CasePhoto";
DROP TABLE "CasePhoto";
ALTER TABLE "new_CasePhoto" RENAME TO "CasePhoto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
