let allCalls = new Getdata();

/// this is renderdata contructor
function Renderdata() {
  this.resdata;
  this.sippner = document.querySelector(".spinner");
  this.symbal;
  this.hart;
  this.cards = document.querySelector(".main-content-cards");
  this.allCards;
  this.maintitle = document.querySelector(".main-content-heading");
  this.input = document.querySelector("form").addEventListener("submit", e => {
    this.sippner.classList.remove("spinner-hidden");
    this.cards.innerHTML = "";
    this.searchRes(e.target[0].value);
    e.target[0].value = "";
    e.preventDefault();
  });
  allCalls.getCurrentPosition();
}

// this method searching citys it's take data and call the getdata object meathodes
Renderdata.prototype.searchRes = async function(data) {
  let rdata = await allCalls.getCity(data).then(data => data);
  let allres = await allCalls.searchRestaurent(
    rdata.location_suggestions[0].latitude,
    rdata.location_suggestions[0].longitude
  );
  if (allres.restaurants) {
    this.cards.innerHTML = "";
    this.currentLocationRes(true, allres, data);
  }
};

//this method form stored data in locall storage and if person is like restaurent perveresly

Renderdata.prototype.prilikeres = function() {
  this.allCards = document.querySelectorAll(".main-content-card");
  let localdata;
  if (localStorage.getItem("likeres") == null) {
    localdata = [];
  } else {
    localdata = JSON.parse(localStorage.getItem("likeres"));
  }

  for (let j = 0; j < localdata.length; j++) {
    for (let i = 0; i < this.allCards.length; i++) {
      if (localdata[j]) {
        if (this.allCards[i].dataset.resid === localdata[j].resid) {
          this.allCards[i].children[0].children[0].classList.toggle("like");
        }
      }
    }
  }
};

// this meathod for add like restaurent data in localstorage
Renderdata.prototype.addlikeTolocalStorage = function(obj) {
  let localdata;
  if (localStorage.getItem("likeres") == null) {
    localdata = [];
  } else {
    localdata = JSON.parse(localStorage.getItem("likeres"));
  }
  localdata.push(obj);
  localStorage.setItem("likeres", JSON.stringify(localdata));
};

//person like are unlike restaurents meathode
Renderdata.prototype.likeAreUnlike = function() {
  this.symbal = document.querySelectorAll(".love-it").forEach(each => {
    each.addEventListener("click", e => {
      if (e.target.classList[0] === "love-it") {
        // this.setLocaldata();
        e.target.children[0].classList.toggle("like");

        if (e.target.children[0].classList.toString().includes("like")) {
          this.addlikeTolocalStorage(e.target.dataset);
        } else {
          this.removelikeTolocalstorage(e.target.parentElement.dataset);
        }
      } else if (e.target.classList[0] === "symbal") {
        // this.setLocaldata();
        e.target.classList.toggle("like");

        if (e.target.classList.toString().includes("like")) {
          this.addlikeTolocalStorage(e.target.parentElement.dataset);
        } else {
          this.removelikeTolocalstorage(
            e.target.parentElement.parentElement.dataset
          );
        }
      } else if (e.target.classList[0] === "far") {
        // this.setLocaldata();
        e.target.parentElement.classList.toggle("like");

        if (e.target.parentElement.classList.toString().includes("like")) {
          this.addlikeTolocalStorage(
            e.target.parentElement.parentElement.dataset
          );
        } else {
          this.removelikeTolocalstorage(
            e.target.parentElement.parentElement.parentElement.dataset
          );
        }
      }
    });
  });
};

// this meathode for removeimg data from locallstorage
Renderdata.prototype.removelikeTolocalstorage = function(pele) {
  let localdata;
  if (localStorage.getItem("likeres") == null) {
    localdata = [];
  } else {
    localdata = JSON.parse(localStorage.getItem("likeres"));
  }
  let newArr = [];
  for (let i = 0; i < localdata.length; i++) {
    if (localdata[i].resid !== pele.resid) {
      newArr.push(localdata[i]);
    }
  }
  localStorage.setItem("likeres", JSON.stringify(newArr));
};

// this meathode for rendering data in main content i mean all restaurents
Renderdata.prototype.currentLocationRes = async function(cond, data, title) {
  if (!cond) {
    if (allCalls.coordAvailable() < 2) {
      this.resdata = await allCalls.searchRestaurent().then(data => {
        return data;
      });
    }
  } else {
    this.resdata = data;
    this.maintitle.textContent = title;
    this.maintitle.style.textTransform = "capitalize";
  }
  this.sippner.classList.add("spinner-hidden");
  let html = " ";
  if (this.resdata) {
    this.resdata.restaurants.forEach(({ restaurant }, i) => {
      let star = "";
      for (
        let i = 1;
        i <= Math.round(parseInt(restaurant.user_rating.aggregate_rating));
        i++
      ) {
        star += '<i class="fas fa-star"></i>';
      }

      html += `<div class="main-content-card${i++} main-content-card" data-resid="${
        restaurant.R.res_id
      }">
      <div class="love-it" 
      data-rating="${restaurant.user_rating.aggregate_rating}"
      data-resid="${restaurant.R.res_id}" data-name ="${
        restaurant.name
      }" data-address= "${
        restaurant.location.locality_verbose
      }" data-resthumb="${
        restaurant.thumb == "" ? "./img/02-512.png" : restaurant.thumb
      }">
              <div class="symbal"><i class="far fa-heart"></i></div>
            </div>
    <div class="main-content-card-content-wapper">
      <div class="grid-card-content">
        <div class="main-content-card-content-wapper-img">
        <img src="${
          restaurant.thumb == "" ? "./img/02-512.png" : restaurant.thumb
        }" alt="" />
      </div>
      <div class="main-content-card-content-wapper-content">
        <div class="name-of-the-restaurant">
          <h2>${restaurant.name}<span><i class="fas fa-hotel"></i></span></h2>
          <div>Rating: <span>${parseFloat(
            restaurant.user_rating.aggregate_rating
          )}</span><span>${star}</span></div>
        </div>
        <h3>
          <span><i class="fas fa-map-marker-alt"></i></span>Addres:${
            restaurant.location.address
          }
        </h3>
        <h3>
         <span><i class="fas fa-utensils"></i></i></span> Cuisines:${
           restaurant.cuisines
         }
        </h3>
      </div>
    </div>
    </div>
    <div class="main-content-card-wapper"></div>
    </div>`;
    });
    this.cards.innerHTML = "";
    this.cards.innerHTML = html;
  }
  // every time we render any elements it see this any one restaurents like's
  this.prilikeres();
  //any new new likes are dislikes on user choes
  this.likeAreUnlike();
};

let renderHtml = new Renderdata();
renderHtml.currentLocationRes();
