import React, {useContext, useEffect, useState} from "react";
import "./Leaderboard.css";
import { supabase } from "../auth/client";

const Leaderboard = ({ token }) =>{

    const [leaderBoardData, setLeaderData] = useState([]);
    const [userRank, setUserRank] = useState([])

    //fetch data
    const fetchData = async () => {
        const { data, error } = await supabase
                .from('scores')
                .select('uid, username, score')
                .order('score', {ascending: false})
        return data;
    }
    

    //sort data
    useEffect(() => {
        const fetchLeaderBoardData = async () => {
            const data = await fetchData();
            const uniqueUsers = {};
            const processData = data.reduce((acc, entry) => {
                const { uid,username, score } = entry;
                if(!uniqueUsers[uid] || score > uniqueUsers[uid].score){
                    uniqueUsers[uid] = {uid, username, score, rank: acc.length + 1}
                }
                return Object.values(uniqueUsers)
            }, [])
            setLeaderData(processData);
        }
        fetchLeaderBoardData();
    }, [])

    //retrive user
    const getuserRank = async() => {
        if(token){
            const { data: { user } } = await supabase.auth.getUser()
            leaderBoardData.map((item) =>{
                if(user.id === item.uid){
                    setUserRank(item)
                }
            })
        }else{
            setUserRank([])
        }
    }

    useEffect(()=>{
        getuserRank();
    },[leaderBoardData])
    
    fetchData()
    
    return (
        <div className="leaderboard-conainer">
            <div className="current-palyer-section">
                <div className="profile-pic">
                    <img src="./web_assets/default-profile.png"></img>
                </div>
                <div className="player-rank">
                    {userRank && (
                        <div>
                            <p className="large-font current-palyer-section-tex-color">{userRank.username}</p>
                            <p className="medium-font current-palyer-section-tex-color">Rank : {userRank.rank}</p>
                            <p className="medium-font current-palyer-section-tex-color">Score : {userRank.score}</p>
                        </div>
                    )
                    }
                </div>
            </div>
            <div className="all-palyer-section">
                <div className="leaderboard-title-logo">
                    <img className="award-logo image-shasow" src="./web_assets/award-2.gif"></img>
                </div>
                <div className="all-player-rank">
                    <div className="player-list medium-font">
                        <div>Rank</div>
                        <div>Player</div>
                        <div>Score</div>
                    </div>
                    {
                        leaderBoardData ? 
                        leaderBoardData.map((entry) => (
                            <div className="player-list small-font" key={entry.username}>
                                <div>{entry.rank}</div>
                                <div>{entry.username}</div>
                                <div>{entry.score}</div>
                            </div>
                        ))
                        : <lable>No Data Found</lable>
                    }
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;