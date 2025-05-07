import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://dtdm-backend.onrender.com';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const res = await axios.post(`${API_BASE_URL}/api/login`, { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard/products');
        } catch (err) {
            setError(err.response?.data?.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginCard}>
                <div style={styles.logoContainer}>
                    <h1 style={styles.logo}>NQN</h1>
                    <p style={styles.slogan}>Hệ thống quản lý kho hàng</p>
                </div>
                
                <h2 style={styles.title}>Đăng nhập hệ thống</h2>
                
                {error && (
                    <div style={styles.errorContainer}>
                        <p style={styles.error}>{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Tên đăng nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
                
                <div style={styles.footer}>
                    <p style={styles.footerText}>© 2023 DTDM. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        padding: '20px'
    },
    loginCard: {
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        padding: '40px',
        textAlign: 'center'
    },
    logoContainer: {
        marginBottom: '30px'
    },
    logo: {
        color: '#3498db',
        fontSize: '32px',
        fontWeight: '700',
        margin: '0 0 5px 0'
    },
    slogan: {
        color: '#7f8c8d',
        fontSize: '14px',
        margin: '0'
    },
    title: {
        color: '#2c3e50',
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '25px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        textAlign: 'left'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#34495e',
        fontSize: '14px',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        transition: 'all 0.3s',
        boxSizing: 'border-box',
        ':focus': {
            borderColor: '#3498db',
            boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
            outline: 'none'
        }
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginTop: '10px',
        ':hover': {
            backgroundColor: '#2980b9'
        },
        ':disabled': {
            backgroundColor: '#bdc3c7',
            cursor: 'not-allowed'
        }
    },
    errorContainer: {
        backgroundColor: '#fdecea',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    error: {
        color: '#e74c3c',
        margin: '0',
        fontSize: '14px'
    },
    footer: {
        marginTop: '30px',
        borderTop: '1px solid #eee',
        paddingTop: '20px'
    },
    footerText: {
        color: '#95a5a6',
        fontSize: '12px',
        margin: '0'
    }
};

export default Login;
