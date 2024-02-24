import React, { useEffect, useState } from "react"
import "./AuthForm.css";
import { Validation } from "./Validate";
import { supabase } from "./client";
import { useNavigate } from "react-router-dom";

const AuthForm = ({setToken}) =>{
    let navigate = useNavigate();
    //validate registration form
    const [inputValues, setInputValues] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    })

    const [errors, setErrors] = useState({});

    const inputHandle = (e) => {
        setInputValues({...inputValues, [e.target.name] : [e.target.value]})
    }

    //handle sign up
    const handleSignUp = (e) => {
        e.preventDefault();
        setErrors(Validation(inputValues));
        submitForm();
    }

    // add users to database
    async function createusers(uemail, pass, uname, ppic) {
        try{
            const { data, error } = await supabase.auth.signUp(
                {
                email: uemail,
                password: pass,
                options: {
                    data: {
                        username: uname,
                        profile_pic: ppic,
                    }
                }
                }
            );
            if (error) throw error;
            // console.log(uemail, pass, uname, ppic)
            alert("check your email for valification link")
        }catch(error){
            console.log(error)
        }
                    
    }

    const submitForm = () =>{
        if((errors.username === undefined && 
            errors.email === undefined &&
            errors.password === undefined &&
            errors.confirm_password === undefined)){
            // console.log('form can submit')
            // console.log(`username: ${inputValues.username}`);
            // console.log(`email: ${inputValues.email}`);
            // console.log(`password: ${inputValues.password}`);
            // console.log(`confirm-pass: ${inputValues.confirm_password}`)
            createusers(inputValues.email[0], inputValues.password[0], inputValues.username[0], "web_assets/default-profile.png");
        }else{
            console.log("form can not submit")
            console.log(`username: ${errors.username}`)
            console.log(`email: ${errors.email}`)
            console.log(`password: ${errors.password}`)
            console.log(`confirm-password: ${errors.confirm_password}`)
        }
    }
    
    const [signinFormState, updateSigninDisplay] = useState({
        formState: "",
        tabState: ""
    });
    const [signupFormState, updateSignupDisplay] = useState({
        formState: "",
        tabState: ""
    });
    //validation ends

    //handle login
    const [useremail, setUserEmail] = useState("");
    const [userpassword, setUserPassword] = useState("");
    const [wrongPassword, setWrongPassword] = useState(false);
    const handleLogin = async(e) => {
        e.preventDefault();
        try{          
            const { data, error } = await supabase.auth.signInWithPassword({
                email: useremail,
                password: userpassword,
            })
            if (error) throw error;
            setToken(data);
            navigate('/profile')
            //console.log(data)
        }catch(error){
            setWrongPassword(true)
        }
        // console.log(`useremail: ${useremail}`);
        // console.log(`password: ${userpassword}`);
    }
    
    //handle login ends
    const [login, updateForm] = useState(true);
    

    useEffect(() => {

        if(login){
            updateForm(true);
            updateSigninDisplay({
                formState: "",
                tabState: "active-tab"
            });
            updateSignupDisplay({
                formState: "desable",
                tabState: ""
            });
        }else{
            updateSigninDisplay({
                formState: "desable",
                tabState: ""
            });
            updateSignupDisplay({
                formState: "",
                tabState: "active-tab"
            });
        }

    }, [login])

    return (
        <div className="auth-background">
            <div className="top-margine"></div>
            <div className="auth-form-container">
                <div className="auth-header">
                    <div className={`sign-in-up ${signinFormState.tabState}`} onClick={() => updateForm(true)}>Sign-In</div>
                    <div className={`sign-in-up ${signupFormState.tabState}`} onClick={() => updateForm(false)}>Sign-Up</div>
                </div>
                <div className={`sign-in-form ${signinFormState.formState}`}>
                    <form onSubmit={ handleLogin }>
                        <input className="input-field" type="text" placeholder="email" onChange={(e) => setUserEmail(e.target.value)}></input>
                        <input className="input-field" type="password" placeholder="password" onChange={(e) => setUserPassword(e.target.value)}></input>
                        <button className="button-submit">Sign-In</button>
                        {wrongPassword ? <p className="error-handler">Invalid login credentials</p>:""}
                        <div className="input-field hide-div" type="text"></div>
                        <div className="input-field hide-div" type="text"></div>
                    </form>
                </div>
                <div className={`sign-in-form ${signupFormState.formState}`}>
                    <form onSubmit={ handleSignUp }>
                        <input name="username" className="input-field" type="text" placeholder="username" onChange={inputHandle}></input>
                        {errors.username && <p className="error-handler">{errors.username}</p>}
                        <input name="email" className="input-field" type="email" placeholder="email" onChange={inputHandle}></input>
                        {errors.email && <p className="error-handler">{errors.email}</p>}
                        <input name="password" className="input-field" type="password" placeholder="password" onChange={inputHandle}></input>
                        {errors.password && <p className="error-handler">{errors.password}</p>}
                        <input name="confirm_password" className="input-field" type="password" placeholder="confirm-password" onChange={inputHandle}></input>
                        {errors.confirm_password && <p className="error-handler">{errors.confirm_password}</p>}
                        <button className="button-submit">Sign-Up</button>
                    </form>
                </div>
                <a href="forgot-password" className="forgot-password">Forgotten your password?</a>
            </div>
        </div>
    )
}

export default AuthForm;



