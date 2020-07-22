import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { WeatherapiService } from './weatherapi.service';
import { IpService, Ip } from './ip.service';
import { IpLocationService } from './ip-location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnChanges {
  title = 'app-meteo';

  @Input()
  city: string;

  getcity: boolean;
  jeton = '4a2f097908a211';
  ip: Ip;
  infos;
  description;
  time;
  hour;
  currentSunrise;
  currentSunset;
  timeZone;

  constructor(
    private weatherService: WeatherapiService,
    private ipService: IpService,
    private ipLocationService: IpLocationService
  ) {}

  ngOnInit() {
    this.getcity = false;

    this.ipService.getAdressIp().subscribe((data) => {
      this.ip = data['ip'];
      this.ipLocationService
        .getIpLocation(this.ip, this.jeton)
        .subscribe((data: any) => {
          this.weatherService.getWeather(data.city).subscribe((data: any) => {
            this.getcity = true;
            this.infos = data;
            console.log(this.infos);
            this.city = data.name;
            this.description = data.weather[0]['description'];

            //recupere l'heure actuelle
            this.time = this.getHour(this.infos);
            this.hour = this.time.substring(16, 22);

            //levé du soleil
            this.getSunriseHour(this.infos);

            //couché du soleil
            this.getSunsetHour(this.infos);
          });
        });
    });
  }

  ngOnChanges($event) {
    this.city = $event.target.value;
    this.weatherService.getWeather(this.city).subscribe((data) => {
      this.getcity = true;
      this.infos = data;
      console.log(this.infos);
      //heure actuelle
      this.time = this.getHour(this.infos);
      this.hour = this.time.substring(16, 22);

      this.description = this.infos.weather[0]['description'];

      //levé du soleil
      this.getSunriseHour(this.infos);

      //couché du soleil
      this.getSunsetHour(this.infos);
    });
  }

  getUrl() {
    if (this.infos.weather[0]['main'] === 'Clear') {
      if (this.time > this.currentSunrise && this.time < this.currentSunset) {
        return 'url(./assets/images/soleil.jpg)';
      } else {
        return 'url(./assets/images/nuit.jpg)';
      }
    }

    if (this.infos.weather[0]['main'] === 'Clouds') {
      if (this.time > this.currentSunrise && this.time < this.currentSunset) {
        return 'url(./assets/images/peu-nuageux.jpg)';
      } else {
        return 'url(./assets/images/nuit.jpg)';
      }
    }
  }

  getHour(infos) {
    this.timeZone = infos.timezone;
    const currentUTCDate = new Date();
    let current = parseInt((currentUTCDate.getTime() / 1000).toFixed(0));
    current += this.timeZone;

    let utc = new Date(current * 1000);
    return utc.toUTCString();
  }

  getSunriseHour(infos) {
    const sunrise = infos.sys.sunrise + this.timeZone;
    let currentUTCSunrise = new Date(sunrise * 1000);
    this.currentSunrise = currentUTCSunrise.toUTCString();
  }

  getSunsetHour(infos) {
    const sunset = infos.sys.sunset + this.timeZone;
    let currentUTCSunset = new Date(sunset * 1000);
    this.currentSunset = currentUTCSunset.toUTCString();
  }
}
