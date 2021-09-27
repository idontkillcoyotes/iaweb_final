import { writable } from 'svelte/store';

function createCurrentScene() {
	const { subscribe, set} = writable("");

	return {
		subscribe,
		set: (name) => set(name)
	};
}

export const currentScene = createCurrentScene();

export const alignmentFactor = writable(1.0)
export const cohesionFactor = writable(1.0)
export const separationFactor = writable(3.0)
export const seekFactor = writable(1.0)