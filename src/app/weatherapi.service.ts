import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WeatherapiService {
  constructor(private http: HttpClient) {}

  getWeather(city: string) {
    return this.http.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=fr&units=metric&appid=34da6d20b34d91974ef1aeb51d12e3e6`
    );
  }
}
