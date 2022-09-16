<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!isset($_POST)) die();
session_start();

$response = [];

$con = mysqli_connect('localhost', 'root', '', 'test_site');

$username = mysqli_real_escape_string($con, $_POST['username']);

$sql = "SELECT * FROM `items` WHERE `username`= '.$username.'";
$result = $con->query($sql);

$response['statement'] = $sql;
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $response['status'] = 'good';
    $response['item'] = $row['item'];
    $response['cost'] = $row['cost'];
  }
} else {
	$response['status'] = 'error';
}
