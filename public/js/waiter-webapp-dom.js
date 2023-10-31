// *Variables
let loginBtn = document.querySelector(".btnLogIn") || null;
let regBtn = document.querySelector(".btnRegisterHome") || null;
let regBackBtn = document.querySelector(".regBack") || null;
let logBackBtn = document.querySelector(".loginBack") || null;
let logoutBtn = document.querySelector(".btn-secondary") || null;
// Modal DOM Elements
const modal = document.querySelector(".modal") || null;
const overlay = document.querySelector(".overlay") || null;
const openModalBtn = document.querySelector(".btn-open") || null;
const closeModalBtn = document.querySelector(".btn-close") || null;
const proceedBtn = document.querySelector('.btnProceed') || null;

// waiter page variables
let daysSelected = document.querySelector('.daysSelected') || null;
let days = document.getElementsByName('day') || null;//document.querySelectorAll('.regNumsTown');
// console.log(days);

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
if(openModalBtn){
    // Event listener to the open modal when the reset Count button is clicked
    openModalBtn.addEventListener("click", openModal);
}
if(proceedBtn){
    // Event listener for the proceed button on the modal
    proceedBtn.addEventListener("click", redirect);
}
if(closeModalBtn && overlay){
    // Event Listener to close the modal when the close button or overlay is clicked
    closeModalBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
}

if(daysSelected){
    document.addEventListener('DOMContentLoaded',setDaysSelected);
}

//Event Listener to close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
 
  // Open modal function
  function openModal(){
     // removes the hidden class to show the modal and overlay
     modal.classList.remove("hidden");
     overlay.classList.remove("hidden");
  }
  
  // Close modal function
  function closeModal(){
     // adds the hidden class to show the modal and overlay
     modal.classList.add("hidden");
     overlay.classList.add("hidden");
  }
  
  // show an alert before resetting the app.
  function redirect(){
    closeModal();
     
    if (modal.classList.contains("hidden")) {
       window.location.href='/reset';
    }
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

// checks the day checkboxes with the same selection as prior to page refresh
function setDaysSelected(){
    let myArr = (daysSelected.innerHTML).split(',');
    
    // loop through the day checkboxes
    for(i = 0; i < days.length; i++){
        // loop through the previous days selected
        for(ii = 0; ii < myArr.length;ii++){
            // if the previous selected day matches the current item in the days loop
            if(days[i].value === myArr[ii]){
                // set the checkbox's checked attribute to true
                days[i].checked=true;
            }            
        }
        
    }

    // remove the placeholder
    daysSelected.remove();
}
