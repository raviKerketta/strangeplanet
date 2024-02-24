import React from "react";
import "./instruction.css"

const InstructionSection = () => {

    return (
        <div className="container">
            <div className="title">Instruction</div>
            <div className="instruction-container-alignment">
                <div className="instruction-container">
                    <div className="instruction-content-container">
                        <div className="card">
                            <div className="card-img"><img src="./web_assets/sort.png"></img></div>
                            <div className="card-details">
                                <p>Press <label>"ARROW UP"</label> to go Up</p>
                                <p>Press <label>"ARROW DOWN"</label> to go Down</p>
                            </div>
                        </div>
                    </div>
                    <div className="instruction-content-container">
                        <div className="card">
                            <div className="card-img"><img src="./web_assets/ray_gun_two.png"></img></div>
                            <div className="card-details">
                                <p>Press <label>"G"</label> Button to fire</p>
                                <p> <label>NOTE:</label> this weapon has <label>"LOW DAMAGE"</label></p>
                            </div>
                        </div>
                    </div>
                    <div className="instruction-content-container">
                        <div className="card">
                            <div className="card-img"><img src="./web_assets/ray_gun_one.png"></img></div>
                            <div className="card-details">
                                <p>Press <label>"SPACE"</label> Button to fire</p>
                                <p> <label>NOTE:</label> this weapon has <label>"MORE DAMAGE"</label></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructionSection;