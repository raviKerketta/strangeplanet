import React from "react";

const useGameOver = (player, enemies) =>{
    const getPlayer = player;
    const getEnemies = enemies.map((item) => item);

    const playerVSenemies = () =>{
        let isGameOver = false;
        if(getEnemies.length > 0){
            for(let i=0; i<getEnemies.length; i++){
                const getSingleEnemies = getEnemies[i];
                if(
                    (getPlayer.playerPosX + getPlayer.playerWidth > getSingleEnemies.posX &&
                    getPlayer.playerPosY + getPlayer.playerHeight > getSingleEnemies.posY &&
                    getPlayer.playerPosY < getSingleEnemies.posY + getSingleEnemies.height)
                ){
                    isGameOver = true;
                }
            }
        }
        return isGameOver;
    }
    return playerVSenemies;
}

export default useGameOver;