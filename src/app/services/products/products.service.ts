import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  BACKEND_URL = environment.url;

  constructor(
    private http: HttpClient
    ) { }

    /**
     * Get All Products
     * @returns 
     */
    getAllProducts() {
      return this.http.get(`${this.BACKEND_URL}/products/get-all-products`)
    }

    /**
     * Add a Product
     * @returns 
     */
    addProduct(
      title: string,
      apiID: string,
      description: string,
      category: string,
      duration: number,
      price: string,
      sample: string,

    ) {
      return this.http.post(`${this.BACKEND_URL}/products/add-product`, {
        title, apiID, description, category, price, sample, duration
      })
    }

    /**
     * Eidt a Product
     * @returns 
     */
    editProduct(
      id: string,
      apiID: string,
      title: string,
      duration: number,
      sample: string,
      category: string,
      price: string,
      description: string,
      ) {
      return this.http.post(`${this.BACKEND_URL}/products/edit-product`, {
        id, title, apiID, description, category, price, sample, duration
      })
    }

    /**
     * Delete a Product
     * @returns Observable
     */
    deleteProduct(id: string) {
      return this.http.post(`${this.BACKEND_URL}/products/delete-product`, {id: id})
    }

    /**
     * Feature a Product
     * @returns Observable
     */
    featureProduct(id: string) {
      return this.http.post(`${this.BACKEND_URL}/products/feature-product`, {_id: id})
    }

    /**
     * Unfeature a Product
     * @returns Observable
     */
    unfeatureProduct(id: string) {
      return this.http.post(`${this.BACKEND_URL}/products/unfeature-product`, {_id: id})
    }

  }
