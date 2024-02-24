const Validation = (inputValues) => {
    let error = {};
    const username_regular_expression = /^.{4,}$/
    const email_regular_expression = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
    const psd_regular_expression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/

    if(inputValues.username === ""){
        error.username = "username should not be empty";
    }
    if(!username_regular_expression.test(inputValues.username)){
        error.username = "should not use any symbol and it should contain atleast 4 characters";
    }

    if(inputValues.email === ""){
        error.email = "email should not be empty";
    }
    if(!email_regular_expression.test(inputValues.email)){
        error.email = "should enter proper email"
    }

    if(inputValues.password === ""){
        error.password = "password should not be empty";
    }
    if(!psd_regular_expression.test(inputValues.password)){
        error.password = "password ghould have atleast: <br>8 character, <br>1 digit, 1 small character, 1 capital character 1 symbol";
    }

    if(inputValues.confirm_password === "" || inputValues.confirm_password[0] !== inputValues.password[0]){
        error.confirm_password = "password did't matched";
    }

    return error;
}

export { Validation };