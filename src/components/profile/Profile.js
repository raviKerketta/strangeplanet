import React, { useEffect, useState } from "react";
import { supabase } from "../auth/client";
import './Profile.css'

const Profile = ({ token }) => {

    const tokenData = token;
    const username = tokenData.user.user_metadata.username;
    const userID = tokenData.user.id;
    const user_email = tokenData.user.email;
    const profile_pic = tokenData.user.user_metadata.profile_pic
    const [userData, setUserData] = useState([]);
    const [bestScore, setBestScore] = useState({});
    const [avgScore, setAvgScore] = useState(0);
    const [lowestScore, setLowestScore] = useState({});
    const [getBestScore, setGetBestScore] = useState(0);
    const [getLowestScore, setgetLowestScore] = useState(0);

    //fetch data 
    const fetchUserData = async () => {
        try {
            const {data, error} = await supabase
            .from('scores')
            .select('*')
            .eq('uid', userID)
            .order('created_at', { ascending: false })
            setUserData(data);
            
            if (error) throw error
            
            
        } catch(error) {
            alert(error)
        }
    }

    //sort the array
    const sortScore = () => {
        const sortedObj = [...userData].sort((a,b) => b.score - a.score);
        //console.log(sortedObj);
        setBestScore(sortedObj[0]);
        setLowestScore(sortedObj[sortedObj.length - 1]);
    }

    //find avg
    const getAvgScore = () => {
        if(userData.length > 0){
            const totalScore = userData.reduce((sum, user) => sum + user.score, 0);
            setAvgScore((totalScore/userData.length).toFixed(2));
        }
    }
    useEffect(() => {
        //fetch data useEFFECT
        fetchUserData();
    }, [])

    useEffect( () => {
        //render when userData updated
        //console.log(userData);
        //console.log(sortedScore);
        sortScore();
        getAvgScore();
        
    }, [userData])

    useEffect( () => {
        if (bestScore && bestScore.score !== undefined) {
            setGetBestScore(bestScore.score)
          }
        if (lowestScore && lowestScore.score !== undefined){
            setgetLowestScore(lowestScore.score)
        }
    }, [bestScore, lowestScore])

    
    
    return (
        <div className="dashbord-conainer">
            <div className="stats-container">
                <div className="user-stats">
                    <div className="avatar">
                        <img className="profile-pic" src={`./${profile_pic}`}></img>
                    </div>
                    <div className="large-font">{username}</div>
                    <div className="user-deails-conatiner">
                        <div className="medium-font">username : {username}</div>
                        <div className="medium-font">mail : {user_email}</div>
                    </div>
                </div>
                <div className="game-stats">
                    <div className="stats">
                        <div className="stats-card">
                            <div><img className="card-image image-shasow" src="./web_assets/wink.gif"></img></div>
                            <div className="medium-font">AVG</div>
                            <div className="small-font">{avgScore}</div>
                        </div>
                        <div className="stats-card">
                            <div><img className="card-image image-shasow" src="./web_assets/award.gif"></img></div>
                            <div className="medium-font">BEST</div>
                            <div className="small-font">{getBestScore}</div>
                        </div>
                        <div className="stats-card">
                            <div><img className="card-image image-shasow" src="./web_assets/sad.gif"></img></div>
                            <div className="medium-font">LOWEST</div>
                            <div className="small-font">{getLowestScore}</div>
                        </div>
                    </div>
                    <div className="history">
                        <div className="history-title medium-font">History</div>
                        <div className="game-history">
                            <div className="history-container small-font">
                                <div className="history-items">Score</div>
                                <div className="history-items">Date</div>
                                <div className="history-items">Time</div>
                            </div>
                            {userData.length === 0 ? (
                                <div className="no-data-found">No data available</div>
                            ) : (
                                userData.slice(0, 10).map((item) => 
                                <div className="history-container small-font" key={item.time}>
                                    <div className="history-items">{item.score}</div>
                                    <div className="history-items">{item.date}</div>
                                    <div className="history-items">{item.time}</div>
                                </div>
                                )
                            )}
                            {/* <div className="history-container small-font">
                                <div className="history-items">1000</div>
                                <div className="history-items">24/08/23</div>
                                <div className="history-items">1:25</div>
                            </div> */}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;