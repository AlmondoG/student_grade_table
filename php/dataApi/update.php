<?php



$result = null;

$student_id = $_POST["id"];
$name = $_POST["name"];
$course = $_POST["course"];
$grade = $_POST["grade"];

//check if you have all the data you need from the client-side call
//this should include the fields being changed and the ID of the student to be changed
if(isset($student_id) && isset($name) && isset($course) && isset($grade)) {
    //write a query that updates the data at the given student ID




    //DON'T FORGET TO CHECK THIS PART YO
    $sqlUpdate = "UPDATE `student_data` SET `name`='{$name}', `course_name`='{$course}', `grade`='{$grade}' WHERE `id`='{$student_id}'";




    //send the query to the database, store the result of the query into $result
    $result = mysqli_query($conn, $sqlUpdate);

    //check if $result is empty.
    if(empty($result)) {
        //if it is, add 'database error' to errors
        $output["errors"][] = "Database Error";
    } else {
        //check if the number of affected rows is 1
        //please note that if the data updated is EXCACTLY the same as the original data, it will show a result of 0
        if(mysqli_affected_rows($conn) === 1) {
            //if it did, change output success to true
            $output["success"] = true;
        } else {
            //if not, add to the errors: 'update error'
            $output["errors"][] = "Update Error";
        }
    }
} else {
    //if not, add an appropriate error to errors
    $output["errors"][] = "Missing Info";
}

?>