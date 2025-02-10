/*
  Warnings:

  - A unique constraint covering the columns `[peddlerId,disabilityId]` on the table `PeddlerDisability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[policyId,roleId]` on the table `PolicyRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,roleId]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,teamId]` on the table `UserTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PeddlerDisability_peddlerId_disabilityId_key" ON "PeddlerDisability"("peddlerId", "disabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "PolicyRole_policyId_roleId_key" ON "PolicyRole"("policyId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTeam_userId_teamId_key" ON "UserTeam"("userId", "teamId");
