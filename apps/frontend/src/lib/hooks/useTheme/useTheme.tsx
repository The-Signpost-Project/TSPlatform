"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import type { Theme } from "./types";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		const localStorageTheme = localStorage.getItem("theme");

		if (localStorageTheme === "light" || localStorageTheme === "dark") {
			return localStorageTheme;
		}
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
		return systemTheme;
	});

	// on initial render, set the theme class on the html element
	useLayoutEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	// always update the local storage when the theme changes
	useEffect(() => {
		localStorage.setItem("theme", theme);
	}, [theme]);

	return {
		theme,
		setTheme,
	};
}
