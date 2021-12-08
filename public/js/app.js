$(".owl-carousel").owlCarousel({
  loop: true,
  margin: 10,
  nav: true,
  responsive: {
    0: {
      items: 1,
    },
    800: {
      items: 2,
    },
    1000: {
      items: 3,
    },
  },
});
ClassicEditor.create(document.querySelector("#editor")).catch((error) => {
  console.error(error);
});

var updatePostStats = {
  Like: (postId) => {
    document.querySelectorAll("#like-count-" + postId).textContent++;
  },
};
