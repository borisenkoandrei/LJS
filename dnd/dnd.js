var dragObject = {};

document.addEventListener('mousedown',function (e) {
    var elem = e.target.closest('.elem');

    if (elem.classList.contains('clone')){
        dragObject.elem = elem;
        dragObject.avatar = elem;
    } else{
        dragObject.avatar = elem.cloneNode(true);
        dragObject.avatar.classList.add('clone')
        dragObject.elem = elem;

    }

    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;



})

document.addEventListener('mousemove',function (e) {
    if(!dragObject.elem){
        return
    }

    var avatar = dragObject.avatar;
    document.body.appendChild(avatar);
    avatar.style.position = "absolute";
    avatar.style.top = dragObject.downY+'px';
    avatar.style.left = dragObject.downX+'px';
    avatar.style.top = e.pageY+'px';
    avatar.style.left = e.pageX+'px';



});

document.addEventListener('mouseup',function (e) {
    dragObject.avatar.hidden = true;
    var elem2 = document.elementFromPoint(e.clientX, e.clientY);
    dragObject.avatar.hidden = false;
    console.log(elem2);
    if(elem2.classList.contains('droppable')){
        dragObject.elem.parentNode.removeChild(dragObject.elem);
        elem2.appendChild(dragObject.avatar);
        dragObject.avatar.removeAttribute('style');
        console.log('найдено')
    }
    dragObject ={};





});
