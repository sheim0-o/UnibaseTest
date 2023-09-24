let posts;
let table;
let curSortElem;
let filteredPosts;

// Получение постов с jsonplaceholder
async function getPosts(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://jsonplaceholder.typicode.com/posts", true);

    xhr.onload = function() {
    if (xhr.status === 200) {
        posts = JSON.parse(xhr.responseText);
        filteredPosts = [...posts];
        createTableFromArray(posts)
    }
    };
    xhr.send();
}

// Создание таблицы по списку постов
function createTableFromArray(array) {
    table = document.createElement('table');

    let trHeader = document.createElement('tr');
    Object.keys(array[0]).forEach(key => {
        let th = document.createElement('th');
        th.addEventListener('click', setSort);
        th.innerHTML = "<p>" + key + "</p><p class='sort-ico'></p>";

        trHeader.appendChild(th);
    })
    table.appendChild(trHeader);


    array.forEach(element => {
        let tr = document.createElement('tr');
        Object.values(element).forEach(value => {
            let td = document.createElement('td');
            td.innerHTML = value;
            tr.appendChild(td);
        })
        table.appendChild(tr);
    });

    let tableElem = document.getElementById("table_posts")
    tableElem.innerHTML ="";
    if(tableElem)
        tableElem.appendChild(table);
}

// Обработчик нажатия на заголовок таблицы
function setSort(e){
    let element = e.target;

    let title = element.children[0];
    let sortIco = element.children[1];
    let sortType;


    if (element.classList.contains('sort')) 
    {
        if (element.classList.contains('sort_asc')) {
            sortType = "desc";
            element.classList.remove("sort_asc")
            element.classList.add("sort_desc");
            sortIco.innerHTML="&#9660;";
        }
        else{
            sortType = "asc";
            element.classList.add("sort_asc")
            element.classList.remove("sort_desc");
            sortIco.innerHTML="&#9650;";
        }
    }
    else {
        if(curSortElem){
            curSortElem.classList.remove("sort", "sort_asc", "sort_desc");
            curSortElem.style.display='block';
            curSortElem.children[1].innerHTML="";
        }
        curSortElem = element;

        sortType = "asc";
        element.classList.remove("sort_none")
        element.classList.add("sort","sort_asc");
        element.style.display='flex';
        sortIco.innerHTML="&#9650;";
    }
    sortArrayOfObj(filteredPosts, title.innerHTML, sortType);
}

// Сортировка массива
function sortArrayOfObj(array, sortName, sortType){
    array.sort((a, b) => {
        if(sortType=="desc"){
            let temp = a;
            a=b;
            b=temp;
        }

        return ((typeof a[sortName] == "string") || (typeof b[sortName] == "string"))
            ? a[sortName].toString().localeCompare(b[sortName].toString()) 
            : a[sortName] - b[sortName];
    });

    updateTable(table, array);
}

// Обновление значений в таблице
function updateTable(table, array){
    const rows = table.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        
        for(let j = 0; j < cells.length;j++)
        {
            cells[j].textContent = Object.values(array[i-1])[j];
        }
    }
}

// Фильтрация постов по значению из поисковой строки
function filterTable(element)
{
    filteredPosts = [...posts];
    if(element.value.length<3)
        return;
    
    let tempPosts = [];
    for (let i = 1; i < filteredPosts.length; i++) {
        let values = Object.values(filteredPosts[i]);
        for (let j = 0; j < values.length; j++) {
            if (values[j].toString().toLowerCase().indexOf(element.value.toLowerCase()) > -1) {
                tempPosts.push(filteredPosts[i]);
                break;
            }
        }
    }
    filteredPosts = [...tempPosts];
    createTableFromArray(filteredPosts);
}


getPosts();