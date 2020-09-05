// select the element
const watch = document.querySelector('.watch');
const startStop = document.querySelector('.start');
const splitClear = document.querySelector('.split');
const table = document.querySelector('.tb');
// set changes
let hours = 0;
let minutes = 0;
let seconds = 0;
let milseconds = 0;
let v = false;
let myT;
//set event listeners to the button
startStop.addEventListener('click',startOrStop);
splitClear.addEventListener('click',splitOrClear);
// setup the items when page load
window.addEventListener('DOMContentLoaded',setupItems);
//set functions
// start or stop
function startOrStop() {
    if(!v) {
        splitClear.classList.add('block');
        this.textContent = 'stop';
        this.classList.add('red');
        splitClear.textContent = 'split';
        splitClear.classList.remove('red');
        v = true;
        myT = setInterval(()=>{
            milseconds++;
            if(milseconds / 10 === 1) {
                milseconds = 0; seconds++;
                if(seconds / 60 === 1) {
                    seconds = 0; minutes++;
                    if(minutes / 60 === 1) {minutes = 0;hours++}
                }
            }
            watch.innerHTML = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${milseconds}`;

        },100)

    }
    else {
        clearInterval(myT);
        const ID = new Date().getTime().toString();
        const value = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${milseconds}`;
        createRow(ID,'black',value,'');
        v = false;
        this.textContent = 'continue';
        this.classList.remove('red');
        splitClear.textContent = 'clear';
        splitClear.classList.add('red');
        // add to local storage
        addToLocalStorage(ID,'black',value,'');
    }
    
}
// split or clear
function splitOrClear() {
    const ID = new Date().getTime().toString();
    const value = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${milseconds}`;
    if(v) {
        createRow(ID,'gri',value,'');
        // add to local storage
        addToLocalStorage(ID,'gri',value,'');
    }
    else clearAll();
}
// create row
function createRow(id,background,value,cmt) {
    const element = document.createElement('tr');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add('row',background);
    element.innerHTML = `<td><button class='delete'>x</button></td>
    <td><h3 class='change-clr'>${value}</h3></td>
    <td><input type="text" name="comment" class="comment"></td>`;
    //delete button
    const deleteBtn = element.querySelector('.delete');
    deleteBtn.addEventListener('click',deleteRow);
    // comment
    const comment = element.querySelector('.comment');
    comment.addEventListener('keyup',commentOnItem);
    comment.value = cmt;
    // show the table
    table.classList.add('showtb');
    // append element to the table
    table.appendChild(element);
    
}
//delete Row 
function deleteRow(e) {
    const element = e.currentTarget.parentElement.parentElement;
    table.removeChild(element);
    const id = element.dataset.id;
    if(table.children.length === 1 ) table.classList.remove('showtb');
    // delete item from local storage
    removeFromLocalStorage(id);
}   
//set pad(n) for hours minutes and seconds
function pad(n) {
    return (n < 10) ? "0"+n : n;
}
// clear all
function clearAll() {
    const timers = document.querySelectorAll('.row');
    timers.forEach(timer=>{table.removeChild(timer)})
    // set back to default
    splitClear.classList.remove('red');
    splitClear.textContent = 'split';
    splitClear.classList.remove('block');
    startStop.textContent = 'start';
    table.classList.remove('showtb');
    v = false;
    hours = 0;minutes = 0; seconds = 0; milseconds = 0;
    watch.innerHTML = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${milseconds}`;
    // remove item from local storage
    localStorage.removeItem('timer');
}
//add to local storage
function addToLocalStorage(id,background,value,cmt) {
    const timer = {id,background,value,cmt};
    const items = getFromLocalStorage('timer');
    items.push(timer);
    localStorage.setItem('timer',JSON.stringify(items));
}
// get from local storage 
function getFromLocalStorage(item) {
    return localStorage.getItem(item) ? 
        JSON.parse(localStorage.getItem(item)):[]
}
// remove from local storage
function removeFromLocalStorage(id){
    let items = getFromLocalStorage('timer');
    items = items.filter(item=>{
        if(item.id !== id)
            return item
    })
    localStorage.setItem('timer',JSON.stringify(items))
}
// commment on Item
function commentOnItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    const value = this.value;
    let items = getFromLocalStorage('timer');
    items = items.map(item=>{
        if(item.id === id) {item.cmt = value}
        return item
    })
    localStorage.setItem('timer',JSON.stringify(items))
}
//setup items
function setupItems() {
    const items = getFromLocalStorage('timer');
    items.forEach(item=>{
        createRow(item.id,item.background,item.value,item.cmt)
    })
    localStorage.setItem('timer',JSON.stringify(items))
}