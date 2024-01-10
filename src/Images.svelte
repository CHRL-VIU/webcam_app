<script>
  import { images, numImages, slide_id } from "./data-images.js";
  import { onMount } from "svelte";
  import Image from "./Image.svelte";
  import { Map, Marker } from "@beyonk/svelte-mapbox";
  import {accessToken} from "./consts";
  import {listItems} from "./wx-coords";

  let mapComponent;
  let currentCam = "Plummer Hut";
  let curDate ="";
  let curTime ="";
  let curDateTime ="";
  let curElevation="";
  let curCoords="";
  // let reactDateTime = [$images[$slide_id].slice(-18, -14), $images[$slide_id].slice(-14, -12), $images[$slide_id].slice(-12, -10)].join("-");

  function onReady() {
    mapComponent.setCenter([-126,53.5], 4);
  }

  // functions for next and previous buttons
  function prevImage() {
    if ($slide_id > 0) {
      $slide_id--;
    }
  }
  function nextImage() {
    if ($slide_id < $numImages) {
      $slide_id++;
    }
  }

  // initiate reactive functions for each station
  onMount(async () => {
    const url =
      "https://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer";
    let res = await fetch(url);
    res = await res.json();
    $images = res;
    $numImages = res.length - 1;
    $slide_id = $numImages;
    currentCam = "Plummer Hut";
    curDate = [$images[$slide_id].slice(-18, -14), $images[$slide_id].slice(-14, -12), $images[$slide_id].slice(-12, -10)].join("-");
    curTime = [$images[$slide_id].slice(-10, -8), $images[$slide_id].slice(-8, -6), $images[$slide_id].slice(-6, -4),].join(":");
    curDateTime = [curDate, curTime, "UTC"].join(" ");
    curElevation = [listItems[0].elevation, " m"].join("");
    curCoords = listItems[0].coords;
  });

  async function plum() {
    const url =
      "https://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=plummer";
    let res = await fetch(url);
    res = await res.json();
    $images = res;
    $numImages = res.length - 1;
    $slide_id = $numImages;
    mapComponent.setCenter(listItems[0].coords, 9);
    currentCam = "Plummer Hut";
    curDate = [$images[$slide_id].slice(-18, -14), $images[$slide_id].slice(-14, -12), $images[$slide_id].slice(-12, -10)].join("-");
    curTime = [$images[$slide_id].slice(-10, -8), $images[$slide_id].slice(-8, -6), $images[$slide_id].slice(-6, -4)].join(":");
    curDateTime = [curDate, curTime, "UTC"].join(" ");
    curElevation = [listItems[0].elevation, " m"].join("");
    curCoords = listItems[0].coords;
  }
  async function klina() {
    const url =
      "https://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=klinaklini";
    let res = await fetch(url);
    res = await res.json();
    $images = res;
    $numImages = res.length - 1;
    $slide_id = $numImages;
    mapComponent.setCenter(listItems[1].coords, 9);
    currentCam = "Klinaklini";
    curDate = [$images[$slide_id].slice(-18, -14), $images[$slide_id].slice(-14, -12), $images[$slide_id].slice(-12, -10)].join("-");
    curTime = [$images[$slide_id].slice(-10, -8), $images[$slide_id].slice(-8, -6), $images[$slide_id].slice(-6, -4)].join(":");
    curDateTime = [curDate, curTime, "UTC"].join(" ");
    curElevation = [listItems[1].elevation, " m"].join("");
    curCoords = listItems[1].coords
  }
  async function homath() {
    const url =
      "https://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=homathko";
    let res = await fetch(url);
    res = await res.json();
    $images = res;
    $numImages = res.length - 1;
    $slide_id = $numImages;
    mapComponent.setCenter(listItems[2].coords, 9);
    currentCam = "Homathko";
    curDate = [$images[$slide_id].slice(-18, -14), $images[$slide_id].slice(-14, -12), $images[$slide_id].slice(-12, -10)].join("-");
    curTime = [$images[$slide_id].slice(-10, -8), $images[$slide_id].slice(-8, -6), $images[$slide_id].slice(-6, -4)].join(":");
    curDateTime = [curDate, curTime, "UTC"].join(" ");
    curElevation = [listItems[2].elevation, " m"].join("");
    curCoords = listItems[2].coords
  }
  async function perse() {
    const url =
      "https://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=perseverance";
    let res = await fetch(url);
    res = await res.json();
    $images = res;
    $numImages = res.length - 1;
    $slide_id = $numImages;
    mapComponent.setCenter(listItems[3].coords, 9);
    currentCam = "Perseverance";
    curDate = [$images[$slide_id].slice(-18, -14), $images[$slide_id].slice(-14, -12), $images[$slide_id].slice(-12, -10)].join("-");
    curTime = [$images[$slide_id].slice(-10, -8), $images[$slide_id].slice(-8, -6), $images[$slide_id].slice(-6, -4)].join(":");
    curDateTime = [curDate, curTime, "UTC"].join(" ");
    curElevation = [listItems[3].elevation, " m"].join("");
    curCoords = listItems[3].coords
  }

  async function cruick() {
    const url =
      "https://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=cruickshank";
    let res = await fetch(url);
    res = await res.json();
    $images = res;
    $numImages = res.length - 1;
    $slide_id = $numImages;
    mapComponent.setCenter(listItems[4].coords, 9);
    currentCam = "Upper Cruickshank";
    curDate = [$images[$slide_id].slice(-18, -14), $images[$slide_id].slice(-14, -12), $images[$slide_id].slice(-12, -10)].join("-");
    curTime = [$images[$slide_id].slice(-10, -8), $images[$slide_id].slice(-8, -6), $images[$slide_id].slice(-6, -4)].join(":");
    curDateTime = [curDate, curTime, "UTC"].join(" ");
    curElevation = [listItems[4].elevation, " m"].join("");
    curCoords = listItems[4].coords
  }

  async function skeena() {
    const url =
      "https://www.viu-hydromet-wx.ca/webcam_images/get-images-variable.php?stnName=skeena";
    let res = await fetch(url);
    res = await res.json();
    $images = res;
    $numImages = res.length - 1;
    $slide_id = $numImages;
    mapComponent.setCenter(listItems[5].coords, 5);
    currentCam = "Upper Skeena";
    curDate = [$images[$slide_id].slice(-18, -14), $images[$slide_id].slice(-14, -12), $images[$slide_id].slice(-12, -10)].join("-");
    curTime = [$images[$slide_id].slice(-10, -8), $images[$slide_id].slice(-8, -6), $images[$slide_id].slice(-6, -4)].join(":");
    curDateTime = [curDate, curTime, "UTC"].join(" ");
    curElevation = [listItems[5].elevation, " m"].join("");
    curCoords = listItems[5].coords
  }
</script>

<style>
 .wrapper { 
  /* border : 2px solid #000;  */
  overflow:hidden;
  display: block;

}

.wrapper div {
   min-height: 200px;
   padding: 10px;
   /* max-height: 500px; */
   height:100vh;
   /* background-color: green; */
}
#one {
  /* background-color: gray; */
  float:left; 
  /* margin-right:20px; */
  /* border-right:2px solid #000; */
  position: relative;
  padding-bottom: 0%;
  width:60%;
  }
#two { 
  /* background-color: white; */
  /* padding-top: 100px; */
  overflow:hidden;
  margin:10px;
  /* border:2px dashed #ccc; */
  min-height:170px;
  padding-top: 100px;
  height:70vh;
  
}

@media screen and (max-width: 800px) {
   #one { 
    /* background-color: gray; */
    overflow: hidden;
    float: none;
    width:auto;
    /* border-bottom:2px solid #000;   */
    position: relative;
    padding-bottom:11em;
    max-height: 100%;
  }
  #two { 
  /* background-color: white; */
  /* padding-top: 100px; */
  overflow:hidden;
  /* border:2px dashed #ccc; */
  min-height:170px;
  height:40vh;
  padding-top:0em;

}

  .wrapper div {
   /* min-height: 200px; */
   padding: 0px;
   /* max-height: 500px; */
   height:60vh;
   /* background-color: green; */
}
}
@media screen and (max-width: 500px) {
   #one { 
    /* background-color: gray; */
    float: none;
    width:auto;
    /* border-bottom:2px solid #000;   */
    position: relative;
    padding-bottom:1em;
    max-height: 100%;
  }
  #two { 
  /* background-color: white; */
  /* padding-top: 100px; */
  overflow:hidden;
  /* border:2px dashed #ccc; */
  min-height:170px;
  height:40vh;
    padding-top:0em;

}

  .wrapper div {
   /* min-height: 200px; */
   padding: 0px;
   /* max-height: 500px; */
   height:60vh;
   /* background-color: green; */
}
}
  .slideshow {
    margin: auto;
    height: 100%;
    max-width: 100%;
    /* min-width: 100%; */
    max-height: 70vh;
  }

  .filename {
    display: block;
    word-wrap: break-word;
    font-size: 2vh;
  }

  .rangecontainer {
    display: block;
    max-width: 100%; /* Width of the outside container */
  }

  .slider {
    max-width: 743px;
    width: 100%; /* Full-width */
    height: 25px; /* Specified height */
    background: #d3d3d3; /* Grey background */
    opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
    transition: opacity 0.2s;
  }

  /* Mouse-over effects */
  .slider:hover {
    opacity: 1; /* Fully shown on mouse-over */
  }
</style>

<!--Define Header-->
<div class="header">
  <a href="https://www.viu-hydromet-wx.ca/" class="logo">
    <img
      src="images/chrl-logo-text.png"
      alt="CHRL logo"
      style="width:250px;height:75x;" />
  </a>
</div>

<div>
  <button on:click={plum}> Plummer </button>

  <button on:click={klina}> Klinaklini </button>

  <button on:click={homath}> Homathko (Down) </button>

  <button on:click={perse}> Perseverance </button>

  <button on:click={cruick}> Cruickshank </button>

  <button on:click={skeena}> Skeena </button>

</div>

<!--Create range slider container with images from user selected station-->

<div class="wrapper">
  <div id="one">
      <div class="mainimage">
      <div class="body" style="text-align: center">
        <figure class="slideshow">
          <p class ="filename">
            Station: {currentCam}<br />
            Coordinates: {curCoords}<br />
            Elevation: {curElevation}<br />
            Filename: {$images[$slide_id]}
          </p>
          <Image image={$images[$slide_id]} />
          <div class="rangecontainer">
            <input
              bind:value={$slide_id}
              type="range"
              min="0"
              max={$numImages}
              step="1"
              class="slider" />
            <br />
            <button on:click={prevImage}> Previous </button>
            <button on:click={nextImage}> Next </button>
          </div>
        </figure>
      </div>
    </div>
</div>
  <div id="two">
      <Map
        {accessToken}
        style="mapbox://styles/mapbox/outdoors-v11"
        bind:this={mapComponent}
        on:ready={onReady}>
        <Marker
          lat={listItems[0].lat}
          lng={listItems[0].lon}
          label={listItems[0].name} />
        <Marker
          lat={listItems[1].lat}
          lng={listItems[1].lon}
          label={listItems[1].name} />
        <Marker
          lat={listItems[2].lat}
          lng={listItems[2].lon}
          label={listItems[2].name} />
        <Marker
          lat={listItems[3].lat}
          lng={listItems[3].lon}
          label={listItems[3].name} />
        <Marker
          lat={listItems[4].lat}
          lng={listItems[4].lon}
          label={listItems[4].name} />
        <Marker
        lat={listItems[5].lat}
        lng={listItems[5].lon}
        label={listItems[5].name} />
      </Map>
  </div>
</div>
