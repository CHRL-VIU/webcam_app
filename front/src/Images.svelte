<script>
import {images} from './data-images.js' 
import {onMount} from 'svelte'
import Image from './Image.svelte'

onMount( async() => {
    const url = 'http://localhost/get-images.php'
    let res = await fetch(url)
    res = await res.json()
    //console.log(res)
    $images = res
})
</script>

<div id = "Images"> 
    {#each $images as image}
     <Image {image}/>
   {/each}
</div>