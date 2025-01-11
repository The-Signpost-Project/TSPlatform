"use client";
import { UpdateUserInputSchema } from "@shared/common/schemas";
import { useContext } from "react";
import { AuthContext } from "@lib/providers";
import { toast } from "react-hot-toast";
import { TextSettingsRow } from "..";
import {
	Text,
	Table,
	AccordionContent,
	AccordionRoot,
	AccordionTrigger,
	AccordionItem,
} from "@lib/components";
import { AnimatePresence, motion } from "motion/react";
import { PolicyInfoModal } from "./PolicyInfoModal";

export function Profile() {
	const { updateUser, user, loading } = useContext(AuthContext);

	if (loading || !user) {
		return null;
	}

	async function changeUsernameCallback(id: string, username: string) {
		const success = await updateUser({ id, username }).then(({ error }) => {
			if (error) {
				toast.error(error);
				return false;
			}
			toast.success("Username changed successfully");
			return true;
		});
		return success;
	}

	return (
		<div className="space-y-4">
			<TextSettingsRow
				fieldKey="username"
				label="Display Name"
				value={user?.username}
				description="Your username is used for login and display."
				onSubmit={({ username }) => changeUsernameCallback(user?.id, username)}
				schema={UpdateUserInputSchema.required().shape.username}
			/>
			<AccordionRoot type="multiple" className="flex gap-2 p-2 w-full overflow-auto">
				<AccordionItem value="1" className="w-full">
					<AccordionTrigger withArrow className="w-full flex mb-2">
						<Text order="lg">Your Roles</Text>
					</AccordionTrigger>
					<AccordionContent>
						<AnimatePresence>
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.1 }}
								className="overflow-hidden"
							>
								{user.roles.length === 0 ? (
									<Text order="sm" description>
										No roles assigned
									</Text>
								) : (
									<Table.Table>
										<Table.TableHead>
											<Table.TableRow>
												<Table.TableHeader className="w-1/6">Role Name</Table.TableHeader>
												<Table.TableHeader>Policies</Table.TableHeader>
											</Table.TableRow>
										</Table.TableHead>
										<Table.TableBody>
											{user.roles.map((role) => (
												<Table.TableRow key={role.id}>
													<Table.TableCell>
														<Text>{role.name}</Text>
													</Table.TableCell>
													<Table.TableCell>
														{role.policies.map((policy) => (
															<PolicyInfoModal key={policy.id} policy={policy} />
														))}
													</Table.TableCell>
												</Table.TableRow>
											))}
										</Table.TableBody>
									</Table.Table>
								)}
							</motion.div>
						</AnimatePresence>
					</AccordionContent>
				</AccordionItem>
			</AccordionRoot>
		</div>
	);
}
