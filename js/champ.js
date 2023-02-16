let ChampName = "Akali";
const Info = document.querySelector(".Info");
const typeChamp = document.querySelectorAll(".typeChamp>li");
const champList = document.querySelector(".champList");
const champInfo = document.querySelector(".champInfo");

const SearchForm = document.querySelector('#search-form');
const SearchInput = SearchForm.querySelector('input');
const inputID = document.querySelector(".inputID");
inputID.setAttribute('placeholder',"챔피언을 입력해주세요");

const ChampMainPic = document.querySelector(".ChampMainPic");
//const  = document.querySelector(".");
const Champname = document.querySelector(".name");
const type = document.querySelector(".type");
const blurb = document.querySelector(".blurb");
const tagsImg = document.querySelectorAll(".tags>figure>img");
const story = document.querySelector(".story");
const stats = document.querySelector(".stats");
const info = document.querySelector(".info");
const passive = document.querySelector(".passive");
const spellBox = document.querySelectorAll(".spellBox");
const tips = document.querySelector(".tips");
const wiki = document.querySelector(".wikilink");
const skins = document.querySelector(".skins");
const skinspan = document.querySelector(".mainInfo>figure>span");
const popup = document.querySelector(".popup");
const popupEsc = document.querySelector(".popup>button");
const popupImg = document.querySelector(".popup>img");

let arry = [];
function fetchChamp(ChampName) {
  fetch(`./json/champion/${ChampName}.json`)
  .then((c) => c.json())
  .then((c) => {
    let champData = c.data[ChampName];
    
    //img
    ChampMainPic.src = `./img/champ2/${ChampName}_0.jpg`

    //이름,타이틀
    Champname.innerText = `${champData.name}, ${champData.title}`;

    //타입
    type.innerText = `타입 : ${champData?.partype}`

    //역할
    if(champData.tags.length==2){
      champData.tags.forEach((tags,key)=>{
        tagsImg[key].src = `./img/role/${tags}.png`
      })
    }else{
      tagsImg[0].src = `./img/role/${champData.tags}.png`;
      tagsImg[1].src = `./img/role/blank.png`
    }

    //스토리
    story.innerText = `${champData.blurb}`;


    //스텟
    let stat = champData.stats;
    stats.innerHTML = `
      <h3>챔피언 스탯</h3>
      <div><figure><img src="./img/StatMods/Health.png"><figcaption>HP </figcaption></figure>${stat.hp} (+${stat.hpperlevel})</div>
      <div><figure><img src="./img/StatMods/mp.png"><figcaption>MP</figcaption> </figure>${stat.mp} (+${stat.mpperlevel})</div>
      <div><figure><img src="./img/StatMods/Attack.png"><figcaption>공격력</figcaption> </figure>${stat.attackdamage} (+${stat.attackdamageperlevel})</div>
      <div><figure><img src="./img/StatMods/Armor.png"><figcaption>방어력</figcaption> </figure>${stat.armor} (+${stat.armorperlevel})</div>
      <div><figure><img src="./img/StatMods/MagicResist.png"><figcaption>마법저항력</figcaption> </figure> ${stat.spellblock}</div>
      <div><figure><img src="./img/StatMods/AttackSpeed.png"><figcaption>공격속도</figcaption> </figure>${stat.attackdamage}</div>
      <div><figure><img src="./img/StatMods/Speed.png"><figcaption>이동속도</figcaption> </figure>${stat.movespeed}</div>
      <div><figure><img src="./img/StatMods/Range.png"><figcaption>사거리</figcaption> </figure>${stat.attackrange}</div>
    `;

    //스킨 
    let cSkin = champData.skins.map((cd, idx)=>{
      if (idx != 0){
        return `
          <div>
            <img id=${idx} src="../img/champ2/${ChampName}_${cd.num}.jpg" alt="">
            <p>${cd.name}</p>
          </div>`}
    })
    skins.innerHTML= cSkin;
    const skinsImg = document.querySelectorAll(".skins>div>img");
    const skinEx = document.querySelector(".popup>p");
    console.log(skinEx)

    let skinNum = 0;
    skinsImg.forEach((img)=>{
      img.addEventListener('click',()=>{
        popup.style="display:block";
        popupImg.setAttribute('src',img.src);
        console.log(champData.skins)
        skinNum = img.id;
        skinEx.innerText=champData.skins[skinNum].name;
      })
    })
    popupEsc.addEventListener('click',()=>{
      popup.style="display:none";
    })
    const prevImg = document.querySelector(".left");
    const nextImg = document.querySelector(".right");

    prevImg.onclick = ()=>{
      if(skinNum>1){
        skinNum -=1;
        console.log(skinsImg);
        popupImg.setAttribute('src',skinsImg[skinNum-1].src);
        skinEx.innerText=champData.skins[skinNum].name;
      }
    }

    nextImg.onclick = ()=>{
      if(skinNum<skinsImg.length){
        skinNum = Number(skinNum)+1;
        console.log(skinNum);
        console.log(skinsImg);
        popupImg.setAttribute('src',skinsImg[skinNum-1].src);
        skinEx.innerText=champData.skins[skinNum].name;
      }
    }
    

    //챔피언정보
    info.innerHTML = `<h3>챔피언 정보</h3>`;
    let cinfo = champData.info;
    for (i in cinfo) {
      const div = document.createElement("div");
      div.innerHTML=`<p>${i}</p>`;
      for (let t = 0; t < cinfo[i]; t++) {
        const span = document.createElement("span");
        div.appendChild(span);
      }
      info.appendChild(div);
    }


    //패시브스킬
    passive.innerHTML = `
    <h4>${champData.passive.name} (Passive)</h4>
    <figure>
      <img src='./img/passive/${champData.passive.image.full}'>
      <p>${champData.passive.description}</p>
    </figure>
    `;

    //액티브스킬
    let spell = champData.spells;
    spellBox.forEach((spellBox,key)=>{
      spellBox.innerHTML = `
      <h4>${spell[key].name}</h4>
      <figure>
        <img src='./img/spell/${spell[key].id}.png'>
        <figcaption>${spell[key].description}</figcaption>
      </figure>
      <div>
        <p>재사용 대기시간 : ${spell[key].cooldownBurn}</p>
        <p>마나 소모량 : ${spell[key].costBurn}</p>
        <p>사거리 : ${spell[key].range[0]}</p>
      </div>
      `
    })

    let tip = champData.allytips;
    let Alltips = tip.map((tip,key)=>{
      return `<span>${key+1}. ${tip}</span>`
    })

    let enemytip = champData.enemytips;
    let Enemytips = enemytip.map((enemytip,key)=>{
      return `<span>${key+1}. ${enemytip}</span>`
    })
    tips.innerHTML = "<p>TIP</p>" + Alltips + "<p>상대 TIP</p>" + Enemytips;

    
    wiki.setAttribute('href', `https://namu.wiki/w/${champData.name}`);

    const mainImg = document.querySelector(".mainInfo>figure>img");

    mainImg.onclick= () => {
      skins.classList.toggle("active");
      story.classList.toggle("active");
      skinspan.innerText = (skinspan.innerText== "스킨보기" ? "스킨접기" : "스킨보기")
    };
  });
};

  let num1=0;

  typeChamp.forEach((t,key) => {
    t.addEventListener("click", () => {
      champList.innerHTML = "";
      typeChamp[num1].classList.remove("active");
      num1 = key;
      fetch(`./json/champion.json`)
        .then((r) => r.json())
        .then((c) => {
          c.forEach((c) => {
            if (c.tags[0] == t.className) {
              const champli = document.createElement("li");
              champli.className = c.id;
              champli.innerHTML = `${c.name}`;
              champList.appendChild(champli);
            }
          });
          const whatChamp = document.querySelectorAll(".champList>li");
          changeChamp(whatChamp);
          t.classList.add("active");
        });
    });
  });

const changeChamp = (arry) => {
  let num2=0;
  arry.forEach((t,key) => {
    t.addEventListener("click", () => {
      ChampName = t.className;
      fetchChamp(ChampName);
      arry[num2].classList.remove("active");
      num2 = key;
      t.classList.add("active");
      popup.style="display:none";
      skins.classList.remove("active");
      story.classList.remove("active");
      skinspan.innerText ="스킨보기";
    });
  });
};

//localStorage에서 item 가져오기
ChampName = JSON.parse(localStorage.getItem("searchChamp"));
window.onload = fetchChamp(ChampName);


function handlesearchubmit(e) { 
  e.preventDefault();
  if (SearchInput.value == "") {
      alert("챔피언을 입력해주세요!");
  }else{
      fetch(`./json/champion.json`)
      .then((r) => r.json())
      .then((c) => {
        c.forEach((cc)=>{
          if(cc.name == SearchInput.value){
            ChampName = cc.id
          }
        })
        fetchChamp(ChampName);
        inputID.value=""
      })
  }
};

SearchForm.addEventListener('submit', handlesearchubmit);
