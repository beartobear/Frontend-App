import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import SupplierList from './components/SupplierList';
import ImportList from './components/ImportList';
import ExportList from './components/ExportList';
import WarehouseList from './components/WarehouseList';
import Login from './components/Login';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route 
                    path="/dashboard/*" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    );
};

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
};

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={styles.appContainer}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>Dashboard</h2>
                <ul style={styles.sidebarList}>
                    <li style={styles.sidebarItem}>
                        <Link to="/dashboard/products" style={styles.sidebarLink}>Sản phẩm</Link>
                    </li>
                    <li style={styles.sidebarItem}>
                        <Link to="/dashboard/suppliers" style={styles.sidebarLink}>Nhà cung cấp</Link>
                    </li>
                    <li style={styles.sidebarItem}>
                        <Link to="/dashboard/imports" style={styles.sidebarLink}>Nhập kho</Link>
                    </li>
                    <li style={styles.sidebarItem}>
                        <Link to="/dashboard/exports" style={styles.sidebarLink}>Xuất kho</Link>
                    </li>
                    <li style={styles.sidebarItem}>
                        <Link to="/dashboard/warehouses" style={styles.sidebarLink}>Kho</Link>
                    </li>
                    <li style={styles.sidebarItem}>
                        <button onClick={handleLogout} style={styles.logoutButton}>Đăng xuất</button>
                    </li>
                </ul>
            </div>

            {/* Nội dung chính */}
            <div style={styles.content}>
                <Routes>
                    <Route path="products" element={<ProductList />} />
                    <Route path="suppliers" element={<SupplierList />} />
                    <Route path="imports" element={<ImportList />} />
                    <Route path="exports" element={<ExportList />} />
                    <Route path="warehouses" element={<WarehouseList />} />
                    <Route path="/" element={<Navigate to="/dashboard/products" />} />
                </Routes>
            </div>
        </div>
    );
};

const styles = {
    appContainer: { 
        display: 'flex', 
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif"
    },
    sidebar: { 
        width: '250px', 
        backgroundColor: '#2c3e50', 
        color: '#fff', 
        padding: '25px 20px', 
        position: 'fixed', 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
    },
    sidebarTitle: { 
        fontSize: '20px', 
        marginBottom: '30px', 
        textAlign: 'center',
        fontWeight: '600',
        color: '#ecf0f1'
    },
    sidebarList: { 
        listStyle: 'none', 
        padding: 0,
        flexGrow: 1 
    },
    sidebarItem: { 
        marginBottom: '15px' 
    },
    sidebarLink: { 
        color: '#ecf0f1', 
        textDecoration: 'none', 
        fontSize: '16px', 
        display: 'block', 
        padding: '12px 15px', 
        borderRadius: '6px',
    },
    content: { 
        marginLeft: '250px', 
        padding: '30px', 
        flexGrow: 1, 
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
    },
    logoutButton: { 
        width: '100%', 
        padding: '12px', 
        backgroundColor: '#e74c3c', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontSize: '16px',
        fontWeight: '500',
        marginTop: 'auto'
    }
};

export default App;