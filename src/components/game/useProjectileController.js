import React from "react";

const weaponOneImage = new Image();
weaponOneImage.src = "./assets/weapon-one.png";

const weaponTwoImage = new Image();
weaponTwoImage.src = "./assets/weapon-two.png";

const useProjectileController = (context, playerPosX, playerPosY, playerWidth, playerHeight) =>{
    const ctx = context;

    const pushToWeponOne = () =>{
        const weponOneProperties = {
            ammoPosX: playerPosX+playerWidth,
            ammoPosY: playerPosY,
            ammoWidth: 28,
            ammoHeight: 10,
            velocity: 4,
            markForDeletion: false,
            power: 1,
        }
        return weponOneProperties;
    }

    const pushToWeponTwo = () =>{
        const weponTwoProperties = {
            ammoPosX: playerPosX+playerWidth,
            ammoPosY: playerPosY+playerHeight/2,
            ammoWidth: 47,
            ammoHeight: 10,
            velocity: 5,
            markForDeletion: false,
            power: 3,
        }
        return weponTwoProperties;
    }

    const drawWeaponTypeOne = (ammoPosX, ammoPosY, ammoWidth, ammoHeight) =>{
        ctx.drawImage(weaponOneImage, ammoPosX, ammoPosY, ammoWidth, ammoHeight);
    }

    const drawWeaponTypeTwo = (ammoPosX, ammoPosY, ammoWidth, ammoHeight) =>{
        ctx.drawImage(weaponTwoImage, ammoPosX, ammoPosY, ammoWidth, ammoHeight);
    }

    return {pushToWeponOne, drawWeaponTypeOne, pushToWeponTwo, drawWeaponTypeTwo}
}

export default useProjectileController;
