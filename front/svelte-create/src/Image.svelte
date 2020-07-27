<script>
import {images} from './data-images.js'
import Image from "svelte-image"
export let image = {}
const imgPath = 'http://localhost/back/'
</script>

<div class = "image"> 
  <Image src="{imgPath}{image}"/>
</div>