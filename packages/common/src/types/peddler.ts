import type { Express } from "express";

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
	birthYear: number;
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
	birthYear: number;
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
