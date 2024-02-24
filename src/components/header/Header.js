import React, {useEffect, useState}  from 'react';
import "./Header.css";
import { supabase } from '../auth/client';
const Header = ({ token }) =>{

    const [burgerButton, updateBurgerButton] = useState("ham-burger-active")
    const [closeButton, updateCloseButton] = useState("close-button-deactive")
    const [menuBar, updateMenuBar] = useState("menu-deactive");

    const burger_close_toggle = () =>{
        updateBurgerButton("ham-burger-deactivate");
        updateCloseButton("close-button-active");
        updateMenuBar("menu-active");
    }

    const close_burger_toggle = () =>{
        updateBurgerButton("ham-burger-active");
        updateCloseButton("close-button-deactive");
        updateMenuBar("menu-deactive")
    }

    //handle logout
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        
        const signOutFromServer = async () => {
            const { error } = await supabase.auth.signOut();
            sessionStorage.clear();
        }
        signOutFromServer();
    }

    return (
        <div>
            <header>
                <nav className='nav-bar'>
                    <div className="logo"><a className='web-title' href={"/"}>Strange Planet</a></div>
                        <div className='right-options'>
                            {token ?
                                <div className='header-profile-pic'>
                                    <img src={`./${token.user.user_metadata.profile_pic}`}></img>
                                </div> : ""
                            }
                            <div className={`ham-burger ${burgerButton}`} onClick={() =>{burger_close_toggle()}}>
                                <div className={`bar`}></div>
                                <div className='bar'></div>
                                <div className='bar'></div>
                            </div>
                            <div className={`close-button ${closeButton}`} onClick={() =>{close_burger_toggle()}}>
                                <img src='./web_assets/cross.png'></img>
                            </div>
                    </div>
                </nav>
            </header>
            <div className={`menu ${menuBar}`}>
                <ul>
                    <li><div><a href="/">Home</a></div></li>
                    {token ? <li><div><a href='/profile'>Profile</a></div></li> : ""}
                    <li><div><a href="/strange-planet">Game</a></div></li>
                    <li><div><a href="/leaderboard">Leader Board</a></div></li>
                    {!token ? <li><div><a href="/login">Login</a></div></li> : ""}
                    {token ? <li><div><a href="/" onClick={ handleLogout }>Logout</a></div></li> : ""}
                </ul>
            </div>
        </div>
    )
}

export default Header;