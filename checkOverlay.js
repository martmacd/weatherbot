const checkList = async () => {
    try {
        
        //read current return of !check command from express server
        const response = await fetch("http://localhost:3002");
        const responseJson = await response.json();
        return responseJson;
    }
    catch (err) {
        console.log(err);
        return "Something went wrong.";
    }
}

checkList().then(list => {
    //return a div for each result
    for (let i in list) {
        document.getElementById("list").innerHTML += `<div class="item">${list[i]}</div>`;
    }
});


