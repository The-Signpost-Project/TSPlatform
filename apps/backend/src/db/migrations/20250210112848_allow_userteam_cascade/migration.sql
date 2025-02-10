-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserTeam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserTeam" ("id", "teamId", "userId") SELECT "id", "teamId", "userId" FROM "UserTeam";
DROP TABLE "UserTeam";
ALTER TABLE "new_UserTeam" RENAME TO "UserTeam";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
