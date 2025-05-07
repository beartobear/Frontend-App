import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Đặt styles bên ngoài component
const styles = {
    section: { 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px' 
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        padding: '20px',
        marginBottom: '20px'
    },
    title: { 
        color: '#2c3e50', 
        fontSize: '24px', 
        marginBottom: '20px',
        fontWeight: '600'
    },
    subtitle: {
        color: '#2c3e50',
        fontSize: '18px',
        marginBottom: '20px',
        fontWeight: '500'
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
    tableContainer: {
        overflowX: 'auto',
        borderRadius: '4px',
        border: '1px solid #eee'
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
        '&:hover': {
            backgroundColor: '#f8f9fa'
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
        padding: '10px 12px', 
        borderRadius: '6px', 
        border: '1px solid #ddd',
        width: '220px',
        fontSize: '14px',
        transition: 'all 0.3s',
        '&:focus': {
            borderColor: '#3498db',
            boxShadow: '0 0 0 2px rgba(52,152,219,0.2)',
            outline: 'none'
        }
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px'
    },
    button: { 
        padding: '10px 20px', 
        backgroundColor: '#2ecc71', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: '#27ae60'
        }
    },
    actionButtons: {
        display: 'flex',
        gap: '8px'
    },
    editButton: { 
        padding: '6px 12px', 
        backgroundColor: '#f39c12', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: '#e67e22'
        }
    },
    deleteButton: { 
        padding: '6px 12px', 
        backgroundColor: '#e74c3c', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: '#c0392b'
        }
    },
    cancelButton: { 
        padding: '10px 20px', 
        backgroundColor: '#95a5a6', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: '#7f8c8d'
        }
    },
    errorContainer: {
        backgroundColor: '#fdecea',
        padding: '10px 15px',
        borderRadius: '4px',
        marginBottom: '15px'
    },
    error: { 
        color: '#d32f2f', 
        margin: 0,
        fontSize: '14px'
    },
    searchInput: { 
        padding: '10px 15px', 
        width: '100%', 
        maxWidth: '500px',
        marginBottom: '20px', 
        borderRadius: '6px', 
        border: '1px solid #ddd',
        fontSize: '14px',
        transition: 'all 0.3s',
        '&:focus': {
            borderColor: '#3498db',
            boxShadow: '0 0 0 2px rgba(52,152,219,0.2)',
            outline: 'none'
        }
    }
};
const API_BASE_URL = 'https://dtdm-backend.onrender.com'

const ExportList = () => {
    const [exports, setExports] = useState([]);
    const [newExport, setNewExport] = useState({ product_id: '', warehouse_id: '', quantity: '' });
    const [editExport, setEditExport] = useState(null);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchExports();
        fetchProducts();
        fetchWarehouses();
    }, []);

    const fetchExports = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/exports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExports(Array.isArray(res.data) ? res.data : []);
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

    const handleAddExport = async () => {
        if (!newExport.product_id || !newExport.warehouse_id || !newExport.quantity) {
            setError('Vui lòng điền đầy đủ ID Sản phẩm, ID Kho và Số lượng.');
            return;
        }

        const productId = parseInt(newExport.product_id);
        const warehouseId = parseInt(newExport.warehouse_id);
        if (!products.some(p => p.product_id === productId)) {
            setError(`Sản phẩm ID ${productId} không tồn tại.`);
            return;
        }
        if (!warehouses.some(w => w.warehouse_id === warehouseId)) {
            setError(`Kho ID ${warehouseId} không tồn tại.`);
            return;
        }

        const exportData = {
            product_id: productId,
            warehouse_id: warehouseId,
            quantity: parseInt(newExport.quantity)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/exports`, exportData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExports();
            setNewExport({ product_id: '', warehouse_id: '', quantity: '' });
            setError('');
        } catch (err) {
            setError('Lỗi khi thêm xuất kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleEditExport = async () => {
        if (!editExport.product_id || !editExport.warehouse_id || !editExport.quantity) {
            setError('Vui lòng điền đầy đủ ID Sản phẩm, ID Kho và Số lượng.');
            return;
        }

        const productId = parseInt(editExport.product_id);
        const warehouseId = parseInt(editExport.warehouse_id);
        if (!products.some(p => p.product_id === productId)) {
            setError(`Sản phẩm ID ${productId} không tồn tại.`);
            return;
        }
        if (!warehouses.some(w => w.warehouse_id === warehouseId)) {
            setError(`Kho ID ${warehouseId} không tồn tại.`);
            return;
        }

        const exportData = {
            product_id: productId,
            warehouse_id: warehouseId,
            quantity: parseInt(editExport.quantity)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/exports/${editExport.export_id}`, exportData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExports();
            setEditExport(null);
            setError('');
        } catch (err) {
            setError('Lỗi khi sửa xuất kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleDeleteExport = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa xuất kho này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/exports/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExports();
        } catch (err) {
            setError('Lỗi khi xóa xuất kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const filteredExports = exports.filter(item =>
        String(item.product_id).includes(searchTerm) || String(item.warehouse_id).includes(searchTerm)
    );

    return (
        <div style={styles.section}>
            <h2 style={styles.title}>Danh sách xuất kho</h2>
            
            {/* Search and Table Section */}
            <div style={styles.card}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo ID sản phẩm hoặc kho..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                
                {filteredExports.length === 0 ? (
                    <div style={styles.noDataContainer}>
                        <p style={styles.noData}>Không có dữ liệu xuất kho</p>
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Sản Phẩm ID</th>
                                    <th style={styles.th}>Kho ID</th>
                                    <th style={styles.th}>Số Lượng Container</th>
                                    <th style={styles.th}>Ngày Xuất</th>
                                    <th style={styles.th}>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExports.map(item => (
                                    <tr key={item.export_id} style={styles.tr}>
                                        <td style={styles.td}>{item.product_id}</td>
                                        <td style={styles.td}>{item.warehouse_id}</td>
                                        <td style={styles.td}>{item.quantity}</td>
                                        <td style={styles.td}>{item.export_date}</td>
                                        <td style={styles.td}>
                                            <div style={styles.actionButtons}>
                                                <button
                                                    onClick={() => setEditExport(item)}
                                                    style={styles.editButton}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteExport(item.export_id)}
                                                    style={styles.deleteButton}
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
            
            {/* Add/Edit Form Section */}
            <div style={styles.card}>
                <h3 style={styles.subtitle}>{editExport ? 'Sửa thông tin xuất kho' : 'Thêm xuất kho mới'}</h3>
                
                {error && <div style={styles.errorContainer}><p style={styles.error}>{error}</p></div>}
                
                <div style={styles.formGroup}>
                    <input
                        type="number"
                        placeholder="ID Sản phẩm *"
                        value={editExport ? editExport.product_id : newExport.product_id}
                        onChange={(e) => editExport
                            ? setEditExport({ ...editExport, product_id: e.target.value })
                            : setNewExport({ ...newExport, product_id: e.target.value })}
                        style={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="ID Kho *"
                        value={editExport ? editExport.warehouse_id : newExport.warehouse_id}
                        onChange={(e) => editExport
                            ? setEditExport({ ...editExport, warehouse_id: e.target.value })
                            : setNewExport({ ...newExport, warehouse_id: e.target.value })}
                        style={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="Số lượng container *"
                        value={editExport ? editExport.quantity : newExport.quantity}
                        onChange={(e) => editExport
                            ? setEditExport({ ...editExport, quantity: e.target.value })
                            : setNewExport({ ...newExport, quantity: e.target.value })}
                        style={styles.input}
                    />
                </div>
                
                <div style={styles.buttonGroup}>
                    <button
                        onClick={editExport ? handleEditExport : handleAddExport}
                        style={styles.button}
                    >
                        {editExport ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    {editExport && (
                        <button
                            onClick={() => setEditExport(null)}
                            style={styles.cancelButton}
                        >
                            Hủy bỏ
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
};


export default ExportList;