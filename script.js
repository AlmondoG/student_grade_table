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
var hasErrors = {
    name: true,
    course: true,
    grade: true
};
var modalHasErrors = {
    name: false,
    course: false,
    grade: false
};
var potentialDeletes = null;


/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    screenSize();
    addClickHandlersToElements();
    handleDataClick();
    renderGradeAverage();
    updateModalHide();
    deleteModalHide();
    $(".updateModal").on("click", (e) => e.stopPropagation());
    $(".glyph-feedback").hide();
    $(".text-feedback").hide();
    $(".feedback-div").hide();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    $(window).on("resize", screenSize);
    $(".add-button").on("click", handleAddClicked);
    $(".cancel-button").on("click", handleCancelClick);
    $(".updateModalShadow").on("click", updateModalHide);
    $(".deleteModalShadow").on("click", deleteModalHide);
    $(".update-button").on("click", handleUpdateClick);
    $(".modal-cancel-button").on("click", updateModalHide);
    $("#studentName").on("keyup", studentNameInput);
    $("#course").on("keyup", studentClassInput);
    $("#studentGrade").on("keyup", studentGradeInput);
    $("#modalStudentName").on("keyup", modalStudentNameInput);
    $("#modalCourse").on("keyup", modalStudentClassInput);
    $("#modalStudentGrade").on("keyup", modalStudentGradeInput);
    $(".feedback-div").on("click", hideFeedbackDiv);
    $(".yes-button").on("click", deleteFromServer);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(){
    if (checkForErrors(hasErrors)) {
        hideFeedbackDiv();
        $(".fd-error").show();
        return;
    }
    addStudent();

    // checkForErrors(hasErrors) ? return : addStudent();
}

function handleUpdateClick() {
    if(checkForErrors(modalHasErrors)) {
        return;
    }
    updateTheStudent();
}


/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();
    removeInputFeedback();
}
/***************************************************************************************************
 * checkForErrors - Helper function to check for errors in our validation
 * @param: {object}
 * @return {bool}
 */
function checkForErrors(errors) {
    for (var type in errors) {
        if (errors[type]) {
            return true;
        }
    }
    return false;
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
    sendStudentToServer(studentObject);
    updateStudentList(studentObject);
    removeInputFeedback();
    hideFeedbackDiv();
    $(".fd-add").show();
}


function sendStudentToServer(newStudentInfo) {
    var ajaxOptions = {
        url: "php/data.php?action=insert",
        dataType: "json",
        method: "post",
        data: {
            name: newStudentInfo.name,
            course: newStudentInfo.course,
            grade: newStudentInfo.grade
        },
        success: function(result) {
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

    hasErrors.name = true;
    hasErrors.course = true;
    hasErrors.grade = true;
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
        "class": "delete-btn btn btn-sm btn-danger",
        click: function(){
            var objectIndex = studentArray.indexOf(studentObj);
            studentArray.splice(objectIndex, 1);
            potentialDeletes = studentObj;
            deleteModal();
            var avg = calculateGradeAverage(studentArray);
            renderGradeAverage(avg);
        }
    });
    var updateButton = $("<button>", {
        text: "UPDATE",
        "class": "update-btn btn btn-sm btn-warning",
        click: function() {
            updateModal(studentObj);
        }
    });
    $(deleteUpdateTableData).append(updateButton, deleteButton);
    $(row).append(nameText, courseText, gradeText, deleteUpdateTableData);
    $("tbody").append(row);
}


function deleteFromServer(studentRowID) {
    var ajaxOptions = {
        url: "php/data.php?action=delete",
        type: "POST",
        dataType: "json",
        data: {
            "id": potentialDeletes.id
        },
        success: function() {
            hideFeedbackDiv();
            $(".fd-delete").show();
            handleDataClick();
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
        url: "php/data.php?action=readAll",
        dataType: "json",
        method: "post",
        //Success be the output
        success: function(result) {
            for (var dataIndex = 0; dataIndex < result.data.length; dataIndex++) {
                var apiStudentInfo = {
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





//Hide update modal function
function updateModalHide() {
    $(".updateModalShadow").hide();
    removeModalInputFeedback();
    modalHasErrors.name = false;
    modalHasErrors.course = false;
    modalHasErrors.grade = false;
}




//Hide delete modal function
function deleteModalHide() {
    $(".deleteModalShadow").hide();
}





//Show update modal function
function updateModal(studentObj) {
    $(".hidden-id").val(studentObj.id);
    $("#modalStudentName").val(studentObj.name);
    $("#modalCourse").val(studentObj.course);
    $("#modalStudentGrade").val(studentObj.grade);
    $(".updateModalShadow").show();
}




//Show delete modal function
function deleteModal() {
    $(".deleteModalShadow").show();
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
            removeModalInputFeedback();
            updateModalHide();
            hideFeedbackDiv();
            $(".fd-update").show();
        }
    };

    $.ajax(ajaxCall);
}


function removeInputFeedback() {
    $(".glyph-feedback").hide();
    $(".text-feedback").hide();
    $(".glyph-feedback").removeClass("glyphicon-remove");
    $(".glyph-feedback").removeClass("glyphicon-ok");
    $(".name-parent-div").removeClass("has-error");
    $(".name-parent-div").removeClass("has-success");
    $(".class-parent-div").removeClass("has-error");
    $(".class-parent-div").removeClass("has-success");
    $(".grade-parent-div").removeClass("has-error");
    $(".grade-parent-div").removeClass("has-success");
}


function removeModalInputFeedback() {
    $(".glyph-feedback-modal").hide();
    $(".text-feedback-modal").hide();
    $(".glyph-feedback-modal").removeClass("glyphicon-remove");
    $(".glyph-feedback-modal").removeClass("glyphicon-ok");
    $(".name-parent-modal-div").removeClass("has-error");
    $(".name-parent-modal-div").removeClass("has-success");
    $(".course-parent-modal-div").removeClass("has-error");
    $(".course-parent-modal-div").removeClass("has-success");
    $(".grade-parent-modal-div").removeClass("has-error");
    $(".grade-parent-modal-div").removeClass("has-success");
}


function studentNameInput() {
    var nameInput = $("#studentName").val();
    var finalizedNameInput = nameInput.trim();
    if(finalizedNameInput === "") {
        $(".name-parent-div").addClass("has-error");
        $(".gf1").addClass("glyphicon-remove");
        $(".gf1").show();
        $(".tf1").show();
        hasErrors.name = true;
    } else {
        $(".name-parent-div").removeClass("has-error");
        $(".name-parent-div").addClass("has-success");
        $(".gf1").removeClass("glyphicon-remove");
        $(".gf1").addClass("glyphicon-ok");
        $(".gf1").show();
        $(".tf1").hide();
        hasErrors.name = false;
    }
}


function studentClassInput() {
    var courseInput = $("#course").val();
    var finalizedCourseInput = courseInput.trim();
    if(finalizedCourseInput === "") {
        $(".class-parent-div").addClass("has-error");
        $(".gf2").addClass("glyphicon-remove");
        $(".gf2").show();
        $(".tf2").show();
        hasErrors.course = true;
    } else {
        $(".class-parent-div").removeClass("has-error");
        $(".class-parent-div").addClass("has-success");
        $(".gf2").removeClass("glyphicon-remove");
        $(".gf2").addClass("glyphicon-ok");
        $(".gf2").show();
        $(".tf2").hide();
        hasErrors.course = false;
    }
}


function studentGradeInput() {
    var gradeInput = $("#studentGrade").val();
    var finalizedGradeInput = gradeInput.trim();
    if(parseInt(finalizedGradeInput) < 0 || parseInt(finalizedGradeInput) > 100 || isNaN(finalizedGradeInput) || finalizedGradeInput === "") {
        $(".grade-parent-div").addClass("has-error");
        $(".gf3").addClass("glyphicon-remove");
        $(".gf3").show();
        $(".tf3").show();
        hasErrors.grade = true;
    } else {
        $(".grade-parent-div").removeClass("has-error");
        $(".grade-parent-div").addClass("has-success");
        $(".gf3").removeClass("glyphicon-remove");
        $(".gf3").addClass("glyphicon-ok");
        $(".gf3").show();
        $(".tf3").hide();
        hasErrors.grade = false;
    }
}


function modalStudentNameInput() {
    var nameInput = $("#modalStudentName").val();
    var finalizedNameInput = nameInput.trim();
    if(finalizedNameInput === "") {
        $(".name-parent-modal-div").addClass("has-error");
        $(".gfm1").addClass("glyphicon-remove");
        $(".gfm1").show();
        $(".tfm1").show();
        modalHasErrors.name = true;
    } else {
        $(".name-parent-modal-div").removeClass("has-error");
        $(".name-parent-modal-div").addClass("has-success");
        $(".gfm1").removeClass("glyphicon-remove");
        $(".gfm1").addClass("glyphicon-ok");
        $(".gfm1").show();
        $(".tfm1").hide();
        modalHasErrors.name = false;
    }
}


function modalStudentClassInput() {
    var courseInput = $("#modalCourse").val();
    var finalizedCourseInput = courseInput.trim();
    if(finalizedCourseInput === "") {
        $(".course-parent-modal-div").addClass("has-error");
        $(".gfm2").addClass("glyphicon-remove");
        $(".gfm2").show();
        $(".tfm2").show();
        modalHasErrors.course = true;
    } else {
        $(".course-parent-modal-div").removeClass("has-error");
        $(".course-parent-modal-div").addClass("has-success");
        $(".gfm2").removeClass("glyphicon-remove");
        $(".gfm2").addClass("glyphicon-ok");
        $(".gfm2").show();
        $(".tfm2").hide();
        modalHasErrors.course = false;
    }
}


function modalStudentGradeInput() {
    var gradeInput = $("#modalStudentGrade").val();
    var finalizedGradeInput = gradeInput.trim();
    if(parseInt(finalizedGradeInput) < 0 || parseInt(finalizedGradeInput) > 100 || isNaN(finalizedGradeInput) || finalizedGradeInput === "") {
        $(".grade-parent-modal-div").addClass("has-error");
        $(".gfm3").addClass("glyphicon-remove");
        $(".gfm3").show();
        $(".tfm3").show();
        modalHasErrors.grade = true;
    } else {
        $(".grade-parent-modal-div").removeClass("has-error");
        $(".grade-parent-modal-div").addClass("has-success");
        $(".gfm3").removeClass("glyphicon-remove");
        $(".gfm3").addClass("glyphicon-ok");
        $(".gfm3").show();
        $(".tfm3").hide();
        modalHasErrors.grade = false;
    }
}


function hideFeedbackDiv() {
    $(".feedback-div").hide();
}



function screenSize() {
    var width = window.innerWidth;
    if(width <= 414) {
        $("#full-container").removeClass("container");
        $("#full-container").addClass("container-fluid");
        $(".student-list-container").removeClass("pull-left");
        $(".student-list").removeClass("table");
        $(".student-list").addClass("table-condensed");
    } else {
        $("#full-container").removeClass("container-fluid");
        $("#full-container").addClass("container");
        $(".student-list-container").addClass("pull-left");
        $(".student-list").removeClass("table-condensed");
        $(".student-list").addClass("table");
    }
}



//Clear


