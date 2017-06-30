// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

function init () {
    var comment ={};

    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    var myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Шаблон контента балуна.
    var baloonLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="baloon">'+
        '<div class="header">{{addres}}</div>'+
        '<div class="comments">{{properties.name}}</div>'+
        '<div class="comment">'+
        '<input type="text" id="Name" placeholder="Имя">'+
        '<input type="text" id="place" placeholder="Место">'+
        '<input type="text" id="comment_text" placeholder="Отзыв">'+
        '</div>'+
        '<button id="add">Добавить</button>'+
        '<button id="show">Функ.</button>'+
        '<button id="clr">CLR</button>'+
        '</div>'
    );

    // Массив со всеми добавленными комментариями.
    var comment = [];

    if(localStorage.getItem("comment")){
        var comment = JSON.parse(localStorage.getItem("comment"))
        comment.forEach(function (elem) {
            createPlacemark(elem)
        })
    }

    // функция обратного геокодирования
    function geoStreet(coords) {
        return ymaps.geocode(coords, {kind:"house"})
            .then(function (res) {
                return res.geoObjects.get(0).getAddressLine();
            });
    };

    // Открывает балун и сохраняет в properties адрес координат балуна
    function openBaloon(coords){
        geoStreet(coords).then(function (addres) {
            myMap.balloon.open(coords, {
                addres: addres
            }, {
                contentLayout: baloonLayout,
                closeButton: true
            });
        })
    }

    // Создаем метки при загрузке
    function createPlacemark(item) {
        var placemark = new ymaps.Placemark(item.coords, {

            date: item.date,
            name: item.name,
            place: item.place,
            comment: item.comment
        },{
            balloonContentLayout: baloonLayout
        });

        myMap.geoObjects.add(placemark);

    }


    // Добавляет метку на карту при нажатии на кнопку добавить
    function addPlacemark(coords) {
        var geo = geoStreet(coords)
        var placemark = new ymaps.Placemark(coords, {

            adres: geo,
            date: new Date().toLocaleString(),
            name: Name.value,
            place: place.value,
            comment: comment_text.value

        },{
            balloonContentLayout: baloonLayout
        });

        createPlacemarkObject(placemark);

        myMap.geoObjects.add(placemark);
    }

    //сохраняем comment в localstorage
    function saveLocalStorage(item) {
        localStorage.setItem("comment", JSON.stringify(item));

    }

    //Добавляем
    function createPlacemarkObject(placemark) {
        var coords = placemark.geometry.getCoordinates();
        var placemarkObject = {
                coords: coords,
                date : placemark.properties.get('date'),
                name: placemark.properties.get('name'),
                place: placemark.properties.get('place'),
                comment: placemark.properties.get('comment')
        };

        comment.push(placemarkObject);
    }

    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        console.log(coords);
        openBaloon(coords);
    });

    myMap.geoObjects.events.add('click', function (e) {
        // Получение ссылки на дочерний объект, на котором произошло событие.
        var object = e.get('target');
        console.log(object.geometry.getCoordinates())
    });

    document.addEventListener("click", function (e) {
        if (e.target.id === "add"){
            var baloonCoords = myMap.balloon.getPosition();
            addPlacemark(baloonCoords);
            saveLocalStorage(comment);
        }
    });

    document.addEventListener("click", function (e) {
        if (e.target.id === "show"){
            console.log(JSON.parse(localStorage.getItem("comment")))
        }
    });

    document.addEventListener("click", function (e) {
        if (e.target.id === "clr"){
            localStorage.clear();
        }
    });
};
