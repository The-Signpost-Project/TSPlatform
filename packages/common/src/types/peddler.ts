import type { SafeUser } from "./user";

export interface StrictPeddler {
	id: string;
	codename: `${string}_${string}_${"M" | "F"}`;
	mainRegion: {
		id: string;
		name: string;
	};
	firstName: string | null;
	lastName: string;
	race: "Chinese" | "Malay" | "Indian" | "Others";
	sex: "M" | "F";
	birthYear: string;
	createdAt: Date;
	disabilities: {
		id: string;
		name: string;
	}[];
}

export interface CreatePeddlerInput {
	mainRegionId: string;
	firstName: string | null;
	lastName: string;
	race: "Chinese" | "Malay" | "Indian" | "Others";
	sex: "M" | "F";
	birthYear: string; // can be estimated
	disabilityIds: string[];
}

export type UpdatePeddlerInput = Partial<CreatePeddlerInput>;

export interface Disability {
	id: string;
	name: string;
}

export type CreateDisabilityInput = {
	name: string;
};

export type UpdateDisabilityInput = Partial<CreateDisabilityInput>;

export interface Region {
	id: string;
	name: string;
	photoPath: string | null;
}

export type CreateRegionInput = {
	name: string;
	photo: Express.Multer.File | null;
};

export type UpdateRegionInput = Partial<CreateRegionInput>;

export type PeddlerMergeRequest = {
	id: string;
	peddlerNewId: string;
	peddlerOldId: string;
	notes: string;
	requestedById: string;
	peddlerNew: Omit<StrictPeddler, "disabilities" | "mainRegion">;
	peddlerOld: Omit<StrictPeddler, "disabilities" | "mainRegion">;
	requestedBy: Omit<SafeUser, "hasPassword" | "roles" | "oAuthProviders">;
};

export type CreatePeddlerMergeRequestInput = {
	peddlerNewId: string;
	peddlerOldId: string;
	notes: string;
	requestedById: string;
};

export type UpdatePeddlerMergeRequestInput = Partial<CreatePeddlerMergeRequestInput>;
