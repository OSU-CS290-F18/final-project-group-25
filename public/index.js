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

// function to make lines starting with ">" green
function greentext () {
	var paragraphs = document.querySelectorAll('.post p');
	for (var p of paragraphs) {
		if (p.innerHTML && p.innerText.slice(0,1) == ">")
			p.style = "color: #97bb5e";
	}
}
greentext();