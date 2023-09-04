import style from "./Cards.module.css"
import { useState } from "react"
import { useRef } from 'react'

export default function Cards(props) {

    const btnref = useRef()

    const [numero, setNumero] = useState(props.quantidade)

    function comprar(){
        setNumero(numero - 1)
        if (numero <= 1) {
            setNumero("Esgotado")
            btnref.current.disabled = true
        }
    }

    return(
        <div>
            <img src={props.img} alt="" className={style.card_img} />
            <div className={style.card_body}>
                <div>
                    <h2 className={style.card_nome}>{props.nome}</h2>
                    <p className={style.card_descricao}>{props.descricao}</p>
                    <p className={style.card_categoria}>{props.categoria}</p>
                    <p className={style.card_price}> R$: {Number(props.preco).toFixed(2)}</p>
                </div>
                <section>
                    <p className={style.card_quantidade}> Quantidade: {numero}</p>
                    <div>
                        <button className={style.btn} onClick={comprar} ref={btnref}>Comprar</button>
                    </div>
                </section>
            </div>
        </div>
    )
}