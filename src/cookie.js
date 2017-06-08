/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * ++++++++++ Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * ++++++++++ Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */

let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');
let readableCookies = [];

/**
 * Первый запуск
 */

(function init() {
    createTable();
})();



/**
 * Возвращаем список всех имеющихся кук
 */
function prepearCookiesArray() {
    var prepearCookies = [];

    if (document.cookie === ""){
         console.log("Кук нет");
         return;
    }

    var cookie = document.cookie.split("; ");
    cookie.forEach(function (nameValuePar) {
        var n = nameValuePar.split("=");
        prepearCookies.push({name:n[0],value:n[1]})
    });

    return prepearCookies;

};

/**
 * создание строки таблицы
 *
 */

function addRow(name, value) {
    var newRow = listTable.insertRow(-1);
    var nameCell = newRow.insertCell(0);
    var valueCell = newRow.insertCell(1);
    var buttonCell = newRow.insertCell(2);

    var button = document.createElement('button');
    button.innerHTML = "удалить";

    nameCell.innerHTML = name;
    valueCell.innerHTML = value;
    buttonCell.appendChild(button);

    buttonCell.addEventListener('click', function (e) {
        var name = e.currentTarget.parentElement;
        var value = name.firstChild.innerText;
        name.parentElement.removeChild(name);
        var date = new Date(0);
        document.cookie = `${value}=; expires=`+ date.toUTCString();

    })
}

/**
 * Создание таблицы
 *
 */


function createTable() {
    listTable.innerHTML = "";

    if (!prepearCookiesArray()){
        return;
    }

    prepearCookiesArray().forEach(function (cookieItem) {
        addRow(cookieItem.name, cookieItem.value);

    })

}


/**
 * Фильтр
 */

filterNameInput.addEventListener('keyup', function() {

    listTable.innerHTML = "";

    prepearCookiesArray().forEach(function (cookieObj) {
        if (cookieObj.name.includes(filterNameInput.value) || cookieObj.value.includes(filterNameInput.value)){
            addRow(cookieObj.name, cookieObj.value)
        }
    });


    if(filterNameInput.value === ""){
        createTable();
    }


});

/**
 * Добавление куки
 */

addButton.addEventListener('click', () => {
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;

    if (!filterNameInput.value){
        listTable.innerHTML = "";
        createTable();
    }else if (filterNameInput.value){
        listTable.innerHTML = "";
        prepearCookiesArray().forEach(function (cookieObj) {
            if (cookieObj.name.includes(filterNameInput.value) || cookieObj.value.includes(filterNameInput.value)){
                addRow(cookieObj.name, cookieObj.value)
            }
        })
    }
});