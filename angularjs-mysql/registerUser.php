<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!isset($_POST)) die();

session_start();

$response = [];

$con = mysqli_connect('localhost', 'root', '', 'test_site');

$username = mysqli_real_escape_string($con, $_POST['username']);
$password = mysqli_real_escape_string($con, $_POST['password']);

$query = "INSERT INTO `users` VALUES('Null', ?, ? )";
$stmt= $con->prepare($query);
$stmt->bind_param("ss", $username, $password);
$result = $stmt->execute();

if($result) {
	$response['status'] = 'registered';
} else {
	$response['status'] = 'error';
}

echo json_encode($response);
