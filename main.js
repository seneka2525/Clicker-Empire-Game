// 表示するページを名前空間へ
const config = {
    // 初期表示される名前入力ページ
    initialform: document.getElementById("initial-form"),
    // アイテム以外のメインのゲームページ
    gamePage: document.getElementById("gamePage"),
    // １つのページに表示するアイテムを入れるdivタグ
    itemsList : document.createElement("div"),
}



// setIntervalの停止用のIDを格納する
const timerID = {
    day : 0,
    amountMoney : 0,
}

// 登録ユーザーの情報
class UserGameAccount {

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

    // 1秒毎に１日ずつ経過させて、365日経過で年齢を１増やす
    daysElapsed(elm) {

        // clearIntervalでタイマーを停止させるためのtimerIDを取得
        timerID.day = setInterval(function () {
            let year = 365;
            let ageP = elm.querySelectorAll(".user-info-p")[1];
            let daysP = elm.querySelectorAll(".user-info-p")[2];
            this.days++;
            daysP.innerHTML = `${this.days.toLocaleString()}日 経過`;

            if ((this.days !== 0) && ((this.days % year) === 0)) {
                ageP.innerHTML = `${++this.age} 歳`;
            }
        }.bind(this), 1000);
    }

    // 秒毎に所持金が増えるアイテムを所持した時、所持金を増やす
    everySecondMoreMoney(elm, item, isItem, value) {

        let priceNum = parseInt(item.price.replace(/,/g, ""));
        let addPrice = 0;
        let rate = 0;
        if (item.name === "ETFStock") {
            
            if (value === 1) {
                addPrice = Math.floor(priceNum * Math.pow(1.1, 1));
            } else if(value > 1) {
                addPrice = Math.floor(priceNum * Math.pow(1.1, item.owned));
            } else if (value === undefined) {
                addPrice = priceNum;
            }
            rate = 0.001;
            item.price = addPrice.toLocaleString();

            } else if (item.name === "ETFBonds") {
                rate = 0.0007;
            } else {
                rate = parseInt(item.effect);
            }

        if (isItem === false) {
            item.isItem = true;
            // clearIntervalでタイマーを停止させるためのtimerIDを取得
            timerID.amountMoney = setInterval(function () {
                if (item.name === "ETFStock") {
                    this.money += item.etfTotal * rate;
                } else if (item.name === "ETFBonds") {
                    this.money += item.etfTotal * rate;
                } else {
                    this.money += rate * parseInt(item.owned);
                }
                elm.innerHTML =
                    `
                    ¥${this.money.toLocaleString()}
                `;
            }.bind(this), 1000);
        }
    }

}

// 購入可能なアイテムクラス
class Item {

    // コンストラクタ関数(名前、効果、画像、タイプ、最大購入数、説明、値段、所持数)
    constructor(name, effect, img, type, maxPurchases, description, price, owned, isItem, etfTotal) {
        this.name = name;
        this.effect = effect;
        this.img = img;
        this.type = type;
        this.maxPurchases = maxPurchases;
        this.description = description;
        this.price = price;
        this.owned = owned;
        this.isItem = isItem;
        this.etfTotal = etfTotal;

    }

}

// 各アイテム（11種類のアイテムインスタンスを配列へ）
const items = [
    new Item("バーガーグリル", "25", "https://1.bp.blogspot.com/-Bw5ZckDs9X8/XdttVGl2K5I/AAAAAAABWG4/ySICN6pGG68DXOA3iGg6OehjhfY4UYzwACNcBGAsYHQ/s1600/cooking_camp_bbq_grill.png", "オプション", "500", "バーガーをクリックごとにグリルの所持数 × 25円を取得する", "15,000", "1", false),
    new Item("ETF", "0.1%", "https://4.bp.blogspot.com/-wiuuXIr7ee4/WdyEAs1h1YI/AAAAAAABHhg/nxShr_q4eCM8TROul3l7OnQqeVBFdI2wQCLcBGAs/s800/toushika_kabunushi_happy.png", "投資", "∞", "ETF銘柄の購入分をまとめて加算し、毎秒 0.1%を取得する", "300,000", "0", false,0),
    new Item("債券", "0.07%", "https://3.bp.blogspot.com/-q3fsc28YHhA/WkR92wRCAZI/AAAAAAABJVo/7R3S9tpX2W8VmcXV40c0NOCZ1Ch2bVgrACLcBGAs/s800/kabu_chart_man_happy.png", "投資", "∞", "債権ETFの購入分をまとめて加算し、毎秒 0.07%を取得する", "300,000", "0", false,0),
    new Item("レモネード店", "30", "https://1.bp.blogspot.com/-jWZ_H-M9Bbc/XDXbzDX4G9I/AAAAAAABREQ/ctF0S_EEmD47tNWMcLhFssNCteQquhWyQCLcBGAs/s800/lemonade_shop_boy.png", "不動産", "1000", "毎秒30円を取得する", "30,000", "0", false),
    new Item("アイスクリーム店", "120", "https://2.bp.blogspot.com/-IDJ-PAml6xI/UvTd5BRmybI/AAAAAAAAdf8/qkKtOM235yw/s800/job_icecream_ya.png", "不動産", "500", "毎秒120円を取得する", "100,000", "0", false),
    new Item("一軒家", "32,000", "https://1.bp.blogspot.com/-RE_LtIhPBps/VCOJt4M6ZEI/AAAAAAAAm1k/WGvtkInZP9s/s800/house_reform.png", "不動産", "100", "毎秒32,000円を取得する", "20,000,000", "0", false),
    new Item("アパート", "64,000", "https://1.bp.blogspot.com/-AnmpceWlLCQ/UgsvKuxswbI/AAAAAAAAXRE/wXGzSvKzMqE/s800/solar_panel.png", "不動産", "100", "毎秒64,000円を取得する", "40,000,000", "0", false),
    new Item("マンション", "500,000", "https://2.bp.blogspot.com/-mcBTpFJvFNo/WeAFbqrzyHI/AAAAAAABHjQ/5cGZy_hvgtwumLbyggYibhxmj7lunDhwACLcBGAs/s800/building_mansion2.png", "不動産", "20", "毎秒500,000円を取得する", "250,000,000", "0", false),
    new Item("工業地帯", "2,200,000", "https://4.bp.blogspot.com/-X6Y32Uh5ud4/W_UF70_iobI/AAAAAAABQT0/gF3Braf7peIkKgr_MWRSRz_RuCR4wMnsACLcBGAs/s800/building_koujou_entotsu.png", "不動産", "10", "毎秒2,200,000円を取得する", "1,000,000,000", "0", false),
    new Item("高層ホテル", "25,000,000", "https://3.bp.blogspot.com/-qbqb7xIicEA/VpjCnDpHkfI/AAAAAAAA3EE/8NqVEr8MMxQ/s800/kousou_hotel.png", "不動産", "5", "毎秒25,000,000円を取得する", "10,000,000,000", "0", false),
    new Item("新幹線", "30,000,000,000", "https://4.bp.blogspot.com/-xeElVHnaO6E/UUhH-h33LkI/AAAAAAAAO6s/ZdByhm_3NRI/s1600/train_shinkansen.png", "不動産", "1", "毎秒30,000,000,000円を取得する", "10,000,000,000,000", "0", false),
];

// submitしたユーザーの名前からインスタンスを生成する関数
function initializeUserAccount() {
    let errMsg = document.querySelector(".help-block");
    let nameForm = document.getElementById("name-input");
    let userName = nameForm.value;

    if (userName !== "") {
        let userAccount = new UserGameAccount(
            userName,
            20,
            0,
            50000,
            0,
            25,
        );

        // submitされたら１ページ目を非表示にする
        config.initialform.classList.add("d-none");
        document.getElementById("discription").classList.add("d-none");
        document.getElementById("target").style.height = "100vh";
        // オブジェクトを受け取って２ページ目を表示する
        config.gamePage.append(mainGamePage(userAccount));
    } else {
        errMsg.innerHTML = "＊入力必須です";
    }
}

// ローカルストレージに保存したデータの呼び出し
function loadedGamePage(account, saveItems) {
    // 保存されているアカウント情報でインスタンスを生成
    let userAccount = new UserGameAccount(
        account.name,
        account.age,
        account.days,
        account.money,
        account.clickCount,
        account.flipMachine,
    );
    // 保存されているアイテムデータを配列へ
    let items = saveItems;

    config.gamePage.innerHTML = "";
    config.gamePage.append(mainGamePage(userAccount));
    config.itemsList.innerHTML = "";

    // アイテムの表示カウント
    let page = 0;
    let itemDiv = 3;
    config.itemsList = itemsInfo(items, page, itemDiv, userAccount);

    let moneyP = document.querySelectorAll(".user-info-p")[3];

    for (let i = 0; i < items.length; i++){
        // 各アイテムのisItemを確認していき、trueの場合タイマーをリセットして再度タイマーをセットする
        if (items[i].isItem) {
            items[i].isItem = false;
            clearInterval(timerID.amountMoney);
            userAccount.everySecondMoreMoney(moneyP, items[i], items[i].isItem);
        }
    }
}

// 初期表示ページのログインを押した時に画面を前回の保存状態へ戻す
function login() {
    if (localStorage.getItem("userData")) {

        let jsonDecodedUser = localStorage.getItem("userData");
        let jsonDecodedItems = localStorage.getItem("itemData");

        let saveAccount = JSON.parse(jsonDecodedUser);
        let itemsArr = JSON.parse(jsonDecodedItems);

        for (let i = 0; i < itemsArr.length; i++) {
            items[i] = itemsArr[i];
        }

        config.initialform.classList.add("d-none");
        // ページの状態を保存した状態に復元する
        loadedGamePage(saveAccount, itemsArr);

        alert("データをロードしました。");

        } else {
            alert("データが保存されていません。");
        }
    };


// ユーザーオブジェクトを受け取ってメインページを生成する関数
function mainGamePage(userAccount) {

    // 各divタグを生成して中身を入れる
    let container = document.createElement("div");
    container.classList.add("bg-lightBlue", "col-lg-10", "col-md-12", "text-center", "text-white", "d-md-flex", "p-3");

    let leftContents = document.createElement("div");
    leftContents.classList.add("left-contents", "bg-darkBlue", "d-flex", "flex-wrap", "flex-column", "col-md-4", "p-2", "mr-md-2");

    let bargerWrap = document.createElement("div");
    bargerWrap.classList.add("bargerWrap", "bg-lightBlue", "mb-5");
    bargerWrap.innerHTML =
    `
        <p class="counter font-l">${userAccount.clickCount} バーガー</p>
        <p class="flip-total">¥${userAccount.flipMachine} 獲得</p>
    `;

    // バーガーの画像
    let bargerImg = document.createElement("img");
    bargerImg.classList.add("game-img");
    bargerImg.setAttribute("src", "https://1.bp.blogspot.com/-ccmRa-W5FdQ/WGnPWhQSnzI/AAAAAAABA4w/krKcel6z1hobC87K1Vj9bG_Me_AfBo15QCLcB/s800/hamburger_teriyaki_burger.png");

    let rightContents = document.createElement("div");
    rightContents.classList.add("right-contents", "col-md-8", "bg-darkBlue");

    let userInfo = document.createElement("div");
    userInfo.classList.add("user-info", "d-flex", "flex-wrap", "justify-content-center");
    userInfo.innerHTML =
    `
        <p class="user-info-p bg-lightBlue col-5 m-1">${userAccount.name}</p>
        <p class="user-info-p bg-lightBlue col-5 m-1">${userAccount.age} 歳</p>
        <p class="user-info-p bg-lightBlue col-5 m-1">${userAccount.days}日 経過</p>
        <p class="user-info-p bg-lightBlue col-5 m-1">¥${userAccount.money.toLocaleString()}</p>
    `;

    userAccount.daysElapsed(userInfo);

    // アイテムの表示カウント
    let page = 0;
    let itemDiv = 3;


    let saveResetIcon = document.createElement("div");
    saveResetIcon.classList.add("icon-wrap", "my-2", "d-flex", "justify-content-end");
    saveResetIcon.innerHTML =
    `
        <i class="fas fa-save fa-3x m-2 p-2"></i>
        <i class="fas fa-spinner fa-3x m-2 p-2"></i>
    `;

    let saveBtn = saveResetIcon.querySelector(".fa-save");
    // セーブアイコンをクリック時、現在のオブジェクトの状態をjson文字列としてローカルストレージに保存
    saveBtn.addEventListener("click", function () {

        let jsonEncodedUser = JSON.stringify(userAccount);
        let jsonEncodedItems = JSON.stringify(items);


        localStorage.setItem("userData", jsonEncodedUser);
        localStorage.setItem("itemData", jsonEncodedItems);

        alert("データをセーブしました。");
    });

    let resetBtn = saveResetIcon.querySelector(".fa-spinner");
    // ロードボタンをクリック時、保存していたjson文字列をオブジェクトに変換して渡す
    resetBtn.addEventListener("click", function () {
        // ローカルストレージにデータが保存されている場合、保存されているデータを呼び出す
        if (localStorage.getItem("userData")) {

            // 起動済みのタイマーを停止する
            clearInterval(timerID.day);

            let jsonDecodedUser = localStorage.getItem("userData");
            let jsonDecodedItems = localStorage.getItem("itemData");

            let saveAccount = JSON.parse(jsonDecodedUser);
            let itemsArr = JSON.parse(jsonDecodedItems);

            for (let i = 0; i < itemsArr.length; i++) {
                items[i] = itemsArr[i];
            }

            // ページの状態を保存した状態に復元する
            loadedGamePage(saveAccount, items);

            alert("データをロードしました。");
        } else {
            alert("データが保存されていません。");
        }
    });


    // 生成したdivタグに要素を追加していく
    leftContents.append(bargerWrap, bargerImg);
    rightContents.append(userInfo, itemsInfo(items, page, itemDiv, userAccount), saveResetIcon);
    container.append(leftContents, rightContents);


    // バーガークリック時にクリック回数と所持金を書き換える
    bargerImg.addEventListener("click", function () {
        // クリックカウントを増やして所持金を追加する
        userAccount.bargerClick();
        let clickCounter = document.querySelectorAll(".counter")[0];
        clickCounter.innerHTML = `${userAccount.clickCount} バーガー`;

        let moneyStr = document.querySelectorAll(".user-info-p")[3];
        moneyStr.innerHTML = `¥${userAccount.money.toLocaleString()}`;
    });

    return container;
}


function itemsInfo(items, page, itemDiv, userAccount) {

    let buyItemsInfo = document.createElement("div");
    buyItemsInfo.classList.add("buy-items-info", "flex-wrap", "d-flex", "justify-content-center", "flex-column");

    // ループでアイテムを３つ表示 (0,2)(3,5)(6,9) page = 0, itemDiv = 3
    for (let i = page; i < items.length; i++) {
        if (i < itemDiv) {
            buyItemsInfo.innerHTML +=
        `
            <div class="buy-item row bg-lightBlue flex-wrap m-1" data-item-num="${[i]}">
                <img class="buy-item-img col-3 p-0" src="${items[i].img}" alt="">
                <div class="item-title col-4">
                    <p id="itemName" class="font-l">${items[i].name}</p>
                    <p class="m-0">¥${items[i].price}</p>
                </div>
                <div class="item-money p-0 col-4 d-flex align-items-end">
                    <p class="mb-1">+¥${items[i].effect} / 秒</p>
                </div>
                <div class="item-quantity p-0 d-flex align-items-center">
                    <p class="m-0 font-l">${items[i].owned}</p>
                </div>
            </div>
        `;
        }
    }


    let itemSelectBtn = document.createElement("div");
    itemSelectBtn.classList.add("d-flex", "justify-content-between");
    itemSelectBtn.innerHTML =
    `
        <button type="button" class="back-btn col-3 btn btn-info">&lt;</button>
        <button type="button" class="next-btn col-3 btn btn-info">&gt;</button>
    `;

    config.itemsList.append(buyItemsInfo); // どこでボタンが入った？


    // 各アイテムクリック時に詳細を表示
    let itemDetail = buyItemsInfo.querySelectorAll(".buy-item");
    itemDetail.forEach(function (itemEle) {
        itemEle.addEventListener("click", function () {
            config.itemsList.innerHTML = "";
            config.itemsList.append(itemDetailPage(itemEle, page, itemDiv, userAccount));
        });
    });


    // 「<」ボタンを押した時に前の3つのアイテムを表示する
    // 最初のページの場合は何もしない
    if (page !== 0) {
        let backBtn = itemSelectBtn.querySelectorAll(".back-btn")[0];
        backBtn.addEventListener("click", function () {
            config.itemsList.innerHTML = "";
            itemsInfo(items, page - 3, itemDiv - 3, userAccount);
        });
    }

    // 「>」ボタンを押した時に次の3つのアイテムを表示する
    // 最後のページの場合は何もしない
    if (itemDiv !== items.length + 1) {
        let nextBtn = itemSelectBtn.querySelectorAll(".next-btn")[0];
        nextBtn.addEventListener("click", function () {
            config.itemsList.innerHTML = "";
            itemsInfo(items, page + 3, itemDiv + 3, userAccount);
        });
    }

    config.itemsList.append(itemSelectBtn);

    return config.itemsList;
}

// 各アイテムをクリックした時にアイテム詳細画面を表示する
function itemDetailPage(item, page, itemDiv, userAccount) {
    let itemNum = parseInt(item.getAttribute("data-item-num"));
    let itemDetail = document.createElement("div");

    itemDetail.classList.add("item-detail", "bg-lightBlue");
    
    itemDetail.innerHTML =
    `
        <div class="item-about p-2 d-flex justify-content-between">
            <div class="item-about-left text-left d-flex justify-content-start flex-column">
                <p class="m-0">${items[itemNum].name}</p>
                <p class="font-s m-0">最大所持数: ${items[itemNum].maxPurchases}</p>
                <p class="font-s m-0">値段: ¥${items[itemNum].price}</p>
                <p class="font-s m-0">${items[itemNum].description}</p>
            </div>
            <div class="item-about-right col-4 p-0">
                <img class="buy-item-img" src="${items[itemNum].img}" alt="">
            </div>
        </div>
    `;

    // インプット部を生成
    purchaseWrap(itemDetail, items[itemNum]);


    let backPurchaseBtn = document.createElement("div");
    backPurchaseBtn.classList.add("d-flex", "justify-content-between", "m-2");
    backPurchaseBtn.innerHTML =
    `
        <button type="button" class="back-btn col-5 btn btn-info">戻る</button>
        <button type="button" class="next-btn col-5 btn btn-info">購入する</button>
    `;

    itemDetail.append(backPurchaseBtn);


    // inputの数値が変わったらトータル金額を更新
    itemDetail.querySelector("input").addEventListener("change", function () {
        let totalPrice = calculateTotalAmount(itemDetail ,items[itemNum].price);
        itemDetail.querySelector(".total-price").innerHTML = "Total : ¥" + totalPrice.toLocaleString();
    });



    // アイテム詳細からGo Backボタンを押した時
    let goBackBtn = backPurchaseBtn.querySelectorAll(".back-btn")[0];
    goBackBtn.addEventListener("click", function () {
        config.itemsList.innerHTML = "";
        itemsInfo(items, page, itemDiv, userAccount);
    });

    // アイテム詳細からPurchaseボタンを押した時
    let purchaseBtn = backPurchaseBtn.querySelectorAll(".next-btn")[0];
    purchaseBtn.addEventListener("click", function () {
        // アイテムの個数と金額を計算
        let totalPrice = calculateTotalAmount(itemDetail, items[itemNum].price);

        items[itemNum].etfTotal += totalPrice;
        // 所持金が購入金額以上の場合
        if (userAccount.money >= totalPrice) {
            
            let inputValue = parseInt(itemDetail.querySelector("input").value);
            items[itemNum].owned = inputValue + parseInt(items[itemNum].owned);
            userAccount.money -= totalPrice;
            document.querySelectorAll(".user-info-p")[3].innerHTML =
            `
                ¥${userAccount.money.toLocaleString()}
            `;

            userAccount.flipMachine = items[0].effect * items[0].owned;
            document.querySelector(".flip-total").innerHTML =
            `
                ¥${userAccount.flipMachine} 獲得
            `;
            if (items[itemNum].name !== "FlipMachine") {
                let moneyP = document.querySelectorAll(".user-info-p")[3];

                userAccount.everySecondMoreMoney(moneyP, items[itemNum], items[itemNum].isItem, inputValue);
            }

            config.itemsList.innerHTML = "";
            itemsInfo(items, page, itemDiv, userAccount);

        } else {
            alert("所持金が不足しています。");
        }
    });
    return itemDetail;
}

// アイテム詳細内のinputタグ部を生成
function purchaseWrap(itemDetailEle, itemNum) {
    itemDetailEle.innerHTML +=
    `
        <div class="purchase-input text-left p-2">
        <label >
            <p class="mb-1">いくつ購入しますか？</p>
            <input type="number" class="text-right" min="0" max="${parseInt(itemNum.maxPurchases)}" value="1">
        </label>
        <p class="total-price text-right p-0 m-0">Total : ¥${itemNum.price}</p>
        </div>
    `;
    return itemDetailEle;
}




// アイテム詳細でトータル金額を計算する関数
function calculateTotalAmount(itemEle, price) {
    let itemName = itemEle.querySelectorAll("p")[0].innerHTML;
    let inputValue = parseInt(itemEle.querySelector("input").value);
    let total = 0;
    let priceNum = parseInt(price.replace(/,/g, ""));
    if (itemName === "ETFStock" && inputValue <= 1) {

        total = inputValue * priceNum;
        return total;
    } else if (itemName === "ETFStock" && inputValue > 1) {

        let currPrice = 0;
        let amount = 0;
        for (let i = 1; i < inputValue; i++){
            currPrice = Math.floor(priceNum * Math.pow(1.1, [i]));
            amount += currPrice;
        }
        total = priceNum + amount;
        return total;
    } else {
        total = inputValue * priceNum;
        return total;
    }
}