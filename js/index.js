const uid = document.querySelector(".id");
const ulevel = document.querySelector(".level");
const time = document.querySelector(".time");
const info = document.querySelector(".info");
const search = document.querySelector(".search");
const matchCon = document.querySelector(".matchCon");
const info2 = document.querySelector(".info2");
let matchInfomation = new Array();
let searchP = new Array();

const searchInner = document.querySelector(".search-inner");
const SearchList = document.querySelector('#search-list');

const SearchForm = document.querySelector('.search-form');
const SearchInput = SearchForm.querySelector('input');

//localStorage에 저장할 이름
const search_KEY1 = "searchPlayer";
const search_KEY2 = "searchChamp";


//submit 시에 handlesearchubmit 실행
SearchForm.addEventListener('submit',(e)=>{
    if (SearchInput.value == "") {
        e.preventDefault();
        alert("소환사명을 입력해주세요");
    } else { handlesearchubmit }
});

//검색목록 localStorage에 저장
function savesearch() { 
    typeof(Storage) !== 'undefined' && localStorage.setItem(search_KEY1, JSON.stringify(searchP));
};

//clickChampion을 localStorage에 저장
function champsearch(champ) { 
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
        champsearch("Akali");
        searchP.push(SearchPlayerObj);

        //가장 최신 검색 아이디가 맨 위로 오게하기
        paintsearch(searchP);
        savesearch();
        SearchInput.value = '';
        location.href = "./search.html";
    }
};


//clickChampion을 localStorage에 저장
function champsearch(champ) { 
    typeof(Storage) !== 'undefined' && localStorage.setItem("Champ", JSON.stringify(champ));
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

//item 삭제
function deletesearch(e) { 
    const li = e.target.parentElement;
    li.remove();
    searchP = searchP.filter((searchP) => searchP.id !== parseInt(li.id));
    savesearch();
};

//item 추가

SearchForm.addEventListener('submit', handlesearchubmit);

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
            const SearchPlayerObj = {
                id: Date.now(),
                text: n.innerText
            };
            champsearch("Akali");
            searchP.push(SearchPlayerObj);
            //가장 최신 검색 아이디가 맨 위로 오게하기
            paintsearch(searchP);
            savesearch();
            location.href = "./search.html";
        })
    });
}

SearchForm.addEventListener("click", () => {
    searchInner.classList.add("active");
})

document.addEventListener('click', function (e) {
    if (e.target.classList != 'inputID') {
        searchInner.classList.remove("active");
    }
})


//localStorage에서 item 가져오기
if(findSearch !== null) {
    searchP = findSearch
    window.onload = paintsearch(searchP);
}
