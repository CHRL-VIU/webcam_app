<script>
import {images} from './data-images.js'
import Image from "svelte-image"
export let image = {}
const imgPath = 'http://www.viu-hydromet-wx.ca/webcam_images/'

</script>

<div class = "image"> 
  <Image src="{imgPath}{image}"/>
</div>
