import React, {useState, useEffect} from "react";
import { supabase } from "./client";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";

const PasswordRecovery = () => {
    const navigate = useNavigate()
    const [usermail, setUserMail] = useState("");
    //handle password recovery

    const sendMail = async(e) => {

        e.preventDefault();
        try{
            const { data, error } = await supabase.auth.resetPasswordForEmail(usermail)
            if(error) throw error
            navigate('/')
        }catch(error){
            console.log(error)
        }
        
    }
    

    return (
        <div className="auth-background">
            <div className="top-margine"></div>
            <div className="auth-form-container">
                <div className="update-form-title">
                    <p>Reset Password</p>
                </div>
                <div className="sign-in-form">
                        <form onSubmit={sendMail}>
                            <input name="email" className="input-field" type="email" placeholder="email" onChange={(e) => setUserMail(e.target.value)}></input>
                            <button className="button-submit">Send</button>
                        </form>
                </div>
            </div>
        </div>
    )
}

export default PasswordRecovery;