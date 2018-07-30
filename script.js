/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

var studentArray = [];


/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    addClickHandlersToElements();
    renderGradeAverage();
    $(".updateModalShadow").hide();
    $(".updateModal").on("click", (e) => e.stopPropagation());
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    $(".add-button").on("click", handleAddClicked);
    $(".cancel-button").on("click", handleCancelClick);
    $(".data-button").on("click", handleDataClick);
    $(".updateModalShadow").on("click", updateModalHide);
    $(".update-button").on("click", updateTheStudent);
    $(".modal-cancel-button").on("click", updateModalHide);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(){
    addStudent();
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
    var studentObject = {};
    studentObject.name = $("#studentName").val();
    studentObject.course = $("#course").val();
    studentObject.grade = $("#studentGrade").val();
    studentArray.push(studentObject);

    clearAddStudentFormInputs();
    updateStudentList(studentObject);
    sendStudentToServer(studentObject);
}


function sendStudentToServer(newStudentInfo) {
    var ajaxOptions = {
        url: "php/data.php?action=insert",
        dataType: "json",
        method: "post",
        data: {
            api_key: "3IdDquJkRB",
            name: newStudentInfo.name,
            course: newStudentInfo.course,
            grade: newStudentInfo.grade
        },
        success: function(result) {
            //Do the entries in the studentArray need an ID too?
            newStudentInfo.id = result.id;
        }
    };

    $.ajax(ajaxOptions);
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    $("#studentName").val("");
    $("#course").val("");
    $("#studentGrade").val("");
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj){
    var row = $("<tr>");
    var nameText = $("<td>", {
        text: studentObj.name
    });
    var courseText = $("<td>", {
        text: studentObj.course
    });
    var gradeText = $("<td>", {
        text: studentObj.grade
    });
    var deleteUpdateTableData = $("<td>", {
        "class": "btn-toolbar"
    });
    var deleteButton = $("<button>", {
        text: "DELETE",
        "class": "btn btn-sm btn-danger",
        click: function(){
            var objectIndex = studentArray.indexOf(studentObj);
            studentArray.splice(objectIndex, 1);
            $(row).remove();
            deleteFromServer(studentObj);
            var avg = calculateGradeAverage(studentArray);
            renderGradeAverage(avg);
        }
    });
    var updateButton = $("<button>", {
        text: "UPDATE",
        "class": "btn btn-sm btn-warning",
        click: function() {
            updateModal(studentObj);
        }
    });
    $(deleteUpdateTableData).append(updateButton, deleteButton);
    $(row).append(nameText, courseText, gradeText, deleteUpdateTableData);
    $("tbody").append(row);
}


function deleteFromServer(studentInfo) {
    var ajaxOptions = {
        url: "php/data.php?action=delete",
        type: "POST",
        dataType: "json",
        data: {
            api_key: "3IdDquJkRB",
            "id": studentInfo.id
        },
        success: function(result) {
        }
    };

    $.ajax(ajaxOptions);
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(array){
    renderStudentOnDom(array);
    var avg = calculateGradeAverage(studentArray);
    renderGradeAverage(avg);
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(arrayParam){
    var totalGrade = 0;
    for (var studentArrayIndex = 0; studentArrayIndex < arrayParam.length; studentArrayIndex++) {
        totalGrade += parseFloat(arrayParam[studentArrayIndex].grade);
    }
    var averageGrade = totalGrade / arrayParam.length;
    return parseFloat(averageGrade.toFixed(2));
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(avgNum){
    if (studentArray.length === 0) {
        $(".avgGrade").text("0");
    } else {
        $(".avgGrade").text(avgNum);
    }
}



function handleDataClick() {
    $("tbody").empty();
    var ajaxOptions = {
        //Why do we need the "http://" in the url? Why did it not work without it
        url: "php/data.php?action=readAll",
        dataType: "json",
        method: "post",
        //Data is the input
        data: {
            api_key: "3IdDquJkRB"
        },
        //Success be the output
        success: function(result) {
            console.log(result);
            for (var dataIndex = 0; dataIndex < result.data.length; dataIndex++) {
                var apiStudentInfo = {
                    //Why do we need id as a property yo??
                    id: result.data[dataIndex].id,
                    name: result.data[dataIndex].name,
                    course: result.data[dataIndex].course_name,
                    grade: result.data[dataIndex].grade
                };
                studentArray.push(apiStudentInfo);
                updateStudentList(apiStudentInfo);
            }
        }
    };

    $.ajax(ajaxOptions);
}





//Hide modal function
function updateModalHide() {
    $(".updateModalShadow").hide();
}





//Show the modal function
function updateModal(studentObj) {
    $(".hidden-id").val(studentObj.id);
    $("#modalStudentName").val(studentObj.name);
    $("#modalCourse").val(studentObj.course);
    $("#modalStudentGrade").val(studentObj.grade);
    $(".updateModalShadow").show();

}





//Update the student function
function updateTheStudent() {
    var ajaxCall = {
        url: "php/data.php?action=update",
        dataType: "json",
        method: "post",
        data: {
            "id": $(".hidden-id").val(),
            "name": $("#modalStudentName").val(),
            "course": $("#modalCourse").val(),
            "grade": $("#modalStudentGrade").val()
        },
        success: function() {
            handleDataClick();
            updateModalHide();
        }
    };

    $.ajax(ajaxCall);
}





//Clear


