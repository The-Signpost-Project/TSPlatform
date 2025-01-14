export interface StrictCase {
	id: string;
	// user attrs
	createdById: string;
	createdByUsername: string;
	// region attrs
	regionId: string;
	regionName: string;
	// case attrs
	interactionDate: Date;
	location: string;
	notes: string;
	importance: 1 | 2 | 3 | 4 | 5;
	firstInteraction: boolean;
	createdAt: Date;
	updatedAt: Date;
	photoPaths: string[];
	// peddler attrs
	peddlerId: string;
	peddlerCodename: string;
}

export type CreateCaseInput = {
	createdById: string;
	regionId: string;
	interactionDate: Date;
	location: string;
	notes: string;
	importance: 1 | 2 | 3 | 4 | 5;
	firstInteraction: boolean;
	peddlerId: string;
};

export type UpdateCaseInput = Partial<CreateCaseInput>;
