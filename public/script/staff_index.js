const socket = io();



let title = document.getElementById('title');
let content = document.getElementById('content');
let campaign = document.getElementById('inputcampaign');
let category = document.getElementById('inputcategory');
let checkbox = document.getElementById('checkbox');
let file = document.getElementById('filess');
let btn = document.getElementById('postbtn');
let btnclose = document.getElementById('btnclose');
function checkbtn() {

    if (file.value != '' && campaign.value != '0'
                         && category.value != '0' && title.value != ''
                         && content.value != ''   && checkbox.checked == true) {
        btn.disabled = false;
    }
    else {
        btn.disabled = true;
    }
}


btnclose.addEventListener('click', function () {
    title.value = '';
    content.value = '';
    campaign.value = '0';
    checkbox.checked = false;
    file.value = '';
    btn.disabled = true;
});
title.addEventListener('input', checkbtn);
campaign.addEventListener('input', checkbtn);
content.addEventListener('input', checkbtn);
file.addEventListener('input', checkbtn);
checkbox.addEventListener('input', checkbtn);
category.addEventListener('input', checkbtn);


// get image for cmt form

let imgcmt = document.getElementsByClassName('imgcmt');
let tempImgURL = document.getElementById('tempImgURL').value;
for (let i = 0; i < imgcmt.length; i++) {
    imgcmt[i].src =  tempImgURL;

}

// set liked and disliked
let idea = document.getElementsByClassName('idea');
let idea_id = document.getElementsByClassName('idea_id');


let likebtn = document.getElementsByClassName('like');
let likecount = document.getElementsByClassName('likecount');
let likeicon = document.getElementsByClassName('likeicon');
let textlike = document.getElementsByClassName('text-like');

let dislikebtn = document.getElementsByClassName('dislike');
let dislikecount = document.getElementsByClassName('dislike-count');
let dislikeicon = document.getElementsByClassName('dislike-icon');
let textdislike = document.getElementsByClassName('text-dislike');

let like_users = document.getElementsByClassName('like_user');
let dislike_users = document.getElementsByClassName('dislike_user');






for (let i = 0; i < likebtn.length; i++) {
    likebtn[i].addEventListener('click', function () {
        let id = this.getAttribute('data-id');
        let count = this.getAttribute('data-count');
        likecount[i].innerHTML = parseInt(count) + 1;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/staff/like/' + id, true);
        likeicon[i].classList.add('text-primary');
        textlike[i].classList.add('text-primary');
        likebtn[i].classList.add('disabled');
        dislikebtn[i].classList.add('disabled');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send('like');
    });
}


socket.on('like', data => {
    const postId = data.id;
    const likes = data.likes;
    const postElement = document.querySelector(`.idea[data-id="${postId}"]`);
    postElement.querySelector('.likecount').innerHTML = likes;
});


for (let i = 0; i < dislikebtn.length; i++) {
    dislikebtn[i].addEventListener('click', function () {
        let id = this.getAttribute('data-dislike');
        let count = this.getAttribute('data-number');
        dislikecount[i].innerHTML = parseInt(count) + 1;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/staff/dislike/' + id, true);
        dislikeicon[i].classList.add('text-danger');
        textdislike[i].classList.add('text-danger');
        dislikebtn[i].classList.add('disabled');
        likebtn[i].classList.add('disabled');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send('dislike');
    });
}



socket.on('dislike', data => {
    const postId = data.id;
    const dislikes = data.dislikes;
    const postElement = document.querySelector(`.idea[data-id="${postId}"]`);
    postElement.querySelector('.dislike-count').innerHTML = dislikes;
});


let user_id = document.getElementById('user_id');
let temp_check = user_id.value;
let comment_array = document.getElementsByClassName('comment_array');

window.addEventListener('load', function () {
    for (let i = 0; i < idea.length; i++) {
        let like_user = like_users[i].value;
        let like_user_split = like_user.split(',');
        let dislike_user = dislike_users[i].value;
        let dislike_user_split = dislike_user.split(',');
        for (let j = 0; j < like_user_split.length; j++) {
            if (like_user_split[j] == temp_check) {
                likebtn[i].classList.add('disabled');
                likeicon[i].classList.add('text-primary');
                textlike[i].classList.add('text-primary');
                dislikebtn[i].classList.add('disabled');
            }
        }
        for (let k = 0; k < dislike_user_split.length; k++) {
            if (dislike_user_split[k] == temp_check) {
                dislikeicon[i].classList.add('text-danger');
                textdislike[i].classList.add('text-danger');
                dislikebtn[i].classList.add('disabled');
                likebtn[i].classList.add('disabled');
            }
        }
    }
});





// check comment
let id_comment = document.getElementsByClassName('id_comment');
let comment_text = document.getElementsByClassName('comment_text');
let btncomment = document.getElementsByClassName('btncomment');
for (let i = 0; i < comment_text.length; i++) {
    // check if comment is empty disable btn
    comment_text[i].addEventListener('input', function () {
        if (comment_text[i].value.trim() == '') {
            btncomment[i].disabled = true;
        }
        else {
            btncomment[i].disabled = false;
        }
    });
}




let uname = document.getElementById('uname');



 
let comment_element = document.getElementsByClassName('comment_element');
let commenter_name = document.getElementsByClassName('commenter_name');
let commenter_img = document.getElementsByClassName('commenter_img');
let commenter_name_text = document.getElementsByClassName('commenter_name_text');
let anonymous_check = document.getElementsByClassName('anonymous_check');

for (let i = 0; i < btncomment.length; i++) {
    btncomment[i].addEventListener('click', function () {
        let id = id_comment[i].value;
        let comment = comment_text[i].value;
        let check_anony = anonymous_check[i].checked;
        comment_text[i].value = '';
        anonymous_check[i].checked = false;
        btncomment[i].disabled = true;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/staff/comment/' + id, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send('comment=' + encodeURIComponent(comment) + '&check_anony=' + encodeURIComponent(check_anony));
    });
}


let showcomment = document.getElementsByClassName('showcomment');
let inputcmt = document.getElementsByClassName('inputcmt');
let anonymous_check_contain = document.getElementsByClassName('anonymous_check_contain');
for (let i = 0; i < showcomment.length; i++) {
    showcomment[i].addEventListener('click', function () {
        let id = this.getAttribute('data-id');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/staff/checkcomment/' + id, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            if (this.status == 200) {
                let checkObj = JSON.parse(this.responseText);
                let check_tmp = checkObj.check;

                if (check_tmp == 'closed') {
                    comment_text[i].disabled = true;
                    inputcmt[i].classList.add('d-none');
                    anonymous_check_contain[i].classList.add('d-none');
                }

            }
        }
        xhr.send('showcomment');
    });
}




socket.on('comment', data => {
    const postId = data.id;
    const postElement = document.querySelector(`.idea[data-id="${postId}"]`);
    const totalCommentElement = postElement.querySelector('.total-comment');
    const commentElement = postElement.querySelector('.comment_element');
    let newCommentElement
    newCommentElement = commentElement.cloneNode(true);
    totalCommentElement.innerHTML = data.comment_arr.length;
    newCommentElement.querySelector('.commenter_name_text').innerHTML = data.comment_text;
    newCommentElement.querySelector('.commenter_name').innerHTML = data.user_name;
    newCommentElement.querySelector('.commenter_img').src =  data.user_img;
    newCommentElement.classList.remove('d-none');
    commentElement.parentNode.appendChild(newCommentElement);
});





let chatInput = document.getElementById('chatInput');
let chart_form = document.getElementById('chart-form');
let chatbtn = document.getElementById('chatbtn');

// if no input cannot submit form
chatInput.addEventListener('input', function () {
    if (chatInput.value.trim() == '') {
        chatbtn.disabled = true;
        chart_form.disabled = true;
        chatbtn.classList.remove('text-primary');
        chatbtn.classList.add('text-muted');
    }
    else {
        chatbtn.disabled = false;
        chatbtn.classList.remove('text-muted');
        chatbtn.classList.add('text-primary');
    }
});

chart_form.addEventListener('submit', function (e) {
    e.preventDefault();
    let chatMessage = chatInput.value;
    chatInput.value = '';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/staff/chat', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('chatMessage=' + encodeURIComponent(chatMessage));
});







let chat = document.getElementById('chat');
let left_message = document.getElementById('left-mess');
let right_message = document.getElementById('right-mess');
let uid = document.getElementById('uid').value;


socket.on('chat', (message) => {
    if (message.user_id == uid) {
        let right_message_clone = right_message.cloneNode(true);
        right_message_clone.classList.remove('d-none');
        let right_message_p = right_message_clone.querySelector('p');
        right_message_p.innerHTML = message.chat;
        let right_img_clone = right_message_clone.querySelector('img');
        right_img_clone.src =   message.img;
        chat.append(right_message_clone);
        chat.scrollTop = chat.scrollHeight;
    } else {
        let left_message_clone = left_message.cloneNode(true);
        left_message_clone.classList.remove('d-none');
        let left_message_p = left_message_clone.querySelector('p');
        left_message_p.innerHTML = message.chat;
        let img_clone = left_message_clone.querySelector('img');
        img_clone.src = message.img;
        chat.append(left_message_clone);
        chat.scrollTop = chat.scrollHeight;
    }
});









