import style from "./Darkmode.module.css";
import React from "react";

export default function Darkmode(){
    const setDarkMode = () => {
        document.querySelector("body").setAttribute('data-theme', 'dark')
        localStorage.setItem("selectedTheme", "dark")
    }

    const setLightMode = () => {
        document.querySelector("body").setAttribute('data-theme', 'light')
        localStorage.setItem("selectedTheme", "light")
    }

    const selectedTheme = localStorage.getItem("selectedTheme")
    if(selectedTheme === "dark") {
        setDarkMode();
    }

    const toggleTheme = (e) => {
        if (e.target.checked) setDarkMode();
        else setLightMode();
    }

    return(
        <div className={style.botao}>
        <input 
        type="checkbox" 
        className={style.checkbox} 
        id="chk" 
        onChange={toggleTheme}
        defaultChecked={selectedTheme === "dark"}/>

        <label className={style.label} for="chk">
            <div className={style.ball} id="bola"></div>
        </label>

        </div>
    )
}