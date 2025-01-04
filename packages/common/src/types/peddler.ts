export interface StrictPeddler {
	id: string;
	codename: `${string}_${string}_${"M" | "F"}`;
	mainRegion: string;
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
	mainRegion: string;
	firstName: string | null;
	lastName: string;
	race: "Chinese" | "Malay" | "Indian" | "Others";
	sex: "M" | "F";
	birthYear: number;
	disabilities: {
		id: string;
	}[];
}

export type UpdatePeddlerInput = Partial<CreatePeddlerInput>;

export type CreateDisabilityInput = {
	name: string;
};

export type UpdateDisabilityInput = Partial<CreateDisabilityInput>;
