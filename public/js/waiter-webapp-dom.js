// *Variables
let loginBtn = document.querySelector(".btnLogIn") || null;
let regBtn = document.querySelector(".btnRegisterHome") || null;

let regBackBtn = document.querySelector(".regBtnBack") || null;

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

function navigate(action){
    console.log(action);
    if(action == 'login'){
        window.location.href='/login';
    }
    else if (action=='register'){
        window.location.href='/register';
    }
    else if(action == 'regBack'){
        window.location.href='/';
    }   
}
