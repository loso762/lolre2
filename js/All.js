
const goTop = document.querySelector(".goTop");
const menubar = document.querySelector(".menu");

goTop.addEventListener("click",() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  }
);

window.addEventListener("scroll", ()=>{
        if (scrollY > 80) {
            goTop.style = "opacity:1"
            menubar.classList.add("animate__fadeOut");
        } else{
            goTop.style = "opacity:0"
            menubar.classList.remove("animate__fadeOut");
            menubar.classList.add("animate__fadeIn");
        }
    }
)
