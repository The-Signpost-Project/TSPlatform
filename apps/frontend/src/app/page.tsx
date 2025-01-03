import { Features, Hero, TechStack } from "./components";

export default async function Home() {
	return (
		<div>
			<Hero />
			<Features />
			<TechStack />
		</div>
	);
}
