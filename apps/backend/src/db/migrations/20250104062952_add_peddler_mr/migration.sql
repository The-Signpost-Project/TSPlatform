-- CreateTable
CREATE TABLE "PeddlerMergeRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peddlerAId" TEXT NOT NULL,
    "peddlerBId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    CONSTRAINT "PeddlerMergeRequest_peddlerAId_fkey" FOREIGN KEY ("peddlerAId") REFERENCES "Peddler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PeddlerMergeRequest_peddlerBId_fkey" FOREIGN KEY ("peddlerBId") REFERENCES "Peddler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PeddlerMergeRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
