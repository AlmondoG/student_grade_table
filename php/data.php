<?php

define('fromData',true);

if(empty($_GET["action"] /* check if the get superglobal variable 'action' is empty*/)){
	exit('no action specified');
}
//require the mysql_connect.php file.  Make sure your properly configured it!
require_once "mysql_connect.php";

$output = [
	'success'=> false, //we assume we will fail
	'errors'=>[]
];

switch($_GET["action"] /*do a comparison switch on the get superglobal action*/){
	case 'readAll':
		//include the php file 'read.php'
        include("./dataApi/read.php");
		break;
	case 'insert':
		//include the php file insertLon.php
        include("./dataApi/insert.php");
		break;
	case 'delete':
		//include the php file delete.php
        include("./dataApi/delete.php");
		break;
	case 'update':
		//include the update.php file
        include("./dataApi/update.php");
		break;
}

//convert the $output variable to json, store the result in $outputJSON
$outputJSON = json_encode($output);

//print $outputJSON
print($outputJSON);

//end

?>