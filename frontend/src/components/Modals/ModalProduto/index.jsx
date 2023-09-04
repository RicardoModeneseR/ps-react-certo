import BaseApi from "../../../services/Api";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import React, {useEffect, useState} from "react";
import Tooltip from "../../Popups/Tooltip";
import {Modal, Spinner} from "react-bootstrap";
import Button from "../../Layout/Button";

const INITIAL_DATA = {
    total: 0,
    current_page: 1,
    last_page: 1,
    first_page_url: "",
    last_page_url: "",
    next_page_url: "",
    prev_page_url: null,
    path: "",
    fron: 1,
    to: 1,
    data: [],
};

const ModalProduto = ({idProduto, onUpdate, onCreate, children}) => {
    const [isLoading, setLoading] = React.useState(true);
    const [isSaving, setSaving] = React.useState(true);
    const [isShow, setShowModal] = React.useState(false);

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [categorias, setCategorias] = useState('');
    const [imagem, setImagem] = useState(null);
    const [natApi, setNatApi] = React.useState({...INITIAL_DATA});

    const getCategorias = () =>{
        BaseApi
        .get("/categoria")
        .then((response) => {
            setNatApi(response.data)
        })
        .catch((err) => {
            if(err) {
                console.log(err);
                toast.error("Erro ao carregar dados da categoria");
                setNatApi({ ...INITIAL_DATA});
                setLoading(true);
            }
        });
    }

    const buildFormData = () => {
        const formData = new FormData();
        formData.append("nome", nome)
        formData.append("descricao", descricao)
        formData.append("quantidade", quantidade)
        formData.append("preco", preco)
        formData.append("categoria_id", categorias)
        if(imagem) {
            formData.append("imagem", imagem)
        }
        if(idProduto) {
            formData.append('_method', 'PUT')
        }
        return formData
    }

    const submitData = (e) => {
        e.preventDefault();
        setSaving(true);
        const formData = buildFormData();

        if(idProduto) {
            BaseApi.post(`/produto/${idProduto}`, formData).then(res => {
                setSaving(false);
                setShowModal(false);
                toast.success("Produto atualizado com sucesso!");
                onUpdate && onUpdate(res.data);
            }).catch(err => {
                console.log(err);
                Swal.fire('Oops!', err?.data?.errors?.[0] || err?.data?.message || 'Ocorreu um erro ao atualizar esse produto.');
                setSaving(false);
            })
        }
        else {
            BaseApi.post('/produto', formData
            ).then(res => {
                setSaving(false);
                setShowModal(false);
                toast.success('Produto criado com sucesso!');
                onCreate && onCreate(res.data);
            }).catch(err => {
                console.log(err);
                Swal.fire('Oops!', err?.data?.errors?.[0] || err?.data?.message || 'Ocorreu um erro ao criar esse produto.');
                setSaving(false);
            })
        }
    }

    const handleClose = () => {
        setShowModal(false);
    }

    const handleChangeImage = (event) => {
        const selectImagem = event.target.files[0];
        setImagem(selectImagem);
    }

    const requestData = () => {
        setLoading(true);
        BaseApi.get(`/produto${idProduto ? `/${idProduto}` : ''}`).then(res => {
            let data = res.data;
            setNome(data.nome);
            setDescricao(data.descricao);
            setQuantidade(data.quantidade);
            setPreco(data.preco);
            setCategorias(data.categoria_id);
            setImagem(data.imagem);
            setLoading(false);
            setSaving(false);
        }).catch(err => {
            console.log(err);
            Swal.fire('Oops!', err?.data?.errors?.[0] || err?.data?.message || 'Ocorreu um erro ao carregar este lead ou não foi encontrado.', 'error');
            setShowModal(false);
        })
    }

    useEffect(() => {
        if(isShow) {
            getCategorias();
            requestData();
        } else {
            setNome('');
            setDescricao('');
            setQuantidade('');
            setPreco('');
            setCategorias('');
            setImagem(null);
            setLoading(true);
            setSaving(true);
        }
    }, [isShow])

    return (
        <>
            {children &&
                React.cloneElement(children, { onClick: (e) => setShowModal(true) })}
            {!children && (
                <Tooltip text={idProduto ? "Editar produto" : "Criar produto"}>
                <button
                    className={`btn btn-${idProduto ? "warning" : ""} text-white fa-bold`}
                    onClick={(e) => setShowModal(true)}
                >
                    <i className={`bi bi-${idProduto ? "person-gear" : "plus"}`}></i>
                </button>
                </Tooltip>
            )}
            <Modal
                centered
                scrollable
                onHide={handleClose}
                show={isShow}
                animation={true}
                size="md"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{idProduto ? "Editar" : "Criar"} Produto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex align-items-center justify-content-center">
                        {isLoading && (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        )}
                    </div>
                {!isLoading && (
                    <>
                    <div className="row">
                        <h3 className="font-weight-bold">User Information</h3>
                        <div className="form-group mb-3">
                            <label htmlFor="name">Nome do Produto</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nome"
                                placeholder="Enter product name"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="descricao">Descrição</label>
                            <input
                                type="text"
                                className="form-control"
                                id="descricao"
                                placeholder="Enter description"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="quantidade">Quantidade</label>
                            <input
                                type="number"
                                className="form-control"
                                id="quantidade"
                                placeholder="Amount"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="preco">Preço</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                id="preco"
                                placeholder="Price"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="categoria">Categoria</label>
                            <select value={categorias} name="categoria" id="categoria" onChange={(e)=>setCategorias(e.target.value)} className="form-select">
                            <option value="" disabled="disabled" selected>Escolha a categoria do produto</option>
                                {natApi.data.map((item)=> (
                                    <option value={item.id}>{item.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="imagem">Imagem do produto</label>
                            <input type="file" accept="imagem/*"
                            className="form-control"
                            onChange={handleChangeImage} />

                            {idProduto ? (
                                <div className="d-flex justify-content-center align-items-center mt-2">
                                    <img 
                                    src={imagem instanceof File ? URL.createObjectURL(imagem) : imagem} 
                                    alt="imagem"
                                    style={{minWidth: 250, width: 350, objectFit: 'cover'}} 
                                    />
                                </div>
                            ) :
                                null
                            }

                            {imagem && !idProduto && (
                                <div className="d-flex justify-content-center align-items-center mt-2">
                                    {idProduto ? <img src={imagem} alt="imagem" style={{minWidth: 250, width: 350, objectFit: "cover"}}/>
                                        : <img src={URL.createObjectURL(imagem)} alt="imagem" style={{minWidth: 250, width: 350, objectFit: "cover"}} />
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                    </>
                )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex align-items-center w-100">
                        <div className="d-block me-auto"></div>
                        <div className="d-block ms-auto">
                        <button
                            className="btn btn-danger text-white me-2"
                            onClick={handleClose}
                        >
                            Close
                        </button>
                        <Button
                            loading={isSaving}
                            onClick={submitData}
                            className="btn btn-success text-white"
                        >
                            {idProduto ? "Update" : "Create"}
                        </Button>
                        </div>
                        </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalProduto;