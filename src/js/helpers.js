/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Convert group name, token name and possible prefix into camelCased string, joining everything together
 */
Pulsar.registerFunction("readableVariableName", function (token, tokenGroup, prefix) {
    // Create array with all path segments and token name at the end
    const segments = [...tokenGroup.path];
    if (!tokenGroup.isRoot && token.TokenType !== 'Typography') {
        segments.push(tokenGroup.name);
    }
    segments.push(token.name);
    if (prefix && prefix.length > 0) {
        segments.unshift(prefix);
    }
    // Create "sentence" separated by spaces so we can camelcase it all
    let sentence = segments.join(" ");
    // camelcase string from all segments
    sentence = sentence
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    // only allow letters, digits, underscore and hyphen
    sentence = sentence.replace(/[^a-zA-Z0-9_-]/g, '_');
    // prepend underscore if it starts with digit 
    if (/^\d/.test(sentence)) {
        sentence = '_' + sentence;
    }
    return sentence;
});
function findAliases(token, allTokens) {
    let aliases = allTokens.filter(t => t.value.referencedToken && t.value.referencedToken.id === token.id);
    for (const t of aliases) {
        aliases = aliases.concat(findAliases(t, allTokens));
    }
    return aliases;
}
Pulsar.registerFunction("findAliases", findAliases);
Pulsar.registerFunction("gradientAngle", function (from, to) {
    var deltaY = (to.y - from.y);
    var deltaX = (to.x - from.x);
    var radians = Math.atan2(deltaY, deltaX);
    var result = radians * 180 / Math.PI;
    result = result + 90;
    return ((result < 0) ? (360 + result) : result) % 360;
});
/**
 * Behavior configuration of the exporter
 * Prefixes: Add prefix for each category of the tokens. For example, all colors can start with "color, if needed"
 */
Pulsar.registerPayload("behavior", {
    colorTokenPrefix: "color",
    borderTokenPrefix: "border",
    gradientTokenPrefix: "gradient",
    measureTokenPrefix: "measure",
    shadowTokenPrefix: "shadow",
    typographyTokenPrefix: "typography",
});
/** Describe complex shadow token */
Pulsar.registerFunction("shadowDescription", function (shadowToken) {
    let connectedShadow = "transparent";
    if (shadowToken.shadowLayers) {
        connectedShadow = shadowToken.shadowLayers.reverse().map((shadow) => {
            return shadowTokenValue(shadow);
        }).join(", ");
    }
    else {
        return shadowTokenValue(shadowToken);
    }
    return connectedShadow !== null && connectedShadow !== void 0 ? connectedShadow : "";
});
/** Convert complex shadow value to CSS representation */
function shadowTokenValue(shadowToken) {
    var blurRadius = getValueWithCorrectUnit(nonNegativeValue(shadowToken.value.radius.measure));
    var offsetX = getValueWithCorrectUnit(shadowToken.value.x.measure);
    var offsetY = getValueWithCorrectUnit(shadowToken.value.y.measure);
    var spreadRadius = getValueWithCorrectUnit(shadowToken.value.spread.measure);
    return `${shadowToken.value.type === "Inner" ? "inset " : ""}${offsetX} ${offsetY} ${blurRadius} ${spreadRadius} ${getFormattedRGB(shadowToken.value.color)}`;
}
function getValueWithCorrectUnit(value) {
    if (value === 0) {
        return `${value}`;
    }
    else {
        // todo: add support for other units (px, rem, em, etc.)
        return `${value}px`;
    }
}
function nonNegativeValue(num) {
    if (num <= 0) {
        return 0;
    }
    else {
        return num;
    }
}
/** Convert type to CSS unit */
function measureTypeIntoReadableUnit(type) {
    switch (type) {
        case "Points":
            return "pt";
        case "Pixels":
            return "px";
        case "Percent":
            return "%";
        case "Ems":
            return "em";
    }
}
function getFormattedRGB(colorValue) {
    if (colorValue.a === 0) {
        return `rgb(${colorValue.r},${colorValue.g},${colorValue.b})`;
    }
    else {
        const opacity = Math.round((colorValue.a / 255) * 100) / 100;
        return `rgba(${colorValue.r},${colorValue.g},${colorValue.b},${opacity})`;
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsbURBQW1ELEVBQUUsUUFBUSxHQUFHLFFBQVEsR0FBRyxXQUFXLEdBQUcsYUFBYSxHQUFHLHlDQUF5QztBQUNoSztBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsTUFBTTtBQUN4QjtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsTUFBTTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixhQUFhLEdBQUcsYUFBYSxHQUFHLGFBQWE7QUFDbkU7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGFBQWEsR0FBRyxhQUFhLEdBQUcsYUFBYSxHQUFHLFFBQVE7QUFDL0U7QUFDQSIsImZpbGUiOiJoZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIvKipcclxuICogQ29udmVydCBncm91cCBuYW1lLCB0b2tlbiBuYW1lIGFuZCBwb3NzaWJsZSBwcmVmaXggaW50byBjYW1lbENhc2VkIHN0cmluZywgam9pbmluZyBldmVyeXRoaW5nIHRvZ2V0aGVyXHJcbiAqL1xyXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcInJlYWRhYmxlVmFyaWFibGVOYW1lXCIsIGZ1bmN0aW9uICh0b2tlbiwgdG9rZW5Hcm91cCwgcHJlZml4KSB7XHJcbiAgICAvLyBDcmVhdGUgYXJyYXkgd2l0aCBhbGwgcGF0aCBzZWdtZW50cyBhbmQgdG9rZW4gbmFtZSBhdCB0aGUgZW5kXHJcbiAgICBjb25zdCBzZWdtZW50cyA9IFsuLi50b2tlbkdyb3VwLnBhdGhdO1xyXG4gICAgaWYgKCF0b2tlbkdyb3VwLmlzUm9vdCAmJiB0b2tlbi5Ub2tlblR5cGUgIT09ICdUeXBvZ3JhcGh5Jykge1xyXG4gICAgICAgIHNlZ21lbnRzLnB1c2godG9rZW5Hcm91cC5uYW1lKTtcclxuICAgIH1cclxuICAgIHNlZ21lbnRzLnB1c2godG9rZW4ubmFtZSk7XHJcbiAgICBpZiAocHJlZml4ICYmIHByZWZpeC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgc2VnbWVudHMudW5zaGlmdChwcmVmaXgpO1xyXG4gICAgfVxyXG4gICAgLy8gQ3JlYXRlIFwic2VudGVuY2VcIiBzZXBhcmF0ZWQgYnkgc3BhY2VzIHNvIHdlIGNhbiBjYW1lbGNhc2UgaXQgYWxsXHJcbiAgICBsZXQgc2VudGVuY2UgPSBzZWdtZW50cy5qb2luKFwiIFwiKTtcclxuICAgIC8vIGNhbWVsY2FzZSBzdHJpbmcgZnJvbSBhbGwgc2VnbWVudHNcclxuICAgIHNlbnRlbmNlID0gc2VudGVuY2VcclxuICAgICAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgIC5yZXBsYWNlKC9bXmEtekEtWjAtOV0rKC4pL2csIChtLCBjaHIpID0+IGNoci50b1VwcGVyQ2FzZSgpKTtcclxuICAgIC8vIG9ubHkgYWxsb3cgbGV0dGVycywgZGlnaXRzLCB1bmRlcnNjb3JlIGFuZCBoeXBoZW5cclxuICAgIHNlbnRlbmNlID0gc2VudGVuY2UucmVwbGFjZSgvW15hLXpBLVowLTlfLV0vZywgJ18nKTtcclxuICAgIC8vIHByZXBlbmQgdW5kZXJzY29yZSBpZiBpdCBzdGFydHMgd2l0aCBkaWdpdCBcclxuICAgIGlmICgvXlxcZC8udGVzdChzZW50ZW5jZSkpIHtcclxuICAgICAgICBzZW50ZW5jZSA9ICdfJyArIHNlbnRlbmNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNlbnRlbmNlO1xyXG59KTtcclxuZnVuY3Rpb24gZmluZEFsaWFzZXModG9rZW4sIGFsbFRva2Vucykge1xyXG4gICAgbGV0IGFsaWFzZXMgPSBhbGxUb2tlbnMuZmlsdGVyKHQgPT4gdC52YWx1ZS5yZWZlcmVuY2VkVG9rZW4gJiYgdC52YWx1ZS5yZWZlcmVuY2VkVG9rZW4uaWQgPT09IHRva2VuLmlkKTtcclxuICAgIGZvciAoY29uc3QgdCBvZiBhbGlhc2VzKSB7XHJcbiAgICAgICAgYWxpYXNlcyA9IGFsaWFzZXMuY29uY2F0KGZpbmRBbGlhc2VzKHQsIGFsbFRva2VucykpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFsaWFzZXM7XHJcbn1cclxuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJmaW5kQWxpYXNlc1wiLCBmaW5kQWxpYXNlcyk7XHJcblB1bHNhci5yZWdpc3RlckZ1bmN0aW9uKFwiZ3JhZGllbnRBbmdsZVwiLCBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcclxuICAgIHZhciBkZWx0YVkgPSAodG8ueSAtIGZyb20ueSk7XHJcbiAgICB2YXIgZGVsdGFYID0gKHRvLnggLSBmcm9tLngpO1xyXG4gICAgdmFyIHJhZGlhbnMgPSBNYXRoLmF0YW4yKGRlbHRhWSwgZGVsdGFYKTtcclxuICAgIHZhciByZXN1bHQgPSByYWRpYW5zICogMTgwIC8gTWF0aC5QSTtcclxuICAgIHJlc3VsdCA9IHJlc3VsdCArIDkwO1xyXG4gICAgcmV0dXJuICgocmVzdWx0IDwgMCkgPyAoMzYwICsgcmVzdWx0KSA6IHJlc3VsdCkgJSAzNjA7XHJcbn0pO1xyXG4vKipcclxuICogQmVoYXZpb3IgY29uZmlndXJhdGlvbiBvZiB0aGUgZXhwb3J0ZXJcclxuICogUHJlZml4ZXM6IEFkZCBwcmVmaXggZm9yIGVhY2ggY2F0ZWdvcnkgb2YgdGhlIHRva2Vucy4gRm9yIGV4YW1wbGUsIGFsbCBjb2xvcnMgY2FuIHN0YXJ0IHdpdGggXCJjb2xvciwgaWYgbmVlZGVkXCJcclxuICovXHJcblB1bHNhci5yZWdpc3RlclBheWxvYWQoXCJiZWhhdmlvclwiLCB7XHJcbiAgICBjb2xvclRva2VuUHJlZml4OiBcImNvbG9yXCIsXHJcbiAgICBib3JkZXJUb2tlblByZWZpeDogXCJib3JkZXJcIixcclxuICAgIGdyYWRpZW50VG9rZW5QcmVmaXg6IFwiZ3JhZGllbnRcIixcclxuICAgIG1lYXN1cmVUb2tlblByZWZpeDogXCJtZWFzdXJlXCIsXHJcbiAgICBzaGFkb3dUb2tlblByZWZpeDogXCJzaGFkb3dcIixcclxuICAgIHR5cG9ncmFwaHlUb2tlblByZWZpeDogXCJ0eXBvZ3JhcGh5XCIsXHJcbn0pO1xyXG4vKiogRGVzY3JpYmUgY29tcGxleCBzaGFkb3cgdG9rZW4gKi9cclxuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJzaGFkb3dEZXNjcmlwdGlvblwiLCBmdW5jdGlvbiAoc2hhZG93VG9rZW4pIHtcclxuICAgIGxldCBjb25uZWN0ZWRTaGFkb3cgPSBcInRyYW5zcGFyZW50XCI7XHJcbiAgICBpZiAoc2hhZG93VG9rZW4uc2hhZG93TGF5ZXJzKSB7XHJcbiAgICAgICAgY29ubmVjdGVkU2hhZG93ID0gc2hhZG93VG9rZW4uc2hhZG93TGF5ZXJzLnJldmVyc2UoKS5tYXAoKHNoYWRvdykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gc2hhZG93VG9rZW5WYWx1ZShzaGFkb3cpO1xyXG4gICAgICAgIH0pLmpvaW4oXCIsIFwiKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzaGFkb3dUb2tlblZhbHVlKHNoYWRvd1Rva2VuKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb25uZWN0ZWRTaGFkb3cgIT09IG51bGwgJiYgY29ubmVjdGVkU2hhZG93ICE9PSB2b2lkIDAgPyBjb25uZWN0ZWRTaGFkb3cgOiBcIlwiO1xyXG59KTtcclxuLyoqIENvbnZlcnQgY29tcGxleCBzaGFkb3cgdmFsdWUgdG8gQ1NTIHJlcHJlc2VudGF0aW9uICovXHJcbmZ1bmN0aW9uIHNoYWRvd1Rva2VuVmFsdWUoc2hhZG93VG9rZW4pIHtcclxuICAgIHZhciBibHVyUmFkaXVzID0gZ2V0VmFsdWVXaXRoQ29ycmVjdFVuaXQobm9uTmVnYXRpdmVWYWx1ZShzaGFkb3dUb2tlbi52YWx1ZS5yYWRpdXMubWVhc3VyZSkpO1xyXG4gICAgdmFyIG9mZnNldFggPSBnZXRWYWx1ZVdpdGhDb3JyZWN0VW5pdChzaGFkb3dUb2tlbi52YWx1ZS54Lm1lYXN1cmUpO1xyXG4gICAgdmFyIG9mZnNldFkgPSBnZXRWYWx1ZVdpdGhDb3JyZWN0VW5pdChzaGFkb3dUb2tlbi52YWx1ZS55Lm1lYXN1cmUpO1xyXG4gICAgdmFyIHNwcmVhZFJhZGl1cyA9IGdldFZhbHVlV2l0aENvcnJlY3RVbml0KHNoYWRvd1Rva2VuLnZhbHVlLnNwcmVhZC5tZWFzdXJlKTtcclxuICAgIHJldHVybiBgJHtzaGFkb3dUb2tlbi52YWx1ZS50eXBlID09PSBcIklubmVyXCIgPyBcImluc2V0IFwiIDogXCJcIn0ke29mZnNldFh9ICR7b2Zmc2V0WX0gJHtibHVyUmFkaXVzfSAke3NwcmVhZFJhZGl1c30gJHtnZXRGb3JtYXR0ZWRSR0Ioc2hhZG93VG9rZW4udmFsdWUuY29sb3IpfWA7XHJcbn1cclxuZnVuY3Rpb24gZ2V0VmFsdWVXaXRoQ29ycmVjdFVuaXQodmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gdG9kbzogYWRkIHN1cHBvcnQgZm9yIG90aGVyIHVuaXRzIChweCwgcmVtLCBlbSwgZXRjLilcclxuICAgICAgICByZXR1cm4gYCR7dmFsdWV9cHhgO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG5vbk5lZ2F0aXZlVmFsdWUobnVtKSB7XHJcbiAgICBpZiAobnVtIDw9IDApIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBudW07XHJcbiAgICB9XHJcbn1cclxuLyoqIENvbnZlcnQgdHlwZSB0byBDU1MgdW5pdCAqL1xyXG5mdW5jdGlvbiBtZWFzdXJlVHlwZUludG9SZWFkYWJsZVVuaXQodHlwZSkge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcIlBvaW50c1wiOlxyXG4gICAgICAgICAgICByZXR1cm4gXCJwdFwiO1xyXG4gICAgICAgIGNhc2UgXCJQaXhlbHNcIjpcclxuICAgICAgICAgICAgcmV0dXJuIFwicHhcIjtcclxuICAgICAgICBjYXNlIFwiUGVyY2VudFwiOlxyXG4gICAgICAgICAgICByZXR1cm4gXCIlXCI7XHJcbiAgICAgICAgY2FzZSBcIkVtc1wiOlxyXG4gICAgICAgICAgICByZXR1cm4gXCJlbVwiO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldEZvcm1hdHRlZFJHQihjb2xvclZhbHVlKSB7XHJcbiAgICBpZiAoY29sb3JWYWx1ZS5hID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGByZ2IoJHtjb2xvclZhbHVlLnJ9LCR7Y29sb3JWYWx1ZS5nfSwke2NvbG9yVmFsdWUuYn0pYDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG9wYWNpdHkgPSBNYXRoLnJvdW5kKChjb2xvclZhbHVlLmEgLyAyNTUpICogMTAwKSAvIDEwMDtcclxuICAgICAgICByZXR1cm4gYHJnYmEoJHtjb2xvclZhbHVlLnJ9LCR7Y29sb3JWYWx1ZS5nfSwke2NvbG9yVmFsdWUuYn0sJHtvcGFjaXR5fSlgO1xyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=