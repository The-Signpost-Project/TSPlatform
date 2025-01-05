-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CaseRegion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    CONSTRAINT "CaseRegion_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CaseRegion_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Peddler" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codename" TEXT NOT NULL,
    "mainRegion" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Peddler_mainRegion_fkey" FOREIGN KEY ("mainRegion") REFERENCES "Region" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Peddler" ("birthYear", "codename", "createdAt", "firstName", "id", "lastName", "mainRegion", "race", "sex") SELECT "birthYear", "codename", "createdAt", "firstName", "id", "lastName", "mainRegion", "race", "sex" FROM "Peddler";
DROP TABLE "Peddler";
ALTER TABLE "new_Peddler" RENAME TO "Peddler";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");
