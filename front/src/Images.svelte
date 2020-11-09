<script>
import {images, numImages, slide_id} from './data-images.js' 
import {onMount, tick} from 'svelte'
import Image from './Image.svelte'
let flag = true;

// functions for next and previous buttons
function prevImage() {
  if($slide_id > 0) {
    $slide_id--;
  }
}
function nextImage() {
  if($slide_id + 1 < $numImages) {
    $slide_id++;
  }
}

// initiate reactive functions for each station
onMount( async() => {
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
    $slide_id = $numImages
})

async function plum(){  
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
    $slide_id = $numImages
}
async function klina(){
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=klinaklini'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
    $slide_id = $numImages
}
async function homath(){
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=homathko'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
    $slide_id = $numImages
}
async function perse(){
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=perseverance'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
    $slide_id = $numImages
}

async function cruick(){
    const url = 'http://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=cruickshank'
    let res = await fetch(url)
    res = await res.json()
    $images = res
    $numImages = res.length-1
    $slide_id = $numImages
}
</script>

<!--Define Header-->
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

             <button on:click={cruick}>
            Cruickshank
            </button>
    </div>
  </div>


<!--Create range slider container with images from user selected station-->
<div class = "body" style = "text-align: center">
<figure class = "slideshow">
<div class = "filename">
  <h5>Filename: {$images[$slide_id]}</h5>
</div>
 <Image image={$images[$slide_id]}/>
 <div class ="rangecontainer">
  <input bind:value={$slide_id}  type="range" min="0" max={$numImages} step="1" class="slider"> <br>
  <button on:click={prevImage}> Previous </button>
  <button on:click={nextImage}> Next </button>  
  </div>        
 </figure>
</div>

<style>

    .slideshow {
                margin: auto;
                max-width: 100%;
                max-height: 75vh;              
    }


  .filename {
    display: block;
    word-wrap: break-word;
  }
 .header-right {
   float: right;
 } 

 @media screen and (max-width: 600px) {
  .header a {
    float: none;
    display: block;
    text-align: left;
  }
  .header-right {
    float: none;
  }
}

.rangecontainer {
  display: block;
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


