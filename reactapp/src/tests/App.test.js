import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import ProductService from '../services/ProductService';
import App from '../App';

jest.mock('../api');
jest.mock('../services/ProductService');

const mockProducts = [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 100 },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 150 },
];

const mockProduct = { id: 1, name: 'Test Product', description: 'Test Description', price: 200 };

test('frontend_should render_ProductList component with products', () => {
    render(
        <Router>
            <ProductList products={mockProducts} />
        </Router>
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(mockProducts.length);

    mockProducts.forEach((product, index) => {
        const listItem = listItems[index];
        expect(listItem).toHaveTextContent(product.name);
        expect(listItem).toHaveTextContent(product.description);
        expect(listItem).toHaveTextContent(product.price.toString());
    });
});

test('frontend_should invoke_onEdit function when Edit button is clicked in ProductList', () => {
    const handleEdit = jest.fn();
    render(
        <Router>
            <ProductList products={mockProducts} onEdit={handleEdit} />
        </Router>
    );

    fireEvent.click(screen.getAllByText('Edit')[0]); // Click the Edit button for the first product

    expect(handleEdit).toHaveBeenCalledWith(mockProducts[0]);
});

test('frontend_should invoke_onDelete function when Delete button is clicked in ProductList', () => {
    const handleDelete = jest.fn();
    render(
        <Router>
            <ProductList products={mockProducts} onDelete={handleDelete} />
        </Router>
    );

    fireEvent.click(screen.getAllByText('Delete')[1]); // Click the Delete button for the second product

    expect(handleDelete).toHaveBeenCalledWith(mockProducts[1].id);
});

test('frontend_should render_ProductForm for create', () => {
    render(<ProductForm onSave={jest.fn()} />);

    expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
});

test('frontend_should render_ProductForm for edit', () => {
    render(<ProductForm productToEdit={mockProduct} onSave={jest.fn()} />);

    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('200')).toBeInTheDocument();
});

test('frontend_should_render_ProductForm_for_editing_existing_product', () => {
  render(<ProductForm productToEdit={mockProduct} onSave={jest.fn()} />);

  expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  expect(screen.getByDisplayValue('200')).toBeInTheDocument();
});

test('frontend_should_render_homepage_with_welcome_message', () => {
  render(<App />);

  expect(screen.getByText('Product Management System')).toBeInTheDocument();
});