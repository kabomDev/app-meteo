import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IpLocationService {
  constructor(private http: HttpClient) {}

  getIpLocation(ip, jeton) {
    return this.http.get(`https://ipinfo.io/${ip}?token=${jeton}`);
  }
}
