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
    supplierName: {
        fontWeight: '500',
        color: '#2c3e50'
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

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [newSupplier, setNewSupplier] = useState({ name: '', contact_info: '', address: '' });
    const [editSupplier, setEditSupplier] = useState(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/suppliers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuppliers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSupplier = async () => {
        if (!newSupplier.name) {
            setError('Vui lòng điền Tên nhà cung cấp.');
            return;
        }

        const supplierData = {
            name: newSupplier.name,
            contact_info: newSupplier.contact_info || null,
            address: newSupplier.address || null
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/suppliers`, supplierData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSuppliers();
            setNewSupplier({ name: '', contact_info: '', address: '' });
            setError('');
        } catch (err) {
            setError('Lỗi khi thêm nhà cung cấp: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleEditSupplier = async () => {
        if (!editSupplier.name) {
            setError('Vui lòng điền Tên nhà cung cấp.');
            return;
        }

        const supplierData = {
            name: editSupplier.name,
            contact_info: editSupplier.contact_info || null,
            address: editSupplier.address || null
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/suppliers/${editSupplier.supplier_id}`, supplierData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSuppliers();
            setEditSupplier(null);
            setError('');
        } catch (err) {
            setError('Lỗi khi sửa nhà cung cấp: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleDeleteSupplier = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/suppliers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSuppliers();
        } catch (err) {
            setError('Lỗi khi xóa nhà cung cấp: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.section}>
            <div style={styles.header}>
                <h2 style={styles.title}>Danh sách nhà cung cấp</h2>
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhà cung cấp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    <span style={styles.searchIcon}>🔍</span>
                </div>
            </div>
    
            {filteredSuppliers.length === 0 ? (
                <div style={styles.noDataContainer}>
                    <p style={styles.noData}>Không tìm thấy nhà cung cấp nào</p>
                </div>
            ) : (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Tên Nhà Cung Cấp</th>
                                <th style={styles.th}>Thông Tin Liên Hệ</th>
                                <th style={styles.th}>Địa Chỉ</th>
                                <th style={styles.th}>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSuppliers.map(supplier => (
                                <tr key={supplier.supplier_id} style={styles.tr}>
                                    <td style={styles.td}>{supplier.supplier_id}</td>
                                    <td style={{...styles.td, ...styles.supplierName}}>{supplier.supplier_name}</td>
                                    <td style={styles.td}>{supplier.contact_info || <span style={styles.na}>N/A</span>}</td>
                                    <td style={styles.td}>{supplier.address || <span style={styles.na}>N/A</span>}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actionButtons}>
                                            <button
                                                onClick={() => setEditSupplier(supplier)}
                                                style={styles.editButton}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSupplier(supplier.supplier_id)}
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
                <h3 style={styles.subtitle}>{editSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h3>
                
                {error && <div style={styles.errorContainer}><p style={styles.error}>{error}</p></div>}
                
                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Tên nhà cung cấp <span style={styles.required}>*</span></label>
                        <input
                            type="text"
                            value={editSupplier ? editSupplier.name : newSupplier.name}
                            onChange={(e) => editSupplier
                                ? setEditSupplier({ ...editSupplier, name: e.target.value })
                                : setNewSupplier({ ...newSupplier, name: e.target.value })}
                            style={styles.input}
                            required
                        />
                    </div>
    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Thông tin liên hệ</label>
                        <input
                            type="text"
                            value={editSupplier ? editSupplier.contact_info : newSupplier.contact_info}
                            onChange={(e) => editSupplier
                                ? setEditSupplier({ ...editSupplier, contact_info: e.target.value })
                                : setNewSupplier({ ...newSupplier, contact_info: e.target.value })}
                            style={styles.input}
                        />
                    </div>
    
                    <div style={{...styles.formGroup, gridColumn: '1 / span 2'}}>
                        <label style={styles.label}>Địa chỉ</label>
                        <input
                            type="text"
                            value={editSupplier ? editSupplier.address : newSupplier.address}
                            onChange={(e) => editSupplier
                                ? setEditSupplier({ ...editSupplier, address: e.target.value })
                                : setNewSupplier({ ...newSupplier, address: e.target.value })}
                            style={styles.input}
                        />
                    </div>
                </div>
    
                <div style={styles.buttonGroup}>
                    <button
                        onClick={editSupplier ? handleEditSupplier : handleAddSupplier}
                        style={styles.button}
                    >
                        {editSupplier ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp'}
                    </button>
                    {editSupplier && (
                        <button
                            onClick={() => setEditSupplier(null)}
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
export default SupplierList;