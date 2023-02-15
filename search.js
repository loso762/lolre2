//https://developer.riotgames.com/ api 받는 주소
const APIKEY = "RGAPI-253dad5e-d655-4fd6-a757-8da27b16c475"
const MatchNum = 10;

const uid = document.querySelector(".id");
const ulevel = document.querySelector(".level");
const time = document.querySelector(".time");
const info = document.querySelector(".info");
const search = document.querySelector(".search");
const matchCon = document.querySelector(".matchCon");
const info2 = document.querySelector(".info2");
let matchInfomation = new Array();
let searchP = new Array();
let T = "";

const form = document.querySelector(".form");
const searchInner = document.querySelector(".search-inner");
const SearchForm = document.querySelector('#search-form');
const SearchInput = SearchForm.querySelector('input');
const SearchList = document.querySelector('#search-list');
//localStorage에 저장할 이름
const search_KEY = "searchPlayer";

//모든 게임정보 가져오기
function PlzInfo(UID) {
    let UserId = UID;
    
    //소환사명으로 정보 가져오기
    fetch(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${UserId}?api_key=${APIKEY}`)
    .then((r) => r.json())
    .then((userData) => {
        uid.innerHTML = `ID : ${userData.name}`;
        ulevel.innerHTML = `Level : ${userData.summonerLevel}`;
        const puuid1 = userData.puuid;
            
        document.querySelector("body").style = "background : none"
        info.style = " display : flex";
        info2.innerHTML = "";
        let matchConL = [];
        search.classList.add("active");

            //최근 게임 matchID 불러오기
            fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid1}/ids?start=0&count=${MatchNum}&api_key=${APIKEY}`)
                .then((r) => r.json())
                .then((match) => {
                    //console.log(match) 

                    match.forEach((m) => {
                        // 불러온 matchID로 match 정보 가져오기
                        fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/${m}?api_key=${APIKEY}`)
                            .then((r5) => r5.json())
                            .then((matchInfo) => {
                                //매치정보
                                let WhatMatch = matchInfo.info.queueId;
                                if (WhatMatch == 420) { WhatMatch = "솔로랭크" }
                                else if (WhatMatch == 430) { WhatMatch = "일반게임" }
                                else if (WhatMatch == 440) { WhatMatch = "자유랭크" }
                                else if (WhatMatch == 450) { WhatMatch = "칼바람" }
                                else if (WhatMatch == 900) { WhatMatch = "U.R.F." }
                    
                                // 매치종료시간
                                let ENDTIME = matchInfo.info.gameEndTimestamp;
                                let now = new Date(), endTime = new Date(ENDTIME), EndPlay;
                                let lasttime = Math.ceil((now - endTime) / 1000 / 60);
                                if (lasttime >= 1440) {
                                    EndPlay = `${Math.floor(lasttime / 60 / 24)}일 전`
                                }
                                else if (lasttime >= 60 && lasttime < 1440) {
                                    EndPlay = `${(Math.floor(lasttime / 60)) % 24}시간 전`
                                }
                                else { EndPlay = `${lasttime % 60}분 전` }

                    
                                // 매치 플레이 타임
                                let Duration = matchInfo.info.gameDuration;
                                let Playtime = `${Math.floor(Duration / 60)}분 ${Duration % 60}초`;
                    
                                //매치참여 유저들 정보로 li만들어 넣기
                                let PARTY = matchInfo.info.participants;
                                //console.log(PARTY);
                                let matchUsers = PARTY.map((p) => {
                                    return `<li class="matchplayer">${p.summonerName}  <img src="../img/champion/${p.championName}.png" alt=""> <p> ${p.kills} / ${p.deaths} / ${p.assists}</p></li>`
                                })

                                ////검색 유저 정보
                                let myplayer = PARTY.filter((t) => t.puuid == puuid1)[0];
                                //console.log(myplayer);


                                //장착 룬
                                myRune1 = myplayer.perks.styles[1].style;
                                myRune2 = myplayer.perks.styles[0].selections[0].perk;

                                //총 데미지, 받은 피해량
                                let damage = myplayer.totalDamageDealtToChampions;
                                let damaged = myplayer.totalDamageTaken;



                                //사용 아이템
                                myItem = [myplayer.item0, myplayer.item1, myplayer.item2, myplayer.item3, myplayer.item4, myplayer.item5, myplayer.item6];
                                let Items = myItem.map((I) => {
                                    return `<img class="Item" src="../img/item/${I}.png" alt="">`
                                })


                                //승패여부
                                if (myplayer.win == true) { win = `<li class="YouWin">승리</li>` } else { win = `<li class="YouLose">패배</li>` };


                                //킬데스
                                let KD = `${myplayer.kills} / <span style="color:red">${myplayer.deaths}</span> / ${myplayer.assists}`;

                                //킬관여도 계산
                                let allKill = [];
                                let allKills = 0;
                                (PARTY.filter((p) => p.win == myplayer.win)).forEach((p) => {
                                    allKill.push(p.kills);
                                })
                                allKill.forEach((a) => { allKills = allKills + a; })
                                let KDV = Math.round((myplayer.kills + myplayer.assists) / allKills * 100);

                                //평점
                                let KDP = ((myplayer.kills + myplayer.assists) / myplayer.deaths).toFixed(2);

                                //CS 계산
                                let CS = myplayer.totalMinionsKilled;
                                let CSperM = ((myplayer.totalMinionsKilled / Duration) * 60).toFixed(1);
                    

                                //info2에 매치정보 담은 div 생성
                                info2Data = (
                                    `<div class="matchCon">${ENDTIME}
                    <div class="match">
                        <ul class="matchInfo1">
                            <li class="endPlay">${EndPlay}</li>
                            <li class="matchID">${WhatMatch}</li>
                            ${win}
                            <li class="playTime">${Playtime}</li>
                        </ul>
                        <figure>
                            <img class="Pickchamp" src="../img/champion/${myplayer.championName}.png">
                            <figcaption class="champLevel">${myplayer.champLevel}</figcaption>
                        </figure>
                        <ul class="matchInfo2">
                            <li class="spells">
                                <img class="rune" src="../img/rune/${myRune1}.png">
                                <img class="rune" src="../img/rune2/${myRune2}.png">
                                <img class="spell" src="../img/spell/${myplayer.summoner1Id}.png">
                                <img class="spell" src="../img/spell/${myplayer.summoner2Id}.png">
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
                            <li class="cs">CS : ${CS}(${CSperM})</li>
                            
                        </ul>
                    </div>
                    <ul class="matchList">${matchUsers}</ul>
                </div>` )

                                //매치 시간별로 정렬
                                matchConL.push(info2Data);
                                matchConL.sort(function (a, b) {
                                    if (a < b) return 1;
                                    if (a > b) return -1;
                                    if (a === b) return 0;
                                });

                                info2.innerHTML = matchConL;

                            });
                    });
                });


            //랭크전 티어, 전적 불러오기
            fetch(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${userData.id}?api_key=${APIKEY}`)
                .then((r) => r.json())
                .then((Rankdata) => {
                    const freetier = document.querySelector(".freetier");
                    const freerecord = document.querySelector(".freerecord");
                    const solotier = document.querySelector(".solotier");
                    const solorecord = document.querySelector(".solorecord");

                    if (Rankdata != "") {
                        const rate = (Rankdata[0].wins / (Rankdata[0].wins + Rankdata[0].losses) * 100).toFixed(1);
                        if (Rankdata[0].queueType == "RANKED_FLEX_SR") {
                            freetier.innerHTML = `티어 : ${Rankdata[0].tier} ${Rankdata[0].rank} <img class="tierImg" src="../img/rank/${Rankdata[0].tier}.png">`;
                            freerecord.innerHTML = `전적 : ${Rankdata[0].wins}승${Rankdata[0].losses}패 ( 승률 : ${rate}% )`;
                            solotier.innerHTML = "티어 : Unranked";
                            solorecord.innerHTML = "전적 : 기록 없음";
                        } else if (Rankdata[0].queueType == "RANKED_SOLO_5x5") {
                            solotier.innerHTML = `티어 : ${Rankdata[0].tier} ${Rankdata[0].rank} <img class="tierImg" src="../img/rank/${Rankdata[0].tier}.png">`;
                            solorecord.innerHTML = `전적 : ${Rankdata[0].wins}승${Rankdata[0].losses}패 ( 승률 : ${rate}% )`;
                            freetier.innerHTML = "티어 : Unranked";
                            freerecord.innerHTML = "전적 : 기록 없음";
                        }
                    } else {
                        solotier.innerHTML = "티어 : Unranked";
                        solorecord.innerHTML = "전적 : 기록 없음";
                        freetier.innerHTML = "티어 : Unranked";
                        freerecord.innerHTML = "전적 : 기록 없음";
                    }
                });
    }).catch(error => alert("소환사명을 정확히 입력해 주세요!"));
    

};

form.addEventListener("click", () => {
    searchInner.classList.add("active");
})

document.addEventListener('click', function (e) {
    if (e.target.classList != 'inputID') {
        searchInner.classList.remove("active");
    }
})


//item을 localStorage에 저장
function savesearch() { 
            typeof(Storage) !== 'undefined' && localStorage.setItem(search_KEY, JSON.stringify(searchP));
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
        searchP.sort(function (a, b) { return b.id - a.id });
        if (searchP.length >= 5) {
            searchP.splice(4, 1);
            SearchList.removeChild(SearchList.lastChild);
        }
        paintsearch(SearchPlayerObj);
        savesearch();
        PlzInfo(SearchInput.value);
        SearchInput.value = '';
    }
};

//item 삭제
function deletesearch(e) { 
            const li = e.target.parentElement;
            li.remove();
            searchP = searchP.filter((searchP) => searchP.id !== parseInt(li.id));
            savesearch();
};

//item 추가
function paintsearch(SearchPlayer) { 
            const {id, text} = SearchPlayer;
    const item = document.createElement("li");
    const span = document.createElement("span");
    span.className="NewSearch"
            const button = document.createElement("button");
            item.id = id;
            span.innerText = text;
            button.innerText = 'X';
            button.addEventListener("click", deletesearch);
            item.appendChild(span);
            item.appendChild(button);
            SearchList.insertBefore(item,SearchList.firstChild);
            searchInner.classList.remove("active");
};

SearchForm.addEventListener('submit', handlesearchubmit);

//localStorage에서 item 가져오기
const findSearch = JSON.parse(localStorage.getItem(search_KEY));
if(findSearch !== null) {
    searchP = findSearch //전에 있던 items 유지
    findSearch.forEach(paintsearch);
}

//최근검색 목록으로 정보 불러오기
const NS = document.querySelectorAll(".NewSearch")
NS.forEach((n) =>
    n.addEventListener("click", (e) => {
        PlzInfo(e.target.innerText);
        SearchInput.value = '';
    })
);