// DOCS
//
// init(option)
// inits the pomodoro and the break
//
// reset()
// resets everything to it's initial state
//
// stop()
// just stops everything
//
// startBreak()
// starts the break timer
//
// addOrSub(option)
// adds or subtracts minutes to the timer
//
// zeroPrefix(num)
// minute or second is less than 10? prefix it with a 0
//
// animateLoader(percentage)
// takes a percentage and assigns it to the width of the loader
//
// countDown()
// takes the current time and takes one second out of it
//
// startCycle()
// it then updates the ui with the correct remaining time
// then assigns the loader a width of the percentage of time that is left
// if it's the break it stops the whole process after it's done
// if not it starts the break timer after the session is over
//
// NTS: too big a fn needs to be broken down into smaller chunks
$(document).ready(function () {
  "use strict";
  //
  let timeLimit, currentSec, minutes, seconds, timerInterv, breakInit, isInit;

  // effn fns
  const init = (option) => {
    if (isInit) return false;
    if (option == "break") {
      timeLimit = $(".break").length ?
      $("break").text().slice(0, -3) : 5;
    } else {
      timeLimit = +($(".timer").text().slice(0,-3));
    }
    currentSec = timeLimit * 60;
    minutes = timeLimit - 1;
    seconds = timeLimit * 60;
    isInit = true;
    $(".add, .subtract, .start").addClass("disabled");
    timerInterv = setInterval(startCycle, 1000);
  };

  const reset = () => {
    isInit = false;
    breakInit = false;
    stop();
    animateLoader(1);
    $(".add, .subtract, .start").removeClass("disabled");
    $(".state").text("Session");
    $(".timer").text(`25:00`);
  };

  const stop = () => {
    clearInterval(timerInterv);
  };

  const startBreak = () => {
    reset();
    init("break");
    breakInit = true;
    $(".state").text("Break");
  };

  const addOrSub = option => {
    if (isInit || (timeLimit <= 1 && option == "sub")) return false;
    timeLimit = option == "add" ? timeLimit + 1 : timeLimit - 1;
    $(".timer").text(`${minCalc(timeLimit)}:00`)
  };
  const zeroPrefix = num => {
    return num < 10 ? `0${num}` : num;
  };
  const animateLoader = (percentage) => {
    percentage = percentage ? percentage : currentSec / seconds;
    $(".loader").css("width", `${percentage*100}%`);
  };

  const countDown = () => {
    currentSec -= 1;
    if (currentSec % 60 == 0 && minutes !== 0) minutes -= 1;
  }

  const startCycle = () => {
    countDown();
    $(".timer")
    .text(`${zeroPrefix(minutes)}:${zeroPrefix(currentSec % 60)}`);
    animateLoader();
    if (breakInit && currentSec <= 0) {
      stop();
      return false;
    }
    if (currentSec <= 0) {
      stop();
      startBreak();
    }
  };

  // event handlers
  $(".add").click(function () {
    addOrSub("add");
  });

  $(".subtract").click(function () {
    addOrSub("sub");
  });

  $(".start").click(function () {
    init();
  });

  $(".reset").click(function () {
    reset();
  });
});
