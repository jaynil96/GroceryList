<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');


if(!isset($_POST) || !isset($_POST['id'])) die();

session_start();

if($_SESSION['id'] != $_POST['id']) die(); // CSRF attack

$response = [];

$con = mysqli_connect('localhost', 'root', '', 'test_site');

$newPass = mysqli_real_escape_string($con, $_POST['newPass']);
$user = mysqli_real_escape_string($con, $_POST['currentuser']);

$query = "UPDATE `user` SET `password`=? WHERE `username`=?";
$stmt= $con->prepare($query);
$stmt->bind_param("ss", $newPass, $user);
$result = $stmt->execute();
$result = mysqli_query($con, $query);

if($result) {
	$response['status'] = 'done';
} else {
	$response['status'] = 'error';
}

echo json_encode($response);
