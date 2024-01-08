var url = window.location.href;
var activePage = url.substring(url.lastIndexOf('=') + 1);
var li = document.getElementsByClassName('pagination')[0].getElementsByTagName('li');
for (var i = 0; i < li.length; i++) {
    var a = li[i].getElementsByTagName('a')[0];
    if (a.innerHTML == activePage) {
        a.classList.add('active');
    }
}
var prev = document.getElementsByClassName('prev')[0];
var next = document.getElementsByClassName('next')[0];
prev.addEventListener('click', function (e) {
    e.preventDefault();
    if (activePage > 1) {
        window.location.href = '/manager/manage_idea?page=' + (activePage - 1);
    }
});
next.addEventListener('click', function (e) {
    e.preventDefault();
    if (activePage < li.length - 2) {
        window.location.href = '/manager/manage_idea?page=' + (parseInt(activePage) + 1);
    }
});







let check_download = document.getElementsByClassName('check_download');
let btncheck_download = document.getElementById('btncheck_download');

btncheck_download.addEventListener('click', function (e) {
    e.preventDefault();
    let arr = [];
    for (let i = 0; i < check_download.length; i++) {
        if (check_download[i].checked) {
            arr.push(check_download[i].value);
        }
    }
    if (arr.length > 0) {
        window.location.href = '/manager/download_idea/' + arr;
    }
});