/**
 * Created by IEUser on 5/12/2017.
 */
/* ДЗ 2 - работа с исключениями и отладчиком */

/*
 Задача 1:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true только если fn вернула true для всех элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */

function isAllTrue(array, fn) {
    var arrLen = array.length,
        checkArr = Array.isArray(array),
        checkFn = typeof fn;

    if (arrLen == 0 || !checkArr) {
        throw new Error("empty array");
    } else if(checkFn !== "function") {
        throw new Error("fn is not a function");
    }

    for (var i = 0; i < array.length; i++){
        if (fn(array[i]) == false){
            return false;
        }
    }

    return true;
}

/*
 Задача 2:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true если fn вернула true хотя бы для одного из элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */
function isSomeTrue(array, fn) {
    var arrLen = array.length,
        checkArr = Array.isArray(array),
        checkFn = typeof fn,
        falseArray =[];

    if (arrLen == 0 || !checkArr) {
        throw new Error("empty array");
    } else if(checkFn !== "function") {
        throw new Error("fn is not a function");
    }

    for (var i = 0; i < array.length; i++){
        if (fn(array[i]) == true){
            return true;
        } else {
            falseArray.push(0);
        }
    }

    if (array.length == falseArray.length){
        return false;
    }

}

/*
 Задача 3:
 Функция принимает заранее неизветсное количество аргументов, первым из которых является функция fn
 Функция должна поочередно запусти fn для каждого переданного аргумента (кроме самой fn)
 Функция должна вернуть массив аргументов, для которых fn выбросила исключение
 Необходимо выбрасывать исключение в случаях:
 - fn не является функцией (с текстом "fn is not a function")
 */
function returnBadArguments(fn) {
    debugger;
    var result = [];
    if ((typeof fn) !== "function"){
        throw new Error("fn is not a function");
    }

    for (var i = 1; i< arguments.length; i ++){
        try {
            fn(arguments[i]);
        } catch (e) {
            result.push(arguments[i]);
        }
    }

    return result;
}

/*
 Задача 4:
 Функция имеет параметр number (по умолчанию - 0)
 Функция должна вернуть объект, у которого должно быть несколько методов:
 - sum - складывает number с переданными аргументами
 - dif - вычитает из number переданные аргументы
 - div - делит number на первый аргумент. Результат делится на следующий аргумент (если передан) и так далее
 - mul - умножает number на первый аргумент. Результат умножается на следующий аргумент (если передан) и так далее

 Количество передаваемых в методы аргументов заранее неизвестно
 Необходимо выбрасывать исключение в случаях:
 - number не является числом (с текстом "number is not a number")
 - какой-либо из аргументов div является нулем (с текстом "division by 0")
 */
function calculator(number) {
    if (number === undefined) {
        number = 0;
    }

    if ((typeof number) !== "number"){
        throw new Error("number is not a number");
    }

    var res = number;

    return {
        sum: function () {
            for (var i = 0; i<arguments.length; i++){
                if ((typeof arguments[i]) !== "number") {
                    throw new Error("argument is not a number");
                }

                res = res + arguments[i];
            }

            return res;
        },

        dif: function () {
            for (var i = 0; i<arguments.length; i++){
                if ((typeof arguments[i]) !== "number") {
                    throw new Error("argument is not a number");
                }

                res = res - arguments[i];
            }

            return res;

        },

        div: function () {

            for (var i = 0; i<arguments.length; i++){
                if (arguments[i] == 0){
                    throw new Error("division by 0");
                } else if ((typeof arguments[i]) !== "number") {
                    throw new Error("argument is not a number");
                }
            }
            if (number == 0){
                throw new Error("division by 0");
            }

            for (var i = 0; i<arguments.length; i++){
                res = res/arguments[i];
            }

            return res;
        },

        mul: function () {

            var res = number;

            for (var i = 0; i<arguments.length; i++){

                if ((typeof arguments[i]) !== "number") {
                    throw new Error("argument is not a number");
                }

                res = res * arguments[i];
            }

            return res;

        }
    }
}

export {
    isAllTrue,
    isSomeTrue,
    returnBadArguments,
    calculator
};
