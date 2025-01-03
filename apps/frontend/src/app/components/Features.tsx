"use client";
import { motion } from "framer-motion";
import { Title, Text, Autocomplete, Gauge, Button, Table } from "@lib/components";
import { useEffect, useState, useContext } from "react";
import { AuthContext, ClientContext } from "@lib/providers";
import { query } from "@utils";
import { z } from "zod";
import { toast } from "react-hot-toast";

export function Features() {
	const [gaugeFullness, setGaugeFullness] = useState(75);
	const { user } = useContext(AuthContext);
	const { reducedMotion } = useContext(ClientContext);

	useEffect(() => {
		if (reducedMotion) return;
		const id = setInterval(() => {
			setGaugeFullness(Math.floor(Math.random() * 100));
		}, 1000);

		return () => clearInterval(id);
	}, [reducedMotion]);

	const handleTestEndpointCall = async () => {
		const { error } = await query({
			path: "/test",
			init: { method: "GET" },
			validator: z.null(),
		});
		if (error) {
			toast.error("The server returned an error");
		}
	};

	return (
		<section className="flex flex-col gap-10 sm:gap-32">
			<motion.div
				className="flex flex-col sm:flex-row items-center justify-between w-full px-12 gap-8"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1, transition: { duration: 0.5 } }}
				viewport={{ once: true, margin: "-50px 0px 0px 0px" }}
			>
				<div className="flex flex-col gap-4">
					<Title order={2}>Custom Tailwind Components</Title>
					<Text>
						Contains a variety of custom Tailwind components that can be used to build your
						application.
					</Text>
				</div>
				<div className="flex gap-2 flex-col items-center rounded-md border-2 border-zinc-800/20 dark:border-zinc-200/20 p-4 w-full sm:w-3/5 dark:bg-gray-950">
					<Autocomplete
						items={["React", "Vue", "Angular", "Svelte", "Ember", "Preact"]}
						handleChange={() => null}
						placeholder="Search for a framework"
						className="w-full"
					/>
					<motion.div>
						<Gauge progress={gaugeFullness}>
							<Text>{gaugeFullness}%</Text>
						</Gauge>
					</motion.div>
					<div className="flex gap-2 flex-col sm:flex-row">
						<Button>Info</Button>
						<Button color="danger">Danger</Button>
						<Button color="warning">Warning</Button>
					</div>
				</div>
			</motion.div>
			<motion.div
				className="flex flex-col-reverse sm:flex-row items-center justify-between w-full px-12 gap-8"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1, transition: { duration: 0.5 } }}
				viewport={{ once: true, margin: "-50px 0px 0px 0px" }}
			>
				<Table.Table>
					<Table.TableBody>
						<Table.TableRow>
							<Table.TableCell>Username</Table.TableCell>
							<Table.TableCell>{user?.username ?? "null"}</Table.TableCell>
						</Table.TableRow>
						<Table.TableRow>
							<Table.TableCell>Email</Table.TableCell>
							<Table.TableCell>{user?.email ?? "null"}</Table.TableCell>
						</Table.TableRow>
						<Table.TableRow>
							<Table.TableCell>Created At</Table.TableCell>
							<Table.TableCell>{user?.createdAt.toLocaleString() ?? "null"}</Table.TableCell>
						</Table.TableRow>
					</Table.TableBody>
				</Table.Table>
				<div className="flex flex-col gap-4">
					<Title order={2}>Built-in Authentication</Title>
					<Text>
						Comes with built-in password login and OAuth2 authentication. Includes email
						integration, user settings, and more.
					</Text>
				</div>
			</motion.div>
			<motion.div
				className="flex flex-col sm:flex-row items-center justify-between w-full px-12 gap-8"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1, transition: { duration: 0.5 } }}
				viewport={{ once: true, margin: "-50px 0px 0px 0px" }}
			>
				<div className="flex flex-col gap-4">
					<Title order={2}>Validation & Error Handling</Title>
					<Text>
						Has end-to-end type-safe validation and error handling. Use pre-defined protocols to
						communicate with the backend.
					</Text>
				</div>
				<div className="flex gap-2 flex-col items-center rounded-md border-2 border-zinc-800/20 dark:border-zinc-200/20 p-4 w-full sm:w-3/5 dark:bg-gray-950">
					<Button onClick={handleTestEndpointCall} color="danger">
						Click me
					</Button>
					<Text>Open the network inspector tab →</Text>
				</div>
			</motion.div>
		</section>
	);
}
