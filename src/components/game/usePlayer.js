import React from "react";

let initialFrame = 0;
const totalFrame = 37;
const playerImage = new Image();
playerImage.src = "./assets/player.png";
const usePlayer = (context, playerPosX, playerPosY, playerWidth, playerHeight) =>{
    const ctx = context;

    const drawPlayer = () =>{
        ctx.drawImage(
            playerImage, 
            playerWidth * initialFrame, 
            0, 
            playerWidth, 
            playerHeight, 
            playerPosX, 
            playerPosY, 
            playerWidth, 
            playerHeight
            );
        if(initialFrame <= totalFrame){
            initialFrame += 1;
        }else{
            initialFrame = 0;
        }
    }

    return {drawPlayer};
}

export default usePlayer;