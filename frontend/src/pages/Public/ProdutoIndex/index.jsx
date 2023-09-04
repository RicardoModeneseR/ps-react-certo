import Cards from "../../../components/Produto/Cards/Cards"
import Navbar from "../../../components/Produto/Navbar/Navbar"
import Navitems from "../../../components/Produto/Navbar/Navitens"
import Dropdown from "../../../components/Produto/Navbar/Dropdown"
import FooterM from "../../../components/Produto/Footer/Footer"
import Darkmode from "../../../components/Produto/DarkMode/Darkmode"
import style from "./style.module.css"
import React from "react"
import { useEffect,useState } from "react"
import { useSearchParams } from "react-router-dom"

import BaseApi from "../../../services/Api"
import { useStateContext } from "../../../context/ContextProvider"

import { toast } from "react-toastify"
import Pagination from "../../../components/Layout/Pagination"

const INITIAL_DATA = {
    total: 0,
    current_page: 1,
    last_page: 1,
    first_page_url: "",
    last_page_url: "",
    next_page_url: "",
    prev_page_url: null,
    path: "",
    from: 1,
    to: 1,
    data: [],
};

export default function ProdutoIndex(){
    let [searchParams, setSearchParams] = useSearchParams();

    let controller = new AbortController();

    const INITIAL_FILTERS = {
        search: searchParams.get("search") || "",
    };

    const INITIAL_QUERY = {
        sort: "id",
        order: "desc",
        per_page: 10,
        page: searchParams.get("page") || 1,
    };

    const [isLoading, setLoading] = React.useState(true);
    const [isFiltering, setFiltering] = React.useState(true);
    const [isPaginating, setPaginating] = React.useState(true);

    const [query, setQuery] = React.useState({
        ...INITIAL_QUERY,
        ...INITIAL_FILTERS,
    });
    const [filters, setFilters] = React.useState({ ...INITIAL_FILTERS });
    const [tableData, setTableData] = React.useState({ ...INITIAL_DATA });
    const [catData, setCatData] = React.useState({ ...INITIAL_DATA });

    const { setNotification } = useStateContext();

    const requestData = (args = {}) => {
        setLoading(true);
        let q = { ...query, ...args };
        BaseApi.get("/produto", {
        signal: controller.signal,
        params: {
            ...q,
            search: q.search !== "" ? q.search : undefined,
        },
        })
        .then((response) => {
            setTableData(response.data);
            setLoading(false);
            setPaginating(false);
            setFiltering(false);
        })
        .catch((err) => {
            if (err) {
            console.log(err);
            toast.error("Erro ao carregar dados da tabela");
            setTableData({ ...INITIAL_DATA });
            setLoading(false);
            setPaginating(false);
            setFiltering(false);
            }
        });
    };

    const requestCatData = () => {
        setLoading(true);
        BaseApi.get("/categoria")
        .then((response) => {
            setCatData(response.data);
            setLoading(false);
            setPaginating(false);
            setFiltering(false);
        })
        .catch((err) => {
            if (err) {
            console.log(err);
            toast.error("Erro ao carregar dados da tabela");
            setCatData({ ...INITIAL_DATA });
            setLoading(false);
            setPaginating(false);
            setFiltering(false);
            }
        });
    };


    const setSearch = (args = {}) => {
        let params = { ...args };
        if (filters.search && filters.search !== "") params.q = filters.search;
        setSearchParams(params);
    };
    
    const handlePagination = (page) => {
        setSearch({ p: page });
        setPaginating(true);
        setQuery({ ...query, page });
    };
    
    const handleFilters = (e) => {
        e.preventDefault();
        setSearch();
        setFiltering(true);
        setQuery({ ...query, ...filters, page: 1 });
    };

    useEffect(() => {
        controller = new AbortController();
        requestData();
        requestCatData()
       
        return () => {
        controller.abort();
        setLoading(true);
        };
    }, [query]);

    return(
        <div className={style.productpage}>
            <link rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
            integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ=="
            crossorigin="anonymous" referrerpolicy="no-referrer" />

            <Navbar logo = {"/Santolook.jpg"} submit={handleFilters} change={(e) => setFilters({...filters, search: e.target.value})}>
                <Navitems
                link="http://localhost:3000/ProdutoIndex"
                icon="Início"
                />

                <Navitems link="javascript:;" icon="Tamanhos">
                    {catData.data.map((categoria) =>
                        <Dropdown
                        subCat = {handleFilters}
                        dropValue = {categoria.id}
                        catClick = {(e) =>
                        setFilters({...filters, search: e.target.value})}
                        children = {categoria.nome}
                        />
                    )}
                </Navitems>

                
                <div className={style.bag}>
                    <i class="bi bi-handbag-fill"></i>
                    <Darkmode></Darkmode>
                </div>
            </Navbar>

            <div>
                <div className={style.Banner}>
                    <img src="Banner1.svg" alt="banner" />
                    {/* <div className={style.arrow}>
                        <i class="bi bi-caret-left-fill"></i>
                        <i class="bi bi-caret-right-fill"></i>
                    </div> */}
                </div>
                

                <div className={style.produto}>
                    <h1 className={style.nomeproduto}>PRODUTOS</h1>
                    <hr className={style.caixa}/>
                </div>
            </div>
            

            {!isLoading && (
            <>
                {isFiltering && (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                {!isFiltering && (
                    <div className={style.estrutura}>
                    <Pagination
                        onPaginate={handlePagination}
                        showOnBottom={!isPaginating && tableData.data.length > 0}
                        showOnTop={tableData.data.length > 0}
                        paginateData={tableData}
                    >
                        
                        {!isPaginating && (
                            <div className={style.wrapper}>

                                {tableData.data.map ((produto) => (
                    
                                <Cards
                                img={produto.imagem}
                                nome={produto.nome}
                                descricao={produto.descricao}
                                quantidade={produto.quantidade}
                                preco={produto.preco}
                                categoria={produto?.categoria?.nome}/>
                                ))}
                            </div>
                        )}
                        {isPaginating && (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        )}
                        {tableData.data.length === 0 && (
                        <h5 className="text-purple-3 text-center">
                            Não foram encontrados registros com estes filtros.
                        </h5>
                        )}
                    </Pagination>
                    </div>
                )}
            </>
            )}
            <footer>
                <FooterM
                nome="SantoLook"
                slogan="Vista-se de si e brilhe!"
                social1="fa-brands fa-instagram"
                social2="fa-brands fa-facebook"
                link1="#"
                link2="#"
                ></FooterM>
            </footer>
        </div>
    )
}