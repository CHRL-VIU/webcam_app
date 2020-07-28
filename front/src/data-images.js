import {writable} from 'svelte/store'
export let images = writable([])
export let img = writable([])
export const numImages =  writable(0)
export const slide_id = writable(0)


