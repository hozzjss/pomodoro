$(document).ready(function () {
  let timeLimit = +($(".timer").text().slice(0,-3)),
  currentSec,
  minutes,
  seconds,
  timerInterv,
  firstCycle,
  isInit;
  const init = (option) => {
    if (isInit) return false;
    if (option == "break") {
      timeLimit = $(".break").length ?
      $("break").text().slice(0, -3) : 5;
    }
    currentSec = timeLimit * 60;
    minutes = timeLimit;
    seconds = timeLimit * 60;
    isInit = true;
    $(".add, .subtract, .start").addClass("disabled");
    timerInterv = setInterval(startCycle, 1000);
  };

  const startBreak = () => {
    reset();
    init("break");
  };

  const reset = () => {
    isInit = false, firstCycle = false;
    $(".add, .subtract, .start").removeClass("disabled");
    clearInterval(timerInterv);
    $(".timer").text(`25:00`);
    animateLoader(1);
  };

  const addOrSub = option => {
    if (isInit || (timeLimit <= 1 && option == "sub")) return false;
    timeLimit = option == "add" ? timeLimit + 1 : timeLimit - 1;
    $(".timer").text(`${minCalc(timeLimit)}:00`)
  };


  const secCalc = sec => {
    if (sec % 60 == 0) minutes -= 1;
    return sec % 60 > 9 ? sec % 60 : `0${sec % 60}`;
  };

  const minCalc = min => {
    if (firstCycle) {
      firstCycle = false;
      return minCalc(min - 1);
    }
    return min < 10 ? `0${min}` : min;
  };

  const animateLoader = value => {
    $(".loader").css("width", `${value*100}%`);
  };

  const startCycle = () => {
    firstCycle = true;
    currentSec -= 1;
    let value = currentSec / seconds;
    $(".timer").text(`${minCalc(minutes)}:${secCalc(currentSec)}`);
    animateLoader(value);
    if (currentSec <= 0) {
      clearInterval(timerInterv);
      setTimeout(startBreak, 3000);
      isInit = false;
    }
  };

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
