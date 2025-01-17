import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AdminCorteCortesia.css';

const CortesYTiposDeCorte = () => {
    const navigate = useNavigate();
    const [cortes, setCortes] = useState([]);
    const [cortesias, setCortesias] = useState([]);
    const [editingCorte, setEditingCorte] = useState(null);
    const [editingCortesia, setEditingCortesia] = useState(null);
    const [nuevoCorte, setNuevoCorte] = useState({ nombre: "", precio: "" });
    const [nuevaCortesia, setNuevaCortesia] = useState({ nombre: "", precio: "" });

    useEffect(() => {
        fetchCortes();
        fetchCortesias();
    }, []);

    const fetchCortes = async () => {
        try {
            const response = await fetch("https://albo-barber.onrender.com/tipos-de-corte");
            const data = await response.json();
            setCortes(data);
        } catch (error) {
            console.error("Error al obtener cortes:", error);
        }
    };

    const fetchCortesias = async () => {
        try {
            const response = await fetch("https://albo-barber.onrender.com/api/cortesias");
            const data = await response.json();
            setCortesias(data);
        } catch (error) {
            console.error("Error al obtener cortesías:", error);
        }
    };

    const handleAgregarCorte = async () => {
        if (!nuevoCorte.nombre || !nuevoCorte.precio) return;
        try {
            const response = await fetch("https://albo-barber.onrender.com/tipos-de-corte", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoCorte),
            });
            if (response.ok) {
                fetchCortes();
                setNuevoCorte({ nombre: "", precio: "" });
            } else {
                console.error("Error al agregar el corte");
            }
        } catch (error) {
            console.error("Error al agregar el corte:", error);
        }
    };

    const handleAgregarCortesia = async () => {
        if (!nuevaCortesia.nombre || !nuevaCortesia.precio) return;
        try {
            const response = await fetch("https://albo-barber.onrender.com/api/cortesias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaCortesia),
            });
            if (response.ok) {
                fetchCortesias();
                setNuevaCortesia({ nombre: "", precio: "" });
            } else {
                console.error("Error al agregar la cortesía");
            }
        } catch (error) {
            console.error("Error al agregar la cortesía:", error);
        }
    };


    const handleEliminarCorte = async (id) => {
        try {
            const response = await fetch(`https://albo-barber.onrender.com/tipos-de-corte/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchCortes();
            } else {
                console.error("Error al eliminar el corte");
                console.log(id);
            }
        } catch (error) {
            console.error("Error al eliminar el corte:", error);
        }
    };

    const handleEliminarCortesia = async (id) => {
        try {
            const response = await fetch(`https://albo-barber.onrender.com/api/cortesias/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchCortesias();
            } else {
                console.error("Error al eliminar la cortesía");
            }
        } catch (error) {
            console.error("Error al eliminar la cortesía:", error);
        }
    };

    const handleModificarCorte = async (corte) => {
        try {
            const response = await fetch(`https://albo-barber.onrender.com/tipos-de-corte/${corte.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(corte),
            });

            if (response.ok) {
                fetchCortes();
                setEditingCorte(null);
            } else {
                console.error("Error al modificar el corte");
                console.log(corte.id);
            }
        } catch (error) {
            console.error("Error al modificar el corte:", error);
        }
    };

    const handleModificarCortesia = async (cortesia) => {
        try {
            const response = await fetch(`https://albo-barber.onrender.com/api/cortesias/${cortesia.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cortesia),
            });

            if (response.ok) {
                fetchCortesias();
                setEditingCortesia(null);
            } else {
                console.error("Error al modificar la cortesía");
            }
        } catch (error) {
            console.error("Error al modificar la cortesía:", error);
        }
    };

    return (
        <div className="cortes-y-cortesias-container">
            <div className="header">
                <button className="btn-atras" onClick={() => navigate(-1)}>
                    Atrás
                </button>
            </div>

            <div className="cortes-section">
                <h2>Todos los Cortes</h2>
                {cortes.map((corte) => (
                    <div key={corte.id} className="corte-item">
                        {editingCorte === corte.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={corte.nombre}
                                    onChange={(e) => setCortes(
                                        cortes.map((c) =>
                                            c.id === corte.id ? { ...c, nombre: e.target.value } : c
                                        )
                                    )}
                                />
                                <input
                                    type="number"
                                    value={corte.precio}
                                    onChange={(e) => setCortes(
                                        cortes.map((c) =>
                                            c.id === corte.id ? { ...c, precio: parseFloat(e.target.value) } : c
                                        )
                                    )}
                                />
                                <button onClick={() => handleModificarCorte(corte)}>Guardar</button>
                                <button onClick={() => setEditingCorte(null)}>Cancelar</button>
                            </div>
                        ) : (
                            <>
                                <p>{corte.nombre} - ${corte.precio}</p>
                                <button onClick={() => setEditingCorte(corte.id)}>Modificar</button>
                                <button onClick={() => handleEliminarCorte(corte.id)}>Eliminar</button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="form-section">
                <h2>Agregar Corte</h2>
                <input
                    type="text"
                    placeholder="Nombre del corte"
                    value={nuevoCorte.nombre}
                    onChange={(e) => setNuevoCorte({ ...nuevoCorte, nombre: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Precio del corte"
                    value={nuevoCorte.precio}
                    onChange={(e) => setNuevoCorte({ ...nuevoCorte, precio: e.target.value })}
                />
                <button className="btn-agregar" onClick={handleAgregarCorte}>
                    Agregar Corte
                </button>
            </div>



            <div className="cortes-y-cortesias-container">
                <div className="header">
                </div>



                <div className="cortesias-section">
                    <h2>Todas las Cortesías</h2>
                    {cortesias.map((cortesia) => (
                        <div key={cortesia.id} className="cortesia-item">
                            {editingCortesia === cortesia.id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={cortesia.nombre}
                                        onChange={(e) => setCortesias(
                                            cortesias.map((c) =>
                                                c.id === cortesia.id ? { ...c, nombre: e.target.value } : c
                                            )
                                        )}
                                    />
                                    <input
                                        type="number"
                                        value={cortesia.precio}
                                        onChange={(e) => setCortesias(
                                            cortesias.map((c) =>
                                                c.id === cortesia.id ? { ...c, precio: parseFloat(e.target.value) } : c
                                            )
                                        )}
                                    />
                                    <button onClick={() => handleModificarCortesia(cortesia)}>Guardar</button>
                                    <button onClick={() => setEditingCortesia(null)}>Cancelar</button>
                                </div>
                            ) : (
                                <>
                                    <p>{cortesia.nombre} - ${cortesia.precio}</p>
                                    <button onClick={() => setEditingCortesia(cortesia.id)}>Modificar</button>
                                    <button onClick={() => handleEliminarCortesia(cortesia.id)}>Eliminar</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="form-section">
                    <h2>Agregar Cortesía</h2>
                    <input
                        type="text"
                        placeholder="Nombre de la cortesía"
                        value={nuevaCortesia.nombre}
                        onChange={(e) => setNuevaCortesia({ ...nuevaCortesia, nombre: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Precio de la cortesía"
                        value={nuevaCortesia.precio}
                        onChange={(e) => setNuevaCortesia({ ...nuevaCortesia, precio: e.target.value })}
                    />
                    <button className="btn-agregar" onClick={handleAgregarCortesia}>
                        Agregar Cortesía
                    </button>
                </div>

            </div>


        </div>
    );
};

export default CortesYTiposDeCorte;
