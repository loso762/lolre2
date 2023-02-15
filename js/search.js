const APIKEY = "RGAPI-276cb608-d858-41fd-a5b2-1836549ff72c"
//불러오려는 최근경기 수
const MatchNum = 10;

const WLPER = document.querySelector(".WLPER");
const recentWL = document.querySelector(".recentWL");
const recentKD = document.querySelector(".recentKD");
const recentKDV = document.querySelector(".recentKDV");
const recentKDP = document.querySelector(".recentKDP");
const piechart = document.querySelector(".pie-chart");
const center = document.querySelector(".center");
const uid = document.querySelector(".id");
const ulevel = document.querySelector(".level");
const mainPosition = document.querySelector(".mainPosition");

const Myline = document.querySelectorAll(".myline");

const time = document.querySelector(".time");
const info = document.querySelector(".info");
const info2 = document.querySelector(".info2");
const search = document.querySelector(".search");
const matchCon = document.querySelector(".matchCon");
let matchInfomation = new Array();
let searchP = new Array();
let T = "";

let spell = [];
let spell1, spell2 = "";
const itemsJSON = [];

const form = document.querySelector(".form");
const searchInner = document.querySelector(".search-inner");
const SearchForm = document.querySelector('#search-form');
const SearchInput = SearchForm.querySelector('input');

const freetier = document.querySelector(".freetier");
const freerecord = document.querySelector(".freerecord");
const soloLP = document.querySelector(".soloLP");
const soloRankImg = document.querySelector(".soloRankImg");

const solotier = document.querySelector(".solotier");
const solorecord = document.querySelector(".solorecord");
const freeLP = document.querySelector(".freeLP");
const freeRankImg = document.querySelector(".freeRankImg");

function solo0(){
    solotier.innerHTML = "TIER : Unranked";
    solorecord.innerHTML = "전적 : 기록 없음";
    soloLP.innerHTML = "LP : 0";
    soloRankImg.src = "";
}
function free0(){
    freetier.innerHTML = "TIER : Unranked";
    freeLP.innerHTML = "LP : 0";
    freerecord.innerHTML = "전적 : 기록 없음";
    freeRankImg.src = "";
}

//유저 검색 시 localStorage에 저장할 이름
const search_KEY1 = "searchPlayer";
const search_KEY2 = "searchChamp";

const link = document.querySelectorAll("a");
link.forEach((a) => {
    a.addEventListener("click", (e) => {
        if (window.location.href == a.href) {
            e.preventDefault();
        }
    })
})

let param = new URLSearchParams(window.location.search);

//모든 게임정보 가져오기
async function PlzInfo(UID) {

    //소환사명으로 정보 가져오기
    let response = await fetch(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${UID}?api_key=${APIKEY}`);
    let userData = await response.json();

    uid.innerHTML = `ID : ${userData.name}`;
    ulevel.innerHTML = `Level : ${userData.summonerLevel}`;
    
    info2.innerHTML = "";
    search.classList.add("active");

    let mywin = 0,
        mykill = 0, mydeath = 0, myassist = 0, 
        myKDV = 0, myKDP = 0, 
        myPosition = [],
        matchConL = [];

    let r2 = await fetch(`https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${userData.id}?api_key=${APIKEY}`);
    let AllChamp = await r2.json();

    let r3 = await fetch(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${userData.id}?api_key=${APIKEY}`);
    let Rankdata = await r3.json();
    
    let r4 = await fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${userData.puuid}/ids?start=0&count=${MatchNum}&api_key=${APIKEY}`);
    let matchI = await r4.json();

        //매치정보
        let mnum= 0;
        matchI.forEach((m) => {
            // 불러온 matchID로 match 정보 가져오기
            (async ()=>{
                await fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/${m}?api_key=${APIKEY}`)
                    .then((r5) => r5.json())
                    .then((matchInfo) => {

                        //매치정보    
                        function WhatMatchFn(math){
                            if (math == 420) {return "솔로랭크" }
                            else if (math == 430) { return "일반게임" }
                            else if (math == 440) { return "자유랭크" }
                            else if (math == 450) { return "칼바람" }
                            else if (math == 900) { return "U.R.F." }
                        }

                        // 매치종료시간
                        let ENDTIME = matchInfo.info.gameEndTimestamp;
                        let now = new Date(), endTime = new Date(ENDTIME);
                        let lasttime = Math.ceil((now - endTime) / 1000 / 60);

                        function EndPlay(last){
                            if (last >= 1440) {return `${Math.floor(lasttime / 60 / 24)}일 전`}
                            else if (lasttime >= 60 && lasttime < 1440) {return `${(Math.floor(lasttime / 60)) % 24}시간 전`}
                            else { return `${lasttime % 60}분 전` }
                        }

                        // 매치 플레이 타임
                        let Duration = matchInfo.info.gameDuration;
                        let Playtime = `${Math.floor(Duration / 60)}분 ${Duration % 60}초`;

                        //매치참여 유저들 정보로 li만들어 넣기
                        let PARTY = matchInfo.info.participants;
                        console.log(PARTY)

                        //console.log(PARTY);
                        let matchUsers = PARTY.map((p) => {
                            return `<li class="matchplayer">${p.summonerName}  <img src="./img/champion/${p.championName}.png" alt=""> <p> ${p.kills} / ${p.deaths} / ${p.assists}</p></li>`
                        })
    
    ////검색 유저 정보
                        let myplayer = PARTY.filter((t) => t.puuid == userData.puuid)[0];
                        myPosition.push(myplayer.teamPosition);
    
                        //장착 룬
                        const myRune1 = myplayer.perks.styles[1].style;
                        const myRune2 = myplayer.perks.styles[0].selections[0].perk;
                        
                        let Rune1des,Rune2des;
                        runeJSON.forEach((Rune) => {
                            Rune[0].id == myRune1 && (Rune1des = `${Rune[0].name} 룬`);
                            Rune[0].id == myRune2 && (Rune2des = `${Rune[0].name} : ${Rune[0].shortDesc}`);
                        });
    
    
                        //사용 아이템
                        let myItem = [myplayer.item0, myplayer.item1, myplayer.item2, myplayer.item3, myplayer.item4, myplayer.item5, myplayer.item6];
                        let myItemEx = [];
                        
                        myItem.forEach((M) => {
                            myItemEx.push((itemsJSON.filter(I => I[0] == M))[0][1].name)
                        })
    
                        let Items;
                        myItem.map((I, key) => {
                            let width = myItemEx[key]?.length*12.5;

                            Items +=`<figure>
                                        <img class="Item" src="./img/item/${I}.png" alt="">
                                        <p style="width:${width}px">${myItemEx[key]}</p>
                                    </figure>`
                        })
    
                        //총 데미지, 받은 피해량
                        let damage = myplayer.totalDamageDealtToChampions;
                        let damaged = myplayer.totalDamageTaken;
    
                        //승패여부
                        win = myplayer.win ? `<li class="YouWin">승리</li>` : `<li class="YouLose">패배</li>`;
                        myplayer.win && ++mywin ;
                        
                        //킬데스
                        let KD = `${myplayer.kills} / <span>${myplayer.deaths}</span> / ${myplayer.assists}`;
                        
                        let teamColor;
                        myplayer.win ? teamColor = "#9dc7f4d2" : teamColor = "#f49da9d2;";
                        

                        //킬관여도 계산
                        allKills = (PARTY.filter((p) => p.win == myplayer.win)).reduce((a,b) => {return a + b.kills},0);
                        let KDV = (myplayer.kills != 0 ? Math.round((myplayer.kills + myplayer.assists) / allKills * 100) : 0);

                        //평점
                        let KDP;
                        if (myplayer.kills == 0 && myplayer.deaths == 0) {
                            KDP = 0.0
                        }else if(myplayer.deaths == 0) {
                            KDP = myplayer.kills
                        } else {
                            KDP = ((myplayer.kills + myplayer.assists) / myplayer.deaths).toFixed(1);
                        }
    
                        //CS 계산
                        let CS = myplayer.totalMinionsKilled;
                        let CSperM = ((myplayer.totalMinionsKilled / Duration) * 60).toFixed(1);
    
    
                        mykill += myplayer.kills;
                        mydeath += myplayer.deaths;
                        myassist += myplayer.assists;
                        myKDP += Number(KDP);
                        myKDV += Number(KDV);
    
                        if(myplayer.teamPosition == "UTILITY"){
                            myplayer.teamPosition = "SUPPORT"
                        };
                        
                        //spell 설명 만들기
                        spell.forEach((sp) => {
                            if (sp.key == myplayer.summoner2Id) {
                                spell2 = `${sp.name} : ${sp.description}`;
                            };
                            if (sp.key == myplayer.summoner1Id) {
                                spell1 = `${sp.name} : ${sp.description}`;
                            };
                        });
    
    
                    //info2에 매치정보 담은 div 생성
                    info2Data = (
                            `<div class="matchCon" id="${ENDTIME}" style="background:${teamColor}">
                                <div class="match">
                                    <ul class="matchInfo1">
                                        <li class="endPlay">${EndPlay(lasttime)}</li>
                                        <li class="matchID">${WhatMatchFn(matchInfo.info.queueId)}</li>
                                        ${win}
                                        <li class="playTime">${Playtime}</li>
                                    </ul>
                                    <figure>
                                        <img class="Pickchamp" id="${myplayer.championName}" src="./img/champion/${myplayer.championName}.png">
                                        <figcaption class="champLevel">${myplayer.champLevel}</figcaption>
                                        <p class="lane">${myplayer.teamPosition}</p>
                                    </figure>
                                    <ul class="matchInfo2">
                                        <li class="spells">
                                            <figure>
                                                <img class="rune" src="./img/rune/${myRune1}.png">
                                                <figcaption>${Rune1des}</figcaption>
                                            </figure>
                                            <figure>
                                                <img class="rune" src="./img/rune/${myRune2}.png">
                                                <figcaption>${Rune2des}</figcaption>
                                            </figure>
                                            <figure>
                                            <img class="spell" src="./img/spell/${myplayer.summoner2Id}.png">
                                            <figcaption>${spell2}</figcaption>
                                            </figure>
                                            <figure>
                                            <img class="spell" src="./img/spell/${myplayer.summoner1Id}.png">
                                            <figcaption>${spell1}</figcaption>
                                            </figure>
                                        </li>                        
                                        <li class="KD">
                                            <p>${KD}</p>
                                            <p>킬 관여 : ${KDV}%</p>
                                            <p>평점 : ${KDP}</p>                                
                                        </li>
                                        <li class="myItems">
                                            ${Items}
                                        </li>
                                    </ul>
                                    <ul class="matchInfo3">
                                        <li class="damage">딜량 : ${damage}</li>
                                        <li class="damaged">피해량 : ${damaged}</li>
                                        <li class="ward">제어와드 : ${myplayer.visionWardsBoughtInGame}</li>
                                        <li class="cs">CS : ${CS} (${CSperM})</li>
                                        
                                    </ul>
                                </div>
                                <ul class="matchList">${matchUsers}</ul>
                    </div>` )
    
                        //매치 시간별로 정렬
                        //console.log(matchConL);
                        matchConL.push(info2Data);
                        matchConL.sort(function (a, b) {
                            if (a < b) return 1;
                            if (a > b) return -1;
                        });
                        info2.innerHTML = matchConL;
                        let MyChampImg = document.querySelectorAll(".match>figure>img");
                        champClick(MyChampImg);
                    });
                mnum++;
                if(mnum == (MatchNum-1)) 소환사정보내용갱신();
            })();
        });
        
    function 소환사정보내용갱신(){
        let per = (mywin / MatchNum * 100);
        piechart.style = `background: conic-gradient(#5383E8 0% ${per}%,#E84057 ${per}% 100%)`
        recentWL.innerText = `${mywin} 승 ${MatchNum - mywin} 패`
        recentKD.innerHTML = `${(mykill / MatchNum).toFixed(1)} / <span> ${(mydeath / MatchNum).toFixed(1)} </span> / ${(myassist / MatchNum).toFixed(1)}`;
        recentKDP.innerHTML = `평점 : ${(myKDP / MatchNum).toFixed(1)}`;
        recentKDV.innerHTML = `킬관여 : ${(myKDV / MatchNum).toFixed(1)}%`;
        center.innerText = `${(per).toFixed(1)}%`;

        Myline.forEach((m) => {
            m.id == getMode(myPosition) ? m.style="height:100%" : m.style="height:1%"
        })
    }

        //랭크정보
        if (Rankdata != "") {
            const rate = (Rankdata[0].wins / (Rankdata[0].wins + Rankdata[0].losses) * 100).toFixed(1);
            if (Rankdata[0].queueType == "RANKED_FLEX_SR") {
                freetier.innerHTML = `TIER : ${Rankdata[0].tier} ${Rankdata[0].rank}`;
                freeRankImg.src = `./img/rank/${Rankdata[0].tier}.png`;
                freerecord.innerHTML = `전적 : ${Rankdata[0].wins}승 ${Rankdata[0].losses}패 ( ${rate}% )`;
                freeLP.innerHTML = `LP : ${Rankdata[0].leaguePoints}`;

                solo0();
            } else if (Rankdata[0].queueType == "RANKED_SOLO_5x5") {
                solotier.innerHTML = `TIER : ${Rankdata[0].tier} ${Rankdata[0].rank}`;
                soloRankImg.src = `./img/rank/${Rankdata[0].tier}.png`;
                solorecord.innerHTML = `전적 : ${Rankdata[0].wins}승 ${Rankdata[0].losses}패 ( ${rate}% )`;
                soloLP.innerHTML = `LP : ${Rankdata[0].leaguePoints}`;

                free0();
            } else if (Rankdata[0].queueType == "RANKED_TFT_DOUBLE_UP" && Rankdata[1].queueType == "RANKED_SOLO_5x5") {
                solotier.innerHTML = `TIER : ${Rankdata[1].tier} ${Rankdata[1].rank}`;
                soloRankImg.src = `./img/rank/${Rankdata[1].tier}.png`;
                solorecord.innerHTML = `전적 : ${Rankdata[1].wins}승 ${Rankdata[1].losses}패 ( ${rate}% )`;
                soloLP.innerHTML = `LP : ${Rankdata[1].leaguePoints}`;

                free0();
            } else if (Rankdata[0].queueType == "RANKED_TFT_DOUBLE_UP" && Rankdata[1].queueType == "RANKED_FLEX_SR") {
                freetier.innerHTML = `TIER : ${Rankdata[1].tier} ${Rankdata[1].rank}`;
                freeRankImg.src = `./img/rank/${Rankdata[1].tier}.png`;
                freerecord.innerHTML = `전적 : ${Rankdata[1].wins}승 ${Rankdata[1].losses}패 ( ${rate}% )`;
                freeLP.innerHTML = `LP : ${Rankdata[1].leaguePoints}`;

                solo0();
            }
        } else {
            free0();
            solo0();
        }
        
        //챔프정보
        const likeChamp = document.querySelectorAll(".likeChamp>ul>li");

        AllChamp.sort(function (a, b) { return b.championPoints - a.championPoints });
        let topChamp = AllChamp.slice(0,5)
    
        topChamp.forEach((tc,key)=>{
            fetch("./json/champion.json")
                .then((r) => r.json())
                .then((champdata) => { 
                    (champdata).forEach((c) => {
                        if (tc.championId == c.key) {
                            let now = new Date(), endTime = new Date(tc.lastPlayTime);
                            let lasttime = Math.ceil((now - endTime) / 1000 / 60);
                            if (lasttime >= 1440) { EndPlay = `${Math.floor(lasttime / 60 / 24)}일 전`}
                            else if (lasttime >= 60 && lasttime < 1440) { EndPlay = `${(Math.floor(lasttime / 60)) % 24}시간 전` }
                            else { EndPlay = `${lasttime % 60}분 전` }

                            likeChamp[key].innerHTML = `<img src="./img/champion/${c.id}.png"> <h4>${c.name}</h4><p>${tc.championPoints}</p><p>${EndPlay}</p>`
                        }
                    });
                    const LChamp = document.querySelectorAll(".likeChamp>li");
                    champClick(LChamp);
                })
        })
};

//챔피언 사진 클릭시 해당 챔피언 설명 페이지로 이동
function champClick(arry){
    arry.forEach((l)=>{
        l.addEventListener("click",()=>{
            pushChamp(l.id);
            location.href = "./champ.html";
        })
    })
}


//검색목록 localStorage에 저장
function savesearch() { 
    typeof(Storage) !== 'undefined' && localStorage.setItem(search_KEY1, JSON.stringify(searchP));
};

//clickChampion을 localStorage에 저장
function pushChamp(champ) { 
    typeof(Storage) !== 'undefined' && localStorage.setItem(search_KEY2, JSON.stringify(champ));
};

//form 전송
function handlesearchubmit(e) { 
    e.preventDefault();
    if (SearchInput.value == "") {
        alert("소화사명을 입력해주세요!");
    }else{
        const SearchPlayerObj = {
            id: Date.now(),
            text: SearchInput.value
        };
        
        searchP.push(SearchPlayerObj);

        //가장 최신 검색 아이디가 맨 위로 오게하기
        paintsearch(searchP);
        savesearch();
        PlzInfo(SearchInput.value);
        SearchInput.value = '';
    }
};

//최신 검색 아이디 상단정렬, 검색 기록개수 제한 , 검색기록 li 만들기
function paintsearch(SS){
    SS.sort(function (a, b) { return b.id - a.id });
    if (SS.length >= 5) {
        SS = SS.slice(0,4);
    }
    SearchList.innerHTML="";
    SS.forEach((s)=>{
        const item = document.createElement("li");
        const span = document.createElement("span");
        span.className="NewSearch"
        const button = document.createElement("button");
        span.innerText = s.text;
        button.innerText = 'X';
        button.addEventListener("click", deletesearch);
        item.appendChild(span);
        item.appendChild(button);
        SearchList.appendChild(item);
        searchInner.classList.remove("active");
    })
    listClick();
}

//item 추가
const SearchList = document.querySelector('#search-list');
//item 삭제
function deletesearch(e) { 
    const li = e.target.parentElement;
    li.remove();
    searchP = searchP.filter((searchP) => searchP.id !== parseInt(li.id));
    savesearch();
};


//localStorage에서 item 가져오기
const findSearch = JSON.parse(localStorage.getItem(search_KEY1));
if(findSearch !== null) {
    searchP = findSearch //전에 있던 items 유지
    //findSearch.forEach(paintsearch);
}


//최근검색 목록으로 정보 불러오기
function listClick() {
    const NS = document.querySelectorAll(".NewSearch");
    NS.forEach((n) => {
            n.addEventListener("click", (e) => {
                PlzInfo(e.target.innerText);
                SearchInput.value = '';
            })
        }
    );
}

form.addEventListener("click", () => {
    searchInner.classList.add("active");
})
document.addEventListener('click', function (e) {
    if (e.target.classList != 'inputID') {
        searchInner.classList.remove("active");
    }
})

SearchForm.addEventListener('submit', handlesearchubmit);


// 배열의 최빈값 구하기
function getMode(array){
    const counts = array.reduce((pv, cv)=>{
        pv[cv] = (pv[cv] || 0) + 1;
        return pv;
    }, {});

    const keys = Object.keys(counts);
    let mode = keys[0];
    keys.forEach((val)=>{
        if(counts[val] > counts[mode]){
            mode = val;
        }
    });
    return mode;
}

positiondiv = document.querySelectorAll(".mainPosition>div");
positiondiv.forEach((e) => {
    e.addEventListener("mouseover", () => {
        console.log();
        (e.childNodes[2]).style = "display:flex"
    })
    e.addEventListener("mouseout", () => {
        (e.childNodes[2]).style = "display:none"
    })
})

fetch(`./json/summoner.json`)
.then((r) => r.json())
.then((c) => { spell = c; })

fetch(`./json/item.json`)
.then((r) => r.json())
.then((c) => { 
    for (i in c) { itemsJSON.push([i, c[i]]); }
})

const runeJSON =[]
fetch(`./json/rune.json`)
.then((r) => r.json())
.then((c) => { 
    for (i in c) { runeJSON.push([c[i]]);}
})

//localStorage에서 item 가져오기
if(findSearch !== null) {
    searchP = findSearch
    window.onload = PlzInfo(searchP[0].text),paintsearch(searchP);
}

