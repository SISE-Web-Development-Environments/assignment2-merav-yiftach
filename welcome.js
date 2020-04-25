$(document).ready(function () {
    start();
});



function start() {
    $("#sighInButtom").click(function (e) { signInFunction(); });
    $("#loginByttom").click(function (e) { loginFunction(); });
    $("#submit").click(function (e) { submitFunction(); });
    $("#connect").click(function (e) { connectFunction(); });

}

    function signInFunction() {
        //switchDevs
        $("#welcome").hide();
        $("#signIn").show();
    }



    function loginFunction() {
        //switchDevs
        $("#welcome").hide();
        $("#login").show();
    }

    function submitFunction() {
        let username = $("#username").val();
        let password = $("#password").val();
        let passwordCnfirm = $("#passwordConfirm").val();
        let fullname = $("#fullName").val();
        let email = $("#email").val();
        let birthday = $("#birthday").val();

        //add check if username already exsit
        if (username == "") {
            alert("Username must be filled out");
            return false;
        }
        if (checkUsernameExist(username))
        {
            alert("Username already exsit");
            return false;
        }
        if (password == "") {
            alert("Password must be filled out");
            return false;
        }

        if (!(password.match("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d^a-zA-Z0-9].{5,50}$")) || password.length < 6) {
            alert("Password must be contains at least six charcter , one letter and one number");
            return false;
        }

        if (passwordCnfirm != password)
        {
            alert("Passwords does not math");
            return false;
        }

        if (fullname == "") {
            alert("Full name must be filled out");
            return false;
        }

        //maybe full name need to be seprtated to surname and last name
        if (/\d/.test(fullname)) {
            alert("Full name can not contains number");
            return false;
        }

        if (!ValidateEmail(email)) {
            alert("You have entered an invalid email address!")
            return false;
        }

        createUser(username, password);

        //switchDevs
        $("#signIn").hide();
        $("#welcome").show();

    }

    // storing input from sign in
    function createUser(username, password) {
        let usernameJSON = JSON.stringify(username);
        let passwordJSON = JSON.stringify(password);

        localStorage.setItem(username, password);

    }


    function checkUsernameExist(username) {
        let user = localStorage.getItem(username)
        if(user == undefined)
        {
            return false;
        }
        return true;
    }


    function connectFunction() {

        users = localStorage.getItem('users');
        let username = $("#usernameConnect").val();
        let password = $("#passwordConnect").val();
        if (localStorage.getItem(username) == undefined)
        {
            alert("Username or password are incorrect");
            return false;
        }
        if (localStorage.getItem(username) != password) {
            alert("Username or password are incorrect");
            return false;
        }
        //switchDevs
        $("#login").hide();
        $("#defsForm").show();

    }



    //JavaScript code to validate an email id
    function ValidateEmail(email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return (true)
        }
        return (false)
    }

