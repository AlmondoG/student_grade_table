<?php



//write a query that selects all the students from the database, all the data from each row
$sqlSelect = "SELECT * FROM `student_data`";
$result = null;
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn, $sqlSelect);

//check if $result is empty.
if(empty($result)) {
    //if it is, add 'database error' to errors
    $output["errors"][] = "database error";
} else {
    //check if any data came back
    if(mysqli_num_rows($result) > 0) {
        //if it did, change output success to true
        $output["success"] = true;
        $output['data']=[];

        //do a while loop to collect all the data
        while($row = mysqli_fetch_assoc($result)) {
            //add each row of data to the $output['data'] array
            $output["data"][] = $row;
        }

    } else {
        //if not, add to the errors: 'no data'
        $output["errors"][] = "no data";
    }
}

//print($output["data"]);

?>