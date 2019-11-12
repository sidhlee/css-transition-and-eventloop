const hideCircle = $circle => {
  $circle.css({
    transitionDuration: "0s",
    width: 0,
    height: 0
  });
};

const showCircle = (cx, cy, radius) => {
  console.log("showCircle");
  const $circle = $("#circle");
  const grownCircleStyle = {
    transitionDuration: ".5s",
    left: cx + "px",
    top: cy + "px",
    width: 2 * radius + "px",
    height: 2 * radius + "px"
  };

  hideCircle($circle);

  setTimeout(() => {
    $circle.css(grownCircleStyle);
  }, 20);
};

const showCircleWithRAF = (cx, cy, radius) => {
  console.log("showCircleWithRAF");
  const $circle = $("#circle");
  const grownCircleStyle = {
    transitionDuration: ".5s",
    left: cx + "px",
    top: cy + "px",
    width: 2 * radius + "px",
    height: 2 * radius + "px"
  };

  hideCircle($circle);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      $circle.css(grownCircleStyle);
    });
  });
};

const showCircleWithGetter = (cx, cy, radius) => {
  console.log("showCircleWithGetter");
  const $circle = $("#circle");
  const grownCircleStyle = {
    transitionDuration: ".5s",
    left: cx + "px",
    top: cy + "px",
    width: 2 * radius + "px",
    height: 2 * radius + "px"
  };

  hideCircle($circle);
  // Access one of the properties of the return from get ComputedStyle
  // It performs style calculation and take note of all style changes up until that point.
  // can damage perf. (extra style work per stack frame)
  getComputedStyle($circle[0]).width;

  $circle.css(grownCircleStyle);
};

const emptyCircleOnButtonBlur = button => {
  console.log("blurHandler");
  $(button).on("blur", () => {
    $("#circle").empty();
  });
};

const showMessage = elm => {
  console.log(`showMessage elm: ${elm}`);
  $(elm).empty();
  elm.classList.add("message");
  elm.append("Hello, world!!");
  return elm;
};

const showCircleAndRunCallback = (cx, cy, radius, callback) => {
  const $circle = $("#circle");
  $circle.empty();
  const grownCircleStyle = {
    transitionDuration: ".5s",
    left: cx + "px",
    top: cy + "px",
    width: 2 * radius + "px",
    height: 2 * radius + "px"
  };
  hideCircle($circle);
  setTimeout(() => {
    $circle.css(grownCircleStyle);
    $circle.one("transitionend", () => {
      callback($circle[0]);
      emptyCircleOnButtonBlur($(`button[onclick$="Message()"]`)[0]);
    });
  }, 20);
};

const showCircleWithMessage = () => {
  console.log("showCircleWithMessage");
  showCircleAndRunCallback(150, 150, 100, showMessage);
};

// Animate circle and append text using promise API


const showCircleInPromise = (cx, cy, radius, circle) => { 
  console.log("showCircleInPromise");
  const $circle = $(circle);
  const grownCircleStyle = {
    transitionDuration: ".5s",
    left: cx + "px",
    top: cy + "px",
    width: 2 * radius + "px",
    height: 2 * radius + "px"
  };
  hideCircle($circle);
  getComputedStyle($circle[0]).width;
  $circle.css(grownCircleStyle);
  return $circle[0];
};

const returnCircleInPromise = () => {
  console.log("returnCircleInPromise");
  
  return new Promise(resolve => {
      const circle = $(`#circle`).empty()[0];
      const grownCircle = showCircleInPromise(150, 150, 100, circle);
      console.log(grownCircle);
      // cued on task
      $(grownCircle).one("transitionend", () => resolve(grownCircle))
    })
};



const showCircleWithMessageUsingPromise = () => {
  console.log("showCircleWithMessageUsingPromise");
  returnCircleInPromise()
    .then(showMessage) // this will not run before resolve()
    .then((val) => {
    console.log(`val:`, val);
    const button = $(`button[onclick$="Promise()"]`)[0];
    emptyCircleOnButtonBlur(button)
  });
};