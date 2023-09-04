import React from "react";
import style from './Navbar.module.css'

export default function navitems(props){
    if(props.children){
        return(
            <li className={style.nav_item}>
        <a href={props.link} className={style.icon_button}>
            {props.icon}
        </a>
        <div className={style.drop_div}>
            {props.children}
        </div>
    </li>
    )
    }else{
        return(
            <li className={style.nav_item}>
        <a href={props.link} className={style.icon_button}>
            {props.icon}
        </a>
    </li>
    )}
}