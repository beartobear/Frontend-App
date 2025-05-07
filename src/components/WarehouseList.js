import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Đặt styles bên ngoài component
const styles = {
    section: { 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        flexWrap: 'wrap',
        gap: '20px'
    },
    title: { 
        color: '#2c3e50',
        fontSize: '24px',
        fontWeight: '600',
        margin: 0
    },
    searchContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    searchInput: {
        padding: '12px 15px 12px 35px',
        width: '300px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        transition: 'all 0.3s',
        ':focus': {
            borderColor: '#3498db',
            boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)',
            outline: 'none'
        }
    },
    searchIcon: {
        position: 'absolute',
        left: '10px',
        color: '#7f8c8d'
    },
    tableContainer: {
        overflowX: 'auto',
        borderRadius: '8px',
        border: '1px solid #eee',
        marginBottom: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '800px'
    },
    th: {
        padding: '15px',
        backgroundColor: '#3498db',
        color: '#fff',
        textAlign: 'left',
        fontWeight: '500',
        borderRight: '1px solid rgba(255,255,255,0.1)'
    },
    tr: {
        borderBottom: '1px solid #eee',
        ':hover': {
            backgroundColor: '#f8f9fa'
        }
    },
    td: {
        padding: '15px',
        textAlign: 'left',
        color: '#34495e'
    },
    warehouseName: {
        fontWeight: '500',
        color: '#2c3e50'
    },
    capacity: {
        fontWeight: '600',
        color: '#2980b9'
    },
    na: {
        color: '#95a5a6',
        fontStyle: 'italic'
    },
    actionButtons: {
        display: 'flex',
        gap: '8px'
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
    },
    subtitle: {
        color: '#2c3e50',
        fontSize: '20px',
        marginBottom: '20px',
        fontWeight: '500'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        color: '#34495e',
        fontSize: '14px',
        fontWeight: '500'
    },
    required: {
        color: '#e74c3c'
    },
    input: {
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        transition: 'all 0.3s',
        ':focus': {
            borderColor: '#3498db',
            boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)',
            outline: 'none'
        }
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px'
    },
    button: {
        padding: '12px 20px',
        backgroundColor: '#2ecc71',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s',
        ':hover': {
            backgroundColor: '#27ae60'
        }
    },
    editButton: {
        padding: '8px 15px',
        backgroundColor: '#f39c12',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s',
        ':hover': {
            backgroundColor: '#e67e22'
        }
    },
    deleteButton: {
        padding: '8px 15px',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s',
        ':hover': {
            backgroundColor: '#c0392b'
        }
    },
    cancelButton: {
        padding: '12px 20px',
        backgroundColor: '#95a5a6',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s',
        ':hover': {
            backgroundColor: '#7f8c8d'
        }
    },
    errorContainer: {
        backgroundColor: '#fdecea',
        padding: '12px 15px',
        borderRadius: '6px',
        marginBottom: '20px'
    },
    error: {
        color: '#e74c3c',
        margin: 0,
        fontSize: '14px'
    },
    noDataContainer: {
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        marginBottom: '30px'
    },
    noData: {
        color: '#7f8c8d',
        fontStyle: 'italic',
        fontSize: '16px'
    }
};

const API_BASE_URL = 'https://dtdm-backend.onrender.com'

const WarehouseList = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '', capacity: '' });
    const [editWarehouse, setEditWarehouse] = useState(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchWarehouses();
    }, []);

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

    const handleAddWarehouse = async () => {
        if (!newWarehouse.name || !newWarehouse.capacity) {
            setError('Vui lòng điền Tên kho và Dung lượng.');
            return;
        }

        const warehouseData = {
            name: newWarehouse.name,
            location: newWarehouse.location || null,
            capacity: parseInt(newWarehouse.capacity)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/warehouses`, warehouseData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWarehouses();
            setNewWarehouse({ name: '', location: '', capacity: '' });
            setError('');
        } catch (err) {
            setError('Lỗi khi thêm kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleEditWarehouse = async () => {
        if (!editWarehouse.name || !editWarehouse.capacity) {
            setError('Vui lòng điền Tên kho và Dung lượng.');
            return;
        }

        const warehouseData = {
            name: editWarehouse.name,
            location: editWarehouse.location || null,
            capacity: parseInt(editWarehouse.capacity)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/warehouses/${editWarehouse.warehouse_id}`, warehouseData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWarehouses();
            setEditWarehouse(null);
            setError('');
        } catch (err) {
            setError('Lỗi khi sửa kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleDeleteWarehouse = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa kho này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/warehouses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWarehouses();
        } catch (err) {
            setError('Lỗi khi xóa kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const filteredWarehouses = warehouses.filter(warehouse =>
        warehouse.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.section}>
            <div style={styles.header}>
                <h2 style={styles.title}>Danh sách kho hàng</h2>
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm kho..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    <span style={styles.searchIcon}>🔍</span>
                </div>
            </div>
    
            {filteredWarehouses.length === 0 ? (
                <div style={styles.noDataContainer}>
                    <p style={styles.noData}>Không tìm thấy kho hàng nào</p>
                </div>
            ) : (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Tên Kho</th>
                                <th style={styles.th}>Vị Trí</th>
                                <th style={styles.th}>Sức Chứa (Container)</th>
                                <th style={styles.th}>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWarehouses.map(warehouse => (
                                <tr key={warehouse.warehouse_id} style={styles.tr}>
                                    <td style={styles.td}>{warehouse.warehouse_id}</td>
                                    <td style={{...styles.td, ...styles.warehouseName}}>{warehouse.warehouse_name}</td>
                                    <td style={styles.td}>{warehouse.location || <span style={styles.na}>N/A</span>}</td>
                                    <td style={{...styles.td, ...styles.capacity}}>
                                        {warehouse.capacity.toLocaleString()}
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.actionButtons}>
                                            <button
                                                onClick={() => setEditWarehouse(warehouse)}
                                                style={styles.editButton}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteWarehouse(warehouse.warehouse_id)}
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
    
            <div style={styles.formCard}>
                <h3 style={styles.subtitle}>{editWarehouse ? 'Sửa thông tin kho' : 'Thêm kho mới'}</h3>
                
                {error && <div style={styles.errorContainer}><p style={styles.error}>{error}</p></div>}
                
                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Tên kho <span style={styles.required}>*</span></label>
                        <input
                            type="text"
                            value={editWarehouse ? editWarehouse.name : newWarehouse.name}
                            onChange={(e) => editWarehouse
                                ? setEditWarehouse({ ...editWarehouse, name: e.target.value })
                                : setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                            style={styles.input}
                            required
                        />
                    </div>
    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Vị trí</label>
                        <input
                            type="text"
                            value={editWarehouse ? editWarehouse.location : newWarehouse.location}
                            onChange={(e) => editWarehouse
                                ? setEditWarehouse({ ...editWarehouse, location: e.target.value })
                                : setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                            style={styles.input}
                        />
                    </div>
    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Sức chứa (Container) <span style={styles.required}>*</span></label>
                        <input
                            type="number"
                            placeholder="Tối đa số lượng container"
                            value={editWarehouse ? editWarehouse.capacity : newWarehouse.capacity}
                            onChange={(e) => editWarehouse
                                ? setEditWarehouse({ ...editWarehouse, capacity: e.target.value })
                                : setNewWarehouse({ ...newWarehouse, capacity: e.target.value })}
                            style={styles.input}
                            min="1"
                            required
                        />
                    </div>
                </div>
    
                <div style={styles.buttonGroup}>
                    <button
                        onClick={editWarehouse ? handleEditWarehouse : handleAddWarehouse}
                        style={styles.button}
                    >
                        {editWarehouse ? 'Cập nhật kho' : 'Thêm kho mới'}
                    </button>
                    {editWarehouse && (
                        <button
                            onClick={() => setEditWarehouse(null)}
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

export default WarehouseList;