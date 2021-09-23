import { writable } from 'svelte/store';

function createCurrentScene() {
	const { subscribe, set} = writable("");

	return {
		subscribe,
		set: (name) => set(name)
	};
}

export const currentScene = createCurrentScene();