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
    this.apikey = "360e6f09f917313221c6764c7d81f441";
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
  async searchRestaurent(lat, lon) {
    let rdata = await fetch(
      `https://developers.zomato.com/api/v2.1/search?entity_type=zone&count=20&lat=${
        lat ? lat : this.coords[0]
      }&lon=${lon ? lon : this.coords[1]}&category=11`,
      this.getapi
    );
    if (rdata.status === 200) {
      let data = rdata.json();
      return data;
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
