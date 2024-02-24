import React from "react";

const flameEffectImages = new Image();
flameEffectImages.src = "./assets/fireExplosion.png";

const smokeEffectImages = new Image();
smokeEffectImages.src = "./assets/smokeExplosion.png";

const useExplosionEffects = (posX, posY) =>{

    const flameEffect = {
        effectPosX: posX,
        effectPosY: posY,
        width: 200,
        height: 200,
        initialFrame: 0,
        markForDeletion: false,
    }

    const smokeEffect = {
        effectPosX: posX,
        effectPosY: posY,
        width: 200,
        height: 200,
        initialFrame: 0,
        markForDeletion: false,
    }

    return {flameEffect, smokeEffect}
}

const useExplosionEffectRender = () =>{
    const drawFireEffect = (context, posX, posY, width, height, initialFrame) =>{
        const ctx = context;
        ctx.drawImage(
            flameEffectImages,
            width * initialFrame,
            0,
            width,
            height,
            posX,
            posY,
            width,
            height
        )
    }

    const drawSmokeEffect = (context, posX, posY, width, height, initialFrame) =>{
        const ctx = context;
        ctx.drawImage(
            smokeEffectImages,
            width * initialFrame,
            0,
            width,
            height,
            posX,
            posY,
            width,
            height
        )
    }
    return {drawFireEffect, drawSmokeEffect}
}

export {useExplosionEffects, useExplosionEffectRender};