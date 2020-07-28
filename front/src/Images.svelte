<script>
import {images, numImages, img} from './data-images.js' 
import {onMount} from 'svelte'
import Image from './Image.svelte'
import { writable } from 'svelte/store';

export const slide_id = writable([$numImages])

onMount( async() => {
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images.php'
    let res = await fetch(url)
    res = await res.json()
    //console.log(res)
    $images = res
    $numImages = res.length
    $img = $images[{}]
})

</script>

<Image image={$images[$slide_id]}/>
<h3>Image Number: {$slide_id}</h3>
<input bind:value={$slide_id}  type="range" min="0" max={$numImages} step="1">


