// *Variables
let loginBtn = document.querySelector(".btnLogIn") || null;
let regBtn = document.querySelector(".btnRegisterHome") || null;
let regBackBtn = document.querySelector(".regBack") || null;
let logBackBtn = document.querySelector(".loginBack") || null;
let logoutBtn = document.querySelector(".btn-secondary") || null;

// *Event listeners
if(loginBtn){
    loginBtn.addEventListener('click',function(){navigate('login')});
}
if(regBtn){
    regBtn.addEventListener('click',function(){navigate('register')});
}
if(regBackBtn){
    regBackBtn.addEventListener('click',function(){navigate('regBack')});
}
if(logBackBtn){
    logBackBtn.addEventListener('click',function(){navigate('logBack')});
}
if(logoutBtn){
    logoutBtn.addEventListener('click',function(){navigate('logout')});
}

function navigate(action){
    console.log(action);
    if(action == 'login'){
        window.location.href='/login';
    }
    else if(action =='logout'){
        window.location.href='/';
    }
    else if (action=='register'){
        window.location.href='/register';
    }
    else if(action == 'regBack' || action=='logBack' ){
        window.location.href='/';
    }   
}

// Automatically remove flash messages after 3 seconds
setTimeout(() => {
    const flashMessages = document.querySelectorAll(".message");
    flashMessages.forEach((message) => {
        message.remove();
    });
}, 3000);
