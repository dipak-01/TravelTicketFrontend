let btn = document.querySelector("#login");



btn.addEventListener("click",function(){
    console.log("button clicked");
    let signupForm = document.querySelector(".sign-up-container");
    let signinForm = document.querySelector(".sign-in-container");

    signupForm.classList.add("down");
    signinForm.classList.add("up");
});

let btn2 =document.querySelector("#signup")

btn2.addEventListener("click",function(){
    console.log("button clicked");
    let signupForm = document.querySelector(".sign-up-container");
    let signinForm = document.querySelector(".sign-in-container");

    signupForm.classList.remove("down");
    signinForm.classList.remove("up");
});