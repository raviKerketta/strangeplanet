import React from "react";

//audio
const anglerOneBlast = new Audio("./audio/angler1Blast.wav");
anglerOneBlast.load();
const anglerTwoBlast = new Audio("./audio/angler2Blast.wav");
anglerTwoBlast.load();
const hiveWhaleBlast = new Audio("./audio/hivewhaleBlast.wav");
hiveWhaleBlast.load();
const droneBlast = new Audio("./audio/droneBlast.wav");
droneBlast.load();

const useCollisionDetection = (weapon, enemies, score) =>{
    let updateAmmo = weapon.map((weaponObj) => weaponObj);
    let updateEnemy = enemies.map((enemyObj) => enemyObj);
    let updateScore = score;
    const weaponVSenemies = () =>{
        if(updateAmmo.length > 0 && updateEnemy.length >0){
            for(let i=0; i<updateAmmo.length; i++){
                for(let j=0; j<updateEnemy.length; j++){
                    let getSingleAmmo = updateAmmo[i];
                    let getSingleEnemy = updateEnemy[j];

                    if(
                        (getSingleAmmo.ammoPosX + getSingleAmmo.ammoWidth > getSingleEnemy.posX &&
                        getSingleAmmo.ammoPosY + getSingleAmmo.ammoHeight > getSingleEnemy.posY &&
                        getSingleAmmo.ammoPosX > getSingleEnemy.posX &&
                        getSingleAmmo.ammoPosY < getSingleEnemy.posY + getSingleEnemy.height)
                    ){
                        getSingleAmmo.markForDeletion = true;
                        if(getSingleEnemy.health > 0){
                            getSingleEnemy.health -= getSingleAmmo.power;

                            if(getSingleEnemy.health <= 0){
                                getSingleEnemy.markForDeletion = true;
                                updateScore += getSingleEnemy.score;
                                if(getSingleEnemy.id === "angler-one"){
                                    anglerOneBlast.play();
                                }else if(getSingleEnemy.id === "angler-two"){
                                    anglerTwoBlast.play();
                                }else if(getSingleEnemy.id === "hive-whale"){
                                    hiveWhaleBlast.play();
                                }else if(getSingleEnemy.id === "drone"){
                                    droneBlast.play();
                                }
                            }
                        }
                    }
                    updateAmmo[i] = getSingleAmmo;
                    updateEnemy[j] = getSingleEnemy;
                }
            }
        }
        return {updateAmmo, updateEnemy, updateScore}   
    }

    return {weaponVSenemies}

}

export default useCollisionDetection;
