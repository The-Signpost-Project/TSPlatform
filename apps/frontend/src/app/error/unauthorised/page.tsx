import { unauthorized } from "next/navigation";

export default function ForbiddenPage() {
	unauthorized();
}
