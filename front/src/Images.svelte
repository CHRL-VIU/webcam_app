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

<div class="header">
    <a href="http://www.viu-hydromet-wx.ca/" class="logo">
        <img src = "images/chrl-logo-text.png" alt = "CHRL logo" style= "width:184px;height:48px;">
    </a>
    <div class="header-right">
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
    </div>
  </div>



<div class = "body">
<div class = "slideshow">
<h5 style="word-wrap: break-word; margin-top: 0.2em; margin-bottom: 0.2em">Filename: {$images[$slide_id]}</h5>
 <Image image={$images[$slide_id]}/>
</div>
<div class ="rangecontainer">
<input bind:value={$slide_id}  type="range" min="0" max={$numImages} step="1" class="slider">
</div>
</div>

<style>

 .header-right {
   float: right;
 } 




.rangecontainer {
  display: inline;
  max-width: 100%; /* Width of the outside container */
}

.slider{
  max-width: 743px;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}


</style>


