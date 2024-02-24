import React, {useState, useEffect} from "react";
import { supabase } from "./client";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";
import { Validation } from "./Validate";

const UpadateForm = () => {
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
  const handlePasswordReset = (e) => {
      e.preventDefault();
      setErrors(Validation(inputValues));
      submitForm();
  }

  const submitForm = async() =>{
      if((errors.password === undefined &&
          errors.confirm_password === undefined)){
            try{
              const { data, error } = await supabase.auth.updateUser({  
                password: inputValues.password[0]
              })
              navigate('/')
            }catch(error){
              console.log(error)
            }
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
                <div className="update-form-title">
                    <p>Update Password</p>
                </div>
              <div className={`sign-in-form`}>
                  <form onSubmit={ handlePasswordReset }>
                      <input name="password" className="input-field" type="password" placeholder="password" onChange={inputHandle}></input>
                      {errors.password && <p className="error-handler">{errors.password}</p>}
                      <input name="confirm_password" className="input-field" type="password" placeholder="confirm-password" onChange={inputHandle}></input>
                      {errors.confirm_password && <p className="error-handler">{errors.confirm_password}</p>}
                      <button className="button-submit">Update</button>
                  </form>
              </div>
          </div>
      </div>
  )
}

export default UpadateForm;