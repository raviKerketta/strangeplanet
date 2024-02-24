import React from "react";

const totalFrame = 37;
const anglerOneImage = new Image();
anglerOneImage.src = "./assets/angler1.png";
let anglerOneInitialFrame = 0;

const anglerTwoImage = new Image();
anglerTwoImage.src = "./assets/angler2.png";
let anglerTwoInitialFrame = 0;

const hiveWhaleImage = new Image();
hiveWhaleImage.src = "./assets/hivewhale.png";
let hiveWhaleInitialFrame = 0;

const droneImage = new Image();
droneImage.src = "./assets/droneleft.png";
let droneInitialFrame = 0;

const useEnemy = (context, canvasWidth, canvasHeight) =>{
    const ctx = context;

    const pushAnglerOne = () =>{
        const anglerOne = {
            id: "angler-one",
            width: 228,
            height: 169,
            posX: canvasWidth,
            posY: 1 + (Math.random() * (canvasHeight - 169)),
            health: 1,
            velocity: 9,
            markForDeletion: false,
            score: 1,
        }
        return anglerOne;
    }

    const pushAnglerTwo = () =>{
        const anglerTwo = {
            id: "angler-two",
            width: 213,
            height: 168.5,
            posX: canvasWidth + 230,
            posY: 1 + (Math.random() * (canvasHeight -169)),
            health: 2,
            velocity: 7,
            markForDeletion: false,
            score: 2,
        }
        return anglerTwo;
    }

    const pushToHiveWhale = () =>{
        const hiveWhale = {
            id: "hive-whale",
            width: 400,
            height: 227,
            posX: canvasWidth + 230,
            posY: 1 + (Math.random() * (canvasHeight - 169)),
            health: 5,
            velocity: 5,
            markForDeletion: false,
            score: 5,
        }
        return hiveWhale;
    }

    const pushToDrone = (hiveWhalePosX, hiveWhalePosY) =>{
        const drone = {
            id: "drone",
            width: 115,
            height: 95,
            posX: hiveWhalePosX + (Math.random() * 300),
            posY: hiveWhalePosY + (Math.random() * 200),
            health: 1,
            velocityX: 9,
            velocityY: 9,
            markForDeletion: false,
            score: 2,
        }
        return drone;
    }

    const drawAnglerOne = (posX, posY, width, height) =>{
        ctx.drawImage(
            anglerOneImage,
            width * anglerOneInitialFrame,
            0,
            width,
            height,
            posX,
            posY,
            width,
            height
        );

        if(anglerOneInitialFrame <= totalFrame){
            anglerOneInitialFrame += 1;
        }else{
            anglerOneInitialFrame = 0;
        }
    }

    const drawAnglerTwo = (posX, posY, width, height) =>{
        ctx.drawImage(
            anglerTwoImage,
            width * anglerTwoInitialFrame,
            0,
            width,
            height,
            posX,
            posY,
            width,
            height
        );

        if(anglerTwoInitialFrame <= totalFrame){
            anglerTwoInitialFrame += 1;
        }else{
            anglerTwoInitialFrame = 0;
        }
    }

    const drawHiveWhale = (posX, posY, width, height) =>{
        ctx.drawImage(
            hiveWhaleImage,
            width * hiveWhaleInitialFrame,
            0,
            width,
            height,
            posX,
            posY,
            width,
            height
        );

        if(hiveWhaleInitialFrame <= totalFrame){
            hiveWhaleInitialFrame += 1;
        }else{
            hiveWhaleInitialFrame = 0;
        }
    }

    const drawDrone = (posX, posY, width, height) =>{
        ctx.drawImage(
            droneImage,
            width * droneInitialFrame,
            0,
            width,
            height,
            posX,
            posY,
            width,
            height
        );

        if(droneInitialFrame <= totalFrame){
            droneInitialFrame += 1;
        }else{
            droneInitialFrame = 0;
        }
    }

    return {pushAnglerOne, drawAnglerOne, pushAnglerTwo, drawAnglerTwo, pushToHiveWhale, drawHiveWhale, pushToDrone, drawDrone}

}

export default useEnemy;