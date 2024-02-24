import React, {useState} from "react";

const useInputHandler = () =>{
    const [lastKey, updateLastKey] = useState();
    const [weaponType, updateWeaponType] = useState();
    
    const keyDownEvent = (event) =>{
        switch(event.key){
            case "ArrowUp":
                updateLastKey("Pressed ArrowUp");
                break;
            case "ArrowDown":
                updateLastKey("Pressed ArrowDown");
                break;
            case "g":
                updateWeaponType("Selected Weapon Type One");
                break;
            case " ":
                updateWeaponType("Selected Weapon Type Two");
                break;
        }
    }

    const keyUpEvent = (event) =>{
        switch(event.key){
            case "ArrowUp":
                updateLastKey("Released ArrowUp");
                break;
            case "ArrowDown":
                updateLastKey("Released ArrowDown");
                break;
            case "g":
                updateWeaponType("Remove Weapon Type One");
                break;
            case " ":
                updateWeaponType("Remove Weapon Type Two");
                break;
        }
    }

    return {lastKey, weaponType, keyDownEvent, keyUpEvent}
}

export default useInputHandler;
