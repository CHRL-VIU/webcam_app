<script>
import {images, numImages, slide_id, userStn} from './data-images.js' 
import {onMount, tick} from 'svelte'
import Image from './Image.svelte'
import { writable } from 'svelte/store'

onMount( async() => {
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
})

async function plum(){  
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
    console.log(url)
}
async function klina(){
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=klinaklini'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
    console.log(url)
}
async function homath(){
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=homathko'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
    console.log(url)
}
async function perse(){
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=perseverance'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
    console.log(url)
}
</script>
<button on:click={plum}>
Plummer
</button>
<button on:click={klina}>
Klinaklini
</button>
<button on:click={homath}>
Homathko
</button>
<button on:click={perse}>
Perseverance
</button>
<div class = "body">
<div class = "slideshow">

 <Image image={$images[$slide_id]}/>
</div>
<div class ="rangecontainer">
<h3>Image Name: {$images[$slide_id]}</h3>
<input bind:value={$slide_id}  type="range" min="0" max={$numImages} step="1" class="slider">
</div>
</div>

<style>
.rangecontainer {
  display: inline;
  max-width: 100%; /* Width of the outside container */
}

.slider{
    -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}


</style>


