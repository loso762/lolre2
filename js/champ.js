let ChampName = "Akali";
const Info = document.querySelector(".Info");
const typeChamp = document.querySelectorAll(".typeChamp>li");
const champList = document.querySelector(".champList");
const champul = document.querySelector(".champInfo");


const SearchForm = document.querySelector('#search-form');
const SearchInput = SearchForm.querySelector('input');
const inputID = document.querySelector(".inputID");

let arry = [];
const fetchChamp = (ChampName) => {
  fetch(`./json/champion/${ChampName}.json`)
    .then((r) => r.json())
    .then((c) => {
      let Ob;
      let champData = c.data[ChampName];
      
      for (i in champData) {
        if (typeof champData[i] != "object") {
          const champli = document.createElement("li");
          champli.innerHTML = `${champData[i]}`;
          champli.className = i;
          champul.appendChild(champli);
          if (i == "blurb") {
            champli.innerHTML = `${champData[i]}`;
          }
          if (i == "partype") {
            champli.innerHTML = `타입 : ${champData[i]}`;
          }
          if (i == "title") {
            champli.innerHTML = `, ${champData[i]}`;
            champli.style = `left: calc(300px + ${champData.name.length * 26}px)`;
          }
        } else {
          Ob = champData[i];
          const champli = document.createElement("li");
          champli.className = i;
          champul.appendChild(champli);
          if (i == "image") {
            champul.insertBefore(champli, champul.firstChild);
            champli.innerHTML = `<img src="./img/champ2/${ChampName}_0.jpg"><span>스킨 보기</span>`;

          } else if (i == "skins") {
            for (k in Ob) {
              if (Ob[k].num != 0) {
                const champFig = document.createElement("figure");
                champli.appendChild(champFig);
                cSkin = document.createElement("img");
                cSkin.className = "skin";
                cfigcaption = document.createElement("figcaption");
                cSkin.src = `./img/champ2/${ChampName}_${Ob[k].num}.jpg`;
                cfigcaption.innerHTML = `${Ob[k].name}`;
                champFig.appendChild(cSkin);
                champFig.appendChild(cfigcaption);
              }
            }
          } else if (i == "stats") {
            champli.innerHTML = `<h3>스탯</h3>
                                    <p><span><img src="./img/StatMods/Health.png">HP </span>${Ob.hp} (+${Ob.hpperlevel})</p>
                                    <p><span><img src="./img/StatMods/mp.png">MP </span>${Ob.mp} (+${Ob.mpperlevel})</p>
                                    <p><span><img src="./img/StatMods/Attack.png">공격력 </span>${Ob.attackdamage} (+${Ob.attackdamageperlevel})</p>
                                    <p><span><img src="./img/StatMods/Armor.png">방어력 </span>${Ob.armor} (+${Ob.armorperlevel})</p>
                                    <p><span><img src="./img/StatMods/MagicResist.png">마법저항력 </span> ${Ob.spellblock}</p>
                                    <p><span><img src="./img/StatMods/AttackSpeed.png">공격속도 </span>${Ob.attackdamage}</p>
                                    <p><span><img src="./img/StatMods/Speed.png">이동속도 </span>${Ob.movespeed}</p>
                                    <p><span><img src="./img/StatMods/Range.png">사거리 </span>${Ob.attackrange}</p>`;
          } else if (i == "info") {
            champli.innerHTML = `<h3>챔피언 정보</h3>`;
            for (i in Ob) {
              const div = document.createElement("div");
              champli.appendChild(div);
              div.innerHTML = `<p>${i}</p>`;
              for (let t = 0; t < Ob[i]; t++) {
                const div2 = document.createElement("div");
                div2.className = "infodiv";
                div.appendChild(div2);
              }
            }
          } else if (i == "passive") {
            const h3 = document.createElement("h3");
            h3.className="skillh3"
            h3.innerText="스킬"
            champul.appendChild(h3);
            champli.innerHTML = `<h4>(Passive) ${Ob.name}</h4>
                                <figure>
                                  <img src="./img/passive/${Ob.image.full}">
                                  <figcaption>${Ob.description}</figcaption>
                                </figure>`;
            champul.appendChild(champli);
          } else if (i == "spells") {
            let key = "(Q)";
            for (k in Ob) {
              if (k == 1) {
                key = "(W)";
              } else if (k == 2) {
                key = "(E)";
              } else if (k == 3) {
                key = "(R)";
              } else {
                key = "(Q)";
              }
              const div = document.createElement("div");
              div.className = "spellBox";
              champli.appendChild(div);
              const h4 = document.createElement("h4");
              h4.innerHTML = `${key} ${Ob[k].name}`;
              div.appendChild(h4);
              const spellFig = document.createElement("figure");
              div.appendChild(spellFig);
              spellFig.innerHTML = `<img src="./img/spell/${Ob[k].id}.png"><figcaption>${Ob[k].description}</figcaption>
                                        `;
              const spellDiv = document.createElement("div");
              spellDiv.innerHTML = `<p>재사용 대기시간 : ${Ob[k].cooldownBurn}</p>
                                        <p>마나 소모량 : ${Ob[k].costBurn}</p>
                                        <p>사거리 : ${Ob[k].rangeBurn}</p>`;
              div.appendChild(spellDiv);
            }
          } else if (i == "allytips") {
            champli.innerHTML = "<p>TIP</p>";
            champData[i].forEach((c, key) => {
              champli.innerHTML += `<br>${key + 1}. ${c}<br>`;
            });
          } else if (i == "enemytips") {
            champli.innerHTML = "<p>상대 TIP</p>";
            champData[i].forEach((c, key) => {
              champli.innerHTML += `<br>${key + 1}. ${c}<br>`;
            });
          } else if (i == "tags") {
            if(champData[i][1] == null){
              champli.innerHTML = `<div>주역할군<img src="./img/role/${champData[i]}.png"></div> <div>부역할군<img src="./img/role/blank.png"></div>`;
            }else{
              champli.innerHTML = `<div>주역할군<img src="./img/role/${champData[i][0]}.png"></div> <div>부역할군<img src="./img/role/${champData[i][1]}.png"></div>`
            }
          }
        }
      }

      const a = document.createElement("a");
      a.href = `https://namu.wiki/w/${champData.name}`;
      a.innerText = "자세히",a.target="_blank"
      champul.insertBefore(a, champul.firstChild);

      const mainImg = document.querySelector(".image");
      const skins = document.querySelector(".skins");

      mainImg.addEventListener("click", () => {
        skins.classList.toggle("active");
      });
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
          champList.style="height:134px";
        });
        
    });
  });

const changeChamp = (arry) => {
  let num2=0;
  arry.forEach((t,key) => {
    t.addEventListener("click", () => {
      ChampName = t.className;
      champul.innerHTML=""
      fetchChamp(ChampName);
      arry[num2].classList.remove("active");
      num2 = key;
      t.classList.add("active");
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
        champul.innerHTML=""
        fetchChamp(ChampName);
        inputID.value=""
      })
  }
};

SearchForm.addEventListener('submit', handlesearchubmit);
