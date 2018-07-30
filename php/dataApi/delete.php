<?php



$result = null;

$student_id = $_POST["id"];

//check if you have all the data you need from the client-side call
if(isset($student_id)) {
    //write a query that deletes the student by the given student ID
    $sqlDelete = "DELETE FROM  `student_data` WHERE `id`='{$student_id}'";

    //send the query to the database, store the result of the query into $result
    $result = mysqli_query($conn, $sqlDelete);

    //check if $result is empty
    if(empty($result)) {
        //if it is, add 'database error' to errors
        $output["errors"][] = "Database Error";
    } else {
        //check if the number of affected rows is 1
        if(mysqli_affected_rows($conn) === 1) {
            //if it did, change output success to true
            $output["success"] = true;
        } else {
            //if not, add to the errors: 'delete error'
            $output["errors"][] = "Delete Error";
        }
    }
} else {
    //if not, add an appropriate error to errors
    $output["errors"][] = "Missing info ";
}

?>