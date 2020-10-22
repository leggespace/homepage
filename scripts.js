if(typeof(IntersectionObserver) !== "undefined") {
  document.querySelectorAll(".waypoint")
    .forEach(element => element.classList.add("waypoint-hidden"));

  waypoint('#waypoint-1', 'fadeInLeft', 0.75);
  waypoint('#waypoint-2', 'fadeInUp', 0);
  waypoint('#waypoint-3', 'fadeInUp', 0);
  waypoint('#waypoint-4', 'fadeInUp', 0);
  waypoint('#waypoint-5', 'fadeInUp', 0.5);
}

function waypoint(selector, animation, offset) {
  const options = {
    threshold: [offset],
  };
  respondToVisibility(selector, (element) => {
    element.classList.add('animated');
    element.classList.remove('waypoint-hidden');
    element.classList.add(animation);
  }, options);
}

function respondToVisibility(selector, callback, options) {
  const element = document.querySelector(selector);

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0) {
        callback(element);
      }
    });
  }, options);

  observer.observe(element);
}