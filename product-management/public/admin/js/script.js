console.log("OK");
const buttonStatus = document.querySelectorAll("[button-status]"); //thuộc tính tự định nghĩa thì dùng []
// console.log(buttonStatus);
if (buttonStatus.length > 0){
    let url = new URL(window.location.href);
    // console.log(url);
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            // console.log(status);
            if(status){
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}
const formSearch = document.querySelector("#form-search");
if (formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        console.log();
        if(keyword){
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    })
}
