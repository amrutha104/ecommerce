package com.examly.springapp;

import com.examly.springapp.controller.ProductController;
import com.examly.springapp.model.Product;
import com.examly.springapp.repository.ProductRepository;
import com.examly.springapp.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.util.*;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SpringappApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    public void setup() {
        productRepository.deleteAll();
    }

    @Test
    void backend_testProductControllerFileExists() {
        // Test if ProductController file exists
        String filePath = "src/main/java/com/examly/springapp/controller/ProductController.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void backend_testProductModelFileExists() {
        // Test if Product model file exists
        String filePath = "src/main/java/com/examly/springapp/model/Product.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    void backend_testProductServiceFolderExists() {
        // Test if Product service folder exists
        String directoryPath = "src/main/java/com/examly/springapp/service";
        File directory = new File(directoryPath);
        assertTrue(directory.exists() && directory.isDirectory());
    }

    @Test
    void backend_testProductRepositoryFileExists() {
        // Test if Product repository file exists
        String filePath = "src/main/java/com/examly/springapp/repository/ProductRepository.java";
        File file = new File(filePath);
        assertTrue(file.exists() && file.isFile());
    }

    @Test
    public void backend_shouldCreateNewProduct() throws Exception {
        // Create a new product object
        Product product = new Product();
        product.setName("New Product");
        product.setDescription("New Description");
        product.setPrice(300);
    
        // Perform POST request to create the product
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Product"))
                .andExpect(jsonPath("$.description").value("New Description"))
                .andExpect(jsonPath("$.price").value(300));
    }    

    @Test
    public void backend_shouldUpdateExistingProduct() throws Exception {
        // Test updating an existing product
        Product product = new Product();
        product = productRepository.save(product);

        product.setName("Updated Product");

        mockMvc.perform(put("/api/products/{id}", product.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Product")));
    }

    @Test
    public void backend_shouldDeleteProduct() throws Exception {
        // Test deleting a product
        Product product = new Product();
        product = productRepository.save(product);

        mockMvc.perform(delete("/api/products/{id}", product.getId()))
                .andExpect(status().isNoContent());

        Optional<Product> deletedProduct = productRepository.findById(product.getId());
        assertTrue(deletedProduct.isEmpty());
    }

    @Test
    public void createProduct() throws Exception {
        Product product = new Product();
        Product createdProduct = new Product();

        when(productService.createProduct(product)).thenReturn(createdProduct);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"New Product\",\"description\":\"Description\",\"price\":200}"))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("New Product"));
    }

    @Test
    public void backend_shouldReturnEmptyListWhenNoProductsExist() throws Exception {
        // Test retrieving an empty list of products
        productRepository.deleteAll();

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void backend_shouldReturnNotFoundForNonExistentProduct() throws Exception {
        mockMvc.perform(get("/api/products/{id}", 999))
                .andExpect(status().isNotFound());
    }

    // Test case: Should handle runtime exception during product update
    @Test
    public void backend_shouldHandleRuntimeExceptionDuringUpdate() throws Exception {
        Product product = new Product();
        product.setId(1L);
        product.setName("Product");
        product.setDescription("Description");
        product.setPrice(100);

        when(productService.updateProduct(1L, product)).thenThrow(new RuntimeException("Product not found"));

        mockMvc.perform(put("/api/products/{id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isNotFound());
    }

    // Test case: Should handle delete operation for non-existent product
    @Test
    public void backend_shouldHandleDeleteForNonExistentProduct() throws Exception {
        mockMvc.perform(delete("/api/products/{id}", 999))
                .andExpect(status().isNotFound());
    }

    // Test case: Should return correct product details after creation
    @Test
    public void backend_shouldReturnCorrectProductDetailsAfterCreation() throws Exception {
        Product product = new Product();
        product.setName("New Product");
        product.setDescription("Description");
        product.setPrice(200);

        Product createdProduct = new Product();

        when(productService.createProduct(product)).thenReturn(createdProduct);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Product"))
                .andExpect(jsonPath("$.description").value("Description"))
                .andExpect(jsonPath("$.price").value(200));
    }

    @Test
    public void backend_shouldReturnMethodNotAllowedForUnsupportedEndpoint() throws Exception {
        mockMvc.perform(delete("/api/products"))
                .andExpect(status().isMethodNotAllowed());
    }
}