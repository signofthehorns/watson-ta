/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

throw new Error("Module build failed: SyntaxError: Adjacent JSX elements must be wrapped in an enclosing tag (109:6)\n\n\u001b[0m \u001b[90m 107 | \u001b[39m    \u001b[36mreturn\u001b[39m (\n \u001b[90m 108 | \u001b[39m      \u001b[33m<\u001b[39m\u001b[33mdt\u001b[39m\u001b[33m>\u001b[39m\u001b[33m<\u001b[39m\u001b[33mcode\u001b[39m\u001b[33m>\u001b[39m{ spinner }\u001b[33m<\u001b[39m\u001b[33m/\u001b[39m\u001b[33mcode\u001b[39m\u001b[33m>\u001b[39m\u001b[33m<\u001b[39m\u001b[33m/\u001b[39m\u001b[33mdt\u001b[39m\u001b[33m>\u001b[39m\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 109 | \u001b[39m      \u001b[33m<\u001b[39m\u001b[33mdd\u001b[39m\u001b[33m>\u001b[39m{\u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mprops\u001b[33m.\u001b[39mtask}\u001b[33m<\u001b[39m\u001b[33m/\u001b[39m\u001b[33mdd\u001b[39m\u001b[33m>\u001b[39m\n \u001b[90m     | \u001b[39m      \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 110 | \u001b[39m    )\u001b[33m;\u001b[39m\n \u001b[90m 111 | \u001b[39m  }\n \u001b[90m 112 | \u001b[39m})\u001b[33m;\u001b[39m\u001b[0m\n");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(0);
module.exports = __webpack_require__(0);


/***/ }
/******/ ]);