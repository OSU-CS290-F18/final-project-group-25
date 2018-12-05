/*
 * © Gabriel Kulp 2018
 * Email: kulpga@oregonstate.edu
 */

function closeImage () {
  var backdrop = document.getElementById("modal-backdrop");
  backdrop.style = "display: none";
}

function zoomImage (src, alt) {
  var image = document.getElementById("modal-img");
  image.alt = alt;
  image.src = src;

  var backdrop = document.getElementById("modal-backdrop");
  backdrop.style = "";
}

function embedYoutube () {
	var images = document.getElementsByTagName("img");
	for (var i = 0; i < images.length; i++) {
		if (images[i].src.indexOf("https://www.youtube.com") != -1) {
			var videoID = images[i].src.slice(32);
			var parent = images[i].parentNode;
			parent.innerHTML = 
				'<iframe width="200" height="200" src="https://www.youtube.com/embed/'+
				videoID + 
				'" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
		}
	}
}
embedYoutube();

function greentext () {
	var paragraphs = document.querySelectorAll('.post p');
	for (var p of paragraphs) {
		if (p.innerHTML && p.innerText.slice(0,1) == ">")
			p.style = "color: #97bb5e";
	}
}
greentext();