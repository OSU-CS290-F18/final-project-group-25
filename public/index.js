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
