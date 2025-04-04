"use client";
import { createContext } from "react";
import { useTheme, useBreakpoint, useReducedMotion } from "@lib/hooks";
import type { ClientContextProps, ClientProviderProps } from "./types";
import { useMemo } from "react";
import dynamic from "next/dynamic";

export const ClientContext = createContext<ClientContextProps>({
	theme: "light",
	setTheme: () => {},
	breakpoint: "sm",
	isMobile: false,
	reducedMotion: false,
	setReducedMotion: () => {},
});

const _ClientProvider = ({ children }: ClientProviderProps) => {
	const { theme, setTheme } = useTheme();
	const { breakpoint, isMobile } = useBreakpoint();
	const { reducedMotion, setReducedMotion } = useReducedMotion();

	const value = useMemo(
		() => ({ theme, setTheme, breakpoint, isMobile, reducedMotion, setReducedMotion }),
		[theme, setTheme, breakpoint, isMobile, reducedMotion, setReducedMotion],
	);

	return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};

export const ClientProvider = dynamic(() => Promise.resolve(_ClientProvider), { ssr: false });
