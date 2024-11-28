import React, { useState } from "react";
import "./UserFilter.css"; // Importar los estilos

const UserFilter = () => {
    const [isPremium, setIsPremium] = useState(true); // true = Premium, false = Regular
    const [usuarios, setUsuarios] = useState([]);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`http://localhost:8080/users/tipo/${isPremium}`);
            if (!response.ok) throw new Error("Error al obtener usuarios");
            const data = await response.json();

            if (Array.isArray(data)) {
                setUsuarios(data); // Guardamos los datos completos del usuario
            } else {
                console.error("Respuesta de la API no es un array:", data);
                setUsuarios([]);
            }
        } catch (error) {
            console.error("Error al buscar usuarios:", error);
            setUsuarios([]);
        }
    };

    return (
        <div className="user-filter-container">
            <h3>Filtrar usuarios por tipo</h3>
            <select value={isPremium} onChange={(e) => setIsPremium(e.target.value === "true")}>
                <option value="true">Premium</option>
                <option value="false">Regular</option>
            </select>
            <button onClick={fetchUsuarios}>Buscar</button>
            {usuarios.length > 0 ? (
                <ul>
                    {usuarios.map((usuario) => (
                        <li key={usuario.id}>
                            <h4>{usuario.nombre}</h4>
                            <p><strong>Email:</strong> {usuario.email}</p>
                            <p><strong>Tipo:</strong> {usuario.premium ? "Premium" : "Regular"}</p>
                            <p><strong>Fecha de Registro:</strong> {usuario.fechaRegistro}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-results">No se encontraron usuarios.</p>
            )}
        </div>
    );
};

export default UserFilter;
