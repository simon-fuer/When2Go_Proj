let userdata = {
    days: 0,
    timeframe:[],
    category:[],
    chDates:[],
    selectCalD:0,
    recommendation: [],
    session: 'true',
    recommId:[],
}
let savedData;
let startMonth;
window.addEventListener('load', () => {
    savedData = localStorage.getItem('when2go_data');
    if (savedData) {
        userdata = JSON.parse(savedData);
    }
    checkState();
    userdata.days=0;
    userdata.timeframe=[];
    userdata.category=[];
    userdata.chDates=[];
});
function checkState(){
    if (userdata.session === 'true') {
    document.getElementById('loginBtn').classList.add('hidden');
    document.getElementById('accountBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
    }else{
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
    document.getElementById('accountBtn').classList.add('hidden');
    }
}
const monthMap = {
    "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
    "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
};
const reverseMonthMap = Object.fromEntries(
    Object.entries(monthMap).map(([name, num]) => [num, name])
);
function saveUsrData(){
    localStorage.setItem('when2go_data', JSON.stringify(userdata));
}
function logoutUsr(){
    userdata.session='false';
    checkState();
    saveUsrData();
}
function monthChoice(month, element){
    if(!userdata.timeframe.includes(month)){
        userdata.timeframe.push(month);
        element.classList.add('selected');
    }else {
        userdata.timeframe = userdata.timeframe.filter(m => m !== month)
        element.classList.remove('selected');
    }
}
function catChoice(category, element){
    if(!userdata.category.includes(category)){
        userdata.category.push(category)
        toggleSelected(element)
    }else {
        userdata.category = userdata.category.filter(c => c !== category)
        toggleSelected(element)
    }
}
function toggleSelected(element){
    if (!element.classList.contains('selected')){
        element.classList.add('selected')
    }else{
        element.classList.remove('selected')
    }
}
function toggleView(currentPage){
    console.log(userdata.days);
    console.log(userdata.timeframe.length)
    
    switch(currentPage){
        case 'start':
            userdata.days=document.getElementById('search').value
            if(userdata.days>0){
            document.getElementById('mainPage').classList.add('hidden');
            document.getElementById('chPage1').classList.remove('hidden');}
            else{
                alert("Please input amount of days")
            }
            break;
        case 'timeframe':
            if(userdata.timeframe.length!==0){
            document.getElementById('chPage1').classList.add('hidden');
            document.getElementById('chPage2').classList.remove('hidden');}
            break;
        case 'vacType':
            if(userdata.category.length!==0){
            document.getElementById('chPage2').classList.add('hidden');
            document.getElementById('chPage3').classList.remove('hidden');}
            break;
        case 'recomms':
            document.getElementById('chPage3').classList.add('hidden');
            document.getElementById('finPage').classList.remove('hidden');
            generateCalendar();
            findCheckedRecomms();
            break;
        case 'timeframeBack':
            document.getElementById('chPage1').classList.add('hidden');
            document.getElementById('mainPage').classList.remove('hidden');
            break;
        case 'vacTypeBack':
            document.getElementById('chPage2').classList.add('hidden');
            document.getElementById('chPage1').classList.remove('hidden');
            break;
        case 'recommsBack':
            document.getElementById('chPage3').classList.add('hidden');
            document.getElementById('chPage2').classList.remove('hidden');
            break;
        case 'finalViewBack':
            document.getElementById('finPage').classList.add('hidden');
            document.getElementById('chPage3').classList.remove('hidden');
    }

}
function generateCalendar() {
    const month = userdata.timeframe.sort((a, b) => {
        return monthMap[a] - monthMap[b]; 
    })[0]
    const container = document.getElementById('calendarGrid');
    container.innerHTML = `
        <div class="calDay-card-Title"><p>Mon</p></div>
        <div class="calDay-card-Title"><p>Tue</p></div>
        <div class="calDay-card-Title"><p>Wed</p></div>
        <div class="calDay-card-Title"><p>Thu</p></div>
        <div class="calDay-card-Title"><p>Fri</p></div>
        <div class="calDay-card-Title"><p>Sat</p></div>
        <div class="calDay-card-Title"><p>Sun</p></div>    
    `; 
    document.getElementById('calTitle').innerHTML=`${month}`
    const monthNumber = monthMap[month];
    const firstDay = new Date(2026, monthNumber-1, 0).getDay();
    for (let i = 0; i < firstDay; i++) {
        const card = document.createElement('div');
        card.className = 'calDay-card';
        container.appendChild(card);
    }
    for (let i = 1; i <= getDaysForSelectedMonths(month); i++) {
        const card = document.createElement('div');
        card.className = 'calDay-card';
        card.id=`${i}.${monthMap[month]}`
        card.innerHTML = `
            <button id='${card.id}' class="calDateBtn" onclick='calBtnToggle(this)'>${i}</button>
        `;
        if(userdata.chDates.includes(card.id)){
            card.classList.add('dateRange')
        }
        container.appendChild(card);
    }
}
function calBtnToggle(element){
    const currentSelect = document.getElementsByClassName('calDateBtn selected')
    if(currentSelect.length===0){
        toggleSelected(element);
    }else {
        toggleSelected(currentSelect[0]);
        toggleSelected(element)
    }
    userdata.selectCalD=element.id
}
function getDaysForSelectedMonths(month) {
    let results = {};
        const monthNumber = monthMap[month];
        const daysCount = new Date(2026, monthNumber, 0).getDate();
    return daysCount;
}
function calChangeMonth(switchDir){
    let currentMonthNumb = monthMap[startMonth];
    switch(switchDir){
        case '+':
            if (currentMonthNumb>=12){
                currentMonthNumb = 1
            }else {
                currentMonthNumb++
            }
            break;
        case '-':
            if (currentMonthNumb<=1){
                currentMonthNumb =12
            }else {
                currentMonthNumb--
            }
    }
    startMonth=reverseMonthMap[currentMonthNumb];
    generateCalendar(startMonth)
}
function addLi(choice){
     let inputText=0;
    switch(choice){
        case 'plan':{
            inputText = document.getElementById('dayPlanText');
            break;
        }
        case 'pack':{
            inputText = document.getElementById('packText');
            break;
        }
    }
    createLi(choice,inputText.value)
    inputText.value="";
}
function delLi(element){
    const allSelected = document.getElementsByClassName('selectedPl');
    for(const e of allSelected){
        e.remove();
    }
    checkSelectLi(element)
}
function checkSelectLi(element){
    let anySelected = 0;
    switch(element.id){
        case 'deleteBtnPl':{
            anySelected = document.querySelectorAll('.dayPl.selectedPl');
            break;
        }
        case 'deleteBtnPack':{
            anySelected = document.querySelectorAll('.packLi.selectedPl');
            break;
        }
    }
    if (anySelected.length > 0) {
        element.classList.remove('hidden');
    }else {
        element.classList.add('hidden');
    }
}
function createLi(choice, text){
    let listContain=0;
    switch(choice){
        case 'plan':{
            listContain = document.getElementById('planLiContain');
            const newLi= document.createElement("li");
            newLi.textContent = text
            newLi.className='dayPl'
            newLi.onclick=function(){
                this.classList.toggle('selectedPl');
                checkSelectLi(document.getElementById('deleteBtnPl'))
            }
            listContain.appendChild(newLi);
            break;
        }
        case 'pack':{
            listContain = document.getElementById('packListList');
            const newLi= document.createElement("li");
            newLi.textContent = text
            newLi.className='packLi'
            newLi.onclick=function(){
                this.classList.toggle('selectedPl');
                checkSelectLi(document.getElementById('deleteBtnPack'))
            }
            listContain.appendChild(newLi);
            break;
        }
    }
    
}
function toggleLoginDialog(){
    const login=document.getElementById('loginDialog')
    const signup=document.getElementById('signupDialog')
    if(!login.open && !signup.open){
        login.showModal()
    }
    else if(login.open && !signup.open){
        signup.showModal();
        login.close();
    }
    else if(!login.open && signup.open){
        signup.close();
        login.showModal();
    }
}
function closeDialog(){
  const login=document.getElementById('loginDialog')
  const signup=document.getElementById('signupDialog')   
    login.close();
    signup.close();
}
function toggleRecommsUl(){
    const accountDial = document.getElementById('accountSavedRecoms')
    accountDial.showModal()
    const list = document.getElementById('recommsList')
    list.innerHTML = "";
    for(const recomm of userdata.recommendation){
        const box = document.createElement('li')
        box.className='savedRecomms'
        const title = document.createElement('p')
            title.textContent= `${recomm.City}, ${recomm.Country}`
        const dates = document.createElement('p')
            dates.textContent = `${recomm.DateRange}`
        box.append(title, dates);
        list.append(box);
    }
}
function getRecomms(){
    fetch('http://localhost:3000/recommendations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userdata)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('recommendsList');
        for(const recomm of data){
            const li = createElement('li')
            li.className = "recomm-item";
            li.id=recomm.ID;
            li.innerHTML = `
                <img src="${recomm.Pic}" alt="${recomm.City}" class="recomm-img">
                <div class="recomm-info">
                    <strong>${recomm.City}, ${recomm.Country}</strong><br>
                    <small>${recomm.DateRange}</small>
                </div>
                <div>
                    <input type="checkbox" class='recommCheck' id="${recomm.ID}">
                </div>
                `;
            container.append(li)}
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function findCheckedRecomms(){
    const items = document.querySelectorAll('.recommCheck')
    userdata.recommId = [];
    items.forEach(item => {
        if(item.checked && !userdata.recommId.includes(item.id)){
            userdata.recommId.push(item.id);
        }
    })
    saveUsrData();
}