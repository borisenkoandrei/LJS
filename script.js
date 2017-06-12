var template = `
{{#each response}}
    <div class="friend">
        <img class="friend_img" src="{{photo_100}}">
        <div class="friend_name">{{first_name}} {{last_name}}</div>
        <button>Добавить</button>
    </div>
{{/each}}
`;

var templateFn = Handlebars.compile(template);

var fr = document.querySelector("friends");

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
        var allFriends = response;// Массив
        var selectedFriends = {response:[]};//Массив

        friends.innerHTML = templateFn(allFriends);//DOM УЗЕЛ
        selectedFr.innerHTML = templateFn(selectedFriends);//DOM УЗЕЛ


        var friendCards = document.querySelectorAll('.friend');

        for (var i =0; i < friendCards.length; i++){
            friendCards[i].addEventListener('click', function (e) {
                if (e.target.tagName === "BUTTON" && e.currentTarget.parentElement.id === "friends"){
                    var name = e.currentTarget.children[1].innerText.toLowerCase();
                    for (var i =0;i<allFriends.response.length;i++){
                        var firstNameFromFriendList =  allFriends.response[i].first_name.toLowerCase();
                        var secondNameFromFriendList = allFriends.response[i].last_name.toLowerCase();
                        var FIO = firstNameFromFriendList + " " + secondNameFromFriendList;

                        if (FIO.includes(name)){
                            var elem = friends.removeChild(e.currentTarget);
                            selectedFr.appendChild(elem);
                            e.target.innerHTML = "Убрать";
                            selectedFriends.response.push(allFriends.response[i])
                            allFriends.response.splice(i,1);
                            console.log(allFriends);
                            console.log(selectedFriends);



                        }
                    }
                }  else if (e.target.tagName === "BUTTON" && e.currentTarget.parentElement.id === "selectedFr"){
                    var name = e.currentTarget.children[1].innerText.toLowerCase();
                    for (var i =0;i<selectedFriends.response.length;i++){
                        var firstNameFromselectedFr =  selectedFriends.response[i].first_name.toLowerCase();
                        var secondNameselectedFr = selectedFriends.response[i].last_name.toLowerCase();
                        var FIO = firstNameFromselectedFr + " " + secondNameselectedFr;

                        if (FIO.includes(name)){
                            var elem = selectedFr.removeChild(e.currentTarget);
                            friends.appendChild(elem);
                            e.target.innerHTML = "Добавить";
                            allFriends.response.push(selectedFriends.response[i])
                            selectedFriends.response.splice(i,1);
                            console.log(allFriends);
                            console.log(selectedFriends)


                        }
                    }
                }
            });
        }
    })
    
})