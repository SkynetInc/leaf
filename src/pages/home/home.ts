import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {PriceServiceProvider} from '../../providers/price-service/price-service';
import {Price} from '../../models/price';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [PriceServiceProvider]
})
export class HomePage {
  url = "http://localhost:8100/api";
  newPrice: Price;
  oldPrice: Price;
  ask: number = 0;
  deltaAsk: number = 0;
  bid: number = 0;
  deltaBid: number = 0;
  spot: number = 0;
  deltaSpot: number = 0;
  myAlerts: number[] = [];
  myAlert: number;
  hasAlerts: boolean = false;


  constructor(
    public navCtrl: NavController,
    public priceService: PriceServiceProvider,
    public alertCtrl: AlertController) {
      this.loadPrice();
      this.updatePrice();
    }

  ngOnInit(): void {}

  loadPrice() {
    this.priceService.load()
    .then(data => {
      this.newPrice = data;
      this.ask = this.newPrice.ask;
      this.bid = this.newPrice.bid;
      this.spot = this.newPrice.spot;
    });
  }

  updatePrice() {
    Observable.interval(35000).subscribe(x => {
      this.priceService.load()
      .then(data => {
        this.newPrice = data;
        if(this.oldPrice.ask && this.oldPrice.ask != this.newPrice.ask) {
          this.deltaAsk = ((this.newPrice.ask - this.oldPrice.ask) / this.oldPrice.ask) * 100;
        }
        if(this.oldPrice.bid && this.oldPrice.bid != this.newPrice.bid) {
          this.deltaBid = ((this.newPrice.bid - this.oldPrice.bid) / this.oldPrice.bid) * 100;
        }
        if(this.oldPrice.spot && this.oldPrice.spot != this.newPrice.spot) {
          this.deltaSpot = ((this.newPrice.spot - this.oldPrice.spot) / this.oldPrice.spot) * 100;
        }

        this.ask = this.newPrice.ask;
        this.bid = this.newPrice.bid;
        this.spot = this.newPrice.spot;
      });

      this.oldPrice = this.newPrice;
      this.checkAlerts();
    });
  }

  checkAlerts() {
    for (let i = 0; i < this.myAlerts.length; i++) {
      if(this.myAlerts[i] <= this.ask) {
        this.showPriceAlert(this.myAlerts[i]);
      }
    }
  }

  setAlert(myAlert) {
    if(myAlert.length > 3){
      this.myAlerts.push(myAlert);
      this.hasAlerts = true;
    }
  }

  focusAlert(event) {}

  deleteAlert(index) {
    this.myAlerts.splice(index, 1);
    if(this.myAlerts.length == 0){
      this.hasAlerts = false;
    }
  }

  getIcon(delta) {
    delta = this.rounder(delta, 2);
    if(delta == 0){return "remove-circle"}
    if(delta < 0){return "arrow-dropdown-circle"}
    if(delta > 0){return "arrow-dropup-circle"}
  }

  getColor(delta) {
    delta = this.rounder(delta, 2);
    if(delta == 0){return "primary"}
    if(delta < 0){return "danger"}
    if(delta > 0){return "secondary"}
  }

  rounder(price, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = price * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  showPriceAlert(price) {
    let alert = this.alertCtrl.create({
      title: 'Price Alert!',
      message: "Ask price is above "+price,
      buttons: ['OK']
    });
    alert.present();
  }

  showMoreOptions(price) {
    let alert = this.alertCtrl.create({
      title: 'Hi Shane',
      message: "Thanks for reviewing this test code!",
      buttons: ['OK']
    });
    alert.present();
  }

}
