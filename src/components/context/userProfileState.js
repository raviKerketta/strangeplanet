import React, {useState} from "react";
import { userProfile } from "./userProfileContext"


const UserProfileState = (props) => {
    const [default_profile_pic, setProfile_pic] = useState("./web_assets/default-profile.png");
    const [username, setUsername] = useState("ravikerketta");
    const [usermail, setUserMail] = useState("the02rike@gmail.com");

    const userData = {
        userprofilepic : default_profile_pic,
        username: username,
        mail: usermail,
    }

    return (
        <userProfile.Provider value={userData}>
            {props.children}
        </userProfile.Provider>
    )
}

export default UserProfileState;