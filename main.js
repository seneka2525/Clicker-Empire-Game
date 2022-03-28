// 表示するページ
const config = {
    initialform: document.getElementById("initial-form"),
    gamePage: document.getElementById("gamePage"),
}

// 登録ユーザーの情報
class UserGameAccount {

    // クラス変数
    // flipMachine = 1 * 25;

    // コンストラクタ関数（名前、年齢、経過日数、所持金、クリック回数、所持アイテム数）
    constructor(name, age, days, money, clickCount, flipMachine) {
        this.name = name;
        this.age = age;
        this.days = days;
        this.money = money;
        this.clickCount = clickCount;
        this.flipMachine = flipMachine;
    }

    // ハンバーガークリック時にクリック数と所持金を増やす
    bargerClick() {
        this.clickCount++;
        this.money += this.flipMachine;
    }
}

// 購入可能なアイテムクラス
class Item {

    // コンストラクタ関数(名前、タイプ、最大購入数、説明、値段)
    constructor(name, effect, img, type, maxBuy, description, price, owned) {
        this.name = name;
        this.effect = effect;
        this.img = img;
        this.type = type;
        this.maxBuy = maxBuy;
        this.description = description;
        this.price = price;
        this.owned = owned;
    }
}

// 各アイテム（11種類のインスタンスを配列へ）
const items = [
    new Item("FlipMachine", "25", "img/grill.jpeg", "オプション", "500", "バーガーをクリックごとに25円を取得する", "15,000", "0"),
    new Item("ETFStock", "0.1%", "img/ETFStock.jpg", "投資", "∞", "ETF銘柄の購入分をまとめて加算し、毎秒 0.1%を取得する", "300,000", "0"),
    new Item("ETFBonds", "0.07%", "img/ETFBonds.jpg", "投資", "∞", "債権ETFの購入分をまとめて加算し、毎秒 0.07%を取得する", "300,000", "0"),
    new Item("LemonadeStand", "30", "img/LemonadeStand.jpg", "不動産", "1000", "毎秒30円を取得する", "30,000", "0"),
    new Item("IcecreamTruck", "120", "img/icecreamTruck.jpg", "不動産", "500", "毎秒120円を取得する", "100,000", "0"),
    new Item("House", "32,000", "img/House.jpeg", "不動産", "100", "毎秒32,000円を取得する", "20,000,000", "0"),
    new Item("TownHouse", "64,000", "img/TownHouse.webp", "不動産", "100", "毎秒64,000円を取得する", "40,000,000", "0"),
    new Item("Mansion", "500,000", "img/Mansion.webp", "不動産", "20", "毎秒500,000円を取得する", "250,000,000", "0"),
    new Item("industrialSpace", "2,200,000", "img/industrialSpace.jpg", "不動産", "10", "毎秒2,200,000円を取得する", "1,000,000,000", "0"),
    new Item("HotelSkyscraper", "25,000,000", "img/HotelSkyscraper.jpg", "不動産", "5", "毎秒25,000,000円を取得する", "10,000,000,000", "0"),
    new Item("BulletSpeedSkyRailway", "30,000,000,000", "img/BulletSpeedSkyRailway.jpg", "不動産", "1", "毎秒30,000,000,000円を取得する", "10,000,000,000,000", "0"),
];

// submitした名前からインスタンスを生成する関数
function initializeUserAccount() {
    let userAccount = new UserGameAccount(
        document.getElementById("nameInput").value,
        20,
        0,
        50000,
        0,
        25,
    );
    // submitされたら１ページ目を非表示にする
    config.initialform.classList.add("d-none");
    // オブジェクトを受け取って２ページ目を表示する
    config.gamePage.append(mainGamePage(userAccount));
}

// オブジェクトを受け取ってメインページを生成する関数
function mainGamePage(userAccount) {

    // 各divタグを生成して中身を入れる
    let container = document.createElement("div");
    container.classList.add("bg-lightBlue", "col-md-9", "col-xs-10", "text-center", "text-white", "d-flex", "p-3");

    let leftContents = document.createElement("div");
    leftContents.classList.add("left-contents", "bg-darkBlue", "d-flex", "flex-wrap", "flex-column", "col-4", "p-2", "mr-2");

    let bargerWrap = document.createElement("div");
    bargerWrap.classList.add("bargerWrap", "bg-lightBlue", "mb-5");
    bargerWrap.innerHTML =
    `
        <p class="counter font-l">${userAccount.clickCount} Burgers</p>
        <p>¥${userAccount.flipMachine} per second</p>
    `;

    // バーガーの画像
    let bargerImg = document.createElement("img");
    bargerImg.classList.add("game-img");
    bargerImg.setAttribute("src", "img/barger.jpeg");

    let rightContents = document.createElement("div");
    rightContents.classList.add("right-contents", "col-8", "bg-darkBlue");

    let userInfo = document.createElement("div");
    userInfo.classList.add("user-info", "d-flex", "flex-wrap", "justify-content-center");
    userInfo.innerHTML =
    `
        <p class="user-info-p bg-lightBlue col-5 m-1">${userAccount.name}</p>
        <p class="user-info-p bg-lightBlue col-5 m-1">${userAccount.age} yrs old</p>
        <p class="user-info-p bg-lightBlue col-5 m-1">${userAccount.days} days</p>
        <p class="user-info-p bg-lightBlue col-5 m-1">¥${userAccount.money}</p>
    `;

    // アイテムの表示ページ
    let page = 0;
    let currItems = 3;
    // アイテム表示部分を関数に切り出す
    let buyItemsInfo = itemsInfo(items, page, currItems);

    // // 「<」ボタンを押した時に前の3つのアイテムを表示する
    // // 「>」ボタンを押した時に次の3つのアイテムを表示する
    // let nextBtn = buyItemsInfo.querySelectorAll(".next-btn")[0];
    // nextBtn.addEventListener("click", function () {
    //     buyItemsInfo = "";
    //     buyItemsInfo = itemsInfo(items, page+3, currItems+3);
    //     console.log(buyItemsInfo);
    // });











    let saveResetIcon = document.createElement("div");
    saveResetIcon.classList.add("icon-wrap", "my-2", "d-flex", "justify-content-end");
    saveResetIcon.innerHTML =
    `
        <i class="fas fa-save fa-3x m-2 p-2"></i>
        <i class="fas fa-spinner fa-3x m-2 p-2"></i>
    `;


    // 生成したdivタグに要素を追加していく
    leftContents.append(bargerWrap, bargerImg);
    rightContents.append(userInfo, buyItemsInfo, saveResetIcon);
    container.append(leftContents, rightContents);


    // バーガークリック時にクリック回数と所持金を書き換える
    bargerImg.addEventListener("click", function () {
        userAccount.bargerClick();
        let clickCounter = document.querySelectorAll(".counter")[0];
        clickCounter.innerHTML = `${userAccount.clickCount} Burgers`;

        let moneyStr = document.querySelectorAll(".user-info-p")[3];
        moneyStr.innerHTML = `¥${userAccount.money}`;
    });

    // 「<」ボタンを押した時に前の3つのアイテムを表示する

    // 「>」ボタンを押した時に次の3つのアイテムを表示する
    let nextBtn = buyItemsInfo.querySelectorAll(".next-btn")[0];
    nextBtn.addEventListener("click", function () {
        rightContents.innerHTML = "";
        buyItemsInfo = itemsInfo(items, page+3, currItems+3);
        rightContents.append(userInfo, buyItemsInfo, saveResetIcon);
        console.log("nextBtn");
    });
    console.log(buyItemsInfo);

    return container;
}

function itemsInfo(items, page, currItems) {

    let buyItemsInfo = document.createElement("div");
    buyItemsInfo.classList.add("buy-items-info", "flex-wrap", "d-flex", "justify-content-center", "flex-column");
    // ループでアイテムを３つ表示
    for (let i = page; i < currItems; i++){
        buyItemsInfo.innerHTML +=
        `
            <div class="buy-item row bg-lightBlue flex-wrap m-1">
                <img class="buy-item-img col-3 p-0" src="${items[i].img}" alt="">
                <div class="item-title col-4">
                    <p class="font-l">${items[i].name}</p>
                    <p class="m-0">¥${items[i].price}</p>
                </div>
                <div class="item-money p-0 col-4 d-flex align-items-end">
                    <p class="mb-1">+¥${items[i].effect} / sec</p>
                </div>
                <div class="item-quantity p-0 d-flex align-items-center">
                    <p class="m-0 font-l">${items[i].owned}</p>
                </div>
            </div>
        `;
    }
    let itemSelectBtn = document.createElement("div");
    itemSelectBtn.classList.add("d-flex", "justify-content-between");
    itemSelectBtn.innerHTML =
    `
        <button type="button" class="back-btn col-3 btn btn-info">&lt;</button>
        <button type="button" class="next-btn col-3 btn btn-info">&gt;</button>
    `;
    buyItemsInfo.append(itemSelectBtn);
    // // 「<」ボタンを押した時に前の3つのアイテムを表示する
    // // 「>」ボタンを押した時に次の3つのアイテムを表示する
    // let nextBtn = itemSelectBtn.querySelectorAll(".next-btn")[0];
    // nextBtn.addEventListener("click", function () {
    //     itemsInfo(items, 2);
    // });


    return buyItemsInfo;
}

// itemsInfo(items);
// console.log(Math.floor(11 / 3));
// // 表示するアイテム(3つ）のHTMLを生成する関数
// function renderItems(items) {
//     for (let i = 0; i < items.length; i++){

//     }
// }




// console.log(items[0])

// initializeUserAccount();
// mainGamePage(userAccount);

// let a = "100,000";
// console.log(parseInt(a.replace(",", "")) + 1000);
