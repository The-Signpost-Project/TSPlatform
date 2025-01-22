"use client";
import { useRouter } from "next/navigation";
import type { CaseOverlayProps } from "./types";
import { useKeybinds } from "@lib/hooks";
import { ModalCloseButton,Text, Title, Loader } from "@lib/components";
import { useEffect, useTransition, useState } from "react";
import type { StrictCase } from "@shared/common/types";
import { fetchCase } from "./utils";

export function CaseOverlay({ routerAction, caseId }: CaseOverlayProps) {
	const router = useRouter();
	const navigate = routerAction === "back" ? router.back : () => router.replace("/cases");
	useKeybinds({
		Escape: navigate,
	});
  const [isPending, startTransition] = useTransition();
  const [caseData, setCaseData] = useState<StrictCase | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    startTransition(async () => {
      const { data } = await fetchCase(caseId, controller.signal);
      setCaseData(data);
    });
    return () => controller.abort();
  }, [caseId]);
  
	return (
		<section
			className="fixed w-screen h-screen bg-gray-900 bg-opacity-50 z-50"
			onClick={navigate}
			onKeyDown={(e) => {
				if (e.key === "Escape") navigate();
			}}
		>
			<div
				className="lg:w-1/2 md:w-2/3 sm:w-5/6 w-11/12 absolute right-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col p-4 gap-2">
					<ModalCloseButton onClick={navigate} accessibilityLabel="case overlay" />
					<div className="px-4 flex flex-col gap-4">
            <Title order={5}>
              Case {caseId}
            </Title>
            {isPending && <Loader />}
            {caseData && JSON.stringify(caseData)}
          </div>
				</div>
			</div>
		</section>
	);
}
