<?php



$result = null;

$name = $_POST["name"];
$course = $_POST["course"];
$grade = $_POST["grade"];

//check if you have all the data you need from the client-side call.
if(isset($name) && isset($course) && isset($grade)) {
    //write a query that inserts the data into the database.
    //remember that ID doesn't need to be set as it is auto incrementing
    $sqlInsert = "INSERT INTO `student_data` (`name`, `grade`, `course_name`) VALUES ('{$name}', '{$grade}', '{$course}')";

    //send the query to the database, store the result of the query into $result
    $result = mysqli_query($conn, $sqlInsert);
    print($result);

    //check if $result is empty
    if(empty($result)) {
        //if it is, add 'database error' to errors
        $output["errors"][] = "database error";
    } else {
        //check if the number of affected rows is 1
        if(mysqli_affected_rows($conn) === 1) {
            //if it did, change output success to true
            $output["success"] = true;

            //get the insert ID of the row that was added
            //add 'insertID' to $output and set the value to the row's insert ID
            $output["insertID"] = $conn -> insert_id;
            //alternative method: mysqli_insert_id($conn);
        } else {
            //if not, add to the errors: 'insert error'
            $output["errors"][] = "insert error";
        }
    }
} else {
    //if not, add an appropriate error to errors
    $output["errors"][] = "It didn't work, missing info";
}

?>