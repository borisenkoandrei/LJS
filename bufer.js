/**
 * Created by IEUser on 26.06.2017.
 */
var coords =  e.get("coords");

//Получаем адресс объекта на который кликнули.
ymaps.geocode(coords, {
    kind:"house"
}).then(function (res) {
    var firstGeoObject = res.geoObjects.get(0);
    return firstGeoObject.getAddressLine()
    console.log(firstGeoObject.getAddressLine());

    myMap.balloon.open(coords, "Содержимое балуна", {
        // Опция: не показываем кнопку закрытия.
        closeButton: false,
        contentLayout: baloonLayout,
        adr: addres
    });



    console.log(myMap.geoObjects.get())
});

var baloonLayout = ymaps.templateLayoutFactory.createClass(
    '<h1 class="123">' +
    '{{properties.address}}' +
    '</h1>' +
    '<button id="btn">1231321321</button>'
);

var placemark = new ymaps.Placemark(coords, {
    // balloonContent: '<img src="http://img-fotki.yandex.ru/get/6114/82599242.2d6/0_88b97_ec425cf5_M" />',
    // iconContent: "Азербайджан",
    poioiopipoi:"jkhjkhjkhjkhjhjkhjh"
}, {
    balloonContentLayout: baloonLayout,
    preset: "islands#yellowStretchyIcon",
    // Отключаем кнопку закрытия балуна.
    balloonCloseButton: false,
    // Балун будем открывать и закрывать кликом по иконке метки.
    hideIconOnBalloonOpen: false
});

myMap.geoObjects.add(placemark);
console.log(placemark.properties.get('balloonContent'))
console.log(placemark.properties)

// myMap.balloon.open(coords, "Содержимое балуна", {
//     // Опция: не показываем кнопку закрытия.
//     closeButton: false
// });

})