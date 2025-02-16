import React, { useState } from "react";
import "./UsuarioForm.css";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../Componentes/UsuarioContext/UsuarioContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const FormularioRegistro = () => {
    const { setUsuario } = useUsuario();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        nombreUsuario: "",
        apellido: "",
        email: "bar@ber.com",
        telefono: "",
        contra: "",
    });

    const [mensaje, setMensaje] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://albo-barber.onrender.com/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setMensaje("¡Usuario registrado con éxito!");
                const usuario = await response.json();
                setUsuario(usuario); // Almacena el usuario en el contexto
                navigate("/reservar");
                setFormData({
                    nombre: "",
                    nombreUsuario: "",
                    apellido: "",
                    email: "",
                    telefono: "",
                    contra: "",
                });
            } else {
                setMensaje("Error al registrar el usuario.");
            }
        } catch (error) {
            setMensaje("Ocurrió un error. Intenta de nuevo.");
        }
    };

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <div className="boton-izquierda">
                    <button className="volver-button" onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                </div>
                <h2 className="bungee-inline-regular">Registro de Usuario <FontAwesomeIcon icon={faPenToSquare} /></h2>
                {mensaje && <p className="mensaje">{mensaje}</p>}
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nombreUsuario">Nombre de Usuario</label>
                    <input
                        type="text"
                        id="nombreUsuario"
                        name="nombreUsuario"
                        value={formData.nombreUsuario}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="apellido">Apellido</label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contra">Contraseña</label>
                    <input
                        type="password"
                        id="contra"
                        name="contra"
                        value={formData.contra}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Registrar <FontAwesomeIcon icon={faPaperPlane} /></button>
            </form>
        </div>
    );
};

export default FormularioRegistro;
