"use server";

import { PeddlerSchema, StrictCaseSchema } from "@shared/common/schemas";
import type { CreateCaseInput, CreatePeddlerInput, StrictCase } from "@shared/common/types";
import type { CaseFormValues } from "./types";
import { query } from "@utils";
import { getSessionCookieHeader } from "@utils";

export async function createCaseFromForm(
	form: CaseFormValues,
	photos: FileList | null,
	userId: string,
): Promise<{ success: true; data: StrictCase } | { success: false; error: string }> {
	let peddlerId: string | undefined = !form.firstInteraction ? form.peddlerId : undefined;
	// if firstInteraction is true, then the peddler is new
	// else, the peddler is existing
	if (form.firstInteraction) {
		const newPeddler = {
			mainRegionId: form.regionId,
			firstName: form.firstName,
			lastName: form.lastName,
			race: form.race,
			sex: form.sex,
			birthYear: form.birthYear,
			disabilityIds: form.disabilityIds,
		} satisfies CreatePeddlerInput;

		// create new peddler
		const { status, error, data } = await query({
			path: "/peddler",
			init: {
				method: "POST",
				body: JSON.stringify(newPeddler),
				headers: await getSessionCookieHeader(),
			},
			validator: PeddlerSchema,
		});

		if (status !== 201 || !data) {
			return {
				success: false,
				error: error?.cause ?? "An error occurred creating the peddler",
			};
		}
		peddlerId = data.id;
	}
	if (!peddlerId) {
		return {
			success: false,
			error: "Something went wrong, peddlerId is undefined (this should not happen)",
		};
	}
	const newCase = {
		createdById: userId,
		regionId: form.regionId,
		interactionDate: form.interactionDate,
		location: form.location,
		notes: form.notes,
		importance: form.importance,
		firstInteraction: true,
		peddlerId: peddlerId,
	} satisfies Omit<CreateCaseInput, "photos">;

	const formData = new FormData();
	if (photos)
		for (const photo of photos) {
			formData.append("photos", photo);
		}
	for (const [field, value] of Object.entries(newCase)) {
		formData.append(field, String(value));
	}

	console.log("formData", formData);

	const { status, error, data } = await query({
		path: "/case",
		init: {
			method: "POST",
			body: formData,
			headers: await getSessionCookieHeader(),
		},
		validator: StrictCaseSchema,
		withFiles: true,
	});

	console.log(status, error, data);
	if (status === 201 && data) {
		return { success: true, data };
	}
	return { success: false, error: error?.cause ?? "An error occurred creating the case" };
}
