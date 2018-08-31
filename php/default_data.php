<?php

require './mysql_connect.php';
require './default_mysql_connect.php';

if($conn) {
    print ("Conn is connected <br>");
}

if($conn_default) {
    print ("Conn_default is connected <br>");
}

$query = "DELETE FROM `student_data`";
$result = mysqli_query($conn, $query);
print("Delete query ran: $result");


$query = "SELECT * FROM `student_data`";
$result = mysqli_query($conn_default, $query);

if(empty($result)) {
    print('database error');
} else {
    if($result) {
        $rows = [];
        while($row = mysqli_fetch_assoc($result)) {
            $id = $row['id'];
            $name = $row['name'];
            $grade = $row['grade'];
            $course = $row['course_name'];
            $update_query = "INSERT INTO `student_data`(`id`, `name`, `grade`, `course_name`) VALUES ($id, '{$name}', $grade, '{$course}')";
            print($update_query);
            mysqli_query($conn, $update_query);
        };
    } else {
        $output['errors'][] = 'no data';
    };
};

print_r($rows);


?>