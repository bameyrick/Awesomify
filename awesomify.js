/*
 * Awesomify - 1.1.0
 * Ben Meyrick - http://bameyrick.co.uk
 * 
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function (Awesomify) {

    var config = {
        lazy: true,
        onResize: true,
        cls: "awesomify",
        sizes: [240, 320, 500, 640, 768, 960, 1280, 1366, 1920, 2560],
        sizesSquare: [40, 60, 80, 120, 160, 320, 640]
    };

    var awesomifyElements, speed, ratio, do2x, lastWindowSize = 0, retina = window.devicePixelRatio > 1;

    Awesomify.Options = function () {
        return config;
    };

    Awesomify.Init = function (options) {

        // Check speed first thing as test takes a few seconds to complete
        CheckSpeed()

        // Set Options if Specified
        if (options) {

            if (options.lazy) {
                config.lazy = options.lazy;
            }

            if (options.onResize) {
                config.onResize = options.onResize;
            }

            if (options.cls) {
                config.cls = options.cls;
            }

            if (options.sizes) {
                config.sizes = options.sizes;
            }

            if (options.sizesSquare) {
                config.sizesSquare = options.sizesSquare;
            }
        }

        awesomifyElements = document.querySelectorAll('.' + config.cls);

        // Add the EventListener for window resize if specified
        if (config.onResize) {
            addEvent(window, "resize", process);
        }

        // Add scroll EventListener if lazy is specified
        if (config.lazy) {
            addEvent(window, "scroll", function () {
                process(true);
            });
        }
        process();
    };

    Awesomify.FindNew = function () {
        awesomifyElements = document.querySelectorAll('.' + config.cls);
        process();
    }

    Awesomify.Me = function (elem) {
        processImage(elem);
    }

    function CheckSpeed() {
        if (window.SpeedTest) {
            SpeedTest.CheckSpeed(function (s) {
                var delay = 360000;
                speed = s;

                // Set Compression Ratio and time until next checkspeed

                if (speed <= 250) {
                    ratio = 40;
                    do2x = false;
                } else if (speed > 250 && speed <= 450) {
                    ratio = 50;
                    do2x = false;
                    delay = 180000;
                } else if (speed > 450 && speed <= 750) {
                    ratio = 60;
                    do2x = false;
                    delay = 120000;
                } else if (speed > 750 && speed <= 1000) {
                    ratio = 70;
                    do2x = false;
                    delay = 60000;
                } else if (speed > 1000 && speed <= 4000) {
                    ratio = 80;
                    do2x = true;
                    delay = 30000;
                } else if (speed > 4000 && speed <= 10000) {
                    ratio = 15000
                    do2x = true;
                } else if (speed > 10000) {
                    ratio = 99;
                    do2x = true;
                    delay = 10000; s
                }

                setTimeout(function () {
                    CheckSpeed();
                }, delay);
            });


        } else {
            throw Error("SpeedTest not initalised. Awesomify cannot run without SpeedTest.");
        }
    }

    function process(scrolling) {

        if (speed != undefined) {

            if ((window.outerWidth > lastWindowSize) || scrolling) {
                lastWindowSize = window.outerWidth;

                for (var i = 0, l = awesomifyElements.length; i < l; i++) {
                    var elem = awesomifyElements[i];
                    if ((config.lazy && isVisible(elem)) || !config.lazy) {
                        processImage(elem)
                    } else {
                        i = l + 1;
                    }
                }

            }

        } else {

            setTimeout(function () {
                process();
            }, 100);

        }
    }

    function processImage(elem) {
        if (elem) {

            var src, isBackground = false;

            if (elem.tagName.toLowerCase() == "img") {
                src = elem.getAttribute('src');
                if (src.length > 0) {
                    src = src.split("quality");
                } else {
                    src = elem.getAttribute('data-src').split("quality");
                }
            } else {
                src = elem.style.backgroundImage;

                if (src.length > 0) {
                    src = src.replace("url(", "").replace(")", "").split("quality");
                } else {
                    src = elem.getAttribute('data-src').split("quality");
                }
                isBackground = true;
            }


            if (src.length > 0) {
                var w = elem.offsetWidth;
                var h = elem.offsetHeight;

                var input = w;
                var direction = "width";
                if (w < h) {
                    direction = "height";
                    input = h;
                }

                if (retina && do2x) {
                    input = input * 2;
                }

                var newSrc = src[0] + "quality=" + ratio;


                if (src[1]) {
                    if (src[1].indexOf("width") >= 1 && src[1].indexOf("height") >= 1) {
                        var closest = getClosest(input, config.sizesSquare);

                        newSrc += "&width=" + closest + "&height=" + closest;
                    } else {
                        newSrc += "&" + direction + "=" + getClosest(input, config.sizes);
                    }
                } else {
                    newSrc += "&" + direction + "=" + getClosest(input, config.sizes);
                }

                if (isBackground) {
                    elem.style.backgroundImage = "url(" + newSrc + ")";
                } else {
                    elem.setAttribute('src', newSrc);
                }

            }
        }
    }

    function isVisible(elem) {

        var top = elem.offsetTop;
        var left = elem.offsetLeft;

        while (elem.offsetParent) {
            elem = elem.offsetParent;
            top += elem.offsetTop;
            left += elem.offsetLeft;
        }

        return (
          top < (window.pageYOffset + window.innerHeight) &&
          left < (window.pageXOffset + window.innerWidth)
        );
    }

    function getClosest(input, array) {
        var closest = null;

        for (var i = 0, l = array.length; i < l; i++) {
            if (closest == null || (Math.abs(array[i] - input) < Math.abs(closest - input))) {
                closest = array[i];
            }
        }
        return closest;
    }

    var addEvent = function (elem, type, eventHandle) {
        if (elem == null || typeof (elem) == 'undefined') return;
        if (elem.addEventListener) {
            elem.addEventListener(type, eventHandle, false);
        } else if (elem.attachEvent) {
            elem.attachEvent("on" + type, eventHandle);
        } else {
            elem["on" + type] = eventHandle;
        }
    };

    if (typeof String.prototype.contains === 'undefined') { String.prototype.contains = function (it) { return this.indexOf(it) != -1; }; }

}(window.Awesomify = window.Awesomify || {}));