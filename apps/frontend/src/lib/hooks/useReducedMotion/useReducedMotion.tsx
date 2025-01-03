"use client";
import { useState, useLayoutEffect, useEffect } from "react";

export function useReducedMotion() {
	const [reducedMotion, setReducedMotion] = useState(() => {
		// get the value from local storage
		const localStorageReducedMotion = localStorage.getItem("reducedMotion");
		if (localStorageReducedMotion === null) {
			return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		}
		return localStorageReducedMotion === "true";
	});

	// class to disable animations and transitions
	const reducedMotionClass = "!animate-none !transition-none";

	useLayoutEffect(() => {
		if (reducedMotion) {
			document.documentElement.classList.add(...reducedMotionClass.split(" "));
		} else {
			document.documentElement.classList.remove(...reducedMotionClass.split(" "));
		}
	}, [reducedMotion]);

	useEffect(() => {
		localStorage.setItem("reducedMotion", String(reducedMotion));
	}, [reducedMotion]);

	return {
		reducedMotion,
		setReducedMotion,
	};
}
