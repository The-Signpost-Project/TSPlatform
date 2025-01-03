/*
  Warnings:

  - You are about to drop the column `allowMarketing` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    CONSTRAINT "Policy_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "field" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    CONSTRAINT "Condition_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Peddler" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codename" TEXT NOT NULL,
    "mainRegion" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PeddlerDisability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peddlerId" TEXT NOT NULL,
    "disabilityId" TEXT NOT NULL,
    CONSTRAINT "PeddlerDisability_peddlerId_fkey" FOREIGN KEY ("peddlerId") REFERENCES "Peddler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PeddlerDisability_disabilityId_fkey" FOREIGN KEY ("disabilityId") REFERENCES "Disability" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Disability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    "interactionDate" DATETIME NOT NULL,
    "region" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "photoPath" TEXT,
    "notes" TEXT NOT NULL,
    "importance" INTEGER NOT NULL,
    "firstInteraction" BOOLEAN NOT NULL,
    "peddlerId" TEXT NOT NULL,
    CONSTRAINT "Case_peddlerId_fkey" FOREIGN KEY ("peddlerId") REFERENCES "Peddler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Case_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "passwordHash" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "allowEmailNotifications" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("createdAt", "email", "id", "passwordHash", "username", "verified") SELECT "createdAt", "email", "id", "passwordHash", "username", "verified" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Peddler_codename_key" ON "Peddler"("codename");

-- CreateIndex
CREATE UNIQUE INDEX "Disability_name_key" ON "Disability"("name");
