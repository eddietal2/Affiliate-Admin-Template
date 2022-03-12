import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  BACKEND_URL = environment.url;

  constructor(
    private http: HttpClient
    ) { }

    /**
     * Get all Users
     * @returns 
     */
    getAllUsers() {
      return this.http.get(`${this.BACKEND_URL}/users/get-all-users`)
    }

    /**
     * Delete User
     * @param id - ID of User
     * @returns 
     */
    deleteUser(id: string) {
      return this.http.post(`${this.BACKEND_URL}/users/delete-user`, {id: id})
    }
}
