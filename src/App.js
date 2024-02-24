import React, { useEffect, useState }  from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/body/footer.js';
import Hero from './components/hero/Hero';
import InstructionSection from './components/body/Instruction.js';
import AuthForm from './components/auth/AuthForm';
import UpadateForm from './components/auth/UpdatePassword';
import Game from './components/game/Game';
import Profile from './components/profile/Profile';
import Leaderboard from './components/leaderBoard/Leaderboard';
import UserProfileState from './components/context/userProfileState';
import PasswordRecovery from './components/auth/PasswordRecovery';
import { AuthProvider } from './components/auth/AuthContext';

function App() {

  const [token, setToken] = useState(false);
  // const [data, setData] = useState(null);

  //set session
  if(token){
    //store token to local storage
    sessionStorage.setItem('token', JSON.stringify(token));
  }

  useEffect( () => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'));
      setToken(data);
    }
  }, [])

  return (
   <AuthProvider>
   <UserProfileState>
        <Routes forceRefresh={true}>
        <Route path='/' element={<div><Header token={ token }/><Hero/><InstructionSection/><Footer/></div>}></Route>
        <Route path='login' element={<div><Header token={ token }/><AuthForm setToken={setToken}/></div>}></Route>
        <Route path='strange-planet' element={<div><Game token={ token }/></div>}></Route>
        {token ? <Route path='profile' element={<div><Header token={ token }/><Profile token={ token }/></div>}></Route> : ""}
        <Route path='leaderboard' element={<div><Header token={ token }/><Leaderboard token={ token }/></div>}></Route>
        <Route path='forgot-password' element={<div><Header/><PasswordRecovery/></div>}></Route>
        <Route path='profile/update-password' element={<div><Header/><UpadateForm/></div>}></Route>
      </Routes>
   </UserProfileState>
   </AuthProvider>
  );
}

export default App;
