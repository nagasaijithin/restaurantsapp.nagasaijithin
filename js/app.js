let allCalls = new Getdata();

/// this is renderdata contructor
function Renderdata() {
  this.resdata;
  this.prebtn;
  this.btnwapper;
  this.nexbtn;
  this.sippner = document.querySelector(".spinnerWapper");
  this.symbal;
  this.sliderindex;
  this.btnconter = 0;
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
  this.listoflikeres = document.querySelector(".wapper-love-it-list");
  this.likeresshower = document.querySelector(".love-it-shower-symbal");
  let closer = document.querySelector(".wapper-love-it-list .closer");
  closer.addEventListener("click", () => {
    this.listoflikeres.classList.toggle("wapper-love-it-list-hidden");
  });
  this.likeresshower.addEventListener("click", () => {
    this.listoflikeres.classList.toggle("wapper-love-it-list-hidden");
    this.renderAlllikedres();
  });

  allCalls.getCurrentPosition();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// rendaring all liked restaureants
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

Renderdata.prototype.renderAlllikedres = function() {
  let localdata;
  if (localStorage.getItem("likeres") == null) {
    localdata = [];
  } else {
    localdata = JSON.parse(localStorage.getItem("likeres"));
  }
  let html = "";
  localdata.forEach((each, i) => {
    let star = "";
    for (let i = 1; i <= Math.round(parseInt(each.rating)); i++) {
      star += '<i class="fas fa-star"></i>';
    }

    html += `<div class="list${i} list" data-resid="${each.resid}">
    <div class="closer"><i class="fas fa-times"></i></div>
          <div class="flex-wapper">
            <div class="img">
            <img src="${
              each.resthumb ? each.resthumb : "./img/02-512.png"
            }" alt="">
          </div>
          <div class="content">
  <h3>${each.name}<span><i class="fas fa-hotel"></i></span></h3>
            <h4>Rating: <span>${each.rating}</span><span>${star}</span></h4>
            <h4><span><i class="fas fa-map-marker-alt"></i></span>Address: ${
              each.address
            }</h4>
          </div>
          </div>
        </div>`;
  });
  if (!html) {
    html = `
    <div class="center-nonliked">You didn't selected your favorite restaurants</div>
        `;
  }
  let listContiner = document.querySelector(".love-it-shower-lists");
  listContiner.innerHTML = html;

  let alllikesres = document.querySelectorAll(".list");
  let continerTOcontion = document.querySelector(".remove-like-pop");
  let condtionButtons = document.querySelectorAll(
    ".buttons-continer-of-unlike-res span"
  );

  alllikesres.forEach(element => {
    element.children[0].addEventListener("click", () => {
      continerTOcontion.classList.remove("remove-like-pop-hidden");
      condtionButtons[0].addEventListener("click", () => {
        this.removelikeTolocalstorage(element.dataset);
        element.classList.add("none");
        this.allCards.forEach(ele => {
          if (ele.dataset.resid === element.dataset.resid) {
            ele.children[0].children[0].classList.toggle("like");
          }
        });
        continerTOcontion.classList.add("remove-like-pop-hidden");
      });
      condtionButtons[1].addEventListener("click", () => {
        continerTOcontion.classList.add("remove-like-pop-hidden");
      });
    });
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// rendaring all liked restaureants  end of this method
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// searching restaurents
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// this method searching citys it's take data and call the getdata object meathodes
Renderdata.prototype.searchRes = async function(data) {
  this.btnconter = 0;
  let rdata = await allCalls.getCity(data).then(data => data);
  let allres = await allCalls.searchRestaurent(
    false,
    rdata.location_suggestions[0].latitude,
    rdata.location_suggestions[0].longitude
  );
  if (allres.restaurants) {
    this.cards.innerHTML = "";
    this.currentLocationRes(true, allres, data);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// ending of searching restaurents meathod
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// priliked likes reanding in cards
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// end of the priliked likes reanding in cards
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// localstorage all content ,rending and delecting in cards
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// end of this meathod localstorage all content ,rending and delecting in cards
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// button section in cuurent location
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// button section dipendding current location
Renderdata.prototype.btnsection1 = function(title) {
  if (document.querySelector(".pervios-btn")) {
    let gopervbtn = document.querySelector(".pervios-btn");
    gopervbtn.addEventListener("click", e => {
      this.btnconter -= 20;
      this.cards.innerHTML = "";
      this.sippner.classList.remove("spinner-hidden");
      this.getbtnData(title);
      e.preventDefault();
    });
  }
  if (document.querySelector(".next-btn")) {
    let gonextbtn = document.querySelector(".next-btn");

    gonextbtn.addEventListener("click", e => {
      this.btnconter += 20;
      this.cards.innerHTML = "";
      this.sippner.classList.remove("spinner-hidden");
      this.getbtnData(title);
      e.preventDefault();
    });
  }
};

Renderdata.prototype.getbtnData = async function(title) {
  window.scrollTo(-1, -1);
  if (this.btnconter <= 80) {
    let data;
    if (allCalls.coordAvailable() <= 2) {
      data = await allCalls
        .searchRestaurent(this.btnconter)
        .then(rdata => rdata);

      this.currentLocationRes(true, data, "Near By You");
    }
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// end of this button section in cuurent location
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// button section in user location
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// this meathod is using on user giving location
Renderdata.prototype.btnsection2 = function(title) {
  let gonextbtn = document.querySelector(".next-btn");
  if (this.btnwapper.childElementCount === 2) {
    let gopervbtn = document.querySelector(".pervios-btn");
    gopervbtn.addEventListener("click", e => {
      this.btnconter -= 20;
      this.cards.innerHTML = "";
      this.sippner.classList.remove("spinner-hidden");
      this.getbtnData2(title);

      e.preventDefault();
    });
  }

  gonextbtn.addEventListener("click", e => {
    this.btnconter += 20;
    this.cards.innerHTML = "";
    this.sippner.classList.remove("spinner-hidden");
    this.getbtnData2(title);
    e.preventDefault();
  });
};
Renderdata.prototype.getbtnData2 = async function(title) {
  window.scrollTo(-1, -1);
  let rdata = await allCalls.getCity(title).then(data => data);
  let allres = await allCalls.searchRestaurent(
    this.btnconter,
    rdata.location_suggestions[0].latitude,
    rdata.location_suggestions[0].longitude
  );
  this.currentLocationRes(true, allres, title);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// end of this button section in user location
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// button conditionser meathod
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
Renderdata.prototype.buttonConditioner = function(title) {
  this.btnwapper = document.querySelector(".buttonsWapper");
  this.prebtn = `<div class="pervios-btn btn">
                  <a href="#">Previous Page</a>
              </div>`;
  this.nexbtn = `
<div class="next-btn btn">
    <a href="#">Next Page</a>
</div>`;

  if (this.btnconter < 20) {
    this.btnwapper.innerHTML = this.nexbtn;
  } else {
    this.btnwapper.innerHTML = this.prebtn;
    this.btnwapper.innerHTML += this.nexbtn;
  }

  if (this.btnconter == 80) {
    this.btnwapper.innerHTML = "";
    this.btnwapper.innerHTML = this.prebtn;
  } else if (this.btnconter == 0) {
    this.btnwapper.innerHTML = "";
    this.btnwapper.innerHTML = this.nexbtn;
  }
  this.maintitle.textContent === "Near By You"
    ? this.btnsection1(title)
    : this.btnsection2(title);
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// button conditionser meathod end
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// rendaring one restaurent
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
Renderdata.prototype.renderOnereastaurent = async function(id) {
  let data = await allCalls.getRestaurent(id).then(data => data);
  let resshowerContiner = document.querySelector(".res-popup-continer");
  resshowerContiner.classList.toggle("respopup-continer-hidden");
  let html = "";

  if (data) {
    let star = "";
    for (
      let i = 1;
      i <= Math.round(parseInt(data.user_rating.aggregate_rating));
      i++
    ) {
      star += '<i class="fas fa-star"></i>';
    }
    let users = "";

    if (data.photos && data.photos.length >= 1) {
      data.photos.forEach((element, i) => {
        users += `
      <li class="users-list user-list${i}">
      <span class="user-img">
        <img src="${element.photo.user.profile_image}" alt="">
      </span>
      <span class="usercontent">
        <h2>${element.photo.user.name}</h2>
        ${
          element.photo.user.zomato_handle === "" ||
          element.photo.user.zomato_handle === undefined
            ? ""
            : ` <h3>
            <span>@</span>${element.photo.user.zomato_handle}
          </h3>
            `
        };
        <h3><span>${element.photo.user.foodie_level_num}</span>${
          element.photo.user.foodie_level
        }</h3>

      </span>
    </li>
      `;
      });
    }

    let sliedimgs = "";
    if (data.photos && data.photos.length >= 1) {
      data.photos.forEach((element, i) => {
        sliedimgs += `
    <img src="${
      element.photo.thumb_url ? element.photo.thumb_url : "./img/03.jpg"
    }" alt="">
    `;
      });
    }

    html += `
<div class="closer"><i class="fas fa-times"></i></div>
        <div class="res-popup-continer-wapper">
                    <!-- img continer -->
                <div class="res-popup-continer-img">
                  <img src="${
                    data.thumb ? data.thumb : "./img/02-512.png"
                  }" alt="">
                </div>
                <!-- img continer end-->
                <!-- ditales continer -->
                <div class="res-popup-continer-ditals">
                  <!-- restarauent ditales -->
                  <div class="res-popup-continer-ditals-list1 res-popup-continer-ditals-list">
                    <h2><span><i class="fas fa-hotel"></i></span>Name: <span>${
                      data.name
                    }</span></h2>
                    <h2><span><i class="far fa-clock"></i></span>Timings: <span>${
                      data.timings
                    }</span>
                    </h2>
                    <h2><span><i class="fas fa-mobile"></i></span>Number: <span>${
                      data.phone_numbers
                    }</span>
                    </h2>

                    <h2>Rating: <span>${
                      data.user_rating.aggregate_rating
                    }</span><span>${star}</span></h2>
                    <h2><span><i class="fas fa-map-marker-alt"></i></span>Address: <span>${
                      data.location.address
                    }</span></h2>
                    <h2><span><i class="fas fa-utensils"></i></span>Cuisies: <span>${
                      data.cuisines
                    }</span></h2>
                  </div>
                  <!-- restarauent ditales end -->
                  <!-- list of pepole -->
                  <div class="res-popup-continer-ditals-list2 res-popup-continer-ditals-list">
                  <h3 style="font-size:1.5rem;">Most  Visited Persons <h3>
                    <ul>
                    ${users}
                    </ul>
                  </div>
                  <!--  end list of pepole -->
                </div>
              <!-- end ditales continer -->
         </div>

         <div class="slide-img-wapper">
          <div class="arror arror1">
            <i class="fas fa-less-than"></i>
          </div>
          <div class="res-popup-continer-all-imgs">
            <div class="res-popup-continer-all-imgs-img-wapper">
            <div class="slide-img-wapper-to-flex">
              ${sliedimgs}
            </div>
            </div>
          </div>
          <div class="arror arror2">
            <i class="fas fa-greater-than"></i>
          </div>
        </div>
  `;
    resshowerContiner.innerHTML = html;
    this.sippner.classList.add("spinner-hidden");
    this.sliderindex = 0;
    var sliderItareter;
    var sliderImgs = resshowerContiner.querySelectorAll(
      ".res-popup-continer-all-imgs-img-wapper .slide-img-wapper-to-flex img"
    );
    if (data.photos) {
      if (data.photos.length > 1) {
        sliderItareter = setInterval(() => {
          if (data.photos.length - 1 > this.sliderindex) {
            sliderImgs[this.sliderindex].style.transition = "all 0.5s ease-in";
            sliderImgs[this.sliderindex].style.width = "0%";
            this.sliderindex++;
          } else {
            this.sliderindex = 0;
            sliderImgs.forEach(each => {
              each.style.transition = "all 0.01s";
              each.style.width = "7%";
            });
          }
        }, 4000);
      }
    }

    let slidedcresser = resshowerContiner.querySelector(".arror1");
    let slidedincresser = resshowerContiner.querySelector(".arror2");
    slidedcresser.addEventListener("click", () => {
      if (data.photos) {
        if (this.sliderindex > 0) {
          clearInterval(sliderItareter);
          sliderImgs[this.sliderindex - 1].style.transition =
            "all 0.5s ease-in";
          sliderImgs[this.sliderindex - 1].style.width = "7%";
          this.sliderindex -= 1;
        }
      }
    });
    slidedincresser.addEventListener("click", () => {
      if (data.photos) {
        if (this.sliderindex < data.photos.length - 1) {
          clearInterval(sliderItareter);
          sliderImgs[this.sliderindex].style.transition = "all 0.5s ease-in";
          sliderImgs[this.sliderindex].style.width = "0%";
          this.sliderindex += 1;
        }
      }
    });
    let colser = resshowerContiner.querySelector(".closer");
    colser.addEventListener("click", e => {
      this.sliderindex = 0;
      clearInterval(sliderItareter);
      resshowerContiner.classList.toggle("respopup-continer-hidden");
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// end rendaring one restaurent
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
Renderdata.prototype.selectedCardStyleing = function(id) {
  let localdata;
  if (sessionStorage.getItem("visitres") == null) {
    localdata = [];
  } else {
    localdata = JSON.parse(sessionStorage.getItem("visitres"));
  }
  localdata.push(id);
  sessionStorage.setItem("visitres", JSON.stringify(localdata));
  this.resentalySelectedCard(id);
};

Renderdata.prototype.resentalySelectedCard = function(id) {
  let cardEvent = document.querySelectorAll(
    ".main-content-card  .main-content-card-wapper"
  );

  let localdata;
  if (sessionStorage.getItem("visitres") == null) {
    localdata = [];
  } else {
    localdata = JSON.parse(sessionStorage.getItem("visitres"));
  }
  if (localdata.length > 0) {
    cardEvent.forEach(each => {
      for (let i = 0; i < localdata.length; i++) {
        if (
          each.parentElement.dataset.resid === localdata[i] ||
          each.parentElement.dataset.resid === id
        ) {
          each.style.backgroundColor = "rgba(189, 210, 241, 0.88)";
        }
      }
    });
  }
};
Renderdata.prototype.renderingCusiSection = async function(cond, title) {
  let dataForcui = "";
  if (!cond) {
    // console.log("hi");
    dataForcui = await allCalls.getCuisions().then(data => data);
  } else {
    dataForcui = await allCalls.getCity(title).then(data => data);
  }
  let opele2 = " <option  selected>Select Cuisine</option>";
  console.log(dataForcui);
  dataForcui.cuisines.forEach(each => {
    let { cuisine_id, cuisine_name } = each.cuisine;
    opele2 += `
    <option data-id="${cuisine_id}">${cuisine_name}</option>
    `;
  });
  let selectionTwo = document.querySelector(".cat-cui-form .select2");
  selectionTwo.innerHTML = opele2;
};
Renderdata.prototype.rendingCtrySection = async function() {
  let dataForcat = await allCalls.getCatogires().then(data => data);
  let opele1 = " <option selected>Select Category</option>";
  dataForcat.categories.forEach(each => {
    let { id, name } = each.categories;
    opele1 += `
    <option data-id="${id}">${name}</option>
    `;
  });
  let selectionOne = document.querySelector(".cat-cui-form .select1");
  selectionOne.innerHTML = opele1;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// restaurant rendaring meathod
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// this meathode for rendering data in main content i mean all restaurents
Renderdata.prototype.currentLocationRes = async function(cond, data, title) {
  if (!cond) {
    if (allCalls.coordAvailable() < 2) {
      this.resdata = await allCalls.searchRestaurent().then(data => {
        return data;
      });
    }
    this.btnconter = 0;
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
         <span><i class="fas fa-utensils"></i></span> Cuisines:${
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

    // every time we render any elements it see this any one restaurents like's
    this.prilikeres();
    //any new new likes are dislikes on user choes
    this.likeAreUnlike();
    // this meathod for buttons conditions
    this.buttonConditioner(title);
    let cardEvent = document.querySelectorAll(".main-content-card");
    cardEvent.forEach(element => {
      let self = this;
      element.addEventListener("click", function(e) {
        if (
          e.target.classList[0] !== "far" &&
          e.target.classList[0] !== "love-it"
        ) {
          self.sippner.classList.remove("spinner-hidden");
          self.renderOnereastaurent(this.dataset.resid);
          self.selectedCardStyleing(this.dataset.resid);
        }
      });
    });
    this.resentalySelectedCard();
    this.rendingCtrySection();
    this.renderingCusiSection(cond, title);

    let formEvent = document.querySelector(".cat-cui-form a");
    formEvent.addEventListener("click", e => {
      let catrsection = formEvent.parentElement.children[0];
      let cuisiSection = formEvent.parentElement.children[1];

      e.preventDefault();
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////
/////////////////////////// end of this restaurant rendaring meathod
///////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// creating rederdata object
let renderHtml = new Renderdata();
renderHtml.currentLocationRes();
