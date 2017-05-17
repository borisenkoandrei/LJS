/* ДЗ 3 - работа с массивами и объеектами */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for (var i = 0; i <array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    var result = [];

    for (var i = 0; i<array.length; i++) {
        result.push(fn(array[i], i, array));
    }

    return result;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {

    var previousValue;

    if (initial === undefined) {
        previousValue = array[0];

        for (var i =1; i<array.length; i++) {

            previousValue = fn(previousValue, array[i], i, array);
        }
    } else {
        previousValue = initial;

        for (i =0; i<array.length; i++) {
            previousValue = fn(previousValue, array[i], i, array);
        }
    }

    return previousValue;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    delete obj[prop];

}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    return obj.hasOwnProperty(prop);
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    return Object.keys(obj);
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    var props = Object.keys(obj);

    return props.map(function(prop) {
        return prop.toUpperCase();
    })
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from, to) {
    var result = [];

    if (from < 0) {
        from = array.length + from;
    }

    if (to < 0) {
        to = array.length + to;
    }

    if (to > array.length) {
        to = array.length;
    }

    if (to < 0) {
        return [];
    }

    if (from < 0 && array.length + from < 0) {
        from = 0;
    }
    // копирует от from до to не включая to

    if (from !== undefined && to !== undefined && from >= 0 && to >= 0) {
        for (var i = from; i < to; i++) {
            result.push(array[i]);
        }

        return result;
    }
    else if (from !== undefined && to === undefined) {
        for (i = from; i <array.length ; i++) {
            result.push(array[i]);
        }

        return result;
    }

    // копирует весь массив

    else if (from === undefined && to === undefined) {

        return array;

    }
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    return new Proxy(obj, {
        set(target, prop, value) {
            target[prop] = value * value;

            return true;
        }
    });
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
