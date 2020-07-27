<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

 $fileNameArr = glob('images/*.*');

 echo json_encode($fileNameArr);
?>