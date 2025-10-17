//获取css样式计算
function getCss(dom: Element) {
  if (document.defaultView) {
    return document.defaultView.getComputedStyle(dom);
  }

  throw new Error("document.defaultView is null");
}

//执行菜单动画
const navInAndOut = (nav:HTMLElement)=>{
  const bar = document.querySelector('.left-nav-bar') as HTMLElement;
  if(getCss(bar).display == "none") return

  const top = parseInt(getCss(nav).top);
  if(top < 0){
    nav.style.top = "5rem";
    nav.style.opacity = "1";
  }else if(top >= 0){
    nav.style.top = "-100%";
    nav.style.opacity = "0";
  }
}

const navMenuActive = ()=>{
  const btn = document.querySelector(".left-nav-active");
  const container = document.querySelector(".left-nav") as HTMLElement;
  if(btn&&container){
    btn.addEventListener("click",()=>navInAndOut(container))
  }
  const li_list = document.querySelectorAll(".left-nav-li");
  li_list.forEach(item=>{
    item.addEventListener("click",()=>navInAndOut(container))
  })

}
export {navMenuActive};
