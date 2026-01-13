import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/authApi';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('TST');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        signup(email, password, role);
        alert("Cont creat! Acum te poți loga.");
        navigate('/login');
    };

    return (
        <div className="auth-card-container">
            <form onSubmit={handleSignup} className="auth-card">
                {/* Titlul a fost scos pentru consistență */}
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Parolă:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Rol:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="TST">Student Tester (TST)</option>
                        <option value="MP">Membru Proiect (MP)</option>
                    </select>
                </div>
                <button type="submit" className="btn-primary">Înregistrare</button>
            </form>
        </div>
    );
}
export default SignupPage;