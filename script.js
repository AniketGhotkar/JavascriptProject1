const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMSg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '@#$&%!~';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// strength colour to grey
setIndicator("#ccc");

handleSlider();
// set passwordLength
// password ko uI par reflect kevatya hai
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max)
{
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

// random character from 'a' to 'z'
function generateLowerCase(){
   return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym)  && passwordLength>=8)
        setIndicator("#0f0");
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >=6
    ){
        setIndicator("0ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard .writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e)
    {
        copyMsg.innerText = "Failed";
    }
    // to make copy vala span visible 
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(arr){
    // Fisher Yates Method 
    for(let i=arr.length-1;i>0;i--)
    {
        let j = Math.floor(Math.random() * (i+1));
        const temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }

    let str ="";

   arr.forEach(element => {
        str+=element;
    });

    return str;
}

function handleCheckBoxChange(){
    checkCount =0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    // special condition
    if(passwordLength < checkCount)
    {
        passwordLength =checkCount;
        handleSlider();
    }
}

allCheckBox.forEach ((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

// e.target mnje slider madhe change kelat tr te reflect honar min and max in html slider
inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',(_e)=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})

generatebtn.addEventListener("click",()=>{
    // none of the checkbox are selected
    if(checkCount <=0) return;

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find new password
    console.log("starting the journey");
    // remove old password;
    password = "";

    // lets put the stuff mentioned bu checkboxes
    // if(uppercaseCheck.checked)
    // {
    //     password += generateUpperCase();
    // }
    
    // if(lowercaseCheck.checked)
    // {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked)
    // {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked)
    // {
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i=0;i<funcArr.length;i++)
    {
        password += funcArr[i]();
    }

    console.log("compulsory addition done");
    // remaining addition
    for(let i=0;i<passwordLength-funcArr.length ;i++)
    {
        let randIndex = getRndInteger(0,funcArr.length);

        password += funcArr[randIndex]();
    }

    // remaining addition done
    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    calStrength();
})



