const socket = io();

let total_like = document.getElementById("total_like");

let total_dislike = document.getElementById("total_dislike");

let total_post = document.getElementById("total_post");


let total_comment = document.getElementById("total_comment");

socket.on("total", (data) => {
    total_like.innerHTML = data.total;
});

socket.on("total_dislike", (data) => {
    total_dislike.innerHTML = data.total_dislike;
});

socket.on("total_post", (data) => {
    total_post.innerHTML = data.total;
});

socket.on("total_comment", (data) => {
    total_comment.innerHTML = data.total_comment;
});

let exportbtn = document.getElementById("exportbtn");


exportbtn.addEventListener("click", () => {
    let dashboard = document.getElementById("dashboard_img");
    // Use html2canvas to convert the dashboard to an image
    html2canvas(dashboard).then(function (canvas) {
        const link = document.createElement("a");
        link.download = "dashboard.png";
        link.href = canvas.toDataURL("image/png");

        // Trigger a click on the link element to start the download
        link.click();
    }).catch(error => {
        console.log(error);
    });
});