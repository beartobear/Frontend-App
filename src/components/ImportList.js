import React, { useEffect, useState } from 'react';
import axios from 'axios';
//Đặt styles bên ngoài component
const styles = {
    section: { 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        padding: '25px',
        marginBottom: '25px'
    },
    title: {
        color: '#2c3e50',
        fontSize: '24px',
        marginBottom: '20px',
        fontWeight: '600',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee'
    },
    subtitle: {
        color: '#2c3e50',
        fontSize: '18px',
        marginBottom: '20px',
        fontWeight: '500'
    },
    searchInput: {
        padding: '12px 15px',
        width: '100%',
        maxWidth: '500px',
        marginBottom: '20px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
        transition: 'all 0.3s'
    },
    tableContainer: {
        overflowX: 'auto',
        borderRadius: '6px',
        border: '1px solid #eee',
        marginBottom: '20px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '600px'
    },
    th: {
        padding: '14px 16px',
        backgroundColor: '#3498db',
        color: '#fff',
        textAlign: 'left',
        fontWeight: '500',
        borderRight: '1px solid rgba(255,255,255,0.1)'
    },
    tr: {
        borderBottom: '1px solid #eee',
        '&:nth-child(even)': {
            backgroundColor: '#f9f9f9'
        }
    },
    td: {
        padding: '12px 16px',
        textAlign: 'left',
        color: '#34495e'
    },
    formGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '20px'
    },
    input: {
        padding: '12px 15px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        width: '100%',
        maxWidth: '300px',
        fontSize: '14px',
        transition: 'all 0.3s'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '15px'
    },
    button: {
        padding: '12px 20px',
        backgroundColor: '#2ecc71',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s'
    },
    editButton: {
        padding: '8px 15px',
        backgroundColor: '#f39c12',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s',
        marginRight: '8px'
    },
    deleteButton: {
        padding: '8px 15px',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s'
    },
    cancelButton: {
        padding: '12px 20px',
        backgroundColor: '#95a5a6',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s'
    },
    errorContainer: {
        backgroundColor: '#fdecea',
        padding: '12px 15px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    error: {
        color: '#d32f2f',
        margin: 0,
        fontSize: '14px'
    },
    noDataContainer: {
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#fafafa',
        borderRadius: '4px'
    },
    noData: {
        color: '#7f8c8d',
        fontStyle: 'italic',
        fontSize: '16px'
    },
    actionButtons: {
        display: 'flex',
        gap: '8px'
    }
};

const API_BASE_URL = 'https://dtdm-backend.onrender.com'

const ImportList = () => {
    const [imports, setImports] = useState([]);
    const [newImport, setNewImport] = useState({ product_id: '', warehouse_id: '', quantity: '' });
    const [editImport, setEditImport] = useState(null);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchImports();
        fetchProducts();
        fetchWarehouses();
    }, []);

    const fetchImports = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/imports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setImports(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/warehouses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWarehouses(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddImport = async () => {
        if (!newImport.product_id || !newImport.warehouse_id || !newImport.quantity) {
            setError('Vui lòng điền đầy đủ ID Sản phẩm, ID Kho và Số lượng.');
            return;
        }

        const productId = parseInt(newImport.product_id);
        const warehouseId = parseInt(newImport.warehouse_id);
        if (!products.some(p => p.product_id === productId)) {
            setError(`Sản phẩm ID ${productId} không tồn tại.`);
            return;
        }
        if (!warehouses.some(w => w.warehouse_id === warehouseId)) {
            setError(`Kho ID ${warehouseId} không tồn tại.`);
            return;
        }

        const importData = {
            product_id: productId,
            warehouse_id: warehouseId,
            quantity: parseInt(newImport.quantity)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/imports`, importData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchImports();
            setNewImport({ product_id: '', warehouse_id: '', quantity: '' });
            setError('');
        } catch (err) {
            setError('Lỗi khi thêm nhập kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleEditImport = async () => {
        if (!editImport.product_id || !editImport.warehouse_id || !editImport.quantity) {
            setError('Vui lòng điền đầy đủ ID Sản phẩm, ID Kho và Số lượng.');
            return;
        }

        const productId = parseInt(editImport.product_id);
        const warehouseId = parseInt(editImport.warehouse_id);
        if (!products.some(p => p.product_id === productId)) {
            setError(`Sản phẩm ID ${productId} không tồn tại.`);
            return;
        }
        if (!warehouses.some(w => w.warehouse_id === warehouseId)) {
            setError(`Kho ID ${warehouseId} không tồn tại.`);
            return;
        }

        const importData = {
            product_id: productId,
            warehouse_id: warehouseId,
            quantity: parseInt(editImport.quantity)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/imports/${editImport.import_id}`, importData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchImports();
            setEditImport(null);
            setError('');
        } catch (err) {
            setError('Lỗi khi sửa nhập kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleDeleteImport = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa nhập kho này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/imports/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchImports();
        } catch (err) {
            setError('Lỗi khi xóa nhập kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const filteredImports = imports.filter(item =>
        String(item.product_id).includes(searchTerm) || String(item.warehouse_id).includes(searchTerm)
    );

    return (
        <div style={styles.section}>
            <div style={styles.card}>
                <h2 style={styles.title}>Danh sách nhập kho</h2>
                
                <input
                    type="text"
                    placeholder="Tìm kiếm theo ID sản phẩm hoặc kho..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                
                {filteredImports.length === 0 ? (
                    <div style={styles.noDataContainer}>
                        <p style={styles.noData}>Không có dữ liệu nhập kho</p>
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Sản Phẩm ID</th>
                                    <th style={styles.th}>Kho ID</th>
                                    <th style={styles.th}>Số Lượng Container</th>
                                    <th style={styles.th}>Ngày Nhập</th>
                                    <th style={styles.th}>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredImports.map(item => (
                                    <tr key={item.import_id} style={styles.tr}>
                                        <td style={styles.td}>{item.product_id}</td>
                                        <td style={styles.td}>{item.warehouse_id}</td>
                                        <td style={styles.td}>{item.quantity}</td>
                                        <td style={styles.td}>{item.import_date}</td>
                                        <td style={styles.td}>
                                            <div style={styles.actionButtons}>
                                                <button
                                                    onClick={() => setEditImport(item)}
                                                    style={styles.editButton}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e67e22'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f39c12'}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteImport(item.import_id)}
                                                    style={styles.deleteButton}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <div style={styles.card}>
                <h3 style={styles.subtitle}>{editImport ? 'Sửa thông tin nhập kho' : 'Thêm nhập kho mới'}</h3>
                
                {error && (
                    <div style={styles.errorContainer}>
                        <p style={styles.error}>{error}</p>
                    </div>
                )}
                
                <div style={styles.formGroup}>
                    <input
                        type="number"
                        placeholder="ID Sản phẩm *"
                        value={editImport ? editImport.product_id : newImport.product_id}
                        onChange={(e) => editImport
                            ? setEditImport({ ...editImport, product_id: e.target.value })
                            : setNewImport({ ...newImport, product_id: e.target.value })}
                        style={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="ID Kho *"
                        value={editImport ? editImport.warehouse_id : newImport.warehouse_id}
                        onChange={(e) => editImport
                            ? setEditImport({ ...editImport, warehouse_id: e.target.value })
                            : setNewImport({ ...newImport, warehouse_id: e.target.value })}
                        style={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="Số lượng container *"
                        value={editImport ? editImport.quantity : newImport.quantity}
                        onChange={(e) => editImport
                            ? setEditImport({ ...editImport, quantity: e.target.value })
                            : setNewImport({ ...newImport, quantity: e.target.value })}
                        style={styles.input}
                    />
                </div>
                
                <div style={styles.buttonGroup}>
                    <button
                        onClick={editImport ? handleEditImport : handleAddImport}
                        style={styles.button}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#27ae60'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#2ecc71'}
                    >
                        {editImport ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    {editImport && (
                        <button
                            onClick={() => setEditImport(null)}
                            style={styles.cancelButton}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
                        >
                            Hủy bỏ
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportList;