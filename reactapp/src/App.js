import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductService from './services/ProductService';
import './App.css';

const App = () => {
    const [products, setProducts] = useState([]);
    const [productToEdit, setProductToEdit] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Function to load products from API
    const loadProducts = async () => {
        try {
            const productsData = await ProductService.getAllProducts();
            setProducts(productsData);
        } catch (error) {
            console.error('Error loading products:', error);
            setErrorMessage('Failed to load products');
        }
    };

    useEffect(() => {
        loadProducts(); // Load products on component mount
    }, []); // Empty dependency array ensures this runs only once

    const handleEdit = (product) => {
        setProductToEdit(product);
    };

    const handleSave = async (productData) => {
        try {
            if (productToEdit) {
                await ProductService.updateProduct(productToEdit.id, productData);
                setSuccessMessage('Product Updated Successfully');
            } else {
                await ProductService.createProduct(productData);
                setSuccessMessage('Product Created Successfully');
            }
            setTimeout(() => {
                setSuccessMessage('');
                loadProducts(); // Reload products after save
                setProductToEdit(null); // Reset productToEdit state
                window.location.href = '/products'; // Navigate to products list
            }, 2000);
        } catch (error) {
            console.error('Error saving product:', error);
            setErrorMessage('Failed to save product');
        }
    };

    const handleDelete = async (productId) => {
        try {
            await ProductService.deleteProduct(productId);
            setSuccessMessage('Product Deleted Successfully');
            const updatedProducts = products.filter(prod => prod.id !== productId);
            setProducts(updatedProducts);
            setTimeout(() => {
                setSuccessMessage('');
                loadProducts(); // Reload products after delete
                setProductToEdit(null); // Reset productToEdit state
            }, 1000);
        } catch (error) {
            console.error('Error deleting product:', error);
            setErrorMessage('Failed to delete product');
        }
    };

    const handleCreateClick = () => {
        setProductToEdit(null);
    };

    return (
        <Router>
            <div className="container">
                <nav className="navbar">
                    <div className="navbar-content">
                        <Link to="/" className="brand-logo">Product Management System</Link>
                        <ul className="nav-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Product List</Link></li>
                            <li><Link to="/create" onClick={handleCreateClick}>Create Product</Link></li>
                        </ul>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />} />
                    <Route path="/create" element={<ProductForm productToEdit={productToEdit} onSave={handleSave} />} />
                    <Route path="/edit/:id" element={<ProductForm productToEdit={productToEdit} onSave={handleSave} />} />
                </Routes>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <footer className="footer">
                    &copy; 2024 Product Management System. All rights reserved.
                </footer>
            </div>
        </Router>
    );
};

const Home = () => (
    <div className="homepage">
        <h1>Welcome to the Product Management System</h1>
        <p>Manage your products efficiently and effectively. Navigate to the products section to get started.</p>
    </div>
);

export default App;