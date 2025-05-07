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
    productName: {
        fontWeight: '500',
        color: '#2c3e50'
    },
    price: {
        fontWeight: '600',
        color: '#27ae60'
    },
    description: {
        maxWidth: '300px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
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

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', supplier_id: '', price: '', description: '' });
    const [editProduct, setEditProduct] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu:', err.response ? err.response.data : err.message);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/suppliers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuppliers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Lỗi khi lấy nhà cung cấp:', err);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.supplier_id || !newProduct.price) {
            setError('Vui lòng điền đầy đủ Tên sản phẩm, Nhà cung cấp ID và Giá.');
            return;
        }

        const supplierId = parseInt(newProduct.supplier_id);
        if (!suppliers.some(s => s.supplier_id === supplierId)) {
            setError(`Nhà cung cấp ID ${supplierId} không tồn tại.`);
            return;
        }

        const productData = {
            name: newProduct.name,
            supplier_id: supplierId,
            price: parseFloat(newProduct.price),
            description: newProduct.description || null
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/products`, productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
            setNewProduct({ name: '', supplier_id: '', price: '', description: '' });
            setError('');
        } catch (err) {
            setError('Lỗi khi thêm sản phẩm: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleEditProduct = async () => {
        if (!editProduct.name || !editProduct.supplier_id || !editProduct.price) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc.');
            return;
        }

        const supplierId = parseInt(editProduct.supplier_id);
        if (!suppliers.some(s => s.supplier_id === supplierId)) {
            setError(`Nhà cung cấp ID ${supplierId} không tồn tại.`);
            return;
        }

        const productData = {
            name: editProduct.name,
            supplier_id: supplierId,
            price: parseFloat(editProduct.price),
            description: editProduct.description || null
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/products/${editProduct.product_id}`, productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
            setEditProduct(null);
            setError('');
        } catch (err) {
            setError('Lỗi khi sửa sản phẩm: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (err) {
            setError('Lỗi khi xóa sản phẩm: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const filteredProducts = products.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.section}>
            <div style={styles.header}>
                <h2 style={styles.title}>Danh sách sản phẩm</h2>
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    <span style={styles.searchIcon}>🔍</span>
                </div>
            </div>
    
            {filteredProducts.length === 0 ? (
                <div style={styles.noDataContainer}>
                    <p style={styles.noData}>Không tìm thấy sản phẩm nào</p>
                </div>
            ) : (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Tên Sản Phẩm</th>
                                <th style={styles.th}>Nhà Cung Cấp</th>
                                <th style={styles.th}>Giá</th>
                                <th style={styles.th}>Mô Tả</th>
                                <th style={styles.th}>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.product_id} style={styles.tr}>
                                    <td style={styles.td}>{product.product_id}</td>
                                    <td style={{...styles.td, ...styles.productName}}>{product.product_name}</td>
                                    <td style={styles.td}>{product.supplier_id}</td>
                                    <td style={{...styles.td, ...styles.price}}>
                                        {parseFloat(product.price).toLocaleString('vi-VN')} ₫
                                    </td>
                                    <td style={{...styles.td, ...styles.description}}>
                                        {product.description || '-'}
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.actionButtons}>
                                            <button
                                                onClick={() => setEditProduct(product)}
                                                style={styles.editButton}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.product_id)}
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
                <h3 style={styles.subtitle}>{editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                
                {error && <div style={styles.errorContainer}><p style={styles.error}>{error}</p></div>}
                
                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Tên sản phẩm *</label>
                        <input
                            type="text"
                            value={editProduct ? editProduct.name : newProduct.name}
                            onChange={(e) => editProduct
                                ? setEditProduct({ ...editProduct, name: e.target.value })
                                : setNewProduct({ ...newProduct, name: e.target.value })}
                            style={styles.input}
                        />
                    </div>
    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>ID Nhà cung cấp *</label>
                        <input
                            type="number"
                            value={editProduct ? editProduct.supplier_id : newProduct.supplier_id}
                            onChange={(e) => editProduct
                                ? setEditProduct({ ...editProduct, supplier_id: e.target.value })
                                : setNewProduct({ ...newProduct, supplier_id: e.target.value })}
                            style={styles.input}
                        />
                    </div>
    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Giá (VNĐ) *</label>
                        <input
                            type="number"
                            value={editProduct ? editProduct.price : newProduct.price}
                            onChange={(e) => editProduct
                                ? setEditProduct({ ...editProduct, price: e.target.value })
                                : setNewProduct({ ...newProduct, price: e.target.value })}
                            style={styles.input}
                        />
                    </div>
    
                    <div style={{...styles.formGroup, gridColumn: '1 / span 2'}}>
                        <label style={styles.label}>Mô tả</label>
                        <input
                            type="text"
                            value={editProduct ? editProduct.description : newProduct.description}
                            onChange={(e) => editProduct
                                ? setEditProduct({ ...editProduct, description: e.target.value })
                                : setNewProduct({ ...newProduct, description: e.target.value })}
                            style={styles.input}
                        />
                    </div>
                </div>
    
                <div style={styles.buttonGroup}>
                    <button
                        onClick={editProduct ? handleEditProduct : handleAddProduct}
                        style={styles.button}
                    >
                        {editProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                    </button>
                    {editProduct && (
                        <button
                            onClick={() => setEditProduct(null)}
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

export default ProductList;