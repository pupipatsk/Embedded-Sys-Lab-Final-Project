let state = 1
let date = ["15/1/66","15/1/66","15/1/66","15/1/66","15/1/66","15/1/66","15/1/66","15/1/66","15/1/66","15/1/66"]
let time = ["15:00","15:00","15:00","15:00","15:00","15:00","15:00","15:00","15:00","15:00"]
let status = ["red","green","red","green","red","green","red","green","red","green"]
function toggle(){
    let box = document.getElementById("redgreen");
    let meme = document.getElementById("meme")
    // let gif = document.getElementById("gif")
    let text = document.getElementById("status")
    if(state){
        box.style.backgroundColor="red" 
        meme.src="notok.jpg"
        text.innerText="มีรถจอด"
    }
    else{
        box.style.backgroundColor="green"
        meme.src="ok.jpg"
        text.innerText="ไม่มีรถจอด"       
    }
    state=1-state
}

function updateTable(){
    let table = document.getElementById("table")
    for(let i=0;i<date.length;i++){
        let row = table.insertRow(1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerHTML = date[i]
        cell2.innerHTML = time[i]
        if(status[i]=="green"){
            cell3.innerHTML = "มีรถจอด"
            row.style.backgroundColor="red"
        }
        else{
            cell3.innerHTML = "ไม่มีรถจอด"
            row.style.backgroundColor="#64b846"
        }
    }
}