import React, {useRef, useEffect, useState} from "react";
import "./Game.css";
import useInputHandler from "../inputHandler/useHandleInput";
import usePlayer from "./usePlayer";
import useProjectileController from "./useProjectileController";
import useEnemy from "./useEnemy";
import useCollisionDetection from "./useCollisionDetection";
import useGameOver from "./useGameOver";
import {useExplosionEffects, useExplosionEffectRender} from "./useExplosionEffect";
import { supabase } from "../auth/client";


//canvas properties
const canvasWidth = 1345;
const canvasHeight = 500;

//player properties
let playerPosX = 50;
let playerPosY = 100;
const playerWidth = 120;
const playerHeight = 190;

//Inputs
let playerInput = null;
let playerWeapon = null;

//weapons
let coolDownWeaponOne = false;
let cooldDownTimerWeaponOne = 20;
let coolDownWeaponTwo = false;
let coolDownTimerWeaponTwo = 60;
let weaponOne = [];
let weaponTwo = [];
let totalAmmoForWeaponOne = 20;
let totalAmmoForWeaponTwo = 5;
const weaponOneAmmoIndicator = new Image();
weaponOneAmmoIndicator.src = "./assets/weapon-one-indicator.png";
const weaponTwoAmmoIndicator = new Image();
weaponTwoAmmoIndicator.src = "./assets/weapon-two-indicator.png";
const indicatorWidth = 16;
const indicatorHeight = 16;

//enemies
let enemiesAnglerOne = [];
let anglerOneCoolDownTimer = 100;
let anglerOneIsCoolingDown = false;

let enemiesAnglerTwo = [];
let anglerTwoCoolDownTimer = 100;
let anglerTwoIsCoolingDown = true;

let enemiesHiveWhale = [];
let hiveWhaleCoolDownTimer = 600;
let hiveWhaleIsCoolingDown = true;

let enemiesDrone = [];
//score
let score = 0;

//audio
const gameOverSound = new Audio("./audio/gameover.wav");
gameOverSound.load();

//forgrounds
const forgroundSpeed = 5;
const forgroundWidth = 1768;
const forgroundHeight = 500;
const forground1 = new Image();
forground1.src = "./assets/layer1.png";
let forground1PosX = 0;
const forground1X = new Image();
forground1X.src = "./assets/layer1.png";
let forground1XPosX = 1768;
const forground2 = new Image();
forground2.src = "./assets/layer2.png";
let forground2PosX = 0;
const forground2X = new Image();
forground2X.src = "./assets/layer2.png";
let forground2XPosX = 1768;
const forground3 = new Image();
forground3.src = "./assets/layer3.png";
let forground3PosX = 0;
const forground3X = new Image();
forground3X.src = "./assets/layer3.png";
let forground3XPosX = 1768;
const forground4 = new Image();
forground4.src = "./assets/layer4.png";
let forground4PosX = 0;
const forground4X = new Image();
forground4X.src = "./assets/layer4.png";
let forground4XPosX = 1768;

//animate background function
let layer1posX = 0;
let layer1XposX2 = 1768;
let layer2posX = 0;
let layer2XposX2 = 1768;
let layer3posX = 0;
let layer3XposX2 = 1768;
let layer4posX = 0;
let layer4XposX2 = 1768;

//explosion Effect
let fireExplosionList = [];
let smokeExplosionList = [];

const Game = ({ token }) =>{

    //db setup

    const insertScoreToDB = async (pscore)=> {
        try{            
            const { data: { user } } = await supabase.auth.getUser()
            if(user){
                const { error } = await supabase
                  .from('scores')
                  .upsert([{uid: user.id, username: user.user_metadata.username, score: pscore}])

                if(error) throw error
            }
        }catch(error){
            console.log(error)
        }
    }

    //canvas ref
    const canvasRef = useRef();
    const contextRef = useRef();
    const animateGameFrameIDRef = useRef(null);
    const animateBackgroundRef = useRef(null);

    

    //state
    const [isPlayerReady, setPlayer] = useState(false);

    //css effect add
    const [startButtonHide, needToHide] = useState("");

    //game over screen
    const[saveScore, setScore] = useState(false);
    const[applyGameOverCSS, setGameOverCSS] = useState("game-over-screen-deactivate");

    //input handel object
    const {lastKey, weaponType, keyDownEvent, keyUpEvent} = useInputHandler();

    if(lastKey !== playerInput){
        if(isPlayerReady){
            playerInput = lastKey;
        }
    }
    if(weaponType !== playerWeapon){
        if(isPlayerReady){
            playerWeapon = weaponType;
        }
    }

    //player Ready function
    const playerReady = () =>{
        needToHide("start-button-hide");
        setPlayer(true);

    }

    //background animation function
    const changeBackgroundPos = (layerPos, speed) =>{
        if(!(layerPos + forgroundWidth < 0)){
            layerPos -= speed;
            return layerPos;
        }else{
            layerPos = 1758;
            return layerPos;
        }
    }

    //player movement function
    const playerMovemnet = (playerInput) =>{
        if(playerInput === "Pressed ArrowUp"){
            if(playerPosY > 0){
                playerPosY -= 3;
            }
        }else if(playerInput === "Pressed ArrowDown"){
            if(playerPosY + playerHeight < canvasHeight){
                playerPosY += 3;
            }
        }else if(playerInput === "Released ArrowUp"){
            playerPosY = playerPosY;
        }else if(playerInput === "Released ArrowDown"){
            playerPosY = playerPosY;
        }
    }

    
    const projectile = () =>{
        const ctx = contextRef.current;
        const {pushToWeponOne, drawWeaponTypeOne, pushToWeponTwo, drawWeaponTypeTwo} = useProjectileController(ctx, playerPosX, playerPosY, playerWidth, playerHeight);
        //push ammo type one to weaponOne array
        if(playerWeapon === "Selected Weapon Type One"){
            if(!coolDownWeaponOne && weaponOne.length < totalAmmoForWeaponOne){
                const weaponOneAmmo = pushToWeponOne();
                weaponOne.push(weaponOneAmmo);
                coolDownWeaponOne = true;
            }
        }else if(playerWeapon === "Selected Weapon Type Two"){
            if(!coolDownWeaponTwo && weaponTwo.length < totalAmmoForWeaponTwo){
                const weaponTwoAmmo = pushToWeponTwo();
                weaponTwo.push(weaponTwoAmmo);
                coolDownWeaponTwo = true;
            }
        }

        //weapon cool down timer
        //weapon one
        if(coolDownWeaponOne){
            if(cooldDownTimerWeaponOne > 0){
                cooldDownTimerWeaponOne -= 1;
            }else{
                cooldDownTimerWeaponOne = 20;
                coolDownWeaponOne = false;
            }
        }
        //weapon two
        if(coolDownWeaponTwo){
            if(coolDownTimerWeaponTwo > 0){
                coolDownTimerWeaponTwo -= 1;
            }else{
                coolDownTimerWeaponTwo = 60;
                coolDownWeaponTwo = false;
            }
        }

        //draw ammo from WeaponOne array
        //weapon one
        weaponOne.map((item) =>{
            drawWeaponTypeOne(
                item.ammoPosX,
                item.ammoPosY,
                item.ammoWidth,
                item.ammoHeight,
            )
        })
        //weapon two
        weaponTwo.map((item) =>{
            drawWeaponTypeTwo(
                item.ammoPosX,
                item.ammoPosY,
                item.ammoWidth,
                item.ammoHeight,
            )
        })

        //move weaponOne ammo
        //weapon one
        weaponOne.map((item) =>{
            item.ammoPosX += item.velocity;
        })
        //weapon two
        weaponTwo.map((item) =>{
            item.ammoPosX += item.velocity;
        })

        //remove projectile from weaponOne array if it reached certain destance
        //weapon one
        const indexOfWeaponOne = weaponOne.findIndex((item) =>{
            if(item.ammoPosX > 1100 || item.markForDeletion === true){
                return true;
            }
        })
        if(indexOfWeaponOne !== -1){
            weaponOne.splice(indexOfWeaponOne, 1);
        }
        
        //weapon two
        const indexOfWeaponTwo = weaponTwo.findIndex((item) =>{
            if(item.ammoPosX > 1100 || item.markForDeletion === true){
                return true;
            }
        })
        if(indexOfWeaponTwo !== -1){
            weaponTwo.splice(indexOfWeaponTwo, 1);
        }
    }

    //recharge weapon indicator
    const weaponRecharge = () =>{
        const ctx = contextRef.current;
        
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color with alpha (transparent black)
        ctx.shadowOffsetX = 5; // Horizontal offset of the shadow
        ctx.shadowOffsetY = 5; //Vertical offset of the shadow
        //weapon one
        for(let i=0; i<totalAmmoForWeaponOne - weaponOne.length; i++){
            
            ctx.drawImage(weaponOneAmmoIndicator, (50) + indicatorWidth*i, 40, indicatorWidth, indicatorHeight);
        }

        //weapon two
        for(let i=0; i<totalAmmoForWeaponTwo - weaponTwo.length; i++){
            ctx.drawImage(weaponTwoAmmoIndicator, (50) + indicatorWidth*i, 60, indicatorWidth, indicatorHeight);
        }

        ctx.restore();
    }

    //enemy swarm
    const enemiesSwarm = () =>{
        const ctx = contextRef.current;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const {pushAnglerOne, 
            drawAnglerOne, 
            pushAnglerTwo, 
            drawAnglerTwo, 
            pushToHiveWhale, 
            drawHiveWhale, 
            pushToDrone, 
            drawDrone} = useEnemy(ctx, canvasWidth, canvasHeight);

        //push enemies to respective array
        //angler one
        if(!anglerOneIsCoolingDown){
            const anglerOne = pushAnglerOne();
            if(score > 50){
                anglerOne.velocity += 2;
            }else if(score > 100){
                anglerOne.velocity += 2;
            }else if(score > 150){
                anglerOne.velocity += 2;
            }else if(score > 200){
                anglerOne.velocity += 2;
            }else if(score > 250){
                anglerOne.velocity += 2;
            }else if(score > 300){
                anglerOne.velocity += 2;
            }else if(score > 350){
                anglerOne.velocity += 2;
            }else if(score > 400){
                anglerOne.velocity += 2;
            }else if(score > 450){
                anglerOne.velocity += 2;
            }else if(score > 500){
                anglerOne.velocity += 2;
            }
            enemiesAnglerOne.push(anglerOne);
            anglerOneIsCoolingDown = true;
        }else{
            if(anglerOneCoolDownTimer > 0){
                anglerOneCoolDownTimer -= 1;
            }else{
                anglerOneCoolDownTimer = 100;
                anglerOneIsCoolingDown = false;
            }
        }

        //angler two
        if(!anglerTwoIsCoolingDown){
            const anglerTwo = pushAnglerTwo();
            if(score > 50){
                anglerTwo.velocity += 2;
            }else if(score > 100){
                anglerTwo.velocity += 2;
            }else if(score > 150){
                anglerTwo.velocity += 2;
            }else if(score > 200){
                anglerTwo.velocity += 2;
            }else if(score > 250){
                anglerTwo.velocity += 2;
            }else if(score > 300){
                anglerTwo.velocity += 2;
            }else if(score > 350){
                anglerTwo.velocity += 2;
            }else if(score > 400){
                anglerTwo.velocity += 2;
            }else if(score > 450){
                anglerTwo.velocity += 2;
            }else if(score > 500){
                anglerTwo.velocity += 2;
            }
            enemiesAnglerTwo.push(anglerTwo);
            anglerTwoIsCoolingDown = true;
        }else{
            if(anglerTwoCoolDownTimer > 0){
                anglerTwoCoolDownTimer -= 1;
            }else{
                anglerTwoCoolDownTimer = 100;
                anglerTwoIsCoolingDown = false;
            }
        }

        //hive whale
        if(!hiveWhaleIsCoolingDown){
            const hiveWhale = pushToHiveWhale();
            if(score > 50){
                hiveWhale.velocity += 2;
            }else if(score > 100){
                hiveWhale.velocity += 2;
            }else if(score > 150){
                hiveWhale.velocity += 2;
            }else if(score > 200){
                hiveWhale.velocity += 2;
            }else if(score > 250){
                hiveWhale.velocity += 2;
            }else if(score > 300){
                hiveWhale.velocity += 2;
            }else if(score > 350){
                hiveWhale.velocity += 2;
            }else if(score > 400){
                hiveWhale.velocity += 2;
            }else if(score > 450){
                hiveWhale.velocity += 2;
            }else if(score > 500){
                hiveWhale.velocity += 2;
            }
            enemiesHiveWhale.push(hiveWhale);
            hiveWhaleIsCoolingDown = true;
        }else{
            if(hiveWhaleCoolDownTimer > 0){
                hiveWhaleCoolDownTimer -= 1;
            }else{
                hiveWhaleCoolDownTimer = 600;
                hiveWhaleIsCoolingDown = false;
            }
        }

        // draw enemies
        //angler one
        enemiesAnglerOne.map((item) =>{
            drawAnglerOne(item.posX, item.posY, item.width, item.height);
        })

        //angler two
        enemiesAnglerTwo.map((item) =>{
            drawAnglerTwo(item.posX, item.posY, item.width, item.height);
        })

        //hive whale
        enemiesHiveWhale.map((item) =>{
            drawHiveWhale(item.posX, item.posY, item.width, item.height);
        })

        //drones
        enemiesDrone.map((item) =>{
            drawDrone(item.posX, item.posY, item.width, item.height);
        })

        //move enemies
        //angler one
        enemiesAnglerOne.map((item) =>{
            item.posX -= item.velocity;
        })

        //angler two
        enemiesAnglerTwo.map((item) =>{
            item.posX -= item.velocity;
        })

        //hive whale
        enemiesHiveWhale.map((item) =>{
            item.posX -= item.velocity;
        })

        //drones
        enemiesDrone.map((item) =>{
            item.posX += item.velocityX;
            item.posY += item.velocityY;

            if(item.posX < 0 || item.posX + item.width > rect.right){
                item.velocityX *= -1;
            }
            if(item.posY < 0 || item.posY + item.height > rect.bottom){
                item.velocityY *= -1;
            }
        })

        //remove enemies it crosses the window edge or marked for deletion
        //angler one
        const indexOfAnglerOne = enemiesAnglerOne.findIndex((item) =>{
            if(item.posX + item.width < 0 || item.markForDeletion === true){
                return true
            }
        })
        if(indexOfAnglerOne !== -1){
            //explosion effect
            const {flameEffect, smokeEffect} = useExplosionEffects(enemiesAnglerOne[indexOfAnglerOne].posX, enemiesAnglerOne[indexOfAnglerOne].posY);
            fireExplosionList.push(flameEffect);
            smokeExplosionList.push(smokeEffect);
            //remove enemy from list
            enemiesAnglerOne.splice(indexOfAnglerOne, 1);
        }

        //angler two
        const indexOfAnglerTwo = enemiesAnglerTwo.findIndex((item) =>{
            if(item.posX + item.width < 0 || item.markForDeletion === true){
                return true
            }
        })
        if(indexOfAnglerTwo !== -1){
            const {flameEffect, smokeEffect} = useExplosionEffects(enemiesAnglerTwo[indexOfAnglerTwo].posX, enemiesAnglerTwo[indexOfAnglerTwo].posY);
            fireExplosionList.push(flameEffect);
            smokeExplosionList.push(smokeEffect);
            enemiesAnglerTwo.splice(indexOfAnglerTwo, 1);
        }

        //hive whale
        const indexOfHiveWhale = enemiesHiveWhale.findIndex((item) =>{
            if(item.posX + item.width < 0 || item.markForDeletion === true){
                return true
            }
        })
        if(indexOfHiveWhale !== -1){
            //add drone to its array
            for(let i=0; i<3; i++){
                const drone = pushToDrone(enemiesHiveWhale[indexOfHiveWhale].posX, enemiesHiveWhale[indexOfHiveWhale].posY);
                enemiesDrone.push(drone);
            }
            const {flameEffect, smokeEffect} = useExplosionEffects(enemiesHiveWhale[indexOfHiveWhale].posX, enemiesHiveWhale[indexOfHiveWhale].posY);
            fireExplosionList.push(flameEffect);
            smokeExplosionList.push(smokeEffect);
            //remove hive whale
            enemiesHiveWhale.splice(indexOfHiveWhale, 1);
            
        }

        //drones
        const indexOfDrone = enemiesDrone.findIndex((item) =>{
            if(item.posX + item.width < 0 || item.markForDeletion === true){
                return true
            }
        })
        if(indexOfDrone !== -1){
            const {flameEffect, smokeEffect} = useExplosionEffects(enemiesDrone[indexOfDrone].posX, enemiesDrone[indexOfDrone].posY);
            fireExplosionList.push(flameEffect);
            smokeExplosionList.push(smokeEffect);
            enemiesDrone.splice(indexOfDrone, 1);
        }

    }

    //check collision detection
    //weapon one vs angler one
    const isWeaponOneANDanglerOneCollided = () =>{
        const {weaponVSenemies} = useCollisionDetection(weaponOne, enemiesAnglerOne, score);
        const {updateAmmo, updateEnemy, updateScore} = weaponVSenemies();
        weaponOne = updateAmmo.map((item) => item);
        enemiesAnglerOne = updateEnemy.map((item) => item);
        score = updateScore;
    }

    //weapon two vs angler one
    const isWeaponTwoANDanglerOneCollided = () =>{
        const {weaponVSenemies} = useCollisionDetection(weaponTwo, enemiesAnglerOne, score);
        const {updateAmmo, updateEnemy, updateScore} = weaponVSenemies();
        weaponTwo = updateAmmo.map((item) => item);
        enemiesAnglerOne = updateEnemy.map((item) => item);
        score = updateScore;
    }

    //weapon one vs angler two
    const isWeaponOneANDanglerTwoCollided = () =>{
        const {weaponVSenemies} = useCollisionDetection(weaponOne, enemiesAnglerTwo, score);
        const {updateAmmo, updateEnemy, updateScore} = weaponVSenemies();
        weaponOne = updateAmmo.map((item) => item);
        enemiesAnglerTwo = updateEnemy.map((item) => item);
        score = updateScore;
    }
    //weapon two vs angler two
    const isWeaponTwoANDanglerTwoCollided = () =>{
        const {weaponVSenemies} = useCollisionDetection(weaponTwo, enemiesAnglerTwo, score);
        const {updateAmmo, updateEnemy, updateScore} = weaponVSenemies();
        weaponTwo = updateAmmo.map((item) => item);
        enemiesAnglerTwo = updateEnemy.map((item) => item);
        score = updateScore;
    }

    //weapon one vs hive whale
    const isWeaponOneANDhiveWhaleCollided = () =>{
        const {weaponVSenemies} = useCollisionDetection(weaponOne, enemiesHiveWhale, score);
        const {updateAmmo, updateEnemy, updateScore} = weaponVSenemies();
        weaponOne = updateAmmo.map((item) => item);
        enemiesHiveWhale = updateEnemy.map((item) => item);
        score = updateScore;
    }
    //weapon two vs hive whale
    const isWeaponTwoANDhiveWhaleCollided = () =>{
        const {weaponVSenemies} = useCollisionDetection(weaponTwo, enemiesHiveWhale, score);
        const {updateAmmo, updateEnemy, updateScore} = weaponVSenemies();
        weaponTwo = updateAmmo.map((item) => item);
        enemiesHiveWhale = updateEnemy.map((item) => item);
        score = updateScore;
    }

    //weapon one vs drones
    const isWeaponOneANDdroneCollided = () =>{
        const {weaponVSenemies} = useCollisionDetection(weaponOne, enemiesDrone, score);
        const {updateAmmo, updateEnemy, updateScore} = weaponVSenemies();
        weaponOne = updateAmmo.map((item) => item);
        enemiesDrone = updateEnemy.map((item) => item);
        score = updateScore;
    }
    //weapon two vs drones
    const isWeaponTwoANDdroneCollided = () =>{
        const {weaponVSenemies} = useCollisionDetection(weaponTwo, enemiesDrone, score);
        const {updateAmmo, updateEnemy, updateScore} = weaponVSenemies();
        weaponTwo = updateAmmo.map((item) => item);
        enemiesDrone = updateEnemy.map((item) => item);
        score = updateScore;
    }

    //score board
    const displayScore = () =>{
        const ctx = contextRef.current;
        // Save the canvas state
        ctx.save();
        ctx.font = "30px Bungee Spice, cursive";
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Shadow color with alpha (transparent black)
        ctx.shadowOffsetX = 5; // Horizontal offset of the shadow
        ctx.shadowOffsetY = 5; //Vertical offset of the shadow
        ctx.fillText(`Score: ${score}`, 50, 30);
        // Restore the canvas state (shadow properties won't affect other elements drawn after this point)
        ctx.restore();
    }

    //game over
    const gameOver = () =>{
        let player = {
            playerPosX: playerPosX,
            playerPosY: playerPosY,
            playerWidth: playerWidth,
            playerHeight: playerHeight
        }
        //angler one
        const playerVSanglerOne =() =>{
            const playerVSenemies = useGameOver(player, enemiesAnglerOne);
            const isGameOver = playerVSenemies();
            if(isGameOver){
                setPlayer(false);
                setGameOverCSS("game-over-screen-activate");
                setScore(true);
                gameOverSound.play();
                if(token){
                    insertScoreToDB(score);
                }
            }
        }
        playerVSanglerOne();

        //angler two
        const playerVSanglerTwo =() =>{
            const playerVSenemies = useGameOver(player, enemiesAnglerTwo);
            const isGameOver = playerVSenemies();
            if(isGameOver){
                setPlayer(false);
                setGameOverCSS("game-over-screen-activate");
                setScore(true);
                gameOverSound.play();
                if(token){
                    insertScoreToDB(score);
                }
            }
        }
        playerVSanglerTwo();

        //hive whale
        const playerVShiveWhale =() =>{
            const playerVSenemies = useGameOver(player, enemiesHiveWhale);
            const isGameOver = playerVSenemies();
            if(isGameOver){
                setPlayer(false);
                setGameOverCSS("game-over-screen-activate");
                setScore(true);
                gameOverSound.play();
                if(token){
                    insertScoreToDB(score);
                }
            }
        }
        playerVShiveWhale();

        //drone
        const playerVSdrone =() =>{
            const playerVSenemies = useGameOver(player, enemiesDrone);
            const isGameOver = playerVSenemies();
            if(isGameOver){
                setPlayer(false);
                setGameOverCSS("game-over-screen-activate");
                setScore(true);
                gameOverSound.play();
                if(token){
                    insertScoreToDB(score);
                }
            }
        }
        playerVSdrone();
    }
    const animateBackground = () =>{
        const ctx = contextRef.current;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        //draw layer one
        ctx.drawImage(forground1, layer1posX, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground1X, layer1XposX2, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground2, layer2posX, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground2X, layer2XposX2, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground3, layer3posX, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground3X, layer3XposX2, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground4, layer4posX, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground4X, layer4XposX2, 0, forgroundWidth, forgroundHeight);
        

        //move background
        layer1posX = changeBackgroundPos(layer1posX, forgroundSpeed-4);
        layer1XposX2 = changeBackgroundPos(layer1XposX2, forgroundSpeed-4);
        layer2posX = changeBackgroundPos(layer2posX, forgroundSpeed-3);
        layer2XposX2 = changeBackgroundPos(layer2XposX2, forgroundSpeed-3);
        layer3posX = changeBackgroundPos(layer3posX, forgroundSpeed-2);
        layer3XposX2 = changeBackgroundPos(layer3XposX2, forgroundSpeed-2);
        layer4posX = changeBackgroundPos(layer4posX, forgroundSpeed-1);
        layer4XposX2 = changeBackgroundPos(layer4XposX2, forgroundSpeed-1);

        if(!isPlayerReady){
            animateBackgroundRef.current = window.requestAnimationFrame(animateBackground);
        }else{
            window.cancelAnimationFrame(animateBackgroundRef.current);
        }

    }

    const animateForground = () =>{
        const ctx = contextRef.current;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        //draw layer one
        ctx.drawImage(forground1, forground1PosX, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground1X, forground1XPosX, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground2, forground2PosX, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground2X, forground2XPosX, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground3, forground3PosX, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground3X, forground3XPosX, 0, forgroundWidth, forgroundHeight);

        //move background
        forground1PosX = changeBackgroundPos(forground1PosX, forgroundSpeed-4);
        forground1XPosX = changeBackgroundPos(forground1XPosX, forgroundSpeed-4);
        forground2PosX = changeBackgroundPos(forground2PosX, forgroundSpeed-3);
        forground2XPosX = changeBackgroundPos(forground2XPosX, forgroundSpeed-3);
        forground3PosX = changeBackgroundPos(forground3PosX, forgroundSpeed-2);
        forground3XPosX = changeBackgroundPos(forground3XPosX, forgroundSpeed-2);

    }

    const explosionEffect = () =>{
        const ctx = contextRef.current;
        if(fireExplosionList.length > 0 && smokeExplosionList.length > 0){
            for(let fireExplosions of fireExplosionList){
                const {drawFireEffect} = useExplosionEffectRender();
                drawFireEffect(ctx, fireExplosions.effectPosX, fireExplosions.effectPosY, fireExplosions.width, fireExplosions.height, fireExplosions.initialFrame);
                fireExplosions.initialFrame += 1;
                if(fireExplosions.initialFrame >= 7){
                    fireExplosions.markForDeletion = true;
                }
            }

            for(let smokeExplosions of smokeExplosionList){
                const {drawSmokeEffect} = useExplosionEffectRender();
                drawSmokeEffect(ctx, smokeExplosions.effectPosX, smokeExplosions.effectPosY, smokeExplosions.width, smokeExplosions.height, smokeExplosions.initialFrame);
                smokeExplosions.initialFrame += 1;
                if(smokeExplosions.initialFrame >= 7){
                    smokeExplosions.markForDeletion = true;
                }
            }

            //delete effects
            //fire
            const indexOfFireExplosion = fireExplosionList.findIndex((item) =>{
                if(item.markForDeletion){
                    return true
                }
            })
            if(indexOfFireExplosion !== -1){
                fireExplosionList.splice(indexOfFireExplosion, 1);
            }
            //smoke
            const indexOfSmokeExplosion = smokeExplosionList.findIndex((item) =>{
                if(item.markForDeletion){
                    return true
                }
            })
            if(indexOfSmokeExplosion !== -1){
                smokeExplosionList.splice(indexOfSmokeExplosion, 1);
            }
        }
    }

    const animateGameFrame = () =>{
        
        const ctx = contextRef.current;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        //player
        const {drawPlayer} = usePlayer(ctx, playerPosX, playerPosY, playerWidth, playerHeight);
        animateForground();
        drawPlayer();
        playerMovemnet(playerInput);
        projectile();
        enemiesSwarm();
        weaponRecharge();
        displayScore()
        //draw last forground
        ctx.drawImage(forground4, forground4PosX, 0, forgroundWidth, forgroundHeight);
        ctx.drawImage(forground4X, forground4XPosX, 0, forgroundWidth, forgroundHeight);
        forground4PosX = changeBackgroundPos(forground4PosX, forgroundSpeed-1);
        forground4XPosX = changeBackgroundPos(forground4XPosX, forgroundSpeed-1);
        isWeaponOneANDanglerOneCollided();
        isWeaponTwoANDanglerOneCollided();
        isWeaponOneANDanglerTwoCollided();
        isWeaponTwoANDanglerTwoCollided();
        isWeaponOneANDhiveWhaleCollided();
        isWeaponTwoANDhiveWhaleCollided();
        isWeaponOneANDdroneCollided();
        isWeaponTwoANDdroneCollided();
        explosionEffect();
        gameOver()
        
        if(isPlayerReady){
            animateGameFrameIDRef.current = window.requestAnimationFrame(animateGameFrame);
        }else{
            window.cancelAnimationFrame(animateGameFrameIDRef.current);
        }
    }

    useEffect(() =>{
        const canvas = canvasRef.current;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        contextRef.current = canvas.getContext("2d");

        if (isPlayerReady) {
            animateGameFrame();
            window.addEventListener("keydown", keyDownEvent);
            window.addEventListener("keyup", keyUpEvent);
            window.cancelAnimationFrame(animateBackgroundRef.current);
          } else {
            // If the player is not ready, remove the event listeners and animation frame
            window.removeEventListener("keydown", keyDownEvent);
            window.removeEventListener("keyup", keyUpEvent);
            window.cancelAnimationFrame(animateGameFrameIDRef.current);
            animateBackground();
          }


        return () => {
            window.removeEventListener("keydown", keyDownEvent);
            window.removeEventListener("keyup", keyUpEvent);
          };
        
    }, [isPlayerReady])

console.log(token)
    return(
        <div>
            <canvas className="game-window" ref={canvasRef}></canvas>
            <div className={`start-button ${startButtonHide}`} onClick={() =>playerReady()}><img src="./assets/start.png"></img></div>
            <div className={`game-over-screen ${applyGameOverCSS}`}>
                <div className="game-over-title">Game Over</div>
                <div className="game-score">Score: {score}</div>
                <div className="game-over-screen-button">
                    <a href="/strange-planet"><button>Restart</button></a>
                    <a href="/"><button>Exit</button></a>
                </div>
            </div>
        </div>
    )
}

export default Game;
