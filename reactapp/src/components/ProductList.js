import React from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products, onEdit, onDelete }) => {
    return (
        <ul className="product-list">
            {products.map((product) => (
                <li key={product.id} className="product-item">
                    <div className="product-details">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ₹{product.price.toFixed(2)}</p>
                    </div>
                    <div className="product-actions">
                        <Link to="/create">
                            <button className="edit-button" onClick={() => onEdit(product)}>Edit</button>
                        </Link>
                        <button className="delete-button" onClick={() => onDelete(product.id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ProductList;