import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  BACKEND_URL = environment.url;

  constructor(
    private http: HttpClient) { }

    /**
     * Get Landing Page Info HTTP Request
     */
    getLandingPageInfo() {
      return this.http.get(`${this.BACKEND_URL}/landing-page/get-landing-page-info`)
    }

    /**
     * Edit Welcome Message HTTP Request
     */
     editWelcomeMessageHTTP(id: string, input: string) {
      return this.http.post(`${this.BACKEND_URL}/landing-page/edit-welcome-message`, {id: id, newWelcomeMessage: input})
    }

    /**
     * Edit Sample HTTP Request
     */
     editSampleHTTP(id: string, input: string) {
      return this.http.post(`${this.BACKEND_URL}/landing-page/edit-sample`, {id: id, newSample: input})
    }

    /**
     * Edit Why Hypnosis HTTP Request
     */
     editDescriptionHTTP(id: string, input: string) {
      return this.http.post(`${this.BACKEND_URL}/landing-page/edit-description`, {id: id, newDescription: input})
    }

    /**
     * Edit Why Hypnosis HTTP Request
     */
     editMembershipHTTP(id: string, input: string) {
      return this.http.post(`${this.BACKEND_URL}/landing-page/edit-membership-message`, {id: id, newMembershipMessage: input})
    }
}
