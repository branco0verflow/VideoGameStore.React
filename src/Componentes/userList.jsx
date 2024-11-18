// src/UserList.js
import React, { useEffect, useState } from "react";

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/users")
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    return (
        <div>
            <h2>User List</h2>
            <ul className="user-list">
                {users.map((user) => (
                    <li key={user.id}>
                        <span>{user.email}</span> - {user.country?.name || "No Country"}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
