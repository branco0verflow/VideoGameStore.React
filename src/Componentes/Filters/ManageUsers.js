import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageUsers.css";
import VolverButton from "../VolverButton/VolverButton";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/users");
      if (!response.ok) throw new Error("Error al obtener los usuarios");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        const response = await fetch(`http://localhost:8080/users/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar el usuario");
        setSuccessMessage("Usuario eliminado exitosamente.");
        fetchUsers();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        setErrorMessage("No se pudo eliminar el usuario.");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
  };

  return (
    <div className="manage-users-container">
      <VolverButton />
      <h2>Administrar Usuarios</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {users.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.premium ? "Premium" : "Regular"}</td>
                <td>
                  <button onClick={() => handleEdit(user.id)}>Editar</button>
                  <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay usuarios disponibles.</p>
      )}
    </div>
  );
};

export default ManageUsers;
