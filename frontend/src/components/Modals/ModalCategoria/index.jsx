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

const ModalCategoria = ({idCategoria, onUpdate, onCreate, children}) => {
    const [isLoading, setLoading] = React.useState(true);
    const [isSaving, setSaving] = React.useState(true);
    const [isShow, setShowModal] = React.useState(false);

    const [nome, setNome] = useState('');

    const submitData = (e) => {
        e.preventDefault();
        setSaving(true);

        if(idCategoria) {
            BaseApi.put(`/categoria/${idCategoria}`, {
                nome: nome
            }).then(res => {
                setSaving(false);
                setShowModal(false);
                toast.success("Categoria atualizada com sucesso!");
                onUpdate && onUpdate(res.data);
            }).catch(err => {
                console.log(err);
                Swal.fire('Oops!', err?.data?.errors?.[0] || err?.data?.message || 'Ocorreu um erro ao atualizar essa categoria.');
                setSaving(false);
            })
        }
        else {
            BaseApi.post('/categoria', {
                nome: nome
            }
            ).then(res => {
                setSaving(false);
                setShowModal(false);
                toast.success('Categoria criada com sucesso!');
                onCreate && onCreate(res.data);
            }).catch(err => {
                console.log(err);
                Swal.fire('Oops!', err?.data?.errors?.[0] || err?.data?.message || 'Ocorreu um erro ao criar essa categoria.');
                setSaving(false);
            })
        }
    }

    const handleClose = () => {
        setShowModal(false);
    }

    const requestData = () => {
        setLoading(true);
        BaseApi.get(`/categoria${idCategoria ? `/${idCategoria}` : ''}`).then(res => {
            let data = res.data;
            setNome(data.nome);
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
            requestData();
        } else {
            setNome('');
            setLoading(true);
            setSaving(true);
        }
    }, [isShow])

    return (
        <>
            {children &&
                React.cloneElement(children, { onClick: (e) => setShowModal(true) })}
            {!children && (
                <Tooltip text={idCategoria ? "Editar categoria" : "Criar categoria"}>
                <button
                    className={`btn btn-${idCategoria ? "warning" : ""} text-white fa-bold`}
                    onClick={(e) => setShowModal(true)}
                >
                    <i className={`bi bi-${idCategoria ? "person-gear" : "plus"}`}></i>
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
                    <Modal.Title>{idCategoria ? "Editar" : "Criar"} Categoria</Modal.Title>
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
                            <label htmlFor="name">Nome da Categoria</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nome"
                                placeholder="Enter category name"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
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
                            {idCategoria ? "Update" : "Create"}
                        </Button>
                        </div>
                        </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalCategoria;