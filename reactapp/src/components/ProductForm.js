import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ productToEdit, onSave }) => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: ''
    });

    useEffect(() => {
        if (productToEdit) {
            setProduct({
                name: productToEdit.name,
                description: productToEdit.description,
                price: productToEdit.price
            });
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(product);
    };

    return (
        <div className="product-form-container">
            <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group price-input-container">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn-primary">Save Product</button>
            </form>
        </div>
    );
};

export default ProductForm;