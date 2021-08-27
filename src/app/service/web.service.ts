import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WebService {

  constructor(private http: HttpClient) { }

  getWideInput() {
    return this.http.get("assets/wide.form.csv", {observe: "response", responseType: "text"})
  }

  getLongInput() {
    return this.http.get("assets/long.form.csv", {observe: "response", responseType: "text"})
  }
}
