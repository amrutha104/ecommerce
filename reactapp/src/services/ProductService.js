import baseURL from '../api';

class ProductService {
  async getAllProducts() {
    const response = await fetch(`${baseURL}/api/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }

  async getProductById(id) {
    const response = await fetch(`${baseURL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product with id ${id}`);
    }
    return response.json();
  }

  async createProduct(product) {
    const response = await fetch(`${baseURL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  }

  async updateProduct(id, product) {
    const response = await fetch(`${baseURL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Failed to update product with id ${id}`);
    }
    return response.json();
  }

  async deleteProduct(id) {
    const response = await fetch(`${baseURL}/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete product with id ${id}`);
    }
  }
}

export default new ProductService();