// animate a growing circle using transition and setTimeout

// set initial state
const hideCircle = $circle => {
  $circle.css({
    transitionDuration: "0s",
    width: 0,
    height: 0
  });
};

// grow circle with the given xy positions and the final radius.
const showCircle = (cx, cy, radius) => {

  const $circle = $("#circle");
  // final state
  const grownCircleStyle = {
    transitionDuration: ".5s",
    left: cx + "px",
    top: cy + "px",
    width: 2 * radius + "px",
    height: 2 * radius + "px"
  };

  hideCircle($circle);

  setTimeout(() => {
    // this will run as a separate message
    $circle.css(grownCircleStyle);
  }, 20);
};


// transition with rAF
const showCircleWithRAF = (cx, cy, radius) => {

  const $circle = $("#circle");
  const grownCircleStyle = {
    transitionDuration: ".5s",
    left: cx + "px",
    top: cy + "px",
    width: 2 * radius + "px",
    height: 2 * radius + "px"
  };

  hideCircle($circle);
  
  // we cue two states into separate messages
  requestAnimationFrame(() => {
    // this is run at next available repaint
    // initial state is noted and painted
    requestAnimationFrame(() => {
      // this is run at next available repaint
      $circle.css(grownCircleStyle); 
    });
  });
};


// transition using getComputedStyle hack
const showCircleWithGetter = (cx, cy, radius) => {
  
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



// Grow a circle. Then print a text 
// by adding listener that calls cb on "transitionend" 

// remove text node inside circle when clicking other buttons
// (also on blur)
const emptyCircleOnButtonBlur = button => {
  $(button).on("blur", () => {
    $("#circle").empty();
  });
};

// This shows the text
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
    // $.one calls cb only once.
    $circle.one("transitionend", () => {
      callback($circle[0]);
      emptyCircleOnButtonBlur($(`button[onclick$="Message()"]`)[0]);
    });
  }, 20);
};

const showCircleWithMessage = () => {
  // I could've just passed this to onclick="..."
  showCircleAndRunCallback(150, 150, 100, showMessage);
};



// Grow circle. Then append text using promise API

// This grows a circle
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

// creates a promise
const returnCircleInPromise = () => {

  return new Promise(resolve => {
      const circle = $(`#circle`).empty()[0];
      const grownCircle = showCircleInPromise(150, 150, 100, circle);
      // In order to append text AFTER the growing transition finishes
      // place resolve() inside listener callback
      $(grownCircle).one("transitionend", () => resolve(grownCircle))
    })
};

// callbacks inside .then will be called in succession before repaint
// because they are microtasks in job cue
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
