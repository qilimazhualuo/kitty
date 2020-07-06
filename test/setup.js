/**
 * ======================================
 *  Welcome to the JEST KG bootloader!
 * 
 *  dojo is problematic to load in the headless jest context,
 *  given that it is a bunch of AMD modules with a lot of XHR request in the .xd. wrapper we use
 * 
 *  Until this problem is fixed (and trust me, it's not straightforward), we will use the mocked dojo
 * 
 *  To at least load the game core, we are relying on the portable dojo.declare version and some fuckery with
 *  global namespaces
 * =======================================
 */

console.log("==== starting jest bootloader ====");

/* global 

    global,
    require,
    gamePage
*/
try {
    global.React = require("../lib/react.min.js");
    require("../lib/jQuery");

    //todo: make portable dojo for jest bootloader
    var createNamespace = require("./declare");

    //---------- inventing creative workarounds since 20XX -------
    var namespace = { com: {}, classes: {}, mixin: {} };
    var dojo = createNamespace(namespace);
    global.com = namespace.com;
    global.classes = namespace.classes;
    global.mixin = namespace.mixin;

    //-------------------------------------------------------------
    //we can't load dojo so let's just mock it (what could possibly go wrong)
    global.dojo = {
        version: {minor: 6},
        declare: dojo.declare,
        destroy: function(){},
        empty: function(){},
        byId: function(){},
        forEach: function(){},
        clone: function(mixin){return Object.assign({}, mixin);},
        hitch: function(){},
        connect: function(){},
        publish: function(){},
        subscribe: function(){}
    };

    require("../lib/lz-string.js");
    require("../lib/dropbox_v2.js");
    require("../lib/system.js");

    window.LCstorage = window.localStorage;
    if (document.all && !window.localStorage) {
        window.LCstorage = {};
        window.LCstorage.removeItem = function () { };
    }

    require("../config");
    require("../core");

    //mock $I
    global.$I = function(key, args) {
        return "$" + key + "$";
    };

    require("../js/resources");
    require("../js/calendar");
    require("../js/buildings");
    require("../js/village");
    require("../js/science");
    require("../js/workshop");
    require("../js/diplomacy");
    require("../js/religion");

    require("../js/achievements");
    require("../js/space");
    require("../js/prestige");
    require("../js/time");
    require("../js/stats");
    require("../js/challenges");
    require("../js/void");
    require("../js/math");
    require("../game");
    require("../js/jsx/left.jsx");
    require("../js/jsx/map.jsx");
    require("../js/ui");
    require("../js/toolbar");

    global.gamePage = global.game = new com.nuclearunicorn.game.ui.GamePage();
    //TODO: use special UI system specifically for unit tests
    game.setUI(new classes.ui.UISystem("gameContainerId"));
}
catch (e) {
    console.log("oh no big error");
    console.error(e);
}