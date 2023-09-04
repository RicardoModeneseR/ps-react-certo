import style from "./Navbar.module.css"

export default function Dropdown(props) {
    return (
        <form className={style.dropdown} onSubmit={props.subCat}>
            <button value={props.dropValue} onClick={props.catClick}>{props.children}</button>
        </form>
    )
}