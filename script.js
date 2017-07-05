var template = `
{{#each response}}
    <div class="friend">
        <img class="friend_img" src="{{photo_100}}">
        <div class="friend_name">{{first_name}} {{last_name}}</div>
        <button>Добавить</button>
    </div>
{{/each}}
`;

var template2 = `
{{#each response}}
    <div class="friend">
        <img class="friend_img" src="{{photo_100}}">
        <div class="friend_name">{{first_name}} {{last_name}}</div>
        <button>Убрать</button>
    </div>
{{/each}}
`;

var templateFn = Handlebars.compile(template);
var templateFn2 = Handlebars.compile(template2);

var dragObject = {};


function delta(e) {
    var startX = dragObject.target.getBoundingClientRect().left;
    var startY = dragObject.target.getBoundingClientRect().top;
    var clickX = e.pageX;
    var clickY = e.pageY;

    console.log(e.scrollX);
    console.log(e.scrollY);

    e.scrollY;

    dragObject.deltaX = clickX- startX - window.pageXOffset;
    dragObject.deltaY = clickY -startY - window.pageYOffset;
}


window.addEventListener('load', function () {
    return new Promise(function (resolve, reject) {
        VK.init({
            apiId: 6066200
        });

        VK.Auth.login(function (data) {
            if (data.session) {
                resolve(data);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }}, 2);
        
    }).then(function () {
        return new Promise(function (resolve, reject) {
            VK.api("friends.get", {order: 'name', fields: 'photo_100'}, function (data) {
                if (data.response){
                    resolve(data)
                } else
                    reject(new Error(data.error))
            });

        })
    }).then(function (response) {
        var allFriends;
        var selectedFriends;

        if(localStorage.getItem('allFriends') && localStorage.getItem('selectedFriends')){
            allFriends = JSON.parse(localStorage.getItem('allFriends'));
            selectedFriends = JSON.parse(localStorage.getItem('selectedFriends'));
        } else {
            allFriends = response;// Массив
            selectedFriends = {response:[]};//Массив
        }

        friends.innerHTML = templateFn(allFriends);//DOM УЗЕЛ
        selectedFr.innerHTML = templateFn2(selectedFriends);//DOM УЗЕЛ


        var friendCards = document.querySelectorAll('.friend');

        function addEvent(){
            for (var i =0; i < friendCards.length; i++){
            friendCards[i].addEventListener('click', function (e) {
                if (e.target.tagName === "BUTTON" && e.currentTarget.parentElement.id === "friends"){

                    for (var i =0;i<allFriends.response.length;i++){
                        var firstNameFromFriendList =  allFriends.response[i].first_name.toLowerCase();
                        var secondNameFromFriendList = allFriends.response[i].last_name.toLowerCase();
                        var FIO = firstNameFromFriendList + " " + secondNameFromFriendList;

                        if (FIO.includes(e.currentTarget.children[1].innerText.toLowerCase())){
                            var elem = friends.removeChild(e.currentTarget);
                            selectedFr.appendChild(elem);
                            e.target.innerHTML = "Убрать";
                            selectedFriends.response.push(allFriends.response[i])
                            allFriends.response.splice(i,1);
                            break;
                        }
                    }
                }  else if (e.target.tagName === "BUTTON" && e.currentTarget.parentElement.id === "selectedFr"){

                    for (var i =0;i<selectedFriends.response.length;i++){
                        var firstNameFromselectedFr =  selectedFriends.response[i].first_name.toLowerCase();
                        var secondNameselectedFr = selectedFriends.response[i].last_name.toLowerCase();
                        var FIO = firstNameFromselectedFr + " " + secondNameselectedFr;

                        if (FIO.includes(e.currentTarget.children[1].innerText.toLowerCase())){
                            var elem = selectedFr.removeChild(e.currentTarget);
                            friends.appendChild(elem);
                            e.target.innerHTML = "Добавить";
                            allFriends.response.push(selectedFriends.response[i]);
                            selectedFriends.response.splice(i,1);
                            break;
                        }
                    }
                }
            });
        }}

        addEvent();


        findFriend.addEventListener('keyup', function (e) {
            if(findFriend.value === ""){
                for (var i = 0; i < friends.children.length;i++) {
                    friends.children[i].style.display = "block";
                }
            } else {
                for (var i = 0; i < friends.children.length;i++){
                    var FIO = friends.children[i].children[1].innerText.toLowerCase();
                    if (FIO.includes(findFriend.value.toLowerCase())){
                        console.log(FIO);
                        console.log(findFriend.value.toLowerCase());

                        friends.children[i].style.display = "block";
                    } else {
                        friends.children[i].style.display = "none";
                    }
                }
            }
        });

        findSelectedFriend.addEventListener('keyup', function (e) {
            if(findSelectedFriend.value === ""){
                for (var i =0; i < selectedFr.children.length;i++) {
                    selectedFr.children[i].style.display = "block";
                }
            } else {
                for (var i =0; i < selectedFr.children.length;i++){
                    var FIO = selectedFr.children[i].children[1].innerText.toLowerCase();
                    if (FIO.includes(findSelectedFriend.value.toLowerCase())){
                        console.log(FIO);
                        console.log(findSelectedFriend.value.toLowerCase());

                        selectedFr.children[i].style.display = "block";
                    } else {
                        selectedFr.children[i].style.display = "none";
                    }
                }
            }

        });

        document.addEventListener('mousedown', function (e) {
            document.ondragstart = function() { return false };
            document.body.onselectstart = function() { return false };
            if(e.target.tagName === "BUTTON" || !e.target.closest('.friend')){
                return
            }

            if (e.target.tagName !== "BUTTON"){
                dragObject.target = e.target.closest('.friend');
                dragObject.avatar = dragObject.target.cloneNode(true);
                dragObject.targetStartCoord = dragObject.target.getBoundingClientRect();
                document.body.appendChild(dragObject.avatar);
                dragObject.avatar.style.position = "absolute";
                dragObject.avatar.style.top = dragObject.targetStartCoord.top+'px';
                dragObject.avatar.style.left = dragObject.targetStartCoord.left+'px';
            }

            delta(e);

            console.log(dragObject.avatar.nodeType)
            console.log(dragObject.target.parentElement);

        });

        document.addEventListener('mousemove', function (e) {
            if(!dragObject.avatar){
                return new Error("Ошибка");
            }

            dragObject.avatar.style.top = e.pageY - dragObject.deltaY+'px';
            dragObject.avatar.style.left = e.pageX - dragObject.deltaX+'px';

        });

        document.addEventListener('mouseup', function (e) {
            if(e.target.tagName === "BUTTON" || e.target.closest('.friend') == null){
                return;
            }

            dragObject.avatar.hidden = true;
            var endTarget = document.elementFromPoint(e.clientX, e.clientY);
            dragObject.avatar.hidden = false;


            if ((endTarget.id === 'selectedFr' || endTarget.closest("#selectedFr")) && dragObject.target.parentElement.id === "friends"){
                dragObject.target.children[2].innerText = "Убрать"
                selectedFr.appendChild(dragObject.target);
                document.body.removeChild(dragObject.avatar);

                for (var i =0;i<allFriends.response.length;i++){
                    var firstNameFromFriendList =  allFriends.response[i].first_name.toLowerCase();
                    var secondNameFromFriendList = allFriends.response[i].last_name.toLowerCase();
                    var FIO = firstNameFromFriendList + " " + secondNameFromFriendList;

                    if (FIO.includes(dragObject.target.children[1].innerText.toLowerCase())){
                        selectedFriends.response.push(allFriends.response[i]);
                        allFriends.response.splice(i,1);
                    }
                }
                dragObject = {};
            } else if ((endTarget.id === 'friends' || endTarget.closest("#friends")) && dragObject.target.parentElement.id === "selectedFr") {
                dragObject.target.children[2].innerText = "Добавить";
                friends.appendChild(dragObject.target);
                document.body.removeChild(dragObject.avatar);

                for (var i =0;i<selectedFriends.response.length;i++){
                    var firstNameFromselectedFr =  selectedFriends.response[i].first_name.toLowerCase();
                    var secondNameselectedFr = selectedFriends.response[i].last_name.toLowerCase();
                    var FIO = firstNameFromselectedFr + " " + secondNameselectedFr;

                    if (FIO.includes(dragObject.target.children[1].innerText.toLowerCase())){
                        allFriends.response.push(selectedFriends.response[i]);
                        selectedFriends.response.splice(i,1);
                    }
                }
                dragObject = {};
            } else {
                document.body.removeChild(dragObject.avatar);
                dragObject = {};
            }
        });

        save.addEventListener('click', function (e) {
            localStorage.setItem('allFriends', JSON.stringify(allFriends));
            localStorage.setItem('selectedFriends', JSON.stringify(selectedFriends));
        })
    })
})