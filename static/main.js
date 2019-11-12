var socket = io();
var guser;
var profile;
var classes = [];
var offcampus;
var users;
var teachers;
var students;
var fuseoptions = {
    keys: [{
        name: 'name',
        weight: 0.85
      }, {
        name: 'email',
        weight: 0.15
      }],
      threshold: 0.3,
}
var usersearch

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-left",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2500",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}


socket.on("update", obj => {
    console.log("E")
    update(obj)
});


socket.on("updateusers", obj => {
    formatusers(obj.users)
});




if (admin == "True" || teacher == "True") {
    $.ajax({
        method: "GET",
        url: "getusers",
    }).done(function(e) {
        formatusers(e)
    })
}

function formatusers(e) {
    users = e.map((el) => {
        return {email: el[0], name: el[1], student: el[3]}
    })

    teachers = users.filter((el) => {
        if (el.student == 2) return true
    })
    
    students = users.filter((el) => {
        if (el.student == 1) return true
    })

    usersearch = new Fuse(users, fuseoptions)
    teachersearch = new Fuse(teachers, fuseoptions)
    studentsearch = new Fuse(students, fuseoptions)

    $(".users").html("")
    users.forEach(element => {
        $(".users").append("<li>" + element.name + " <b>" + element.email + "</b> " + (element.student == 2 ? "Teacher" : "Student") + "</li>")
    });
}

$(document).ready(function() {
    if (teacher) {
        setTimeout(function(){
        popper = new Popper(document.querySelector("#studentinput"), document.querySelector("#studentdrop"), {
            placement: 'bottom'
        });
        }, 500);
    }
})

function update(obj) {
    classes = obj.classes
    offcampus = obj.offcampus

    if (offcampus == 2) alert("offcampus error")

    $("#update").text(classes)
    $("#offcampus").text("OffCampus: " + offcampus)
}

function onSignIn(googleUser) {
    guser = googleUser.getAuthResponse();
    profile = googleUser.getBasicProfile();
    console.log("EEE", guser)
    var id_token = guser.id_token;
    

    $.ajax({
        method: "POST",
        url: 'https://atischool.net/glogin',
        data: {idtoken: id_token}
    }).done(function(e) {
        console.log("login successful")
        if (classes.length == 0) {
            console.log("REDIR", e)
            update(e)
        }
        $("#logout").show()
    }).fail(function(e) {
        console.log("login failed", e)
        // window.location.href = "/"
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        window.location.href = "/logout"
    });
}

$("#teacherbutton").click(function() {
    let teacher = $("#teacherinput").val()
    let newstatus = $("#teacherselect option:selected").val();

    if (teacher === "") return;

    $.ajax({
        url: "/addteacher",
        method: "POST",
        data: {
            teacher: teacher,
            newstatus: newstatus
        }
    }).done(function(e) {
        let name = users.filter((el) => {
            if (el.email == teacher) return true
        })[0].name


        toastr["success"]("Set Teacher status for " + name + " to " + newstatus, "Success")
    }).fail(function(e) {
        console.log("error", e)
        toastr["error"](e.responseText, "Error")
    })
})


$("#studentbutton").click(function() {
    let email = $("#studentinput").val();
    let newstatus = $("#offcampusinput option:selected").val();

    if (email === "" || newstatus === "") return;

    $.ajax({
        url: "/changestatus",
        method: "POST",
        data: {
            email: email,
            newstatus: newstatus
        }
    }).done(function(e) {

        name = users.filter((el) => {
            if (el.email == email) return true
        })[0].name

        toastr["success"]("Updated Offcampus for " + name + " to " + newstatus, "Success")
    }).fail(function(e) {
        console.log("error", e)
        toastr["error"](e.responseText, "Error!")
    })
})

$("#studentinput").on("input", function() {
    $("#studentdrop").html("")
    if ($(this).val() == "") {
        students.forEach(element => {
            $("#studentdrop").append("<div onclick='userclick($(this))' class='user' email='" + element.email + "'>" + element.name + "</div>")
        });
        return
    }
    studentsearch.search($(this).val()).forEach(element => {
        $("#studentdrop").append("<div onclick='userclick($(this))' class='user' email='" + element.email + "'>" + element.name + "</div>")
        
    });
}).focusin(function() {
    $("#studentdrop").show()
    var popper = new Popper(document.querySelector("#studentinput"), document.querySelector("#studentdrop"), {placement: 'bottom'});
    if ($(this).val() == "") {
        $("#studentdrop").html("")
        students.forEach(element => {
            $("#studentdrop").append("<div onclick='userclick($(this))' class='user' email='" + element.email + "'>" + element.name + "</div>")
        });
    }
}).focusout(function () {window.setTimeout(function() { $("#studentdrop").hide() }, 120);});


$("#teacherinput").on("input", function() {
    $("#teacherdrop").html("")
    if ($(this).val() == "") {
        users.forEach(element => {
            $("#teacherdrop").append("<div onclick='teacherclick($(this))' class='user' email='" + element.email + "'>" + element.name + "</div>")
        });
        return
    }
    usersearch.search($(this).val()).forEach(element => {
        $("#teacherdrop").append("<div onclick='teacherclick($(this))' class='user' email='" + element.email + "'>" + element.name + "</div>")
        
    });
}).focusin(function() {
    $("#teacherdrop").show()
    var popper = new Popper(document.querySelector("#teacherinput"), document.querySelector("#teacherdrop"), {placement: 'bottom'});
    if ($(this).val() == "") {
        $("#teacherdrop").html("")
        users.forEach(element => {
            $("#teacherdrop").append("<div onclick='teacherclick($(this))' class='user' email='" + element.email + "'>" + element.name + "</div>")
        });
    }
}).focusout(function () {window.setTimeout(function() { $("#teacherdrop").hide() }, 120);});

function teacherclick(e) {
    $("#teacherinput").val(e.attr("email"))
    $("#teacherdrop").hide();
}

function userclick(e) {
    $("#studentinput").val(e.attr("email"))
    $("#studentdrop").hide();
}
