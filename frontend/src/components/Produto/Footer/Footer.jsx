import Style from "./Footer.module.css";

export default function Footer(props){
    return(
        <div>
            <div className={Style.footer_content}>
                <div className={Style.contacts}>
                    <h1>{props.nome}</h1>
                    <p>{props.slogan}</p>
                    <div className={Style.social_media}>
                        <a href="#" className={Style.social_link} id="instagram"><i class={props.social1}></i></a>
                        <a href="#" className={Style.social_link} id="facebook"><i class={props.social2}></i></a>
                    </div>
                </div>
                <ul className={Style.list}>
                    <li>
                        <h3>Nossa Loja</h3>
                        <h4>A SantoLook foi criada por Karina,</h4>
                        <h4>na intenção de vender roupas femininas </h4>
                        <h4>de qualidade e por um bom preço.</h4>
                    </li>
                    <li>
                        <a href={props.link1} className={Style.sobre_link}>{props.empresa1}</a>
                    </li>
                    <li>
                        <a href={props.link2} className={Style.sobre_link}>{props.empresa2}</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}