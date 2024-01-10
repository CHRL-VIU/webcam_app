<?php

// this is the get latest photo url with the download enabled
$url_array = [
    'plummer' => 'https://pvs.nupointsystems.com/latest2.php?pass=%F3uq%2C%F7%85c%D7%2A%10%ED%17%E2i%0A%00',
    'klinaklini' => 'https://pvs.nupointsystems.com/latest2.php?pass=%F3uq%2C%F7%85c%D7%2A0%9D%E5%5B%01%00',
//  'homathko' => 'https://pvs.nupointsystems.com/latest2.php?pass=%F3uq%2C%F7%85c%D7%2A%10%ED%E7%E2h%0A%00', // homathko down since  2023-06-30 - removed homathko from list on 2024-01-10 (Julien)
    'perseverance' => 'https://pvs.nupointsystems.com/latest2.php?pass=%F3uq%2C%F7%85c%D7%2A0%9D%95%5E%0E%00',
    'cruickshank' => 'https://pvs.nupointsystems.com/latest2.php?pass=%F3uq%2C%F7%85c%D7%2A0%5D%15X%0E%00',
    'skeena' => 'https://pvs.nupointsystems.com/latest2.php?pass=%F3uq%2C%F7%85c%D7%2A0%5D%95l%0C%00'
    ];

// where is the file going to be stored
$filename_array = [
    'plummer' => "/home/viuhydro/public_html/webcam_images/plummer/Plummer_VIU_UNBC_HAKAI__",
    'klinaklini' => "/home/viuhydro/public_html/webcam_images/klinaklini/VIU_UNBC_Hakai_Klin_",
//    'homathko' => "/home/viuhydro/public_html/webcam_images/homathko/Homathko_VIU_UNBC_Hakai_", // homathko down since  2023-06-30 - removed homathko from list on 2024-01-10 (Julien)
    'perseverance' => "/home/viuhydro/public_html/webcam_images/perseverance/ComoxRD_13000280_",
    'cruickshank' => "/home/viuhydro/public_html/webcam_images/cruickshank/Upper_Cruickshank_VIU_CVRD_",
    'skeena' => '/home/viuhydro/public_html/webcam_images/skeena/VIU_AXIS_13000377_'
];

// to get actual date taken and use that for filename
$meta_array = [
    'plummer' => 'https://pvs.nupointsystems.com/metadata.php?pass=%F3uq%2C%F7%85c%D7%2A%10%ED%17%E2i%0A%00',
    'klinaklini' => 'https://pvs.nupointsystems.com/metadata.php?pass=%F3uq%2C%F7%85c%D7%2A0%9D%E5%5B%01%00',
//    'homathko' => 'https://pvs.nupointsystems.com/metadata.php?pass=%F3uq%2C%F7%85c%D7%2A%10%ED%E7%E2h%0A%00',  // homathko down since  2023-06-30 - removed homathko from list on 2024-01-10 (Julien)
    'perseverance' => 'https://pvs.nupointsystems.com/metadata.php?pass=%F3uq%2C%F7%85c%D7%2A0%9D%95%5E%0E%00',
    'cruickshank' => "https://pvs.nupointsystems.com/metadata.php?pass=%F3uq%2C%F7%85c%D7%2A0%5D%15X%0E%00",
    'skeena' => 'https://pvs.nupointsystems.com/metadata.php?pass=%F3uq%2C%F7%85c%D7%2A0%5D%95l%0C%00'
    ];

   
// loop through url array stn name is key value is url then use the stn name to query the filename array    
foreach($url_array as $key => $value){
 //Get the file
$content = file_get_contents($value);
// Get date taken 
$meta = file_get_contents($meta_array[$key]);
$pos = strpos($meta, 'date_time');
$str = preg_replace('/[^0-9]/', '', substr($meta, $pos+13, 20));

//Store in the filesystem.
$fp = fopen($filename_array[$key].$str.".jpg", "w");
fwrite($fp, $content);
fclose($fp);
}

?>