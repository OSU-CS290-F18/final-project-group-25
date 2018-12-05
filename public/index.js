/*
 * © Gabriel Kulp 2018
 * Email: kulpga@oregonstate.edu
 */

function submitPost () {

	var postPhoto   = document.getElementById('post-photo').value;
	var postTitle   = document.getElementById('post-title').value.trim();
	var postAuthor  = document.getElementById('post-author').value.trim();
	var postContent = document.getElementById('post-content').value.trim();

	if (!postTitle || !postAuthor || !postContent) {
		alert("Please fill required fields");
	} else {

		var postRequest = new XMLHttpRequest();
		var requestURL = '/post/add';
		postRequest.open('POST', requestURL);

		var requestBody = JSON.stringify({
			photo: postPhoto,
			title: postTitle,
			author: postAuthor,
			content: postContent
		});

		console.log(requestBody);

		postRequest.addEventListener('load', function (event) {
			if (event.target.status === 200) {
				window.location.href = '/';
			} else {
				alert('Error uploading post: ' + event.target.response);
			}
		});

		postRequest.setRequestHeader('Content-Type', 'application/json');
		postRequest.send(requestBody);
	}
}