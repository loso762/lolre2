
const goTop = document.querySelector(".goTop");
const menubar = document.querySelector(".menu");
const search = document.querySelector(".search");
const header = document.querySelector("header");

goTop.addEventListener("click",() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  }
);

window.addEventListener("scroll", ()=>{
        if (scrollY > 100) {
            goTop.style = "opacity:1"
            header.style = "transform:scaleY(0)";
            search.classList.add("animate__fadeOut");
            menubar.classList.add("animate__fadeOut");
        } else{
            goTop.style = "opacity:0"
            header.style = "transform:scaleY(1)";
            menubar.classList.remove("animate__fadeOut");
            menubar.classList.add("animate__fadeIn");
            search.classList.remove("animate__fadeOut");
            search.classList.add("animate__fadeIn");
        }
    }
)
