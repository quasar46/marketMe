ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        // center: [59.934252, 30.248512],
        center: [59.933960, 30.248700],
        zoom: 17,
        controls: []

    },
        { suppressMapOpenBlock: true },
        {
            searchControlProvider: 'yandex#search'
        }),

        // Создаём макет содержимого.
        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        ),

        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'MarketMe',
            locationUrl: 'https://yandex.ru/maps/2/saint-petersburg/house/sredniy_prospekt_vasilyevskogo_ostrova_88/Z0kYdANpSEwCQFtjfXVydX1jYQ==/?ll=30.249195%2C59.934105&sll=36.144227%2C51.762012&sspn=0.042486%2C0.017949&z=16.82',
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/svg/boolean.svg',
            // Размеры метки.
            iconImageSize: [80, 120],
            // Смещение левого верхнего угла иконки относительно
            iconImageOffset: [-30, -110],
            // её "ножки" (точки привязки).
        }),


        myPlacemarkWithContent = new ymaps.Placemark([55.661574, 37.573856], {
            hintContent: 'Собственный значок метки с контентом',
            balloonContent: 'А эта — новогодняя',
            iconContent: '12'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#imageWithContent',
            // Своё изображение иконки метки.
            iconImageHref: 'images/svg/boolean.svg',
            // Размеры метки.
            iconImageSize: [48, 48],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-24, -24],
            // Смещение слоя с содержимым относительно слоя с картинкой.
            iconContentOffset: [15, 15],
            // Макет содержимого.
            iconContentLayout: MyIconContentLayout
        });

    myMap.geoObjects.add(myPlacemark);
    myMap.geoObjects.events.add('click', function (e) {
        // Объект на котором произошло событие
        var target = e.get('target');

        window.location.href = target.properties.get('locationUrl');
    });

    myMap.geoObjects
        .add(myPlacemark)
    // .add(myPlacemarkWithContent);
});