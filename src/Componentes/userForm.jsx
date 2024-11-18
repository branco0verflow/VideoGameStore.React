// src/UserForm.js
import React, { useState } from "react";

function UserForm({ onUserCreated }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [countryId, setCountryId] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch("http://localhost:5001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                countryId: parseInt(countryId)
            })
        })
        .then((response) => response.json())
        .then((data) => {
            onUserCreated();
            setEmail("");
            setPassword("");
            setCountryId("");
        })
        .catch((error) => console.error("Error creating user:", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create User</h2>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Country ID:</label>
                <input
                    type="number"
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create User</button>
        </form>
    );
}

export default UserForm;
