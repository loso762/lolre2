const goTop = document.querySelector(".goTop");
const menubar = document.querySelector(".menu");
const searchC = document.querySelector(".search");
const header = document.querySelector("header");

goTop.addEventListener("click",() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  }
);

window.addEventListener("scroll", ()=>{
        if (scrollY > 100) {
            console.log("aa")
            goTop.style = "opacity:1"
            header.style = "opacity:0; transform:scaleY(0)";
            menubar.style = "opacity:0;transform:scaleY(0)";
            searchC.style = "opacity:0;transform:scaleY(0)";
        } else{
            goTop.style = "opacity:0"
            header.style = "opacity:1;transform:scaleY(1)";
            menubar.style = "opacity:1;transform:scaleY(1)";
            searchC.style = "opacity:1;transform:scaleY(1)";
        }
    }
)
