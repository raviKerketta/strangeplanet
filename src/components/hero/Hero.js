import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const blastWidth = 300;
const blastHeight = 300;
const blastTotalCuts = 20;
let blastInititialCut = 0;

let initialFrame = 1;
let initialBlastOneFrame = 0;
let initialBlastTwoFrame = 0;
let initialBlastThreeFrame = 0;
const blastOneFrameDelay = 10;
const blastTwoFrameDelay = 16;
const blastThreeframeDelay = 20;


const Hero = () =>{

    const [canvasReady, setCanvas] = useState(false);

    const canvasRef = useRef();
    const contextRef = useRef();
    const planet = new Image();
    planet.src = "./web_assets/planet.png";
    const blast = new Image();
    blast.src = "./web_assets/explosions.png";

    useEffect(() =>{
        const canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = 500;
        contextRef.current = canvas.getContext("2d");

        animate();


    }, [])

    const animate = () =>{
        const ctx = contextRef.current;
        ctx.clearRect(0, 0, 500, 500);

        ctx.drawImage(planet, 50, 50, 400, 400);
        ctx.drawImage(blast,blastWidth * initialBlastOneFrame, blastHeight * 0, blastWidth, blastHeight, 0, 0, blastWidth, blastHeight);
        ctx.drawImage(blast,blastWidth * initialBlastTwoFrame, blastHeight * 1, blastWidth, blastHeight, 200, 90, blastWidth, blastHeight);
        ctx.drawImage(blast,blastWidth * initialBlastThreeFrame, blastHeight * 2, blastWidth, blastHeight, 70, 230, blastWidth, blastHeight);

        if(initialFrame % blastOneFrameDelay === 0){
            if(initialBlastOneFrame < blastTotalCuts){
                initialBlastOneFrame += 1;
            }else{
                initialBlastOneFrame = 0;
            }
        }

        if(initialFrame % blastTwoFrameDelay === 0){
            if(initialBlastTwoFrame < blastTotalCuts){
                initialBlastTwoFrame += 1;
            }else{
                initialBlastTwoFrame = 0;
            }
        }

        if(initialFrame % blastThreeframeDelay === 0){
            if(initialBlastThreeFrame < blastTotalCuts){
                initialBlastThreeFrame += 1;
            }else{
                initialBlastThreeFrame = 0;
            }
        }


        initialFrame += 1;



        window.requestAnimationFrame(animate);
    }

    return (
        <div className="hero-section">
            <div className="hero-section-content">
                <h1><p className="hero-title">"Journey to the Unknown: Unleash Your Warrior Spirit"</p></h1>
                <p className="hero-context">Welcome to the enigmatic world of Galacta Nova! Prepare yourself for an 
                unparalleled adventure that will take you to the far reaches of the cosmos.</p>
                <a href="/strange-planet" className="play-now-link"><button className="play-now-button">Play Now >></button></a>
            </div>
            <div className="hero-section-image">
                {/* <img className="hero-image" src="./web_assets/planet.png"></img> */}
                <canvas ref={canvasRef} className="hero-canvas"></canvas>
            </div>
        </div>
    )
}

export default Hero;