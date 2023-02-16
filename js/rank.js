const APIKEY = "RGAPI-276cb608-d858-41fd-a5b2-1836549ff72c"
//소환사명으로 정보 가져오기

let leagueList = document.querySelector(".leagues");
let leagues = leagueList.querySelectorAll("li");

let divisionli = document.querySelector(".division");
let division = divisionli.querySelectorAll("li");
let whatDivi = "I";
let whatleag = "challengerleagues";

let Rankers = document.querySelector(".rankers");
let num1 = 0, num2 = 0;

window.onload = fetch1("challengerleagues");

leagues.forEach((l, key) => {
    l.addEventListener("click", () => {
        whatleag = l.className;
        Rankers.innerHTML = "";
        if (key == 0) {
            fetch1(l.className);
            divisionli.style = "display:none"
            leagueList.style = "margin-bottom:119px"
        }
        else if (key > 0 && key < 3) {
            fetch1(l.className);
            divisionli.style = "display:none"
            leagueList.style = "margin-bottom:119px"
        } else {
            fetch2(l.className, "I");
            divisionli.style = "display:flex"
            leagueList.style = "margin-bottom:0"
        }

        leagues[num1].classList.remove("active");
        num1 = key;
        l.classList.add("active");

        division[num2].classList.remove("active");
        division[0].classList.add("active");
    })
})

division.forEach((d,key) => {
    d.addEventListener("click", () => {
        Rankers.innerHTML = "";
        whatDivi = d.innerText;
        fetch2(whatleag, whatDivi);

        division[0].classList.remove("active");
        division[num2].classList.remove("active");
        num2 = key;
        d.classList.add("active");
    })
})


function handlesearchubmit(name) { 
        SearchPlayerObj = {
            id: Date.now(),
            text: name
        };

        searchP.push(SearchPlayerObj);
        //가장 최신 검색 아이디가 맨 위로 오게하기
        searchP.sort(function (a, b) { return b.id - a.id });

        savesearch();
        location.href = "./search.html";
};

let searchP = new Array();
//item을 localStorage에 저장
function savesearch() { 
    typeof(Storage) !== 'undefined' && localStorage.setItem("searchPlayer", JSON.stringify(searchP));
};

//localStorage에서 item 가져오기
const findSearch = JSON.parse(localStorage.getItem("searchPlayer"));
if(findSearch !== null) {
    searchP = findSearch //전에 있던 items 유지
}


function fetch1(Wl,Rnum) {
    fetch(`https://kr.api.riotgames.com/lol/league/v4/${Wl}/by-queue/RANKED_SOLO_5x5?api_key=${APIKEY}`)
    .then((r) => r.json())
    .then((userData) => {
        GMR(userData,Rnum); 
        
        let RankerN = document.querySelectorAll(".rankerName");
        RankerN.forEach((r)=>{
                r.addEventListener("click", ()=>{
                    handlesearchubmit(r.innerText);
                })
        })
    });
}

function fetch2(Wl,whatDivi,Rnum) {
    fetch(`https://kr.api.riotgames.com/lol/league/v4/entries/RANKED_SOLO_5x5/${Wl}/${whatDivi}?page=1&api_key=${APIKEY}`)
    .then((r) => r.json())
        .then((userData) => {
        GMR2(userData,Rnum);
        
        let RankerN = document.querySelectorAll(".rankerName");
        RankerN.forEach((r)=>{
                r.addEventListener("click", ()=>{
                    handlesearchubmit(r.innerText);
                })
        })
    });
}


function GMR(userData) {
    let Rank = [userData][0].entries;
    Rank.sort(function (a, b) { return b.leaguePoints - a.leaguePoints });
    makeTopItem();

    const to100 = [];
    for (i = 0; i < 100; i++){
        to100.push(Rank[i]);
    }
    to100.forEach((ranker,key) => {
        listMake(ranker,key);
    })
}

function GMR2(userData) {
    let Rank = [userData][0];
    Rank.sort(function (a, b) { return b.leaguePoints - a.leaguePoints });
    makeTopItem();

    const to100 = [];
    for (i = 0; i < 100; i++){
        to100.push(Rank[i]);
    }

    to100.forEach((ranker, key) => {
        listMake(ranker,key);
    })
}

function listMake(ranker, key) {
    //console.log(ranker);
    let percent = ((ranker.wins / (ranker.wins + ranker.losses)) * 100).toFixed(0);
    const listItem = document.createElement("li");

    const Rank = document.createElement("p");
    Rank.className = "rank";

    const RankerName = document.createElement("p");
    RankerName.className = "rankerName";

    const LP = document.createElement("p");
    LP.className = "LP";

    const WL = document.createElement("div");
    WL.className = "winlose";
    const win = document.createElement("p");
    win.className = "win";
    win.style = `width:${percent}%`
    const loss = document.createElement("p");
    loss.className = "loss";
    loss.style = `width:${100-percent}%`

    const Odds = document.createElement("p");
    Odds.className = "Odds";

    Rank.innerText = `${key + 1}`
    RankerName.innerText = `${ranker.summonerName}`
    LP.innerText = `${ranker.leaguePoints}LP`
    
    win.innerText =`${ranker.wins}W`
    loss.innerText =`${ranker.losses}L`
    Odds.innerText = `${percent}%`
    
    Rankers.appendChild(listItem, Rankers.firstChild);
    listItem.appendChild(Rank);
    listItem.appendChild(RankerName);
    listItem.appendChild(LP);
    listItem.appendChild(WL);
    WL.appendChild(win);
    WL.appendChild(loss);
    listItem.appendChild(Odds);
}

function makeTopItem(){
    const topItem = document.createElement("li");
    Rankers.appendChild(topItem);
    topItem.className = "topItem";
    topItem.innerHTML = "<p>순위</p><p> 소환사</p><p>LP</p><p>승패</p><p>승률</p>";
}

