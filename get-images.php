<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

 $fileNameArr = glob('plummer/*.*');

 echo json_encode($fileNameArr);
?>