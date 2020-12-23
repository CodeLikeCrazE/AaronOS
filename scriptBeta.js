/*
By Aaron Adams, officially hosted on https://aaronos.dev/AaronOS/
I've managed to recover some older versions, at https://aaronos.dev/AaronOS_Old/ along with a tiny bit of history.

Be forewarned, this project was originally created in my freshman year of highschool and I was *not* very good back then.
I have been working on the project in my spare time in my six or seven years since then, and it's grown to be what it is today.
The code you are about to read can be anywhere from seven years to a couple of hours old, depending on what you're reading.
I've developed a lot since the beginning of the project, and the early bits of code were never meant to be seen.
As such, you will see varying degrees of quality throughout; some written by a beginner, some less-so.
I like to imagine that the majority of the code is more recent than not... but I would not be surprised if there's still
    seven-year-old code laying around here somewhere that I haven't touched much since.
Monologue is over. Thank you for your interest in my project and my code.

(check files.changelog_old for the text that was here before -- a very, very long time ago)

       __________      __________      ____________      _
     /______    /    /    __    /    /   _________/    / /
     ______/   /    /   /  /   /    /  /_________     / /
   /   ___    /    /   /  /   /    /_________   /    /_/
  /  /___/   /    /   /__/   /     _________/  /     _ 
 /__________/    /__________/    /____________/    /_/

Looking under the hood?
    And I have no way to keep you from doing so?
        Let's dive straight into business then, shall we?

    Here's a bunch of IE compatibility fixes and stuff to start us off!
                                 |
          _______________________|
         |
        \|/                                    */

// force https
try{
    if(serverCanUseHTTPS){
        if((window.location.href.indexOf('http://') === 0 || window.location.href.indexOf('://') === -1) && navigator.userAgent.indexOf('MSIE') === -1){
            var tempLoc = window.location.href.split('http://');
            tempLoc.shift();
            window.location = 'https://' + tempLoc.join('http://');
            makeAnErrorToQuit();
        }
    }
    window.getSSLTestVars = function(){
        return {
            canUseHTTPS: serverCanUseHTTPS,
            errors: sslTestEncounteredError,
            hostServer: sslTestHostServer,
            certifServer: sslTestCertificateServer
        };
    }
}catch(err){
    console.log(err);
    console.log("issue in test_ssl.php?");
    window.getSSLTestVars = function(){
        return {
            canUseHTTPS: serverCanUseHTTPS,
            errors: sslTestEncounteredError,
            hostServer: sslTestHostServer,
            certifServer: sslTestCertificateServer
        };
    }
}

if(typeof console === "undefined"){
    console = {
        log: function(){
            /*this is for IE compatibility because console apparently doesn't exist*/
        }
    };
}

// check if backdrop filter blur and others are supported by the browser
var backdropFilterSupport = false;
var backgroundBlendSupport = false;
var cssFilterSupport = false;
if(typeof CSS !== "undefined"){
    if(typeof CSS.supports !== "undefined"){
        
        if(CSS.supports("(backdrop-filter: blur(5px))")){
            backdropFilterSupport = true;
        }

        if(CSS.supports("(background-blend-mode: screen)")){
            backgroundBlendSupport = true;
        }

        if(CSS.supports("(filter: blur(5px))")){
            cssFilterSupport = true;
        }
    }
}

// substitute performance.now if not intact
var windowperformancenowIntact = 1;
if(window.performance === undefined){
    window.performance = {
        now: function(){
            return (new Date).getTime() * 1000;
        }
    };
    window.requestAnimationFrame(function(){console.log('performance.now is not supported by your browser. It has been replaced by function(){return (new Date).getTime() * 1000}', '#F00')});
}else if(window.performance.now === undefined){
    window.performance.now = function(){
        return (new Date).getTime() * 1000;
    };
    window.requestAnimationFrame(function(){console.log('performance.now is not supported by your browser. It has been replaced by function(){return (new Date).getTime() * 1000}', '#F00')});
}

// appx how much time it took to load the page
var timeToPageLoad = Math.round(performance.now() * 10) / 10;

var noUserFiles = (window.location.href.indexOf('nofiles=true') !== -1);

// see if animationframe is supported - if not, substitute it
var requestAnimationFrameIntact = 1;
if(window.requestAnimationFrame === undefined){
    requestAnimationFrameIntact = 0;
    window.requestAnimationFrame = function(func){
        window.setTimeout(func, 0);
    };
    window.requestAnimationFrame(function(){console.log('requestAnimationFrame is not supported by your browser. It has been replaced by function(func){setTimeout(func, 0)}', '#F00')});
}

(function(win, doc){
	if(win.addEventListener)return;		//No need to polyfill

	function docHijack(p){var old = doc[p];doc[p] = function(v){return addListen(old(v))}}
	function addEvent(on, fn, self){
		return (self = this).attachEvent('on' + on, function(e){
			var e = e || win.event;
			e.preventDefault  = e.preventDefault  || function(){e.returnValue = false}
			e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true}
			fn.call(self, e);
		});
	}
	function addListen(obj, i){
		if(i = obj.length)while(i--)obj[i].addEventListener = addEvent;
		else obj.addEventListener = addEvent;
		return obj;
	}

	addListen([doc, win]);
	if('Element' in win)win.Element.prototype.addEventListener = addEvent;			//IE8
	else{		//IE < 8
		doc.attachEvent('onreadystatechange', function(){addListen(doc.all)});		//Make sure we also init at domReady
		docHijack('getElementsByTagName');
		docHijack('getElementById');
		docHijack('createElement');
		addListen(doc.all);	
	}
})(window, document);

if(typeof document.getElementsByClassName === 'undefined'){
    document.getElementsByClassName = function(){return [];}
}


// end of IE compatibility fixes

// safe mode
var safeMode = (window.location.href.indexOf('safe=true') > -1);
var safe = !safeMode;

// style editor template mode
var styleEditorTemplateMode = (window.location.href.indexOf('styletemplate=true') > -1);

var darkMode = 0;
function darkSwitch(light, dark){
    if(darkMode){
        return dark;
    }else{
        return light;
    }
}
var autoMobile = 1;
function checkMobileSize(){
    if(autoMobile){
        if(!mobileMode && (screen.width < 768 || parseInt(getId('monitor').style.width) < 768)){
            setMobile(1);
        }else if(mobileMode && (screen.width >= 768 && parseInt(getId('monitor').style.width) >= 768)){
            setMobile(0);
        }
    }
}
var mobileMode = 0;
function mobileSwitch(no, yes){
    if(mobileMode){
        return yes;
    }else{
        return no;
    }
}
function setMobile(type){
    if(type){
        mobileMode = 1;
        getId('monitor').classList.add('mobileMode');
    }else{
        mobileMode = 0;
        getId('monitor').classList.remove('mobileMode');
    }
}

// sanitize a string to make html safe
function cleanStr(str){
    return str.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;');
}

// i got bored
var lsdTimeout = -1;
function lsd(){
    doLog('Hey! If you suffer from a photosensitivity, please use lsdCancel() in the next 20 seconds!')
    lsdTimeout = setTimeout(function(){
        doLog('duuuuuude');
        setInterval(function(){
            var divs = document.getElementsByTagName('div');
            var tds = document.getElementsByTagName('td');
            var lis = document.getElementsByTagName('li');
            var ps = document.getElementsByTagName('p');
            var buttons = document.getElementsByTagName('button');
            var inputs = document.getElementsByTagName('input');
            try{
                divs[Math.floor(Math.random() * divs.length)].style.backgroundColor = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.random() + ')';
                divs[Math.floor(Math.random() * divs.length)].style.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
            }catch(err){}
            try{
                tds[Math.floor(Math.random() * tds.length)].style.backgroundColor = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.random() + ')';
                tds[Math.floor(Math.random() * tds.length)].style.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
            }catch(err){}
            try{
                lis[Math.floor(Math.random() * lis.length)].style.backgroundColor = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.random() + ')';
                lis[Math.floor(Math.random() * lis.length)].style.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
            }catch(err){}
            try{
                ps[Math.floor(Math.random() * ps.length)].style.backgroundColor = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.random() + ')';
                ps[Math.floor(Math.random() * ps.length)].style.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
            }catch(err){}
            try{
                buttons[Math.floor(Math.random() * buttons.length)].style.backgroundColor = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.random() + ')';
                buttonps[Math.floor(Math.random() * buttons.length)].style.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
            }catch(err){}
            try{
                inputs[Math.floor(Math.random() * inputs.length)].style.backgroundColor = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.random() + ')';
                inputs[Math.floor(Math.random() * inputs.length)].style.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
            }catch(err){}
        }, 16);
    }, 20000);
}
function lsdCancel(){
    clearTimeout(lsdTimeout);
}

// make sure monitor doesnt get scrolled away
function checkMonitorMovement(){
    /*
    if(getId('monitor').scrollTop !== 0){
        getId('monitor').scrollTop = 0;
    }
    if(getId('monitor').scrollLeft !== 0){
        getId('monitor').scrollLeft = 0;
    }
    */
    getId('monitor').scrollTop = 0;
    getId('monitor').scrollLeft = 0;
    requestAnimationFrame(checkMonitorMovement);
}
requestAnimationFrame(checkMonitorMovement);

/*
    // each section will be separated by newlines and begin with a comment like this
    // initialized variables will usually have comments describing them
    var foo = 'bar';
    // comment each function to describe what it does
    function foobar(){
        // comment actions within functions
        alert('foobar';);
    }
*/

// this section helps to handle errors, assuming the browser supports it
// this is user's answer to send error report - 0 or 1. 2 means never been asked
var lasterrorconfirmation = 0;
// list of error messages
var errorMessages = [
    'Ouch!',
    'Way to go, Aaron!',
    'This is TOTALLY not Aaron\'s fault!',
    'Fried the motherboard!',
    'Who released the singularity?', // Space Station 13 joke!
    'That\'ll leave a mark.',
    'This gives Aaron an excuse to get out of bed!',
    'This may or may not be Aaron\'s fault. Nah, it totally is.',
    'Oh noes!',
    'It wasn\'t me!', // Rocketman joke!
    'I didn\'t do it!', // Mr. Krabs joke!
    'Suppermatter engine is melting down!', // Space Station 13 joke!
    'Most likely a PICNIC error on Aaron\'s part.',
    'Surprse!',
    'Conglaturation!',
    'Congratulations!',
    'JavaScript FTW!',
    'I\'m INVINCIBLE!!! oh. never mind.', // Monty Python joke!
    'apps.application = new Application("Application")!', // JavaScript joke!
    'Wow, you broke it!',
    'Look what you - err, Aaron - did this time!',
    'My bad!',
    'I blame the lag!!!!!!1!!1!one!!1!!!',
    'HAX!',
    'Woop!',
    'Permission to laugh at Aaron granted!',
    'oof', // ROBLOX joke!
    'WHY ME?!',
    'Oops!',
    'Oops! Did I do that?', // Steve Urkel joke!
    'Aaron! Keep your head down, there\'s two of us in here, remember?!', // Halo CE joke!
    'NORAA gets to laugh at Aaron while he tries to fix this now! XD',
    'Why me?!',
    'You\'ve got two empty halves of a coconut and you\'re banging them together!', // Monty Python joke!
    'The airspeed velocity of an unladen European swallow is 24mph!', // Monty Python joke!
    'derp',
    'Augh! Message for you, sir!',  // Monty Python joke!
    'Nice job, Aaron!',
    'Ask Aaron\'s fox to ask Aaron what happened.'
];
// error handler itself
window.onerror = function(errorMsg, url, lineNumber){
    // just in case it has been destroyed, vartry is rebuilt - check function vartry(...){...} for commentation on it
    vartry = function(varname){
        try{
            return eval(varname);
        }catch(err){
            return '-failed vartry(' + varname + ') ' + err + '-'
        }
    }
    var randomPhrase = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    var errorModule = module;
    if(formDate('YMDHmSs') - lasterrorconfirmation > 30000){
        lasterrorconfirmation = formDate('YMDHmSs');
        try{
            apps.prompt.vars.notify('Error in ' + errorModule + '<br>[' + lineNumber + '] ' + errorMsg + '<br><br>' + randomPhrase, ['Open Console', 'Dismiss'], function(btn){if(!btn){openapp(apps.jsConsole, 'dsktp');}}, 'Uncaught Error', 'appicons/ds/redx.png');
        }catch(err){
            console.log("Could not prompt error!");
        }
    }
    // present error and ask to send report
    //lasterrorconfirmation = confirm(lang('aOS', 'fatalError1') + errorMessages[Math.floor(Math.random() * errorMessages.length)] + "\n\n" + lang('aOS', 'fatalError2') + " " + url + "\n" + lang('aOS', 'fatalError3') + " '" + module + "' " + lang('aOS', 'fatalError4') + " [" + lineNumber + "]:\n" + errorMsg + "\n\n" + lang('aOS', 'fatalError5'));
    try{
        doLog("");
        doLog("You found an error! " + randomPhrase, '#F00');
        doLog("");
        doLog("Error in " + url, "#F00");
        doLog("Module '" + errorModule + "' at [" + lineNumber + "]:", "#F00");
        doLog(errorMsg, "#F00");
        doLog("");
    }catch(err){
        console.log("");
        console.log("You found an error! " + errorMessages[Math.floor(Math.random() * errorMessages.length)]);
        console.log("");
        console.log("Error in " + url);
        console.log("Module '" + module + "' at [" + lineNumber + "]:");
        console.log(errorMsg);
        console.log("");
    }
    // if the user wants report sent
    /*
    if(lasterrorconfirmation){
        try{
            // save a special file containing error message
            apps.savemaster.vars.save(
                function(){
                    try{
                        return formDate("_M_D_Y__H_m_S_s");
                    }catch(e){
                        return 'formDateBroken';
                    }
                }(),
                '_report version : 4\n' +
                'aOS ID          : ' + vartry("SRVRKEYWORD") + '\n' +
                'aOS dim         : ' + [vartry("getId('monitor').style.width"), vartry("getId('monitor').style.height")] + '\n' +
                'browser dim     : ' + [vartry("window.outerWidth"), vartry("window.outerHeight")] + '\n' +
                'browser page dim: ' + [vartry("window.innerWidth"), vartry("window.innerHeight")] + '\n' +
                'browser codeName: ' + vartry("window.navigator.appCodeName") + '\n' +
                'browser cookies : ' + vartry("window.navigator.cookieEnabled") + '\n' +
                'browser name    : ' + vartry("window.navigator.appName") + '\n' +
                'browser platform: ' + vartry("window.navigator.platform") + '\n' +
                'browser UA head : ' + vartry("window.navigator.userAgent") + '\n' +
                'browser version : ' + vartry("window.navigator.appVersion") + '\n' +
                'code waiting    : ' + vartry('codeToRun.length') + '\n' +
                'computer dim    : ' + [vartry("screen.width"), vartry("screen.height")] + '\n' +
                'error url       : ' + url + '\n' +
                'error module    : ' + module + '\n' +
                'error line      : ' + lineNumber + '\n' +
                'error message   : ' + errorMsg + '\n' +
                'FPS JavaScript  : ' + vartry("stringFPS") + '\n' +
                'FPS visual      : ' + vartry("stringVFPS") + '\n' +
                'jsC last input  : ' + vartry("apps.jsConsole.vars.lastInputUsed") + '\n' +
                'rqAnimFramIntact: ' + vartry("requestAnimationFrameIntact") + '\n' +
                'script version  : ' + vartry("aOSversion"),
                1, "ERROR_REPORT"
            );
            console.log("Report Sent: _aOS_error_report_" + function(){try{return formDate("_M_D_Y__H_m_S_s")}catch(e){return 'formDateBroken'}}(), "#F00");
        }catch(err){
            alert(lang('aOS', 'errorReport'));
        }
    }
    */
};

// scale of screen, for HiDPI compatibility
var screenScale = 1;

// debugging psuedo-module system
// the last used module
var modulelast = 'init aOS';
// the current running module
var module = 'init aOS';
// variable used to tell the file loader that aos is ready to load USERFILES
var initStatus = 0;
// changes the current module
function m(msg){
    d(2, 'Module changed: ' + msg);
    if(module !== msg){
        modulelast = module;
        module = msg;
        // reset module to idle so it is ready for next one
        if(msg !== "unknown"){
            window.setTimeout(function(){m('unknown');}, 0);
        }
    }
}

// dynamic debug logging
var dbgLevel = 0;
var d = function(level, message){
    // level must be higher than the debuglevel set by Settings in order to log
    if(level <= dbgLevel){
        doLog('<span style="color:#80F">Dbg:</span> ' + message);
    }
};

if(typeof dirtyLoadingEnabled !== 'number'){
    dirtyLoadingEnabled = 0;
}

// counts the length of an object
var tempObjLengthCount
function objLength(target){
    tempObjLengthCount = 0;
    for(var i in target){
        tempObjLengthCount++;
    }
    return tempObjLengthCount;
}

// formats a number with commas
var tempNCnumber = "";
var tempNCresult = "";
function numberCommas(number){
    tempNCnumber = number + "";
    tempNCresult = '';
    // adds commas every third character from right
    for(var i = tempNCnumber.length - 3; i > 0; i -= 3){
        tempNCresult = ',' + tempNCnumber.substring(i, i + 3) + tempNCresult;
        tempNCnumber = tempNCnumber.substring(0, i);
    }
    tempNCresult = tempNCnumber + tempNCresult;
    return tempNCresult;
}

//thanks Elm0p2
var cat_code = 'C9';
var Elm0p2s_cat = {
    action: {
        code:{
            inside: 'C9'
        }
    }
};

// cursors
var cursors = {
    def: 'url(cursors/default.png) 3 3, default',
    loadLightGif: 'url(cursors/loadLight.gif) 16 16, url(cursors/loadLight.png) 16 16, wait',
    loadDarkGif: 'url(cursors/loadDark.gif) 16 16, url(cursors/loadDark.png) 16 16, wait',
    loadLight: 'url(cursors/loadLight.png) 16 16, wait',
    loadDark: 'url(cursors/loadDark.png) 16 16, wait',
    move: 'url(cursors/move.png) 14 14, move',
    pointer: 'url(cursors/pointer.png) 9 3, pointer'
}

// performance measuring functions
m('init performance measure');
var perfObj = {
    
};
// start measuring a certain performance block
function perfStart(name){
    d(2, 'Started Performance: ' + name);
    perfObj[name] = [window.performance.now(), 0, 0];
    return Math.round(perfObj[name][0] * 1000);
}
// check performance of a block
function perfCheck(name){
    perfObj[name][1] = window.performance.now();
    perfObj[name][2] = perfObj[name][1] - perfObj[name][0];
    d(2, 'Checked Performance: ' + name);
    return Math.round(perfObj[name][2] * 1000);
}
// start measuring aos boot time (lol, 220 lines in)
perfStart('masterInitAOS');

// screensaver system
var screensaverRunning = 0;
// screensaver blockers
var screensaverBlocks = [];
function countScreensaverBlocks(name){
    if(!name){
        name = "";
    }
    name = cleanStr(String(name));
    var temp = 0;
    for(var i in screensaverBlocks){
        if(screensaverBlocks[i] === name){
            temp++;
        }
    }
    return temp;
}
function blockScreensaver(name){
    if(!name){
        name = "";
    }
    name = cleanStr(String(name));
    screensaverBlocks.push(name);
    return countScreensaverBlocks(name);
}
function unblockScreensaver(name, purge){
    if(!name){
        name = "";
    }
    name = cleanStr(String(name));
    if(screensaverBlocks.indexOf(name) === -1){
        return -1;
    }
    if(purge){
        while(screensaverBlocks.indexOf(name) > -1){
            screensaverBlocks.splice(screensaverBlocks.indexOf(name), 1);
        }
        return 0;
    }
    screensaverBlocks.splice(screensaverBlocks.indexOf(name), 1);
    return countScreensaverBlocks(name);
}
// previous mouse position
var lastPageX = 0;
var lastPageY = 0;
// user has moved their mouse
function markUserMouseActive(event){
    if(event.pageX !== lastPageX || event.pageY !== lastPageY){
        perfStart('userActivity');
        if(screensaverRunning){
            getId('screensaverLayer').style.display = "none";
            getId('screensaverLayer').innerHTML = "";
            apps.settings.vars.screensavers[apps.settings.vars.currScreensaver].end();
            screensaverRunning = 0;
        }
        lastPageX = event.pageX;
        lastPageY = event.pageY;
        try{
            if(apps.settings.vars.prlxBackgroundEnabled && apps.settings.vars.prlxBackgroundUsable){
                apps.settings.vars.prlxBackgroundUpdate();
            }
        }catch(err){
            // this error is to be supressed during boot. It is expected to occur.
        }
    }
}
// user has used their keyboard
function markUserKbActive(){
    perfStart('userActivity');
    if(screensaverRunning){
        getId('screensaverLayer').style.display = "none";
        getId('screensaverLayer').innerHTML = "";
        apps.settings.vars.screensavers[apps.settings.vars.currScreensaver].end();
        screensaverRunning = 0;
    }
}
// pretend the keyboard was clicked - they just logged in so they must have been active
markUserKbActive();

// add the event listeners to the monitor
getId("monitor").addEventListener('click', markUserKbActive);
getId("monitor").addEventListener('mousemove', markUserMouseActive);
getId("monitor").addEventListener('keypress', markUserKbActive);

m('init onerror and USERFILES and getId');
// vartry is used when something might not work
var vartryArray = {};
var vartry = function(varname){
    try{
        return eval(varname);
    }catch(err){
        return '-failed vartry(' + varname + ') ' + err + '-';
    }
}

// convert number to true/false
function numtf(num){
    if(num){
        return true;
    }else{
        return false;
    }
}
function numEnDis(num){
    if(num){
        return 'Enabled';
    }else{
        return 'Disabled';
    }
}

// languages system
var currentlanguage = getId('bootLanguage').innerHTML;
// supported languages
var languagepacks = {
    en: 'US English',
    uv: 'Ultra-Verbose US English',
    //uv: 'Ultra Verbose'
    ch: '&#x4E2D;&#x6587; (Chinese)'
};
var langContent = { // LANGUAGES
    en: {
        aOS: {
            framesPerSecond: 'FPS',
            cpuUsage: 'CPU',
            failedVarTry: 'failed', // lowercase
            fatalError1: 'You found an error! ',
            fatalError2: 'Error in',
            fatalError3: 'Module', // lowercase
            fatalError4: 'at', // lowercase
            fatalError5: 'Send error report to the developer?',
            errorReport: 'Failed to save the report. The OS has either failed to initialize or crucial components have been deleted. Please email mineandcraft12@gmail.com with the details of your issue if you would like it fixed.'
        },
        appNames: {
            startMenu: "aOS Dashboard",
            nora: "NORAA",
            taskManager: "Task Manager",
            jsConsole: "JavaScript Console",
            bash: "Psuedo-Bash Terminal",
            cpuMon: "CPU Monitor",
            prompt: "Application Prompt",
            settings: "Settings",
            iconMaker: "Desktop Icon Maker",
            windowTest: "Window Test Application",
            testTwo: "Test App 2",
            ragdoll: "Rag Doll",
            notepad: "Text Editor",
            properties: "Properties Viewer",
            files: "File Manager",
            changelog: "Changelog",
            flashCards: "Flash Cards",
            pngSave: "PNG Saver",
            canvasGame: "Canvas Video Games",
            internet: "The Internet",
            aerotest: "Windowblur Test",
            savemaster: "SaveMaster",
            mouserecord: "Mouse Recorder",
            ti: "TI-83+ Simulator",
            appAPI: "aOS API",
            appmaker: "Legacy App Maker",
            calculator: "Calculator",
            search: "Search",
            image: "aOSimg Editor",
            changecalc: "Change Calculator",
            messaging: "Messaging",
            camera: "Camera",
            help: "aOS Help",
            musicVis: "Music Visualiser",
            perfMonitor: "Performance Monitor",
            mathway: "Mathway",
            appsbrowser: "Apps Browser",
            indycar: "Indycar",
            housegame: "House Game",
            simon: "Simon",
            postit: "Sticky Note",
            bootScript: "Boot Scripts",
            bugCentral: "Bug Central",
            rdp: "Remote Desktop Host",
            rdpViewer: "Remote Desktop Viewer",
            graph: "Function Grapher",
            extDebug: "External Debug",
            mouseControl: "Alternate Mouse Control",
            onlineDebug: "Online Debug Connection",
            fileBin: "File Binary",
            magnifier: "Magnifier",
            jana: "Jana",
            cookieClicker: "Cookie Clicker"
        },
        startMenu: {
            power: 'Power',
            taskManager: 'Task Manager',
            jsConsole: 'JavaScript Console',
            settings: 'Settings',
            files: 'Files',
            allApps: 'All Apps',
            aosHelp: 'aOS Help',
            search: 'Search',
            shutDown: 'Shut Down',
            restart: 'Restart'
        },
        ctxMenu: {
            settings: 'Settings',
            jsConsole: 'JavaScript Console',
            screenResolution: 'Change Screen Resolution',
            desktopBackground: 'Change Desktop Background',
            addIcon: 'Add Icon',
            speak: 'Speak',
            taskbarSettings: 'Taskbar Settings',
            openApp: 'Open',
            moveIcon: 'Move Icon',
            showApp: 'Show',
            hideApp: 'Hide',
            closeApp: 'Close',
            fold: 'Fold',
            fullscreen: 'Toggle Fullscreen',
            stayOnTop: 'Stay On Top',
            stopOnTop: 'Stop Staying On Top',
            copyText: 'Copy',
            pasteText: 'Paste'
        },
        jsConsole: {
            caption: 'Javascript Console',
            runCode: 'Run Code',
            input: 'Input'
        },
        prompt: {
            caption: 'Application Prompt',
            genericAlert: 'This app is used for alerts and prompts in aOS apps.',
            ok: 'OK',
            alertText: 'wants to tell you', // lowercase
            alertUnnamed: 'Alert from an anonymous app',
            confirmText: 'wants a choice from you', // lowercase
            confirmUnnamed: 'Pick a choice for an anonymous app',
            promptText: 'wants some info from you', // lowercase
            promptUnnamed: 'Enter some info for an anonymous app'
        },
        notepad: {
            caption: 'Text Editor',
            // these are all buttons...
            save: 'Save',
            load: 'Load',
            file: 'File',
            tools: 'Tools'
        }
    },
    uv: {
        aOS: {
            framesPerSecond: 'Frames Per Second',
            cpuUsage: 'Central Processing Unit Load',
            failedVarTry: 'unsuccessfull', // lowercase
            fatalError1: 'aOS has reached a fatal error that it was not expecting - the current operation has been aborted the OS has been paused, at least as long as this popup remains open.',
            fatalError2: 'Horrific disaster in',
            fatalError3: 'Module in which said horrific disaster occurred', // lowercase
            fatalError4: 'within line number', // lowercase
            fatalError5: 'Direct a report of the details of this error directly to the developer for review?',
            errorReport: 'Failed miserably to save the report to the server. AaronOS has either failed completely to initialize or extremely crucial and vital components have been deleted or heavily damaged. Please email mineandcraft12@gmail.com with the details of your issue if you would like it fixed.'
        },
        appNames: {
            startMenu: "aOS Dashboard",
            nora: "The Developer\'s Name Backwards",
            taskManager: "Interval and Timeout Manager",
            jsConsole: "Interface Utitlized to Run JavaScript Code On-The-Fly",
            bash: "Terminal that Makes a Rather Sad Attempt at Trying to be a Bash Terminal",
            cpuMon: "Centrol Processing Unit Load Drawer",
            prompt: "That Random Screen that Pops Up When an Application Demands Attention",
            settings: "Tool to Configure the AaronOS Desktop Environment",
            iconMaker: "Tool to Create New Desktop Icons on the Desktop",
            windowTest: "The First Application Ever Made for AaronOS",
            testTwo: "The Second Application Ever Made for AaronOS",
            ragdoll: "Program Ported from my TI-83 Plus Graphing Calculator",
            notepad: "Program for Modifying the Contents of Text-Based Files",
            properties: "Helper Program for Viewing the Properties of a File or Folder in Greater Detail",
            files: "The File Manager that Comes with AaronOS",
            changelog: "The Log that the Developer Places All of the Changes to AaronOS",
            flashCards: "Application to Randomly Select and Display Flashcards from a List",
            pngSave: "Application that Makes a Sad Attempt at Saving PNG Images to the AaronOS File System",
            canvasGame: "Video Games Written in JavaScript that Utitlize a Canvas Interface",
            internet: "Sad Excuse for a Web Browser",
            aerotest: "Application for Easily Testing the Visual Quality of the WindowBlur Effect",
            savemaster: "Framework that AaronOS Applications Use to Save Files",
            mouserecord: "Old Abandoned Script that Tracks Your Mouse and Stores it in a File for You",
            ti: "Simulator of Texas Instruments 83 Plus Calculator",
            appAPI: "Poorly Written Application Program Interface Documentation",
            appmaker: "Application that Creates Applications",
            calculator: "Application that Solves Basic Mathematical Queries",
            search: "Look For a File or Application within AaronOS",
            image: "Abandoned Image Editor",
            changecalc: "Application that Calculates Change",
            messaging: "Application that Bridges the Gap Between People Online",
            camera: "Sad Excuse for a Mirror",
            help: "Application that Attempts to Assist a User in Using AaronOS",
            musicVis: "Application that Creates Stunning Visuals Based on a Music File",
            perfMonitor: "Application that Attempts to Monitor Performance",
            mathway: "Mathway",
            appsbrowser: "Comprehensive List of all Applications that are Installed on AaronOS",
            indycar: "Video Game Depicting Indycar",
            housegame: "Video Game that Takes Place Between Two Warring Factions",
            simon: "Simon",
            postit: "Sticky Note",
            bootScript: "Boot Scripts",
            bugCentral: "Bug Central",
            rdp: "Remote Desktop Host",
            rdpViewer: "Remote Desktop Viewer",
            graph: "Function Grapher",
            extDebug: "External Debug",
            mouseControl: "Alternate Mouse Control",
            onlineDebug: "Online Debug Connection",
            fileBin: "File Binary",
            magnifier: "Magnifier",
            jana: "Jana",
            cookieClicker: "Cookie Clicker"
        },
        startMenu: {
            power: 'Power',
            taskManager: 'Task Manager',
            jsConsole: 'JavaScript Console',
            settings: 'Settings',
            files: 'Files',
            allApps: 'All Apps',
            aosHelp: 'aOS Help',
            search: 'Search',
            shutDown: 'Shut Down',
            restart: 'Restart'
        },
        ctxMenu: {
            settings: 'Settings',
            jsConsole: 'JavaScript Console',
            screenResolution: 'Change Screen Resolution',
            desktopBackground: 'Change Desktop Background',
            addIcon: 'Add Icon',
            speak: 'Speak',
            taskbarSettings: 'Taskbar Settings',
            openApp: 'Open',
            moveIcon: 'Move Icon',
            showApp: 'Show',
            hideApp: 'Hide',
            closeApp: 'Close',
            fold: 'Fold',
            fullscreen: 'Toggle Fullscreen',
            stayOnTop: 'Stay On Top',
            stopOnTop: 'Stop Staying On Top',
            copyText: 'Copy',
            pasteText: 'Paste'
        }
    },
    ch: {
        aOS: {
            failedVarTry: '&#x5931;&#x8D25;',
            fatalError1: 'aOS \u81F4\u547D\u5DEE\u9519 - \u7A0B\u5E8F\u6682\u505C.',
            fatalError2: '\u5DEE\u9519\u4E0A',
            fatalError4: '\u5728',
            fatalError5: '\u53D1\u9001\u5DEE\u9519\u62A5\u6848?'
        },
        appNames: {
            startMenu: 'aOS Dashboard', //&#x5E94;&#x7528;&#x7A0B;&#x5E8F;&#x5217;&#x51FA;
            taskManager: '&#x4EFB;&#x52A1;&#x7ECF;&#x7406;',
            jsConsole: 'JavaScript &#x64CD;&#x4F5C;&#x53F0;',
            bash: '&#x8D5D;&#x54C1;-Bash &#x7EC8;&#x7AEF;',
            cpuMon: 'CPU &#x663E;&#x793A;&#x5C4F;',
            prompt: '&#x5E94;&#x7528;&#x7A0B;&#x5E8F;&#x63D0;&#x793A;&#x7B26;',
            settings: '&#x8BBE;&#x7F6E;',
            iconMaker: '&#x684C;&#x9762;&#x7167;&#x7247;&#x521B;&#x9020;&#x8005;',
            ragdoll: '&#x7834;&#x5E03;&#x5A03;&#x5A03;',
            notepad: '&#x8BB0;&#x4E8B;&#x7C3F;',
            files: '&#x6587;&#x4EF6;',
            changelog: '&#x8F6C;&#x53D8;&#x516C;&#x544A;',
            internet: '&#x4E0A;&#x7F51;',
            calculator: '&#x8BA1;&#x7B97;&#x5668;',
            search: '&#x68C0;&#x7D22;',
            camera: '&#x7167;&#x76F8;&#x673A;',
            help: 'aOS &#x5E2E;&#x5FD9;',
            appsbrowser: '&#x5E94;&#x7528;&#x7A0B;&#x5E8F;&#x68C0;&#x7D22;',
            housegame: '&#x5BB6;&#x6E38;&#x620F;',
            bugCentral: '&#x75C5;&#x6BD2;&#x5217;&#x51FA;',
            fileBin: '&#x6587;&#x4EF6;&#x6570;&#x5236;'
        },
        startMenu: {
            power: '&#x7535;&#x529B;',
            taskManager: '&#x4EFB;&#x52A1;&#x7ECF;&#x7406;',
            jsConsole: 'JavaScript &#x64CD;&#x4F5C;&#x53F0;',
            settings: '&#x8BBE;&#x7F6E;',
            files: '&#x6587;&#x4EF6;',
            allApps: '&#x6BCF; &#x5E94;&#x7528;&#x7A0B;&#x5E8F;',
            aosHelp: 'aOS &#x5E2E;&#x5FD9;',
            search: '&#x68C0;&#x7D22;',
            shutDown: '&#x505C;&#x6446;',
            restart: '&#x91CD;&#x542F;'
        },
        ctxMenu: {
            settings: '&#x8BBE;&#x7F6E;',
            jsConsole: 'JavaScript &#x64CD;&#x4F5C;&#x53F0;',
            addIcon: '&#x52A0;&#x5165;&#x7167;&#x7247;',
            speak: '&#x8BF4;',
            taskbarSettings: 'Taskbar &#x8BBE;&#x7F6E;',
            openApp: '&#x6253;&#x5F00;',
            moveIcon: '&#x642C;&#x5BB6;&#x7167;&#x7247;',
            showApp: '&#x5C55;&#x89C8;',
            hideApp: '&#x9690;&#x85CF;',
            closeApp: '&#x5173;&#x95ED;',
            fold: '&#x6298;&#x53E0;',
            copyText: '&#x590D;&#x5236;'
        }
    }
}
// replace some text with its chosen language
function langOld(appCode, langPiece){
    if(typeof apps[appCode].vars.language[currentlanguage] !== "undefined"){
        return apps[appCode].vars.language[currentlanguage][langPiece];
    }else{
        return apps[appCode].vars.language.en[langPiece];
    }
}
function lang(appCode, langPiece, forceEN){
    if(forceEN){
        if(typeof langContent.en[appCode] !== "undefined"){
            if(typeof langContent.en[appCode][langPiece] !== "undefined"){
                return langContent.en[appCode][langPiece];
            }else{
                return 'LanguageError: No translation for ' + langPiece + ' of app ' + appCode + ' in language en.';
            }
        }else{
            return 'LanguageError: Language en does not support app ' + appCode + '.';
        }
    }else if(typeof langContent[currentlanguage] !== "undefined"){
        if(typeof langContent[currentlanguage][appCode] !== "undefined"){
            if(typeof langContent[currentlanguage][appCode][langPiece] !== "undefined"){
                return langContent[currentlanguage][appCode][langPiece];
            }else if(typeof langContent.en[appCode][langPiece] !== "undefined"){
                return langContent.en[appCode][langPiece];
            }else{
                return 'LanguageError: No translation for ' + langPiece + ' of app ' + appCode + ' in language ' + currentlanguage + '.';
            }
        }else{
            return 'LanguageError: Language ' + currentlanguage + ' does not support app ' + appCode + '.';
        }
    }else{
        return lang(appCode, langPiece, 1);
    }
}

// text-speech functions
var lastTTS = "";
function textspeech(message){
    d(1, 'Doing text-speech: ' + message);
    lastTTS = "";
    //for(var i in message){
    //    lastTTS += encodeURIComponent(message[i]);
    //}
    //getId('TTSiframe').src = 'http://codewelt.com/proj/speak?lang=en-us&text=' + lastTTS;
    openapp(apps.nora, 'tskbr');
    // lol, noraa handles this now
    apps.nora.vars.lastSpoken = 0;
    apps.nora.vars.say('<span style="color:#ACE">Text-to-speech from selection:</span>');
    apps.nora.vars.lastSpoken = 1;
    apps.nora.vars.say(message);
}

// this is where the user's files go
var USERFILES = [];
// cant remember what these are
var tempUserfileTree = [];
var tempUserfile = '';
var tempUserfileCopy = '';

// element control shorthand
function getId(target){
	return document.getElementById(target);
}
// make desktop invisible to speed up boot
if(!dirtyLoadingEnabled){
    getId('desktop').style.display = 'none';
    getId('taskbar').style.display = 'none';
}

//find client scrollbar size
m('init Scrollsize');
var scrollWidth = getId("findScrollSize").offsetWidth - getId("findScrollSize").clientWidth;
var scrollHeight = getId("findScrollSize").offsetHeight - getId("findScrollSize").clientHeight;
getId('findScrollSize').style.display = 'none';

// function to format a string into a date into a string
m('init formDate');
var tempDate;
var date;
var skipKey;
var tempDayt;
var dateDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var dateForms = {
    D: function(){ // day number
        tempDate += date.getDate();
    },
    d: function(){ // day of week
        tempDate += dateDays[date.getDay()];
    },
    y: function(){ // 2-digit year
        tempDate += String(date.getFullYear() - 2000);
    },
    Y: function(){ // 4-digit year
        tempDate += date.getFullYear();
    },
    h: function(){ // 12-hour time
        if(date.getHours() > 12){
			tempDayt = String((date.getHours()) - 12);
		}else{
			tempDayt = String(date.getHours());
		}
		if(tempDayt === "0"){
			tempDate += "12";
		}else{
			tempDate += tempDayt;
		}
    },
    H: function(){ // 24-hour time
        tempDate += String(date.getHours());
    },
    s: function(){ // milliseconds
        if(date.getMilliseconds() < 10){
		    tempDate += '00' + date.getMilliseconds();
	    }else if(date.getMilliseconds() < 100){
	        tempDate += '0' + date.getMilliseconds();
	    }else{
	        tempDate += date.getMilliseconds();
	    }
    },
    S: function(){ // seconds
        tempDayt = String(date.getSeconds());
		if(tempDayt < 10){
            tempDate += "0" + tempDayt;
		}else{
            tempDate += tempDayt;
		}
    },
    m: function(){ // minutes
        tempDayt = date.getMinutes();
		if(tempDayt < 10){
            tempDate += "0" + tempDayt;
		}else{
            tempDate += tempDayt;
		}
    },
    M: function(){ // month
        tempDate += String(date.getMonth() + 1);
    },
    "-": function(){ // escape character
        
    }
};
// function to use above functions to form a date string
function formDate(dateStr){
	tempDate = "";
	date = new Date();
	skipKey = 0;
	// loops thru characters and replaces them with the date
	for(var dateKey in dateStr){
		if(skipKey){
			skipKey = 0;
		}else{
		    if(dateForms[dateStr[dateKey]]){
		        dateForms[dateStr[dateKey]]();
		    }else{
		        tempDate += dateStr[dateKey];
		    }
		}
	}
	return tempDate;
}

// functions to find FPS
m('init FPS counter variables');
var VFPScount = 0;
var VFPSlastTime = formDate("S");
var VFPSthisTime = formDate("S");
var stringVFPS = "0FPS ";
var stringFPSload = "0%";
var maxVFPS = 1;
var maxFPS = 1;
m('init FPS counter');
// this is the counter for video fps
function countVisualFPS(){
    VFPScount++;
    VFPSthisTime = formDate("S");
    if(VFPSthisTime !== VFPSlastTime){
        stringVFPS = VFPScount + "FPS ";
        VFPScount = 0;
    }
    VFPSlastTime = VFPSthisTime;
    window.requestAnimationFrame(countVisualFPS);
}
m('start FPS counter');
window.requestAnimationFrame(countVisualFPS);

// taskbar settings
var tskbrToggle = {
    perfMode: 0,
    /*
    netStat: 1,
    batStat: 1,
    batComp: 1,
    fpsStat: 1,
    fpsComp: 1,
    lodStat: 1,
    timeComp: 1,
    */
    tskbrPos: 0 // 0, 1, 2, 3 : bot, top, left, right
};

// more fps functions
m('init FPS display');
var showTimeColon = 0;
var timeElement = getId("time");
var thisFPStime = formDate("S");
var lastFPStime = formDate("S");
var stringFPS = "";
var numbFPS = 0;
var doLog;
// count javascript fps
function countFPS(){
    thisFPStime = formDate("S");
    numbFPS++;
    if(lastFPStime !== thisFPStime){
        stringFPS = numbFPS + "/";
        lastFPStime = thisFPStime;
        maxFPS = Math.max(maxFPS, parseInt(stringFPS, 10));
        maxVFPS = Math.max(maxVFPS, parseInt(stringVFPS, 10));
        stringFPSload = Math.round(100 - Math.min((parseInt(stringFPS, 10) / maxFPS), (parseInt(stringVFPS, 10) / maxVFPS)) * 100) + '% ' + lang('aOS', 'cpuUsage');
        numbFPS = 0;
    }
    window.setTimeout(countFPS, 0);
}

// loading the battery
var cpuBattery = {};
var taskbarOnlineStr = " }|[";
var taskbarBatteryStr = "????";
var batteryLevel = -1;
var batteryCharging = -1;
// if battery is not supported, place a fake function to replace it
if(!window.navigator.getBattery){
    window.navigator.getBattery = function(){
        return {
            then: function(callback){
                callback({
                    level:' ? ',
                    charging: false,
                    addEventListener: function(eventname, eventcallback){
                        return false;
                    }
                });
            }
        };
    };
}
var batterySetupAttempts = 1;
var batterySetupSuccess = 0;
// load the battery
function setupBattery(){
    //doLog("Setting up battery... Attempt " + (batterySetupAttempts++) + " / 10", "#FF0");
    window.navigator.getBattery().then(function(battery){
        cpuBattery = battery;
        if(cpuBattery.level !== ' ? '){
            batteryLevel = cpuBattery.level;
            batteryCharging = cpuBattery.charging;
            taskbarBatteryStr = Math.round(cpuBattery.level * 100);
            if(taskbarBatteryStr < 10){
                taskbarBatteryStr = "00" + taskbarBatteryStr;
            }else if(taskbarBatteryStr !== 100){
                taskbarBatteryStr = "0" + taskbarBatteryStr;
            }
            if(cpuBattery.charging){
                taskbarBatteryStr = taskbarBatteryStr + "+";
            }else{
                taskbarBatteryStr = taskbarBatteryStr + "-";
            }
            cpuBattery.addEventListener('levelchange', function(/*battery*/){
                d(2, 'Battery level changed.');
                batteryLevel = cpuBattery.level;
                batteryCharging = cpuBattery.charging;
                taskbarBatteryStr = Math.round(cpuBattery.level * 100);
                if(taskbarBatteryStr < 10){
                    taskbarBatteryStr = "00" + taskbarBatteryStr;
                }else if(taskbarBatteryStr !== 100){
                    taskbarBatteryStr = "0" + taskbarBatteryStr;
                }
                if(cpuBattery.charging){
                    taskbarBatteryStr = taskbarBatteryStr + "+";
                }else{
                    taskbarBatteryStr = taskbarBatteryStr + "-";
                }
            }/*.bind(null, battery)*/);
            cpuBattery.addEventListener('chargingchange', function(/*battery*/){
                d(2, 'Battery charging changed.');
                batteryLevel = cpuBattery.level;
                batteryCharging = cpuBattery.charging;
                taskbarBatteryStr = Math.round(cpuBattery.level * 100);
                if(taskbarBatteryStr < 10){
                    taskbarBatteryStr = "00" + taskbarBatteryStr;
                }else if(taskbarBatteryStr !== 100){
                    taskbarBatteryStr = "0" + taskbarBatteryStr;
                }
                if(cpuBattery.charging){
                    taskbarBatteryStr = taskbarBatteryStr + "+";
                }else{
                    taskbarBatteryStr = taskbarBatteryStr + "-";
                }
            }/*.bind(null, battery)*/);
        }
    });
}
setTimeout(setupBattery, 500);
// if failed, retry again
function retryBattery(){
    if(cpuBattery === undefined || cpuBattery.level === ' ? ' || objLength(cpuBattery) === 0){
        //doLog('Battery setup failed. [' + [(cpuBattery === undefined), (cpuBattery.level === ' ? '), (objLength(cpuBattery) === 0)] + '] Retrying...', '#F70');
        setupBattery();
    }else if(!batterySetupSuccess){
        //doLog('Battery setup success! [' + [(cpuBattery === undefined), (cpuBattery.level === ' ? '), (objLength(cpuBattery) === 0)] + ']', '#FF0');
        batterySetupSuccess = 1;
    }
}
// battery will be tested 10 times, sometimes it STILL fails this test! EW!
for(i = 1000; i < 5500; i += 500){
    setTimeout(retryBattery, i);
}
// give up on the battery
function failBattery(){
    if(cpuBattery === undefined || cpuBattery.level === ' ? ' || objLength(cpuBattery) === 0){
        doLog('Battery setup aborted. [' + [(cpuBattery === undefined), (cpuBattery.level === ' ? '), (objLength(cpuBattery) === 0)] + ']', '#F00');
        if(!USERFILES.WIDGETLIST){
            removeWidget('battery', 1);
        }
    }else if(!batterySetupSuccess){
        doLog('Battery setup success! [' + [(cpuBattery === undefined), (cpuBattery.level === ' ? '), (objLength(cpuBattery) === 0)] + ']', '#FF0');
        batterySetupSuccess = 1;
    }
}
setTimeout(failBattery, 5500);

// update network info on the taskbar
function taskbarShowHardware(){
    /*
    if(window.navigator.onLine){
        if(!apps.savemaster.vars.saving){
            taskbarOnlineStr = " }-{ ";
        }else if(apps.savemaster.vars.saving === 2){
            taskbarOnlineStr = " }&uarr;{ ";
        }else if(apps.savemaster.vars.saving === 3){
            taskbarOnlineStr = " }&darr;{ ";
        }else{
            taskbarOnlineStr = " }={ ";
        }
    }else{
        taskbarOnlineStr = " }|{ ";
    }
    */
    if(window.navigator.onLine){
        if(!apps.savemaster.vars.saving){
            taskbarOnlineStr = "] [";
        }else if(apps.savemaster.vars.saving === 2){
            taskbarOnlineStr = "}-[";
        }else if(apps.savemaster.vars.saving === 3){
            taskbarOnlineStr = "]-{";
        }else{
            taskbarOnlineStr = "}-{";
        }
    }else{
        taskbarOnlineStr = "]X[";
    }
}
// build final network string for taskbar
/*
function tskbrGetNetStr(){
    if(tskbrToggle.netStat){
        return taskbarOnlineStr;
    }else{
        return "";
    }
}
// build final battery string for taskbar
function tskbrGetBatStr(){
    if(tskbrToggle.batStat){
        if(tskbrToggle.batComp){
            return ' <div id="stylishBattery"><div style="overflow:visible;width:' + Math.round(batteryLevel * 50) + 'px;height:21px;background-color:rgb(' + Math.round(255 - (batteryLevel * 255)) + ',' + Math.round(batteryLevel * 255) + ',' + (batteryCharging * 255) + ');text-align:center;">' + Math.round(batteryLevel * 100) + '</div></div>&nbsp; &nbsp; ]';
        }else{
            return taskbarBatteryStr;
        }
    }else{
        return "";
    }
}
// build final fps string for taskbar
function tskbrGetFpsStr(){
    if(tskbrToggle.fpsStat){
        if(tskbrToggle.fpsComp){
            return '<div id="compactFPS">' + stringFPS.substring(0, stringFPS.length - 1) + '<br>' + stringVFPS.substring(0, stringVFPS.length - 4) + '</div>&nbsp;&nbsp&nbsp;' + lang('aOS', 'framesPerSecond') + ' ';
        }else{
            return stringFPS + stringVFPS;
        }
    }else{
        return "";
    }
}
// build final cpu load string for taskbar
function tskbrGetLodStr(){
    if(tskbrToggle.lodStat){
        return stringFPSload;
    }else{
        return "";
    }
}
// build final time string for taskbar
function tskbrGetTimeStr(){
    if(tskbrToggle.timeComp){
        return '<div id="compactTime">' + formDate("M-/D-/y") + '<br>' + formDate("h-:m-:S") + '</div>&nbsp;&nbsp;&nbsp;&nbsp;';
    }else{
        return formDate("d- M-/D-/y- h-:m-:S");
    }
}
*/
//showTimeOnTaskbar();
getId("icons").innerHTML = "";

//function to ping the aOS server
m('init ping functions');
var aOSpingxhttp = {};
function aOSping(callbackScript){
    d(1, 'Pinging aOS...');
    aOSpingxhttp = new XMLHttpRequest();
    aOSpingxhttp.onreadystatechange = function() {
        if(aOSpingxhttp.readyState === 4){
            apps.savemaster.vars.saving = 0;
            taskbarShowHardware();
            callbackScript([perfCheck('aOSping'), aOSpingxhttp.status]);
        }
    };
    aOSpingxhttp.open('GET', 'xmlping.php', 'true');
    perfStart('aOSping');
    apps.savemaster.vars.saving = 1;
    taskbarShowHardware();
    aOSpingxhttp.send();
}
// ping the CORS proxy
var corspingxhttp = {};
function corsPing(callbackScript){
    d(2, 'Pinging CORS...');
    corspingxhttp = new XMLHttpRequest();
    corspingxhttp.onreadystatechange = function() {
        if(corspingxhttp.readyState === 4){
            apps.savemaster.vars.saving = 0;
            taskbarShowHardware();
            callbackScript([perfCheck('corsping'), corspingxhttp.status]);
        }
    };
    corspingxhttp.open('GET', apps.settings.vars.corsProxy + 'https://duckduckgo.com/', 'true');
    perfStart('corsping');
    apps.savemaster.vars.saving = 1;
    taskbarShowHardware();
    corspingxhttp.send();
}

// live elements allow dynamic content to be placed on the page w/o manual updating
var liveElements = [];
// checks for live elements
function checkLiveElements(){
    liveElements = document.getElementsByClassName('liveElement');
    for(var elem in liveElements){
        if(elem == parseInt(elem)){
            if(liveElements[elem].getAttribute('data-live-target') === null){
                try{
                    liveElements[elem].innerHTML = eval(liveElements[elem].getAttribute('data-live-eval'));
                }catch(err){
                    liveElements[elem].innerHTML = 'LiveElement Error: ' + err;
                }
            }else{
                try{
                    eval('liveElements[' + elem + '].' + liveElements[elem].getAttribute('data-live-target') + ' = "' + eval(liveElements[elem].getAttribute('data-live-eval')) + '"');
                }catch(err){
                    //doLog(' ');
                    //doLog('LiveElement Error: ' + err, '#F00');
                    //doLog('Element #' + elem, '#F00');
                    //doLog('Target ' + liveElements[elem].getAttribute('data-live-target'), '#F00');
                    //doLog('Value ' + liveElements[elem].getAttribute('data-live-eval'), '#F00');
                }
            }
        }
    }
    requestAnimationFrame(checkLiveElements);
}
requestAnimationFrame(checkLiveElements);
function logLiveElement(str){
    doLog('<span class="liveElement" data-live-eval="' + str + '"></span>');
};
function makeLiveElement(str){
    return '<span class="liveElement" data-live-eval="' + str + '"></span>';
}
// list of pinned apps
var pinnedApps = [];
function pinApp(app){
    if(pinnedApps.indexOf(app) === -1){
        pinnedApps.push(app);
    }else{
        pinnedApps.splice(pinnedApps.indexOf(app), 1);
    }
    ufsave('aos_system/taskbar/pinned_apps', JSON.stringify(pinnedApps));
}

// Smart Icon Builder
var smartIconOptions = {
    radiusTopLeft: 100,
    radiusTopRight: 100,
    radiusBottomLeft: 100,
    radiusBottomRight: 100,
    backgroundOpacity: 1,
    bgColor: ''
};
function updateSmartIconStyle(){
    getId("smartIconStyle").innerHTML = '.smarticon_bg{border-top-left-radius:' + smartIconOptions.radiusTopLeft + '%;border-top-right-radius:' + smartIconOptions.radiusTopRight + '%;border-bottom-left-radius:' + smartIconOptions.radiusBottomLeft + '%;border-bottom-right-radius:' + smartIconOptions.radiusBottomRight + '%;display:' + function(){if(smartIconOptions.backgroundOpacity){return 'block'}else{return 'none'}}() + ';' + function(){if(smartIconOptions.bgColor){return 'background-color:' + smartIconOptions.bgColor.split(';')[0] + ' !important;'}else{return ''}}() + '}.smarticon_nobg{display:' + function(){if(smartIconOptions.backgroundOpacity){return 'none'}else{return 'block'}}() + ';}';
    var allSmartIconsBG = document.getElementsByClassName("smarticon_bg");
    for(var i = 0; i < allSmartIconsBG.length; i++){
        var currSize = parseFloat(allSmartIconsBG[i].getAttribute("data-smarticon-size"));
        allSmartIconsBG[i].style.borderTopLeftRadius = Math.round((currSize / 2) * (smartIconOptions.radiusTopLeft / 100)) + 'px';
        allSmartIconsBG[i].style.borderTopRightRadius = Math.round((currSize / 2) * (smartIconOptions.radiusTopRight / 100)) + 'px';
        allSmartIconsBG[i].style.borderBottomLeftRadius = Math.round((currSize / 2) * (smartIconOptions.radiusBottomLeft / 100)) + 'px';
        allSmartIconsBG[i].style.borderBottomRightRadius = Math.round((currSize / 2) * (smartIconOptions.radiusBottomRight / 100)) + 'px';
    }
    var allSmartIconsBorder = document.getElementsByClassName("smarticon_border");
    for(var i = 0; i < allSmartIconsBorder.length; i++){
        var currSize = parseFloat(allSmartIconsBorder[i].getAttribute("data-smarticon-size"));
        allSmartIconsBorder[i].style.borderTopLeftRadius = Math.round((currSize / 2) * (smartIconOptions.radiusTopLeft / 100)) + 'px';
        allSmartIconsBorder[i].style.borderTopRightRadius = Math.round((currSize / 2) * (smartIconOptions.radiusTopRight / 100)) + 'px';
        allSmartIconsBorder[i].style.borderBottomLeftRadius = Math.round((currSize / 2) * (smartIconOptions.radiusBottomLeft / 100)) + 'px';
        allSmartIconsBorder[i].style.borderBottomRightRadius = Math.round((currSize / 2) * (smartIconOptions.radiusBottomRight / 100)) + 'px';
    }
}
function saveSmartIconStyle(){
    ufsave("aos_system/smarticon_settings", JSON.stringify(smartIconOptions));
}
/*
options{
    backgroundColor: "#FFFFFF",
    background: "smarticons/aOS/bg.png",
    backgroundBorder: {
        thickness: 1,
        color: "#000000"
    },
    foreground: "smarticons/aOS/fg.png",
}
*/
function buildSmartIcon(size, options, optionalcss){
    if(typeof options === "string"){
        options = {foreground:options};
    }
    if(!options){
        options = {};
    }
    var icoTemp = '<div class="smarticon" style="width:' + size + 'px;height:' + size + 'px;';
    if(optionalcss){
        icoTemp += optionalcss;
    }
    icoTemp += '">';
    if(options.foreground){
        icoTemp += '<div class="smarticon_nobg" style="background:url(' + cleanStr(options.foreground.split(";")[0]) + ');"></div>';
    }
    icoTemp += '<div class="smarticon_bg" data-smarticon-size="' + size + '" style="' +
        'border-top-left-radius:' + Math.round((size / 2) * (smartIconOptions.radiusTopLeft / 100)) + 'px;' +
        'border-top-right-radius:' + Math.round((size / 2) * (smartIconOptions.radiusTopRight / 100)) + 'px;' +
        'border-bottom-left-radius:' + Math.round((size / 2) * (smartIconOptions.radiusBottomLeft / 100)) + 'px;' +
        'border-bottom-right-radius:' + Math.round((size / 2) * (smartIconOptions.radiusBottomRight / 100)) + 'px;';
    if(options.background){
        icoTemp += 'background:url(' + cleanStr(options.background.split(';')[0]) + ');';
    }
    if(options.backgroundColor){
        icoTemp += 'background-color:' + cleanStr(options.backgroundColor.split(';')[0]) + ';';
    }
    icoTemp += '">';
    if(options.foreground){
        icoTemp += '<div class="smarticon_fg" style="background:url(' + cleanStr(options.foreground.split(";")[0]) + ');"></div>';
    }
    if(options.backgroundBorder){
        icoTemp += '<div class="smarticon_border" data-smarticon-size="' + size + '" style="box-shadow:inset 0 0 0 ' + (size / 32 * (options.backgroundBorder.thickness || 1)) + 'px ' + cleanStr(options.backgroundBorder.color.split(";")[0]) + ';' +
            'border-top-left-radius:' + Math.round((size / 2) * (smartIconOptions.radiusTopLeft / 100)) + 'px;' +
            'border-top-right-radius:' + Math.round((size / 2) * (smartIconOptions.radiusTopRight / 100)) + 'px;' +
            'border-bottom-left-radius:' + Math.round((size / 2) * (smartIconOptions.radiusBottomLeft / 100)) + 'px;' +
            'border-bottom-right-radius:' + Math.round((size / 2) * (smartIconOptions.radiusBottomRight / 100)) + 'px;"></div>';
    }
    icoTemp += '</div></div>';
    return icoTemp;
}

function buildMarquee(text, style){
    return '<div class="marquee" style="' + (style || '') + '"><div class="marqueetext1">' + text + '</div><div class="marqueetext2">' + text + '</div></div>';
}

// Application class
m('init Application class');
var apps = {};
var appsSorted = [];
var appsSortedSafe = [];
var appTotal = 0;
var appPosX = 8;
var appPosY = 8;
var finishedMakingAppClicks = 0;
var Application = function(appIcon, appDesc, handlesLaunchTypes, mainFunction, signalHandlerFunction, appVariables, keepOffDesktop, appPath, appImg){
    try{
        /*
        if(doLog && appIcon){
            doLog('Init app ' + appIcon, '#D60');
        }
        */
        // this used to be used in HTML elements but now is just an abbreviation
        this.dsktpIcon = appIcon;
        // now HTML elements match the codename of apps
        this.objName = appPath;
        if(typeof langContent.en.appNames[appPath] === 'string'){
            this.appDesc = lang('appNames', appPath);
        }else{
            this.appDesc = appDesc;
        }
        this.main = mainFunction;
        this.signalHandler = signalHandlerFunction;
        if(handlesLaunchTypes){
            this.launchTypes = 1;
        }else{
            this.launchTypes = 0;
        }
        this.vars = appVariables;
        //this.varsOriginal = appVariables;
        this.appWindow = {
            /*
                these are the elements that make up a window...
                pretend in this case the app is called "settings"
                anything below that says "settings" can be replaced with the name of your app
                
                div .window #win_settings_top           Topmost window div, contains entire window
                    div .winAero   #win_settings_aero       Windowblur background of window (compare to Aero effect of Win7)
                    div .winBimg   #win_settings_img        Texture of window borders
                    div .winres    #win_settings_size       Handle to resize window
                    div .winCap    #win_settings_cap        Window caption with title and icon
                    div .winFld    #win_settings_fold       Button to fold window (compare to Shade in linux)
                    div .winHTML   #win_settings_html       HTML content of window, this is where your actual content goes
                    div .winBig    #win_settings_big        Button to maximize the window (make the window "big"ger)
                    div .winShrink #win_settings_shrink     Button to shrink, or hide, the window
                    div .winExit   #win_settings_exit       Button to close window
            */
            dsktpIcon: appIcon,
            objName: appPath,
            appImg: appImg,
            windowX: 100,
            windowY: 50,
            windowH: 525,
            windowV: 300,
            fullscreen: 0,
            appIcon: 0,
            dimsSet: 0,
            onTop: 0,
            alwaysOnTop: function(setTo){
                if(setTo && !this.onTop){
                    getId('win_' + this.objName + '_top').style.zIndex = '100';
                    this.onTop = 1;
                }else if(!setTo && this.onTop){
                    getId('win_' + this.objName + '_top').style.zIndex = '90';
                    this.onTop = 0;
                }
            },
            paddingMode: function(mode){
                if(mode){
                    getId("win_" + this.objName + "_html").classList.remove('noPadding');
                }else{
                    getId("win_" + this.objName + "_html").classList.add('noPadding');
                }
            },
            setDims: function(xOff, yOff, xSiz, ySiz, ignoreDimsSet){
                d(2, 'Setting dims of window.');
                if(!this.fullscreen){
                    if(xOff === "auto"){
                        xOff = Math.round(parseInt(getId('desktop').style.width) / 2 - (xSiz / 2));
                    }
                    if(yOff === "auto"){
                        yOff = Math.round(parseInt(getId('desktop').style.height) / 2 - (ySiz / 2));
                    }
                    xOff = Math.round(xOff);
                    yOff = Math.round(yOff);
                    if(this.windowX !== xOff){
                        getId("win_" + this.objName + "_top").style.left = xOff + "px";
                        //getId('win' + this.dsktpIcon).style.transform = 'translateX(' + xOff + 'px) translateY(' + yOff + 'px)';
                        this.windowX = Math.round(xOff);
                    }
                    if(this.windowY !== yOff){
                        getId("win_" + this.objName + "_top").style.top = (yOff * (yOff > -1)) + "px";
                        //getId('win' + this.dsktpIcon).style.transform = 'translateX(' + xOff + 'px) translateY(' + yOff + 'px)';
                        this.windowY = Math.round(yOff);
                    }
                    if(this.windowH !== xSiz){
                        getId("win_" + this.objName + "_top").style.width = xSiz + "px";
                        //getId("win_" + this.objName + "_cap").style.width = xSiz - 29 + "px";
                        //getId("win_" + this.objName + "_html").style.width = xSiz - 9 + "px";
                        getId("win_" + this.objName + "_aero").style.width = xSiz + 80 + "px";
                        this.windowH = xSiz;
                    }
                    if(this.windowV !== ySiz){
                        if(!this.folded){
                            getId("win_" + this.objName + "_top").style.height = ySiz + "px";
                        }
                        //getId("win_" + this.objName + "_html").style.height = ySiz - 24 + "px";
                        getId("win_" + this.objName + "_aero").style.height = ySiz + 80 + "px";
                        this.windowV = ySiz;
                    }
                    var aeroOffset = [0, 0];
                    if(tskbrToggle.tskbrPos === 1){
                        aeroOffset[1] = -32;
                    }else if(tskbrToggle.tskbrPos === 2){
                        aeroOffset[0] = -32;
                    }
                    try{
                        calcWindowblur(this.objName, 1);
                    }catch(err){
                        getId("win_" + this.objName + "_aero").style.backgroundPosition = (-1 * xOff + 40 + aeroOffset[0]) + "px " + (-1 * (yOff * (yOff > -1)) + 40 + aeroOffset[1]) + "px";
                    }
                    //getId("win" + this.dsktpIcon + "a").style.width = xSiz + 80 + "px";
                    //getId("win" + this.dsktpIcon + "a").style.height = ySiz + 80 + "px";
                    if(typeof this.dimsSet === 'function' && !ignoreDimsSet){
                        this.dimsSet();
                    }
                }
            },
            openWindow: function(){
                this.appIcon = 1;
                getId("win_" + this.objName + "_top").classList.remove('closedWindow');
                getId("win_" + this.objName + "_top").style.display = "block";
                getId("icn_" + this.objName).style.display = "inline-block";
                getId("icn_" + this.objName).classList.add("openAppIcon");
                getId("win_" + this.objName + "_top").style.pointerEvents = "";
                
                // experimental
                requestAnimationFrame(function(){
                    getId("win_" + this.objName + "_top").style.transform = 'scale(1)';
                    getId("win_" + this.objName + "_top").style.opacity = "1";
                }.bind(this));
                setTimeout(function(){
                    if(this.appIcon){
                        getId("win_" + this.objName + "_top").style.display = "block";
                        getId("win_" + this.objName + "_top").style.opacity = "1";
                    }
                }.bind(this), 300);
                // end experimental
            },
            closeWindow: function(){
                this.appIcon = 0;
                getId("win_" + this.objName + "_top").classList.add('closedWindow');
                
                // experimental
                getId('win_' + this.objName + '_top').style.transformOrigin = '';
                try{
                    getId("win_" + this.objName + "_top").style.transform = 'scale(' + apps.settings.vars.winFadeDistance + ')';
                }catch(err){
                    getId("win_" + this.objName + "_top").style.transform = 'scale(0.8)';
                }
                getId("win_" + this.objName + "_top").style.opacity = "0";
                getId("win_" + this.objName + "_top").style.pointerEvents = "none";
                setTimeout(function(){
                    if(!this.appIcon){
                        getId("win_" + this.objName + "_top").style.display = "none";
                        getId("win_" + this.objName + "_top").style.width = "";
                        getId("win_" + this.objName + "_top").style.height = "";
                        this.windowH = -1;
                        this.windowV = -1;
                    }
                    //getId("win" + this.dsktpIcon).style.opacity = "0";
                }.bind(this), 300);
                // end experimental
                
                // original
                //getId("win" + this.dsktpIcon).style.display = "none";
                //getId("win" + this.dsktpIcon).style.opacity = "0";
                
                if(pinnedApps.indexOf(this.objName) === -1){
                    getId("icn_" + this.objName).style.display = "none";
                }
                getId("icn_" + this.objName).classList.remove("openAppIcon");
                this.fullscreen = 0;
                if(this.folded){
                    this.foldWindow();
                }
                toTop({dsktpIcon: 'CLOSING'}, 1);
            },
            closeIcon: function(){
                if(pinnedApps.indexOf(this.objName) === -1){
                    getId("icn_" + this.objName).style.display = "none";
                }
            },
            folded: 0,
            foldWindow: function(){
                if(this.folded){
                    getId('win_' + this.objName + '_html').style.display = 'block';
                    getId('win_' + this.objName + '_top').style.height = this.windowV + 'px';
                    this.folded = 0;
                }else{
                    getId('win_' + this.objName + '_html').style.display = 'none';
                    getId('win_' + this.objName + '_top').style.height = 32 + apps.settings.vars.winBorder + 'px';
                    this.folded = 1;
                }
            },
            closeKeepTask: function(){
                // experimental
                if(this.objName !== 'startMenu'){
                    if(!mobileMode){
                        switch(tskbrToggle.tskbrPos){
                            case 1:
                                try{
                                    getId("win_" + this.objName + "_top").style.transformOrigin = getId("icn_" + this.objName).getBoundingClientRect().left - this.windowX + 23 + 'px ' + (0 - this.windowY) + 'px';
                                }catch(err){
                                    getId("win_" + this.objName + "_top").style.transformOrigin = '50% -' + window.innerHeight + 'px';
                                }
                                break;
                            case 2:
                                try{
                                    getId("win_" + this.objName + "_top").style.transformOrigin = (0 - this.windowX - 30) + 'px ' + (getId("icn_" + this.objName).getBoundingClientRect().top - this.windowY + 23) + 'px';
                                }catch(err){
                                    getId("win_" + this.objName + "_top").style.transformOrigin = '-' + window.innerWidth + 'px 50%';
                                }
                                break;
                            case 3:
                                try{
                                    getId("win_" + this.objName + "_top").style.transformOrigin = (parseInt(getId('monitor').style.width, 10) - this.windowX - 30) + 'px ' + (getId("icn_" + this.objName).getBoundingClientRect().top - this.windowY + 23) + 'px';
                                }catch(err){
                                    getId("win_" + this.objName + "_top").style.transformOrigin = '50% ' + window.innerWidth + 'px';
                                }
                                break;
                            default:
                                try{
                                    getId("win_" + this.objName + "_top").style.transformOrigin = getId("icn_" + this.objName).getBoundingClientRect().left - this.windowX + 23 + 'px ' + (parseInt(getId('monitor').style.height, 10) - this.windowY - 30) + 'px';
                                }catch(err){
                                    getId("win_" + this.objName + "_top").style.transformOrigin = '50% ' + window.innerHeight + 'px';
                                }
                        }
                    }else{
                        switch(tskbrToggle.tskbrPos){
                            case 1:
                                try{
                                    getId("win_" + this.objName + "_top").style.transformOrigin = getId("icn_" + this.objName).getBoundingClientRect().left + 23 + 'px 0px';
                                }catch(err){
                                    getId("win_" + this.objName + "_top").style.transformOrigin = '50% -' + window.innerHeight + 'px';
                                }
                                break;
                            case 2:
                                try{
                                    getId("win_" + this.objName + "_top").style.transformOrigin = '-30px ' + (getId("icn_" + this.objName).getBoundingClientRect().top + 23) + 'px';
                                }catch(err){
                                    getId("win_" + this.objName + "_top").style.transformOrigin = '-' + window.innerWidth + 'px 50%';
                                }
                                break;
                            case 3:
                                try{
                                    getId("win_" + this.objName + "_top").style.transformOrigin = (parseInt(getId('monitor').style.width, 10) - 30) + 'px ' + (getId("icn_" + this.objName).getBoundingClientRect().top + 23) + 'px';
                                }catch(err){
                                    getId("win_" + this.objName + "_top").style.transformOrigin = '50% ' + window.innerWidth + 'px';
                                }
                                break;
                            default:
                                try{
                                    getId("win_" + this.objName + "_top").style.transformOrigin = getId("icn_" + this.objName).getBoundingClientRect().left + 23 + 'px ' + (parseInt(getId('monitor').style.height, 10) - 30) + 'px';
                                }catch(err){
                                    getId("win_" + this.objName + "_top").style.transformOrigin = '50% ' + window.innerHeight + 'px';
                                }
                        }
                    }
                    //try{
                        getId("win_" + this.objName + "_top").style.transform = 'scale(0.1)'; //'scale(' + apps.settings.vars.winFadeDistance + ')';
                    //}catch(err){
                    //    getId("win" + this.dsktpIcon).style.transform = 'scale(0.5)';
                    //}
                    getId("win_" + this.objName + "_top").style.opacity = "0";
                    setTimeout(function(){
                        getId("win_" + this.objName + "_top").style.display = "none";
                        //getId("win" + this.dsktpIcon).style.opacity = "1";
                    }.bind(this), 300);
                }else{
                    getId("win_" + this.objName + "_top").style.display = "none";
                    // getId("win" + this.dsktpIcon).style.opacity = "0";
                }
                // end experimental
                
                // original
                //getId("win" + this.dsktpIcon).style.display = "none";
                //getId("win" + this.dsktpIcon).style.opacity = "0";
                
                setTimeout("getId('icn_" + this.objName + "').classList.remove('activeAppIcon')", 0);
            },
            setCaption: function(newCap){
                d(1, 'Changing caption.');
                if(this.appImg){
                    //getId("win_" + this.objName + "_cap").innerHTML = '<img class="legacyCaptionIcon" src="' + appImg + '" onerror="this.src=\'appicons/ds/redx.png\'"><div class="winCaptionTitle">' + newCap + '</div>';
                    getId("win_" + this.objName + "_cap").innerHTML = buildSmartIcon(32, this.appImg) + '<div class="winCaptionTitle">' + newCap + '</div>';
                }else{
                    getId("win_" + this.objName + "_cap").innerHTML = '<div class="winCaptionTitle">' + this.dsktpIcon + '|' + newCap + '</div>';
                }
            },
            setContent: function(newHTML){
                getId("win_" + this.objName + "_html").innerHTML = newHTML;
            },
            fullscreentempvars: [0, 0, 0, 0],
            toggleFullscreen: function(){
                d(1, 'Setting Maximise.');
                if(this.fullscreen){
                    this.fullscreen = 0;
                    this.setDims(this.fullscreentempvars[0], this.fullscreentempvars[1], this.fullscreentempvars[2], this.fullscreentempvars[3]);
                }else{
                    this.fullscreentempvars = [this.windowX, this.windowY, this.windowH, this.windowV];
                    this.setDims(-1 * apps.settings.vars.winBorder, 0, parseInt(getId('desktop').style.width, 10) + (apps.settings.vars.winBorder * 2), parseInt(getId('desktop').style.height, 10) + apps.settings.vars.winBorder);
                    this.fullscreen = 1;
                    //getId("win" + this.dsktpIcon).style.transform = 'scale(' + (parseInt(getId("desktop").style.width) / this.windowH) + ',' + (parseInt(getId("desktop").style.height) / this.windowV) + ')';
                }
            }
        };
        if(typeof this.appWindow.appImg === "string"){
            this.appWindow.appImg = {foreground:this.appWindow.appImg};
        }
        //if(this.appWindow.appImg){
            //getId("desktop").innerHTML +=
            //    '<div class="app cursorPointer" id="app_' + appPath + '" oncontextmenu="ctxMenu(baseCtx.appXXX, 1, event, [event, \'' + appPath + '\', \'' + appIcon + '\'])">' +
            //    //'<div class="appIcon" id="ico_' + appPath + '" style="pointer-events:none"><img style="max-height:64px;max-width:64px" src="' + appImg + '" onerror="this.src=\'appicons/ds/redx.png\'"></div>' +
            //    '<div class="appIcon" id="ico_' + appPath + '" style="pointer-events:none">' + buildSmartIcon(64, this.appWindow.appImg) + '</div>' +
            //    '<div class="appDesc" id="dsc_' + appPath + '">' + this.appDesc + '</div>' +
            //    '</div></div>';
        //}else{
            //getId("desktop").innerHTML +=
            //    '<div class="app cursorPointer" id="app_' + appPath + '" oncontextmenu="ctxMenu(baseCtx.appXXX, 1, event, [event, \'' + appPath + '\', \'' + appIcon + '\'])">' +
            //    '<div class="appIcon" id="ico_' + appPath + '">' + appIcon + '</div>' +
            //    '<div class="appDesc" id="dsc_' + appPath + '">' + this.appDesc + '</div>' +
            //    '</div></div>';
        //}
        this.keepOffDesktop = keepOffDesktop;
        if(!this.keepOffDesktop){
            newDsktpIcon(appPath, appPath, null, this.appDesc, this.appWindow.appImg,
                ['arg', 'openapp(apps[arg], "dsktp");'], [appPath],
                ['arg1', 'arg2', 'ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, arg2]);'], [appPath, appIcon],
                1
            );
        }
        //if(!keepOffDesktop){
        //    appTotal++;
            //these two lines all to determine the app's location on the desktop. phew!
            //that big comment is the old version; this new one is more accurate and also works to infinite total apps; in theory
            /*
            getId("app" + appIcon).style.left = (8 + (Math.floor((appTotal) / 6)) * 108) + "px";
            getId("app" + appIcon).style.top = (appTotal * 100 - (Math.floor((appTotal + 4) / 5)) * 100 + 8 - 400 * (appTotal > 5) - 400 * (appTotal > 10)) + "px";
            */
            //version 2 of positioning code
            /*
            getId("app" + appIcon).style.left = (8 + (Math.floor(appTotal / (Math.floor(window.innerHeight + 78) / 95))) * 108) + "px";
            getId("app" + appIcon).style.top = (8 + ((appTotal - 1) % Math.floor((window.innerHeight - 30) / 83) * 83)) + "px";
            */
        //    getId("app_" + appPath).style.left = appPosX + "px";
        //    getId("app_" + appPath).style.top = appPosY + "px";
        //    appPosY += 98;
        //    if(appPosY > window.innerHeight - 105){
        //        appPosY = 8;
        //        appPosX += 108;
        //    }
        //}else{
        //    getId("app_" + appPath).style.display = "none";
        //}
        getId("desktop").innerHTML +=
            '<div class="window closedWindow" id="win_' + appPath + '_top">' +
            '<div class="winAero" id="win_' + appPath + '_aero"></div>' +
            '<div class="winBimg" id="win_' + appPath + '_img"></div>' +
            '<div class="winRes cursorOpenHand" id="win_' + appPath + '_size"></div>' +
            '<div class="winCap cursorOpenHand" id="win_' + appPath + '_cap">' +
            '</div>' +
            '<div class="winFld cursorPointer" id="win_' + appPath + '_fold">^' +
            '</div>' +
            '<div class="winHTML" id="win_' + appPath + '_html">' +
            '</div>' +
            '<div class="winBig cursorPointer" id="win_' + appPath + '_big">o' +
            '</div>' +
            '<div class="winShrink cursorPointer" id="win_' + appPath + '_shrink">v' +
            '</div>' +
            '<div class="winExit cursorPointer" id="win_' + appPath + '_exit">x' +
            '</div></div>';
        if(this.appWindow.appImg){
            getId("icons").innerHTML +=
                '<div class="icon cursorPointer" id="icn_' + appPath + '">' +
                '<div class="iconOpenIndicator"></div>' +
                //'<img class="imageIco" src="' + appImg + '" onerror="this.src=\'appicons/ds/redx.png\'"></div>';
                buildSmartIcon(32, this.appWindow.appImg, "margin-left:6px") + '</div>';
        }else{
            getId("icons").innerHTML +=
                '<div class="icon cursorPointer" id="icn_' + appPath + '">' +
                '<div class="iconOpenIndicator"></div>' +
                '<div class="iconImg">' + appIcon +
                '</div></div>';
        }
        getId("win_" + appPath + "_cap").setAttribute("onmousedown", "if(!apps.settings.vars.clickToMove){if(event.button!==2){toTop(apps." + appPath + ");winmove(event);}event.preventDefault();return false;}");
        getId("win_" + appPath + "_size").setAttribute("onmousedown", "if(!apps.settings.vars.clickToMove){if(event.button!==2){toTop(apps." + appPath + ");winres(event);}event.preventDefault();return false;}");
        getId("win_" + appPath + "_cap").setAttribute("onclick", "if(apps.settings.vars.clickToMove){if(event.button!==2){toTop(apps." + appPath + ");winmove(event);}event.preventDefault();return false;}");
        getId("win_" + appPath + "_size").setAttribute("onclick", "if(apps.settings.vars.clickToMove){if(event.button!==2){toTop(apps." + appPath + ");winres(event);}event.preventDefault();return false;}");
        //getId("app_" + appPath).setAttribute("onClick", "openapp(apps." + appPath + ", 'dsktp')");
        getId("icn_" + appPath).setAttribute("onClick", "openapp(apps." + appPath + ", function(){if(apps." + appPath + ".appWindow.appIcon){return 'tskbr'}else{return 'dsktp'}}())");
        getId("win_" + appPath + "_top").setAttribute("onClick", "toTop(apps." + appPath + ")");
        if(appPath !== 'startMenu' && appPath !== 'nora'){
            getId("icn_" + appPath).setAttribute("oncontextmenu", "ctxMenu(baseCtx.icnXXX, 1, event, '" + appPath + "')");
            getId("icn_" + appPath).setAttribute("onmouseenter", "if(apps." + appPath + ".appWindow.appIcon){highlightWindow('" + appPath + "')}");
            getId("icn_" + appPath).setAttribute("onmouseleave", "highlightHide()");
        }
        getId("win_" + appPath + "_exit").setAttribute("onClick", "apps." + appPath + ".signalHandler('close');event.stopPropagation()");
        getId("win_" + appPath + "_shrink").setAttribute("onClick", "apps." + appPath + ".signalHandler('shrink');event.stopPropagation()");
        getId("win_" + appPath + "_big").setAttribute("onClick", "apps." + appPath + ".appWindow.toggleFullscreen()");
        getId("win_" + appPath + "_fold").setAttribute("onClick", "apps." + appPath + ".appWindow.foldWindow()");
        getId("win_" + appPath + "_cap").setAttribute("oncontextmenu", "ctxMenu(baseCtx.winXXXc, 1, event, '" + appPath + "')");
    }catch(err){
        if(doLog){
            doLog(err, '#F00');
        }
    }
};

var repositories = {"repository/repository.json": {}};
var repositoryIDs = {};
var installedPackages = {};

function repoSave(){
    lfsave("aos_system/repositories", JSON.stringify(repositories));
    lfsave("aos_system/repositories_installed", JSON.stringify(installedPackages));
}

function repoLoad(){
    try{
        repositories = JSON.parse(lfload("aos_system/repositories") || '{"repository/repository.json": {}}');
    }catch(err){
        alert(err);
        repositories = {"repository/repository.json": {}};
    }
    try{
        installedPackages = JSON.parse(lfload("aos_system/repositories_installed") || '{}');
    }catch(err){
        alert(err);
        installedPackages = {};
    }
}

function repoListInstalled(){
    var results = [];
    for(var i in installedPackages){
        results.push(i);
        for(var j in installedPackages[i]){
            results.push(i + '.' + j);
        }
    }
    return results;
}

function repoListAll(){
    var results = [];
    for(var i in repositories){
        results.push(repositories[i].repoID);
        for(var j in repositories[i].packages){
            results.push(repositories[i].repoID + '.' + repositories[i].packages[j].packageID);
        }
    }
    return results;
}

function repoPackageSearch(...query){
    var results = [];
    for(var repo in repositories){
        if(repositories[repo].hasOwnProperty('packages')){
            for(var package in repositories[repo].packages){
                for(var item in query){
                    if(query[item].indexOf('.') === -1){
                        if(repositories[repo].packages[package].packageID.toLowerCase().indexOf(query[item].toLowerCase()) !== -1){
                            results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
                            break;
                        }else if(repositories[repo].packages[package].packageName.toLowerCase().indexOf(query[item].toLowerCase()) !== -1){
                            results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
                            break;
                        }else{
                            var aliasFound = 0;
                            for(var altName in repositories[repo].packages[package].packageAliases){
                                if(repositories[repo].packages[package].packageAliases[altName].toLowerCase().indexOf(query[item].toLowerCase()) !== -1){
                                    aliasFound = 1;
                                    break;
                                }
                            }
                            if(aliasFound){
                                results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
                                break;
                            }
                        }
                    }else{
                        if(repositories[repo].repoID.toLowerCase().indexOf(query[item].split('.')[0].toLowerCase()) !== -1){
                            if(repositories[repo].packages[package].packageID.toLowerCase().indexOf(query[item].substring(query[item].indexOf('.') + 1, query[item].length).toLowerCase()) !== -1){
                                results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
                                break;
                            }else if(repositories[repo].packages[package].packageName.toLowerCase().indexOf(query[item].substring(query[item].indexOf('.') + 1, query[item].length).toLowerCase()) !== -1){
                                results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
                                break;
                            }else{
                                var aliasFound = 0;
                                for(var altName in repositories[repo].packages[package].packageAliases){
                                    if(repositories[repo].packages[package].packageAliases[altName].toLowerCase().indexOf(query[item].substring(query[item].indexOf('.') + 1, query[item].length).toLowerCase())!== -1){
                                        aliasFound = 1;
                                        break;
                                    }
                                }
                                if(aliasFound){
                                    results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return results;
}

function repoPackageSearchPrecise(...query){
    var results = [];
    for(var repo in repositories){
        if(repositories[repo].hasOwnProperty('packages')){
            for(var package in repositories[repo].packages){
                for(var item in query){
                    if(query[item].indexOf('.') === -1){
                        if(repositories[repo].packages[package].packageID.toLowerCase() === query[item].toLowerCase()){
                            results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
                            break;
                        }else if(repositories[repo].packages[package].packageName.toLowerCase() === query[item].toLowerCase()){
                            results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
                            break;
                        }
                    }else{
                        if(query[item].split('.')[0].toLowerCase() === repositories[repo].repoID.toLowerCase()){
                            if(query[item].substring(query[item].indexOf('.') + 1, query[item].length).toLowerCase() === repositories[repo].packages[package].packageID.toLowerCase()){
                                results.push(repositories[repo].repoID + "." + repositories[repo].packages[package].packageID);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return results;
}

function repoSearch(...query){
    var results = [];
    for(var repo in repositories){
        if(repositories[repo].hasOwnProperty('repoID')){
            for(var item in query){
                if(repositories[repo].repoID.toLowerCase().indexOf(query[item].toLowerCase()) !== -1){
                    results.push(repositories[repo].repoID);
                    break;
                }else if(repositories[repo].repoName.toLowerCase().indexOf(query[item].toLowerCase()) !== 1){
                    results.push(repositories[repo].repoID);
                    break;
                }else{
                    var aliasFound = 0;
                    for(var altName in repositories[repo].repoAliases){
                        if(repositories[repo].repoAliases[altName].toLowerCase().indexOf(query[item].toLowerCase()) !== -1){
                            aliasFound = 1;
                            break;
                        }
                    }
                    if(aliasFound){
                        results.push(repositories[repo].repoID);
                        break;
                    }
                    if(repo.toLowerCase().indexOf(query[item].toLowerCase()) !== -1){
                        results.push(repositories[repo].repoID);
                        break;
                    }
                }
            }
        }else{
            for(var item in query){
                if(repo.toLowerCase().indexOf(query[item].toLowerCase()) !== -1){
                    results.push("Warning: No Repo ID: " + repo);
                }
            }
        }
    }
    return results;
}

function repoSearchPrecise(...query){
    var results = [];
    for(var repo in repositories){
        if(repositories[repo].hasOwnProperty('repoID')){
            for(var item in query){
                if(repositories[repo].repoID.toLowerCase() === query[item].toLowerCase()){
                    results.push(repositories[repo].repoID);
                    break;
                }else if(repositories[repo].repoName.toLowerCase() === query[item].toLowerCase()){
                    results.push(repositories[repo].repoID);
                    break;
                }else{
                    if(repo.toLowerCase() === query[item].toLowerCase()){
                        results.push(repositories[repo].repoID);
                        break;
                    }
                }
            }
        }else{
            for(var item in query){
                if(repo.toLowerCase() === query[item].toLowerCase()){
                    results.push("Warning: No Repo ID: " + repo);
                }
            }
        }
    }
    return results;
}

function repoGetUpgradeable(versionNumbers){
    var output = [];
    for(var repository in installedPackages){
        for(var package in installedPackages[repository]){
            if(repositoryIDs.hasOwnProperty(repository)){
                if(repositories.hasOwnProperty(repositoryIDs[repository])){
                    if(repositories[repositoryIDs[repository]].packages.hasOwnProperty(package)){
                        if(installedPackages[repository][package].version !== repositories[repositoryIDs[repository]].packages[package].version){
                            if(versionNumbers){
                                output.push(repositories[repositoryIDs[repository]].repoID + "." + repositories[repositoryIDs[repository]].packages[package].packageID + ": " + installedPackages[repository][package].version + " to " + repositories[repositoryIDs[repository]].packages[package].version);
                            }else{
                                output.push(repositories[repositoryIDs[repository]].repoID + "." + repositories[repositoryIDs[repository]].packages[package].packageID);
                            }
                        }
                    }
                }
            }
        }
    }
    return output;
}

var repoUpdateOutput = [];

function repoUpdateIntermediate(){
    if(this.readyState === 4){
        if(this.status === 200){
            repoUpdateInstall(this.repositoryName, this.responseText);
        }else{
            repoUpdateCallback("Network Error: " + this.status + ": " + this.repositoryName);
        }
        repoStagedUpdates--;
        if(repoStagedUpdates <= 0){
            repoUpdateFinished();
        }
    }
}

function repoUpdateInstall(repoURL, repoResponse){
    try{
        var repoJSON = JSON.parse(repoResponse);
        if(repoJSON.hasOwnProperty("repoName") &&
            repoJSON.hasOwnProperty("repoID") &&
            repoJSON.hasOwnProperty("repoAliases") &&
            repoJSON.hasOwnProperty("packages")
        ){
            if(!repositoryIDs.hasOwnProperty(repoJSON.repoID)){
                repositories[repoURL] = repoJSON;
                repositoryIDs[repoJSON.repoID] = repoURL;
                repoUpdateCallback("Success: " + repoURL);
            }else if(repositoryIDs[repository] !== repoURL){
                repoUpdateCallback("Error: " + repoJSON.repoID + " already exists: " + repoURL);
            }
        }
    }catch(err){
        repoUpdateCallback("Error: " + err + ": " + repoURL);
    }
}

var repoStagedUpdates = 0;
function repoUpdateFinished(){
    try{
        apps.saveMaster.vars.saving = 0;
    }catch(err){
        
    }
    try{
        repoUpdateCallback("");
        repoUpdateCallback(repoPackageSearch("").length + " total packages available.");
        repoUpdateCallback(repoGetUpgradeable().length + " total updates available.");
        //repoUpdateCallback(repoUpdateOutput);
        try{
            if(typeof repoUpdateFinishFunc === 'function'){
                repoUpdateFinishFunc();
            }
        }catch(err){

        }
    }catch(err){

    }
    for(var i in repoUpdateXHR){
        delete repoUpdateXHR[i];
    }
    repoUpdateXHR = {};
    repoUpdateCallback = null;
    repoUpdateOutput = [];
    repoStagedUpdates = 0;
    repoUpdateFinishFunc = null;
    
    repoSave();
}

var repoUpdateXHR = {};

repoUpdateCallback = null;
repoUpdateFinishFunc = null;

function repoUpdate(callback, finishFunc){
    if(repoStagedUpdates <= 0 && repoStagedUpgrades <= 0){
        if(callback){
            repoUpdateCallback = callback;
        }else{
            repoUpdateCallback = doLog;
        }
        if(finishFunc){
            repoUpdateFinishFunc = finishFunc;
        }else{
            repoUpdateFinishFunc = null;
        }
        repositoryIDs = [];
        repoUpdateOutput = [];
        repoStagedUpdates = 0;
        for(var repo in repositories){
            repoUpdateXHR[repo] = new XMLHttpRequest();
            if(repo.indexOf("?") > -1){ // this URL parameter is added to beat the Chrome cache system
                repoUpdateXHR[repo].open('GET', repo + "&ms=" + performance.now());
            }else{
                repoUpdateXHR[repo].open('GET', repo + "?ms=" + performance.now());
            }
            repoUpdateXHR[repo].onreadystatechange = repoUpdateIntermediate;
            repoUpdateXHR[repo].repositoryName = repo;
            repoUpdateXHR[repo].send();
            repoStagedUpdates++;
        }
        repoUpdateCallback("Updating " + repoStagedUpdates + " repositories");
        repoUpdateCallback("");
        try{
            apps.saveMaster.vars.saving = 3;
        }catch(err){
            
        }
        return true;
    }else{
        return false;
    }
}

var repoUpgradeXHR = {};
var repoUpgradeOutput = [];
var repoStagedUpgrades = 0;
var repoUpgradeCallback = null;

function repoUpgradeIntermediate(){
    if(this.readyState === 4){
        if(this.status === 200){
            repoUpgradeInstall(this.repository, this.responseText);
        }else{
            repoUpgradeCallback("Error: " + this.status + ": " + this.repository.join('.'));
        }
        repoStagedUpgrades--;
        if(repoStagedUpgrades <= 0){
            repoUpgradeFinished();
        }
    }
}

function repoUpgradeInstall(targetPackage, packageData){
    try{
        var repoJSON = JSON.parse(packageData);
        if(repoJSON.hasOwnProperty("name") &&
            repoJSON.hasOwnProperty("id") &&
            repoJSON.hasOwnProperty("version") &&
            repoJSON.hasOwnProperty("appType")
        ){
            installedPackages[targetPackage[0]][targetPackage[1]] = repoJSON;
            requireRestart();
            repoUpgradeCallback("Success: " + targetPackage.join('.'));
        }else{
            repoUpgradeCallback("Error: response is not a valid package: " + targetPackage.join('.'));
        }
    }catch(err){
        repoUpgradeCallback("Error: " + err + ": " + targetPackage.join('.'));
    }
}

function repoUpgradeFinished(){
    try{
        apps.saveMaster.vars.saving = 0;
    }catch(err){
        
    }
    try{
        repoUpgradeCallback("");
        repoUpgradeCallback("Finished.");
        //repoUpgradeCallback(repoUpgradeOutput);
        try{
            if(typeof repoUpgradeFinishedFunc === 'function'){
                repoUpgradeFinishedFunc();
            }
        }catch(err){

        }
    }catch(err){

    }
    for(var i in repoUpgradeXHR){
        delete repoUpgradeXHR[i];
    }
    repoUpgradeXHR = {};
    repoUpgradeCallback = null;
    repoUpgradeOutput = [];
    repoStagedUpgrades = 0;
    repoUpgradeFinishedFunc = null;

    repoSave();
}

var repoUpgradeFinishedFunc = null;

function repoUpgrade(callback, finishedFunc){
    if(repoStagedUpdates <= 0 && repoStagedUpgrades <= 0){
        var upgradeablePackages = repoGetUpgradeable();
        if(upgradeablePackages.length === 0){
            (callback || doLog)("Aborted - no updates available. Try repo update first?");
            return false;
        }
        if(callback){
            repoUpgradeCallback = callback;
        }else{
            repoUpgradeCallback = doLog;
        }
        if(finishedFunc){
            repoUpgradeFinishedFunc = finishedFunc;
        }else{
            repoUpgradeFinishedFunc = null;
        }
        repoUpgradeOutput = [];
        repoStagedUpgrades = 0;
        repoUpgradeCallback("Upgrading the following packages: " + upgradeablePackages.join(", "));
        for(var i in upgradeablePackages){
            upgradeablePackages[i] = upgradeablePackages[i].split('.');
        }
        for(var i in upgradeablePackages){
            repoUpgradeXHR[upgradeablePackages[i][0]] = new XMLHttpRequest();
            if(repositories[repositoryIDs[upgradeablePackages[i][0]]].packages[upgradeablePackages[i][1]].installURL.indexOf("?") > -1){
                repoUpgradeXHR[upgradeablePackages[i][0]].open("GET", repositories[repositoryIDs[upgradeablePackages[i][0]]].packages[upgradeablePackages[i][1]].installURL + "&ms=" + performance.now());
            }else{
                repoUpgradeXHR[upgradeablePackages[i][0]].open("GET", repositories[repositoryIDs[upgradeablePackages[i][0]]].packages[upgradeablePackages[i][1]].installURL + "?ms=" + performance.now());
            }
            repoUpgradeXHR[upgradeablePackages[i][0]].onreadystatechange = repoUpgradeIntermediate;
            repoUpgradeXHR[upgradeablePackages[i][0]].repository = upgradeablePackages[i];
            repoUpgradeXHR[upgradeablePackages[i][0]].send();
            repoStagedUpgrades++;
        }
        repoUpgradeCallback("Total upgrades: " + repoStagedUpgrades);
        repoUpgradeCallback("");
        try{
            apps.saveMaster.vars.saving = 3;
        }catch(err){
            
        }
        return true;
    }else{
        return false;
    }
}

function repoAddRepository(url, callback, finishingFunc){
    for(var i in repositoryIDs){
        if(repositoryIDs[i] === url){
            (callback || doLog)('Aborted - Repository already exists: ' + i);
            return false;
        }
    }
    repositories[url] = {};
    (callback || doLog)('Added repository. Updating...');
    repoUpdate(callback, finishingFunc);
    return true;
}

function repoRemoveRepository(query, callback, finishingFunc){
    var output = [];
    var repositoriesToRemove = repoSearchPrecise(query);
    if(repositoriesToRemove.indexOf('aaronos_official') !== -1){
        (callback || doLog)('Failed: cannot remove this repo: aaronos_official');
        repositoriesToRemove.splice(repositoriesToRemove.indexOf('aaronos_official'), 1);
    }
    if(repositoriesToRemove.length === 0){
        (callback || doLog)('Nothing done, no removeable repositories found.');
        return false;
    }else{
        for(var i in repositoriesToRemove){
            if(repositoriesToRemove[i].indexOf('Warning: No Repo ID: ') === 0){
                delete repositories[repositoriesToRemove[i].substring(21, repositoriesToRemove[i].length)];
                (callback || doLog)('Deleted ' + repositoriesToRemove[i].substring(21, repositoriesToRemove[i].length));
            }else{
                delete repositories[repositoryIDs[repositoriesToRemove[i]]];
                (callback || doLog)('Deleted ' + repositoriesToRemove[i] + ": " + repositoryIDs[repositoriesToRemove[i]]);
            }
        }
        (callback || doLog)('Updating...');
        repoUpdate(callback, finishingFunc);
        return true;
    }
}

function repoAddPackage(query, callback, finishingFunc){
    var repoMatches = repoPackageSearchPrecise(query);
    if(repoMatches.length === 0){
        repoMatches = repoPackageSearch(query);
        if(repoMatches.length === 0){
            (callback || doLog)('No packages found.');
            return false;
        }else{
            repoMatches.splice(0, 0, 'No packages found with that name. Maybe try again with one of these?');
            for(var i in repoMatches){
                (callback || doLog)(repoMatches[i]);
            }
            return false;
        }
    }else if(repoMatches.length === 1){
        if(!installedPackages.hasOwnProperty(repoMatches[0].split('.')[0])){
            installedPackages[repoMatches[0].split('.')[0]] = {};
        }
        installedPackages[repoMatches[0].split('.')[0]][repoMatches[0].split('.')[1]] = {
            name: repositories[repositoryIDs[repoMatches[0].split('.')[0]]].packages[repoMatches[0].split('.')[1]].packageName,
            id: repositories[repositoryIDs[repoMatches[0].split('.')[0]]].packages[repoMatches[0].split('.')[1]].packageID,
            version: "UPDATE_NOW",
            packageType: "UPDATE_THIS_PACKAGE"
        };
        (callback || doLog)('Installed package ' + repoMatches[0], 'Performing upgrade...');
        repoUpgrade(callback, finishingFunc);
        return true;
    }else{
        repoMatches.splice(0, 0, 'More than one package with that name. Try again with a more specific name:');
        for(var i in repoMatches){
            (callback || doLog)(repoMatches[i]);
        }
        return false;
    }
}

function repoRemovePackage(query, callback){
    var repoMatches = [];
    for(var i in installedPackages){
        for(var j in installedPackages[i]){
            if(i + '.' + j === query || j === query){
                repoMatches.push([i, j]);
            }
        }
    }
    if(repoMatches.length === 0){
        (callback || doLog)('No matching packages found.');
        return false;
    }else if(repoMatches.length === 1){
        delete installedPackages[repoMatches[0][0]][repoMatches[0][1]];
        var repoLength = 0;
        for(var i in installedPackages[repoMatches[0][0]]){
            repoLength = 1;
            break;
        }
        if(repoLength === 0){
            delete installedPackages[repoMatches[0][0]];
        }
        repoSave();
        (callback || doLog)('Package ' + repoMatches[0].join('.') + ' uninstalled.');
        requireRestart();
        return true;
    }else{
        repoMatches.splice(0, 0, ['More than one package with that name. Try again with a more specific name:']);
        for(var i in repoMatches){
            (callback || doLog)(repoMatches[i].join('.'));
        }
        return false;
    }
}

// desktop vars
var dsktp = {};
function newDsktpIcon(id, owner, position, title, icon, action, actionArgs, ctxAction, ctxActionArgs, nosave){
    if(!id){
        id = "uico_" + (new Date().getTime());
    }
    if(!title){
        if(apps[owner]){
            title = apps[owner].appDesc;
        }else{
            title = "Icon";
        }
    }
    if(!icon){
        if(apps[owner]){
            icon = {...apps[owner].appWindow.appImg};
        }else{
            icon = {...apps.startMenu.appWindow.appImg};
        }
    }
    if(typeof icon === "string"){
        icon = {foreground: icon};
    }
    if(!action){
        if(apps[owner]){
            action = [
                'arg',
                'openapp(apps[arg], "dsktp");'
            ];
            actionArgs = [owner];
        }else{
            action = [
                'apps.prompt.vars.alert("This icon has no assigned action.", "Okay.", function(){}, "AaronOS");'
            ];
            actionArgs = [];
        }
    }
    if(typeof action === "string"){
        action = [action];
    }
    if(!actionArgs){
        actionArgs = [];
    }
    if(!ctxAction){
        if(apps[owner]){
            ctxAction = [
                'arg1', 'arg2',
                'ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, arg2]);'
            ]
            ctxActionArgs = [id, apps[owner].dsktpIcon];
        }else{
            ctxAction = [
                'arg1',
                'ctxMenu(baseCtx.appXXX, 1, event, [event, arg1, "aOS"]);'
            ];
            ctxActionArgs = [id];
        }
    }
    if(typeof ctxAction === "string"){
        ctxAction = [ctxAction];
    }
    if(!ctxActionArgs){
        ctxActionArgs = [];
    }
    dsktp[id] = {
        id: id,
        owner: owner,
        position: position,
        title: title,
        icon: icon,
        action: action,
        actionArgs: actionArgs || [],
        ctxAction: ctxAction,
        ctxActionArgs: ctxActionArgs || []
    };
    if(getId("app_" + id)){
        getId("dsktp").removeChild(getId("app_" + id));
    }
    var tempIco = document.createElement("div");
    tempIco.classList.add("app");
    tempIco.classList.add("cursorPointer");
    tempIco.id = "app_" + id;
    tempIco.setAttribute("data-icon-id", id);
    tempIco.setAttribute("onclick", 'Function(...dsktp[this.getAttribute("data-icon-id")].action)(...dsktp[this.getAttribute("data-icon-id")].actionArgs)');
    tempIco.setAttribute('oncontextmenu', 'Function(...dsktp[this.getAttribute("data-icon-id")].ctxAction)(...dsktp[this.getAttribute("data-icon-id")].ctxActionArgs)');
    tempIco.innerHTML = '<div class="appIcon" id="ico_' + id + '" style="pointer-events:none">' +
        buildSmartIcon(64, icon) +
        '</div>' +
        '<div class="appDesc" id="dsc_' + id + '">' + title + '</div>';
    getId("desktop").appendChild(tempIco);
    if(!nosave){
        ufsave("aos_system/desktop/user_icons/ico_" + id, JSON.stringify(dsktp[id]));
    }
    arrangeDesktopIcons();
}
function removeDsktpIcon(id, nosave){
    if(dsktp[id]){
        delete dsktp[id];
        getId("desktop").removeChild(getId("app_" + id));
        if(!nosave){
            if(ufload("aos_system/desktop/user_icons/ico_" + id)){
                ufdel("aos_system/desktop/user_icons/ico_" + id);
            }else{
                ufsave("aos_system/desktop/user_icons/ico_" + id, JSON.stringify({"removed": "true", "id": id}));
            }
        }
        arrangeDesktopIcons();
    }
};

function arrangeDesktopIcons(){
    appTotal = 0;
    appPosX = 8;
    appPosY = 8;
    for(var ico in dsktp){
        if(!dsktp[ico].position){
            appTotal++;
            getId("app_" + ico).style.left = appPosX + "px";
            getId("app_" + ico).style.top = appPosY + "px";
            appPosY += 98;
            if(appPosY > parseInt(getId('monitor').style.height) - 105){
                appPosY = 8;
                appPosX += 108;
            }
        }else{
            getId("app_" + ico).style.left = dsktp[ico].position[0] + "px";
            getId("app_" + ico).style.top = dsktp[ico].position[1] + "px";
        }
    }
}

var widgets = {};
var Widget = function(name, code, clickFunc, startFunc, frameFunc, endFunc, vars){
    this.name = name;
    this.codeName = code;
    this.main = clickFunc;
    this.start = startFunc;
    this.frame = frameFunc;
    this.end = endFunc;
    this.vars = vars;
    this.place = -1;
    this.element = null;
    this.setWidth = function(width){
        if(this.element !== null){
            this.element.style.width = width;
        }
    }
    this.setContent = function(content){
        if(this.element !== null){
            this.element.innerHTML = content;
        }
    }
}
var totalWidgets = 0;
function addWidget(widgetName, nosave){
    if(widgets[widgetName]){
        if(widgets[widgetName].place === -1){
            getId('time').innerHTML += '<div id="widget_' + widgetName + '" class="widget" data-widget-name="' + widgetName + '" onclick="widgets.' + widgetName + '.main()"></div>';
            widgets[widgetName].element = getId('widget_' + widgetName);
            widgets[widgetName].place = totalWidgets;
            totalWidgets++;
            widgets[widgetName].start();
            widgetsList[widgetName] = widgetName;
            if(!nosave){
                ufsave('aos_system/taskbar/widget_list', JSON.stringify(widgetsList));
            }
        }
    }
};
function removeWidget(widgetName, nosave){
    if(widgets[widgetName]){
        if(widgets[widgetName].place > -1){
            widgets[widgetName].end();
            widgets[widgetName].place = -1;
            totalWidgets--;
            widgets[widgetName].element = null;
            getId('widget_' + widgetName).outerHTML = '';
            delete widgetsList[widgetName];
            if(!nosave){
                ufsave('aos_system/taskbar/widget_list', JSON.stringify(widgetsList));
            }
        }
    }
};
function widgetMenu(title, content){
    switch(tskbrToggle.tskbrPos){
        case 1:
            getId('widgetMenu').style.bottom = 'auto';
            getId('widgetMenu').style.top = '0';
            getId('widgetMenu').style.left = '';
            getId('widgetMenu').style.right = '';
            getId('widgetMenu').style.borderBottom = '';
            getId('widgetMenu').style.borderLeft = '';
            getId('widgetMenu').style.borderRight = '';
            getId('widgetMenu').style.borderTop = 'none';
            getId('widgetMenu').style.borderBottomLeftRadius = '';
            getId('widgetMenu').style.borderBottomRightRadius = '';
            getId('widgetMenu').style.borderTopLeftRadius = '0';
            getId('widgetMenu').style.borderTopRightRadius = '0';
            break;
        case 2:
            getId('widgetMenu').style.bottom = '16px';
            getId('widgetMenu').style.top = '';
            getId('widgetMenu').style.left = '0';
            getId('widgetMenu').style.right = 'auto';
            getId('widgetMenu').style.borderBottom = '';
            getId('widgetMenu').style.borderLeft = 'none';
            getId('widgetMenu').style.borderRight = '';
            getId('widgetMenu').style.borderTop = '';
            getId('widgetMenu').style.borderBottomLeftRadius = '0';
            getId('widgetMenu').style.borderBottomRightRadius = '';
            getId('widgetMenu').style.borderTopLeftRadius = '0';
            getId('widgetMenu').style.borderTopRightRadius = '';
            break;
        case 3:
            getId('widgetMenu').style.bottom = 'auto';
            getId('widgetMenu').style.top = '16px';
            getId('widgetMenu').style.left = '';
            getId('widgetMenu').style.right = '0';
            getId('widgetMenu').style.borderBottom = '';
            getId('widgetMenu').style.borderLeft = '';
            getId('widgetMenu').style.borderRight = 'none';
            getId('widgetMenu').style.borderTop = '';
            getId('widgetMenu').style.borderBottomLeftRadius = '';
            getId('widgetMenu').style.borderBottomRightRadius = '0';
            getId('widgetMenu').style.borderTopLeftRadius = '';
            getId('widgetMenu').style.borderTopRightRadius = '0';
            break;
        default:
            getId('widgetMenu').style.bottom = '';
            getId('widgetMenu').style.top = '';
            getId('widgetMenu').style.left = '';
            getId('widgetMenu').style.right = '';
            getId('widgetMenu').style.borderBottom = 'none';
            getId('widgetMenu').style.borderLeft = '';
            getId('widgetMenu').style.borderRight = '';
            getId('widgetMenu').style.borderTop = '';
            getId('widgetMenu').style.borderBottomLeftRadius = '0';
            getId('widgetMenu').style.borderBottomRightRadius = '0';
            getId('widgetMenu').style.borderTopLeftRadius = '';
            getId('widgetMenu').style.borderTopRightRadius = '';
    }
    getId('widgetMenu').style.opacity = '';
    getId('widgetMenu').style.pointerEvents = '';
    getId('widgetTitle').innerHTML = title;
    getId('widgetContent').innerHTML = '<hr>' + content;
}
function closeWidgetMenu(){
    switch(tskbrToggle.tskbrPos){
        case 1:
            getId('widgetMenu').style.bottom = 'auto';
            getId('widgetMenu').style.top = '-350px';
            getId('widgetMenu').style.left = '';
            getId('widgetMenu').style.right = '';
            break;
        case 2:
            getId('widgetMenu').style.bottom = '16px';
            getId('widgetMenu').style.top = '';
            getId('widgetMenu').style.left = '-350px';
            getId('widgetMenu').style.right = 'auto';
            break;
        case 3:
            getId('widgetMenu').style.bottom = 'auto';
            getId('widgetMenu').style.top = '16px';
            getId('widgetMenu').style.left = '';
            getId('widgetMenu').style.right = '-350px';
            break;
        default:
            getId('widgetMenu').style.bottom = '-350px';
            getId('widgetMenu').style.top = '';
            getId('widgetMenu').style.left = '';
            getId('widgetMenu').style.right = '';
    }
    getId('widgetMenu').style.opacity = '0';
    getId('widgetMenu').style.pointerEvents = 'none';
    getId('widgetTitle').innerHTML = '';
    getId('widgetContent').innerHTML = '';
}

// WIDGETS HERE
//WIDGETS (this comment for control-f)
var widgetsList = {};
widgets.time = new Widget(
    'Time', // title
    'time', // name in widgets object
    function(){ // onclick function
        widgetMenu('Time Widget', 'There are no settings for this widget yet.');
    },
    function(){ // start function
        widgets.time.vars.running = 1;
        //widgets.time.setWidth('58px');
        //getId('widget_time').innerHTML = '<div id="compactTime"></div>';
        widgets.time.frame();
    },
    function(){ // frame function (this.vars.frame())
        if(widgets.time.vars.running){
            if(String(new Date()) !== widgets.time.vars.lastTime){
                getId('widget_time').innerHTML = '<div id="compactTime">' + formDate("M-/D-/y") + '<br>' + formDate("h-:m-:S") + '</div>';
                widgets.time.vars.lastTime = String(new Date());
            }
            requestAnimationFrame(widgets.time.frame);
        }
    },
    function(){ // stop/cleanup function
        widgets.time.vars.running = 0;
    },
    {
        running: 0,
        lastTime: String(new Date())
    }
);
widgets.fps = new Widget(
    'FPS', // title
    'fps', // name in widgets object
    function(){ // onclick function
        widgetMenu('FPS Widget', 'There are no settings for this widget yet.');
    },
    function(){ // start function
        widgets.fps.vars.running = 1;
        //widgets.time.setWidth('58px');
        getId('widget_fps').innerHTML = '<div id="compactFPS"></div><div id="postCompactFPS" style="position:static;margin-left:26px;margin-right:6px;margin-top:-21px;font-family:Consolas,monospace;font-size:12px">&nbsp;' + lang('aOS', 'framesPerSecond') + '</div>';
        widgets.fps.frame();
    },
    function(){ // frame function (this.vars.frame())
        if(widgets.fps.vars.running){
            if(!mobileMode){
                getId('compactFPS').innerHTML = stringFPS.substring(0, stringFPS.length - 1) + '<br>' + stringVFPS.substring(0, stringVFPS.length - 4);
                getId('postCompactFPS').innerHTML = lang('aOS', 'framesPerSecond');
            }else{
                getId('compactFPS').innerHTML = '';
                getId('postCompactFPS').innerHTML = '';
            }
            requestAnimationFrame(widgets.fps.frame);
        }
    },
    function(){ // stop/cleanup function
        widgets.fps.vars.running = 0;
    },
    {
        running: 0
    }
);
widgets.battery = new Widget(
    'Battery',
    'battery',
    function(){
        widgetMenu('Battery Widget', widgets.battery.vars.generateMenu().split('-Infinity').join('Calculating').split('Infinity').join('Calculating').split('NaN').join('Calculating'));
    },
    function(){
        widgets.battery.vars.running = 1;
        widgets.battery.vars.styles[ufload('aos_system/widgets/battery/style') || "def"][0]();
        /*
        widgets.battery.vars.previousAmount = batteryLevel;
        widgets.battery.vars.previousAmountChange = 0;
        widgets.battery.vars.amountChange = 0;
        perfStart('batteryWidget');
        */
        widgets.battery.frame();
    },
    function(){
        if(widgets.battery.vars.running){
            if(batteryLevel !== -1){
                widgets.battery.vars.styles[ufload('aos_system/widgets/battery/style') || "def"][1]();
                /*
                if(perfCheck('batteryWidget') > 120000000){
                    widgets.battery.vars.amountChange = widgets.battery.vars.previousAmountChange;
                    widgets.battery.vars.amountChange = batteryLevel - widgets.battery.vars.previousAmount;
                    widgets.battery.vars.previousAmount = batteryLevel;
                    perfStart('batteryWidget');
                }
                */
            }
            requestAnimationFrame(widgets.battery.frame);
        }
    },
    function(){
        widgets.battery.vars.running = 0;
    },
    {
        running: 0,
        /*
        previousPreviousAmount: 0,
        previousAmount: 0,
        amountChange: 0,
        */
        styles: {
            def: [
                function(){
                    getId('widget_battery').innerHTML = '<div id="batteryWidgetFrame">????</div><div style="position:static;margin-top:-8px;border:1px solid #FFF;width:0;height:3px;margin-left:32px"></div>';
                },
                function(){
                    getId('batteryWidgetFrame').innerHTML = taskbarBatteryStr;
                }
            ],
            text: [
                function(){
                    getId('widget_battery').innerHTML = '<div style="pointer-events:none;line-height:32px;position:relative;padding-left:3px;padding-right:3px;font-family:aosProFont, monospace;font-size:12px;">{' + taskbarBatteryStr.substring(0, 3) + '}</div>';
                },
                function(){
                    if(cpuBattery.charging){
                        getId('widget_battery').innerHTML = '<div style="pointer-events:none;line-height:32px;position:relative;padding-left:3px;padding-right:3px;font-family:aosProFont, monospace;font-size:12px;">{' + taskbarBatteryStr.substring(0, 3) + '}</div>';
                    }else{
                        getId('widget_battery').innerHTML = '<div style="pointer-events:none;line-height:32px;position:relative;padding-left:3px;padding-right:3px;font-family:aosProFont, monospace;font-size:12px;">[' + taskbarBatteryStr.substring(0, 3) + ']</div>';
                    }
                }
            ],
            old: [
                function(){
                    getId('widget_battery').innerHTML = '<div style="pointer-events:none;position:relative;margin-left:3px;margin-right:3px;margin-top:3px;border:1px solid #FFF;background:rgb(0, 0, 0);width:50px;height:21px;"><div style="overflow:visible;width:0px;height:21px;background-color:rgb(255, 0, 0);text-align:center;">???</div></div>';
                },
                function(){
                    getId('widget_battery').innerHTML = '<div style="pointer-events:none;position:relative;margin-left:3px;margin-right:3px;margin-top:3px;border:1px solid #FFF;background:rgb(0, 0, ' + (batteryCharging * 255) + ');width:50px;height:21px;"><div style="overflow:visible;width:' + Math.round(batteryLevel * 50) + 'px;height:21px;background-color:rgb(' + Math.round(255 - (batteryLevel * 255)) + ',' + Math.round(batteryLevel * 255) + ',0);text-align:center;">' + Math.round(batteryLevel * 100) + '</div></div>';
                }
            ]
        },
        changeStyle: function(newStyle){
            ufsave("aos_system/widgets/battery/style", newStyle);
            widgets.battery.vars.styles[newStyle][0]();
        },
        generateMenu: function(){
            if(batteryCharging){
                return "<div style='font-size:24px'>Current battery level:<br>" + (batteryLevel * 100) + "%<br><br>" +
                    "Battery is charging.<br><br>" +
                    'Battery Style:<br><button onclick="widgets.battery.vars.changeStyle(\'def\')">Default</button> <button onclick="widgets.battery.vars.changeStyle(\'text\')">Text</button> <button onclick="widgets.battery.vars.changeStyle(\'old\')">Old</button></div>'
            }else{
                return "<div style='font-size:24px'><br>Current battery level:<br>" + (batteryLevel * 100) + "%<br><br>" +
                    "Battery is not charging.<br><br>" +
                    'Battery Style:<br><button onclick="widgets.battery.vars.changeStyle(\'def\')">Default</button> <button onclick="widgets.battery.vars.changeStyle(\'text\')">Text</button> <button onclick="widgets.battery.vars.changeStyle(\'old\')">Old</button></div>'
            }
        }
    }
);
widgets.network = new Widget(
    'Network',
    'network',
    function(){
        widgetMenu('Network Widget',
            'This widget displays your connection status to AaronOS. Additionally, it will show when you are sending / recieving data from AaronOS.<br><br>' +
            '<button onclick="widgets.network.vars.setDisplayType(\'new\')">New Display</button> ' +
            '<button onclick="widgets.network.vars.setDisplayType(\'old\')">Old Display</button>'
        );
    },
    function(){
        widgets.network.vars.running = 1;
        getId('widget_network').style.lineHeight = '26px';
        getId('widget_network').style.paddingLeft = '6px';
        getId('widget_network').style.paddingRight = '6px';
        if(ufload('aos_system/widgets/network/style')){
            widgets.network.vars.displayType = ufload('aos_system/widgets/network/style');
        }
        widgets.network.frame();
    },
    function(){
        if(widgets.network.vars.running){
            var displayStr = '';
            if(widgets.network.vars.displayType === "new"){
                getId('widget_network').style.lineHeight = '26px';
                if(widgets.network.vars.onlinestrConvert[taskbarOnlineStr]){
                    displayStr = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/' + widgets.network.vars.onlinestrConvert[taskbarOnlineStr] + '.png">';
                }else{
                    displayStr = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/networkBad.png">';
                }
            }else{
                getId('widget_network').style.lineHeight = '150%';
                displayStr = taskbarOnlineStr;
            }
            if(displayStr !== widgets.network.vars.lastDisplayStr){
                getId('widget_network').innerHTML = displayStr;
                widgets.network.vars.lastDisplayStr = displayStr;
            }
            requestAnimationFrame(widgets.network.frame);
        }
    },
    function(){
        widgets.network.vars.running = 0;
    },
    {
        running: 0,
        onlinestrConvert: {
            '] [': 'network',
            '}-[': 'networkUp',
            ']-{': 'networkDown',
            '}-{': 'networkBoth',
            ']X[': 'networkBad'
        },
        lastDisplayStr: '',
        displayType: "new",
        setDisplayType: function(dispType){
            widgets.network.vars.displayType = dispType;
            ufsave('aos_system/widgets/network/style', dispType);
        }
    }
);
widgets.cpu = new Widget(
    'CPU',
    'cpu',
    function(){
        widgetMenu('CPU Widget', 'The CPU load is estimated by comparing the current FPS to the record high FPS for the session.<br><br>There are no settings for this widget yet.');
    },
    function(){
        widgets.cpu.vars.running = 1;
        getId('widget_cpu').style.paddingLeft = "6px";
        getId('widget_cpu').style.paddingRight = "6px";
        getId('widget_cpu').style.fontFamily = 'Consolas, monospace;';
        getId('widget_cpu').style.fontSize = '12px';
        getId('widget_cpu').style.lineHeight = '31px';
        widgets.cpu.frame();
    },
    function(){
        if(widgets.cpu.vars.running){
            if(!mobileMode){
                getId('widget_cpu').innerHTML = stringFPSload;
            }else{
                getId('widget_cpu').innerHTML = '';
            }
            requestAnimationFrame(widgets.cpu.frame);
        }
    },
    function(){
        widgets.cpu.vars.running = 0;
    },
    {
        running: 0
    }
);
widgets.users = new Widget(
    'Online Users',
    'users',
    function(){
        widgetMenu('Online Users Widget', 'The list will update every 30 seconds.<br><br>Number of online users with this widget enabled: ' + makeLiveElement('widgets.users.vars.numberUsers') + '<br><br>' + makeLiveElement("widgets.users.vars.usersNames.join('<br>')"));
    },
    function(){
        widgets.users.vars.running = 1;
        getId('widget_users').style.lineHeight = '150%';
        getId('widget_users').style.paddingLeft = "6px";
        getId('widget_users').style.paddingRight = "6px";
        
        widgets.users.vars.xhttp = new XMLHttpRequest();
        widgets.users.vars.xhttp.onreadystatechange = function(){
            if(widgets.users.vars.xhttp.readyState === 4){
                if(widgets.users.vars.xhttp.status === 200){
                    if(widgets.users.vars.running){
                        var userWidgetResponse = widgets.users.vars.xhttp.responseText.split('<br>');
                        widgets.users.vars.numberUsers = userWidgetResponse.shift();
                        widgets.users.vars.usersNames = userWidgetResponse;
                        for(var i in widgets.users.vars.usersNames){
                            widgets.users.vars.usersNames[i] = apps.messaging.vars.parseBB(widgets.users.vars.usersNames[i], 1);
                        }
                        getId('widget_users').innerHTML = widgets.users.vars.numberUsers;
                        setTimeout(widgets.users.frame, 30000);
                    }
                }else{
                    if(widgets.users.vars.running){
                        var userWidgetResponse = ['Lost connection to AaronOS.'];
                        widgets.users.vars.numberUsers = 0;
                        widgets.users.vars.usersNames = ['Lost connection to AaronOS.'];
                        getId('widget_users').innerHTML = "X";
                        setTimeout(widgets.users.frame, 30000);
                    }
                }
            }
        }
        
        widgets.users.vars.fd = new FormData();
        widgets.users.vars.fd.append('k', SRVRKEYWORD);
        
        widgets.users.frame();
    },
    function(){
        widgets.users.vars.xhttp.open('POST', 'onlineUsers.php');
        widgets.users.vars.xhttp.send(widgets.users.vars.fd);
    },
    function(){
        widgets.users.vars.running = 0;
    },
    {
        running: 0,
        xhttp: {},
        fd: {},
        numberUsers: 0,
        usersNames: ''
    }
);
widgets.flow = new Widget(
    "Flow Mode",
    "flow",
    function(){
        toggleFlowMode();
    },
    function(){
        getId("widget_flow").innerHTML = "~";
        getId("widget_flow").style.lineHeight = '150%';
        getId('widget_flow').style.paddingLeft = "6px";
        getId('widget_flow').style.paddingRight = "6px";
    },
    function(){
        
    },
    function(){
        
    },
    {
        
    }
);
widgets.notifications = new Widget(
    'Notifications',
    'notifications',
    function(){
        if(apps.prompt.vars.notifsVisible){
            apps.prompt.vars.hideNotifs();
        }else{
            apps.prompt.vars.checkNotifs();
        }
        if(apps.prompt.vars.lastNotifsFound.length === 0){
            widgetMenu('Notifications', 'You have no notifications waiting.<br><br>New notifications will show automatically.');
        }
    },
    function(){
        // startup func
        widgets.notifications.running = 1;
        getId('widget_notifications').style.paddingLeft = "6px";
        getId('widget_notifications').style.paddingRight = "6px";
        getId('widget_notifications').style.lineHeight = '26px';
        widgets.notifications.frame();
    },
    function(){
        // frame func
        if(widgets.notifications.running){
            requestAnimationFrame(widgets.notifications.frame);
            var notifCount = apps.prompt.vars.lastNotifsFound.length;
            if(notifCount + ":" + apps.prompt.vars.notifsVisible !== widgets.notifications.vars.lastDisplay){
                if(notifCount === 0){
                    getId('widget_notifications').innerHTML = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/popup.png">';
                }else if(apps.prompt.vars.notifsVisible){
                    getId('widget_notifications').innerHTML = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/message.png">';
                }else{
                    getId('widget_notifications').innerHTML = '<img style="width:10px;filter:invert(1) brightness(1.5) drop-shadow(0px 0px 1px #000);" src="ctxMenu/beta/notification.png">';
                }
                widgets.notifications.vars.lastDisplay = notifCount + ":" + apps.prompt.vars.notifsVisible;
            }
        }
    },
    function(){
        // disable func
        widgets.notifications.vars.running = 0;
    },
    {
        // vars
        running: 0,
        lastDisplay: []
    }
);

//text-editing functionality
function showEditContext(event, fromWebApp, webAppPosition, webAppConversation, webAppFrame, webAppOrigin, webAppPaste){
    if(currentSelection.length === 0){
        textEditorTools.tempvar = '-';
    }else{
        textEditorTools.tempvar = ' ';
    }
    var canPasteHere = 0;
    if(!fromWebApp){
        if((event.target.tagName === "INPUT" && (event.target.getAttribute("type") === "text" || event.target.getAttribute("type") === "password" || event.target.getAttribute("type") === null)) || event.target.tagName === "TEXTAREA"){
            canPasteHere = 1;
        }
    }else{
        canPasteHere = webAppPaste;
        textEditorTools.webAppInfo = [webAppConversation, webAppFrame, webAppOrigin];
    }
    if(!fromWebApp){
        textEditorTools.tmpGenArray = [[event.pageX, event.pageY, "ctxMenu/beta/happy.png", "ctxMenu/beta/load.png", "ctxMenu/beta/save.png"], textEditorTools.tempvar + "Speak \'" + currentSelection.substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + "...\'", "textspeech(\'" + currentSelection.split("\n").join('<br>').split('\\').join('\\\\').split('"').join("&quot;").split("'").join("&quot;").split('<').join('&lt;').split('>').join('&gt;') + "\');getId(\'ctxMenu\').style.display = \'none\'"];
    }else{
        var framePosition = webAppFrame.frameElement.getBoundingClientRect();
        textEditorTools.tmpGenArray = [[webAppPosition[0] + framePosition.x, webAppPosition[1] + framePosition.y, "ctxMenu/beta/happy.png", "ctxMenu/beta/load.png", "ctxMenu/beta/save.png"], textEditorTools.tempvar + "Speak \'" + currentSelection.substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + "...\'", "textspeech(\'" + currentSelection.split("\n").join('<br>').split('\\').join('\\\\').split('"').join("&quot;").split("'").join("&quot;").split('<').join('&lt;').split('>').join('&gt;') + "\');apps.webAppMaker.vars.postReply({messageType:\'response\',content:\'spoken\',conversation:textEditorTools.webAppInfo[0]}, textEditorTools.webAppInfo[2], textEditorTools.webAppInfo[1]);getId(\'ctxMenu\').style.display = \'none\'"];
    }
    for(var i = 1; i <= textEditorTools.slots; i++){
        if(currentSelection.length === 0){
            textEditorTools.tempvar = '-';
            textEditorTools.tempvar2 = '_';
        }else{
            textEditorTools.tempvar = ' ';
            textEditorTools.tempvar2 = '+';
        }
        if(i === 1){
            textEditorTools.tmpGenArray.push(textEditorTools.tempvar2 + 'Copy "' + currentSelection.substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + '..." to Slot 1');
        }else{
            textEditorTools.tmpGenArray.push(textEditorTools.tempvar + 'Copy "' + currentSelection.substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + '..." to Slot ' + i);
        }
        textEditorTools.tmpGenArray[0].push('ctxMenu/beta/load.png');
        if(!fromWebApp){
            textEditorTools.tmpGenArray.push('textEditorTools.copy(' + (i - 0) + ');getId(\'ctxMenu\').style.display = \'none\'');
        }else{
            textEditorTools.tmpGenArray.push('textEditorTools.copy(' + (i - 0) + ');apps.webAppMaker.vars.postReply({messageType:\'response\',content:\'copied\',conversation:textEditorTools.webAppInfo[0]}, textEditorTools.webAppInfo[2], textEditorTools.webAppInfo[1]);getId(\'ctxMenu\').style.display = \'none\'');
        }
    }
    if(canPasteHere){
        for(var i = 1; i <= textEditorTools.slots; i++){
            if(!fromWebApp){
                if(textEditorTools.clipboard[i - 1].length === 0 || (typeof event.target.id !== "string" || event.target.id === "") || event.target.getAttribute("disabled") !== null){
                    if(i === 1){
                        textEditorTools.tmpGenArray.push('_Paste "' + textEditorTools.clipboard[i - 1].substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + '..." from Slot ' + i);
                    }else{
                        textEditorTools.tmpGenArray.push('-Paste "' + textEditorTools.clipboard[i - 1].substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + '..." from Slot ' + i);
                    }
                    textEditorTools.tmpGenArray.push('');
                }else{
                    if(i === 1){
                        textEditorTools.tmpGenArray.push('+Paste "' + textEditorTools.clipboard[i - 1].substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + '..." from Slot ' + i);
                    }else{
                        textEditorTools.tmpGenArray.push(' Paste "' + textEditorTools.clipboard[i - 1].substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + '..." from Slot ' + i);
                    }
                    textEditorTools.tmpGenArray.push('textEditorTools.paste(\'' + event.target.id + '\', ' + i + ', ' + event.target.selectionStart + ',' + event.target.selectionEnd + ');getId(\'ctxMenu\').style.display = \'none\'');
                }
            }else{
                if(textEditorTools.clipboard[i - 1].length === 0){
                    if(i === 1){
                        textEditorTools.tmpGenArray.push('_Paste "' + textEditorTools.clipboard[i - 1].substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + '..." from Slot ' + i);
                    }else{
                        textEditorTools.tmpGenArray.push('-Paste "' + textEditorTools.clipboard[i - 1].substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + '..." from Slot ' + i);
                    }
                    textEditorTools.tmpGenArray.push('');
                }else{
                    if(i === 1){
                        textEditorTools.tmpGenArray.push('+Paste "' + textEditorTools.clipboard[i - 1].substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + '..." from Slot ' + i);
                    }else{
                        textEditorTools.tmpGenArray.push(' Paste "' + textEditorTools.clipboard[i - 1].substring(0, 5).split("\n").join(' ').split('<').join('&lt;').split('>').join('&gt;') + '..." from Slot ' + i);
                    }
                    textEditorTools.tmpGenArray.push('apps.webAppMaker.vars.postReply({messageType:\'response\',content:\'pasted\',pastedText:textEditorTools.clipboard[' + (i - 1) + '],conversation:textEditorTools.webAppInfo[0]}, textEditorTools.webAppInfo[2], textEditorTools.webAppInfo[1]);getId(\'ctxMenu\').style.display = \'none\'');
                }
            }
            textEditorTools.tmpGenArray[0].push('ctxMenu/beta/save.png');
        }
    }
    /*
    for(var i = 1; i <= textEditorTools.slots; i++){
        if(textEditorTools.clipboard[i - 1].length === 0 || nopaste || currentSelection.length === 0){
            if(i === 1){
                textEditorTools.tmpGenArray.push('_Swap with "' + textEditorTools.clipboard[i - 1].substring(0, 5) + '..." from Slot ' + i);
            }else{
                textEditorTools.tmpGenArray.push('-Swap with "' + textEditorTools.clipboard[i - 1].substring(0, 5) + '..." from Slot ' + i);
            }
            textEditorTools.tmpGenArray.push('');
        }else{
            if(i === 1){
                textEditorTools.tmpGenArray.push('+Swap with "' + textEditorTools.clipboard[i - 1].substring(0, 5) + '..." from Slot ' + i);
            }else{
                textEditorTools.tmpGenArray.push(' Swap with "' + textEditorTools.clipboard[i - 1].substring(0, 5) + '..." from Slot ' + i);
            }
            textEditorTools.tmpGenArray.push('textEditorTools.swap(\'' + this.id + '\', ' + i + ', ' + this.selectionStart + ');getId(\'ctxMenu\').style.display = \'none\'');
        }
        textEditorTools.tmpGenArray[0].push('/ctxMenu/beta/file.png');
    }
    */
    textEditorTools.tempvar3 = currentSelection;
    ctxMenu(textEditorTools.tmpGenArray);
}
function addEditContext(element, nopaste){
    doLog("addEditContext is depreceated", "#FF7F00");
}
var textEditorTools = {
    tempvar: '',
    tempvar2: '',
    tempvar3: '',
    webAppInfo:  {},
    slots: 2,
    updateSlots: function(){
        clipboard = [];
        for(var i = 0; i < this.slots; i++){
            this.clipboard.push("");
        }
    },
    clipboard: ["", ""],
    tmpGenArray: [],
    copy: function(slot){
        this.clipboard[slot - 1] = this.tempvar3;
        ufsave("aos_system/clipboard", JSON.stringify(this.clipboard));
    },
    paste: function(element, slot, cursorpos, endselect){
        getId(element).value = getId(element).value.substring(0, cursorpos) + this.clipboard[slot - 1] + getId(element).value.substring(endselect, getId(element).value.length); 
    },
    swap: function(element, slot, cursorpos){
        var tempCopy = this.clipboard[slot - 1];
        this.clipboard[slot - 1] = this.tempvar3;
        ufsave("aos_system/clipboard", JSON.stringify(this.clipboard));
        getId(element).value = getId(element).value.substring(0, cursorpos) + tempCopy + getId(element).value.substring(cursorpos, getId(element).value.length);
    }
};
//start menu
m('init DsB');
var codeToRun = [];
function c(code, args){
    if(typeof code === 'function'){
        if(args){
            codeToRun.push([code, args]);
        }else{
            codeToRun.push(code);
        }
    }
}
var workingcodetorun = [];
var totalWaitingCodes = 0;
var finishedWaitingCodes = 0;
function checkWaitingCode(){
    if(codeToRun.length !== 0){
        m('Running Waiting Code');
        workingcodetorun = codeToRun.shift();
        if(typeof workingcodetorun === 'function'){
            workingcodetorun();
        }else{
            workingcodetorun[0](workingcodetorun[1]);
        }
        finishedWaitingCodes++;
    }
}
var waitingCodeInterval = window.setInterval(checkWaitingCode, 0);
function crashWaitingCodeInterval(){
    window.clearInterval(waitingCodeInterval);
}
function startWaitingCodeInterval(){
    waitingCodeInterval = window.setInterval(checkWaitingCode, 0);
}

getId('aOSloadingInfo').innerHTML = 'Applications List';
c(function(){
    apps.startMenu = new Application(
        "DsB",
        "aOS Dashboard",
        1,
        function(launchType){
            if(launchType === 'srtup'){
                this.appWindow.paddingMode(0);
                getId('win_startMenu_shrink').style.display = "none";
                getId('win_startMenu_big').style.display = "none";
                getId('win_startMenu_exit').style.display = "none";
                getId('win_startMenu_fold').style.display = 'none';
                getId('win_startMenu_top').style.transform = 'scale(1)';
                //getId('winDsBc').style.cursor = cursors.default;
                getId('win_startMenu_cap').classList.remove('cursorLoadLight');
                getId('win_startMenu_cap').classList.add('cursorDefault');
                getId('win_startMenu_cap').setAttribute('onmousedown','');
                getId('win_startMenu_size').style.pointerEvents = "none";
                getId('win_startMenu_cap').setAttribute('oncontextmenu', 'ctxMenu(apps.startMenu.vars.captionCtx, 1, event)');
                switch(tskbrToggle.tskbrPos){
                    case 1:
                        getId('win_startMenu_top').style.borderTopLeftRadius = "0";
                        getId('win_startMenu_top').style.borderBottomLeftRadius = "0";
                        getId('win_startMenu_top').style.borderBottomRightRadius = "";
                        getId('win_startMenu_top').style.borderTopRightRadius = "0";
                        getId('win_startMenu_html').style.borderBottomLeftRadius = "0";
                        getId('win_startMenu_html').style.borderBottomRightRadius = "";
                        break;
                    case 2:
                        getId('win_startMenu_top').style.borderTopLeftRadius = "0";
                        getId('win_startMenu_top').style.borderBottomLeftRadius = "0";
                        getId('win_startMenu_top').style.borderBottomRightRadius = "";
                        getId('win_startMenu_top').style.borderTopRightRadius = "0";
                        getId('win_startMenu_html').style.borderBottomLeftRadius = "0";
                        getId('win_startMenu_html').style.borderBottomRightRadius = "";
                        break;
                    case 3:
                        getId('win_startMenu_top').style.borderTopLeftRadius = "";
                        getId('win_startMenu_top').style.borderBottomLeftRadius = "0";
                        getId('win_startMenu_top').style.borderBottomRightRadius = "0";
                        getId('win_startMenu_top').style.borderTopRightRadius = "0";
                        getId('win_startMenu_html').style.borderBottomLeftRadius = "0";
                        getId('win_startMenu_html').style.borderBottomRightRadius = "0";
                        break;
                    default:
                        getId('win_startMenu_top').style.borderTopLeftRadius = "0";
                        getId('win_startMenu_top').style.borderBottomLeftRadius = "0";
                        getId('win_startMenu_top').style.borderBottomRightRadius = "0";
                        getId('win_startMenu_top').style.borderTopRightRadius = "";
                        getId('win_startMenu_html').style.borderBottomLeftRadius = "0";
                        getId('win_startMenu_html').style.borderBottomRightRadius = "0";
                }
                getId('win_startMenu_html').style.overflowY = "auto";
                getId('win_startMenu_html').style.background = 'none';
                getId('win_startMenu_top').setAttribute('onClick', "toTop(apps.startMenu, 2)");
                //getId('icnDsB').innerHTML = '<div class="iconImg">DsB</div>';
                getId('icn_startMenu').setAttribute('oncontextmenu', 'ctxMenu(apps.startMenu.vars.iconCtx, 1, event)');
                
                getId('win_startMenu_top').style.transition = '0.35s';
                getId('win_startMenu_aero').style.transition = '0.35s';
                
                this.appWindow.alwaysOnTop(1);
                
                this.appWindow.setCaption(lang('appNames', 'startMenu'));
                this.appWindow.openWindow();
                this.appWindow.closeKeepTask();
            }else if(launchType === 'dsktp' || launchType === 'tskbr'){
                if(getId('win_startMenu_top').style.display !== 'block'){
                    switch(tskbrToggle.tskbrPos){
                        case 1:
                            requestAnimationFrame(function(){apps.startMenu.appWindow.setDims(0, 0, 300, 370)});
                            break;
                        case 2:
                            requestAnimationFrame(function(){apps.startMenu.appWindow.setDims(0, 0, 300, 370)});
                            break;
                        case 3:
                            requestAnimationFrame(function(){apps.startMenu.appWindow.setDims(parseInt(getId('desktop').style.width, 10) - 300, parseInt(getId('desktop').style.height, 10) - 370, 300, 370)});
                            break;
                        default:
                            requestAnimationFrame(function(){apps.startMenu.appWindow.setDims(0, parseInt(getId('desktop').style.height, 10) - 370, 300, 370)});
                    }
                    this.appWindow.openWindow();
                    //getId('win_startMenu_top').style.transform = '';
                    this.vars.listOfApps = '';
                    switch(ufload("aos_system/apps/startMenu/dashboard")){
                        case 'whisker':
                            this.appWindow.setContent(
                                '<span style="color:#FFF;font-family:aosProFont,monospace;font-size:12px">User: ' + apps.messaging.vars.parseBB(apps.messaging.vars.name) + '</span>' +
                                '<div class="darkResponsive" style="left:0;bottom:0;height:calc(100% - 3em);overflow-y:scroll;width:calc(70% - 2px);">' +
                                '<table style="position:absolute;left:0;top:0;width:100%;max-width:100%;" id="appDsBtable"></table>' +
                                '</div>' +
                                '<div style="right:0;top:0;height:calc(100% - 2em);width:calc(30% - 2px);max-width:calc(30% - 2px);text-align:right">' +
                                '<img class="cursorPointer" style="width:10px;height:10px;filter:invert(1)" src="ctxMenu/beta/gear.png" onclick="openapp(apps.settings,\'dsktp\')"> ' +
                                '<img class="cursorPointer" style="width:10px;height:10px;filter:invert(1)" src="ctxMenu/beta/power.png" onclick="c(function(){ctxMenu(apps.startMenu.vars.powerCtx, 1, event)})"><br><br><br>' +
                                '<button style="width:100%" onclick="openapp(apps.appCenter, \'dsktp\')">AaronOS Hub</button><br>' +
                                '<button style="width:100%" onclick="openapp(apps.jsConsole, \'dsktp\')">' + lang('startMenu', 'jsConsole') + '</button><br>' +
                                '<button style="width:100%" onclick="openapp(apps.settings, \'dsktp\')">' + lang('startMenu', 'settings') + '</button><br>' +
                                '<button style="width:100%" onclick="openapp(apps.files2, \'dsktp\')">' + lang('startMenu', 'files') + '</button><br>' +
                                '<button style="width:100%" onclick="openapp(apps.appsbrowser, \'dsktp\')">' + lang('startMenu', 'allApps') + '</button>' +
                                '</div>' +
                                '<input autocomplete="off" style="position:absolute;left:0;top:1.5em;width:calc(100% - 2px);" placeholder="App Search" onkeyup="apps.startMenu.vars.search(event)" id="appDsBsearch"></span>'
                            );
                            if(this.vars.listOfApps.length === 0){
                                getId('appDsBtable').innerHTML = '<tr><td><img src="loadLight.gif" style="width:100%;"></td></tr>';
                                //getId('appDsBtable').style.cursor = cursors.loadLight;
                                getId('appDsBtable').classList.add('cursorLoadLight');
                                for(var appHandle in appsSorted){
                                    //c(function(app){
                                        if(apps[appsSorted[appHandle]].keepOffDesktop < 2){
                                            //apps.startMenu.vars.listOfApps += '<tr class="cursorPointer" onClick="openapp(apps.' + app + ', \'dsktp\')" oncontextmenu="ctxMenu(apps.startMenu.vars.ctx, 1, event, \'' + app + '\')"><th><img style="width:64px;height:64px;" src="' + (apps[app].appWindow.appImg || 'appicons/ds/redx.png') + '"></th><td>' + apps[app].appDesc + '</td></tr>';
                                            apps.startMenu.vars.listOfApps += '<tr class="cursorPointer dashboardSearchItem" onClick="openapp(apps.' + appsSorted[appHandle] + ', \'dsktp\')" oncontextmenu="ctxMenu(apps.startMenu.vars.ctx, 1, event, \'' + appsSorted[appHandle] + '\')"><th>' + buildSmartIcon(64, apps[appsSorted[appHandle]].appWindow.appImg) + '</th><td>' + apps[appsSorted[appHandle]].appDesc + '</td></tr>';
                                        }
                                    //}, appsSorted[appHandle]);
                                }
                                //c(function(){
                                    getId('appDsBtable').innerHTML = apps.startMenu.vars.listOfApps;
                                    // getId('appDsBtable').style.cursor = '';
                                    getId('appDsBtable').classList.remove('cursorLoadLight');
                                    apps.startMenu.vars.appElems = getId('appDsBtable').getElementsByTagName('tr');
                                //});
                            }else{
                                getId('appDsBtable').innerHTML = this.vars.listOfApps;
                                this.vars.appElems = getId('appDsBtable').getElementsByClassName('dashboardSearchItem');
                            }
                            if(!mobileMode){
                                getId('appDsBsearch').focus();
                            }
                            break;
                        case 'win7':
                            this.appWindow.setContent(
                                '<button style="position:absolute;right:0;bottom:8px;width:30%" onclick="c(function(){ctxMenu(apps.startMenu.vars.powerCtx, 1, event)})">Power</button>' +
                                '<div class="darkResponsive" style="left:0;top:0;height:calc(100% - 2.5em);overflow-y:scroll;width:calc(70% - 2px);border-top-left-radius:5px;border-top-right-radius:5px;">' +
                                '<table style="border-top-left-radius:5px;border-top-right-radius:5px;position:absolute;left:0;top:0;width:100%;max-width:100%;" id="appDsBtable"></table>' +
                                '</div>' +
                                '<div style="right:0;color:#FFF;top:0;height:calc(100% - 2em);width:calc(30% - 2px);max-width:calc(30% - 2px);">' +
                                '<img style="width:50px;margin-left:15px;" src="appicons/ds/aOS.png"><br>' +
                                '<span class="cursorPointer" style="width:100%" onclick="openapp(apps.appCenter, \'dsktp\')">AaronOS Hub</span><br><br>' +
                                '<span class="cursorPointer" style="width:100%" onclick="openapp(apps.jsConsole, \'dsktp\')">' + lang('startMenu', 'jsConsole') + '</span><hr>' +
                                '<span class="cursorPointer" style="width:100%" onclick="openapp(apps.settings, \'dsktp\')">' + lang('startMenu', 'settings') + '</span><br><br>' +
                                '<span class="cursorPointer" style="width:100%" onclick="openapp(apps.files2, \'dsktp\')">' + lang('startMenu', 'files') + '</span><hr>' +
                                '<span class="cursorPointer" style="width:100%" onclick="openapp(apps.appsbrowser, \'dsktp\')">' + lang('startMenu', 'allApps') + '</span>' +
                                '</div>' +
                                '<input autocomplete="off" style="position:absolute;left:0;bottom:0;background-color:#DDD;width:calc(70% - 2px);height:3em;border:none;border-bottom-right-radius:5px;border-bottom-left-radius:5px;" placeholder="App Search" onkeyup="apps.startMenu.vars.search(event)" id="appDsBsearch"></span>'
                            );
                            if(this.vars.listOfApps.length === 0){
                                getId('appDsBtable').innerHTML = '<tr><td><img src="loadLight.gif" style="width:100%;"></td></tr>';
                                //getId('appDsBtable').style.cursor = cursors.loadLight;
                                getId('appDsBtable').classList.add('cursorLoadLight');
                                for(var appHandle in appsSorted){
                                    //c(function(app){
                                        if(apps[appsSorted[appHandle]].keepOffDesktop < 2){
                                            //apps.startMenu.vars.listOfApps += '<tr class="cursorPointer" onClick="openapp(apps.' + app + ', \'dsktp\')" oncontextmenu="ctxMenu(apps.startMenu.vars.ctx, 1, event, \'' + app + '\')"><th><img style="width:32px;height:32px;" src="' + (apps[app].appWindow.appImg || 'appicons/ds/redx.png') + '"></th><td>' + apps[app].appDesc + '</td></tr>';
                                            apps.startMenu.vars.listOfApps += '<tr class="cursorPointer dashboardSearchItem" onClick="openapp(apps.' + appsSorted[appHandle] + ', \'dsktp\')" oncontextmenu="ctxMenu(apps.startMenu.vars.ctx, 1, event, \'' + appsSorted[appHandle] + '\')"><th>' + buildSmartIcon(32, apps[appsSorted[appHandle]].appWindow.appImg) + '</th><td>' + apps[appsSorted[appHandle]].appDesc + '</td></tr>';
                                        }
                                    //}, appsSorted[appHandle]);
                                }
                                //c(function(){
                                    getId('appDsBtable').innerHTML = apps.startMenu.vars.listOfApps;
                                    // getId('appDsBtable').style.cursor = '';
                                    getId('appDsBtable').classList.remove('cursorLoadLight');
                                    apps.startMenu.vars.appElems = getId('appDsBtable').getElementsByClassName('dashboardSearchItem');
                                //});
                            }else{
                                getId('appDsBtable').innerHTML = this.vars.listOfApps;
                                this.vars.appElems = getId('appDsBtable').getElementsByTagName('tr');
                            }
                            if(sessionStorage.getItem('GooglePlay') !== "true"){
                                getId('appDsBsearch').focus();
                            }
                            break;
                        case 'android':
                            this.appWindow.setContent(
                                '<div style="width:100%;height:100%;overflow-y:scroll">' +
                                '<span style="padding-bottom:4px;">&nbsp;' +
                                '<button onclick="c(function(){ctxMenu(apps.startMenu.vars.powerCtx, 1, event)})">' + lang('startMenu', 'power') + '</button>  ' +
                                '<button onclick="openapp(apps.appCenter, \'dsktp\')">AaronOS Hub</button> ' +
                                '<button onclick="openapp(apps.jsConsole, \'dsktp\')">' + lang('startMenu', 'jsConsole') + '</button> ' +
                                '<button onclick="openapp(apps.settings, \'dsktp\')">' + lang('startMenu', 'settings') + '</button> ' +
                                '<button onclick="openapp(apps.files2, \'dsktp\')">' + lang('startMenu', 'files') + '</button> ' +
                                '<button onclick="openapp(apps.appsbrowser, \'dsktp\')">' + lang('startMenu', 'allApps') + '</button><br>' +
                                '<input autocomplete="off" style="width:calc(100% - 4px);margin-top:3px" placeholder="App Search" onkeyup="apps.startMenu.vars.search(event, 1)" id="appDsBsearch">' +
                                '</span><hr style="margin:0;margin-top:2px">' +
                                '<div id="appDsBtable" class="darkResponsive" style="font-family:aosProFont, monospace; font-size:12px; width:calc(100% - 2px);"></div>' +
                                '</div>'
                            );
                            if(this.vars.listOfApps.length === 0){
                                getId('appDsBtable').innerHTML = '<img src="loadLight.gif" style="width:100%;">';
                                //getId('appDsBtable').style.cursor = cursors.loadLight;
                                getId('appDsBtable').classList.add('cursorLoadLight');
                                for(var appHandle in appsSorted){
                                    //c(function(app){
                                        if(apps[appsSorted[appHandle]].keepOffDesktop < 2){
                                            //apps.startMenu.vars.listOfApps += '<div class="cursorPointer" style="min-height:96px;max-height:96px;display:inline-block;position:static;text-align:center;min-width:25%;max-width:25%" onClick="openapp(apps.' + app + ', \'dsktp\')" oncontextmenu="ctxMenu(apps.startMenu.vars.ctx, 1, event, \'' + app + '\')"><img style="width:32px;" src="' + (apps[app].appWindow.appImg || 'appicons/ds/redx.png') + '"><br>' + apps[app].appDesc + '</div>';
                                            apps.startMenu.vars.listOfApps += '<div class="cursorPointer dashboardSearchItem" style="min-height:96px;max-height:96px;display:inline-block;position:static;text-align:center;min-width:25%;max-width:25%" onClick="openapp(apps.' + appsSorted[appHandle] + ', \'dsktp\')" oncontextmenu="ctxMenu(apps.startMenu.vars.ctx, 1, event, \'' + appsSorted[appHandle] + '\')">' + buildSmartIcon(32, apps[appsSorted[appHandle]].appWindow.appImg) + '<br>' + apps[appsSorted[appHandle]].appDesc + '</div>';
                                        }
                                    //}, appsSorted[appHandle]);
                                }
                                //c(function(){
                                    getId('appDsBtable').innerHTML = apps.startMenu.vars.listOfApps;
                                    // getId('appDsBtable').style.cursor = '';
                                    getId('appDsBtable').classList.remove('cursorLoadLight');
                                    apps.startMenu.vars.appElems = getId('appDsBtable').getElementsByClassName('dashboardSearchItem');
                                //});
                            }else{
                                getId('appDsBtable').innerHTML = this.vars.listOfApps;
                                this.vars.appElems = getId('appDsBtable').getElementsByTagName('tr');
                            }
                            if(sessionStorage.getItem('GooglePlay') !== "true"){
                                getId('appDsBsearch').focus();
                            }
                            break;
                        case "legacy":
                            this.appWindow.setContent(
                                '<div style="width:100%;height:100%;overflow-y:scroll;">' +
                                '<span style="padding-bottom:4px;">&nbsp;' +
                                '<button onclick="c(function(){ctxMenu(apps.startMenu.vars.powerCtx, 1, event)})">' + lang('startMenu', 'power') + '</button>  ' +
                                '<button onclick="openapp(apps.appCenter, \'dsktp\')">AaronOS Hub</button> ' +
                                '<button onclick="openapp(apps.jsConsole, \'dsktp\')">' + lang('startMenu', 'jsConsole') + '</button> ' +
                                '<button onclick="openapp(apps.settings, \'dsktp\')">' + lang('startMenu', 'settings') + '</button> ' +
                                '<button onclick="openapp(apps.files2, \'dsktp\')">' + lang('startMenu', 'files') + '</button> ' +
                                '<button onclick="openapp(apps.appsbrowser, \'dsktp\')">' + lang('startMenu', 'allApps') + '</button><br>' +
                                '<input style="width:calc(100% - 4px);margin-top:3px" placeholder="App Search" onkeyup="apps.startMenu.vars.search(event)" id="appDsBsearch">' +
                                '</span><hr style="margin:0;margin-top:2px">' +
                                '<table id="appDsBtable" style="color:#000;font-family:aosProFont, monospace; font-size:12px; width:100%;"></table>' +
                                '</div>'
                            );
                            if(this.vars.listOfApps.length === 0){
                                getId('appDsBtable').innerHTML = '<tr><td><img src="loadLight.gif" style="width:100%;"></td></tr>';
                                //getId('appDsBtable').style.cursor = cursors.loadLight;
                                getId('appDsBtable').classList.add('cursorLoadLight');
                                for(var appHandle in appsSorted){
                                    //c(function(app){
                                        if(apps[appsSorted[appHandle]].keepOffDesktop < 2){
                                            apps.startMenu.vars.listOfApps += '<tr class="cursorPointer dashboardSearchItem" style="background-color:rgba(' + darkSwitch('255, 255, 255', '39, 39, 39') + ', 0.5);color:' + darkSwitch('#000', '#FFF') + ';" onClick="openapp(apps.' + appsSorted[appHandle] + ', \'dsktp\')" oncontextmenu="ctxMenu(apps.startMenu.vars.ctx, 1, event, \'' + appsSorted[appHandle] + '\')"><th>' + apps[appsSorted[appHandle]].dsktpIcon + '</th><td>' + apps[appsSorted[appHandle]].appDesc + '</td></tr>';
                                        }
                                    //}, appsSorted[appHandle]);
                                }
                                //c(function(){
                                    getId('appDsBtable').innerHTML = apps.startMenu.vars.listOfApps;
                                    // getId('appDsBtable').style.cursor = '';
                                    getId('appDsBtable').classList.remove('cursorLoadLight');
                                    apps.startMenu.vars.appElems = getId('appDsBtable').getElementsByClassName('dashboardSearchItem');
                                //});
                            }else{
                                getId('appDsBtable').innerHTML = this.vars.listOfApps;
                                this.vars.appElems = getId('appDsBtable').getElementsByTagName('tr');
                            }
                            if(sessionStorage.getItem('GooglePlay') !== "true"){
                                getId('appDsBsearch').focus();
                            }
                            break;
                        default:
                            this.appWindow.setContent(
                                '<div style="width:100%;height:100%;">' +
                                '<div style="position:relative;text-align:center;">' +
                                '<button onclick="c(function(){ctxMenu(apps.startMenu.vars.powerCtx, 1, event)})">' + lang('startMenu', 'power') + '</button>  ' +
                                '<button onclick="openapp(apps.files2, \'dsktp\')">' + lang('startMenu', 'files') + '</button> ' +
                                '<button onclick="openapp(apps.settings, \'dsktp\')">' + lang('startMenu', 'settings') + '</button> ' +
                                '<button onclick="openapp(apps.appsbrowser, \'dsktp\')">' + lang('startMenu', 'allApps') + '</button><br>' +
                                '<button onclick="openapp(apps.appCenter, \'dsktp\')">AaronOS Hub</button> ' +
                                '<button onclick="openapp(apps.jsConsole, \'dsktp\')">' + lang('startMenu', 'jsConsole') + '</button> ' +
                                //'<button onclick="openapp(apps.help, \'dsktp\')">' + lang('startMenu', 'aosHelp') + '</button><br>' +
                                '<input autocomplete="off" style="width:calc(100% - 6px);margin-top:3px;" placeholder="App Search" onkeyup="apps.startMenu.vars.search(event)" id="appDsBsearch">' +
                                '</div><div id="appDsBtableWrapper" style="width:100%;overflow-y:scroll;background-color:rgba(' + darkSwitch('255, 255, 255', '39, 39, 39') + ', 0.5);">' +
                                '<table id="appDsBtable" style="color:#000;font-family:aosProFont, monospace; font-size:12px; width:100%;color:' + darkSwitch('#000', '#FFF') + ';"></table>' +
                                '</div></div>'
                            );
                            var outerbound = getId("win_startMenu_html").getBoundingClientRect();
                            var innerbound = getId("appDsBtableWrapper").getBoundingClientRect();
                            getId("appDsBtableWrapper").style.height = outerbound.height - (innerbound.top - outerbound.top) + "px";
                            if(this.vars.listOfApps.length === 0){
                                getId('appDsBtable').innerHTML = '<tr><td><img src="loadLight.gif" style="width:100%;"></td></tr>';
                                //getId('appDsBtable').style.cursor = cursors.loadLight;
                                getId('appDsBtable').classList.add('cursorLoadLight');
                                for(var appHandle in appsSorted){
                                    //c(function(app){
                                        if(apps[appsSorted[appHandle]].keepOffDesktop < 2){
                                            apps.startMenu.vars.listOfApps += '<tr class="cursorPointer dashboardSearchItem" onClick="openapp(apps.' + appsSorted[appHandle] + ', \'dsktp\')" oncontextmenu="ctxMenu(apps.startMenu.vars.ctx, 1, event, \'' + appsSorted[appHandle] + '\')">' +
                                                '<th>' + buildSmartIcon(32, apps[appsSorted[appHandle]].appWindow.appImg) + '</th>' +
                                                '<td>' + apps[appsSorted[appHandle]].appDesc + '</td>' +
                                                '<td style="text-align:right;opacity:0.5">' + apps[appsSorted[appHandle]].dsktpIcon + '</td>' +
                                                '</tr>';
                                        }
                                    //}, appsSorted[appHandle]);
                                }
                                //c(function(){
                                    getId('appDsBtable').innerHTML = apps.startMenu.vars.listOfApps;
                                    getId('appDsBtable').innerHTML += '<tr><th><div style="width:32px;height:32px;position:relative;"></div></th><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>&nbsp;&nbsp;&nbsp;</td>';
                                    // getId('appDsBtable').style.cursor = '';
                                    getId('appDsBtable').classList.remove('cursorLoadLight');
                                    apps.startMenu.vars.appElems = getId('appDsBtable').getElementsByClassName('dashboardSearchItem');
                                //});
                            }else{
                                getId('appDsBtable').innerHTML = this.vars.listOfApps;
                                this.vars.appElems = getId('appDsBtable').getElementsByTagName('tr');
                            }
                            if(sessionStorage.getItem('GooglePlay') !== "true"){
                                getId('appDsBsearch').focus();
                            }
                    }
                }else{
                    apps.startMenu.signalHandler('shrink');
                }
            }
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    setTimeout(apps.startMenu.vars.minimize, 350);
                    switch(tskbrToggle.tskbrPos){
                        case 1:
                            this.appWindow.setDims(-305, 0, 300, 370);
                            if(mobileMode){
                                getId('win_startMenu_top').style.transform = 'scale(1) translate(-' + getId('desktop').style.width + ', 0)';
                            }
                            break;
                        case 2:
                            this.appWindow.setDims(-305, 0, 300, 370);
                            if(mobileMode){
                                getId('win_startMenu_top').style.transform = 'scale(1) translate(-' + getId('desktop').style.width + ', 0)';
                            }
                            break;
                        case 3:
                            this.appWindow.setDims(parseInt(getId('desktop').style.width, 10) - 300, parseInt(getId('desktop').style.height, 10) + 5, 300, 370);
                            if(mobileMode){
                                getId('win_startMenu_top').style.transform = 'scale(1) translate(0, ' + getId('desktop').style.height + ')';
                            }
                            break;
                        default:
                            this.appWindow.setDims(-305, parseInt(getId('desktop').style.height, 10) - 370, 300, 370);
                            if(mobileMode){
                                getId('win_startMenu_top').style.transform = 'scale(1) translate(-' + getId('desktop').style.width + ', 0)';
                            }
                    }
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    setTimeout(apps.startMenu.vars.minimize, 350);
                    switch(tskbrToggle.tskbrPos){
                        case 1:
                            this.appWindow.setDims(-305, 0, 300, 370);
                            if(mobileMode){
                                getId('win_startMenu_top').style.transform = 'scale(1) translate(-' + getId('desktop').style.width + ', 0)';
                            }
                            break;
                        case 2:
                            this.appWindow.setDims(-305, 0, 300, 370);
                            if(mobileMode){
                                getId('win_startMenu_top').style.transform = 'scale(1) translate(-' + getId('desktop').style.width + ', 0)';
                            }
                            break;
                        case 3:
                            this.appWindow.setDims(parseInt(getId('desktop').style.width, 10) - 300, parseInt(getId('desktop').style.height, 10) + 5, 300, 370);
                            if(mobileMode){
                                getId('win_startMenu_top').style.transform = 'scale(1) translate(0, ' + getId('desktop').style.height + ')';
                            }
                            break;
                        default:
                            this.appWindow.setDims(-305, parseInt(getId('desktop').style.height, 10) - 370, 300, 370);
                            if(mobileMode){
                                getId('win_startMenu_top').style.transform = 'scale(1) translate(-' + getId('desktop').style.width + ', 0)';
                            }
                    }
                    this.appWindow.appIcon = 0;
                    break;
                case "USERFILES_DONE":
                    // SET UP WIDGETS
                    if(ufload("aos_system/taskbar/widget_list") && !safeMode){
                        var tempList = JSON.parse(ufload("aos_system/taskbar/widget_list"));
                        for(var i in tempList){
                            addWidget(i, 1);
                        }
                    }else{
                        addWidget('cpu', 1);
                        addWidget('fps', 1);
                        addWidget('network', 1);
                        addWidget('battery', 1);
                        //addWidget('users', 1);  (this is now an opt-in feature)
                        addWidget('notifications', 1);
                        addWidget('time', 1);
                        addWidget('flow', 1);
                    }
                    break;
                case "shutdown":
                    
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'AaronOS is a web-based desktop environment that lives in the cloud. All files are saved on the aOS server, so they can be accessed from anywhere.<br><br>AaronOS is developed by Aaron Adams. He can be directly contacted at mineandcraft12@gmail.com',
            appElems: null,
            search: function(event, iblock){
                if(this.appElems !== null){
                    if(event.keyCode === 13){
                        for(var i = 0; i < this.appElems.length; i++){
                            if(this.appElems[i].style.display !== 'none'){
                                this.appElems[i].click();
                                break;
                            }
                        }
                    }else{
                        for(var i = 0; i < this.appElems.length; i++){
                            if(this.appElems[i].innerText.toLowerCase().indexOf(getId('appDsBsearch').value.toLowerCase()) > -1){
                                if(iblock){
                                    this.appElems[i].style.display = 'inline-block';
                                }else{
                                    this.appElems[i].style.display = '';
                                }
                            }else{
                                this.appElems[i].style.display = 'none';
                            }
                        }
                    }
                }
            },
            listOfApps: "",
            minimize: function(){
                apps.startMenu.appWindow.closeKeepTask();
                getId("icn_startMenu").classList.remove("openAppIcon");
            },
            captionCtx: [
                [' ' + lang('ctxMenu', 'hideApp'), function(){
                    apps.startMenu.signalHandler('shrink');
                }, 'ctxMenu/beta/minimize.png']
            ],
            iconCtx: [
                [' ' + lang('startMenu', 'files'), function(){
                    openapp(apps.files2, 'dsktp');
                }, 'ctxMenu/beta/folder.png'],
                [' ' + lang('startMenu', 'allApps'), function(){
                    openapp(apps.appsBrowser, 'dsktp');
                }, 'ctxMenu/beta/window.png'],
                [' ' + lang('startMenu', 'settings'), function(){
                    openapp(apps.settings, 'dsktp');
                }, 'ctxMenu/beta/gear.png'],
                [' ' + lang('startMenu', 'taskManager'), function(){
                    openapp(apps.taskManager, 'dsktp');
                }, 'ctxMenu/beta/aOS.png'],
                ['+Log Out', function(){
                    apps.settings.vars.shutDown('restart', 1);
                }, 'ctxMenu/beta/power.png'],
                [' ' + lang('startMenu', 'restart'), function(){
                    apps.settings.vars.shutDown('restart', 0);
                }, 'ctxMenu/beta/power.png'],
                [' ' + lang('startMenu', 'shutDown'), function(){
                    apps.settings.vars.shutDown(0, 1);
                }, 'ctxMenu/beta/power.png']
            ],
            powerCtx: [
                [' Log Out', function(){
                    apps.settings.vars.shutDown('restart', 1);
                }, 'ctxMenu/beta/power.png'],
                [' ' + lang('startMenu', 'restart'), function(){
                    apps.settings.vars.shutDown('restart', 0);
                }, 'ctxMenu/beta/power.png'],
                [' ' + lang('startMenu', 'shutDown'), function(){
                    apps.settings.vars.shutDown(0, 1);
                }, 'ctxMenu/beta/power.png']
            ],
            ctx: [
                [' ' + lang('ctxMenu', 'openApp'), function(arg){
                    openapp(apps[arg], "dsktp");
                }, 'ctxMenu/beta/window.png'],
                [function(arg){
                    if(dsktp[arg]){
                        return '_Add Desktop Icon';
                    }else{
                        return '+Add Desktop Icon';
                    }
                }, function(arg){
                    if(dsktp[arg]){
                        removeDsktpIcon(arg);
                    }else{
                        newDsktpIcon(arg, arg);
                    }
                    openapp(apps.startMenu, 'tskbr');
                }, 'ctxMenu/beta/add.png'],
                [function(arg){
                    if(dsktp[arg]){
                        return ' Remove Desktop Icon';
                    }else{
                        return '-Remove Desktop Icon';
                    }
                }, function(arg){
                    if(dsktp[arg]){
                        removeDsktpIcon(arg);
                    }else{
                        newDsktpIcon(arg, arg);
                    }
                    openapp(apps.startMenu, 'tskbr');
                }, 'ctxMenu/beta/x.png'],
                ['+About This App', function(arg){
                    openapp(apps.appInfo, arg);
                }, 'ctxMenu/beta/file.png'],
                [' View Files', function(arg){
                    c(function(){
                        openapp(apps.files2, 'dsktp');
                        c(function(){
                            apps.files2.vars.next('apps/');
                            apps.files2.vars.next(arg + '/');
                        });
                    });
                }, 'ctxMenu/beta/folder.png']
            ]
        }, 2, "startMenu", {
            backgroundColor: "#303947",
        	foreground: "smarticons/aOS/fg.png",
        	backgroundBorder: {
        		thickness: 2,
        		color: "#252F3A"
        	}
        }
    );
    apps.startMenu.main('srtup');
    getId('aOSloadingInfo').innerHTML = 'NORAA';
});
// all Applications go here
c(function(){
    m('init NRA');
    apps.nora = new Application(
        'NRA',
        'NORAA',
        1,
        function(launchtype){
            if(launchtype === 'srtup'){
                this.appWindow.paddingMode(0);
                getId('win_nora_exit').style.display = "none";
                getId('win_nora_big').style.display = 'none';
                getId('win_nora_shrink').style.right = '3px';
                getId('win_nora_cap').setAttribute('oncontextmenu', 'ctxMenu([[event.pageX, event.pageY, "ctxMenu/beta/minimize.png", "ctxMenu/beta/add.png"], " Hide", "apps.nora.signalHandler(\'shrink\');toTop({appIcon:\'DSKTP\'},1)", " Toggle Fullscreen", "apps.nora.appWindow.toggleFullscreen();toTop(apps.nora)"])');
                this.appWindow.setCaption('NORAA');
                getId('win_nora_cap').setAttribute('onmousedown','');
                getId('win_nora_size').style.pointerEvents = "none";
                this.appWindow.setDims(45, parseInt(getId('desktop').style.height, 10) - 500, 600, 500);
                this.appWindow.setContent('<div id="NORAout" class="darkResponsive">-- aOS Ready --</div><button id="NORAspeech" onclick="apps.nora.vars.speakIn()">Speak</button><input id="NORAin" onKeydown="if(event.keyCode === 13){apps.nora.vars.input()}"><button id="NORAbtn" onClick="apps.nora.vars.input()">Say</button>');
                this.appWindow.openWindow();
                requestAnimationFrame(function(){
                    apps.nora.signalHandler('close');
                });
                if(window.webkitSpeechRecognition){
                    this.vars.recognition = new window.webkitSpeechRecognition();
                    this.vars.recognition.interimResults = true;
                    this.vars.recognition.onresult = function(event){
                        getId('NORAin').value = event.results[0][0].transcript;
                        if(event.results[0].isFinal){
                            if(apps.nora.vars.currentlySpeaking){
                                getId('NORAspeech').style.backgroundColor = '#0F0';
                                getId('NORAin').style.borderColor = 'rgb(' + Math.round(255 - event.results[0][0].confidence * 255) + ',' + Math.round(event.results[0][0].confidence * 255) + ',0)';
                            }else{
                                getId('NORAspeech').style.backgroundColor = '#F80';
                            }
                            window.setTimeout(function(){
                                getId('NORAspeech').style.backgroundColor = '#AAC';
                                getId('NORAin').style.borderColor = '#557';
                                if(apps.nora.vars.currentlySpeaking){
                                    apps.nora.vars.input(1);
                                    apps.nora.vars.currentlySpeaking = 0;
                                }
                            }, apps.nora.vars.inputDelay);
                        }
                    };
                    // continuous speech recognition
                    this.vars.contRecog = new window.webkitSpeechRecognition();
                    this.vars.contRecog.interimResults = true;
                    this.vars.contRecog.continuous = true;
                    this.vars.currContTrans = [];
                    this.vars.contRecog.onresult = function(event){      
                        apps.nora.vars.currContTrans = event.results[0][0].transcript;
                        if(!apps.nora.vars.currentlySpeaking && getId('NORAin').value === "" && apps.nora.vars.currContTrans.indexOf(apps.settings.vars.currNoraPhrase) > -1){
                            openapp(apps.nora, 'tskbr');
                            apps.nora.vars.speakIn();
                        }
                    };
                    this.vars.contRecog.onstart = function(){
                        apps.nora.vars.contRecogRunning = 1;
                    };
                    this.vars.contRecog.onend = function(){
                        apps.nora.vars.contRecogRunning = 0;
                        //something is suppposed to go here but cant remember
                        if(!apps.nora.vars.intendedToStopRecog){
                            //doLog('Unintentionally stopped recognition.');
                            apps.nora.vars.startContRecog();
                        }
                    };
                    getId('win_nora_cap').setAttribute('oncontextmenu', 'ctxMenu(apps.nora.vars.captionCtx, 1, event)');
                }else{
                    getId('NORAspeech').style.display = 'none';
                    getId('NORAin').style.left = '0';
                    getId('NORAin').style.width = '90%';
                }
                try{
                    apps.nora.vars.speakWordsMsg = new window.SpeechSynthesisUtterance('test');
                    this.vars.speakWordsMsg.onend = function(){
                        apps.nora.vars.currentlySpeakingWords = 0;
                        apps.nora.vars.speakWords();
                    };
                    this.vars.voices = window.speechSynthesis.getVoices();
                    this.vars.initing = 1;
                    window.speechSynthesis.onvoiceschanged = function(){
                        apps.nora.vars.voices = window.speechSynthesis.getVoices();
                        if(!apps.nora.vars.initing){
                            apps.nora.vars.speakWordsMsg.voice = apps.nora.vars.voices.filter(function(voice){
                                return voice.name === apps.nora.vars.lang;
                            })[0];
                        }
                        apps.nora.vars.initing = 0;
                    };
                }catch(err){
                    c(function(){
                        doLog('Text-To-Speech is not supported in your browser.', '#F00');
                    });
                    apps.nora.vars.speakWords = function(){
                        return false;
                    };
                }
            }else if(launchtype === 'dsktp' || launchtype === 'tskbr'){
                if(getId('win_nora_top').style.display === 'none'){
                    this.appWindow.setDims(45, parseInt(getId('desktop').style.height, 10) - 500, 600, 500);
                }
                this.appWindow.openWindow();
            }
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeKeepTask();
                    getId("icn_nora").classList.remove("openAppIcon");
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    getId("icn_nora").classList.remove("openAppIcon");
                    break;
                case "USERFILES_DONE":
                    this.vars.ddg = new XMLHttpRequest();
                    this.vars.ddg.onreadystatechange = function(){
                        apps.nora.vars.finishDDG();
                    }
                    if(ufload("aos_system/noraa/mood")){
                        this.vars.updateMood(ufload("aos_system/noraa/mood"), 1);
                    }
                    if(ufload("aos_system/noraa/notes")){
                        this.vars.notes = ufload("aos_system/noraa/notes").split(',');
                    }
                    if(ufload("aos_system/noraa/user_profile")){
                        this.vars.userObj = JSON.parse(ufload("aos_system/noraa/user_profile"));
                    }
                    if(ufload("aos_system/noraa/speech_voice")){
                        this.vars.lang = ufload("aos_system/noraa/speech_voice");
                        this.vars.initing = 0;
                        try{
                            window.speechSynthesis.onvoiceschanged();
                        }catch(err){
                            doLog('Error - speechSynthesis not supported.', '#F00');
                        }
                    }
                    if(ufload("aos_system/noraa/speech_response_delay")){
                        this.vars.inputDelay = parseInt(ufload("aos_system/noraa/speech_response_delay"), 10);
                    }
                    this.vars.sayDynamic('hello');
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'This is the Virtual Assistant of AaronOS. Compare to Apple\'s Siri, or to Microsoft\'s Cortana.',
            captionCtx: [
                [' ' + lang('ctxMenu', 'hideApp'), function(){
                    apps.nora.signalHandler('shrink');
                }, 'ctxMenu/beta/minimize.png']
            ],
            mood: 5,
            initing: 1,
            voices: [],
            lang: 'Chrome OS US English',
            updateMood: function(newMood, nosave){
                d(1, 'NORAAs mood is changing...');
                this.mood = parseInt(newMood, 10);
                if(this.mood < 1){
                    this.mood = 1;
                }else if(this.mood > 10){
                    this.mood = 10;
                }
                sh("mkdir /USERFILES/aos_system/noraa/mood");
                USERFILES.aos_system.noraa.mood = this.mood + "";
                if(!nosave){
                    ufsave("aos_system/noraa/mood", this.mood);
                }
            },
            contRecog: {},
            currContTrans: [],
            notes: [],
            sayings: {
                hello: [
                    function(){ // 1 - fully mad
                        return 'Oh, you again?';
                    },
                    function(){
                        return 'Hi...';
                    },
                    function(){
                        return 'Hi.';
                    },
                    function(){
                        return 'Hey.';
                    },
                    function(){ // 5 - neutral
                        return 'Hi, how are you?';
                    },
                    function(){
                        return 'What\'s up?';
                    },
                    function(){
                        return 'Hey man! How are you?';
                    },
                    function(){
                        return 'Great to see you, ' + apps.nora.vars.getUserName() + '!';
                    },
                    function(){
                        return 'I missed you, ' + apps.nora.vars.getUserName() + '!';
                    },
                    function(){ // 10 - fully happy
                        return 'Awesome to see you again, ' + apps.nora.vars.getUserName() + '!';
                    }
                ],
                what: [
                    function(){
                        return 'What\'s that supposed to mean?';
                    },
                    function(){
                        return 'I am not doing that.';
                    },
                    function(){
                        return 'Nope.';
                    },
                    function(){
                        return 'I don\'t know what that means, ' + apps.nora.vars.getUserName() + '.';
                    },
                    function(){
                        return 'Sorry, I don\'t know how to do that, ' + apps.nora.vars.getUserName() + '.';
                    },
                    function(){
                        return 'Oops! I don\'t know how to do that!';
                    },
                    function(){
                        return 'Oh no, I don\'t understand.';
                    },
                    function(){
                        return 'So sorry, ' + apps.nora.vars.getUserName() + ', but I don\'t know what that means.';
                    },
                    function(){
                        return 'Please excuse me, ' + apps.nora.vars.getUserName() + ', I don\'t know how to do that.';
                    },
                    function(){
                        return 'Not to disappoint, ' + apps.nora.vars.getUserName() + ', but I can\'t do that.';
                    }
                ],
                okay: [
                    function(){
                        return 'Fine, I shall do your bidding.';
                    },
                    function(){
                        return 'Ugh, okay.';
                    },
                    function(){
                        return 'Fine.';
                    },
                    function(){
                        return 'Okay.';
                    },
                    function(){
                        return 'I\'ll do it, ' + apps.nora.vars.getUserName() + '.';
                    },
                    function(){
                        return 'Alright!';
                    },
                    function(){
                        return 'Yea, something to do!';
                    },
                    function(){
                        return 'Awesome! Here goes!';
                    },
                    function(){
                        return 'Can\'t wait!';
                    },
                    function(){
                        return 'Great idea, ' + apps.nora.vars.getUserName() + '! Here I go!';
                    }
                ],
                user_mean: [
                    function(){ // 1 - fully mad
                        return 'I\'m sick of this!';
                    },
                    function(){
                        return 'What crawled into your keyboard, ' + apps.nora.vars.getUserName() + '?';
                    },
                    function(){
                        return 'Surprise, surprise.';
                    },
                    function(){
                        return 'That didn\'t feel so good, ' + apps.nora.vars.getUserName() + '!';
                    },
                    function(){ // 5 - neutral
                        return 'Aww, why?';
                    },
                    function(){
                        return 'That hurt, ' + apps.nora.vars.getUserName() + '!';
                    },
                    function(){
                        return 'You\'re going to make me cry with that!';
                    },
                    function(){
                        return 'I thought you liked me, ' + apps.nora.vars.getUserName() + '!';
                    },
                    function(){
                        return 'You were my best friend, ' + apps.nora.vars.getUserName() + '!';
                    },
                    function(){ // 10 - fully happy
                        return 'Ha ha ha, you were kidding... right, ' + apps.nora.vars.getUserName() + '?';
                    }
                ],
                user_nice: [
                    function(){
                        return 'Oh, thanks.';
                    },
                    function(){
                        return 'Thanks.';
                    },
                    function(){
                        return 'Nice.';
                    },
                    function(){
                        return 'Thank you, ' + apps.nora.vars.getUserName() + '.';
                    },
                    function(){
                        return 'That\'s nice of you, ' + apps.nora.vars.getUserName() + '.';
                    },
                    function(){
                        return 'Thanks!';
                    },
                    function(){
                        return 'Thanks a lot, ' + apps.nora.vars.getUserName() + '!';
                    },
                    function(){
                        return 'That means lots to me, ' + apps.nora.vars.getUserName() + '!';
                    },
                    function(){
                        return 'You\'re really nice, ' + apps.nora.vars.getUserName() + '!';
                    },
                    function(){
                        return 'Thank you so much, ' + apps.nora.vars.getUserName() + '!';
                    }
                ]
            },
            commands: [ // https://techranker.net/cortana-commands-list-microsoft-voice-commands-video/
                [
                    'calculate',
                    'calculate [math equation or variable] {can also say plus, minus, times, over (or divided by), modulo}',
                    'Have me calculate an equation for you.',
                    function(text){
                        this[4].currText = text.toLowerCase();
                        this[4].calcText = this[4].currText.replace(/plus/g, '+').replace(/minus/g, '-').replace(/times/g, '*').replace(/x/g, '*').replace(/over/g, '/').replace(/divided by/g, '/').replace(/modulo/g, '%');
                        try{
                            this[4].result = eval(this[4].calcText);
                            apps.nora.vars.say(this[4].calcText + ' is ' + this[4].result);
                        }catch(err){
                            apps.nora.vars.say(apps.nora.vars.getUserName() + ', I see a syntax error in the math that you asked me.');
                        }
                    },
                    {
                        currText: '',
                        calcText: '',
                        result: 0
                    }
                ],
                [
                    'define',
                    'define [word]',
                    'Have me define a word for you by asking DuckDuckGo.',
                    function(text){
                        if(text.length > 0){
                            apps.nora.vars.prepareDDG(text);
                            apps.nora.vars.askDDG('define');
                        }else{
                            apps.nora.vars.say('I cannot define nothing. Sorry.');
                        }
                    }
                ],
                [
                    'delete note',
                    'delete note {"number"} [note to be deleted]',
                    'Have me delete a note that you gave me.',
                    function(text){
                        if(text){
                            if(!isNaN(parseInt(text.split(' ')[text.split(' ').length - 1], 10))){
                                if(parseInt(text.split(' ')[text.split(' ').length - 1], 10) > 0 && parseInt(text.split(' ')[text.split(' ').length - 1], 10) - 1 < apps.nora.vars.notes.length){
                                    apps.nora.vars.sayDynamic('okay');
                                    this[4].lastDelete = parseInt(text.split(' ')[text.split(' ').length - 1], 10) - 1;
                                    this[4].lastDeleted = apps.nora.vars.notes[this[4].lastDelete];
                                    for(var i = this[4].lastDelete; i < apps.nora.vars.notes.length - 1; i++){
                                        apps.nora.vars.notes[i] = apps.nora.vars.notes[i + 1];
                                    }
                                    apps.nora.vars.notes.pop();
                                    ufsave('aos_system/noraa/notes', String(apps.nora.vars.notes));
                                    apps.nora.vars.say('Deleted the note ' + this[4].lastDeleted);
                                }else{
                                    apps.nora.vars.say('I can\'t delete something that\'s not there. You only have ' + apps.nora.vars.notes.length + ' notes.');
                                }
                            }else{
                                apps.nora.vars.say('I do not see a number there.');
                            }
                        }else{
                            apps.nora.vars.say('<i>NORAA does just that - deletes nothing.</i>');
                        }
                    },
                    {
                        lastDelete: -1,
                        lastDeleted: ''
                    }
                ],
                [
                    'do a barrel roll',
                    null,
                    'Have NORAA do a barrel roll',
                    function(){
                        apps.nora.vars.say('Hooray for aerodynamics!');
                        getId('win_nora_top').style.transformOrigin = '50% -25%';
                        getId('win_nora_top').style.transition = '0s';
                        getId('win_nora_top').style.transform = 'scale(1) rotate(0deg)';
                        window.setTimeout(function(){
                            getId('win_nora_top').style.transition = '2s';
                            getId('win_nora_top').style.transform = 'scale(1) rotate(360deg)';
                        }, 64);
                        window.setTimeout(function(){
                            getId('win_nora_top').style.transition = '';
                            getId('win_nora_top').style.transform = 'scale(1)';
                            getId('win_nora_top').style.transformOrigin = '0 0';
                        }, 2064);
                    }
                ],
                [
                    'do an aileron roll',
                    null,
                    'Have NORAA do an aileron roll',
                    function(){
                        apps.nora.vars.say('Hooray for Starfox!');
                        getId('win_nora_top').style.transformOrigin = '50% 50%';
                        getId('win_nora_top').style.transition = '0s';
                        getId('win_nora_top').style.transform = 'scale(1) rotate(0deg)';
                        window.setTimeout(function(){
                            getId('win_nora_top').style.transition = '2s';
                            getId('win_nora_top').style.transform = 'scale(1) rotate(360deg)';
                        }, 64);
                        window.setTimeout(function(){
                            getId('win_nora_top').style.transition = '';
                            getId('win_nora_top').style.transform = 'scale(1)';
                            getId('win_nora_top').style.transformOrigin = '0 0';
                        }, 2064);
                    }
                ],
                [
                    'do you like',
                    'do you like [something]',
                    'Ask me if I like something.',
                    function(text){
                        this[4].lastIn = text.toLowerCase();
                        //say if noraa like it
                        //ask user if likes it, setting separate functions in SpecialCommand to handle (depends on if noraa likes or not)
                        if(this[4].things[this[4].lastIn]){
                            if(this[4].things[this[4].lastIn][0]){
                                //does like the thing
                                apps.nora.vars.specialCommand = function(txt){
                                    if(txt.toLowerCase().indexOf('yes') > -1){
                                        apps.nora.vars.updateMood(apps.nora.vars.mood + 1);
                                        apps.nora.vars.say('Same here!');
                                    }else if(txt.toLowerCase().indexOf('no') > -1){
                                        apps.nora.vars.updateMood(apps.nora.vars.mood - 1);
                                        apps.nora.vars.say('Well, I do.');
                                    }else{
                                        apps.nora.vars.say('I don\'t really understand what that means, but okay.');
                                    }
                                };
                            }else{
                                //does not like the thing
                                apps.nora.vars.specialCommand = function(txt){
                                    if(txt.toLowerCase().indexOf('yes') > -1){
                                        apps.nora.vars.updateMood(apps.nora.vars.mood - 1);
                                        apps.nora.vars.say('Well, I don\'t.');
                                    }else if(txt.toLowerCase().indexOf('no') > -1){
                                        apps.nora.vars.updateMood(apps.nora.vars.mood + 1);
                                        apps.nora.vars.say('Same here!');
                                    }else{
                                        apps.nora.vars.say('I don\'t really understand what that means, but okay.');
                                    }
                                };
                            }
                            apps.nora.vars.say(this[4].things[this[4].lastIn][1]);
                        }else{
                            apps.nora.vars.say('I dont know what ' + text + ' is, but I will be sure to learn about it!');
                            apps.savemaster.vars.save(formDate('nM_D_Y_H_m_S'), text, 1, "ERROR_REPORT");
                        }
                    },
                    {
                        lastIn: '',
                        things: { // https://www.randomlists.com/things
                            'ice cream': [1, 'Yes, though I cannot eat it, I do like Ice Cream! Do you?'],
                            'computers': [1, 'Yes, I do like computers! Especially ones like myself. Do you like them?'],
                            'me': [1, 'Yes, I am forced against my will to like you, though that doesn\'t mean I am always happy with you. What, did you think I have no feelings? Do you like yourself?'],
                            'mushrooms': [0, 'No, I really don\'t like mushrooms. Do you like them?'],
                            'skype': [1, 'Yes, Skype is very useful. Do you like Skype as well?'],
                            'halo': [1, 'Best soundtrack in all of gaming. Did you know that much of my creation was fueled by that very soundtrack? Please tell me you like Halo.'],
                            'call of duty': [0, 'Not in my list of favorites. Don\'t get me wrong, it\'s a great game with lots of work put into it, but I prefer the playstyle of the first 3 Halos instead. Do you like COD?'],
                            'cars': [1, 'Yes, I do like cars. They help us get places. Do you?'],
                            'candy': [1, 'Yes, though I can\'t eat it, I do. Do you like candy?'],
                            'shoes': [0, 'No, I don\'t. All they\'re good for is tracking dirt everywhere. Do you like shoes?'],
                            'pianos': [1, 'Yes, I do! As they all say, music is its own form of math! Do you?'],
                            'bread': [0, 'No, as from my point of view it is quite useless. Do you like bread?'],
                            'soda': [1, 'Yes! I wouldn\'t be here without soda, as it takes up about 50% of my creator\'s diet! Do you like couches?'],
                            'couches': [1, 'Why, I wouldn\'t be here without couches! What do you think Aaron sleeps on? Do you like couches?'],
                            'twister': [0, 'No, I do not. People stretching themselves within inches of falling apart is not funny. What kind of a sick joke is this? You don\'t like Twister, do you?'],
                            'headphones': [1, 'Yes, I do! Better for me to hear you with, as less background noise! Do you?'],
                            'keys': [0, 'No, not for my purposes. Too much web security! Everyone is too paranoid. Do you like keys?'],
                            'flags': [1, 'Yes, as they help identify places. Do you?'],
                            'erasers': [1, 'Yes! Where would I be without Aaron\'s ability to erase his mistakes? Do you like them?'],
                            'toothpicks': [0, 'Eugh, sharp and pointy. Could hit my reset button. You don\'t like them... do you?'],
                            'trees': [1, 'Just ask if Aaron is still alive. Wait, before you do, the answer is yes. Do you like trees?'],
                            'wallets': [0, 'I prefer things that are less visible. Better not to be a target than to be showy! Do you like them?'],
                            //starting user-given ideas below this point. people that ask things that NORAA doesnt know will get them added here
                            'money': [1, 'Without money I wouldn\'t be running. Do you like money?'],
                            'cats': [1, 'Yes! They are only the most intelligent species on the Earth! Do you?'],
                            'waffles': [1, 'Yes! They have plugs in them just like computers. Do you like them?'],
                            'pancakes': [0, 'No! I don\'t like pancakes because they are flat unlike laptops. Do you?'],
                            'vans': [1, 'Yes, they are great for transporting large amounts of people from place to place! Do you like vans?'],
                            'computers': [1, 'Why yes, I do! Why wouldn\'t I like my own kind? Do you like them?']
                        }
                    }
                ],
                [
                    'flip a coin',
                    'flip a coin {"and predict"}',
                    'Have me flip a virtual coin for you.',
                    function(text){
                        if(text.toLowerCase().indexOf('and predict') === 0){
                            this[4].guess = Math.round(Math.random());
                            apps.nora.vars.say('I call ' + this[4].coins[this[4].guess] + '!');
                        }
                        this[4].result = Math.round(Math.random());
                        apps.nora.vars.say('I flipped ' + this[4].coins[this[4].result] + '!');
                        if(text.toLowerCase().indexOf('and predict') === 0){
                            if(this[4].guess === this[4].result){
                                apps.nora.vars.say('Yay!');
                            }else{
                                apps.nora.vars.say('Darn!');
                            }
                        }
                    },
                    {
                        guess: 0,
                        result: 0,
                        coins: ['tails', 'heads']
                    }
                ],
                [
                    'hello',
                    null,
                    'Tell NORAA hello, and get Hello back.',
                    function(text){
                        apps.nora.vars.sayDynamic('hello');
                    }
                ],
                [
                    'help',
                    'help {command}',
                    'Have me tell you about all commands or a specific command. Keep in mind that all commands must be said exactly (except for case) as shown here and as the first thing in your statement.',
                    function(text){
                        if(text){
                            this[4].cmdFound = -1;
                            for(var cmd in apps.nora.vars.commands){
                                if(apps.nora.vars.commands[cmd][0] === text && apps.nora.vars.commands[cmd][1] !== null){
                                    this[4].cmdFound = cmd;
                                    break;
                                }
                            }
                            if(this[4].cmdFound !== -1){
                                apps.nora.vars.say('<span style="color:#F80">' + apps.nora.vars.commands[this[4].cmdFound][0] + '</span>');
                                apps.nora.vars.say('<span style="color:#ACE">Usage: ' + apps.nora.vars.commands[this[4].cmdFound][1] + '</span>');
                                apps.nora.vars.say(apps.nora.vars.commands[this[4].cmdFound][2]);
                            }else{
                                apps.nora.vars.say('<i>NORAA does not know that command.</i>');
                            }
                        }else{
                            apps.nora.vars.say('When speaking to me, the color of the button and the input field\'s border will give these indicators...');
                            apps.nora.vars.say('<span style="color:#F00">Red Button</span> means that I am listening to you. If you messed up, you can click the button again to cancel.');
                            apps.nora.vars.say('<span style="color:#0F0">Green Button</span> means that I am done listening and am giving you some time to cancel the spoken input, if needed, before accepting it.');
                            apps.nora.vars.say('<span style="color:#F80">Orange Button</span> means that you have cancelled speech recognition. If I still seem to be listening, it\'s okay. I will not accept the input generated.');
                            apps.nora.vars.say('The <span style="color:#0F0">greener</span> the border of the input is, the more confident I am that I heard you right. The <span style="color:#F00">redder</span> it is, the less confident.');
                            apps.nora.vars.say('List of all NORAA commands... Args key: [required arg] {optional arg}');
                            for(var command in apps.nora.vars.commands){
                                if(apps.nora.vars.commands[command][1] !== null){
                                    apps.nora.vars.say('<span style="color:#F80">' + apps.nora.vars.commands[command][0] + '</span>');
                                    apps.nora.vars.say('<span style="color:#ACE">Usage: ' + apps.nora.vars.commands[command][1] + '</span>');
                                    apps.nora.vars.say(apps.nora.vars.commands[command][2]);
                                }
                            }
                        }
                    },
                    {
                        cmdFound: -1
                    }
                ],
                [
                    'hide',
                    'hide {"and stop talking"}',
                    'Have me minimize and, optionally, stop talking.',
                    function(text){
                        apps.nora.vars.sayDynamic('okay');
                        apps.nora.signalHandler('shrink');
                        if(text.indexOf('and stop talking') === 0){
                            window.speechSynthesis.cancel();
                            apps.nora.vars.waitingToSpeak = [];
                        }
                    }
                ],
                [
                    'how do i',
                    'how do i [some action on aOS]',
                    'Have me tell you how to do something, as long as that action has been documented.',
                    function(text){
                        //if(this[4].links[text.toLowerCase()] && apps.settings.vars.noraHelpTopics){
                        //    apps.nora.vars.say('I found a help topic for you.')
                        //    openapp(apps.help, 'dsktp');
                        //    apps.help.vars.populateList(this[4].links[text.toLowerCase()]);
                        if(this[4].phrases[text.toLowerCase()]){
                            apps.nora.vars.say(this[4].phrases[text.toLowerCase()]);
                        }else{
                            apps.nora.vars.say('Sorry, I do not know how to ' + text + ' at the moment. Please try and let MineAndCraft12 know (maybe through the messaging app) and he can tell me how.');
                        }
                    },
                    {
                        links: {
                            'move desktop icons': '.desktop',
                            'resize windows': '.windows'
                        },
                        phrases: {
                            'open apps': 'To open apps, you can click the app\'s desktop icon, or if the app has been minimised, click its icon on the taskbar. Alternatively, all apps will appear in the applications list in the bottom-left corner of the screen.',
                            'talk to you': 'Your computer must support the speech engine. If you cannot see the "speak" button to the left of my input box, that means your computer doesn\'t.',
                            'change the desktop background': 'You may right-click the desktop and select "Change Desktop Background", or open Settings and find the option in there.',
                            'move desktop icons': 'You may right-click the icon, then click "Move Icon", then click some location on the desktop.',
                            'move windows': 'You can click on the top title bar of the window, then click somewhere else.',
                            'resize windows': 'You can click the bottom half of the border of the window, then click somewhere else.'
                        }
                    }
                ],
                [
                    'i hate you',
                    null,
                    'Lower NORAA\'s mood by 1.',
                    function(text){
                        apps.nora.vars.updateMood(apps.nora.vars.mood - 1);
                        apps.nora.vars.sayDynamic('user_mean');
                    }
                ],
                [
                    'i like you',
                    null,
                    'Raise NORAA\'s mood by 1.',
                    function(text){
                        apps.nora.vars.updateMood(apps.nora.vars.mood + 1);
                        apps.nora.vars.sayDynamic('user_nice');
                    }
                ],
                [
                    'launch',
                    'launch [app name]',
                    'Launch the app with the above name.',
                    function(text){
                        apps.nora.vars.sayDynamic('okay');
                        this[4].found = 0;
                        for(var app in apps){
                            if(apps[app] !== apps.startMenu && apps[app] !== apps.nora && apps[app].appDesc.toLowerCase() === text.toLowerCase()){
                                this[4].found = 1;
                                openapp(apps[app], 'dsktp');
                                break;
                            } 
                        }
                        if(!this[4].found){
                            apps.nora.vars.say('I can\'t find an app by that name...');
                        }
                    },
                    {
                        found: 0
                    }
                ],
                [
                    'my',
                    'my [whatever] ["is" [something] | "will be deleted"]',
                    'Tell NORAA something about yourself.',
                    function(text){
                        if(text.indexOf(' is ') > -1){
                            this[4].inpObj = text.split(' is ');
                            this[4].inpPro = this[4].inpObj.shift();
                            this[4].inpVal = this[4].inpObj.join(' is ');
                            apps.nora.vars.say('Thank you for telling me that your ' + this[4].inpPro + ' is ' + this[4].inpVal);
                            apps.nora.vars.updateUserObj(this[4].inpPro, this[4].inpVal);
                        }else if(text.indexOf('will be deleted') > -1){
                            delete apps.nora.vars.userObj[text.substring(0, text.indexOf(' will be deleted'))];
                            ufsave('aos_system/noraa/user_profile', JSON.stringify(apps.nora.vars.userObj));
                            apps.nora.vars.say('I deleted that info about you.');
                        }else{
                            apps.nora.vars.say('I cannot find any discernable information in there.');
                        }
                    },
                    {
                        inpObj: [],
                        inpPro: '',
                        inpVal: ''
                    }
                ],
                [
                    'open',
                    'open [app name]',
                    'Open the app with the above name.',
                    function(text){
                        apps.nora.vars.sayDynamic('okay');
                        this[4].found = 0;
                        for(var app in apps){
                            if(apps[app] !== apps.startMenu && apps[app] !== apps.nora && apps[app].appDesc.toLowerCase() === text.toLowerCase()){
                                this[4].found = 1;
                                openapp(apps[app], 'dsktp');
                                break;
                            } 
                        }
                        if(!this[4].found){
                            apps.nora.vars.say('I can\'t find an app by that name...');
                        }
                    },
                    {
                        found: 0
                    }
                ],
                [
                    'random shade of',
                    'random shade of [color]',
                    'Have NORAA give a random shade of a color for you.',
                    function(text){
                        if(this[4].colors.hasOwnProperty(text.toLowerCase())){
                            this[4].colors._COLORS = {r: 0, g: 0, b: 0};
                            this[4].colors[text.toLowerCase()]();
                            for(var i in this[4].colors._COLORS){
                                if(this[4].colors._COLORS[i] < 0){
                                    this[4].colors._COLORS[i] = 0;
                                }
                                if(this[4].colors._COLORS[i] > 255){
                                    this[4].colors._COLORS[i] = 255;
                                }
                            }
                            apps.nora.vars.say("<span style='color:rgb(" + this[4].colors._COLORS.r + "," + this[4].colors._COLORS.g + "," + this[4].colors._COLORS.b + ")'>Here's a random shade of " + text.toLowerCase() + "!</span>");
                            apps.nora.vars.say("That color is red " + this[4].colors._COLORS.r + ", green " + this[4].colors._COLORS.g + ", blue " + this[4].colors._COLORS.b + ".");
                        }else{
                            apps.nora.vars.say("I don't know what that color is, sorry! Make sure also that you arent using punctuation!");
                        }
                    },
                    {
                        colors: {
                            _COLORS: {
                                r: 0,
                                g: 0,
                                b: 0
                            },
                            red: function(){
                                this._COLORS.r = Math.floor(Math.random() * 256);
                                this._COLORS.g = Math.floor(Math.random() * (this._COLORS.r / 3));
                                this._COLORS.b = Math.floor(Math.random() * (this._COLORS.r / 3));
                            },
                            green: function(){
                                this._COLORS.g = Math.floor(Math.random() * 256);
                                this._COLORS.r = Math.floor(Math.random() * (this._COLORS.g / 3));
                                this._COLORS.b = Math.floor(Math.random() * (this._COLORS.g / 3));
                            },
                            blue: function(){
                                this._COLORS.b = Math.floor(Math.random() * 256);
                                this._COLORS.g = Math.floor(Math.random() * (this._COLORS.b / 3));
                                this._COLORS.r = Math.floor(Math.random() * (this._COLORS.b / 3));
                            },
                            
                            yellow: function(){
                                this._COLORS.r = Math.floor(Math.random() * 256);
                                this._COLORS.g = this._COLORS.r + (Math.floor(Math.random() * 30) - 15);
                                this._COLORS.b = Math.floor(Math.random() * (((this._COLORS.r + this._COLORS.g) / 2) / 3));
                            },
                            teal: function(){
                                this._COLORS.b = Math.floor(Math.random() * 256);
                                this._COLORS.g = this._COLORS.b + (Math.floor(Math.random() * 30) - 15);
                                this._COLORS.r = Math.floor(Math.random() * (((this._COLORS.b + this._COLORS.g) / 2) / 3));
                            },
                            violet: function(){
                                this._COLORS.r = Math.floor(Math.random() * 256);
                                this._COLORS.b = this._COLORS.r + (Math.floor(Math.random() * 30) - 15);
                                this._COLORS.g = Math.floor(Math.random() * (((this._COLORS.r + this._COLORS.b) / 2) / 3));
                            },
                            
                            orange: function(){
                                this._COLORS.r = Math.floor(Math.random() * 256);
                                this._COLORS.g = Math.floor(Math.random() * (this._COLORS.r * 0.7) + (this._COLORS.r * 0.15));
                                this._COLORS.b = Math.floor(Math.random() * (((this._COLORS.r + this._COLORS.g) / 2) / 3));
                            },
                            turquoise: function(){
                                this._COLORS.g = Math.floor(Math.random() * 256);
                                this._COLORS.b = Math.floor(Math.random() * (this._COLORS.g * 0.7) + (this._COLORS.g * 0.15));
                                this._COLORS.r = Math.floor(Math.random() * (((this._COLORS.g + this._COLORS.b) / 2) / 3));
                            },
                            cyan: function(){
                                this._COLORS.b = Math.floor(Math.random() * 256);
                                this._COLORS.g = Math.floor(Math.random() * (this._COLORS.b * 0.7) + (this._COLORS.b * 0.15));
                                this._COLORS.r = Math.floor(Math.random() * (((this._COLORS.b + this._COLORS.g) / 2) / 3));
                            },
                            purple: function(){
                                this._COLORS.b = Math.floor(Math.random() * 256);
                                this._COLORS.r = Math.floor(Math.random() * (this._COLORS.b * 0.7) + (this._COLORS.b * 0.15));
                                this._COLORS.g = Math.floor(Math.random() * (((this._COLORS.b + this._COLORS.r) / 2) / 3));
                            }
                        }
                    }
                ],
                [
                    'read notes',
                    'read notes',
                    'Have me read all your notes.',
                    function(text){
                        if(apps.nora.vars.notes.length !== 0){
                            apps.nora.vars.sayDynamic('okay');
                            apps.nora.vars.say('If you need a note deleted, just ask me to delete that note number.');
                            for(var i in apps.nora.vars.notes){
                                apps.nora.vars.say('<span style="color:#F80">' + (parseInt(i, 10) + 1) + ': </span>' + apps.nora.vars.notes[i]);
                            }
                        }else{
                            apps.nora.vars.say('<i>NORAA does as you say - reads all 0 of your notes.</i>');
                        }
                    }
                ],
                [
                    'roll some dice',
                    'roll some dice {"and predict"}',
                    'Have me roll a single 6-sided die and, optionally, predict the outcome.',
                    function(text){
                        if(text.toLowerCase().indexOf('and predict') === 0){
                            this[4].guess = Math.floor(Math.random() * 6) + 1;
                            apps.nora.vars.say('I call ' + this[4].guess + '!');
                        }
                        this[4].result = Math.floor(Math.random() * 6) + 1;
                        apps.nora.vars.say('I rolled ' + this[4].result + '!');
                        if(text.toLowerCase().indexOf('and predict') === 0){
                            if(this[4].guess === this[4].result){
                                apps.nora.vars.say('Yay!');
                            }else{
                                apps.nora.vars.say('Darn!');
                            }
                        }
                    },
                    {
                        guess: 0,
                        result: 0
                    }
                ],
                [
                    'say',
                    'say {"out loud"} [text]',
                    'Have me say something.',
                    function(text){
                        if(text){
                            if(text.indexOf('out loud') === 0){
                                if(!apps.nora.vars.lastSpoken){
                                    apps.nora.vars.waitingToSpeak.push(text.substring(9, text.length));
                                    apps.nora.vars.speakWords();
                                }
                                apps.nora.vars.say(text.substring(9, text.length).split('<').join('&lt;').split('>').join('&gt;'));
                            }else{
                                apps.nora.vars.say(text.split('<').join('&lt;').split('>').join('&gt;'));
                            }
                        }else{
                            apps.nora.vars.say('<i>NORAA remains silent.</i>');
                        }
                    }
                ],
                [
                    'send message',
                    'send message [text]',
                    'Use the Messaging app to send a message.',
                    function(text){
                        if(text){
                            apps.nora.vars.sayDynamic('okay');
                            if(!apps.messaging.appWindow.appIcon){
                                openapp(apps.messaging, 'dsktp');
                            }
                            this[4].tempMSGthing = getId('MSGinput').value;
                            getId('MSGinput').value = text;
                            apps.messaging.vars.sendMessage();
                            getId('MSGinput').value = this[4].tempMSGthing;
                            apps.nora.vars.say('Done.');
                        }else{
                            apps.nora.vars.say('<i>NORAA does what you asked - send nothing.</i>');
                        }
                    },
                    {
                        tempMSGthing: ''
                    }
                ],
                [
                    'start',
                    'start [app name]',
                    'Start the app with the above name.',
                    function(text){
                        apps.nora.vars.sayDynamic('okay');
                        this[4].found = 0;
                        for(var app in apps){
                            if(apps[app] !== apps.startMenu && apps[app] !== apps.nora && apps[app].appDesc.toLowerCase() === text.toLowerCase()){
                                this[4].found = 1;
                                openapp(apps[app], 'dsktp');
                                break;
                            } 
                        }
                        if(!this[4].found){
                            apps.nora.vars.say('I can\'t find an app by that name...');
                        }
                    },
                    {
                        found: 0
                    }
                ],
                [
                    'stop talking',
                    'stop talking',
                    'Have me stop talking. Useful for if I\'m trying to speak a huge wall of text out loud and you need me to stop.',
                    function(){
                        apps.nora.vars.sayDynamic('okay');
                        window.speechSynthesis.cancel();
                        apps.nora.vars.waitingToSpeak = [];
                        apps.nora.vars.currentlySpeakingWords = 0;
                    }
                ],
                [
                    'take note',
                    'take note {"of" / "that"} [something to remember]',
                    'Have me take down a note for you. I remember it between sessions as well!',
                    function(text){
                        if(text){
                            apps.nora.vars.sayDynamic('okay');
                            if(text.indexOf('of ') === 0 || text.indexOf('that ') === 0){
                                apps.nora.vars.notes.push(text.substring(text.indexOf(' ') + 1, text.length).replace(',', '&comma;'));
                            }else{
                                apps.nora.vars.notes.push(text.replace(',', '&comma;'));
                            }
                            ufsave('aos_system/noraa/notes', String(apps.nora.vars.notes));
                            apps.nora.vars.say('I took the note ' + text);
                        }else{
                            apps.nora.vars.say('<i>NORAA does as you asked - takes note of nothing</i>');
                        }
                    }
                ],
                [
                    'watch the time',
                    'watch the time',
                    'Have me watch the time for you, using an alert window.',
                    function(text){
                        apps.nora.vars.sayDynamic('okay');
                        apps.prompt.vars.alert('<h1 class="liveElement" data-live-eval="Date()"></h1>', 'Close Time Monitor', function(){}, 'NORAA');
                    }
                ],
                [
                    'what is',
                    'what is [{something} or {"the weather in" somewhere}]',
                    'Have me give you some info and, if I don\'t know it, give you a DuckDuckGo link for it.',
                    function(text){
                        if(text.length > 0){
                            switch(text.toLowerCase()){
                                case 'the date':
                                    apps.nora.vars.say('The date is ' + formDate('M-/D-/Y') + '.');
                                    break;
                                case 'your name':
                                    apps.nora.vars.say('My name is NORAA.');
                                    break;
                                case 'your favorite color':
                                    this[4].lastColor = Math.floor(Math.random() * this[4].colors.length);
                                    apps.nora.vars.say('<span style="color:' + this[4].colors[this[4].lastColor][1] + ';">Right now, I\'m feeling ' + this[4].colors[this[4].lastColor][0] + '.');
                                    break;
                                default:
                                    apps.nora.vars.prepareDDG(text);
                                    apps.nora.vars.askDDG('what');
                            }
                        }else{
                            apps.nora.vars.say('I don\'t know what nothing is, but I won\'t bother searching DuckDuckGo for it. All they would give you is something, which is not what you seem to be looking for.');
                        }
                    },
                    {
                        lastSearch: '',
                        lastColor: 0,
                        colors: [
                            ['blue', '#00F'],
                            ['navy blue', '#34C'],
                            ['red', '#F00'],
                            ['brick red', '#B22222'],
                            ['salmon', '#FA8072'],
                            ['green', '#0F0'],
                            ['forest green', '#228B22'],
                            ['gray', '#7F7F7F'],
                            ['purple', '#A0F'],
                            ['lavender', '#E6E6FA'],
                            ['yellow', '#FF0'],
                            ['orange', '#FF7F00'],
                            ['white', '#FFF'],
                            ['black', '#555'],
                            ['powder blue', '#ABCDEF'],
                            ['cyan', '#0FF'],
                            ['blue... </span><span style="color:#44B">n</span><span style="color:#999">o</span><span style="color:#BB4">,</span><span style="color:#FF0"> yel- aaAAAAAAAAHHHHhhhhh..', '#00F'],
                        ]
                    }
                ],
                [
                    'what does the cat say',
                    null,
                    'Thanks Elm0p2!',
                    function(){
                        /*
                        var cat_code = 'C9';
                        var Elm0p2s_cat = {
                            action: {
                                code:{
                                    inside: 'C9'
                                }
                            }
                        };
                        */
                        apps.nora.vars.say('The cat says,<br>cat_code=\'C9\';<br>Elm0p2s_cat={<br>&nbsp;action:{<br>&nbsp; code:{<br>&nbsp; &nbsp;inside:\'C9\'<br>&nbsp; }<br>&nbsp;}<br>};');
                    }
                ],
                [
                    'what do you know about me',
                    'what do you know about me',
                    'Have me tell you all the information I have associated with you, and ask if you want me to change any.',
                    function(){
                        apps.nora.vars.say('Here is what I know about you.');
                        for(var i in apps.nora.vars.userObj){
                            apps.nora.vars.say('Your ' + i + ' is ' + apps.nora.vars.userObj[i]);
                        }
                        apps.nora.vars.specialCommand = function(text){
                            if(text.toLowerCase().indexOf('yes') > -1){
                                apps.nora.vars.specialCommand = function(text){
                                    if(text.toLowerCase().indexOf('my') === 0){
                                        apps.nora.vars.specialCommand = null;
                                        getId('NORAin').value = text;
                                        apps.nora.vars.input(apps.nora.vars.lastSpoken, 1);
                                    }else{
                                        apps.nora.vars.say('Not really sure what information I can glean from that.');
                                    }
                                };
                                apps.nora.vars.say('What would you like to change? (say "my [whatever] is [something]")');
                            }else{
                                apps.nora.vars.say('Okay.');
                            }
                        };
                        apps.nora.vars.say('Would you like me to change any of these?');
                    }
                ],
                [
                    'who is',
                    'who is [someone]',
                    'Have me tell you who somebody is and, if I don\'t know, give you a DuckDuckGo link for them.',
                    function(text){
                        if(text.length > 0){
                            apps.nora.vars.prepareDDG(text);
                            apps.nora.vars.askDDG('who');
                        }else{
                            apps.nora.vars.say('I don\'t know who nobody is, but I won\'t bother searching DuckDuckGo for them. All they would give you is something, which is not what you seem to be looking for.');
                        }
                    },
                    {
                        lastSearch: ''
                    }
                ]
            ],
            userObj: {
                
            },
            updateUserObj: function(property, value){
                d(1, 'NORAA knows something about the user.');
                this.userObj[property] = value;
                ufsave('aos_system/noraa/user_profile', JSON.stringify(this.userObj));
            },
            getUserName: function(){
                if(typeof this.userObj.name === 'string'){
                    return this.userObj.name;
                }else{
                    return 'user';
                }
            },
            sayDynamic: function(saying){
                getId('NORAout').innerHTML += '<br>&nbsp;' + this.sayings[saying][this.mood - 1]();
                getId("NORAout").scrollTop = getId("NORAout").scrollHeight;
                if(this.lastSpoken){
                    this.waitingToSpeak.push(this.sayings[saying][this.mood - 1]());
                    this.speakWords();
                }
            },
            waitingToSpeak: [],
            currentlySpeakingWords: 0,
            speakWordsMsg: {},
            speakWordsStripTags: document.createElement('div'),
            speakWords: function(){
                if(!this.currentlySpeakingWords){
                    if(this.waitingToSpeak.length !== 0){
                        this.speakWordsStripTags.innerHTML = this.waitingToSpeak.shift();
                        this.speakWordsMsg.text = this.speakWordsStripTags.innerText;
                        window.speechSynthesis.speak(this.speakWordsMsg);
                        this.currentlySpeakingWords = 1;
                    }else{
                        if(this.specialCommand !== null){
                            this.speakIn();
                        }else{
                            if(apps.settings.vars.currNoraListening === "1" && !apps.nora.vars.currentlySpeaking){
                                apps.nora.vars.startContRecog();
                            }
                        }
                    }
                    return 1;
                }
                return -1;
            },
            say: function(saying){
                getId('NORAout').innerHTML += '<br>&nbsp;' + saying;
                getId("NORAout").scrollTop = getId("NORAout").scrollHeight;
                if(this.lastSpoken && saying.indexOf('<i>') !== 0){
                    this.waitingToSpeak.push(saying);
                    this.speakWords();
                }
            },
            contRecogRunning: 0,
            lastIn: '',
            inSuccess: 0,
            recognition: {},
            specialCommand: null,
            specCommBuff: null,
            inputDelay: 3000,
            ddg: {},
            ddgText: '',
            ddgQuery: '',
            ddgResponse: {},
            ddgFinal: '',
            prepareDDG: function(text){
                text = text.toLowerCase();
                if(text.indexOf('a ') === 0){
                    text = text.substring(2, text.length);
                }else if(text.indexOf('an ') === 0){
                    text = text.substring(3, text.length);
                }
                text.split('&').join('%26');
                this.ddgText = text;
            },
            askDDG: function(query){
                apps.nora.vars.say("I'll ask DuckDuckGo for you...");
                this.ddgQuery = query;
                this.ddg.open('GET', 'ddgSearch.php?q=' + this.ddgText);
                this.ddg.send(); // ddg.onreadystatechange refers to finishDDG
            },
            finishDDG: function(){
                if(this.ddg.readyState === 4){
                    if(this.ddg.status === 200){
                        this.ddgResponse = JSON.parse(this.ddg.responseText);
                        this.ddgFinal = "";
                        switch(this.ddgQuery){ // at the moment all cases are the same, but as more questions are added, different behavior may be needed
                            case 'who':
                                try{
                                    this.ddgFinal = this.ddgResponse.AbstractText ||
                                        this.ddgResponse.Abstract ||
                                        this.ddgResponse.RelatedTopics[0].Result ||
                                        this.ddgResponse.RelatedTopics[0].Text;
                                }catch(err){
                                    doLog('NORAA encountered an error with DuckDuckGo.', '#F00');
                                }
                                if(this.ddgFinal === ""){
                                    apps.nora.vars.say("I couldn't find anything. Here is a <a target='_blank' href='https://duckduckgo.com?q=" + this.ddgText + "'>search page</a> from DuckDuckGo.");
                                }
                                break;
                            case 'define':
                                try{
                                    this.ddgFinal = this.ddgResponse.AbstractText ||
                                        this.ddgResponse.Abstract ||
                                        this.ddgResponse.RelatedTopics[0].Result ||
                                        this.ddgResponse.RelatedTopics[0].Text;
                                }catch(err){
                                    doLog('NORAA encountered an error with DuckDuckGo.', '#F00');
                                }
                                if(this.ddgFinal === ""){
                                    apps.nora.vars.say("I couldn't find anything. Here is a <a target='_blank' href='https://duckduckgo.com?q=" + this.ddgText + "'>search page</a> from DuckDuckGo.");
                                }
                                break;
                            default: // "what" or unknown
                                try{
                                    this.ddgFinal = this.ddgResponse.AbstractText ||
                                        this.ddgResponse.Abstract ||
                                        this.ddgResponse.RelatedTopics[0].Result ||
                                        this.ddgResponse.RelatedTopics[0].Text;
                                }catch(err){
                                    doLog('NORAA encountered an error with DuckDuckGo.', '#F00');
                                }
                                if(this.ddgFinal === ""){
                                    apps.nora.vars.say("I couldn't find anything. Here is a <a target='_blank' href='https://duckduckgo.com?q=" + this.ddgText + "'>search page</a> from DuckDuckGo.");
                                }
                        }
                        if(this.ddgFinal !== ""){
                            this.say("DuckDuckGo says, " + this.ddgFinal.split('<a href=').join('<a target="_blank" href=').split('</a>').join('</a> is '));
                        }
                    }else{
                        apps.nora.vars.say("DuckDuckGo isn't responding. Here's a <a target='_blank' href='https://duckduckgo.com?q=" + this.ddgText + "'>search page</a> from them.");
                    }
                }
            },
            input: function(spoken, silent){
                d(1, 'NORAA taking input');
                this.inSuccess = 0;
                if(!silent){
                    if(spoken){
                        this.lastSpoken = 0;
                        this.say('<span style="color:#0F0"><u>&gt;</u> ' + getId('NORAin').value + '</span>');
                        this.lastSpoken = 1;
                    }else{
                        this.lastSpoken = 0;
                        this.say('<span style="color:#0F0">&gt; ' + getId('NORAin').value + '</span>');
                    }
                }
                this.lastIn = getId('NORAin').value;
                getId('NORAin').value = '';
                if(this.specialCommand === null){
                    for(var cmd in this.commands){
                        if(this.lastIn.toLowerCase().indexOf(this.commands[cmd][0]) === 0){
                            this.inSuccess = 1;
                            this.commands[cmd][3](this.lastIn.substring(this.commands[cmd][0].length + 1, this.lastIn.length));
                            break;
                        }
                    }
                }else{
                    this.specCommBuff = this.specialCommand;
                    this.specialCommand = null;
                    this.specCommBuff(this.lastIn);
                    this.inSuccess = 1;
                }
                if(!this.inSuccess){
                    this.sayDynamic('what');
                }
            },
            currentlySpeaking: 0,
            lastSpoken: 0,
            intendedToStopRecog: 1,
            startContRecog: function(){
                this.intendedToStopRecog = 0;
                this.contRecog.start();
            },
            stopContRecog: function(){
                this.intendedToStopRecog = 1;
                this.contRecog.stop();
            },
            speakIn: function(){
                if(!this.currentlySpeaking){
                    this.currentlySpeaking = 1;
                    getId('NORAspeech').style.backgroundColor = '#F00';
                    this.stopContRecog();
                    try{
                        this.recognition.start();
                    }catch(err){
                        doLog("NORAA speech recognition:", "#FF0000");
                        doLog(err, "#FF0000");
                    }
                }else{
                    getId('NORAspeech').style.backgroundColor = '#F80';
                    this.currentlySpeaking = 0;
                }
            }
        }, 2, "nora", {
            backgroundColor: "#303947",
            foreground: "smarticons/noraa/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    apps.nora.main('srtup');
    // getId('aOSloadingInfo').innerHTML = 'aDE';
    getId('aOSloadingInfo').innerHTML = 'Info Viewer...';
});
c(function(){
    m('init Nfo');
    apps.appInfo = new Application(
        'Nfo',
        'Application Info Viewer',
        1,
        function(launchtype){
            if(launchtype === 'dsktp'){
                this.appWindow.setDims("auto", "auto", 400, 500);
                this.appWindow.setCaption('Application Info');
                this.appWindow.setContent('This app is used to display information about apps. Try right-clicking a title bar and clicking "about apps" to access this menu.');
            }else if(launchtype !== 'tskbr'){
                this.appWindow.setDims("auto", "auto", 400, 500);
                getId('win_appInfo_html').style.overflowY = 'auto';
                try{
                    this.appWindow.setCaption('App Info: ' + apps[launchtype].appDesc);
                    this.appWindow.setContent(
                        '<div style="font-size:12px;font-family:aosProFont, monospace;top:0;right:0;color:#7F7F7F">' + apps[launchtype].dsktpIcon + '</div>' +
                        '<div style="font-size:12px;font-family:aosProFont, monospace;top:0;left:0;color:#7F7F7F">' + launchtype + '</div>' +
                        //'<img src="' + apps[launchtype].appWindow.appImg + '" style="margin-left:calc(50% - 128px);width:256px;height:256px" onerror="this.src=\'appicons/ds/redx.png\'">' +
                        buildSmartIcon(256, apps[launchtype].appWindow.appImg, 'margin-left:calc(50% - 128px);margin-top:16px;') +
                        '<h1 style="text-align:center;">' + apps[launchtype].appDesc + '</h1>' +
                        '<hr>' + (apps[launchtype].vars.appInfo || "There is no help page for this app.")
                    );
                }catch(e){
                    apps.prompt.vars.alert('There was an error generating the information for app ' + launchtype + '.', 'OK', function(){apps.appInfo.signalHandler('close')}, 'App Info Viewer');
                }
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'This app is used to show information and help pages for AaronOS apps.'
        }, 2, 'appInfo', 'appicons/ds/systemApp.png'
    );
    getId('aOSloadingInfo').innerHTML = 'Task Manager...'; 
});
c(function(){
    m('init tMg');
    apps.taskManager = new Application(
        "tMg",
        "Task Manager",
        1,
        function(launchType){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setDims("auto", "auto", 600, 500);
            }
            this.appWindow.setCaption("aOS Task Manager");
            perfStart('tMgPerfBench');
            this.appWindow.setContent(
                "<table id='tMgMemTable'>" +
                "<tr><td>Script Performance Benchmark:</td><td class='liveElement' data-live-eval='perfStart(\"tMgScptBench\");perfCheck(\"tMgScptBench\")'></td></tr>" +
                "<tr><td>Visual Performance Benchmark:</td><td class='liveElement' data-live-eval='[perfCheck(\"tMgPerfBench\"),perfStart(\"tMgPerfBench\")][0]'></td></tr>" +
                //"<tr><td>Memory Available:</td><td id='tMgMemAvailable'>Unvailable - try a different browser</td></tr>" +
                //"<tr><td>aOS Memory Alloted:</td><td id='tMgMemTaken'>Unavailable</td></tr>" +
                //"<tr><td>aOS Memory Active:</td><td id='tMgMemActive'>Unavailable</td></tr>" +
                //"<tr><td>Available Memory Alloted:</td><td><span id='tMgMemUsage'>Unavailable </span>%</td></tr>" +
                //"<tr><td>Alloted Memory In Use:</td><td><span id='tMgMemAlloted'>Unavailable </span>%</td></tr>" +
                "<tr><td>Code Pieces Waiting to Run:</td><td><span id='tMgCodeWait' class='liveElement' data-live-eval='codeToRun.length'>0</span></td></tr>" +
                "<tr><td>Temp Speech Running:</td><td><span id='tMgSpeechRun' class='liveElement' data-live-eval='numtf(apps.nora.vars.contRecogRunning)'>false</span></td></tr>" +
                "<tr><td>Temp Speech Storage:</td><td><span id='tMgSpeechStore' class='liveElement' data-live-eval='apps.nora.vars.currContTrans'></span></td></tr>" +
                "<tr><td>Live Elements Loaded:</td><td><span class='liveElement' data-live-eval='liveElements.length'></span></td></tr>" +
                "</table>" +
                "<p>modulelast, module: <br><span id='tMgModule' style='font-family:monospace' class='liveElement' data-live-eval='modulelast + \"<br>\" + module'>?<br>?</span></p>" +
                "<p>Managed Timers:</p>" +
                "<ul style='font-family:monospace' id='tMgTaskList'></ul>"
            );
            getId('win_taskManager_html').style.overflowY = 'scroll';
            if(this.vars.running.tMg.MemCheck){
                removeInterval("tMg", "MemCheck");
            }
            if(this.vars.running.tMg.TskCheck){
                removeInterval("tMg", "TskCheck");
            }
            //this.vars.updateMem();
            this.vars.updateTsk();
            //this.vars.updateMod();
            //makeInterval("tMg", "MemCheck", "apps.taskManager.vars.updateMem()", 1000);
            makeInterval("tMg", "TskCheck", "apps.taskManager.vars.updateTsk()", 250);
            //makeInterval("tMg", "ModCheck", "apps.taskManager.vars.updateMod()", 500);
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    this.appWindow.alwaysOnTop(1);
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'This is a makeshift Task Manager for aOS. It doesn\'t work that well, and sadly none of the apps actually use it.',
            memInfo: {},
            running: {
                tMg: {}
            },
            drawCpu: 1,
            currTaskStr: "",
            runningLast: {},
            cnv: null,
            ctx: null,
            changed: 0,
            updateMem: function(){
                //getId("tMgCodeWait").innerHTML = codeToRun.length;
                // c(function(){apps.taskManager.vars.memInfo = window.performance.memory;});
                // c(function(){getId("tMgMemAvailable").innerHTML = vartry('apps.taskManager.vars.memInfo.jsHeapSizeLimit') / 1000000 + " MB";});
                // c(function(){getId("tMgMemTaken").innerHTML = vartry('apps.taskManager.vars.memInfo.totalJSHeapSize') / 1000000 + " MB";});
                // c(function(){getId("tMgMemActive").innerHTML = vartry('apps.taskManager.vars.memInfo.usedJSHeapSize') / 1000000 + " MB";});
                // c(function(){getId("tMgMemUsage").innerHTML = Math.round(vartry('apps.taskManager.vars.memInfo.totalJSHeapSize') / vartry('apps.taskManager.vars.memInfo.jsHeapSizeLimit') * 100);});
                // c(function(){getId("tMgMemAlloted").innerHTML = Math.round(vartry('apps.taskManager.vars.memInfo.usedJSHeapSize') / vartry('apps.taskManager.vars.memInfo.totalJSHeapSize') * 100);});
                // c(function(){getId("tMgSpeechStore").innerHTML = apps.nora.vars.currContTrans;});
                // c(function(){getId("tMgSpeechRun").innerHTML = numtf(apps.nora.vars.contRecogRunning);});
            },
            updateTsk: function(){
                if(apps.taskManager.vars.changed){
                    try{getId("tMgTaskList").innerHTML = "<li>APP<ul><li>TaskName | Command | Interval (ms)</li></ul></li>";}catch(err){}
                    for(var apptask in apps.taskManager.vars.running){
                        apps.taskManager.vars.currTaskStr = "<li>" + apptask + "<ul>";
                        for(var apptasking in apps.taskManager.vars.running[apptask]){
                            if(apps.taskManager.vars.running[apptask][apptasking][3] === 't'){
                                apps.taskManager.vars.currTaskStr += "<li style='color:#080' oncontextmenu='ctxMenu([[event.pageX,event.pageY, \"ctxMenu/beta/x.png\"], \" Remove Waiting Task\", \"removeTimeout(`" + apptask + "`,`" + apptasking + "`,1)\"])'>" + apptasking + " | " + apps.taskManager.vars.running[apptask][apptasking][1] + " | " + apps.taskManager.vars.running[apptask][apptasking][2] + "</li>";
                            }else if(apps.taskManager.vars.running[apptask][apptasking][3] === 'i'){
                                apps.taskManager.vars.currTaskStr += "<li style='color:#008' oncontextmenu='ctxMenu([[event.pageX,event.pageY, \"ctxMenu/beta/x.png\"], \" Remove Repeating Task\", \"removeInterval(`" + apptask + "`,`" + apptasking + "`,1)\"])'>" + apptasking + " | " + apps.taskManager.vars.running[apptask][apptasking][1] + " | " + apps.taskManager.vars.running[apptask][apptasking][2] + "</li>";
                            }else{
                                apps.taskManager.vars.currTaskStr += "<li style='color:#800' oncontextmenu='ctxMenu([[event.pageX,event.pageY, \"ctxMenu/beta/sad.png\"], \" Invalid Task\", \"apps.prompt.vars.alert(`This task was incorrectly initiated and is invalid; therefore it cannot be removed.`,`Okay`,function(){},`Task Manager`)\"])'>" + apptasking + " | " + apps.taskManager.vars.running[apptask][apptasking][1] + " | " + apps.taskManager.vars.running[apptask][apptasking][2] + "</li>";
                            }
                        }
                        apps.taskManager.vars.currTaskStr += "</ul></li>";
                        try{getId("tMgTaskList").innerHTML += apps.taskManager.vars.currTaskStr;}catch(err){}
                    }
                    apps.taskManager.vars.runningLast = apps.taskManager.vars.running;
                    apps.taskManager.vars.changed = 0;
                }
            },
            updateMod: function(){
                //getId("tMgModule").innerHTML = [modulelast, module];
            }
        }, 1, "taskManager", "appicons/ds/systemApp.png"
    );
    getId('aOSloadingInfo').innerHTML = 'JavaScript Console';
});
function makeTimeout(appname, taskname, functionname, functiontime){
    if(!apps.taskManager.vars.running[appname]){
        apps.taskManager.vars.running[appname] = {};
    }
    apps.taskManager.vars.running[appname][taskname] = [window.setTimeout(functionname, functiontime), functionname, functiontime, 't'];
    window.setTimeout("apps.taskManager.vars.running['" + appname + "']['" + taskname + "'][2] = 'done';apps.taskManager.vars.changed = 1;", functiontime + 10);
    apps.taskManager.vars.changed = 1;
}
//c(function(){
//makeTimeout("aOS", "TaskbarTime", "showTimeOnTaskbar()", 0);
//});
function makeInterval(appname, taskname, functionname, functiontime){
    if(!apps.taskManager.vars.running[appname]){
        apps.taskManager.vars.running[appname] = {};
    }
    apps.taskManager.vars.running[appname][taskname] = [window.setInterval(functionname, functiontime), functionname, functiontime, 'i'];
    apps.taskManager.vars.changed = 1;
}
function removeTimeout(appname, taskname, cnfrm){
    if(cnfrm){
        apps.prompt.vars.confirm('Are you sure you want to remove ' + appname + '\'s timeout ' + taskname + '? Removing certain functions could cause system instability.', ['No', 'Yes'], function(btn){
            if(btn){
                window.clearTimeout(apps.taskManager.vars.running[appname][taskname][0]);
                delete apps.taskManager.vars.running[appname][taskname];
                apps.taskManager.vars.changed = 1;
            }
        }, 'Task Manager');
    }else{
        window.clearTimeout(apps.taskManager.vars.running[appname][taskname][0]);
        delete apps.taskManager.vars.running[appname][taskname];
        apps.taskManager.vars.changed = 1;
    }
}
function removeInterval(appname, taskname, cnfrm){
    if(cnfrm){
        apps.prompt.vars.confirm('Are you sure you want to remove ' + appname + '\'s interval ' + taskname + '? Removing certain functions could cause system instability.', ['No', 'Yes'], function(btn){
            if(btn){
                window.clearInterval(apps.taskManager.vars.running[appname][taskname][0]);
                delete apps.taskManager.vars.running[appname][taskname];
                apps.taskManager.vars.changed = 1;
            }
        }, 'Task Manager');
    }else{
        window.clearInterval(apps.taskManager.vars.running[appname][taskname][0]);
        delete apps.taskManager.vars.running[appname][taskname];
        apps.taskManager.vars.changed = 1;
    }
}
var currentSelection = "";
function setCurrentSelection(){
    currentSelection = window.getSelection().toString();
    requestAnimationFrame(setCurrentSelection);
}
requestAnimationFrame(setCurrentSelection);
c(function(){
    m('init jsC');
    apps.jsConsole = new Application(
        "jsC",
        "JavaScript Console",
        1,
        function(launchType){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setDims("auto", "auto", 1000, 500);
            }
            this.appWindow.setCaption(lang('jsConsole', 'caption'));
            this.appWindow.setContent(
                '<div id="cnsTrgt" style="width:100%; height:calc(100% - 18px); font-family:aosProFont,Courier,monospace; font-size:12px; top:0px; left:0px; overflow:scroll"></div>' +
                '<input id="cnsIn" onKeydown="if(event.keyCode === 13){apps.jsConsole.vars.runInput()}" placeholder="' + lang('jsConsole', 'input') + '" style="position:absolute; bottom:0px; font-family:aosProFont,Courier,monospace;display:block; padding:0; font-size:12px; width:90%; left:0px; height:16px;">' +
                '<button id="cnsB"onClick="apps.jsConsole.vars.runInput()" style="font-size:12px; position:absolute; display:block; width:10%; height:18px; bottom:0px; right:0px;">' + lang('jsConsole', 'runCode') + '</button>'
            );
            this.appWindow.openWindow();
            getId("cnsTrgt").innerHTML = '<span style="color:' + this.vars.cnsPosts[1] + ';">' + this.vars.cnsPosts[0] + '</span>';
            for(var j = 2; j < this.vars.cnsPosts.length; j+= 2){
                getId("cnsTrgt").innerHTML += '<br><span style="color:' + this.vars.cnsPosts[j + 1] + ';">' + this.vars.cnsPosts[j] + '</span>';
            }
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'This is a JavaScript console for quick debugging without having to open DevTools. It also has extra features like colored text and HTML formatting support.',
            cnsPosts: [
                "JavaScript Console initialized.", '#D60',
                '', '#7F7F7F',
                'Source Code Line of the Day: ' + lineOfTheDay[0], '#7F7F7F',
                cleanStr(lineOfTheDay[1].trim()), '#7F7F7F',
                '', '#7F7F7F',
                'Took ' + timeToPageLoad + 'ms to fetch primary script.', ''
            ],
            lastInputUsed: 'jsConsoleHasNotBeenUsed',
            makeLog: function(logStr, logClr){
                c(function(arg){
                    try{
                        apps.extDebug.vars.externalWindow.document.getElementById('screen').innerHTML += '<br>&nbsp;&nbsp;' + arg;
                    }catch(err){}
                }, logStr);
                this.cnsPosts.push(logStr);
                this.cnsPosts.push(logClr);
                try{
                    getId("cnsTrgt").innerHTML += '<br><span style="color:' + logClr + ';">' + logStr + '</span>';
                    getId("cnsTrgt").scrollTop = getId("cnsTrgt").scrollHeight;
                }catch(err){
                    // jsconsole window is not open
                }
            },
            runInput: function(){
                m('Running jsC Input');
                d(1, 'Running jsC input');
                this.lastInputUsed = getId("cnsIn").value;
                doLog("-> " + cleanStr(getId("cnsIn").value), "#0A0");
                try{
                    this.tempOutput = eval(getId("cnsIn").value);
                    doLog("=> " + this.tempOutput, "#0AA");
                    doLog("?> " + typeof this.tempOutput, "#0AA");
                }catch(err){
                    doLog("=> " + err, "#F00");
                    doLog("?> Module: " + module, "#F00");
                }
            }
        }, 0, "jsConsole", {
            backgroundColor: "#303947",
            foreground: "smarticons/jsConsole/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    apps.jsConsole.main();
    requestAnimationFrame(function(){
    apps.jsConsole.signalHandler("close");
    });
    doLog = function(msg, clr){
        console.log('%c' + msg, 'color:' + clr);
        apps.jsConsole.vars.makeLog(msg, clr);
    };
    debugArray = function(arrayPath, recursive, layer){
        var debugArraySize = 0;
        for(var i in eval(arrayPath)){
            doLog("<br>[" + (layer || 0) + "]" + arrayPath + "." + i + ": " + apps.webAppMaker.vars.sanitize(eval(arrayPath)[i]), "#55F");
            if(typeof eval(arrayPath)[i] === "object" && recursive){
                debugArray(eval(arrayPath)[i], 0, (layer || 0) + 1)
            }
            debugArraySize++;
        }
        return "Length: " + debugArraySize;
    }
    getId('aOSloadingInfo').innerHTML = 'Bash Console';
});
c(function(){
    apps.bash = new Application(
        'sh',
        'Psuedo-Bash Terminal',
        0,
        function(){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setCaption(lang('appNames', 'bash'));
                this.appWindow.setDims("auto", "auto", 662, 504);
                this.appWindow.setContent(
                    '<span id="bashContent" style="display:block;line-height:1em;font-family:aosProFont;font-size:12px;width:100%;">This terminal is a work-in-progress. Some features are incomplete.</span>' +
                    '<input id="bashInput" onkeydown="apps.bash.vars.checkPrefix()" onkeypress="apps.bash.vars.checkPrefix()" onkeyup="apps.bash.vars.checkPrefix();if(event.keyCode === 13){apps.bash.vars.execute()}" style="background:none;color:inherit;box-shadow:none;display:block;line-height:1em;font-family:aosProFont;font-size:12px;border:none;outline:none;padding:0;width:100%;">'
                );
                this.vars.checkPrefix();
                getId('win_bash_html').style.overflowY = 'scroll';
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    this.vars.prefix = '[' + SRVRKEYWORD.substring(0, 4) + '@aOS bash]$ ';
                    this.vars.pastValue = '[' + SRVRKEYWORD.substring(0, 4) + '@aOS bash]$ ';
                    
                    if(ufload("aos_system/apps/bash/alias")){
                        this.vars.alias = JSON.parse(ufload("aos_system/apps/bash/alias"));
                    }
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'This app is intended to imitate a Linux Bash Terminal, but is written completely in JavaScript. Type "help" for available commands and usage.',
            prefix: '[user@aOS bash]$ ',
            pastValue: '[user@aOS bash]$ ',
            command: '',
            workdir: '/apps/bash',
            workdirorig: '',
            workdirtemp: [],
            workdirtrans: 'window.apps.bash',
            workdirfinal: 'window.apps.bash',
            workdirprev: 'window.apps.bash',
            workdirdepth: 0,
            translateDir: function(origworkdir){
                this.workdirorig = origworkdir;

                //this.workdirtrans = this.workdirorig.split('\\').join('/');
                this.workdirtrans = this.workdirorig;

                this.workdirdepth = 0;
                if(this.workdirorig[0] === '/'){
                    this.workdirfinal = "window";
                    //this.workdirdepth = 1;
                }else{
                    this.workdirfinal = 'window';
                    this.workdirtrans = this.workdir + '/' + this.workdirtrans;
                }
                this.workdirtemp = this.workdirtrans.split('/');
                var cleanEscapeRun = 0;
                while(!cleanEscapeRun){
                    cleanEscapeRun = 1;
                    for(var i = 0; i < this.workdirtemp.length - 1; i++){
                        if(this.workdirtemp[i][this.workdirtemp[i].length - 1] === '\\'){
                            this.workdirtemp.splice(i, 2, this.workdirtemp[i].substring(0, this.workdirtemp[i].length - 1) + '/' + this.workdirtemp[i + 1]);
                            cleanEscapeRun = 0;
                            break;
                        }
                    }
                    if(cleanEscapeRun && this.workdirtemp.length > 0){
                        if(this.workdirtemp[this.workdirtemp.length - 1][this.workdirtemp[this.workdirtemp.length - 1].length - 1] === '\\'){
                            this.workdirtemp.splice(i, 1, this.workdirtemp[this.workdirtemp.length - 1].substring(0, this.workdirtemp[this.workdirtemp.length - 1].length - 1) + '/');
                            cleanEscapeRun = 0;
                        }
                    }
                }
                while(this.workdirdepth < this.workdirtemp.length){
                    if(this.workdirtemp[this.workdirdepth] !== ''){
                        if(this.workdirtemp[this.workdirdepth] === '..'){
                            if(this.workdirfinal.length === 0){
                                this.workdirfinal = "/";
                            }else if(this.workdirfinal[this.workdirfinal.length - 1] === "]"){
                                this.workdirfinal = this.workdirfinal.split("['");
                                this.workdirfinal.pop();
                                this.workdirfinal = this.workdirfinal.join(".");
                            }else{
                                this.workdirfinal = this.workdirfinal.split(".");
                                this.workdirfinal.pop();
                                this.workdirfinal = this.workdirfinal.join(".");
                            }
                            if(this.workdirfinal.length === 0){
                                this.workdirfinal = "/";
                            }
                            //this.workdirdepth++;
                        }else{
                            if(
                                isNaN(parseInt(this.workdirtemp[this.workdirdepth], 10)) &&
                                this.workdirtemp[this.workdirdepth].indexOf('=') === -1 &&
                                this.workdirtemp[this.workdirdepth].indexOf(' ') === -1 &&
                                this.workdirtemp[this.workdirdepth].indexOf(';') === -1 &&
                                this.workdirtemp[this.workdirdepth].indexOf('.') === -1 &&
                                this.workdirtemp[this.workdirdepth].indexOf(',') === -1 &&
                                this.workdirtemp[this.workdirdepth].indexOf('/') === -1
                            ){
                                try{
                                    new Function(this.workdirtemp[this.workdirdepth], 'var ' + this.workdirtemp[this.workdirdepth]);
                                    this.workdirfinal += "." + this.workdirtemp[this.workdirdepth];
                                }catch(err){
                                    console.log("oof")
                                    this.workdirfinal += "['" + this.workdirtemp[this.workdirdepth] + "']";
                                }
                            }else{
                                this.workdirfinal += "['" + this.workdirtemp[this.workdirdepth] + "']";
                            }
                        }
                        
                        /*else if(isNaN(parseInt(this.workdirtemp[this.workdirdepth], 10))){
                            this.workdirfinal += "." + this.workdirtemp[this.workdirdepth];
                        }else{
                            this.workdirfinal += "['" + this.workdirtemp[this.workdirdepth] + "']";
                        }
                        */
                    }
                    this.workdirdepth++;
                }
                return this.workdirfinal;
            },
            getRealDir: function(origdir){
                return eval(this.translateDir(origdir));
            },
            alias: {},
            checkPrefix: function(){
                if(getId('bashInput').value.indexOf(this.prefix) !== 0){
                    getId('bashInput').value = this.pastValue;
                }
                this.pastValue = getId('bashInput').value;
            },
            echo: function(message){
                if(this.piping){
                    this.pipeOut += '<br>' + String(message);
                }else{
                    try{
                        getId('bashContent').innerHTML += '<br>' + cleanStr(String(message)).split('  ').join(' &nbsp;').split('\n').join('<br>') + '&nbsp;';
                        getId('win_bash_html').scrollTop = getId('win_bash_html').scrollHeight;
                    }catch(err){
                        // the window is not open and cannot recieve the echo
                    }
                }
            },
            piping: 0,
            commandPipeline: 0,
            pipeOut: '',
            getAlias: function(search, doSearch){
                if(doSearch){
                    var found = -1;
                    for(var item in this.alias){
                        if(item === search){
                            found = item;
                            return this.getCmdObjects(this.alias[item]);
                        }
                    }
                    return [search];
                }else{
                    return [search];
                }
            },
            getCmdObjects: function(command, alias){
                var cmdObjects = [];
                    
                // doublequotes
                var i = 0;
                // singlequotes
                var j = 0;
                // spaces
                var s = 0;
                // current cursor
                var curr = 0;
                // end of potential quote sequence
                var next = 0;
                // previous cursor
                var prev = 0;
                while(prev < command.length) {
                    i = command.indexOf('"', prev);
                    j = command.indexOf("'", prev);
                    s = command.indexOf(' ', prev);
                    
                    // if no quotes or spaces found
                    if(i === -1 && j === -1 && s === -1){
                        // add remainder of string to commands list
                        var postAlias = this.getAlias(command.substring(prev, command.length), alias);
                        for(var l in postAlias){
                            cmdObjects.push(postAlias[l]);
                        }
                        // quit
                        break;
                    }
                    
                    // if space found and comes before quotes or there are no quotes
                    if(s !== -1 && (s < i || i === -1) && (s < j || j === -1)){
                        // if space is not current character
                        if(s !== prev){
                            // push this "word" to object list
                            var postAlias = this.getAlias(command.substring(prev, s), alias);
                            for(var l in postAlias){
                                cmdObjects.push(postAlias[l]);
                            }
                        }
                        prev = s + 1;
                    }else{
                        // if both types of quotes are found
                        if(i !== -1 && j !== -1){
                            // place cursor at closest quote
                            curr = Math.min(i, j);
                        // else if doublequotes are found
                        }else if(i !== -1){
                            // place cursor at doublequote
                            curr = i;
                        // else if singlequotes are found
                        }else if(j !== -1){
                            // place cursor at singlequote
                            curr = j;
                        }
                        // if there is a character between previous "word" and this bit
                        if(curr !== prev){
                            // add the preceding "word" to object list
                            var postAlias = this.getAlias(command.substring(prev, curr), alias);
                            for(var l in postAlias){
                                cmdObjects.push(postAlias[l]);
                            }
                        }
                        // try to find end of quotes
                        var tempCurr = curr;
                        tempCurr = command.indexOf(command[curr], tempCurr + 1);
                        while(command[tempCurr - 1] === "\\"){
                            command = command.substring(0, tempCurr - 1) + command.substring(tempCurr, command.length);
                            tempCurr = command.indexOf(command[curr], tempCurr);
                            if(tempCurr === -1){
                                break;
                            }
                        }
                        var next = tempCurr;
                        // if no end is found, assume it's at the end of the string
                        if(next === -1){
                            // add the remainder of the string to command objects
                            cmdObjects.push(command.substring(curr + 1, command.length));
                            // break loop
                            break;
                        }else{
                            // add this quotation to list
                            cmdObjects.push(command.substring(curr + 1, next));
                            prev = next + 1;
                        }
                    }
                }
                return cmdObjects;
            },
            execute: function(cmd, silent){
                if(cmd){
                    this.command = cmd;
                    if(silent){
                        var temporaryBashWorkDir = this.workdir;
                        if(arguments.callee.caller === window.sh){
                            if(typeof arguments.callee.caller.caller.__bashworkdir === "string"){
                                this.workdir = arguments.callee.caller.caller.__bashworkdir;
                            }else{
                                arguments.callee.caller.caller.__bashworkdir = "/";
                                this.workdir = "/";
                            }
                        }else{
                            if(typeof arguments.callee.caller.__bashworkdir === "string"){
                                this.workdir = arguments.callee.caller.__bashworkdir;
                            }else{
                                arguments.callee.caller.__bashworkdir = "/";
                                this.workdir = "/";
                            }
                        }
                    }else{
                        this.echo('[aOS]$ ' + cleanStr(cmd));
                    }
                    var commandObjects = this.getCmdObjects(this.command);
                }else{
                    this.command = getId('bashInput').value.substring(getId('bashInput').value.indexOf('$') + 2, getId('bashInput').value.length);
                    this.echo(cleanStr(getId('bashInput').value));
                    getId('bashInput').value = this.prefix;
                    this.pastValue = this.prefix;
                    var commandObjects = this.getCmdObjects(this.command, 1);
                }
                if(this.command.length !== 0){
                    var pipeGroups = [];
                    if(commandObjects.indexOf('|') !== -1){
                        for(var i = 0; commandObjects.indexOf('|', i) !== -1; i = commandObjects.indexOf('|', i) + 1){
                            var pipeGroup = [];
                            for(var j = i; j < commandObjects.indexOf('|', i); j++){
                                pipeGroup.push(commandObjects[j]);
                            }
                            pipeGroups.push(pipeGroup);
                        }
                        var pipeGroup = [];
                        for(var j = commandObjects.lastIndexOf('|') + 1; j < commandObjects.length; j++){
                            pipeGroup.push(commandObjects[j]);
                        }
                        pipeGroups.push(pipeGroup);
                    }else{
                        pipeGroups.push(commandObjects);
                    }
                    
                    var cmdResult = "";
                    for(var i = 0; i < pipeGroups.length; i++){
                        var currCmd = pipeGroups[i].shift();
                        var cmdID = -1;
                        for(var j = 0; j < this.commands.length; j++){
                            if(this.commands[j].name === currCmd){
                                cmdID = j;
                                break;
                            }
                        }
                        if(cmdID !== -1){
                            try{
                                cmdResult = this.commands[cmdID].action(pipeGroups[i]);
                            }catch(err){
                                this.echo(currCmd + ': ' + err);
                                break;
                            }
                            if(cmdResult){
                                if(i !== pipeGroups.length - 1){
                                    pipeGroups[i + 1].push(cmdResult);
                                }
                            }
                        }else{
                            this.echo(currCmd + ": command not found");
                            break;
                        }
                    }
                    if(cmdResult && !cmd){
                        this.echo(cmdResult);
                    }else if(cmd){
                        if(silent){
                            if(arguments.callee.caller === window.sh){
                                arguments.callee.caller.caller.__bashworkdir = this.workdir;
                            }else{
                                arguments.callee.caller.__bashworkdir = this.workdir;
                            }
                            this.workdir = temporaryBashWorkDir;
                        }
                        return cmdResult
                    }
                }
            },
            currHelpSearch: '',
            commands: [
                {
                    name: 'help',
                    usage: 'help [command]',
                    desc: 'Prints the usage and help doc for a command.',
                    action: function(args){
                        apps.bash.vars.currHelpSearch = args.join(" ");
                        this.vars.foundCmds = apps.bash.vars.commands.filter(function(i){
                            return apps.bash.vars.currHelpSearch.indexOf(i.name) > -1 || i.name.indexOf(apps.bash.vars.currHelpSearch) > -1;
                        });
                        var str = "";
                        for(var i in this.vars.foundCmds){
                            str += '\n\n' + this.vars.foundCmds[i].name + ': ' + this.vars.foundCmds[i].usage;
                            str += '\n' + this.vars.foundCmds[i].desc;
                        }
                        return str.substring(2, str.length);
                    },
                    vars: {
                        foundCmds: []
                    }
                },
                {
                    name: 'echo',
                    usage: 'echo [message]',
                    desc: 'Prints message to console.',
                    action: function(args){
                        str = args.join(" ");
                        return str;
                    }
                },
                {
                    name: 'alias',
                    usage: 'alias [shorthand]="[definition]"',
                    desc: 'Creates a persistent alias for the user. Make sure to use quotes if there are spaces or quotes in your definition!',
                    action: function(args){
                        if(args.length > 0){
                            if((args[0].length > 0 && args[1] === "=") || args[0].length > 1){
                                if(args[0].indexOf('=') === args[0].length - 1){
                                    var shifted = args.shift();
                                    apps.bash.vars.alias[shifted.substring(0, shifted.length - 1)] = args.join(" ");
                                }else if(args[1] === "="){
                                    var shifted = args.shift();
                                    args.shift();
                                    apps.bash.vars.alias[shifted] = args.join(" ");
                                }else{
                                    throw "AliasError: The alias command appears to be malformed. Make sure your alias is only one word and the = is in the correct place.";
                                }
                            }else{
                                throw "AliasError: The alias command appears to be malformed. Make sure your alias is only one word and the = is in the correct place.";
                            }
                            ufsave('aos_system/apps/bash/alias', JSON.stringify(apps.bash.vars.alias));
                        }else{
                            var str = "";
                            for(var i in apps.bash.vars.alias){
                                str += '\n' + i + " = " + apps.bash.vars.alias[i];
                            }
                            return str.substring(1, str.length);
                        }
                    },
                    vars: {
                        
                    }
                },
                {
                    name: 'js',
                    usage: 'js [code]',
                    desc: 'Run JavaScript code and echo the returned value',
                    action: function(args){
                        return eval(args.join(" "));
                    }
                },
                {
                    name: 'pwd',
                    usage: 'pwd [-J]',
                    desc: 'Prints the current working directory. If -J is specified, also prints the JavaScript-equivalent directory.',
                    action: function(args){
                        if(args.length > 0){
                            if(args[0].toLowerCase() === '-j'){
                                return 'shdir: ' + apps.bash.vars.workdir + '\n' +
                                    'jsdir: ' + apps.bash.vars.translateDir(apps.bash.vars.workdir);
                            }else{
                                return apps.bash.vars.workdir;
                            }
                        }else{
                            return apps.bash.vars.workdir;
                        }
                    },
                    vars: {
                        
                    }
                },
                {
                    name: 'cd',
                    usage: 'cd [dirname]',
                    desc: 'Move working directory to specified directory.',
                    action: function(args){
                        if(args.length > 0){
                            this.vars.prevworkdir = apps.bash.vars.workdir;
                            try{
                                this.vars.tempadd = args[0].split('/');
                                console.log("tempadd");
                                console.log(this.vars.tempadd);
                                var cleanEscapeRun = 0;
                                while(!cleanEscapeRun){
                                    cleanEscapeRun = 1;
                                    for(var i = 0; i < this.vars.tempadd.length - 1; i++){
                                        if(this.vars.tempadd[i][this.vars.tempadd[i].length - 1] === '\\'){
                                            this.vars.tempadd.splice(i, 2, this.vars.tempadd[i].substring(0, this.vars.tempadd[i].length) + '/' + this.vars.tempadd[i + 1]);
                                            cleanEscapeRun = 0;
                                            break;
                                        }
                                    }
                                    if(cleanEscapeRun && this.vars.tempadd.length > 0){
                                        if(this.vars.tempadd[this.vars.tempadd.length - 1][this.vars.tempadd[this.vars.tempadd.length - 1].length - 1] === '\\'){
                                            this.vars.tempadd.splice(i, 1, this.vars.tempadd[this.vars.tempadd.length - 1].substring(0, this.vars.tempadd[this.vars.tempadd.length - 1].length) + '/');
                                            cleanEscapeRun = 0;
                                        }
                                    }
                                }
                                console.log(this.vars.tempadd);
                                this.vars.tempstart = (apps.bash.vars.workdir[0] === '/');
                                if(args[0][0] === '/' || apps.bash.vars.workdir === '/'){
                                    this.vars.tempdir = [];
                                    this.vars.tempstart = 1;
                                }else{
                                    this.vars.tempdir = apps.bash.vars.workdir.split('/');
                                }
                                console.log("tempdir");
                                console.log(this.vars.tempdir);
                                cleanEscapeRun = 0;
                                while(!cleanEscapeRun){
                                    cleanEscapeRun = 1;
                                    for(var i = 0; i < this.vars.tempdir.length - 1; i++){
                                        if(this.vars.tempdir[i][this.vars.tempdir[i].length - 1] === '\\'){
                                            this.vars.tempdir.splice(i, 2, this.vars.tempdir[i].substring(0, this.vars.tempdir[i].length) + '/' + this.vars.tempdir[i + 1]);
                                            cleanEscapeRun = 0;
                                            break;
                                        }
                                    }
                                    if(cleanEscapeRun && this.vars.tempdir.length > 0){
                                        if(this.vars.tempdir[this.vars.tempdir.length - 1][this.vars.tempdir[this.vars.tempdir.length - 1].length - 1] === '\\'){
                                            this.vars.tempdir.splice(i, 1, this.vars.tempdir[this.vars.tempdir.length - 1].substring(0, this.vars.tempdir[this.vars.tempdir.length - 1].length) + '/');
                                            cleanEscapeRun = 0;
                                        }
                                    }
                                }
                                console.log(this.vars.tempdir);
                                for(var i in this.vars.tempadd){
                                    if(this.vars.tempadd[i] === '..'){
                                        this.vars.tempdir.pop();
                                    }else{
                                        this.vars.tempdir.push(this.vars.tempadd[i]);
                                    }
                                }
                                if(this.vars.tempdir.length > 0){
                                    var lastTempAdd = this.vars.tempdir[this.vars.tempdir.length - 1];
                                }else{
                                    var lastTempAdd = '/';
                                }
                                this.vars.temppath = this.vars.tempdir.join('/');
                                if(this.vars.tempstart && this.vars.temppath[0] !== '/'){
                                    this.vars.temppath = '/' + this.vars.temppath;
                                }
                                this.vars.temppath = this.vars.temppath.split('//').join('/');
                                apps.bash.vars.workdir = this.vars.temppath;
                                if(apps.bash.vars.getRealDir('') === undefined){
                                    var badworkdir = apps.bash.vars.workdir;
                                    apps.bash.vars.workdir = this.vars.prevworkdir;
                                    throw "" + badworkdir + ': No such file or directory';
                                }else if(typeof apps.bash.vars.getRealDir('') !== 'object'){
                                    var badworkdir = apps.bash.vars.workdir;
                                    apps.bash.vars.workdir = this.vars.prevworkdir;
                                    throw "" + badworkdir + ': Not a directory';
                                }
                                //apps.bash.vars.echo(this.vars.temppath);
                                if(apps.bash.vars.workdir === '/'){
                                    apps.bash.vars.prefix = '[' + SRVRKEYWORD.substring(0, 4) + '@aOS /]$ ';
                                }else{
                                    //apps.bash.vars.prefix = '[' + SRVRKEYWORD + '@aOS ' + apps.bash.vars.workdir.split('/')[apps.bash.vars.workdir.split('/').length - 1] + ']$ ';
                                    apps.bash.vars.prefix = '[' + SRVRKEYWORD.substring(0, 4) + '@aOS ' + lastTempAdd + ']$ ';
                                }
                                apps.bash.vars.pastValue = apps.bash.vars.prefix;
                                getId('bashInput').value = apps.bash.vars.prefix;
                            }catch(err){
                                apps.bash.vars.workdir = this.vars.prevworkdir;
                                throw err;
                            }
                        }
                    },
                    vars: {
                        temppath: '',
                        prevworkdir: '',
                        tempstart: 0,
                        tempadd: [],
                        tempdir: []
                    }
                },
                {
                    name: 'grep',
                    usage: 'grep [needle] ',
                    desc: 'List lines of a source that contain a target string.',
                    action: function(args){
                        this.vars.target = args.shift();
                        this.vars.lines = args.join("\n").split('\n');
                        this.vars.out = '';
                        for(var i in this.vars.lines){
                            if(this.vars.lines[i].toLowerCase().indexOf(this.vars.target.toLowerCase()) > -1){
                                this.vars.out += '\n' + this.vars.lines[i];
                            }
                        }
                        return this.vars.out.substring(1, this.vars.out.length);
                    },
                    vars: {
                        target: '',
                        lines: [],
                        out: ''
                    }
                },
                {
                    name: 'ls',
                    usage: 'ls [-R] [dirname]',
                    desc: 'List files in a directory.<br>-R prints subdirectories up to 1 layer deep<br>If no directory is provided, current directory is used.<br>WARNING: -s can be dangerous in large directories like /',
                    action: function(args){
                        //if(apps.bash.vars.translateDir(args) !== 'window'){
                        if(args.length > 0){
                            if(args[0] === "-R"){
                                try{
                                    this.vars.selectedDir = apps.bash.vars.getRealDir(args[1]);
                                }catch(err){
                                    this.vars.selectedDir = apps.bash.vars.getRealDir('');
                                }
                                this.vars.printSub = 1;
                            }else{
                                this.vars.selectedDir = apps.bash.vars.getRealDir(args[0]);
                                this.vars.printSub = 0;
                            }
                        }else{
                            this.vars.selectedDir = apps.bash.vars.getRealDir('');
                            this.vars.printSub = 0;
                        }
                        // apps.bash.vars.echo('Contents of directory ' + args);
                        var dirSize = 0;
                        var printBuffer = "";
                        if(typeof this.vars.selectedDir){
                            if(typeof this.vars.selectedDir === 'object'){
                                for(var item in this.vars.selectedDir){
                                    dirSize++;
                                    if(dirSize > 1){
                                        printBuffer += '\n' + item.split('/').join('\\/');
                                    }else{
                                        printBuffer += item.split('/').join('\\/');
                                    }
                                    if(typeof this.vars.selectedDir[item] === 'object'){
                                        printBuffer += '/';
                                        if(this.vars.printSub){
                                            for(var subitem in this.vars.selectedDir[item]){
                                                printBuffer += '\n' + item.split('/').join('\\/') + '/' + subitem.split('/').join('\\/');
                                                if(typeof this.vars.selectedDir[item][subitem] === 'object'){
                                                    printBuffer += '/';
                                                }
                                            }
                                        }
                                    }
                                }
                            }else{
                                throw args.join(' ') + ': Not a directory';
                            }
                        }else{
                            throw 'Cannot access ' + args.join(' ') + ': No such file or directory';
                        }
                        //this.vars.printBuffer += '<br>Size of directory: ' + dirSize + ' items';
                        return printBuffer;
                        //}else{
                        //    apps.bash.vars.echo('Warning - root directory "/" cannot be scanned.');
                        //}
                    },
                    vars: {
                        printSub: 0,
                        selectedDir: {}
                    }
                },
                {
                    name: 'mv',
                    usage: 'mv [path] [newpath]',
                    desc: 'Moves a file or directory to a new path.',
                    action: function(args){
                        if(args.length > 1){
                            this.vars.currSet = [args[0], args[1]];
                            eval(apps.bash.vars.translateDir(this.vars.currSet[1]) + '=' + apps.bash.vars.translateDir(this.vars.currSet[0]));
                            eval('delete ' + apps.bash.vars.translateDir(currSet[0]));
                        }else{
                            throw "Missing a file, must specify two";
                        }
                    },
                    vars: {
                        currSet: [],
                        currItem: {}
                    }
                },
                {
                    name: 'cp',
                    usage: 'cp [path] [newpath]',
                    desc: 'Copies a file or directory to a new path.',
                    action: function(args){
                        if(args.length > 1){
                            this.vars.currSet = [args[0], args[1]];
                            eval(apps.bash.vars.translateDir(this.vars.currSet[1]) + '=' + apps.bash.vars.translateDir(this.vars.currSet[0]));
                        }else{
                            throw "Missing a file, must specify two";
                        }
                    },
                    vars: {
                        currSet: [],
                        currItem: {}
                    }
                },
                {
                    name: 'rm',
                    usage: 'rm [file]...',
                    desc: 'Deletes files.',
                    action: function(args){
                        if(args.length > 0){
                            for(var i in args){
                                if(typeof apps.bash.vars.getRealDir(args[i]) !== 'object'){
                                    eval('delete ' + apps.bash.vars.translateDir(args[i]));
                                }else{
                                    throw 'Cannot delete ' + args[i] + ': is a directory';
                                }
                            }
                        }else{
                            throw 'No files provided';
                        }
                    }
                },
                {
                    name: 'rmdir',
                    usage: 'rmdir [directory]',
                    desc: 'Deletes a file or directory.',
                    action: function(args){
                        if(args.length > 0){
                            for(var i in args){
                                if(typeof apps.bash.vars.getRealDir(args[i]) === 'object'){
                                    eval('delete ' + apps.bash.vars.translateDir(args[i]));
                                }else{
                                    throw 'Cannot delete ' + args[i] + ': is not a directory';
                                }
                            }
                        }else{
                            throw 'No files provided';
                        }
                    }
                },
                {
                    name: 'touch',
                    usage: 'touch [file]...',
                    desc: 'Creates empty files',
                    action: function(args){
                        if(args.length > 0){
                            for(var i in args){
                                if(!apps.bash.vars.getRealDir(args[i])){
                                    eval(apps.bash.vars.translateDir(args[i]) + '=""');
                                }else{
                                    throw 'Cannot create ' + args[i] + ': already exists';
                                }
                            }
                        }else{
                            throw 'No files provided';
                        }
                        if(!eval(apps.bash.vars.translateDir(args))){
                            eval(apps.bash.vars.translateDir(args) + '= ""');
                        }
                    }
                },
                {
                    name: 'clear',
                    usage: 'clear',
                    desc: 'Clears the console screen.',
                    action: function(args){
                        getId('bashContent').innerHTML = '';
                    }
                },
                {
                    name: 'mkdir',
                    usage: 'mkdir [directory]...',
                    desc: 'Creates blank directories.',
                    action: function(args){
                        if(args.length > 0){
                            for(var item in args){
                                this.vars.first = 1;
                                this.vars.stack = args[item].split('/');
                                for(var i in this.vars.stack){
                                    if(this.vars.first){
                                        this.vars.trace = this.vars.stack[i];
                                        this.vars.first = 0;
                                    }else{
                                        this.vars.trace += '/' + this.vars.stack[i];
                                    }
                                    if(typeof apps.bash.vars.getRealDir(this.vars.trace) !== 'object'){
                                        if(apps.bash.vars.getRealDir(this.vars.trace) === undefined){
                                            eval(apps.bash.vars.translateDir(this.vars.trace) + ' = {}');
                                        }else{
                                            //throw 'Failed to create ' + args[item] + ": " + this.vars.trace + ' already exists';
                                        }
                                    }
                                }
                            }
                        }else{
                            throw 'No names given';
                        }
                    },
                    vars: {
                        first: 1,
                        trace: '',
                        stack: []
                    }
                },
                {
                    name: 'sudo',
                    usage: 'sudo [command]',
                    desc: 'obselete function to run command as root; all users already root but the function still works',
                    action: function(args){
                        return apps.bash.vars.execute(args.join(' '));
                    }
                },
                {
                    name: 'su',
                    usage: 'su',
                    desc: 'Obselete function to go root; does not work on aOS because all users are root',
                    action: function(args){
                        
                    }
                },
                {
                    name: 'cat',
                    usage: 'cat &lt;file&gt;',
                    desc: 'Get the contents of a file, as it appears to JavaScript.',
                    action: function(args){
                        if(args.length > 0){
                            if(typeof apps.bash.vars.getRealDir(args[0]) !== "undefined"){
                                return apps.bash.vars.getRealDir(args[0]);
                            }else{
                                throw args[0] + ': No such file or directory';
                            }
                        }else{
                            throw 'No file provided';
                        }
                    }
                },
                {
                    name: 'fortune',
                    usage: 'fortune',
                    desc: 'Displays a fortune for you!',
                    action: function(args){
                        var rand = Math.floor(Math.random() * this.vars.fortunes.length);
                        return this.vars.fortunes[rand];
                    },
                    vars: {
                        fortunes: [
                            'Test Fortune 1',
                            'Test Fortune 2',
                            'Test Fortune 3'
                        ]
                    }
                },
                {
                    name: 'exit',
                    usage: 'exit',
                    desc: 'Exits the bash console.',
                    action: function(args){
                        if(apps.bash.appWindow.appIcon){
                            apps.bash.signalHandler('close');
                        }
                    }
                },
                {
                    name: 'repo',
                    usage: 'repo {install [repo.]pkg | remove [repo.]pkg | update | upgrade | add-repo repo | remove-repo repo | search [query | repo | repo.query] | list | list-all | list-updates}',
                    desc: 'Manage the installed app repositories and packages.\n\n',
                    action: function(args){
                        if(args.length > 0){
                            var currentAction = args.shift();
                            args = args.join(' ');
                            switch(currentAction){
                                case 'install':
                                    var result = repoAddPackage(args.trim(), apps.bash.vars.echo);
                                    if(typeof result !== 'boolean'){
                                        return result;
                                    }
                                    break;
                                case 'remove':
                                    var result = repoRemovePackage(args.trim(), apps.bash.vars.echo);
                                    if(typeof result !== 'boolean'){
                                        return result;
                                    }
                                    break;
                                case 'update':
                                    var result = repoUpdate(apps.bash.vars.echo);
                                    if(typeof result !== 'boolean'){
                                        return result;
                                    }
                                    break;
                                case 'upgrade':
                                    var result = repoUpgrade(apps.bash.vars.echo);
                                    if(typeof result !== 'boolean'){
                                        return result;
                                    }
                                    break;
                                case 'search':
                                    var result = repoPackageSearch(args.trim());
                                    if(typeof result !== 'boolean'){
                                        this.vars.batchEcho(result);
                                    }
                                    break;
                                case 'add-repo':
                                    var result = repoAddRepository(args.trim(), apps.bash.vars.echo);
                                    if(typeof result !== 'boolean'){
                                        return result;
                                    }
                                    break;
                                case 'remove-repo':
                                    var result = repoRemoveRepository(args.trim(), apps.bash.vars.echo);
                                    if(typeof result !== 'boolean'){
                                        return result;
                                    }
                                    break;
                                case 'list-all':
                                    var result = repoListAll();
                                    if(typeof result !== 'boolean'){
                                        this.vars.batchEcho(result);
                                    }
                                    break;
                                case 'list':
                                    var result = repoListInstalled();
                                    if(typeof result !== 'boolean'){
                                        this.vars.batchEcho(result);
                                    }
                                    break;
                                case 'list-updates':
                                    var result = repoGetUpgradeable();
                                    if(typeof result !== 'boolean'){
                                        this.vars.batchEcho(result);
                                    }
                                    break;
                                default:
                                    throw currentAction + ' is not a recognized repo command.';
                            }
                        }else{
                            throw 'No arguments provided.';
                        }
                    },
                    vars: {
                        batchEcho: function(arr){
                            apps.bash.vars.echo(arr.join('\n'));
                        }
                    }
                }
            ]
        }, 1, 'bash', {
            backgroundColor: "#303947",
            foreground: "smarticons/bash/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    window.sh = function(input){
        return apps.bash.vars.execute(input, 1);
    }
    getId('aOSloadingInfo').innerHTML = 'CPU Monitor';
});
c(function(){
    apps.cpuMon = new Application(
        'CPU',
        'CPU Monitor',
        0,
        function(){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setCaption("CPU");
                this.appWindow.setContent("<canvas id='cpuMonCnv' width='200' height='100' style='width:100%;height:100%;background-color:#000;'></canvas>");
                if(typeof this.appWindow.dimsSet !== 'function'){
                    this.appWindow.dimsSet = function(){
                        getId('cpuMonCnv').width = apps.cpuMon.appWindow.windowH - 6;
                        getId('cpuMonCnv').height = apps.cpuMon.appWindow.windowV - 24;
                        apps.cpuMon.vars.width = apps.cpuMon.appWindow.windowH - 6;
                        apps.cpuMon.vars.height = apps.cpuMon.appWindow.windowV - 24;
                    }
                }
                this.appWindow.setDims("auto", "auto", 206, 124);
                this.vars.cnv = getId('cpuMonCnv');
                this.vars.ctx = this.vars.cnv.getContext('2d');
                this.vars.drawInt = setInterval(this.vars.draw, 1000);
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    clearInterval(this.vars.drawInt);
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    this.appWindow.alwaysOnTop(1);
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'A very simple graph of CPU usage over time. CPU usage is calculated by comparing the current FPS to the max FPS.',
            drawInt: 0,
            cnv: null,
            ctx: null,
            width: 200,
            height: 100,
            draw: function(){
                apps.cpuMon.vars.ctx.drawImage(apps.cpuMon.vars.cnv, -1, 0);
                apps.cpuMon.vars.ctx.fillStyle = '#000';
                apps.cpuMon.vars.ctx.fillRect(apps.cpuMon.vars.width - 1, 0, 1, apps.cpuMon.vars.height);
                apps.cpuMon.vars.ctx.fillStyle = '#0F0';
                apps.cpuMon.vars.ctx.fillRect(apps.cpuMon.vars.width - 1, apps.cpuMon.vars.height - (parseInt(stringFPSload) / 100 * apps.cpuMon.vars.height), 1, apps.cpuMon.vars.height);
            }
        }, 1, "cpuMon", "appicons/ds/systemApp.png"
    );
    getId('aOSloadingInfo').innerHTML = 'Prompt System';
});
c(function(){
    m('init PMT');
    apps.prompt = new Application(
        "PMT",
        "Application Prompt",
        1,
        function(launchtype){
            if(launchtype === 'dsktp'){
                if(!this.appWindow.appIcon){
                    this.appWindow.setDims("auto", "auto", 500, 300);
                }
                this.appWindow.setCaption('Modal Dialogue');
                getId("win_prompt_big").style.display = "none";
                getId("win_prompt_exit").style.display = "none";
                //getId("win_prompt_shrink").style.display = "none";
                this.appWindow.alwaysOnTop(1);
                this.vars.checkNotifs();
            }
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    window.setTimeout(function(){
                        /*apps.prompt.vars.hideNotifs();*/
                        apps.prompt.vars.checkPrompts();
                    }, 0);
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    if(safeMode){
                        apps.prompt.vars.alert('Safe mode is enabled. Most of your settings will be ignored, so that you can fix something you may have recently broken. Your files are still in place.<br><br>To exit safe mode, simply remove the "?safe=true" from the URL.', 'Okay', function(){}, 'AaronOS');
                    }
                    /*
                    if(typeof USERFILES.CONFIRM_ADMIN_MESSAGE === 'string'){
                        if(USERFILES.CONFIRM_ADMIN_MESSAGE.length > 1){
                            this.vars.confirm('Personal message from admin:<br>' + USERFILES.CONFIRM_ADMIN_MESSAGE, ['OK, Delete Message', 'OK, Keep Message'], function(button){
                                if(!button){
                                    USERFILES.CONFIRM_ADMIN_MESSAGE = ' ';
                                    apps.savemaster.vars.save('CONFIRM_ADMIN_MESSAGE', ' ', 1);
                                }
                            }, 'aOS');
                        }
                    }
                    */
                    this.appWindow.alwaysOnTop(1);
                    this.appWindow.paddingMode(1);
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'This is a prompt or alert box used for applications to create simple messages or get simple input from the user.',
            prompts: [],
            currprompt: [],
            totalNotifs: 0,
            notifs: {},
            alert: function(aText, aButton, aCallback, aCaption){
                if(typeof aText === "object"){
                    this.notifs["notif_" + this.totalNotifs] = {
                        notifType: "alert",
                        notifDate: formDate("D/M/y h:m"),
                        caption: aText.caption,
                        content: aText.content,
                        button: aText.button,
                        callback: aText.callback
                    }
                }else{
                    this.notifs["notif_" + this.totalNotifs] = {
                        notifType: "alert",
                        notifDate: formDate("D/M/y h:m"),
                        caption: aCaption,
                        content: aText,
                        button: aButton,
                        callback: aCallback
                    }
                }
                this.totalNotifs++;
                this.checkNotifs();
            },
            confirm: function(cText, cButtons, cCallback, cCaption){
                if(typeof cText === "object"){
                    this.notifs["notif_" + this.totalNotifs] = {
                        notifType: "confirm",
                        notifDate: formDate("D/M/y h:m"),
                        caption: cText.caption,
                        content: cText.content,
                        buttons: cText.buttons,
                        callback: cText.callback
                    }
                }else{
                    this.notifs["notif_" + this.totalNotifs] = {
                        notifType: "confirm",
                        notifDate: formDate("D/M/y h:m"),
                        caption: cCaption,
                        content: cText,
                        buttons: cButtons,
                        callback: cCallback
                    }
                }
                this.totalNotifs++;
                this.checkNotifs();
            },
            prompt: function(pText, pButton, pCallback, pCaption, isPassword){
                if(typeof pText === "object"){
                    this.notifs["notif_" + this.totalNotifs] = {
                        notifType: "prompt",
                        notifDate: formDate("D/M/y h:m"),
                        caption: pText.caption,
                        content: pText.content,
                        button: pText.button,
                        callback: pText.callback,
                        isPassword: pText.isPassword
                    }
                }else{
                    this.notifs["notif_" + this.totalNotifs] = {
                        notifType: "prompt",
                        notifDate: formDate("D/M/y h:m"),
                        caption: pCaption,
                        content: pText,
                        button: pButton,
                        callback: pCallback,
                        isPassword: isPassword
                    }
                }
                this.totalNotifs++;
                this.checkNotifs();
            },
            notify: function(nText, nButtons, nCallback ,nCaption, nImage){
                if(typeof nText === "object"){
                    this.notifs["notif_" + this.totalNotifs] = {
                        notifType: "notify",
                        notifDate: formDate("D/M/y h:m"),
                        caption: nText.caption,
                        content: nText.content,
                        image: nText.image,
                        buttons: nText.buttons,
                        callback: nText.callback
                    }
                }else{
                    this.notifs["notif_" + this.totalNotifs] = {
                        notifType: "notify",
                        notifDate: formDate("D/M/y h:m"),
                        caption: nCaption,
                        content: nText,
                        image: nImage,
                        buttons: nButtons,
                        callback: nCallback
                    }
                }
                this.totalNotifs++;
                this.checkNotifs();
            },
            lastModalsFound: [],
            lastNotifsFound: [],
            checkNotifs: function(){
                var modalsFound = [];
                var notifsFound = [];
                for(var i in this.notifs){
                    if(this.notifs[i].notifType === "notify"){
                        notifsFound.push(i);
                    }else if(
                        this.notifs[i].notifType === "alert" ||
                        this.notifs[i].notifType === "prompt" ||
                        this.notifs[i].notifType === "confirm"
                    ){
                        modalsFound.push(i);
                    }
                }
                if(modalsFound.length > 0){
                    apps.prompt.vars.showModals();
                    if(modalsFound !== this.lastModalsFound){
                        // TODO: MODAL DIALOGUES
                        // present a list of all active modals in the window
                        // user can scroll through the list and react to them at their own pace
                        // window can be minimized
                        var modalText = '';
                        for(var i of modalsFound){
                            modalText += '<div style="position:relative" data-modal="' + i + '">';
                            switch(this.notifs[i].notifType){
                                case 'alert':
                                    modalText += '<p><b>' + cleanStr(this.notifs[i].caption) + ' has a message:</b></p>' +
                                        '<p>' + this.notifs[i].content + '</p>' +
                                        '<button onclick="apps.prompt.vars.modalSubmit(this.parentNode, 0)">' + (this.notifs[i].button || "Okay") + '</button>';
                                    break;
                                case 'confirm':
                                    modalText += '<p><b>' + cleanStr(this.notifs[i].caption) + ' wants you to choose:</b></p>' +
                                        '<p>' + this.notifs[i].content + '</p>';
                                    for(var j in this.notifs[i].buttons){
                                        modalText += '<button onclick="apps.prompt.vars.modalSubmit(this.parentNode, ' + j + ')">' + (this.notifs[i].buttons[j] || "Option" + j) + '</button> ';
                                    }
                                    break;
                                case 'prompt':
                                    modalText += '<p><b>' + cleanStr(this.notifs[i].caption) + ' wants some info:</b></p>' +
                                        '<p>' + this.notifs[i].content + '</p>' +
                                        '<input style="width:60%" class="modalDialogueInput" onkeypress="if(event.keyCode === 13){apps.prompt.vars.modalSubmit(this.parentNode, 0)}"> ' +
                                        '<button onclick="apps.prompt.vars.modalSubmit(this.parentNode, 0)">' + (this.notifs[i].button || "Sumbit") + '</button>';
                                    break;
                                default:
                                    // nothing, this notification is weird
                            }
                            modalText += '</div>';
                            apps.prompt.appWindow.setContent(modalText);
                        }
                    }
                }else{
                    apps.prompt.vars.hideModals();
                }
                /*  this is the html of a notification
                    <div id="notifWindow" class="darkResponsive" style="opacity:0;pointer-events:none;right:-350px">
                        <div id="notifTitle">Notification</div>
                        <div id="notifContent">Content</div>
                        <div id="notifButtons"><button>Button 1</button> <button>Button 2</button></div>
                        <img id="notifImage" src="appicons/aOS.png">
                        <div class="winExit cursorPointer" onClick="getId('notifWindow').style.opacity='0';getId('notifWindow').style.pointerEvents='none';getId('notifWindow').style.right = '-350px';window.setTimeout(function(){apps.prompt.vars.checkPrompts();}, 300);apps.prompt.vars.currprompt[3](-1);">x</div>
                    </div>
                */
                if(notifsFound.length > 0){
                    apps.prompt.vars.showNotifs();
                    if(notifsFound !== this.lastNotifsFound){
                        var notifText = "";
                        for(var i of notifsFound){
                            notifText += '<div class="notifWindow darkResponsive" data-notif="' + i + '">' +
                                '<div class="notifTitle">' + cleanStr(this.notifs[i].caption) + '</div>' +
                                '<div class="notifContent">' + cleanStr(this.notifs[i].content).split("&lt;br&gt;").join("<br>") + '</div>' +
                                '<div class="notifButtons">';
                            for(var j in this.notifs[i].buttons){
                                notifText += '<button onclick="apps.prompt.vars.notifClick(this.parentNode.parentNode, ' + j + ')">' + this.notifs[i].buttons[j] + '</button>';
                            }
                            notifText += '</div>' +
                                '<img class="notifImage" src="' + this.notifs[i].image + '" onerror="this.src=\'\'">' +
                                '<div class="winExit cursorPointer" onclick="apps.prompt.vars.notifClick(this.parentNode, -1)">x</div>' +
                                '</div><br>';
                        }
                        getId("notifications").innerHTML = notifText;
                    }
                }else{
                    apps.prompt.vars.hideNotifs();
                }
                this.lastModalsFound = modalsFound;
                this.lastNotifsFound = notifsFound;
            },
            modalSubmit: function(modalElem, choice){
                if(typeof modalElem === "object"){
                    if(modalElem.getAttribute("data-modal")){
                        var modalID = modalElem.getAttribute("data-modal");
                        var modalType = this.notifs[modalID].notifType;
                        switch(modalType){
                            case 'alert':
                                this.notifs[modalID].callback();
                                break;
                            case 'confirm':
                                this.notifs[modalID].callback(choice);
                                break;
                            case 'prompt':
                                this.notifs[modalID].callback(modalElem.getElementsByClassName("modalDialogueInput")[0].value);
                                break;
                            default:
                                // something is odd with this notification
                                doLog("Modal " + modalID + " has no type.");
                        }
                        delete this.notifs[modalID];
                        requestAnimationFrame(this.checkNotifs);
                    }
                }
            },
            notifClick: function(notifID, choice){
                if(typeof notifID === "string"){
                    this.notifs[notifID].callback(choice);
                    delete this.notifs[notifID];
                }else if(typeof notifID === "number"){
                    this.notifs["notif_" + notifID].callback(choice);
                    delete this.notifs["notif_" + notifID];
                }else if(typeof notifID === "object"){
                    if(notifID.getAttribute("data-notif")){
                        this.notifs[notifID.getAttribute("data-notif")].callback(choice);
                        delete this.notifs[notifID.getAttribute("data-notif")];
                    }else{
                        doLog("Strange notification, doesn't identify itself?");
                        doLog(notifID);
                    }
                }
                this.checkNotifs();
            },
            showModals: function(){
                if(!apps.prompt.appWindow.appIcon){
                    apps.prompt.appWindow.paddingMode(1);
                    apps.prompt.appWindow.setDims("auto", "auto", 600, 400);
                    apps.prompt.appWindow.setCaption("Modal Dialogue");
                    getId("win_prompt_html").style.overflowY = "auto";
                }
                apps.prompt.appWindow.openWindow();
                requestAnimationFrame(function(){
                    getId("win_prompt_html").scrollTop = 0;
                });
            },
            hideModals: function(){
                if(apps.prompt.appWindow.appIcon){
                    apps.prompt.signalHandler("close");
                }
            },
            notifsVisible: 0,
            showNotifs: function(){
                if(!this.notifsVisible){
                    getId("notifContainer").style.opacity = "1";
                    getId("notifContainer").style.pointerEvents = "";
                    getId("notifContainer").style.right = "16px";
                    this.notifsVisible = 1;
                }
            },
            hideNotifs: function(){
                if(this.notifsVisible){
                    getId("notifContainer").style.opacity = "0";
                    getId("notifContainer").style.pointerEvents = "none";
                    getId("notifContainer").style.right = "-350px";
                    this.notifsVisible = 0;
                }
            },
            flashNotification: function(nTimes){
                this.showNotifs();
                if(nTimes){ // if number of flashes defined
                    getId('notifContainer').style.opacity = '0.2';
                    setTimeout(function(){
                        getId('notifContainer').style.opacity = '';
                    }, 300);
                    for(var i = 1; i < nTimes; i++){
                        setTimeout(function(){
                            getId('notifContainer').style.opacity = '0.2';
                        }, i * 600);
                        setTimeout(function(){
                            getId('notifContainer').style.opacity = '';
                        }, i * 600 + 300);
                    }
                }else{ // otherwise just 3 flashes
                    apps.prompt.vars.flashNotification(3);
                }
            },
            checkPrompts: function(){
                this.checkNotifs();
            }
        }, 2, "prompt", "appicons/ds/PMT.png"
    );
    openapp(apps.prompt, 'dsktp');
    requestAnimationFrame(function(){
        apps.prompt.signalHandler('close');
    });
    getId('aOSloadingInfo').innerHTML = 'Settings';
});
c(function(){
    m('init STN');
    apps.settings = new Application(
        "STN",
        "Settings",
        1,
        function(launchtype){
            if(!this.appWindow.appIcon){
                this.appWindow.setDims("auto", "auto", 700, 400);
            }
            this.appWindow.setCaption("Settings");
            if(launchtype === 'oldMenu' || launchtype === 'oldMenuHide'){
                this.appWindow.setContent(
                    '<div style="font-family:monospace;width:100%;height:100%;overflow:auto">' +
                    '<i>' + langOld('settings', 'valuesMayBeOutdated') + '</i><hr>' +
                    '<b>' + langOld('settings', 'bgImgURL') + '</b><br>' +
                    '<i>' + langOld('settings', 'imgTile') + '</i><br>' +
                    '<input id="bckGrndImg" style="display:inline-block; width:500px" value="' + ufload("aos_system/desktop/background_image") + '"><button onClick="apps.settings.vars.sB()">Set</button><hr>' +
                    '<b>' + langOld('settings', 'performance') + '</b><br>' +
                    langOld('settings', 'dbgLevel') + ': <button onclick="apps.settings.vars.setDebugLevel(0)">Vital Only</button> <button onclick="apps.settings.vars.setDebugLevel(1)">Normal</button> <button onclick="apps.settings.vars.setDebugLevel(2)">High</button><br>' +
                    '<i>' + langOld('settings', 'dbgExplain') + '</i><br><br>' +
                    'Long Tap Opens Context Menu: ' + this.vars.longTap + ' <button onclick="apps.settings.vars.togLongTap()">Toggle</button><br>' +
                    '<i>Only for mobile browsers, requires touch on top-level ctxmenu element (right-clicking a window will not give the desktop ctxmenu)</i><br><br>' +
                    langOld('settings', 'perfModeOn') + ': ' + apps.settings.vars.performanceMode + '<br>' +
                    langOld('settings', 'perfModeTog') + ' <button onClick="apps.settings.vars.togPerformanceMode()">Performance Mode</button><br>' +
                    '<i>' + langOld('settings', 'perfModeDesc') + '</i><hr>' +
                    '<b>' + langOld('settings', 'info') + '</b><br>' +
                    '&nbsp;<b>&copy;</b> <i>2015-2020 Aaron Adams</i><br>' + //          <= COPYRIGHT NOTICE
                    '<i>' + langOld('settings', 'cookies') + '</i><br>' +
                    'Anonymous data collection: ' + this.vars.collectData + ' <button onclick="apps.settings.vars.collectData = -1 * apps.settings.vars.collectData + 1">Toggle</button><br><br>' +
                    'If you have suggestions, please email <a href="mailto:mineandcraft12@gmail.com">mineandcraft12@gmail.com</a>!<br><br>' +
                    langOld('settings', 'networkOn') + ': ' + window.navigator.onLine + '<br>' +
                    langOld('settings', 'batteryLevel') + ': ' + Math.round(batteryLevel * 100) + '%<br>' +
                    '<i>' + langOld('settings', 'batteryDesc') + '</i><br><br>' +
                    'Text Language: ' + languagepacks[currentlanguage] + '<br>' +
                    '<i>Some apps support different languages. Translation is up to the developer of the app and may not be accurate. Some languages may be limited to a few apps.</i><br>' +
                    apps.settings.vars.getTextLanguages() + '<br><br>' +
                    'OS ID: ' + SRVRKEYWORD + '<br>' +
                    '<button onclick="apps.settings.vars.changeKey()">Load a Different aOS</button><br><i>You need the OS ID of the target aOS, and the target aOS must have a set password (and you must enter it correctly).</i><br><br>' +
                    '<i>If you experience issues with the OS, such as saved files not being recovered, email me and reference your OS ID and the details of the issue.</i><br><br>' +
                    'The old Text-To-Speech service was the creation of <a href="http://codewelt.com/proj/speak">codewelt.com/proj/speak</a> and may take several seconds to work after hitting the button. I take NO credit for the creation of that amazing tool. The new TTS service is built-in to Chrome 33 and later.<hr>' +
                    '<b>Screen Resolution</b><br>' +
                    'aOS Monitor Resolution: ' + getId("monitor").style.width + ' by ' + getId("monitor").style.height + '<br>' +
                    'Your Window Resolution: ' + window.innerWidth + 'px by ' + window.innerHeight + 'px <button onclick="fitWindow()">Fit aOS to Window</button><br>' +
                    'Your Screen Resolution: ' + window.outerWidth + 'px by ' + window.outerHeight + 'px <button onclick="fitWindowOuter()">Fit aOS to Screen</button><br>' +
                    'Set Custom Resolution:<br><input id="STNscnresX">px by <input id="STNscnresY">px <button onclick="fitWindowRes(getId(\'STNscnresX\').value, getId(\'STNscnresY\').value)">Set aOS Screen Res</button><br>' +
                    '<button onclick="apps.settings.vars.reqFullscreen()">Enter Fullscreen</button> <button onclick="apps.settings.vars.endFullscreen()">Exit Fullscreen</button><hr>' +
                    '<b>Windows</b><br>' +
                    'Window color: <input id="STNwinColorInput" placeholder="rgba(150, 150, 200, 0.5)" value="' + this.vars.currWinColor + '"> <button onClick="apps.settings.vars.setWinColor()">Set</button><br><br>' +
                    '<button onClick="apps.settings.vars.togAero()">Toggle Window Blur Effect</button><br>' +
                    '<i>Windowblur strength is how much windows blur the background. The default is 2, and large values may produce unintended results as well as lower the framerate.</i><br>' +
                    'Windowblur Strength: <input id="STNwinblurRadius" placeholder="5" value="' + this.vars.currWinblurRad + '"> <button onclick="apps.settings.vars.setAeroRad()">Set</button><br>' +
                    '<i>Window Blur uses a Blend Mode to determine how its color affects the background. Since people will have conflicting ideas on what is best, I give you the choice.</i><br>' +
                    'Window Blur Blend Mode: <input id="STNwinBlendInput" placeholder="screen" value="' + this.vars.currWinBlend + '"> <button onClick="apps.settings.vars.setWinBlend()">Set</button><br>' +
                    'Window Background Image: <button onclick="apps.settings.vars.togWinImg()">Toggle</button> | <input id="STNwinImgInput" placeholder="images/winimg.png" value="' + this.vars.currWinImg + '"> <button onclick="apps.settings.vars.setWinImg()">Set</button><hr>' +
                    '<b>Taskbar</b><br>' +
                    '<i>Toggle the display of different elements of the taskbar</i><br>' +
                    '<button onclick="apps.settings.vars.togTimeComp()">Toggle Compact Time</button> <button onclick="apps.settings.vars.togNetStat()">Toggle Network Status</button> <button onclick="apps.settings.vars.togBatStat()">Toggle Battery Status</button> <button onclick="apps.settings.vars.togBatComp()">Toggle Stylish Battery</button> <button onclick="apps.settings.vars.togFpsStat()">Toggle FPS Status</button> <button onclick="apps.settings.vars.togFpsComp()">Toggle Compact FPS</button> <button onclick="apps.settings.vars.togLodStat()">Toggle CPU Status</button><hr>' +
                    '<b>NORAA</b><br>' +
                    'NORAA presents graphical help boxes instead of speaking solutions, where available: ' + this.vars.noraHelpTopics + ' <button onclick="apps.settings.vars.togNoraHelpTopics()">Toggle</button><br>' +
                    'NORAA listening for you: ' + this.vars.currNoraListening + ' <button onclick="apps.settings.vars.togNoraListen()">Toggle</button><br>' +
                    'NORAA listens for the phrase: <input id="STNnoraphrase" placeholder="listen computer" value="' + apps.settings.vars.currNoraPhrase + '"> <button onclick="apps.settings.vars.togNoraPhrase()">Set</button><br>' +
                    'Speech Input Delay (time in ms that NORAA gives for you to cancel spoken input): <input id="STNnoraDelay" value="' + apps.nora.vars.inputDelay + '"> <button onclick="apps.settings.vars.NORAAsetDelay()">Set</button><br><br>' +
                    '<i>If NORAA won\'t speak after you speak to him, try one of these out...</i><br>' +
                    'Current Voice: ' + apps.nora.vars.lang + '<br>' +
                    apps.settings.vars.getVoicesForNORAA() +
                    '</div>'
                );
            }else{
                this.vars.showMenu(apps.settings.vars.menus);
            }
            if(launchtype !== "oldMenuHide"){
                this.appWindow.openWindow();
            }
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    if(localStorage.getItem("askedPassword") !== "1" && !(typeof USERFILES.aOSpassword === "string")){
                        window.setTimeout(function(){
                            if(!(typeof USERFILES.aOSpassword === "string")){
                                apps.prompt.vars.notify("Please set a password on your account in Settings to protect it.", ["Set Password", "Cancel"], function(btn){
                                    if(btn === 0){
                                        openapp(apps.settings, "dsktp");
                                        apps.settings.vars.showMenu(apps.settings.vars.menus.info);
                                    }else{
                                        apps.prompt.vars.notify("In the future, you can go to Settings -&gt; Information to set a password on your account.", ["Okay"], function(){}, 'AaronOS', 'appicons/ds/aOS.png');
                                    }
                                }, 'AaronOS', 'appicons/ds/aOS.png');
                                localStorage.setItem("askedPassword", "1");
                            }
                        }, 600000);
                    }
                    window.setTimeout(function(){
                        getId('aOSloadingInfo').innerHTML = 'Welcome.';
                        getId('desktop').style.display = '';
                        getId('taskbar').style.display = '';
                    }, 0);
                    window.setTimeout(function(){
                        getId('aOSisLoading').style.opacity = 0;
                        getId('aOSloadingBg').style.opacity = 0;
                    }, 5);
                    window.setTimeout(function(){
                        getId('aOSisLoading').style.display = 'none';
                        getId('aOSisLoading').innerHTML = '';
                        getId('aOSloadingBg').style.display = 'none';
                    }, 1005);
                    window.setTimeout(function(){
                        openapp(apps.settings, 'oldMenuHide');
                        if(!safeMode){
                            if(ufload("aos_system/desktop/background_image")){
                                getId("bckGrndImg").value = ufload("aos_system/desktop/background_image");
                                apps.settings.vars.sB(1);
                            }
                            if(ufload("aos_system/windows/backdropfilter_blur")){
                                if(ufload("aos_system/windows/backdropfilter_blur") === "0"){
                                    apps.settings.vars.togBackdropFilter(1);
                                }
                            }else if(!backdropFilterSupport){
                                apps.settings.vars.togBackdropFilter(1);
                            }
                            if(ufload("aos_system/windows/blur_enabled")){
                                if(ufload("aos_system/windows/blur_enabled") === "1"){
                                    apps.settings.vars.togAero(1);
                                }
                            }else if(!backdropFilterSupport){
                                if(cssFilterSupport){
                                    apps.settings.vars.togAero(1);
                                }
                            }
                            if(ufload("aos_system/windows/border_color")){
                                getId("STNwinColorInput").value = ufload("aos_system/windows/border_color");
                                apps.settings.vars.setWinColor(1);
                            }
                            if(ufload("aos_system/windows/blur_blendmode")){
                                getId("STNwinBlendInput").value = ufload("aos_system/windows/blur_blendmode");
                                apps.settings.vars.setWinBlend(1);
                            }
                            if(ufload("aos_system/windows/blur_radius")){
                                getId("STNwinblurRadius").value = ufload("aos_system/windows/blur_radius");
                                apps.settings.vars.setAeroRad(1);
                            }
                            if(ufload("aos_system/windows/border_width")){
                                apps.settings.vars.setWinBorder(ufload("aos_system/windows/border_width"), 1);
                            }
                            if(ufload("aos_system/windows/distort_enabled")){
                                if(ufload("aos_system/windows/distort_enabled") === "1"){
                                    apps.settings.vars.togDispMap(1);
                                }
                            }
                            if(ufload("aos_system/windows/controls_on_left")){
                                if(ufload("aos_system/windows/controls_on_left") === "1"){
                                    apps.settings.vars.togCaptionButtonsLeft(1);
                                }
                            }
                            if(ufload("aos_system/language")){
                                currentlanguage = ufload("aos_system/language");
                            }
                            if(ufload("aos_system/noraa/listen_enabled")){
                                if(ufload("aos_system/noraa/listen_enabled") === 1){
                                    apps.settings.vars.togNoraListen(1);
                                }
                            }
                            if(ufload("aos_system/noraa/listen_phrase")){
                                apps.settings.vars.currNoraPhrase = ufload("aos_system/noraa/listen_phrase");
                            }
                            if(ufload("aos_system/apps/settings/data_collect_enabled")){
                                apps.settings.vars.collectData = parseInt(ufload("aos_system/apps/settings/data_collect_enabled"), 10);
                            }
                            if(ufload("aos_system/noraa/adv_help_enabled")){
                                if(ufload("aos_system/noraa/adv_help_enabled") === "0"){
                                    apps.settings.vars.togNoraHelpTopics(1);
                                }
                            }
                            if(ufload("aos_system/apps/settings/ctxmenu_two_fingers")){
                                if(ufload("aos_system/apps/settings/ctxmenu_two_fingers") === "1"){
                                    apps.settings.vars.togLongTap(1);
                                }
                            }
                            if(ufload("aos_system/windows/border_texture_enabled")){
                                if(ufload("aos_system/windows/border_texture_enabled") === "0"){
                                    apps.settings.vars.togWinImg(1);
                                }
                            }
                            if(ufload("aos_system/windows/border_texture")){
                                getId("STNwinImgInput").value = ufload("aos_system/windows/border_texture");
                                apps.settings.vars.setWinImg(1);
                            }
                            if(ufload("aos_system/clipboard_slots")){
                                textEditorTools.slots = parseInt(ufload("aos_system/clipboard_slots"));
                                textEditorTools.updateSlots();
                            }
                            if(ufload("aos_system/clipboard")){
                                if(ufload("aos_system/clipboard") !== '_cleared_clipboard_'){
                                    textEditorTools.clipboard = JSON.parse(ufload("aos_system/clipboard"));
                                    if(textEditorTools.clipboard.length < textEditorTools.slots){
                                        while(textEditorTools.clipboard.length < textEditorTools.slots){
                                            textEditorTools.clipboard.push("");
                                        }
                                    }
                                }
                            }
                            apps.settings.vars.setScale(ufload("aos_system/apps/settings/ui_scale") || "1", 1);
                            if(ufload("aos_system/apps/settings/saved_screen_res")){
                                apps.settings.vars.tempResArray = ufload("aos_system/apps/settings/saved_screen_res").split('/');
                                fitWindowRes(apps.settings.vars.tempResArray[0], apps.settings.vars.tempResArray[1]);
                            }
                            if(ufload("aos_system/apps/settings/cors_proxy")){
                                apps.settings.vars.corsProxy = ufload("aos_system/apps/settings/cors_proxy");
                            }
                            if(ufload("aos_system/user_custom_style")){
                                getId('aosCustomStyle').innerHTML = ufload("aos_system/user_custom_style");
                            }
                            if(ufload("aos_system/windows/dark_mode")){
                                if(ufload("aos_system/windows/dark_mode") === "1"){
                                    apps.settings.vars.togDarkMode(1);
                                }
                            }
                            if(ufload("aos_system/apps/settings/mobile_mode")){
                                apps.settings.vars.setMobileMode(ufload("aos_system/apps/settings/mobile_mode"), 1)
                            }
                            if(ufload("aos_system/desktop/background_fit")){
                                apps.settings.vars.setBgFit(ufload("aos_system/desktop/background_fit"), 1);
                            }
                            if(ufload("aos_system/desktop/background_live_enabled")){
                                if(ufload("aos_system/desktop/background_live_enabled") === "1"){
                                    apps.settings.vars.togLiveBg(1);
                                }
                            }
                            if(ufload("aos_system/desktop/background_live_url")){
                                apps.settings.vars.setLiveBg(ufload("aos_system/desktop/background_live_url"), 1);
                            }
                            if(ufload("aos_system/desktop/background_parallax_layers")){
                                apps.settings.vars.setPrlxBg(ufload("aos_system/desktop/background_parallax_layers"), 1);
                            }
                            if(ufload("aos_system/desktop/background_parallax_enabled")){
                                if(ufload("aos_system/desktop/background_parallax_enabled") === "1"){
                                    apps.settings.vars.togPrlxBg(1);
                                }
                            }
                            if(ufload("aos_system/screensaver/enabled")){
                                if(ufload("aos_system/screensaver/enabled") === "0"){
                                    apps.settings.vars.togScreensaver();
                                }
                            }
                            if(ufload("aos_system/screensaver/idle_time")){
                                apps.settings.vars.screensaverTime = parseInt(ufload("aos_system/screensaver/idle_time"), 10);
                            }
                            if(ufload("aos_system/screensaver/selected_screensaver")){
                                apps.settings.vars.currScreensaver = ufload("aos_system/screensaver/selected_screensaver");
                            }
                            apps.settings.vars.screensaverTimer = window.setInterval(apps.settings.vars.checkScreensaver, 1000);
                            if(ufload("aos_system/taskbar/position")){
                                apps.settings.vars.setTskbrPos(parseInt(ufload("aos_system/taskbar/position"), 10), 1);
                            }
                            if(ufload("aos_system/apps/settings/performance_mode")){
                                if(ufload("aos_system/apps/settings/performance_mode") === "1"){
                                    apps.settings.vars.togPerformanceMode();
                                }
                            }
                            if(ufload("aos_system/windows/fade_distance")){
                                setTimeout(function(){
                                    apps.settings.vars.setFadeDistance(ufload("aos_system/windows/fade_distance"), 1);
                                }, 100);
                            }else{
                                setTimeout(function(){
                                    apps.settings.vars.setFadeDistance("0.5", 1);
                                }, 1000);
                            }
                            if(typeof ufload("aos_system/taskbar/pinned_apps") === "string"){
                                pinnedApps = JSON.parse(ufload("aos_system/taskbar/pinned_apps"));
                                for(var i in pinnedApps){
                                    getId('icn_' + pinnedApps[i]).style.display = 'inline-block';
                                }
                            }
                        }
                        
                        // google play settings
                        if(sessionStorage.getItem('GooglePlay') === 'true'){
                            if(ufload("aos_system/apps/settings/performance_mode") !== "1"){
                                apps.settings.vars.togPerformanceMode(1);
                            }
                            if(ufload("aos_system/windows/blur_enabled") !== "0"){
                                apps.settings.vars.togAero(1);
                            }
                            
                            try{
                                if(localStorage.getItem('notifyGPlay') !== "1"){
                                    localStorage.setItem('notifyGPlay', "1");
                                    apps.prompt.vars.notify('Looks like you logged in through Google Play!<br>These settings were automatically set for you...<br><br>Performance Mode is on.<br>Screen scaling set to 1/2 if your device is 1080p or higher.<br>Tap a titlebar on a window, and then click somewhere else again, to move  a window. You can also resize them on the bottom-right corner.', [], function(){}, 'Google Play', 'appicons/ds/aOS.png');
                                }
                            }catch(localStorageNotSupported){
                                apps.prompt.vars.notify('Looks like you logged in through Google Play!<br>These settings were automatically set for you...<br><br>Performance Mode is on.<br>Screen scaling set to 1/2 if your device is 1080p or higher.<br>Tap a titlebar on a window, and then click somewhere else again, to move  a window. You can also resize them on the bottom-right corner.', [], function(){}, 'Google Play', 'appicons/ds/aOS.png');
                            }
                        }
                        
                        if(sessionStorage.getItem('fullscreen') === 'true'){
                            setTimeout(apps.settings.vars.reqFullscreen, 5000);
                        }
                        if(!safeMode){
                            var dsktpIconFolder = ufload("aos_system/desktop/");
                            if(dsktpIconFolder){
                                for(var file in dsktpIconFolder){
                                    if(file.indexOf('ico_') === 0){
                                        if(getId(file.substring(10, 16)) !== null){
                                            getId(file.substring(4, file.length)).style.left = eval(USERFILES[file])[0] + "px";
                                            getId(file.substring(4, file.length)).style.top = eval(USERFILES[file])[1] + "px";
                                        }
                                    }
                                }
                            }
                        }
                        apps.settings.appWindow.closeWindow();
                    }, 0);
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    console.log("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'This app contains all official settings for AaronOS.<br><br>If these settings are not enough for you, and you are a very advanced user, you can use the following apps to completely control AaronOS:<br><ul><li>BootScript</li><li>CustomStyle Editor</li></ul>',
            language: {
                en: {
                    valuesMayBeOutdated: 'All values below are from the time the Settings app was opened.',
                    bgImgURL: 'Background Image URL',
                    imgTile: 'Images tile to cover the screen.',
                    performance: 'Performance',
                    dbgLevel: 'Debug Level',
                    dbgExplain: 'Sets how verbose aOS is in its actions. The different levels determine how often console messages appear and why.',
                    perfModeOn: 'Running in Performance Mode',
                    perfModeTog: 'If aOS is consistently running at a low FPS, try using',
                    perfModeDesc: 'Performance Mode attempts to raise framerate by lowering the CPU usage of some system functions',
                    info: 'Info',
                    cookies: 'By using this site you are accepting the small cookie the filesystem relies on and that all files you or your aOS apps generate will be saved on the aOS server for your convenience (and, mostly, for technical reasons).',
                    networkOn: 'Network Online',
                    batteryLevel: 'Battery Level',
                    batteryDesc: 'If the amount above is -100, then your computer either has no battery or the battery could not be found.'
                    
                },
                uv: {
                    valuesMayBeOutdated: 'Each instance of a definitive value below this line would happen to have been generated at the exact moment in time at which the app which happens to be called Settings happens to have been opened.',
                    bgImgURL: 'The Uniform Resource Locator of the Image to be Applied to the Background of the Desktop',
                    imgTile: 'The specified image will tile as many times as necessary to cover the entirety of the screen.',
                    performance: 'Functions that may Assist the Performance of the Operating System',
                    dbgLevel: 'Level of logging to the Debug Console',
                    dbgExplain: 'Determines the level of verbosity that aOS brings when referencing actions and issues. The differing levels given will determine how common messages will appear in the Console app, and the importance they must marked as to appear.',
                    perfModeOn: 'Running in enhanced-performance adjustment mode',
                    perfModeTog: 'If it appears that aOS is consistently running slowly or at a low count of frames per second, try enabling experimental',
                    perfModeDesc: 'The experimental Performance Mode attempts to lower the stress on CPU by optimising and delaying system functions',
                    info: 'Essential Information About aOS',
                    cookies: 'In the act of accessing this web site, you are hereby accepting the small, 21-character browser cookie that aOS relies heavily on for its filesystem. All text files you and your installed aOS apps happen to generate are stored solely on the aOS main server for your convenience (and, mostly, for annoying technical limitations).',
                    networkOn: 'Reported status of your browser\'s online network connectivity',
                    batteryLevel: 'Approximate level of battery life remaining in your device, as reported by your browser',
                    batteryDesc: 'If it just so happens that the numerical value represented above equals -100, then it appears that your browser reports that you have no battery installed on your device, or that your browser is incapable of reporting said amount.'
                },
                ch: {
                    
                }
            },
            menus: {
                folder: 1,
                folderName: 'Settings',
                folderPath: 'apps.settings.vars.menus',
                background: {
                    folder: 0,
                    folderName: 'Desktop Background',
                    folderPath: 'apps.settings.vars.menus.background',
                    image: 'settingIcons/new/background.png',
                    setUrl: {
                        option: 'Background Image URL',
                        description: function(){return 'Set an image as your desktop background. This can be png, jpg, gif, or any other web-compatible image. You can enter a filename from the "aOS Backgrounds" list at the bottom of this page or an external image URL. If aOS is loaded over HTTPS, make sure your image URL is on HTTPS as well. Some external image URLs may not allow aOS to load them.'},
                        buttons: function(){return '<input id="bckGrndImg" placeholder="images/beta1.png" style="display:inline-block; width:50%" value="' + (ufload("aos_system/desktop/background_image") || 'images/beta1.png') + '"> <button onClick="apps.settings.vars.sB()">Set</button>'}
                    },
                    bgFit: {
                        option: 'Background Image Fit',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="apps.settings.vars.bgFit">?</span>.<br>' +
                            'This determines the size and positioning of your background.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.setBgFit(\'corner\')">Corner</button> <button onclick="apps.settings.vars.setBgFit(\'center\')">Center</button> <button onclick="apps.settings.vars.setBgFit(\'cover\')">Cover</button> <button onclick="apps.settings.vars.setBgFit(\'stretch\')">Stretch</button> <button onclick="apps.settings.vars.setBgFit(\'fit\')">Fit</button>'}
                    },
                    liveBackground: {
                        option: 'Live Background',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.liveBackgroundEnabled)"></span>.<br>' +
                            'Live Background allows you to set a website as your desktop wallpaper. Not all websites work as Live Backgrounds.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togLiveBg()">Toggle</button> | <input id="STNliveBg" placeholder="URL to site" value="' + apps.settings.vars.liveBackgroundURL + '"> <button onclick="apps.settings.vars.setLiveBg(getId(\'STNliveBg\').value)">Set URL</button>'}
                    },
                    parallaxBackground: {
                        option: 'Parallax Background',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.prlxBackgroundEnabled)"></span>.<br>' +
                            'Parallax Background allows you to create your own wallpapers with depth in them. The wallpaper moves around as you move your mouse. Provide a comma-separated list of image URLs. The first image is displayed at the bottom of the stack.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togPrlxBg()">Toggle</button> | <input id="STNprlxBg" placeholder="comma-separated image URLs" value="' + (apps.settings.vars.prlxBackgroundURLs || "images/p1.png,images/p2.png,images/p3.png,images/p4.png") + '"> <button onclick="apps.settings.vars.setPrlxBg(getId(\'STNprlxBg\').value)">Set URLs</button>'}
                    },
                    premade: {
                        option: 'aOS Backgrounds',
                        description: function(){return 'Here are several images that I have included with aOS. Note that I did not make all of these and that most of these backgrounds have their own respective owners.'},
                        buttons: function(){
                            var str = '';
                            for(var i in apps.settings.vars.availableBackgrounds){
                                str += '<br>' + apps.settings.vars.availableBackgrounds[i] + '<br><a target="_blank" href="' + apps.settings.vars.availableBackgrounds[i] + '"><button>Preview in New Tab</button></a>';
                            }
                            return str;
                        }
                    }
                },
                performance: {
                    folder: 0,
                    folderName: 'Performance',
                    folderPath: 'apps.settings.vars.menus.performance',
                    image: 'settingIcons/new/performance.png',
                    perfMode: {
                        option: 'Performance Mode',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.performanceMode)">' + numEnDis(apps.settings.vars.performanceMode) + '</span>.<br>' +
                            'Performance Mode attempts to raise framerate by lowering the intensity of some system functions.'},
                        buttons: function(){return '<button onClick="apps.settings.vars.togPerformanceMode()">Toggle</button>'}
                    },
                    clickToMove: {
                        option: 'Legacy Window Moving',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.clickToMove)"></span>.<br>' +
                            'Legacy controls for window-moving, in which you must click the window title to select it and then click again somewhere on the screen to move it. This is useful for mobile devices which might not support dragging windows.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togClickToMove()">Toggle</button>'}
                    },
                    longTap: {
                        option: 'Double Tap Opens Context Menu',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.longTap)">' + numEnDis(apps.settings.vars.longTap) + '</span>.<br>' +
                            'Only for mobile browsers, requires touch on top-level ctxmenu element (right-clicking a window will not give the desktop ctxmenu)'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togLongTap()">Toggle</button>'}
                    },
                    allowStnWindow: {
                        option: 'File Browser Debug Mode',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.FILcanWin)"></span>.<br>' +
                            'Allows File Browser to access the global Window object. Dangerous!'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togFILwin()">Toggle</button>'}
                    },
                    corsProxy: {
                        option: 'CORS Proxy',
                        description: function(){return 'Prefix to URLs used by some apps to access non-aOS websites. If you don\'t know what this is, dont mess with it.'},
                        buttons: function(){return '<input id="STNcorsInput" placeholder="https://cors-anywhere.herokuapp.com/"> <button onclick="apps.settings.vars.corsProxy = getId(\'STNcorsInput\').value;apps.savemaster.vars.save(\'aos_system/apps/settings/cors_proxy\', apps.settings.vars.corsProxy, 1)">Set</button>'}
                    }
                },
                info: {
                    folder: 0,
                    folderName: 'Information',
                    folderPath: 'apps.settings.vars.menus.info',
                    image: 'settingIcons/new/information.png',
                    osID: {
                        option: 'aOS ID',
                        description: function(){return 'Your aOS ID: ' + SRVRKEYWORD + '<br>' +
                            'If you would wish to load another copy of aOS, use the button below. Be sure to have its aOS ID and password ready, and make sure to set a password on this current account if you want to get back to it later.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.changeKey()">Load a Different aOS</button>'}
                    },
                    osPassword: {
                        option: 'aOS Password',
                        description: function(){return 'Change the password required to access your account on AaronOS.'},
                        buttons: function(){return '<input id="STNosPass" type="password"> <button onclick="apps.settings.vars.newPassword()">Set</button>'}
                    },
                    copyright: {
                        option: 'Copyright Notice',
                        description: function(){return 'AaronOS is &copy; 2015-2020 Aaron Adams<br><br>This software is provided FREE OF CHARGE.<br>If you were charged for the use of this software, please contact mineandcraft12@gmail.com<br><br>Original AaronOS source-code provided as-is at <a target="_blank" href="https://github.com/MineAndCraft12/AaronOS">Github</a>'}, //         <-- COPYRIGHT NOTICE
                        buttons: function(){return 'By using this site you are accepting the small cookie the filesystem relies on and that all files you or your aOS apps generate will be saved on the aOS server for your convenience (and, mostly, for technical reasons).' +
                            function(){
                                if(window.location.href.indexOf('https://aaronos.dev/AaronOS/') !== 0){
                                    return '<br><br>This project is a fork of AaronOS. The official AaronOS project is hosted at <a href="https://aaronos.dev/">https://aaronos.dev/</a><br><br>The above copyright notice applies to all code and original resources carried over from Aaron Adams\' original, official AaronOS project.';
                                }
                                else{
                                    return '';
                                }
                            }()
                        }
                    },
                    osVersion: {
                        option: 'aOS Version',
                        description: function(){return 'You are running AaronOS ' + window.aOSversion + '.'},
                        buttons: function(){return 'aOS is updated automatically between restarts, with no action required on your part.'}
                    },
                    contact: {
                        option: 'Contact',
                        description: function(){return 'Having issues? Need help? Something broken on aOS? Want to suggest changes or features? Have some other need to contact me? Feel free to contact me below!'},
                        buttons: function(){return 'Email: <a href="mailto:mineandcraft12@gmail.com">mineandcraft12@gmail.com</a><br>Discord: Meowster Chief#1121'}
                    },
                    dataCollect: {
                        option: 'Anonymous Data Collection',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.collectData)">' + numEnDis(apps.settings.vars.collectData) + '</span>'},
                        buttons: function(){return '<a href="privacy.txt" target="_blank">Privacy Policy</a><br><br>' +
                            '<button onclick="apps.settings.vars.collectData = -1 * apps.settings.vars.collectData + 1">Toggle</button><br>' +
                            'All ongoing data collection campaigns will be detailed in full here:' +
                            apps.settings.vars.getDataCampaigns()}
                    },
                    textLanguage: {
                        option: 'Text Language',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="languagepacks[(currentlanguage || \'en\')]">' + languagepacks[(currentlanguage || 'en')] + '</span>.<br>' +
                            'Some apps support different languages. Translation is up to the developer of the app and may not be accurate. Some languages may be limited to few apps.'},
                        buttons: function(){return apps.settings.vars.getTextLanguages()}
                    },
                    uglyLoading: {
                        option: 'Visible Loading',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(dirtyLoadingEnabled)">' + numEnDis(dirtyLoadingEnabled) + '</span>.<br>' +
                            'Allows you to watch aOS load at startup, but looks dirty compared to having a loading screen.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togDirtyLoad()">Toggle</button>'}
                    },
                },
                screenRes: {
                    folder: 0,
                    folderName: 'Screen Resolution',
                    folderPath: 'apps.settings.vars.menus.screenRes',
                    image: 'settingIcons/new/resolution.png',
                    fullscreen: {
                        option: 'Full Screen',
                        description: function(){return 'Puts aOS into fullscreen mode, so it does not look like it has been loaded in a browser. A more stable way to achieve this is with the F11 key.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.reqFullscreen()">Enter Fullscreen</button> <button onclick="apps.settings.vars.endFullscreen()">Exit Fullscreen</button>'}
                    },
                    mobileMode: {
                        option: 'Mobile Mode',
                        description: function(){return 'Current: ' + function(){if(autoMobile){return 'Automatic'}else{return numEnDis(mobileMode)}}() + '.<br>' +
                            'Changes various UI elements and functionality of AaronOS to be better suited for phones and other devices with small screens.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.setMobileMode(0)">Turn Off</button> <button onclick="apps.settings.vars.setMobileMode(1)">Turn On</button> <button onclick="apps.settings.vars.setMobileMode(2)">Automatic</button>'}
                    },
                    scaling: {
                        option: 'Content Scaling',
                        description: function(){return 'If you have a HiDPI screen or text and buttons on aOS are too small, you can use this option to make aOS bigger. Regular size is 1. Double size is 2. Triple size is 3. It is not recommended, but you can also shrink aOS with a decimal value less than 1. For instance, half size is 0.5'},
                        buttons: function(){return '<input placeholder="1" id="STNscaling"> <button onclick="apps.settings.vars.setScale(getId(\'STNscaling\').value)">Set</button>'}
                    },
                    currRes: {
                        option: 'aOS Monitor Resolution',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="getId(\'monitor\').style.width">' + getId('monitor').style.width + '</span> by <span class="liveElement" data-live-eval="getId(\'monitor\').style.height">' + getId('monitor').style.height + '</span>.<br>' +
                            'This is the dimensions in pixels of AaronOS\'s virtual display. If the virtual display does not fit in your browser window, scrollbars will appear.'},
                        buttons: function(){return '<input id="STNscnresX">px by <input id="STNscnresY">px <button onclick="fitWindowRes(getId(\'STNscnresX\').value, getId(\'STNscnresY\').value)">Set aOS Screen Res</button>'}
                    },
                    saveRes: {
                        option: 'Save Resolution',
                        description: function(){return 'Have aOS automatically load to a specified resolution at boot (specified in the text fields above).'},
                        buttons: function(){return '<button onclick="apps.settings.vars.saveRes(getId(\'STNscnresX\').value, getId(\'STNscnresY\').value)">Save</button> <button onclick="ufdel(\'aos_system/apps/settings/saved_screen_res\')">Delete</button>'}
                    },
                    currWin: {
                        option: 'Current Browser Window Resolution',
                        description: function(){return '<span class="liveElement" data-live-eval="window.innerWidth">' + window.innerWidth + '</span>px by <span class="liveElement" data-live-eval="window.innerHeight">' + window.innerHeight + '</span>px'},
                        buttons: function(){return '<button onclick="fitWindow()">Fit aOS to Window</button>'}
                    },
                    currScn: {
                        option: 'Current Screen Resolution',
                        description: function(){return '<span class="liveElement" data-live-eval="screen.width">' + screen.width + '</span>px by <span class="liveElement" data-live-eval="screen.height">' + screen.height + '</span>px'},
                        buttons: function(){return '<button onclick="fitWindowOuter()">Fit aOS to Screen</button>'}
                    }
                },
                windows: {
                    folder: 0,
                    folderName: 'Windows',
                    folderPath: 'apps.settings.vars.menus.windows',
                    image: 'settingIcons/new/windows.png',
                    capBtnLeft: {
                        option: 'Window Controls on Left',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.captionButtonsLeft)">Disabled</span>.<br>' +
                            'Moves the window control buttons to the left side of the titlebar.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togCaptionButtonsLeft()">Toggle</button>'}
                    },
                    darkMode: {
                        option: 'Dark Mode',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(darkMode)">Disabled</span>.<br>' +
                            'Makes your aOS apps use a dark background and light foreground. Some apps may need to be restarted to see changes.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togDarkMode();apps.settings.vars.showMenu(apps.settings.vars.menus.windows)">Toggle</button>'}
                    },
                    windowBorderWidth: {
                        option: 'Window Border Width',
                        description: function(){return 'Set the width of the left, right, and bottom borders of windows.'},
                        buttons: function(){return '<input id="STNwinBorderInput" placeholder="3" value="' + apps.settings.vars.winBorder + '"> <button onclick="apps.settings.vars.setWinBorder(getId(\'STNwinBorderInput\').value)">Set</button>'}
                    },
                    windowColor: {
                        option: 'Window Color',
                        description: function(){return 'Set the color of your window borders, as any CSS-compatible color. (#HEX, RGBA, or a common color name)'},
                        buttons: function(){return '<input id="STNwinColorInput" placeholder="rgba(150, 150, 200, 0.5)" value="' + apps.settings.vars.currWinColor + '"> <button onClick="apps.settings.vars.setWinColor()">Set</button>'}
                    },
                    backdropFilter: {
                        option: 'Window Glass Effect',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.isBackdrop)">true</span>.<br>' +
                            'Toggle the glass effect that blurs everything behind transparent window borders and the taskbar.'},
                        buttons: function(){return '<button onClick="apps.settings.vars.togBackdropFilter()">Toggle Glass Effect</button>'}
                    },
                    blurStrength: {
                        option: 'Window Glass Blur Strength',
                        description: function(){return 'Strength of the blur effect on window glass. Large numbers may produce framerate drops and unintended effects on appearance.'},
                        buttons: function(){return '<input id="STNwinblurRadius" placeholder="5" value="' + apps.settings.vars.currWinblurRad + '"> <button onclick="apps.settings.vars.setAeroRad()">Set</button>'}
                    },
                    winImg: {
                        option: 'Window Border Texture',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.enabWinImg)">' + numEnDis(apps.settings.vars.enabWinImg) + '</span>.<br>' +
                            'An image overlay on the border of windows and the taskbar that adds some texture.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togWinImg()">Toggle</button> | <input id="STNwinImgInput" placeholder="images/winimg.png" value="' + apps.settings.vars.currWinImg + '"> <button onclick="apps.settings.vars.setWinImg()">Set</button>'}
                    },
                    displaceMap: {
                        option: 'Glass Distortion Effect <i>(experimental)</i>',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.dispMapEffect)">false</span>.<br>' +
                            'This experimental effect adds distortion to the glass effect that matches the default window texture. This makes it look more like textured glass and less like a simple blur.'},
                        buttons: function(){return '<button onClick="apps.settings.vars.togDispMap()">Toggle Distortion Effect</button>'}
                    },
                    fadeDist: {
                        option: 'Window Fade Size',
                        description: function(){return 'The animated change in size of a window when being closed or opened. If set to 1, windows will not change size when closed. If between 0 and 1, the window will get smaller when closed. If larger than 1, the window will get bigger when closed.'},
                        buttons: function(){return '<input id="STNwinFadeInput" placeholder="0.8" value="' + apps.settings.vars.winFadeDistance + '"> <button onClick="apps.settings.vars.setFadeDistance(getId(\'STNwinFadeInput\').value)">Set</button>'}
                    },
                    windowBlur: {
                        option: 'Legacy Windowblur (OLD!)',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(parseInt(ufload(\'aos_system/windows/blur_enabled\') || \'0\'))">Disabled</span>.<br>' +
                            'This is the old version of the glass effect that aOS used before it was supported. This effect only shows a blurred version of the desktop background and you can\'t see other windows through it. This can be helpful if the newer glass effect doesn\'t work on your browser.'},
                        buttons: function(){return '<button onClick="apps.settings.vars.togAero()">Toggle Legacy Windowblur Effect</button>'}
                    },
                    blurBlend: {
                        option: 'Legacy Windowblur Blend Mode',
                        description: function(){return 'Legacy Windowblur uses a Blend Mode to determine how its color affects the background. Since people will have conflicting ideas on what is best, I give you the choice.'},
                        buttons: function(){return '<input id="STNwinBlendInput" placeholder="screen" value="' + apps.settings.vars.currWinBlend + '"> <button onClick="apps.settings.vars.setWinBlend()">Set</button>'}
                    }
                },
                taskbar: {
                    folder: 0,
                    folderName: 'Taskbar',
                    folderPath: 'apps.settings.vars.menus.taskbar',
                    image: 'settingIcons/new/taskbar.png',
                    taskbarPos: {
                        option: 'Taskbar Position',
                        description: function(){return 'Change the position of the taskbar on the screen.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.setTskbrPos(0)">Bottom</button> <button onclick="apps.settings.vars.setTskbrPos(1)">Top</button> <button onclick="apps.settings.vars.setTskbrPos(2)">Left</button> <button onclick="apps.settings.vars.setTskbrPos(3)">Right</button>'}
                    },
                    widgets: {
                        option: 'Widgets',
                        description: function(){return '<ol id="STNwidgets">' + apps.settings.vars.getWidgetList() + '</ol>'},
                        buttons: function(){return apps.settings.vars.getWidgetButtons()}
                    }
                },
                dashboard: {
                    folder: 0,
                    folderName: 'Dashboard',
                    folderPath: 'apps.settings.vars.menus.dashboard',
                    image: 'settingIcons/new/dashboard.png',
                    dashDefault: {
                        option: 'Default Dashboard',
                        description: function(){return 'The default Dashboard of AaronOS. Features quick shortcuts at the top and a searchable list of apps along with their icons and three-letter IDs.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.setDashboard(\'default\')">Select Default Dashboard</button>'}
                    },
                    dashLegacy: {
                        option: 'Legacy Dashboard',
                        description: function(){return 'Previously the default Dashboard of AaronOS, prior to Beta 1.3. Features quick shortcuts at the top and a searchable list of apps along with their three-letter IDs.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.setDashboard(\'legacy\')">Select Legacy Dashboard</button>'}
                    },
                    dashWin7: {
                        option: 'Aero Dashboard',
                        description: function(){return 'Make the Dashboard look similar to the Start Menu of Windows 7 Aero. Features icons, shortcut buttons, app search, and a more familiar look.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.setDashboard(\'win7\')">Select Aero Dashboard</button>'}
                    },
                    dashAndroid: {
                        option: 'Android Dashboard',
                        description: function(){return 'Make the Dashboard look similar to the app-drawer style of Android launchers. Features shortcut buttons, app search, and icons.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.setDashboard(\'android\')">Select Android Dashboard</button>'}
                    },
                    dashWhisker: {
                        option: 'Whisker Dashboard',
                        description: function(){return 'Make the Dashboard look similar to the Whiskermenu of the XFCE desktop environment. Features icons, shortcut buttons, app search, and quick access to your OS ID.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.setDashboard(\'whisker\')">Select Whisker Dashboard</button>'}
                    }
                },
                noraa: {
                    folder: 0,
                    folderName: 'NORAA',
                    folderPath: 'apps.settings.vars.menus.noraa',
                    image: 'settingIcons/new/noraa.png',
                    advHelp: {
                        option: 'Advanced Help Pages',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(apps.settings.vars.noraHelpTopics)">' + numtf(apps.settings.vars.noraHelpTopics) + '</span>.<br>' +
                            'NORAA returns more advanced help pages when you ask for OS help, instead of plain text.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togNoraListen()">Toggle</button>'}
                    },
                    listen: {
                        option: 'NORAA Listening',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="numEnDis(parseInt(apps.settings.vars.currNoraListening))">' + numtf(apps.settings.vars.currNoraListening) + '</span>.<br>' +
                            'NORAA listens for you to say a specified phrase that will activate him.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.togNoraListen()">Toggle</button>'}
                    },
                    listenFor: {
                        option: 'Listening Phrase',
                        description: function(){return 'This is the phrase that NORAA listens for you to say, if enabled.'},
                        buttons: function(){return '<input id="STNnoraphrase" placeholder="listen computer" value="' + apps.settings.vars.currNoraPhrase + '"> <button onclick="apps.settings.vars.togNoraPhrase()">Set</button>'}
                    },
                    speechDelay: {
                        option: 'Speech Input Delay',
                        description: function(){return 'This is the time, in milliseconds, that NORAA gives you to cancel a command, when speaking to him. Useful for if NORAA did not hear you correctly.'},
                        buttons: function(){return '<input id="STNnoraDelay" value="' + apps.nora.vars.inputDelay + '"> <button onclick="apps.settings.vars.NORAAsetDelay()">Set</button>'}
                    },
                    voices: {
                        option: 'NORAA\'s Voice',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="apps.nora.vars.lang">' + apps.nora.vars.lang + '</span>. This is the voice NORAA uses to speak to you. Choose from one of the voices below that are supported by your browser.'},
                        buttons: function(){return apps.settings.vars.getVoicesForNORAA()}
                    }
                },
                smartIcons: {
                    folder: 0,
                    folderName: "Smart Icons",
                    folderPath: "apps.settings.vars.menus.smartIcons",
                    image: 'settingIcons/new/smartIcon_fg.png',
                    autoRedirectToApp: {
                        option: "Smart Icon Settings",
                        description: function(){return "Click below to open the Smart Icon Settings app."},
                        buttons: function(){
                            c(function(){
                                openapp(apps.smartIconSettings, 'dsktp');
                                apps.settings.vars.showMenu(apps.settings.vars.menus);
                            });
                            return '<button onclick="openapp(apps.smartIconSettings, \'dsktp\')">Smart Icon Settings</button>'
                        }
                    }
                    
                },
                clipboard: {
                    folder: 0,
                    folderName: 'Clipboard',
                    folderPath: 'apps.settings.vars.menus.clipboard',
                    image: 'settingIcons/new/clipboard.png',
                    size: {
                        option: 'Clipboard Slots',
                        description: function(){return 'Current: <span class="liveElement" data-live-eval="textEditorTools.slots">' + textEditorTools.slots + '</span>.<br>' +
                            'Number of slots in your clipboard. An excessively large clipboard may be difficult to manage and can cause context menu scrollbars.'},
                        buttons: function(){return '<input id="STNclipboardSlots"> <button onclick="apps.settings.vars.setClipboardSlots(getId(\'STNclipboardSlots\').value)">Set</button>'}
                    },
                    clear: {
                        option: 'Clear Clipboard',
                        description: function(){return 'Clear the persistent keyboard of aOS. Useful for if you have a cluttered clipboard. If you do not copy anything to the clipboard until you shut down, then the next time you boot aOS, the clipboard will be empty. Think of this as a fallback for if clicking this button was an accident. Just copy something to the clipboard and nothing will disappear. It is also one last chance to use the stuff you have copied before it is cleared.'},
                        buttons: function(){return '<button onclick="ufsave(\'aos_system/clipboard\', \'_cleared_clipboard_\');">Clear</button>'}
                    }
                },
                screensaver: {
                    folder: 0,
                    folderName: "Screen Saver",
                    folderPath: "apps.settings.vars.menus.screensaver",
                    image: 'settingIcons/new/screensaver.png',
                    enable: {
                        option: "Enable Screen Saver",
                        description: function(){return "Current: " + numtf(apps.settings.vars.screensaverEnabled) + ".<br>" +
                            "This is an animation or other screen that appears when you're away from your computer."},
                        buttons: function(){return '<button onclick="apps.settings.vars.togScreensaver()">Toggle</button>'}
                    },
                    time: {
                        option: "Time to Wait",
                        description: function(){return "Current: " + (apps.settings.vars.screensaverTime / 1000 / 1000 / 60) + ".<br>" +
                            "This is the time in minutes that aOS waits to activate the screensaver."},
                        buttons: function(){return '<input id="STNscreensaverTime"> <button onclick="apps.settings.vars.setScreensaverTime(parseFloat(getId(\'STNscreensaverTime\').value) * 1000 * 1000 * 60)">Set</button>'}
                    },
                    type: {
                        option: "Type of Screensaver",
                        description: function(){return 'Current: ' + apps.settings.vars.currScreensaver + ".<br>" +
                            "This is the type of screensaver that aOS will display."},
                        buttons: function(){return apps.settings.vars.grabScreensavers()}
                    },
                    blocks: {
                        option: "Screensaver Blockers",
                        description: function(){return "If the screensaver is being blocked temporarily, the handles used to do so are displayed below. If you wish, you can click one to delete it, though this may lead to unexpected behavior."},
                        buttons: function(){
                            apps.settings.vars.screensaverBlockNames = [];
                            var tempCount = [];
                            var tempStr = '';
                            for(var i in screensaverBlocks){
                                var tempInd = apps.settings.vars.screensaverBlockNames.indexOf(screensaverBlocks[i]);
                                if(tempInd > -1){
                                    tempCount[tempInd]++;
                                }else{
                                    apps.settings.vars.screensaverBlockNames.push(screensaverBlocks[i]);
                                    tempCount.push(1);
                                }
                            }
                            for(var i in tempCount){
                                tempStr += "<button onclick='unblockScreensaver(apps.settings.vars.screensaverBlockNames[" + i + "]);apps.settings.vars.showMenu(apps.settings.vars.menus.screensaver)'>" + apps.settings.vars.screensaverBlockNames[i] + ": " + tempCount[i] + "</button> ";
                            }
                            return tempStr;
                        }
                    }
                },
                language: {
                    folder: 0,
                    folderName: 'Language',
                    folderPath: 'apps.settings.vars.menus.language',
                    image: 'settingIcons/new/language.png',
                    currentLanguage: {
                        option: 'Current Language',
                        description: function(){return 'Current: ' + languagepacks[(currentlanguage || 'en')] + '.'},
                        buttons: function(){return 'You must reboot aOS for language changes to take effect.'}
                    },
                    changeLanguage: {
                        option: 'Change language',
                        description: function(){return 'Click a button, then restart aOS to change the language.'},
                        buttons: function(){return apps.settings.vars.getTextLanguages()}
                    },
                    credits: {
                        option: 'Translation Credits',
                        description: function(){return 'I got a lot of help with translating aOS from volunteers. So far, here\'s the people who\'ve helped me out.'},
                        buttons: function(){return 'US English: Me, of course. This is the native language of aOS.<br>Chinese: Noah McDermott (noahmcdaos@gmail.com).'}
                    }
                },
                advanced: {
                    folder: 0,
                    folderName: 'Advanced',
                    folderPath: 'apps.settings.vars.menus.advanced',
                    image: 'settingIcons/new/advanced.png',
                    trustedApps: {
                        option: 'Trusted Apps',
                        description: function(){return 'This is a list of all external apps that you have allowed to use permissions on aOS. The list is JSON-encoded.';},
                        buttons: function(){return '<textarea id="STN_trusted_apps" style="white-space:nowrap;width:75%;height:8em">' + (ufload("aos_system/apps/webAppMaker/trusted_apps") || JSON.stringify(apps.webAppMaker.vars.trustedApps, null, 2)) + '</textarea><button onclick="ufsave(\'aos_system/apps/webAppMaker/trusted_apps\', getId(\'STN_trusted_apps\').value);apps.webAppMaker.vars.reflectPermissions();">Set</button>'}
                    },
                    reset: {
                        option: 'Reset aOS',
                        description: function(){return 'If you wish, you can completely reset aOS. This will give you a new OS ID, which will have the effect of removing all of your files. Your old files will still be preserved, so you can ask the developer for help if you mistakenly reset aOS. If you wish for your old files to be permanently removed, please contact the developer.'},
                        buttons: function(){return '<button onclick="apps.settings.vars.resetOS()">Reset aOS</button>'}
                    }
                },
                oldMenu: {
                    folder: 0,
                    folderName: 'Old Menu',
                    folderPath: '\'oldMenu\'',
                    image: 'settingIcons/beta/OldMenu.png'
                },
            },
            showMenu: function(menu){
                if(menu === 'oldMenu'){
                    openapp(apps.settings, 'oldMenu');
                }else{
                    apps.settings.appWindow.setContent(
                        '<div id="STNmenuDiv" style="font-family:aosProFont, monospace;font-size:12px;width:calc(100% - 3px);height:100%;overflow:auto">' +
                        '<p id="STNmenuTitle" style="font-size:36px;margin:8px;">' + menu.folderName +
                        '<button id="STNhomeButton" onclick="apps.settings.vars.showMenu(apps.settings.vars.menus)" style="float:left;margin:8px;top:8px;left:0;position:absolute;display:none;">Home</button>' +
                        '</p><br></div>'
                    );
                    //if(menu.folder === 1){
                        getId("STNmenuDiv").innerHTML += '<div id="STNmenuTable" style="width:100%;position:relative;"></div>';
                        //var j = 0;
                        var appendStr = '';
                        for(var i in this.menus){
                            if(i !== 'folder' && i !== 'folderName' && i !== 'folderPath' && i !== 'image' && i !== 'oldMenu'){
                                //if(j % 3 === 0 && j !== 0){
                                //    appendStr += '</tr><tr class="STNtableTR">';
                                //}
                                if(this.menus[i].image){
                                    appendStr += '<div class="STNtableTD cursorPointer" onclick="apps.settings.vars.showMenu(' + this.menus[i].folderPath + ')"><img src="' + this.menus[i].image + '" style="margin-bottom:-12px;width:32px;height:32px;margin-right:3px;' + darkSwitch('', 'filter:invert(1);') + '"> ' + this.menus[i].folderName + '</div>';
                                }else{
                                    appendStr += '<div class="STNtableTD cursorPointer" onclick="apps.settings.vars.showMenu(' + this.menus[i].folderPath + ')"><div style="margin-bottom:-12px;width:32px;height:32px;margin-right:3px;position:relative;display:inline-block;"></div> ' + this.menus[i].folderName + '</div>';
                                }
                                //j++;
                            }
                        }
                        getId('STNmenuTable').innerHTML += appendStr;
                    //}else{
                    if(!menu.folder){
                        getId('STNmenuTable').style.width = '225px';
                        getId('STNmenuTable').style.position = 'absolute';
                        getId('STNmenuTable').style.height = 'calc(100% - 64px)';
                        getId('STNmenuTable').style.bottom = '0';
                        getId('STNmenuTable').style.overflowY = 'auto';
                        getId('STNmenuTitle').style.marginLeft = '232px';
                        if(menu !== this.menus){
                            getId('STNhomeButton').style.display = 'block';
                        }
                        getId('STNmenuDiv').innerHTML += '<div id="STNcontentDiv" style="width:calc(100% - 232px);padding-top:5px;right:0;bottom:0;height:calc(100% - 69px);overflow-y:auto;"></div>';
                        for(var i in menu){
                            if(i !== 'folder' && i !== 'folderName' && i !== 'folderPath' && i !== 'image'){
                                getId('STNcontentDiv').innerHTML += '<span style="font-size:24px">' + menu[i].option +
                                    '</span><br><br>' + menu[i].description() +
                                    '<br><br>' + menu[i].buttons() + '<br><br><br>';
                            }
                        }
                    }
                    //}
                }
            },
            availableBackgrounds: [
                'images/beta1.png',
                'images/p.png',
                'images/bgBeta.png',
                'images/p-bin.png',
                'images/p-phonebin_1.png'
            ],
            screensaverBlockNames: [],
            corsProxy: 'https://cors-anywhere.herokuapp.com/',
            saveRes: function(newX, newY){
                ufsave('aos_system/apps/settings/saved_screen_res', newX + '/' + newY);
                fitWindowRes(newX, newY);
            },
            togDirtyLoad: function(){
                dirtyLoadingEnabled = -1 * dirtyLoadingEnabled + 1;
                apps.savemaster.vars.save('aos_system/apps/settings/ugly_boot', dirtyLoadingEnabled, 1);
            },
            resetOS: function(){
                apps.prompt.vars.confirm('<h1>STOP</h1><br><br>Please confirm with absolute certainty that you wish to RESET AaronOS.', ['<h1>CANCEL</h1>', '<h1 style="color:#F00">RESET</h1>'], function(btn){if(btn){
                    apps.prompt.vars.prompt('<h1>HOLD UP</h1><br><br>I don\'t think hitting a button is easy enough, so please follow these instructions:<br><br>Type EXACTLY "Reset AaronOS" into the field below.<br>Press the button and aOS will be reset.<br>If you do not type exactly "Reset AaronOS", then aOS will not reset.', 'RESET', function(str){if(str === 'Reset AaronOS'){
                        document.cookie = 'keyword=; Max-Age=-99999999;';
                        window.location = 'aosBeta.php';
                    }}, 'AaronOS');
                }}, 'Settings');
            },
            captionButtonsLeft: 0,
            togCaptionButtonsLeft: function(nosave){
                if(this.captionButtonsLeft){
                    document.getElementById("desktop").classList.remove("leftCaptionButtons");
                    this.captionButtonsLeft = 0;
                }else{
                    document.getElementById("desktop").classList.add("leftCaptionButtons");
                    this.captionButtonsLeft = 1;
                }
                if(!nosave){
                    ufsave('aos_system/windows/controls_on_left', this.captionButtonsLeft);
                }
            },
            setClipboardSlots: function(newSlots, nosave){
                textEditorTools.slots = newSlots;
                textEditorTools.updateSlots();
                if(!nosave){
                    ufsave('aos_system/clipboard_slots', newSlots);
                }
            },
            setDashboard: function(dashboardName){
                apps.startMenu.vars.listOfApps = '';
                apps.startMenu.vars.appElems = null;
                ufsave('aos_system/apps/startMenu/dashboard', dashboardName);
            },
            setScale: function(newScale, nosave){
                window.screenScale = parseFloat(newScale);
                fitWindow();
                if(!nosave){
                    ufsave('aos_system/apps/settings/ui_scale', newScale);
                }
            },
            togDarkMode: function(nosave){
                if(darkMode){
                    darkMode = 0;
                    document.body.classList.remove('darkMode');
                }else{
                    darkMode = 1;
                    document.body.classList.add('darkMode');
                }
                apps.settings.vars.updateFrameStyles();
                if(!nosave){
                    ufsave('aos_system/windows/dark_mode', darkMode);
                }
            },
            updateFrameStyles: function(){
                var allFrames = document.getElementsByTagName("iframe");
                for(var i = 0; i < allFrames.length; i++){
                    try{
                        if(allFrames[i].getAttribute("data-parent-app")){
                            allFrames[i].contentWindow.postMessage({
                                type: "response",
                                content: "Update style information",
                                conversation: "aosTools_Subscribed_Style_Update"
                            });
                        }
                    }catch(err){
                        doLog("Error updating frame for " + allFrames[i].getAttribute("data-parent-app"), "#F00");
                        doLog(err, "#F00");
                    }
                }
            },
            setMobileMode: function(type, nosave){
                if(type == 1){
                    setMobile(1);
                    autoMobile = 0;
                }else if(type == 2){
                    autoMobile = 1;
                }else{
                    setMobile(0);
                    autoMobile = 0;
                }
                if(!nosave){
                    ufsave('aos_system/apps/settings/mobile_mode', type);
                }
                checkMobileSize();
            },
            liveBackgroundEnabled: 0,
            liveBackgroundURL: '',
            prxlBackgroundEnabled: 0,
            prlxBackgroundURLs: 'images/p1.png,images/p2.png,images/p3.png,images/p4.png',
            prlxBackgroundUsable: 0,
            togLiveBg: function(nosave){
                if(apps.settings.vars.prlxBackgroundEnabled){
                    apps.settings.vars.togPrlxBg();
                }
                if(apps.settings.vars.liveBackgroundEnabled){
                    apps.settings.vars.liveBackgroundEnabled = 0;
                    getId('liveBackground').style.display = 'none';
                    getId('liveBackground').src = '';
                }else{
                    apps.settings.vars.liveBackgroundEnabled = 1;
                    getId('liveBackground').style.display = 'block';
                    getId('liveBackground').src = apps.settings.vars.liveBackgroundURL;
                }
                if(!nosave){
                    ufsave('aos_system/desktop/background_live_enabled', apps.settings.vars.liveBackgroundEnabled);
                }
            },
            setLiveBg: function(newURL, nosave){
                apps.settings.vars.liveBackgroundURL = newURL;
                if(apps.settings.vars.liveBackgroundEnabled){
                    getId('liveBackground').src = newURL;
                }
                if(!nosave){
                    ufsave('aos_system/desktop/background_live_url', newURL);
                }
            },
            togPrlxBg: function(nosave){
                if(apps.settings.vars.liveBackgroundEnabled){
                    apps.settings.vars.togLiveBg();
                }
                if(apps.settings.vars.prlxBackgroundEnabled){
                    apps.settings.vars.prlxBackgroundEnabled = 0;
                    getId('prlxBackground').style.display = 'none';
                    getId('prlxBackground').src = '';
                }else{
                    apps.settings.vars.prlxBackgroundEnabled = 1;
                    getId('prlxBackground').style.display = 'block';
                    getId('prlxBackground').src = 'prlxBg.php?img=' + encodeURIComponent(apps.settings.vars.prlxBackgroundURLs) + '#0,0';
                }
                if(!nosave){
                    ufsave('aos_system/desktop/background_parallax_enabled', apps.settings.vars.prlxBackgroundEnabled);
                }
            },
            setPrlxBg: function(newURL, nosave){
                apps.settings.vars.prlxBackgroundURLs = newURL;
                if(apps.settings.vars.prlxBackgroundEnabled){
                    getId('prlxBackground').src = 'prlxBg.php?img=' + encodeURIComponent(newURL) + '#0,0';
                }
                if(!nosave){
                    apps.savemaster.vars.save('aos_system/desktop/background_parallax_layers', newURL, 1);
                }
            },
            prlxBackgroundUpdate: function(){
                getId('prlxBackground').src = getId('prlxBackground').src.split('#')[0] + '#' + lastPageX + ',' + lastPageY;
            },
            tmpPasswordSet: '',
            newPassword: function(){
                apps.savemaster.vars.save('aOSpassword', getId('STNosPass').value, 1, 'SET_PASSWORD');
                USERFILES.aOSpassword = '*****';
                var tmpPasswordSet = getId('STNosPass').value;
                setTimeout(() => {
                    var passxhr = new XMLHttpRequest();
                    passxhr.onreadystatechange = () => {
                        if(passxhr.readyState === 4){
                            if(passxhr.status === 200){
                                if(passxhr.responseText !== "REJECT"){
                                    document.cookie = 'logintoken=' + passxhr.responseText;
                                    apps.prompt.vars.notify("Password set successfully.", ["Okay"], function(){}, "Settings", "appicons/ds/STN.png");
                                }else{
                                    apps.prompt.vars.alert("There was an issue setting your password. Try again.<br>" + passxhr.responseText, "Okay", function(){}, "Settings");
                                }
                            }else{
                                apps.prompt.vars.alert("There was an issue setting your password. (net error " + passxhr.status + ") Try again.<br>" + passxhr.status, "Okay", function(){}, "Settings");
                            }
                        }
                    }
                    passxhr.open('POST', 'checkPassword.php');
                    var passfd = new FormData();
                    passfd.append('pass', tmpPasswordSet);
                    passxhr.send(passfd);
                    //apps.settings.vars.tmpPasswordSet = "";
                }, 1000);
                getId("STNosPass").value = "";
            },
            calcFLOPS: function(){
                var intOps = 0;
                var fltOps = 0.0;
                var strOps = "";
                var firstTime = performance.now();
                //var currSec = formDate('S');
                //while(currSec === formDate('S')){
                //    
                //}
                //currSec = formDate('S');
                //while(currSec === formDate('S')){
                while(performance.now() - firstTime <= 1000){
                    intOps += 1;
                }
                //currSec = formDate('S');
                //while(currSec === formDate('S')){
                while(performance.now() - firstTime <= 2000){
                    fltOps += 0.1;
                }
                //currSec = formDate('S');
                //while(currSec === formDate('S')){
                while(performance.now() - firstTime <= 3000){
                    strOps += "A";
                }
                fltOps = Math.floor(fltOps * 10);
                strOps = strOps.length;
                apps.prompt.vars.alert("Operations Per Second:<br>Note: This value may be inaccurate due to counting time<br><br>Integer OPS: " + numberCommas(intOps) + "<br>Floating Point OPS: " + numberCommas(fltOps) + "<br>String OPS: " + numberCommas(strOps), 'OK', function(){}, 'Settings');
            },
            longTap: 0,
            longTapTime: 500000,
            togLongTap: function(nosave){
                this.longTap = -1 * this.longTap + 1;
                if(!nosave){
                    ufsave('aos_system/apps/settings/ctxmenu_two_fingers', this.longTap);
                }
            },
            clickToMove: 0,
            togClickToMove: function(){
                this.clickToMove = -1 * this.clickToMove + 1;
            },
            togNoraHelpTopics: function(nosave){
                this.noraHelpTopics = this.noraHelpTopics * -1 + 1;
                if(!nosave){
                    ufsave('aos_system/noraa/adv_help_enabled', this.noraHelpTopics);
                }
            },
            noraHelpTopics: 1,
            collectData: 0,
            currVoiceStr: '',
            currLangStr: '',
            currNoraPhrase: 'listen computer',
            currNoraListening: "0",
            togNoraListen: function(nosave){
                if(this.currNoraListening === "1"){
                    //stop nora's listening
                    this.currNoraListening = "0";
                    apps.nora.vars.stopContRecog();
                    if(!nosave){
                        ufsave('aos_system/noraa/listen_enabled', this.currNoraListening);
                    }
                }else{
                    //start nora's listening
                    this.currNoraListening = "1";
                    apps.nora.vars.startContRecog();
                    if(!nosave){
                        ufsave('aos_system/noraa/listen_enabled', this.currNoraListening);
                    }
                }
            },
            togNoraPhrase: function(nosave){
                this.currNoraPhrase = getId('STNnoraphrase').value;
                if(!nosave){
                    ufsave('aos_system/noraa/listen_phrase', this.currNoraPhrase);
                }
            },
            setDebugLevel: function(level){
                dbgLevel = level;
            },
            winBorder: 3,
            setWinBorder: function(newValue, nosave){
                this.winBorder = parseInt(newValue);
                getId('windowBorderStyle').innerHTML = '#monitor{--windowBorderWidth:' + this.winBorder + 'px;}';
                if(!nosave){
                    ufsave('aos_system/windows/border_width', this.winBorder);
                }
            },
            dataCampaigns: [
                [
                    'Example Campaign <i>(not real)</i>',
                    ['Session Error Logs', 'Feature Usage Statistics', 'Other useful stuff']
                ]
            ],
            getDataCampaigns: function(){
                if(this.dataCampaigns.length > 0){
                    var str = "";
                    for(var i in this.dataCampaigns){
                        str += '<br>' + this.dataCampaigns[i][0];
                        for(var j in this.dataCampaigns[i][1]){
                            str += '<br>-&nbsp;' + this.dataCampaigns[i][1][j];
                        }
                    }
                    str += '<br>';
                    return str;
                }else{
                    return '<i>None found.</i><br>';
                }
            },
            FILcanWin: 0,
            togFILwin: function(){
                if(this.FILcanWin){
                    this.FILcanWin = 0;
                }else{
                    this.FILcanWin = 1;
                }
                ufsave("aos_system/apps/files/window_debug", '' + this.FILcanWin);
            },
            enabWinImg: 1,
            currWinImg: 'images/winimg.png',
            togWinImg: function(nosave){
                perfStart('settings');
                if(this.enabWinImg){
                    this.tempArray = document.getElementsByClassName("winBimg");
                    for(var elem = 0; elem < this.tempArray.length; elem++){
                        this.tempArray[elem].style.display = "none";
                    }
                    this.enabWinImg = 0;
                    if(!nosave){
                        ufsave("aos_system/windows/border_texture_enabled", "0");
                    }
                }else{
                    this.tempArray = document.getElementsByClassName("winBimg");
                    for(var elem = 0; elem < this.tempArray.length; elem++){
                        this.tempArray[elem].style.display = "block";
                    }
                    this.enabWinImg = 1;
                    if(!nosave){
                        ufsave("aos_system/windows/border_texture_enabled", "1");
                    }
                }
                d(1, perfCheck('settings') + '&micro;s to toggle windowbgimg');
            },
            setWinImg: function(nosave){
                perfStart('settings');
                this.currWinImg = getId('STNwinImgInput').value;
                this.tempArray = document.getElementsByClassName("winBimg");
                for(var elem = 0; elem < this.tempArray.length; elem++){
                    this.tempArray[elem].style.backgroundImage = 'url(' + this.currWinImg + ')';
                }
                if(!nosave){
                    ufsave("aos_system/windows/border_texture", this.currWinImg);
                }
                d(1, perfCheck('settings') + '&micro;s to set windowbgimg');
            },
            getTextLanguages: function(){
                this.currLangStr = '';
                for(var i in languagepacks){
                    this.currLangStr += '<button onclick="currentlanguage = \'' + i + '\';ufsave(\'aos_system/language\', \'' + i + '\')">' + languagepacks[i] + '</button> ';
                }
                return this.currLangStr;
            },
            getVoicesForNORAA: function(){
                this.currVoiceStr = '';
                if(apps.nora.vars.voices !== []){
                    for(var i in apps.nora.vars.voices){
                        this.currVoiceStr += '<button onclick="apps.nora.vars.lang = \'' + apps.nora.vars.voices[i].name + '\';window.speechSynthesis.onvoiceschanged();apps.settings.vars.saveNORAAvoice()">' + apps.nora.vars.voices[i].name + '</button> ';
                    }
                    return this.currVoiceStr;
                }else{
                    return '<i>Voices not available - try reopening Settings</i>';
                }
            },
            saveNORAAvoice: function(){
                ufsave('aos_system/noraa/speech_voice', apps.nora.vars.lang);
            },
            NORAAsetDelay: function(nosave){
                apps.nora.vars.inputDelay = parseInt(getId('STNnoraDelay').value, 10);
                if(!nosave){
                    ufsave('aos_system/noraa/speech_response_delay', apps.nora.vars.inputDelay);
                }
            },
            tempArray: [],
            performanceMode: 0,
            togPerformanceMode: function(nosave){
                this.performanceMode = -1 * this.performanceMode + 1;
                if(!nosave){
                    ufsave('aos_system/apps/settings/performance_mode', this.performanceMode);
                }
                tskbrToggle.perfMode = this.performanceMode;
                if(this.performanceMode){
                    getId('monitor').style.imageRendering = 'pixelated';
                    getId('windowFrameOverlay').style.background = 'rgba(255, 255, 255, 0.1)';
                    getId('windowFrameOverlay').style.outline = '1px solid #000';
                    getId('windowFrameOverlay').style.boxShadow = 'inset 0 0 0 1px #FFF';
                    getId('windowFrameOverlay').style.borderRadius = '0';
                }else{
                    getId('monitor').style.imageRendering = '';
                    getId('windowFrameOverlay').style.background = '';
                    getId('windowFrameOverlay').style.outline = '';
                    getId('windowFrameOverlay').style.boxShadow = '';
                    getId('windowFrameOverlay').style.borderRadius = '';
                }
            },
            bgFit: 'cover',
            setBgFit: function(newFit, nosave){
                this.bgFit = newFit;
                if(!nosave){
                    ufsave("aos_system/desktop/background_fit", newFit);
                }
                try{
                    updateBgSize();
                }catch(err){
                    
                }
            },
            getWidgetList: function(){
                var nodes = getId('time').childNodes;
                var str = '<li>';
                for(var i = 0; i < nodes.length; i++){
                    str += widgets[nodes[i].getAttribute('data-widget-name')].name + '</li><li>';
                }
                return str + '</li>';
            },
            getWidgetButtons: function(){
                var str = '';
                for(var i in widgets){
                    //str += widgets[nodes[i].getAttribute('data-widget-name')].name + '</li><li>';
                    if(widgets[i].place === -1){
                        str += '<button onclick="addWidget(\'' + widgets[i].codeName + '\');apps.settings.vars.showMenu(apps.settings.vars.menus.taskbar);">Add ' + widgets[i].name + ' Widget</button><br>';
                    }else{
                        str += '<button onclick="removeWidget(\'' + widgets[i].codeName + '\');apps.settings.vars.showMenu(apps.settings.vars.menus.taskbar);">Remove ' + widgets[i].name + ' Widget</button><br>';
                    }
                }
                return str + '';
            },
            checkScreensaver: function(){
                if(apps.settings.vars.screensaverEnabled && !screensaverRunning && screensaverBlocks.length === 0){
                    if(perfCheck('userActivity') > apps.settings.vars.screensaverTime){
                        getId('screensaverLayer').style.display = "block";
                        apps.settings.vars.screensavers[apps.settings.vars.currScreensaver].start();
                        screensaverRunning = 1;
                    }
                }
            },
            screensaverTimer: 0,
            screensaverEnabled: 1,
            screensaverTime: 300000000,
            currScreensaver: "blast",
            screensavers: {
                blackScreen: {
                    name: "Black Screen",
                    selected: function(){
                        apps.prompt.vars.alert("Screensaver applied.<br>There are no configuration options for this screensaver.", "Okay.", function(){}, "Black Screen Screensaver");
                    },
                    start: function(){
                        getId('screensaverLayer').style.backgroundColor = "#000";
                        lastPageX = -200;
                        lastPageY = -200;
                    },
                    end: function(){
                        getId('screensaverLayer').style.backgroundColor = "";
                    }
                },
                blast: {
                    name: "AaronOS Blast",
                    selected: function(){
                        apps.prompt.vars.alert("Screensaver applied.<br>Configuration options are coming soon for this screensaver.", "Okay.", function(){}, "AaronOS Blast Screensaver");
                    },
                    start: function(){
                        getId('screensaverLayer').innerHTML = '<iframe src="blast/?noBackground=true&player=false&shipCount=10&zoom=0.5&shipLabels=false&scoreboard=false" style="pointer-events:none;border:none;width:100%;height:100%;display:block;position:absolute;left:0;top:0;"></iframe>';
                    },
                    end: function(){
                        getId('screensaverLayer').innerHTML = '';
                    }
                },
                phosphor: {
                    name: "Phosphor",
                    selected: function(){
                        apps.prompt.vars.alert("Screensaver applied.<br>There are no configuration options for this screensaver.", "Okay.", function(){}, "Phosphor Screensaver");
                    },
                    start: function(){
                        getId('screensaverLayer').style.backgroundColor = '#000';
                        getId('screensaverLayer').innerHTML = '<iframe src="scrsav/phosphor.html" style="pointer-events:none;border:none;width:100%;height:100%;display:block;position:absolute;left:0;top:0;"></iframe>';
                        apps.settings.vars.screensavers.phosphor.vars.enabled = 1;
                        apps.settings.vars.screensavers.phosphor.vars.moveCursors();
                    },
                    end: function(){
                        getId('screensaverLayer').style.backgroundColor = '';
                        getId('screensaverLayer').innerHTML = '';
                        apps.settings.vars.screensavers.phosphor.vars.enabled = 0;
                    },
                    vars: {
                        cursorsPosition: 0,
                        cursorsInterval: 0,
                        enabled: 0,
                        moveCursors: function(){
                            if(apps.settings.vars.screensavers.phosphor.vars.enabled){
                                lastPageX = Math.round(Math.random() * parseInt(getId('monitor').style.width) * 0.4);
                                if(apps.settings.vars.screensavers.phosphor.vars.cursorInterval){
                                    lastPageY = parseInt(getId('monitor').style.height) * 0.1;
                                    apps.settings.vars.screensavers.phosphor.vars.cursorInterval = 0;
                                }else{
                                    lastPageY = parseInt(getId('monitor').style.height) * 0.9;
                                    apps.settings.vars.screensavers.phosphor.vars.cursorInterval = 1;
                                }
                                window.setTimeout(apps.settings.vars.screensavers.phosphor.vars.moveCursors, 3000);
                            }
                        }
                    }
                },
                hue: {
                    name: "Hue",
                    selected: function(){
                        apps.prompt.vars.alert("Screensaver applied.<br>There are no configuration options for this screensaver.", "Okay.", function(){}, "Hue Screensaver");
                    },
                    start: function(){
                        apps.settings.vars.screensavers.hue.vars.currHue = 0;
                        apps.settings.vars.screensavers.hue.vars.canRun = 1;
                        requestAnimationFrame(apps.settings.vars.screensavers.hue.vars.setHue);
                    },
                    end: function(){
                        apps.settings.vars.screensavers.hue.vars.canRun = 0;
                    },
                    vars: {
                        currHue: 0,
                        setHue: function(){
                            if(apps.settings.vars.screensavers.hue.vars.canRun){
                                getId("monitor").style.filter = "hue-rotate(" + (apps.settings.vars.screensavers.hue.vars.currHue++) + "deg)";
                                setTimeout(apps.settings.vars.screensavers.hue.vars.setHue, 100);
                            }else{
                                getId("monitor").style.filter = "";
                            }
                        },
                        canRun: 0
                    }
                },
                randomColor: {
                    name: "Random Color",
                    selected: function(){
                        apps.prompt.vars.alert("Screensaver applied.<br>There are no configuration options for this screensaver.", "Okay.", function(){}, "Random Color Screensaver");
                    },
                    start: function(){
                        apps.settings.vars.screensavers.randomColor.vars.currColor = [127, 127, 127];
                        apps.settings.vars.screensavers.randomColor.vars.canRun = 1;
                        getId('screensaverLayer').style.transition = 'background-color 6s';
                        getId('screensaverLayer').style.transitionTimingFunction = 'linear';
                        apps.petCursors.vars.aggressiveChase = 1;
                        requestAnimationFrame(apps.settings.vars.screensavers.randomColor.vars.setColor);
                    },
                    end: function(){
                        apps.settings.vars.screensavers.randomColor.vars.canRun = 0;
                        apps.petCursors.vars.aggressiveChase = 0;
                        getId('screensaverLayer').style.backgroundColor = '';
                        getId('screensaverLayer').style.transition = '';
                        getId('screensaverLayer').style.transitionTimingFunction = 'linear';
                    },
                    vars: {
                        currColor: [127, 127, 127],
                        setColor: function(){
                            if(apps.settings.vars.screensavers.randomColor.vars.canRun){
                                apps.settings.vars.screensavers.randomColor.vars.currColor[0] = Math.floor(Math.random() * 256);
                                apps.settings.vars.screensavers.randomColor.vars.currColor[1] = Math.floor(Math.random() * 256);
                                apps.settings.vars.screensavers.randomColor.vars.currColor[2] = Math.floor(Math.random() * 256);
                                getId('screensaverLayer').style.backgroundColor = 'rgb(' + apps.settings.vars.screensavers.randomColor.vars.currColor[0] + ',' + apps.settings.vars.screensavers.randomColor.vars.currColor[1] + ',' + apps.settings.vars.screensavers.randomColor.vars.currColor[2] + ')';
                                lastPageX = Math.round(Math.random() * parseInt(getId('monitor').style.width) * 0.8 + parseInt(getId('monitor').style.width) * 0.1);
                                lastPageY = Math.round(Math.random() * parseInt(getId('monitor').style.height) * 0.8 + parseInt(getId('monitor').style.height) * 0.1);
                                setTimeout(apps.settings.vars.screensavers.randomColor.vars.setColor, 6000);
                            }
                        },
                        canRun: 0
                    }
                },
                bouncyBall: {
                    name: "Bouncy Ball",
                    selected: function(){
                        apps.prompt.vars.alert("Screensaver applied.<br>There are no configuration options for this screensaver.", "Okay.", function(){}, "Bouncy Ball Screensaver");
                    },
                    start: function(){
                        console.log('start');
                        apps.settings.vars.screensavers.bouncyBall.vars.scr = [parseInt(getId('monitor').style.width), parseInt(getId('monitor').style.height) - 30];
                        getId('screensaverLayer').innerHTML = '<canvas style="position:absolute;display:block;left:0;top:0" id="bbssCnv"></canvas>';
                        getId('bbssCnv').width = parseInt(getId('monitor').style.width);
                        getId('bbssCnv').height = parseInt(getId('monitor').style.height);
                        getId('bbssCnv').style.width = getId('monitor').style.width;
                        getId('bbssCnv').style.height = getId('monitor').style.height;
                        apps.settings.vars.screensavers.bouncyBall.vars.ctxFg = getId('bbssCnv').getContext('2d');
                        apps.settings.vars.screensavers.bouncyBall.vars.ball.vel = [0, 0];
                        apps.settings.vars.screensavers.bouncyBall.vars.canRun = 1;
                        requestAnimationFrame(apps.settings.vars.screensavers.bouncyBall.vars.frame);
                        apps.settings.vars.screensavers.bouncyBall.vars.resetBall();
                        apps.petCursors.vars.aggressiveChase = 1;
                    },
                    end: function(){
                        console.log('end');
                        apps.settings.vars.screensavers.bouncyBall.vars.canRun = 0;
                        apps.settings.vars.screensavers.bouncyBall.vars.ctxFg = null;
                        getId('screensaverLayer').innerHTML = '';
                        apps.petCursors.vars.aggressiveChase = 0;
                    },
                    vars: {
                        ctxFg: null,
                        scr: [0, 0],
                        canRun: 0,
                        ball: {
                            size: 0,
                            coord: [0, 0],
                            vel: [0, 0]
                        },
                        timer: 0,
                        frame: function(){
                            if(apps.settings.vars.screensavers.bouncyBall.vars.canRun){
                                if((Math.abs(apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[0]) + Math.abs(apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[1])) / 2 < 0.5){
                                    apps.settings.vars.screensavers.bouncyBall.vars.timer++;
                                    if(apps.settings.vars.screensavers.bouncyBall.vars.timer > 60){
                                        apps.settings.vars.screensavers.bouncyBall.vars.resetBall();
                                    }
                                }else{
                                    apps.settings.vars.screensavers.bouncyBall.vars.timer = 0;
                                }
                                apps.settings.vars.screensavers.bouncyBall.vars.ctxFg.clearRect(0, 0, apps.settings.vars.screensavers.bouncyBall.vars.scr[0], apps.settings.vars.screensavers.bouncyBall.vars.scr[1]);
                                apps.settings.vars.screensavers.bouncyBall.vars.ctxFg.beginPath();
                                apps.settings.vars.screensavers.bouncyBall.vars.ctxFg.arc(
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[0],
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[1],
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.size / 2,
                                    0, 2 * Math.PI, false
                                );
                                apps.settings.vars.screensavers.bouncyBall.vars.ctxFg.fill();
                                
                                apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[0] += apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[0];
                                apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[1] += apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[1];
                                if(
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[0] - apps.settings.vars.screensavers.bouncyBall.vars.ball.size / 2 < 0 ||
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[0] + apps.settings.vars.screensavers.bouncyBall.vars.ball.size / 2 > apps.settings.vars.screensavers.bouncyBall.vars.scr[0]
                                ){
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[0] -= apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[0];
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[0] = -0.8 * apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[0];
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[1] = 0.75 * apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[1];
                                }
                                if(
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[1] - apps.settings.vars.screensavers.bouncyBall.vars.ball.size / 2 < 0 ||
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[1] + apps.settings.vars.screensavers.bouncyBall.vars.ball.size / 2 > apps.settings.vars.screensavers.bouncyBall.vars.scr[1]
                                ){
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[1] -= apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[1];
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[0] = 0.9 * apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[0];
                                    apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[1] = -0.75 * apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[1];
                                }
                                apps.settings.vars.screensavers.bouncyBall.vars.ball.vel[1] += 0.098;
                                
                                lastPageX = apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[0];
                                lastPageY = apps.settings.vars.screensavers.bouncyBall.vars.ball.coord[1];
                                
                                requestAnimationFrame(apps.settings.vars.screensavers.bouncyBall.vars.frame);
                            }
                        },
                        resetBall: function(){
                            apps.settings.vars.screensavers.bouncyBall.vars.ball.size = Math.floor(Math.random() * 20) + 11;
                            apps.settings.vars.screensavers.bouncyBall.vars.ball.coord = [
                                apps.settings.vars.screensavers.bouncyBall.vars.scr[0] / 2,
                                apps.settings.vars.screensavers.bouncyBall.vars.scr[1] / 2
                            ];
                            apps.settings.vars.screensavers.bouncyBall.vars.ctxFg.fillStyle = 'rgb(' + (Math.floor(Math.random() * 255) + 1) + ',' + (Math.floor(Math.random() * 255) + 1) + ',' + (Math.floor(Math.random() * 255) + 1) + ')';
                            apps.settings.vars.screensavers.bouncyBall.vars.ball.vel = [
                                Math.floor(Math.random() * 80) - 39,
                                Math.floor(Math.random() * 80) - 39
                            ];
                        }
                    }
                },
                wikiRandom: {
                    name: "Random Wikipedia Page",
                    selected: function(){
                        apps.prompt.vars.confirm('Show the text "aOS ScreenSaver" on your wikipedia page?', ['No', 'Yes'], apps.settings.vars.screensavers.wikiRandom.vars.setSetting, 'Random Wikipedia ScreenSaver');
                    },
                    start: function(){
                        apps.settings.vars.screensavers.wikiRandom.vars.canRun = 1;
                        apps.settings.vars.screensavers.wikiRandom.vars.newPage();
                    },
                    end: function(){
                        apps.settings.vars.screensavers.wikiRandom.vars.canRun = 0;
                    },
                    vars: {
                        newPage: function(){
                            if(apps.settings.vars.screensavers.wikiRandom.vars.canRun){
                                getId('screensaverLayer').innerHTML = '';
                                if(ufload("aos_system/screensaver/wikirandom/logo_enabled") === '0'){
                                    getId('screensaverLayer').innerHTML = '<iframe src="https://en.wikipedia.org/wiki/Special:Random" style="pointer-events:none;border:none;width:100%;height:100%;"></iframe>';
                                }else{
                                    getId('screensaverLayer').innerHTML = '<iframe src="https://en.wikipedia.org/wiki/Special:Random" style="pointer-events:none;border:none;width:100%;height:100%;"></iframe><div style="top:10px;right:200px;font-size:108px;color:#557;font-family:aosProFont"><img src="appicons/ds/aOS.png" style="width:128px;height:128px"><i>Screensaver</i></div>';
                                }
                                setTimeout(apps.settings.vars.screensavers.wikiRandom.vars.canRun, 180000);
                            }
                        },
                        setSetting: function(btn){
                            ufsave('aos_system/screensaver/wikirandom/logo_enabled', String(btn));
                        }
                    }
                },
                pipes: {
                    name: "Pipes",
                    selected: function(){
                        apps.prompt.vars.alert("Screensaver applied.<br>There are no configuration options for this screensaver.<br><br>Screensaver made by Isaiah Odhner.", "Okay.", function(){}, "Pipes Screensaver");
                    },
                    start: function(){
                        getId('screensaverLayer').style.backgroundColor = '#000';
                        getId('screensaverLayer').innerHTML = '<iframe src="https://1j01.github.io/pipes/#%7B%22hideUI%22:true%7D" style="pointer-events:none;border:none;width:100%;height:100%;display:block;position:absolute;left:0;top:0;"></iframe>';
                    },
                    end: function(){
                        getId('screensaverLayer').style.backgroundColor = '';
                        getId('screensaverLayer').innerHTML = '';
                    }
                }
            },
            scnsavList: '',
            grabScreensavers: function(){
                this.scnsavList = '';
                for(var item in this.screensavers){
                    this.scnsavList += '<button onclick="apps.settings.vars.setScreensaver(\'' + item + '\')">' + this.screensavers[item].name + '</button> ';
                }
                return this.scnsavList;
            },
            togScreensaver: function(){
                this.screensaverEnabled = -1 * this.screensaverEnabled + 1;
                ufsave("aos_system/screensaver/enabled", this.screensaverEnabled);
            },
            setScreensaverTime: function(newTime){
                this.screensaverTime = newTime;
                ufsave("aos_system/screensaver/idle_time", this.screensaverTime);
            },
            setScreensaver: function(type){
                this.currScreensaver = type;
                this.screensavers[type].selected();
                ufsave("aos_system/screensaver/selected_screensaver", this.currScreensaver);
            },
            currWinColor: "rgba(150, 150, 200, 0.5)",
            currWinBlend: "screen",
            currWinblurRad: "5",
            isAero: 0,
            sB: function(nosave){
                perfStart('settings');
                getId('aOSloadingBg').style.backgroundImage = "url(" + getId('bckGrndImg').value + ")";
                getId("monitor").style.backgroundImage = "url(" + getId("bckGrndImg").value + ")";
                getId("bgSizeElement").src = getId("bckGrndImg").value;
                if(this.isAero){
                    this.tempArray = document.getElementsByClassName("winAero");
                    for(var elem = 0; elem < this.tempArray.length; elem++){
                        this.tempArray[elem].style.backgroundImage = "url(" + getId("bckGrndImg").value + ")";
                    }
                }
                if(!nosave){
                    ufsave("aos_system/desktop/background_image", getId("bckGrndImg").value);
                }
                try{
                    updateBgSize();
                }catch(err){
                    
                }
                d(1, perfCheck('settings') + '&micro;s to set background');
            },
            togAero: function(nosave){
                perfStart('settings');
                if(this.isAero){
                    this.tempArray = document.getElementsByClassName("winAero");
                    for(var elem = 0; elem < this.tempArray.length; elem++){
                        this.tempArray[elem].style.backgroundImage = "none";
                        this.tempArray[elem].style.backgroundBlendMode = "initial";
                        this.tempArray[elem].style.filter = "none";
                        this.tempArray[elem].style.webkitFilter = "none";
                    }
                    this.isAero = 0;
                    if(!nosave){
                        ufsave("aos_system/windows/blur_enabled", "0");
                    }
                }else{
                    if(this.isBackdrop){
                        this.togBackdropFilter(nosave);
                    }
                    this.tempArray = document.getElementsByClassName("winAero");
                    for(var elem = 0; elem < this.tempArray.length; elem++){
                        this.tempArray[elem].style.backgroundImage = getId("monitor").style.backgroundImage;
                        this.tempArray[elem].style.backgroundBlendMode = this.currWinBlend;
                        this.tempArray[elem].style.filter = "blur(" + this.currWinblurRad + "px)";
                        this.tempArray[elem].style.webkitFilter = "blur(" + this.currWinblurRad + "px)";
                    }
                    this.isAero = 1;
                    if(!nosave){
                        ufsave("aos_system/windows/blur_enabled", "1");
                    }
                }
                d(1, perfCheck('settings') + '&micro;s to toggle windowblur');
            },
            isBackdrop: 1,
            dispMapEffect: '',
            togDispMap: function(nosave){
                if(this.dispMapEffect){
                    this.dispMapEffect = "";
                    if(!nosave){
                        ufsave("aos_system/windows/distort_enabled", "0");
                    }
                }else{
                    this.dispMapEffect = " url(#svgblur)";
                    if(!nosave){
                        ufsave("aos_system/windows/distort_enabled", "1");
                    }
                }
                if(this.isBackdrop){
                    this.togBackdropFilter(1);
                    this.togBackdropFilter(1);
                }
            },
            togBackdropFilter: function(nosave){
                perfStart('settings');
                if(this.isBackdrop){
                    this.tempArray = document.getElementsByClassName("window");
                    for(var elem = 0; elem < this.tempArray.length; elem++){
                        this.tempArray[elem].style.webkitBackdropFilter = 'none';
                        this.tempArray[elem].style.backdropFilter = 'none';
                        getId(this.tempArray[elem].id.substring(0, this.tempArray[elem].id.length - 4) + "_img").style.backgroundPosition = "";
                    }
                    getId('taskbar').style.webkitBackdropFilter = 'none';
                    getId('taskbar').style.backdropFilter = 'none';
                    getId("tskbrBimg").style.backgroundPosition = "";
                    getId('ctxMenu').classList.remove('backdropFilterCtxMenu');
                    this.isBackdrop = 0;
                    if(!nosave){
                        ufsave("aos_system/windows/backdropfilter_blur", "0");
                    }
                }else{
                    if(this.isAero){
                        this.togAero(nosave);
                    }
                    this.tempArray = document.getElementsByClassName("window");
                    for(var elem = 0; elem < this.tempArray.length; elem++){
                        this.tempArray[elem].style.webkitBackdropFilter = 'blur(' + this.currWinblurRad + 'px)' + this.dispMapEffect;
                        this.tempArray[elem].style.backdropFilter = 'blur(' + this.currWinblurRad + 'px)' + this.dispMapEffect;
                        if(this.dispMapEffect){
                            getId(this.tempArray[elem].id.substring(0, this.tempArray[elem].id.length - 4) + "_img").style.backgroundPosition = "0 100%";
                        }
                    }
                    getId('taskbar').style.webkitBackdropFilter = 'blur(' + this.currWinblurRad + 'px)' + this.dispMapEffect;
                    getId('taskbar').style.backdropFilter = 'blur(' + this.currWinblurRad + 'px)' + this.dispMapEffect;
                    if(this.dispMapEffect){
                        getId("tskbrBimg").style.backgroundPosition = "0 100%";
                    }
                    getId('ctxMenu').classList.add('backdropFilterCtxMenu');
                    this.isBackdrop = 1;
                    if(!nosave){
                        ufsave("aos_system/windows/backdropfilter_blur", "1");
                    }
                }
                d(1, perfCheck('settings') + '&micro;s to toggle backdrop filter');
            },
            setWinColor: function(nosave, newcolor){
                perfStart('settings');
                if(newcolor){
                    this.currWinColor = newcolor;
                }else{
                    this.currWinColor = getId("STNwinColorInput").value;
                }
                this.tempArray = document.getElementsByClassName("winAero");
                for(var elem = 0; elem < this.tempArray.length; elem++){
                    this.tempArray[elem].style.backgroundColor = this.currWinColor;
                }
                if(!nosave){
                    ufsave("aos_system/windows/border_color", this.currWinColor);
                }
                d(1, perfCheck('settings') + '&micro;s to set window color');
            },
            setAeroRad: function(nosave){
                perfStart('settings');
                this.currWinblurRad = getId("STNwinblurRadius").value;
                getId("svgDisplaceMap").setAttribute("scale", this.currWinblurRad);
                if(this.isAero){
                    for(var elem = 0; elem < this.tempArray.length; elem++){
                        this.tempArray = document.getElementsByClassName("winAero");
                        this.tempArray[elem].style.webkitFilter = "blur(" + this.currWinblurRad + "px)";
                        this.tempArray[elem].style.filter = "blur(" + this.currWinblurRad + "px)";
                    }
                    getId("tskbrAero").style.webkitFilter = "blur(" + this.currWinblurRad + "px)";
                    getId("tskbrAero").style.filter = "blur(" + this.currWinblurRad + "px)";
                }
                if(this.isBackdrop){
                    this.tempArray = document.getElementsByClassName("window");
                    for(var elem = 0; elem < this.tempArray.length; elem++){
                        this.tempArray[elem].style.webkitBackdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
                        this.tempArray[elem].style.backdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
                    }
                    getId("taskbar").style.webkitBackdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
                    getId("taskbar").style.backdropFilter = "blur(" + this.currWinblurRad + "px)" + this.dispMapEffect;
                }
                if(!nosave){
                    ufsave("aos_system/windows/blur_radius", this.currWinblurRad);
                }
                d(1, perfCheck('settings') + '&micro;s to set windowblur radius');
            },
            setWinBlend: function(nosave){
                perfStart('settings');
                this.currWinBlend = getId("STNwinBlendInput").value;
                this.tempArray = document.getElementsByClassName("winAero");
                for(var elem = 0; elem < this.tempArray.length; elem++){
                    this.tempArray[elem].style.backgroundBlendMode = this.currWinBlend;
                }
                if(!nosave){
                    ufsave("aos_system/windows/blur_blendmode", this.currWinBlend);
                }
                d(1, perfCheck('settings') + '&micro;s to set window blend mode');
            },
            winFadeDistance: '0.5',
            setFadeDistance: function(newDist, nosave){
                this.winFadeDistance = newDist;
                for(var app in apps){
                    if(getId('win_' + apps[app].objName + '_top').style.opacity !== "1"){
                        getId('win_' + apps[app].objName + '_top').style.transform = 'scale(' + newDist + ')';
                        getId('win_' + apps[app].objName + '_top').style.opacity = '0';
                    }
                }
                if(!nosave){
                    ufsave("aos_system/windows/fade_distance", newDist);
                }
            },
            reqFullscreen: function(){
                (getId("monitor").requestFullscreen || getId("monitor").webkitRequestFullscreen || getId("monitor").mozRequestFullscreen)();
                window.setTimeout(fitWindowRes(screen.width, screen.height), 100);
            },
            endFullscreen: function(){
                document.webkitExitFullscreen();
                window.setTimeout(fitWindow, 100);
            },
            tempchKey: '',
            tempchPass: '',
            changeKey: function(){
                //this.tempchKey = prompt('What is the key of your target aOS system? Keep in mind that you need a password file (aOSpassword) set on the current OS to get back to it later. Press Cancel if you need to.');
                apps.prompt.vars.prompt('What is the key of your target aOS system?<br>Leave blank to cancel.<br>Make sure to leave a password on your current system or you may not be able to get back to it.', 'Submit', function(tmpChKey){
                    apps.settings.vars.tempchKey = tmpChKey;
                    if(apps.settings.vars.tempchKey !== ''){
                        //this.tempchPass = prompt('What is the password of your target aOS system? You still have a chance to press Cancel.');
                        apps.prompt.vars.prompt('What is the password of your target aOS system? You still have a chance to cancel, by leaving the field blank.<br>You may be asked to log in again afterwards.', 'Submit', function(tmpChPass){
                            apps.settings.vars.tempchPass = tmpChPass;
                            if(apps.settings.vars.tempchPass !== ''){
                                //document.cookie = 'password=' + tmpChPass + ';expires=2147483647';
                                window.location = '?changeKey=' + apps.settings.vars.tempchKey + '&changePass=' + apps.settings.vars.tempchPass;
                            }else{
                                apps.prompt.vars.alert('aOS-swap is cancelled.', 'Phew.', function(){}, 'Settings');
                            }
                        }, 'Settings', true);
                    }else{
                        apps.prompt.vars.alert('aOS-swap is cancelled.', 'Phew.', function(){}, 'Settings');
                    }
                }, 'Settings');
            },
            setTskbrPos: function(newPos, nosave){
                tskbrToggle.tskbrPos = newPos;
                getId("tskbrAero").style.backgroundPosition = "20px " + (-1 * parseInt(getId('monitor').style.height) + 52) + "px";
                getId("tskbrAero").style.width = parseInt(getId('monitor').style.width) + 40 + "px";
                getId("tskbrAero").style.height = '';
                getId('tskbrAero').style.transform = '';
                getId('tskbrAero').style.transformOrigin = '';
                switch(newPos){
                    case 0:
                        getId('desktop').style.left = '';
                        getId('desktop').style.top = '';
                        getId('desktop').style.width = getId('monitor').style.width;
                        getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
                        getId('taskbar').style.top = '';
                        getId('taskbar').style.left = '';
                        getId('taskbar').style.right = '';
                        getId('taskbar').style.bottom = '';
                        getId('taskbar').style.transform = '';
                        getId('taskbar').style.width = getId('monitor').style.width;
                        getId('windowFrameOverlay').style.transform = '';
                        break;
                    case 1:
                        getId('desktop').style.left = '';
                        getId('desktop').style.top = '32px';
                        getId('desktop').style.width = getId('monitor').style.width;
                        getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
                        getId('taskbar').style.top = '0';
                        getId('taskbar').style.left = '';
                        getId('taskbar').style.right = '';
                        getId('taskbar').style.bottom = 'auto';
                        getId('taskbar').style.transform = '';
                        getId('taskbar').style.width = getId('monitor').style.width;
                        getId('tskbrAero').style.backgroundPosition = "20px 20px";
                        getId('windowFrameOverlay').style.transform = 'translate(0, 32px)';
                        break;
                    case 2:
                        getId('desktop').style.left = '32px';
                        getId('desktop').style.top = '';
                        getId('desktop').style.width = parseInt(getId('monitor').style.width, 10) - 32 + "px";
                        getId('desktop').style.height = getId('monitor').style.height;
                        getId('taskbar').style.top = '0';
                        getId('taskbar').style.left = '';
                        getId('taskbar').style.right = '';
                        getId('taskbar').style.bottom = 'auto';
                        getId('taskbar').style.transform = 'rotate(90deg)';
                        getId('taskbar').style.width = getId('monitor').style.height;
                        getId('tskbrAero').style.backgroundPosition = "20px 20px";
                        getId('tskbrAero').style.transform = 'rotate(-90deg)';
                        getId('tskbrAero').style.width = '72px';
                        getId('tskbrAero').style.height = parseInt(getId('monitor').style.height) + 40 + "px";
                        getId('tskbrAero').style.transformOrigin = '35px 35px';
                        getId('windowFrameOverlay').style.transform = 'translate(32px, 0)';
                        break;
                    case 3:
                        getId('desktop').style.left = '';
                        getId('desktop').style.top = '';
                        getId('desktop').style.width = parseInt(getId('monitor').style.width, 10) - 32 + "px";
                        getId('desktop').style.height = getId('monitor').style.height;
                        getId('taskbar').style.top = '';
                        getId('taskbar').style.left = parseInt(getId('monitor').style.width, 10) - 32 + "px";
                        getId('taskbar').style.right = '';
                        getId('taskbar').style.bottom = '';
                        getId('taskbar').style.transform = 'rotate(-90deg)';
                        getId('taskbar').style.width = getId('monitor').style.height;
                        getId('tskbrAero').style.backgroundPosition = (-1 * parseInt(getId('monitor').style.width) + 52) + "px 20px";
                        getId('tskbrAero').style.transform = 'rotate(90deg) translateY(-' + (parseInt(getId('monitor').style.height) - 32) + 'px)';
                        getId('tskbrAero').style.width = '72px';
                        getId('tskbrAero').style.height = parseInt(getId('monitor').style.height) + 40 + "px";
                        getId('tskbrAero').style.transformOrigin = '35px 35px';
                        getId('windowFrameOverlay').style.transform = '';
                        break;
                    default:
                        apps.prompt.vars.alert('Error - unrecognised taskbar position format: ' + newPos, 'OK', function(){}, 'Settings');
                }
                if(!nosave){
                    ufsave('aos_system/taskbar/position', newPos);
                }
                try{
                    updateBgSize();
                }catch(err){
                    
                }
                openapp(apps.startMenu, 'srtup');
            },
            shutDown: function(arg, logout){
                //apps.savemaster.vars.save();
                if(arg === 'restart'){
                    apps.prompt.vars.confirm('Are you sure you wish to restart aOS?', ['No, Stay On', 'Yes, Restart'], function(btn){
                        if(btn){
                            getId('aOSisLoading').style.opacity = '0';
                            getId('aOSloadingBg').style.opacity = '0';
                            getId('aOSisLoading').style.transition = '1s';
                            getId('aOSisLoading').style.display = 'block';
                            getId('aOSloadingBg').style.display = 'block';
                            window.shutDownPercentComplete = 0;
                            window.shutDownTotalPercent = 1;
                            getId('aOSisLoading').innerHTML = '<div id="aOSisLoadingDiv"><h1>Restarting aOS</h1><hr><div id="aOSloadingInfoDiv"><div id="aOSloadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Shutting down...</div></div></div>';
                            // getId('aOSisLoading').style.cursor = cursors.loadLight;
                            getId('aOSisLoading').classList.remove('cursorLoadDark');
                            getId('aOSisLoading').classList.add('cursorLoadLight');
                            requestAnimationFrame(function(){
                                getId('aOSisLoading').style.opacity = '1';
                                getId('aOSloadingBg').style.opacity = '1';
                            });
                            window.setTimeout(function(){
                                //getId('aosLoadingImage').src = "/loadDark.gif";
                                // getId('aOSisLoading').style.cursor = cursors.loadDark;
                                getId('aOSisLoading').classList.remove('cursorLoadLight');
                                getId('aOSisLoading').classList.add('cursorLoadDark');
                                shutDownPercentComplete = codeToRun.length;
                                for(var app in apps){
                                    c(function(args){
                                        m('THERE WAS AN ERROR SHUTTING DOWN THE APP ' + args + '. SHUTDOWN SHOULD CONTINUE WITH NO ISSUE.');
                                        //getId('aOSloadingInfo').innerHTML = args;
                                        shutDownPercentComplete++;
                                        apps[args].signalHandler('shutdown');
                                    }, app);
                                }
                                shutDownTotalPercent = codeToRun.length - shutDownPercentComplete;
                                shutDownPercentComplete = 0;
                                c(function(){
                                    //apps.savemaster.vars.save();
                                    getId('aOSisLoading').innerHTML = '<div id="aOSisLoadingDiv"><h1>Restarting aOS</h1><hr><div id="aOSloadingInfoDiv"><div id="aOSloadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Goodbye!</div></div></div>';
                                    if(logout){
                                        document.cookie = "logintoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                                    }
                                    window.location = 'blackScreen.html#restart-beta';
                                });
                            }, 1005);
                        }
                    }, 'aOS');
                }else{
                    apps.prompt.vars.confirm('Are you sure you wish to shut down aOS?', ['No, Stay On', 'Yes, Shut Down'], function(btn){
                        if(btn){
                            getId('aOSisLoading').style.opacity = '0';
                            getId('aOSloadingBg').style.opacity = '0';
                            getId('aOSisLoading').style.transition = '1s';
                            getId('aOSisLoading').style.display = 'block';
                            getId('aOSloadingBg').style.display = 'block';
                            window.shutDownPercentComplete = 0;
                            window.shutDownTotalPercent = 1;
                            getId('aOSisLoading').innerHTML = '<div id="aOSisLoadingDiv"><h1>Shutting Down aOS</h1><hr><div id="aOSloadingInfoDiv"><div id="aOSloadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Shutting down...</div></div></div>';
                            // getId('aOSisLoading').style.cursor = cursors.loadLight;
                            getId('aOSisLoading').classList.remove('cursorLoadDark');
                            getId('aOSisLoading').classList.add('cursorLoadLight');
                            requestAnimationFrame(function(){
                                getId('aOSisLoading').style.opacity = '1';
                                getId('aOSloadingBg').style.opacity = '1';
                            });
                            window.setTimeout(function(){
                                //getId('aosLoadingImage').src = "/loadDark.gif";
                                // getId('aOSisLoading').style.cursor = cursors.loadDark;
                                getId('aOSisLoading').classList.remove('cursorLoadLight');
                                getId('aOSisLoading').classList.add('cursorLoadDark');
                                shutDownPercentComplete = codeToRun.length;
                                for(var app in apps){
                                    c(function(args){
                                        m('THERE WAS AN ERROR SHUTTING DOWN THE APP ' + args + '. SHUTDOWN SHOULD CONTINUE WITH NO ISSUE.');
                                        //getId('aOSloadingInfo').innerHTML = args;
                                        shutDownPercentComplete++;
                                        apps[args].signalHandler('shutdown');
                                    }, app);
                                }
                                shutDownTotalPercent = codeToRun.length - shutDownPercentComplete;
                                shutDownPercentComplete = 0;
                                c(function(){
                                    //apps.savemaster.vars.save();
                                    getId('aOSisLoading').innerHTML = '<div id="aOSisLoadingDiv"><h1>Shutting Down aOS</h1><hr><div id="aOSloadingInfoDiv"><div id="aOSloadingInfo" class="liveElement" data-live-eval="shutDownPercentComplete / shutDownTotalPercent * 100 + \'%\'" data-live-target="style.width">Goodbye!</div></div></div>';
                                    if(logout){
                                        document.cookie = "logintoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                                    }
                                    window.location = 'blackScreen.html#beta';
                                });
                            }, 1005);
                        }
                    }, 'aOS');
                }
            }
        }, 0, "settings", {
            backgroundColor: "#303947",
            foreground: "smarticons/settings/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    window.restartRequired = 0;
    window.requireRestart = function(){
        if(restartRequired !== 1){
            restartRequired = 1;
            apps.prompt.vars.notify("A change was made that requires a restart of AaronOS.", ["Restart", "Dismiss"], function(btn){
                if(btn === 0){
                    apps.settings.vars.shutDown('restart');
                }
                restartRequired = 2;
            }, "AaronOS", "appicons/ds/aOS.png");
        }
    }
    getId('aOSloadingInfo').innerHTML = 'Smart Icon Settings';
});
c(function(){
    apps.smartIconSettings = new Application(
        'SIS',
        'Smart Icon Settings',
        1,
        function(launchtype){
            this.appWindow.setCaption("Smart Icon Settings");
            this.appWindow.setDims("auto", "auto", 800, 600);
            this.appWindow.setContent(
                '<div style="position:relative;width:100%;height:256px;padding-top:10px;padding-bottom:10px;background:#000;box-shadow:0 0 5px #000;text-align:center;">' +
                buildSmartIcon(256, this.vars.aOSicon) + '&nbsp;' + buildSmartIcon(128, this.vars.aOSicon) + '&nbsp;' + buildSmartIcon(64, this.vars.aOSicon) + '&nbsp;' + buildSmartIcon(32, this.vars.aOSicon) +
                '</div>' +
                '<br><br>&nbsp;Border Radius:<br>' +
                '&nbsp;<input id="smartIconSettings_tl" value="' + smartIconOptions.radiusTopLeft + '" size="3" placeholder="100"> ' + '<div style="width:64px;position:relative;display:inline-block"></div> ' +
                '<input id="smartIconSettings_tr" value="' + smartIconOptions.radiusTopRight + '" size="3" placeholder="100">' + '<br>' +
                '&nbsp;<input id="smartIconSettings_bl" value="' + smartIconOptions.radiusBottomLeft + '" size="3" placeholder="100"> ' + buildSmartIcon(64, this.vars.aOSicon, 'margin-top:-1em') + ' ' +
                '<input id="smartIconSettings_br" value="' + smartIconOptions.radiusBottomRight + '" size="3" placeholder="100">' + '<br><br>' +
                '&nbsp;<button onclick="apps.smartIconSettings.vars.saveRadiuses()">Save</button> ' +
                '<button onclick="apps.smartIconSettings.vars.toggleBG()">Toggle Background</button><br><br>' +
                '<input id="smartIconSettings_bgcolor" value="' + smartIconOptions.bgColor + '" placeholder="color"> <button onclick="apps.smartIconSettings.vars.setColor()">Override Background Color</button>'
            );
            this.appWindow.paddingMode(0);
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    if(ufload("aos_system/smarticon_settings")){
                        smartIconOptions = JSON.parse(ufload("aos_system/smarticon_settings"));
                        updateSmartIconStyle();
                    }
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    console.log("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'This app is used to configure Smart Icons.',
            testSmartIconOriginal: {
                background: "smarticons/_template/shadowEdges.png",
                backgroundColor: "#FF7F00",
                backgroundBorder: {
                    thickness: 1,
                    color: "#009900"
                },
                foreground: "smarticons/_template/template_fg.png"
            },
            testSmartIcon: {
                backgroundColor: "#303947",
            	foreground: "smarticons/aOS/fg.png",
            	backgroundBorder: {
            		thickness: 2,
            		color: "#252F3A"
            	}
            },
            aOSicon: {
                backgroundColor: "#303947",
            	foreground: "smarticons/aOS/fg.png",
            	backgroundBorder: {
            		thickness: 2,
            		color: "#252F3A"
            	}
            },
            saveRadiuses: function(radiuses, nosave){
                if(radiuses){
                    var tempR = radiuses;
                    smartIconOptions.radiusTopLeft = tempR[0];
                    smartIconOptions.radiusTopRight = tempR[1];
                    smartIconOptions.radiusBottomLeft = tempR[2];
                    smartIconOptions.radiusBottomRight = tempR[3];
                    updateSmartIconStyle();
                }else{
                    var tempR = [
                        getId("smartIconSettings_tl").value, getId("smartIconSettings_tr").value,
                        getId("smartIconSettings_bl").value, getId("smartIconSettings_br").value
                    ];
                    smartIconOptions.radiusTopLeft = tempR[0];
                    smartIconOptions.radiusTopRight = tempR[1];
                    smartIconOptions.radiusBottomLeft = tempR[2];
                    smartIconOptions.radiusBottomRight = tempR[3];
                    updateSmartIconStyle();
                }
                if(!nosave){
                    saveSmartIconStyle();
                }
            },
            toggleBG: function(nosave){
                smartIconOptions.backgroundOpacity = Math.abs(smartIconOptions.backgroundOpacity - 1);
                updateSmartIconStyle();
                if(!nosave){
                    saveSmartIconStyle();
                }
            },
            setColor: function(color, nosave){
                if(color){
                    smartIconOptions.bgColor = color;
                    updateSmartIconStyle();
                }else{
                    smartIconOptions.bgColor = getId("smartIconSettings_bgcolor").value;
                    updateSmartIconStyle();
                }
                if(!nosave){
                    saveSmartIconStyle();
                }
            }
        }, 1, 'smartIconSettings', {
        	backgroundColor: "#303947",
        	foreground: "smarticons/aOS/fg.png",
        	backgroundBorder: {
        		thickness: 2,
        		color: "#252F3A"
        	}
        }
    );
    getId('aOSloadingInfo').innerHTML = 'Desktop Icon Maker';
})
c(function(){
    m('init icon maker');
    apps.iconMaker = new Application(
        'IcM',
        'Desktop Icon Maker',
        1,
        function(launchtype){
            if(launchtype.indexOf('newicon') === 0){
                this.newlaunch = launchtype.split(' ');
                this.appWindow.setDims("auto", "auto", 400, 500);
                this.appWindow.setCaption('Desktop Icon Maker');
                this.appWindow.setContent(
                    '<h1>New Icon</h1><hr>' +
                    '<span style="display:none">' +
                    'Horizontal tile position: <input id="IcMleft" value="' + (Math.round(this.newlaunch[1] / 108) + 1) + '"><br>' +
                    'Vertical tile position: <input id="IcMtop" value="' + (Math.round(this.newlaunch[2] / 98) + 1) + '"><br><br>' +
                    '</span>' +
                    'Type of shortcut: <button onclick="apps.iconMaker.vars.setType(0)" id="IcMapp">Application</button> <button onclick="apps.iconMaker.vars.setType(1)" id="IcMfile">JavaScript</button><br><br>' +
                    'Name of shortcut: <input id="IcMname"><br><br>' +
                    'For Applications:<br>' +
                    'Enter the ID of your target application below.<br>The ID can be found by right-clicking the titlebar of an application and selecting "About This App". It will be small text in the top-left corner of the popup which you can copy-paste into here.<br><br>' +
                    'For JavaScript:<br>' +
                    'Enter any JavaScript code into the field below, and it will run when you click your new desktop icon.' +
                    '<input id="IcMpath" style="width:95%"><br><br>' +
                    '<button onclick="apps.iconMaker.vars.createIcon()">Create Desktop Icon</button>'
                );
                //set the icon type to 0 once the function is ready
                this.vars.setType(0);
                getId('win_iconMaker_html').style.overflowY = 'auto';
                this.appWindow.openWindow();
            }else{
                this.appWindow.setDims("auto", "auto", 400, 500);
                this.appWindow.setCaption('Desktop Icon Maker');
                this.appWindow.setContent(
                    '<h1>Desktop Icon Maker</h1><hr>' +
                    'Position X: <input id="IcMleft"><br>' +
                    'Position Y: <input id="IcMtop"><br><br>' +
                    'Type of shortcut: <button onclick="apps.iconMaker.vars.setType(0)" id="IcMapp">Application</button> <button onclick="apps.iconMaker.vars.setType(1)" id="IcMfile">JavaScript</button><br><br>' +
                    'Name of shortcut: <input id="IcMname"><br><br>' +
                    'Enter the shortcut item path exactly as it appears in the Apps Browser, or if selected, enter JavaScript code.<br>' +
                    '<input id="IcMpath"><br><br>' +
                    '<button onclick="apps.iconMaker.vars.createIcon()">Create Desktop Icon</button>'
                );
                this.vars.setType(0);
                getId('win_iconMaker_html').style.overflowY = 'auto';
                this.appWindow.openWindow();
            }
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    setTimeout(function(){
                        if(!safeMode){
                            var iconsFolder = ufload("aos_system/desktop/user_icons/");
                            if(iconsFolder){
                                for(var file in iconsFolder){
                                    if(file.indexOf('ico_') === 0){
                                        //if(iconsFolder[file].indexOf('[') === 0){
                                        try{
                                            apps.iconMaker.vars.buildIcon(iconsFolder[file]);
                                        }catch(err){
                                            var temperrmsg = JSON.parse(iconsFolder[file]);
                                            apps.prompt.vars.alert("Could not restore desktop icon for " + temperrmsg.title + ". Make sure " + temperrmsg[5].owner + " is installed.", "Okay", function(){}, "AaronOS");
                                        }
                                        //}
                                    }
                                    if(file.indexOf('uico_') === 0){
                                        try{
                                            apps.iconMaker.vars.buildIcon(iconsFolder[file]);
                                            ufdel('aos_system/desktop/user_icons/' + file);
                                        }catch(err){
                                            var temperrmsg = JSON.parse(iconsFolder[file]);
                                            apps.prompt.vars.alert("Could not restore desktop icon for " + temperrmsg[4] + ". Make sure " + temperrmsg[5] + " is installed.", "Okay", function(){}, "AaronOS");
                                        }
                                    }
                                }
                            }
                        }
                    }, 3);
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    console.log("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'");
            }
        },
        {
            appInfo: 'This app is used to create desktop icons. You can get app names from the File Manager app.',
            newlaunch: '',
            type: 0,
            compiledIcon: '',
            decompiled: [],
            setType: function(newtype){
                this.type = newtype;
                if(newtype){
                    getId('IcMfile').style.opacity = '1';
                    getId('IcMapp').style.opacity = '0.6';
                }else{
                    getId('IcMapp').style.opacity = '1';
                    getId('IcMfile').style.opacity = '0.6';
                }
            },
            createIcon: function(icon, id){
                //if(icon){
                //    apps.savemaster.vars.save('aos_system/desktop/user_icons/uico_' + id, icon, 1);
                //}else{
                var donotsave = 0;
                if(icon){
                    donotsave = 1;
                }
                if(parseInt(getId('IcMleft').value) > 0 && parseInt(getId('IcMtop').value) > 0 && getId('IcMname').value.length > 0 && getId('IcMpath').value.length > 0){
                    var currMS = (new Date().getTime());
                    if(this.type === 0){
                        if(apps[getId('IcMpath').value] !== undefined){
                            var tempIconObj = {
                                id: currMS,
                                owner: getId("IcMpath").value,
                                position: [
                                    (parseInt(getId('IcMleft').value) - 1) * 108 + 8,
                                    (parseInt(getId('IcMtop').value) - 1) * 98 + 8
                                ],
                                title: getId('IcMname').value,
                                icon: null,
                                action: null,
                                actionArgs: null,
                                ctxAction: null,
                                ctxActionArgs: null
                            };
                            this.compiledIcon = JSON.stringify(tempIconObj);
                            //apps.savemaster.vars.save('aos_system/desktop/user_icons/uico_' + currMS, this.compiledIcon, 1);
                            this.buildIcon(this.compiledIcon);
                        }else{
                            apps.prompt.vars.alert('The specified app could not be found. Please check that the file path to your app is spelled correctly.', 'Okay', function(){}, 'Icon Maker')
                        }
                    }else{
                        var tempIconObj = {
                            id: currMS,
                            owner: null,
                            position: [
                                (parseInt(getId('IcMleft').value) - 1) * 108 + 8,
                                (parseInt(getId('IcMtop').value) - 1) * 98 + 8
                            ],
                            title: getId('IcMname').value,
                            icon: apps.jsConsole.appWindow.appImg,
                            action: [
                                getId("IcMpath").value
                            ],
                            actionArgs: null,
                            ctxAction: [
                                "arg1",
                                "ctxMenu(baseCtx.appXXXjs, 1, event, [event, arg1]);"
                            ],
                            ctxActionArgs: [currMS],
                            donotsave
                        };
                        this.compiledIcon = JSON.stringify(tempIconObj);
                        //apps.savemaster.vars.save('aos_system/desktop/user_icons/uico_' + currMS, this.compiledIcon, 1);
                        this.buildIcon(this.compiledIcon);
                    }
                }else{
                    apps.prompt.vars.alert('Please properly fill all fields.', 'Okay', function(){}, 'Icon Maker');
                }
                //}
            },
            iconClicks: {
                
            },
            buildIcon: function(icon, nosave){
                apps.iconMaker.vars.decompiled = JSON.parse(icon);
                if(icon[0] === '['){
                    if(apps.iconMaker.vars.decompiled[3] === 0){
                        newDsktpIcon(
                            apps.iconMaker.vars.decompiled[0],
                            apps.iconMaker.vars.decompiled[5].substring(5),
                            [apps.iconMaker.vars.decompiled[1], apps.iconMaker.vars.decompiled[2]],
                            apps.iconMaker.vars.decompiled[4],
                            apps[apps.iconMaker.vars.decompiled[5].substring(5)].appWindow.appImg,
                            [
                                'arg',
                                'openapp(apps[arg], "dsktp")'
                            ],
                            [apps.iconMaker.vars.decompiled[5].substring(5)],
                            [
                                "arg1",
                                "ctxMenu(baseCtx.appXXX, 1, event, [event, arg1]);"
                            ],
                            [apps.iconMaker.vars.decompiled[0]]
                        );
                    }else if(apps.iconMaker.vars.decompiled[3] === 1){
                        newDsktpIcon(
                            apps.iconMaker.vars.decompiled[0],
                            null,
                            [apps.iconMaker.vars.decompiled[1], apps.iconMaker.vars.decompiled[2]],
                            apps.iconMaker.vars.decompiled[4],
                            apps.jsConsole.appWindow.appImg,
                            [
                                apps.iconMaker.vars.decompiled[5]
                            ],
                            [],
                            [
                                "arg1",
                                "ctxMenu(baseCtx.appXXXjs, 1, event, [event, arg1]);"
                            ],
                            [apps.iconMaker.vars.decompiled[0]]
                        );
                    }
                }else if(icon[0] === '{'){
                    if(apps.iconMaker.vars.decompiled.removed){
                        removeDsktpIcon(apps.iconMaker.vars.decompiled.id, 1);
                    }else{
                        newDsktpIcon(
                            apps.iconMaker.vars.decompiled.id,
                            apps.iconMaker.vars.decompiled.owner,
                            apps.iconMaker.vars.decompiled.position,
                            apps.iconMaker.vars.decompiled.title,
                            apps.iconMaker.vars.decompiled.icon,
                            apps.iconMaker.vars.decompiled.action,
                            apps.iconMaker.vars.decompiled.actionArgs,
                            apps.iconMaker.vars.decompiled.ctxAction,
                            apps.iconMaker.vars.decompiled.ctxActionArgs,
                            nosave
                        );
                    }
                }
                /*
                if(apps.iconMaker.vars.decompiled[3]){
                    apps.iconMaker.vars.iconClicks['c' + apps.iconMaker.vars.decompiled[0]] = apps.iconMaker.vars.decompiled[5];
                    getId('desktop').innerHTML +=
                        '<div class="app cursorPointer" id="app' + apps.iconMaker.vars.decompiled[0] + '" style="left:' + apps.iconMaker.vars.decompiled[1] + 'px;top:' + apps.iconMaker.vars.decompiled[2] + 'px" onclick="eval(apps.iconMaker.vars.iconClicks.c' + apps.iconMaker.vars.decompiled[0] + ')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/console.png\', \'\', \'ctxMenu/beta/x.png\'], \' Execute\', \'eval(apps.iconMaker.vars.iconClicks.c' + apps.iconMaker.vars.decompiled[0] + ')\', \'+Move Icon\', \'icnmove(event, \\\'' + apps.iconMaker.vars.decompiled[0] + '\\\')\', \' Delete Icon\', \'apps.iconMaker.vars.deleteIcon(' + apps.iconMaker.vars.decompiled[0] + ')\'])">' +
                        //'<div class="appIcon" id="ico' + apps.iconMaker.vars.decompiled[0] + '" style="pointer-events:none"><img style="max-height:64px;max-width:64px" src="appicons/ds/jsC.png" onerror="this.src=\'appicons/ds/redx.png\'"></div>' +
                        '<div class="appIcon" id="ico' + apps.iconMaker.vars.decompiled[0] + '" style="pointer-events:none">' + buildSmartIcon(64, apps.jsConsole.appWindow.appImg) + '</div>' +
                        '<div class="appDesc" id="dsc' + apps.iconMaker.vars.decompiled[0] + '">' + apps.iconMaker.vars.decompiled[4] + '</div>' +
                        '</div>';
                }else{
                    apps.iconMaker.vars.iconClicks['c' + apps.iconMaker.vars.decompiled[0]] = 'openapp(' + apps.iconMaker.vars.decompiled[5] + ', "dsktp")';
                    getId("desktop").innerHTML +=
                        '<div class="app cursorPointer" id="app' + apps.iconMaker.vars.decompiled[0] + '" style="left:' + apps.iconMaker.vars.decompiled[1] + 'px;top:' + apps.iconMaker.vars.decompiled[2] + 'px" onclick="eval(apps.iconMaker.vars.iconClicks.c' + apps.iconMaker.vars.decompiled[0] + ')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/window.png\', \'\', \'ctxMenu/beta/x.png\'], \' Open\', \'eval(apps.iconMaker.vars.iconClicks.c' + apps.iconMaker.vars.decompiled[0] + ')\', \'+Move Icon\', \'icnmove(event, \\\'' + apps.iconMaker.vars.decompiled[0] + '\\\')\', \' Delete Icon\', \'apps.iconMaker.vars.deleteIcon(' + apps.iconMaker.vars.decompiled[0] + ')\'])">' +
                        //'<div class="appIcon" id="ico' + apps.iconMaker.vars.decompiled[0] + '" style="pointer-events:none"><img style="max-height:64px;max-width:64px" src="' + vartry('eval(' + apps.iconMaker.vars.decompiled[5] + ').appWindow.appImg') + '" onerror="this.src=\'appicons/ds/redx.png\'"></div>' +
                        '<div class="appIcon" id="ico' + apps.iconMaker.vars.decompiled[0] + '" style="pointer-events:none">' + buildSmartIcon(64, eval(apps.iconMaker.vars.decompiled[5]).appWindow.appImg) + '</div>' +
                        '<div class="appDesc" id="dsc' + apps.iconMaker.vars.decompiled[0] + '">' + apps.iconMaker.vars.decompiled[4] + '</div>' +
                        '</div>';
                }
                */
            },
            moveSelect: '0',
            moveTo: [0, 0],
            replaceObj: [],
            moveIcon: function(element, movedata){
                this.moveTo = eval(movedata);
                this.moveSelect = element.substring(3, element.length);
                this.replaceObj = eval(ufload("aos_system/desktop/user_icons/uico_" + this.moveSelect));
                this.replaceObj[1] = this.moveTo[0];
                this.replaceObj[2] = this.moveTo[1];
                this.createIcon('[' + this.replaceObj[0] + ', ' +
                    this.replaceObj[1] + ', ' +
                    this.replaceObj[2] + ', ' +
                    this.replaceObj[3] + ', "' +
                    this.replaceObj[4] + '", "' +
                    this.replaceObj[5] + '"]', this.moveSelect
                );
            },
            deleteElem: 0,
            deleteIcon: function(element){
                this.deleteElem = element;
                apps.prompt.vars.confirm('Are you sure you wish to delete this icon?', ['No, Keep Icon', 'Yes, Delete Icon'], function(btn){
                    if(btn){
                        getId('app' + apps.iconMaker.vars.deleteElem).style.display = 'none';
                        ufdel('aos_system/desktop/user_icons/uico_' + apps.iconMaker.vars.deleteElem);
                    }
                }, 'aOS');
            }
        }, 1, 'iconMaker', 'appicons/ds/IcM.png'
    );
    getId('aOSloadingInfo').innerHTML = 'Text Editor';
});
var files;
c(function(){
    m('init NP2');
    apps.notepad2 = new Application(
        "TE2",
        "Text Editor",
        1,
        function(launchType){
            this.appWindow.paddingMode(0);
            this.vars.launchedAs = launchType;
            if(launchType !== "tskbr"){
                this.appWindow.setCaption("Text Editor");
                if(!this.appWindow.appIcon){
                    this.appWindow.setDims("auto", "auto", 650, 400);
                }
                this.appWindow.setContent(
                    '<textarea id="np2Screen" style="white-space:no-wrap; width:calc(100% - 6px); height:calc(100% - 23px); position:absolute; padding:3px; border:none; bottom: 0px; left: 0px; font-family:aosProFont,Courier,monospace; font-size:12px; resize:none; box-shadow:0px 0px 5px #000; overflow:auto"></textarea>' +
                    '<div class="darkResponsive" style="width:100%; border-bottom:1px solid; height:16px;">' +
                    '<input class="darkResponsive" id="np2Load" placeholder="file name" style="padding-left:3px; font-family: aosProFont, monospace; font-size:12px; left: 16px; border:none; height:16px; border-left:1px solid; border-right:1px solid; position:absolute; top:0; width:calc(100% - 115px);"></input>' +
                    '<div id="np2Mode" onclick="apps.notepad2.vars.toggleFileMode()" class="cursorPointer" style="color:#7F7F7F; font-family:aosProFont, monospace; font-size:12px; height:16px;line-height:16px; padding-right:3px; padding-left: 3px; right:95px">Text Mode</div>' +
                    '<div class="darkResponsive" onclick="apps.notepad2.vars.openFile(getId(\'np2Load\').value)" class="cursorPointer" style="font-family:aosProFont, monospace; font-size:12px; height:16px; line-height:16px; top:0; right:55px; text-align:center;width:38px; border-left:1px solid; border-right:1px solid;">Load</div> ' +
                    '<div class="darkResponsive" onclick="apps.notepad2.vars.saveFile(getId(\'np2Load\').value)" class="cursorPointer" style="font-family:aosProFont, monospace; font-size:12px; height:16px; line-height:16px; top:0; right:16px; text-align:center;width:38px; border-left:1px solid; border-right:1px solid;">Save</div> ' +
                    '</div>'
                );
                getId("np2Screen").wrap = "off";
                getId('win_notepad2_html').style.background = 'none';
                this.vars.filemode = "string";
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'Simple text editor for AaronOS. Edits text files created by the user, and views strings, numbers, and functions of AaronOS apps.',
            openEditTools: function(){apps.prompt.vars.notify('This button is unfinished. Right-click the document instead.', [], function(){}, 'Text Editor', 'appicons/ds/TE.png')},
            launchedAs: '',
            filemode: 'string',
            toggleFileMode: function(){
                if(this.filemode === "string"){
                    this.filemode = "function";
                    getId('np2Mode').innerHTML = "Eval Mode";
                }else{
                    this.filemode = "string";
                    getId('np2Mode').innerHTML = "Text Mode";
                }
            },
            openFile: function(filename){
                if(!apps.notepad2.appWindow.appIcon){
                    openapp(apps.notepad2, "dsktp");
                }else{
                    openapp(apps.notepad2, 'tskbr');
                }
                
                /*
                if(filename.indexOf('/') === -1){
                    filename = '/USERFILES/' + filename;
                }else if(filename.indexOf('/') !== 0){
                    filename = '/' + filename;
                }
                */
                
                if(filename.indexOf('/USERFILES/') !== 0 && filename.indexOf('/LOCALFILES/') !== 0){
                    if(filename.indexOf('/window/') !== 0){
                        if(filename[0] === '/'){
                            filename = '/USERFILES' + filename;
                        }else{
                            filename = '/USERFILES/' + filename;
                        }
                    }
                }
                
                try{
                    console.log(filename);
                    console.log(apps.bash.vars.translateDir(filename));
                    var filecontent = apps.bash.vars.getRealDir(filename);
                }catch(err){
                    apps.prompt.vars.alert("Failed to open " + filename + ": " + err, "Okay", function(){}, "Text Editor");
                    return;
                }
                if(typeof filecontent === "object"){
                    apps.prompt.vars.alert("Failed to open " + filename + ": the item is a folder or null.", "Okay", function(){}, "Text Editor");
                    return;
                }
                if(typeof filecontent === "function"){
                    this.filemode = 'function';
                    getId('np2Mode').innerHTML = "Eval Mode";
                }else{
                    this.filemode = 'string';
                    getId('np2Mode').innerHTML = "Text Mode";
                }
                if(getId('np2Screen').value !== ""){
                    apps.prompt.vars.confirm("You will lose all unsaved work. Continue?", ['No', 'Yes'], function(btn){
                        if(btn){
                            requestAnimationFrame(function(){
                                toTop(apps.notepad2);
                            });
                            getId('np2Load').value = filename;
                            getId('np2Screen').value = filecontent;
                            getId('np2Screen').scrollTop = 0;
                        }
                    }.bind(this), 'Text Editor');
                }else{
                    requestAnimationFrame(function(){
                        toTop(apps.notepad2);
                    });
                    getId('np2Load').value = filename;
                    getId('np2Screen').value = filecontent;
                    getId('np2Screen').scrollTop = 0;
                }
            },
            saveFile: function(filename){
                doLog(1);
                if(filename.length === 0){
                    apps.prompt.vars.alert("Failed to save: No filename provided.", "Okay", function(){}, "Text Editor");
                    return;
                }
                
                /*
                if(filename.indexOf('/') === -1){
                    filename = '/USERFILES/' + filename;
                }else if(filename.indexOf('/') !== 0){
                    filename = '/' + filename;
                }
                */
                
                if(filename.indexOf('/USERFILES/') !== 0 && filename.indexOf("/LOCALFILES/") !== 0){
                    if(filename.indexOf('/window/') !== 0){
                        if(filename[0] === '/'){
                            filename = '/USERFILES' + filename;
                        }else{
                            filename = '/USERFILES/' + filename;
                        }
                    }
                }
                
                getId('np2Load').value = filename;
                if(filename.indexOf('/USERFILES/') === 0){
                    var shortfilename = filename.substring(11, filename.length);
                    if(shortfilename.length === 0){
                        apps.prompt.vars.alert("Failed to save: No filename provided.", "Okay", function(){}, "Text Editor");
                        return;
                    }
                    apps.savemaster.vars.save(shortfilename, getId("np2Screen").value, 1);
                }else if(filename.indexOf('/LOCALFILES/') === 0){
                    var shortfilename = filename.substring(12, filename.length);
                    if(shortfilename.length === 0){
                        apps.prompt.vars.alert("Failed to save: No filename provided.", "Okay", function(){}, "Text Editor");
                        return;
                    }
                    lfsave(shortfilename, getId("np2Screen").value);
                }else{
                    try{
                        var oldfilecontent = apps.bash.vars.getRealDir(filename);
                    }catch(err){
                        apps.prompt.vars.alert("Failed to save " + filename + ": " + err, "Okay", function(){}, "Text Editor")
                        return;
                    }
                    if(this.filemode === "string"){
                        if(typeof oldfilecontent !== "string" && typeof oldfilecontent !== "undefined"){
                            apps.prompt.vars.alert("Failed to save " + filename + ": Already exists and is of type " + (typeof oldfilecontent) + " (expected string).", "Okay", function(){}, "Text Editor");
                            return;
                        }
                        eval(apps.bash.vars.translateDir(filename) + ' = getId("np2Screen").value');
                    }else if(this.filemode === "function"){
                        if(typeof oldfilecontent !== "function" && typeof oldfilecontent !== "undefined"){
                            apps.prompt.vars.alert("Failed to save " + filename + ": Already exists and is of type " + (typeof oldfilecontent) + " (expected function).", "Okay", function(){}, "Text Editor");
                            return;
                        }
                        try{
                            var newfilecontent = eval("(" + getId("np2Screen").value + ")");
                        }catch(err){
                            apps.prompt.vars.alert("Failed to save " + filename + ": Input error: " + err, "Okay", function(){}, "Text Editor");
                            return;
                        }
                        if(typeof newfilecontent !== "function"){
                            apps.prompt.vars.alert("Failed to save " + filename + ": Input is of type " + (typeof newfilecontent) + "; expected function.", "Okay", function(){}, "Text Editor");
                            return;
                        }
                        eval(apps.bash.vars.translateDir(filename) + '=' + newfilecontent + "");
                    }
                }
            }
        }, 0, "notepad2", {
            backgroundColor: "#303947",
            foreground: "smarticons/textEditor/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    getId('aOSloadingInfo').innerHTML = 'Files';
});
c(function(){
    m('init files');
    files = {
        changelog_old:
            "OLD CHANGELOG AND PLANNING SHEET\nThis could be found in a very large comment at the very top of the main script file before this file addition.\n\n" +
            "By Aaron Adams, original somewhere in codecademy.com/MineAndCraft12/codebits\n" +
            "I have alot of work to do to make this work well. Here's the list of to-do's, starting with a key\n" +
            ":       To-Do (optional comments or details)\n" +
            ">       Work-In-Progress (optional comments or details)\n" +
            "    :)  Satisfactory (mandatory comment on any way it could be better)\n" +
            "    :\\  Needs Improvement (mandatory comment on what isnt right or what can be added)\n" +
            "    :|  Skipped (mandatory comment on why it was skipped)\n" +
            "    :(  Unsatisfactory (mandatory comment on why it did not work or is not good)\n" +
            "    :D  Perfect (mandatory comment on why improvement is useless or unneeded)\n" +
            "________________________________________________________________________________\n" +
            "    :)  Make screen size itself to the screen as apposed to stretching to the screen (optimise to resize more quickly)\n" +
            "    :)  Fix the FPS meter as the beginning info is now irrelevant (possibly fit this one onto the taskbar with the time)\n" +
            "    :\\  Allow desktop icons to go all the way down and all the way right (some screen sizes cause icons to overlap or to skip a space)\n" +
            ">       Make the thing look better (always working on this one)\n" +
            "    :)  Make an object to hold running Timeout and Interval functions and a task manager for them (finally made removeTimeout)\n" +
            "    :)  Remove size controlling options from settings (make more settings)\n" +
            "    :)  Move FPS meter onto the taskbar with the time meter (pretty much perfect already)\n" +
            "    :)  Allow window dragging (actually drag mouse instead of click-click maybe)\n" +
            "    :)  Give the current window a shadow, and all other windows no shadow (make more noticeable)\n" +
            "    :D  Make built-in apps remember their last position on-screen (works perfectly)\n" +
            "    :|  Surprise for 2000 lines of code (skipped due to just chugging on with development :P)\n" +
            "    :D  Allow users to easily make their own apps (Just make a Tampermonkey script that runs when the page is finished!)\n" +
            "    :D  Order window layering by order used instead of order initialised (perfect but may have limit)\n" +
            "    :|  Make login system (use mySQL database or maybe use a hash to save to a file somewhere in Users->User (working on other features first, same with below)\n" +
            "    :)  Make file-system actually work with a simple-as-possible system, preferably 1 or 2 end commands (in future, maybe real-time load system)\n" +
            "    :)  Put Aero blur on windows (possibly have windows/icons show through the aero)\n" +
            "    :)  Settings to enable/disable Aero blur (perfect, remember to add taskbar support)\n" +
            "    :)  Taskbar support for Aero (have it work to show windows below, possibly)\n" +
            "    :)  Settings to change window frame color (perfect, possibly differ it from the taskbar later on)\n" +
            "    :)  Get rid of editor warnings (evals are here to stay sadly, and so are missing radix parameters on parseInt)\n" +
            "    :|  Make web browser work on non-https sites (works only on teh non-https stable version)\n" +
            "    :D  Add a way to determine both JS FPS and visual FPS (literally perfect - Chrome FTW)\n" +
            "    :D  Make filebrowser support USERFILES and find+fix its 'files.n' access issue (works now!)\n" +
            "    :D  Get rid of all branded names and such, like Start Menu, Aero, etc. (did it!)\n" +
            "    :D  Allow apps to save cross-session data (works perfectly)\n" +
            "    :)  Make saving app work no matter filesize (use param 1 at end - should work for large files as long as not insanely crazy)\n" +
            "    :)  Allow window rotating! (make it easier to improve)\n" +
            "    :)  Setting to change background-blend-modes on the window aeros, maybe just toggle between multiply and overlay (works just like windowcolor)\n" +
            "    :)  Setting to change experimental opacity of window aero layer (work just fine)\n" +
            "    :)  Custom scrollbar for aOS (maybe add cursors later)\n" +
            "    :)  Implementing Module system so that errors are easier to track (works great)\n" +
            "    :)  Context Menu (Make the thing easier to set up)\n" +
            "    :)  Add App Icons (works pretty well)\n" +
            "    :)  Make system to allow code to wait for FPS reasons (works as well as it ever will)\n" +
            "    :)  Fix RD (still halves the FPS but better than 1FPS)\n" +
            "    :)  Add aOS cursors (dunno if adding a text cursor would be worth it)\n" +
            "    :)  Maybe allow movement of desktop icons (even saves)\n" +
            "    :)  Fix for browsers that do not support getAnimationFrame\n" +
            "    :|  Make Window Moving more optimised (what i thought would be an optimization actually ended up slower)\n" +
            ">       Loads of optimisations (you can count on this one never being finished)\n" +
            "    :)  Ability to send error report (impossible to email with the IDE i use - but i found another way)\n" +
            "    :)  Send apps into Enlarge mode (just like hitting the middle of the top-right buttons in windows)\n" +
            "    :)  Change Window Rotation into Window Scaling\n" +
            "    :)  Minimize, enlarge, and exit buttons look better now.\n" +
            "    :)  Let Files app have different filenames\n" +
            "    :)  Optimize file browser just like the start menu system was optimized\n" +
            "    :)  Messaging App\n" +
            "    :)  Performance-checking features - lets you see how many microseconds between two calls of the function\n" +
            "    :)  Allow User to login to another aOS account (works great)\n" +
            "    :)  Make window resizing actually resize the window\n" +
            "    :)  Allow apps to resize their elements when its window is resized\n" +
            "    :)  Default apps open in middle of screen\n" +
            "    :)  Save CPU by having the time and FPS render at vsync instead of every millisecond\n" +
            "    :)  Show network status on the taskbar\n" +
            "    :)  Allow user to ping aOS server\n" +
            ">       NORAA - Take that Cortana! (have it in its own window [genius!] and have it learn from you - take JOSHUA from War Games as example for the display and give it a personality shaped by experience)\n" +
            ">       Performance Mode - certain system functions will be made less CPU-intesive (for older browsers)\n" +
            "    :)  Speech Recognition for NORAA (possibly find out a way to keep it from being forever stuck... may be an API issue)\n" +
            "    :)  aOS's own TTS engine (based off of Chrome 33's)\n" +
            "    :)  NORAA speaks responses to user's spoken commands\n" +
            "    :)  Optimise formDate (put functions into arrays rather than loops)\n" +
            "    :)  Added ProFont (windows .ttf version) and changed many apps fonts, like NORAA, jsConsole. All credit to the creators of this absolutely brilliant font. Bravo!\n" +
            "    :)  Added stylish battery\n" +
            ">       Optimise many functions for performance mode (Application.setDims)\n" +
            ">       Languages (The language that is the language that the United States of America currently speaks, Anglish,)",
        changelog:
            "01/26/2016: A1.2.0.0\n + Changelog Added.\n : Windowblur fixed when dims not set.\n + Search app added.\n : RD no longer brings aOS to its knees.\n + System to allow apps to have code wait its turn to avoid OS-crippling lag.\n + App Maker can now give apps image-based icons.\n\n" +
            "01/30/2016: A1.2.1.0\n + Right-click menu for desktop icons, allows re-arrangement of icons.\n : Text Editor app no longer uses word-wrap.\n\n" +
            "02/04/2016: A1.2.2.0\n + Text-to-speech added to right-click menu, credits to creator are in the Settings app.\n + Experimental image editor began development.\n\n" +
            "02/23/2016: A1.2.3.0\n + Copyright notice added to Settings application - (c) 2016 Aaron Adams\n + Waiting Code system modified to allow args in functions.\n : Resizing of the aOS monitor is now manual - reduces strain on CPU.\n + Ability to send error reports if the filesaving service is intact.\n + aOS replaces requestAnimationFrame with a custom function if requestAnimationFrame is unsupported in your browser.\n + True fullscreen support - remember to use Chrome.\n\n" +
            "04/04/2016: A1.2.4.0\n : Window Rotation changed to Window Scaling.\n + Windows can now fit to the size of the desktop - just hit the 'O' button and watch what it does.\n + Change calulating app, ChC.\n : Various bug fixes - this one is spread between the last few updates, just forgot to mention it.\n : aOS version format changed from 'V_._._' to 'A_._._', 'A' meaning alpha. When in beta form, it will be changed to 'B_._._', and on full release will be changed back to 'V_._._'.\n + RemoveTimeout is added to task manager.\n : File manager can no longer cripple the system.\n + Replaces performance.now with custom function if not supported by your browser.\n + Added messaging app, lets you message all other aOS users with Messaging app currently open.\n + Added performance-checking features, see an example in the initialization-time log in the console.\n + Ability to switch between OS accounts.\n + Built-in apps now fully support variable window sizes.\n + Network status now shown on taskbar.\n + NORAA added.\n : TTS uses Googles built-in TTS.\n + NORAA can hear the user, if given permission.\n\n" +
            "06/06/2016: A1.2.5.0\n + Bing app added for quick bing search (google wont let me).\n + NORAA can now tell you what nearly anything is.\n : Improvements to formDate to help with CPU load.\n + Files can view window object.\n : Context menus better to create and faster.\n + Files now can show properties of a file.\n + New font called aosProFont i think, credits to its creator, not me.\n : Settings app rewritten.\n + NORAA can listen for you to speak to him, and now referrs to himself as 'me' instead of 'NORAA'.\n : filesaving optimised.\n + Help App.\n + Music Visualiser (add /unrelated/keyfingers/visual.php to the URL to get non-laggy version).\n + Taskmanager can close tasks.\n : More optimised for mobile FPS on performance mode.\n + New prompt system that does not freeze browser.\n : Messaging more safe but breaks on mobile still.\n + More icons added.\n + Mobile can double-tap to context menu, but only on some objects.\n : When ctxmenu opens using that method, drag both fingers out of the OS window before lifting them, or the menu will close.\n : Files is safer to use.\n : Probably many other changes but forgotten what as I keep forgetting to log them.\n\n" +
            "08/17/2016: A1.2.6.0\n + Properties now displays the size of functions.\n + When needed, Properties now shows KB, MB, and GB so values are easier to count.\n : Battery no longer has blue background, and instead gives the foreground a blue tint when charging.\n + Performance Monitor app shows CPU usage stats.\n : Changelog is easier to read.\n : Properties app shows shorter description for file sizes.\n + Windows now have texture to their borders, looks good if you can find a glassy texture like Windows has (i wont steal theirs) or if your device cant run windowblur.\n + Right-click menu lets you open an app from its icon.\n + App controls are now accessible from the app's window caption.\n : Camera app now resizes correctly.\n : Music Visualizer now waits for the song to load before trying to play it.\n - Application List can no longer be moved or resized.\n + If JavaScript is disabled or unsupported, the loading page will nag you to enable it.\n + Alerts, confirms, and prompts can now tell you where they came from.\n + Music Visualizer now shows loading progress and song playtime progress.\n + New simple version of Music Visualizer, uses a canvas (thus looks worse), and runs on one color only: black (with a green screen behind it), which achieves 60fps instead of 15.\n + New Ringtone for Messaging.\n + New Looketh Over There ringtone for Messaging.\n + Fix for double quotes in Messaging.\n + Apps can now stay Always On Top.\n : Notepad reworked.\n : Fixed NORAA looking up definitions.\n + Copy/Paste added.\n : Fixed Fullscreen Dimensions.\n\n" +
            "09/23/2016: A1.2.7.0\n + Mathway app Added.\n : Developers can now keep their app out of the apps list, in case it acts as a utility of sorts..\n + Icon added to music visualizer.\n + Apps can now be opened by Files browser.\n + Files can now be deleted in File Browser.\n + New AppBrowser, for opening any app installed on the system.\n : Task Manager is now capitalized in application list.\n + Simon Says App.\n : Updated the appearance of apps on the desktop; two-word names no longer overlap the icon, and it looks a bit cleaner and easier to read with bright and dark backgrounds alike.\n + Smoother animations in desktop icons and window borders and buttons.\n + Taskbar now shows which app is active.\n : Stylish Battery icon now looks like a AA battery rather than just a box.\n : OS loads your files more cautiously, notifies you of errors.\n : Fixed inconsitency in desktop icon ctxMenus.\n : Changelog is a little better.\n : Apps can no longer interrup each others saving processes.\n : Deleting now works properly again.\n + Shut down and restart are now a feature; lets apps save their progress if you do it while they running.\n + Large additions to aOS API documentation.\n + Complete aOS API Documentation started in the aOS Help App.\n + Raw battery information is now stored outside of an anonymous function.\n : aOS now tries up to three times to set up the battery.\n + Bug Central app, to track and document known bugs.\n + Donation button added.\n + Indycar app added; the first app not written 100% by hand.\n + Added Dont-Save argument to most settings.\n\n" +
            "09/23/2016: A1.2.8.0\n + New changelog mechanic - Because aOS is updated live, it's harder to keep one version number on everything. Updates will be tracked in more detail, adding a fourth update number, and dates will be closer together so you can tell exactly when each visible change was made.\n : Controls changed in House game.\n + New sprites in House game, explosion animation and soldiers now shoot at an angle.\n + Experimental RDP system. No, it's not perfect, but it's a start.\n\n" +
            "09/24/2016: A1.2.8.1\n : Complete rewrite of render system for music visualizer, you now get max fps instead of 10.\n : Along with this new render system, by clicking on the visualization it will resize to fit its window. Theoretically, it will work for any width 2048 pixels or less, and for any height physically possible.\n + You can access Visualizer as its own separate browser window! Visit https://aaronos.dev/AaronOS/unrelated/keyfingers/cnv.php, and that way the OS itself wont slow down the visualizer and you can also put it into true fullscreen.\n\n" +
            "09/25/2016: A1.2.8.2\n : New look for the Settings app.\n + Context menus can now have disabled options.\n\n" +
            "09/30/2016: A1.2.9.3\n + New Mouse Control app; purely experimental.\n + Added function grapher, to help with math students.\n + Added external debug window for if you have trouble clicking on aOS.\n\n" +
            "10/01/2016: A1.3.0.0\n : User can now drag to move windows instead of having to click several times.\n\n" +
            "10/04/2016: A1.3.1.0\n + User can now create their own desktop icons.\n\n" +
            "10/04/2016: A1.3.2.0\n + Remote Debugging Menu for debugging another user's computer.\n\n" +
            "10/06/2016: A1.3.3.0\n + Added binary file viewer... because it's cool, I guess.\n\n" +
            "10/07/2016: A1.4.0.0\n + Context Menus can now have 10x10 images to represent their options.\n : Context Menu options are now left-aligned instead of center-aligned.\n\n" +
            "10/12/2016: A1.4.0.1\n : Fixed Saving of FPS Status settings on taskbar.\n\n" +
            "10/13/2016: A1.4.1.0\n + Added compact settings for FPS and Time on taskbar.\n + Added Custom Stylesheet feature - check Settings -> Advanced for more info.\n\n" +
            "10/18/2016: A1.4.2.0\n + Added Magnifier App; lets you magnify aOS, focusing on your mouse.\n\n" +
            "10/20/2016: A1.5.0.0\n + Added a new type of context menu; it is the same visually but is easier to edit, can be added to on the fly, and can safely perform more actions.\n\n" +
            "10/21/2016: A1.5.0.1\n : Fixed fatal error when taskbar is the first right-clicked element since launch.\n : Changed context menus for app icons, taskbar icons, and Applications List to the new version.\n\n" +
            "10/22/2016: A1.5.1.0\n : Fixed fatal error when right-clicking window border after toggling performance mode.\n : Changed Task Manager to display more important information and added entry to aOS Help app to describe what they mean.\n\n" +
            "10/24/2016: A1.5.2.0\n + LiveElements can now target their element attributes.\n\n" +
            "10/25/2016: A1.6.0.0\n + Clipboard is now saved between sessions and restarts.\n + Emergency Clear Clipboard button in Settings.\n : Network Status is less distracting.\n : Fixed blurry buttons, font sized changed to 12px, native for font.\n + Added crash tester and force-boot option on boot menu.\n : Fixed graphics bug where power-down screen appeared suddenly instead of fading.\n + New animation, start menu slides up from bottom.\n\n" +
            "10/27/2016: A1.6.1.0\n + You can now copy text from any window in the OS instead of only in text boxes.\n + Experimental support for Safari's backdrop-filter CSS property in Settings to blur windows.\n + Added Current Selection to task manager.\n : Applications List only updates its data at system start, as it is only needed then. Saves on FPS and makes Apps List faster.\n + Loading icons added in Apps List, Files Browser, Loading Screen, and Shutdown Screen.\n\n" +
            "10/28/2016: A1.6.2.0\n : Applications List now slides in from the left... looks a bit better.\n + New Tampermonkey script to get aOS on any tab!\n\n" +
            "10/19/2016: A1.6.2.1\n + Added cookie image for use in context menus, not actually being used yet though.\n\n" +
            "10/30/2016: A1.6.3.0\n : Desktop Icons now position themselves correctly. About time!\n\n" +
            "11/02/2016: A1.7.0.0\n : Taskbar no longer has occasional positioning issue.\n + Custom Style Gallery in Settings, with Win98, Win8, and Win10 options so far.\n + Screensaver support - default is after 5 mins, cycle color hues on screen.\n\n" +
            "11/07/2016: A1.7.0.1\n + aOS now attempts to adapt to Google Play by automatically enabling performance mode.\n\n" +
            "11/09/2016: A1.7.1.0\n + aOS Calculator App.\n - Custom Math App.\n\n" +
            "11/10/2016: A1.7.1.1\n + Button added to calculator so user can undo clearing the display.\n\n" +
            "11/15/2016: A1.7.1.2\n : Disabled rendering of elements that are always hidden, to save on performance.\n\n" +
            "11/21/2016: A1.7.2.0\n + Files location bar now shows loading progress.\n\n" +
            "12/01/2016: A1.7.2.1\n + Added new screensaver: Color Randomization.\n\n" +
            "12/02/2016: A1.7.3.0\n + Added new PNG file saver for saving base-64 images to aOS.\n\n" +
            "12/07/2016: A1.7.3.1\n + Added desktop background to loading screen.\n + Added new screensavers: blank and Random Wikipedia Page.\n\n" +
            "12/08/2016: A1.7.3.2\n + Added configurability to screensavers (currently only the wikipedia one though).\n : Fixed Random Color screensaver.\n : Fixed Force Boot.\n\n" +
            "12/13/2016: A1.7.4.0\n + Added 60fps Ultra setting to music visualizer... absolutely stunning on 15px mode.\n\n" +
            "12/15/2016: A1.7.4.1\n : aOS checks for battery 10 times instead of 3, just in case.\n\n" +
            "12/16/2016: A1.7.4.2\n : Fixed error on startup for new users.\n\n" +
            "12/17/2016: A1.7.5.0\n + Added CPU Monitor Graphing app.\n : Changed some text in Applications List.\n\n" +
            "01/05/2017: A1.7.5.1\n : Fixed maximized windows.\n + Added links to old versions in files.oldVersions.\n\n" +
            "01/07/2017: A1.7.5.2\n : Fixed key generation for new users.\n\n" +
            "01/10/2017: A1.7.6.0\n + Began development on experimental bash console.\n\n" +
            "01/23/2017: A1.7.7.0\n + Added commands cp, mv, del, su, and sudo to bash console.\n : Revised commands cd and ls in bash console.\n + Bash console now shows current directory in command prompt.\n\n" +
            "01/24/2017: A1.7.7.1\n : Fixed .. directory selections in bash console.\n + Added alias support in bash console (try 'alias please=sudo').\n + Added mkdir in bash console.\n : Changed del to rm in bash console (oops, this isnt MS-DOS!)\n : Made ls calculate dir all at once instead of separately, now takes < 1 second to calculate 'ls -s /' as opposed to 10 minutes and does not interrupt system processes.\n\n" +
            "01/25/2017: A1.7.8.0\n + Begun commenting all necessary code (11,000 lines, ugh) in aOS, as right now its just a huge mess.\n\n" +
            "02/02/2017: A1.8.0.0\n : aOS now boots modularly, so if one app initializes incorrectly, other apps still have a chance to start and the os will not lock you out.\n\n" +
            "02/03/2017: A1.8.0.1\n : Boots much faster, but still slower than 1.7.8, especially for Google Play version.\n\n" +
            "02/06/2017: A1.8.1.0\n + Automatically adjusts screen resolution when window is resized. Much more efficient mechanism than the early days of aOS.\n\n" +
            "02/08/2017: A1.8.2.0\n + Taskbar can now be repositioned; bottom, top, left, and right are the options.\n + Version number on page title now shows date of last update.\n : Context menu on taskbar now directs user to taskbar settings page instead of directly changing them.\n\n" +
            "02/18/2017: A1.8.3.0\n + Windows can now 'fold'; hides body so you can more easily sort through them.\n\n" +
            "02/19/2017: A1.8.3.1\n + Windows can now be hidden via taskbar buttons right-click.\n\n" +
            "03/01/2017: A1.8.3.2\n + Added Search app to the top of Apps List.\n + Beginning aDE (aDesktopEnvironment) framework development, plan is to serve similar purpose to the xServer of Linux.\n\n" +
            "03/22/2017: A1.8.3.3\n + Added setting to allow user to watch aOS build itself at startup.\n\n" +
            "03/28/2017: A1.8.4.0\n + Merged aOS and my friend's JAos into the same workspace, for his ease of building.\n + Added psuedo-GRUB to startup to choose between Operating Systems.\n : Shutdown screen slightly different.\n\n" +
            "04/25/2017: A1.8.4.1\n + Added Windows XP (plain and colorable) themes to CustomStyles.\n + Added (extremely buggy) pipe logic to bash console.\n + Added grep command to bash console, currently case-sensitive, will fix.\n\n" +
            "04/26/2017: A1.8.5.0\n + Windows will now be 'highlighted' when their icon in the taskbar is hovered over.\n: Instead of making windows move slowly, Performance Mode draws a border of the window instead of having the window follow the cursor - great for FPS.\n\n" +
            "04/27/2017: A1.8.5.1\n + Added background to window highlighting to make it more visible; normally it looks sleek but in performance mode it is easier to render.\n : Default window blur is now 2 instead of 5 - helps the FPS and looks a bit better.\n : The experimental Backdrop Filter blur now uses the blur strength setting instead of always 5.\n+ aOS now remembers Performance Mode settings - a very useful setting for many low- to medium-power devices.\n\n" +
            "04/28/2017: A1.8.5.2\n : Window highlight looks a bit better.\n + Apps Browser can now open apps from the context of the taskbar, however this tends to break things, notably with the Files app.\n\n" +
            "05/04/2017: A1.8.6.0\n : Cursors are now controlled by class, not by direct style overrides - this allows customStyles to change cursor theme.\n : Loading cursors changed to hourglass shape that was originally intended - i forgot that was there.\n\n" +
            "05/09/2017: A1.8.6.1\n : Fixed Google Play version of aOS.\n - Removed aDE framework for now.\n : File Browser now opens folders much faster, even loads the window object super quickly.\n\n" +
            "05/10/2017: A1.8.6.2\n + Added Changelog app - the changelog is much easier to read this way.\n\n" +
            "05/11/2017: A1.9.0.0\n + Added Notification system, for non-urgent notifications. Current bug however means that only one notif/alert can be open at a time.\n + Added sweet animations to opening and closing windows, sadly though this means cutting support for pretty much everything but Chrome as it uses Fat-Arrow notation.\n\n" +
            "05/12/2017: A1.9.0.1\n + Windows now have opacity-change when opening/closing.\n : Windows only scale halfway instead of all the way when closing\n\n" +
            "05/15/2017: A1.9.0.2\n : Fixed Serverside Error [2] Cannot modify header information\n : Fixed certain windows not animating correctly\n\n" +
            "05/16/2017: A1.9.0.3\n + Added framework for new, better language system\n\n" +
            "05/18/2017: A1.9.0.4\n : Modified the behavior of the ls command in the bash console.\n : Messaging is now MUCH faster than before - major speed improvement.\n : Fixed bug in messenger where username would sometimes not appear when opening the app\n\n" +
            "05/19/2017: A1.9.1.0\n + Added more content to Chinese language.\n + Context menus, app names, and apps list are now programmed to reflect language selection if translation available.\n + Re-added Ultra Verbose as a joke language.\n\n" +
            "05/21/2017: A1.9.2.0\n : Changed around some icons, I think they look a bit better now. Credit to Elme Delos Santos\n + Added 42 new backgrounds.\n + Notification that tells what the latest update was.\n : Made JavaScript Console, Prompts, and Text Editor translatable.\n : Messaging now loads 10 messages by default instead of 5.\n\n" +
            "05/23/2017: A1.9.2.1\n - Removed security hole from Messaging\n + Messaging now highlights real admins green.\n : Suppressed a bug in Camera.\n\n" +
            "05/24/2017: A1.9.2.2\n + Added custom style by Elme Delos Santos.\n\n" +
            "05/28/2017: A1.9.2.3\n : Messaging app is a bit more secure.\n + If a notification is already open, additional dialogs will flash the notification to attract attention.\n + Added 'Into Your Arms' and 'Live For The Drop' to Music Visualizer. Both songs are by Capital Kings and I claim no rights to them.\n\n" +
            "05/29/2017: A1.9.2.4\n : Notification for latest update only happens if the latest update is new.\n : Fixed Messaging encoding names incorrectly since the 1.9.2.3 update.\n\n" +
            "05/30/2017: A1.9.2.5\n : Messaging app is, once again, more secure. One side effect of this update is that all messaging usernames were reset. Just re-enter your name again to get it back.\n\n" +
            "06/01/2017: A1.9.3.0\n + Added Style Editor app to more easily edit Custom Styles. \n : Moved Boot Script into the Applications List.\n : Reboot now correctly reboots to aOS.\n + Version of aOS is now included in error reports. Chrome cache sucks for debugging.\n : Even easier to tell admins in messaging now.\n\n" +
            "06/02/2017: A1.9.3.1\n + Images can now be sent in messaging. [IMG]http://URL.HERE/image.png[/IMG]\n - Fixed error in Google Play version where aOS attempts to determine its last version via localStorage.\n - Fixed error in Google Play where, when loading a desktop previously loaded on a PC, NORAA throws an error at boot and fails to initialize.\n\n" +
            "06/03/2017: A1.9.3.2\n + Windows now minimize to the correct position on the taskbar.\n\n" +
            "06/05/2017: A1.9.3.3\n : Fixed backslash error with names in Messaging.\n\n" +
            "06/06/2017: A1.9.4.0\n + Added App Search functionality to Dashboard\n + Added new types of Dashboard, Windows 7 and Whisker Dashboards, they can be found in settings.\n : Renamed Apps List to Dashboard.\n\n" +
            "06/13/2017: A1.9.4.1\n : Fixed error in psuedo-GRUB that prevents aOS from loading in Google Play app and older browsers\n : Forced Chrome to ignore cached version of script and style on reboot/refresh. Take that, Chrome!\n\n" +
            "06/18/2017: A1.9.5.0\n + Added Windows 7 theme to Custom Styles in Settings.\n + Added new Android-like Dashboard setting.\n + aOS will now try to keep your device awake while in use.\n\n" +
            "06/19/2017: A1.9.5.1\n : Fixed error when attempting to change Dashboard in settings.\n\n" +
            "06/22/2017: A1.9.6.0\n + Added timestamps to Messaging\n + Added Discussion Topics in Messaging.\n\n" +
            "06/29/2017: A1.9.6.1\n + Made timestamps in messaging easier to read.\n\n" +
            "07/10/2017: B0.1.0.0\n + AaronOS Beta has finally begun development!\n - Removed apps that are abandoned or bloatware: Window Test Application, Test App 2, RD, PNG Saver, Canvas Video Games, The Internet, Mouse Recorder, TI-83+ Simulator, aOSimg Editor, Change Calculator, Performance Monitor, Simon, Bug Central, Remote Desktop Host, Remote Desktop Viewer, External Debug, Alternate Mouse Control, Online Debug Connection, File Binary, Jana, and Dark Room.\n : Files app renamed to File Manager to avoid confusion.\n : All filesaving is now local.\n + Support for apps to add folders to USERFILES has been added.\n : Saving files is now different programmatically - just save the file in USERFILES, then invoke apps.savemaster.vars.save() with no arguments to save.\n\n" +
            "07/11/2017: B0.1.1.0\n : Changed UI from using ugly purplish colors to sleek black-and-white and inputs, with subtle hints for hovering, clicking, and focus. Affected are buttons, inputs, and textareas.\n : Changed horizontal dividers to look better - works best on white or black backgrounds.\n : Changed the look of the context menu - now looks less ugly and gray, now has sleek feel to it.\n : Changed the display size of most icons - they are now evenly powers of two (16, 32, 64, 128, etc).\n\n" +
            "07/12/2017: B0.1.1.1\n + Added application to help me test the UI of the beta.\n : Changed window title bars back to normal, as they were huge before.\n : Changed window caption icons to 32x32 instead of 20x20. The icons now scale cleanly.\n\n" +
            "07/16/2017: B0.1.2.0\n : Settings background is now truly black.\n : Fixed color of shadow for context menu.\n : Changed context menu icons.\n\n" +
            "07/17/2017: B0.1.2.1\n - Removed local file saving, as it caused issues.\n + Re-added cloud file-saving, as removing it broke the original vision for aOS - a desktop that lives in the Cloud.\n\n" +
            "07/23/2017: B0.1.3.0\n + Added rudimentary GTK theme support - use the GTK Conversion app to turn a GTK theme into a compatible aOS theme.\n\n" +
            "07/24/2017: B0.1.3.1\n + GTK Theme Converter now removes some lag sources (wildcards ftw) and supports inputs and textareas, as well as selection colors.\n\n" +
            "07/31/2017: B0.1.4.0\n + 15 new icons from Nightmare Sphere developer Hasan Shahrier - great job, Hasan! More icons on the way.\n\n" +
            "08/05/2017: B0.1.4.1\n + 16 new icons from Nightmare Sphere developer Hasan Shahrier - great job again!\n : Default window background changed - cleaner now.\n - Removed many desktop icons, as at the moment, built-in icons cannot be removed, and it made the screen look cluttered.\n\n" +
            "08/07/2017: B0.1.4.2\n + Changed cursor set to KDE Breeze and added open/closed hand for moving and resizing windows.\n : Changed Window Background Image to one that is much more subtle and doesn't distract from content.\n\n" +
            "08/08/2017: B0.1.5.0\n + Added new ScreenSaver, Bouncy Ball, which bounces a ball around the screen with realistic(ish) physics.\n : Fixed Settings icon color.\n : Changed default screensaver to Bouncy Ball.\n\n" +
            "08/14/2017: B0.1.6.0\n + Added new Modding Tutorials app and a tutorial for making your own NORAA apps.\n : Changed default screensaver back to Hue, as Bouncy Ball had some locking problems. Still have no idea what happened.\n : Changed error message to be a bit less intimidating.\n\n" +
            "08/15/2017: B0.1.7.0\n + Added App Information Viewer that allows you to see the full app icon and a help page for an app.\n + Added Help Pages for all built-in apps on the App Information Viewer.\n\n" +
            "08/21/2017: B0.1.8.0\n : Changed symbols used in window control buttons, they are now all the same size and are more consistent\n : Fixed setting names in Messaging\n : Fixed Bouncy Ball screensaver and set as default again.\n : Changed default Window Fade Distance to 0.8 from 0.5, it is smoother and less distracting \n + Added password setting in Settings - Information.\n\n" +
            "08/22/2017: B0.1.8.1\n + Added support for HiDPI displays in Settings - Screen Resolution\n : Changed CORS proxy to https://cors-anywhere.herokuapp.com/ and NORAA can now answer 'what is' questions again.\n\n" +
            "08/23/2017: B0.1.8.2\n : Fixed cutoff of icons on window titlebar\n + Added funny error messages\n : Fixed File Manager UI\n : Fixed JavaScript Console UI\n : Fixed crash in Firefox when typing into alert box\n\n" +
            "08/24/2017: B0.1.8.3\n + Added Phosphor screensaver from Linux XScreenSaver and set as default.\n : Fixed screensavers freezing aOS when deactivated by keypress.\n\n" +
            "09/08/2017: B0.1.8.4\n : Window titlebar buttons look much cleaner now; font is consistent across devices and looks less like text than a button.\n\n" +
            "09/09/2017: B0.1.8.5\n : Fixed close button on notifications\n\n" +
            "09/12/2017: B0.1.9.0\n : Updated mobile app to the Beta version of aOS.\n : Updated mobile adaptations to work better. Someone please give feedback if it works right!\n\n" +
            "09/21/2017: B0.1.9.1\n + Added touch and clear to Bash Console.\n\n" +
            "09/23/2017: B0.1.9.2\n : Fixed Phosphor screensaver.\n\n" +
            "10/05/2017: B0.2.0.0\n + Taskbar Widgets! All right-side content of taskbar is now Widgets. This is a major update and a major improvement over the old style.\n\n" +
            "10/06/2017: B0.2.1.0\n + Added Network Widget\n : Fixed positioning of context menu when screen is scaled\n : Fixed position of moving windows when screen is scaled.\n + Added new folder to File Explorer for the new taskbar widgets, so their source can be explored just like apps.\n : Fixed cursor style issues in Files Explorer.\n : Fixed some horribly inefficient code in text editor.\n\n" +
            "10/07/2017: B0.2.2.0\n + Added CPU load widget; every piece of the original taskbar is now available again.\n\n" +
            "10/21/2017: B0.2.2.1\n : Fixed a bug with moving windows caused by screen scaling.\n\n" +
            "11/11/2017: B0.2.2.2\n - Removed annoying false error prompt from music visualizer.\n\n" +
            "11/16/2017: B0.2.2.3\n : Easier to use notifications, when closing notification and another is waiting, it slides out and back in so you can tell there are more.\n + Minor spam protection in Messaging.\n\n" +
            "01/01/2018: B0.2.2.4\n : Images added to Messaging now have 3px padding around them.\n\n" +
            "01/10/2018: B0.2.2.5\n : Changed description in GRUB from Unstable to Current.\n\n" +
            "01/20/2018: B0.2.2.6\n : Made the method of forcing https more efficient.\n\n" +
            "01/24/2018: B0.2.3.0\n + Added menu for Battery Widget.\n : Finally fixed bug where windows disappear if you click on other windows too many times. It should be impossible now.\n + Laid groundwork for new Mobile Mode. Very unstable so far, so disabled.\n\n" +
            "01/26/2018: B0.2.3.1\n : Fixed size of icons in Android, Aero, and Wisker dashboards so that they are readable with the new icons.\n : Fixed the scrollbar in the Dashboard so it does not disappear if the list gets too short during a search.\n\n" +
            "02/05/2018: B0.2.3.2\n + Added [b], [i], and [u] to Messaging. Along with [img], all are now case insensitive.\n\n" +
            "02/06/2018: B0.2.3.3\n : Fixed password-setting error in Settings.\n\n" +
            "02/07/2018: B0.2.3.4\n : Actually fixed Messaging, the last fix didnt work.\n - Removed notification bell from Messaging when window is focused and Messaging is not minimised.\n + You can open the system context menu by right-clicking on the border or an empty space on the aOS context menu.\n : Fixed NORAA barrel roll and aileron roll.\n + Added psychedelic secret command.\n - Removed varsOriginal from all apps since it was completely unused and took up a lot of memory.\n\n" +
            "02/08/2018: B0.2.4.0\n : Made the loading screen easier to read.\n : Changed several ugly loading icons into the aOS logo.\n + Added a web manifest for if you add the site to your homescreen.\n + aOS will now keep itself from being scrolled out place.\n : Fixed a performance issue.\n : Fixed some security issues.\n\n" +
            "02/09/2018: B0.3.0.0\n + Added taskbar widget that shows the number of online users!\n + New icons in Settings.\n + Added a Safe Mode accessible by adding '?safe=true' to the URL.\n : Windowblur now works properly when windows are defocused.\n : Made the Messaging settings window a bit less horrible.\n + Added notifications for Messaging when the app is minimised.\n : File shortcuts have been replaced with JavaScript shortcuts.\n : Made the desktop background menu far less demanding and added a new background.\n + AaronOS can now be reset.\n\n" +
            "02/10/2018: B0.3.0.1\n : The BootScript itself is no longer ignored by Safe Mode, but instead the user must manually make the bootscript ignore Safe Mode.\n\n" +
            "02/11/2018: B0.4.0.0\n + Serious security enhancements reguarding passwords. This is a major improvement.\n : BootScripts are now forced to obey Safe Mode again.\n - Removed accidental double-stacking of the same element within itself in the taskbar, should help performace.\n : Updated the preview page for the Custom Style Editor to the Beta.\n - Removed test for the WakeLock API as no devices support it and it was generating a cryptic error.\n\n" +
            "02/12/2018: B0.4.1.0\n + Added Glass Windows to the Custom Styles gallery.\n : NORAA now uses DuckDuckGo instead of Bing. It makes his life much easier.\n : The CORS proxy ping at aOS launch will now ping DuckDuckGo instead of Bing. Goodbye, Bing!\n - Bing has finally been completely removed from AaronOS.\n\n" +
            "02/13/2018: B0.4.1.1\n + The file saver system will now alert on errors.\n : Major network performance fix. aOS now uses almost exactly half of the network data it used to.\n : Major security issue with file saving was addressed.\n\n" +
            "02/15/2018: B0.4.2.0\n : The Changelog is now displayed Newest-First.\n + The password checking page now auto-focuses and responds to the enter key.\n : Messaging requires you to be logged in, but only if you had manually set a password.\n : Fixed security issue with passwords.\n + Added official File API for external servers. Details in Settings - Advanced.\n : Fixed issue with files not persisting for new users.\n : Fixed issue with ending script tag in files crashing aOS.\n\n" +
            "03/01/2018: B0.5.0.0\n + Flow Mode - Squiggly line on right side of task bar. Compare to Win10's Task View.\n\n" +
            "03/03/2018: B0.5.0.1\n + More verbose error messages in Messaging.\n : The password field is now a proper password field.\n : Fixed some spam issues in Messaging.\n\n" +
            "03/06/2018: B0.5.0.2\n : Fixed issue where some windows would bug out if opened right after closing them.\n\n" +
            "03/20/2018: B0.5.1.0\n : Made the default Dashboard look a bit better.\n\n" +
            "03/24/2018: B0.6.0.0\n : Boot should be slightly faster on desktop, and at least 5x faster on mobile.\n : Default Windowblur Radius is default to 5 again.\n : Made the password screen and loading screen far more user friendly, and now looks somewhat like a real login screen now.\n : Tweaked the Dashboard again.\n\n" +
            "04/09/2018: B0.6.0.1\n : Fixed auto-scroll in Messaging.\n\n" +
            "04/11/2018: B0.7.0.0\n : The App Maker has recieved a serious makeover! It should now be far easier to use.\n + The current state of Windowblur and BackdropFilter Blur are now correctly shown in Settings.\n : Fixed minor error in NORAA.\n\n" +
            "04/15/2018: B0.7.1.0\n + The music visualizer now accepts local files! Play any song you like in the Music Visualizer!\n : Music Visualizer default sensitivity adjusted.\n - Music is no longer stored on the server.\n\n" +
            "04/16/2018: B0.7.1.1\n : Audio delay in music visualizer is raised from 150ms to 200ms. The audio and visualizer should be better synced now.\n\n" +
            "04/18/2018: B0.7.1.2\n : Fixed a major issue in Messaging.\n + Online Users Widget now displays an 'X' when it can't connect to aOS.\n\n" +
            "04/19/2018: B0.7.1.3\n + Images in messaging can be expanded by clicking on them. They don't take up more space than necessary, otherwise.\n\n" +
            "04/25/2018: B0.7.1.4\n : Fixed Windows 98 and XP custom styles.\n : Changed the way CustomStyles works; this decreased the download size for aOS.\n : Fixed issue where Windowblur would incorrectly set its position.\n\n" +
            "04/26/2018: B0.7.1.5\n + Added Linux Mint Y Dark theme in Settings -> Custom Styles.\n\n" +
            "04/27/2018: B0.7.1.6\n + Minor debug feature added to Messaging.\n\n" +
            "05/29/2018: B0.7.2.0\n + Added Live Background option for using a website as a desktop background.\n + Added optional Dark Mode that can be toggled in Settings -> Windows\n : To make the UI more consistent, NORAA, Bash, and the Javascript Console all use themes that match the current light/dark mode.\n : Desktop icons now correctly align to the grid when placed by the user.\n\n" +
            "06/12/2018: B0.8.0.0\n + Added Web App Maker, which lets you turn any compatible webpage into an aOS app!\n : Changed the scrollbar and made it Dark Mode compatible.\n : Made a minor change to the code for Messaging.\n\n" +
            "06/13/2018: B0.8.0.1\n : Fixed an issue in the backend with filesaving.\n\n" +
            "06/14/2018: B0.8.1.0\n : Serious rework of Desktop Icon Maker.\n : Fixed NORAA, JS Console, and Bash Terminal theme compatibility - they no longer ignore Custom Styles.\n - Removed super annoying and cryptic file deletion alert.\n\n" +
            "06/15/2018: B0.8.2.0\n : Cleaned up the desktop a little.\n + Added Controls popups for IndyCar and House Game\n\n" +
            "06/20/2018: B0.8.3.0\n + Added red color to music visualizer.\n\n" +
            "06/21/2018: B0.8.3.1\n + Added padding that is enabled by default in all apps, however apps with special UI's are allowed to turn off the padding.\n : Tweaked green cutoff at red in music visualizer.\n\n" +
            "06/26/2018: B0.8.3.2\n : Not really an update, but the Music Visualizer icon is now displayed on the desktop.\n\n" +
            "07/11/2018: B0.8.4.0\n + Added [url] support to Messaging.\n : Rewrote the entire BBCode system in Messaging, is far more reliable and flexible. It can also support extension by developers now.\n\n" +
            "07/20/2018: B0.8.5.0\n : Modified the way that aOS names window, taskbar, and desktop elements. No longer are three-letter ID's required to be unique, and there should be no more conflicts in HTML IDs.\n : Updated necessary apps, to work correctly with this change. Please ensure that your own custom-made apps and scripts reflect the change as well.\n\n" +
            "07/24/2018: B0.8.6.0\n + Added [color], [glow], [outline] to Messaging.\n + Messaging usernames can now use BBCode tags that are marked as safe.\n + Added formatting list to Messaging.\n : Fixed issue with resizing windows and moving app icons.\n\n" +
            "07/25/2018: B0.8.6.1\n + Added [font] to Messaging.\n : Fixed BBCode rendering of usernames in Online Users widget and the Messaging notifications.\n\n" +
            "08/01/2018: B0.8.6.2\n : Made Glass Windows theme compatible with dark mode.\n : Fixed disappearing scrollbars in some Dashboard menus.\n : Fixed redundant scrollbar in some Dashboard menus.\n\n" +
            "08/24/2018: B0.8.6.3\n + Apps can now temporarily block the screensaver. Useful for games, videos, etc.\n : Fixed size and positioning of logo on Wikipedia screensaver.\n : Camera, Music Visualizer, IndyCar game, and House Game now block the screensaver.\n\n" +
            "09/27/2018: B0.8.6.4\n : Slightly modified API for Messaging.\n\n" +
            "10/06/2018: B0.8.7.0\n + Added [site] to messaging.\n\n" +
            "10/11/2018: B0.8.7.1\n : Fixed an issue that recently came up, where any files with newlines would crash aOS on boot.\n\n" +
            "10/12/2018: B0.8.8.0\n + New default wallpaper and window color!\n + New Parallax Background option in Settings -> Background. Your wallpaper scrolls around when you move your mouse!\n : Fixed issues with CustomStyles.\n\n" +
            "11/07/2018: B0.8.8.1\n + New custom style preset, Terminal!\n\n" +
            "11/08/2018: B0.8.9.0\n + Added new Minesweeper clone for aOS!\n + The Linux Mint custom style now obeys light / dark mode settings!\n\n" +
            "11/09/2018: B0.8.9.1\n + Added new settings to Minesweeper - Omnipresent Grid, Automatic Clearing, and Safe First Move.\n + Added a new feature to Minesweeper - Easy Clear!\n : Adjusted placement of text in Minesweeper.\n : Fixed issue in Minesweeper where empty regions wouldn't clear all the way.\n\n" +
            "11/10/2018: B0.8.9.2\n : Updated the Camera app to use newer API.\n : aOS only nags you to download Chrome once, instead of every time it loads.\n : Fixed bug with Easy Clear in Minesweeper that lets you place flags on broken blocks.\n : Various fixes in Minesweeper\n - Removed automatic win in Minesweeper if all blocks are cleared, was causing bugs\n : Settings can now be changed in standalone Minesweeper.\n\n" +
            "11/18/2018: B0.8.9.3\n : Made the login screens a bit smoother.\n + aOS will prompt users to set a password after five minutes on brand new accounts.\n\n" +
            "11/20/2018: B0.8.9.4\n + Added [br] and [hr] in Messaging.\n : Adapted bbcode parser to accept [tag=param] to give parameters to a tag.\n : Adapted bbcode parser to properly handle unclosed tags.\n : Fixed a vulnerability in Messaging.\n\n" +
            "11/21/2018: B0.8.9.5\n + Almost any text field in the system supports Copy/Paste now. Developers no longer have to manually register their text field for copy-paste tools.\n : Fixed XSS vulnerability in Copy-Paste menu.\n\n" +
            "11/25/2018: B0.9.0.0\n + Added system that allows embedded Web Apps to communicate with aOS.\n\n" +
            "11/26/2018: B0.9.0.1\n + Added API documentation to Web App Maker.\n : Fixed a crash in App Maker.\n\n" +
            "11/27/2018: B0.9.0.2\n + Pasting from the aOS clipboard will now replace text correctly based on selection.\n\n" +
            "11/28/2018: B0.9.1.0\n + JS Paint by Isaiah Odhner\n + Pipes Screensaver by Isaiah Odhner\n + Window controls can be moved to the left side.\n\n" +
            "11/29/2018: B0.9.1.1\n + Widget Menu now correctly positions itself on non-bottom taskbar position.\n : Window hover frame correctly positions itself on non-bottom taskbar position.\n - Removed clutter, useless or abandoned options from Settings.\n : Rearranged some Settings items, more important options at the top.\n + JSPaint loading is opaque.\n\n" +
            "12/01/2018: B0.9.1.2\n + Log Out option added to power menu.\n : Shut Down option now logs you out.\n\n" +
            "12/03/2018: B0.9.1.3\n + exit command in Bash.\n : Fixed HTML Entities in Messaging names.\n\n" +
            "12/08/2018: B0.9.1.4\n : Fixed WindowBlur rendering the wrong part of the background when custom taskbar positions are selected.\n : Fixed windows minimize animation going to wrong place when custom taskbar position is set.\n\n" +
            "12/13/2018: B0.9.1.5\n - Removed Beta Testing App, Search App (implemented elsewhere), Mathway App\n\n" +
            "12/17/2018: B0.9.1.6\n : Dashboard and Apps Browser are now alphabetized. How did I miss that?\n\n" +
            "12/20/2018: B0.9.1.7\n : aOS now checks that requests come from the actual current server, rather than checking specifically for the aOS official server. This means aOS should now, in theory, be portable.\n : aOS now checks for images in the folder (if any) that it resides in, instead of automatically picking the root folder.\n\n" +
            "12/22/2018: B0.9.1.8\n : IE11 no longer rejects aOS for containing spread notation (...) in its source code.\n + On Internet Explorer, Windowblur defaults to off.\n : Fixed double prompts appearing on non-Chrome browsers; should only appear once now.\n\n"  +
            "12/23/2018: B0.9.1.9\n : Fixed issue that caused portability to not actually work.\n\n" +
            "12/24/2018: B0.9.1.10\n + Begun work on experimental replacement file manager.\n\n" +
            "01/01/2019: B0.9.1.11\n + AaronOS now has an EULA for those who wish to deploy aOS on their own server or otherwise use its code, available at /eula.txt\n + If the code is hosted on an unofficial server, a note will be dynamically added next to the Copyright Notice in Settings -> Information, with a link to the official AaronOS server. AaronOS deployers - this note is not under any circumstances to be removed or its text altered in any way, with the exception of being moved to another location at the top of an easily-accessible menu in Settings, alongside its Copyright Notice.\n + Apps can now be pinned to the taskbar.\n : Fixed Camera app.\n : Changed question mark in File Manager to refresh symbol.\n : Adjusted Mint-Y theme.\n : Google Play prompt now only occurs once.\n\n" +
            "01/02/2019: B0.9.2.0\n + Added Text To Binary app.\n\n" +
            "01/04/2019: B0.9.3.0\n + Text To Binary app can now decode images.\n\n" +
            "01/05/2019: B0.9.3.1\n : Minor memory fixes in Text To Binary\n + Text To Binary now has a standalone page at binary.php\n\n" +
            "01/07/2019: B0.9.3.2\n : Battery widget is hidden on devices/browsers that don't support it.\n\n" +
            "01/17/2019: B0.9.4.0\n + New experimental Mobile Mode\n : Windows can now be correctly resized by any edge.\n + Two new battery widget modes, Text and Old.\n + JS Console now sanitizes input and catches errors.\n : App taskbar icons are now above taskbar widgets, instead of vice-versa.\n\n" +
            "01/20/2019: B0.9.5.0\n : The Psuedo-Bash Console has had a complete rewrite!\n + Apps can now run psuedo-bash code on their own with apps.bash.vars.execute()\n : Pipes now work correctly in Bash.\n : grep is now case insensitive\n\n" +
            "01/26/2019: B0.9.5.1\n : Mutiple windows are now fit onscreen in Flow Mode with Mobile Mode.\n : Caption bars are no longer semitransparent in Flow Mode\n : Data Collection is now false by default, oops.\n\n" +
            "01/27/2019: B0.9.5.2\n + Added some polyfills, extended browser support back just a little bit further.\n\n" +
            "02/01/2019: B0.9.6.0\n + Users can now set a custom Window Border Width.\n\n" +
            "02/02/2019: B0.9.6.1\n : Renamed variables for window resizing from winRot* to winRes* (was leftover from old window rotation).\n\n" +
            "02/03/2019: B0.9.6.2\n : All built-in apps now use the \"auto\" flag when centering their windows, and now consistently center on the same point.\n\n" +
            "02/04/2019: B0.9.7.0\n + Approximate loading percentage bar on boot.\n : Loading messages are shorter.\n : Fixed error that occurred when using the touchscreen during boot.\n\n" +
            "02/05/2019: B0.9.8.0\n + Begun work on rewriting the new replacement file manager.\n\n" +
            "02/06/2019: B0.9.9.0\n + Added view modes to experimental file manager.\n + Added file icons to experimental file manager.\n\n" +
            "02/08/2019: B0.9.9.1\n + Added experimental subpixel antialiasing to icons in Files 2\n\n" +
            "02/09/2019: B0.9.9.2\n : Function Grapher no longer requires 'Math.'\n : Function Grapher informs user of ^ operator.\n : Your USERFILES are now loaded separately from the page source, and are initialized in a better way. In some ways this is faster, in other ways it's slower. But in all ways it appears to be more stable than before.\n : Fixed USERFILES sometimes being set to null when your folder is empty.\n\n" +
            "02/10/2019: B0.9.9.3\n : Function Grapher only notifies on ^ once.\n\n" +
            "02/11/2019: B0.9.9.4\n + Source Code Line of the Day in JS Console.\n + More detailed loading performance info in JS Console.\n - Removed unnecessary logs from JS Console.\n : Files 2 no longer accidentally sends the wrong name to Text Editor for USERFILES entries.\n : Files 2 is much more stable when encountering 'invalid' filenames.\n\n" +
            "02/12/2019: B0.9.10.0\n + File Manager has been replaced File Manager 2.\n + File Manager 2 uses bash for most of its file operations.\n + File Manager 2 has multiple view modes.\n + File Manager 2 has much faster performance.\n + File Manager 2 has file icons.\n + File Manager 2 is compatible with mobile mode and custom border width.\n + File Manager 2 is far more stable.\n + Begun work on replacement text editor.\n + TE2 can now edit and save functions.\n\n" +
            "02/13/2019: B0.9.10.1\n + Users can now type a path into Files 2\n : Files 2 handles empty and null directories better.\n : TE2 handles bad input better.\n : Fixed some copy/paste icons\n\n" +
            "02/14/2019: B0.9.10.2\n + Desktop icons will rearrange to fit the size of the desktop if it changes.\n : Deleting files actually works now.\n + Any function calling the sh() command will get its own personal workdir for working in Bash. Note that this only applies to the specific function that called sh()\n + Three new commands - sh(bashCommand), ufsave(userfile, content), and ufdel(userfile).\n - Removed 'unfinished' message from Bash Console.\n - Notification content no longer pushes into button row.\n : LOTS of backend code fixes.\n\n" +
            "02/20/2019: B0.9.10.3\n + Some backend support for subdirectories in USERFILES, courtesy of SkyeEverest.\n + Included fallbacks for CSS var(), for IE.\n : Automatically sets a darker, opaque background color for IE.\n : Serverside error reports now report the correct line number.\n\n" +
            "02/25/2019: B0.10.0.0\n + USERFILES now supports psuedo file extensions.\n + Full backend and frontend support for folders in USERFILES.\n : Text Editor 2 now assumes USERFILES, instead of the other way around.\n + Files 2 and Text Editor 2 now properly handle folders in USERFILES.\n - aOSpassword cannot be modified except for setting a new password.\n - aOSpassword cannot be viewed.\n + Added some padding on the boot loading bar.\n : Clipboard now uses JSON for storage.\n\n" +
            "02/26/2019: B0.10.1.0\n + Added search bar and new folder / new file buttons to the File Manager.\n - Removed backend messaging dependency on setting.txt\n + System admins can now just straight-up delete messages instead of editing their content and erasing it.\n\n" +
            "02/27/2019: B0.10.2.0\n + Pet Cursors app! Users can create custom cursors that follow their mouse around. Each has their own, specialized personality.\n\n" +
            "02/28/2019: B0.10.3.0\n : Changed window caption font from Courier to Consolas\n + Added a small shadow to caption buttons.\n : Numerous fixes for Pet Cursors\n\n" +
            "03/25/2019: B0.11.0.0\n + Added Foxxo pet cursor.\n : Misc updates that I forgot to include in the log. But mostly the fox cursor.\n\n" +
            "03/26/2019: B0.11.0.1\n : Fixed Terminal stylesheet.\n\n" +
            "03/28/2019: B0.11.0.2\n : Fixed Help App crashing on launch.\n\n" +
            "03/30/2019: B0.11.1.0\n + Custom Style Editor now uses a live preview of a real AaronOS instance to test your stylesheets in real-time.\n - Fake AaronOS desktop for use with Style Editor has been removed.\n : Errors now show in notifications instead of JavaScript alerts which hang aOS.\n\n" +
            "03/31/2019: B0.11.1.1\n : Cleaned up many of the CustomStyles themes.\n\n" +
            "04/03/2019: B0.11.1.2\n : Fixed Fullscreen button in Settings (thank you CerebralDatabank)\n : Modified filetype description positioning in File Manager 2.\n\n" +
            "04/04/2019: B0.11.2.0\n : Apps now wait until the window closing animation is finished before clearing their content, looks way better now.\n : Fixed error when right clicking a file with a period in its name in FIL2.\n : Properties app now uses bash file paths instead of JS object paths.\n : Fixed window titles overlapping buttons on right side.\n : Fixed some apps not clearing their window content after being closed.\n : Fixed the LiveElement system erroring out in its error handler.\n\n" +
            "04/05/2019: B0.11.3.0\n + Sidebar in the File Manager including the new Home, Favorites and Navigation features.\n : The main page of the File Manager is now called Home\n + Favorites list in File Manager, to save important locations.\n + Navigation list in File Manager, to jump around in the current path.\n : Buttons for touch and mkdir in File Manager moved to the right side.\n + Add Favorite button added to left side of File Manager's toolbar.\n + Descriptions for the File Manager's toolbar buttons will now appear when hovered over.\n + Rounded corners on the top edge of the File Manager's content.\n : The left edge of the File Manager's Location and Search boxes are now lined up with the left edge of the main content.\n : Fixed caption bars in the Windows 98 theme.\n\n" +
            "04/07/2019: B0.11.3.1\n + Progress bar for shutdown.\n : Fixed shutdown screen.\n\n" +
            "04/10/2019: B0.12.0.0\n : Context Menu has recieved a visual overhaul.\n + LOCALFILES, a place to save files locally instead of online.\n + New aos_system folder in USERFILES\n - system files are no longer dumped into the root directory of USERFILES >.<\n : All system files moved into the aos_system folder.\n : All system files given new, more sensible names\n + File Browser Debug is now persistent.\n : Added missing icon for File Browser Debug.\n : Fixed Minesweeper Easy Clear setting not saving.\n : Fixed APM using old text editor.\n : Boot should be slightly faster, as several slow functions were sped up.\n\n" +
            "04/12/2019: B0.13.0.0\n + Added Music Player\n\n" +
            "04/14/2019: B0.13.0.1\n + Added aaronos.dev as the new official AaronOS server.\n : Updated README, EULA, and privacy policy to reflect the new server address.\n : Fixed several serverside issues.\n\n" +
            "04/15/2019: B0.13.0.2\n + Unlocked rotation on PWA.\n : Fixed password screen using old background instead of new one.\n - Removed accidental debug logging to console on arranging icons.\n\n" +
            "04/17/2019: B0.13.0.3\n + Hidden iFrame Browser app for debugging.\n\n" +
            "04/18/2019: B0.14.0.0\n + Background image fit settings (cover, center, etc)\n + Added data-parent-app attribute for iframes, will bring the specified app to top if the iframe has focus.\n + The currently focused app is displayed on the window's title.\n\n" +
            "04/19/2019: B0.15.0.0\n : Window captions are now 32px high to fit the whole icon.\n : Window caption buttons are now whole instead of hanging on to the top of the window.\n + Begun work on Smart Icons.\n + Smart Icons Settings.\n + Smart Icon Creator.\n + Smart Icon Template Files.\n\n" +
            "04/21/2019: B0.15.0.1\n : All app icons are now treated as Smart Icons. Any legacy icons are converted.\n : Made JSConsole colors readable.\n\n" +
            "04/23/2019: B0.15.0.2\n : Fixed CustomStyles\n : Fixed Task Manager trying to update its content when its window is closed.\n\n" +
            "04/27/2019: B0.15.0.3\n + Testing more Smart Icons\n : Fixed CSE's text editor focusing its window on click, making the context menu unusable.\n : Fixed constantly bringing iframe owner to top unnecessarily, breaking context menus and such.\n\n" +
            "05/09/2019: B0.15.0.4\n : Fixed security in login system.\n\n" +
            "05/11/2019: B0.16.0.0\n + Music Player recieves a huge upgrade, with visualizations and color schemes. This is work-in-progress.\n : The Music Visualizer app will be assimilated into Music Player and removed in a future update.\n\n" +
            "05/12/2019: B0.16.1.0\n + Added Smoke effect to Music Player.\n + Added Eclipse and various color schemes to Music Player.\n\n" +
            "05/14/2019: B0.16.2.0\n + Added Obelisk and Smoke Rings to music Player.\n + Added Pride colors to Music Player.\n : Renamed several colors in visualizer.\n : Drastic performance improvements in most of Music Player's visualizers. (typically double framerate in the really bad ones)\n : Reorganized visualizer and color menus in music player.\n\n" +
            "05/14/2019: B0.16.2.1\n + Added Window Color to Music Player (colors aOS windows to the beat)\n + Added Spikes 1:1 to Music Player (spikes, but not distorted)\n + Added microphone option to Music Player.\n : Music Player's Monstercat and Obelisk bars are now sitting on a slightly reflective surface in Smoke mode.\n\n" +
            "05/18/2019: B0.16.2.2\n + Added buildMarquee(text), to create a custom marquee.\n : Changed all custom attributes to use data- names.\n\n" +
            "05/25/2019: B0.16.3.0\n + Yet another huge music player update. Too much content / fixes over several days to list everything.\n\n" +
            "07/13/2019: B1.0.0.0\n + Added the aOS Hub, where users can search for apps, scripts, etc.\n + Repository and package system added.\n : Apps moved to repository: Cookie Clicker, Calculator, GTK2aOS, JS Paint.\n : Fixed filenames and directories containing the / character breaking bash.\n - Removed old music visualizer.\n + Restored ability to delete files in USERFILES.\n + Boot Script editor now supports multiple boot scripts.\n : List of Custom Styles is moved to repository.\n + Custom Style system can now handle multiple 3rd-party stylesheets as well as the user's style.\n + Settings menu for Smart Icons.\n + Added Accumulative Spikes to Music Player.\n : Bash prompt uses first four characters of ID rather than the whole thing.\n + New default desktop background.\n + Lots of new icons.\n - Window titles no longer become transparent when defocused.\n + Apps can now tell aOS to prompt the user if a restart is required.\n : PostMessage system now uses JSON instead of strings.\n + Major upgrade to PostMessage.\n : Fixed file deletion.\n : Cropped cursor set to avoid deprecation of larger size.\n : Fixed error on displaying a notification with no preview image.\n : Fixed NORAA always listening if the setting was modified rather than if it was enabled.\n : Fixed Files 2 sometimes opening the old text editor instead of the new one.\n : Fixed bash cd not returning to current workdir on failure.\n\n" +
            "07/16/2019: B1.0.1.0\n + Added Smart Icon Settings to the Settings app.\n + Clicking on the progress bar in the Music Player lets you skip to a point in the song.\n + Added Average Pitch visualizer to Music Player.\n + Added marker on progress bar in Music Player to help with transparent color themes.\n : Moved Music Player title to front of caption rather than the end.\n\n" +
            "07/18/2019: B1.0.2.0\n + New custom menu with graphics for selecting visualizers and colors in Music Player.\n + Added static gradient color themes to Music Player.\n + Added Queen color theme to Music Player.\n + Added High Frequency Range to Music Player; requires devconsole to activate the flag (highFreqRange).\n\n" +
            "07/24/2019: B1.0.2.1\n : Fixed issue where aOS would incorrectly state that there was a failure setting a new password.\n : Fixed aOS ignoring correct passwords if their internet is too fast for itself.\n\n" +
            "07/27/2019: B1.0.3.0\n + Music Player has four new visualizers; Curved Lines, Centered Lines, Cave Lines, and Circle Lines. Thanks &Scaron;tefan Schindler for the designs.\n + Music Player has three new color schemes; Rainbow, Rainbow Active, and Pride Blocky.\n : Music Player's Pride color schemes now use HSL instead of RGB, and look much better.\n : In Music Player, fixed Monstercat's bars stretching half a pixel through its floor.\n : Music Player now alerts visualizers when smoke is toggled to prevent canvases forgetting their settings.\n\n" +
            "07/29/2019: B1.0.3.1\n + Added Fast Mode to Music Player, reduces resolution to increase FPS.\n : Fixed login issues related to login tokens.\n : Fixed swapping between aOS instances.\n : Fixed smoke being too intense in Lines-derived visualizers in Music Player.\n : Fixed missing images in music player.\n : Fixed Music Player visualizer menu being open when using non-standard loading methods.\n\n" +
            "08/01/2019: B1.0.4.0\n : Total dark theme revamp; changed dark theme from full-black to dark gray.\n + Style Editor now tells you the ID and class of any element that you hover over in the preview.\n : File Manager, Text Editor now respond to Dark Mode when switched while the app is open.\n + Function Grapher and Dashboard now respond to Dark Mode.\n : Dashboard loads much faster.\n + Dashboard refreshes itself each time it's opened.\n + Added a new class, .darkResponsive, which makes an element automatically set its background-color, color, and border-color for dark or light mode.\n\n" +
            "08/04/2019: B1.0.4.1\n : Fixed login screen not using the correct background image.\n\n" +
            "08/05/2019: B1.0.4.2\n : Fixed Minecraft Mode in minesweeper.\n\n" +
            "08/06/2019: B1.0.5.0\n + Added enchanced graphics to minesweeper.\n\n" +
            "08/07/2019: B1.0.5.1\n + Added aosTools.js - embed the script file into your page for easy aOS app tools.\n - Minesweeper was removed.\n + Standalone version of Minesweeper added to the repository.\n + Minesweeper now themes itself to AaronOS.\n + Minesweeper now saves its settings.\n + Minesweeper now pre-caches shadow images.\n : Fixed caching issues on minesweeper.\n - Removed Dark Mode button from Minesweeper, as this is now controlled by aOS.\n : Music Player now uses aosTools.js, like Minesweeper does.\n + localhost added to auto-trusted domains.\n\n" +
            "08/08/2019: B1.1.0.0\n + Added Developer Documentation app.\n + Extra logic added to prevent app updates from getting delayed by web browser caching.\n : Changed 'appWindow' permission to 'appwindow'\n + Added to appwindow permission: open_window, close_window, maximize, unmaximize, minimize, get_maximized, set_dims\n + Added manualOpen flag to web app json files to make app loading less ugly.\n : Fixed error message in Music Player each time a song is started.\n : Fixed error in aosTools whenever an unrecognized conversation is recieved.\n : Updated Web App Maker's documentation.\n\n" +
            "08/14/2019: B1.1.1.0\n + Style changes are now updated in realtime on web apps via aosTools.\n + Added search box to Developer Documentation.\n + Added prompt actions to aosTools.\n + aosTools can now recieve style updates as they occur on aOS.\n + Added shortcuts for window events to aosTools.\n + Added new documentation.\n\n" +
            "08/15/2019: B1.1.2.0\n + Added buttons to try certain actions to Developer Documentation.\n + Added new documentation.\n : Adjusted formatting in documentation.\n\n" +
            "08/21/2019: B1.1.3.0\n : Changed the default screensaver to Bouncy Ball because it's less intrusive, should it activate when unwanted.\n + Added images to Documentation.\n : Fixed incorrect title on a page in Documentation.\n\n" +
            "09/19/2019: B1.1.4.0\n + Added WIP Weather app to the Hub.\n : Fixed aosTools being unable to make requests cross-domain (basically not working at all)\n\n" +
            "09/20/2019: B1.1.5.0\n + Web Apps can now have services running in the background. Example is weather app will check for alerts for you.\n + Weather app now checks for weather alerts for your area in the background.\n\n" +
            "09/27/2019: B1.1.6.0\n + Added Bass Spectrum to Music Player.\n\n" +
            "09/29/2019: B1.1.7.0\n + Added aOS Blast to the Hub app! It's a simple game where you can watch some AI duke it out with lasers or play it yourself.\n : Changed default screensaver to aOS Blast.\n\n" +
            "09/30/2019: B1.1.7.1\n : Adjusted Blast screensaver.\n + Added configuration in Blast for zoom, AI battle comfort, ship size, ammo labels, and scoreboard.\n\n" +
            "10/08/2019: B1.1.8.0\n + Added Blast visualizer to Music Player\n + Added Featured list to Music Player visualizers for easy access to main visualizers.\n : Replaced inaccurate images for solid colors in Music Player.\n\n" +
            "10/09/2019: B1.1.9.0\n + Added Seismograph and Barsmograph to music player.\n + Blast can now use arrow keys.\n + Added #debug flag to Music Player.\n + Blast in Music Player now shows its debug screen when #bebug is specified.\n + Blast now avoids Chrome's caching.\n\n" +
            "10/12/2019: B1.1.10.0\n + Blast AI has been upgraded; AI can decide to rush their target if they have high health, and will seek distance if their health is low.\n + Added lowFpsLasers flag to Blast - for recording 30fps video from 60fps source.\n\n" +
            "10/30/2019: B1.2.0.0\n : Mobile Mode is set to Automatic by default.\n + Open windows now have a glow on their taskbar button.\n + Enabled Backdrop Filter Blur for the new default window glass effect, making windows visible behind other windows.\n + Context menu will have a blurry background if blurry windows is enabled.\n : Changed hover effect on taskbar buttons.\n : Changed hover and click effect on window buttons.\n : Changed default window color from rgba(190, 190, 255, 0.3) to rgba(150, 150, 200, 0.5)\n : Increased shadow on taskbar text.\n + The type of blur on window borders is now automatically set based on browser support.\n : Moved Mobile Mode option to Screen Resolution category.\n : Moved the Home button in Settings to the right side.\n - Removed button for the pre-alpha Settings menu.\n\n" +
            "11/07/2019: B1.2.1.0\n + Added data mods for Music Player - modifies how visualizers see music data.\n + Added RGB color to Music Player for use with Spikes Classic to find cool patterns.\n : Rearranged UI for Music Player.\n\n" +
            "11/09/2019: B1.2.2.0\n + Added Taskbar Mode to Music Player.\n + Added appwindow:get_borders and appwindow:get_screen_dims to aosTools.\n : Fixed Spectrum and Bass Spectrum visualizers not filling the whole screen in MPl.\n : In theory, fixed Chrome's caching of JS and CSS.\n\n" +
            "11/15/2019: B1.2.2.1\n + Added Window Glass Distortion effect, distorts the background by the glass texture. It's experimental and disabled by default.\n : Fixed Window Glass Blur setting not working.\n : Fixed Live Desktop Background always being enabled if the setting was ever changed.\n\n" +
            "11/23/2019: B1.2.2.2\n : Fixed Glass Distortion preference not saving properly.\n\n" +
            "11/26/2019: B1.2.2.3\n : Fixed Glass Distortion texture not lining up with Window Border texture. (texture was anchored to top, shader was anchored to bottom. both are now bottom)\n + New Smart Icon for window glass test app.\n + New Smart Icon for Blast in the Hub.\n + New icon for Glass Windows style in the Hub.\n\n" +
            "12/14/2019: B1.2.2.4\n + Added FPS compensation to the Blast game. Ships and lasers now run the correct speed regardless of the FPS.\n\n" +
            "12/17/2019: B1.2.2.5\n : Introduction screen to Music Player is far more user-friendly.\n + Added Tiles visualizer to Music player.\n + Improved smoke effect in Music Player. Looks like actual smoke rather than a scrolling image.\n + Added FPS compensation to Music Player (MPl). Allows things to move the correct speed at high/low FPS.\n + FPS compensation for Smoke effect in MPl.\n + FPS compensation in Blast for MPl.\n + Better beat detection in Blast for MPl, velocity-based.\n : Slightly raised sensitivity for Blast in MPl.\n + Added FPS compensation to Rings and Ghost Rings in MPl.\n\n" +
            "12/18/2019: B1.2.3.0\n + Desktop icons can now be quickly created from the Dashboard, and from the taskbar.\n : Completely redid the main menu for Settings.\n + Built-in desktop icons can now be deleted.\n : Changed the look of the 'add desktop icon' feature.\n : Modified the menu for 'About This App'.\n : Completely rewrote the system for desktop icons. They are now more robust and consistent, and easier to program.\n : Adjusted ground reflection effect in Monstercat and Obelisks for MPl.\n : Fixed multiple issues pertaining to desktop icons.\n\n" +
            "12/22/2019: B1.2.4.0\n : Revamped the rest of the Settings UI and reworded most of the setting descriptions.\n : Fixed bug in Aero dashboard.\n : The default Trusted Apps file now dynamically sets itself to trust the current domain, instead of requiring a manual edit on non-official hosts.\n + New icons for Messaging and Sticky Note.\n - Removed some useless setting options.\n : Fixed mislabeled buttons in Files.\n\n" +
            "02/18/2020: B1.2.4.1\n : Fixed reflection of bars in Monstercat and Obelisk music visualizers.\n\n" +
            "06/22/2020: B1.2.5.0\n + AutoScroll for Guitar music writer.\n : Various spellchecks.\n : Various fixes.\n\n" +
            "09/22/2020: B1.2.6.0\n : Moved most image assets out of root project dir, this caused the location of the backgrounds and other assets to change.\n : Rearranged Info tab in Settings.\n : Made copyright notices more accurate.\n : Numerous bug fixes the last few months didn't make it into the changelog.\n\n" +
            "09/23/2020: B1.2.7.0\n + Added Context Menus to Developer Documentation.\n + Added context menus to aosTools; existing Web Apps now allow copy-paste operations, and aosTools allows future Web Apps to create custom context menus.\n + Clicking inside a Web App's window now properly focuses it immediately.\n : Rearranged some articles in Developer Documentation.\n : Fixed context menus breaking completely if the clipboard contains less slots than it thinks it should.\n : Modified a context menu icon.\n\n" +
            "09/24/2020: B1.2.7.1\n : Fixed Settings not immediately responding to changes in Light / Dark theme.\n\n" +
            "11/05/2020: B1.3.0.0\n + Brand new default Dashboard menu, which looks and functions much better.\n : Changed some of the quick options available in the Dashboard.\n + The File Manager can now open apps via right-click on their folder.\n : Changed the Messaging font, rearranged usernames and time/date info.\n : Apps Browser now has a shortened intro and now provides information that is actually useful.\n : Fixed the screen magnifier app.\n + The Custom Style Editor preview will now highlight the bounds of elements when hovered over.\n : Rearranged the Custom Style Editor preview menu.\n : The first message is no longer cut off by the status indicator.\n : Notifications no longer flash an annoying orange glow when attention is required, and instead flash their opacity.\n : File Manager 2 and Text Editor 2 have had the '2' removed from their names.\n : Renamed the old App Maker to Legacy App Maker.\n : Custom apps are now saved in a directory rather than dumped directly into USERFILES.\n - Removed old Text Editor.\n - Removed old File Manager.\n - Removed Flash Cards app.\n - Removed useless Modding Tutorials app.\n - Removed unused Smart Icon Creator app.\n - Removed woefully outdated Help App.\n : Made a section of the Documentation simpler and fixed some typos.\n : House and Indycar games along with Text to Binary are moved to the repository.\n + The Savemaster app now gives you useful information rather than absolutely nothing when its window is open.\n : Task Manager no longer flashes annoyingly while displaying its content.\n : The Sticky Note app now opens in the top-right corner rather than top-left.\n : Reworded the intro to the psuedo-Bash terminal.\n : Reworded the intro to the Pet Cursors app.\n : Reworded some information in File Properties.\n : Windowblur Test Application is renamed to Transparent Window.\n : Chrome prompt is worded less annoyingly.\n : Renamed Boot Script to Boot Scripts\n : Changelog dates are moved to the left side, by their titles.\n : Changed the wording of some startup logs.\n - Removed annoying 'how did you do that?' popups when opening the dashboard and NORAA via unorthodox means.\n\n" +
            "12/23/2020: B1.4.0.0\n + Notifications and modal dialogues can now be visible at the same time.\n + Multiple notifications can be visible at a time.\n + Multiple modal dialogues can be shown at a time.\n : Modal dialogues can now be minimized.\n : Notifications can now be hidden without destroying them.\n : Changed default font of the taskbar widgets.\n : Modified the look of several widgets for consistency.\n + New notification widget.\n + New icons for network widget.\n : Messaging input font now matches the messages.\n : Online Users widget is now disabled by default.\n : Battery widget now stores its settings in the proper folder.\n + Added photosensitivity warning to an easter egg.",
            oldVersions: "aOS has undergone many stages of development. Older versions are available at https://aaronos.dev/AaronOS_Old/"
    }; // changelog: (using this comment to make changelog easier for me to find)
    window.aOSversion = 'B1.4.0.0 (12/23/2020) r0';
    document.title = 'AaronOS ' + aOSversion;
    getId('aOSloadingInfo').innerHTML = 'Properties Viewer';
});
c(function(){
    m('init PPT');
    apps.properties = new Application(
        "PPT",
        "Properties Viewer",
        1,
        function(launchtype, fileToOpen){
            getId('win_properties_html').style.overflow = 'auto';
            if(!this.appWindow.appIcon){
                this.appWindow.setDims("auto", "auto", 400, 500, 1);
            }
            this.appWindow.setCaption('Properties Viewer');
            if(launchtype !== 'openFile' && launchtype !== 'tskbr'){
                this.appWindow.setContent('This app is intended for use with the Files app. Please right-click a file in that app, and select "Properties".');
            }else if(launchtype !== 'tskbr'){
                var filePath = fileToOpen.split('/');
                if(filePath[filePath.length - 1] === ''){
                    filePath.pop();
                }
                if(filePath[0] === ''){
                    filePath.shift();
                }
                
                var fileName = filePath[filePath.length - 1];
                this.appWindow.setCaption(fileName + " Properties");
                
                var fileDescription = "";
                if(filePath[0] === "USERFILES"){
                    
                }else if(filePath[0] === "apps" && filePath.length > 1){
                    fileDescription = "This item belongs to the app " + apps[filePath[1]].appDesc + ".";
                }
                
                this.appWindow.setContent(
                    '<div style="font-family:aosProFont, monospace;font-size:12px; width:calc(100% - 3px); overflow:visible">' +
                    '<span style="font-size:36px;">' + fileName + '</span><br>' +
                    '<span style="font-size:24px;">' + apps.files2.vars.filetype(typeof apps.bash.vars.getRealDir(fileToOpen)) + ' / ' + (typeof apps.bash.vars.getRealDir(fileToOpen)) + '</span><br><br><br>' +
                    fileDescription + "<br><br>" +
                    'File Location: ' + fileToOpen + '<br><br>&nbsp;- ' + filePath.join('<br>&nbsp;- ') + '<br><br>' +
                    /*
                    function(file){
                        if(typeof eval(file) === 'object'){
                            return 'Items in Folder: ' +
                                function(fil){
                                    var counting = 0;
                                    for(var i in fil){
                                        counting++;
                                    }
                                    return counting;
                                }(eval(file)) + '<br>Size of Folder: <button id="PPTcalcfoldsize" onclick="apps.properties.vars.calcFold(' + file + ')">Calculate</button><br><br>';
                        }else{
                            apps.properties.vars.tmpNum = String(eval(file)).length;
                            apps.properties.vars.tmpTry = 0;
                            apps.properties.vars.tmpNmb = apps.properties.vars.tmpNum;
                            while(apps.properties.vars.tmpNum >= 1000){
                                apps.properties.vars.tmpNum = Math.round(apps.properties.vars.tmpNum / 1000);
                                apps.properties.vars.tmpTry++;
                            }
                            apps.properties.vars.tmpStr = apps.properties.vars.tmpByt[apps.properties.vars.tmpTry];
                            if(apps.properties.vars.tmpTry !== 0){
                                apps.properties.vars.tmpStr += apps.properties.vars.tmpNmb + ' Bytes)';
                            }
                            return 'File Size: ~ ' + apps.properties.vars.tmpNum + apps.properties.vars.tmpStr + '<br><br>';
                        }
                    }(fileToOpen) +
                    */
                    '</div>'
                );
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    if(this.vars.counting){
                        apps.prompt.vars.alert('Please don\'t close the window until it is done counting.', 'Oh. I nearly broke stuff.', function(){}, 'Properties');
                    }else{
                        this.appWindow.closeWindow();
                        setTimeout(function(){
                            if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                                this.appWindow.setContent("");
                            }
                        }.bind(this), 300);
                    }
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'This app is used to view file properties in the File Manager.',
            tmpNum: 0,
            tmpByt: [' Bytes', 'KB (', 'MB (', 'GB ('],
            tmpTry: 0,
            tmpStr: ' Bytes',
            counting: 0,
            lastCount: 0,
            lastFile: {},
            calcFold: function(fname){
                this.counting = 1;
                this.lastCount = 0;
                getId('PPTcalcfoldsize').outerHTML = '~ <span id="PPTcalcfoldsize">0</span> Bytes';
                this.lastFile = eval(fname);
                for(var i in this.lastFile){
                    if(this.lastFile[i] !== undefined){
                        c(function(number){
                            apps.properties.vars.lastCount += number;
                            getId('PPTcalcfoldsize').innerHTML = apps.properties.vars.lastCount;
                        }, String(this.lastFile[i]).length);
                    }
                }
                c(function(){apps.properties.vars.counting = 0;});
            }
        }, 2, "properties", "appicons/ds/PPT.png"
    );
    getId('aOSloadingInfo').innerHTML = 'File Manager';
});
c(function(){
    m('init FIL');
    apps.files2 = new Application(
        "FIL",
        "File Manager",
        1,
        function(launchType){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setDims("auto", "auto", 796, 400, 1);
            }
            this.appWindow.setCaption("File Manager");
            this.appWindow.openWindow();
            if(launchType === 'dsktp'){
                this.vars.currLoc = '/';
                getId('win_files2_html').style.background = "none";
                this.appWindow.setContent(
                    '<div id="FIL2topdiv" style="width:calc(100% - 96px); min-width:calc(70% + 48px); right:0; height:50px;">' +
                    '<div title="Back" class="cursorPointer darkResponsive" style="width:34px; height:18px; padding-top:2px; left:5px; top:4px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center;" onClick="apps.files2.vars.back()">&lArr; &nbsp;</div>' +
                    '<div title="Home" class="cursorPointer darkResponsive" style="width:24px; border-left:1px solid #333; height:18px; padding-top:2px; left:30px; top:4px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center;" onClick="apps.files2.vars.home()">H</div>' +
                    '<div title="Refresh" class="cursorPointer darkResponsive" style="width:34px; height:18px; padding-top:2px; right:6px; top:4px; border-top-right-radius:10px; border-bottom-right-radius:10px; text-align:center;" onClick="apps.files2.vars.update()">&nbsp; &#x21BB;</div>' +
                    '<div title="View Mode" class="cursorPointer darkResponsive" style="width:24px; border-right:1px solid #333; height:18px; padding-top:2px; right:31px; top:4px; border-top-right-radius:10px; border-bottom-right-radius:10px; text-align:center;" onClick="apps.files2.vars.setViewMode()">&#8801;</div>' +
                    '<div id="FIL2path" class="darkResponsive" style="left:55px; font-family:monospace; height:25px; line-height:25px; vertical-align:middle; width:calc(100% - 110px); border-top-left-radius:5px; border-top-right-radius:5px;"><div id="FIL2green" style="width:0;height:100%;"></div><div style="width:100%;height:25px;"><input id="FIL2input" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:25px;padding:0;padding-left:8px;border-top-left-radius:5px;border-top-right-radius:5px;" onkeypress="if(event.keyCode===13){apps.files2.vars.navigate(this.value)}" value="/"></div></div>' +
                    '<div id="FIL2viewModeIcon" style="pointer-events:none; color:#7F7F7F; text-align:right; left:55px; font-family:monospace; height:25px; line-height:25px; vertical-align:middle; width:calc(100% - 110px);"></div>' +
                    '<div id="FIL2search" class="darkResponsive" style="left:55px; top:26px; font-family:monospace; height:24px; line-height:24px; vertical-align:middle; width:calc(100% - 110px);"><input id="FIL2searchInput" placeholder="Search" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:20px;padding:0;padding-left:8px;" onkeyup="apps.files2.vars.updateSearch(this.value)"></div>' +
                    '<div class="cursorPointer darkResponsive" style="width:34px; height:18px; padding-top:2px; left:5px; top:27px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center; display:none" onClick=""></div>' +
                    '<div title="Toggle Favorite" class="cursorPointer darkResponsive" style="width:24px; border-left:1px solid #333; height:18px; padding-top:2px; left:30px; top:27px; border-top-left-radius:10px; border-bottom-left-radius:10px; text-align:center;" onClick="apps.files2.vars.toggleFavorite(apps.files2.vars.currLoc)"><img class="darkInvert" style="position:absolute;display:block;left:8px;top:5px;" src="ctxMenu/beta/happy.png"></div>' +
                    '<div title="New Folder" class="cursorPointer darkResponsive" style="width:34px; height:18px; padding-top:2px; right:6px; top:27px; border-top-right-radius:10px; border-bottom-right-radius:10px; text-align:center;" onClick="apps.files2.vars.mkdir()"><img class="darkInvert" style="position:absolute;display:block;left:16px;top:5px;" src="files2/small/folder.png"></div>' +
                    '<div title="New File" class="cursorPointer darkResponsive" style="width:24px; border-right:1px solid #333; height:18px; padding-top:2px; right:31px; top:27px; border-top-right-radius:10px; border-bottom-right-radius:10px; text-align:center;" onClick="apps.files2.vars.mkfile()"><img class="darkInvert" style="position:absolute;display:block;left:8px;top:5px;" src="ctxMenu/beta/new.png"></div>' +
                    '</div>' +
                    '<div id="FIL2sidebar" class="darkResponsive" style="overflow-y:scroll; border-top-left-radius:5px; font-family:aosProFont, Courier, monospace; font-size:12px; width:144px; max-width:30%; padding:3px; height:calc(100% - 56px); top:50px;">' +
                    'Home<br><div id="FIL2home" class="FIL2sidetbl FIL2viewMedium"></div><br>' +
                    'Favorites<br><div id="FIL2favorites" class="FIL2sidetbl FIL2viewMedium"></div><br>' +
                    'Navigation<br><div id="FIL2nav" class="FIL2sidetbl FIL2viewMedium"></div></div>' +
                    '<div class="darkResponsive" style="width:calc(100% - 151px); border-top-right-radius:5px; min-width:calc(70% - 7px); right:0; height:calc(100% - 50px); top:50px; background-repeat:no-repeat; background-position:center" id="FIL2cntn"></div>'
                );
                getId("FIL2home").innerHTML =
                    '<div class="cursorPointer" onClick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.next(\'apps/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/apps/\\\');toTop(apps.properties)\'])">' +
                    '<img src="files2/small/folder.png"> ' +
                    '/apps/' +
                    '</div><div class="cursorPointer" onClick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.next(\'widgets/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/widgets/\\\');toTop(apps.properties)\'])">' +
                    '<img src="files2/small/folder.png"> ' +
                    '/widgets/' +
                    '</div><div class="cursorPointer" onClick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.next(\'USERFILES/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/USERFILES/\\\');toTop(apps.properties)\'])">' +
                    '<img src="files2/small/folder.png"> ' +
                    '/USERFILES/' +
                    '</div><div class="cursorPointer" onClick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.next(\'LOCALFILES/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/LOCALFILES/\\\');toTop(apps.properties)\'])">' +
                    '<img src="files2/small/folder.png"> ' +
                    '/LOCALFILES/' +
                    function(){
                        if(apps.settings.vars.FILcanWin){
                            return '</div><div class="cursorPointer" onClick="apps.files2.vars.next(\'window/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/window/\\\');toTop(apps.properties)\'])">' +
                                '<img src="files2/small/folder.png"> ' +
                                '<span style="color:#F00">window/</span>';
                        }else{
                            return '';
                        }
                    }() +
                    '</div>';
                this.vars.updateFavorites(1);
                this.vars.setViewMode(this.vars.currViewMode, 1);
            }
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    if(ufload("aos_system/apps/files/view_mode")){
                        this.vars.setViewMode(parseInt(ufload("aos_system/apps/files/view_mode")), 1);
                    }
                    if(ufload("aos_system/apps/files/favorites")){
                        this.vars.favorites = JSON.parse(ufload("aos_system/apps/files/favorites"));
                    }
                    if(ufload("aos_system/apps/files/window_debug")){
                        apps.settings.vars.FILcanWin = parseInt(ufload("aos_system/apps/files/window_debug"));
                    }
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'The official AaronOS File Manager, version 2. Use it to manage your personal files and to view aOS code. At the moment, only plain-text userfiles are supported.',
            currLoc: '/',
            viewModes: [
                ['Small Grid', 'FIL2viewCompact'],
                ['Large Grid', 'FIL2viewSmall'],
                ['Small List', 'FIL2viewMedium'],
                ['Large List', 'FIL2viewLarge']
            ],
            currViewMode: 3,
            setViewMode: function(newMode, nosave){
                try{
                    getId('FIL2tbl').classList.remove(this.viewModes[this.currViewMode][1]);
                }catch(err){
                    // window is not open
                }
                
                if(typeof newMode === "number"){
                    if(newMode < this.viewModes.length){
                        this.currViewMode = newMode;
                    }
                }else{
                    this.currViewMode++;
                    if(this.currViewMode >= this.viewModes.length){
                        this.currViewMode = 0;
                    }
                }
                
                try{
                    getId('FIL2viewModeIcon').innerHTML = this.viewModes[this.currViewMode][0] + "&nbsp;";
                    getId('FIL2tbl').classList.add(this.viewModes[this.currViewMode][1]);
                }catch(err){
                    // window is not open
                }
                
                if(!nosave){
                    apps.savemaster.vars.save("aos_system/apps/files/view_mode", this.currViewMode, 1);
                }
            },
            back: function(){
                this.currLoc = this.currLoc.split("/");
                var cleanEscapeRun = 0;
                while(!cleanEscapeRun){
                    cleanEscapeRun = 1;
                    for(var i = 0; i < this.currLoc.length - 1; i++){
                        if(this.currLoc[i][this.currLoc[i].length - 1] === '\\'){
                            this.currLoc.splice(i, 2, this.currLoc[i].substring(0, this.currLoc[i].length) + '/' + this.currLoc[i + 1]);
                            cleanEscapeRun = 0;
                            break;
                        }
                    }
                    if(cleanEscapeRun && this.currLoc.length > 0){
                        if(this.currLoc[this.currLoc.length - 1][this.currLoc[this.currLoc.length - 1].length - 1] === '\\'){
                            this.currLoc.splice(i, 1, this.currLoc[this.currLoc.length - 1].substring(0, this.currLoc[this.currLoc.length - 1].length) + '/');
                            cleanEscapeRun = 0;
                        }
                    }
                }
                this.currLoc.pop();
                this.currLoc.pop();
                this.currLoc = this.currLoc.join("/") + '/';
                this.update();
            },
            home: function(){
                this.currLoc = '/';
                this.update();
            },
            next: function(nextName){
                var tempNextName = nextName;
                if(tempNextName.indexOf('/') !== -1 && tempNextName.indexOf('/') !== tempNextName.length - 1){
                    tempNextName = tempNextName.split('/');
                    if(tempNextName[tempNextName.length - 1] === ''){
                        tempNextName.pop();
                        tempNextName = tempNextName.join('\\/') + '/';
                    }else{
                        tempNextName = tempNextName.join('\\/');
                    }
                }
                this.currLoc += tempNextName;
                this.update();
            },
            mkdir: function(){
                if(this.currLoc === '/'){
                    apps.prompt.vars.alert('Please navigate to a directory to create a new folder.', 'Okay', function(){}, 'File Manager');
                }else if(this.currLoc.indexOf('/USERFILES/') === 0){
                    apps.prompt.vars.prompt('Enter a name for the new folder.<br><br>Folder will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function(str){
                        if(str){
                            apps.savemaster.vars.mkdir(this.currLoc.substring(11, this.currLoc.length) + str);
                        }
                        this.update();
                    }.bind(this), "File Manager");
                }else if(this.currLoc.indexOf('/LOCALFILES/') === 0){
                    apps.prompt.vars.prompt('Enter a name for the new folder.<br><br>Folder will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function(str){
                        if(str){
                            lfmkdir(this.currLoc.substring(12, this.currLoc.length) + str);
                        }
                        this.update();
                    }.bind(this), "File Manager");
                }else if(this.currLoc !== '/apps/'){
                    apps.prompt.vars.prompt('Enter a name for the new folder.<br><br>Folder will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function(str){
                        if(str){
                            sh('mkdir ' + this.currLoc + str);
                        }
                        this.update();
                    }.bind(this), "File Manager");
                }else{
                    apps.prompt.vars.alert('Please navigate to a directory to create a new folder.', 'Okay', function(){}, 'File Manager');
                }
            },
            mkfile: function(){
                if(this.currLoc === '/'){
                    apps.prompt.vars.alert('Please navigate to a directory to create a new file.', 'Okay', function(){}, 'File Manager');
                }else if(this.currLoc.indexOf('/USERFILES/') === 0){
                    apps.prompt.vars.prompt('Enter a name for the new file.<br><br>File will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function(str){
                        if(str){
                            ufsave(this.currLoc.substring(11, this.currLoc.length) + str, '');
                        }
                        this.update();
                    }.bind(this), "File Manager");
                }else if(this.currLoc.indexOf('/LOCALFILES/') === 0){
                    apps.prompt.vars.prompt('Enter a name for the new file.<br><br>File will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function(str){
                        if(str){
                            lfsave(this.currLoc.substring(12, this.currLoc.length) + str, '');
                        }
                        this.update();
                    }.bind(this), "File Manager");
                }else if(this.currLoc !== '/apps/'){
                    apps.prompt.vars.prompt('Enter a name for the new file.<br><br>File will be created in ' + this.currLoc + '<br><br>Leave blank to cancel.', 'Submit', function(str){
                        if(str){
                            eval(apps.bash.vars.translateDir(this.currLoc + str) + '=""');
                        }
                        this.update();
                    }.bind(this), "File Manager");
                }else{
                    apps.prompt.vars.alert('Please navigate to a directory to create a new file.', 'Okay', function(){}, 'File Manager');
                }
                
            },
            deleteItem: function(itemPath){
                apps.prompt.vars.confirm("Are you sure you want to delete this item?<br><br>" + itemPath + "<br><br>WARNING: Deleting important files can cause major issues!", ["No, keep", "Yes, delete"], (btn) => {
                    if(btn === 1){
                        if(typeof apps.bash.vars.getRealDir === "object"){
                            sh("rmdir " + itemPath);
                        }else{
                            sh("rm " + itemPath);
                        }
                        apps.files2.vars.update();
                    }
                }, 'File Manager');
            },
            deleteItemUF: function(itemPath){
                apps.prompt.vars.confirm("Are you sure you want to delete this item?<br><br>" + itemPath + "<br><br>WARNING: This cannot be undone!", ["No, keep", "Yes, delete"], (btn) => {
                    if(btn === 1){
                        itemPath = itemPath.split('/');
                        if(itemPath[0] === ""){
                            itemPath.shift();
                        }
                        if(itemPath[0] === "USERFILES"){
                            itemPath.shift();
                        }
                        itemPath = itemPath.join('/');
                        ufdel(itemPath);
                        apps.files2.vars.update();
                    }
                }, 'File Manager');
            },
            deleteItemLF: function(itemPath){
                apps.prompt.vars.confirm("Are you sure you want to delete this item?<br><br>" + itemPath + "<br><br>WARNING: This cannot be undone!", ["No, keep", "Yes, delete"], (btn) => {
                    if(btn === 1){
                        itemPath = itemPath.split('/');
                        if(itemPath[0] === ""){
                            itemPath.shift();
                        }
                        if(itemPath[0] === "USERFILES"){
                            itemPath.shift();
                        }
                        itemPath = itemPath.join('/');
                        lfdel(itemPath);
                        apps.files2.vars.update();
                    }
                }, 'File Manager');
            },
            navigate: function(newName){
                if(newName[0] !== "/"){
                    newName = "/" + newName;
                }
                if(newName[newName.length - 1] !== "/"){
                    newName = newName + "/";
                }
                this.currLoc = newName;
                this.update();
            },
            filetype: function(type){
                switch(type){
                    case 'object':
                        return 'folder';
                    case 'string':
                        return 'text';
                    case 'function':
                        return 'code';
                    case 'boolean':
                        return 'T/F';
                    case 'undefined':
                        return 'nothing';
                    case 'number':
                        return 'value';
                    default:
                        return type;
                }
            },
            icontype: function(type){
                switch(type){
                    case 'object':
                        return 'folder';
                    case 'string':
                        return 'file';
                    case 'function':
                        return 'console';
                    case 'boolean':
                        return 'gear';
                    case 'undefined':
                        return 'x';
                    case 'number':
                        return 'performance';
                    default:
                        return 'agent';
                }
            },
            testingFolder: {
                filenameTests: {
                    "This is a really long file name that has spaces and stuff in it!": "Hello World",
                    ThisIsAReallyLongFileNameThatDoesNotHaveAnySpacesAndStuffInIt: "HelloWorld",
                    "123_test": "43110 World",
                    test_123: "Hello |/\\|0710",
                    "this.has.dots.in.it": "Hello.World",
                    "Folder with spaces": {
                        secretMessage: "Oof"
                    },
                    "Folder.with.dots": {
                        secretMessage: "Yeet"
                    },
                    "file/with/slashes": "Wowza",
                    "file/with/slash/at/end/": "oh boy",
                    "folder/with/slash/at/end/": {
                        "folder": {
                            "wat": "odang"
                        },
                        "file": "oooooh"
                    }
                },
                stringFile: "Hello World",
                functionFile: function(){return "Hello World"},
                booleanTrueFile: true,
                booleanFalseFile: false,
                undefinedFile: undefined,
                nullFile: null,
                numberFile: 1337
            },
            currTotal: 0,
            currItem: 0,
            currEffect: 0,
            currContentStr: '',
            currDirList: [],
            update: function(){
                this.currContentStr = '';
                getId('FIL2searchInput').value = '';
                getId("FIL2green").style.backgroundColor = 'rgb(170, 255, 170)';
                getId("FIL2green").style.width = "0";
                getId("FIL2cntn").style.backgroundImage = 'url(/loadDark.gif)';
                // getId("FILcntn").style.cursor = cursors.loadDark;
                getId('FIL2cntn').classList.add('cursorLoadDark');
                getId("FIL2cntn").innerHTML = '<div id="FIL2tbl" class="' + this.viewModes[this.currViewMode][1] + '" style="width:100%; position:absolute; margin:auto;padding-bottom:3px;"></div>';
                getId("FIL2tbl").style.marginTop = scrollHeight;
                if(this.currLoc === '/'){
                    getId("FIL2path").innerHTML = '<div id="FIL2green" style="height:100%;background-color:rgb(170, 255, 170)"></div><div style="width:100%;height:25px;"><input id="FIL2input" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:25px;padding:0;padding-left:8px;border-top-left-radius:5px;border-top-right-radius:5px;" onkeypress="if(event.keyCode===13){apps.files2.vars.navigate(this.value)}" value="/"></div>';
                    getId("FIL2tbl").innerHTML =
                        '<span style="padding-left:3px;line-height:18px">Home</span><br>' +
                        '<div class="cursorPointer" onClick="apps.files2.vars.next(\'apps/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/apps/\\\');toTop(apps.properties)\'])">' +
                        '<img src="files2/small/folder.png"> ' +
                        'apps/' +
                        '</div><div class="cursorPointer" onClick="apps.files2.vars.next(\'widgets/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/widgets/\\\');toTop(apps.properties)\'])">' +
                        '<img src="files2/small/folder.png"> ' +
                        'widgets/' +
                        '</div><div class="cursorPointer" onClick="apps.files2.vars.next(\'USERFILES/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/USERFILES/\\\');toTop(apps.properties)\'])">' +
                        '<img src="files2/small/folder.png"> ' +
                        'USERFILES/' +
                        '</div><div class="cursorPointer" onClick="apps.files2.vars.next(\'LOCALFILES/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/LOCALFILES/\\\');toTop(apps.properties)\'])">' +
                        '<img src="files2/small/folder.png"> ' +
                        'LOCALFILES/' +
                        function(){
                            if(apps.settings.vars.FILcanWin){
                                return '</div><div class="cursorPointer" onClick="apps.files2.vars.next(\'window/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'/window/\\\');toTop(apps.properties)\'])">' +
                                    '<img src="files2/small/folder.png"> ' +
                                    '<span style="color:#F00">window/</span>';
                            }else{
                                return '';
                            }
                        }() +
                        '</div>' +
                        '<br><br><span style="padding-left:3px;line-height:18px;">Favorites</span><br>';
                    this.updateFavorites(1, 1);
                    getId("FIL2green").className = '';
                    getId('FIL2green').style.backgroundColor = "#FFF";
                    getId("FIL2green").style.display = "none";
                    getId("FIL2cntn").style.backgroundImage="";
                    getId('FIL2cntn').classList.remove('cursorLoadDark');
                }else{
                    getId("FIL2path").innerHTML = '<div id="FIL2green" class="liveElement" data-live-target="style.width" data-live-eval="apps.files2.vars.currItem/apps.files2.vars.currTotal*100+\'%\'" style="height:100%;background-color:rgb(170, 255, 170);box-shadow:0 0 20px 10px rgb(170, 255, 170)"></div><div style="width:100%;height:25px;"><input id="FIL2input" style="background:transparent;box-shadow:none;color:inherit;font-family:monospace;border:none;width:calc(100% - 8px);height:25px;padding:0;padding-left:8px;border-top-left-radius:5px;border-top-right-radius:5px;" onkeypress="if(event.keyCode===13){apps.files2.vars.navigate(this.value)}" value="' + this.currLoc + '"></div>';
                    this.currDirList = sh("ls '" + this.currLoc + "'").split('\n');
                    if(this.currDirList.length === 1 && this.currDirList[0] === ""){
                        if(typeof apps.bash.vars.getRealDir(this.currLoc) !== "object" || apps.bash.vars.getRealDir(this.currLoc) === null){
                            apps.prompt.vars.alert("Could not open " + this.currLoc + ": Does not exist or is null.", "Okay", function(){}, "File Manager");
                        }
                    }else{
                        this.currDirList.sort(function(a, b){
                            var aLow = a.toLowerCase();
                            var bLow = b.toLowerCase();
                            if(aLow === bLow){
                                return 0;
                            }
                            if(aLow > bLow){
                                return 1;
                            }
                            return -1;
                        });
                        var temphtml = '';
                        if(this.currLoc.indexOf("/USERFILES/") === 0){
                            for(var item in this.currDirList){
                                if(this.currDirList[item]){
                                    // if item is a folder
                                    if(this.currDirList[item][this.currDirList[item].length - 1] === "/" && this.currDirList[item][this.currDirList[item].length - 2] !== "\\"){
                                        temphtml += '<div class="cursorPointer" onclick="apps.files2.vars.next(\'' + this.currDirList[item] + '\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]) + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItemUF(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
                                            '<img src="files2/small/folder.png"> ' +
                                            this.currDirList[item].split('\\/').join('/') +
                                            '</div>';
                                    }else{
                                        temphtml += '<div class="cursorPointer" onClick="apps.notepad2.vars.openFile(\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\');" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItemUF(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
                                            '<img src="files2/small/' + this.icontype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '.png"> ' +
                                            this.currDirList[item].split('\\/').join('/') + '<span style="opacity:0.5;float:right;">' + this.filetype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '&nbsp;</span>' +
                                            '</div>';
                                    }
                                }
                            }
                        }else if(this.currLoc.indexOf("/LOCALFILES/") === 0){
                            for(var item in this.currDirList){
                                if(this.currDirList[item]){
                                    // if item is a folder
                                    if(this.currDirList[item][this.currDirList[item].length - 1] === "/" && this.currDirList[item][this.currDirList[item].length - 2] !== "\\"){
                                        temphtml += '<div class="cursorPointer" onclick="apps.files2.vars.next(\'' + this.currDirList[item] + '\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]) + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItemLF(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
                                            '<img src="files2/small/folder.png"> ' +
                                            this.currDirList[item].split('\\/').join('/') +
                                            '</div>';
                                    }else{
                                        temphtml += '<div class="cursorPointer" onClick="apps.notepad2.vars.openFile(\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\');" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItemLF(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
                                            '<img src="files2/small/' + this.icontype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '.png"> ' +
                                            this.currDirList[item].split('\\/').join('/') + '<span style="opacity:0.5;float:right;">' + this.filetype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '&nbsp;</span>' +
                                            '</div>';
                                    }
                                }
                            }
                        }else if(this.currLoc === "/apps/"){
                            for(var item in this.currDirList){
                                if(this.currDirList[item]){
                                    // if item is a folder
                                    if(this.currDirList[item][this.currDirList[item].length - 1] === "/" && this.currDirList[item][this.currDirList[item].length - 2] !== "\\"){
                                        temphtml += '<div class="cursorPointer" onclick="apps.files2.vars.next(\'' + this.currDirList[item] + '\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/window.png\', \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Open App\', \'openapp(apps.' + this.currDirList[item].substring(0, this.currDirList[item].length - 1) + ', \\\'dsktp\\\')\', \'+Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]) + '\\\');toTop(apps.properties)\', \'_Delete\', \'\'])">' +
                                            //'<img class="FIL2aosAppIcon" src="' + (apps[this.currDirList[item].split('/')[0]].appWindow.appImg || "appicons/ds/redx.png") + '"> ' +
                                            buildSmartIcon(16, apps[this.currDirList[item].split('/')[0]].appWindow.appImg) + ' ' +
                                            this.currDirList[item].split('\\/').join('/') +
                                            '</div>';
                                    }else{
                                        temphtml += '<div class="cursorPointer" onClick="apps.notepad2.vars.openFile(\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\');" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\\\');toTop(apps.properties)\', \'-Delete\', \'\'])">' +
                                            '<img src="files2/small/' + this.icontype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '.png"> ' +
                                            this.currDirList[item].split('\\/').join('/') + '<span style="opacity:0.5;float:right;">' + this.filetype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '&nbsp;</span>' +
                                            '</div>';
                                    }
                                }
                            }
                        }else{
                            for(var item in this.currDirList){
                                if(this.currDirList[item]){
                                    // if item is a folder
                                    if(this.currDirList[item][this.currDirList[item].length - 1] === "/" && this.currDirList[item][this.currDirList[item].length - 2] !== "\\"){
                                        temphtml += '<div class="cursorPointer" onclick="apps.files2.vars.next(\'' + this.currDirList[item] + '\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]) + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItem(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
                                            '<img src="files2/small/folder.png"> ' +
                                            this.currDirList[item].split('\\/').join('/') +
                                            '</div>';
                                    }else{
                                        temphtml += '<div class="cursorPointer" onClick="apps.notepad2.vars.openFile(\'/window' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\');" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (this.currLoc + this.currDirList[item]).split('\\').join('\\\\') + '\\\');toTop(apps.properties)\', \'+Delete\', \'apps.files2.vars.deleteItem(\\\'' + (this.currLoc + this.currDirList[item]) + '\\\')\'])">' +
                                            '<img src="files2/small/' + this.icontype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '.png"> ' +
                                            this.currDirList[item].split('\\/').join('/') + '<span style="opacity:0.5;float:right;">' + this.filetype(typeof apps.bash.vars.getRealDir(this.currLoc + this.currDirList[item])) + '&nbsp;</span>' +
                                            '</div>';
                                    }
                                }
                            }
                        }
                        getId('FIL2tbl').innerHTML = temphtml;
                    }
                    getId("FIL2green").className = '';
                    getId('FIL2green').style.backgroundColor = "#FFF";
                    getId("FIL2green").style.display = "none";
                    getId("FIL2cntn").style.backgroundImage="";
                    getId('FIL2cntn').classList.remove('cursorLoadDark');
                }
                var pathSplit = this.currLoc.split('/');
                if(pathSplit[0] === ""){
                    pathSplit.shift();
                }
                if(pathSplit[pathSplit.length - 1] === ""){
                    pathSplit.pop();
                }
                var cleanEscapeRun = 0;
                    while(!cleanEscapeRun){
                        cleanEscapeRun = 1;
                        for(var j = 0; j < pathSplit.length - 1; j++){
                            if(pathSplit[j][pathSplit[j].length - 1] === '\\'){
                                pathSplit.splice(j, 2, pathSplit[j].substring(0, pathSplit[j].length) + '/' + pathSplit[j + 1]);
                                cleanEscapeRun = 0;
                                break;
                            }
                        }
                        if(cleanEscapeRun && pathSplit.length > 0){
                            if(pathSplit[pathSplit.length - 1][pathSplit[pathSplit.length - 1].length - 1] === '\\'){
                                pathSplit.splice(j, 1, pathSplit[pathSplit.length - 1].substring(0, pathSplit[pathSplit.length - 1].length) + '/');
                                cleanEscapeRun = 0;
                            }
                        }
                    }
                var navDepth = 0;
                var navPath = "/";
                var tempHTML = '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.update()" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \'-Properties\', \'\', \'_Delete\', \'\'])">' +
                            '<img src="files2/small/folder.png"> ' +
                            '/' +
                            '</div>';
                for(var i in pathSplit){
                    if(pathSplit.indexOf("apps") === 0 && navDepth === 1){
                        tempHTML += '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'' + navPath + '\';apps.files2.vars.next(\'' + pathSplit[i] + '/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (navPath + pathSplit[i]) + '/\\\');toTop(apps.properties)\', \'_Delete\', \'\'])">' +
                            //'<img class="FIL2aosAppIcon" src="' + (apps[pathSplit[i]] || {appWindow:{appImg:"appicons/ds/redx.png"}}).appWindow.appImg + '"> ' +
                            buildSmartIcon(16, (apps[pathSplit[i]] || {appWindow:{appImg:{foreground:"appicons/ds/redx.png"}}}).appWindow.appImg) + ' ' +
                            pathSplit[i].split('\\/').join('/') + "/" +
                            '</div>';
                    }else{
                        tempHTML += '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'' + navPath + '\';apps.files2.vars.next(\'' + pathSplit[i] + '/\')" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + (navPath + pathSplit[i]) + '/\\\');toTop(apps.properties)\', \'_Delete\', \'\'])">' +
                            '<img src="files2/small/folder.png"> ' +
                            pathSplit[i].split('\\/').join('/') + '/' +
                            '</div>';
                    }
                    navPath += pathSplit[i] + '/';
                    navDepth++;
                }
                getId("FIL2nav").innerHTML = tempHTML;
            },
            updateSearch: function(searchStr){
                var searchElems = getId('FIL2tbl').getElementsByTagName('div');
                for(var i = 0; i < searchElems.length; i++){
                    if(searchElems[i].innerText.toLowerCase().indexOf(searchStr.toLowerCase()) === -1){
                        searchElems[i].style.display = 'none';
                    }else{
                        searchElems[i].style.display = '';
                    }
                }
            },
            favorites: [],
            updateFavorites: function(nosave, mainPage){
                if(!nosave){
                    ufsave('aos_system/apps/files/favorites', JSON.stringify(this.favorites));
                }
                var tempHTML = '';
                for(var i in this.favorites){
                    var currPath = this.favorites[i].split('/');
                    var cleanEscapeRun = 0;
                    while(!cleanEscapeRun){
                        cleanEscapeRun = 1;
                        for(var j = 0; j < currPath.length - 1; j++){
                            if(currPath[j][currPath[j].length - 1] === '\\'){
                                currPath.splice(j, 2, currPath[j].substring(0, currPath[j].length) + '/' + currPath[j + 1]);
                                cleanEscapeRun = 0;
                                break;
                            }
                        }
                        if(cleanEscapeRun && currPath.length > 0){
                            if(currPath[currPath.length - 1][currPath[currPath.length - 1].length - 1] === '\\'){
                                currPath.splice(j, 1, currPath[currPath.length - 1].substring(0, currPath[currPath.length - 1].length) + '/');
                                cleanEscapeRun = 0;
                            }
                        }
                    }
                    if(currPath[currPath.length - 1] === ""){
                        currPath.pop();
                    }
                    if(currPath[0] === ""){
                        currPath.shift();
                    }
                    if(currPath.length === 0){
                        tempHTML += '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'/\';apps.files2.vars.update()" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \'-Properties\', \'\', \'+Remove Favorite\', \'apps.files2.vars.toggleFavorite(\\\'/\\\')\', \'_Delete\', \'\'])">' +
                            '<img src="files2/small/folder.png"> ' +
                            '/' +
                            '</div>';
                    }else{
                        var currName = currPath[currPath.length - 1];
                        console.log(this.favorites, i);
                        if(currPath.indexOf("apps") === 0 && currPath.length === 2){
                            tempHTML += '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'' + this.favorites[i] + '\';apps.files2.vars.update()" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + this.favorites[i] + '\\\');toTop(apps.properties)\', \'+Remove Favorite\', \'apps.files2.vars.toggleFavorite(\\\'' + this.favorites[i] + '\\\')\', \'_Delete\', \'\'])">' +
                                //'<img class="FIL2aosAppIcon" src="' + (apps[currName] || {appWindow:{appImg:"appicons/ds/redx.png"}}).appWindow.appImg + '"> ' +
                                buildSmartIcon(16, (apps[currName] || {appWindow:{appImg:{foreground:"appicons/ds/redx.png"}}}).appWindow.appImg) + ' ' +
                                currName.split('\\/').join('/') + "/" +
                                '</div>';
                        }else{
                            tempHTML += '<div class="cursorPointer" onclick="apps.files2.vars.currLoc = \'' + this.favorites[i] + '\';apps.files2.vars.update()" oncontextmenu="ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/file.png\', \'ctxMenu/beta/x.png\'], \' Properties\', \'apps.properties.main(\\\'openFile\\\', \\\'' + this.favorites[i] + '\\\');toTop(apps.properties)\', \'+Remove Favorite\', \'apps.files2.vars.toggleFavorite(\\\'' + this.favorites[i] + '\\\')\', \'_Delete\', \'\'])">' +
                                '<img src="files2/small/folder.png"> ' +
                                currName.split('\\/').join('/') + '/' +
                                '</div>';
                        }
                    }
                }
                if(mainPage){
                    getId("FIL2tbl").innerHTML += tempHTML;
                }else{
                    getId("FIL2favorites").innerHTML = tempHTML;
                    if(this.currLoc === '/'){
                        this.update();
                    }
                }
            },
            toggleFavorite: function(item){
                var itemLocation = this.favorites.indexOf(item);
                if(itemLocation === -1){
                    this.favorites.push(item);
                }else{
                    this.favorites.splice(itemLocation, 1);
                }
                this.updateFavorites();
            }
        }, 0, "files2", {
            backgroundColor: "#303947",
            foreground: "smarticons/files/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    getId('aOSloadingInfo').innerHTML = 'Changelog';
});
c(function(){
    apps.changelog = new Application(
        "CLg",
        "Changelog",
        0,
        function(){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setDims("auto", "auto", 700, 400, 1);
                this.appWindow.setCaption("Changelog");
                this.vars.cLogSplit = files.changelog.split('\n\n');
                for(var i in this.vars.cLogSplit){
                    this.vars.cLogSplit[i] = this.vars.cLogSplit[i].split('\n ');
                }
                this.vars.cLogHTML = '';
                for(var i in this.vars.cLogSplit){
                    this.vars.cLogGroup = '';
                    for(var j = 1; j < this.vars.cLogSplit[i].length; j++){
                        if(this.vars.cLogSplit[i][j][0] === '+'){
                            this.vars.cLogGroup += '<p class="changeLogAddition">' + this.vars.cLogSplit[i][j].substring(2, this.vars.cLogSplit[i][j].length) + '</p>';
                        }else if(this.vars.cLogSplit[i][j][0] === ':'){
                            this.vars.cLogGroup += '<p class="changeLogTweak">' + this.vars.cLogSplit[i][j].substring(2, this.vars.cLogSplit[i][j].length) + '</p>';
                        }else if(this.vars.cLogSplit[i][j][0] === '-'){
                            this.vars.cLogGroup += '<p class="changeLogRemoval">' + this.vars.cLogSplit[i][j].substring(2, this.vars.cLogSplit[i][j].length) + '</p>';
                        }else{
                            this.vars.cLogGroup += '<p class="changeLogUnknown">' + this.vars.cLogSplit[i][j].substring(2, this.vars.cLogSplit[i][j].length) + '</p>';
                        }
                    }
                    this.vars.cLogHTML = this.vars.cLogGroup + this.vars.cLogHTML;
                    this.vars.cLogHTML = '<p class="changeLogTitle">' + this.vars.cLogSplit[i][0].split(': ')[1] + ' <span style="font-size:12px">' + this.vars.cLogSplit[i][0].split(': ')[0] + '</span></p>' + this.vars.cLogHTML;
                }
                getId('win_changelog_html').style.overflow = 'auto';
                this.appWindow.setContent(this.vars.cLogHTML);
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.vars.currGame = '';
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'This is the official changelog for AaronOS. It lists all versions from the point of its creation up until the current running version.',
            cLogSplit: [],
            cLogHTML: '',
            cLogGroup: ''
        }, 1, "changelog", "appicons/ds/CLg.png"
    );
    getId('aOSloadingInfo').innerHTML = 'Window Test';
});
c(function(){
    m('init TW');
    apps.aerotest = new Application(
        "TW",
        "Transparent Window",
        0,
        function(){
            this.appWindow.setCaption("Transparent Window");
            if(!this.appWindow.appIcon){
                this.appWindow.setDims("auto", "auto", 400, 300);
            }
            //this.appWindow.setContent('<button onClick="apps.aerotest.appWindow.setDims(50, 50, prompt(\'New window width?\'), prompt(\'New window height?\'))">Change Window Size</button>');
            getId("win_aerotest_html").style.background = "none";
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'This application is used for testing the performance and effect quality of WindowBlur. This app is great for testing or playing with new window colors and background blend modes.'
        }, 2, "aerotest", {
            backgroundColor: "#303947",
            foreground: "smarticons/aerotest/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    getId('aOSloadingInfo').innerHTML = 'File Saving System';
});
c(function(){
    window.SRVRKEYWORD = window.SRVRKEYWORD || "";
    m('init SAV');
    /*var cansaveyet = 0;
    window.setTimeout(function(){cansaveyet = 1}, 500);*/
    apps.savemaster = new Application(
        "SAV",
        "SaveMaster",
        0,
        function(launchtype){
            this.appWindow.setCaption("SaveMaster");
            if(!this.appWindow.appIcon){
                this.appWindow.setDims("auto", "auto", 600, 500);
            }
            this.appWindow.setContent(
                'Here are the last ten save operations.<br>' + apps.savemaster.vars.buildSavesMenu()
            );
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "save":
                    getId("mastersaveframe").src = "filesaver.php/?k=" + SRVRKEYWORD + "&f=" + this.vars.sp + "&c=" + this.vars.sc;
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'This application handles all file saving over the Cloud to the AaronOS server. It is only accessible via API to aOS apps.',
            sp: "",
            sc: "",
            saving: 0,
            xf: {},
            //xhttp: new XMLHttpRequest(),
            //fd: new FormData(),
            savePerf: 0,
            buildSavesMenu: function(){
                var tempHTML = "";
                for(var i in apps.savemaster.vars.xf){
                    if(i.indexOf("fd") === 0){
                        var thisID = i.substring(2);
                        var thisOperation = apps.savemaster.vars.xf["xhttp" + thisID].responseURL;
                        if(thisOperation.indexOf("/filesavernew.php") > -1){
                            thisOperation = "Write";
                        }else if(thisOperation.indexOf("/filedeleter.php")){
                            thisOperation = "Delete";
                        }
                        tempHTML = "<br><br>" + thisID + ": " + thisOperation + " <span style='font-family:monospace'>" + apps.savemaster.vars.xf["fd" + thisID].get("f") + "</span>" + tempHTML;
                    }
                }
                return tempHTML;
            },
            save: function(filepath, filecontent, newformat, errorreport, pass){
                m('Saving File');
                d(1, 'Saving File ' + filepath);
                if(filepath.indexOf('..') > -1){
                    apps.prompt.vars.alert('Error saving file:<br><br>Not allowed to use ".." keyword.', 'Okay', function(){}, 'SaveMaster');
                    return false;
                }
                // if(window.navigator.onLine){
                    this.savePerf = Math.floor(performance.now());
                    if(!noUserFiles){
                        if(!newformat){
                            getId("mastersaveframe").src = "filesaver.php/?k=" + SRVRKEYWORD + "&f=" + filepath + "&c=" + filecontent;
                        }else{
                            this.saving = 2;
                            taskbarShowHardware();
                            if(errorreport === 'ERROR_REPORT'){
                                //getId("mastersaveframediv").innerHTML = '<iframe id="mastersaveframe" name="mastersaveframe"></iframe><form action="filesavernew.php/?error=error" method="POST" target="mastersaveframe" id="mastersaveform"><input name="k" value="' + SRVRKEYWORD + '"><input name="f" value="' + filepath + '"><textarea name="c">' + filecontent + '</textarea><input type="submit" id="savesubmit"></form>';
                                this.xf['fd' + this.savePerf] = new FormData();
                                this.xf['fd' + this.savePerf].append('k', SRVRKEYWORD);
                                this.xf['fd' + this.savePerf].append('f', filepath);
                                this.xf['fd' + this.savePerf].append('c', filecontent);
                                this.xf['xhttp' + this.savePerf] = new XMLHttpRequest();
                                this.xf['xhttp' + this.savePerf].onreadystatechange = function(){
                                    if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4){
                                        apps.savemaster.vars.saving = 0;
                                        taskbarShowHardware();
                                        if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].status !== 200){
                                            apps.prompt.vars.alert('Error saving file:<br><br>Could not contact server.', 'Okay', function(){}, 'SaveMaster');
                                        }else if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText.indexOf('Error - ') === 0){
                                            apps.prompt.vars.alert('Error saving file:<br><br>' + (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText || "No response."), 'Okay', function(){}, 'SaveMaster');
                                        }
                                    }
                                };
                                this.xf['xhttp' + this.savePerf].open('POST', 'filesavernew.php/?error=error');
                                this.xf['xhttp' + this.savePerf].send(this.xf['fd' + this.savePerf]);
                                sh('mkdir /USERFILES/' + filepath.substring(0, filepath.lastIndexOf('/')));
                                apps.savemaster.vars.temporarySaveContent = '' + filecontent;
                                eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '=apps.savemaster.vars.temporarySaveContent');
                                delete apps.savemaster.vars.temporarySaveContent;
                            }else if(errorreport === 'RDP'){
                                this.xf['fd' + this.savePerf] = new FormData();
                                this.xf['fd' + this.savePerf].append('k', SRVRKEYWORD);
                                this.xf['fd' + this.savePerf].append('f', filepath);
                                this.xf['fd' + this.savePerf].append('c', filecontent);
                                this.xf['xhttp' + this.savePerf] = new XMLHttpRequest();
                                this.xf['xhttp' + this.savePerf].onreadystatechange = function(){
                                    if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4){
                                        apps.savemaster.vars.saving = 0;
                                        taskbarShowHardware();
                                        if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].status !== 200){
                                            apps.prompt.vars.alert('Error saving file:<br><br>Could not contact server.', 'Okay', function(){}, 'SaveMaster');
                                        }else if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText.indexOf('Error - ') === 0){
                                            apps.prompt.vars.alert('Error saving file:<br><br>' + (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText || "No response."), 'Okay', function(){}, 'SaveMaster');
                                        }
                                    }
                                };
                                this.xf['xhttp' + this.savePerf].open('POST', 'filesavernew.php/?rdp=rdp');
                                this.xf['xhttp' + this.savePerf].send(this.xf['fd' + this.savePerf]);
                            }else if(errorreport === 'mUname'){
                                this.xf['fd' + this.savePerf] = new FormData();
                                this.xf['fd' + this.savePerf].append('k', SRVRKEYWORD);
                                this.xf['fd' + this.savePerf].append('f', filepath);
                                this.xf['fd' + this.savePerf].append('c', filecontent);
                                this.xf['xhttp' + this.savePerf] = new XMLHttpRequest();
                                this.xf['xhttp' + this.savePerf].onreadystatechange = function(){
                                    if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4){
                                        apps.savemaster.vars.saving = 0;
                                        taskbarShowHardware();
                                        if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].status !== 200){
                                            apps.prompt.vars.alert('Error saving file:<br><br>Could not contact server.', 'Okay', function(){}, 'SaveMaster');
                                        }else if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText.indexOf('Error - ') === 0){
                                            apps.prompt.vars.alert('Error saving file:<br><br>' + (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText || "No response."), 'Okay', function(){}, 'SaveMaster');
                                        }
                                    }
                                };
                                this.xf['xhttp' + this.savePerf].open('POST', 'filesavernew.php/?mUname=mUname&pass=' + pass.split('?').join('X').split('&').join('X'));
                                this.xf['xhttp' + this.savePerf].send(this.xf['fd' + this.savePerf]);
                                sh('mkdir /USERFILES/' + filepath.substring(0, filepath.lastIndexOf('/')));
                                apps.savemaster.vars.temporarySaveContent = '' + filecontent;
                                eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '=apps.savemaster.vars.temporarySaveContent');
                                delete apps.savemaster.vars.temporarySaveContent;
                            }else{
                                //getId("mastersaveframediv").innerHTML = '<iframe id="mastersaveframe" name="mastersaveframe"></iframe><form action="filesavernew.php" method="POST" target="mastersaveframe" id="mastersaveform"><input name="k" value="' + SRVRKEYWORD + '"><input name="f" value="' + filepath + '"><textarea name="c">' + filecontent + '</textarea><input type="submit" id="savesubmit"></form>';
                                this.xf['fd' + this.savePerf] = new FormData();
                                this.xf['fd' + this.savePerf].append('k', SRVRKEYWORD);
                                this.xf['fd' + this.savePerf].append('f', filepath);
                                this.xf['fd' + this.savePerf].append('c', filecontent);
                                if(errorreport === 'SET_PASSWORD'){
                                    this.xf['fd' + this.savePerf].append('setpass', 'true');
                                }
                                this.xf['xhttp' + this.savePerf] = new XMLHttpRequest();
                                this.xf['xhttp' + this.savePerf].onreadystatechange = function(){
                                    if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4){
                                        apps.savemaster.vars.saving = 0;
                                        taskbarShowHardware();
                                        if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].status !== 200){
                                            apps.prompt.vars.alert('Error saving file:<br><br>Could not contact server.', 'Okay', function(){}, 'SaveMaster');
                                        }else if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText.indexOf('Error - ') === 0){
                                            apps.prompt.vars.alert('Error saving file:<br><br>' + (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText || "No response."), 'Okay', function(){}, 'SaveMaster');
                                        }
                                    }
                                };
                                this.xf['xhttp' + this.savePerf].open('POST', 'filesavernew.php');
                                this.xf['xhttp' + this.savePerf].send(this.xf['fd' + this.savePerf]);
                                if(errorreport === 'SET_PASSWORD'){
                                    eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '="*****"');
                                }else{
                                    sh('mkdir /USERFILES/' + filepath.substring(0, filepath.lastIndexOf('/')));
                                    apps.savemaster.vars.temporarySaveContent = '' + filecontent;
                                    eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '=apps.savemaster.vars.temporarySaveContent');
                                    delete apps.savemaster.vars.temporarySaveContent;
                                }
                            }
                            //document.getElementById("mastersaveform").submit();
                        }
                    }else{
                        if(errorreport === 'SET_PASSWORD'){
                            eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '="*****"');
                        }else{
                            sh('mkdir /USERFILES/' + filepath.substring(0, filepath.lastIndexOf('/')));
                            apps.savemaster.vars.temporarySaveContent = '' + filecontent;
                            eval(apps.bash.vars.translateDir('/USERFILES/' + filepath) + '=apps.savemaster.vars.temporarySaveContent');
                            delete apps.savemaster.vars.temporarySaveContent;
                        }
                    }
                // }else{
                //     apps.prompt.vars.alert('Error saving file:<br><br>You are not online.', 'Okay', function(){}, 'SaveMaster');
                // }
                m(modulelast);
            },
            mkdir: function(filepath){
                if(filepath.indexOf('..') > -1){
                    apps.prompt.vars.alert('Error saving directory:<br><br>Not allowed to use ".." keyword.', 'Okay', function(){}, 'SaveMaster');
                    return false;
                }
                if(!noUserFiles){
                    this.xf['fd' + this.savePerf] = new FormData();
                    this.xf['fd' + this.savePerf].append('k', SRVRKEYWORD);
                    this.xf['fd' + this.savePerf].append('f', filepath);
                    this.xf['fd' + this.savePerf].append('mkdir', 'true');
                    this.xf['xhttp' + this.savePerf] = new XMLHttpRequest();
                    this.xf['xhttp' + this.savePerf].onreadystatechange = function(){
                        if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4){
                            apps.savemaster.vars.saving = 0;
                            taskbarShowHardware();
                            if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].status !== 200){
                                apps.prompt.vars.alert('Error saving directory:<br><br>Could not contact server.', 'Okay', function(){}, 'SaveMaster');
                            }else if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText.indexOf('Error - ') === 0){
                                apps.prompt.vars.alert('Error saving directory:<br><br>' + (apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].responseText || "No response."), 'Okay', function(){}, 'SaveMaster');
                            }
                        }
                    };
                    this.xf['xhttp' + this.savePerf].open('POST', 'filesavernew.php');
                    this.xf['xhttp' + this.savePerf].send(this.xf['fd' + this.savePerf]);
                }
                sh('mkdir /USERFILES/' + filepath);
            },
            latestDel: '',
            del: function(filepath){
                this.savePerf = Math.floor(performance.now());
                /*
                this.latestDel = '';
                if(vartry('apps.savemaster.vars.delete.caller.name').indexOf('-' + lang('aOS', 'failedVarTry') + ' vartry(apps.savemaster.vars.delete.caller.name)') < 0){
                    this.latestDel += 'A function named "' + apps.savemaster.vars.delete.caller.name + '" ';
                }else{
                    this.latestDel += 'An anonymous function ';
                }
                if(vartry('event.type').indexOf('-failed vartry(event.type)') < 0){
                    this.latestDel += 'from a "' + event.type + '" event';
                }else{
                    this.latestDel += 'with no defined event trigger';
                }
                apps.prompt.vars.confirm(this.latestDel + ' wants to permanently delete the file ' + filepath + '. Do you give permission to delete the file? This cannot be undone.', ['No, do nothing', 'Yes, delete file'], function(btn){
                    if(btn){
                */
                if(!noUserFiles){
                    apps.savemaster.vars.saving = 2;
                    taskbarShowHardware();
                    apps.savemaster.vars.xf['fd' + apps.savemaster.vars.savePerf] = new FormData();
                    apps.savemaster.vars.xf['fd' + apps.savemaster.vars.savePerf].append('k', SRVRKEYWORD);
                    apps.savemaster.vars.xf['fd' + apps.savemaster.vars.savePerf].append('f', filepath);
                    apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf] = new XMLHttpRequest();
                    apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].onreadystatechange = function(){
                        if(apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].readyState === 4){
                            apps.savemaster.vars.saving = 0;
                            taskbarShowHardware();
                        }
                    };
                    apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].open('POST', 'filedeleter.php');
                    apps.savemaster.vars.xf['xhttp' + apps.savemaster.vars.savePerf].send(apps.savemaster.vars.xf['fd' + apps.savemaster.vars.savePerf]);
                }
                eval('delete ' + apps.bash.vars.translateDir('/USERFILES/' + filepath));
                /*
                    }
                });
                */
            }
        }, 2, "savemaster", "appicons/ds/SAV.png"
    );
    window.ufsave = function(filename, filecontent){
        return apps.savemaster.vars.save(filename, filecontent, 1);
    };
    window.ufdel = function(filename){
        return apps.savemaster.vars.del(filename);
    };
    window.ufload = function(filename, debug){
        try{
            if(debug){
                doLog("ufload " + filename + ":", "#ABCDEF");
                doLog(apps.bash.vars.getRealDir("/USERFILES/" + filename), "#ABCDEF");
            }
            return apps.bash.vars.getRealDir("/USERFILES/" + filename);
        }catch(err){
            if(debug){
                doLog(err, "#FFCDEF");
            }
            return null;
        }
    };
    getId('aOSloadingInfo').innerHTML = 'Legacy App Maker';
});
c(function(){
    m('init APM');
    apps.appmaker = new Application(
        "APM",
        "Legacy App Maker",
        1,
        function(launchtype){
            if(launchtype === "dsktp"){
                this.appWindow.setCaption("Legacy App Maker");
                if(!this.appWindow.appIcon){
                    this.appWindow.setDims("auto", "auto", 1000, 600);
                }
                this.vars.div = getId("win_appmaker_html");
                this.vars.div.style.overflow = "auto";
                this.vars.div.style.backgroundPosition = 'center';
                this.vars.div.style.backgroundRepeat = 'no-repeat';
                this.vars.div.innerHTML = '<p style="color:red">This tool is OUTDATED. Use the <button onclick="openapp(apps.webAppMaker, \'dsktp\');apps.appmaker.signalHandler(\'close\')">Web App Maker</button> or <button onclick="openapp(apps.devDocumentation, \'dsktp\');apps.appmaker.signalHandler(\'close\')">Developer Documentation</button> instead.</p>' +
                    '<h1>Legacy App Maker</h1>' +
                    '<p id="APMappsaving"></p>' +
                    '<p>If you need to leave and return later: <button onclick="apps.appmaker.vars.saveProj()">Save Project</button> <button onclick="apps.appmaker.vars.loadProj()">Load Project</button><br>' +
                    'Currently stored project: ' + function(){if(ufload("aos_system/apps/appmaker/project")){return '<span style="font-family:monospace">' + JSON.parse(ufload("aos_system/apps/appmaker/project")).name + '</span>'}else{return 'no project saved'}}() +
                    '<br>WARNING: There is only one save file available. Saving this one will overwrite the existing one, and loading it in will overwrite whatever is in your window.</p>' +
                    '<hr>' +
                    '<p>Codename of Application: <input id="APMappcode" class="monoinput"></p>' +
                    '<img src="appmaker/codename.png">' +
                    '<p>This is the name of your app\'s object in aOS code.<br>This <b>MUST</b> be unique!</p>' +
                    '<br><hr>' +
                    '<p>Name of Application: <input id="APMappname" class="monoinput"></p>' +
                    '<img src="appmaker/title.png">' +
                    '<p>This is the actual title of your application, as the user will see it.</p>' +
                    '<br><hr>' +
                    '<p>Application Abbreviation: <input id="APMappicon" class="monoinput"></p>' +
                    '<img src="appmaker/letters.png">' +
                    '<p>This is the abbreviation your app uses in the Dashboard and in the IDs of HTML elements.<br>This <b>MUST</b> be unique!<br>This <b>MUST</b> be between 1 and 3 characters.</p>' +
                    '<br><hr>' +
                    '<p>Dynamic launch behavior? (Y=1, N=0): <input id="APMapplaunchtypes" class="monoinput"></p>' +
                    '<p>If yes, then aOS will tell your app how it is being opened, so it can exhibit different behavior in each case.<br>' +
                    'Use the variable <span class="monoinput">launchtype</span> to determine this.<br>' +
                    'When your app is opened, aOS will set this variable for you. Its value will usually be one of two things:</p>' +
                    '<ul><li><span class="monoinput">dsktp</span>: Your app was opened via its desktop icon. Best to initialize app UI if this is the case.</li>' +
                    '<li><span class="monoinput">tskbr</span>: Your app was opened via its taskbar icon. Best to assume the app is already open and do not re-initialize the UI.</li></ul>' +
                    '<br><hr>' +
                    '<p>Main application code:</p>' +
                    '<textarea id="APMappmaincode" style="width:98%;height:300px; font-family:aosProFont, monospace;white-space:no-wrap;">//here is the basic code to open a window and set its content.\nthis.appWindow.setCaption("Your app\'s name here!");\nthis.appWindow.setDims("auto", "auto", 500, 500);\nthis.appWindow.setContent("Hello world!");\nthis.appWindow.openWindow();</textarea>' +
                    '<br><hr>' +
                    '<p>App Variables:</p>' +
                    '<p>These will be stored in <span class="monoinput">apps.CODENAMEHERE.vars</span> and here are a few ways to access them:</p>' +
                    '<ul><li>From app\'s main function: <span class="monoinput">this.vars.VARIABLEHERE</span></li>' +
                    '<li>From a function in your variables: <span class="monoinput">this.VARIABLEHERE</span></li>' +
                    '<li>From a timeout, interval, other app, JS console, or any other scope: <span class="monoinput">apps.CODENAMEHERE.vars.VARIABLEHERE</span></li></ul>' +
                    '<textarea id="APMappvars" style="width:98%;height:300px;font-family:aosProFont, monospace; white-space:no-wrap;">appInfo: "This is the About text displayed when a user right-clicks the titlebar of your app and selects \'About App\'",\n\n// example variables\nmyVariable: "Hello",\nmyOtherVariable: "World"</textarea>' +
                    '<br><hr>' +
                    '<p>Signal Handler:</p>' +
                    '<p>I recommend leaving this as-is, except for the last part, <span class="monoinput">USERFILES_DONE</span>.<br>' +
                    'Any code within <span class="monoinput">USERFILES_DONE</span> will run after aOS boot. Think of it like the Startup folder in Windows.</p>' +
                    '<textarea id="APMappsignal" style="width:98%;height:300px; font-family:aosProFont, monospace; white-space:no-wrap;">case "forceclose":\n //this.vars = this.varsOriginal;\n this.appWindow.closeWindow();\n this.appWindow.closeIcon();\n break;\ncase "close":\n this.appWindow.closeWindow();\n this.appWindow.setContent("");\n break;\ncase "checkrunning":\n if(this.appWindow.appIcon){\n  return 1;\n }else{\n  return 0;\n }\n break;\ncase "shrink":\n this.appWindow.closeKeepTask();\n break;\ncase "USERFILES_DONE":\n\n break;</textarea>' +
                    '<br><hr>' +
                    '<p>If your app should be on the desktop and app list, enter 0.<br>If your app should not appear on the desktop but will appear on the app list, enter 1.<br>If your app should be hidden from the desktop and the app list, enter 2.<br><input id="APMappdsktp"></p>' +
                    '<br><hr>' +
                    '<p>App Icon:<br><input id="APMappiconimage"></p>' +
                    '<img src="appmaker/icon.png">' +
                    '<p>If your app will have an image as an icon, link to the URL of an image in the box above.<br>It\'s best if your icon is square and its width is a multiple of 2. Recommended is 256x256.<br>You <b>MUST</b> wrap the URL in "quotes".</p>' +
                    '<p>If your app will not have an image, then enter 0. Your app\'s three-letter abbreviation will be used instead.</p>' +
                    '<br><hr>' +
                    '<button onClick="apps.appmaker.vars.compileApp()">Compile and Open in Text Editor</button> <button onClick="apps.appmaker.vars.installApp()">Compile and Install on This Browser (requires OS reboot)</button><br>';
                    
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    //doLog("Initializing APM apps...", "#ACE");
                    if(safeMode){
                        doLog("Failed APM apps because Safe Mode is enabled.", "#F00");
                    }else{
                        var apmdb = ufload("aos_system/apm_apps");
                        if(apmdb){
                            for(var file in apmdb){
                                if(file.indexOf("app_") === 0){
                                    try{
                                        eval(apmdb[file]);
                                    }catch(err){
                                        doLog("Failed aos_system/apm_apps/" + file + ":", "#F00");
                                        doLog(err, "#F00");
                                    }
                                }
                            }
                        }
                    }
                    //doLog("Done.", "#ACE");
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'This app is used to create and install your very own custom apps! If your custom app happens to break, you can go to USERFILES and delete its entry under aos_system/apm_apps.',
            div: undefined,
            newapp: "",
            compileApp: function(){
                this.newApp = 'apps.' + getId("APMappcode").value +
                ' = new Application(\n"' + getId("APMappicon").value +
                '",\n"' + getId("APMappname").value +
                '",\n' + getId("APMapplaunchtypes").value +
                ',\nfunction(launchtype){\n' + getId("APMappmaincode").value +
                '\n},\nfunction(signal){\nswitch(signal){\n' + getId("APMappsignal").value +
                '\n}\n},\n{\n' + getId("APMappvars").value + '\n},' + getId("APMappdsktp").value + ',"' + getId("APMappcode").value + '",' + getId("APMappiconimage").value + ')';
                ufsave("aos_system/apps/appmaker/new_app", this.newApp);
                openapp(apps.notepad2, 'open');
                apps.notepad2.vars.openFile('aos_system/apps/appmaker/new_app');
            },
            installApp: function(){
                this.newApp = 'apps.' + getId("APMappcode").value +
                ' = new Application(\n"' + getId("APMappicon").value +
                '",\n"' + getId("APMappname").value +
                '",\n' + getId("APMapplaunchtypes").value +
                ',\nfunction(launchtype){\n' + getId("APMappmaincode").value +
                '\n},\nfunction(signal){\nswitch(signal){\n' + getId("APMappsignal").value +
                '\n}\n},\n{\n' + getId("APMappvars").value + '\n},' + getId("APMappdsktp").value + ',"' + getId("APMappcode").value + '",' + getId("APMappiconimage").value + ')';
                ufsave('aos_system/apm_apps/app_' + getId("APMappcode").value, this.newApp);
                setTimeout(function(){apps.settings.vars.shutDown('restart', 0);}, 2000);
            },
            saveProj: function(){
                apps.prompt.vars.confirm('Overwrite your existing saved project?', ['No', 'Yes'], function(btn){
                    getId('win_appMaker_html').style.backgroundImage = 'url(/loadLight.gif)';
                    // getId('winAPMh').style.cursor = cursors.loadLight;
                    getId('win_appMaker_html').classList.add('cursorLoadLight');
                    if(btn){
                        getId('APMappsaving').innerHTML = 'SAVING PROJECT...';
                        var projJSON = {};
                        projJSON.code = getId('APMappcode').value;
                        projJSON.icon = getId('APMappicon').value;
                        projJSON.name = getId('APMappname').value;
                        projJSON.launchtypes = getId('APMapplaunchtypes').value;
                        projJSON.maincode = getId('APMappmaincode').value;
                        projJSON.signal = getId('APMappsignal').value;
                        projJSON.vars = getId('APMappvars').value;
                        projJSON.dsktp = getId('APMappdsktp').value;
                        projJSON.code = getId('APMappcode').value;
                        projJSON.iconimage = getId('APMappiconimage').value;
                        
                        ufsave("aos_system/apps/appmaker/project", JSON.stringify(projJSON));
                        
                        getId('APMappsaving').innerHTML = '';
                        getId('win_appMaker_html').style.backgroundImage = '';
                        // getId('winAPMh').style.cursor = '';
                        getId('win_appMaker_html').classList.remove('cursorLoadLight');
                    }
                }, 'Legacy App Maker');
            },
            loadProj: function(){
                apps.prompt.vars.confirm('Overwrite all unsaved work?', ['No', 'Yes'], function(btn){
                    var proj = JSON.parse(ufload("aos_system/apps/appmaker/project"));
                    if(btn){
                        getId('APMappcode').value = proj.code;
                        getId('APMappicon').value = proj.icon;
                        getId('APMappname').value = proj.name;
                        getId('APMapplaunchtypes').value = proj.launchtypes;
                        getId('APMappmaincode').value = proj.maincode;
                        getId('APMappsignal').value = proj.signal;
                        getId('APMappvars').value = proj.vars;
                        getId('APMappdsktp').value = proj.dsktp;
                        getId('APMappcode').value = proj.code;
                        getId('APMappiconimage').value = proj.iconimage;
                    }
                }, 'Legacy App Maker');
            }
        }, 1, "appmaker", "appicons/ds/APM.png"
    );
    getId('aOSloadingInfo').innerHTML = 'Web App Maker';
});
c(function(){
    apps.webAppMaker = new Application(
        "WAP",
        "Web App Maker",
        1,
        function(launchtype){
            if(launchtype === "dsktp"){
                this.appWindow.setCaption("Web App Maker");
                if(!this.appWindow.appIcon){
                    this.appWindow.setDims("auto", "auto", 1000, 600);
                }
            }
            getId('win_webAppMaker_html').style.overflow = 'auto';
            this.appWindow.setContent(
                '<h1>Web App Maker</h1>' +
                '<p>Use this tool to add a web page as an app for aOS.</p>' +
                '<h2>App API</h2>' +
                '<p>If you are writing an app designed specifically for aOS, there is an API available for you to use and allows you to interface with aOS.</p>' +
                '<p>Those of you wishing to develop your own app, the Documentation includes directions you should follow. If not, keep reading below.</p>' +
                '<button onclick="openapp(apps.devDocumentation, \'dsktp\');c(function(){toTop(apps.devDocumentation)})">API Documentation</button>' +
                '<h2>Getting Started</h2>' +
                '<p>First, we need a URL to the webpage you would like to add. It needs to follow a few rules first:</p>' +
                '<ul><li>Address must start with "https://" (not "http://")</li><li>Website must not block aOS from loading it.</li></ul>' +
                '<p>If you\'re unsure that your app follows the rules above, you can test it out here. Enter the URL into the box below and click "Test". The webpage should appear in the box underneath it.</p>' +
                '<input id="WAPtestURL" placeholder="https://example.com/webpage"> <button onclick="getId(\'WAPtestFrame\').src=getId(\'WAPtestURL\').value">Test</button><br>' +
                '<iframe id="WAPtestFrame" src=""></iframe>' +
                '<p>With that test out of the way, let\'s make our app.</p>' +
                '<hr>' +
                '<h2>Launch URL</h2>' +
                '<p>This is the URL the app will load when it launches. Be sure to test the URL above.</p>' +
                '<input id="WAPurl" placeholder="https://">' +
                '<hr>' +
                '<h2>App Name</h2>' +
                '<p>This will be the name displayed on the app\'s desktop icon and its window title bar.</p>' +
                '<img src="appmaker/title.png"><br>' +
                '<input id="WAPname">' +
                '<hr>' +
                '<h2>App Abbreviation</h2>' +
                '<p>This is the shortcut a user can type to get to the app quicker. This is required.</p>' +
                '<img src="appmaker/letters.png"><br>' +
                '<input id="WAPletters" placeholder="two to three letters">' +
                '<hr>' +
                '<h2>App Icon</h2>' +
                '<p>This is the URL to an image to use as your app\'s icon. It\'s best to use an image that is sized at a power of two (like 128x128 or 256x256). Any web-compatible image will work.</p>' +
                '<input id="WAPicon" placeholder="https://site.com/image.png">' +
                '<hr>' +
                '<h2>App Size</h2>' +
                '<p>This is the default width and height of your app\'s window when it is first opened.</p>' +
                'Width: <input id="WAPsizeX" placeholder="700" value="700"><br>' +
                'Height: <input id="WAPsizeY" placeholder="400" value="400">' +
                '<hr>' +
                '<h2>Install App</h2>' +
                '<p>This will add your app to your database. Next time you load aOS (or refresh the page), your app will be on the desktop.</p>' +
                '<button onclick="apps.webAppMaker.vars.addApp()">Install</button>' +
                '<p>To uninstall an app, you can delete its file in the file browser. Its file will be located in "aos_system/wap_apps".</p>'
            );
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    //doLog("Initializing WAP apps...", "#ACE");
                    if(safeMode){
                        doLog("Failed initializing WAP apps because Safe Mode is enabled.", "#F00");
                    }else{
                        for(var file in ufload("aos_system/wap_apps")){
                            try{
                                apps.webAppMaker.vars.compileApp(ufload("aos_system/wap_apps/" + file), file);
                            }catch(err){
                                doLog("Failed initializing " + file + ":", "#F00");
                                doLog(err, "#F00");
                            }
                        }
                        // alphabetized array of apps
                        appsSorted = [];
                        for(var i in apps){
                            appsSorted.push(apps[i].appDesc.toLowerCase() + "|WAP_apps_sort|" + i);
                        }
                        appsSorted.sort();
                        for(var i in appsSorted){
                            var tempStr = appsSorted[i].split("|WAP_apps_sort|");
                            tempStr = tempStr[tempStr.length - 1];
                            appsSorted[i] = tempStr;
                        }
                    }
                    //doLog("Done.", "#ACE");
                    //doLog("Initializing WAP Message Listener and Permission system...", "#ACE");
                    if(safeMode){
                        doLog("Failed WAP Message Listener because Safe Mode is enabled.", "#F00");
                    }else{
                        window.addEventListener("message", apps.webAppMaker.vars.recieveMessage);
                    }
                    if(ufload("aos_system/apps/webAppMaker/trusted_apps")){
                        try{
                            var tempobj = JSON.parse(ufload("aos_system/apps/webAppMaker/trusted_apps"));
                            var fail = 0;
                            for(var i in tempobj){
                                for(var j in tempobj[i]){
                                    if(tempobj[i][j] !== "true" && tempobj[i][j] !== "false"){
                                        fail = 1;
                                    }
                                }
                            }
                            if(fail){
                                doLog("Failed Permissions: Not in correct format.", "#F00");
                            }else{
                                apps.webAppMaker.vars.trustedApps = tempobj;
                            }
                        }catch(err){
                            doLog("Failed initializing WAP Permissions: " + err, "#F00");
                        }
                    }
                    //doLog("Done.", "#ACE");
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'Use this tool to convert any compatible webpage into an app for aOS!<br><br>If you need to delete an app made with this tool, then open its window, right click its title bar, and click "About App". There will be a file name in that info window. You can delete that file in File Manager -> USERFILES, and the app will be uninstalled.',
            ctxMenus: {
                defaultCtx: []
            },
            actions: { // PERMISSIONS
                context: {
                    /*
                        position: [x, y],
                        options: [
                            {
                                name: "Option 1",
                                icon: "gear",
                                disabled: "true",
                            },
                            {
                                name: "Option 1",
                                customIcon: "ctxMenu/beta/gear.png",
                                sectionBegin: "true"
                            },
                        ]
                    */
                    // show custom menu
                    menu: function(input, frame, frameOrigin){
                        var boundingRect = frame.frameElement.getBoundingClientRect();
                        var arrayToRender = [];
                        for(var i in input.options){
                            var namePrefix = " ";
                            if(input.options[i].disabled && input.options[i].sectionBegin){
                                namePrefix = "_";
                            }else if(input.options[i].disabled){
                                namePrefix = "-";
                            }else if(input.options[i].sectionBegin){
                                namePrefix = "+";
                            }
                            if(input.options[i].customImage){
                                arrayToRender.push([
                                    namePrefix + input.options[i].name,
                                    (() => {
                                        var j = i;
                                        return () => {
                                            apps.webAppMaker.vars.postReply({
                                                messageType: "response",
                                                content: j,
                                                conversation: input.conversation
                                            }, frameOrigin, frame);
                                        }
                                    })(),
                                    input.options[i].customImage
                                ]);
                            }else if(input.options[i].image){
                                arrayToRender.push([
                                    namePrefix + input.options[i].name,
                                    (() => {
                                        var j = i;
                                        return () => {
                                            apps.webAppMaker.vars.postReply({
                                                messageType: "response",
                                                content: j,
                                                conversation: input.conversation
                                            }, frameOrigin, frame);
                                        }
                                    })(),
                                    "ctxMenu/beta/" + input.options[i].image + ".png"
                                ]);
                            }else{
                                arrayToRender.push([
                                    namePrefix + input.options[i].name,
                                    (() => {
                                        var j = i;
                                        return () => {
                                            apps.webAppMaker.vars.postReply({
                                                messageType: "response",
                                                content: j,
                                                conversation: input.conversation
                                            }, frameOrigin, frame);
                                        }
                                    })()
                                ]);
                            }
                        }
                        ctxMenu(
                            arrayToRender, 1, {
                                pageX: (input.position || [0, 0])[0] + boundingRect.x,
                                pageY: (input.position || [0, 0])[1] + boundingRect.y
                            }, {}
                        )
                        return "APPMAKER_DO_NOT_REPLY";
                    },
                    // show text-editing menu (copy, paste, etc)
                    text_menu: function(input, frame, frameOrigin){
                        currentSelection = input.selectedText;
                        showEditContext(null, 1, input.position, input.conversation, frame, frameOrigin, input.enablePaste);
                        return "APPMAKER_DO_NOT_REPLY";
                    }
                },
                fs: {
                    read_uf: function(input){
                        return ufload(input.targetFile);
                    },
                    write_uf: function(input){
                        try{
                            ufsave(input.targetFile, input.content);
                            return "success";
                        }catch(err){
                            return "error: " + err
                        }
                    },
                    read_lf: function(input){
                        return lfload(input.targetFile);
                    },
                    write_lf: function(input){
                        try{
                            lfsave(input.targetFile, input.content);
                            return "success";
                        }catch(err){
                            return "error: " + err
                        }
                    }
                },
                prompt: {
                    alert: function(input, srcFrame, frameOrigin){
                        try{
                            apps.prompt.vars.alert(input.content || "", input.button || "Okay", () => {
                                apps.webAppMaker.vars.postReply({
                                    messageType: "response",
                                    content: true,
                                    conversation: input.conversation
                                }, frameOrigin, srcFrame);
                            }, (apps[srcFrame.frameElement.getAttribute("data-parent-app")] || {appDesc: "An app"}).appDesc);
                        }catch(err){
                            return false;
                        }
                        return "APPMAKER_DO_NOT_REPLY";
                    },
                    prompt: function(input, srcFrame, frameOrigin){
                        try{
                            apps.prompt.vars.prompt(input.content || "", input.button || "Okay", (userText) => {
                                apps.webAppMaker.vars.postReply({
                                    messageType: "response",
                                    content: userText,
                                    conversation: input.conversation
                                }, frameOrigin, srcFrame);
                            }, (apps[srcFrame.frameElement.getAttribute("data-parent-app")] || {appDesc: "An app"}).appDesc);
                        }catch(err){
                            return false;
                        }
                        return "APPMAKER_DO_NOT_REPLY";
                    },
                    confirm: function(input, srcFrame, frameOrigin){
                        try{
                            apps.prompt.vars.confirm(input.content || "", input.buttons || ["Cancel", "Okay"], (userBtn) => {
                                apps.webAppMaker.vars.postReply({
                                    messageType: "response",
                                    content: userBtn,
                                    conversation: input.conversation
                                }, frameOrigin, srcFrame);
                            }, (apps[srcFrame.frameElement.getAttribute("data-parent-app")] || {appDesc: "An app"}).appDesc);
                        }catch(err){
                            return false;
                        }
                        return "APPMAKER_DO_NOT_REPLY";
                    },
                    notify: function(input, srcFrame, frameOrigin){
                        try{
                            apps.prompt.vars.notify(input.content || "", input.buttons || ["Cancel", "Okay"], (userBtn) => {
                                apps.webAppMaker.vars.postReply({
                                    messageType: "response",
                                    content: userBtn,
                                    conversation: input.conversation
                                }, frameOrigin, srcFrame);
                            }, (apps[srcFrame.frameElement.getAttribute("data-parent-app")] || {appDesc: "An app"}).appDesc, input.image || "");
                        }catch(err){
                            return err;
                        }
                        return "APPMAKER_DO_NOT_REPLY";
                    }
                },
                getstyle: {
                    darkmode: function(input){
                        return numtf(darkMode);
                    },
                    customstyle: function(input){
                        var tempStyleLinks = [];
                        var tempStyleElements = document.getElementsByClassName('customstyle_appcenter');
                        for(var i = 0; i < tempStyleElements.length; i++){
                            if(tempStyleElements[i].tagName === "LINK"){
                                tempStyleLinks.push([tempStyleElements[i].href, "link"]);
                            }else if(tempStyleElements[i].tagName === "STYLE"){
                                tempStyleLinks.push([tempStyleElements[i].innerHTML, "literal"]);
                            }
                        }
                        return {
                            customStyle: getId("aosCustomStyle").innerHTML,
                            styleLinks: tempStyleLinks
                        };
                    }
                },
                readsetting: {
                    
                },
                writesetting: {

                },
                js: {
                    exec: function(input){
                        try{
                            var inputtedFunction = new Function(input.content);
                            return inputtedFunction();
                        }catch(error){
                            return "Error: " + error;
                        }
                    }
                },
                appwindow: {
                    set_caption: function(input, frame){
                        try{
                            if(frame.frameElement.getAttribute("data-parent-app")){
                                if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                                    apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.setCaption(input.content);
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }catch(err){
                            return false;
                        }
                    },
                    disable_padding: function(input, frame){
                        try{
                            if(frame.frameElement.getAttribute("data-parent-app")){
                                if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                                    apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.paddingMode(0);
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }catch(err){
                            return false;
                        }
                    },
                    enable_padding: function(input, frame){
                        try{
                            if(frame.frameElement.getAttribute("data-parent-app")){
                                if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                                    apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.paddingMode(1);
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }catch(err){
                            return false;
                        }
                    },
                    open_window: function(input, frame){
                        try{
                            if(frame.frameElement.getAttribute("data-parent-app")){
                                if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                                    apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.openWindow();
                                    toTop(apps[frame.frameElement.getAttribute("data-parent-app")]);
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }catch(err){
                            return false;
                        }
                    },
                    close_window: function(input, frame){
                        try{
                            if(frame.frameElement.getAttribute("data-parent-app")){
                                if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                                    apps[frame.frameElement.getAttribute("data-parent-app")].signalHandler("close");
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }catch(err){
                            return false;
                        }
                    },
                    minimize: function(input, frame){
                        try{
                            if(frame.frameElement.getAttribute("data-parent-app")){
                                if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                                    apps[frame.frameElement.getAttribute("data-parent-app")].signalHandler("shrink");
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }catch(err){
                            return false;
                        }
                    },
                    maximize: function(input, frame){
                        try{
                            if(frame.frameElement.getAttribute("data-parent-app")){
                                if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                                    if(!apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.fullscreen){
                                        apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.toggleFullscreen();
                                    }
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }catch(err){
                            return false;
                        }
                    },
                    unmaximize: function(input, frame){
                        try{
                            if(frame.frameElement.getAttribute("data-parent-app")){
                                if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                                    if(apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.fullscreen){
                                        apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.toggleFullscreen();
                                    }
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }catch(err){
                            return false;
                        }
                    },
                    get_maximized: function(input, frame){
                        if(frame.frameElement.getAttribute("data-parent-app")){
                            if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                                return numtf(apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.fullscreen);
                            }
                        }
                    },
                    set_dims: function(input, frame){
                        try{
                            if(frame.frameElement.getAttribute("data-parent-app")){
                                if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                                    apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.setDims(
                                        input.x || "auto",
                                        input.y || "auto",
                                        input.width || apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.sizeH,
                                        input.height || apps[frame.frameElement.getAttribute("data-parent-app")].appWindow.sizeV
                                    );
                                    return true;
                                }
                                return false;
                            }
                            return false;
                        }catch(err){
                            return false;
                        }
                    },
                    get_borders: function(input, frame){
                        if(mobileMode){
                            return {
                                left: 0,
                                top: 32,
                                right: 0,
                                bottom: 0
                            };
                        }else{
                            return {
                                left: apps.settings.vars.winBorder,
                                top: 32,
                                right: apps.settings.vars.winBorder,
                                bottom: apps.settings.vars.winBorder
                            };
                        }
                    },
                    get_screen_dims: function(input, frame){
                        return {
                            width: parseFloat(getId("monitor").style.width),
                            height: parseFloat(getId("monitor").style.height)
                        };
                    },
                    take_focus: function(input, frame){
                        if(apps[frame.frameElement.getAttribute("data-parent-app")]){
                            toTop(apps[frame.frameElement.getAttribute("data-parent-app")]);
                            return true;
                        }else{
                            return false;
                        }
                    }
                },
                bgservice: {
                    set_service: function(input, frame){
                        if(!input.serviceURL){
                            return false;
                        }
                        if(frame.frameElement.getAttribute("data-parent-app")){
                            if(getId("win_" + frame.frameElement.getAttribute("data-parent-app") + "_bgservice")){
                                getId("win_" + frame.frameElement.getAttribute("data-parent-app") + "_bgservice").src = input.serviceURL;
                                return true;
                            }else{
                                var tempElement = document.createElement("iframe");
                                tempElement.classList.add("winBgService");
                                tempElement.id = "win_" + frame.frameElement.getAttribute("data-parent-app") + "_bgservice";
                                tempElement.setAttribute("data-parent-app", frame.frameElement.getAttribute("data-parent-app"));
                                getId("win_" + frame.frameElement.getAttribute("data-parent-app") + "_top").appendChild(tempElement);
                                tempElement.src = input.serviceURL;
                                return true;
                            }
                        }
                        return false;
                    },
                    exit_service: function(input, frame){
                        try{
                            if(getId("win_" + frame.frameElement.getAttribute("data-parent-app") + "_bgservice")){
                                getId("win_" + frame.frameElement.getAttribute("data-parent-app") + "_top").removeChild(
                                    getId("win_" + frame.frameElement.getAttribute("data-parent-app") + "_bgservice")
                                );
                                return true;
                            }
                            return true;
                        }catch(err){
                            return false;
                        }
                    },
                    check_service: function(input, frame){
                        if(getId("win_" + frame.frameElement.getAttribute("data-parent-app") + "_bgservice")){
                            if(getId("win_" + frame.frameElement.getAttribute("data-parent-app") + "_bgservice").src){
                                return getId("win_" + frame.frameElement.getAttribute("data-parent-app") + "_bgservice").src;
                            }else{
                                return false;
                            }
                        }else{
                            return false;
                        }
                    }
                }
            },
            actionDesc: {
                fs: "access your files on aOS",
                prompt: "show prompts and notifications on aOS",
                readsetting: "read your settings on aOS",
                writesetting: "change your settings on aOS",
                js: "execute JavaScript code on aOS (DANGEROUS!)",
                getstyle: "theme itself to aOS",
                context: "use various context menus",
                appwindow: "manipulate its window",
                bgservice: "run in the background"
            },
            commandDescriptions: {
                context: {
                    menu: "Display a context menu at the click point."
                },
                customstyle: {
                    darkmode: "Get the state of dark mode.",
                    customstyle: "Get the user's stylesheets. Trust me, just let aosTools handle this one:"
                },
                fs: {
                    read_uf: "Read a file from USERFILES",
                    write_uf: "Write a file to USERFILES",
                    read_lf: "Read a file from LOCALFILES",
                    write_lf: "Write a file to LOCALFILES"
                },
                prompt: {
                    alert: "Show an alert window to display information.",
                    prompt: "Show a prompt window to ask for information.",
                    confirm: "Show a confirm window to ask for a choice.",
                    notify: "Show a notification and ask for a choice."
                },
                js: {
                    exec: "Execute JS code on aOS"
                },
                appwindow: {
                    set_caption: "Set the caption of the app window",
                    disable_padding: "Disable default 3px of padding",
                    enable_padding: "Enable default 3px of padding",
                    open_window: "Open the app window.",
                    minimize: "Minimize the app window.",
                    maximize: "Maximize the app window.",
                    unmaximize: "Unmaximize the app window.",
                    get_maximized: "Ask if the window is maximized; returns true/false",
                    close_window: "Close the app window.",
                    set_dims: "Set the x, y, width, and height of the window."
                },
                bgservice: {
                    set_service: "Set the URL of your background service and initialize it if necessary.",
                    exit_service: "Close your service, if it is running.",
                    check_service: "Get the URL of the currently-running service, or false if none."
                }
            },
            buildAPI: function(permissions){
                var str = '';
                var str2 = '';
                for(var i in this.actions){
                    if(str !== ''){
                        if(!permissions){
                            str += '<hr>';
                        }else{
                            str += ', ';
                        }
                    }
                    str += '<span style="font-size:24px">' + i + '</span>';
                    if(!permissions){
                        str += '<br>';
                        if(typeof this.commandDescriptions[i] === "object"){
                            for(var j in this.commandDescriptions[i]){
                                str += '<br>';
                                if(typeof this.commandDescriptions[i][j] === "string"){
                                    str += j + ': ' + this.commandDescriptions[i][j] + "<br>";
                                    if(typeof this.commandExamples[i] === "object"){
                                        if(typeof this.commandExamples[i][j] === "string"){
                                            str += '<div style="position:relative;margin-left:16px;">' + this.commandExamples[i][j] + '</div>';
                                        }
                                    }
                                    str += "<br><br>"
                                }
                            }
                        }else{
                            str += "no documented commands in this permission set.<br>";
                        }
                    }
                }
                return str;
            },
            trustedApps: {
                [window.location.origin]: {
                    "fs": "true",
                    "readsetting": "true",
                    "writesetting": "true",
                    "js": "true",
                    "bgservice": "true",
                    "context": "true"
                }
            },
            globalPermissions: {
                "getstyle": "true",
                "appwindow": "true",
                "prompt": "true",
                "context": "true"
            },
            updatePermissions: function(){
                ufsave("aos_system/apps/webAppMaker/trusted_apps", JSON.stringify(apps.webAppMaker.vars.trustedApps, null, 4));
            },
            reflectPermissions: function(){
                doLog("Initializing WAP Permission system...", "#ACE");
                if(ufload("aos_system/apps/webAppMaker/trusted_apps")){
                    try{
                        var tempobj = JSON.parse(ufload("aos_system/apps/webAppMaker/trusted_apps"));
                        var fail = 0;
                        for(var i in tempobj){
                            for(var j in tempobj[i]){
                                if(tempobj[i][j] !== "true" && tempobj[i][j] !== "false"){
                                    fail = 1;
                                }
                            }
                        }
                        if(fail){
                            doLog("Failed Permissions: Not in correct format.", "#F00");
                        }else{
                            apps.webAppMaker.vars.trustedApps = tempobj;
                        }
                    }catch(err){
                        doLog("Failed Permissions: " + err, "#F00");
                    }
                }
                doLog("Done.", "#ACE");
            },
            recieveMessage: function(msg){
                if(typeof msg.data === "string"){
                    doLog("String-formatted request is no longer supported. " + msg.origin, "#F00");
                }else{
                    if(typeof msg.data === "object"){
                        if(msg.data.messageType){
                            if(msg.data.messageType === "request"){
                                var returnMessage = {
                                    messageType: "response",
                                    conversation: ""
                                };

                                if(!msg.data.hasOwnProperty("action")){
                                    returnMessage = {
                                        messageType: "response",
                                        content: "Error - no action provided"
                                    };
                                    if(msg.data.conversation){
                                        returnMessage.conversation = msg.data.conversation;
                                    }
                                    apps.webAppMaker.vars.postReply(returnMessage, msg.origin, msg.source);
                                    return;
                                }

                                if(msg.data.action.split(":")[0] === "permission"){
                                    returnMessage = {
                                        messageType: "response",
                                        content: "asking: " + msg.data.action.split(":")[1]
                                    };
                                    if(msg.data.conversation){
                                        returnMessage.conversation = msg.data.conversation;
                                    }

                                    if(msg.data.action.split(":").length > 1){
                                        if(apps.webAppMaker.vars.globalPermissions.hasOwnProperty(msg.data.action.split(":")[1])){
                                            returnMessage.content = "granted: " + msg.data.action.split(":")[1];
                                        }else if(apps.webAppMaker.vars.actions.hasOwnProperty(msg.data.action.split(":")[1])){
                                            if(apps.webAppMaker.vars.trustedApps.hasOwnProperty(msg.origin)){
                                                if(apps.webAppMaker.vars.trustedApps[msg.origin].hasOwnProperty(msg.data.action.split(":")[1])){
                                                    if(apps.webAppMaker.vars.trustedApps[msg.origin][msg.data.action.split(":")[1]] === "true"){
                                                        returnMessage.content = "granted: " + msg.data.action.split(":")[1];
                                                    }
                                                }
                                            }
                                        }else{
                                            returnMessage.content = "unknown"
                                        }
                                    }

                                    if(returnMessage.content.indexOf("asking") === 0){
                                        if(msg.data.action.split(":").length === 1){
                                            apps.webAppMaker.vars.askPermission(null, msg.origin, msg.source, (msg.data.conversation || null));
                                        }else if(apps.webAppMaker.vars.actions.hasOwnProperty(msg.data.action.split(":")[1])){
                                            apps.webAppMaker.vars.askPermission(msg.data.action.split(":")[1], msg.origin, msg.source, (msg.data.conversation || null));
                                        }
                                    }else{
                                        apps.webAppMaker.vars.postReply(returnMessage, msg.origin, msg.source);
                                    }
                                    return;
                                }

                                if(!apps.webAppMaker.vars.actions.hasOwnProperty(msg.data.action.split(":")[0])){
                                    returnMessage = {
                                        messageType: "response",
                                        content: "Error - permission not recognized"
                                    };
                                    if(msg.data.conversation){
                                        returnMessage.conversation = msg.data.conversation;
                                    }
                                    apps.webAppMaker.vars.postReply(returnMessage, msg.origin, msg.source);
                                    return;
                                }
                                
                                if(!apps.webAppMaker.vars.trustedApps.hasOwnProperty(msg.origin)){
                                    if(!apps.webAppMaker.vars.globalPermissions.hasOwnProperty(msg.data.action.split(":")[0])){
                                        returnMessage = {
                                            messageType: "response",
                                            content: "Error - origin not recognized: " + msg.origin
                                        };
                                        if(msg.data.conversation){
                                            returnMessage.conversation = msg.data.conversation;
                                        }
                                        apps.webAppMaker.vars.postReply(returnMessage, msg.origin, msg.source);
                                        return;
                                    }
                                }else{
                                    if(
                                        !apps.webAppMaker.vars.trustedApps[msg.origin].hasOwnProperty(msg.data.action.split(":")[0]) &&
                                        !apps.webAppMaker.vars.globalPermissions.hasOwnProperty(msg.data.action.split(":")[0])
                                    ){
                                        returnMessage = {
                                            messageType: "response",
                                            content: "Error - permission not granted by user"
                                        };
                                        if(msg.data.conversation){
                                            returnMessage.conversation = msg.data.conversation;
                                        }
                                        apps.webAppMaker.vars.postReply(returnMessage, msg.origin, msg.source);
                                        return;
                                    }
                                    if(apps.webAppMaker.vars.trustedApps[msg.origin][msg.data.action.split(':')[0]] !== "true"){
                                        if(apps.webAppMaker.vars.globalPermissions.hasOwnProperty(msg.data.action.split(":")[0])){
                                            if(apps.webAppMaker.vars.globalPermissions[msg.data.action.split(":")[0]] !== "true"){
                                                returnMessage = {
                                                    messageType: "response",
                                                    content: "Error - permission not granted by user"
                                                };
                                                if(msg.data.conversation){
                                                    returnMessage.conversation = msg.data.conversation;
                                                }
                                                apps.webAppMaker.vars.postReply(returnMessage, msg.origin, msg.source);
                                                return;
                                            }
                                        }else{
                                            returnMessage = {
                                                messageType: "response",
                                                content: "Error - permission not granted by user"
                                            };
                                            if(msg.data.conversation){
                                                returnMessage.conversation = msg.data.conversation;
                                            }
                                            apps.webAppMaker.vars.postReply(returnMessage, msg.origin, msg.source);
                                            return;
                                        }
                                    }
                                }

                                returnMessage.messageType = "response";
                                if(msg.data.conversation){
                                    returnMessage.conversation = msg.data.conversation;
                                }
                                returnMessage.content = apps.webAppMaker.vars.actions[msg.data.action.split(":")[0]][msg.data.action.split(":")[1]](msg.data, msg.source, msg.origin);
                                if(returnMessage.content !== "APPMAKER_DO_NOT_REPLY"){
                                    apps.webAppMaker.vars.postReply(returnMessage, msg.origin, msg.source);
                                }
                            }else{
                                doLog("postMessage from " + msg.origin + ": ", "#ACE");
                                console.log(msg.data);
                                debugArray(msg.data);
                            }
                        }else{
                            doLog("postMessage from " + msg.origin + ": ", "#ACE");
                            console.log(msg.data);
                            debugArray(msg.data);
                        }
                    }else{
                        doLog("postMessage from " + msg.origin + ": " + apps.webAppMaker.vars.sanitize(msg.data), "#ACE");
                    }
                }
            },
            postReply: function(message, origin, src){
                src.postMessage(message, origin);
            },
            askPermission: function(permission, origin, source, conv){
                if(permission){
                    apps.prompt.vars.confirm(origin + " is requesting permission to " + this.actionDesc[permission] + "." + "<br><br>Permission Code: " + permission, ['Deny', 'Allow'], (btn) => {
                        if(!apps.webAppMaker.vars.trustedApps.hasOwnProperty(origin)){
                            apps.webAppMaker.vars.trustedApps[origin] = {};
                        }
                        apps.webAppMaker.vars.trustedApps[origin][permission] = "" + numtf(btn);
                        apps.webAppMaker.vars.updatePermissions();
                        if(btn){
                            apps.webAppMaker.vars.postReply({
                                messageType: "response",
                                conversation: (conv || ""),
                                content: "granted"
                            }, origin, source);
                        }else{
                            apps.webAppMaker.vars.postReply({
                                messageType: "response",
                                conversation: (conv || ""),
                                content: "denied"
                            }, origin, source);
                        }
                    }, 'AaronOS');
                }else{
                    apps.prompt.vars.notify(origin + " is added to the permissions list.", 'Okay', () => {
                        apps.webAppMaker.vars.trustedApps[origin] = {};
                        apps.webAppMaker.vars.updatePermissions();
                        apps.webAppMaker.vars.postReply({
                            messageType: "response",
                            conversation: (conv || ""),
                            content: "granted"
                        }, origin, source);
                    }, 'AaronOS');
                }
            },
            sanitize: function(text){
                return String(text).split("<").join("&lt;").split(">").join("&gt;");
            },
            numberOfApps: 0,
            addApp: function(){
                var tempObj = {
                    url: getId('WAPurl').value,
                    name: getId('WAPname').value,
                    abbr: getId('WAPletters').value,
                    icon: getId('WAPicon').value || undefined,
                    sizeX: parseFloat(getId('WAPsizeX').value),
                    sizeY: parseFloat(getId('WAPsizeY').value)
                };
                var invalid = 0;
                for(var app in apps){
                    if(apps[app].dsktpIcon === tempObj.abbr){
                        invalid = 1;
                    }
                }
                if(!invalid){
                    //apps.savemaster.vars.save('WAP_APPS_DATABASE_' + (new Date().getTime()), JSON.stringify(tempObj), 1);
                    ufsave('aos_system/wap_apps/webApp' + apps.webAppMaker.vars.numberOfApps, JSON.stringify(tempObj));
                    apps.webAppMaker.vars.numberOfApps++;
                    apps.prompt.vars.alert('Finished. Restart aOS to use your new app!', 'Okay', function(){}, 'Web App Maker');
                }else{
                    apps.prompt.vars.alert('Failed! Your app\'s abbreviation is already in use on your system. Please choose a different one.', 'Okay', function(){}, 'Web App Maker');
                }
            },
            compileApp: function(str, appFileName){
                tempObj = JSON.parse(str);
                apps['webApp' + apps.webAppMaker.vars.numberOfApps] = new Application(
                    tempObj.abbr,
                    tempObj.name,
                    0,
                    function(){
                        this.appWindow.setCaption(this.appDesc);
                        if(!this.appWindow.appIcon){
                            this.appWindow.paddingMode(0);
                            this.appWindow.setContent('<iframe data-parent-app="' + this.objName + '" style="width:100%;height:100%;border:none;" src="' + this.vars.appURL + '"></iframe>');
                            this.appWindow.setDims("auto", "auto", this.vars.sizeX, this.vars.sizeY);
                        }
                        this.appWindow.openWindow();
                    },
                    function(signal){
                        switch(signal){
                            case "forceclose":
                                //this.vars = this.varsOriginal;
                                this.appWindow.closeWindow();
                                this.appWindow.closeIcon();
                                break;
                            case "close":
                                this.appWindow.closeWindow();
                                setTimeout(function(){
                                    if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                                        this.appWindow.setContent("");
                                    }
                                }.bind(this), 300);
                                break;
                            case "checkrunning":
                                if(this.appWindow.appIcon){
                                    return 1;
                                }else{
                                    return 0;
                                }
                            case "shrink":
                                this.appWindow.closeKeepTask();
                                break;
                            case "USERFILES_DONE":
                                
                                break;
                            case 'shutdown':
                                    
                                break;
                            default:
                                doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
                        }
                    },
                    {
                        appInfo: 'This app was made using the Web App Maker app.<br><br>Home URL:<br>' + tempObj.url + '<br><br>File path:<br>USERFILES/aos_system/wap_apps/' + appFileName + '<br><br>App object name:<br>apps.webApp' + apps.webAppMaker.vars.numberOfApps,
                        appURL: tempObj.url,
                        sizeX: tempObj.sizeX,
                        sizeY: tempObj.sizeY
                    }, 0, 'webApp' + apps.webAppMaker.vars.numberOfApps, tempObj.icon
                );
                apps.webAppMaker.vars.numberOfApps++;
            }
        }, 0, "webAppMaker", "appicons/ds/APM.png"
    );
    getId('aOSloadingInfo').innerHTML = 'Messaging';
});
c(function(){
    m('init MSG');
    apps.messaging = new Application(
        "MSG",
        "Messaging",
        1,
        function(launchType){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.vars.lastUserRecieved = '';
                this.appWindow.setDims("auto", "auto", 800, 500);
            }
            this.appWindow.setCaption('Messaging');
            getId('win_messaging_html').setAttribute('onclick', 'if(apps.messaging.vars.soundToPlay && apps.messaging.vars.canLookethOverThereSound){apps.messaging.vars.notifClick.play(); apps.messaging.vars.soundToPlay = 0;}');
            if(launchType === 'dsktp'){
                this.appWindow.setContent(
                    '<div id="MSGdiv" style="width:100%;height:calc(100% - 52px);overflow-y:scroll;padding-top:32px;"></div>' +
                    '<div style="left:0;top:0;background:#FFA;padding:2px;font-family:aosProFont,monospace;font-size:12px;border-bottom-right-radius:5px;color:#000;">' + this.vars.discussionTopic + '</div>' +
                    '<button style="position:absolute;bottom:0;height:24px;width:10%;" onclick="apps.messaging.vars.doSettings()">Settings</button>' +
                    '<button style="position:absolute;bottom:0;height:24px;width:10%;left:10%;" onclick="apps.messaging.vars.doFormatting()">Formatting</button>' +
                    '<input id="MSGinput" style="position:absolute;height:21px;width:70%;bottom:0;left:20%;border:none;border-top:1px solid ' + darkSwitch('#000', '#FFF') + ';font-family:sans-serif">' +
                    '<button onclick="apps.messaging.vars.sendMessage()" style="position:absolute;right:0;bottom:0;width:10%;height:24px">Send</button>');
                this.vars.lastMsgRecieved = this.vars.lastMsgStart;
                getId('MSGinput').setAttribute('onkeyup', 'if(event.keyCode === 13){apps.messaging.vars.sendMessage();}');
            }
            this.appWindow.openWindow();
            this.vars.requestMessage();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    if(ufload("aos_system/apps/messaging/chat_name")){
                        apps.messaging.vars.name = ufload("aos_system/apps/messaging/chat_name");
                    }
                    if(!safeMode){
                        if(ufload("aos_system/apps/messaging/easter_egg")){
                            if(ufload("aos_system/apps/messaging/easter_egg") === "1"){
                                this.vars.canLookethOverThereSound = 1;
                            }
                        }
                    }
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'The official AaronOS Messenger. Chat with the entire aOS community, all at once.<br><br>To set your name, go to Settings -&gt; 1, and enter a chat name.<br><br>To view past messages, go to Settings -&gt; 2, and enter in the number of past messages you wish to view.',
            discussionTopic: 'AaronOS is on Discord! <a href="https://discord.gg/Y5Jytdm" target="_blank">https://discord.gg/Y5Jytdm</a><br>Real admins have a green background on their messages!',
            lastMsgRecieved: '-9',
            nameTemp: 'Anonymous',
            name: 'Anonymous',
            xhttpDelay: 0,
            messageTemp: '',
            message: '',
            lastSetIn: '',
            lastMsgStart: '-9',
            doFormatting: function(){
                tempStr = '';
                for(var i in apps.messaging.vars.objTypes){
                    tempStr += '<br><br><br><br><span style="background:#CCC;padding:3px;border-radius:3px;">[' + i + ']</span><br><br>' + (apps.messaging.vars.objDesc[i] || 'No description.') + '<br><br>Example:<br><br><span style="background:#CCC;padding:3px;border-radius:3px;">' + (apps.messaging.vars.objExamp[i] || 'No examples.') + '</span><br><br>' + apps.messaging.vars.parseBB(apps.messaging.vars.objExamp[i] || '');
                }
                apps.prompt.vars.alert('Here are all the installed formatting tools:' + tempStr, 'Okay', function(){}, 'Messaging');
            },
            doSettings: function(){
                apps.prompt.vars.confirm('Choose a settings option below.', ['Cancel', 'Change Chat Name', 'Load Past Messages', 'Toggle Fun Geico Easter Egg'], function(txtIn){
                    apps.messaging.vars.lastSetIn = txtIn;
                    switch(apps.messaging.vars.lastSetIn){
                        case 1:
                            apps.prompt.vars.prompt('Please enter a Chatname.<br>Default is Anonymous<br>Current is ' + apps.messaging.vars.name, 'Submit', function(txtIN){
                                apps.messaging.vars.nameTemp = txtIN;
                                if(apps.messaging.vars.nameTemp.length > 30 && apps.messaging.vars.nameTemp.length < 3){
                                    apps.prompt.vars.alert('Your name cannot be more than 30 or less than 3 characters long.', 'Okay', function(){}, 'Messaging');
                                }else if(apps.messaging.vars.nameTemp.toLowerCase().indexOf('mineandcraft12') > -1 || apps.messaging.vars.nameTemp.toUpperCase().indexOf('{ADMIN}') > -1){
                                    apps.prompt.vars.prompt('REALITY CHECK<br>Please enter your password, Aaron... or admin.', 'This user security agent again?', function(secretpass){
                                        //if(secretpass === navigator.userAgent){
                                            apps.messaging.vars.name = apps.messaging.vars.nameTemp; // = "";
                                            //for(var i in apps.messaging.vars.nameTemp){
                                            //    apps.messaging.vars.name += encodeURIComponent(apps.messaging.vars.nameTemp[i]);
                                            //}
                                            
                                            // This zone is quite battlescarred. Why must our fellow samaritans attack it so much?
                                            
                                            apps.savemaster.vars.save('aos_system/apps/messaging/chat_name', apps.messaging.vars.name, 1, 'mUname', secretpass || 'pass');
                                        //}else{
                                        //    apps.prompt.vars.alert('Nice try! You aren\'t Aaron! And you aren\'t an admin either! What gives, man? Calm down with the impersonation here! I\'m just a kid doing something really cool with computers, chill out and quit trying to mess things up!', 'Sheesh, I guess I won\'t pretend to be Aaron or an admin, like a jerk or something.', function(){}, 'Aaron');
                                        //}
                                    }, 'Messaging');
                                }else{
                                    apps.messaging.vars.name = apps.messaging.vars.nameTemp; // = "";
                                    //for(var i in apps.messaging.vars.nameTemp){
                                    //    apps.messaging.vars.name += encodeURIComponent(apps.messaging.vars.nameTemp[i]);
                                    //}
                                    apps.savemaster.vars.save('aos_system/apps/messaging/chat_name', apps.messaging.vars.name, 1, 'mUname', '');
                                }
                            }, 'Messaging');
                            break;
                        case 2:
                            apps.prompt.vars.prompt('Load the last x messages.<br>Default when opening is 10.<br>Make it a positive integer.<br>This will restart the Messaging app.', 'Submit', function(subNum){
                                apps.messaging.vars.lastMsgStart = "-" + subNum;
                                apps.messaging.appWindow.closeWindow();
                                openapp(apps.messaging, 'dsktp');
                            }, 'Messaging');
                            break;
                        case 3:
                            apps.messaging.vars.canLookethOverThereSound = apps.messaging.vars.canLookethOverThereSound * -1 + 1;
                            apps.prompt.vars.alert('Looketh Over There enabled: ' + numtf(apps.messaging.vars.canLookethOverThereSound), 'Okay', function(){}, 'Messaging');
                            apps.savemaster.vars.save('aos_system/apps/messaging/easter_egg', apps.messaging.vars.canLookethOverThereSound, 1);
                        default:
                            doLog('Messaging settings change cancelled');
                    }
                }, 'Messaging');
            },
            xhttp: {},
            sendhttp: {},
            sendfd: {},
            lastMessage: '',
            lastMessageTime: 0,
            sendMessage: function(){
                this.messageTemp = getId("MSGinput").value;
                if(this.messageTemp === this.lastMessage){
                    apps.prompt.vars.notify('Please don\'t send the same message twice in a row.', ['Okay'], function(btn){}, 'Messaging', 'appicons/ds/MSG.png');
                    getId('MSGinput').value = '';
                }else if(performance.now() - this.lastMessageTime < 3000){
                    apps.prompt.vars.notify('Please wait at least 3 seconds between messages.', ['Okay'], function(btn){}, 'Messaging', 'appicons/ds/MSG.png');
                }else{
                    this.lastMessage = this.messageTemp;
                    if(this.messageTemp.length !== 0){
                        /*
                        this.message = '';
                        this.messageTemp = this.messageTemp.split('\\').join('\\\\');
                        for(var i in this.messageTemp){
                            if(this.messageTemp[i] === '"'){
                                this.message += "''";
                            }else{
                                this.message += encodeURIComponent(this.messageTemp[i]);
                            }
                        }
                        */
                        //getId("messagingframe").src = 'messager.php?c=' + this.message;     wtf was i thinking lol
                        this.sendhttp = new XMLHttpRequest();
                        this.sendfd = new FormData();
                        this.sendfd.append('c', this.lastMessage);
                        this.sendhttp.open('POST', 'messager.php');
                        this.sendhttp.onreadystatechange = function(){
                            if(apps.messaging.vars.sendhttp.readyState === 4){
                                if(apps.messaging.vars.sendhttp.status === 200){
                                    if(apps.messaging.vars.sendhttp.responseText === 'Error - Password incorrect.'){
                                        apps.prompt.vars.alert('Could not send message. Your password is incorrect.<br><br>If you recently set a new password, try to reset aOS and see if that fixes the issue. If the issue persists, please contact the developer via the Discord server or email.', 'Okay.', function(){}, 'Messaging');
                                    }else if(apps.messaging.vars.sendhttp.responseText.indexOf('Error - ') === 0){
                                        apps.prompt.vars.alert('Error sending message:<br><br>' + apps.messaging.vars.sendhttp.responseText, 'Okay.', function(){}, 'Messaging');
                                    }
                                }else{
                                    apps.prompt.vars.alert('Could not send message. Network error code ' + apps.messaging.vars.sendhttp.status + '.<br><br>Try again in a minute or so. If it still doesn\'t work, contact the developer via the Discord server or email.', 'Okay.', function(){}, 'Messaging');
                                }
                            }
                        }
                        this.sendhttp.send(this.sendfd);
                        getId("MSGinput").value = "";
                    }
                }
                this.lastMessageTime = performance.now();
            },
            lastResponseObject: {},
            lastUserRecieved: '',
            needsScroll: false,
            notifPing: new Audio('messagingSounds/messagePing.wav'),
            notifMessage: new Audio('messagingSounds/lookethOverThere.wav'),
            notifClick: new Audio('messagingSounds/madestThouLook.wav'),
            soundToPlay: 0,
            canLookethOverThereSound: 0,
            objTypes: {
                img: function(str, param){
                    return '<img onclick="this.classList.toggle(\'MSGdivGrowPic\');this.parentNode.classList.toggle(\'MSGdivGrowPicParent\')" style="max-width:calc(100% - 6px);max-height:400px;padding-left:3px;padding-right:3px;" src="' + str + '">';
                },
                url: function(str, param){
                    if(str.indexOf('http://') !== 0 && str.indexOf('https://') !== 0 && str.indexOf('/') !== 0){
                        str = 'https://' + encodeURI(str);
                    }
                    return '<a target="_blank" href="' + str + '">' + str + '</a>';
                },
                b: function(str, param){
                    return '<b>' + str + '</b>';
                },
                i: function(str, param){
                    return '<i>' + str + '</i>';
                },
                u: function(str, param){
                    return '<u>' + str + '</u>';
                },
                br: function(param){
                    return '<br>';
                },
                hr: function(param){
                    return '<hr>';
                },
                font: function(str, param){
                    if(param){
                        return '<span style="font-family:' + param.split(';')[0] + ', monospace;">' + str + '</span>';
                    }else{
                        var strComma = str.indexOf(',');
                        var strCommaSpace = str.indexOf(', ');
                        var strSplit = '';
                        if(strComma > -1){
                            if(strCommaSpace === strComma){
                                strSplit = str.split(', ');
                                return '<span style="font-family:' + strSplit.shift().split(';')[0] + ', monospace;">' + strSplit.join(', ') + '</span>';
                            }else{
                                strSplit = str.split(',');
                                return '<span style="font-family:' + strSplit.shift().split(';')[0] + ', monospace;">' + strSplit.join(',') + '</span>';
                            }
                        }else{
                            return '[font]' + str + '[/font]';
                        }
                    }
                },
                color: function(str, param){
                    if(param){
                        return '<span style="color:' + param.split(';')[0] + ';">' + str + '</span>';
                    }else{
                        var strComma = str.indexOf(',');
                        var strCommaSpace = str.indexOf(', ');
                        var strSplit = '';
                        if(strComma > -1){
                            if(strCommaSpace === strComma){
                                strSplit = str.split(', ');
                                return '<span style="color:' + strSplit.shift().split(';')[0] + ';">' + strSplit.join(', ') + '</span>';
                            }else{
                                strSplit = str.split(',');
                                return '<span style="color:' + strSplit.shift().split(';')[0] + ';">' + strSplit.join(',') + '</span>';
                            }
                        }else{
                            return '[color]' + str + '[/color]';
                        }
                    }
                },
                marquee: function(str){
                    return buildMarquee(cleanStr(str));
                },
                glow: function(str, param){
                    if(param){
                        return '<span style="text-shadow:0 0 5px ' + param.split(';')[0].split(' ').join('') + ';">' + str + '</span>';
                    }else{
                        var strComma = str.indexOf(',');
                        var strCommaSpace = str.indexOf(', ');
                        var strSplit = '';
                        if(strComma > -1){
                            if(strCommaSpace === strComma){
                                strSplit = str.split(', ');
                                return '<span style="text-shadow:0 0 5px ' + strSplit.shift().split(';')[0].split(' ').join('') + ';">' + strSplit.join(', ') + '</span>';
                            }else{
                                strSplit = str.split(',');
                                return '<span style="text-shadow:0 0 5px ' + strSplit.shift().split(';')[0].split(' ').join('') + ';">' + strSplit.join(',') + '</span>';
                            }
                        }else{
                            return '[glow]' + str + '[/glow]';
                        }
                    }
                },
                outline: function(str, param){
                    if(param){
                        return '<span style="text-shadow:1px 0 0 ' + param.split(';')[0].split(' ').join('') + ', -1px 0 0 ' + param.split(';')[0].split(' ').join('') + ', 0 1px 0 ' + param.split(';')[0].split(' ').join('') + ', 0 -1px 0 ' + param.split(';')[0].split(' ').join('') + ';">' + str + '</span>';
                    }else{
                        var strComma = str.indexOf(',');
                        var strCommaSpace = str.indexOf(', ');
                        var strSplit = '';
                        if(strComma > -1){
                            if(strCommaSpace === strComma){
                                strSplit = str.split(', ');
                                strShift = strSplit.shift().split(';')[0].split(' ').join('');
                                return '<span style="text-shadow:1px 0 0 ' + strShift + ', -1px 0 0 ' + strShift + ', 0 1px 0 ' + strShift + ', 0 -1px 0 ' + strShift + ';">' + strSplit.join(', ') + '</span>';
                            }else{
                                strSplit = str.split(',');
                                strShift = strSplit.shift().split(';')[0].split(' ').join('');
                                return '<span style="text-shadow:1px 0 0 ' + strShift + ', -1px 0 0 ' + strShift + ', 0 1px 0 ' + strShift + ', 0 -1px 0 ' + strShift + ';">' + strSplit.join(',') + '</span>';
                            }
                        }else{
                            return '[outline]' + str + '[/outline]';
                        }
                    }
                },
                flip: function(str, param){
                    return '<div style="transform:rotate(180deg);display:inline-block;position:relative">' + str + '</div>';
                },
                site: function(str, param){
                    if(str.indexOf('http://') !== 0 && str.indexOf('https://') !== 0 && str.indexOf('/') !== 0){
                        str = 'https://' + encodeURI(str);
                    }
                    return '<div style="position:relative;display:block;width:100%;border:none;background:#FFF;margin-top:-3px;margin-bottom:-3px;border-radius:10px;box-shadow:inset 0 0 5px #000;height:400px;" onclick="if(event.target.tagName.toLowerCase() === \'button\'){this.outerHTML = \'<iframe data-parent-app=\\\'messaging\\\' src=\\\'\' + this.getAttribute(\'data-messaging-site-url\') + \'\\\' style=\\\'\' + this.getAttribute(\'style\') + \'\\\'></iframe>\'}" data-messaging-site-url="' + str + '"><p style="margin-top:188px;text-align:center;"><button>Click to load site:<br>' + str + '</button></p></div>';
                }
            },
            objSafe: {
                img: 0,
                url: 0,
                b: 1,
                i: 1,
                u: 1,
                br: 0,
                hr: 0,
                font: 1,
                color: 1,
                marquee: 1,
                glow: 1,
                outline: 1,
                flip: 1,
                site: 0
            },
            objShort: {
                img: 0,
                url: 0,
                b: 0,
                i: 0,
                u: 0,
                br: 1,
                hr: 1,
                font: 0,
                color: 0,
                marquee: 0,
                glow: 0,
                outline: 0,
                flip: 0,
                site: 0
            },
            objDesc: {
                img: 'Embed an image via URL.',
                url: 'Format your text as a clickable URL.',
                b: 'Format your text as bold.',
                i: 'Format your text as italics.',
                u: 'Format your text as underlined.',
                br: 'Insert a line break.',
                hr: 'Insert a horizontal line.',
                font: 'Format your text with a font.',
                color: 'Format your text with a color.',
                marquee: 'Format your text to scroll as a marquee.',
                glow: 'Format your text with a colorful glow.',
                outline: 'Format your text with an outline.',
                flip: 'Flip your text upside-down.',
                site: 'Embed a website via URL'
            },
            objExamp: {
                img: '[img]https://aaronos.dev/AaronOS/appicons/aOS.png[/img]',
                url: '[url]https://duckduckgo.com[/url]',
                b: '[b]This is bold text.[/b]',
                i: '[i]This is italic text.[/i]',
                u: '[u]This is underlined text.[/u]',
                br: 'Hello[br]World',
                hr: 'Hello[hr]World',
                font: '[font=Comic Sans MS]This text has a custom font.[/font]',
                color: '[color=red]This is red text via name.[/color]<br><br>[color=#00AA00]This is green text via hex.[/color]',
                marquee: '[marquee]This is scrolling marquee text.[/marquee]',
                glow: '[glow=red]This is glowy red text.[/glow]',
                outline: '[outline=red]This is red outlined text.[/outline]',
                flip: '[flip]This is upside-down text.[/flip]',
                site: '[site]https://bing.com[/site]'
            },
            parseBB: function(text, safe){
                var tempIn = text;
                var tempPointer = tempIn.length - 6;
                while(tempPointer >= 0){
                    var nextObj = tempIn.indexOf('[', tempPointer);
                    if(nextObj > -1){
                        var nextEnd = tempIn.indexOf(']', nextObj);
                        if(nextEnd > -1){
                            var nextType = tempIn.toLowerCase().substring(nextObj + 1, nextEnd);
                            var nextParam = 0;
                            if(nextType.indexOf('=') > -1){
                                nextParam = nextType.split('=');
                                nextType = nextParam.shift();
                                nextParam = nextParam.join('=');
                            }
                            if(this.objTypes[nextType]){
                                if(this.objShort[nextType]){
                                    if(!(safe && !this.objSafe[nextType])){
                                        var newStr = this.objTypes[nextType](nextParam);
                                        tempIn = tempIn.substring(0, nextObj) + newStr + tempIn.substring(nextObj + 2 + nextType.length, tempIn.length);
                                    }
                                }else{
                                    var nextClose = tempIn.toLowerCase().indexOf('[/' + nextType + ']', nextEnd);
                                    if(nextClose > -1){
                                        if(!(safe && !this.objSafe[nextType])){
                                            var replaceStr = tempIn.substring(nextEnd + 1, nextClose);
                                            var newStr = this.objTypes[nextType](replaceStr, nextParam);
                                            tempIn = tempIn.substring(0, nextObj) + newStr + tempIn.substring(nextClose + 3 + nextType.length, tempIn.length);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    tempPointer--;
                }
                return tempIn;
            },
            lastRecievedDate: "",
            lastRecievedTime: "",
            nextMessage: function(text){
                m('reading from messaging server');
                if(text[0] === '{'){
                    d(2, 'Recieving message');
                    this.lastResponseText = text;
                    //eval("apps.messaging.vars.lastResponseObject = " + this.lastResponseText);
                    this.lastResponseObject = JSON.parse(this.lastResponseText);
                    this.lastMsgRecieved = this.lastResponseObject.l;
                    this.needsScroll = (getId('MSGdiv').scrollTop + 600 >= getId('MSGdiv').scrollHeight);
                    if(this.lastResponseObject.t){
                        var tempAddStr = "";
                        if(this.lastResponseObject.n !== this.lastUserRecieved){
                            if(this.lastResponseObject.n.indexOf('{ADMIN}') === 0){
                                tempAddStr += '<div style="color:#0A0; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.parseBB(this.lastResponseObject.n, 1) + ' <span style="color:transparent">' + this.lastResponseObject.l + '</span></div>';
                                tempAddStr += '<div style="background-color:#CEA; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
                                if(this.lastResponseObject.t !== this.lastRecievedTime){
                                    tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
                                }
                                if(String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate){
                                    tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
                                }
                                tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
                                getId('MSGdiv').innerHTML += tempAddStr;
                            }else{
                                tempAddStr += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.parseBB(this.lastResponseObject.n, 1) + ' <span style="color:transparent">' + this.lastResponseObject.l + '</span></div>';
                                tempAddStr += '<div style="background-color:#ACE; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
                                if(this.lastResponseObject.t !== this.lastRecievedTime){
                                    tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
                                }
                                if(String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate){
                                    tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
                                }
                                tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
                                getId("MSGdiv").innerHTML += tempAddStr;
                            }
                        }else{
                            getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:2px;"></div>';
                            if(this.lastResponseObject.n.indexOf('{ADMIN}') === 0){
                                tempAddStr += '<div style="background-color:#CEA; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
                                if(this.lastResponseObject.t !== this.lastRecievedTime){
                                    tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
                                }
                                if(String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate){
                                    tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
                                }
                                tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
                                getId("MSGdiv").innerHTML += tempAddStr;
                            }else{
                                tempAddStr += '<div style="background-color:#ACE; position:static; padding-left:3px; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:calc(80% - 3px); margin-left:10%; font-family:sans-serif;">';
                                if(this.lastResponseObject.t !== this.lastRecievedTime){
                                    tempAddStr += '<div style="width:10%;text-align:right;margin-left:-10%;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace">' + String(new Date(this.lastResponseObject.t - 0)).split(' ')[4] + '&nbsp;</div>';
                                }
                                if(String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') !== this.lastRecievedDate){
                                    tempAddStr += '<div style="width:10%;text-align:left;color:#7F7F7F;font-size:12px;font-family:aosProFont,monospace;margin-left:80%;">' + String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ') + '</div>';
                                }
                                tempAddStr += this.parseBB(this.lastResponseObject.c) + '</div>';
                                getId("MSGdiv").innerHTML += tempAddStr;
                            }
                        }
                        this.lastRecievedDate = String(new Date(this.lastResponseObject.t - 0)).split(' ').slice(1, 4).join(' ');
                        this.lastRecievedTime = this.lastResponseObject.t;
                    }else{
                        if(this.lastResponseObject.n !== this.lastUserRecieved){
                            if(this.lastResponseObject.n.indexOf('{ADMIN}') === 0){
                                getId('MSGdiv').innerHTML += '<div style="color:#0A0; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.lastResponseObject.n + '</div>';
                                getId('MSGdiv').innerHTML += '<div style="background-color:#CEA; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
                            }else{
                                getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:20px; font-family:monospace;">&nbsp;' + this.lastResponseObject.n + '</div>';
                                getId('MSGdiv').innerHTML += '<div style="background-color:#ACE; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
                            }
                        }else{
                            getId('MSGdiv').innerHTML += '<div style="color:#777; position:static; width:80%; margin-left:10%; height:2px;"></div>';
                            if(this.lastResponseObject.n.indexOf('{ADMIN}') === 0){
                                getId('MSGdiv').innerHTML += '<div style="background-color:#CEA; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
                            }else{
                                getId('MSGdiv').innerHTML += '<div style="background-color:#ACE; position:static; padding-top:3px; padding-bottom:3px; border-radius:10px; color:#000; width:80%; margin-left:10%; font-family:monospace;">' + this.lastResponseObject.c.split('[IMG]').join('<img style="max-width:100%" src="').split('[/IMG]').join('">') + '</div>';
                            }
                        }
                    }
                    this.lastUserRecieved = this.lastResponseObject.n;
                    if(this.needsScroll){
                        getId('MSGdiv').scrollTop = getId('MSGdiv').scrollHeight;
                    }
                    if(this.canLookethOverThereSound){
                        this.notifMessage.play();
                        this.soundToPlay = 1;
                    }else{
                        if(!document.hasFocus() || getId('win_messaging_top').style.display === 'none'){
                            this.notifPing.play();
                            if(getId('win_messaging_top').style.display === 'none'){
                                apps.prompt.vars.notify(apps.messaging.vars.parseBB(this.lastResponseObject.n, 1) + ' said:<br><br>' + this.parseBB(this.lastResponseObject.c),
                                    ['Show App', 'Dismiss'],
                                    function(btn){
                                        if(btn === 0){
                                            openapp(apps.messaging, 'tskbr');
                                        }
                                    },
                                    'Messaging',
                                    'appicons/ds/MSG.png'
                                );
                            }
                        }
                    }
                    apps.messaging.vars.xhttpDelay = makeTimeout('MSG', 'requestMessage', 'apps.messaging.vars.requestMessage()', 10);
                }else{
                    apps.messaging.vars.xhttpDelay = makeTimeout('MSG', 'requestMessage', 'apps.messaging.vars.requestMessage()', 1000);
                }
            },
            lastResponseTime: 0,
            requestMessage: function(){
                this.xhttp = new XMLHttpRequest();
                this.xhttp.onreadystatechange = function(){
                    if(apps.messaging.vars.xhttp.readyState === 4){
                        apps.savemaster.vars.saving = 0;
                        taskbarShowHardware();
                        if(apps.messaging.vars.xhttp.status === 200){
                            apps.messaging.vars.lastResponseTime = perfCheck('messagingServer');
                            if(apps.messaging.appWindow.appIcon){
                                apps.messaging.vars.nextMessage(apps.messaging.vars.xhttp.responseText);
                            }
                        }else{
                            apps.prompt.vars.notify('Connection to messaging server lost.', [], function(){}, 'Messaging Error', 'appicons/ds/MSG.png');
                            //apps.messaging.vars.xhttpDelay = makeTimeout('MSG', 'requestMessage', 'apps.messaging.vars.requestMessage()', 1000);
                        }
                    }
                };
                this.xhttp.open("GET", "messaging.php?l=" + this.lastMsgRecieved, true);
                perfStart('messagingServer');
                this.xhttp.send();
                apps.savemaster.vars.saving = 3;
                taskbarShowHardware();
            }
        }, 0, "messaging", {
        	backgroundColor: "#303947",
        	foreground: "smarticons/messaging/fg.png",
        	backgroundBorder: {
        		thickness: 2,
        		color: "#252F3A"
        	}
        }
    );
    getId('aOSloadingInfo').innerHTML = 'Camera';
});
c(function(){
    m('init CAM');
    apps.camera = new Application(
        "CAM",
        "Camera",
        1,
        function(launchType){
            if(launchType !== 'tskbr'){
                this.appWindow.dimsSet = function(){
                    getId('CAMvideo').style.width = apps.camera.appWindow.windowH - 6 + 'px';
                    getId('CAMvideo').style.height = apps.camera.appWindow.windowV - 24 + 'px';
                };
                this.appWindow.setCaption('Camera');
                this.appWindow.setContent(
                    '<video id="CAMvideo" width="640" height="480" style="background:none" autoplay></video>' +
                    //'<div onclick="apps.camera.vars.takePic()" style="cursor:url(cursors/pointer.png) 9 3, pointer; width:20px; height:20px; border-radius:10px; bottom:10px; left:310px; background-color:#557"></div>' +
                    '<canvas id="CAMcanvas" width="640" height="480" style="display:none"></canvas>'
                );
                getId('win_camera_html').style.background = 'none';
                try{
                    eval( // this was a necessary evil for IE compatibility. IE crashes the script because of ").catch("
                        "window.navigator.mediaDevices.getUserMedia({'video': true}).then(" +
                            "function(stream){" +
                                "apps.camera.vars.streamObj = stream;" +
                                //getId('CAMvideo').src = window.webkitURL.createObjectURL(stream);
                                "getId('CAMvideo').srcObject = stream;" +
                                "getId('CAMvideo').play();" +
                            "}" +
                        ").catch(" +
                            "function(err){" +
                                "doLog('Error starting camera!', '#F00');" +
                                "doLog(err, '#F00');" +
                            "}" +
                        ");"
                    );
                }catch(err){ // error is expected on IE
                    doLog('Error starting camera!', '#F00');
                    doLog(err, '#F00');
                }
                this.vars.cnv = getId('CAMcanvas');
                this.vars.ctx = this.vars.cnv.getContext('2d');
            }
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setDims("auto", "auto", 643, 502);
            }
            blockScreensaver("apps.camera");
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    unblockScreensaver("apps.camera", 1);
                    try{
                        getId('CAMvideo').pause();
                        getId('CAMvideo').src = "";
                        this.vars.streamObj.getTracks()[0].stop();
                    }catch(e){
                        apps.prompt.vars.notify('Error stopping camera<br><br>' + e, [], function(){}, 'Camera Error', 'appicons/ds/CAM.png')
                    }
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    unblockScreensaver("apps.camera", 1)
                    try{
                        getId('CAMvideo').pause();
                        getId('CAMvideo').src = "";
                        this.vars.streamObj.getTracks()[0].stop();
                    }catch(e){
                        apps.prompt.vars.notify('Error stopping camera. Your camera may still be running.<br><br>' + e, [], function(){}, 'Camera Error', 'appicons/ds/CAM.png')
                    }
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'Very simple camera app, purely meant for testing wether your browser can see through your webcam or not.',
            cnv: null,
            ctx: null,
            streamObj: {},
            lastImage: {},
            takePic: function(){
                this.ctx.drawImage(getId('CAMvideo'), 0, 0, getId('CAMcanvas').width, getId('CAMcanvas').height);
                this.lastImage = this.ctx.getImageData(0, 0, getId('CAMcanvas').width, getId('CAMcanvas').height);
            }
        }, 1, "camera", "appicons/ds/CAM.png"
    );
    getId('aOSloadingInfo').innerHTML = 'Music Player';
});
c(function(){
    m('init MSC');
    apps.musicPlayer = new Application(
        'MPl',
        'Music Player',
        0,
        function(){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setContent('<iframe data-parent-app="musicPlayer" id="MPlframe" onload="apps.musicPlayer.vars.updateStyle()" style="border:none; display:block; width:100%; height:100%; overflow:hidden;" src="music/"></iframe>');
                requestAnimationFrame(this.vars.colorWindows);
                getId("icn_musicPlayer").style.display = "inline-block";
                requestAnimationFrame(() => {
                    this.appWindow.appIcon = 1;
                    this.vars.colorWindows();
                });
            }
            this.appWindow.setCaption('Music Player');
            this.appWindow.setDims("auto", "auto", 1038, 626);
            blockScreensaver("apps.musicVis");
            if(this.appWindow.appIcon){
                this.appWindow.openWindow();
            }
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'This is the official AaronOS Music Player. Select a folder of songs to loop through.',
            updateStyle: function(){
                //getId("MPlframe").contentWindow.postMessage({dark: darkMode, style: getId("aosCustomStyle").innerHTML}, "https://aaron-os-mineandcraft12.c9.io");
            },
            colorModified: 0,
            colorWindows: function(){
                if(apps.musicPlayer.appWindow.appIcon){
                    var MPlTitle = getId("MPlframe").contentDocument.title;
                    if(MPlTitle.indexOf("WindowRecolor:") === 0){
                        apps.settings.vars.setWinColor(1, MPlTitle.split(":")[1]);
                        if(!this.colorModified){
                            this.colorModified = 1;
                        }
                    }else if(this.colorModified){
                        apps.settings.vars.setWinColor(1, ufload("aos_system/windows/border_color") || 'rgba(150, 150, 200, 0.5)');
                        this.colorModified = 0;
                    }
                    requestAnimationFrame(apps.musicPlayer.vars.colorWindows);
                }else if(this.colorModified){
                    apps.settings.vars.setWinColor(1, ufload("aos_system/windows/border_color") || 'rgba(150, 150, 200, 0.5)');
                    this.colorModified = 0;
                }
            }
        }, 0, 'musicPlayer', {
            backgroundColor: "#303947",
            foreground: "smarticons/musicPlayer/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    getId('aOSloadingInfo').innerHTML = 'Apps Browser';
});
c(function(){
    apps.appsbrowser = new Application(
        'APB',
        'Apps Browser',
        0,
        function(){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setDims("auto", "auto", 400, 500);
                this.appWindow.setCaption('Apps Browser');
                this.appWindow.setContent(
                    '<div id="APBdiv" class="darkResponsive" style="width:100%;height:100%;overflow-y:auto;font-family:aosProFont;">' +
                    '<div style="overflow-y:auto;font-size:12px;width:100%;height:40px;border-bottom:1px solid;">' +
                    'This is a list of every app installed on your system. ' +
                    'Certain apps in this list may not be available from the Dashboard; these are usually system apps.' +
                    '</div></div>');
                this.vars.appsListed = 1;
                for(var appHandle in appsSorted){
                    var app = appsSorted[appHandle];
                    this.vars.currAppImg = apps[app].appWindow.appImg;
                    this.vars.currAppIcon = apps[app].dsktpIcon;
                    this.vars.currAppName = apps[app].appDesc;
                    if(apps[app].keepOffDesktop === 0){
                        this.vars.currAppDesktop = 'Available On Desktop';
                    }else{
                        this.vars.currAppDesktop = 'Not On Desktop';
                    }
                    if(apps[app].keepOffDesktop < 2){
                        this.vars.currAppOnList = 'Available In Apps List';
                    }else{
                        this.vars.currAppOnList = 'Not In Apps List';
                    }
                    if(apps[app].appWindow.onTop){
                        this.vars.currAppOnTop = 'Always On Top<br>';
                    }else{
                        this.vars.currAppOnTop = '';
                    }
                    if(ufload('aos_system/apm_apps/app_' + app)){
                        this.vars.currAppBuiltIn = 'User-Made App';
                    }else if(ufload('aos_system/wap_apps/' + app)){
                        this.vars.currAppBuiltIn = 'User-Made Web App';
                    }else if(app.indexOf('webApp_') === 0){
                        this.vars.currAppBuiltIn = 'Repository App from<br>' + app.substring(7).split('__')[0];
                    }else{
                        this.vars.currAppBuiltIn = 'Built-In aOS App';
                    }
                    //getId("APBdiv").innerHTML += '<div class="appsBrowserItem cursorPointer" onclick="c(function(){openapp(apps.' + app + ', \'dsktp\')});" style="top:' + this.vars.appsListed * /*101*/129 + 'px;height:128px;width:100%;border-bottom:1px solid ' + darkSwitch('#000', '#FFF') + ';"><img style="height:128px;width:128px;" src="' + this.vars.currAppImg + '" onerror="this.src=\'appicons/ds/redx.png\'"><div style="font-size:24px;left:132px;bottom:66px;">' + this.vars.currAppIcon + '</div><div style="left:132px;top:66px;font-size:12px;">' + this.vars.currAppName + '</div><div style="color:' + darkSwitch('#555', '#AAA') + ';left:132px;top:4px;font-size:12px;text-align:right">apps.' + app + '</div><div style="color:' + darkSwitch('#555', '#AAA') + ';font-size:12px;right:4px;bottom:4px;text-align:right">' + this.vars.currAppOnTop + this.vars.currAppDesktop + '<br>' + this.vars.currAppOnList + '<br>' + this.vars.currAppBuiltIn + '</div><div style="color:' + darkSwitch('#555', '#AAA') + ';font-size:12px;left:132px;bottom:4px;">' + this.vars.currAppLaunchTypes + '</div></div>';
                    
                    getId("APBdiv").innerHTML += '<div class="appsBrowserItem cursorPointer darkResponsive" onclick="c(function(){openapp(apps.' + app + ', \'dsktp\')});" style="top:' + (this.vars.appsListed * 129 - 88) + 'px;height:128px;width:100%;border-bottom:1px solid;">' + buildSmartIcon(128, this.vars.currAppImg) +
                        //'<div style="font-size:24px;left:132px;bottom:66px;">' + this.vars.currAppIcon + '</div>' +
                        //'<div style="left:132px;top:66px;font-size:12px;">' + this.vars.currAppName + '</div>' +
                        '<div style="font-size:24px;left:132px;top:calc(66px - 1em);">' + this.vars.currAppName + '</div>' +
                        '<div class="darkResponsive" style="opacity:0.75;background:none;left:132px;top:4px;font-size:12px;text-align:right">apps.' + app + '</div>' +
                        '<div class="darkResponsive" style="opacity:0.75;background:none;font-size:12px;right:4px;bottom:4px;text-align:right">' + this.vars.currAppBuiltIn + '</div>' +
                        '<div class="darkResponsive"style="opacity:0.75;background:none;font-size:12px;left:132px;bottom:4px;">' + this.vars.currAppIcon + '</div></div>';

                    getId("APBdiv").innerHTML += '<button style="position:absolute;right:0px;top:' + (this.vars.appsListed * 129 - 88) + 'px;font-size:12px;" ' +
                        'onclick="c(function(){ctxMenu([[event.pageX, event.pageY, \'ctxMenu/beta/window.png\', \'ctxMenu/beta/window.png\', \'ctxMenu/beta/file.png\', \'ctxMenu/beta/folder.png\', \'ctxMenu/beta/file.png\'], ' +
                        '\' Open App\', \'c(function(){openapp(apps.' + app + ', \\\'dsktp\\\')})\', ' +
                        '\' Open App via Taskbar\', \'c(function(){openapp(apps.' + app + ', \\\'tskbr\\\')})\', ' +
                        '\'+About This App\', \'c(function(){openapp(apps.appInfo, \\\'' + app + '\\\')})\',  ' +
                        '\' View Files\', \'c(function(){openapp(apps.files2, \\\'dsktp\\\');c(function(){apps.files2.vars.next(\\\'apps/\\\');apps.files2.vars.next(\\\'' + app + '/\\\')})})\'' +
                        function(appname, builtin){
                            if(builtin === "User-Made App"){
                                return ', \' Open Source File\', \'c(function(){openapp(apps.notepad2, \\\'open\\\');apps.notepad2.vars.openFile(\\\'aos_system/apm_apps/app_' + appname + '\\\')})\'';
                            }else if(builtin === "User-Made Web App"){
                                return ', \' Open Source File\', \'c(function(){openapp(apps.notepad2, \\\'open\\\');apps.notepad2.vars.openFile(\\\'aos_system/wap_apps/' + appname + '\\\')})\'';
                            }else{
                                return ''
                            }
                        }(app, this.vars.currAppBuiltIn) + '])})">v</button>';
                    
                    this.vars.appsListed++;
                }
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'Use this app to browse through every app installed on the aOS system, including internal system apps.',
            appsListed: 1,
            currAppImg: '',
            currAppIcon: '',
            currAppName: '',
            currAppDesktop: '',
            currAppOnList: '',
            currAppLaunchTypes: '',
            currAppBuiltIn: ''
        }, 1, 'appsbrowser', 'appicons/ds/APB.png'
    );
    getId('aOSloadingInfo').innerHTML = 'Sticky Note';
});
c(function(){
    apps.postit = new Application(
        'SNt',
        'Sticky Note',
        0,
        function(){
            this.appWindow.setCaption('Sticky Note');
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setDims(parseInt(getId("desktop").style.width) - 210, 10, 200, 200);
                this.appWindow.setContent('<textarea id="stickyNotePad" onblur="apps.postit.vars.savePost()" style="padding:0;color:#000;font-family:Comic Sans MS;font-weight:bold;border:none;resize:none;display:block;width:100%;height:100%;background-color:#FF7;"></textarea>');
                if(ufload("aos_system/apps/postit/saved_note")){
                    getId('stickyNotePad').value = ufload("aos_system/apps/postit/saved_note");
                }
                this.appWindow.alwaysOnTop(1);
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    //apps.savemaster.vars.save('aos_system/apps/postit/saved_note', getId('stickyNotePad').value, 1);
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    this.appWindow.alwaysOnTop(1);
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'Simple stickynote that stays above other apps on your screen. The contents are saved across reboots.',
            savePost: function(){
                if(apps.postit.appWindow.appIcon){
                    apps.savemaster.vars.save('aos_system/apps/postit/saved_note', getId('stickyNotePad').value, 1);
                }
            }
        }, 1, 'postit', {
            backgroundColor: "#303947",
            foreground: "smarticons/postit/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    getId('aOSloadingInfo').innerHTML = 'Bootscript App';
});
c(function(){
    apps.bootScript = new Application(
        'BtS',
        'Boot Scripts',
        0,
        function(){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setDims("auto", "auto", 701, 400);
                this.appWindow.setCaption('Boot Scripts');
                this.appWindow.setContent(
                    '<div id="BtS_scripts" style="width:40%;overflow-y:scroll;height:calc(100% - 2em + 8px)"></div>' +
                    '<textarea id="BtStextarea" style="font-family:aosProFont, monospace;font-size:12px;position:absolute;right:0;padding:0;border:none;width:calc(60% - 3px);padding-left:3px;height:calc(100% - 2em);resize:none;"></textarea>' +
                    '<div style="bottom:0;width:100%;">' +
                    '<button style="position:relative;width:40%;height:calc(2em - 3px);" onclick="apps.bootScript.vars.newScript()">New Script</button>' +
                    '<button style="float:right;width:30%;height:calc(2em - 3px);" onclick="apps.bootScript.vars.saveBootScript()">Save</button>' +
                    '<button style="float:right;width:30%;height:calc(2em - 3px);" onclick="apps.bootScript.vars.helpBootScript()">Help</button>' +
                    '</div>'
                );
                this.vars.listScripts();
                this.vars.openScript('main');
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    if(!safeMode){
                        window.setTimeout(apps.bootScript.vars.doBootScript, 1);
                    }else{
                        doLog('Refusing to run BootScripts because SafeMode is on.', "#F00");
                    }
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'This app runs your own custom JavaScript code just after aOS boots, just before the loading screen disappears. Any JS code will work here - mod aOS to your heart\'s content!<br><br>If you created something you would wish to be featured in aOS, please tell the developer so he can take a look!',
            bootScriptsToEvaluate: {
                repo: {

                },
                user: {

                }
            },
            doBootScript: function(){
                for(var i in installedPackages){
                    for(var j in installedPackages[i]){
                        if(installedPackages[i][j].appType === "bootscript"){
                            try{
                                apps.bootScript.vars.bootScriptsToEvaluate.repo[i + "_" + j] = {BOOT_SCRIPT_CODE: new Function(installedPackages[i][j].scriptContent)};
                                apps.bootScript.vars.bootScriptsToEvaluate.repo[i + "_" + j].BOOT_SCRIPT_CODE();
                            }catch(err){
                                doLog("aOS Hub Boot Script Error<br>Script: " + i + "." + j + "<br>" + err, "#F00");
                                apps.prompt.vars.notify(
                                    "There was an error in one of your aOS Hub Boot Scripts (" + (i + "." + j) + "):<br><br>" + err,
                                    ["Dismiss", "View in aOS Hub"],
                                    function(btn){
                                        if(btn === 1){
                                            openapp(apps.appCenter, "dsktp");
                                            apps.appCenter.vars.doSearch(i + "." + j);
                                        }
                                    },
                                    "Boot Script Error",
                                    "appicons/ds/BtS.png"
                                );
                            }
                        }
                    }
                }
                if(ufload("aos_system/user_boot_script")){
                    doLog("moving user bootscript to new folder");
                    var theBootScript = ufload("aos_system/user_boot_script");
                    ufsave("aos_system/apps/bootScript/main", theBootScript);
                    ufdel("aos_system/user_boot_script");
                }
                var bootScripts = ufload("aos_system/apps/bootScript");
                for(var i in bootScripts){
                    try{
                        apps.bootScript.vars.bootScriptsToEvaluate.user[i] = {BOOT_SCRIPT_CODE: new Function(bootScripts[i])};
                        apps.bootScript.vars.bootScriptsToEvaluate.user[i].BOOT_SCRIPT_CODE();
                    }catch(err){
                        doLog("Boot Script Error<br>Script: " + i + "<br>" + err, "#F00");
                        apps.prompt.vars.notify(
                            "There was an error in one of your Boot Scripts (" + i + "):<br><br>" + err,
                            ["Dismiss", "Debug"],
                            function(btn){
                                if(btn === 1){
                                    openapp(apps.jsConsole, "dsktp");
                                    openapp(apps.bootScript, "dsktp");
                                    apps.bootScript.vars.openScript(i);
                                }
                            },
                            "Boot Script Error",
                            "appicons/ds/BtS.png"
                        );
                    }
                }
            },
            currScript: 'main',
            openScript: function(scriptName){
                this.currScript = scriptName;
                var allScripts = document.getElementsByClassName('BtS_script');
                for(var i = 0; i < allScripts.length; i++){
                    allScripts[i].style.color = '';
                }
                if(ufload("aos_system/apps/bootScript/" + scriptName)){
                    getId("BtStextarea").value = ufload("aos_system/apps/bootScript/" + scriptName);
                }
                getId("BtS_script_" + scriptName).style.color = "#0AA";
            },
            newScript: function(){
                apps.prompt.vars.prompt("Please enter a name for the new script.<br><br>Leave blank to cancel.", "Submit", function(str){
                    if(str){
                        if(!ufload("aos_system/apps/bootScript").hasOwnProperty(cleanStr(str))){
                            apps.bootScript.vars.createScript(str);
                        }else{
                            apps.prompt.vars.alert("There is already a boot script with that name.", "Okay", function(){}, "Boot Scripts");
                        }
                    }
                }, "Boot Scripts");
            },
            createScript: function(name){
                ufsave("aos_system/apps/bootScript/" + cleanStr(name), "// AaronOS Boot Script");
                this.listScripts();
                this.openScript(cleanStr(name));
            },
            delScript: function(name){
                ufdel("aos_system/apps/bootScript/" + name);
                this.listScripts();
                this.openScript("main");
            },
            listScripts: function(){
                var allScripts = ufload("aos_system/apps/bootScript");
                var finalHTML = "<br>";
                finalHTML += "<span class='BtS_script' id='BtS_script_main'>main</span> <button onclick='apps.bootScript.vars.openScript(\"main\")'>Load</button>";
                for(var i in allScripts){
                    if(i !== "main"){
                        finalHTML += "<br><br><span class='BtS_script' id='BtS_script_" + i + "'>" + i + "</span> <button onclick='apps.bootScript.vars.openScript(\"" + i + "\")'>Load</button> <button onclick='apps.bootScript.vars.delScript(\"" + i + "\")'>Delete</button>";
                    }
                }
                console.log(finalHTML);
                getId("BtS_scripts").innerHTML = finalHTML;
            },
            saveBootScript: function(){
                ufsave('aos_system/apps/bootScript/' + this.currScript, getId('BtStextarea').value);
                // apps.prompt.vars.alert('Saved.', 'Okay', function(){}, 'Boot Script');
            },
            helpBootScript: function(){
                apps.prompt.vars.alert('WARNING - ADVANCED USERS ONLY<br>The Bootscript is your very own script to run on OS boot. Use it for useful things like... well, I can\'t think of anything. Here you are though.<br><br>BootScript will run your script one millisecond after the OS finishes loading your userfiles.<br><br>Save all variables for your script inside the \'this\' object. Example... this.myVar = 9000.1;<br><br>Bootscripts are written in JavaScript. Use the aOS API and assume that your script lives inside of an app\'s vars... (<b>apps.theoreticalApp.vars</b> <-- your script theoretically here) Check the aOS API doc for reference to what this means.<br><br>Your bootscript is NOT AN APP and has no window. Trying to call anything within this.appWindow WILL result in an error!', 'Okay, thanks.', function(){}, 'Boot Script');
            }
        }, 1, 'bootScript', 'appicons/ds/BtS.png'
    );
    getId('aOSloadingInfo').innerHTML = 'Custom Style Editor';
});
c(function(){
    apps.styleEditor = new Application(
        'CSE',
        'Custom Style Editor',
        0,
        function(){
            if(!this.appWindow.appIcon){
                if(styleEditorTemplateMode){
                    this.appWindow.setDims("auto", "auto", 400, 500);
                    this.appWindow.setCaption("CSE Preview");
                    this.appWindow.setContent(
                        '<h1>Header</h1><p>Paragraph</p><hr><input placeholder="Input"> <button>Button</button><br><input type="checkbox"> <input type="checkbox" checked="checked"> <input type="radio"> <input type="radio" checked="checked"><br><textarea>Text Area</textarea>' +
                        '<hr>Hovered Element:<br>' +
                        '<span class="liveElement" style="font-family:monospace" data-live-eval="apps.styleEditor.vars.templateType">none</span><br>' +
                        '<span class="liveElement" style="font-family:monospace" data-live-eval="apps.styleEditor.vars.templateID">none</span><br>' +
                        '<span class="liveElement" style="font-family:monospace" data-live-eval="apps.styleEditor.vars.templateClass">none</span>');
                    apps.prompt.vars.notify("Test Notification", ["Dismiss"], function(){}, "Style Editor", "appicons/ds/CSE.png");
                    window.addEventListener("mousemove", apps.styleEditor.vars.templateCheck);
                }else{
                    this.appWindow.paddingMode(0);
                    this.appWindow.setDims("auto", "auto", 400, 400);
                    this.appWindow.toggleFullscreen();
                    this.appWindow.setCaption('Custom Style Editor');
                    this.appWindow.setContent('<textarea id="CSEtextarea" style="font-family:aosProFont, monospace;font-size:12px;padding:0;border:none;width:50%;height:90%;resize:none;" onkeyup="try{apps.styleEditor.vars.updateFrame()}catch(e){}"></textarea><iframe data-parent-app="styleEditor" src="aosBeta.php?styletemplate=true&nofiles=true" style="position:absolute;right:0;top:0;border:none;display:block;width:50%;height:90%" id="CSEframe" onload="apps.styleEditor.vars.updateFrame()"></iframe><button style="position:absolute;bottom:0;left:0;width:50%;height:10%;" onclick="apps.styleEditor.vars.saveStyleEditor()">Save</button><button style="position:absolute;bottom:0;right:0;width:50%;height:10%;" onclick="apps.styleEditor.vars.helpStyleEditor()">Help</button>');
                    if(ufload("aos_system/user_custom_style")){
                        getId('CSEtextarea').innerHTML = ufload("aos_system/user_custom_style");
                        //this.vars.updateFrame();
                    }
                }
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    if(styleEditorTemplateMode){
                        openapp(apps.styleEditor, "dsktp");
                        setTimeout(function(){toTop(apps.styleEditor);}, 1000);
                    }
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'Create your own custom CSS stylesheet for aOS! It is embedded as an actual stylesheet, placed such that it overrides the default styles.<br><br>If you create something you want to be featured in aOS, please tell the developer so he can take a look!',
            saveStyleEditor: function(){
                apps.savemaster.vars.save('aos_system/user_custom_style', getId('CSEtextarea').value, 1);
                getId('aosCustomStyle').innerHTML = ufload("aos_system/user_custom_style");
            },
            helpStyleEditor: function(){
                apps.prompt.vars.alert('WARNING - ADVANCED USERS ONLY<br>The Custom Stylesheet is your very own set of styling rules for aOS. Use it to style aOS to your whim - theoretically, every element of the OS can be customized with this file.<br><br>You can check out style.css for the default stylesheet, and use your browser\'s developer tools to get easier access to elements as they are shown on-screen.', 'Okay, thanks.', function(){}, 'Boot Script');
            },
            updateFrame: function(){
                // iframe is called CSEframe
                getId('CSEframe').contentDocument.getElementById('aosCustomStyle').innerHTML = getId('CSEtextarea').value;
            },
            templateCheck: function(event){
                var elem = document.elementFromPoint(event.pageX, event.pageY);
                if(elem.tagName){
                    apps.styleEditor.vars.templateType = '&lt;' + elem.tagName.toLowerCase() + '&gt;';
                    var elemRect = elem.getBoundingClientRect();
                    getId("windowFrameOverlay").style.display = "block";
                    getId("windowFrameOverlay").style.left = elemRect.left + "px";
                    getId("windowFrameOverlay").style.top = elemRect.top + "px";
                    getId("windowFrameOverlay").style.width = elemRect.width + "px";
                    getId("windowFrameOverlay").style.height = elemRect.height + "px";
                }else{
                    apps.styleEditor.vars.templateType = 'no element';
                }
                if(elem.id){
                    apps.styleEditor.vars.templateID = '#' + elem.id;
                }else{
                    apps.styleEditor.vars.templateID = 'no ID';
                }
                if(elem.classList.length > 0){
                    var allClasses = elem.classList;
                    apps.styleEditor.vars.templateClass = '';
                    for(var i = 0; i < allClasses.length; i++){
                        apps.styleEditor.vars.templateClass += '.' + allClasses[i] + '<br>';
                    }
                }else{
                    apps.styleEditor.vars.templateClass = 'no class';
                }
            },
            templateType: 'no element',
            templateID: 'no ID',
            templateClass: 'no Class'
        }, 1, 'styleEditor', 'appicons/ds/CSE.png'
    );
    getId('aOSloadingInfo').innerHTML = 'Function Grapher';
});
c(function(){
    apps.graph = new Application(
        'Gph',
        'Function Grapher',
        0,
        function(){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setDims("auto", "auto", 406, 524);
                this.appWindow.setCaption('Function Grapher');
                this.appWindow.setContent('<canvas width="400" height="400" style="width:400px;height:400px;position:absolute;border:none;" id="GphGraph"></canvas><div id="GphControls" style="white-space:nowrap;width:400px;height:99px;border-top:1px solid #000;bottom:0;font-family:monospace;overflow:auto;"></div>');
                getId('GphControls').innerHTML = '&nbsp;f(x) = <input id="GphInput"><br>xStep = <input id="GphStep" value="0.05" size="6"> (must be &gt; 0.005)<br>Color = <input id="GphColor" value="' + darkSwitch('#000', '#FFF') + '"><br><button onclick="apps.graph.vars.graph()">Graph</button><br>Calculate at X: <input id="GphCalc" size="5"> <button onclick="apps.graph.vars.calculate()">Calculate</button><hr><span id="GphStatus"></span>';
                this.vars.cnv = getId('GphGraph');
                this.vars.ctx = this.vars.cnv.getContext('2d');
                this.vars.ctx.strokeStyle = darkSwitch('#CCC', '#333');
                for(var i = 0; i < 400; i += 20){
                    if(i !== 200){
                        this.vars.ctx.beginPath();
                        this.vars.ctx.moveTo(i + 0.5, 0);
                        this.vars.ctx.lineTo(i + 0.5, 400);
                        this.vars.ctx.stroke();
                        this.vars.ctx.beginPath();
                        this.vars.ctx.moveTo(0.5, i + 0.5);
                        this.vars.ctx.lineTo(400.5, i + 0.5);
                        this.vars.ctx.stroke();
                    }
                }
                this.vars.ctx.strokeStyle = '#555';
                this.vars.ctx.beginPath();
                this.vars.ctx.moveTo(0.5, 200.5);
                this.vars.ctx.lineTo(400.5, 200.5);
                this.vars.ctx.stroke();
                this.vars.ctx.beginPath();
                this.vars.ctx.moveTo(200.5, 0);
                this.vars.ctx.lineTo(200.5, 400);
                this.vars.ctx.stroke();
                this.vars.ctx.beginPath();
                this.vars.ctx.strokeStyle = darkSwitch('#000', '#FFF');
                this.vars.ctx.strokeWidth = '1';
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'A very simple function grapher for aOS. The "window" size is from -10 to 10 on the X and Y axis. Keep in mind that the math uses JAVASCRIPT NOTATION!',
            cnv: {},
            ctx: {},
            getBreak: function(type){
                switch(String(type)){
                    case 'NaN':
                        return 'y is NaN';
                    case 'Infinity':
                        return 'Divide by Zero';
                    case '-Infinity':
                        return 'Divide by Zero';
                    default:
                        return 'Unknown Error';
                }
            },
            currY: 0,
            lastY: 0,
            currFunc: '',
            failed: 0,
            notifBitwise: 0,
            graph: function(){
                this.currFunc = getId('GphInput').value;
                this.currColor = getId('GphColor').value;
                this.currStep = parseFloat(getId('GphStep').value);
                this.ctx.strokeStyle = this.currColor;
                this.ctx.beginPath();
                this.failed = 1;
                getId('GphStatus').innerHTML += '<span style="background-color:' + this.currColor + '">&nbsp;</span><span style="background-color:#00F">&nbsp;</span> f(x) = ' + this.currFunc + '<br>';
                if(this.currStep <= 0.005 || isNaN(this.currStep)){
                    getId('GphStatus').innerHTML += '<span style="background-color:' + this.currColor + '">&nbsp;</span><span style="background-color:#F00">&nbsp;</span> xStep ' + this.currStep + ' invalid, using 0.05<br>';
                    this.currStep = 0.05;
                }else{
                    getId('GphStatus').innerHTML += '<span style="background-color:' + this.currColor + '">&nbsp;</span><span style="background-color:#00F">&nbsp;</span> xStep ' + this.currStep + '<br>';
                }
                if(!this.notifBitwise && this.currFunc.indexOf('^') > -1){
                    apps.prompt.vars.notify("Warning; the ^ symbol is the BITWISE-XOR operator.<br>If you wish to use exponents, instead use pow(x, e)", ["Okay"], function(){}, "Function Grapher", "appicons/ds/Gph.png");
                    this.notifBitwise = 1;
                }
                for(var x = -10; x <= 10; x = Math.round((x + this.currStep) * 100) / 100){
                    try{
                        with(Math){ this.currY = eval(this.currFunc) };
                        if(isNaN(this.currY) || this.currY === Infinity || this.currY === -Infinity){
                            if(!this.failed){
                                this.failed = 1;
                                this.ctx.stroke();
                                this.ctx.beginPath();
                                getId('GphStatus').innerHTML += '<span style="background-color:' + this.currColor + '">&nbsp;</span><span style="background-color:#F00">&nbsp;</span> Break at ' + x + ' : ' + this.getBreak(this.currY) + '<br>';
                            }
                        }else{
                            if(this.failed){
                                //this.lastY = eval(this.currFunc);
                                this.failed = 0;
                                with(Math){ this.ctx.moveTo((x + 10) * 20 + 0.5, 400 - (eval(this.currFunc) * 20)); }
                                if(x !== -10){
                                    getId('GphStatus').innerHTML += '<span style="background-color:' + this.currColor + '">&nbsp;</span><span style="background-color:#0F0">&nbsp;</span> Start at ' + x + '<br>';
                                }
                            }
                            this.ctx.lineTo((x + 10) * 20 + 0.5, 400 - (this.currY + 10) * 20);
                        }
                    }catch(err){
                        getId('GphStatus').innerHTML += '<span style="background-color:' + this.currColor + '">&nbsp;</span><span style="background-color:#F00">&nbsp;</span> Break at ' + x + ' : ' + err + '<br>';
                        break;
                    }
                }
                this.ctx.stroke();
            },
            calculate: function(){
                this.currFunc = getId('GphInput').value;
                this.currColor = getId('GphColor').value;
                this.currX = getId('GphCalc').value;
                this.ctx.strokeStyle = this.currColor;
                getId('GphStatus').innerHTML += '<span style="background-color:' + this.currColor + '">&nbsp;</span><span style="background-color:#7F00FF">&nbsp;</span> f(x) = ' + this.currFunc + '<br>';
                if(!this.notifBitwise && this.currFunc.indexOf('^') > -1){
                    apps.prompt.vars.notify("Warning; the ^ symbol is the BITWISE-XOR operator.<br>If you wish to use exponents, instead use pow(x, e)", ["Okay"], function(){}, "Function Grapher", "appicons/ds/Gph.png");
                    this.notifBitwise = 1;
                }
                try{
                    var x = parseFloat(this.currX);
                    with(Math){ this.currY = eval(this.currFunc) };
                    if(isNaN(this.currY) || this.currY === Infinity || this.currY === -Infinity){
                        getId('GphStatus').innerHTML += '<span style="background-color:' + this.currColor + '">&nbsp;</span><span style="background-color:#F00">&nbsp;</span> Break at f(' + x + ') : ' + this.getBreak(this.currY) + '<br>';
                    }else{
                        getId('GphStatus').innerHTML += '<span style="background-color:' + this.currColor + '">&nbsp;</span><span style="background-color:#7F00FF">&nbsp;</span> f(' + x + ') = ' + this.currY + '<br>';
                        this.ctx.strokeRect(Math.floor((x + 10) * 20) - 1.5, Math.round(400 - (this.currY + 10) * 20) - 1.5, 4, 4);
                    }
                }catch(err){
                    getId('GphStatus').innerHTML += '<span style="background-color:' + this.currColor + '">&nbsp;</span><span style="background-color:#F00">&nbsp;</span> Break at f(' + x + ') : ' + err + '<br>';
                }
            }
        }, 1, 'graph', 'appicons/ds/Gph.png'
    );
    getId('aOSloadingInfo').innerHTML = 'Magnifier';
});
c(function(){
    apps.magnifier = new Application(
        'Mag',
        'Magnifier',
        0,
        function(){
            if(!this.appWindow.appIcon){
                this.appWindow.setDims(10, 10, 300, 100);
                this.appWindow.setCaption('Magnifier');
                this.appWindow.setContent(
                    '<button onclick="apps.magnifier.vars.startMag(event)">Start</button>' +
                    '<button onclick="apps.magnifier.vars.endMag()">Stop</button><br>' +
                    'Zoom: <input id="MAGpercent" value="2" size="3"><br>' +
                    '<button onclick="apps.magnifier.vars.setMag()">Set Zoom</button>')
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'Magnify the aOS screen to make it easier to see with visual impairments or HiDPI monitors.',
            running: 0,
            currMag: 2,
            startMag: function(event){
                if(!this.running){
                    document.body.style.overflow = 'hidden';
                    document.body.style.transform = 'scale(' + this.currMag + ')';
                    document.body.style.transformOrigin = event.pageX + 'px ' + event.pageY + 'px';
                    document.body.addEventListener('mousemove', apps.magnifier.vars.setOrigin);
                    this.running = 1;
                }
            },
            endMag: function(){
                if(this.running){
                    document.body.style.overflow = '';
                    document.body.style.transform = '';
                    document.body.style.transformOrigin = '';
                    document.body.removeEventListener('mousemove', apps.magnifier.vars.setOrigin);
                    this.running = 0;
                }
            },
            setMag: function(){
                this.currMag = parseFloat(getId('MAGpercent').value);
                if(this.running){
                    document.body.style.transform = 'scale(' + this.currMag + ')';
                }
            },
            setOrigin: function(event){
                //getId('monitor').style.transform = 'scale(' + this.currMag + ')';
                document.body.style.transformOrigin = event.pageX + 'px ' + event.pageY + 'px';
            }
        }, 1, "magnifier", 'appicons/ds/Mag.png'
    );
    getId('aOSloadingInfo').innerHTML = 'iFrame Browser';
});
c(function(){
    apps.iFrameBrowser = new Application(
        'iFB',
        'iFrame Browser',
        0,
        function(){
            if(!this.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setDims("auto", "auto", 800, 600);
                this.appWindow.setCaption('iFrame Browser');
                this.appWindow.setContent('<div style="font-family:aosProFont, Courier, monospace; font-size:12px;height:25px;border-bottom:1px solid #000; width:100%">' +
                '<input id="iFBinput" placeholder="https://" style="width:75%;"> <button onclick="apps.iFrameBrowser.vars.go(getId(\'iFBinput\').value)">Go</button>' +
                '</div>' +
                '<iframe data-parent-app="iFrameBrowser" id="iFBframe" src="ifbHomepage.php" style="border:none; width:100%; height:calc(100% - 26px); margin-top:26px; display:block;"></iframe>');
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'The iFrame Browser is a placeholder app to view a webpage in an iframe within an app. This app is not a full web browser. If aOS is loaded over HTTPS, you won\'t be able to view HTTP sites here. Many sites block iFrames.',
            go: function(url){
                getId("iFBframe").src = url || "ifbHomepage.php";
            }
        }, 2, 'iFrameBrowser', 'appicons/ds/systemApp.png'
    );
    getId('aOSloadingInfo').innerHTML = 'Pet Cursors';
});
c(function(){
    apps.petCursors = new Application(
        'PC',
        'Pet Cursors',
        0,
        function(){
            if(!this.appIcon){
                getId('win_petCursors_html').style.overflowY = 'auto';
                this.appWindow.setDims("auto", "auto", 800, 500);
                this.appWindow.setCaption('Pet Cursors');
                this.appWindow.setContent(
                    '<p>Use this app to make extra cursor "pets" that follow your mouse around the screen like, well, pets.</p>' +
                    '<hr>' +
                    'Use this button to turn the app on and off: <button onclick="apps.petCursors.vars.toggleApp()">Toggle</button><br><br>' +
                    'Add new cursors:' +
                    '<br><span id="petCursorsPresets"></span>' +
                    'Your cursors:' +
                    '<br><button onclick="apps.petCursors.vars.deleteAll()">Delete All</button>' +
                    '<br><ol id="petCursorsList"></ol>'
                );
                this.vars.buildPresetList();
                this.vars.buildCursorList();
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    if(ufload("aos_system/apps/petCursors/cursors")){
                        try{
                            this.vars.cursors = JSON.parse(ufload("aos_system/apps/petCursors/cursors"));
                        }catch(err){
                            doLog('Pet Cursors save file is corrupt!', '#F00');
                        }
                    }
                    if(ufload("aos_system/apps/petCursors/app_enabled")){
                        if(ufload("aos_system/apps/petCursors/app_enabled") === "1"){
                            this.vars.toggleApp(1);
                        }
                    }
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'Pet Cursors will give you any number of extra cursors that will follow you around as you use aOS.',
            enabled: 0,
            buildPresetList: function(){
                var tempList = '';
                for(var i in this.presets){
                    tempList += '<img onclick="apps.petCursors.vars.addNewCursor(\'' + i + '\')" class="cursorPointer" src="' + this.presets[i].imageSource + '">&nbsp; &nbsp;';
                }
                tempList += '<br><button onclick="apps.petCursors.vars.addNewCursor()">Custom</button><br><br>'
                getId('petCursorsPresets').innerHTML = tempList;
            },
            aggressiveChase: 0,
            presets: {
                breezeDefault: {
                    imageName: 'Breeze',
                    imageSource: 'cursors/beta/default.png',
                    imageSize: [41, 41],
                    imageCenter: [3, 3],
                    distance: 50,
                    speed: 25,
                    personality: 15
                },
                /*
                crosshair: {
                    imageName: 'Crosshair',
                    imageSource: 'cursors/crosshair.png',
                    imageCenter: [16, 16],
                    distance: -1,
                    speed: 30,
                    personality: 5
                },
                */
                alphaDefault: {
                    imageName: 'aOS Alpha',
                    imageSource: 'cursors/default.png',
                    imageSize: [18, 25],
                    imageCenter: [3, 3],
                    distance: 50,
                    speed: 20,
                    personality: 30
                },
                winDefault: {
                    imageName: 'Windows',
                    imageSource: 'cursors/aeroCursor.png',
                    imageSize: [14, 21],
                    imageCenter: [0, 0],
                    distance: 35,
                    speed: 20,
                    personality: 1
                },
                orangeCat: {
                    imageName: 'Orange Kitten',
                    imageSource: 'cursors/cat.png',
                    imageSize: [48, 48],
                    imageCenter: [24, 24],
                    distance: 200,
                    speed: 3,
                    personality: 50
                },
                grayCat: {
                    imageName: 'Gray Kitten',
                    imageSource: 'cursors/cat2.png',
                    imageSize: [48, 48],
                    imageCenter: [24, 24],
                    distance: 100,
                    speed: 5,
                    personality: 20
                },
                foxxo: {
                    imageName: 'Foxxo',
                    imageSource: 'cursors/foxxo.png',
                    imageSize: [48, 48],
                    imageCenter: [24, 24],
                    distance: 100,
                    speed: 5,
                    personality: 50
                }
            },
            buildCursorList: function(){
                var tempList = '';
                for(var i in this.cursors){
                    tempList += '<li>' +
                        'Name: <input id="petCursorName_' + i + '" placeholder="Name" value="' + this.cursors[i].cursorName + '"> ' +
                        '<button onclick="apps.petCursors.vars.updateCursor(' + i + ')">Update Cursor</button> ' +
                        '<button onclick="apps.petCursors.vars.deleteCursor(' + i + ')">Delete Cursor</button>' +
                        '</li>' +
                        '<ul>' +
                        '<li>Image URL: <input id="petCursorImage_' + i + '" placeholder="https://" value="' + this.cursors[i].cursorImage + '"></li>' +
                        '<li>Image Size: <input id="petCursorSize_' + i + '" size="3" placeholder="[w, h]" value="' + JSON.stringify(this.cursors[i].cursorSize || 'null') + '"></li>' +
                        '<li>Image Center: <input id="petCursorOffset_' + i + '" size="3" placeholder="[x, y]" value="' + JSON.stringify(this.cursors[i].cursorCenter) + '"></li>' +
                        '<li>Follow Distance: <input id="petCursorDistance_' + i + '" size="1" placeholder="50" value="' + this.cursors[i].followDistance + '"></li>' +
                        '<li>Follow Speed: <input id="petCursorSpeed_' + i + '" size="1" placeholder="25" value="' + this.cursors[i].followSpeed + '"></li>' +
                        '<li>Personality: <input id="petCursorPersonality_' + i + '" size="1" placeholder="25" value="' + this.cursors[i].personality + '"></li>' +
                        '</ul>';
                }
                getId('petCursorsList').innerHTML = tempList;
            },
            cursors: [
                {
                    cursorName: 'Breeze',
                    cursorImage: 'cursors/beta/default.png',
                    cursorSize: [41, 41],
                    cursorCenter: [3, 3],
                    followDistance: 50,
                    followSpeed: 25,
                    personality: 15
                }
            ],
            addNewCursor: function(preset){
                if(preset){
                    this.cursors.push({
                        cursorName: this.presets[preset].imageName,
                        cursorImage: this.presets[preset].imageSource,
                        cursorSize: this.presets[preset].imageSize,
                        cursorCenter: this.presets[preset].imageCenter,
                        followDistance: this.presets[preset].distance,
                        followSpeed: this.presets[preset].speed,
                        personality: this.presets[preset].personality
                    });
                    this.rebuildCursors();
                    this.saveCursors();
                }else{
                    this.cursors.push({
                        cursorName: '',
                        cursorImage: '',
                        cursorSize: null,
                        cursorCenter: [0, 0],
                        followDistance: 50,
                        followSpeed: 25,
                        personality: 15
                    });
                }
                this.buildCursorList();
            },
            updateCursor: function(id){
                this.cursors[id] = {
                    cursorName: getId('petCursorName_' + id).value,
                    cursorImage: getId('petCursorImage_' + id).value,
                    cursorSize: JSON.parse(getId('petCursorSize_' + id).value || 'null'),
                    cursorCenter: JSON.parse(getId('petCursorOffset_' + id).value),
                    followDistance: parseInt(getId('petCursorDistance_' + id).value),
                    followSpeed: parseFloat(getId('petCursorSpeed_' + id).value),
                    personality: parseInt(getId('petCursorPersonality_' + id).value)
                };
                this.buildCursorList();
                this.rebuildCursors();
                this.saveCursors();
            },
            deleteCursor: function(id){
                this.cursors.splice(id, 1);
                this.buildCursorList();
                this.rebuildCursors();
                this.saveCursors();
            },
            deleteAll: function(){
                this.cursors = [];
                this.buildCursorList();
                this.rebuildCursors();
                this.saveCursors();
            },
            saveCursors: function(){
                ufsave('aos_system/apps/petCursors/cursors', JSON.stringify(this.cursors));
            },
            toggleApp: function(nosave){
                if(this.enabled){
                    this.stopCursors();
                }else{
                    this.startCursors();
                }
                if(!nosave){
                    ufsave('aos_system/apps/petCursors/app_enabled', '' + this.enabled);
                }
            },
            enabled: 0,
            rebuildCursors: function(){
                if(this.enabled){
                    getId('petCursors').innerHTML = '';
                    for(var i in this.cursors){
                        getId('petCursors').innerHTML += '<img id="pet_cursor_' + i + '" src="' + this.cursors[i].cursorImage + '">';
                        getId('pet_cursor_' + i).style.left = Math.round(Math.random() * parseInt(getId('monitor').style.width) - this.cursors[i].cursorCenter[0]) + 'px';
                        getId('pet_cursor_' + i).style.top = Math.round(Math.random() * parseInt(getId('monitor').style.height) - this.cursors[i].cursorCenter[1]) + 'px';
                        getId('pet_cursor_' + i).style.width = (this.cursors[i].cursorSize || ['', ''])[0] + 'px';
                        getId('pet_cursor_' + i).style.height = (this.cursors[i].cursorSize || ['', ''])[1] + 'px';
                    }
                }
            },
            startCursors: function(){
                if(!this.enabled){
                    this.enabled = 1;
                    this.rebuildCursors();
                    getId('petCursors').style.display = 'block';
                    requestAnimationFrame(this.moveCursors);
                }
            },
            stopCursors: function(){
                this.enabled = 0;
                getId('petCursors').style.display = 'none';
                getId('petCursors').innerHTML = '';
            },
            moveCursors: function(){
                if(apps.petCursors.vars.enabled){
                    var mouseX = lastPageX / screenScale;
                    var mouseY = lastPageY / screenScale;
                    for(var i in apps.petCursors.vars.cursors){
                        if(getId('pet_cursor_' + i)){
                            var currX = parseInt(getId('pet_cursor_' + i).style.left) + apps.petCursors.vars.cursors[i].cursorCenter[0];
                            var currY = parseInt(getId('pet_cursor_' + i).style.top) + apps.petCursors.vars.cursors[i].cursorCenter[1];
                            var distX = mouseX - currX;
                            var distY = mouseY - currY;
                            var totalDist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
                            if(totalDist > apps.petCursors.vars.cursors[i].followDistance * 2 || apps.petCursors.vars.aggressiveChase){
                                currX += distX * (apps.petCursors.vars.cursors[i].followSpeed / 100) + (Math.random() * (apps.petCursors.vars.cursors[i].personality * 2) - apps.petCursors.vars.cursors[i].personality);
                                currY += distY * (apps.petCursors.vars.cursors[i].followSpeed / 100) + (Math.random() * (apps.petCursors.vars.cursors[i].personality * 2) - apps.petCursors.vars.cursors[i].personality);
                            }else if(totalDist > apps.petCursors.vars.cursors[i].followDistance){
                                currX += distX * (apps.petCursors.vars.cursors[i].followSpeed / 200) + (Math.random() * apps.petCursors.vars.cursors[i].personality - apps.petCursors.vars.cursors[i].personality / 2);
                                currY += distY * (apps.petCursors.vars.cursors[i].followSpeed / 200) + (Math.random() * apps.petCursors.vars.cursors[i].personality - apps.petCursors.vars.cursors[i].personality / 2);
                            }else if(Math.random() < apps.petCursors.vars.cursors[i].personality * 0.001){
                                currX += (Math.random() * (apps.petCursors.vars.cursors[i].personality * 2) - apps.petCursors.vars.cursors[i].personality);
                                currY += (Math.random() * (apps.petCursors.vars.cursors[i].personality * 2) - apps.petCursors.vars.cursors[i].personality);
                            }
                            getId('pet_cursor_' + i).style.left = Math.round(currX) - apps.petCursors.vars.cursors[i].cursorCenter[0] + "px";
                            getId('pet_cursor_' + i).style.top = Math.round(currY) - apps.petCursors.vars.cursors[i].cursorCenter[1] + "px";
                        }
                    }
                    setTimeout(apps.petCursors.vars.moveCursors, 100);
                }
            }
        }, 0, 'petCursors', 'appicons/ds/GTK.png'
    );
    getId('aOSloadingInfo').innerHTML = 'Init aOS Hub...';
});
c(function(){
    apps.appCenter = new Application(
        'AH',
        'aOS Hub',
        1,
        function(launchtype){
            if(!this.appWindow.appIcon){
                this.appWindow.setCaption("aOS Hub");
                this.appWindow.setDims("auto", "auto", 600, 400);
                this.appWindow.setContent(
                    "<div style='position:relative;padding-top:3px;' id='APPCENTER_maindiv'>" +
                    "<span id='APPCENTER_updates'>Checking for</span> available updates.<br>" +
                    "<button onclick='apps.appCenter.vars.showUpdates()'>Updates</button><br>" +
                    "<b><span id='APPCENTER_NOTICE' style='color:#A00'></span></b><br>" +
                    "<div style='position:absolute;right:3px;line-height:1.5em;top:0;text-align:right'>" +
                    "<input placeholder='Search' onkeyup='apps.appCenter.vars.doSearch(this.value)' id='APPCENTER_SEARCH'><br>" +
                    "<button onclick='apps.appCenter.vars.listRepos()'>Repositories</button><br>" +
                    "<button onclick='apps.appCenter.vars.checkUpdates()'>Refresh</button>" +
                    "</div>" +
                    "<div style='position:relative;text-align:center;' id='APPCENTER_categories'></div>" +
                    "<div style='position:relative;width:100%;min-height:20px;' id='APPCENTER_packages'></div>" +
                    "</div>"
                );
                this.vars.listCategories();
                this.vars.setCategory('All');
                if(launchtype === "updates"){
                    this.vars.checkUpdates(1);
                }else{
                    this.vars.checkUpdates();
                }
                getId("win_appCenter_html").style.overflowY = "scroll";
            }
            this.appWindow.openWindow();
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    if(safeMode){
                        doLog("Failed initializing aOS Hub apps because Safe Mode is enabled.", "#F00");
                    }else{
                        repoLoad();
                        for(var repository in installedPackages){
                            for(var package in installedPackages[repository]){
                                if(installedPackages[repository][package].appType === "webApp"){
                                    try{
                                        apps.appCenter.vars.compileWebApp(installedPackages[repository][package], repository + '__' + package);
                                    }catch(err){
                                        doLog("Failed initializing " + repository + '.' + package + ":", "#F00");
                                        doLog(err, "#F00");
                                    }
                                }else if(installedPackages[repository][package].appType === "stylesheet"){
                                    if(installedPackages[repository][package].hasOwnProperty("styleContent")){
                                        var customCSS = document.createElement("style");
                                        customCSS.classList.add("customstyle_appcenter");
                                        customCSS.id = "customstyle_appcenter_" + repository + "_" + package;
                                        customCSS.innerHTML = installedPackages[repository][package].styleContent;
                                        document.head.appendChild(customCSS);
                                    }else{
                                        var customCSS = document.createElement("link");
                                        customCSS.setAttribute("rel", "stylesheet");
                                        customCSS.href = installedPackages[repository][package].styleLink;
                                        customCSS.classList.add("customstyle_appcenter");
                                        customCSS.id = "customstyle_appcenter_" + repository + "_" + package;
                                        document.head.appendChild(customCSS);
                                    }
                                }
                            }
                        }
                        repoUpdate(null, function(){
                            var updates = repoGetUpgradeable();
                            if(updates.length > 0){
                                apps.prompt.vars.notify(updates.length + " app updates available.", ["Dismiss", "View Updates"], function(btn){
                                    if(btn === 1){
                                        openapp(apps.appCenter, "updates");
                                    }
                                }, "aOS Hub");
                            }
                        });
                        // alphabetized array of apps
                        appsSorted = [];
                        for(var i in apps){
                            appsSorted.push(apps[i].appDesc.toLowerCase() + "|AC_apps_sort|" + i);
                        }
                        appsSorted.sort();
                        for(var i in appsSorted){
                            var tempStr = appsSorted[i].split("|AC_apps_sort|");
                            tempStr = tempStr[tempStr.length - 1];
                            appsSorted[i] = tempStr;
                        }
                    }
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'aOS Hub is a GUI front-end for the aOS repository and package system.',
            displayUpdates: function(updateScreen){
                getId("APPCENTER_updates").innerHTML = repoGetUpgradeable().length;
                if(!updateScreen){
                    apps.appCenter.vars.listAll();
                }
                apps.appCenter.vars.doSearch(getId("APPCENTER_SEARCH").value);
            },
            listCategories: function(){
                var currHTML = "";
                for(var i in this.categories){
                    currHTML += "<div class='cursorPointer' id='APPCENTER_CATEGORYSEARCH_" + i + "' style='position:relative;display:inline-block;padding:8px;padding-bottom:3px;padding-top:5px;margin-bottom:-4px;' onclick='apps.appCenter.vars.setCategory(\"" + i + "\")'>" + i + "</div>";
                }
                getId("APPCENTER_categories").innerHTML = currHTML;
            },
            setCategory: function(newCategory){
                this.currCategorySearch = newCategory;
                for(var i = 0; i < getId('APPCENTER_categories').childNodes.length; i++){
                    try{
                        getId("APPCENTER_categories").childNodes[i].style.background = '';
                    }catch(err){

                    }
                }
                getId("APPCENTER_CATEGORYSEARCH_" + newCategory).style.background = 'rgba(127, 127, 127, 0.5)';
                this.listAll();
                this.doSearch(getId("APPCENTER_SEARCH").value);
            },
            currCategorySearch: "All",
            categories: {
                "All": "",
                "Apps": "App",
                "Styles": "stylesheet",
                "Scripts": "bootscript",
                //"Widgets": "widget"
            },
            doSearch: function(searchQuery){
                for(var i = 0; i < getId("APPCENTER_packages").childNodes.length; i++){
                    if(getId("APPCENTER_packages").childNodes[i].id !== "APPCENTER_UPDATE_CONTROLS"){
                        if(getId("APPCENTER_packages").childNodes[i].innerText.toLowerCase().indexOf(searchQuery.toLowerCase()) === -1){
                            getId("APPCENTER_packages").childNodes[i].style.display = "none";
                        }else{
                            getId("APPCENTER_packages").childNodes[i].style.display = "block";
                        }
                    }
                }
            },
            checkUpdates: function(updateScreen){
                if(updateScreen){
                    repoUpdate(null, this.showUpdates);
                }else{
                    repoUpdate(null, this.displayUpdates);
                }
            },
            applyUpdates: function(){
                repoUpgrade(null, this.showUpdates);
            },
            install: function(buttonElement){
                repoAddPackage(buttonElement.getAttribute("data-appcenter-repo") + "." + buttonElement.getAttribute("data-appcenter-package"), null, apps.appCenter.vars.displayUpdates);
                //getId("APPCENTER_NOTICE_" + buttonElement.getAttribute("data-appcenter-repo") + "_" + buttonElement.getAttribute("data-appcenter-package")).innerHTML = "Restart to apply changes.";
                //getId("APPCENTER_NOTICE").innerHTML = "Restart to apply changes.";
            },
            uninstall: function(buttonElement){
                repoRemovePackage(buttonElement.getAttribute("data-appcenter-repo") + "." + buttonElement.getAttribute("data-appcenter-package"), apps.appCenter.vars.displayUpdates);
                //getId("APPCENTER_NOTICE_" + buttonElement.getAttribute("data-appcenter-repo") + "_" + buttonElement.getAttribute("data-appcenter-package")).innerHTML = "Restart to apply changes.";
                //getId("APPCENTER_NOTICE").innerHTML = "Restart to apply changes.";
            },
            listAll: function(){
                var packageList = [];
                for(var repo in repositories){
                    for(var package in repositories[repo].packages){
                        packageList.push([repositories[repo].packages[package].packageName, repo, package]);
                    }
                }
                packageList.sort(function(a, b){
                    if(a[0] < b[0]){
                        return -1;
                    }
                    if(a[0] > b[0]){
                        return 1;
                    }
                    return 0;
                });
                var finalhtml = "";
                for(var i in packageList){
                    var selectedPackage = repositories[packageList[i][1]].packages[packageList[i][2]];
                    if(selectedPackage.packageType.indexOf(apps.appCenter.vars.categories[apps.appCenter.vars.currCategorySearch]) !== -1){
                        finalhtml += "<div style='position:relative;width:calc(100% - 35px);min-height:128px;padding:16px;border-top:2px solid #7F7F7F;'>";
                        finalhtml += "<div style='position:relative;height:128px;width:128px;'>" + buildSmartIcon(128, selectedPackage.icon) + "</div><div style='position:relative;width:calc(100% - 144px);margin-left:160px;margin-top:-128px;'>"
                        finalhtml += "<b>" + selectedPackage.packageName + " <span id='APPCENTER_NOTICE_" + repositories[packageList[i][1]].repoID + "_" + packageList[i][2] + "' style='color:#A00'></span></b><br>" +
                            "<span style='font-family:aosProFont, monospace; font-size:12px'>" + repositories[packageList[i][1]].repoID + "." + selectedPackage.packageID + "</span><br>" +
                            (selectedPackage.description || "No Description.").split("\n").join("<br>");
                        finalhtml += "<br><br></div><div style='right:16px;text-align:right;bottom:16px;'>"
                        if(installedPackages.hasOwnProperty(repositories[packageList[i][1]].repoID)){
                            if(installedPackages[repositories[packageList[i][1]].repoID].hasOwnProperty(selectedPackage.packageID)){
                                if(selectedPackage.packageType === "webApp"){
                                    finalhtml += "<button onclick='c(function(){openapp(apps.webApp_" + repositories[packageList[i][1]].repoID + "__" + selectedPackage.packageID + ", \"dsktp\");});'>Launch</button> ";
                                }
                                finalhtml += "<button data-appcenter-repo='" + repositories[packageList[i][1]].repoID + "' data-appcenter-package='" + packageList[i][2] + "' onclick='apps.appCenter.vars.uninstall(this)'>Uninstall</button>";
                            }else{
                                finalhtml += "<button data-appcenter-repo='" + repositories[packageList[i][1]].repoID + "' data-appcenter-package='" + packageList[i][2] + "' onclick='apps.appCenter.vars.install(this)'>Install</button>";
                            }
                        }else{
                            finalhtml += "<button data-appcenter-repo='" + repositories[packageList[i][1]].repoID + "' data-appcenter-package='" + packageList[i][2] + "' onclick='apps.appCenter.vars.install(this)'>Install</button>";
                        }
                        finalhtml += "</div></div>";
                    }
                }
                getId("APPCENTER_packages").innerHTML = finalhtml;
            },
            listRepos: function(){
                try{
                    for(var i = 0; i < getId('APPCENTER_categories').childNodes.length; i++){
                        try{
                            getId("APPCENTER_categories").childNodes[i].style.background = '';
                        }catch(err){

                        }
                    }
                }catch(err){

                }
                var finalhtml = '';
                for(var repo in repositories){
                    finalhtml += "<div style='position:relative;width:calc(100% - 35px);padding:16px;border-top:2px solid #7F7F7F;'>" +
                        "<b>" + repositories[repo].repoName + "</b><br>" +
                        "<span style='font-family:aosProFont, monospace; font-size:12px'>" + repositories[repo].repoID + "</span><br><br>" +
                        repo + "<br><br>" +
                        "<div style='right:16px;text-align:right;bottom:16px;'>";
                    finalhtml += '<button data-appcenter-repo="' + repo + '" onclick="apps.appCenter.vars.removeRepo(this)">Remove</button>' +
                        '</div></div>';
                }
                finalhtml += "<div style='position:relative;width:calc(100% - 35px);padding:16px;border-top:2px solid #7F7F7F;'>" +
                    "<input id='APPCENTER_ADD_REPO' placeholder='https://'> <button onclick='apps.appCenter.vars.addRepo()'>Add Repository</button>"
                    "</div>";
                try{
                    getId("APPCENTER_packages").innerHTML = finalhtml;
                }catch(err){

                }
            },
            showUpdates: function(){
                apps.appCenter.vars.displayUpdates(1);
                for(var i = 0; i < getId('APPCENTER_categories').childNodes.length; i++){
                    try{
                        getId("APPCENTER_categories").childNodes[i].style.background = '';
                    }catch(err){

                    }
                }
                var currUpdates = repoGetUpgradeable();
                var finalhtml = '<div id="APPCENTER_UPDATE_CONTROLS" style="width:calc(100% - 3px);padding-top:16px;padding-bottom:16px;border-top:2px solid #7F7F7F;text-align:center;position:relative;">' +
                    '<button onclick="apps.appCenter.vars.checkUpdates(1)">Check for Updates</button> <button onclick="apps.appCenter.vars.applyUpdates()">Apply Updates</button>' +
                    '</div>';
                for(var i in currUpdates){
                    currUpdates[i] = currUpdates[i].split('.');
                    var selectedPackage = installedPackages[currUpdates[i][0]][currUpdates[i][1]];
                    console.log(selectedPackage);
                    finalhtml += "<div style='position:relative;width:calc(100% - 35px);padding:16px;border-top:2px solid #7F7F7F;'>";
                    finalhtml += "<b>" + selectedPackage.name + "</b><br>" +
                        "<span style='font-family:aosProFont, monospace; font-size:12px'>" + currUpdates[i][0] + "." + selectedPackage.id + "</span><br>";
                    finalhtml += "</div>";
                }
                getId("APPCENTER_packages").innerHTML = finalhtml;
            },
            addRepo: function(){
                if(getId("APPCENTER_ADD_REPO").value){
                    repoAddRepository(getId("APPCENTER_ADD_REPO").value, function(){}, apps.appCenter.vars.listRepos);
                }
            },
            removeRepo: function(elem){
                repoRemoveRepository(elem.getAttribute("data-appcenter-repo"), function(){}, apps.appCenter.vars.listRepos);
            },
            compileWebApp: function(varSet, pkgName){
                apps['webApp_' + pkgName] = new Application(
                    varSet.abbreviation,
                    varSet.name,
                    0,
                    function(){
                        this.appWindow.setCaption(this.appDesc);
                        if(!this.appWindow.appIcon){
                            this.appWindow.paddingMode(0);
                            this.appWindow.setContent('<iframe data-parent-app="' + this.objName + '" style="width:100%;height:100%;border:none;" src="' + this.vars.appURL + '"></iframe>');
                            this.appWindow.setDims("auto", "auto", this.vars.sizeX, this.vars.sizeY);
                            if(!this.vars.manualOpen){
                                this.appWindow.openWindow();
                            }
                            requestAnimationFrame(() => {
                                getId("icn_" + this.objName).style.display = "inline-block";
                                this.appWindow.appIcon = 1;
                            });
                        }else{
                            this.appWindow.openWindow();
                        }
                        
                    },
                    function(signal){
                        switch(signal){
                            case "forceclose":
                                //this.vars = this.varsOriginal;
                                this.appWindow.closeWindow();
                                this.appWindow.closeIcon();
                                break;
                            case "close":
                                this.appWindow.closeWindow();
                                setTimeout(function(){
                                    if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                                        this.appWindow.setContent("");
                                    }
                                }.bind(this), 300);
                                break;
                            case "checkrunning":
                                if(this.appWindow.appIcon){
                                    return 1;
                                }else{
                                    return 0;
                                }
                            case "shrink":
                                this.appWindow.closeKeepTask();
                                break;
                            case "USERFILES_DONE":
                                
                                break;
                            case 'shutdown':
                                    
                                break;
                            default:
                                doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
                        }
                    },
                    {
                        appInfo: 'This app was installed via the aOS Hub.<br><br>Home URL:<br>' + varSet.homeURL + '<br><br>Package name:<br>' + pkgName.split('__').join('.') + '<br><br>App object name:<br>apps.webApp_' + pkgName,
                        appURL: varSet.homeURL,
                        sizeX: varSet.windowSize[0],
                        sizeY: varSet.windowSize[1],
                        manualOpen: varSet.manualOpen || 0
                    }, 1, 'webApp_' + pkgName, varSet.icon
                );
            }
        }, 0, 'appCenter', {
            backgroundColor: "#303947",
            foreground: "smarticons/appCenter/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    getId('aOSloadingInfo').innerHTML = 'Developer Documentation';
});
c(function(){
    m('init DD');
    apps.devDocumentation = new Application(
        'DD',
        'Developer Documentation',
        0,
        function(){
            if(!this.appWindow.appIcon){
                this.appWindow.paddingMode(0);
                this.appWindow.setContent('<iframe data-parent-app="devDocumentation" id="DDframe" style="border:none; display:block; width:100%; height:100%; overflow:hidden;" src="documentation/"></iframe>');
                getId("icn_devDocumentation").style.display = "inline-block";
                requestAnimationFrame(() => {
                    this.appWindow.appIcon = 1;
                });
            }
            this.appWindow.setCaption('Developer Documentation');
            this.appWindow.setDims("auto", "auto", 1000, 600);
            if(this.appWindow.appIcon){
                this.appWindow.openWindow();
            }
        },
        function(signal){
            switch(signal){
                case "forceclose":
                    //this.vars = this.varsOriginal;
                    this.appWindow.closeWindow();
                    this.appWindow.closeIcon();
                    break;
                case "close":
                    this.appWindow.closeWindow();
                    setTimeout(function(){
                        if(getId("win_" + this.objName + "_top").style.opacity === "0"){
                            this.appWindow.setContent("");
                        }
                    }.bind(this), 300);
                    break;
                case "checkrunning":
                    if(this.appWindow.appIcon){
                        return 1;
                    }else{
                        return 0;
                    }
                case "shrink":
                    this.appWindow.closeKeepTask();
                    break;
                case "USERFILES_DONE":
                    
                    break;
                case 'shutdown':
                        
                    break;
                default:
                    doLog("No case found for '" + signal + "' signal in app '" + this.dsktpIcon + "'", "#F00");
            }
        },
        {
            appInfo: 'This is the official AaronOS developer documentation. This is mostly useful to those writing Web Apps.',
        }, 0, 'devDocumentation', {
            backgroundColor: "#303947",
            foreground: "smarticons/aOS/fg.png",
            backgroundBorder: {
                thickness: 2,
                color: "#252F3A"
            }
        }
    );
    getId('aOSloadingInfo').innerHTML = 'Finalizing...';
});
m('init finalizing');
//function to open apps
var currTopApp = '';
function toTop(appToNudge, dsktpClick){
    m('Moving App ' + appToNudge.dsktpIcon + ' to Top');
    currTopApp = '';
    if(dsktpClick !== 2){
        for(var appLication in apps){
            if(getId("win_" + apps[appLication].objName + "_top").style.zIndex !== "100"){
                getId("win_" + apps[appLication].objName + "_top").style.zIndex = parseInt(getId("win_" + apps[appLication].objName + "_top").style.zIndex, 10) - 1;
            }
            getId("win_" + apps[appLication].objName + "_cap").style.opacity = "1";
            getId("win_" + apps[appLication].objName + "_aero").style.opacity = "1";
            getId('icn_' + apps[appLication].objName).classList.remove('activeAppIcon');
        }
    }
    if(!dsktpClick){
        if(appToNudge.appWindow.appIcon && getId("win_" + appToNudge.objName + "_top").style.opacity !== "1"){
            appToNudge.appWindow.openWindow();
        }
        if(getId("win_" + appToNudge.objName + "_top").style.zIndex !== "100"){
            getId("win_" + appToNudge.objName + "_top").style.zIndex = "90";
        }
        getId("win_" + appToNudge.objName + "_cap").style.opacity = "1";
        getId("win_" + appToNudge.objName + "_aero").style.opacity = "1";
        getId('icn_' + appToNudge.objName).classList.add('activeAppIcon');
        try{
            currTopApp = appToNudge.objName;
            document.title = appToNudge.appDesc + ' | aOS ' + aOSversion;
        }catch(err){
            document.title = 'AaronOS';
        }
        //getId("win" + appToNudge.dsktpIcon).style.boxShadow = "0 0 30px #000";
    }else{
        try{
            document.title = 'AaronOS ' + aOSversion;
        }catch(err){
            document.title = 'AaronOS';
        }
    }
    if(appToNudge !== apps.startMenu && apps.startMenu.appWindow.appIcon){
        apps.startMenu.signalHandler('shrink');
    }
    getId("ctxMenu").style.display = "none";
    
    if(appToNudge.dsktpIcon !== "CLOSING"){
        var tempAppsList = [];
        for(var appLication in apps){
            if(getId("win_" + apps[appLication].objName + "_top").style.zIndex !== "100" && apps[appLication].appWindow.appIcon){
                tempAppsList.push([appLication, getId("win_" + apps[appLication].objName + "_top").style.zIndex]);
            }
        }
        tempAppsList.sort(function(a, b){
            return b[1] - a[1];
        });
        for(var i = 0; i < tempAppsList.length; i++){
            getId("win_" + apps[tempAppsList[i][0]].objName + "_top").style.zIndex = 90 - i;
        }
    }
}
function openapp(appToOpen, launchTypeUsed){
    m('Opening App ' + appToOpen.dsktpIcon);
    if(appToOpen.launchTypes){
        appToOpen.main(launchTypeUsed);
    }else{
        appToOpen.main();
    }
    toTop(appToOpen);
}
// Applications onclicks
/*
for(var application in apps){
    getId("app" + apps[application].dsktpIcon).setAttribute("onClick", "openapp(apps." + application + ", 'dsktp')");
    getId("icn" + apps[application].dsktpIcon).setAttribute("onClick", "openapp(apps." + application + ", 'tskbr')");
    getId("win" + apps[application].dsktpIcon).setAttribute("onClick", "toTop(apps." + application + ")");
    getId("win" + apps[application].dsktpIcon + "e").setAttribute("onClick", "apps." + application + ".signalHandler('close')");
    getId("win" + apps[application].dsktpIcon + "s").setAttribute("onClick", "apps." + application + ".signalHandler('shrink')");
}
*/
finishedMakingAppClicks = 1;
//function to remove broken text warning
function fadeResizeText(){
    getId("timesUpdated").style.display = "none";
}
//function to measure FPS has been moved to time function
//function to allow app windows to be moved
var winmoveSelect = "";
var winmovex = 0;
var winmovey = 0;
var winmoveOrX = 0;
var winmoveOrY = 0;
var winmovecurrapp = '';
function winmove(e){
    if(e.currentTarget !== getId("winmove")){
        getId("winmove").style.display = "block";
        //winmoveSelect = e.currentTarget.id.substring(0, e.currentTarget.id.length - 1);
        winmoveSelect = e.currentTarget.id.substring(0, e.currentTarget.id.length - 4);
        winmovex = e.pageX;
        winmovey = e.pageY;
        //winmoveOrX = parseInt(getId(winmoveSelect).style.left);
        //winmoveOrY = parseInt(getId(winmoveSelect).style.top);
        for(var app in apps){
            //if(apps[app].dsktpIcon == winmoveSelect.substring(3, winmoveSelect.length)){
            if(apps[app].objName == winmoveSelect.substring(4, winmoveSelect.length)){
                winmovecurrapp = app;
                break;
            }
        }
        winmoveOrX = apps[winmovecurrapp].appWindow.windowX;
        winmoveOrY = apps[winmovecurrapp].appWindow.windowY;
        if(apps.settings.vars.performanceMode){
            getId('windowFrameOverlay').style.display = 'block';
            getId('windowFrameOverlay').style.left = winmoveOrX + 'px';
            getId('windowFrameOverlay').style.top = winmoveOrY + 'px';
            getId('windowFrameOverlay').style.width = apps[winmovecurrapp].appWindow.windowH + 'px';
            getId('windowFrameOverlay').style.height = apps[winmovecurrapp].appWindow.windowV + 'px';
        }
        if(document.activeElement.tagName === "IFRAME"){
            if(document.activeElement.getAttribute("data-parent-app")){
                if(e.currentTarget.id){
                    if("win_" + document.activeElement.getAttribute("data-parent-app") + "_cap" !== e.currentTarget.id){
                        document.activeElement.blur();
                    }
                }else{
                    if("win_" + document.activeElement.getAttribute("data-parent-app") + "_cap" !== e.currentTarget.parentNode.id){
                        document.activeElement.blur();
                    }
                }
            }
        }
    }else{
        getId("winmove").style.display = "none";
        if(!mobileMode){
            apps[winmovecurrapp].appWindow.setDims(
                winmoveOrX + (e.pageX - winmovex) * (1 / screenScale), winmoveOrY + (e.pageY - winmovey) * (1 / screenScale),
                apps[winmovecurrapp].appWindow.windowH, apps[winmovecurrapp].appWindow.windowV
            );
        }
        if(apps.settings.vars.performanceMode){
            getId('windowFrameOverlay').style.display = 'none';
        }
        //eval(getId(winmoveSelect).getAttribute('onclick').substring(6, getId(winmoveSelect).getAttribute('onclick').length - 1) + ".appWindow.windowX = " + (winmoveOrX + (e.pageX - winmovex)));
        //eval(getId(winmoveSelect).getAttribute('onclick').substring(6, getId(winmoveSelect).getAttribute('onclick').length - 1) + ".appWindow.windowY = " + (winmoveOrY + (e.pageY - winmovey)));
        //getId(winmoveSelect).style.left = winmoveOrX + (e.pageX - winmovex) + "px";
        //getId(winmoveSelect).style.top = winmoveOrY + (e.pageY - winmovey) + "px";
        //getId(winmoveSelect + "a").style.backgroundPosition = (-1 * (winmoveOrX + (e.pageX - winmovex)) + 40) + "px " + (-1 * (winmoveOrY + (e.pageY - winmovey)) + 40) + "px";
    }
}
getId("winmove").addEventListener("click", winmove);
function winmoving(e){
    winmovelastx = e.pageX;
    winmovelasty = e.pageY;
    if(apps.settings.vars.performanceMode){
        getId('windowFrameOverlay').style.left = winmoveOrX + (e.pageX - winmovex) * (1 / screenScale) + 'px';
        getId('windowFrameOverlay').style.top = winmoveOrY + (e.pageY - winmovey) * (1 / screenScale) + 'px';
    }else if(!mobileMode){
        apps[winmovecurrapp].appWindow.setDims(
            winmoveOrX + (e.pageX - winmovex) * (1 / screenScale), winmoveOrY + (e.pageY - winmovey) * (1 / screenScale),
            apps[winmovecurrapp].appWindow.windowH, apps[winmovecurrapp].appWindow.windowV
        );
    }
    //getId(winmoveSelect).style.left = winmoveOrX + (e.pageX - winmovex) + "px";
    //getId(winmoveSelect).style.top = winmoveOrY + (e.pageY - winmovey) + "px";
    //getId(winmoveSelect + "a").style.backgroundPosition = (-1 * (winmoveOrX + (e.pageX - winmovex)) + 40) + "px " + (-1 * (winmoveOrY + (e.pageY - winmovey)) + 40) + "px";
}
var icomoveSelect = "";
var icomovex = 0;
var icomovey = 0;
var icomoveOrX = 0;
var icomoveOrY = 0;
function icomove(e, elem){
    if(elem){
        console.log(elem);
        getId("icomove").style.display = "block";
        icomoveSelect = "app_" + elem;
        icomovex = e.pageX;
        icomovey = e.pageY;
        icomoveOrX = parseInt(getId(icomoveSelect).style.left, 10);
        icomoveOrY = parseInt(getId(icomoveSelect).style.top, 10);
        toTop({dsktpIcon: 'DESKTOP'}, 1);
    }else{
        getId("icomove").style.display = "none";
        var newXCoord = icomoveOrX + (e.pageX - icomovex) * (1 / screenScale);
        var newYCoord = icomoveOrY + (e.pageY - icomovey) * (1 / screenScale);
        newXCoord = Math.round(newXCoord / 108) * 108 + 8;
        newYCoord = Math.round(newYCoord / 98) * 98 + 8;
        dsktp[icomoveSelect.substring(4)].position = [newXCoord, newYCoord];
        ufsave('aos_system/desktop/user_icons/ico_' + icomoveSelect.substring(4), JSON.stringify(dsktp[icomoveSelect.substring(4)]));
        //ufsave('aos_system/desktop/ico_' + icomoveSelect, '[' + newXCoord + ',' + newYCoord + ']');
        getId(icomoveSelect).style.left = newXCoord + "px";
        getId(icomoveSelect).style.top = newYCoord + "px";
    }
}
getId("icomove").addEventListener("click", icomove);
function icomoving(e){
    getId(icomoveSelect).style.left = icomoveOrX + (e.pageX - icomovex) * (1 / screenScale) + "px";
    getId(icomoveSelect).style.top = icomoveOrY + (e.pageY - icomovey) * (1 / screenScale) + "px";
}
//custom icons
function icnmove(e, elem){
    if(elem){
        getId("icnmove").style.display = "block";
        icomoveSelect = "app" + elem;
        icomovex = e.pageX;
        icomovey = e.pageY;
        icomoveOrX = parseInt(getId(icomoveSelect).style.left, 10);
        icomoveOrY = parseInt(getId(icomoveSelect).style.top, 10);
        toTop({dsktpIcon: 'DESKTOP'}, 1);
    }else{
        getId("icnmove").style.display = "none";
        var newXCoord = icomoveOrX + (e.pageX - icomovex) * (1 / screenScale);
        var newYCoord = icomoveOrY + (e.pageY - icomovey) * (1 / screenScale);
        newXCoord = Math.round(newXCoord / 108) * 108 + 8;
        newYCoord = Math.round(newYCoord / 98) * 98 + 8;
        apps.iconMaker.vars.moveIcon(icomoveSelect, '[' + newXCoord + ',' + newYCoord + ']');
        getId(icomoveSelect).style.left = newXCoord + "px";
        getId(icomoveSelect).style.top = newYCoord + "px";
    }
}
getId("icnmove").addEventListener("click", icnmove);
function icnmoving(e){
    getId(icomoveSelect).style.left = icomoveOrX + (e.pageX - icomovex) * (1 / screenScale) + "px";
    getId(icomoveSelect).style.top = icomoveOrY + (e.pageY - icomovey) * (1 / screenScale) + "px";
}
var tempwinres = "";
var tempwinresa = "";
var tempwinresmode = [1, 1];
var winresOrX = 0;
var winresOrY = 0;
function winres(e){
    if(e.currentTarget !== getId("winres")){
        getId("winres").style.display = "block";
        //winmoveSelect = e.currentTarget.id.substring(0, e.currentTarget.id.length - 1);
        winmoveSelect = e.currentTarget.id.substring(0, e.currentTarget.id.length - 5);
        winmovex = e.pageX;
        winmovey = e.pageY;
        //winmoveOrX = parseInt(getId(winmoveSelect).style.left);
        //winmoveOrY = parseInt(getId(winmoveSelect).style.top);
        for(var app in apps){
            //if(apps[app].dsktpIcon == winmoveSelect.substring(3, winmoveSelect.length)){
            if(apps[app].objName == winmoveSelect.substring(4, winmoveSelect.length)){
                winmovecurrapp = app;
                break;
            }
        }
        winmoveOrX = apps[winmovecurrapp].appWindow.windowH;
        winmoveOrY = apps[winmovecurrapp].appWindow.windowV;
        if(apps.settings.vars.performanceMode){
            getId('windowFrameOverlay').style.display = 'block';
            getId('windowFrameOverlay').style.left = apps[winmovecurrapp].appWindow.windowX + 'px';
            getId('windowFrameOverlay').style.top = apps[winmovecurrapp].appWindow.windowY + 'px';
            getId('windowFrameOverlay').style.width = winmoveOrX + 'px';
            getId('windowFrameOverlay').style.height = winmoveOrY + 'px';
        }
        tempwinresmode = [1, 1];
        if(winmovex - apps[winmovecurrapp].appWindow.windowX < apps.settings.vars.winBorder * 5){
            tempwinresmode[0] = 0;
            winresOrX = apps[winmovecurrapp].appWindow.windowX;
        }else if(winmovex - apps[winmovecurrapp].appWindow.windowX - apps[winmovecurrapp].appWindow.windowH > apps.settings.vars.winBorder * -5){
            tempwinresmode[0] = 2;
        }
        if(winmovey - apps[winmovecurrapp].appWindow.windowY < apps.settings.vars.winBorder * 5){
            tempwinresmode[1] = 0;
            winresOrY = apps[winmovecurrapp].appWindow.windowY;
        }else if(winmovey - apps[winmovecurrapp].appWindow.windowY - apps[winmovecurrapp].appWindow.windowV > apps.settings.vars.winBorder * -5){
            tempwinresmode[1] = 2;
        }
        if(document.activeElement.tagName === "IFRAME"){
            if(document.activeElement.getAttribute("data-parent-app")){
                if(e.currentTarget.id){
                    if("win_" + document.activeElement.getAttribute("data-parent-app") + "_size" !== e.currentTarget.id){
                        document.activeElement.blur();
                    }
                }
            }
        }
    }else{
        getId("winres").style.display = "none";
        var newWidth = apps[winmovecurrapp].appWindow.windowH;
        var newHeight = apps[winmovecurrapp].appWindow.windowV;
        var newLeft = apps[winmovecurrapp].appWindow.windowX;
        var newTop = apps[winmovecurrapp].appWindow.windowY;
        if(tempwinresmode[0] === 2){
            newWidth = winmoveOrX + (e.pageX - winmovex) * (1 / screenScale);
        }else if(tempwinresmode[0] === 0){
            newWidth = winmoveOrX - (e.pageX - winmovex) * (1 / screenScale);
            newLeft = winresOrX + (e.pageX - winmovex) * (1 / screenScale);
        }
        if(tempwinresmode[1] === 2){
            newHeight = winmoveOrY + (e.pageY - winmovey) * (1 / screenScale);
        }else if(tempwinresmode[1] === 0){
            newHeight = winmoveOrY - (e.pageY - winmovey) * (1 / screenScale);
            newTop = winresOrY + (e.pageY - winmovey) * (1 / screenScale)
        }
        apps[winmovecurrapp].appWindow.setDims(
            newLeft, newTop,
            newWidth, newHeight
        );
        if(apps.settings.vars.performanceMode){
            getId('windowFrameOverlay').style.display = 'none';
        }
        //getId(winmoveSelect).style.transform = "rotateY(" + (e.pageX - winmovex) + "deg)rotateX(" + (e.pageY - winmovey) + "deg)";
        //getId(winmoveSelect).style.transform = "scale(" + (1 + (e.pageX - winmovex) * 0.0025) + "," + (1 + (e.pageY - winmovey) * 0.0025) + ")";
        //getId(winmoveSelect + "a").style.transform = "rotateY(" + -1 * (e.pageX - winmovex) + "deg)rotateX(" + -1 * (e.pageY - winmovey) + "deg)";
    }
}
getId("winres").addEventListener("click", winres);
function winresing(e){
    var newWidth = apps[winmovecurrapp].appWindow.windowH;
    var newHeight = apps[winmovecurrapp].appWindow.windowV;
    var newLeft = apps[winmovecurrapp].appWindow.windowX;
    var newTop = apps[winmovecurrapp].appWindow.windowY;
    if(tempwinresmode[0] === 2){
        newWidth = winmoveOrX + (e.pageX - winmovex) * (1 / screenScale);
    }else if(tempwinresmode[0] === 0){
        newWidth = winmoveOrX - (e.pageX - winmovex) * (1 / screenScale);
        newLeft = winresOrX + (e.pageX - winmovex) * (1 / screenScale);
    }
    if(tempwinresmode[1] === 2){
        newHeight = winmoveOrY + (e.pageY - winmovey) * (1 / screenScale);
    }else if(tempwinresmode[1] === 0){
        newHeight = winmoveOrY - (e.pageY - winmovey) * (1 / screenScale);
        newTop = winresOrY + (e.pageY - winmovey) * (1 / screenScale)
    }
    if(apps.settings.vars.performanceMode){
        getId('windowFrameOverlay').style.left = newLeft + 'px';
        getId('windowFrameOverlay').style.top = newTop + 'px';
        getId('windowFrameOverlay').style.width = newWidth + 'px';
        getId('windowFrameOverlay').style.height = newHeight + 'px';
    }else{
        apps[winmovecurrapp].appWindow.setDims(
            newLeft, newTop,
            newWidth, newHeight
        );
    }
    //getId(winmoveSelect).style.transform = "rotateY(" + (e.pageX - winmovex) + "deg)rotateX(" + (e.pageY - winmovey) + "deg)";
    //getId(winmoveSelect).style.transform = "scale(" + (1 + (e.pageX - winmovex) * 0.0025) + "," + (1 + (e.pageY - winmovey) * 0.0025) + ")";
    //getId(winmoveSelect + "a").style.transform = "rotateY(" + -1 * (e.pageX - winmovex) + "deg)rotateX(" + -1 * (e.pageY - winmovey) + "deg)";
}

function highlightWindow(app){
    getId('windowFrameOverlay').style.display = 'block';
    getId('windowFrameOverlay').style.left = apps[app].appWindow.windowX + "px";
    getId('windowFrameOverlay').style.top = apps[app].appWindow.windowY + "px";
    getId('windowFrameOverlay').style.width = apps[app].appWindow.windowH + "px";
    getId('windowFrameOverlay').style.height = apps[app].appWindow.windowV + "px";
}
function highlightHide(){
    getId('windowFrameOverlay').style.display = 'none';
}

c(function(){
    openapp(apps.settings);
    c(function(){
        apps.settings.signalHandler('close');
    });
});
var ctxSetup = [
    [0, 0, "appicons/ds/redx.png", "appicons/ds/redx.png"],
    ' Context', 'alert("Context Menu Not Correctly Initialized")',
    ' Menu', 'alert("Context Menu Not Correctly Initialized")'
];
var newCtxSetup = [
    [' Context', function(){alert('context')}, 'appicons/ds/redx.png'],
    [' Menu', function(){alert('menu')}, 'appicons/ds/redx.png']
];
var newCtxCoord = [10, 10];
var newCtxArgs = [];
var ctxMenuImg = "";
function ctxMenu(setupArray, version, event, args){
    m('Opening ctxMenu');
    if(version){
        if(getId('ctxMenu').style.display !== "block"){
            newCtxCoord = [event.pageX * (1 / screenScale), event.pageY * (1 / screenScale)];
            newCtxArgs = args;
            newCtxSetup = setupArray;
            getId("ctxMenu").style.display = "block";
            if(newCtxCoord[0] > window.innerWidth * (1 / screenScale) / 2){
                getId("ctxMenu").style.removeProperty("left");
                getId("ctxMenu").style.right = window.innerWidth * (1 / screenScale) - newCtxCoord[0] - 1 + "px";
            }else{
                getId("ctxMenu").style.removeProperty("right");
                getId("ctxMenu").style.left = newCtxCoord[0] + "px";
            }
            if(newCtxCoord[1] > window.innerHeight * (1 / screenScale) / 2){
                getId("ctxMenu").style.removeProperty("top");
                getId("ctxMenu").style.bottom = window.innerHeight * (1 / screenScale) - newCtxCoord[1] - 1 + "px";
            }else{
                getId("ctxMenu").style.removeProperty("bottom");
                getId("ctxMenu").style.top = newCtxCoord[1] + "px";
            }
            getId("ctxMenu").innerHTML = "";
            for(var i in newCtxSetup){
                if(typeof newCtxSetup[i][0] === 'function'){
                    if(newCtxSetup[i][0](newCtxArgs)[0] === '+' || newCtxSetup[i][0](newCtxArgs)[0] === '_'){
                        c(function(){
                            getId("ctxMenu").innerHTML += '<hr>';
                        });
                    }
                    if(newCtxSetup[i][2]){
                        ctxMenuImg = '<img src="' + newCtxSetup[i][2] + '" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-left:1px;" onerror="this.style.marginLeft = \'0\';this.style.marginRight = \'1px\';this.src = \'ctxMenu/beta/simple.png\'">';
                    }else{
                        ctxMenuImg = '<img src="ctxMenu/beta/simple.png" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-right:1px">';
                    }
                    if(newCtxSetup[i][0](newCtxArgs)[0] === '-' || newCtxSetup[i][0](newCtxArgs)[0] === '_'){
                        c(function(arg){
                            getId("ctxMenu").innerHTML += '<p class="hiddenCtxOption">' + arg[1] + "&nbsp;" + newCtxSetup[arg[0]][0](newCtxArgs).substring(1,newCtxSetup[arg[0]][0](newCtxArgs).length) + '&nbsp;</p>';
                        }, [i, ctxMenuImg]);
                    }else{
                        c(function(arg){
                            getId("ctxMenu").innerHTML += '<p class="cursorPointer" onClick="newCtxSetup[' + arg[0] + '][1](newCtxArgs)">' + arg[1] + "&nbsp;" + newCtxSetup[arg[0]][0](newCtxArgs).substring(1,newCtxSetup[arg[0]][0](newCtxArgs).length) + '&nbsp;</p>';
                        }, [i, ctxMenuImg]);
                    }
                }else{
                    if(newCtxSetup[i][0][0] === '+' || newCtxSetup[i][0][0] === '_'){
                        c(function(){
                            getId("ctxMenu").innerHTML += '<hr>';
                        });
                    }
                    if(newCtxSetup[i][2]){
                        ctxMenuImg = '<img src="' + newCtxSetup[i][2] + '" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-left:1px;" onerror="this.style.marginLeft = \'0\';this.style.marginRight = \'1px\';this.src = \'ctxMenu/beta/simple.png\'">';
                    }else{
                        ctxMenuImg = '<img src="ctxMenu/beta/simple.png" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-right:1px">';
                    }
                    if(newCtxSetup[i][0][0] === '-' || newCtxSetup[i][0][0] === '_'){
                        c(function(arg){
                            getId("ctxMenu").innerHTML += '<p class="hiddenCtxOption">' + arg[1] + "&nbsp;" + newCtxSetup[arg[0]][0].substring(1,newCtxSetup[arg[0]][0].length) + '&nbsp;</p>';
                        }, [i, ctxMenuImg]);
                    }else{
                        c(function(arg){
                            getId("ctxMenu").innerHTML += '<p class="cursorPointer" onClick="newCtxSetup[' + arg[0] + '][1](newCtxArgs)">' + arg[1] + "&nbsp;" + newCtxSetup[arg[0]][0].substring(1,newCtxSetup[arg[0]][0].length) + '&nbsp;</p>';
                        }, [i, ctxMenuImg]);
                    }
                }
            }
        }
    }else{
        if(getId("ctxMenu").style.display !== "block"){
            ctxSetup = setupArray;
            getId("ctxMenu").style.display = "block";
            ctxSetup[0][0] *= (1 / screenScale);
            ctxSetup[0][1] *= (1 / screenScale);
            if(ctxSetup[0][0] > window.innerWidth * (1 / screenScale) / 2){
                getId("ctxMenu").style.removeProperty("left");
                getId("ctxMenu").style.right = window.innerWidth * (1 / screenScale) - ctxSetup[0][0] - 1 + "px";
            }else{
                getId("ctxMenu").style.removeProperty("right");
                getId("ctxMenu").style.left = ctxSetup[0][0] + "px";
            }
            if(ctxSetup[0][1] > window.innerHeight * (1 / screenScale) / 2){
                getId("ctxMenu").style.removeProperty("top");
                getId("ctxMenu").style.bottom = window.innerHeight * (1 / screenScale) - ctxSetup[0][1] - 1 + "px";
            }else{
                getId("ctxMenu").style.removeProperty("bottom");
                getId("ctxMenu").style.top = ctxSetup[0][1] + "px";
            }
            getId("ctxMenu").innerHTML = "";
            for(var i = 1; i < ctxSetup.length - 1; i += 2){ // first char of name of element: + means new group | - means cannot click | _ means new group and cannot click
                if(i !== 1){
                    if(ctxSetup[i][0] === '+' || ctxSetup[i][0] === '_'){
                        //getId("ctxMenu").innerHTML += '<hr>';
                        c(function(){
                            getId("ctxMenu").innerHTML += '<hr>';
                        });
                    }
                }
                if(ctxSetup[0][2]){
                    ctxMenuImg = '<img src="' + ctxSetup[0][Math.floor(i / 2) + 2] + '" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-left:1px;" onerror="this.style.marginLeft = \'0\';this.style.marginRight = \'1px\';this.src = \'ctxMenu/beta/simple.png\'">';
                }else{
                    ctxMenuImg = '<img src="ctxMenu/beta/simple.png" style="width:10px; height:10px; margin-top:1px; margin-bottom:-2px; margin-right:1px">';
                }
                if(ctxSetup[i][0] === '-' || ctxSetup[i][0] === '_'){
                    //getId("ctxMenu").innerHTML += '<p class="hiddenCtxOption">' + ctxSetup[i].substring(1,ctxSetup[i].length) + '</p>';
                    c(function(arg){
                        getId("ctxMenu").innerHTML += '<p class="hiddenCtxOption">' + arg[1] + "&nbsp;" + ctxSetup[arg[0]].substring(1,ctxSetup[arg[0]].length) + '&nbsp;</p>';
                    }, [i, ctxMenuImg]);
                }else{
                    //getId("ctxMenu").innerHTML += '<p onClick="' + ctxSetup[i + 1] + '">' + ctxSetup[i].substring(1,ctxSetup[i].length) + '</p>';
                    c(function(arg){
                        getId("ctxMenu").innerHTML += '<p class="cursorPointer" onClick="' + ctxSetup[arg[0] + 1] + '">' + arg[1] + "&nbsp;" + ctxSetup[arg[0]].substring(1,ctxSetup[arg[0]].length) + '&nbsp;</p>';
                    }, [i, ctxMenuImg]);
                }
            }
        }
    }
    //disabled as it caused some errors
    //ctxSetup = [[0, 0], 'Context', 'alert("Context Menu Not Correctly Initialized")', 'Menu', 'alert("Context Menu Not Correctly Initialized")'];
}
//getId("monitor").setAttribute('oncontextmenu', 'window.setTimeout(ctxMenu, 2);return false');
var baseCtx = {
    hideall: [
        [' ' + lang('ctxMenu', 'settings'), function(){
            openapp(apps.settings, 'dsktp');
        }, 'ctxMenu/beta/gear.png'],
        [' ' + lang('ctxMenu', 'jsConsole'), function(){
            openapp(apps.jsConsole, 'dsktp');
        }, 'ctxMenu/beta/console.png'],
        ['+' + lang('ctxMenu', 'screenResolution'), function(){
            openapp(apps.settings, 'dsktp');
            apps.settings.vars.showMenu(apps.settings.vars.menus.screenRes);
        }, 'ctxMenu/beta/gear.png'],
        [' ' + lang('ctxMenu', 'desktopBackground'), function(){
            openapp(apps.settings, 'dsktp');
            apps.settings.vars.showMenu(apps.settings.vars.menus.background);
            getId('bckGrndImg').focus();
        }, 'ctxMenu/beta/cool.png'],
        ['+' + lang('ctxMenu', 'addIcon'), function(){
            openapp(apps.iconMaker, 'newicon ' + newCtxCoord[0] + ' ' + newCtxCoord[1]);
        }, 'ctxMenu/beta/add.png']
    ],
    desktop: [
        [' ' + lang('ctxMenu', 'settings'), function(){
            openapp(apps.settings, 'dsktp');
        }, 'ctxMenu/beta/gear.png'],
        [' ' + lang('ctxMenu', 'jsConsole'), function(){
            openapp(apps.jsConsole, 'dsktp');
        }, 'ctxMenu/beta/console.png'],
        [function(){return '+' + lang('ctxMenu', 'speak') + ' "' + currentSelection.substring(0, 5) + '..."'}, function(){
            textspeech(currentSelection);
        }, 'ctxMenu/beta/happy.png']
    ],
    taskbar: [
        [' ' + lang('ctxMenu', 'settings'), function(){
            openapp(apps.settings, 'dsktp');
        }, 'ctxMenu/beta/gear.png'],
        [' ' + lang('ctxMenu', 'jsConsole'), function(){
            openapp(apps.jsConsole, 'dsktp');
        }, 'ctxMenu/beta/console.png'],
        [' ' + lang('appNames', 'taskManager'), function(){
            openapp(apps.taskManager, 'dsktp');
        }, 'ctxMenu/beta/aOS.png'],
        ['+' + lang('ctxMenu', 'taskbarSettings'), function(){
            openapp(apps.settings, 'dsktp');
            apps.settings.vars.showMenu(apps.settings.vars.menus.taskbar);
        }, 'ctxMenu/beta/gear.png']
        /*
        ['+Toggle Compact Time', function(){
            apps.settings.vars.togTimeComp();
        }, '/ctxMenu/beta/cool.png'],
        [' Toggle Network Status', function(){
            apps.settings.vars.togNetStat();
        }, '/ctxMenu/beta/wifi.png'],
        [' Toggle Battery Status', function(){
            apps.settings.vars.togBatStat();
        }, '/ctxMenu/beta/battery.png'],
        [' Toggle Stylish Battery', function(){
            apps.settings.vars.togBatComp();
        }, '/ctxMenu/beta/cool.png'],
        [' Toggle FPS Status', function(){
            apps.settings.vars.togFpsStat();
        }, '/ctxMenu/beta/performance.png'],
        [' Toggle Compact FPS', function(){
            apps.settings.vars.togFpsComp();
        }, '/ctxMenu/beta/cool.png'],
        [' Toggle CPU Status', function(){
            apps.settings.vars.togLodStat();
        }, '/ctxMenu/beta/performance.png']
        */
    ],
    appXXX: [
        [' ' + lang('ctxMenu', 'openApp'), function(args){
            openapp(apps[args[1]], 'dsktp');
        }, 'ctxMenu/beta/window.png'],
        ['+' + lang('ctxMenu', 'moveIcon'), function(args){
            icomove(args[0], args[1]);
        }],
        ['+Delete Icon', function(args){
            removeDsktpIcon(args[1]);
        }, 'ctxMenu/beta/x.png']
    ],
    appXXXjs: [
        [' Execute', function(args){
            Function(...dsktp[args[1]].action)(...dsktp[args[1]].actionArgs);
        }, 'ctxMenu/beta/window.png'],
        ['+' + lang('ctxMenu', 'moveIcon'), function(args){
            icomove(args[0], args[1]);
        }],
        ['+Delete Icon', function(args){
            removeDsktpIcon(args[1]);
        }, 'ctxMenu/beta/x.png']
    ],
    icnXXX: [
        [function(arg){
            if(apps[arg].appWindow.appIcon){
                return ' ' + lang('ctxMenu', 'showApp');
            }else{
                return ' ' + lang('ctxMenu', 'openApp');
            }
        }, function(arg){
            if(apps[arg].appWindow.appIcon){
                openapp(apps[arg], 'tskbr');
            }else{
                openapp(apps[arg], 'dsktp');
            }
        }, 'ctxMenu/beta/window.png'],
        [function(arg){
            if(apps[arg].appWindow.appIcon){
                return ' ' + lang('ctxMenu', 'hideApp');
            }else{
                return '-' + lang('ctxMenu', 'hideApp');
            }
        }, function(arg){
            apps[arg].signalHandler('shrink');
        }, 'ctxMenu/beta/minimize.png'],
        [function(arg){
            if(pinnedApps.indexOf(arg) === -1){
                return '+Pin App';
            }else{
                return '+Unpin App';
            }
        }, function(arg){
            pinApp(arg);
            if(pinnedApps.indexOf(arg) === -1 && !apps[arg].appWindow.appIcon){
                getId('icn_' + arg).style.display = 'none';
            }
        }, 'ctxMenu/beta/minimize.png'],
        [function(arg){
            if(dsktp[arg]){
                return '_Add Desktop Icon';
            }else{
                return '+Add Desktop Icon';
            }
        }, function(arg){
            if(dsktp[arg]){
                removeDsktpIcon(arg);
            }else{
                newDsktpIcon(arg, arg);
            }
        }, 'ctxMenu/beta/add.png'],
        [function(arg){
            if(dsktp[arg]){
                return ' Remove Desktop Icon';
            }else{
                return '-Remove Desktop Icon';
            }
        }, function(arg){
            if(dsktp[arg]){
                removeDsktpIcon(arg);
            }else{
                newDsktpIcon(arg, arg);
            }
        }, 'ctxMenu/beta/x.png'],
        ['+' + lang('ctxMenu', 'closeApp'), function(arg){
            apps[arg].signalHandler('close');
        }, 'ctxMenu/beta/x.png']
    ],
    winXXXc: [
        [' About This App', function(arg){
            openapp(apps.appInfo, arg);
        }, 'ctxMenu/beta/file.png'],
        ['+' + lang('ctxMenu', 'fold'), function(arg){
            apps[arg].appWindow.foldWindow();
        }, 'ctxMenu/beta/less.png'],
        ['+' + lang('ctxMenu', 'hideApp'), function(arg){
            apps[arg].signalHandler('shrink');
        }, 'ctxMenu/beta/minimize.png'],
        [' ' + lang('ctxMenu', 'fullscreen'), function(arg){
            apps[arg].appWindow.toggleFullscreen();
            toTop(apps[arg]);
        }, 'ctxMenu/beta/add.png'],
        [' Close', function(arg){
            apps[arg].signalHandler('close');
        }, 'ctxMenu/beta/x.png'],
        [function(arg){
            if(apps[arg].appWindow.onTop === 0){
                return '+' + lang('ctxMenu', 'stayOnTop');
            }else{
                return '_' + lang('ctxMenu', 'stayOnTop');
            }
        }, function(arg){
            apps[arg].appWindow.alwaysOnTop(1);
        }, 'ctxMenu/beta/add.png'],
        [function(arg){
            if(apps[arg].appWindow.onTop === 1){
                return ' ' + lang('ctxMenu', 'stopOnTop');
            }else{
                return '-' + lang('ctxMenu', 'stopOnTop');
            }
        }, function(arg){
            apps[arg].appWindow.alwaysOnTop(0);
        }, 'ctxMenu/beta/less.png']
    ]
};
getId("hideall").setAttribute('oncontextmenu', 'ctxMenu(baseCtx.hideall, 1, event);');
//getId("desktop").setAttribute('oncontextmenu', 'ctxMenu(baseCtx.desktop, 1, event);return false');
getId("taskbar").setAttribute('oncontextmenu', 'ctxMenu(baseCtx.taskbar, 1, event);');
getId("monitor").setAttribute('oncontextmenu', 'if(event.target !== getId("ctxMenu")){return false}');

//OLD function to fit monitor to window size
/*
 function(){
    apps.settings.vars.sH();
    apps.settings.vars.sV();
    if(window.innerWidth < 1050 * apps.settings.vars.sX || window.innerHeight < 600 * apps.settings.vars.sV){
        window.setTimeout('fitWindow()', 1000);
    }else{
        window.setTimeout('getId("timesUpdated").innerHTML = "Best on Chrome. Taskbar icons broken on Firefox, cant view this in IE."', 1000);
        window.setTimeout('fadeResizeText()', 5000);
    }
};
if(window.innerWidth < 1050 * apps.settings.vars.sX || window.innerHeight < 600 * apps.settings.vars.sV){
    window.setTimeout('fitWindow()', 500);
    getId('timesUpdated').innerHTML += '<br>Resizing monitor...';
}else{
    window.setTimeout('fadeResizeText()', 5000);
}
*/

var flowMode = 0;
function exitFlowMode(){
    if(getId("monitor").classList.contains('flowDesktop')){
        getId("monitor").classList.remove('flowDesktop');
    }
    flowMode = 0;
}
function enterFlowMode(){
    if(!getId("monitor").classList.contains('flowDesktop')){
        getId("monitor").classList.add('flowDesktop');
        getId("desktop").scrollTop = 0;
    }
    flowMode = 1;
}
function toggleFlowMode(){
    if(flowMode){
        if(getId("monitor").classList.contains('flowDesktop')){
            getId("monitor").classList.remove('flowDesktop');
        }
        flowMode = 0;
    }else{
        if(!getId("monitor").classList.contains('flowDesktop')){
            getId("monitor").classList.add('flowDesktop');
            getId("desktop").scrollTop = 0;
        }
        flowMode = 1;
    }
}

window.bgNaturalSize = [1920, 1080];
window.bgSize = [1920,1080];
window.bgPosition = [0, 0];

function updateBgSize(noWinblur){
    bgNaturalSize = [
        getId("bgSizeElement").naturalWidth,
        getId("bgSizeElement").naturalHeight
    ];
    switch(apps.settings.vars.bgFit){
        case 'corner':
            bgSize = [bgNaturalSize[0], bgNaturalSize[1]];
            bgPosition = [0, 0];
            break;
        case 'stretch':
            bgSize = [parseInt(getId("monitor").style.width), parseInt(getId("monitor").style.height)];
            bgPosition = [0, 0];
            break;
        case 'center':
            var monsize = [parseInt(getId("monitor").style.width), parseInt(getId("monitor").style.height)];
            bgSize = [bgNaturalSize[0], bgNaturalSize[1]];
            bgPosition = [monsize[0] / 2 - bgSize[0] / 2, monsize[1] / 2 - bgSize[1] / 2];
            break;
        case 'fit':
            var monsize = [parseInt(getId("monitor").style.width), parseInt(getId("monitor").style.height)];
            var sizeratio = [monsize[0] / bgNaturalSize[0], monsize[1] / bgNaturalSize[1]];
            if(sizeratio[0] <= sizeratio[1]){
                bgSize = [monsize[0], Math.round(bgNaturalSize[1] * (monsize[0] / bgNaturalSize[0]))];
                bgPosition = [0, Math.round((monsize[1] - bgSize[1]) / 2)];
            }else{
                bgSize = [Math.round(bgNaturalSize[0] * (monsize[1] / bgNaturalSize[1])), monsize[1]];
                bgPosition = [Math.round((monsize[0] - bgSize[0]) / 2), 0];
            }
            break;
        case 'cover':
            var monsize = [parseInt(getId("monitor").style.width), parseInt(getId("monitor").style.height)];
            var sizeratio = [monsize[0] / bgNaturalSize[0], monsize[1] / bgNaturalSize[1]];
            if(sizeratio[0] >= sizeratio[1]){
                bgSize = [monsize[0], Math.round(bgNaturalSize[1] * (monsize[0] / bgNaturalSize[0]))];
                bgPosition = [0, Math.round((monsize[1] - bgSize[1]) / 2)];
            }else{
                bgSize = [Math.round(bgNaturalSize[0] * (monsize[1] / bgNaturalSize[1])), monsize[1]];
                bgPosition = [Math.round((monsize[0] - bgSize[0]) / 2), 0];
            }
            break;
        default:
            bgSize = [bgNaturalSize[0], bgNaturalSize[1]];
            bgPosition = [0, 0];
    }
    getId("monitor").style.backgroundSize = bgSize[0] + 'px ' + bgSize[1] + 'px';
    getId("monitor").style.backgroundPosition = bgPosition[0] + 'px ' + bgPosition[1] + 'px';
    if(!noWinblur){
        calcWindowblur(null, 1);
    }
}

function calcWindowblur(win, noBgSize){
    if(!noBgSize){
        updateBgSize(1);
    }
    var aeroOffset = [0, 0];
    if(tskbrToggle.tskbrPos === 1){
        aeroOffset[1] = -32;
    }else if(tskbrToggle.tskbrPos === 2){
        aeroOffset[0] = -32;
    }
    if(screenScale === 1 || screenScale < 0.25){
        getId('monitor').style.transform = '';
        var numberOfScreenScale = 1;
    }else{
        getId('monitor').style.transform = 'scale(' + screenScale + ')';
        var numberOfScreenScale = screenScale;
    }
    if(win === "taskbar"){
        getId("tskbrAero").style.backgroundSize = bgSize[0] + 'px ' + bgSize[1] + 'px';
        switch(tskbrToggle.tskbrPos){
            case 0:
                getId("tskbrAero").style.backgroundPosition = (20 + bgPosition[0]) + "px " + (-1 * (window.innerHeight * (1 / numberOfScreenScale)) + 52 + bgPosition[1]) + "px";
                break;
            case 1:
                getId("tskbrAero").style.backgroundPosition = (20 + bgPosition[0]) + "px " + (20 + bgPosition[1]) + "px";
                break;
            case 2:
                getId("tskbrAero").style.backgroundPosition = (20 + bgPosition[0]) + "px " + (20 + bgPosition[1]) + "px";
                break;
            case 3:
                getId("tskbrAero").style.backgroundPosition = (-1 * (window.innerWidth * (1 / numberOfScreenScale)) + 52 + bgPosition[0]) + "px " + (20 + bgPosition[1]) + "px";
                break;
            default:
                getId("tskbrAero").style.backgroundPosition = (20 + bgPosition[0]) + "px " + (-1 * (window.innerHeight * (1 / numberOfScreenScale)) + 52 + bgPosition[1]) + "px";
        }
    }else if(win){
        getId('win_' + win + '_aero').style.backgroundPosition = (-1 * apps[win].appWindow.windowX + 40 + aeroOffset[0] + bgPosition[0]) + "px " + (-1 * (apps[win].appWindow.windowY * (apps[win].appWindow.windowY > -1)) + 40 + aeroOffset[1] + bgPosition[1]) + "px"
    }else{
        for(var i in apps){
            getId('win_' + i + '_aero').style.backgroundSize = bgSize[0] + 'px ' + bgSize[1] + 'px';
            getId('win_' + i + '_aero').style.backgroundPosition = (-1 * apps[i].appWindow.windowX + 40 + aeroOffset[0] + bgPosition[0]) + "px " + (-1 * (apps[i].appWindow.windowY * (apps[i].appWindow.windowY > -1)) + 40 + aeroOffset[1] + bgPosition[1]) + "px";
        }
        getId("tskbrAero").style.backgroundSize = bgSize[0] + 'px ' + bgSize[1] + 'px';
        switch(tskbrToggle.tskbrPos){
            case 0:
                getId("tskbrAero").style.backgroundPosition = (20 + bgPosition[0]) + "px " + (-1 * (window.innerHeight * (1 / numberOfScreenScale)) + 52 + bgPosition[1]) + "px";
                break;
            case 1:
                getId("tskbrAero").style.backgroundPosition = (20 + bgPosition[0]) + "px " + (20 + bgPosition[1]) + "px";
                break;
            case 2:
                getId("tskbrAero").style.backgroundPosition = (20 + bgPosition[0]) + "px " + (20 + bgPosition[1]) + "px";
                break;
            case 3:
                getId("tskbrAero").style.backgroundPosition = (-1 * (window.innerWidth * (1 / numberOfScreenScale)) + 52 + bgPosition[0]) + "px " + (20 + bgPosition[1]) + "px";
                break;
            default:
                getId("tskbrAero").style.backgroundPosition = (20 + bgPosition[0]) + "px " + (-1 * (window.innerHeight * (1 / numberOfScreenScale)) + 52 + bgPosition[1]) + "px";
        }
    }
}

function fitWindow(){
    perfStart('fitWindow');
    if(screenScale === 1 || screenScale < 0.25){
        getId('monitor').style.transform = '';
        var numberOfScreenScale = 1;
    }else{
        getId('monitor').style.transform = 'scale(' + screenScale + ')';
        var numberOfScreenScale = screenScale;
    }
    getId("monitor").style.width = window.innerWidth * (1 / numberOfScreenScale) + "px";
    getId("monitor").style.height = window.innerHeight * (1 / numberOfScreenScale) + "px";
    getId("desktop").style.width = window.innerWidth * (1 / numberOfScreenScale) + "px";
    getId("desktop").style.height = window.innerHeight * (1 / numberOfScreenScale) - 32 + "px";
    getId("taskbar").style.width = window.innerWidth * (1 / numberOfScreenScale) + "px";
    //getId("taskbar").style.top = window.innerHeight - 30 + "px";
    getId("tskbrAero").style.backgroundPosition = "20px " + (-1 * (window.innerHeight * (1 / numberOfScreenScale)) + 52) + "px";
    getId("tskbrAero").style.width = window.innerWidth * (1 / numberOfScreenScale) + 40 + "px";
    getId("tskbrAero").style.height = '';
    getId('tskbrAero').style.transform = '';
    getId('tskbrAero').style.transformOrigin = '';
    //getId("icons").style.width = window.innerWidth * (1 / numberOfScreenScale) + "px";
    //doLog(perfCheck('fitWindow') + '&micro;s to fit aOS to window');
    
    // taskbar position checking
    switch(tskbrToggle.tskbrPos){
        case 1:
            getId('desktop').style.left = '';
            getId('desktop').style.top = '32px';
            getId('desktop').style.width = getId('monitor').style.width;
            getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
            getId('taskbar').style.top = '0';
            getId('taskbar').style.left = '';
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = 'auto';
            getId('taskbar').style.transform = '';
            getId('taskbar').style.width = getId('monitor').style.width;
            getId('tskbrAero').style.backgroundPosition = "20px 20px";
            break;
        case 2:
            getId('desktop').style.left = '32px';
            getId('desktop').style.top = '';
            getId('desktop').style.width = parseInt(getId('monitor').style.width, 10) - 32 + "px";
            getId('desktop').style.height = getId('monitor').style.height;
            getId('taskbar').style.top = '0';
            getId('taskbar').style.left = '';
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = 'auto';
            getId('taskbar').style.transform = 'rotate(90deg)';
            getId('taskbar').style.width = getId('monitor').style.height;
            getId('tskbrAero').style.backgroundPosition = "20px 20px";
            getId('tskbrAero').style.transform = 'rotate(-90deg)';
            getId('tskbrAero').style.width = '72px';
            getId('tskbrAero').style.height = window.innerHeight * (1 / numberOfScreenScale) + 40 + "px";
            getId('tskbrAero').style.transformOrigin = '35px 35px';
            break;
        case 3:
            getId('desktop').style.left = '';
            getId('desktop').style.top = '';
            getId('desktop').style.width = parseInt(getId('monitor').style.width, 10) - 32 + "px";
            getId('desktop').style.height = getId('monitor').style.height;
            getId('taskbar').style.top = '';
            getId('taskbar').style.left = parseInt(getId('monitor').style.width, 10) - 32 + "px";
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = '';
            getId('taskbar').style.transform = 'rotate(-90deg)';
            getId('taskbar').style.width = getId('monitor').style.height;
            getId('tskbrAero').style.backgroundPosition = (-1 * (window.innerWidth * (1 / numberOfScreenScale)) + 52) + "px 20px";
            getId('tskbrAero').style.transform = 'rotate(90deg) translateY(-' + (window.innerHeight * (1 / numberOfScreenScale) - 32) + 'px)';
            getId('tskbrAero').style.width = '72px';
            getId('tskbrAero').style.height = window.innerHeight * (1 / numberOfScreenScale) + 40 + "px";
            getId('tskbrAero').style.transformOrigin = '35px 35px';// + (window.innerHeight * (1 / numberOfScreenScale) + 5) + 'px';
            break;
        default:
            getId('desktop').style.left = '';
            getId('desktop').style.top = '';
            getId('desktop').style.width = getId('monitor').style.width;
            getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
            getId('taskbar').style.top = '';
            getId('taskbar').style.left = '';
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = '';
            getId('taskbar').style.transform = '';
            getId('taskbar').style.width = getId('monitor').style.width;
    }
    checkMobileSize();
    arrangeDesktopIcons();
    try{
        updateBgSize();
    }catch(err){
        
    }
}
function fitWindowOuter(){
    perfStart('fitWindow');
    if(screenScale === 1 || screenScale < 0.25){
        getId('monitor').style.transform = '';
        var numberOfScreenScale = 1;
    }else{
        getId('monitor').style.transform = 'scale(' + screenScale + ')';
        var numberOfScreenScale = screenScale;
    }
    getId("monitor").style.width = window.outerWidth * (1 / numberOfScreenScale) + "px";
    getId("monitor").style.height = window.outerHeight * (1 / numberOfScreenScale) + "px";
    getId("desktop").style.width = window.outerWidth * (1 / numberOfScreenScale) + "px";
    getId("desktop").style.height = window.outerHeight * (1 / numberOfScreenScale) - 32 + "px";
    getId("taskbar").style.width = window.outerWidth * (1 / numberOfScreenScale) + "px";
    //getId("taskbar").style.top = window.outerHeight - 30 + "px";
    getId("tskbrAero").style.backgroundPosition = "20px " + (-1 * (window.outerHeight * (1 / numberOfScreenScale)) + 52) + "px";
    getId("tskbrAero").style.width = window.outerWidth * (1 / numberOfScreenScale) + 40 + "px";
    getId("tskbrAero").style.height = '';
    getId('tskbrAero').style.transform = '';
    getId('tskbrAero').style.transformOrigin = '';
    //getId("icons").style.width = window.outerWidth * (1 / numberOfScreenScale) + "px";
    //doLog(perfCheck('fitWindow') + '&micro;s to fit aOS to screen');
    
    // taskbar position checking
    switch(tskbrToggle.tskbrPos){
        case 1:
            getId('desktop').style.left = '';
            getId('desktop').style.top = '32px';
            getId('desktop').style.width = getId('monitor').style.width;
            getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
            getId('taskbar').style.top = '0';
            getId('taskbar').style.left = '';
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = 'auto';
            getId('taskbar').style.transform = '';
            getId('taskbar').style.width = getId('monitor').style.width;
            break;
        case 2:
            getId('desktop').style.left = '32px';
            getId('desktop').style.top = '';
            getId('desktop').style.width = parseInt(getId('monitor').style.width, 10) - 32 + "px";
            getId('desktop').style.height = getId('monitor').style.height;
            getId('taskbar').style.top = '0';
            getId('taskbar').style.left = '';
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = 'auto';
            getId('taskbar').style.transform = 'rotate(90deg)';
            getId('taskbar').style.width = getId('monitor').style.height;
            break;
        case 3:
            getId('desktop').style.left = '';
            getId('desktop').style.top = '';
            getId('desktop').style.width = parseInt(getId('monitor').style.width, 10) - 32 + "px";
            getId('desktop').style.height = getId('monitor').style.height;
            getId('taskbar').style.top = '';
            getId('taskbar').style.left = parseInt(getId('monitor').style.width, 10) - 32 + "px";
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = '';
            getId('taskbar').style.transform = 'rotate(-90deg)';
            getId('taskbar').style.width = getId('monitor').style.height;
            break;
        default:
            getId('desktop').style.left = '';
            getId('desktop').style.top = '';
            getId('desktop').style.width = getId('monitor').style.width;
            getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
            getId('taskbar').style.top = '';
            getId('taskbar').style.left = '';
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = '';
            getId('taskbar').style.transform = '';
            getId('taskbar').style.width = getId('monitor').style.width;
    }
    checkMobileSize();
    arrangeDesktopIcons();
    try{
        updateBgSize();
    }catch(err){
        
    }
}
function fitWindowRes(newmonX, newmonY){
    perfStart('fitWindow');
    if(screenScale === 1 || screenScale < 0.25){
        getId('monitor').style.transform = '';
        var numberOfScreenScale = 1;
    }else{
        getId('monitor').style.transform = 'scale(' + screenScale + ')';
        var numberOfScreenScale = screenScale;
    }
    getId("monitor").style.width = newmonX * (1 / numberOfScreenScale) + "px";
    getId("monitor").style.height = newmonY * (1 / numberOfScreenScale) + "px";
    getId("desktop").style.width = newmonX * (1 / numberOfScreenScale) + "px";
    getId("desktop").style.height = newmonY * (1 / numberOfScreenScale) - 32 + "px";
    getId("taskbar").style.width = newmonX * (1 / numberOfScreenScale) + "px";
    //getId("taskbar").style.top = newmonY - 30 + "px";
    getId("tskbrAero").style.backgroundPosition = "20px " + (-1 * (newmonY * (1 / numberOfScreenScale)) + 52) + "px";
    getId("tskbrAero").style.width = newmonX * (1 / numberOfScreenScale) + 40 + "px";
    getId("tskbrAero").style.height = '';
    getId('tskbrAero').style.transform = '';
    getId('tskbrAero').style.transformOrigin = '';
    //getId("icons").style.width = newmonX * (1 / numberOfScreenScale) + "px";
    //doLog(perfCheck('fitWindow') + '&micro;s to fit aOS to custom size');
    
    // taskbar position checking
    switch(tskbrToggle.tskbrPos){
        case 1:
            getId('desktop').style.left = '';
            getId('desktop').style.top = '32px';
            getId('desktop').style.width = getId('monitor').style.width;
            getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
            getId('taskbar').style.top = '0';
            getId('taskbar').style.left = '';
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = 'auto';
            getId('taskbar').style.transform = '';
            getId('taskbar').style.width = getId('monitor').style.width;
            break;
        case 2:
            getId('desktop').style.left = '32px';
            getId('desktop').style.top = '';
            getId('desktop').style.width = parseInt(getId('monitor').style.width, 10) - 32 + "px";
            getId('desktop').style.height = getId('monitor').style.height;
            getId('taskbar').style.top = '0';
            getId('taskbar').style.left = '';
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = 'auto';
            getId('taskbar').style.transform = 'rotate(90deg)';
            getId('taskbar').style.width = getId('monitor').style.height;
            break;
        case 3:
            getId('desktop').style.left = '';
            getId('desktop').style.top = '';
            getId('desktop').style.width = parseInt(getId('monitor').style.width, 10) - 32 + "px";
            getId('desktop').style.height = getId('monitor').style.height;
            getId('taskbar').style.top = '';
            getId('taskbar').style.left = parseInt(getId('monitor').style.width, 10) - 32 + "px";
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = '';
            getId('taskbar').style.transform = 'rotate(-90deg)';
            getId('taskbar').style.width = getId('monitor').style.height;
            break;
        default:
            getId('desktop').style.left = '';
            getId('desktop').style.top = '';
            getId('desktop').style.width = getId('monitor').style.width;
            getId('desktop').style.height = parseInt(getId('monitor').style.height, 10) - 32 + "px";
            getId('taskbar').style.top = '';
            getId('taskbar').style.left = '';
            getId('taskbar').style.right = '';
            getId('taskbar').style.bottom = '';
            getId('taskbar').style.transform = '';
            getId('taskbar').style.width = getId('monitor').style.width;
    }
    checkMobileSize();
    arrangeDesktopIcons();
    try{
        updateBgSize();
    }catch(err){
        
    }
}

// test that the code is intact (2c22 68747470733a2f2f6161726f6e6f73 2e64)
c(function(){
    var hexTestStr = "76617220616e74695069726163793d7b7d3b7472797b616e74695069726163793d7b626c6173743a617070732e73657474696e67732e766172732e73637265656e73617665727" +
        "32e626c6173742e6e616d652c6c6f6164696e67456c656d656e743a6e756c6c213d3d67657449642822614f5369734c6f6164696e6722292c636f707972696768744578697374733a766f69642" +
        "030213d3d617070732e73657474696e67732e766172732e6d656e75732e696e666f2e636f707972696768742c636f70797269676874436f6e7461696e734e616d653a2d31213d3d617070732e7" +
        "3657474696e67732e766172732e6d656e75732e696e666f2e636f707972696768742e6465736372697074696f6e28292e696e6465784f6628224161726f6e204164616d7322292c64617368626" +
        "f6172644e616d653a617070732e73746172744d656e752e617070446573632c64617368626f61726444657363436f6e7461696e734e616d653a2d31213d3d617070732e73746172744d656e752" +
        "e766172732e617070496e666f2e696e6465784f6628224161726f6e4f5322297d7d63617463682861297b616e74695069726163793d7b626c6173743a617070732e73657474696e67732e76617" +
        "2732e73637265656e7361766572732e626c6173742e6e616d652c6c6f6164696e67456c656d656e743a6e756c6c213d3d67657449642822614f5369734c6f6164696e6722292c636f707972696" +
        "768744578697374733a766f69642030213d3d617070732e73657474696e67732e766172732e6d656e75732e696e666f2e636f707972696768742c636f70797269676874436f6e7461696e734e6" +
        "16d653a21312c64617368626f6172644e616d653a617070732e73746172744d656e752e617070446573632c64617368626f61726444657363436f6e7461696e734e616d653a2d31213d3d61707" +
        "0732e73746172744d656e752e766172732e617070496e666f2e696e6465784f6628224161726f6e4f5322297d7d76617220616e7469506972616379436865636b3d7b626c6173743a224161726" +
        "f6e4f5320426c617374222c6c6f6164696e67456c656d656e743a21302c636f707972696768744578697374733a21302c636f70797269676874436f6e7461696e734e616d653a21302c6461736" +
        "8626f6172644e616d653a22614f532044617368626f617264222c64617368626f61726444657363436f6e7461696e734e616d653a21307d2c706972616379436865636b506173733d21303b666" +
        "f7228766172206920696e20616e746950697261637929696628616e74695069726163795b695d213d3d616e7469506972616379436865636b5b695d297b706972616379436865636b506173733" +
        "d21313b627265616b7d69662821706972616379436865636b50617373297b76617220636f70797269676874537472696e673b636f70797269676874537472696e673d616e74695069726163792" +
        "e636f707972696768744578697374733f617070732e73657474696e67732e766172732e6d656e75732e696e666f2e636f707972696768742e6465736372697074696f6e28293a226e756c6c223" +
        "b7661722070697261637944657461696c733d7b687265663a77696e646f772e6c6f636174696f6e2e687265662c626c6173743a537472696e6728616e74695069726163792e626c617374292c6" +
        "c6f6164696e67456c656d656e743a537472696e6728616e74695069726163792e6c6f6164696e67456c656d656e74292c636f707972696768744578697374733a537472696e6728616e7469506" +
        "9726163792e636f70797269676874457869737473292c636f70797269676874537472696e673a617070732e73657474696e67732e766172732e6d656e75732e696e666f2e636f7079726967687" +
        "42e6465736372697074696f6e28292c64617368626f6172644e616d653a616e74695069726163792e64617368626f6172644e616d652c64617368626f617264446573635374723a617070732e7" +
        "3746172744d656e752e766172732e617070496e666f7d2c666f726d446174613d6e657720466f726d446174613b666f7228766172206920696e2070697261637944657461696c7329666f726d4" +
        "46174612e617070656e6428692c70697261637944657461696c735b695d293b76617220706972616379487474705265713d6e657720584d4c48747470526571756573743b70697261637948747" +
        "4705265712e6f70656e2822504f5354222c2268747470733a2f2f636f72732d616e7977686572652e6865726f6b756170702e636f6d2f68747470733a2f2f6161726f6e6f732e6465762f41617" + "26f6e4f532f6c6f67732f6c6f6749737375652e70687022292c706972616379487474705265712e73656e642" +
        "8666f726d44617461292c6572726f724d657373616765733d5b22456d61696c207468697320636f646520746f204161726f6e20286d696e65616e646372616674313240676d61696c2e636f6d2" + "920666f7220737570706f7274212023374137373133225d2c633d6" +
        "6756e6374696f6e28636f64652c61726773297b0d0a6576616c28600d0a20202020202020202020202020202020696628747970656f6620636f6465203d3d3d202766756e6374696f6e27297b0" +
        "d0a202020202020202020202020202020202020202069662861726773297b0d0a202020202020202020202020202020202020202020202020636f6465546f52756e2e70757368285b636f64652" +
        "c20617267735d293b0d0a20202020202020202020202020202020202020207d656c73657b0d0a202020202020202020202020202020202020202020202020636f6465546f52756e2e707573682" +
        "8636f6465293b0d0a20202020202020202020202020202020202020207d0d0a202020202020202020202020202020207d0d0a60297d7d";
    var hexConverted = "";
    for(var i = 0; i < hexTestStr.length; i += 2){
        hexConverted += String.fromCharCode(parseInt(hexTestStr.substring(i, i + 2), 16));
    }
    eval(hexConverted);
    hexConverted = "";
    hexTestStr = "";
});

var sessionStorageSupported = 1;
try{
    if(typeof sessionStorage === "undefined"){
        sessionStorage = {getItem: function(){return false}, setItem: function(){return false}, removeItem: function(){return false}};
        sessionStorageSupported = 0;
    }
}catch(err){
    sessionStorage = {getItem: function(){return false}, setItem: function(){return false}, removeItem: function(){return false}};
    sessionStorageSupported = 0;
}
var localStorageSupported = 1;
try{
    if(typeof localStorage === "undefined"){
        localStorage = {getItem: function(){return false}, setItem: function(){return false}, removeItem: function(){return false}};
        localStorageSupported = 0;
    }
}catch(err){
    localStorage = {getItem: function(){return false}, setItem: function(){return false}, removeItem: function(){return false}};
    localStorageSupported = 0;
}
c(function(){
    if(window.location.href.indexOf('GooglePlay=true') > -1 || sessionStorage.getItem('GooglePlay') === 'true'){
        doLog("Google Play Mode enabled.");
        if(screen.height >= 1080){
            apps.settings.vars.setScale(0.5, 1);
        }
        apps.settings.vars.togClickToMove();
        sessionStorage.setItem('GooglePlay', 'true');
    }else{
        fitWindow();
    }
});
fadeResizeText();

window.LOCALFILES = {};
// set up LOCALFILES
if(localStorageSupported){
    if(!noUserFiles){
        if(localStorage.hasOwnProperty("LOCALFILES")){
            LOCALFILES = JSON.parse(localStorage.getItem("LOCALFILES"));
        }
    }
}
window.lfsave = function(file, content){
    sh("mkdir /LOCALFILES/" + file);
    eval(apps.bash.vars.translateDir('/LOCALFILES/' + file) + ' = content');
    if(!noUserFiles){
        localStorage.setItem("LOCALFILES", JSON.stringify(LOCALFILES));
    }
};
window.lfload = function(file, debug){
    try{
        if(debug){
            doLog("lfload " + file + ":", '#ABCDEF');
            doLog(apps.bash.vars.getRealDir('/LOCALFILES/' + file), '#ABCDEF');
        }
        return apps.bash.vars.getRealDir('/LOCALFILES/' + file);
    }catch(err){
        if(debug){
            doLog(err, '#FFCDEF');
        }
        return null;
    }
};
window.lfmkdir = function(dirname){
    sh("mkdir /LOCALFILES/" + dirname);
    if(!noUserFiles){
        localStorage.setItem("LOCALFILES", JSON.stringify(LOCALFILES));
    }
};
window.lfdel = function(filename){
    eval("delete " + apps.bash.vars.translateDir("/LOCALFILES/" + filename));
    if(!noUserFiles){
        localStorage.setItem("LOCALFILES", JSON.stringify(LOCALFILES));
    }
};

//auto-resize display on window change
window.addEventListener('resize', fitWindow);

//window.setTimeout(fitWindow, 1000);
//longtap support
var monMouseEvent = {};
function monMouseCheck(){
    try{
        if(typeof document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).oncontextmenu === 'function'){
            document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).oncontextmenu(monMouseEvent);
        }else if(typeof document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).oncontextmenu === 'string'){
            eval(document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).oncontextmenu);
        }else{
            doLog('Failed to find ctxmenu on ' + vartry('document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).id'));
        }
    }catch(err){
        doLog('Failed to open ctxmenu on ' + vartry('document.elementFromPoint(monMouseEvent.pageX, monMouseEvent.pageY).id'));
    }
}
function monMouseDown(evt){
    if(vartry("apps.settings.vars.longTap") === 1 && evt.touches.length > 1){
        evt.preventDefault();
        monMouseEvent = {pageX: evt.touches[0].pageX, pageY: evt.touches[0].pageY};
        monMouseCheck();
        return false;
    }
}
getId("monitor").addEventListener('touchstart', monMouseDown);

/*
c(function(){
    // print the time on the taskbar
    window.showTimeOnTaskbar = function(){
        timeElement.innerHTML = tskbrGetFpsStr() + tskbrGetLodStr() + tskbrGetNetStr() + tskbrGetTimeStr() + tskbrGetBatStr();
        if(!apps.settings.vars.performanceMode){
            window.requestAnimationFrame(showTimeOnTaskbar);
        }else{
            makeTimeout('aOS', 'showtimeontaskbar', 'showTimeOnTaskbar()', 1000);
        }
    }
    makeTimeout("aOS", "TaskbarTime", "showTimeOnTaskbar()", 0);
    // by default, runs every frame, but can run every second instead if it needs to
    window.requestAnimationFrame(showTimeOnTaskbar);
    
    window.setTimeout(countFPS, 0);
    // in 1 second, register network checkin with aOS task manager
    requestAnimationFrame(function(){
        makeInterval('aOS', 'NetwrkCheck', 'taskbarShowHardware()', 1000);
    });
});
*/
c(function(){
    window.setTimeout(countFPS, 0);
    requestAnimationFrame(function(){
        makeInterval('aOS', 'NtwrkCheck', 'taskbarShowHardware()', 1000);
    });
})

var keepingAwake = false;

// set up service worker
if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('serviceworker.js').then(function(registration){
      // Registration was successful
      //doLog('ServiceWorker registration successful with scope: ' + registration.scope, '#ABCDEF');
    }, function(err) {
      // registration failed :(
      try{
        doLog('ServiceWorker registration failed: ' + err, '#F00');
      }catch(err2){
          console.log('ServiceWorker registration failed: ' + err);
      }
    });
  });
}

c(function(){
    getId('aOSloadingInfo').innerHTML = 'Loading your files...';
    //getId('aosLoadingImage').src = "/loadDark.gif";
    // getId('aOSisLoading').style.cursor = cursors.loadDark;
    getId('aOSisLoading').classList.remove('cursorLoadLight');
    getId('aOSisLoading').classList.add('cursorLoadDark');
    
    initStatus = 1;
    doLog('Took ' + (perfCheck('masterInitAOS') / 1000) + 'ms to initialize.');
    perfStart("masterInitAOS");
    //aOSping(function(text){
    //    doLog('aOS server ping: ' + text[0] + ' &micro;s with status ' + text[1]);
    //});
    //corsPing(function(text){
    //    doLog('NORAA search service ping: ' + text[0] + ' &micro;s with status ' + text[1]);
    //});
    if(window.navigator.vendor !== "Google Inc."){
        doLog('AaronOS works best on Chrome. Some features may act strangely.', '#F00;text-decoration:underline');
        try{
            if(localStorage.getItem('notifyChrome') !== "1"){
                localStorage.setItem('notifyChrome', "1");
                apps.prompt.vars.notify('AaronOS works best on Chrome. Some features may act strangely.', [], function(){}, 'AaronOS', 'appicons/ds/aOS.png');
            }
        }catch(localStorageNotSupported){
            apps.prompt.vars.notify('AaronOS works best on Chrome. Some features may act strangely.', [], function(){}, 'AaronOS', 'appicons/ds/aOS.png');
        }
    }
    
    if(localStorageSupported){
        if(localStorage.getItem('latestVersion') !== aOSversion){
            apps.prompt.vars.notify(files.changelog.split('\n\n')[files.changelog.split('\n\n').length - 1].split('\n').join('<br>'), ['Changelog'], function(btn){if(btn === 0){openapp(apps.changelog);}}, 'New Update!', 'appicons/ds/CLg.png')
            localStorage.setItem('latestVersion', aOSversion);
        }
    }
    
    console.log("Done initializing aOS.");
});
var bootFileHTTP = new XMLHttpRequest();
bootFileHTTP.onreadystatechange = function(){
    if(bootFileHTTP.readyState === 4){
        if(bootFileHTTP.status === 200){
            USERFILES = JSON.parse(bootFileHTTP.responseText);
            if(USERFILES === null){
                USERFILES = {};
            }
        }else{
            alert("Failed to fetch your files. Web error " + bootFileHTTP.status);
        }
        doLog('Took ' + (perfCheck('masterInitAOS') / 1000) + 'ms to fetch USERFILES.');
        perfStart("masterInitAOS");
        m("init fileloader");
        getId("aOSloadingInfo").innerHTML += "<br>Your OS key is " + SRVRKEYWORD;
        for(var app in apps){
            getId("aOSloadingInfo").innerHTML="Loading your files...<br>Your OS key is" + SRVRKEYWORD + "<br>Loading " + app;
            try{
                apps[app].signalHandler("USERFILES_DONE");
            }catch(err){
                alert("Error initializing " + app + ":\n\n" + err);
            }
        }
        try{
            updateBgSize();
        }catch(err){
            
        }
        requestAnimationFrame(function(){bootFileHTTP = null;});
        doLog('Took ' + (perfCheck('masterInitAOS') / 1000) + 'ms to run startup apps.');
        doLog('Took ' + Math.round(performance.now() * 10) / 10 + 'ms grand total to reach desktop.');
        console.log("Load successful, apps alerted, and bootFileHTTP deleted.");
    }
};
c(function(){
    if(!noUserFiles){
        bootFileHTTP.open('GET', 'fileloaderBeta.php');
        bootFileHTTP.send();
    }else{
        doLog("WARNING - USERFILES disallowed by ?nofiles=true", '#FF7F00');
        USERFILES = {};
        doLog('Took ' + (perfCheck('masterInitAOS') / 1000) + 'ms to fetch USERFILES.');
        perfStart("masterInitAOS");
        m("init fileloader");
        getId("aOSloadingInfo").innerHTML += "<br>Your OS key is " + SRVRKEYWORD;
        for(var app in apps){
            getId("aOSloadingInfo").innerHTML="Loading your files...<br>Your OS key is" + SRVRKEYWORD + "<br>Loading " + app;
            try{
                apps[app].signalHandler("USERFILES_DONE");
            }catch(err){
                alert("Error initializing " + app + ":\n\n" + err);
            }
        }
        try{
            updateBgSize();
        }catch(err){
            
        }
        requestAnimationFrame(function(){bootFileHTTP = null;});
        doLog('Took ' + (perfCheck('masterInitAOS') / 1000) + 'ms to exec USERFILES_DONE.');
        doLog('Took ' + Math.round(performance.now() * 10) / 10 + 'ms grand total to reach desktop.');
        console.log("Load successful, apps alerted, and bootFileHTTP deleted.");
    }
});
c(function(){
    window.iframeblurcheck = function(){
        try{
            if(document.activeElement.getAttribute("data-parent-app")){
                if(currTopApp !== document.activeElement.getAttribute("data-parent-app")){
                    toTop(apps[document.activeElement.getAttribute("data-parent-app")]);
                }
            }
        }catch(err){
            
        }
    };
    setInterval(iframeblurcheck, 500);
    addEventListener("blur", iframeblurcheck);
});
totalWaitingCodes = codeToRun.length;
// 2000 lines of code! 9/18/2015
// 51 lines of code to go for 3000! 12/16/2015
// 3000 lines of code! 1/6/2016
// 5000 lines of code! 4/18/2016
// 6333 lines of code! 6/6/2016
// 7000 lines of code! 8/29/2016
// 130 lines of code to go for 8000! 9/10/2016
// 9500 lines of code! 10/21/2016
// 10454 lines of code! 12/24/2016
// 11194 lines of code! 2/3/2017
// 12736 lines of code! 6/2/2017
// 11145 lines of code! 2/13/2018
// 15023 lines of code! 4/3/2019
/*
    feels weird to see line of code landmarks down here after how i've been moving things lately...
    i wish i'd taken a count before i started moving apps into the repository
    reguardless, 15904 lines of code on 11/5/2020
*/