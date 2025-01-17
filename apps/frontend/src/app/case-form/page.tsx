import { DateInput, Title, Text } from "@lib/components";

export default function CaseForm() {
	return (
		<section className="p-4 flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<Title className="text-lg sm:text-3xl">The Signpost Project Combined Case Form</Title>
				<Text description className="text-sm sm:text-base">
					Please fill this in to the best of your ability!
				</Text>
			</div>
			<DateInput />
		</section>
	);
}
