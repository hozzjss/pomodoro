$(document).ready(function() {
    "use strict";
    // timerMaker(timeLimit, loaderClass)
    // takes an amount of minutes as a premises
    // for countdown timer and a class for the view
    // to be manipulated
    // also can reciev an optional callback
    // to be executed when the timer's off
    const timerMaker = (timeLimit, loaderClass, optCb) => {
        let currentSec, minutes, seconds, timerInterv, isInit;
        //
        // init(option)
        // inits the timer
        const init = (option) => {
            if (isInit) return false;
            currentSec = timeLimit * 60;
            minutes = timeLimit - 1;
            seconds = timeLimit * 60;
            isInit = true;
            $(`${loaderClass} .add, ${loaderClass} .subtract, ${loaderClass} .start`).addClass("disabled");
            timerInterv = setInterval(startCycle, 1000);
        };
        //
        // reset()
        // resets everything to it's initial state
        const reset = () => {
            isInit = false;
            stop();
            animateLoader(1);
            $(`${loaderClass} .timer`).text(`${zeroPrefix(timeLimit)}:00`);
            $(`${loaderClass} .add, ${loaderClass} .subtract, ${loaderClass} .start`).removeClass("disabled");
        };
        //
        // stop()
        // stops counting down
        const stop = () => {
            clearInterval(timerInterv);
        };
        //
        // addOrSub(option)
        // adds or subtracts minutes to the timer
        const addOrSub = option => {
            if (isInit || (timeLimit <= 1 && option == "sub")) return false;
            timeLimit = option == "add" ? timeLimit + 1 : timeLimit - 1;
            $(`${loaderClass} .timer`).text(`${zeroPrefix(timeLimit)}:00`)
        };
        //
        // zeroPrefix(num)
        // number is less than 10? prefix it with a 0
        const zeroPrefix = num => {
            return num < 10 ? `0${num}` : num;
        };
        //
        // animateLoader(percentage)
        // takes a percentage and assigns it to the width of the loader
        const animateLoader = (percentage) => {
            percentage = percentage ? percentage : currentSec / seconds;
            $(loaderClass).css("width", `${percentage*100}%`);
        };
        //
        // countDown()
        // takes the current time and takes one second out of it
        const countDown = () => {
            currentSec -= 1;
            if (currentSec % 60 == 0 && minutes !== 0) minutes -= 1;
        }
        //
        // tickClock(minutes, currentSec)
        // updates the ui with the correct remaining time
        const tickClock = (minutes, currentSec) => {
            $(`${loaderClass} .timer`)
                .text(`${zeroPrefix(minutes)}:${zeroPrefix(currentSec % 60)}`);
        }
        //
        // startCycle()
        // ticks the clock
        // animates loader
        // stops when time's up
        // if not it starts the break timer after the session is over
        const startCycle = () => {
            countDown();
            tickClock(minutes, currentSec);
            animateLoader();
            if (currentSec <= 0) {
                stop();
                $(`${loaderClass} audio`).trigger('play');
                if (optCb) setTimeout(optCb, 3000);
            }
        };
        // returns an API
        return {
            init,
            addOrSub,
            reset
        };
    };

    // metadata about the timers if we were to add more in a future update
    const timerMetas = [{
            "name": "Session",
            "class": "loader-session",
            "time": "25",
            "cb": function () {
              $(".loader-break .start").click();
              $(".loader-break audio").attr("src", "http://onlineclock.net/audio/options/military-trumpet.mp3");
            }
        },
        {
            "name": "Break",
            "class": "loader-break",
            "time": "05"
        }
    ];
    let timerFuns = [];

    //
    // Handlebars stuff :/
    // take the template
    const source = $("#timer-template").html();
    // compilation is a big word for just get it ready
    // to replace the placeholders with its matching data
    const template = Handlebars.compile(source);
    //
    // we go through every item in the metadata array
    timerMetas.forEach(function(meta, i) {
        // this is the replacement phase
        // where everything is put in its place
        // and then an element is returned with
        // the new compiled templates
        // and we append them to the container
        let html = template(meta);
        $(".container").append(html);
        //
        // we pass here the time and class to the module
        // then an API is returned
        timerFuns.push(
          timerMaker(+(meta.time),
           `.${meta.class}`,
            meta.cb)
          );
        //
        // just event handlers for each module instance
        $(`.${meta.class} .add`).click(function() {
            timerFuns[i].addOrSub("add");
        });
        $(`.${meta.class} .subtract`).click(function() {
            timerFuns[i].addOrSub("sub");
        });
        $(`.${meta.class} .start`).click(function() {
            timerFuns[i].init();
        });
        $(`.${meta.class} .reset`).click(function () {
          timerFuns[i].reset();
        });
    });
    $(".loader-session .reset").click(function () {
      timerFuns[0].reset();
      timerFuns[1].reset();
    });
});
