function GetLocation(options) {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      res,
      ({ code, message }) => {
        rej(Object.assign(new Error(message), { name: "PositionError", code }));
      },
      options
    );
  });
}

class Getdata {
  constructor() {
    this.coords = [];
    // this.apikey = "360e6f09f917313221c6764c7d81f441";
    this.apikey = "f6048644fb6169d897aa3cb4c43b4bd5";
    this.getapi = {
      method: "GET",
      headers: {
        "user-key": this.apikey,
        "Content-Type": "application/json"
      }
    };
  }
  async getCity(value) {
    let rdata = await fetch(
      `https://developers.zomato.com/api/v2.1/locations?query=${value}&count=20
    `,
      this.getapi
    );
    if (rdata.status === 200) {
      return rdata.json();
    }
  }
  async getCurrentPosition() {
    try {
      let data = await GetLocation({
        enableHighAccuracy: true,
        maximumAge: 0
      });
      if (data.coords) {
        this.coords = [data.coords.latitude, data.coords.longitude];
      }
    } catch {}
  }
  coordAvailable() {
    return this.coords.length;
  }
  async searchRestaurent(start, lat, lon) {
    let rdata = await fetch(
      `https://developers.zomato.com/api/v2.1/search?start=${
        start ? start : 0
      }&entity_type=zone&count=100&lat=${lat ? lat : this.coords[0]}&lon=${
        lon ? lon : this.coords[1]
      }&category=11&sort=rating`,
      this.getapi
    );
    if (rdata.status === 200) {
      let data = rdata.json();
      return data;
    }
  }

  async getRestaurent(id) {
    let rdata = await fetch(
      `https://developers.zomato.com/api/v2.1/restaurant?res_id=${id}`,
      this.getapi
    );
    if (rdata.status === 200) {
      let data = rdata.json();
      return data;
    }
  }
  async usechoesCatryCuisi(catry, cuisi, lon, lat) {
    let rdata = await fetch(
      `https://developers.zomato.com/api/v2.1/search?lat=${
        lat ? lat : this.coords[0]
      }&lon=${lon ? lon : this.coords[1]}&cuisines=${cuisi}&category${catry}
    `,
      this.getapi
    );
    if (rdata.status === 200) {
      let data = rdata.json();
      return data;
    }
  }
  async getCuisions(lon, lat) {
    let data = await fetch(
      `https://developers.zomato.com/api/v2.1/cuisines?lat=${
        lat ? lat : this.coords[0]
      }&lon=${lon ? lon : this.coords[1]}`,
      this.getapi
    );
    if (data.status === 200) {
      let rdata = data.json();
      return rdata;
    }
  }
  async getCatogires() {
    let rdata = await fetch(
      "https://developers.zomato.com/api/v2.1/categories",
      this.getapi
    );
    if (rdata.status === 200) {
      let data = rdata.json();
      return data;
    }
  }
}
