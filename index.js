// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);

function init () {

    /**
     * Переменная для хранения комментариев
     * @type {Array}
     */
    var comments =[];

    /**
     * Подключаем карту и задаем контейнер для отображения
     * @type {ymaps.Map}
     */
    var myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 11,
        controls: ["zoomControl", "fullscreenControl"],
        nativeFullscreen: true
    }, {
        searchControlProvider: 'yandex#search'
    });


    /**
     * Шаблон карусели кластера.
     */
    var clusterContent = ymaps.templateLayoutFactory.createClass(
        '<div class="cluster-container">'+
            '<div class="cluster-place">{{properties.place}}</div>'+
            '<a href="#" class="cluster-adres">{{properties.adres}}</a>'+
            '<div class="cluster-comment">{{properties.comment}}</div>'+
            '<div class="cluster-date">{{properties.date}}</div>'+
            '<div class="cluster-coords">{{properties.coords}}</div>'+
        '</div>',{
            build: function () {
                this.constructor.superclass.build.call(this);
                var address = this._parentElement.querySelector('.cluster-adres');

                address.addEventListener('click', function (e) {
                    e.preventDefault();
                    var coords = e.target.parentElement.lastElementChild.innerText.split(",");
                    openBalloon(coords);
                });
            }
    });

    /**
     * Шаблон балуна
     */
    var baloonContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="baloon">'+
        '<div class="header">' +
        '<div class="adres">{{adres}}</div>'+
        '<a href="#" class="close">X</a>' +
        '</div>'+
        '<div class="comments">'+
        '{% if comments.length %}' +
        '{% for comment in comments %}' +
            '<div class="com">'+
                '<div class="name">{{comment.name}}</div>'+
                '<div class="date">{{comment.date}}</div>'+
                '<div class="place">{{comment.place}}</div>'+
                '<div class="text">{{comment.comment}}</div>'+
            '</div>' +

        '{% endfor %}' +
        '{% else %}' +
        '<div class="temporal-text">Отзывов еще нет...</div>' +
        '{% endif %}'+
        '</div>'+
        '<div class="comment">'+
        '<div class="comment-title">Ваш отзыв</div>'+
        '<input type="text" id="Name" placeholder="Имя">'+
        '<input type="text" id="place" placeholder="Место">'+
        '<input type="text" id="comment_text" placeholder="Отзыв">'+
        '</div>'+
        '<button id="add">Добавить</button>'+
        '</div>',{
            build: function () {
                this.constructor.superclass.build.call(this);
                this.add = this._parentElement.querySelector('#add');
                this.clse = this._parentElement.querySelector('.close');
                this.addListeners();

        }, addListeners:function () {
                this.add.addEventListener('click', this.addPlacemark.bind(this));
                this.clse.addEventListener('click', function (e) {
                    e.preventDefault();
                    myMap.balloon.close()
                })

        }, addPlacemark: function () {
                var coords = this.getData().coords;
                save(coords);
            }
        }
    );

    var baloonLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="b">' +
        '{% include options.contentLayout %}'+
        '</div>',{
            getShape: function () {
                var el = this.getElement(),
                    result = null;
                if (el) {
                    var firstChild = el.firstChild;
                    result = new ymaps.shape.Rectangle(
                        new ymaps.geometry.pixel.Rectangle([
                            [0, 0],
                            [firstChild.offsetWidth, firstChild.offsetHeight]
                        ])
                    );
                }
                return result;
            }
        }
    );

    /**
     * Добавляем кластер
     * @type {ymaps.Clusterer}
     */
    var cluster = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: clusterContent
    });

    /**
     * Функция обратного геокодирования. Получаем адресс по координатам
     * @param coords
     * @returns {*}
     */
    function coordsToAdress(coords) {
        return ymaps.geocode(coords, {kind:"house"})
            .then(function (res) {
                return res.geoObjects.get(0).getAddressLine();
            });
    }

    /**
     * Открываем балун по координатам с сохранением адреса и координат в properties
     * @param coords
     */
    function openBalloon(coords) {
        coordsToAdress(coords).then(function (adres) {
            myMap.balloon.open(coords, {
                adres: adres,
                coords: coords,
                comments: filterComment(adres)
            }, {
                contentLayout: baloonContentLayout,
                layout:baloonLayout,
                closeButton: false
            })
        })
    }

    /**
     * Фильтруем comments по адресу
     * @param adres
     * @returns {Array} возвращает объект с данными для добавления метки
     */
    function filterComment(adres){
        var result =[];
        comments.forEach(function (comment) {
            if(comment.adres === adres){
                result.push(comment);
            }
        });
        return result;
    }

    /**
     * Функция добавляет объект комментария в массив comments,
     * обновляет балун и добавляет метку на карту
     * @param coords
     */
    function save(coords) {
        coordsToAdress(coords).then(function (adres) {
            var comment = {
                date: new Date().toLocaleString(),
                adres: adres,
                name: Name.value,
                place: place.value,
                coords:coords,
                comment: comment_text.value
            };
            comments.push(comment);
            updateBalloon(adres,coords);
            addPlacemark(coords, comment);
            addToLocalStorage(comments);
        })
    }

    /**
     * Функция добавляет метку на карту и в кластер
     * @param coords
     * @param comment
     */
    function addPlacemark(coords, comment) {
        coordsToAdress(coords).then(function (adres) {
            var placemark = new ymaps.Placemark(coords,
                {
                    adres: comment.adres,
                    coords: comment.coords,
                    comment: comment.comment,
                    place: comment.place,
                    date: comment.date,
                    comments: filterComment(adres)
                }, {
                    balloonContentLayout: baloonLayout,
                    balloonCloseButton: false

                });
            // myMap.geoObjects.add(placemark);

            cluster.add(placemark);
            myMap.geoObjects.add(cluster);
        });
    }

    /**
     * Обновляем балун
     * @param adres
     * @param coords
     */
    function updateBalloon(adres,coords) {
        myMap.balloon.setData({
            adres: adres,
            coords: coords,
            comments: filterComment(adres)
        });
    }

    /**
     * Вешаем обработчик событий на карту. Если балун открыт - закрываем его.
     */
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        if (myMap.balloon.isOpen()){
            myMap.balloon.close();
        } else{
            openBalloon(coords);
        }
    });


    /**
     * Добавляем массив с комментариями в localstorage
     * @param comments
     */
    function addToLocalStorage(comments) {
        localStorage.setItem('comments', JSON.stringify(comments));
    }


    if(localStorage.getItem('comments')){
        var localData = JSON.parse(localStorage.getItem('comments'));
        localData.forEach(function (item) {
            addPlacemark(item.coords, item)
        });

        comments = JSON.parse(localStorage.getItem('comments'));
    }

    /**
     * Вешаем обраьотчик событик по клику на метки
     */
    myMap.geoObjects.events.add('click',function (e) {
        var coords = e.get('target').geometry.getCoordinates();
        if (!e.get('target')._clusterListeners) {
            openBalloon(coords);
        }
    });
};

