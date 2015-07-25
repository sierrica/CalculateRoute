if (!window.qxp) qxp = {};
if (!qxp.Settings) qxp.Settings = {};
if (!qxp.Settings._customSettings) qxp.Settings._customSettings = {};
if (!qxp.Settings._customSettings["qxp.core.Init"]) qxp.Settings._customSettings["qxp.core.Init"] = {};
qxp.Settings._customSettings["qxp.core.Init"]["component"] = "qxp.component.init.BasicInitComponent";



/* ID: qxp.Settings */
if (!window.qxp) {
    qxp = {};
}
if (window.qxpNamespaceCompat) {
    qx = qxp;
}
if (!qxp.Settings) {
    qxp.Settings = {};
}
if (!qxp.Settings._customSettings) {
    qxp.Settings._customSettings = {};
}
qxp.Settings._defaultSettings = {};
qxp._LOADSTART = (new Date).valueOf();
qxp.Settings.substitute = function(vTemplate) {
    if (typeof vTemplate !== "string") {
        return vTemplate;
    }
    return vTemplate.replace(/\%\{(.+)\}/g, function(vMatch, vKey) {
        return eval(vKey);
    });
};
qxp.Settings.getValueOfClass = function(vClassName, vKey) {
    var vCustomObject = qxp.Settings._customSettings[vClassName];
    if (vCustomObject && vCustomObject[vKey] != null) {
        return vCustomObject[vKey];
    }
    var vDefaultObject = qxp.Settings._defaultSettings[vClassName];
    if (vDefaultObject && vDefaultObject[vKey] != null) {
        return vDefaultObject[vKey];
    }
    return null;
};
qxp.Settings.setDefault = function(vKey, vValue) {
    return qxp.Settings.setDefaultOfClass(qxp.Class.classname, vKey, vValue);
};
qxp.Settings.setDefaultOfClass = function(vClassName, vKey, vValue) {
    var vDefaultObject = qxp.Settings._defaultSettings[vClassName];
    if (!vDefaultObject) {
        vDefaultObject = qxp.Settings._defaultSettings[vClassName] = {};
    }
    vDefaultObject[vKey] = vValue;
};
qxp.Settings.setCustomOfClass = function(vClassName, vKey, vValue) {
    var vCustomObject = qxp.Settings._customSettings[vClassName];
    if (!vCustomObject) {
        vCustomObject = qxp.Settings._customSettings[vClassName] = {};
    }
    vCustomObject[vKey] = qxp.Settings.substitute(vValue);
};
qxp.Settings.init = function() {
    for (var vClass in qxp.Settings._customSettings) {
        var vSettings = qxp.Settings._customSettings[vClass];
        for (var vKey in vSettings) {
            qxp.Settings.setCustomOfClass(vClass, vKey, vSettings[vKey]);
        }
    }
};
qxp.Settings.init();




/* ID: qxp.OO */
qxp.OO = {};
qxp.OO.classes = {};
qxp.OO.setter = {};
qxp.OO.getter = {};
qxp.OO.resetter = {};
qxp.OO.values = {};
qxp.OO.propertyNumber = 0;
qxp.OO.C_SET = "set";
qxp.OO.C_GET = "get";
qxp.OO.C_APPLY = "apply";
qxp.OO.C_RESET = "reset";
qxp.OO.C_FORCE = "force";
qxp.OO.C_TOGGLE = "toggle";
qxp.OO.C_CHANGE = "change";
qxp.OO.C_STORE = "store";
qxp.OO.C_RETRIEVE = "retrieve";
qxp.OO.C_PRIVATECHANGE = "_change";
qxp.OO.C_INVALIDATE = "_invalidate";
qxp.OO.C_INVALIDATED = "_invalidated";
qxp.OO.C_RECOMPUTE = "_recompute";
qxp.OO.C_CACHED = "_cached";
qxp.OO.C_COMPUTE = "_compute";
qxp.OO.C_COMPUTED = "_computed";
qxp.OO.C_UNITDETECTION = "_unitDetection";
qxp.OO.C_GLOBALPROPERTYREF = "PROPERTY_";
qxp.OO.C_UNIT_VALUE = "Value";
qxp.OO.C_UNIT_PARSED = "Parsed";
qxp.OO.C_UNIT_TYPE = "Type";
qxp.OO.C_UNIT_TYPE_NULL = "TypeNull";
qxp.OO.C_UNIT_TYPE_PIXEL = "TypePixel";
qxp.OO.C_UNIT_TYPE_PERCENT = "TypePercent";
qxp.OO.C_UNIT_TYPE_AUTO = "TypeAuto";
qxp.OO.C_UNIT_TYPE_FLEX = "TypeFlex";
qxp.OO.C_GETDEFAULT = "getDefault";
qxp.OO.C_SETDEFAULT = "setDefault";
qxp.OO.C_RETRIEVEDEFAULT = "retrieveDefault";
qxp.OO.C_STOREDEFAULT = "storeDefault";
qxp.OO.C_VALUE = "_value";
qxp.OO.C_NULL = "_null";
qxp.OO.C_EVAL = "_eval";
qxp.OO.C_CHECK = "_check";
qxp.OO.C_MODIFY = "_modify";
qxp.OO.C_NAMESPACE_SEP = ".";
qxp.OO.C_UNDEFINED = "undefined";
qxp.OO.defineClass = function(vClassName, vSuper, vConstructor) {
    var vSplitName = vClassName.split(qxp.OO.C_NAMESPACE_SEP);
    var vNameLength = vSplitName.length - 1;
    var vTempObject = window;
    for (var i = 0; i < vNameLength; i++) {
        if (typeof vTempObject[vSplitName[i]] === qxp.OO.C_UNDEFINED) {
            vTempObject[vSplitName[i]] = {};
        }
        vTempObject = vTempObject[vSplitName[i]];
    }
    if (typeof vSuper === qxp.OO.C_UNDEFINED) {
        if (typeof vConstructor !== qxp.OO.C_UNDEFINED) {
            throw new Error("SuperClass is undefined, but constructor was given for class: " + vClassName);
        }
        qxp.Class = vTempObject[vSplitName[i]] = {};
        qxp.Proto = null;
        qxp.Super = null;
    } else if (typeof vConstructor === qxp.OO.C_UNDEFINED) {
        qxp.Class = vTempObject[vSplitName[i]] = vSuper;
        qxp.Proto = null;
        qxp.Super = vSuper;
    } else {
        qxp.Class = vTempObject[vSplitName[i]] = vConstructor;
        var vHelperConstructor = function() {};
        vHelperConstructor.prototype = vSuper.prototype;
        qxp.Proto = vConstructor.prototype = new vHelperConstructor;
        qxp.Super = vConstructor.superclass = vSuper;
        qxp.Proto.classname = vConstructor.classname = vClassName;
        qxp.Proto.constructor = vConstructor;
    }
    qxp.OO.classes[vClassName] = qxp.Class;
};
qxp.OO.addFastProperty = function(vConfig) {
    var vName = vConfig.name;
    var vUpName = qxp.lang.String.toFirstUp(vName);
    var vStorageField = qxp.OO.C_VALUE + vUpName;
    var vGetterName = qxp.OO.C_GET + vUpName;
    var vSetterName = qxp.OO.C_SET + vUpName;
    var vComputerName = qxp.OO.C_COMPUTE + vUpName;
    qxp.Proto[vStorageField] = typeof vConfig.defaultValue !== qxp.constant.Type.UNDEFINED ? vConfig.defaultValue : null;
    if (vConfig.noCompute) {
        qxp.Proto[vGetterName] = function() {
            return this[vStorageField];
        };
    } else {
        qxp.Proto[vGetterName] = function() {
            return this[vStorageField] == null ? this[vStorageField] = this[vComputerName]() : this[vStorageField];
        };
    }
    if (vConfig.setOnlyOnce) {
        qxp.Proto[vSetterName] = function(vValue) {
            this[vStorageField] = vValue;
            this[vSetterName] = null;
            return vValue;
        };
    } else {
        qxp.Proto[vSetterName] = function(vValue) {
            return this[vStorageField] = vValue;
        };
    }
    if (!vConfig.noCompute) {
        qxp.Proto[vComputerName] = function() {
            return null;
        };
    }
};
qxp.OO._createProperty = function(p) {
    if (typeof p !== qxp.constant.Type.OBJECT) {
        throw new Error("AddProperty: Param should be an object!");
    }
    if (qxp.util.Validation.isInvalid(p.name)) {
        throw new Error("AddProperty: Malformed input parameters: name needed!");
    }
    var pp = qxp.Proto;
    p.method = qxp.lang.String.toFirstUp(p.name);
    p.implMethod = p.impl ? qxp.lang.String.toFirstUp(p.impl) : p.method;
    if (qxp.util.Validation.isInvalid(p.defaultValue)) {
        p.defaultValue = null;
    }
    if (qxp.util.Validation.isInvalidBoolean(p.allowNull)) {
        p.allowNull = true;
    }
    if (qxp.util.Validation.isInvalidBoolean(p.allowMultipleArguments)) {
        p.allowMultipleArguments = false;
    }
    if (typeof p.type === qxp.constant.Type.STRING) {
        p.hasType = true;
    } else if (typeof p.type !== qxp.constant.Type.UNDEFINED) {
        throw new Error("AddProperty: Invalid type definition for property " + p.name + ": " + p.type);
    } else {
        p.hasType = false;
    }
    if (typeof p.instance === qxp.constant.Type.STRING) {
        p.hasInstance = true;
    } else if (typeof p.instance !== qxp.constant.Type.UNDEFINED) {
        throw new Error("AddProperty: Invalid instance definition for property " + p.name + ": " + p.instance);
    } else {
        p.hasInstance = false;
    }
    if (typeof p.classname === qxp.constant.Type.STRING) {
        p.hasClassName = true;
    } else if (typeof p.classname !== qxp.constant.Type.UNDEFINED) {
        throw new Error("AddProperty: Invalid classname definition for property " + p.name + ": " + p.classname);
    } else {
        p.hasClassName = false;
    }
    p.hasConvert = qxp.util.Validation.isValidFunction(p.convert);
    p.hasPossibleValues = qxp.util.Validation.isValidArray(p.possibleValues);
    p.hasUnitDetection = qxp.util.Validation.isValidString(p.unitDetection);
    p.addToQueue = p.addToQueue || false;
    p.addToQueueRuntime = p.addToQueueRuntime || false;
    p.up = p.name.toUpperCase();
    qxp.OO[qxp.OO.C_GLOBALPROPERTYREF + p.up] = p.name;
    var valueKey = qxp.OO.C_VALUE + p.method;
    var evalKey = qxp.OO.C_EVAL + p.method;
    var changeKey = qxp.OO.C_CHANGE + p.method;
    var modifyKey = qxp.OO.C_MODIFY + p.implMethod;
    var checkKey = qxp.OO.C_CHECK + p.implMethod;
    if (!qxp.OO.setter[p.name]) {
        qxp.OO.setter[p.name] = qxp.OO.C_SET + p.method;
        qxp.OO.getter[p.name] = qxp.OO.C_GET + p.method;
        qxp.OO.resetter[p.name] = qxp.OO.C_RESET + p.method;
        qxp.OO.values[p.name] = valueKey;
    }
    if (p.hasUnitDetection) {
        var cu = qxp.OO.C_COMPUTED + p.method;
        pp[cu + qxp.OO.C_UNIT_VALUE] = null;
        pp[cu + qxp.OO.C_UNIT_PARSED] = null;
        pp[cu + qxp.OO.C_UNIT_TYPE] = null;
        pp[cu + qxp.OO.C_UNIT_TYPE_NULL] = true;
        pp[cu + qxp.OO.C_UNIT_TYPE_PIXEL] = false;
        pp[cu + qxp.OO.C_UNIT_TYPE_PERCENT] = false;
        pp[cu + qxp.OO.C_UNIT_TYPE_AUTO] = false;
        pp[cu + qxp.OO.C_UNIT_TYPE_FLEX] = false;
        var unitDetectionKey = qxp.OO.C_UNITDETECTION + qxp.lang.String.toFirstUp(p.unitDetection);
    }
    pp[valueKey] = p.defaultValue;
    pp[qxp.OO.C_GET + p.method] = function() {
        return this[valueKey];
    };
    pp[qxp.OO.C_FORCE + p.method] = function(newValue) {
        return this[valueKey] = newValue;
    };
    pp[qxp.OO.C_RESET + p.method] = function() {
        return this[qxp.OO.C_SET + p.method](p.defaultValue);
    };
    if (p.type === qxp.constant.Type.BOOLEAN) {
        pp[qxp.OO.C_TOGGLE + p.method] = function(newValue) {
            return this[qxp.OO.C_SET + p.method](!this[valueKey]);
        };
    }
    if (p.allowMultipleArguments || p.hasConvert || p.hasInstance || p.hasClassName || p.hasPossibleValues || p.hasUnitDetection || p.addToQueue || p.addToQueueRuntime || p.addToStateQueue) {
        pp[qxp.OO.C_SET + p.method] = function(newValue) {
            if (p.allowMultipleArguments && arguments.length > 1) {
                newValue = qxp.lang.Array.fromArguments(arguments);
            }
            if (p.hasConvert) {
                try {
                    newValue = p.convert.call(this, newValue, p);
                } catch (ex) {
                    throw new Error("Attention! Could not convert new value for " + p.name + ": " + newValue + ": " + ex);
                }
            }
            var oldValue = this[valueKey];
            if (newValue === oldValue) {
                return newValue;
            }
            if (!(p.allowNull && newValue == null)) {
                if (p.hasType && typeof newValue !== p.type) {
                    return this.error("Attention! The value \"" + newValue + "\" is an invalid value for the property \"" + p.name + "\" which must be typeof \"" + p.type + "\" but is typeof \"" + typeof newValue + "\"!", new Error());
                }
                if (p.hasInstance && !(newValue instanceof qxp.OO.classes[p.instance])) {
                    return this.error("Attention! The value \"" + newValue + "\" is an invalid value for the property \"" + p.name + "\" which must be an instance of \"" + p.instance + "\"!", new Error());
                }
                if (p.hasClassName && newValue.classname != p.classname) {
                    return this.error("Attention! The value \"" + newValue + "\" is an invalid value for the property \"" + p.name + "\" which must be an object with the classname \"" + p.classname + "\"!", new Error());
                }
                if (p.hasPossibleValues && newValue != null && !qxp.lang.Array.contains(p.possibleValues, newValue)) {
                    return this.error("Failed to save value for " + p.name + ". '" + newValue + "' is not a possible value!", new Error());
                }
            }
            if (this[checkKey]) {
                try {
                    newValue = this[checkKey](newValue, p);
                    if (newValue === oldValue) {
                        return newValue;
                    }
                } catch (ex) {
                    return this.error("Failed to check property " + p.name, ex);
                }
            }
            this[valueKey] = newValue;
            if (this[modifyKey]) {
                try {
                    this[modifyKey](newValue, oldValue, p);
                } catch (ex) {
                    return this.error("Modification of property \"" + p.name + "\" failed with exception", ex);
                }
            }
            if (p.hasUnitDetection) {
                this[unitDetectionKey](p, newValue);
            }
            if (p.addToQueue) {
                this.addToQueue(p.name);
            } else if (p.addToQueueRuntime) {
                this.addToQueueRuntime(p.name);
            }
            if (p.addToStateQueue) {
                this.addToStateQueue();
            }
            if (this.hasEventListeners && this.hasEventListeners(changeKey)) {
                try {
                    this.createDispatchDataEvent(changeKey, newValue);
                } catch (ex) {
                    throw new Error("Property " + p.name + " modified: Failed to dispatch change event: " + ex);
                }
            }
            return newValue;
        };
    } else {
        pp[qxp.OO.C_SET + p.method] = function(newValue) {
            var oldValue = this[valueKey];
            if (newValue === oldValue) {
                return newValue;
            }
            if (!(p.allowNull && newValue == null)) {
                if (p.hasType && typeof newValue !== p.type) {
                    return this.error("Attention! The value \"" + newValue + "\" is an invalid value for the property \"" + p.name + "\" which must be typeof \"" + p.type + "\" but is typeof \"" + typeof newValue + "\"!", new Error());
                }
            }
            if (this[checkKey]) {
                try {
                    newValue = this[checkKey](newValue, p);
                    if (newValue === oldValue) {
                        return newValue;
                    }
                } catch (ex) {
                    return this.error("Failed to check property " + p.name, ex);
                }
            }
            this[valueKey] = newValue;
            if (this[modifyKey]) {
                try {
                    this[modifyKey](newValue, oldValue, p);
                } catch (ex) {
                    return this.error("Modification of property \"" + p.name + "\" failed with exception", ex);
                }
            }
            if (this.hasEventListeners && this.hasEventListeners(changeKey)) {
                var vEvent = new qxp.event.type.DataEvent(changeKey, newValue, oldValue, false);
                vEvent.setTarget(this);
                try {
                    this.dispatchEvent(vEvent, true);
                } catch (ex) {
                    throw new Error("Property " + p.name + " modified: Failed to dispatch change event: " + ex);
                }
            }
            return newValue;
        };
    }
    if (typeof p.getAlias === qxp.constant.Type.STRING) {
        pp[p.getAlias] = pp[qxp.OO.C_GET + p.method];
    }
    if (typeof p.setAlias === qxp.constant.Type.STRING) {
        pp[p.setAlias] = pp[qxp.OO.C_SET + p.method];
    }
};
qxp.OO.changeProperty = qxp.OO._createProperty;
qxp.OO.addProperty = function(p) {
    qxp.OO.propertyNumber++;
    qxp.OO._createProperty(p);
    if (typeof qxp.Proto._properties !== qxp.constant.Type.STRING) {
        qxp.Proto._properties = p.name;
    } else {
        qxp.Proto._properties += qxp.constant.Core.COMMA + p.name;
    }
    switch (p.type) {
        case undefined:
        case qxp.constant.Type.OBJECT:
        case qxp.constant.Type.FUNCTION:
            if (typeof qxp.Proto._objectproperties !== qxp.constant.Type.STRING) {
                qxp.Proto._objectproperties = p.name;
            } else {
                qxp.Proto._objectproperties += qxp.constant.Core.COMMA + p.name;
            }
    }
};




/* ID: qxp.lang.String */
qxp.OO.defineClass("qxp.lang.String");
qxp.Class.toFirstUp = function(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
};
qxp.Class.add = function(str, v, sep) {
    if (str == v) {
        return str;
    } else if (str == qxp.constant.Core.EMPTY) {
        return v;
    } else {
        if (qxp.util.Validation.isInvalid(sep)) {
            sep = qxp.constant.Core.COMMA;
        }
        var a = str.split(sep);
        if (a.indexOf(v) == -1) {
            a.push(v);
            return a.join(sep);
        } else {
            return str;
        }
    }
};
qxp.Class.remove = function(str, v, sep) {
    if (str == v || str == qxp.constant.Core.EMPTY) {
        return qxp.constant.Core.EMPTY;
    } else {
        if (qxp.util.Validation.isInvalid(sep)) {
            sep = qxp.constant.Core.COMMA;
        }
        var a = str.split(sep);
        var p = a.indexOf(v);
        if (p === -1) {
            return str;
        }
        do {
            a.splice(p, 1);
        } while ((p = a.indexOf(v)) != -1);
        return a.join(sep);
    }
};
qxp.Class.contains = function(str, s) {
    return str.indexOf(s) != -1;
};




/* ID: qxp.constant.Core */
qxp.OO.defineClass("qxp.constant.Core", {
    EMPTY: "",
    SPACE: " ",
    SLASH: "/",
    DOT: ".",
    ZERO: "0",
    QUOTE: '"',
    NEWLINE: "\n",
    SINGLEQUOTE: "'",
    STAR: "*",
    PLUS: "+",
    MINUS: "-",
    COMMA: ",",
    DASH: "-",
    UNDERLINE: "_",
    SEMICOLON: ";",
    COLON: ":",
    EQUAL: "=",
    AMPERSAND: "&",
    QUESTIONMARK: "?",
    HASH: "#",
    SMALLER: "<",
    BIGGER: ">",
    PERCENT: "%",
    PIXEL: "px",
    MILLISECONDS: "ms",
    FLEX: "1*",
    ZEROPIXEL: "0px",
    HUNDREDPERCENT: "100%",
    YES: "yes",
    NO: "no",
    ON: "on",
    OFF: "off",
    SET: "set",
    GET: "get",
    DEFAULT: "default",
    AUTO: "auto",
    NONE: "none",
    DISABLED: "disabled",
    HIDDEN: "hidden"
});




/* ID: qxp.constant.Type */
qxp.OO.defineClass("qxp.constant.Type", {
    UNDEFINED: "undefined",
    NUMBER: "number",
    STRING: "string",
    BOOLEAN: "boolean",
    FUNCTION: "function",
    OBJECT: "object"
});




/* ID: qxp.util.Validation */
qxp.OO.defineClass("qxp.util.Validation");
qxp.util.Validation.isValid = function(v) {
    switch (typeof v) {
        case qxp.constant.Type.UNDEFINED:
            return false;
        case qxp.constant.Type.OBJECT:
            return v !== null;
        case qxp.constant.Type.STRING:
            return v !== qxp.constant.Core.EMPTY;
        case qxp.constant.Type.NUMBER:
            return !isNaN(v);
        case qxp.constant.Type.FUNCTION:
        case qxp.constant.Type.BOOLEAN:
            return true;
    }
    return false;
};
qxp.util.Validation.isInvalid = function(v) {
    switch (typeof v) {
        case qxp.constant.Type.UNDEFINED:
            return true;
        case qxp.constant.Type.OBJECT:
            return v === null;
        case qxp.constant.Type.STRING:
            return v === qxp.constant.Core.EMPTY;
        case qxp.constant.Type.NUMBER:
            return isNaN(v);
        case qxp.constant.Type.FUNCTION:
        case qxp.constant.Type.BOOLEAN:
            return false;
    }
    return true;
};
qxp.util.Validation.isValidNumber = function(v) {
    return typeof v === qxp.constant.Type.NUMBER && !isNaN(v);
};
qxp.util.Validation.isValidString = function(v) {
    return typeof v === qxp.constant.Type.STRING && v !== qxp.constant.Core.EMPTY;
};
qxp.util.Validation.isValidArray = function(v) {
    return typeof v === qxp.constant.Type.OBJECT && v !== null && v instanceof Array;
};
qxp.util.Validation.isValidFunction = function(v) {
    return typeof v === qxp.constant.Type.FUNCTION;
};
qxp.util.Validation.isInvalidBoolean = function(v) {
    return typeof v !== qxp.constant.Type.BOOLEAN;
};




/* ID: qxp.lang.Array */
qxp.OO.defineClass("qxp.lang.Array");
qxp.lang.Array.fromArguments = function(args) {
    return Array.prototype.slice.call(args, 0);
};
qxp.lang.Array.insertBefore = function(arr, obj, obj2) {
    var i = arr.indexOf(obj2);
    if (i == -1) {
        arr.push(obj);
    } else {
        arr.splice(i, 0, obj);
    }
    return arr;
};
qxp.lang.Array.append = function(arr, a) {
    Array.prototype.push.apply(arr, a);
};
qxp.lang.Array.remove = function(arr, obj) {
    var i = arr.indexOf(obj);
    if (i != -1) {
        return arr.splice(i, 1);
    }
};
qxp.lang.Array.contains = function(arr, obj) {
    return arr.indexOf(obj) != -1;
};




/* ID: qxp.lang.Object */
qxp.OO.defineClass("qxp.lang.Object");
qxp.Class.isEmpty = function(h) {
    for (var s in h) {
        return false;
    }
    return true;
};
qxp.Class.getLength = function(h) {
    var i = 0;
    for (var s in h) {
        i++;
    }
    return i;
};
qxp.Class.mergeWith = function(vObjectA, vObjectB) {
    for (var vKey in vObjectB) {
        vObjectA[vKey] = vObjectB[vKey];
    }
    return vObjectA;
};
qxp.Class.merge = function(vObjectA) {
    var vLength = arguments.length;
    for (var i = 1; i < vLength; i++) {
        qxp.lang.Object.mergeWith(vObjectA, arguments[i]);
    }
    return vObjectA;
};




/* ID: qxp.lang.Core */
qxp.OO.defineClass("qxp.lang.Core");
if (!Error.prototype.toString) {
    Error.prototype.toString = function() {
        return this.message;
    };
}
qxp.Class.closure = function(fun, obj) {
    if (!window.__objs) {
        window.__objs = [];
        window.__funs = [];
    }
    var objId = obj.__objId;
    if (!objId) {
        __objs[objId = obj.__objId = __objs.length] = obj;
    }
    var funId = fun.__funId;
    if (!funId) {
        __funs[funId = fun.__funId = __funs.length] = fun;
    }
    if (!obj.__closures) {
        obj.__closures = [];
    }
    var closure = obj.__closures[funId];
    if (closure) {
        return closure;
    }
    obj = null;
    fun = null;
    return __objs[objId].__closures[funId] = function() {
        return __funs[funId].apply(__objs[objId], arguments);
    };
};
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex; i < this.length; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = this.length - 1;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex; i >= 0; i--) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}
qxp.Class.filter = function(arr, f, obj) {
    var l = arr.length;
    var res = [];
    for (var i = 0; i < l; i++) {
        if (f.call(obj, arr[i], i, arr)) {
            res.push(arr[i]);
        }
    }
    return res;
};
qxp.Class.map = function(arr, f, obj) {
    var l = arr.length;
    var res = [];
    for (var i = 0; i < l; i++) {
        res.push(f.call(obj, arr[i], i, arr));
    }
    return res;
};




/* ID: qxp.util.Return */
qxp.OO.defineClass("qxp.util.Return");
qxp.util.Return.returnInstance = function() {
    if (!this._instance) {
        this._instance = new this;
    }
    return this._instance;
};




/* ID: qxp.core.Object */
qxp.OO.defineClass("qxp.core.Object", Object, function(vAutoDispose) {
    this._hashCode = qxp.core.Object._counter++;
    if (vAutoDispose !== false) {
        qxp.core.Object._db[this._hashCode] = this;
    }
});
qxp.Settings.setDefault("enableDisposerDebug", false);
qxp.Class._counter = 0;
qxp.Class._db = [];
qxp.Class._disposeAll = false;
qxp.Class.toHashCode = function(o) {
    if (o._hashCode != null) {
        return o._hashCode;
    }
    return o._hashCode = qxp.core.Object._counter++;
};
qxp.Class.dispose = function() {
    qxp.core.Object._disposeAll = true;
    var vObject;
    for (var i = qxp.core.Object._db.length - 1; i >= 0; i--) {
        vObject = qxp.core.Object._db[i];
        if (vObject && vObject._disposed === false) {
            vObject.dispose();
        }
    }
};
qxp.OO.addProperty({
    name: "enabled",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: true,
    getAlias: "isEnabled"
});
qxp.Proto.toString = function() {
    if (this.classname) {
        return "[object " + this.classname + "]";
    }
    return "[object Object]";
};
qxp.Proto.toHashCode = function() {
    return this._hashCode;
};
qxp.Proto.getDisposed = function() {
    return this._disposed;
};
qxp.Proto.getSetting = function(vKey) {
    return qxp.Settings.getValueOfClass(this.classname, vKey);
};
qxp.Proto.getLogger = function() {
    return qxp.dev.log.Logger.getClassLogger(this.constructor);
};
qxp.Proto.debug = function(msg, exc) {
    this.getLogger().debug(msg, this._hashCode, exc);
};
qxp.Proto.info = function(msg, exc) {
    this.getLogger().info(msg, this._hashCode, exc);
};
qxp.Proto.warn = function(msg, exc) {
    this.getLogger().warn(msg, this._hashCode, exc);
};
qxp.Proto.error = function(msg, exc) {
    this.getLogger().error(msg, this._hashCode, exc);
};
qxp.Proto.set = function(propertyValues) {
    if (typeof propertyValues !== qxp.constant.Type.OBJECT) {
        throw new Error("Please use a valid hash of property key-values pairs.");
    }
    for (var prop in propertyValues) {
        try {
            this[qxp.OO.setter[prop]](propertyValues[prop]);
        } catch (ex) {
            this.error("Setter of property " + prop + " returned with an error", ex);
        }
    }
    return this;
};
qxp.Proto.get = function(propertyNames, outputHint) {
    switch (typeof propertyNames) {
        case qxp.constant.Type.STRING:
            return this[qxp.constant.Core.GET + qxp.lang.String.toFirstUp(propertyNames)]();
        case qxp.constant.Type.OBJECT:
            if (typeof propertyNames.length === qxp.constant.Type.NUMBER) {
                if (outputHint == "hash") {
                    var h = {};
                    propertyLength = propertyNames.length;
                    for (var i = 0; i < propertyLength; i++) {
                        try {
                            h[propertyNames[i]] = this[qxp.constant.Core.GET + qxp.lang.String.toFirstUp(propertyNames[i])]();
                        } catch (ex) {
                            throw new Error("Could not get a valid value from property: " + propertyNames[i] + "! Is the property existing? (" + ex + ")");
                        }
                    }
                    return h;
                } else {
                    propertyLength = propertyNames.length;
                    for (var i = 0; i < propertyLength; i++) {
                        try {
                            propertyNames[i] = this[qxp.constant.Core.GET + qxp.lang.String.toFirstUp(propertyNames[i])]();
                        } catch (ex) {
                            throw new Error("Could not get a valid value from property: " + propertyNames[i] + "! Is the property existing? (" + ex + ")");
                        }
                    }
                    return propertyNames;
                }
            } else {
                for (var i in propertyNames) {
                    propertyNames[i] = this[qxp.constant.Core.GET + qxp.lang.String.toFirstUp(i)]();
                }
                return propertyNames;
            }
        default:
            throw new Error("Please use a valid array, hash or string as parameter!");
    }
};
qxp.Proto.setUserData = function(vKey, vValue) {
    if (!this._userData) {
        this._userData = {};
    }
    this._userData[vKey] = vValue;
};
qxp.Proto.getUserData = function(vKey) {
    if (!this._userData) {
        return null;
    }
    return this._userData[vKey];
};
qxp.Proto._disposed = false;
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    if (this._userData) {
        for (var vKey in this._userData) {
            this._userData[vKey] = null;
        }
        this._userData = null;
    }
    if (this._objectproperties) {
        var a = this._objectproperties.split(qxp.constant.Core.COMMA);
        var d = qxp.OO.values;
        for (var i = 0, l = a.length; i < l; i++) {
            this[d[a[i]]] = null;
        }
        this._objectproperties = null;
    }
    if (this.getSetting("enableDisposerDebug")) {
        for (var vKey in this) {
            if (this[vKey] !== null && typeof this[vKey] === qxp.constant.Type.OBJECT) {
                this.debug("Missing class implementation to dispose: " + vKey);
                delete this[vKey];
            }
        }
    }
    if (this._hashCode != null) {
        if (qxp.core.Object._disposeAll) {
            qxp.core.Object._db[this._hashCode] = null;
        } else {
            delete qxp.core.Object._db[this._hashCode];
        }
    }
    this._disposed = true;
};




/* ID: qxp.dev.log.LogEventProcessor */
qxp.OO.defineClass("qxp.dev.log.LogEventProcessor", qxp.core.Object, function() {
    qxp.core.Object.call(this);
});
qxp.Proto.addFilter = function(filter) {
    if (this._filterArr == null) {
        this._filterArr = [];
    }
    this._filterArr.push(filter);
};
qxp.Proto.clearFilters = function() {
    this._filterArr = null;
};
qxp.Proto.getHeadFilter = function() {
    return (this._filterArr == null || this._filterArr.length == 0) ? null : this._filterArr[0];
};
qxp.Proto._getDefaultFilter = function() {
    var headFilter = this.getHeadFilter();
    if (!(headFilter instanceof qxp.dev.log.DefaultFilter)) {
        this.clearFilters();
        headFilter = new qxp.dev.log.DefaultFilter();
        this.addFilter(headFilter);
    }
    return headFilter;
};
qxp.Proto.setEnabled = function(enabled) {
    this._getDefaultFilter().setEnabled(enabled);
};
qxp.Proto.setMinLevel = function(minLevel) {
    this._getDefaultFilter().setMinLevel(minLevel);
};
qxp.Proto.decideLogEvent = function(evt) {
    var NEUTRAL = qxp.dev.log.Filter.NEUTRAL;
    if (this._filterArr != null) {
        for (var i = 0; i < this._filterArr.length; i++) {
            var decision = this._filterArr[i].decide(evt);
            if (decision != NEUTRAL) {
                return decision;
            }
        }
    }
    return NEUTRAL;
};
qxp.Proto.handleLogEvent = function(evt) {
    throw new Error("handleLogEvent is abstract");
};




/* ID: qxp.dev.log.Filter */
qxp.OO.defineClass("qxp.dev.log.Filter", qxp.core.Object, function() {
    qxp.core.Object.call(this);
});
qxp.Proto.decide = function(evt) {
    throw new Error("decide is abstract");
};
qxp.Class.ACCEPT = 1;
qxp.Class.DENY = 2;
qxp.Class.NEUTRAL = 3;




/* ID: qxp.dev.log.DefaultFilter */
qxp.OO.defineClass("qxp.dev.log.DefaultFilter", qxp.dev.log.Filter, function() {
    qxp.dev.log.Filter.call(this);
});
qxp.OO.addProperty({
    name: "enabled",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    getAlias: "isEnabled"
});
qxp.OO.addProperty({
    name: "minLevel",
    type: qxp.constant.Type.NUMBER,
    defaultValue: null
});
qxp.Proto.decide = function(evt) {
    var Filter = qxp.dev.log.Filter;
    if (!this.isEnabled()) {
        return Filter.DENY;
    } else if (this.getMinLevel() == null) {
        return Filter.NEUTRAL;
    } else {
        return (evt.level >= this.getMinLevel()) ? Filter.ACCEPT : Filter.DENY;
    }
};




/* ID: qxp.dev.log.Appender */
qxp.OO.defineClass("qxp.dev.log.Appender", qxp.dev.log.LogEventProcessor, function() {
    qxp.dev.log.LogEventProcessor.call(this);
});
qxp.OO.addProperty({
    name: "useLongFormat",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: true,
    allowNull: false
});
qxp.Proto.handleLogEvent = function(evt) {
    if (this.decideLogEvent(evt) != qxp.dev.log.Filter.DENY) {
        this.appendLogEvent(evt);
    }
};
qxp.Proto.appendLogEvent = function(evt) {
    throw new Error("appendLogEvent is abstract");
};
qxp.Proto.formatLogEvent = function(evt) {
    var Logger = qxp.dev.log.Logger;
    var text = "";
    var time = new String(new Date().getTime() - qxp._LOADSTART);
    while (time.length < 6) {
        time = qxp.constant.Core.ZERO + time;
    }
    text += time;
    if (this.getUseLongFormat()) {
        switch (evt.level) {
            case Logger.LEVEL_DEBUG:
                text += " DEBUG: ";
                break;
            case Logger.LEVEL_INFO:
                text += " INFO:  ";
                break;
            case Logger.LEVEL_WARN:
                text += " WARN:  ";
                break;
            case Logger.LEVEL_ERROR:
                text += " ERROR: ";
                break;
            case Logger.LEVEL_FATAL:
                text += " FATAL: ";
                break;
        }
    } else {
        text += ": ";
    }
    var indent = "";
    for (var i = 0; i < evt.indent; i++) {
        indent += "  ";
    }
    text += indent;
    if (this.getUseLongFormat()) {
        text += evt.logger.getName();
        if (evt.instanceId != null) {
            text += "[" + evt.instanceId + "]";
        }
        text += ": ";
    }
    if (typeof evt.message == "string") {
        text += evt.message;
    } else {
        var obj = evt.message;
        if (obj == null) {
            text += "Object is null";
        } else {
            text += "--- Object: " + obj + " ---\n";
            var attrArr = new Array();
            try {
                for (var attr in obj) {
                    attrArr.push(attr);
                }
            } catch (exc) {
                text += indent + "  [not readable: " + exc + "]\n";
            }
            attrArr.sort();
            for (var i = 0; i < attrArr.length; i++) {
                try {
                    text += indent + "  " + attrArr[i] + "=" + obj[attrArr[i]] + "\n";
                } catch (exc) {
                    text += indent + "  " + attrArr[i] + "=[not readable: " + exc + "]\n";
                }
            }
            text += indent + "--- End of object ---";
        }
    }
    if (evt.throwable != null) {
        var thr = evt.throwable;
        if (thr.name == null) {
            text += ": " + thr;
        } else {
            text += ": " + thr.name;
        }
        if (thr.message != null) {
            text += " - " + thr.message;
        }
        if (thr.number != null) {
            text += " (#" + thr.number + ")";
        }
        if (thr.stack != null) {
            text += "\n" + this._beautyStackTrace(thr.stack);
        }
    }
    return text;
};
qxp.Proto._beautyStackTrace = function(stack) {
    var lineRe = /@(.+):(\d+)$/gm;
    var hit;
    var out = "";
    var scriptDir = "/script/";
    while ((hit = lineRe.exec(stack)) != null) {
        var url = hit[1];
        var jsPos = url.indexOf(scriptDir);
        var className = (jsPos == -1) ? url : url.substring(jsPos + scriptDir.length).replace(/\//g, ".");
        var lineNumber = hit[2];
        out += "  at " + className + ":" + lineNumber + "\n";
    }
    return out;
};




/* ID: qxp.dev.log.WindowAppender */
qxp.OO.defineClass("qxp.dev.log.WindowAppender", qxp.dev.log.Appender, function(name) {
    qxp.dev.log.Appender.call(this);
    this._id = qxp.dev.log.WindowAppender.register(this);
    this._name = (name == null) ? "qx_log" : name;
    this._logWindowOpened = false;
});
qxp.OO.addProperty({
    name: "maxMessages",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 500
});
qxp.OO.addProperty({
    name: "popUnder",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false,
    allowNull: false
});
qxp.Proto.openWindow = function() {
    if (this._logWindowOpened) {
        return;
    }
    var winWidth = 600;
    var winHeight = 350;
    var winLeft = window.screen.width - winWidth;
    var winTop = window.screen.height - winHeight;
    var params = "toolbar=no,scrollbars=yes,resizable=yes," + "width=" + winWidth + ",height=" + winHeight + ",left=" + winLeft + ",top=" + winTop;
    this._logWindow = window.open("", this._name, params);
    if (!this._logWindow || this._logWindow.closed) {
        if (!this._popupBlockerWarning) {
            alert("Couldn't open debug window. Please disable your popup blocker!");
        }
        this._popupBlockerWarning = true;
        return;
    }
    this._popupBlockerWarning = false;
    this._logWindowOpened = true;
    if (this.getPopUnder()) {
        this._logWindow.blur();
        window.focus();
    }
    var logDocument = this._logWindow.document;
    logDocument.open();
    logDocument.write("<html><head><title>" + this._name + "</title></head>" + '<body onload="qxp = opener.qxp;" onunload="qxp.dev.log.WindowAppender._registeredAppenders[' + this._id + '].closeWindow()">' + '<pre id="log" wrap="wrap" style="font-size:11"></pre></body></html>');
    logDocument.close();
    this._logElem = logDocument.getElementById("log");
    if (this._logEventQueue != null) {
        for (var i = 0; i < this._logEventQueue.length; i++) {
            this.appendLogEvent(this._logEventQueue[i]);
        }
        this._logEventQueue = null;
    }
};
qxp.Proto.closeWindow = function() {
    if (this._logWindow != null) {
        this._logWindow.close();
        this._logWindow = null;
        this._logElem = null;
        this._logWindowOpened = false;
    }
};
qxp.Proto.appendLogEvent = function(evt) {
    if (!this._logWindowOpened) {
        this._logEventQueue = [];
        this._logEventQueue.push(evt);
        this.openWindow();
        if (!this._logWindowOpened) {
            return;
        }
    } else if (this._logElem == null) {
        this._logEventQueue.push(evt);
    } else {
        var divElem = this._logWindow.document.createElement("div");
        if (evt.level == qxp.dev.log.Logger.LEVEL_ERROR) {
            divElem.style.backgroundColor = "#FFEEEE";
        } else if (evt.level == qxp.dev.log.Logger.LEVEL_DEBUG) {
            divElem.style.color = "gray";
        }
        divElem.innerHTML = this.formatLogEvent(evt).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/  /g, " &#160;").replace(/[\n]/g, "<br>");
        this._logElem.appendChild(divElem);
        while (this._logElem.childNodes.length > this.getMaxMessages()) {
            this._logElem.removeChild(this._logElem.firstChild);
            if (this._removedMessageCount == null) {
                this._removedMessageCount = 1;
            } else {
                this._removedMessageCount++;
            }
        }
        if (this._removedMessageCount != null) {
            this._logElem.firstChild.innerHTML = "(" + this._removedMessageCount + " messages removed)";
        }
        this._logWindow.scrollTo(0, this._logElem.offsetHeight);
    }
};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return true;
    }
    this.closeWindow();
    return qxp.dev.log.Appender.prototype.dispose.call(this);
};
qxp.Class._nextId = 1;
qxp.Class._registeredAppenders = {};
qxp.Class.register = function(appender) {
    var WindowAppender = qxp.dev.log.WindowAppender;
    var id = WindowAppender._nextId++;
    WindowAppender._registeredAppenders[id] = appender;
    return id;
};




/* ID: qxp.dev.log.Logger */
qxp.OO.defineClass("qxp.dev.log.Logger", qxp.dev.log.LogEventProcessor, function(name, parentLogger) {
    qxp.dev.log.LogEventProcessor.call(this);
    this._name = name;
    this._parentLogger = parentLogger;
});
qxp.Proto.getName = function() {
    return this._name;
};
qxp.Proto.getParentLogger = function() {
    return this._parentLogger;
};
qxp.Proto.indent = function() {
    qxp.dev.log.Logger._indent++;
};
qxp.Proto.addAppender = function(appender) {
    if (this._appenderArr == null) {
        this._appenderArr = [];
    }
    this._appenderArr.push(appender);
};
qxp.Proto.handleLogEvent = function(evt) {
    var Filter = qxp.dev.log.Filter;
    var decision = Filter.NEUTRAL;
    var logger = this;
    while (decision == Filter.NEUTRAL && logger != null) {
        decision = logger.decideLogEvent(evt);
        logger = logger.getParentLogger();
    }
    if (decision != Filter.DENY) {
        this.appendLogEvent(evt);
    }
};
qxp.Proto.appendLogEvent = function(evt) {
    if (this._appenderArr != null && this._appenderArr.length != 0) {
        for (var i = 0; i < this._appenderArr.length; i++) {
            this._appenderArr[i].handleLogEvent(evt);
        }
    } else if (this._parentLogger != null) {
        this._parentLogger.appendLogEvent(evt);
    }
};
qxp.Proto.log = function(level, msg, instanceId, exc) {
    var evt = {
        logger: this,
        level: level,
        message: msg,
        throwable: exc,
        indent: qxp.dev.log.Logger._indent,
        instanceId: instanceId
    };
    this.handleLogEvent(evt);
};
qxp.Proto.debug = function(msg, instanceId, exc) {
    this.log(qxp.dev.log.Logger.LEVEL_DEBUG, msg, instanceId, exc);
};
qxp.Proto.info = function(msg, instanceId, exc) {
    this.log(qxp.dev.log.Logger.LEVEL_INFO, msg, instanceId, exc);
};
qxp.Proto.warn = function(msg, instanceId, exc) {
    this.log(qxp.dev.log.Logger.LEVEL_WARN, msg, instanceId, exc);
};
qxp.Proto.error = function(msg, instanceId, exc) {
    this.log(qxp.dev.log.Logger.LEVEL_ERROR, msg, instanceId, exc);
};
qxp.Class.getClassLogger = function(clazz) {
    var logger = clazz._logger;
    if (logger == null) {
        var classname = clazz.classname;
        var splits = classname.split(".");
        var currPackage = window;
        var currPackageName = "";
        var parentLogger = qxp.dev.log.Logger.ROOT_LOGGER;
        for (var i = 0; i < splits.length - 1; i++) {
            currPackage = currPackage[splits[i]];
            currPackageName += ((i != 0) ? "." : "") + splits[i];
            if (currPackage._logger == null) {
                currPackage._logger = new qxp.dev.log.Logger(currPackageName, parentLogger);
            }
            parentLogger = currPackage._logger;
        }
        logger = new qxp.dev.log.Logger(classname, parentLogger);
        clazz._logger = logger;
    }
    return logger;
};
qxp.Class._indent = 0;
qxp.Class.LEVEL_ALL = 0;
qxp.Class.LEVEL_DEBUG = 200;
qxp.Class.LEVEL_INFO = 500;
qxp.Class.LEVEL_WARN = 600;
qxp.Class.LEVEL_ERROR = 700;
qxp.Class.LEVEL_FATAL = 800;
qxp.Class.LEVEL_OFF = 1000;
qxp.Class.ROOT_LOGGER = new qxp.dev.log.Logger("root", null);
qxp.Class.ROOT_LOGGER.setMinLevel(qxp.dev.log.Logger.LEVEL_DEBUG);
qxp.Class.ROOT_LOGGER.addAppender(new qxp.dev.log.WindowAppender);




/* ID: qxp.core.Target */
qxp.OO.defineClass("qxp.core.Target", qxp.core.Object, function(vAutoDispose) {
    qxp.core.Object.call(this, vAutoDispose);
});
qxp.Class.EVENTPREFIX = "evt";
qxp.Proto.addEventListener = function(vType, vFunction, vObject) {
    if (this._disposed) {
        return;
    }
    if (typeof vFunction !== qxp.constant.Type.FUNCTION) {
        throw new Error("qxp.core.Target: addEventListener(" + vType + "): '" + vFunction + "' is not a function!");
    }
    if (typeof this._listeners === qxp.constant.Type.UNDEFINED) {
        this._listeners = {};
        this._listeners[vType] = {};
    } else if (typeof this._listeners[vType] === qxp.constant.Type.UNDEFINED) {
        this._listeners[vType] = {};
    }
    var vKey = qxp.core.Target.EVENTPREFIX + qxp.core.Object.toHashCode(vFunction) + (vObject ? qxp.constant.Core.UNDERLINE + qxp.core.Object.toHashCode(vObject) : qxp.constant.Core.EMPTY);
    this._listeners[vType][vKey] = {
        handler: vFunction,
        object: vObject
    };
};
qxp.Proto.removeEventListener = function(vType, vFunction, vObject) {
    if (this._disposed) {
        return;
    }
    var vListeners = this._listeners;
    if (!vListeners || typeof vListeners[vType] === qxp.constant.Type.UNDEFINED) {
        return;
    }
    if (typeof vFunction !== qxp.constant.Type.FUNCTION) {
        throw new Error("qxp.core.Target: removeEventListener(" + vType + "): '" + vFunction + "' is not a function!");
    }
    var vKey = qxp.core.Target.EVENTPREFIX + qxp.core.Object.toHashCode(vFunction) + (vObject ? qxp.constant.Core.UNDERLINE + qxp.core.Object.toHashCode(vObject) : qxp.constant.Core.EMPTY);
    delete this._listeners[vType][vKey];
};
qxp.Proto.hasEventListeners = function(vType) {
    return this._listeners && typeof this._listeners[vType] !== qxp.constant.Type.UNDEFINED && !qxp.lang.Object.isEmpty(this._listeners[vType]);
};
qxp.Proto.createDispatchEvent = function(vType) {
    if (this.hasEventListeners(vType)) {
        this.dispatchEvent(new qxp.event.type.Event(vType), true);
    }
};
qxp.Proto.createDispatchDataEvent = function(vType, vData) {
    if (this.hasEventListeners(vType)) {
        this.dispatchEvent(new qxp.event.type.DataEvent(vType, vData), true);
    }
};
qxp.Proto.dispatchEvent = function(vEvent, vEnableDispose) {
    if (this.getDisposed()) {
        return;
    }
    if (vEvent.getTarget() == null) {
        vEvent.setTarget(this);
    }
    if (vEvent.getCurrentTarget() == null) {
        vEvent.setCurrentTarget(this);
    }
    this._dispatchEvent(vEvent, vEnableDispose);
    return !vEvent._defaultPrevented;
};
qxp.Proto._dispatchEvent = function(vEvent, vEnableDispose) {
    if (this.getDisposed()) {
        return;
    }
    var vListeners = this._listeners;
    if (vListeners) {
        vEvent.setCurrentTarget(this);
        var vTypeListeners = vListeners[vEvent.getType()];
        if (vTypeListeners) {
            var vFunction, vObject;
            for (var vHashCode in vTypeListeners) {
                vFunction = vTypeListeners[vHashCode].handler;
                vObject = vTypeListeners[vHashCode].object;
                try {
                    if (typeof vFunction === qxp.constant.Type.FUNCTION) {
                        vFunction.call(qxp.util.Validation.isValid(vObject) ? vObject : this, vEvent);
                    }
                } catch (ex) {
                    this.error("Could not dispatch event of type \"" + vEvent.getType() + "\"", ex);
                }
            }
        }
    }
    var vParent = this.getParent();
    if (vEvent.getBubbles() && !vEvent.getPropagationStopped() && vParent && !vParent.getDisposed() && vParent.getEnabled()) {
        vParent._dispatchEvent(vEvent, false);
    }
    vEnableDispose && vEvent.dispose();
};
qxp.Proto.getParent = function() {
    return null;
};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    if (typeof this._listeners === qxp.constant.Type.OBJECT) {
        for (var vType in this._listeners) {
            var listener = this._listeners[vType];
            for (var vKey in listener) {
                listener[vKey] = null;
            }
            this._listeners[vType] = null;
        }
    }
    this._listeners = null;
    return qxp.core.Object.prototype.dispose.call(this);
};




/* ID: qxp.event.type.Event */
qxp.OO.defineClass("qxp.event.type.Event", qxp.core.Object, function(vType) {
    qxp.core.Object.call(this, false);
    this.setType(vType);
});
qxp.OO.addFastProperty({
    name: "type",
    setOnlyOnce: true
});
qxp.OO.addFastProperty({
    name: "originalTarget",
    setOnlyOnce: true
});
qxp.OO.addFastProperty({
    name: "target",
    setOnlyOnce: true
});
qxp.OO.addFastProperty({
    name: "relatedTarget",
    setOnlyOnce: true
});
qxp.OO.addFastProperty({
    name: "currentTarget"
});
qxp.OO.addFastProperty({
    name: "bubbles",
    defaultValue: false,
    noCompute: true
});
qxp.OO.addFastProperty({
    name: "propagationStopped",
    defaultValue: true,
    noCompute: true
});
qxp.OO.addFastProperty({
    name: "defaultPrevented",
    defaultValue: false,
    noCompute: true
});
qxp.Proto.preventDefault = function() {
    this.setDefaultPrevented(true);
};
qxp.Proto.stopPropagation = function() {
    this.setPropagationStopped(true);
};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    this._valueOriginalTarget = null;
    this._valueTarget = null;
    this._valueRelatedTarget = null;
    this._valueCurrentTarget = null;
    return qxp.core.Object.prototype.dispose.call(this);
};




/* ID: qxp.event.type.DataEvent */
qxp.OO.defineClass("qxp.event.type.DataEvent", qxp.event.type.Event, function(vType, vData) {
    qxp.event.type.Event.call(this, vType);
    this.setData(vData);
});
qxp.OO.addFastProperty({
    name: "propagationStopped",
    defaultValue: false
});
qxp.OO.addFastProperty({
    name: "data"
});
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    this._valueData = null;
    return qxp.event.type.Event.prototype.dispose.call(this);
};




/* ID: qxp.sys.Client */
qxp.OO.defineClass("qxp.sys.Client", Object, function() {
    var vRunsLocally = window.location.protocol === "file:";
    var vBrowserUserAgent = navigator.userAgent;
    var vBrowserVendor = navigator.vendor;
    var vBrowserProduct = navigator.product;
    var vBrowserPlatform = navigator.platform;
    var vBrowserModeHta = false;
    var vBrowser;
    var vEngine = null;
    var vEngineVersion = null;
    var vEngineVersionMajor = 0;
    var vEngineVersionMinor = 0;
    var vEngineVersionRevision = 0;
    var vEngineVersionBuild = 0;
    var vEngineEmulation = null;
    var vVersionHelper;
    if (window.opera && /Opera[\s\/]([0-9\.]*)/.test(vBrowserUserAgent)) {
        vEngine = "opera";
        vEngineVersion = RegExp.$1;
        vEngineVersion = vEngineVersion.substring(0, 3) + "." + vEngineVersion.substring(3);
        vEngineEmulation = (vBrowserUserAgent.indexOf("MSIE") !== -1 || vBrowserUserAgent.indexOf("Trident") !== -1) ? "mshtml" : vBrowserUserAgent.indexOf("Mozilla") !== -1 ? "gecko" : null;
    } else if (typeof vBrowserVendor === "string" && vBrowserVendor === "KDE" && /KHTML\/([0-9-\.]*)/.test(vBrowserUserAgent)) {
        vEngine = "khtml";
        vBrowser = "konqueror";
        vEngineVersion = RegExp.$1;
    } else if (vBrowserUserAgent.indexOf("AppleWebKit") != -1 && /AppleWebKit\/([0-9-\.]*)/.test(vBrowserUserAgent)) {
        vEngine = "webkit";
        vEngineVersion = RegExp.$1;
        if (vBrowserUserAgent.indexOf("Safari") != -1) {
            if (vBrowserUserAgent.indexOf("Mobile") != -1) {
                vBrowser = "mobile safari";
            } else {
                vBrowser = "safari";
            }
        } else if (vBrowserUserAgent.indexOf("Omni") != -1) {
            vBrowser = "omniweb";
        } else {
            vBrowser = "other webkit";
        }
    } else if (vBrowserUserAgent.indexOf("like Gecko") === -1 && typeof vBrowserProduct === "string" && vBrowserProduct === "Gecko" && /rv\:([^\);]+)(\)|;)/.test(vBrowserUserAgent)) {
        vEngine = "gecko";
        vEngineVersion = RegExp.$1;
        if (vBrowserUserAgent.indexOf("Firefox") != -1) {
            vBrowser = "firefox";
        } else if (vBrowserUserAgent.indexOf("Camino") != -1) {
            vBrowser = "camino";
        } else if (vBrowserUserAgent.indexOf("Galeon") != -1) {
            vBrowser = "galeon";
        } else {
            vBrowser = "other gecko";
        }
    } else if (/MSIE\s+([^\);]+)(\)|;)/.test(vBrowserUserAgent) || /Trident[^r]*rv:([^\);]+)(\)|;)/.test(vBrowserUserAgent)) {
        vEngine = "mshtml";
        vEngineVersion = RegExp.$1;
        vBrowserModeHta = !window.external;
    }
    if (vEngineVersion) {
        vVersionHelper = vEngineVersion.split(".");
        vEngineVersionMajor = vVersionHelper[0] || 0;
        vEngineVersionMinor = vVersionHelper[1] || 0;
        vEngineVersionRevision = vVersionHelper[2] || 0;
        vEngineVersionBuild = vVersionHelper[3] || 0;
    }
    var vEngineBoxSizingAttr = vEngine == "gecko" ? "-moz-box-sizing" : vEngine == "mshtml" ? null : "box-sizing";
    var vEngineQuirksMode = document.compatMode !== "CSS1Compat";
    var vDefaultLocale = "en";
    var vBrowserLocale = (((vEngine == "mshtml" && navigator.userLanguage) ? navigator.userLanguage : navigator.language) || "en-US").toLowerCase();
    var vBrowserLocaleVariant = null;
    var vBrowserLocaleVariantIndex = vBrowserLocale.indexOf("-");
    if (vBrowserLocaleVariantIndex != -1) {
        vBrowserLocaleVariant = vBrowserLocale.substr(vBrowserLocaleVariantIndex + 1);
        vBrowserLocale = vBrowserLocale.substr(0, vBrowserLocaleVariantIndex);
    }
    var vPlatform = "none";
    var vPlatformWindows = false;
    var vPlatformMacintosh = false;
    var vPlatformUnix = false;
    var vPlatformOther = false;
    if (vBrowserPlatform.indexOf("Windows") != -1 || vBrowserPlatform.indexOf("Win32") != -1 || vBrowserPlatform.indexOf("Win64") != -1) {
        vPlatformWindows = true;
        vPlatform = "win";
    } else if (vBrowserPlatform.indexOf("Macintosh") != -1 || vBrowserPlatform.indexOf("MacPPC") != -1 || vBrowserPlatform.indexOf("MacIntel") != -1) {
        vPlatformMacintosh = true;
        vPlatform = "mac";
    } else if (vBrowserPlatform.indexOf("X11") != -1 || vBrowserPlatform.indexOf("Linux") != -1 || vBrowserPlatform.indexOf("BSD") != -1) {
        vPlatformUnix = true;
        vPlatform = "unix";
    } else {
        vPlatformOther = true;
        vPlatform = "other";
    }
    var vGfxVml = false;
    var vGfxSvg = false;
    var vGfxSvgBuiltin = false;
    var vGfxSvgPlugin = false;
    if (vEngine == "mshtml") {
        vGfxVml = true;
    }
    if (document.implementation && document.implementation.hasFeature) {
        if (document.implementation.hasFeature("org.w3c.dom.svg", "1.0")) {
            vGfxSvg = vGfxSvgBuiltin = true;
        }
    }
    this._runsLocally = vRunsLocally;
    this._engineName = vEngine;
    this._engineNameMshtml = vEngine === "mshtml";
    this._engineNameGecko = vEngine === "gecko";
    this._engineNameOpera = vEngine === "opera";
    this._engineNameKhtml = vEngine === "khtml";
    this._engineNameWebkit = vEngine === "webkit";
    this._engineVersion = parseFloat(vEngineVersion);
    this._engineVersionMajor = parseInt(vEngineVersionMajor);
    this._engineVersionMinor = parseInt(vEngineVersionMinor);
    this._engineVersionRevision = parseInt(vEngineVersionRevision);
    this._engineVersionBuild = parseInt(vEngineVersionBuild);
    this._engineQuirksMode = vEngineQuirksMode;
    this._engineBoxSizingAttribute = vEngineBoxSizingAttr;
    this._engineEmulation = vEngineEmulation;
    this._defaultLocale = vDefaultLocale;
    this._browserPlatform = vPlatform;
    this._browserPlatformWindows = vPlatformWindows;
    this._browserPlatformMacintosh = vPlatformMacintosh;
    this._browserPlatformUnix = vPlatformUnix;
    this._browserPlatformOther = vPlatformOther;
    this._browserModeHta = vBrowserModeHta;
    this._browserLocale = vBrowserLocale;
    this._browserLocaleVariant = vBrowserLocaleVariant;
    this._browser = vBrowser;
    this._gfxVml = vGfxVml;
    this._gfxSvg = vGfxSvg;
    this._gfxSvgBuiltin = vGfxSvgBuiltin;
    this._gfxSvgPlugin = vGfxSvgPlugin;
});
qxp.Proto.getRunsLocally = function() {
    return this._runsLocally;
};
qxp.Proto.getEngine = function() {
    return this._engineName;
};
qxp.Proto.getMajor = function() {
    return this._engineVersionMajor;
};
qxp.Proto.getMinor = function() {
    return this._engineVersionMinor;
};
qxp.Proto.getRevision = function() {
    return this._engineVersionRevision;
};
qxp.Proto.isMshtml = function() {
    return this._engineNameMshtml;
};
qxp.Proto.isGecko = function() {
    return this._engineNameGecko;
};
qxp.Proto.isOpera = function() {
    return this._engineNameOpera;
};
qxp.Proto.isKhtml = function() {
    return this._engineNameKhtml;
};
qxp.Proto.isWebkit = function() {
    return this._engineNameWebkit;
};
qxp.Proto.isMobileSafari = function() {
    return (this._browser == "mobile safari");
};
qxp.Proto.isInQuirksMode = function() {
    return this._engineQuirksMode;
};
qxp.Proto.getLocale = function() {
    return this._browserLocale;
};
qxp.Proto.getPlatform = function() {
    return this._browserPlatform;
};
qxp.Proto.runsOnMacintosh = function() {
    return this._browserPlatformMacintosh;
};
qxp.Class.getInstance = qxp.util.Return.returnInstance;




/* ID: qxp.dom.DomEventRegistration */
qxp.OO.defineClass("qxp.dom.DomEventRegistration");
if (qxp.sys.Client.getInstance().isMshtml() && qxp.sys.Client.getInstance().getMajor() < 11) {
    qxp.dom.DomEventRegistration.addEventListener = function(vElement, vType, vFunction) {
        vElement.attachEvent(qxp.constant.Core.ON + vType, vFunction);
    };
    qxp.dom.DomEventRegistration.removeEventListener = function(vElement, vType, vFunction) {
        vElement.detachEvent(qxp.constant.Core.ON + vType, vFunction);
    };
} else {
    qxp.dom.DomEventRegistration.addEventListener = function(vElement, vType, vFunction) {
        vElement.addEventListener(vType, vFunction, false);
    };
    qxp.dom.DomEventRegistration.removeEventListener = function(vElement, vType, vFunction) {
        vElement.removeEventListener(vType, vFunction, false);
    };
}



/* ID: qxp.core.Init */
qxp.OO.defineClass("qxp.core.Init", qxp.core.Target, function() {
    qxp.core.Target.call(this, false);
    var o = this;
    this.__onload = function(e) {
        return o._onload(e);
    };
    this.__onbeforeunload = function(e) {
        return o._onbeforeunload(e);
    };
    this.__onunload = function(e) {
        return o._onunload(e);
    };
    qxp.dom.DomEventRegistration.addEventListener(window, "load", this.__onload);
    qxp.dom.DomEventRegistration.addEventListener(window, "beforeunload", this.__onbeforeunload);
    qxp.dom.DomEventRegistration.addEventListener(window, "unload", this.__onunload);
});
qxp.Settings.setDefault("component", "qxp.component.init.InterfaceInitComponent");
qxp.OO.addProperty({
    name: "component",
    type: qxp.constant.Type.OBJECT,
    instance: "qxp.component.init.BasicInitComponent"
});
qxp.OO.addProperty({
    name: "application",
    type: qxp.constant.Type.FUNCTION
});
qxp.Proto._modifyApplication = function(propValue) {
    if (propValue) {
        this._applicationInstance = new propValue;
    }
};
qxp.Proto.getApplicationInstance = function() {
    if (!this.getApplication()) {
        this.setApplication(qxp.component.DummyApplication);
    }
    return this._applicationInstance;
};
qxp.Proto._onload = function(e) {
    this.debug("qooxdoo " + qxp.core.Version.toString());
    this.debug("loaded " + qxp.lang.Object.getLength(qxp.OO.classes) + " classes");
    var cl = qxp.sys.Client.getInstance();
    this.debug("client: " + cl.getEngine() + "-" + cl.getMajor() + "." + cl.getMinor() + "/" + cl.getPlatform() + "/" + cl.getLocale());
    if (cl.isMshtml() && !cl.isInQuirksMode()) {
        this.warn("Wrong box sizing: Please modify the document's DOCTYPE!");
    }
    this.setComponent(new qxp.OO.classes[this.getSetting("component")](this));
    return this.getComponent()._onload(e);
};
qxp.Proto._onbeforeunload = function(e) {
    if (this.getComponent()) {
        return this.getComponent()._onbeforeunload(e);
    }
};
qxp.Proto._onunload = function(e) {
    if (this.getComponent()) {
        this.getComponent()._onunload(e);
    }
    qxp.core.Object.dispose();
};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    qxp.dom.DomEventRegistration.removeEventListener(window, "load", this.__onload);
    qxp.dom.DomEventRegistration.removeEventListener(window, "beforeunload", this.__onbeforeunload);
    qxp.dom.DomEventRegistration.removeEventListener(window, "unload", this.__onunload);
    this.__onload = this.__onbeforeunload = this.__onunload = null;
    if (this._applicationInstance) {
        this._applicationInstance.dispose();
        this._applicationInstance = null;
    }
    qxp.core.Target.prototype.dispose.call(this);
};
qxp.Class.getInstance = qxp.util.Return.returnInstance;
qxp.Class.getInstance();




/* ID: qxp.component.AbstractComponent */
qxp.OO.defineClass("qxp.component.AbstractComponent", qxp.core.Target, function() {
    qxp.core.Target.call(this);
});
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    return qxp.core.Target.prototype.dispose.call(this);
};




/* ID: qxp.component.init.AbstractInitComponent */
qxp.OO.defineClass("qxp.component.init.AbstractInitComponent", qxp.component.AbstractComponent, function() {
    qxp.component.AbstractComponent.call(this);
});
qxp.Proto.initialize = function(e) {
    return qxp.core.Init.getInstance().getApplicationInstance().initialize(e);
};
qxp.Proto.main = function(e) {
    return qxp.core.Init.getInstance().getApplicationInstance().main(e);
};
qxp.Proto.finalize = function(e) {
    return qxp.core.Init.getInstance().getApplicationInstance().finalize(e);
};
qxp.Proto.close = function(e) {
    return qxp.core.Init.getInstance().getApplicationInstance().close(e);
};
qxp.Proto.terminate = function(e) {
    return qxp.core.Init.getInstance().getApplicationInstance().terminate(e);
};




/* ID: qxp.component.init.BasicInitComponent */
qxp.OO.defineClass("qxp.component.init.BasicInitComponent", qxp.component.init.AbstractInitComponent, function() {
    qxp.component.init.AbstractInitComponent.call(this);
});
qxp.Proto._onload = function(e) {
    this.initialize(e);
    this.main(e);
    this.finalize(e);
};
qxp.Proto._onbeforeunload = function(e) {
    this.close(e);
};
qxp.Proto._onunload = function(e) {
    this.terminate(e);
};




/* ID: qxp.component.AbstractApplication */
qxp.OO.defineClass("qxp.component.AbstractApplication", qxp.component.AbstractComponent, function() {
    qxp.component.AbstractComponent.call(this);
});
qxp.Proto.initialize = function() {};
qxp.Proto.main = function() {};
qxp.Proto.finalize = function() {};
qxp.Proto.close = function() {};
qxp.Proto.terminate = function() {};




/* ID: qxp.component.DummyApplication */
qxp.OO.defineClass("qxp.component.DummyApplication", qxp.component.AbstractApplication, function() {
    qxp.component.AbstractApplication.call(this);
});
qxp.Class.getInstance = qxp.util.Return.returnInstance;




/* ID: qxp.core.Version */
qxp.OO.defineClass("qxp.core.Version", {
    major: 0,
    minor: 6,
    revision: 2,
    state: "pre",
    svn: Number("$Rev: 4314 $".match(/[0-9]+/)[0]),
    toString: function() {
        with(qxp.core.Version) {
            return major + "." + minor + (revision == 0 ? "" : "." + revision) + (state == "" ? "" : "-" + state) + " (r" + svn + ")";
        }
    }
});




/* ID: qxp.io.remote.Rpc */
qxp.OO.defineClass("qxp.io.remote.Rpc", qxp.core.Target, function(url, serviceName) {
    qxp.core.Target.call(this);
    this.setUrl(url);
    if (serviceName != null) {
        this.setServiceName(serviceName);
    }
    this._previousServerSuffix = null;
    this._currentServerSuffix = null;
    if (qxp.core.ServerSettings) {
        this._currentServerSuffix = qxp.core.ServerSettings.serverPathSuffix;
    }
});
qxp.OO.addProperty({
    name: "timeout",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "crossDomain",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "url",
    type: qxp.constant.Type.STRING,
    defaultValue: null
});
qxp.OO.addProperty({
    name: "serviceName",
    type: qxp.constant.Type.STRING,
    defaultValue: null
});
qxp.OO.addProperty({
    name: "serverData",
    type: qxp.constant.Type.OBJECT,
    defaultValue: undefined
});
qxp.OO.addProperty({
    name: "username",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "password",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "useBasicHttpAuth",
    type: qxp.constant.Type.BOOLEAN
});
qxp.io.remote.Rpc.origin = {
    server: 1,
    application: 2,
    transport: 3,
    local: 4
};
qxp.io.remote.Rpc.localError = {
    timeout: 1,
    abort: 2
};
qxp.Proto._callInternal = function(args, async, refreshSession) {
    var self = this;
    var offset = 0;
    var handler = args[0];
    if (async) {
        offset = 1;
    }
    var whichMethod = (refreshSession ? "refreshSession" : args[offset]);
    var argsArray = [];
    for (var i = offset + 1; i < args.length; ++i) {
        argsArray.push(args[i]);
    }
    var req = new qxp.io.remote.RemoteRequest(this.getUrl(), qxp.constant.Net.METHOD_POST, qxp.constant.Mime.JSON);
    var requestObject = {
        "service": (refreshSession ? null : this.getServiceName()),
        "method": whichMethod,
        "id": req.getSequenceNumber(),
        "params": argsArray
    };
    var serverData = this.getServerData();
    if (serverData !== undefined) {
        requestObject.server_data = serverData;
    }
    req.setCrossDomain(this.getCrossDomain());
    if (this.getUsername()) {
        req.setUseBasicHttpAuth(this.getUseBasicHttpAuth());
        req.setUsername(this.getUsername());
        req.setPassword(this.getPassword());
    }
    req.setTimeout(this.getTimeout());
    var ex = null;
    var id = null;
    var result = null;
    var handleRequestFinished = function() {
        if (async) {
            handler(result, ex, id);
        }
    };
    var addToStringToObject = function(obj) {
        obj.toString = function() {
            switch (obj.origin) {
                case qxp.io.remote.Rpc.origin.server:
                    return "Server error " + obj.code + ": " + obj.message;
                case qxp.io.remote.Rpc.origin.application:
                    return "Application error " + obj.code + ": " + obj.message;
                case qxp.io.remote.Rpc.origin.transport:
                    return "Transport error " + obj.code + ": " + obj.message;
                case qxp.io.remote.Rpc.origin.local:
                    return "Local error " + obj.code + ": " + obj.message;
                default:
                    return "UNEXPECTED origin " + obj.origin + " error " + obj.code + ": " + obj.message;
            }
        };
    };
    var makeException = function(origin, code, message) {
        var ex = new Object();
        ex.origin = origin;
        ex.code = code;
        ex.message = message;
        addToStringToObject(ex);
        return ex;
    };
    req.addEventListener("failed", function(evt) {
        var code = evt.getData().getStatusCode();
        ex = makeException(qxp.io.remote.Rpc.origin.transport, code, qxp.io.remote.RemoteExchange.statusCodeToString(code));
        id = this.getSequenceNumber();
        handleRequestFinished();
    });
    req.addEventListener("timeout", function(evt) {
        ex = makeException(qxp.io.remote.Rpc.origin.local, qxp.io.remote.Rpc.localError.timeout, "Local time-out expired");
        id = this.getSequenceNumber();
        handleRequestFinished();
    });
    req.addEventListener("aborted", function(evt) {
        ex = makeException(qxp.io.remote.Rpc.origin.local, qxp.io.remote.Rpc.localError.abort, "Aborted");
        id = this.getSequenceNumber();
        handleRequestFinished();
    });
    req.addEventListener("completed", function(evt) {
        result = evt.getData().getContent();
        id = result["id"];
        var exTest;
        if (id != this.getSequenceNumber()) {
            exTest = new Error("Received id (" + id + ") does not match requested id (" + this.getSequenceNumber + ")!");
        } else {
            exTest = result["error"];
        }
        if (exTest != null) {
            result = null;
            addToStringToObject(exTest);
            ex = exTest;
        } else {
            result = result["result"];
            if (refreshSession) {
                result = eval("(" + result + ")");
                var newSuffix = qxp.io.remote.Rpc.getSettingsObject(this._settingsKey).serverPathSuffix;
                if (self._currentServerSuffix != newSuffix) {
                    self._previousServerSuffix = self._currentServerSuffix;
                    self._currentServerSuffix = newSuffix;
                }
                self.setUrl(self.fixUrl(self.getUrl()));
            }
        }
        handleRequestFinished();
    });
    req.setData(qxp.io.Json.stringify(requestObject));
    req.setAsynchronous(async);
    if (req.getCrossDomain()) {
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    } else {
        req.setRequestHeader("Content-Type", qxp.constant.Mime.JSON);
    }
    req.send();
    if (!async) {
        if (ex != null) {
            var error = new Error(ex.toString());
            error.rpcdetails = ex;
            throw error;
        }
        return result;
    } else {
        return req;
    }
};
qxp.Proto.fixUrl = function(url) {
    if (this._previousServerSuffix == null || this._currentServerSuffix == null || this._previousServerSuffix == "" || this._previousServerSuffix == this._currentServerSuffix) {
        return url;
    }
    var index = url.indexOf(this._previousServerSuffix);
    if (index == -1) {
        return url;
    }
    return url.substring(0, index) + this._currentServerSuffix + url.substring(index + this._previousServerSuffix.length);
};
qxp.Proto.callSync = function(methodName) {
    return this._callInternal(arguments, false);
};
qxp.Proto.callAsync = function(handler, methodName) {
    return this._callInternal(arguments, true);
};
qxp.Proto.refreshSession = function(handler) {
    if (this.getCrossDomain()) {
        var settingsObject = qxp.io.remote.Rpc.getSettingsObject(this._settingsKey);
        if (settingsObject && settingsObject.serverPathSuffix) {
            var timeDiff = (new Date()).getTime() - settingsObject.lastSessionRefresh;
            if (timeDiff / 1000 > (settingsObject.sessionTimeoutInSeconds - 30)) {
                this._callInternal([handler], true, true);
            } else {
                handler(true);
            }
        } else {
            handler(false);
        }
    } else {
        handler(true);
    }
};
qxp.Proto.abort = function(opaqueCallRef) {
    opaqueCallRef.abort();
};
qxp.Class.getSettingsObject = function(key) {
    return (key == null ? qxp.core.ServerSettings : qxp.core["ServerSettings_" + key]);
};
qxp.Class.makeServerURL = function(instanceId, key) {
    var retVal = null;
    var settingsObject = qxp.io.remote.Rpc.getSettingsObject(key);
    if (settingsObject) {
        retVal = settingsObject.serverPathPrefix + "/.qxrpc" + settingsObject.serverPathSuffix;
        if (instanceId != null) {
            retVal += "?instanceId=" + instanceId;
        }
    }
    return retVal;
};
qxp.Class.serverInstanceIdCounter = 0;




/* ID: qxp.constant.Mime */
qxp.OO.defineClass("qxp.constant.Mime", {
    JAVASCRIPT: "text/javascript",
    JSON: "application/json",
    XML: "application/xml",
    TEXT: "text/plain",
    HTML: "text/html"
});




/* ID: qxp.constant.Net */
qxp.OO.defineClass("qxp.constant.Net", {
    STATE_CREATED: "created",
    STATE_CONFIGURED: "configured",
    STATE_QUEUED: "queued",
    STATE_SENDING: "sending",
    STATE_RECEIVING: "receiving",
    STATE_COMPLETED: "completed",
    STATE_ABORTED: "aborted",
    STATE_FAILED: "failed",
    STATE_TIMEOUT: "timeout",
    PROTOCOL_HTTP: "http",
    PROTOCOL_HTTPS: "https",
    PROTOCOL_FTP: "ftp",
    PROTOCOL_FILE: "file",
    URI_HTTP: "http:/" + "/",
    URI_HTTPS: "https:/" + "/",
    URI_FTP: "ftp:/" + "/",
    URI_FILE: "file:/" + "/",
    METHOD_GET: "GET",
    METHOD_POST: "POST",
    METHOD_PUT: "PUT",
    METHOD_HEAD: "HEAD",
    METHOD_DELETE: "DELETE"
});




/* ID: qxp.io.remote.RemoteRequest */
qxp.OO.defineClass("qxp.io.remote.RemoteRequest", qxp.core.Target, function(vUrl, vMethod, vResponseType) {
    qxp.core.Target.call(this);
    this._requestHeaders = {};
    this._parameters = {};
    this.setUrl(vUrl);
    this.setMethod(vMethod || qxp.constant.Net.METHOD_GET);
    this.setResponseType(vResponseType || qxp.constant.Mime.TEXT);
    this.setProhibitCaching(true);
    this.setRequestHeader("X-Requested-With", "qooxdoo");
    this.setRequestHeader("X-Qooxdoo-Version", qxp.core.Version.toString());
    this._seqNum = ++qxp.io.remote.RemoteRequest._seqNum;
});
qxp.OO.addProperty({
    name: "url",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "method",
    type: qxp.constant.Type.STRING,
    possibleValues: [qxp.constant.Net.METHOD_GET, qxp.constant.Net.METHOD_POST, qxp.constant.Net.METHOD_PUT, qxp.constant.Net.METHOD_HEAD, qxp.constant.Net.METHOD_DELETE]
});
qxp.OO.addProperty({
    name: "asynchronous",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: true,
    getAlias: "isAsynchronous"
});
qxp.OO.addProperty({
    name: "data",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "username",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "password",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "state",
    type: qxp.constant.Type.STRING,
    possibleValues: [qxp.constant.Net.STATE_CONFIGURED, qxp.constant.Net.STATE_QUEUED, qxp.constant.Net.STATE_SENDING, qxp.constant.Net.STATE_RECEIVING, qxp.constant.Net.STATE_COMPLETED, qxp.constant.Net.STATE_ABORTED, qxp.constant.Net.STATE_TIMEOUT, qxp.constant.Net.STATE_FAILED],
    defaultValue: qxp.constant.Net.STATE_CONFIGURED
});
qxp.OO.addProperty({
    name: "responseType",
    type: qxp.constant.Type.STRING,
    possibleValues: [qxp.constant.Mime.TEXT, qxp.constant.Mime.JAVASCRIPT, qxp.constant.Mime.JSON, qxp.constant.Mime.XML, qxp.constant.Mime.HTML]
});
qxp.OO.addProperty({
    name: "timeout",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "prohibitCaching",
    type: qxp.constant.Type.BOOLEAN
});
qxp.OO.addProperty({
    name: "crossDomain",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "transport",
    type: qxp.constant.Type.OBJECT,
    instance: "qxp.io.remote.RemoteExchange"
});
qxp.OO.addProperty({
    name: "useBasicHttpAuth",
    type: qxp.constant.Type.BOOLEAN
});
qxp.Proto.send = function() {
    qxp.io.remote.RemoteRequestQueue.getInstance().add(this);
};
qxp.Proto.abort = function() {
    qxp.io.remote.RemoteRequestQueue.getInstance().abort(this);
};
qxp.Proto.reset = function() {
    switch (this.getState()) {
        case qxp.constant.Net.STATE_SENDING:
        case qxp.constant.Net.STATE_RECEIVING:
            this.error("Aborting already sent request!");
        case qxp.constant.Net.STATE_QUEUED:
            this.abort();
            break;
    }
};
qxp.Proto._onqueued = function(e) {
    this.setState(qxp.constant.Net.STATE_QUEUED);
    this.dispatchEvent(e);
};
qxp.Proto._onsending = function(e) {
    this.setState(qxp.constant.Net.STATE_SENDING);
    this.dispatchEvent(e);
};
qxp.Proto._onreceiving = function(e) {
    this.setState(qxp.constant.Net.STATE_RECEIVING);
    this.dispatchEvent(e);
};
qxp.Proto._oncompleted = function(e) {
    this.setState(qxp.constant.Net.STATE_COMPLETED);
    this.dispatchEvent(e);
    this.dispose();
};
qxp.Proto._onaborted = function(e) {
    this.setState(qxp.constant.Net.STATE_ABORTED);
    this.dispatchEvent(e);
    this.dispose();
};
qxp.Proto._ontimeout = function(e) {
    this.setState(qxp.constant.Net.STATE_TIMEOUT);
    this.dispatchEvent(e);
    this.dispose();
};
qxp.Proto._onfailed = function(e) {
    this.setState(qxp.constant.Net.STATE_FAILED);
    this.dispatchEvent(e);
    this.dispose();
};
qxp.Proto._modifyState = function(propValue) {
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this.debug("State: " + propValue);
    }
};
qxp.Proto._modifyProhibitCaching = function(propValue) {
    propValue ? this.setParameter("nocache", new Date().valueOf()) : this.removeParameter("nocache");
};
qxp.Proto._modifyMethod = function(propValue) {
    if (propValue === qxp.constant.Net.METHOD_POST) {
        this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
};
qxp.Proto._modifyResponseType = function(propValue) {
    this.setRequestHeader("X-Qooxdoo-Response-Type", propValue);
};
qxp.Proto.setRequestHeader = function(vId, vValue) {
    this._requestHeaders[vId] = vValue;
};
qxp.Proto.getRequestHeaders = function() {
    return this._requestHeaders;
};
qxp.Proto.setParameter = function(vId, vValue) {
    this._parameters[vId] = vValue;
};
qxp.Proto.removeParameter = function(vId) {
    delete this._parameters[vId];
};
qxp.Proto.getParameters = function() {
    return this._parameters;
};
qxp.io.remote.RemoteRequest._seqNum = 0;
qxp.Proto.getSequenceNumber = function() {
    return this._seqNum;
};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    this._requestHeaders = null;
    this._parameters = null;
    this.setTransport(null);
    return qxp.core.Target.prototype.dispose.call(this);
};




/* ID: qxp.io.remote.RemoteExchange */
qxp.OO.defineClass("qxp.io.remote.RemoteExchange", qxp.core.Target, function(vRequest) {
    qxp.core.Target.call(this);
    this.setRequest(vRequest);
    vRequest.setTransport(this);
});
qxp.Settings.setDefault("enableDebug", false);
qxp.io.remote.RemoteExchange.typesOrder = ["qxp.io.remote.XmlHttpTransport", "qxp.io.remote.IframeTransport", "qxp.io.remote.ScriptTransport"];
qxp.io.remote.RemoteExchange.typesReady = false;
qxp.io.remote.RemoteExchange.typesAvailable = {};
qxp.io.remote.RemoteExchange.typesSupported = {};
qxp.io.remote.RemoteExchange.registerType = function(vClass, vId) {
    qxp.io.remote.RemoteExchange.typesAvailable[vId] = vClass;
};
qxp.io.remote.RemoteExchange.initTypes = function() {
    if (qxp.io.remote.RemoteExchange.typesReady) {
        return;
    }
    for (var vId in qxp.io.remote.RemoteExchange.typesAvailable) {
        vTransporterImpl = qxp.io.remote.RemoteExchange.typesAvailable[vId];
        if (vTransporterImpl.isSupported()) {
            qxp.io.remote.RemoteExchange.typesSupported[vId] = vTransporterImpl;
        }
    }
    qxp.io.remote.RemoteExchange.typesReady = true;
    if (qxp.lang.Object.isEmpty(qxp.io.remote.RemoteExchange.typesSupported)) {
        throw new Error("No supported transport types were found!");
    }
};
qxp.io.remote.RemoteExchange.canHandle = function(vImpl, vNeeds, vResponseType) {
    if (!qxp.lang.Array.contains(vImpl.handles.responseTypes, vResponseType)) {
        return false;
    }
    for (var vKey in vNeeds) {
        if (!vImpl.handles[vKey]) {
            return false;
        }
    }
    return true;
};
qxp.io.remote.RemoteExchange._nativeMap = {
    0: qxp.constant.Net.STATE_CREATED,
    1: qxp.constant.Net.STATE_CONFIGURED,
    2: qxp.constant.Net.STATE_SENDING,
    3: qxp.constant.Net.STATE_RECEIVING,
    4: qxp.constant.Net.STATE_COMPLETED
};
qxp.io.remote.RemoteExchange.wasSuccessful = function(vStatusCode, vReadyState, vIsLocal) {
    if (vIsLocal) {
        switch (vStatusCode) {
            case null:
            case 0:
                return true;
            case -1:
                return vReadyState < 4;
            default:
                return typeof vStatusCode === qxp.constant.Type.UNDEFINED;
        }
    } else {
        switch (vStatusCode) {
            case -1:
                if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug") && vReadyState > 3) {
                    qxp.dev.log.Logger.getClassLogger(qxp.io.remote.RemoteExchange).debug("Failed with statuscode: -1 at readyState " + vReadyState);
                }
                return vReadyState < 4;
            case 200:
            case 304:
                return true;
            case 201:
            case 202:
            case 203:
            case 204:
            case 205:
                return true;
            case 206:
                if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug") && vReadyState === 4) {
                    qxp.dev.log.Logger.getClassLogger(qxp.io.remote.RemoteExchange).debug("Failed with statuscode: 206 (Partial content while being complete!)");
                }
                return vReadyState !== 4;
            case 300:
            case 301:
            case 302:
            case 303:
            case 305:
            case 400:
            case 401:
            case 402:
            case 403:
            case 404:
            case 405:
            case 406:
            case 407:
            case 408:
            case 409:
            case 410:
            case 411:
            case 412:
            case 413:
            case 414:
            case 415:
            case 500:
            case 501:
            case 502:
            case 503:
            case 504:
            case 505:
                if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
                    qxp.dev.log.Logger.getClassLogger(qxp.io.remote.RemoteExchange).debug("Failed with typical HTTP statuscode: " + vStatusCode);
                }
                return false;
            case 12002:
            case 12029:
            case 12030:
            case 12031:
            case 12152:
            case 13030:
                if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
                    qxp.dev.log.Logger.getClassLogger(qxp.io.remote.RemoteExchange).debug("Failed with MSHTML specific HTTP statuscode: " + vStatusCode);
                }
                return false;
            default:
                if (vStatusCode > 206 && vStatusCode < 300) {
                    return true;
                }
                qxp.dev.log.Logger.getClassLogger(qxp.io.remote.RemoteExchange).debug("Unknown status code: " + vStatusCode + " (" + vReadyState + ")");
                throw new Error("Unknown status code: " + vStatusCode);
        }
    }
};
qxp.io.remote.RemoteExchange.statusCodeToString = function(vStatusCode) {
    switch (vStatusCode) {
        case -1:
            return "Not available";
        case 200:
            return "Ok";
        case 304:
            return "Not modified";
        case 206:
            return "Partial content";
        case 204:
            return "No content";
        case 300:
            return "Multiple choices";
        case 301:
            return "Moved permanently";
        case 302:
            return "Moved temporarily";
        case 303:
            return "See other";
        case 305:
            return "Use proxy";
        case 400:
            return "Bad request";
        case 401:
            return "Unauthorized";
        case 402:
            return "Payment required";
        case 403:
            return "Forbidden";
        case 404:
            return "Not found";
        case 405:
            return "Method not allowed";
        case 406:
            return "Not acceptable";
        case 407:
            return "Proxy authentication required";
        case 408:
            return "Request time-out";
        case 409:
            return "Conflict";
        case 410:
            return "Gone";
        case 411:
            return "Length required";
        case 412:
            return "Precondition failed";
        case 413:
            return "Request entity too large";
        case 414:
            return "Request-URL too large";
        case 415:
            return "Unsupported media type";
        case 500:
            return "Server error";
        case 501:
            return "Not implemented";
        case 502:
            return "Bad gateway";
        case 503:
            return "Out of resources";
        case 504:
            return "Gateway time-out";
        case 505:
            return "HTTP version not supported";
        case 12002:
            return "Server timeout";
        case 12029:
            return "Connection dropped";
        case 12030:
            return "Connection dropped";
        case 12031:
            return "Connection dropped";
        case 12152:
            return "Connection closed by server";
        case 13030:
            return "MSHTML-specific HTTP status code";
        default:
            return "Unknown status code";
    }
};
qxp.OO.addProperty({
    name: "request",
    type: qxp.constant.Type.OBJECT,
    instance: "qxp.io.remote.RemoteRequest"
});
qxp.OO.addProperty({
    name: "implementation",
    type: qxp.constant.Type.OBJECT
});
qxp.OO.addProperty({
    name: "state",
    type: qxp.constant.Type.STRING,
    possibleValues: [qxp.constant.Net.STATE_CONFIGURED, qxp.constant.Net.STATE_SENDING, qxp.constant.Net.STATE_RECEIVING, qxp.constant.Net.STATE_COMPLETED, qxp.constant.Net.STATE_ABORTED, qxp.constant.Net.STATE_TIMEOUT, qxp.constant.Net.STATE_FAILED],
    defaultValue: qxp.constant.Net.STATE_CONFIGURED
});
qxp.Proto.send = function() {
    var vRequest = this.getRequest();
    if (!vRequest) {
        return this.error("Please attach a request object first");
    }
    qxp.io.remote.RemoteExchange.initTypes();
    var vUsage = qxp.io.remote.RemoteExchange.typesOrder;
    var vSupported = qxp.io.remote.RemoteExchange.typesSupported;
    var vResponseType = vRequest.getResponseType();
    var vNeeds = {};
    if (vRequest.getAsynchronous()) {
        vNeeds.asynchronous = true;
    } else {
        vNeeds.synchronous = true;
    }
    if (vRequest.getCrossDomain()) {
        vNeeds.crossDomain = true;
    }
    var vTransportImpl, vTransport;
    for (var i = 0, l = vUsage.length; i < l; i++) {
        vTransportImpl = vSupported[vUsage[i]];
        if (vTransportImpl) {
            if (!qxp.io.remote.RemoteExchange.canHandle(vTransportImpl, vNeeds, vResponseType)) {
                continue;
            }
            try {
                if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
                    this.debug("Using implementation: " + vTransportImpl.classname);
                }
                vTransport = new vTransportImpl;
                this.setImplementation(vTransport);
                vTransport.setUseBasicHttpAuth(vRequest.getUseBasicHttpAuth());
                vTransport.send();
                return true;
            } catch (ex) {
                return this.error("Request handler throws error", ex);
            }
        }
    }
    this.error("There is no transport implementation available to handle this request: " + vRequest);
};
qxp.Proto.abort = function() {
    var vImplementation = this.getImplementation();
    if (vImplementation) {
        if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
            this.debug("Abort: implementation " + vImplementation.toHashCode());
        }
        vImplementation.abort();
    } else {
        if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
            this.debug("Abort: forcing state to be aborted");
        }
        this.setState(qxp.constant.Net.STATE_ABORTED);
    }
};
qxp.Proto.timeout = function() {
    var vImplementation = this.getImplementation();
    if (vImplementation) {
        this.warn("Timeout: implementation " + vImplementation.toHashCode());
        vImplementation.timeout();
    } else {
        this.warn("Timeout: forcing state to timeout");
        this.setState(qxp.constant.Net.STATE_TIMEOUT);
    }
    if (this.getRequest()) {
        this.getRequest().setTimeout(0);
    }
};
qxp.Proto._onsending = function(e) {
    this.setState(qxp.constant.Net.STATE_SENDING);
};
qxp.Proto._onreceiving = function(e) {
    this.setState(qxp.constant.Net.STATE_RECEIVING);
};
qxp.Proto._oncompleted = function(e) {
    this.setState(qxp.constant.Net.STATE_COMPLETED);
};
qxp.Proto._onabort = function(e) {
    this.setState(qxp.constant.Net.STATE_ABORTED);
};
qxp.Proto._onfailed = function(e) {
    this.setState(qxp.constant.Net.STATE_FAILED);
};
qxp.Proto._ontimeout = function(e) {
    this.setState(qxp.constant.Net.STATE_TIMEOUT);
};
qxp.Proto._modifyImplementation = function(propValue, propOldValue) {
    if (propOldValue) {
        propOldValue.removeEventListener(qxp.constant.Event.SENDING, this._onsending, this);
        propOldValue.removeEventListener(qxp.constant.Event.RECEIVING, this._onreceiving, this);
        propOldValue.removeEventListener(qxp.constant.Event.COMPLETED, this._oncompleted, this);
        propOldValue.removeEventListener(qxp.constant.Event.ABORTED, this._onabort, this);
        propOldValue.removeEventListener(qxp.constant.Event.TIMEOUT, this._ontimeout, this);
        propOldValue.removeEventListener(qxp.constant.Event.FAILED, this._onfailed, this);
    }
    if (propValue) {
        var vRequest = this.getRequest();
        propValue.setUrl(vRequest.getUrl());
        propValue.setMethod(vRequest.getMethod());
        propValue.setAsynchronous(vRequest.getAsynchronous());
        propValue.setUsername(vRequest.getUsername());
        propValue.setPassword(vRequest.getPassword());
        propValue.setParameters(vRequest.getParameters());
        propValue.setRequestHeaders(vRequest.getRequestHeaders());
        propValue.setData(vRequest.getData());
        propValue.setResponseType(vRequest.getResponseType());
        propValue.addEventListener(qxp.constant.Event.SENDING, this._onsending, this);
        propValue.addEventListener(qxp.constant.Event.RECEIVING, this._onreceiving, this);
        propValue.addEventListener(qxp.constant.Event.COMPLETED, this._oncompleted, this);
        propValue.addEventListener(qxp.constant.Event.ABORTED, this._onabort, this);
        propValue.addEventListener(qxp.constant.Event.TIMEOUT, this._ontimeout, this);
        propValue.addEventListener(qxp.constant.Event.FAILED, this._onfailed, this);
    }
};
qxp.Proto._modifyState = function(propValue, propOldValue) {
    var vRequest = this.getRequest();
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this.debug("State: " + propOldValue + " => " + propValue);
    }
    switch (propValue) {
        case qxp.constant.Net.STATE_SENDING:
            this.createDispatchEvent(qxp.constant.Event.SENDING);
            break;
        case qxp.constant.Net.STATE_RECEIVING:
            this.createDispatchEvent(qxp.constant.Event.RECEIVING);
            break;
        case qxp.constant.Net.STATE_COMPLETED:
        case qxp.constant.Net.STATE_ABORTED:
        case qxp.constant.Net.STATE_TIMEOUT:
        case qxp.constant.Net.STATE_FAILED:
            var vImpl = this.getImplementation();
            if (!vImpl) {
                break;
            }
            var vResponse = new qxp.io.remote.RemoteResponse;
            if (propValue == qxp.constant.Net.STATE_COMPLETED) {
                var vContent = vImpl.getResponseContent();
                vResponse.setContent(vContent);
                if (vContent === null) {
                    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
                        this.debug("Altered State: " + propValue + " => failed");
                    }
                    propValue = qxp.constant.Net.STATE_FAILED;
                }
            }
            vResponse.setStatusCode(vImpl.getStatusCode());
            vResponse.setResponseHeaders(vImpl.getResponseHeaders());
            var vEventType;
            switch (propValue) {
                case qxp.constant.Net.STATE_COMPLETED:
                    vEventType = qxp.constant.Event.COMPLETED;
                    break;
                case qxp.constant.Net.STATE_ABORTED:
                    vEventType = qxp.constant.Event.ABORTED;
                    break;
                case qxp.constant.Net.STATE_TIMEOUT:
                    vEventType = qxp.constant.Event.TIMEOUT;
                    break;
                case qxp.constant.Net.STATE_FAILED:
                    vEventType = qxp.constant.Event.FAILED;
                    break;
            }
            this.setImplementation(null);
            vImpl.dispose();
            this.createDispatchDataEvent(vEventType, vResponse);
            vResponse.dispose();
            break;
    }
};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    var vImpl = this.getImplementation();
    if (vImpl) {
        this.setImplementation(null);
        vImpl.dispose();
    }
    this.setRequest(null);
    return qxp.core.Target.prototype.dispose.call(this);
};




/* ID: qxp.io.remote.AbstractRemoteTransport */
qxp.OO.defineClass("qxp.io.remote.AbstractRemoteTransport", qxp.core.Target, function() {
    qxp.core.Target.call(this);
});
qxp.OO.addProperty({
    name: "url",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "method",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "asynchronous",
    type: qxp.constant.Type.BOOLEAN
});
qxp.OO.addProperty({
    name: "data",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "username",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "password",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "state",
    type: qxp.constant.Type.STRING,
    possibleValues: [qxp.constant.Net.STATE_CREATED, qxp.constant.Net.STATE_CONFIGURED, qxp.constant.Net.STATE_SENDING, qxp.constant.Net.STATE_RECEIVING, qxp.constant.Net.STATE_COMPLETED, qxp.constant.Net.STATE_ABORTED, qxp.constant.Net.STATE_TIMEOUT, qxp.constant.Net.STATE_FAILED],
    defaultValue: qxp.constant.Net.STATE_CREATED
});
qxp.OO.addProperty({
    name: "requestHeaders",
    type: qxp.constant.Type.OBJECT
});
qxp.OO.addProperty({
    name: "parameters",
    type: qxp.constant.Type.OBJECT
});
qxp.OO.addProperty({
    name: "responseType",
    type: qxp.constant.Type.STRING
});
qxp.OO.addProperty({
    name: "useBasicHttpAuth",
    type: qxp.constant.Type.BOOLEAN
});
qxp.Proto.send = function() {
    throw new Error("send is abstract");
};
qxp.Proto.abort = function() {
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this.warn("Aborting...");
    }
    this.setState(qxp.constant.Net.STATE_ABORTED);
};
qxp.Proto.timeout = function() {
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this.warn("Timeout...");
    }
    this.setState(qxp.constant.Net.STATE_TIMEOUT);
};
qxp.Proto.failed = function() {
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this.warn("Failed...");
    }
    this.setState(qxp.constant.Net.STATE_FAILED);
};
qxp.Proto.setRequestHeader = function(vLabel, vValue) {
    throw new Error("setRequestHeader is abstract");
};
qxp.Proto.getResponseHeader = function(vLabel) {
    throw new Error("getResponseHeader is abstract");
};
qxp.Proto.getResponseHeaders = function() {
    throw new Error("getResponseHeaders is abstract");
};
qxp.Proto.getStatusCode = function() {
    throw new Error("getStatusCode is abstract");
};
qxp.Proto.getResponseText = function() {
    throw new Error("getResponseText is abstract");
};
qxp.Proto.getResponseXml = function() {
    throw new Error("getResponseXml is abstract");
};
qxp.Proto._modifyState = function(propValue) {
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this.debug("State: " + propValue);
    }
    switch (propValue) {
        case qxp.constant.Net.STATE_CREATED:
            this.createDispatchEvent(qxp.constant.Event.CREATED);
            break;
        case qxp.constant.Net.STATE_CONFIGURED:
            this.createDispatchEvent(qxp.constant.Event.CONFIGURED);
            break;
        case qxp.constant.Net.STATE_SENDING:
            this.createDispatchEvent(qxp.constant.Event.SENDING);
            break;
        case qxp.constant.Net.STATE_RECEIVING:
            this.createDispatchEvent(qxp.constant.Event.RECEIVING);
            break;
        case qxp.constant.Net.STATE_COMPLETED:
            this.createDispatchEvent(qxp.constant.Event.COMPLETED);
            break;
        case qxp.constant.Net.STATE_ABORTED:
            this.createDispatchEvent(qxp.constant.Event.ABORTED);
            break;
        case qxp.constant.Net.STATE_FAILED:
            this.createDispatchEvent(qxp.constant.Event.FAILED);
            break;
        case qxp.constant.Net.STATE_TIMEOUT:
            this.createDispatchEvent(qxp.constant.Event.TIMEOUT);
            break;
    }
};




/* ID: qxp.constant.Event */
qxp.OO.defineClass("qxp.constant.Event", {
    MOUSEOVER: "mouseover",
    MOUSEMOVE: "mousemove",
    MOUSEOUT: "mouseout",
    MOUSEDOWN: "mousedown",
    MOUSEUP: "mouseup",
    MOUSEWHEEL: "mousewheel",
    CLICK: "click",
    DBLCLICK: "dblclick",
    CONTEXTMENU: "contextmenu",
    KEYDOWN: "keydown",
    KEYPRESS: "keypress",
    KEYUP: "keyup",
    BLUR: "blur",
    FOCUS: "focus",
    FOCUSIN: "focusin",
    FOCUSOUT: "focusout",
    SELECT: "select",
    SCROLL: "scroll",
    INPUT: "input",
    CHANGE: "change",
    RESIZE: "resize",
    CHANGESELECTION: "changeSelection",
    INTERVAL: "interval",
    EXECUTE: "execute",
    CREATE: "create",
    LOAD: "load",
    ERROR: "error",
    SUBMIT: "submit",
    UNLOAD: "unload",
    BEFOREUNLOAD: "beforeunload",
    TREEOPENWITHCONTENT: "treeOpenWithContent",
    TREEOPENWHILEEMPTY: "treeOpenWhileEmpty",
    TREECLOSE: "treeClose",
    BEFOREAPPEAR: "beforeAppear",
    APPEAR: "appear",
    BEFOREDISAPPEAR: "beforeDisappear",
    DISAPPEAR: "disappear",
    BEFOREINSERTDOM: "beforeInsertDom",
    INSERTDOM: "insertDom",
    BEFOREREMOVEDOM: "beforeRemoveDom",
    REMOVEDOM: "removeDom",
    DRAGDROP: "dragdrop",
    DRAGOVER: "dragover",
    DRAGOUT: "dragout",
    DRAGMOVE: "dragmove",
    DRAGSTART: "dragstart",
    DRAGEND: "dragend",
    CREATED: "created",
    CONFIGURED: "configured",
    QUEUED: "queued",
    SENDING: "sending",
    RECEIVING: "receiving",
    COMPLETED: "completed",
    ABORTED: "aborted",
    FAILED: "failed",
    TIMEOUT: "timeout",
    DIALOGOK: "dialogok",
    DIALOGCANCEL: "dialogcancel",
    DIALOGCLOSE: "dialogclose",
    DIALOGPREVIOUS: "dialogprevious",
    DIALOGNEXT: "dialognext",
    DIALOGFIRST: "dialogfirst",
    DIALOGLAST: "dialoglast"
});




/* ID: qxp.io.remote.XmlHttpTransport */
qxp.OO.defineClass("qxp.io.remote.XmlHttpTransport", qxp.io.remote.AbstractRemoteTransport, function() {
    qxp.io.remote.AbstractRemoteTransport.call(this);
    this._req = qxp.io.remote.XmlHttpTransport.createRequestObject();
    var o = this;
    this._req.onreadystatechange = function(e) {
        return o._onreadystatechange(e);
    };
});
qxp.io.remote.RemoteExchange.registerType(qxp.io.remote.XmlHttpTransport, "qxp.io.remote.XmlHttpTransport");
qxp.io.remote.XmlHttpTransport.handles = {
    synchronous: true,
    asynchronous: true,
    crossDomain: false,
    fileUpload: false,
    responseTypes: [qxp.constant.Mime.TEXT, qxp.constant.Mime.JAVASCRIPT, qxp.constant.Mime.JSON, qxp.constant.Mime.XML, qxp.constant.Mime.HTML]
};
qxp.io.remote.XmlHttpTransport.requestObjects = [];
qxp.io.remote.XmlHttpTransport.requestObjectCount = 0;
qxp.io.remote.XmlHttpTransport.isSupported = function() {
    if (window.XMLHttpRequest) {
        if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
            qxp.dev.log.Logger.getClassLogger(qxp.io.remote.XmlHttpTransport).debug("Using XMLHttpRequest");
        }
        qxp.io.remote.XmlHttpTransport.createRequestObject = qxp.io.remote.XmlHttpTransport._createNativeRequestObject;
        return true;
    }
    if (window.ActiveXObject) {
        var vServers = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
        var vObject;
        var vServer;
        for (var i = 0, l = vServers.length; i < l; i++) {
            vServer = vServers[i];
            try {
                vObject = new ActiveXObject(vServer);
                break;
            } catch (ex) {
                vObject = null;
            }
        }
        if (vObject) {
            if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
                qxp.dev.log.Logger.getClassLogger(qxp.io.remote.XmlHttpTransport).debug("Using ActiveXObject: " + vServer);
            }
            qxp.io.remote.XmlHttpTransport._activeXServer = vServer;
            qxp.io.remote.XmlHttpTransport.createRequestObject = qxp.io.remote.XmlHttpTransport._createActiveXRequestObject;
            return true;
        }
    }
    return false;
};
qxp.io.remote.XmlHttpTransport.createRequestObject = function() {
    throw new Error("XMLHTTP is not supported!");
};
qxp.io.remote.XmlHttpTransport._createNativeRequestObject = function() {
    return new XMLHttpRequest;
};
qxp.io.remote.XmlHttpTransport._createActiveXRequestObject = function() {
    return new ActiveXObject(qxp.io.remote.XmlHttpTransport._activeXServer);
};
qxp.Proto._localRequest = false;
qxp.Proto._lastReadyState = 0;
qxp.Proto.getRequest = function() {
    return this._req;
};
qxp.Proto.send = function() {
    this._lastReadyState = 0;
    var vRequest = this.getRequest();
    var vMethod = this.getMethod();
    var vAsynchronous = this.getAsynchronous();
    var vUrl = this.getUrl();
    var vLocalRequest = (qxp.sys.Client.getInstance().getRunsLocally() && !(/^http(s){0,1}\:/.test(vUrl)));
    this._localRequest = vLocalRequest;
    var vParameters = this.getParameters();
    var vParametersList = [];
    for (var vId in vParameters) {
        var value = vParameters[vId];
        if (value instanceof Array) {
            for (var i = 0; i < value.length; i++) {
                vParametersList.push(encodeURIComponent(vId) + qxp.constant.Core.EQUAL + encodeURIComponent(value[i]));
            }
        } else {
            vParametersList.push(encodeURIComponent(vId) + qxp.constant.Core.EQUAL + encodeURIComponent(value));
        }
    }
    if (vParametersList.length > 0) {
        vUrl += (vUrl.indexOf(qxp.constant.Core.QUESTIONMARK) >= 0 ? qxp.constant.Core.AMPERSAND : qxp.constant.Core.QUESTIONMARK) + vParametersList.join(qxp.constant.Core.AMPERSAND);
    }
    var encode64 = function(input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        } while (i < input.length);
        return output;
    };
    if (this.getUsername()) {
        if (this.getUseBasicHttpAuth()) {
            vRequest.open(vMethod, vUrl, vAsynchronous);
            vRequest.setRequestHeader('Authorization', 'Basic ' + encode64(this.getUsername() + ':' + this.getPassword()));
        } else {
            vRequest.open(vMethod, vUrl, vAsynchronous, this.getUsername(), this.getPassword());
        }
    } else {
        vRequest.open(vMethod, vUrl, vAsynchronous);
    }
    var vRequestHeaders = this.getRequestHeaders();
    for (var vId in vRequestHeaders) {
        vRequest.setRequestHeader(vId, vRequestHeaders[vId]);
    }
    try {
        if (!qxp.sys.Client.getInstance().isWebkit()) {
            vRequest.setRequestHeader("Referer", window.location.href);
        }
        var vResponseType = this.getResponseType();
        if (vResponseType && vRequest.overrideMimeType) {
            vRequest.overrideMimeType(vResponseType);
        }
        vRequest.send(this.getData());
    } catch (ex) {
        if (vLocalRequest) {
            this.failedLocally();
        } else {
            this.error("Failed to send data: " + ex, "send");
            this.failed();
        }
        return;
    }
    if (!vAsynchronous) {
        this._onreadystatechange();
    }
};
qxp.Proto.failedLocally = function() {
    if (this.getState() === qxp.constant.Net.STATE_FAILED) {
        return;
    }
    this.warn("Could not load from file: " + this.getUrl());
    this.failed();
};
qxp.Proto._onreadystatechange = function(e) {
    switch (this.getState()) {
        case qxp.constant.Net.STATE_COMPLETED:
        case qxp.constant.Net.STATE_ABORTED:
        case qxp.constant.Net.STATE_FAILED:
        case qxp.constant.Net.STATE_TIMEOUT:
            if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
                this.warn("Ignore Ready State Change");
            }
            return;
    }
    var vReadyState = this.getReadyState();
    if (vReadyState == 4) {
        if (!qxp.io.remote.RemoteExchange.wasSuccessful(this.getStatusCode(), vReadyState, this._localRequest)) {
            return this.failed();
        }
    }
    while (this._lastReadyState < vReadyState) {
        this.setState(qxp.io.remote.RemoteExchange._nativeMap[++this._lastReadyState]);
    }
};
qxp.Proto.getReadyState = function() {
    var vReadyState = null;
    try {
        vReadyState = this._req.readyState;
    } catch (ex) {}
    return vReadyState;
};
qxp.Proto.setRequestHeader = function(vLabel, vValue) {
    this._req.setRequestHeader(vLabel, vValue);
};
qxp.Proto.getResponseHeader = function(vLabel) {
    var vResponseHeader = null;
    try {
        this.getRequest().getResponseHeader(vLabel) || null;
    } catch (ex) {}
    return vResponseHeader;
};
qxp.Proto.getStringResponseHeaders = function() {
    var vSourceHeader = null;
    try {
        var vLoadHeader = this._req.getAllResponseHeaders();
        if (vLoadHeader) {
            vSourceHeader = vLoadHeader;
        }
    } catch (ex) {}
    return vSourceHeader;
};
qxp.Proto.getResponseHeaders = function() {
    var vSourceHeader = this.getStringResponseHeaders();
    var vHeader = {};
    if (vSourceHeader) {
        var vValues = vSourceHeader.split(/[\r\n]+/g);
        for (var i = 0, l = vValues.length; i < l; i++) {
            var vPair = vValues[i].match(/^([^:]+)\s*:\s*(.+)$/i);
            if (vPair) {
                vHeader[vPair[1]] = vPair[2];
            }
        }
    }
    return vHeader;
};
qxp.Proto.getStatusCode = function() {
    var vStatusCode = -1;
    try {
        vStatusCode = this.getRequest().status;
    } catch (ex) {}
    return vStatusCode;
};
qxp.Proto.getResponseText = function() {
    var vResponseText = null;
    var vStatus = this.getStatusCode();
    var vReadyState = this.getReadyState();
    if (qxp.io.remote.RemoteExchange.wasSuccessful(vStatus, vReadyState, this._localRequest)) {
        try {
            vResponseText = this.getRequest().responseText;
        } catch (ex) {}
    }
    return vResponseText;
};
qxp.Proto.getResponseXml = function() {
    var vResponseXML = null;
    var vStatus = this.getStatusCode();
    var vReadyState = this.getReadyState();
    if (qxp.io.remote.RemoteExchange.wasSuccessful(vStatus, vReadyState, this._localRequest)) {
        try {
            vResponseXML = this.getRequest().responseXML;
        } catch (ex) {}
    }
    return vResponseXML;
};
qxp.Proto.getResponseContent = function() {
    if (this.getState() !== qxp.constant.Net.STATE_COMPLETED) {
        if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
            this.warn("Transfer not complete, ignoring content!");
        }
        return null;
    }
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this.debug("Returning content for responseType: " + this.getResponseType());
    }
    var vText = this.getResponseText();
    switch (this.getResponseType()) {
        case qxp.constant.Mime.TEXT:
        case qxp.constant.Mime.HTML:
            return vText;
        case qxp.constant.Mime.JSON:
            try {
                return vText && vText.length > 0 ? qxp.io.Json.parseQx(vText) : null;
            } catch (ex) {
                this.error("Could not execute json: [" + vText + "]", ex);
                return "<pre>Could not execute json: \n" + vText + "\n</pre>";
            }
        case qxp.constant.Mime.JAVASCRIPT:
            try {
                return vText && vText.length > 0 ? window.eval(vText) : null;
            } catch (ex) {
                return this.error("Could not execute javascript: [" + vText + "]", ex);
            }
        case qxp.constant.Mime.XML:
            return this.getResponseXml();
        default:
            this.warn("No valid responseType specified (" + this.getResponseType() + ")!");
            return null;
    }
};
qxp.Proto._modifyState = function(propValue) {
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this.debug("State: " + propValue);
    }
    switch (propValue) {
        case qxp.constant.Net.STATE_CREATED:
            this.createDispatchEvent(qxp.constant.Event.CREATED);
            break;
        case qxp.constant.Net.STATE_CONFIGURED:
            this.createDispatchEvent(qxp.constant.Event.CONFIGURED);
            break;
        case qxp.constant.Net.STATE_SENDING:
            this.createDispatchEvent(qxp.constant.Event.SENDING);
            break;
        case qxp.constant.Net.STATE_RECEIVING:
            this.createDispatchEvent(qxp.constant.Event.RECEIVING);
            break;
        case qxp.constant.Net.STATE_COMPLETED:
            this.createDispatchEvent(qxp.constant.Event.COMPLETED);
            break;
        case qxp.constant.Net.STATE_FAILED:
            this.createDispatchEvent(qxp.constant.Event.FAILED);
            break;
        case qxp.constant.Net.STATE_ABORTED:
            this.getRequest().abort();
            this.createDispatchEvent(qxp.constant.Event.ABORTED);
            break;
        case qxp.constant.Net.STATE_TIMEOUT:
            this.getRequest().abort();
            this.createDispatchEvent(qxp.constant.Event.TIMEOUT);
            break;
    }
};
qxp.Proto.doNothing = function() {};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    var vRequest = this.getRequest();
    if (vRequest) {
        vRequest.onreadystatechange = this.doNothing;
        switch (vRequest.readyState) {
            case 1:
            case 2:
            case 3:
                vRequest.abort();
        }
        this._req = null;
    }
    return qxp.io.remote.AbstractRemoteTransport.prototype.dispose.call(this);
};




/* ID: qxp.io.Json */
qxp.OO.defineClass("qxp.io.Json");
qxp.Settings.setDefaultOfClass("qxp.io.Json", "encodeUndefined", true);
qxp.Settings.setDefaultOfClass("qxp.io.Json", "enableDebug", false);
qxp.io.Json = function() {
    var m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        s = {
            'boolean': function(x) {
                return String(x);
            },
            number: function(x) {
                return isFinite(x) ? String(x) : 'null';
            },
            string: function(x) {
                if (/["\\\x00-\x1f]/.test(x)) {
                    x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                    });
                }
                return '"' + x + '"';
            },
            object: function(x) {
                if (x) {
                    var a = [],
                        b, f, i, l, v;
                    if (x instanceof Array) {
                        var beautify = qxp.io.Json._beautify;
                        a[0] = '[';
                        if (beautify) {
                            qxp.io.Json._indent += qxp.io.Json.BEAUTIFYING_INDENT;
                            a.push(qxp.io.Json._indent);
                        }
                        l = x.length;
                        for (i = 0; i < l; i += 1) {
                            v = x[i];
                            f = s[typeof v];
                            if (f) {
                                v = f(v);
                                if (typeof v == 'string') {
                                    if (b) {
                                        a[a.length] = ',';
                                        if (beautify) {
                                            a.push(qxp.io.Json._indent);
                                        }
                                    }
                                    a[a.length] = v;
                                    b = true;
                                }
                            }
                        }
                        if (beautify) {
                            qxp.io.Json._indent = qxp.io.Json._indent.substring(0, qxp.io.Json._indent.length - qxp.io.Json.BEAUTIFYING_INDENT.length);
                            a.push(qxp.io.Json._indent);
                        }
                        a[a.length] = ']';
                    } else if (x instanceof Date) {
                        var dateParams = x.getUTCFullYear() + "," + x.getUTCMonth() + "," + x.getUTCDate() + "," + x.getUTCHours() + "," + x.getUTCMinutes() + "," + x.getUTCSeconds() + "," + x.getUTCMilliseconds();
                        return "new Date(Date.UTC(" + dateParams + "))";
                    } else if (x instanceof Object) {
                        var beautify = qxp.io.Json._beautify;
                        a[0] = '{';
                        if (beautify) {
                            qxp.io.Json._indent += qxp.io.Json.BEAUTIFYING_INDENT;
                            a.push(qxp.io.Json._indent);
                        }
                        for (i in x) {
                            v = x[i];
                            f = s[typeof v];
                            if (f) {
                                v = f(v);
                                if (typeof v == 'string') {
                                    if (b) {
                                        a[a.length] = ',';
                                        if (beautify) {
                                            a.push(qxp.io.Json._indent);
                                        }
                                    }
                                    a.push(s.string(i), ':', v);
                                    b = true;
                                }
                            }
                        }
                        if (beautify) {
                            qxp.io.Json._indent = qxp.io.Json._indent.substring(0, qxp.io.Json._indent.length - qxp.io.Json.BEAUTIFYING_INDENT.length);
                            a.push(qxp.io.Json._indent);
                        }
                        a[a.length] = '}';
                    } else {
                        return;
                    }
                    return a.join('');
                }
                return 'null';
            },
            undefined: function(x) {
                if (qxp.Settings.getValueOfClass("qxp.io.Json", "encodeUndefined")) return 'null';
            }
        };
    return {
        copyright: '(c)2005 JSON.org',
        license: 'http://www.JSON.org/license.html',
        stringify: function(v, beautify) {
            this._beautify = beautify;
            this._indent = this.BEAUTIFYING_LINE_END;
            var f = s[typeof v];
            var ret = null;
            if (f) {
                v = f(v);
                if (typeof v == 'string') {
                    ret = v;
                }
            }
            if (qxp.Settings.getValueOfClass("qxp.io.Json", "enableDebug")) {
                var logger = qxp.dev.log.Logger.getClassLogger(qxp.core.Object);
                logger.debug("JSON request: " + ret);
            }
            return ret;
        },
        parse: function(text) {
            try {
                return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + text + ')');
            } catch (e) {
                return false;
            }
        }
    };
}();
qxp.io.Json.parseQx = function(text) {
    if (qxp.Settings.getValueOfClass("qxp.io.Json", "enableDebug")) {
        var logger = qxp.dev.log.Logger.getClassLogger(qxp.core.Object);
        logger.debug("JSON response: " + text);
    }
    var obj = (text && text.length > 0) ? eval('(' + text + ')') : null;
    return obj;
};
qxp.io.Json.BEAUTIFYING_INDENT = "  ";
qxp.io.Json.BEAUTIFYING_LINE_END = "\n";




/* ID: qxp.io.remote.ScriptTransport */
qxp.OO.defineClass("qxp.io.remote.ScriptTransport", qxp.io.remote.AbstractRemoteTransport, function() {
    qxp.io.remote.AbstractRemoteTransport.call(this);
    var vUniqueId = ++qxp.io.remote.ScriptTransport._uniqueId;
    if (vUniqueId >= 2000000000) {
        qxp.io.remote.ScriptTransport._uniqueId = vUniqueId = 1;
    }
    this._element = null;
    this._uniqueId = vUniqueId;
});
qxp.Class._uniqueId = 0;
qxp.Class._instanceRegistry = {};
qxp.Class.ScriptTransport_PREFIX = "_ScriptTransport_";
qxp.Class.ScriptTransport_ID_PARAM = qxp.Class.ScriptTransport_PREFIX + "id";
qxp.Class.ScriptTransport_DATA_PARAM = qxp.Class.ScriptTransport_PREFIX + "data";
qxp.Proto._lastReadyState = 0;
qxp.io.remote.RemoteExchange.registerType(qxp.io.remote.ScriptTransport, "qxp.io.remote.ScriptTransport");
qxp.io.remote.ScriptTransport.handles = {
    synchronous: false,
    asynchronous: true,
    crossDomain: true,
    fileUpload: false,
    responseTypes: [qxp.constant.Mime.TEXT, qxp.constant.Mime.JAVASCRIPT, qxp.constant.Mime.JSON]
};
qxp.io.remote.ScriptTransport.isSupported = function() {
    return true;
};
qxp.Proto.send = function() {
    var vUrl = this.getUrl();
    vUrl += (vUrl.indexOf(qxp.constant.Core.QUESTIONMARK) >= 0 ? qxp.constant.Core.AMPERSAND : qxp.constant.Core.QUESTIONMARK) + qxp.io.remote.ScriptTransport.ScriptTransport_ID_PARAM + qxp.constant.Core.EQUAL + this._uniqueId;
    var vParameters = this.getParameters();
    var vParametersList = [];
    for (var vId in vParameters) {
        if (vId.indexOf(qxp.io.remote.ScriptTransport.ScriptTransport_PREFIX) == 0) {
            this.error("Illegal parameter name. The following prefix is used internally by qooxdoo): " + qxp.io.remote.ScriptTransport.ScriptTransport_PREFIX);
        }
        var value = vParameters[vId];
        if (value instanceof Array) {
            for (var i = 0; i < value.length; i++) {
                vParametersList.push(encodeURIComponent(vId) + qxp.constant.Core.EQUAL + encodeURIComponent(value[i]));
            }
        } else {
            vParametersList.push(encodeURIComponent(vId) + qxp.constant.Core.EQUAL + encodeURIComponent(value));
        }
    }
    if (vParametersList.length > 0) {
        vUrl += qxp.constant.Core.AMPERSAND + vParametersList.join(qxp.constant.Core.AMPERSAND);
    }
    vData = this.getData();
    if (vData != null) {
        vUrl += qxp.constant.Core.AMPERSAND + qxp.io.remote.ScriptTransport.ScriptTransport_DATA_PARAM + qxp.constant.Core.EQUAL + encodeURIComponent(vData);
    }
    qxp.io.remote.ScriptTransport._instanceRegistry[this._uniqueId] = this;
    this._element = document.createElement("script");
    this._element.charset = "utf-8";
    this._element.src = vUrl;
    document.body.appendChild(this._element);
};
qxp.io.remote.ScriptTransport._numericMap = {
    "uninitialized": 1,
    "loading": 2,
    "loaded": 2,
    "interactive": 3,
    "complete": 4
};
qxp.Proto._switchReadyState = function(vReadyState) {
    switch (this.getState()) {
        case qxp.constant.Net.STATE_COMPLETED:
        case qxp.constant.Net.STATE_ABORTED:
        case qxp.constant.Net.STATE_FAILED:
        case qxp.constant.Net.STATE_TIMEOUT:
            this.warn("Ignore Ready State Change");
            return;
    }
    while (this._lastReadyState < vReadyState) {
        this.setState(qxp.io.remote.RemoteExchange._nativeMap[++this._lastReadyState]);
    }
};
qxp.Class._requestFinished = function(id, content) {
    var vInstance = qxp.io.remote.ScriptTransport._instanceRegistry[id];
    if (vInstance == null) {
        if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
            this.warn("Request finished for an unknown instance (probably aborted or timed out before)");
        }
    } else {
        vInstance._responseContent = content;
        vInstance._switchReadyState(qxp.io.remote.ScriptTransport._numericMap.complete);
    }
};
qxp.Proto.setRequestHeader = function(vLabel, vValue) {};
qxp.Proto.getResponseHeader = function(vLabel) {
    return null;
};
qxp.Proto.getResponseHeaders = function() {
    return {};
};
qxp.Proto.getStatusCode = function() {
    return 200;
};
qxp.Proto.getResponseContent = function() {
    if (this.getState() !== qxp.constant.Net.STATE_COMPLETED) {
        if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
            this.warn("Transfer not complete, ignoring content!");
        }
        return null;
    }
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this.debug("Returning content for responseType: " + this.getResponseType());
    }
    switch (this.getResponseType()) {
        case qxp.constant.Mime.TEXT:
        case qxp.constant.Mime.JSON:
        case qxp.constant.Mime.JAVASCRIPT:
            return this._responseContent;
        default:
            this.warn("No valid responseType specified (" + this.getResponseType() + ")!");
            return null;
    }
};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return true;
    }
    if (this._element != null) {
        delete qxp.io.remote.ScriptTransport._instanceRegistry[this._uniqueId];
        document.body.removeChild(this._element);
        this._element = null;
    }
    return qxp.io.remote.AbstractRemoteTransport.prototype.dispose.call(this);
};




/* ID: qxp.io.remote.RemoteResponse */
qxp.OO.defineClass("qxp.io.remote.RemoteResponse", qxp.core.Target, function() {
    qxp.core.Target.call(this);
});
qxp.OO.addProperty({
    name: "state",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "statusCode",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "content"
});
qxp.OO.addProperty({
    name: "responseHeaders",
    type: qxp.constant.Type.OBJECT
});
qxp.Proto.getResponseHeader = function(vHeader) {
    var vAll = this.getResponseHeaders();
    if (vAll) {
        return vAll[vHeader] || null;
    }
    return null;
};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    return qxp.core.Target.prototype.dispose.call(this);
};




/* ID: qxp.io.remote.RemoteRequestQueue */
qxp.OO.defineClass("qxp.io.remote.RemoteRequestQueue", qxp.core.Target, function() {
    qxp.core.Target.call(this);
    this._queue = [];
    this._active = [];
    this._totalRequests = 0;
    this._timer = new qxp.client.Timer(50);
    this._timer.addEventListener(qxp.constant.Event.INTERVAL, this._oninterval, this);
});
qxp.OO.addProperty({
    name: "maxTotalRequests",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "maxConcurrentRequests",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 3
});
qxp.OO.addProperty({
    name: "defaultTimeout",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 5000
});
qxp.Proto._debug = function() {
    var vText = this._active.length + "/" + (this._queue.length + this._active.length);
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this.debug("Progress: " + vText);
        window.status = "Request-Queue Progress: " + vText;
    }
};
qxp.Proto._check = function() {
    this._debug();
    if (this._queue.length == 0) {
        if (this._active.length == 0) {
            this._timer.stop();
        }
        return;
    }
    var haveSyncRequest = !this._queue[0].isAsynchronous();
    if (!haveSyncRequest) {
        if (this._active.length >= this.getMaxConcurrentRequests()) {
            return;
        }
        if (this.getMaxTotalRequests() != null && this._totalRequests >= this.getMaxTotalRequests()) {
            return;
        }
    }
    var vRequest = this._queue.shift();
    var vTransport = new qxp.io.remote.RemoteExchange(vRequest);
    this._totalRequests++;
    this._active.push(vTransport);
    this._debug();
    vTransport.addEventListener(qxp.constant.Event.SENDING, vRequest._onsending, vRequest);
    vTransport.addEventListener(qxp.constant.Event.RECEIVING, vRequest._onreceiving, vRequest);
    vTransport.addEventListener(qxp.constant.Event.COMPLETED, vRequest._oncompleted, vRequest);
    vTransport.addEventListener(qxp.constant.Event.ABORTED, vRequest._onaborted, vRequest);
    vTransport.addEventListener(qxp.constant.Event.TIMEOUT, vRequest._ontimeout, vRequest);
    vTransport.addEventListener(qxp.constant.Event.FAILED, vRequest._onfailed, vRequest);
    vTransport.addEventListener(qxp.constant.Event.SENDING, this._onsending, this);
    vTransport.addEventListener(qxp.constant.Event.COMPLETED, this._oncompleted, this);
    vTransport.addEventListener(qxp.constant.Event.ABORTED, this._oncompleted, this);
    vTransport.addEventListener(qxp.constant.Event.TIMEOUT, this._oncompleted, this);
    vTransport.addEventListener(qxp.constant.Event.FAILED, this._oncompleted, this);
    vTransport._start = (new Date).valueOf();
    vTransport.send();
    if (this._queue.length > 0) {
        this._check();
    }
};
qxp.Proto._remove = function(vTransport) {
    var vRequest = vTransport.getRequest();
    vTransport.removeEventListener(qxp.constant.Event.SENDING, vRequest._onsending, vRequest);
    vTransport.removeEventListener(qxp.constant.Event.RECEIVING, vRequest._onreceiving, vRequest);
    vTransport.removeEventListener(qxp.constant.Event.COMPLETED, vRequest._oncompleted, vRequest);
    vTransport.removeEventListener(qxp.constant.Event.ABORTED, vRequest._onaborted, vRequest);
    vTransport.removeEventListener(qxp.constant.Event.TIMEOUT, vRequest._ontimeout, vRequest);
    vTransport.removeEventListener(qxp.constant.Event.FAILED, vRequest._onfailed, vRequest);
    vTransport.removeEventListener(qxp.constant.Event.SENDING, this._onsending, this);
    vTransport.removeEventListener(qxp.constant.Event.COMPLETED, this._oncompleted, this);
    vTransport.removeEventListener(qxp.constant.Event.ABORTED, this._oncompleted, this);
    vTransport.removeEventListener(qxp.constant.Event.TIMEOUT, this._oncompleted, this);
    vTransport.removeEventListener(qxp.constant.Event.FAILED, this._oncompleted, this);
    qxp.lang.Array.remove(this._active, vTransport);
    vTransport.dispose();
    this._check();
};
qxp.Proto._activeCount = 0;
qxp.Proto._onsending = function(e) {
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        this._activeCount++;
        e.getTarget()._counted = true;
        this.debug("ActiveCount: " + this._activeCount);
    }
};
qxp.Proto._oncompleted = function(e) {
    if (qxp.Settings.getValueOfClass("qxp.io.remote.RemoteExchange", "enableDebug")) {
        if (e.getTarget()._counted) {
            this._activeCount--;
            this.debug("ActiveCount: " + this._activeCount);
        }
    }
    this._remove(e.getTarget());
};
qxp.Proto._oninterval = function(e) {
    var vActive = this._active;
    if (vActive.length == 0) {
        this._timer.stop();
        return;
    }
    var vCurrent = (new Date).valueOf();
    var vTransport;
    var vRequest;
    var vDefaultTimeout = this.getDefaultTimeout();
    var vTimeout;
    var vTime;
    for (var i = vActive.length - 1; i >= 0; i--) {
        vTransport = vActive[i];
        vRequest = vTransport.getRequest();
        if (vRequest.isAsynchronous()) {
            vTimeout = vRequest.getTimeout();
            if (vTimeout == 0) {
                continue;
            }
            if (vTimeout == null) {
                vTimeout = vDefaultTimeout;
            }
            vTime = vCurrent - vTransport._start;
            if (vTime > vTimeout) {
                this.warn("Timeout: transport " + vTransport.toHashCode());
                this.warn(vTime + "ms > " + vTimeout + "ms");
                vTransport.timeout();
            }
        }
    }
};
qxp.Proto.add = function(vRequest) {
    vRequest.setState(qxp.constant.Event.QUEUED);
    if (vRequest.isAsynchronous()) {
        this._queue.push(vRequest);
    } else {
        this._queue.splice(0, 0, vRequest);
    }
    this._check();
    this._timer.start();
};
qxp.Proto.abort = function(vRequest) {
    var vTransport = vRequest.getTransport();
    if (vTransport) {
        vTransport.abort();
    } else if (qxp.lang.Array.contains(this._queue, vRequest)) {
        qxp.lang.Array.remove(this._queue, vRequest);
    }
};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return true;
    }
    if (this._active) {
        for (var i = 0, a = this._active, l = a.length; i < l; i++) {
            this._remove(a[i]);
        }
        this._active = null;
    }
    if (this._timer) {
        this._timer.stop();
        this._timer.removeEventListener(qxp.constant.Event.INTERVAL, this._oninterval, this);
        this._timer = null;
    }
    this._queue = null;
    return qxp.core.Target.prototype.dispose.call(this);
};
qxp.Class.getInstance = qxp.util.Return.returnInstance;




/* ID: qxp.client.Timer */
qxp.OO.defineClass("qxp.client.Timer", qxp.core.Target, function(vInterval) {
    qxp.core.Target.call(this);
    this.setEnabled(false);
    if (qxp.util.Validation.isValidNumber(vInterval)) {
        this.setInterval(vInterval);
    }
    var o = this;
    this.__oninterval = function() {
        o._oninterval();
    };
});
qxp.OO.addProperty({
    name: "interval",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1000
});
qxp.Proto._intervalHandle = null;
qxp.Proto._modifyEnabled = function(propValue, propOldValue) {
    if (propOldValue) {
        window.clearInterval(this._intervalHandle);
        this._intervalHandle = null;
    } else if (propValue) {
        this._intervalHandle = window.setInterval(this.__oninterval, this.getInterval());
    }
};
qxp.Proto.start = function() {
    this.setEnabled(true);
};
qxp.Proto.stop = function() {
    this.setEnabled(false);
};
qxp.Proto._oninterval = function() {
    if (this.getEnabled()) {
        this.createDispatchEvent(qxp.constant.Event.INTERVAL);
    }
};
qxp.Proto.dispose = function() {
    if (this.getDisposed()) {
        return;
    }
    this.stop();
    if (this._intervalHandler) {
        window.clearInterval(this._intervalHandle);
        this._intervalHandler = null;
    }
    this.__oninterval = null;
    return qxp.core.Target.prototype.dispose.call(this);
};




/* ID: com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryDefault */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryDefault", qxp.core.Object, function() {
    qxp.core.Object.call(this);
    var self = this;
    self.createContentBox = function(content, bgcolor, allowWrap) {
        if (allowWrap == null) {
            allowWrap = self.getAllowWrap();
        };
        var paddingLeft = self.getPaddingLeft();
        var paddingRight = self.getPaddingRight();
        var paddingTop = self.getPaddingTop();
        var paddingBottom = self.getPaddingBottom();
        return '<td bgcolor="' + bgcolor + '" style="' + 'padding-left:' + paddingLeft + ';padding-right:' + paddingRight + ';padding-top:' + paddingTop + ';padding-bottom:' + paddingBottom + ';border:1px #7f7f7f solid' + (allowWrap ? '' : ';white-space:nowrap') + '">' + content + '</td>';
    };
    self.createInfoBoxElement = function(x, y, content, container, visible, reuseElement, allowWrap, initialOpacity) {
        var paddingLeft = self.getPaddingLeft();
        var paddingRight = self.getPaddingRight();
        var paddingTop = self.getPaddingTop();
        var paddingBottom = self.getPaddingBottom();
        if (content.text == null) {
            content = {
                text: content,
                background: "#ffffff"
            };
        };
        var initialWidth = null;
        var infoBoxElement = reuseElement;
        if (infoBoxElement == null) {
            infoBoxElement = document.createElement("div");
            infoBoxElement.style.position = "absolute";
        } else {
            initialWidth = infoBoxElement.childNodes[0].style.width;
            if (initialWidth != null) {
                initialWidth = parseInt(initialWidth);
            }
        };
        var MapUtil = com.ptvag.webcomponent.map.MapUtil;
        var top = 0;
        var infoBoxHTML = '';
        infoBoxHTML += '<table cellpadding="0" cellspacing="0" border="0"' + ' style="position:absolute;left:0px;top:' + top + 'px' + (initialWidth != null ? ';width:' + initialWidth + 'px' : '') + '">' + '<tr>' + '<td></td>' + '<td align="left" style="font-size:1px">' + '<div style="width:11px;height:19px"></div>' + '</td>' + '<td></td>' + '</tr>' + '<tr>' + '<td style="font-size:1px">' + '<div style="width:19px;height:11px"></div>' + '</td>' + self.createContentBox(content.text, content.background, allowWrap) + '<td style="font-size:1px">' + '<div style="width:19px;height:11px"></div>' + '</td>' + '</tr>' + '<tr>' + '<td></td>' + '<td align="left" style="font-size:1px">' + '<div style="width:11px;height:19px"></div>' + '</td>' + '<td></td>' + '</tr>' + '</table>';
        infoBoxHTML += '<img src="' + MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/line2left.gif", true) + '" height="11" width="20" style="left:0px;top:19px;position:absolute;display:none"/>';
        infoBoxHTML += '<img src="' + MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/line2right.gif", true) + '" height="11" width="20" style="right:0px;top:19px;position:absolute;display:none"/>';
        infoBoxHTML += '<img src="' + MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/line2up.gif", true) + '" height="20" width="11" style="' + (initialWidth != null ? ';left:' + Math.round((initialWidth - 11) / 2) + 'px' : '') + ';position:absolute;top:0px;display:none"/>';
        infoBoxHTML += '<img src="' + MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/line2.gif", true) + '" height="20" width="11" style="' + (initialWidth != null ? ';left:' + Math.round((initialWidth - 11) / 2) + 'px' : '') + ';position:absolute;bottom:0px"/>';
        infoBoxHTML += '<img src="' + MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/closebox.gif", true) + '" width="7" height="7" style="position:absolute;top:19px;right:19px;display:none"/>';
        infoBoxElement.innerHTML = infoBoxHTML;
        if (initialOpacity != null) {
            MapUtil.setElementOpacity(infoBoxElement, initialOpacity / 100);
        };
        if (!reuseElement) {
            infoBoxElement.style.visibility = "hidden";
            container.appendChild(infoBoxElement);
        };
        var table = infoBoxElement.childNodes[0];
        var width = table.offsetWidth;
        var height = table.offsetHeight;
        mouseHandlerElement = table.getElementsByTagName("tr")[1].childNodes[1];
        mouseHandlerElement._ignoreMouseDown = true;
        mouseHandlerElement._ignoreMouseUp = true;
        mouseHandlerElement._allowSelection = true;
        mouseHandlerElement._ignoreMouseWheel = self.getAllowMouseWheel();
        table.style.width = width + "px";
        infoBoxElement.style.width = width + "px";
        infoBoxElement.style.height = height + "px";
        infoBoxElement._ptv_map_printBackground = true;
        infoBoxElement._ptv_map_printBackgroundHeight = height - 40;
        infoBoxElement._ptv_map_printBackgroundWidth = width - 40;
        infoBoxElement._ptv_map_printBackgroundLeft = 20;
        infoBoxElement._ptv_map_printBackgroundTop = 20;
        var imgElements = infoBoxElement.getElementsByTagName("img");
        var imgElementCount = imgElements.length;
        var imgElement1 = imgElements[imgElementCount - 2];
        imgElement1._ignoreMouseDown = true;
        var imgElement2 = imgElements[imgElementCount - 3];
        imgElement2._ignoreMouseDown = true;
        imgElement2 = imgElements[imgElementCount - 4];
        imgElement2._ignoreMouseDown = true;
        imgElement2 = imgElements[imgElementCount - 5];
        imgElement2._ignoreMouseDown = true;
        var closeboxElement = imgElements[imgElementCount - 1];
        closeboxElement._ignoreMouseDown = true;
        closeboxElement._ignoreMouseUp = true;
        closeboxElement._ignoreMouseWheel = self.getAllowMouseWheel();
        infoBoxElement._width = width;
        infoBoxElement._height = height;
        infoBoxElement._containerWidth = container.offsetWidth;
        infoBoxElement._containerHeight = container.offsetHeight;
        self.positionInfoBoxElement(infoBoxElement, x, y);
        if (visible) {
            infoBoxElement.style.visibility = "visible";
        };
        return infoBoxElement;
    };
    self.positionInfoBoxElement = function(infoBoxElement, x, y) {
        var imgElements = infoBoxElement.getElementsByTagName("img");
        var imgElementCount = imgElements.length;
        var leftImgElement = imgElements[imgElementCount - 5];
        var rightImgElement = imgElements[imgElementCount - 4];
        var topImgElement = imgElements[imgElementCount - 3];
        var bottomImgElement = imgElements[imgElementCount - 2];
        var clearLeft = self.getClearLeft();
        var clearRight = self.getClearRight();
        var clearTop = self.getClearTop();
        var clearBottom = self.getClearBottom();
        var freeSpaceTop = y - infoBoxElement._height + 19 - clearTop;
        var freeSpaceBottom = infoBoxElement._containerHeight - clearBottom - (y + infoBoxElement._height - 19);
        var freeSpaceLeft = x - infoBoxElement._width + 19 - clearLeft;
        var freeSpaceRight = infoBoxElement._containerWidth - clearRight - (x + infoBoxElement._width - 19);
        infoBoxElement._borderLeft = 19;
        infoBoxElement._borderRight = 19;
        infoBoxElement._borderTop = 19;
        infoBoxElement._borderBottom = 19;
        if (freeSpaceTop >= 0 || freeSpaceBottom < 0 && freeSpaceLeft < 0 && freeSpaceRight < 0) {
            var tipToShow = bottomImgElement;
            infoBoxElement._borderBottom = 0;
        } else if (freeSpaceBottom >= 0) {
            tipToShow = topImgElement;
            infoBoxElement._borderTop = 0;
        } else if (freeSpaceLeft >= 0) {
            tipToShow = rightImgElement;
            infoBoxElement._borderRight = 0;
        } else {
            tipToShow = leftImgElement;
            infoBoxElement._borderLeft = 0;
        };
        for (var i = imgElementCount - 5; i <= imgElementCount - 2;
            ++i) {
            var imgElement = imgElements[i];
            if (imgElement == tipToShow) {
                imgElement.style.display = "";
            } else {
                imgElement.style.display = "none";
            }
        };
        var tipWidth = self.getTipWidth();
        var tipMargin = self.getTipMargin();
        if (tipToShow == bottomImgElement || tipToShow == topImgElement) {
            var left = x - infoBoxElement._width / 2;
            var width = infoBoxElement._width;
            var containerWidth = infoBoxElement._containerWidth - clearRight;
            if (left + width - 19 > containerWidth) {
                left = containerWidth - width + 19;
            };
            if (left < -19 + clearLeft) {
                left = -19 + clearLeft;
            };
            var imgMargin = x - left - tipWidth / 2;
            if (imgMargin - 19 < tipMargin) {
                left += imgMargin - tipMargin - 19;
                imgMargin = tipMargin + 19;
            } else if (imgMargin > width - 19 - tipWidth - tipMargin) {
                left += imgMargin - (width - 19 - tipWidth - tipMargin);
                imgMargin = width - 19 - tipWidth - tipMargin;
            };
            var top = y - infoBoxElement._height;
            if (tipToShow == topImgElement) {
                top = y;
                topImgElement.style.left = Math.round(imgMargin) + "px";
            } else {
                bottomImgElement.style.left = Math.round(imgMargin) + "px";
            };
            infoBoxElement.style.left = Math.round(left) + "px";
            infoBoxElement.style.top = Math.round(top) + "px";
        } else {
            var top = y - infoBoxElement._height / 2;
            var height = infoBoxElement._height;
            var containerHeight = infoBoxElement._containerHeight - clearBottom;
            if (top + height - 19 > containerHeight) {
                top = containerHeight - height + 19;
            };
            if (top < -19 + clearTop) {
                top = -19 + clearTop;
            };
            var imgMargin = y - top - tipWidth / 2;
            if (imgMargin - 19 < tipMargin) {
                top += imgMargin - tipMargin - 19;
                imgMargin = tipMargin + 19;
            } else if (imgMargin > height - 19 - tipWidth - tipMargin) {
                top += imgMargin - (height - 19 - tipWidth - tipMargin);
                imgMargin = height - 19 - tipWidth - tipMargin;
            };
            var left = x - infoBoxElement._width;
            if (tipToShow == leftImgElement) {
                left = x;
                leftImgElement.style.top = Math.round(imgMargin) + "px";
            } else {
                rightImgElement.style.top = Math.round(imgMargin) + "px";
            };
            infoBoxElement.style.top = Math.round(top) + "px";
            infoBoxElement.style.left = Math.round(left) + "px";
        }
    };
    self.destroyInfoBoxElement = function(infoBoxElement) {
        infoBoxElement.parentNode.removeChild(infoBoxElement);
        var imgElements = infoBoxElement.getElementsByTagName("img");
        var closeboxElement = imgElements[imgElements.length - 1];
        closeboxElement.onclick = null;
    };
    self.activateCloseWidget = function(infoBoxElement, handler) {
        var imgElements = infoBoxElement.getElementsByTagName("img");
        var closeboxElement = imgElements[imgElements.length - 1];
        closeboxElement.style.display = "";
        closeboxElement.onclick = handler;
    };
    self.testUnhover = function(evt, element, tolerance) {
        var minX = parseInt(element.style.left);
        var maxX = minX + element._width;
        var minY = parseInt(element.style.top);
        var maxY = minY + element._height;
        minX += element._borderLeft - tolerance;
        maxX -= element._borderRight - tolerance;
        minY += element._borderTop - tolerance;
        maxY -= element._borderBottom - tolerance;
        if (evt.relMouseX >= minX && evt.relMouseX < maxX && evt.relMouseY >= minY && evt.relMouseY < maxY) {
            return false;
        };
        return true;
    };
    self.hitTest = function(evt, element) {
        var minX = parseInt(element.style.left) + 19;
        var maxX = minX + element._width - 38;
        var minY = parseInt(element.style.top) + 19;
        var maxY = minY + element._height - 38;
        if (evt.relMouseX >= minX && evt.relMouseX < maxX && evt.relMouseY >= minY && evt.relMouseY < maxY) {
            return true;
        };
        if (evt.relMouseY >= minY && evt.relMouseY < maxY) {
            if (element._borderLeft == 0 && evt.relMouseX < minX && evt.relMouseX >= minX - 19) {
                var imgElements = element.getElementsByTagName("img");
                var imgElementCount = imgElements.length;
                var leftImgElement = imgElements[imgElementCount - 5];
                var imgTop = parseInt(element.style.top) + parseInt(leftImgElement.style.top);
                if (evt.relMouseY >= imgTop && evt.relMouseY < imgTop + 11) {
                    return true;
                }
            };
            if (element._borderRight == 0 && evt.relMouseX >= maxX && evt.relMouseX < maxX + 19) {
                imgElements = element.getElementsByTagName("img");
                imgElementCount = imgElements.length;
                var rightImgElement = imgElements[imgElementCount - 4];
                imgTop = parseInt(element.style.top) + parseInt(rightImgElement.style.top);
                if (evt.relMouseY >= imgTop && evt.relMouseY < imgTop + 11) {
                    return true;
                }
            }
        };
        if (evt.relMouseX >= minX && evt.relMouseX < maxX) {
            if (element._borderTop == 0 && evt.relMouseY < minY && evt.relMouseY >= minY - 19) {
                imgElements = element.getElementsByTagName("img");
                imgElementCount = imgElements.length;
                var topImgElement = imgElements[imgElementCount - 3];
                var imgLeft = parseInt(element.style.left) + parseInt(topImgElement.style.left);
                if (evt.relMouseX >= imgLeft && evt.relMouseX < imgLeft + 11) {
                    return true;
                }
            };
            if (element._borderBottom == 0 && evt.relMouseY >= maxY && evt.relMouseY < maxY + 19) {
                imgElements = element.getElementsByTagName("img");
                imgElementCount = imgElements.length;
                var bottomImgElement = imgElements[imgElementCount - 2];
                imgLeft = parseInt(element.style.left) + parseInt(bottomImgElement.style.left);
                if (evt.relMouseX >= imgLeft && evt.relMouseX < imgLeft + 11) {
                    return true;
                }
            }
        };
        return false;
    };
});
qxp.OO.addProperty({
    name: "allowWrap",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "paddingLeft",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "8px"
});
qxp.OO.addProperty({
    name: "paddingRight",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "8px"
});
qxp.OO.addProperty({
    name: "paddingTop",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "4px"
});
qxp.OO.addProperty({
    name: "paddingBottom",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "4px"
});
qxp.OO.addProperty({
    name: "allowMouseWheel",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "tipWidth",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 11
});
qxp.OO.addProperty({
    name: "tipHeight",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 20
});
qxp.OO.addProperty({
    name: "tipMargin",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "clearLeft",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "clearRight",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 30
});
qxp.OO.addProperty({
    name: "clearTop",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 35
});
qxp.OO.addProperty({
    name: "clearBottom",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.Class.getInstance = function() {
    var vector = com.ptvag.webcomponent.map.vector;
    var myClass = vector.InfoBoxElementFactoryDefault;
    if (myClass.instance == null) {
        myClass.instance = new vector.InfoBoxElementFactoryDefault();
    };
    return myClass.instance;
};
com.ptvag.webcomponent.map.vector.InfoBoxElementFactory = com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryDefault.getInstance();




/* ID: com.ptvag.webcomponent.map.MapUtil */
qxp.OO.defineClass("com.ptvag.webcomponent.map.MapUtil");
qxp.Class.applyFilter = function(elem) {
    var matrixFilter = elem._matrixFilter;
    var filter = (matrixFilter == null ? "" : matrixFilter);
    var alphaFilter = elem._alphaFilter;
    if (alphaFilter == null && filter.length > 0) {} else if (alphaFilter != null) {
        if (filter.length > 0) {
            filter += " ";
        };
        filter += alphaFilter;
    };
    elem.style.filter = filter;
};
qxp.Class.setElementOpacity = function(elem, alpha) {
    var clientInstance = qxp.sys.Client.getInstance();
    if (clientInstance.isGecko()) {
        elem.style.MozOpacity = (alpha == null || alpha == 1) ? "" : alpha;
        elem.style.opacity = (alpha == null || alpha == 1) ? "" : alpha;
    } else if (clientInstance.isKhtml()) {
        elem.style.KhtmlOpacity = (alpha == null || alpha == 1) ? "" : alpha;
    } else if (clientInstance.isMshtml() && clientInstance.getMajor() < 10) {
        elem._alphaFilter = (alpha == null || alpha == 1) ? null : "Alpha(Opacity=" + Math.round(alpha * 100) + ")";
        com.ptvag.webcomponent.map.MapUtil.applyFilter(elem);
        elem.style.opacity = (alpha == null || alpha == 1) ? "" : alpha;
    } else {
        elem.style.opacity = (alpha == null || alpha == 1) ? "" : alpha;
    }
};
qxp.Class.dec2hex = function(value, digits) {
    var retVal = value.toString(16);
    var toAdd = digits - retVal.length;
    for (var i = 0; i < toAdd;
        ++i) {
        retVal = "0" + retVal;
    };
    return retVal;
};
qxp.Class.translateColor = function(color) {
    var clazz = com.ptvag.webcomponent.map.MapUtil;
    var opacity = null;
    var match = clazz.RGB_REGEX.exec(color);
    if (match == null) {
        match = clazz.RGBA_REGEX.exec(color);
        if (match != null) {
            opacity = parseFloat(match[4]);
        }
    };
    if (match == null) {
        var actualColor = color;
    } else {
        actualColor = "#" + clazz.dec2hex(parseInt(match[1]), 2) + clazz.dec2hex(parseInt(match[2]), 2) + clazz.dec2hex(parseInt(match[3]), 2);
    };
    return {
        color: actualColor,
        opacity: opacity
    };
};
qxp.Class.setImageSource = function(imgElem, imgUrl) {
    if (qxp.sys.Client.getInstance().isMshtml() && qxp.sys.Client.getInstance().getMajor() < 10 && /\.png$/i.test(imgUrl)) {
        imgElem.src = com.ptvag.webcomponent.util.ServerUtils.rewriteURL("img/com/ptvag/webcomponent/map/blank.gif", true);
        imgElem.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgUrl + "',sizingMethod='scale')";
    } else {
        imgElem.src = imgUrl;
    }
};
qxp.Class.isBorderBoxSizingActive = function() {
    var MapUtil = com.ptvag.webcomponent.map.MapUtil;
    if (MapUtil._borderBoxSizingActive == null) {
        var tempDiv = document.createElement("div");
        tempDiv.style.visibility = "hidden";
        tempDiv.style.position = "absolute";
        tempDiv.style.border = "1px solid black";
        tempDiv.style.width = "10px";
        tempDiv.style.height = "10px";
        document.body.appendChild(tempDiv);
        var width = tempDiv.offsetWidth;
        MapUtil._borderBoxSizingActive = (width == 10);
        document.body.removeChild(tempDiv);
    };
    return MapUtil._borderBoxSizingActive;
};
qxp.Class.createCanvas = function(win, parentElement, width, height) {
    var doc = parentElement.ownerDocument;
    var canvas = doc.createElement("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    parentElement.appendChild(canvas);
    if (win.G_vmlCanvasManager) {
        win.G_vmlCanvasManager.initElement(canvas);
        var canvases = parentElement.getElementsByTagName("canvas");
        canvas = canvases[canvases.length - 1];
    };
    try {
        canvas.getContext("2d");
    } catch (exc) {
        parentElement.removeChild(canvas);
        return null;
    };
    return canvas;
};
qxp.Class.cleanupCanvas = function(win, canvasElement) {
    if (win.G_vmlCanvasManager && win.G_vmlCanvasManager.cleanupElement) {
        win.G_vmlCanvasManager.cleanupElement(canvasElement);
    }
};
qxp.Class.printFilter = function(element) {
    var client = qxp.sys.Client.getInstance();
    if (element.getAttribute("_ptv_map_dontPrint") == "true") {
        element.style.visibility = "hidden";
    };
    var style = element.style;
    if (style) {
        if (style.visibility == "hidden" || style.display == "none") {
            return;
        };
        if (client.isGecko()) {
            var borderWidth = style.borderLeftWidth;
            if (borderWidth != null) {
                style.borderLeftWidth = borderWidth.replace("px", "pt");
            };
            borderWidth = style.borderRightWidth;
            if (borderWidth != null) {
                style.borderRightWidth = borderWidth.replace("px", "pt");
            };
            borderWidth = style.borderTopWidth;
            if (borderWidth != null) {
                style.borderTopWidth = borderWidth.replace("px", "pt");
            };
            borderWidth = style.borderBottomWidth;
            if (borderWidth != null) {
                style.borderBottomWidth = borderWidth.replace("px", "pt");
            }
        };
        if (style.filter != null) {
            style.filter = null;
        };
        if (style.MozOpacity != null) {
            style.MozOpacity = null;
        };
        if (style.opacity != null) {
            style.opacity = null;
        };
        if (client.isMshtml()) {
            if (element._ptv_map_printBackground) {
                var backgroundElement = element.ownerDocument.createElement("div");
                backgroundElement.style.position = "absolute";
                var leftOffset = element._ptv_map_printBackgroundLeft;
                if (leftOffset) {
                    backgroundElement.style.left = parseInt(style.left) + parseInt(leftOffset) + "px";
                } else {
                    backgroundElement.style.left = style.left;
                };
                var topOffset = element._ptv_map_printBackgroundTop;
                if (topOffset) {
                    backgroundElement.style.top = parseInt(style.top) + parseInt(topOffset) + "px";
                } else {
                    backgroundElement.style.top = style.top;
                };
                var width = element._ptv_map_printBackgroundWidth;
                if (width != null) {
                    width += "px";
                } else {
                    width = style.width;
                };
                backgroundElement.style.width = width;
                var height = element._ptv_map_printBackgroundHeight;
                if (height != null) {
                    height += "px";
                } else {
                    height = style.height;
                };
                backgroundElement.style.height = height;
                var backgroundColor = "white";
                if (style.backgroundColor != null && style.backgroundColor != "") {
                    backgroundColor = style.backgroundColor;
                };
                backgroundElement.style.filter = "progid:DXImageTransform.Microsoft.Gradient(gradientType=0,startColorStr=" + backgroundColor + ",endColorStr=" + backgroundColor + ")";
                element.parentNode.insertBefore(backgroundElement, element);
            }
        }
    };
    var childNodes = element.childNodes;
    var childNodeCount = childNodes.length;
    for (var i = 0; i < childNodeCount;
        ++i) {
        var childNode = childNodes[i];
        if (childNode.nodeType == 1) {
            com.ptvag.webcomponent.map.MapUtil.printFilter(childNode);
        };
        var newCount = childNodes.length;
        if (newCount > childNodeCount) {
            i += (newCount - childNodeCount);
            childNodeCount = newCount;
        }
    }
};
qxp.Class.cloneNodeForPrinting = function(node, targetDocument) {
    if (qxp.sys.Client.getInstance().isMshtml()) {
        var tempParent = targetDocument.createElement("div");
        tempParent.innerHTML = node.outerHTML;
        var retVal = tempParent.firstChild;
        tempParent.removeChild(tempParent.firstChild);
    } else {
        retVal = node.cloneNode(true);
    };
    com.ptvag.webcomponent.map.MapUtil.printFilter(retVal);
    return retVal;
};
qxp.Class.resolveURL = function(url) {
    if (url.indexOf("//") == -1 && url.indexOf("img/com/ptvag/webcomponent/") == 0) {
        return com.ptvag.webcomponent.util.ServerUtils.rewriteURL(url, true);
    };
    return url;
};
qxp.Class.convertArray = function(input) {
    var length = input.length;
    var output = new Array(length);
    for (var i = 0; i < length;
        ++i) {
        output[i] = input[i];
    };
    return output;
};
qxp.Class.rewriteURL = function(url, cacheable, basePath) {
    var oldPrefix = qxp.core.ServerSettings.serverPathPrefix;
    var staticServer = com.ptvag.webcomponent.map.Map.STATIC_SERVER;
    if (cacheable && staticServer != null) {
        qxp.core.ServerSettings.serverPathPrefix = staticServer;
    };
    var ServerUtils = com.ptvag.webcomponent.util.ServerUtils;
    var oldBasePath = ServerUtils.basePath;
    if (basePath != null) {
        ServerUtils.basePath = basePath;
    };
    var retVal = com.ptvag.webcomponent.util.ServerUtils.rewriteURL(url, cacheable);
    qxp.core.ServerSettings.serverPathPrefix = oldPrefix;
    ServerUtils.basePath = oldBasePath;
    return retVal;
};
qxp.Class.escapeHTML = function(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
qxp.Class.areAffineTransformsSupported = function() {
    var client = qxp.sys.Client.getInstance();
    var versionMajor = client.getMajor();
    var versionMinor = client.getMinor();
    var versionRevision = client.getRevision();
    if (client.isMshtml() && (versionMajor >= 6 || versionMajor == 5 && versionMinor >= 5) || client.isGecko() && (versionMajor >= 2 || versionMajor == 1 && (versionMinor >= 10 || versionMinor == 9 && versionRevision >= 1)) || client.isWebkit() && versionMajor >= 525 || client.isOpera() && (versionMajor >= 11 || versionMajor == 10 && versionMinor >= 5)) {
        return true;
    };
    return false;
};
qxp.Class.createRotationMatrix = function(angle, originX, originY) {
    var rad = angle / 180.0 * Math.PI;
    var a = Math.cos(rad);
    var b = -Math.sin(rad);
    var c = -b;
    var d = a;
    var tx = -a * originX + b * originY + originX;
    var ty = c * originX - d * originY + originY;
    return {
        a: a,
        b: b,
        c: c,
        d: d,
        tx: tx,
        ty: ty
    };
};
qxp.Class.setAffineTransform = function(elem, matrix) {
    var a = String(matrix.a);
    if (a.indexOf("e") != -1) {
        a = "0";
    };
    var b = String(matrix.b);
    if (b.indexOf("e") != -1) {
        b = "0";
    };
    var c = String(matrix.c);
    if (c.indexOf("e") != -1) {
        c = "0";
    };
    var d = String(matrix.d);
    if (d.indexOf("e") != -1) {
        d = "0";
    };
    var tx = String(matrix.tx);
    if (tx.indexOf("e") != -1) {
        tx = "0";
    };
    var ty = String(matrix.ty);
    if (ty.indexOf("e") != -1) {
        ty = "0";
    };
    var clientInstance = qxp.sys.Client.getInstance();
    if (clientInstance.isMshtml() && clientInstance.getMajor() < 10) {
        elem._matrixFilter = "progid:DXImageTransform.Microsoft.Matrix(" + "M11=" + a + ",M21=" + b + ",M12=" + c + ",M22=" + d + ",Dx=" + tx + ",Dy=" + ty + ")";
        com.ptvag.webcomponent.map.MapUtil.applyFilter(elem);
        elem.style.transformOrigin = "0 0";
        elem.style.transform = "matrix(" + a + "," + b + "," + c + "," + d + "," + tx + "," + ty + ")";
    } else if (clientInstance.isGecko()) {
        elem.style.MozTransformOrigin = "0 0";
        elem.style.MozTransform = "matrix(" + a + "," + b + "," + c + "," + d + "," + tx + "px," + ty + "px)";
    } else if (clientInstance.isWebkit()) {
        elem.style.WebkitTransformOrigin = "0 0";
        elem.style.WebkitTransform = "matrix(" + a + "," + b + "," + c + "," + d + "," + tx + "," + ty + ")";
    } else if (clientInstance.isOpera()) {
        elem.style.OTransformOrigin = "0 0";
        elem.style.OTransform = "matrix(" + a + "," + b + "," + c + "," + d + "," + tx + "," + ty + ")";
    } else {
        elem.style.transformOrigin = "0 0";
        elem.style.transform = "matrix(" + a + "," + b + "," + c + "," + d + "," + tx + "," + ty + ")";
    }
};
qxp.Class.resetAffineTransform = function(elem) {
    var clientInstance = qxp.sys.Client.getInstance();
    if (clientInstance.isMshtml() && clientInstance.getMajor() < 10) {
        elem._matrixFilter = null;
        com.ptvag.webcomponent.map.MapUtil.applyFilter(elem);
        elem.style.transformOrigin = "";
        elem.style.transform = "";
    } else if (clientInstance.isGecko()) {
        elem.style.MozTransformOrigin = "";
        elem.style.MozTransform = "";
    } else if (clientInstance.isWebkit()) {
        elem.style.WebkitTransformOrigin = "";
        elem.style.WebkitTransform = "";
    } else if (clientInstance.isOpera()) {
        elem.style.OTransformOrigin = "";
        elem.style.OTransform = "";
    } else {
        elem.style.transformOrigin = "";
        elem.style.transform = "";
    }
};
qxp.Class.MAX_IMAGE_SCALE_WIDTH = (qxp.sys.Client.getInstance().isMshtml() && qxp.sys.Client.getInstance().getMajor() < 9 ? 2000 : 20000);
qxp.Class.MIN_IMAGE_SCALE_WIDTH = (qxp.sys.Client.getInstance().isMshtml() && qxp.sys.Client.getInstance().getMajor() >= 8 ? 32 : 1);
qxp.Class.RGB_REGEX = /^\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/i;
qxp.Class.RGBA_REGEX = /^\s*rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([0-9.]+)\s*\)\s*$/i;




/* ID: com.ptvag.webcomponent.map.Map */
qxp.OO.defineClass("com.ptvag.webcomponent.map.Map", qxp.core.Target, function(parentElement, startRect, useVersionedRequests, profileGroup, delegate) {
    qxp.core.Target.call(this);
    var dummy = qxp.lang.Object.merge;
    delegate = delegate || {};
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var CoordUtil = map.CoordUtil;
    var rewriteURL = map.MapUtil.rewriteURL;
    var mComponentElement;
    var mRelativeLayersElement;
    var mLayerArr = [];
    var mLayerDict = {};
    var mTileDebugMode = false;
    var mController;
    var mServerDrawnObjectManager;
    var mZoomBoxElem;
    var mInBulkMode = false;
    var mBulkEvent;
    var mFiringBulkEvent = false;
    var mAppliedRotationAngle = 0;
    var mHistory = [];
    var mHistoryPosition = -1;
    var mInternalHistoryChange = false;
    var mBulkHistoryItem;
    var mCurrentLoggingStack = [];
    var mBulkLoggingArr = [];
    var mClipRectSu = {};
    var mClipRectMerc;
    var mCenterBeforeAdjusting;
    var mCurrentPrintDiv;
    var mCurrentPrintContext;
    var mDeferredInitTimer = null;
    var mDeferredInitLayers = [];
    var mDeferredInitLoggingActions = [];
    var mMapVersion = null;
    var mConfigurableCursor;
    self.shouldAnimate = function() {
        return self.getAnimate();
    };
    self._modifyProfileGroup = function() {
        self.startLoggingAction("mapapi:setProfileGroup");
        try {
            fireOnViewChanged({
                clipRectChanged: true
            });
        } finally {
            self.endLoggingAction();
        }
    };
    self._modifyBackendServer = function(propValue) {
        self.setCopyright(propValue);
    };
    self._checkCenter = function(propValue) {
        if (typeof(propValue.x) != "number" || typeof(propValue.y) != "number" || isNaN(propValue.x) || isNaN(propValue.y)) {
            throw new Error("Illegal center: " + propValue.x + "/" + propValue.y);
        };
        if (mClipRectSu.left == null && mClipRectSu.top == null && mClipRectSu.right == null && mClipRectSu.bottom == null) {
            return propValue;
        };
        var zoom = self.getZoom();
        var newCenterPix = CoordUtil.smartUnit2Pixel(propValue, zoom);
        var clipStartPix = CoordUtil.smartUnit2Pixel({
            x: mClipRectSu.left,
            y: mClipRectSu.top
        }, zoom);
        var clipEndPix = CoordUtil.smartUnit2Pixel({
            x: mClipRectSu.right,
            y: mClipRectSu.bottom
        }, zoom);
        var mapWidth = self.getWidth();
        var mapHeight = self.getHeight();
        var clipMoveBorder = self.getClipMoveBorder();
        var origNewCenterX = newCenterPix.x;
        var origNewCenterY = newCenterPix.y;
        if (mClipRectSu.left != null) {
            var minX = clipStartPix.x + clipMoveBorder - mapWidth / 2;
            if (newCenterPix.x < minX) {
                newCenterPix.x = minX;
            }
        };
        if (mClipRectSu.top != null) {
            var maxY = clipStartPix.y - clipMoveBorder + mapHeight / 2;
            if (newCenterPix.y > maxY) {
                newCenterPix.y = maxY;
            }
        };
        if (mClipRectSu.right != null) {
            var maxX = clipEndPix.x - clipMoveBorder + mapWidth / 2;
            if (newCenterPix.x > maxX) {
                newCenterPix.x = maxX;
            }
        };
        if (mClipRectSu.bottom != null) {
            var minY = clipEndPix.y + clipMoveBorder - mapHeight / 2;
            if (newCenterPix.y < minY) {
                newCenterPix.y = minY;
            }
        };
        if (newCenterPix.x != origNewCenterX || newCenterPix.y != origNewCenterY) {
            return CoordUtil.pixel2SmartUnit(newCenterPix, zoom);
        } else {
            return propValue;
        }
    };
    self._modifyCenter = function(propValue, propOldValue) {
        if ((propOldValue == null) || (propValue.x != propOldValue.x) || (propValue.y != propOldValue.y)) {
            self.startLoggingAction("mapapi:setCenter");
            try {
                if (self.shouldAnimate()) {
                    self.getAnimator().onTargetChanged();
                } else {
                    self.getAnimator().stopAnimation();
                    self.setVisibleCenter(propValue);
                };
                if (!self.getCenterIsAdjusting()) {
                    onAdjustingCenterFinished();
                }
            } finally {
                self.endLoggingAction();
            }
        }
    };
    self._modifyCenterIsAdjusting = function(propValue) {
        if (propValue) {
            mCenterBeforeAdjusting = self.getCenter();
        } else {
            var center = self.getCenter();
            if (center.x != mCenterBeforeAdjusting.x || center.y != mCenterBeforeAdjusting.y) {
                onAdjustingCenterFinished();
            }
        }
    };
    var onAdjustingCenterFinished = function() {
        addToHistory(self.getCenter(), null);
        self.createDispatchEvent("adjustingCenterFinished");
    };
    self._checkZoom = function(propValue) {
        var maxZoom = CoordUtil.TILE_WIDTHS.length - 1;
        if (propValue < 0) {
            return 0;
        } else if (propValue > maxZoom) {
            return maxZoom;
        } else {
            return Math.round(propValue);
        }
    };
    self._modifyZoom = function(propValue) {
        addToHistory(null, propValue);
        self.startLoggingAction("mapapi:setZoom");
        try {
            if (self.shouldAnimate()) {
                self.getAnimator().onTargetChanged();
            } else {
                self.getAnimator().stopAnimation();
                self.setVisibleZoom(propValue);
            }
        } finally {
            self.endLoggingAction();
        }
    };
    self._checkRotation = function(propValue) {
        if (angle != 0 && !map.MapUtil.areAffineTransformsSupported()) {
            return 0;
        };
        var angle = propValue % 360;
        if (angle < 0) {
            angle += 360;
        };
        return angle;
    };
    self._checkVisibleRotation = function(propValue) {
        if (angle != 0 && !map.MapUtil.areAffineTransformsSupported()) {
            return 0;
        };
        var angle = propValue % 360;
        if (angle < 0) {
            angle += 360;
        };
        return angle;
    };
    self._modifyRotation = function(propValue) {
        self.startLoggingAction("mapapi:setRotation");
        try {
            if (self.shouldAnimate()) {
                self.getAnimator().onTargetChanged();
            } else {
                self.getAnimator().stopAnimation();
                self.setVisibleRotation(propValue);
            }
        } finally {
            self.endLoggingAction();
        }
    };
    self._modifyWidth = function() {
        fireOnViewChanged({
            widthChanged: true
        });
    };
    self._modifyHeight = function() {
        fireOnViewChanged({
            heightChanged: true
        });
    };
    self._modifyAnimator = function(propValue) {
        propValue.setMap(self);
    };
    self._modifyVisibleCenter = function(propValue, propOldValue) {
        if ((propOldValue == null) || (propValue.x != propOldValue.x) || (propValue.y != propOldValue.y)) {
            fireOnViewChanged({
                centerChanged: true
            });
        }
    };
    self._modifyVisibleZoom = function() {
        fireOnViewChanged({
            zoomChanged: true
        });
    };
    self._modifyVisibleRotation = function() {
        fireOnViewChanged({
            rotationChanged: true
        });
    };
    self._checkRelativeOffset = function(propValue) {
        if (!map.Map.MOBILE_TOUCH) {
            var maxValue = map.Map.OPACITY_HACK_SIZE / 2 - 10000;
            if (mAppliedRotationAngle == 0 && Math.abs(propValue.x) < maxValue && Math.abs(propValue.y) < maxValue) {
                return {
                    x: propValue.x,
                    y: propValue.y
                };
            }
        };
        return {
            x: 0,
            y: 0
        };
    };
    self._modifyRelativeOffset = function(propValue) {
        mRelativeLayersElement.style.left = (-Math.round(propValue.x)) + "px";
        mRelativeLayersElement.style.top = (-Math.round(propValue.y)) + "px";
    };
    self.correctRelativeOffset = function(newCenter) {
        if (mAppliedRotationAngle != 0) {
            return;
        };
        var centerPixOld = CoordUtil.smartUnit2Pixel(self.getVisibleCenter(), self.getVisibleZoom());
        var centerPixNew = CoordUtil.smartUnit2Pixel(newCenter, self.getVisibleZoom());
        var relativeOffset = self.getRelativeOffset();
        self.setRelativeOffset({
            x: relativeOffset.x - (centerPixOld.x - centerPixNew.x),
            y: relativeOffset.y + (centerPixOld.y - centerPixNew.y)
        });
    };
    self.setCursor = function(cursor) {
        if (!qxp.sys.Client.getInstance().isOpera()) {
            if (cursor == null) {
                cursor = "";
            };
            if (cursor == "") {
                mComponentElement.style.cursor = "";
                return;
            };
            var cursors = cursor.split(",");
            var count = cursors.length;
            for (var i = 0; i < count;
                ++i) {
                cursor = cursors[i];
                mComponentElement.style.cursor = cursor;
                if (mComponentElement.style.cursor == cursor) {
                    return;
                }
            }
        }
    };
    var applyConfigurableCursor = function() {
        if (mConfigurableCursor == "default") {
            if (mController.getActionMode() == map.MapController.ACTION_MODE_MOVE) {
                self.setCursor(self.getMoveCursor());
            } else if (mController.getActionMode() == map.MapController.ACTION_MODE_ZOOM) {
                self.setCursor(self.getZoomCursor());
            } else {
                self.setCursor("");
            }
        } else if (mConfigurableCursor == "move") {
            self.setCursor(self.getMoveCursorActive());
        } else if (mConfigurableCursor == "zoom") {
            self.setCursor(self.getZoomCursorActive());
        } else {
            self.setCursor("");
        }
    };
    self.setConfigurableCursor = function(cursor) {
        if (mConfigurableCursor != cursor) {
            mConfigurableCursor = cursor;
            applyConfigurableCursor();
        }
    };
    self._modifyMoveCursor = applyConfigurableCursor;
    self._modifyMoveCursorActive = applyConfigurableCursor;
    self._modifyZoomCursor = applyConfigurableCursor;
    self._modifyZoomCursorActive = applyConfigurableCursor;
    self.getTileDebugMode = function() {
        return mTileDebugMode;
    };
    self.getCenterInPixel = function() {
        return CoordUtil.smartUnit2Pixel(self.getCenter(), self.getZoom());
    };
    self.setCenterInPixel = function(pixPoint) {
        var suPoint = CoordUtil.pixel2SmartUnit(pixPoint, self.getZoom());
        self.setCenter(suPoint);
    };
    self.moveCenterInPercent = function(deltaFactorX, deltaFactorY, useVisibleValues) {
        if (useVisibleValues) {
            var center = CoordUtil.smartUnit2Pixel(self.getVisibleCenter(), self.getZoom());
        } else {
            center = CoordUtil.smartUnit2Pixel(self.getCenter(), self.getZoom());
        };
        var delta = self.transformPixelCoords(deltaFactorX * self.getWidth(), deltaFactorY * self.getHeight(), true, false, useVisibleValues);
        self.setCenterInPixel({
            x: center.x + delta.x,
            y: center.y + delta.y
        });
    };
    self.setRectInPixel = function(left, top, right, bottom) {
        var zoom = self.getZoom();
        var startSuPoint = CoordUtil.pixel2SmartUnit({
            x: left,
            y: top
        }, zoom);
        var endSuPoint = CoordUtil.pixel2SmartUnit({
            x: right,
            y: bottom
        }, zoom);
        self.setRect(startSuPoint.x, startSuPoint.y, endSuPoint.x, endSuPoint.y);
    };
    self.setRect = function(left, top, right, bottom, round) {
        var centerSuPt = {
            x: (left + right) / 2,
            y: (top + bottom) / 2
        };
        var suWidth = Math.abs(left - right);
        var suHeight = Math.abs(top - bottom);
        var mapWidth = self.getWidth();
        var mapHeight = self.getHeight();
        var suPerPixel = Math.max(suWidth / mapWidth, suHeight / mapHeight);
        self.startLoggingAction("mapapi:setRect");
        try {
            var alreadyInBulkMode = mInBulkMode;
            if (!alreadyInBulkMode) {
                self.startBulkMode();
            };
            self.setZoomInSmartUnitsPerPixel(suPerPixel, round);
            self.setCenter(centerSuPt);
            if (!alreadyInBulkMode) {
                self.endBulkMode();
            }
        } finally {
            self.endLoggingAction();
        }
    };
    self.getRectInPixel = function() {
        var mapWidth = self.getWidth();
        var mapHeight = self.getHeight();
        var centerPixPoint = self.getCenterInPixel();
        return {
            left: centerPixPoint.x - mapWidth / 2,
            top: centerPixPoint.y - mapHeight / 2,
            right: centerPixPoint.x + mapWidth / 2,
            bottom: centerPixPoint.y + mapHeight / 2
        };
    };
    self.getRect = function() {
        var pixRect = self.getRectInPixel();
        var zoom = self.getZoom();
        var startSuPoint = CoordUtil.pixel2SmartUnit({
            x: pixRect.left,
            y: pixRect.top
        }, zoom);
        var endSuPoint = CoordUtil.pixel2SmartUnit({
            x: pixRect.right,
            y: pixRect.bottom
        }, zoom);
        return {
            left: startSuPoint.x,
            right: endSuPoint.x,
            top: endSuPoint.y,
            bottom: startSuPoint.y
        };
    };
    self.setZoomInSmartUnitsPerPixel = function(suPerPixel, round) {
        var level = CoordUtil.getLevelForSmartUnitsPerPixel(suPerPixel);
        if (round) {
            level = Math.round(level);
        } else {
            level = Math.ceil(level);
        };
        self.setZoom(level);
    };
    self.getZoomInSmartUnitsPerPixel = function() {
        var suTileWidth = CoordUtil.TILE_WIDTHS[self.getZoom()];
        return suTileWidth / CoordUtil.TILE_WIDTH;
    };
    self.setViewToPoints = function(pointList, dontMoveIfVisible, keepZoom) {
        var left = Infinity;
        var right = -Infinity;
        var top = -Infinity;
        var bottom = Infinity;
        var iter = new map.PointListIterator(pointList);
        while (iter.iterate()) {
            left = Math.min(left, iter.x);
            right = Math.max(right, iter.x);
            top = Math.max(top, iter.y);
            bottom = Math.min(bottom, iter.y);
        };
        var border = self.getViewToPointsBorder();
        if (dontMoveIfVisible) {
            var rect = self.getRectInPixel();
            var oldZoom = self.getZoom();
            var oldTopLeftPix = CoordUtil.smartUnit2Pixel({
                x: left,
                y: top
            }, oldZoom);
            var oldBottomRightPix = CoordUtil.smartUnit2Pixel({
                x: right,
                y: bottom
            }, oldZoom);
            if (oldTopLeftPix.x >= rect.left + border && oldBottomRightPix.x <= rect.right - border && oldBottomRightPix.y >= rect.top + border && oldTopLeftPix.y <= rect.bottom - border) {
                return;
            }
        };
        var widthPix = self.getWidth() - 2 * border;
        var heightPix = self.getHeight() - 2 * border;
        var oldZoom = self.getZoom();
        var widthSu = right - left;
        var heightSu = top - bottom;
        var suPerPixel = Math.max(widthSu / widthPix, heightSu / heightPix);
        var wantedZoom = Math.ceil(CoordUtil.getLevelForSmartUnitsPerPixel(suPerPixel));
        var minZoom = self.getViewToPointsMinZoomLevel();
        var newZoom = Math.max(wantedZoom, minZoom);
        if (keepZoom && newZoom < oldZoom) {
            newZoom = oldZoom;
        };
        var newCenter = {
            x: (left + right) / 2,
            y: (top + bottom) / 2
        };
        if (dontMoveIfVisible && keepZoom && oldZoom == newZoom) {
            var viewTopLeftPix = CoordUtil.smartUnit2Pixel({
                x: left,
                y: top
            }, newZoom);
            var viewBottomRightPix = CoordUtil.smartUnit2Pixel({
                x: right,
                y: bottom
            }, newZoom);
            var viewWidthPix = Math.abs(viewBottomRightPix.x - viewTopLeftPix.x);
            var viewHeightPix = Math.abs(viewBottomRightPix.y - viewTopLeftPix.y);
            if (viewWidthPix < widthPix && viewHeightPix < heightPix) {
                var oldCenterSu = self.getCenter();
                var viewCenterSu = newCenter;
                var vectorX = viewCenterSu.x - oldCenterSu.x;
                var vectorY = oldCenterSu.y - viewCenterSu.y;
                var moveX = null;
                var moveY = null;
                if (vectorX != 0) {
                    moveX = (vectorX > 0 ? -1 : 1) * ((widthPix - viewWidthPix) / 2);
                    moveY = moveX * (vectorY / vectorX);
                };
                if (vectorY != 0) {
                    var possibleMoveY = (vectorY > 0 ? -1 : 1) * ((heightPix - viewHeightPix) / 2);
                    var possibleMoveX = possibleMoveY * (vectorX / vectorY);
                    if (moveX == null || Math.abs(possibleMoveX) < Math.abs(moveX) || Math.abs(possibleMoveY) < Math.abs(moveY)) {
                        moveX = possibleMoveX;
                        moveY = possibleMoveY;
                    }
                };
                if (moveX != null && moveY != null) {
                    var viewCenterPixX = (viewBottomRightPix.x + viewTopLeftPix.x) / 2;
                    var viewCenterPixY = (viewBottomRightPix.y + viewTopLeftPix.y) / 2;
                    var newCenterPix = {
                        x: viewCenterPixX + moveX,
                        y: viewCenterPixY - moveY
                    };
                    newCenter = CoordUtil.pixel2SmartUnit(newCenterPix, newZoom);
                }
            }
        };
        self.startLoggingAction("mapapi:setViewToPoints");
        try {
            var alreadyInBulkMode = mInBulkMode;
            if (!alreadyInBulkMode) {
                self.startBulkMode();
            };
            self.setZoom(newZoom);
            self.setCenter(newCenter);
            self.setRotation(0);
            if (!alreadyInBulkMode) {
                self.endBulkMode();
            }
        } finally {
            self.endLoggingAction();
        }
    };
    self.setClipRect = function(clipLeft, clipTop, clipRight, clipBottom) {
        mClipRectSu = {
            left: clipLeft,
            top: clipTop,
            right: clipRight,
            bottom: clipBottom
        };
        mClipRectMerc = null;
        self.startLoggingAction("mapapi:setClipRect");
        try {
            fireOnViewChanged({
                clipRectChanged: true
            });
        } finally {
            self.endLoggingAction();
        };
        return true;
    };
    self.getClipRect = function() {
        return mClipRectSu;
    };
    self.getClipRectInMercator = function() {
        if (mClipRectMerc == null) {
            var startMerc = CoordUtil.smartUnit2Mercator({
                x: mClipRectSu.left,
                y: mClipRectSu.top
            });
            var endMerc = CoordUtil.smartUnit2Mercator({
                x: mClipRectSu.right,
                y: mClipRectSu.bottom
            });
            mClipRectMerc = {
                left: (mClipRectSu.left != null ? startMerc.x : null),
                top: (mClipRectSu.top != null ? startMerc.y : null),
                right: (mClipRectSu.right != null ? endMerc.x : null),
                bottom: (mClipRectSu.bottom != null ? endMerc.y : null)
            };
        };
        return mClipRectMerc;
    };
    self.getController = function() {
        return mController;
    };
    self.getServerDrawnObjectManager = function() {
        return mServerDrawnObjectManager;
    };
    self.updateSize = function() {
        var width = mComponentElement.offsetWidth;
        var height = mComponentElement.offsetHeight;
        if (width <= 0 || height <= 0) {
            throw new Error("Width or height of the map container element is 0!");
        };
        var alreadyInBulkMode = mInBulkMode;
        if (!alreadyInBulkMode) {
            self.startBulkMode();
        };
        self.startLoggingAction("mapapi:updateSize");
        try {
            self.setWidth(width);
            self.setHeight(height);
            if (!alreadyInBulkMode) {
                self.endBulkMode();
            }
        } finally {
            self.endLoggingAction();
        }
    };
    var deferredInit = function() {
        for (var i = 0; i < mDeferredInitLayers.length;
            ++i) {
            self.startLoggingAction(mDeferredInitLoggingActions[i]);
            try {
                mDeferredInitLayers[i].init();
            } catch (e) {
                self.error(e);
            } finally {
                self.endLoggingAction();
            }
        };
        mDeferredInitLayers = [];
        mDeferredInitLoggingActions = [];
        mDeferredInitTimer = null;
    };
    self.addLayer = function(layer, layerName, zIndex, insertBefore, deferInit) {
        if (deferInit == null) {
            deferInit = true;
        };
        var layerInserted = false;
        if (insertBefore == null) {
            mLayerArr.push(layer);
        } else {
            var layerCount = mLayerArr.length;
            for (var i = 0; i < layerCount;
                ++i) {
                if (mLayerArr[i] == insertBefore) {
                    mLayerArr.splice(i, 0, layer);
                    layerInserted = true;
                    break;
                }
            };
            if (!layerInserted) {
                mLayerArr.push(layer);
            }
        };
        if (layerName != null) {
            mLayerDict[layerName] = layer;
        };
        self._addLayer(layer, zIndex, insertBefore, layerInserted);
        layer.setMap(self);
        layer.setName(layerName);
        if (deferInit) {
            if (layer instanceof map.layer.SimpleMapLayer) {
                mDeferredInitLayers.splice(0, 0, layer);
            } else {
                mDeferredInitLayers.push(layer);
            };
            mDeferredInitLoggingActions.push(self.getLoggingInfo());
            if (mDeferredInitTimer == null) {
                mDeferredInitTimer = window.setTimeout(deferredInit, 0);
            }
        } else {
            layer.init();
        }
    };
    self._addLayerToContainer = function(layer, zIndex, insertBefore, layerInserted) {
        var relative = layer.isRelative(),
            needsOpacityHack = layer.needsOpacityHack(),
            layerParent = document.createElement("div"),
            layerStyle = layerParent.style;
        layer.setParentElement(layerParent);
        if (!mTileDebugMode && !relative) {
            layerStyle.overflow = "hidden";
        };
        layerStyle.position = "absolute";
        layerStyle.zIndex = (zIndex == null ? 0 : zIndex);
        if (needsOpacityHack) {
            var size = map.Map.OPACITY_HACK_SIZE;
            layerStyle.left = -(size / 2) + "px";
            layerStyle.top = -(size / 2) + "px";
            layerStyle.width = size + "px";
            layerStyle.height = size + "px";
        } else {
            layerStyle.left = "0px";
            layerStyle.top = "0px";
            layerStyle.width = "100%";
            layerStyle.height = "100%";
        };
        var container = relative ? self.getRelativeLayersElement() : self.getComponentElement();
        if (layerInserted && insertBefore.getParentElement().parentNode == container) {
            container.insertBefore(layerParent, insertBefore.getParentElement());
        } else {
            container.appendChild(layerParent);
        }
    };
    self._addLayer = delegate.addLayer || self._addLayerToContainer;
    self.removeLayer = function(layerName) {
        var layer = mLayerDict[layerName];
        if (layer == null) {
            return;
        };
        delete mLayerDict[layerName];
        var layerCount = mLayerArr.length;
        for (var i = 0; i < layerCount;
            ++i) {
            if (mLayerArr[i] == layer) {
                mLayerArr.splice(i, 1);
                break;
            }
        };
        layerCount = mDeferredInitLayers.length;
        for (i = 0; i < layerCount;
            ++i) {
            if (mDeferredInitLayers[i] == layer) {
                mDeferredInitLayers.splice(i, 1);
                mDeferredInitLoggingActions.splice(i, 1);
                break;
            }
        };
        self._removeLayer(layer);
        layer.dispose();
    };
    self._removeLayerFromContainer = function(layer) {
        var parentElement = layer.getParentElement();
        parentElement.parentNode.removeChild(parentElement);
    };
    self._removeLayer = delegate.removeLayer || self._removeLayerFromContainer;
    self.getLayer = function(layerName) {
        return mLayerDict[layerName];
    };
    self.getLayers = function() {
        return mLayerArr;
    };
    self.addBingAerialLayer = function(apiKey, callback) {
        if (CoordUtil.ZOOM_LEVEL_FACTOR != 2) {
            throw new Error("Bing maps require a call to com.ptvag.webcomponent.map.CoordUtil.useGoogleZoomLevels()");
        };
        var toolbarLayer = self.getLayer("toolbar");
        toolbarLayer.setButtonEnabled("hybrid-view", false);
        toolbarLayer.setButtonEnabled("aerial-view", false);
        var DefaultToolbarLayer = map.layer.DefaultToolbarLayer;
        DefaultToolbarLayer.switchToPlainView = function(map) {
            map.getLayer("bingLogo").setAreaOpacity(0);
            map.getLayer("bingAerial").setEnabled(false);
            map.getLayer("label").setLayerOpacity(1);
        };
        DefaultToolbarLayer.switchToHybridView = function(map) {
            map.getLayer("bingLogo").setAreaOpacity(1);
            var bingLayer = map.getLayer("bingAerial");
            bingLayer.setEnabled(true);
            bingLayer.setLayerOpacity(0.8);
            map.getLayer("label").setLayerOpacity(0.65);
        };
        DefaultToolbarLayer.switchToAerialView = function(map) {
            map.getLayer("bingLogo").setAreaOpacity(1);
            var bingLayer = map.getLayer("bingAerial");
            bingLayer.setEnabled(true);
            bingLayer.setLayerOpacity(1);
            map.getLayer("label").setLayerOpacity(0.65);
        };
        map.bing.MetaData.setAPIKey(apiKey, function(success) {
            if (success) {
                var requestBuilder = new map.bing.RequestBuilder(self, apiKey);
                var bingLayer = new map.layer.TileMapLayer(requestBuilder);
                bingLayer.setIsRelative(true);
                bingLayer.setNeedsOpacityHack(true);
                bingLayer.setIncludeInPrint(true);
                bingLayer.setEnabled(false);
                self.addLayer(bingLayer, "bingAerial", 0, self.getLayer("label"));
                var bingLogoLayer = new map.layer.ImageLayer(map.bing.MetaData.getMetaData(apiKey).brandLogoUri);
                bingLogoLayer.setAreaLeft(100);
                bingLogoLayer.setAreaRight(100);
                bingLogoLayer.setAreaBottom(0);
                bingLogoLayer.setAreaOpacity(0);
                var origPositionArea = bingLogoLayer.positionArea;
                bingLogoLayer.positionArea = function() {
                    var width = bingLogoLayer.getAreaWidth();
                    var mapWidth = self.getWidth();
                    bingLogoLayer.setAreaLeft(parseInt((mapWidth - width) / 2));
                    origPositionArea.apply(bingLogoLayer, arguments);
                };
                bingLogoLayer.setIncludeInPrint(true);
                self.addLayer(bingLogoLayer, "bingLogo", 1, self.getLayer("scale"), false);
                toolbarLayer.setButtonEnabled("hybrid-view", true);
                toolbarLayer.setButtonEnabled("aerial-view", true);
            };
            if (callback) {
                callback(success);
            }
        });
    };
    self.addTiledAerialLayer = function(name, urltemplate, subdomains) {
        var RequestBuilder = com.ptvag.webcomponent.map.RequestBuilder;
        var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
        var DefaultToolbarLayer = com.ptvag.webcomponent.map.layer.DefaultToolbarLayer;
        var TileMapLayer = com.ptvag.webcomponent.map.layer.TileMapLayer;
        if (CoordUtil.ZOOM_LEVEL_FACTOR !== 2) {
            throw new Error('addTiledAerialLayer() requires a call to ' + 'com.ptvag.webcomponent.map.CoordUtil.useGoogleZoomLevels()');
        };
        var TileRequestBuilder = function(map, urlTemplate, subdomains) {
            if (CoordUtil.ZOOM_LEVEL_FACTOR !== 2) {
                throw new Error('TileRequestBuilder requires a call to ' + 'com.ptvag.webcomponent.map.CoordUtil.useGoogleZoomLevels()');
            };
            RequestBuilder.call(this, map, true);
            var halfCirc = Math.PI * 6371000;
            var base = {
                buildRequest: this.buildRequest
            };
            var pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
            var tileFromRect = function(left, top, right, bottom) {
                var s = right - left;
                var z = Math.round(Math.log(2 * halfCirc / s) / Math.log(2));
                var n = (1 << z);
                var tile = {
                    x: Math.round((left + halfCirc) / s),
                    y: n - Math.round((bottom + halfCirc) / s) - 1,
                    z: z
                };
                if (tile.x >= 0 && tile.x < n && tile.y >= 0 && tile.y < n) {
                    return tile;
                }
            };
            var quadKeyFromTile = function(tile) {
                var digits = [];
                for (var i = tile.z - 1; i >= 0;
                    --i) {
                    digits.push(((tile.x >> i) & 1) + (((tile.y >> i) & 1) << 1));
                };
                return digits.join("");
            };
            var subDomainFromTile = function(tile) {
                if (subdomains && subdomains.length) {
                    var index = (tile.x + tile.y) % subdomains.length;
                    return subdomains[index];
                }
            };
            var instantiateUrl = function(left, top, right, bottom) {
                var tile = tileFromRect(left, top, right, bottom);
                return !tile ? pixel : urltemplate.replace('{subdomain}', subDomainFromTile(tile)).replace('{x}', tile.x).replace('{y}', tile.y).replace('{z}', tile.z).replace('{quadkey}', quadKeyFromTile(tile));
            };
            this.buildRequest = function(left, top, right, bottom, width, height, loggingInfo, mapVersion, angle) {
                var req = base.buildRequest.apply(this, arguments);
                req.url = instantiateUrl(left, top, right, bottom);
                return req;
            }
        };
        TileRequestBuilder.prototype = new RequestBuilder();
        TileRequestBuilder.prototype.constructor = TileRequestBuilder;
        DefaultToolbarLayer.switchToPlainView = function(map) {
            map.getLayer(name).setEnabled(false);
            map.getLayer("label").setLayerOpacity(1);
        };
        DefaultToolbarLayer.switchToHybridView = function(map) {
            var layer = map.getLayer(name);
            layer.setEnabled(true);
            layer.setLayerOpacity(0.8);
            map.getLayer("label").setLayerOpacity(0.65);
        };
        DefaultToolbarLayer.switchToAerialView = function(map) {
            var layer = map.getLayer(name);
            layer.setEnabled(true);
            layer.setLayerOpacity(1);
            map.getLayer("label").setLayerOpacity(0.65);
        };
        var layer = new TileMapLayer(new TileRequestBuilder(this, urltemplate, subdomains));
        layer.setIsRelative(true);
        layer.setNeedsOpacityHack(true);
        layer.setIncludeInPrint(true);
        layer.setEnabled(false);
        this.addLayer(layer, name, 0, this.getLayer("label"));
        var toolbarLayer = this.getLayer("toolbar");
        toolbarLayer.setButtonEnabled("hybrid-view", true);
        toolbarLayer.setButtonEnabled("aerial-view", true);
        return layer;
    };
    self.showZoomBox = function(fromX, fromY, toX, toY) {
        if (mZoomBoxElem == null) {
            mZoomBoxElem = document.createElement("div");
            mZoomBoxElem.style.position = "absolute";
            mZoomBoxElem.style.backgroundColor = self.getZoomBoxColor();
            map.MapUtil.setElementOpacity(mZoomBoxElem, self.getZoomBoxOpacity());
            mZoomBoxElem.style.borderColor = self.getZoomBoxBorderColor();
            mZoomBoxElem.style.borderStyle = "solid";
            mZoomBoxElem.style.fontSize = "1px";
            mZoomBoxElem.style.zIndex = 2;
            mComponentElement.appendChild(mZoomBoxElem);
        };
        var width = Math.abs(toX - fromX) - 1;
        var height = Math.abs(toY - fromY) - 1;
        if (width < 0) {
            width = 0;
        };
        if (height < 0) {
            height = 0;
        };
        var borderBoxSizingActive = map.MapUtil.isBorderBoxSizingActive();
        var zoomBoxBorderWidth = self.getZoomBoxBorderWidth();
        var zoomBoxBorderHeight = zoomBoxBorderWidth;
        var maxZoomBoxBorderWidth = parseInt(width / 2);
        var maxZoomBoxBorderHeight = parseInt(height / 2);
        if (zoomBoxBorderWidth > maxZoomBoxBorderWidth) {
            zoomBoxBorderWidth = maxZoomBoxBorderWidth;
        };
        if (zoomBoxBorderHeight > maxZoomBoxBorderHeight) {
            zoomBoxBorderHeight = maxZoomBoxBorderHeight;
        };
        mZoomBoxElem.style.left = Math.min(fromX, toX) + 1 + "px";
        mZoomBoxElem.style.top = Math.min(fromY, toY) + 1 + "px";
        width -= (borderBoxSizingActive ? 0 : zoomBoxBorderWidth * 2);
        height -= (borderBoxSizingActive ? 0 : zoomBoxBorderHeight * 2);
        mZoomBoxElem.style.borderLeftWidth = zoomBoxBorderWidth + "px";
        mZoomBoxElem.style.borderRightWidth = zoomBoxBorderWidth + "px";
        mZoomBoxElem.style.borderTopWidth = zoomBoxBorderHeight + "px";
        mZoomBoxElem.style.borderBottomWidth = zoomBoxBorderHeight + "px";
        mZoomBoxElem.style.width = width + "px";
        mZoomBoxElem.style.height = height + "px";
        mZoomBoxElem.style.visibility = "";
    };
    self.hideZoomBox = function() {
        if (mZoomBoxElem) {
            mZoomBoxElem.style.visibility = "hidden";
        }
    };
    self.relative2AbsolutePixel = function(relPixPt) {
        var centerPixPt = self.getCenterInPixel();
        return {
            x: centerPixPt.x - self.getWidth() / 2 + relPixPt.x,
            y: centerPixPt.y + self.getHeight() / 2 - relPixPt.y
        };
    };
    self.transformPixelCoords = function(x, y, relativeToCenter, reverse, useVisibleValues) {
        var angle = (useVisibleValues ? self.getVisibleRotation() : self.getRotation());
        if (angle == 0) {
            return {
                x: x,
                y: y
            };
        };
        if (!relativeToCenter) {
            var halfWidth = self.getWidth() / 2;
            var halfHeight = self.getHeight() / 2;
            x -= halfWidth;
            y -= halfHeight;
        };
        var rad = angle / 180.0 * Math.PI;
        if (reverse) {
            rad = -rad;
        };
        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        var newX = cos * x + sin * y;
        var newY = -sin * x + cos * y;
        if (!relativeToCenter) {
            newX += halfWidth;
            newY += halfHeight;
        };
        return {
            x: newX,
            y: newY
        };
    };
    self.zoomToPixelCoords = function(x, y, relativeToCenter, zoomDelta, zoomDifference, useVisibleValues) {
        if (zoomDifference == null) {
            zoomDifference = 0;
        };
        if (!relativeToCenter) {
            x -= self.getWidth() / 2;
            y -= self.getHeight() / 2;
        };
        var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
        var oldZoom = (useVisibleValues ? self.getVisibleZoom() : self.getZoom());
        var newZoom = self._checkZoom(oldZoom + zoomDelta);
        if (oldZoom != newZoom) {
            var coords = self.transformPixelCoords(x, y, true, true, useVisibleValues);
            var zoomFactor = Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, zoomDifference);
            var oldCenterSu = (useVisibleValues ? self.getVisibleCenter() : self.getCenter());
            var oldCenterPix = CoordUtil.smartUnit2Pixel(oldCenterSu, oldZoom);
            var oldAimingPix = {
                x: oldCenterPix.x + coords.x * zoomFactor,
                y: oldCenterPix.y - coords.y * zoomFactor
            };
            var aimingSuPt = CoordUtil.pixel2SmartUnit(oldAimingPix, oldZoom);
            self.startLoggingAction("user:mousewheelZoom");
            try {
                var alreadyInBulkMode = self.inBulkMode();
                if (!alreadyInBulkMode) {
                    self.startBulkMode();
                };
                self.setZoom(newZoom);
                var newAimingPix = CoordUtil.smartUnit2Pixel(aimingSuPt, newZoom);
                var newCenterPix = {
                    x: newAimingPix.x - coords.x * zoomFactor,
                    y: newAimingPix.y + coords.y * zoomFactor
                };
                self.setCenterInPixel(newCenterPix);
                if (!alreadyInBulkMode) {
                    self.endBulkMode();
                }
            } finally {
                self.endLoggingAction();
            }
        }
    };
    self.translateMouseCoords = function(evt) {
        var mapWidth = self.getWidth();
        var mapHeight = self.getHeight();
        var relMouseX = evt.relMouseX;
        var relMouseY = evt.relMouseY;
        if (relMouseX < 0 || relMouseX >= mapWidth || relMouseY < 0 || relMouseY >= mapHeight) {
            return null;
        };
        var coords = self.transformPixelCoords(relMouseX - mapWidth / 2, relMouseY - mapHeight / 2, true, true, true);
        var mapCenterSu = self.getVisibleCenter();
        var mapZoom = self.getVisibleZoom();
        var mapCenterPix = CoordUtil.smartUnit2Pixel(mapCenterSu, mapZoom);
        var pixCoords = {
            x: mapCenterPix.x + coords.x,
            y: mapCenterPix.y - coords.y
        };
        return CoordUtil.pixel2SmartUnit(pixCoords, mapZoom);
    };
    self.startLoggingAction = function(description) {
        mCurrentLoggingStack.push(description);
    };
    self.endLoggingAction = function() {
        if (mCurrentLoggingStack.length == 1 && mBulkEvent) {
            mBulkLoggingArr.push(mCurrentLoggingStack[0]);
        };
        mCurrentLoggingStack.pop();
    };
    self.getLoggingInfo = function() {
        if (mFiringBulkEvent && mBulkLoggingArr.length != 0) {
            if (mBulkLoggingArr.length == 1) {
                return mBulkLoggingArr[0];
            } else {
                var bulkDesc = "bulk:[";
                for (var i = 0; i < mBulkLoggingArr.length; i++) {
                    if (i != 0) {
                        bulkDesc += ",";
                    };
                    bulkDesc += mBulkLoggingArr[i];
                };
                bulkDesc += "]";
                return bulkDesc;
            }
        } else if (mCurrentLoggingStack.length != 0) {
            return mCurrentLoggingStack[0];
        } else {
            return null;
        }
    };
    self.startBulkMode = function() {
        if (mInBulkMode) {
            throw new Error("Starting bulk mode failed. The map is already in bulk mode.");
        };
        mInBulkMode = true;
    };
    self.endBulkMode = function() {
        if (!mInBulkMode) {
            throw new Error("Ending bulk mode failed. The map was not in bulk mode.");
        };
        mInBulkMode = false;
        if (mBulkEvent) {
            mFiringBulkEvent = true;
            fireOnViewChanged(mBulkEvent);
            mFiringBulkEvent = false;
            mBulkEvent = null;
            mBulkLoggingArr = [];
        };
        if (mBulkHistoryItem) {
            addToHistory(mBulkHistoryItem.center, mBulkHistoryItem.zoom);
            mBulkHistoryItem = null;
        }
    };
    self.inBulkMode = function() {
        return mInBulkMode;
    };
    var addToHistory = function(center, zoom) {
        if (mInternalHistoryChange) {
            return;
        };
        if (mInBulkMode) {
            if (mBulkHistoryItem == null) {
                mBulkHistoryItem = {};
            };
            if (center != null) {
                mBulkHistoryItem.center = center;
            };
            if (zoom != null) {
                mBulkHistoryItem.zoom = zoom;
            }
        } else {
            var item = {
                center: (center == null) ? self.getCenter() : center,
                zoom: (zoom == null) ? self.getZoom() : zoom
            };
            mHistoryPosition++;
            mHistory.splice(mHistoryPosition, mHistory.length - mHistoryPosition, item);
            var itemsToRemove = mHistory.length - self.getMaxHistorySize();
            if (itemsToRemove > 0) {
                mHistory.splice(0, itemsToRemove);
                mHistoryPosition -= itemsToRemove;
            };
            fireHistoryChanged();
        }
    };
    self.historyBack = function() {
        historyMove(-1);
    };
    self.hasHistoryBack = function() {
        return mHistoryPosition > 0;
    };
    self.historyForward = function() {
        historyMove(1);
    };
    self.hasHistoryForward = function() {
        return mHistoryPosition < mHistory.length - 1;
    };
    var historyMove = function(delta) {
        var newHistoryPosition = mHistoryPosition + delta;
        if (newHistoryPosition >= 0 && newHistoryPosition < mHistory.length) {
            mHistoryPosition = newHistoryPosition;
            var item = mHistory[mHistoryPosition];
            var alreadyInBulkMode = mInBulkMode;
            if (!alreadyInBulkMode) {
                self.startBulkMode();
            };
            self.startLoggingAction((delta > 0) ? "mapapi:historyForward" : "mapapi:historyBack");
            mInternalHistoryChange = true;
            try {
                if (item.center != null) {
                    self.setCenter(item.center);
                };
                if (item.zoom != null) {
                    self.setZoom(item.zoom);
                };
                if (!alreadyInBulkMode) {
                    self.endBulkMode();
                };
                fireHistoryChanged();
            } finally {
                self.endLoggingAction();
                mInternalHistoryChange = false;
            }
        }
    };
    var fireHistoryChanged = function() {
        if (self.hasEventListeners("historyChanged")) {
            self.dispatchEvent(new qxp.event.type.Event("historyChanged"));
        };
    };
    var fireOnViewChanged = function(evt) {
        if (!mInBulkMode && !mFiringBulkEvent && self.getUseAutoBulkMode()) {
            self.startBulkMode();
            window.setTimeout(function() {
                self.endBulkMode();
            }, 0)
        };
        if (mInBulkMode) {
            if (mBulkEvent) {
                for (key in evt) {
                    mBulkEvent[key] = evt[key];
                }
            } else {
                mBulkEvent = evt;
            }
        } else {
            var loggingInfo = "";
            for (var key in evt) {
                if (loggingInfo.length != 0) {
                    loggingInfo += ",";
                };
                loggingInfo += key;
            };
            var rotationAngle = self.getVisibleRotation();
            if (rotationAngle != mAppliedRotationAngle) {
                if (mAppliedRotationAngle == 0) {
                    self.setRelativeOffset({
                        x: 0,
                        y: 0
                    });
                };
                mAppliedRotationAngle = rotationAngle;
            };
            self.startLoggingAction("event:" + loggingInfo);
            try {
                self.onViewChanged(evt);
                for (var i = mLayerArr.length - 1; i >= 0; i--) {
                    if (mLayerArr[i].isEnabled() && mLayerArr[i].isInitialized()) {
                        mLayerArr[i].onViewChanged(evt, true);
                    }
                }
            } finally {
                self.endLoggingAction();
            }
        }
    };
    self.onViewChanged = function() {};
    self.newMapSession = function() {
        if (self.hasEventListeners("newMapSession")) {
            self.dispatchEvent(new qxp.event.type.Event("newMapSession"));
        };
    };
    self.setCopyright = function(key) {
        com.ptvag.webcomponent.map.SERVICE.callAsync(function(result, exc, id) {
            self.removeLayer("copyright");
            var copyrightLayer = new map.layer.TextLayer();
            copyrightLayer.set({
                areaLeft: 0,
                areaBottom: 0,
                areaOpacity: 0.8
            });
            copyrightLayer.setIncludeInPrint(true);
            var copyrightText;
            if (exc != null || result == null || result == "") {
                copyrightText = "Please configure copyright";
            } else {
                copyrightText = result;
            };
            copyrightLayer.setText(copyrightText);
            self.addLayer(copyrightLayer, "copyright", 1, null, false);
        }, "getCopyrightMessage", key);
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        for (var i = 0; i < mLayerArr.length; i++) {
            mLayerArr[i].dispose();
        };
        mController.dispose();
        mComponentElement = null;
        mZoomBoxElem = null;
        if (mCurrentPrintDiv != null) {
            mCurrentPrintDiv.onclick = null;
            mCurrentPrintDiv = null;
        };
        if (mCurrentPrintContext != null) {
            mCurrentPrintContext.dispose();
        };
        superDispose.call(self);
    };
    self.printMode = function(printParentWindow, printParentDiv, callback) {
        self.getAnimator().stopAnimation();
        if (mCurrentPrintDiv != null) {
            if (printParentDiv == null) {
                return;
            };
            mCurrentPrintDiv.onclick();
        };
        var doc = document;
        if (printParentDiv != null) {
            doc = printParentDiv.ownerDocument;
        };
        var win = window;
        if (printParentWindow != null) {
            win = printParentWindow;
        };
        var printWidth = self.getWidth();
        var printHeight = self.getHeight();
        var printWidthPx = printWidth + "px";
        var printHeightPx = printHeight + "px";
        var printDiv = doc.createElement("div");
        printDiv.style.position = "relative";
        printDiv.style.left = "0px";
        printDiv.style.top = (printParentDiv != null ? "0px" : "-" + printHeightPx);
        printDiv.style.overflow = "hidden";
        printDiv.style.backgroundColor = "white";
        printDiv.style.width = printWidthPx;
        printDiv.style.height = printHeightPx;
        var printHtmlBackground = null;
        var printImg = doc.createElement("img");
        printImg.style.zIndex = 0;
        printImg.style.visibility = "hidden";
        printImg.style.position = "absolute";
        printImg.style.left = "0px";
        printImg.style.top = "0px";
        printImg.style.width = printWidthPx;
        printImg.style.height = printHeightPx;
        printDiv.appendChild(printImg);
        var printHtmlContainer = doc.createElement("div");
        printHtmlContainer.style.position = "absolute";
        printHtmlContainer.style.overflow = "hidden";
        printHtmlContainer.style.left = "0px";
        printHtmlContainer.style.top = "0px";
        printHtmlContainer.style.width = printWidthPx;
        printHtmlContainer.style.height = printHeightPx;
        printHtmlContainer.style.display = "none";
        printDiv.appendChild(printHtmlContainer);
        var loadingIndicator = doc.createElement("img");
        loadingIndicator.style.position = "absolute";
        loadingIndicator.style.left = Math.round((printWidth - 31) / 2) + "px";
        loadingIndicator.style.top = Math.round((printHeight - 31) / 2) + "px";
        loadingIndicator.style.width = "31px";
        loadingIndicator.style.height = "31px";
        loadingIndicator.src = rewriteURL("img/com/ptvag/webcomponent/map/ajax-loader.gif");
        printDiv.appendChild(loadingIndicator);
        if (printParentDiv == null) {
            mComponentElement.style.visibility = "hidden";
            mComponentElement.parentNode.appendChild(printDiv);
            printDiv.onclick = function() {
                ctx.dispose();
                mComponentElement.style.visibility = "";
                printDiv.parentNode.removeChild(printDiv);
                printDiv.onclick = null;
                mCurrentPrintDiv = null;
            };
            mCurrentPrintDiv = printDiv;
        } else {
            printParentDiv.style.width = printWidthPx;
            printParentDiv.style.height = printHeightPx;
            while (printParentDiv.firstChild) {
                printParentDiv.removeChild(printParentDiv.firstChild);
            };
            printParentDiv.appendChild(printDiv);
        };
        if (mCurrentPrintContext != null) {
            mCurrentPrintContext.dispose();
        };
        if (self.getPrintSystem() == "flash") {
            mCurrentPrintContext = new com.ptvag.webcomponent.map.FlashPrintContext(self);
        } else {
            mCurrentPrintContext = new com.ptvag.webcomponent.map.PrintContext(self);
        };
        var ctx = mCurrentPrintContext;
        var layerCount = mLayerArr.length;
        if (layerCount > 0) {
            ctx._ptv_map_currentLayer = 0;
            var interval = window.setInterval(function() {
                if (!map.ImageLoader.isIdle()) {
                    return;
                };
                if (self.getDisposed() || ctx.getDisposed()) {
                    window.clearInterval(interval);
                    return;
                }
                while (ctx._ptv_map_currentLayer < layerCount) {
                    var layerToPrint = mLayerArr[ctx._ptv_map_currentLayer++];
                    if (layerToPrint && !layerToPrint.getDisposed()) {
                        layerToPrint.print(ctx, printHtmlContainer, printHtmlBackground);
                    };
                    if (ctx._ptv_map_currentLayer >= layerCount) {
                        ctx.end();
                    } else {}
                };
                if (ctx._ptv_map_currentLayer >= layerCount && ctx.isIdle()) {
                    window.clearInterval(interval);
                    loadingIndicator.parentNode.removeChild(loadingIndicator);
                    if (ctx.getDisposed()) {
                        if (callback != null) {
                            callback(printParentWindow, new Error("Generation of print version interrupted"));
                        }
                    } else {
                        var exc = ctx.getError();
                        if (exc == null) {
                            printImgURL = ctx.getPrintImageURL();
                        } else {
                            var printImgURL = rewriteURL("img/com/ptvag/webcomponent/map/error.png", true);
                        };
                        ctx.dispose();
                        mCurrentPrintContext = null;
                        map.ImageLoader.loadImage(printImg, printImgURL, function() {
                            printImg.style.visibility = "";
                            printHtmlContainer.style.display = "";
                            if (callback != null) {
                                callback(printParentWindow, exc);
                            }
                        });
                    }
                }
            }, 100);
        }
    };
    self.isFlashPrintingPossible = function() {
        return com.ptvag.webcomponent.util.Flash.detectFlashVer(9, 0, 0);
    };
    self.getMapVersion = function() {
        return mMapVersion;
    };
    self._initContainers = function() {
        parentElement.innerHTML = '<div style="width:100%; height:100%; position:relative; overflow:hidden">' + '<div style="width:100%; height:100%; position:absolute; left:0px; top:0px"></div>' + '</div>';
        mComponentElement = parentElement.getElementsByTagName("div")[0];
        mRelativeLayersElement = mComponentElement.getElementsByTagName("div")[0];
        if (mTileDebugMode) {
            mComponentElement.innerHTML = '<div style="position:absolute; left:100px; top:100px; width:200px; height:200px ">' + '<div style="position:relative; width:100%; height:100%">' + '<div style="position:absolute; left:0px; top:0px; width:100%; height:100%; border:1px solid black; z-index:10000"></div>' + '</div></div>';
            mComponentElement = mComponentElement.firstChild.firstChild;
            CoordUtil.TILE_WIDTH = 45;
        }
    };
    self.initContainers = delegate.initContainers || self._initContainers;
    var init = function() {
        var actualStartRect = startRect;
        if (actualStartRect == null) {
            actualStartRect = {
                left: 4293961,
                top: 5679567,
                right: 4502808,
                bottom: 5400533
            };
        };
        var smartWrap = CoordUtil.SMART_OFFSET / CoordUtil.SMART_UNIT * 2;
        self.setClipRect(0, smartWrap, smartWrap, smartWrap / 4);
        if (!map.Map.SETTINGS_OK) {
            alert("Server-side settings not applied! Please check the scripts.");
        };
        if (useVersionedRequests == null || useVersionedRequests == true) {
            mMapVersion = map.Map.MAP_VERSION;
        };
        var mapService = new map.Rpc(self, qxp.io.remote.Rpc.makeServerURL(), "com.ptvag.webcomponent.map.MapService");
        if (window.location.href.indexOf(qxp.core.ServerSettings.serverPathPrefix) != 0) {
            mapService.setCrossDomain(true);
        };
        map.SERVICE = mapService;
        self.startLoggingAction(map.Map.MARK_FIRST_SESSION ? "mapapi:session" : "mapapi:init");
        try {
            self.initContainers();
            self.setAnimator(new map.animator.AcceleratingAnimator());
            self.updateSize();
            self.setProfileGroup(profileGroup == null ? null : profileGroup);
            if (map.Map.MOBILE_TOUCH) {
                mController = new map.MapMobileController(self, mComponentElement);
            } else {
                mController = new map.MapController(self, mComponentElement);
                mController.addEventListener("changeActionMode", applyConfigurableCursor);
            };
            self.setRect(actualStartRect.left, actualStartRect.top, actualStartRect.right, actualStartRect.bottom);
            self.setResetRect(self.getRect());
            var alphaImgExt = qxp.sys.Client.getInstance().isMshtml() ? "_noalpha.gif" : ".png";
            if (map.Map.USE_COURSE_GRAINED_LAYER) {
                var coursegrainedBuilder = new map.RequestBuilder(self, true);
                coursegrainedBuilder.setGrainSize(4);
                coursegrainedBuilder.setVisible("Town", false);
                var coursegrainedLayer = new map.layer.StretchedMapLayer(coursegrainedBuilder);
                if (!mTileDebugMode) {
                    coursegrainedLayer.set({
                        isRelative: true,
                        needsOpacityHack: true
                    });
                };
                coursegrainedLayer.setEnabled(false);
                self.addLayer(coursegrainedLayer, "coursegrained");
            };
            var backgroundBuilder = new map.RequestBuilder(self, true);
            backgroundBuilder.setVisible("Town", false);
            var backgroundLayer = new map.layer.TileMapLayer(backgroundBuilder);
            if (!mTileDebugMode) {
                backgroundLayer.set({
                    isRelative: true,
                    needsOpacityHack: true
                });
            };
            backgroundLayer.setIncludeInPrint(true);
            self.addLayer(backgroundLayer, "background");
            if (map.Map.USE_SAT_LAYER) {
                var satBuilder = new map.RequestBuilder(self, true);
                satBuilder.setSat(true);
                satBuilder.setVisible("Town", false);
                var satLayer = new map.layer.TileMapLayer(satBuilder);
                if (!mTileDebugMode) {
                    satLayer.set({
                        isRelative: true,
                        needsOpacityHack: true
                    });
                };
                satLayer.setEnabled(false);
                self.addLayer(satLayer, "sat");
                satLayer.addEventListener('changeEnabled', function(evt) {
                    coursegrainedBuilder.setSat(evt.getData());
                });
            };
            var labelBuilder = new map.RequestBuilder(self, false);
            labelBuilder.setVisible("Town", true);
            labelBuilder.setTransparent(true);
            var labelLayer = new map.layer.SimpleMapLayer(labelBuilder);
            if (!mTileDebugMode) {
                labelLayer.set({
                    isRelative: true,
                    needsOpacityHack: true
                });
            };
            labelLayer.setIncludeInPrint(true);
            labelLayer.setAutoRotate(false);
            self.addLayer(labelLayer, "label");
            var floaterLayer = new map.layer.RelativeLayer();
            if (!mTileDebugMode) {
                floaterLayer.set({
                    isRelative: true
                });
            };
            var vectorLayer = new map.layer.VectorLayer(floaterLayer);
            if (!mTileDebugMode) {
                vectorLayer.set({
                    isRelative: true
                });
            };
            vectorLayer.setIncludeInPrint(true);
            self.addLayer(vectorLayer, "vector");
            mServerDrawnObjectManager = new map.ServerDrawnObjectManager(labelBuilder, vectorLayer);
            var overviewBuilder = new map.RequestBuilder(self, true);
            overviewBuilder.setVisible("Town", true);
            var overviewLayer = new map.layer.SimpleMapLayer(overviewBuilder, {
                enabled: false,
                areaLeft: 10,
                areaBottom: 20,
                areaWidth: 0.4,
                areaWidthIsRelative: true,
                areaHeight: 0.375,
                areaHeightIsRelative: true,
                areaTop: null,
                areaRight: null,
                areaBorderWidth: 1,
                overlayOpacity: 0.2,
                borderWidth: 21,
                zoomDifference: Math.round(Math.log(10) / Math.log(CoordUtil.ZOOM_LEVEL_FACTOR)),
                useZoomTransparency: false,
                swallowHoverEvents: true,
                swallowClickEvents: true
            });
            overviewLayer.setIncludeInPrint(true);
            overviewLayer.setAutoRotate(false);
            self.addLayer(overviewLayer, "overview", 1);
            self.addLayer(floaterLayer, "floater");
            var imgPrefix = "img/com/ptvag/webcomponent/map/";
            var imgLayer = new map.layer.ImageLayer(rewriteURL(imgPrefix + "compass_rose_2" + alphaImgExt, true));
            imgLayer.set({
                areaRight: 10,
                areaTop: 10
            });
            imgLayer.setAutoRotate(true);
            self.addLayer(imgLayer, "compass", 1, null, false);
            var posLayer = new map.layer.PositionInfoLayer();
            posLayer.set({
                enabled: false,
                areaLeft: 10,
                areaRight: 10,
                areaTop: 40,
                areaHeight: 10
            });
            self.addLayer(posLayer, "position", 1);
            if (map.Map.USE_DEBUG_LAYER) {
                var debugLayer = new map.layer.DebugLayer();
                debugLayer.set({
                    enabled: false,
                    areaLeft: 10,
                    areaRight: 30,
                    areaBottom: 35
                });
                self.addLayer(debugLayer, "debug", 1);
            };
            self.setCopyright(null);
            var scaleLayer = new map.layer.ScaleLayer;
            scaleLayer.set({
                areaRight: 0,
                areaBottom: 0
            });
            scaleLayer.setIncludeInPrint(true);
            self.addLayer(scaleLayer, "scale", 1, null, false);
            if (map.Map.USE_ZOOM_SLIDER) {
                var sliderLayer = new map.layer.ZoomSliderLayer;
                sliderLayer.set({
                    areaRight: 7,
                    areaTop: 60,
                    areaBottom: 10 + scaleLayer.getComputedAreaHeight()
                });
                self.addLayer(sliderLayer, "zoomslider", 1, null, false);
            };
            if (map.Map.USE_TOOLBAR) {
                var toolbarLayer = new map.layer.DefaultToolbarLayer;
                toolbarLayer.set({
                    areaLeft: 10,
                    areaTop: 10
                });
                self.addLayer(toolbarLayer, "toolbar", 1, null, false);
            };
            self.setConfigurableCursor("default");
            self.createDispatchDataEvent("mapVersion", mMapVersion);
        } finally {
            self.endLoggingAction();
        }
    };
    self.getRelativeLayersElement = function() {
        return mRelativeLayersElement;
    };
    self.getComponentElement = function() {
        return mComponentElement;
    };
    init();
});
qxp.Class.OPACITY_HACK_SIZE = (qxp.sys.Client.getInstance().isMshtml() && qxp.sys.Client.getInstance().getMajor() < 9 ? 2000 : 1000000);
qxp.Class.MARK_FIRST_SESSION = true;
qxp.Class.ENABLE_CACHING = true;
qxp.Class.STATIC_SERVER = null;
qxp.Class.MAP_VERSION = null;
qxp.Class.USE_COURSE_GRAINED_LAYER = true;
qxp.Class.USE_SAT_LAYER = true;
qxp.Class.USE_DEBUG_LAYER = true;
qxp.Class.USE_TOOLBAR = true;
qxp.Class.USE_ZOOM_SLIDER = true;
qxp.Class.MOBILE_TOUCH = /Apple.*Mobile/.test(navigator.userAgent) || /Android/.test(navigator.userAgent) || /Windows Phone/.test(navigator.userAgent) && window.navigator.msPointerEnabled;
qxp.OO.addProperty({
    name: "allowMouseWheelZoom",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "allowDoubleClickZoom",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "allowDoubleRightClickZoom",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "doubleRightClickDelay",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 400
});
qxp.OO.addProperty({
    name: "useAutoBulkMode",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "width",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "height",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "center",
    type: qxp.constant.Type.OBJECT
});
qxp.OO.addProperty({
    name: "centerIsAdjusting",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "zoom",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "rotation",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "visibleCenter",
    type: qxp.constant.Type.OBJECT
});
qxp.OO.addProperty({
    name: "visibleZoom",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "visibleRotation",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "inverseWheelZoom",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "animator",
    type: qxp.constant.Type.OBJECT,
    allowNull: false
});
qxp.OO.addProperty({
    name: "animate",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "zoomBoxColor",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "#dddddd"
});
qxp.OO.addProperty({
    name: "zoomBoxOpacity",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0.5
});
qxp.OO.addProperty({
    name: "zoomBoxBorderColor",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "blue"
});
qxp.OO.addProperty({
    name: "zoomBoxBorderWidth",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 2
});
qxp.OO.addProperty({
    name: "clipMoveBorder",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 40
});
qxp.OO.addProperty({
    name: "viewToPointsBorder",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 40
});
qxp.OO.addProperty({
    name: "viewToPointsMinZoomLevel",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 3
});
qxp.OO.addProperty({
    name: "maxHistorySize",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 50
});
qxp.OO.addProperty({
    name: "resetRect",
    type: qxp.constant.Type.OBJECT
});
qxp.OO.addProperty({
    name: "relativeOffset",
    type: qxp.constant.Type.OBJECT,
    defaultValue: {
        x: 0,
        y: 0
    }
});
qxp.OO.addProperty({
    name: "profileGroup",
    type: qxp.constant.Type.STRING,
    defaultValue: null
});
qxp.OO.addProperty({
    name: "backendServer",
    type: qxp.constant.Type.STRING,
    defaultValue: null
});
qxp.OO.addProperty({
    name: "printSystem",
    type: qxp.constant.Type.STRING,
    possibleValues: ["server", "flash"],
    defaultValue: "server",
    allowNull: false
});
qxp.OO.addProperty({
    name: "decimalSeparator",
    type: qxp.constant.Type.STRING,
    defaultValue: ".",
    allowNull: false
});
qxp.OO.addProperty({
    name: "useMiles",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "moveCursor",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: ""
});
qxp.OO.addProperty({
    name: "moveCursorActive",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "move"
});
qxp.OO.addProperty({
    name: "zoomCursor",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: ""
});
qxp.OO.addProperty({
    name: "zoomCursorActive",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "crosshair"
});
qxp.OO.addProperty({
    name: "enableKeyboardControl",
    getAlias: "enableKeyboardControl",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "enableKeyboardRotation",
    getAlias: "enableKeyboardRotation",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.dev.log.Logger.ROOT_LOGGER.setMinLevel(qxp.dev.log.Logger.LEVEL_OFF);




/* ID: com.ptvag.webcomponent.map.RequestBuilder */
qxp.OO.defineClass("com.ptvag.webcomponent.map.RequestBuilder", qxp.core.Target, function(parentMap, defaultVisible) {
    qxp.core.Object.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mMap = parentMap;
    var FIND_ALL_QUESTIONMARKS = new RegExp('\\?', 'g');
    var FIND_ALL_AMPERSANDS = new RegExp('&', 'g');
    var FIND_ALL_EQUAL_SIGNS = new RegExp('=', 'g');
    var mVisibleLayers = {
        Town: defaultVisible,
        Street: defaultVisible,
        Border: defaultVisible,
        Height: defaultVisible,
        Other: defaultVisible,
        Rail: defaultVisible,
        Sea: defaultVisible,
        Water: defaultVisible,
        Woodland: defaultVisible,
        Land: defaultVisible,
        Bridge: defaultVisible,
        Tunnel: defaultVisible,
        Background: defaultVisible
    };
    var mLayerNames = [];
    var mPOICategories = {};
    var mNeedEncodedPOICategories = false;
    var mSMOIds = {};
    var mBulkModeTimer = null;
    self.getMap = function() {
        return mMap;
    };
    self.setVisible = function(layer, visible) {
        mVisibleLayers[layer] = visible;
    };
    self.addPOICategory = function(provider, category) {
        if (!self.supportsServerDrawnObjects()) {
            throw new Error("addPOICategory() called on a request builder that doesn't support static POIs");
        };
        if (provider.indexOf(",") >= 0 || provider.indexOf("$") >= 0 || category.indexOf(",") >= 0 || category.indexOf("$") >= 0) {
            mNeedEncodedPOICategories = true;
        };
        var providerHash = mPOICategories[provider];
        if (providerHash == null) {
            providerHash = {};
            mPOICategories[provider] = providerHash;
        };
        providerHash[category] = 42;
        firePOICategoriesChanged();
    };
    self.removePOICategory = function(provider, category) {
        if (!self.supportsServerDrawnObjects()) {
            throw new Error("removePOICategory() called on a request builder that doesn't support static POIs");
        };
        var providerHash = mPOICategories[provider];
        if (providerHash != null) {
            delete providerHash[category];
            var providerEmpty = true;
            for (var category in providerHash) {
                providerEmpty = false;
                break;
            };
            if (providerEmpty) {
                delete mPOICategories[provider];
            }
        };
        firePOICategoriesChanged();
    };
    self.registerHint = function(hintId, hintData, callback) {
        com.ptvag.webcomponent.map.SERVICE.callAsync(callback, "registerHint", hintId, hintData);
    };
    self.addSMOId = function(smoId) {
        if (!self.supportsServerDrawnObjects()) {
            throw new Error("addSMOId() called on a request builder that doesn't support SMO IDs");
        };
        mSMOIds[smoId] = 42;
        firePOICategoriesChanged();
    };
    self.removeSMOId = function(smoId) {
        if (!self.supportsServerDrawnObjects()) {
            throw new Error("removeSMOId() called on a request builder that doesn't support SMO IDs");
        };
        delete mSMOIds[smoId];
        firePOICategoriesChanged();
    };
    var doFirePOICategoriesChanged = function() {
        mBulkModeTimer = null;
        if (self.getDisposed()) {
            return;
        };
        if (self.hasEventListeners("poiCategoriesChanged")) {
            self.dispatchEvent(new qxp.event.type.Event("poiCategoriesChanged"));
        }
    };
    var firePOICategoriesChanged = function() {
        if (mBulkModeTimer != null) {
            return;
        };
        if (self.hasEventListeners("poiCategoriesChanged")) {
            mBulkModeTimer = window.setTimeout(doFirePOICategoriesChanged, 0);
        }
    };
    self.hasPOICategories = function() {
        for (var provider in mPOICategories) {
            return true;
        };
        return false;
    };
    self.hasSMOs = function() {
        for (var provider in mSMOIds) {
            return true;
        };
        return false;
    };
    self.hasServerDrawnObjects = function() {
        return self.hasPOICategories() || self.hasSMOs();
    };
    var encodePOICategories = function() {
        var retVal = "";
        for (var provider in mPOICategories) {
            for (var category in mPOICategories[provider]) {
                if (retVal != "") {
                    retVal += ",";
                };
                if (mNeedEncodedPOICategories) {
                    retVal += encodeURIComponent(provider) + "$" + encodeURIComponent(category);
                } else {
                    retVal += provider + "$" + category;
                }
            }
        };
        return encodeURIComponent(retVal);
    };
    var encodeSMOIds = function() {
        var retVal = "";
        for (var smoId in mSMOIds) {
            if (retVal != "") {
                retVal += ",";
            };
            retVal += smoId;
        };
        return encodeURIComponent(retVal);
    };
    self.supportsServerDrawnObjects = function() {
        var serverDrawnObjectManager = mMap.getServerDrawnObjectManager();
        return (serverDrawnObjectManager != null) && (serverDrawnObjectManager.getRequestBuilder() == self);
    };
    self.buildRequest = function(left, top, right, bottom, width, height, loggingInfo, mapVersion, angle) {
        if (angle == null) {
            angle = 0;
        };
        var grainSize = self.getGrainSize();
        if (grainSize > 1) {
            width = Math.round(width / grainSize);
            height = Math.round(height / grainSize);
        };
        var clipRect = mMap.getClipRectInMercator();
        if ((clipRect.right != null && left >= clipRect.right) || (clipRect.left != null && right <= clipRect.left) || (clipRect.bottom != null && top <= clipRect.bottom) || (clipRect.top != null && bottom >= clipRect.top)) {
            return {
                completelyClipped: true
            };
        };
        var clipLeftMerc = (clipRect.left != null && clipRect.left > left) ? clipRect.left : left;
        var clipRightMerc = (clipRect.right != null && clipRect.right < right) ? clipRect.right : right;
        var clipTopMerc = (clipRect.top != null && clipRect.top < top) ? clipRect.top : top;
        var clipBottomMerc = (clipRect.bottom != null && clipRect.bottom > bottom) ? clipRect.bottom : bottom;
        var clipLeftPix = 0;
        var clipRightPix = 0;
        var clipTopPix = 0;
        var clipBottomPix = 0;
        var clipWidthPix = width;
        var clipHeightPix = height;
        if (clipLeftMerc != left || clipRightMerc != right) {
            var origWidthMerc = right - left;
            var newWidthMerc = clipRightMerc - clipLeftMerc;
            clipWidthPix = Math.round(width * newWidthMerc / origWidthMerc);
            clipLeftPix = Math.round(width * (clipLeftMerc - left) / origWidthMerc);
            clipRightPix = width - clipWidthPix - clipLeftPix;
            if (clipWidthPix < map.RequestBuilder.MIN_IMAGE_SIZE) {
                var missingPix = map.RequestBuilder.MIN_IMAGE_SIZE - clipWidthPix;
                var missingMerc = missingPix * (right - left) / width;
                if (clipLeftPix != 0) {
                    if (clipRightPix != 0) {
                        return {
                            completelyClipped: true
                        };
                    };
                    clipRightPix = -missingPix;
                    clipRightMerc += missingMerc;
                } else {
                    clipLeftPix = -missingPix;
                    clipLeftMerc -= missingMerc;
                };
                clipWidthPix = map.RequestBuilder.MIN_IMAGE_SIZE;
            }
        };
        if (clipTopMerc != top || clipBottomMerc != bottom) {
            var origHeightMerc = top - bottom;
            var newHeightMerc = clipTopMerc - clipBottomMerc;
            clipHeightPix = Math.round(height * newHeightMerc / origHeightMerc);
            clipBottomPix = Math.round(height * (clipBottomMerc - bottom) / origHeightMerc);
            clipTopPix = height - clipHeightPix - clipBottomPix;
            if (clipHeightPix < map.RequestBuilder.MIN_IMAGE_SIZE) {
                var missingPix = map.RequestBuilder.MIN_IMAGE_SIZE - clipHeightPix;
                var missingMerc = missingPix * (top - bottom) / height;
                if (clipBottomPix != 0) {
                    if (clipTopPix != 0) {
                        return {
                            completelyClipped: true
                        };
                    };
                    clipTopPix = -missingPix;
                    clipTopMerc += missingMerc;
                } else {
                    clipBottomPix = -missingPix;
                    clipBottomMerc -= missingMerc;
                };
                clipHeightPix = map.RequestBuilder.MIN_IMAGE_SIZE;
            }
        };
        var requestWidth = clipWidthPix;
        var requestHeight = clipHeightPix;
        var scaleFactor = map.RequestBuilder.RESOLUTION_SCALE_FACTOR;
        if (scaleFactor != 1) {
            requestWidth = Math.round(requestWidth * scaleFactor);
            requestHeight = Math.round(requestHeight * scaleFactor);
        };
        var urlParams = "?left=" + Math.round(clipLeftMerc + self.getDebugOffsetLeft()) + "&right=" + Math.round(clipRightMerc + self.getDebugOffsetRight()) + "&top=" + Math.round(clipTopMerc + self.getDebugOffsetTop()) + "&bottom=" + Math.round(clipBottomMerc + self.getDebugOffsetBottom()) + "&width=" + requestWidth + "&height=" + requestHeight;
        if (angle != 0) {
            urlParams += "&angle=" + angle;
        };
        if (mapVersion != null) {
            urlParams += "&version=" + encodeURIComponent(mapVersion);
        };
        var hint = self.getHint();
        if (hint != null) {
            urlParams += "&hint=" + encodeURIComponent(hint);
        };
        var visibleLayers = "";
        var hiddenLayers = "";
        var townVisible = false;
        for (var i = 0; i < mLayerNames.length;
            ++i) {
            var layer = mLayerNames[i];
            if (mVisibleLayers[layer]) {
                if (visibleLayers != "") {
                    visibleLayers += ",";
                };
                visibleLayers += layer;
                if (layer == "Town") {
                    townVisible = true;
                }
            } else {
                if (hiddenLayers != "") {
                    hiddenLayers += ",";
                };
                hiddenLayers += layer;
            }
        };
        if (hiddenLayers.length > visibleLayers.length && visibleLayers.length != 0) {
            hiddenLayers = "";
        } else {
            visibleLayers = "";
        };
        if (visibleLayers != "") {
            urlParams += "&visibleLayers=" + visibleLayers;
        };
        if (hiddenLayers != "") {
            urlParams += "&hiddenLayers=" + hiddenLayers;
        };
        if (self.getSat()) {
            urlParams += "&sat=true";
        };
        if (self.isTransparent()) {
            urlParams += "&transparent=true";
            if (townVisible) {
                urlParams += "&loggingInfo=" + encodeURIComponent(loggingInfo);
            }
        };
        if (self.supportsServerDrawnObjects()) {
            var poiCategories = encodePOICategories();
            if (poiCategories != "") {
                if (mNeedEncodedPOICategories) {
                    urlParams += "&poiCategoriesEnc=" + poiCategories;
                } else {
                    urlParams += "&poiCategories=" + poiCategories;
                }
            };
            var smoIds = encodeSMOIds();
            if (smoIds != "") {
                urlParams += "&smoIds=" + smoIds;
            }
        };
        var imageId = null;
        if (townVisible || !map.Map.ENABLE_CACHING) {
            imageId = (new Date()).getTime();
            if (imageId <= map.RequestBuilder.LAST_IMAGE_ID) {
                imageId = map.RequestBuilder.LAST_IMAGE_ID + 1;
            };
            map.RequestBuilder.LAST_IMAGE_ID = imageId;
            imageId = "" + imageId;
            urlParams += "&imageId=" + imageId;
        };
        var profileGroup = mMap.getProfileGroup();
        if (profileGroup != null) {
            urlParams += "&profileGroup=" + encodeURIComponent(profileGroup);
        };
        var backendServer = self.getBackendServer();
        if (backendServer == null) {
            backendServer = mMap.getBackendServer();
        };
        if (backendServer != null) {
            urlParams += "&backendServer=" + encodeURIComponent(backendServer);
        };
        if (self.getHideLabelsAndStreets()) {
            urlParams += "&hideLabelsAndStreets=true";
        };
        if (townVisible) {
            if (map.RequestBuilder.CUSTOM_PARAMETER != null) {
                urlParams += "&customParams=" + encodeURIComponent(map.RequestBuilder.CUSTOM_PARAMETER);
            };
            urlParams += "&" + map.RequestBuilder.getTokenName() + "=" + encodeURIComponent(map.RequestBuilder.getTokenValue());
            var url = map.MapUtil.rewriteURL("/MapServlet" + urlParams, false, "");
        } else {
            var numX = Math.round(right / (right - left));
            var numY = Math.round(top / (top - bottom));
            var index = (numX + numY) % 3;
            if (index == 0) {
                var serverPathPrefix = map.RequestBuilder.SERVER1;
            } else if (index == 1) {
                serverPathPrefix = map.RequestBuilder.SERVER2;
            } else {
                serverPathPrefix = map.RequestBuilder.SERVER3;
            };
            if (serverPathPrefix == null) {
                serverPathPrefix = map.Map.STATIC_SERVER;
            };
            if (serverPathPrefix == null) {
                serverPathPrefix = qxp.core.ServerSettings.serverPathPrefix;
            };
            url = serverPathPrefix + "/MapServlet" + urlParams.replace(FIND_ALL_QUESTIONMARKS, '/').replace(FIND_ALL_AMPERSANDS, '/').replace(FIND_ALL_EQUAL_SIGNS, '_');
        };
        return {
            url: url,
            width: clipWidthPix,
            height: clipHeightPix,
            clipLeft: clipLeftPix,
            clipRight: clipRightPix,
            clipTop: clipTopPix,
            clipBottom: clipBottomPix,
            imageId: imageId
        };
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        if (mBulkModeTimer != null) {
            window.clearTimeout(mBulkModeTimer);
        };
        superDispose.apply(self, arguments);
    };
    var init = function() {
        for (var layerName in mVisibleLayers) {
            mLayerNames.push(layerName);
        };
        mLayerNames.sort();
    };
    init();
});
qxp.Class.getHost = function(urlStr) {
    if (urlStr == null) return null;
    var tmpStr = "" + urlStr;
    tmpStr = tmpStr.replace(/^.*\/\//, "");
    tmpStr = tmpStr.replace(/:.*$/, "");
    tmpStr = tmpStr.replace(/\/.*$/, "");
    return tmpStr;
};
qxp.Class.getToken = function() {
    var self = com.ptvag.webcomponent.map.RequestBuilder;
    return self.SECURITY_TOKEN + "$" + self.getHost(window.document.referrer) + "$" + self.getHost(window.document.URL);
};
qxp.Class.getTokenName = function() {
    var self = com.ptvag.webcomponent.map.RequestBuilder;
    if (self.X_TOKEN != null) {
        return "xtok";
    };
    return "tok";
};
qxp.Class.getTokenValue = function() {
    var self = com.ptvag.webcomponent.map.RequestBuilder;
    if (self.X_TOKEN != null) {
        return self.X_TOKEN;
    } else {
        return self.getToken();
    }
};
qxp.OO.addProperty({
    name: "transparent",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false,
    getAlias: "isTransparent"
});
qxp.OO.addProperty({
    name: "sat",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "grainSize",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1
});
qxp.OO.addProperty({
    name: "hint",
    type: qxp.constant.Type.STRING,
    defaultValue: null
});
qxp.OO.addProperty({
    name: "backendServer",
    type: qxp.constant.Type.STRING,
    defaultValue: null
});
qxp.OO.addProperty({
    name: "hideLabelsAndStreets",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "debugOffsetLeft",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "debugOffsetRight",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "debugOffsetTop",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "debugOffsetBottom",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.Class.RESOLUTION_SCALE_FACTOR = 1;
qxp.Class.MIN_IMAGE_SIZE = 32;
qxp.Class.SERVER1 = null;
qxp.Class.SERVER2 = null;
qxp.Class.SERVER3 = null;
qxp.Class.CUSTOM_PARAMETER = null;
qxp.Class.SECURITY_TOKEN = null;
qxp.Class.X_TOKEN = null;
qxp.Class.LAST_IMAGE_ID = 0;




/* ID: com.ptvag.webcomponent.map.CoordUtil */
qxp.OO.defineClass("com.ptvag.webcomponent.map.CoordUtil");
qxp.Class.sizeCenterZoom2BBox = function(width, height, center, zoom) {
    var supp = com.ptvag.webcomponent.map.CoordUtil.getSmartUnitsPerPixel(zoom);
    return {
        left: center.x - supp * width / 2,
        top: center.y + supp * height / 2,
        right: center.x + supp * width / 2,
        bottom: center.y - supp * height / 2
    };
};
qxp.Class.sizeCenterZoomInSUPP2BBox = function(width, height, center, supp) {
    return {
        left: center.x - supp * width / 2,
        top: center.y + supp * height / 2,
        right: center.x + supp * width / 2,
        bottom: center.y - supp * height / 2
    };
};
qxp.Class.distanceOfSmartUnitPoints = function(suPoint1, suPoint2) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    var dx = suPoint1.x - suPoint2.x;
    var dy = suPoint1.y - suPoint2.y;
    var lon = (suPoint1.y + suPoint2.y) / 2;
    var mercLon = lon * CoordUtil.SMART_UNIT - CoordUtil.SMART_OFFSET;
    var geoLonDegrees = 180 / Math.PI * (Math.atan(Math.exp(mercLon / 6371000)) - (Math.PI / 4)) / 0.5;
    var metersPerSmartUnit = CoordUtil.SMART_UNIT * Math.cos(geoLonDegrees / 180 * Math.PI);
    return Math.sqrt((dx * dx + dy * dy)) * metersPerSmartUnit;
};
qxp.Class.mercator2SmartUnit = function(mercPoint) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return {
        x: ((mercPoint.x + CoordUtil.SMART_OFFSET) / CoordUtil.SMART_UNIT),
        y: ((mercPoint.y + CoordUtil.SMART_OFFSET) / CoordUtil.SMART_UNIT)
    };
};
qxp.Class.smartUnit2Mercator = function(suPoint) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return {
        x: suPoint.x * CoordUtil.SMART_UNIT - CoordUtil.SMART_OFFSET,
        y: suPoint.y * CoordUtil.SMART_UNIT - CoordUtil.SMART_OFFSET
    };
};
qxp.Class.mercator2GeoDecimal = function(mercPoint) {
    var geoPoint = {};
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    geoPoint.x = CoordUtil.MERC_2_GEO_X_HELPER * mercPoint.x;
    geoPoint.y = (Math.atan(Math.exp(mercPoint.y / 6371000.0)) - (Math.PI / 4.0)) * CoordUtil.MERC_2_GEO_Y_HELPER;
    return geoPoint;
};
qxp.Class.geoDecimal2Mercator = function(geoPoint) {
    var mercPoint = {};
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    mercPoint.x = CoordUtil.GEO_2_MERC_X_HELPER * geoPoint.x;
    mercPoint.y = 6371000.0 * Math.log(Math.tan((Math.PI / 4.0) + CoordUtil.GEO_2_MERC_Y_HELPER * geoPoint.y));
    return mercPoint;
};
qxp.Class.geoDecimal2SmartUnit = function(geoPoint) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return CoordUtil.mercator2SmartUnit(CoordUtil.geoDecimal2Mercator(geoPoint));
};
qxp.Class.geoDecimalList2SmartUnitList = function(pointList) {
    var map = com.ptvag.webcomponent.map;
    var converter = map.CoordUtil.geoDecimal2SmartUnit;
    var newList = [];
    var iter = new map.PointListIterator(pointList);
    while (iter.iterate()) {
        newList.push(converter({
            x: iter.x,
            y: iter.y
        }));
    };
    return newList;
};
qxp.Class.smartUnit2GeoDecimal = function(suPoint) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return CoordUtil.mercator2GeoDecimal(CoordUtil.smartUnit2Mercator(suPoint));
};
qxp.Class.geoDecimal2Latlon = function(point) {
    return {
        x: point.x / 100000,
        y: point.y / 100000
    };
};
qxp.Class.latlon2Geodecimal = function(point) {
    return {
        x: point.x * 100000,
        y: point.y * 100000
    };
};
qxp.Class.smartUnit2Tile = function(suPoint, level) {
    var tilewidth = com.ptvag.webcomponent.map.CoordUtil.TILE_WIDTHS[level];
    if (!tilewidth) {
        throw new Error("Illegal zoom level: " + level);
    };
    return {
        x: suPoint.x / tilewidth,
        y: suPoint.y / tilewidth
    };
};
qxp.Class.tile2SmartUnit = function(tilePoint, level) {
    var tilewidth = com.ptvag.webcomponent.map.CoordUtil.TILE_WIDTHS[level];
    if (!tilewidth) {
        throw new Error("Illegal zoom level: " + level);
    };
    return {
        x: tilePoint.x * tilewidth,
        y: tilePoint.y * tilewidth
    };
};
qxp.Class.tile2TileId = function(tilePoint) {
    return ((tilePoint.x & 0xffff) << 16) | (tilePoint.y & 0xffff);
};
qxp.Class.tileId2Tile = function(tileId) {
    return {
        x: tileId >> 16,
        y: tileId & 0xffff
    };
};
qxp.Class.smartUnit2Pixel = function(suPoint, level) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return CoordUtil.smartUnit2PixelByTileWidth(suPoint, CoordUtil.getTileWidth(level));
};
qxp.Class.pixel2SmartUnit = function(pixPoint, level) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return CoordUtil.pixel2SmartUnitByTileWidth(pixPoint, CoordUtil.getTileWidth(level));
};
qxp.Class.smartUnit2PixelByTileWidth = function(suPoint, tilewidth) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return {
        x: suPoint.x / tilewidth * CoordUtil.TILE_WIDTH,
        y: suPoint.y / tilewidth * CoordUtil.TILE_WIDTH
    };
};
qxp.Class.pixel2SmartUnitByTileWidth = function(pixPoint, tilewidth) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return {
        x: pixPoint.x * tilewidth / CoordUtil.TILE_WIDTH,
        y: pixPoint.y * tilewidth / CoordUtil.TILE_WIDTH
    };
};
qxp.Class.getTileWidth = function(level) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return CoordUtil.ZOOM_BASE * Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, level);
};
qxp.Class.getLevelForTileWidth = function(tileWidth) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return Math.log(tileWidth / CoordUtil.ZOOM_BASE) / CoordUtil.ZOOM_LOG_LEVEL_FACTOR;
};
qxp.Class.getSmartUnitsPerPixel = function(level) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return CoordUtil.getTileWidth(level) / CoordUtil.TILE_WIDTH
};
qxp.Class.getLevelForSmartUnitsPerPixel = function(suPerPixel) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return CoordUtil.getLevelForTileWidth(suPerPixel * CoordUtil.TILE_WIDTH);
};
qxp.Class.clipHelper = function(t, p, q) {
    if (p == 0) {
        if (q < 0) {
            return true;
        }
    } else {
        r = q / p;
        if (p < 0) {
            if (r > t[1]) {
                return true;
            };
            if (r > t[0]) {
                t[0] = r;
            }
        } else {
            if (r < t[0]) {
                return true;
            };
            if (r < t[1]) {
                t[1] = r;
            }
        }
    };
    return false;
};
qxp.Class.clipLine = function(startPoint, endPoint, bounds, edgeInfo) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    var t = [0, 1];
    var tPrev = [0, 1];
    var clipEdgeStart = null;
    var clipEdgeEnd = null;
    if (edgeInfo != null) {
        edgeInfo.clipEdgeStart = clipEdgeStart;
        edgeInfo.clipEdgeEnd = clipEdgeEnd;
    };
    var deltaX = endPoint.x - startPoint.x;
    var deltaY = endPoint.y - startPoint.y;
    var p = -deltaX;
    var q = -(bounds.minX - startPoint.x);
    if (CoordUtil.clipHelper(t, p, q)) {
        return 4;
    };
    if (t[0] != tPrev[0]) {
        clipEdgeStart = 3;
        tPrev[0] = t[0];
    };
    if (t[1] != tPrev[1]) {
        clipEdgeEnd = 3;
        tPrev[1] = t[1];
    };
    p = deltaX;
    q = bounds.maxX - startPoint.x;
    if (CoordUtil.clipHelper(t, p, q)) {
        return 4;
    };
    if (t[0] != tPrev[0]) {
        clipEdgeStart = 1;
        tPrev[0] = t[0];
    };
    if (t[1] != tPrev[1]) {
        clipEdgeEnd = 1;
        tPrev[1] = t[1];
    };
    p = -deltaY;
    q = -(bounds.minY - startPoint.y);
    if (CoordUtil.clipHelper(t, p, q)) {
        return 4;
    };
    if (t[0] != tPrev[0]) {
        clipEdgeStart = 2;
        tPrev[0] = t[0];
    };
    if (t[1] != tPrev[1]) {
        clipEdgeEnd = 2;
        tPrev[1] = t[1];
    };
    p = deltaY;
    q = bounds.maxY - startPoint.y;
    if (CoordUtil.clipHelper(t, p, q)) {
        return 4;
    };
    if (t[0] != tPrev[0]) {
        clipEdgeStart = 0;
        tPrev[0] = t[0];
    };
    if (t[1] != tPrev[1]) {
        clipEdgeEnd = 0;
        tPrev[1] = t[1];
    };
    if (edgeInfo != null) {
        edgeInfo.clipEdgeStart = clipEdgeStart;
        edgeInfo.clipEdgeEnd = clipEdgeEnd;
    };
    if (t[0] == 0 && t[1] == 1) {
        return 0;
    };
    endPoint.x = startPoint.x + t[1] * deltaX;
    endPoint.y = startPoint.y + t[1] * deltaY;
    startPoint.x += t[0] * deltaX;
    startPoint.y += t[0] * deltaY;
    return (t[0] == 0 ? 0 : 1) + (t[1] == 1 ? 0 : 2);
};
qxp.Class.isPointInPoly = function(pointX, pointY, polyCoords) {
    var vertexCount = polyCoords.length / 2;
    var j = vertexCount - 1;
    var odd = false;
    for (var i = 0; i < vertexCount;
        ++i) {
        var polyXi = polyCoords[i * 2];
        var polyYi = polyCoords[i * 2 + 1];
        var polyXj = polyCoords[j * 2];
        var polyYj = polyCoords[j * 2 + 1];
        if (polyYi < pointY && polyYj >= pointY || polyYj < pointY && polyYi >= pointY) {
            if (polyXi + (pointY - polyYi) / (polyYj - polyYi) * (polyXj - polyXi) < pointX) {
                odd = !odd;
            }
        };
        j = i;
    };
    return odd;
};
qxp.Class.makeClockwisePoly = function(coordinates) {
    var vertexCount = coordinates.length / 2;
    var sum = 0;
    for (var i = 0; i < vertexCount;
        ++i) {
        var nextIndex = i + 1;
        if (nextIndex == vertexCount) {
            nextIndex = 0;
        };
        sum += coordinates[i * 2] * coordinates[nextIndex * 2 + 1] - coordinates[nextIndex * 2] * coordinates[i * 2 + 1];
    };
    if (sum < 0) {
        return coordinates;
    };
    var retVal = new Array(vertexCount * 2);
    for (i = 0; i < vertexCount;
        ++i) {
        nextIndex = vertexCount - i - 1;
        retVal[i * 2] = coordinates[nextIndex * 2];
        retVal[i * 2 + 1] = coordinates[nextIndex * 2 + 1];
    };
    return retVal;
};
qxp.Class.makeLinkedList = function(list) {
    var nodeCount = list.length;
    for (var i = 0; i < nodeCount;
        ++i) {
        var index = i + 1;
        if (index == nodeCount) {
            index = 0;
        };
        list[i].next = list[index];
    }
};
qxp.Class.clipPoly = function(coordinates, bounds) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    var clockwiseCoordinates = CoordUtil.makeClockwisePoly(coordinates);
    var vertexCount = clockwiseCoordinates.length / 2;
    var subjectList = new Array(vertexCount);
    for (var i = 0; i < vertexCount;
        ++i) {
        subjectList[i] = {
            x: clockwiseCoordinates[i * 2],
            y: clockwiseCoordinates[i * 2 + 1]
        };
    };
    CoordUtil.makeLinkedList(subjectList);
    var clipList = [{
        x: bounds.minX,
        y: bounds.maxY
    }, {
        x: bounds.maxX,
        y: bounds.maxY
    }, {
        x: bounds.maxX,
        y: bounds.minY
    }, {
        x: bounds.minX,
        y: bounds.minY
    }];
    CoordUtil.makeLinkedList(clipList);
    var enteringList = [];
    var intersectionPointClip;
    var edgeInfo = new Object();
    var lineInside = false;
    for (i = 0; i < vertexCount;
        ++i) {
        var endIndex = i + 1;
        if (endIndex == vertexCount) {
            endIndex = 0;
        };
        var startPoint = {
            x: subjectList[i].x,
            y: subjectList[i].y
        };
        var endPoint = {
            x: subjectList[endIndex].x,
            y: subjectList[endIndex].y
        };
        if (CoordUtil.clipLine(startPoint, endPoint, bounds, edgeInfo) == 0) {
            lineInside = true;
        };
        for (var j = 0; j < 2;
            ++j) {
            var intersectionPointSubject = null;
            if (edgeInfo.clipEdgeStart != null && j == 0) {
                enteringList.push(startPoint);
                intersectionPointSubject = startPoint;
                var edgeIndex = edgeInfo.clipEdgeStart;
            } else if (edgeInfo.clipEdgeEnd != null && j == 1) {
                intersectionPointSubject = endPoint;
                edgeIndex = edgeInfo.clipEdgeEnd;
            };
            if (intersectionPointSubject != null) {
                var distX = intersectionPointSubject.x - subjectList[i].x;
                var distY = intersectionPointSubject.y - subjectList[i].y;
                var squareDist = distX * distX + distY * distY;
                intersectionPointSubject.squareDist = squareDist;
                var insertAfter = subjectList[i];
                var insertBefore = insertAfter.next;
                while (insertBefore.squareDist != null) {
                    if (insertBefore.squareDist >= squareDist) {
                        break;
                    };
                    insertAfter = insertBefore;
                    insertBefore = insertAfter.next;
                };
                insertAfter.next = intersectionPointSubject;
                intersectionPointSubject.next = insertBefore;
                intersectionPointClip = {
                    x: intersectionPointSubject.x,
                    y: intersectionPointSubject.y
                };
                distX = intersectionPointClip.x - clipList[edgeIndex].x;
                distY = intersectionPointClip.y - clipList[edgeIndex].y;
                squareDist = distX * distX + distY * distY;
                intersectionPointClip.squareDist = squareDist;
                intersectionPointSubject.link = intersectionPointClip;
                intersectionPointClip.link = intersectionPointSubject;
                insertAfter = clipList[edgeIndex];
                insertBefore = insertAfter.next;
                while (insertBefore.squareDist != null) {
                    if (insertBefore.squareDist >= squareDist) {
                        break;
                    };
                    insertAfter = insertBefore;
                    insertBefore = insertAfter.next;
                };
                insertAfter.next = intersectionPointClip;
                intersectionPointClip.next = insertBefore;
            }
        }
    };
    var retVal = [];
    var enteringCount = enteringList.length;
    if (enteringCount == 0) {
        if (lineInside) {
            retVal.push(clockwiseCoordinates);
        } else {
            var checkX = (bounds.minX + bounds.maxX) / 2;
            var checkY = (bounds.minY + bounds.maxY) / 2;
            if (CoordUtil.isPointInPoly(checkX, checkY, clockwiseCoordinates)) {
                retVal.push([bounds.minX, bounds.maxY, bounds.maxX, bounds.maxY, bounds.maxX, bounds.minY, bounds.minX, bounds.minY]);
            }
        }
    } else {
        while (true) {
            for (var index = 0; index < enteringCount;
                ++index) {
                if (!enteringList[index].deleted) {
                    break;
                }
            };
            if (index == enteringCount) {
                break;
            };
            var poly = [];
            startPoint = enteringList[index];
            poly.push(startPoint.x);
            poly.push(startPoint.y);
            startPoint.deleted = true;
            var point = startPoint.next;
            while (point != startPoint && point.link != startPoint) {
                poly.push(point.x);
                poly.push(point.y);
                if (point.squareDist != null) {
                    point.deleted = true;
                    point.link.deleted = true;
                    point = point.link;
                };
                point = point.next;
            };
            retVal.push(poly);
        }
    };
    return retVal;
};
qxp.Class.usePTVZoomLevels = function(minLevel, maxLevel) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    if (minLevel == null) {
        minLevel = 0;
    };
    if (maxLevel == null) {
        maxLevel = 23;
    };
    CoordUtil.ZOOM_LEVEL_COUNT = maxLevel - minLevel + 1;
    CoordUtil.ZOOM_LEVEL_FACTOR = 1.5874;
    CoordUtil.ZOOM_LOG_LEVEL_FACTOR = Math.log(CoordUtil.ZOOM_LEVEL_FACTOR);
    CoordUtil.ZOOM_MAX_TILE_WIDTH = 1040384 / Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, 23 - maxLevel);
    CoordUtil.ZOOM_BASE = CoordUtil.ZOOM_MAX_TILE_WIDTH / Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, CoordUtil.ZOOM_LEVEL_COUNT - 1);
    CoordUtil.TILE_WIDTHS = [];
    for (var i = 0; i < CoordUtil.ZOOM_LEVEL_COUNT; i++) {
        CoordUtil.TILE_WIDTHS.push(CoordUtil.getTileWidth(i));
    }
};
qxp.Class.useGoogleZoomLevels = function(minLevel, maxLevel) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    if (minLevel == null) {
        minLevel = 0;
    };
    if (maxLevel == null) {
        maxLevel = 19;
    };
    var geo1 = {
        x: 0,
        y: 0
    };
    var geo2 = {
        x: 4500000,
        y: 0
    };
    var su1 = CoordUtil.mercator2SmartUnit(CoordUtil.geoDecimal2Mercator(geo1));
    var su2 = CoordUtil.mercator2SmartUnit(CoordUtil.geoDecimal2Mercator(geo2));
    var suPerDegree = (su2.x - su1.x) / 45;
    CoordUtil.ZOOM_LEVEL_COUNT = maxLevel - minLevel + 1;
    CoordUtil.ZOOM_LEVEL_FACTOR = 2;
    CoordUtil.ZOOM_LOG_LEVEL_FACTOR = Math.log(CoordUtil.ZOOM_LEVEL_FACTOR);
    var tileFactor = CoordUtil.TILE_WIDTH / 256.0;
    CoordUtil.ZOOM_MAX_TILE_WIDTH = 360.0 * suPerDegree * tileFactor / Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, 19 - maxLevel);
    CoordUtil.ZOOM_BASE = CoordUtil.ZOOM_MAX_TILE_WIDTH / Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, CoordUtil.ZOOM_LEVEL_COUNT - 1);
    CoordUtil.TILE_WIDTHS = [];
    for (var i = 0; i < CoordUtil.ZOOM_LEVEL_COUNT;
        ++i) {
        CoordUtil.TILE_WIDTHS.push(CoordUtil.getTileWidth(i));
    }
};
qxp.Class.ZOOM_LEVEL_COUNT = null;
qxp.Class.ZOOM_MAX_TILE_WIDTH = null;
qxp.Class.ZOOM_LEVEL_FACTOR = null;
qxp.Class.ZOOM_LOG_LEVEL_FACTOR = null;
qxp.Class.ZOOM_BASE = null;
qxp.Class.TILE_WIDTHS = null;
qxp.Class.SMART_UNIT = 4.809543;
qxp.Class.SMART_OFFSET = 20015087;
qxp.Class.TILE_WIDTH = 256;
qxp.Class.MERC_2_GEO_X_HELPER = 18000 / (6371 * Math.PI);
qxp.Class.MERC_2_GEO_Y_HELPER = 36000000 / Math.PI;
qxp.Class.GEO_2_MERC_X_HELPER = 63.71 * (Math.PI / 180);
qxp.Class.GEO_2_MERC_Y_HELPER = Math.PI * (0.5 / 18000000);
qxp.Class.usePTVZoomLevels();




/* ID: com.ptvag.webcomponent.map.layer.Layer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.Layer", qxp.core.Target, function() {
    qxp.core.Target.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mInitialized = false;
    self._checkNeedsOpacityHack = function(propValue) {
        if (propValue && qxp.sys.Client.getInstance().isMshtml() && !com.ptvag.webcomponent.map.Map.IE_FAST_OPACITY) {
            return true;
        };
        return false;
    };
    self._modifyEnabled = function(propValue) {
        var parentElem = self.getParentElement();
        if (parentElem) {
            parentElem.style.display = propValue ? "" : "none";
        };
        if (propValue && self.isInitialized()) {
            self.onViewChanged({
                zoomChanged: true,
                centerChanged: true,
                widthChanged: true,
                heightChanged: true
            }, true);
        }
    };
    self._modifyParentElement = function(propValue) {
        if (propValue && !self.isEnabled()) {
            propValue.style.display = "none";
        }
    };
    self.init = function() {
        mInitialized = true;
    };
    self.isInitialized = function() {
        return mInitialized;
    };
    self.onViewChanged = function(evt, immediately) {};
    self.onMouseDown = function(evt) {
        return false;
    };
    self.onMouseUp = function(evt) {
        return false;
    };
    self.onMouseClick = function(evt) {
        return self.getSwallowClickEvents();
    };
    self.onRightMouseClick = function(evt) {
        return self.getSwallowClickEvents();
    };
    self.onMouseDblClick = function(evt) {
        return false;
    };
    self.onRightMouseDblClick = function(evt) {
        return false;
    };
    self.onMouseMove = function(evt) {
        return false;
    };
    self.onMouseOut = function(evt) {
        return false;
    };
    self.onMouseWheel = function(evt) {
        return false;
    };
    self.onMouseHover = function(evt) {
        return self.getSwallowHoverEvents();
    };
    self.onKeyDown = function(evt) {
        return false;
    };
    self.onSelectStart = function(evt) {
        return false;
    };
    self.isNoLayerActive = function() {
        return self.getMap().getController().getActiveLayer() == null;
    };
    self.print = function(ctx, htmlContainer, htmlBackground) {
        if (self.getIncludeInPrint() && self.isEnabled() && self.isInitialized()) {
            self.doPrint(ctx, htmlContainer, htmlBackground);
        }
    };
    self.doPrint = function(ctx, htmlContainer, htmlBackground) {};
});
qxp.OO.addProperty({
    name: "name",
    type: qxp.constant.Type.STRING,
    allowNull: true
});
qxp.OO.addProperty({
    name: "map",
    type: qxp.constant.Type.OBJECT,
    allowNull: false
});
qxp.OO.addProperty({
    name: "parentElement",
    type: qxp.constant.Type.OBJECT,
    allowNull: false
});
qxp.OO.addProperty({
    name: "enabled",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    getAlias: "isEnabled"
});
qxp.OO.addProperty({
    name: "swallowHoverEvents",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "swallowClickEvents",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "isRelative",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false,
    getAlias: "isRelative"
});
qxp.OO.addProperty({
    name: "needsOpacityHack",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false,
    getAlias: "needsOpacityHack"
});
qxp.OO.addProperty({
    name: "includeInPrint",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});




/* ID: com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer", com.ptvag.webcomponent.map.layer.Layer, function() {
    com.ptvag.webcomponent.map.layer.Layer.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mAppliedRotationAngle = 0;
    self._modifyAreaElement = function() {
        updateView({}, true);
        self._modifyAreaOpacity(self.getAreaOpacity());
    };
    self._modifyComputedAreaLeft = function(propValue) {
        if (self.needsOpacityHack()) {
            self.getAreaElement().style.left = propValue + map.Map.OPACITY_HACK_SIZE / 2 + "px";
        } else {
            self.getParentElement().style.left = propValue + "px";
        }
    };
    self._modifyComputedAreaTop = function(propValue) {
        if (self.needsOpacityHack()) {
            self.getAreaElement().style.top = propValue + map.Map.OPACITY_HACK_SIZE / 2 + "px";
        } else {
            self.getParentElement().style.top = propValue + "px";
        }
    };
    self._modifyComputedAreaWidth = function(propValue) {
        var width = map.MapUtil.isBorderBoxSizingActive() ? propValue : propValue - 2 * self.getAreaBorderWidth();
        if (self.getParentElement() != self.getAreaElement() && !self.needsOpacityHack()) {
            self.getParentElement().style.width = propValue + "px";
        };
        self.getAreaElement().style.width = width + "px";
    };
    self._modifyComputedAreaHeight = function(propValue) {
        var height = map.MapUtil.isBorderBoxSizingActive() ? propValue : propValue - 2 * self.getAreaBorderWidth();
        if (self.getParentElement() != self.getAreaElement() && !self.needsOpacityHack()) {
            self.getParentElement().style.height = propValue + "px";
        };
        self.getAreaElement().style.height = height + "px";
    };
    self._modifyAreaOpacity = function(propValue) {
        if (self.needsOpacityHack()) {
            var parentElement = self.getParentElement();
            if (parentElement) {
                map.MapUtil.setElementOpacity(parentElement, propValue);
            }
        } else {
            var areaElement = self.getAreaElement();
            if (areaElement) {
                map.MapUtil.setElementOpacity(areaElement, propValue);
            }
        }
    };
    var updateView = function(evt, forcePositionUpdate) {
        var areaElement = self.getAreaElement();
        if (areaElement == null) {
            return;
        };
        var oldRotationAngle = mAppliedRotationAngle;
        mAppliedRotationAngle = (self.getAutoRotate() ? self.getMap().getVisibleRotation() : 0);
        var needRotationResize = (oldRotationAngle != mAppliedRotationAngle && (oldRotationAngle == 0 || mAppliedRotationAngle == 0));
        var newPosition = false;
        if ((evt.widthChanged || evt.heightChanged) && (self.getAreaRight() != null || self.getAreaBottom() != null || self.getAreaWidthIsRelative() || self.getAreaHeightIsRelative()) || needRotationResize || forcePositionUpdate) {
            self.positionArea();
            newPosition = true;
        };
        if (newPosition || oldRotationAngle != mAppliedRotationAngle) {
            if (oldRotationAngle != mAppliedRotationAngle && mAppliedRotationAngle == 0) {
                map.MapUtil.resetAffineTransform(areaElement);
            } else if (mAppliedRotationAngle != 0) {
                var matrix = map.MapUtil.createRotationMatrix(mAppliedRotationAngle, self.getComputedAreaWidth() / 2, self.getComputedAreaHeight() / 2);
                map.MapUtil.setAffineTransform(areaElement, matrix);
            }
        }
    };
    var superOnViewChanged = self.onViewChanged;
    self.onViewChanged = function(evt) {
        superOnViewChanged.apply(self, arguments);
        updateView(evt);
    };
    var areaModifier = function() {
        updateView({}, true);
    };
    self._modifyAreaLeft = areaModifier;
    self._modifyAreaRight = areaModifier;
    self._modifyAreaTop = areaModifier;
    self._modifyAreaBottom = areaModifier;
    self._modifyAreaWidth = areaModifier;
    self._modifyAreaHeight = areaModifier;
    self._modifyAutoRotate = function() {
        if (self.getAreaElement() != null) {
            self.onViewChanged({
                rotationChanged: true
            });
        }
    };
    self.positionArea = function() {
        if (self.getAreaElement() == null) {
            return;
        };
        var mapWidth = self.getMap().getWidth();
        var mapHeight = self.getMap().getHeight();
        var areaElem = self.getAreaElement();
        var areaLeft = self.getAreaLeft();
        var areaRight = self.getAreaRight();
        var areaTop = self.getAreaTop();
        var areaBottom = self.getAreaBottom();
        var areaWidth = (areaLeft != null && areaRight != null) ? (mapWidth - areaLeft - areaRight) : (self.getAreaWidthIsRelative() ? parseInt(self.getAreaWidth() * mapWidth) : self.getAreaWidth());
        var areaHeight = (areaTop != null && areaBottom != null) ? (mapHeight - areaTop - areaBottom) : (self.getAreaHeightIsRelative() ? parseInt(self.getAreaHeight() * mapHeight) : self.getAreaHeight());
        if (areaLeft == null) {
            areaLeft = mapWidth - areaWidth - areaRight;
        };
        if (areaTop == null) {
            areaTop = mapHeight - areaHeight - areaBottom;
        };
        if (mAppliedRotationAngle != 0) {
            var max = Math.max(areaWidth, areaHeight);
            var min = Math.min(areaWidth, areaHeight);
            var sizeNeeded = (max * max + min * min) / max;
            var paddingX = Math.ceil((sizeNeeded - areaWidth) / 2);
            var paddingY = Math.ceil((sizeNeeded - areaHeight) / 2);
            areaLeft -= paddingX;
            areaTop -= paddingY;
            areaWidth += paddingX * 2;
            areaHeight += paddingY * 2;
        };
        self.setComputedAreaLeft(areaLeft);
        self.setComputedAreaTop(areaTop);
        self.setComputedAreaWidth(areaWidth);
        self.setComputedAreaHeight(areaHeight);
    };
    self.isPositionInArea = function(x, y) {
        var left = self.getComputedAreaLeft();
        var top = self.getComputedAreaTop();
        return (x >= left && y >= top && x < left + self.getComputedAreaWidth() && y < top + self.getComputedAreaHeight());
    };
    self.onMouseMove = function(evt) {
        if (self.getUseBlending()) {
            var left = self.getComputedAreaLeft();
            var top = self.getComputedAreaTop();
            var width = self.getComputedAreaWidth();
            var height = self.getComputedAreaHeight();
            var blendingWidth = self.getBlendingWidth();
            if (self.isNoLayerActive() && evt.relMouseX >= left - blendingWidth && evt.relMouseX <= left + width + blendingWidth && evt.relMouseY >= top - blendingWidth && evt.relMouseY <= top + height + blendingWidth) {
                var mapWidth = self.getMap().getWidth();
                var mapHeight = self.getMap().getHeight();
                var blendFactorX = 1;
                if (evt.relMouseX < left) {
                    blendFactorX = 1 - (left - evt.relMouseX) / Math.min(left, blendingWidth);
                } else if (evt.relMouseX > left + width) {
                    var right = mapWidth - left - width;
                    blendFactorX = 1 - (evt.relMouseX - left - width) / Math.min(right, blendingWidth);
                };
                var blendFactorY = 1;
                if (evt.relMouseY < top) {
                    blendFactorY = 1 - (top - evt.relMouseY) / Math.min(top, blendingWidth);
                } else if (evt.relMouseY > top + height) {
                    var bottom = mapHeight - top - height;
                    blendFactorY = 1 - (evt.relMouseY - top - height) / Math.min(bottom, blendingWidth);
                };
                var blendFactor = Math.min(blendFactorX, blendFactorY);
                var transOut = self.getBlendingOpacityOut();
                var transOver = self.getBlendingOpacityOver();
                self.setAreaOpacity(transOut + (transOver - transOut) * blendFactor);
            } else {
                self.setAreaOpacity(self.getBlendingOpacityOut());
            }
        };
        return false;
    };
    self.onMouseOut = function(evt) {
        if (self.getUseBlending()) {
            self.setAreaOpacity(self.getBlendingOpacityOut());
        };
        return false;
    };
    self.onMouseHover = function(evt) {
        return self.getSwallowHoverEvents() && self.isPositionInArea(evt.relMouseX, evt.relMouseY);
    };
    self.onMouseClick = function(evt) {
        return self.getSwallowClickEvents() && self.isPositionInArea(evt.relMouseX, evt.relMouseY);
    };
    self.onRightMouseClick = function(evt) {
        return self.getSwallowClickEvents() && self.isPositionInArea(evt.relMouseX, evt.relMouseY);
    };
    self.onMouseDblClick = function(evt) {
        return self.isPositionInArea(evt.relMouseX, evt.relMouseY);
    };
    self.doPrint = function(ctx, htmlContainer, htmlBackground) {
        ctx.setClipRect(self.getComputedAreaLeft(), self.getComputedAreaTop(), self.getComputedAreaWidth(), self.getComputedAreaHeight());
        ctx.globalAlpha = self.getAreaOpacity();
        if (self.getAutoRotate()) {
            var rotationAngle = self.getMap().getVisibleRotation();
            var matrix = map.MapUtil.createRotationMatrix(rotationAngle, self.getComputedAreaWidth() / 2 + self.getComputedAreaLeft(), self.getComputedAreaHeight() / 2 + self.getComputedAreaTop());
            ctx.save();
            ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        };
        self.doPrintStaticArea(ctx, htmlContainer, htmlBackground);
        if (self.getAutoRotate()) {
            ctx.restore();
        };
        ctx.globalAlpha = 1;
        ctx.clearClipRect();
    };
    self.doPrintStaticArea = function(ctx, htmlContainer, htmlBackground) {};
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        self.forceAreaElement(null);
        superDispose.call(self);
    };
});
qxp.OO.addProperty({
    name: "areaElement",
    type: qxp.constant.Type.OBJECT
});
qxp.OO.addProperty({
    name: "areaBorderWidth",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "areaWidth",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "areaWidthIsRelative",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false,
    allowNull: false
});
qxp.OO.addProperty({
    name: "areaHeight",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "areaHeightIsRelative",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false,
    allowNull: false
});
qxp.OO.addProperty({
    name: "areaLeft",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "areaRight",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "areaTop",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "areaBottom",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "computedAreaLeft",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "computedAreaTop",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "computedAreaWidth",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "computedAreaHeight",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "useBlending",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "blendingWidth",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 25
});
qxp.OO.addProperty({
    name: "blendingOpacityOver",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.8
});
qxp.OO.addProperty({
    name: "blendingOpacityOut",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.3
});
qxp.OO.addProperty({
    name: "areaOpacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.3
});
qxp.OO.addProperty({
    name: "autoRotate",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});




/* ID: com.ptvag.webcomponent.map.layer.ToolbarLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.ToolbarLayer", com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer, function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mButtonDiv;
    var mBgPadding = 3;
    var mLastButtonOverId;
    var mElements = [];
    var mElementHash = {};
    var mNextId = 1;
    var mUpdateTimer;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        self.getParentElement().style.cursor = "default";
        var areaDiv = document.createElement("div");
        areaDiv.style.position = "absolute";
        areaDiv.style.left = "0px";
        areaDiv.style.top = "0px";
        areaDiv.style.border = self.getAreaBorderWidth() + "px solid gray";
        areaDiv.style.backgroundColor = "white";
        self.getParentElement().appendChild(areaDiv);
        mButtonDiv = document.createElement("div");
        mButtonDiv.style.position = "absolute";
        mButtonDiv.style.left = mBgPadding + "px";
        mButtonDiv.style.top = mBgPadding + "px";
        mButtonDiv.style.lineHeight = "1px";
        self.getParentElement().appendChild(mButtonDiv);
        self.setAreaElement(areaDiv);
        areaDiv.style.visibility = "hidden";
        update();
    };
    var recalculate = function() {
        mUpdateTimer = null;
        if (mButtonDiv == null) {
            return;
        };
        var alreadyPresentButtons = {};
        var children = mButtonDiv.childNodes;
        var childCount = children.length;
        for (var i = 0; i < childCount;
            ++i) {
            var child = children[i];
            var id = child._id;
            if (mElementHash[id] == null || mElementHash[id].divElem != child) {
                child._clickHandler = null;
                child.parentNode.removeChild(child);
                --i;
                --childCount;
            } else {
                alreadyPresentButtons[id] = id;
            }
        };
        var offset = 0;
        var maxHeight = 0;
        var elementCount = mElements.length;
        for (i = 0; i < elementCount;
            ++i) {
            var element = mElements[i];
            if (element.imgUrl) {
                element.divElem.style.left = offset + "px";
                if (element.height > maxHeight) {
                    maxHeight = element.height;
                };
                if (alreadyPresentButtons[element.id] == null) {
                    mButtonDiv.appendChild(element.divElem);
                }
            };
            offset += element.width;
        };
        self.setAreaWidth(offset + 2 * mBgPadding);
        self.setAreaHeight(maxHeight + 2 * mBgPadding);
        self.getAreaElement().style.visibility = "";
        self.positionArea();
    };
    var update = function() {
        if (mUpdateTimer == null) {
            mUpdateTimer = window.setTimeout(recalculate, 0);
        }
    };
    self.addElement = function(elementData, insertBefore) {
        var id = elementData.id;
        if (id == null) {
            do {
                id = "element-" + mNextId;
                mNextId++;
            } while (mElementHash[id] != null);
            elementData.id = id;
        };
        if (mElementHash[id] != null) {
            throw new Error("Adding toolbar element failed. Id '" + id + "' is already in use.");
        };
        mElementHash[id] = elementData;
        var elementAdded = false;
        if (insertBefore != null) {
            var elementCount = mElements.length;
            for (var i = 0; i < elementCount;
                ++i) {
                if (mElements[i].id == insertBefore) {
                    mElements.splice(i, 0, elementData);
                    elementAdded = true;
                    break;
                }
            }
        };
        if (!elementAdded) {
            mElements.push(elementData);
        };
        if (elementData.imgUrl == null) {
            if (elementData.width == null) {
                elementData.width = map.ToolbarLayer.SPACING_WIDTH;
            }
        } else {
            var imgElem = document.createElement("img");
            imgElem.style.width = elementData.width + "px";
            imgElem.style.height = elementData.height + "px";
            var imgDivElem = document.createElement("div");
            imgDivElem.style.position = "absolute";
            imgDivElem.style.width = elementData.width + "px";
            imgDivElem.style.height = elementData.height + "px";
            imgDivElem.style.top = "0px";
            imgDivElem._clickHandler = elementData.clickHandler;
            imgDivElem._id = id;
            imgDivElem.appendChild(imgElem);
            elementData.divElem = imgDivElem;
            self.setButtonEnabled(id, (elementData.enabled == null || elementData.enabled != false));
            self.setButtonImage(id, elementData.imgUrl);
            self.setButtonTooltip(id, elementData.tooltip);
        };
        update();
        return id;
    };
    self.removeElement = function(id) {
        var elementData = mElementHash[id];
        if (elementData != null) {
            elementData.divElem = null;
            delete mElementHash[id];
            var elementCount = mElements.length;
            for (var i = 0; i < elementCount;
                ++i) {
                if (mElements[i] == elementData) {
                    mElements.splice(i, 1);
                    break;
                }
            };
            update();
        };
        return elementData;
    };
    self.getElementIds = function() {
        var elementCount = mElements.length;
        var retVal = new Array(elementCount);
        for (var i = 0; i < elementCount;
            ++i) {
            retVal[i] = mElements[i].id;
        };
        return retVal;
    };
    self.elementExists = function(elementId) {
        return mElementHash[elementId] != null;
    };
    self.setButtonImage = function(buttonId, imgUrl) {
        var buttonData = mElementHash[buttonId];
        var imgElem = buttonData.divElem.firstChild;
        map.MapUtil.setImageSource(imgElem, imgUrl);
        buttonData.imgUrl = imgUrl;
    };
    self.setButtonTooltip = function(buttonId, tooltip) {
        var buttonData = mElementHash[buttonId];
        var imgElem = buttonData.divElem.firstChild;
        if (tooltip == null) {
            imgElem.removeAttribute("title");
        } else {
            imgElem.setAttribute("title", tooltip);
        };
        buttonData.tooltip = tooltip;
    };
    self.setButtonEnabled = function(buttonId, enabled) {
        var buttonData = mElementHash[buttonId];
        if (enabled) {
            if (mLastButtonOverId == buttonId) {
                map.MapUtil.setElementOpacity(buttonData.divElem, self.getButtonOpacityOver());
            } else {
                map.MapUtil.setElementOpacity(buttonData.divElem, self.getButtonOpacityOut());
            }
        } else {
            map.MapUtil.setElementOpacity(buttonData.divElem, self.getButtonOpacityDisabled());
        };
        buttonData.enabled = enabled;
    };
    self.onMouseDown = function(evt) {
        return getButtonAt(evt.relMouseX, evt.relMouseY) != null;
    };
    var superOnMouseUp = self.onMouseUp;
    self.onMouseUp = function(evt) {
        superOnMouseUp(evt);
        if (self.isNoLayerActive()) {
            var buttonId = getButtonAt(evt.relMouseX, evt.relMouseY);
            if (buttonId != null) {
                var buttonData = mElementHash[buttonId];
                if (buttonData.enabled) {
                    buttonData.divElem._clickHandler();
                    return true;
                }
            }
        };
        return false;
    };
    var superOnMouseMove = self.onMouseMove;
    self.onMouseMove = function(evt) {
        superOnMouseMove(evt);
        if (self.isNoLayerActive()) {
            setButtonOver(getButtonAt(evt.relMouseX, evt.relMouseY));
        };
        return false;
    };
    var superOnMouseOut = self.onMouseOut;
    self.onMouseOut = function(evt) {
        superOnMouseOut(evt);
        setButtonOver(null);
        return false;
    };
    var getButtonAt = function(x, y) {
        var areaLeft = self.getComputedAreaLeft();
        var areaTop = self.getComputedAreaTop();
        if (x >= areaLeft && x < areaLeft + self.getComputedAreaWidth() && y >= areaTop && y < areaTop + self.getComputedAreaHeight()) {
            var relX = x - areaLeft - mBgPadding;
            var buttonArr = mButtonDiv.childNodes;
            for (var i = 0; i < buttonArr.length; i++) {
                var btLeft = buttonArr[i].offsetLeft;
                var btWidth = buttonArr[i].offsetWidth;
                if (relX >= btLeft && relX < btLeft + btWidth) {
                    return buttonArr[i]._id;
                }
            }
        };
        return null;
    };
    var setButtonOver = function(buttonId) {
        if (buttonId != mLastButtonOverId) {
            if (mLastButtonOverId != null) {
                var lastButtonData = mElementHash[mLastButtonOverId];
                if (lastButtonData.enabled) {
                    map.MapUtil.setElementOpacity(lastButtonData.divElem, self.getButtonOpacityOut());
                }
            };
            if (buttonId != null) {
                var newButtonData = mElementHash[buttonId];
                if (newButtonData.enabled) {
                    map.MapUtil.setElementOpacity(newButtonData.divElem, self.getButtonOpacityOver());
                }
            };
            mLastButtonOverId = buttonId;
        }
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        var children = mButtonDiv.childNodes;
        var childCount = children.length;
        for (var i = 0; i < childCount;
            ++i) {
            children[i]._clickHandler = null;
        };
        var elementCount = mElements.length;
        var element;
        for (i = 0; i < elementCount;
            ++i) {
            element = mElements[i];
            if (element.divElem) {
                element.divElem._clickHandler = null;
                element.divElem = null;
            }
        };
        mButtonDiv = null;
        superDispose.call(self);
    };
    var init = function() {
        self.setAreaWidth(2 * mBgPadding);
        self.setAreaHeight(2 * mBgPadding);
        self.setAreaBorderWidth(1);
    };
    init();
});
qxp.Class.SPACING_WIDTH = 10;
qxp.OO.changeProperty({
    name: "useBlending",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: true
});
qxp.OO.changeProperty({
    name: "areaBorderWidth",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1
});
qxp.OO.addProperty({
    name: "buttonOpacityOver",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.6
});
qxp.OO.addProperty({
    name: "buttonOpacityOut",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.35
});
qxp.OO.addProperty({
    name: "buttonOpacityDisabled",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.15
});




/* ID: com.ptvag.webcomponent.map.layer.DefaultToolbarLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.DefaultToolbarLayer", com.ptvag.webcomponent.map.layer.ToolbarLayer, function() {
    com.ptvag.webcomponent.map.layer.ToolbarLayer.apply(this, arguments);
    var self = this;
    var mapPackage = com.ptvag.webcomponent.map;
    var clazz = mapPackage.layer.DefaultToolbarLayer;
    var rewriteURL = mapPackage.MapUtil.rewriteURL;
    var mZoomInEnabled;
    var mZoomOutEnabled;
    var mHistoryBackEnabled;
    var mHistoryForwardEnabled;
    var mAlphaImgExt = qxp.sys.Client.getInstance().isMshtml() ? "_noalpha.gif" : ".png";
    var getImageURL = function(imageName) {
        return mapPackage.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/" + imageName, true);
    };
    var addButton = function(id, imageName, tooltip, handler, enabled) {
        var buttonData = {
            imgUrl: getImageURL(imageName),
            width: 17,
            height: 17,
            tooltip: tooltip,
            id: id,
            clickHandler: handler,
            enabled: (enabled == null ? true : enabled)
        };
        self.addElement(buttonData);
    };
    var setZoomEnabledVars = function(zoom) {
        mZoomInEnabled = (zoom > 0);
        mZoomOutEnabled = (zoom < mapPackage.CoordUtil.ZOOM_LEVEL_COUNT - 1);
    };
    var setHistoryEnabledVars = function() {
        var map = self.getMap();
        mHistoryBackEnabled = map.hasHistoryBack();
        mHistoryForwardEnabled = map.hasHistoryForward();
    };
    var zoomChanged = function(evt) {
        var zoom = evt.getData();
        zoomInEnabled = mZoomInEnabled;
        zoomOutEnabled = mZoomOutEnabled;
        setZoomEnabledVars(zoom);
        if (zoomInEnabled != mZoomInEnabled && self.elementExists("zoom-in")) {
            self.setButtonEnabled("zoom-in", mZoomInEnabled);
        };
        if (zoomOutEnabled != mZoomOutEnabled && self.elementExists("zoom-out")) {
            self.setButtonEnabled("zoom-out", mZoomOutEnabled);
        }
    };
    var historyChanged = function() {
        var historyBackEnabled = mHistoryBackEnabled;
        var historyForwardEnabled = mHistoryForwardEnabled;
        setHistoryEnabledVars();
        if (historyBackEnabled != mHistoryBackEnabled && self.elementExists("history-back")) {
            self.setButtonEnabled("history-back", mHistoryBackEnabled);
        };
        if (historyForwardEnabled != mHistoryForwardEnabled && self.elementExists("history-forward")) {
            self.setButtonEnabled("history-forward", mHistoryForwardEnabled);
        }
    };
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        var map = self.getMap();
        var inverseWheelZoom = map.getInverseWheelZoom();
        var zoom = map.getZoom();
        setZoomEnabledVars(map.getZoom());
        setHistoryEnabledVars();
        addButton("zoom-out", "button_zoom_out.gif", "Zoom out", self.zoomOut, mZoomOutEnabled);
        self.addElement({
            width: 2,
            id: "spacing-between-zoom"
        });
        addButton("zoom-in", "button_zoom_in.gif", "Zoom in", self.zoomIn, mZoomInEnabled);
        self.addElement({
            width: 7,
            id: "spacing-after-zoom"
        });
        addButton("zoom-mode", (mapPackage.MapController.DEFAULT_ACTION_MODE == mapPackage.MapController.ACTION_MODE_ZOOM ? "button_zoom_mode_highlight" : "button_zoom_mode") + mAlphaImgExt, "Switch to zoom mode", self.switchToZoomMode);
        self.addElement({
            width: 2,
            id: "spacing-between-mode"
        });
        addButton("move-mode", (mapPackage.MapController.DEFAULT_ACTION_MODE == mapPackage.MapController.ACTION_MODE_MOVE ? "button_move_mode_highlight.gif" : "button_move_mode.gif"), "Switch to move mode", self.switchToMoveMode);
        self.addElement({
            width: 7,
            id: "spacing-after-mode"
        });
        var overviewLayer = map.getLayer("overview");
        addButton("overview", (overviewLayer && overviewLayer.isEnabled() ? "button_overview_highlight.gif" : "button_overview.gif"), "Show or hide the overview map", self.toggleOverview);
        self.addElement({
            width: 7,
            id: "spacing-after-overview"
        });
        addButton("map-view", "button_map_view_highlight.gif", "Switch to standard map view", self.switchToPlainView);
        self.addElement({
            width: 2,
            id: "spacing-between-view-1"
        });
        addButton("hybrid-view", "button_hybrid_view.gif", "Switch to hybrid view", self.switchToHybridView);
        self.addElement({
            width: 2,
            id: "spacing-between-view-2"
        });
        addButton("aerial-view", "button_aerial_view.gif", "Switch to aerial view", self.switchToAerialView);
        self.addElement({
            width: 7,
            id: "spacing-after-view"
        });
        var measurementLayer = map.getLayer("measurement");
        addButton("measurement", (measurementLayer && measurementLayer.isEnabled() ? "button_measurement_highlight.gif" : "button_measurement.gif"), "Distance measurement tool", self.toggleMeasurement);
        if (mapPackage.Map.ADDRESS_LOOKUP_ENABLED) {
            self.addElement({
                width: 2,
                id: "spacing-after-measurement"
            });
            var addressLookupLayer = map.getLayer("addresslookup");
            addButton("address-lookup", (addressLookupLayer && addressLookupLayer.isEnabled() ? "button_address_lookup_highlight.gif" : "button_address_lookup.gif"), "Address lookup tool", self.toggleAddressLookup);
        };
        self.addElement({
            width: 7,
            id: "spacing-after-address-lookup"
        });
        addButton("reset", "button_reset.gif", "Reset map view", self.resetMapRect);
        self.addElement({
            width: 7,
            id: "spacing-after-reset"
        });
        addButton("history-back", "button_history_back.gif", "Move one step back in history", self.historyBack, mHistoryBackEnabled);
        self.addElement({
            width: 2,
            id: "spacing-between-history"
        });
        addButton("history-forward", "button_history_forward.gif", "Move one step forward in history", self.historyForward, mHistoryForwardEnabled);
        map.addEventListener("changeZoom", zoomChanged);
        map.addEventListener("historyChanged", historyChanged);
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        var map = self.getMap();
        map.removeEventListener("changeZoom", zoomChanged);
        map.removeEventListener("historyChanged", historyChanged);
        superDispose.call(self);
    };
    self.zoomIn = function() {
        var map = self.getMap();
        map.startLoggingAction("user:buttonZoomIn");
        try {
            clazz.zoomIn(map);
        } finally {
            map.endLoggingAction();
        }
    };
    self.zoomOut = function() {
        var map = self.getMap();
        map.startLoggingAction("user:buttonZoomOut");
        try {
            clazz.zoomOut(map);
        } finally {
            map.endLoggingAction();
        }
    };
    self.switchToZoomMode = function() {
        var map = self.getMap();
        if (map.getController().getActionMode() != mapPackage.MapController.ACTION_MODE_ZOOM) {
            self.setButtonImage("move-mode", getImageURL("button_move_mode.gif"));
            self.setButtonImage("zoom-mode", getImageURL("button_zoom_mode_highlight" + mAlphaImgExt));
            clazz.switchToZoomMode(map);
        }
    };
    self.switchToMoveMode = function() {
        var map = self.getMap();
        if (map.getController().getActionMode() != mapPackage.MapController.ACTION_MODE_MOVE) {
            self.setButtonImage("move-mode", getImageURL("button_move_mode_highlight.gif"));
            self.setButtonImage("zoom-mode", getImageURL("button_zoom_mode" + mAlphaImgExt));
            clazz.switchToMoveMode(map);
        }
    };
    self.toggleOverview = function() {
        var map = self.getMap();
        clazz.toggleOverview(map);
        var overviewLayer = map.getLayer("overview");
        self.setButtonImage("overview", getImageURL(overviewLayer && overviewLayer.isEnabled() ? "button_overview_highlight.gif" : "button_overview.gif"));
    };
    self.switchToPlainView = function() {
        self.setButtonImage("map-view", getImageURL("button_map_view_highlight.gif"));
        self.setButtonImage("hybrid-view", getImageURL("button_hybrid_view.gif"));
        self.setButtonImage("aerial-view", getImageURL("button_aerial_view.gif"));
        clazz.switchToPlainView(self.getMap());
    };
    self.switchToHybridView = function() {
        self.setButtonImage("map-view", getImageURL("button_map_view.gif"));
        self.setButtonImage("hybrid-view", getImageURL("button_hybrid_view_highlight.gif"));
        self.setButtonImage("aerial-view", getImageURL("button_aerial_view.gif"));
        clazz.switchToHybridView(self.getMap());
    };
    self.switchToAerialView = function() {
        self.setButtonImage("map-view", getImageURL("button_map_view.gif"));
        self.setButtonImage("hybrid-view", getImageURL("button_hybrid_view.gif"));
        self.setButtonImage("aerial-view", getImageURL("button_aerial_view_highlight.gif"));
        clazz.switchToAerialView(self.getMap());
    };
    self.toggleMeasurement = function() {
        var map = self.getMap();
        var addressLookupLayer = map.getLayer("addresslookup");
        if (addressLookupLayer && addressLookupLayer.isEnabled()) {
            self.toggleAddressLookup();
        };
        clazz.toggleMeasurement(map);
        var measurementLayer = map.getLayer("measurement");
        self.setButtonImage("measurement", getImageURL(measurementLayer && measurementLayer.isEnabled() ? "button_measurement_highlight.gif" : "button_measurement.gif"));
    };
    self.toggleAddressLookup = function() {
        var map = self.getMap();
        var measurementLayer = map.getLayer("measurement");
        if (measurementLayer && measurementLayer.isEnabled()) {
            self.toggleMeasurement();
        };
        clazz.toggleAddressLookup(map);
        var addressLookupLayer = map.getLayer("addresslookup");
        self.setButtonImage("address-lookup", getImageURL(addressLookupLayer && addressLookupLayer.isEnabled() ? "button_address_lookup_highlight.gif" : "button_address_lookup.gif"));
    };
    self.resetMapRect = function() {
        clazz.resetMapRect(self.getMap());
    };
    self.historyBack = function() {
        clazz.historyBack(self.getMap());
    };
    self.historyForward = function() {
        clazz.historyForward(self.getMap());
    };
});
qxp.Class.zoomIn = function(map) {
    map.setZoom(map.getZoom() - 1);
};
qxp.Class.zoomOut = function(map) {
    map.setZoom(map.getZoom() + 1);
};
qxp.Class.switchToZoomMode = function(map) {
    map.getController().setActionMode(com.ptvag.webcomponent.map.MapController.ACTION_MODE_ZOOM);
};
qxp.Class.switchToMoveMode = function(map) {
    map.getController().setActionMode(com.ptvag.webcomponent.map.MapController.ACTION_MODE_MOVE);
};
qxp.Class.toggleOverview = function(map) {
    var overviewLayer = map.getLayer("overview");
    overviewLayer.setEnabled(!overviewLayer.isEnabled());
};
qxp.Class.switchToPlainView = function(map) {
    map.getLayer("sat").setEnabled(false);
    map.getLayer("label").setLayerOpacity(1);
};
qxp.Class.switchToHybridView = function(map) {
    var satLayer = map.getLayer("sat");
    satLayer.setEnabled(true);
    satLayer.setLayerOpacity(0.8);
    map.getLayer("label").setLayerOpacity(0.65);
};
qxp.Class.switchToAerialView = function(map) {
    var satLayer = map.getLayer("sat");
    satLayer.setEnabled(true);
    satLayer.setLayerOpacity(1);
    map.getLayer("label").setLayerOpacity(0.65);
};
qxp.Class.toggleMeasurement = function(map) {
    var measurementLayer = map.getLayer("measurement");
    if (measurementLayer) {
        if (measurementLayer.isEnabled()) {
            map.removeLayer("measurement");
        }
    } else {
        var floaterLayer = map.getLayer("floater");
        measurementLayer = new com.ptvag.webcomponent.map.layer.MeasurementLayer(floaterLayer);
        measurementLayer.setIncludeInPrint(true);
        measurementLayer.setIsRelative(true);
        map.addLayer(measurementLayer, "measurement", null, floaterLayer);
    }
};
qxp.Class.toggleAddressLookup = function(map) {
    var addressLookupLayer = map.getLayer("addresslookup");
    if (addressLookupLayer) {
        if (addressLookupLayer.isEnabled()) {
            map.removeLayer("addresslookup");
        }
    } else {
        var floaterLayer = map.getLayer("floater");
        addressLookupLayer = new com.ptvag.webcomponent.map.layer.AddressLookupLayer(floaterLayer);
        addressLookupLayer.setIncludeInPrint(true);
        addressLookupLayer.setIsRelative(true);
        map.addLayer(addressLookupLayer, "addresslookup", null, floaterLayer);
    }
};
qxp.Class.resetMapRect = function(map) {
    var resetRect = map.getResetRect();
    map.setRect(resetRect.left, resetRect.top, resetRect.right, resetRect.bottom, true);
};
qxp.Class.historyBack = function(map) {
    map.historyBack();
};
qxp.Class.historyForward = function(map) {
    map.historyForward();
};




/* ID: com.ptvag.webcomponent.map.MapController */
qxp.OO.defineClass("com.ptvag.webcomponent.map.MapController", qxp.core.Target, function(targetMap, mainElement, initEvents) {
    qxp.core.Target.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var DomUtils = com.ptvag.webcomponent.util.DomUtils;
    var EventUtils = com.ptvag.webcomponent.util.EventUtils;
    var mMap = targetMap;
    var mMainElement = mainElement;
    var mLastMouseX = mMap.getWidth() / 2;
    var mLastMouseY = mMap.getHeight() / 2;
    var mHoverTimeout = null;
    var mHoverEvent = null;
    var mIgnoreNextClick;
    var mRightClickTime = null;
    self.getLastMousePositon = function() {
        return {
            x: mLastMouseX,
            y: mLastMouseY
        };
    };
    var onHoverTimeout = function() {
        if (mHoverTimeout == null) {
            return;
        };
        mHoverTimeout = null;
        try {
            fireEventToLayers(mHoverEvent, "onMouseHover");
        } catch (exc) {
            self.error("handling mouse hover failed", exc);
        }
    };
    var cancelHoverTimeout = function() {
        if (mHoverTimeout != null) {
            window.clearTimeout(mHoverTimeout);
            mHoverTimeout = null;
        }
    };
    var setHoverTimeout = function() {
        if (mHoverTimeout != null) {
            window.clearTimeout(mHoverTimeout);
        };
        mHoverTimeout = window.setTimeout(onHoverTimeout, map.MapController.HOVER_TIMEOUT);
    };
    self.ignoreNextClick = function() {
        mIgnoreNextClick = true;
    };
    self.onComponentMouseDown = function(evt) {
        evt = EventUtils.getEvent(evt);
        cancelHoverTimeout();
        mIgnoreNextClick = false;
        map.MOUSE_BUTTON = EventUtils.getMouseButton(evt);
        var allowSelection = false;
        try {
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);
            fireEventToLayers(evt, "onMouseDown");
            var client = qxp.sys.Client.getInstance();
            if (client.isGecko() || client.isOpera() || client.isWebkit()) {
                allowSelection = fireEventToLayers(evt, "onSelectStart");
            };
            mLastMouseX = evt.relMouseX;
            mLastMouseY = evt.relMouseY;
        } catch (exc) {
            self.error("handling mouse down failed", exc);
        };
        if (evt.preventDefault && !allowSelection) {
            if (mMainElement.focus) {
                mMainElement.focus();
            };
            evt.preventDefault();
        };
        return allowSelection;
    };
    self.onComponentMouseUp = function(evt) {
        cancelHoverTimeout();
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);
            if (fireEventToLayers(evt, "onMouseUp")) {
                mIgnoreNextClick = true;
            }
        } catch (exc) {
            self.error("handling mouse up failed", exc);
        };
        if (map.MOUSE_BUTTON == EventUtils.MOUSE_BUTTON_LEFT) {
            onComponentMouseClick(evt);
        } else if (map.MOUSE_BUTTON == EventUtils.MOUSE_BUTTON_RIGHT) {
            onComponentMouseRightClick(evt);
        };
        mIgnoreNextClick = false;
        if (qxp.sys.Client.getInstance().isMobileSafari()) {
            mLastMouseX = null;
            onComponentMouseMove(evt);
        }
    };
    var onComponentMouseRightClick = function(evt) {
        cancelHoverTimeout();
        if (mIgnoreNextClick) {
            return;
        };
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);
            fireEventToLayers(evt, "onRightMouseClick");
        } catch (exc) {
            self.error("handling right mouse click failed", exc);
        };
        var now = (new Date()).getTime();
        if (mRightClickTime == null) {
            mRightClickTime = now;
        } else {
            var diff = now - mRightClickTime;
            if (diff <= mMap.getDoubleRightClickDelay()) {
                mRightClickTime = null;
                onComponentMouseDblRightClick(evt);
            } else {
                mRightClickTime = now;
            }
        }
    };
    var onComponentMouseDblRightClick = function(evt) {
        cancelHoverTimeout();
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);
            fireEventToLayers(evt, "onRightMouseDblClick");
        } catch (exc) {
            self.error("handling double right click failed", exc);
        }
    };
    var onComponentMouseClick = function(evt) {
        cancelHoverTimeout();
        if (mIgnoreNextClick) {
            return;
        };
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);
            fireEventToLayers(evt, "onMouseClick");
        } catch (exc) {
            self.error("handling mouse click failed", exc);
        }
    };
    var onComponentMouseDblClick = function(evt) {
        evt = EventUtils.getEvent(evt);
        cancelHoverTimeout();
        try {
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);
            fireEventToLayers(evt, "onMouseDblClick");
        } catch (exc) {
            self.error("handling double click failed", exc);
        }
    };
    var onComponentMouseOut = function(evt) {
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);
            var width = mMap.getWidth();
            var height = mMap.getHeight();
            if (evt.relMouseX < 0 || evt.relMouseY < 0 || evt.relMouseX >= width || evt.relMouseY >= height) {
                cancelHoverTimeout();
                mLastMouseX = null;
                mLastMouseY = null;
                fireEventToLayers(evt, "onMouseOut");
            }
        } catch (exc) {
            self.error("handling mouse out failed", exc);
        }
    };
    var onComponentMouseMove = function(evt) {
        var retVal = false;
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);
            if (mLastMouseX != evt.relMouseX || mLastMouseY != evt.relMouseY) {
                retVal = fireEventToLayers(evt, "onMouseMove");
                mLastMouseX = evt.relMouseX;
                mLastMouseY = evt.relMouseY;
                if (self.getActiveLayer() == null) {
                    mHoverEvent = evt;
                    setHoverTimeout();
                } else if (map.MapController.HOVER_TIMEOUT != 0) {
                    cancelHoverTimeout();
                }
            }
        } catch (exc) {
            self.error("handling mouse move failed", exc);
        };
        return retVal;
    };
    var onComponentMouseWheel = function(evt) {
        cancelHoverTimeout();
        var evtWasConsumed = false;
        try {
            evt = EventUtils.getEvent(evt);
            if (evt.wheelTicks == null) {
                evt.wheelTicks = 0;
            };
            evt.wheelTicks = (evt.wheelTicks > 0 ? Math.ceil(evt.wheelTicks / 3) : Math.floor(evt.wheelTicks / 3));
            evtWasConsumed = fireEventToLayers(evt, "onMouseWheel");
        } catch (exc) {
            self.error("handling mouse wheel failed", exc);
        };
        if (evtWasConsumed && !evt.dontPreventDefault) {
            if (evt.preventDefault) {
                evt.preventDefault();
            };
            return false;
        } else {
            return true;
        }
    };
    var onComponentSelectStart = function(evt) {
        cancelHoverTimeout();
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);
            if (fireEventToLayers(evt, "onSelectStart")) {
                return true;
            }
        } catch (exc) {
            self.error("handling select start failed", exc);
        };
        return false;
    };
    var onComponentKeyDown = function(evt) {
        var evtWasConsumed = false;
        try {
            evt = EventUtils.getEvent(evt);
            evtWasConsumed = fireEventToLayers(evt, "onKeyDown");
        } catch (exc) {
            self.error("handling key down failed", exc);
        };
        if (evtWasConsumed && !evt.dontPreventDefault) {
            if (evt.preventDefault) {
                evt.preventDefault();
            };
            return false;
        } else {
            return true;
        }
    };
    var fireEventToLayers = function(evt, listenerMethodName) {
        var activeLayer = self.getActiveLayer();
        if (activeLayer != null) {
            return activeLayer[listenerMethodName](evt);
        } else {
            var layerArr = mMap.getLayers();
            var processed = false;
            for (var i = layerArr.length - 1; i >= 0; i--) {
                if (layerArr[i].isEnabled()) {
                    processed = layerArr[i][listenerMethodName](evt);
                    if (processed == null) {
                        throw new Error(listenerMethodName + " of class " + layerArr[i].constructor.classname + " returned null (not true or false)");
                    };
                    if (processed) {
                        return true;
                    }
                }
            }
        };
        return false;
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        cancelHoverTimeout();
        mHoverEvent = null;
        mMainElement.onmousemove = null;
        mMainElement.onmousedown = null;
        mMainElement.onmouseup = null;
        mMainElement.onmouseout = null;
        mMainElement.onclick = null;
        EventUtils.removeEventHandler(mMainElement, "onmousewheel", onComponentMouseWheel);
        mMainElement.oncontextmenu = null;
        mMainElement.onselectstart = null;
        mMainElement.onkeydown = null;
        mainElement = null;
        mMainElement = null;
        superDispose.call(self);
    };
    self.initEvents = function() {
        mMainElement.onmousemove = onComponentMouseMove;
        mMainElement.onmousedown = self.onComponentMouseDown;
        mMainElement.onmouseup = self.onComponentMouseUp;
        mMainElement.onmouseout = onComponentMouseOut;
        mMainElement.ondblclick = onComponentMouseDblClick;
        EventUtils.addEventHandler(mMainElement, "onmousewheel", onComponentMouseWheel);
        mMainElement.oncontextmenu = function(evt) {
            return false;
        };
        mMainElement.onselectstart = onComponentSelectStart;
        mMainElement.tabIndex = 0;
        mMainElement.onkeydown = onComponentKeyDown;
        mMainElement.style.outline = "none";
    };
    var init = function() {
        if (initEvents == null || initEvents) {
            self.initEvents();
        };
        self.setActionMode(map.MapController.DEFAULT_ACTION_MODE);
    };
    init();
});
qxp.Class.ACTION_MODE_MOVE = 1;
qxp.Class.ACTION_MODE_ZOOM = 2;
qxp.Class.DEFAULT_ACTION_MODE = qxp.Class.ACTION_MODE_ZOOM;
qxp.Class.HOVER_TIMEOUT = 0;
qxp.OO.addProperty({
    name: "activeLayer",
    type: qxp.constant.Type.OBJECT
});
qxp.OO.addProperty({
    name: "actionMode",
    type: qxp.constant.Type.NUMBER,
    defaultValue: qxp.Class.DEFAULT_ACTION_MODE,
    allowNull: false,
    possibleValues: [qxp.Class.ACTION_MODE_MOVE, qxp.Class.ACTION_MODE_ZOOM]
});




/* ID: com.ptvag.webcomponent.map.layer.AbstractVectorLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.AbstractVectorLayer", com.ptvag.webcomponent.map.layer.Layer, function(floaterLayer, isSecondary) {
    com.ptvag.webcomponent.map.layer.Layer.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mCanvas = null;
    var mBackgroundCanvas = null;
    var mContainer = null;
    var mFloaterLayer = floaterLayer;
    var mCurrentCenterPix = null;
    var mCanvasSupported = true;
    var mCanvasDirty = false;
    var mBackgroundCanvasDirty = false;
    var mActiveLayer = null;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        self.getMap().getController().addEventListener("changeActiveLayer", onActiveLayerChanged);
        if (self.isEnabled()) {
            self.updateImage();
        }
    };
    self.isCanvasSupported = function() {
        return mCanvasSupported;
    };
    var onActiveLayerChanged = function(evt) {
        try {
            var previousActiveLayer = mActiveLayer;
            mActiveLayer = evt.getData();
            if (mActiveLayer == null && previousActiveLayer != self) {
                if (previousActiveLayer == null || !previousActiveLayer.isInZoomBoxMode || !previousActiveLayer.isInZoomBoxMode()) self.updateImage();
            }
        } catch (e) {
            self.error("Error in onActiveLayerChanged in AbstractVectorLayer", e);
        }
    };
    self.onViewChanged = function(evt) {
        self.updateImage(evt);
    };
    self.updateImage = function(evt) {
        var offsetX = 0;
        var offsetY = 0;
        var theMap = self.getMap();
        var activeLayer = theMap.getController().getActiveLayer();
        var mapZoom = theMap.getVisibleZoom();
        var mapCenterSu = theMap.getVisibleCenter();
        if (self.isRelative()) {
            var relativeOffset = theMap.getRelativeOffset();
            offsetX = relativeOffset.x;
            offsetY = relativeOffset.y;
            if ((offsetX != 0 || offsetY != 0) && evt != null) {
                if (activeLayer != null && activeLayer != self) {
                    return;
                };
                var targetZoom = theMap.getZoom();
                if (mapZoom == targetZoom) {
                    var targetCenter = theMap.getCenter();
                    if (targetCenter.x != mapCenterSu.x || targetCenter.y != mapCenterSu.y) {
                        return;
                    }
                }
            }
        };
        self.updateDom(offsetX, offsetY);
    };
    self.updateDom = function(offsetX, offsetY) {
        var theMap = self.getMap();
        var activeLayer = theMap.getController().getActiveLayer();
        var width = theMap.getWidth();
        var height = theMap.getHeight();
        var mapZoom = theMap.getVisibleZoom();
        var mapCenterSu = theMap.getVisibleCenter();
        offsetX = Math.round(offsetX);
        offsetY = Math.round(offsetY);
        var mapCenterPix = map.CoordUtil.smartUnit2Pixel(mapCenterSu, mapZoom);
        var floaterElement = null;
        if (mFloaterLayer != null && !isSecondary) {
            floaterElement = mFloaterLayer.getParentElement();
        };
        if (activeLayer != null && activeLayer != self && mCurrentCenterPix != null) {
            offsetX += mCurrentCenterPix.x - mapCenterPix.x;
            offsetY += mapCenterPix.y - mCurrentCenterPix.y;
            var rotatedOffsets = theMap.transformPixelCoords(offsetX, offsetY, true, false, true);
            var styleLeft = Math.round(rotatedOffsets.x) + "px";
            var styleTop = Math.round(rotatedOffsets.y) + "px";
            if (mCanvas != null) {
                mCanvas.style.left = styleLeft;
                mCanvas.style.top = styleTop;
            };
            if (mContainer != null) {
                mContainer.style.left = styleLeft;
                mContainer.style.top = styleTop;
            };
            if (floaterElement != null) {
                floaterElement.style.left = styleLeft;
                floaterElement.style.top = styleTop;
            };
            return;
        };
        var mapTop = mapCenterPix.y + height / 2 + 0.001;
        var mapLeft = mapCenterPix.x - width / 2 - 0.001;
        var styleLeft = offsetX + "px";
        var styleTop = offsetY + "px";
        var styleWidth = width + "px";
        var styleHeight = height + "px";
        if (mCanvas == null && mCanvasSupported) {
            mCanvas = map.MapUtil.createCanvas(window, self.getParentElement(), width, height);
            if (mCanvas == null) {
                mCanvasSupported = false;
            } else {
                mBackgroundCanvas = map.MapUtil.createCanvas(window, self.getParentElement(), width, height);
                mCanvas.style.position = "absolute";
                mCanvas.style.left = styleLeft;
                mCanvas.style.top = styleTop;
                mCanvas.style.zIndex = -2000000001;
                mBackgroundCanvas.style.position = "absolute";
                mBackgroundCanvas.style.left = styleLeft;
                mBackgroundCanvas.style.top = styleTop;
                mBackgroundCanvas.style.zIndex = -2000000001;
                mBackgroundCanvas.style.visibility = "hidden";
            }
        } else if (mCanvas != null) {
            var Client = qxp.sys.Client.getInstance();
            if (!Client.isGecko() && !Client.isMshtml()) {
                if (mBackgroundCanvas.style.width != styleWidth || mBackgroundCanvas.style.height != styleHeight) {
                    self.getParentElement().removeChild(mBackgroundCanvas);
                    mBackgroundCanvas = document.createElement("canvas");
                    mBackgroundCanvas.setAttribute("width", width);
                    mBackgroundCanvas.setAttribute("height", height);
                    mBackgroundCanvas.style.position = "absolute";
                    mBackgroundCanvas.style.left = styleLeft;
                    mBackgroundCanvas.style.top = styleTop;
                    mBackgroundCanvas.style.width = styleWidth;
                    mBackgroundCanvas.style.height = styleHeight;
                    mBackgroundCanvas.style.zIndex = -2000000001;
                    self.getParentElement().appendChild(mBackgroundCanvas);
                } else {
                    mBackgroundCanvas.style.left = styleLeft;
                    mBackgroundCanvas.style.top = styleTop;
                }
            } else {
                mBackgroundCanvas.style.left = styleLeft;
                mBackgroundCanvas.style.top = styleTop;
                if (mBackgroundCanvas.style.width != styleWidth || mBackgroundCanvas.style.height != styleHeight) {
                    mBackgroundCanvas.setAttribute("width", width);
                    mBackgroundCanvas.setAttribute("height", height);
                    mBackgroundCanvas.style.width = styleWidth;
                    mBackgroundCanvas.style.height = styleHeight;
                }
            }
        };
        if (mContainer == null) {
            mContainer = document.createElement("div");
            mContainer.style.position = "absolute";
            mContainer.style.width = styleWidth;
            mContainer.style.height = styleHeight;
            mContainer.style.zIndex = 0;
            self.getParentElement().appendChild(mContainer);
        } else {
            if (mContainer.style.width != styleWidth || mContainer.style.height != styleHeight) {
                mContainer.style.width = styleWidth;
                mContainer.style.height = styleHeight;
            }
        };
        var context = null;
        if (mBackgroundCanvas != null) {
            context = mBackgroundCanvas.getContext("2d");
            if (mBackgroundCanvasDirty) {
                context.clearRect(0, 0, width, height);
            }
        };
        mCurrentCenterPix = mapCenterPix;
        var rotationAngle = self.getMap().getVisibleRotation();
        context.save();
        context.translate(width / 2, height / 2);
        context.rotate(-rotationAngle / 180.0 * Math.PI);
        context.translate(-width / 2, -height / 2);
        mBackgroundCanvasDirty = self.paintContent(context, mContainer, mapZoom, mapLeft, mapTop);
        context.restore();
        mContainer.style.left = styleLeft;
        mContainer.style.top = styleTop;
        if (floaterElement != null) {
            floaterElement.style.left = styleLeft;
            floaterElement.style.top = styleTop;
        };
        if (mCanvas != null) {
            var temp = mCanvas;
            mCanvas = mBackgroundCanvas;
            mBackgroundCanvas = temp;
            temp = mCanvasDirty;
            mCanvasDirty = mBackgroundCanvasDirty;
            mBackgroundCanvasDirty = temp;
            mCanvas.style.visibility = "";
            mBackgroundCanvas.style.visibility = "hidden";
        }
    };
    self.paintContent = function(context, container, mapZoom, mapLeft, mapTop, forPrinting) {
        throw new Error("paintContent is abstract");
    };
    self.setCanvasDirty = function() {
        mCanvasDirty = true;
    };
    self.doPrint = function(ctx, htmlContainer, htmlBackground) {
        var theMap = self.getMap();
        var mapZoom = theMap.getVisibleZoom();
        var mapCenterSu = theMap.getVisibleCenter();
        var mapCenterPix = map.CoordUtil.smartUnit2Pixel(mapCenterSu, mapZoom);
        var mapTop = mapCenterPix.y + theMap.getHeight() / 2 + 0.001;
        var mapLeft = mapCenterPix.x - theMap.getWidth() / 2 - 0.001;
        var rotationAngle = self.getMap().getVisibleRotation();
        var matrix = map.MapUtil.createRotationMatrix(rotationAngle, theMap.getWidth() / 2, theMap.getHeight() / 2);
        ctx.save();
        ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        self.paintContent(ctx, htmlContainer, mapZoom, mapLeft, mapTop, true);
        ctx.restore();
        var htmlContent = map.MapUtil.cloneNodeForPrinting(mContainer, htmlContainer.ownerDocument);
        htmlContent.style.left = "0px";
        htmlContent.style.top = "0px";
        htmlContainer.appendChild(htmlContent);
        if (mFloaterLayer != null && !isSecondary) {
            htmlContent = map.MapUtil.cloneNodeForPrinting(mFloaterLayer.getParentElement(), htmlContainer.ownerDocument);
            htmlContent.style.left = "0px";
            htmlContent.style.top = "0px";
            htmlContainer.appendChild(htmlContent);
        }
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        self.getMap().getController().removeEventListener("changeActiveLayer", onActiveLayerChanged);
        mContainer = null;
        if (mCanvas != null) {
            map.MapUtil.cleanupCanvas(window, mCanvas);
            mCanvas = null;
        };
        if (mBackgroundCanvas != null) {
            map.MapUtil.cleanupCanvas(window, mBackgroundCanvas);
            mBackgroundCanvas = null;
        };
        superDispose.call(self);
    };
});




/* ID: com.ptvag.webcomponent.map.layer.VectorLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.VectorLayer", com.ptvag.webcomponent.map.layer.AbstractVectorLayer, function(floaterLayer, isSecondary) {
    com.ptvag.webcomponent.map.layer.AbstractVectorLayer.call(this, floaterLayer, isSecondary);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mFloaterLayer = floaterLayer;
    var mElements = {};
    var mHoverAreas = {};
    var mCurrentHoverArea = null;
    var mCandidateHoverArea = null;
    var mCandidateTimer = null;
    var mCandidateEvent = null;
    var mClickAreas = {};
    var mRightClickAreas = {};
    var mFlexibleElementIds = [];
    var mElementIds = [];
    var mElementIdsSorted = true;
    var mAggregateElements = {};
    var mRemoveOnClick = {};
    var mInRemoveOnClick = false;
    var mInBulkMode = false;
    var mChangeInBulkMode = false;
    var mFiringBulkEvent = false;
    var mLastMapZoom;
    var mLastMapLeft;
    var mLastMapTop;
    var mUniqueCounter = 0;
    var INTERNAL_PREFIX = "_ptv_internal_";
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        self.getMap().getController().addEventListener("changeActiveLayer", onActiveLayerChanged);
    };
    var onActiveLayerChanged = function(evt) {
        try {
            var activeLayer = evt.getData();
            if (activeLayer != null) {
                for (var id in mHoverAreas) {
                    mHoverAreas[id].clear();
                };
                mCurrentHoverArea = null;
            }
        } catch (e) {
            self.error("Error in onActiveLayerChanged in VectorLayer", e);
        }
    };
    var getUniqueId = function() {
        var id = INTERNAL_PREFIX + (++mUniqueCounter);
        if (id >= 2000000000) {
            mUniqueCounter = id = 1;
        };
        return id;
    };
    self.startBulkMode = function() {
        if (mInBulkMode) {
            throw new Error("Starting bulk mode failed. The vector layer is already in bulk mode.");
        };
        mInBulkMode = true;
        mChangeInBulkMode = false;
    };
    self.endBulkMode = function() {
        if (!mInBulkMode) {
            throw new Error("Ending bulk mode failed. The vector layer was not in bulk mode.");
        };
        mInBulkMode = false;
        if (mChangeInBulkMode) {
            mFiringBulkEvent = true;
            self.onViewChanged();
            mFiringBulkEvent = false;
            mChangeInBulkMode = false;
        }
    };
    self.inBulkMode = function() {
        return mInBulkMode;
    };
    var elementIdComparator = function(a, b) {
        var prioA = mElements[a].getPriority();
        var prioB = mElements[b].getPriority();
        if (prioA < prioB) {
            return -1;
        };
        if (prioA > prioB) {
            return 1;
        };
        return 0;
    };
    var superOnViewChanged = self.onViewChanged;
    self.onViewChanged = function(evt, immediately) {
        if (!self.isInitialized()) {
            return;
        };
        if (!mInBulkMode && !mFiringBulkEvent && self.getUseAutoBulkMode() && !immediately) {
            var activeLayer = self.getMap().getController().getActiveLayer();
            if (activeLayer == null || activeLayer == self) {
                self.startBulkMode();
                window.setTimeout(self.endBulkMode, 0);
            }
        };
        if (mInBulkMode) {
            mChangeInBulkMode = true;
            return;
        };
        superOnViewChanged(evt);
    };
    self.paintContent = function(context, container, mapZoom, mapLeft, mapTop, forPrinting) {
        if (mLastMapZoom != mapZoom || mLastMapLeft != mapLeft || mLastMapTop != mapTop) {
            mLastMapZoom = mapZoom;
            mLastMapLeft = mapLeft;
            mLastMapTop = mapTop;
            for (var id in mHoverAreas) {
                mHoverAreas[id].clear();
            };
            mCurrentHoverArea = null;
        };
        updateFlexiblePositions();
        var dirty = false;
        var topLevelContainer = mFloaterLayer.getParentElement();
        var canvasSupported = self.isCanvasSupported();
        var elementCount = mElementIds.length;
        if (!mElementIdsSorted) {
            mElementIds.sort(elementIdComparator);
            mElementIdsSorted = true;
        };
        for (var choice = 0; choice < 2;
            ++choice) {
            for (var i = 0; i < elementCount;
                ++i) {
                var element = mElements[mElementIds[i]];
                if (element.getVisibleMinZoom() >= mapZoom && element.getVisibleMaxZoom() <= mapZoom) {
                    if (choice == 0 && element.usesCanvas(context)) {
                        if (!canvasSupported) {
                            if (qxp.sys.Client.getInstance().isMshtml()) {
                                throw new Error("You must include the " + "excanvas.js script in your page to draw an " + "instance of " + element.classname);
                            } else {
                                throw new Error("You must use a browser that " + "supports the canvas tag to draw an " + "instance of " + element.classname);
                            }
                        };
                        element.draw(container, topLevelContainer, context, mapLeft, mapTop, mapZoom);
                        dirty = true;
                    } else if (choice == 1 && !element.usesCanvas(context) && !forPrinting) {
                        element.draw(container, topLevelContainer, context, mapLeft, mapTop, mapZoom);
                    }
                } else {
                    element.clear();
                }
            }
        };
        return dirty;
    };
    var createPRNG = function(seed) {
        if (seed == null) {
            seed = parseInt(new Date().getTime() / 1000);
        };
        return function() {
            var AAA = 40692;
            var MMM = 2147483399;
            var QQQ = 52774;
            var RRR = 3791;
            var y = seed;
            var r = RRR * parseInt(y / QQQ);
            y = AAA * (y % QQQ) - r;
            if (y < 0) {
                y += MMM;
            };
            seed = y;
            return seed / MMM;
        };
    };
    var updateFlexiblePositions = function() {
        var elemDataHash = {};
        var dependentHash = {};
        var actualFlexibleElementIds = [];
        var prng = createPRNG(190199);
        var zoom = self.getMap().getVisibleZoom();
        for (var i = 0; i < mFlexibleElementIds.length; i++) {
            var id = mFlexibleElementIds[i];
            var element = mElements[id];
            var noiseX = 0;
            var noiseY = 0;
            if (self.getFlexAtSamePosition()) {
                noiseX = prng() / 10;
                noiseY = prng() / 10;
            };
            var suPoint = {
                x: element.getX() + noiseX,
                y: element.getY() + noiseY
            };
            var pixPoint = map.CoordUtil.smartUnit2Pixel(suPoint, zoom);
            var dependsOn = element.getDependsOn();
            if (dependsOn == null) {
                elemDataHash[id] = {
                    startX: pixPoint.x,
                    startY: pixPoint.y,
                    x: pixPoint.x,
                    y: pixPoint.y,
                    pushX: 0,
                    pushY: 0
                };
                actualFlexibleElementIds.push(id);
            } else {
                var dependentElements = dependentHash[dependsOn];
                if (dependentElements == null) {
                    dependentElements = [];
                    dependentHash[dependsOn] = dependentElements;
                };
                dependentElements.push(id);
            }
        };
        var maxFlex = map.layer.VectorLayer.MAX_FLEX_DISTANCE;
        var flexCount = actualFlexibleElementIds.length;
        for (var step = 0; step < 20;
            ++step) {
            for (var i = 0; i < flexCount;
                ++i) {
                var elemData = elemDataHash[actualFlexibleElementIds[i]];
                for (var j = 0; j < flexCount;
                    ++j) {
                    if (i == j) continue;
                    var compData = elemDataHash[actualFlexibleElementIds[j]];
                    if (compData.x == elemData.x && compData.y == elemData.y) {
                        continue;
                    };
                    var distX = elemData.x - compData.x;
                    var distY = elemData.y - compData.y;
                    var squareDist = distX * distX + distY * distY;
                    if (squareDist < 400) {
                        if (squareDist < 10) {
                            squareDist = 10;
                        };
                        var force = 1 / squareDist * 10;
                        elemData.pushX += force * distX;
                        elemData.pushY += force * distY;
                    }
                };
                squareDist = elemData.pushX * elemData.pushX + elemData.pushY * elemData.pushY;
                var dist = Math.sqrt(squareDist);
                if (dist > maxFlex) {
                    elemData.pushX *= maxFlex / dist;
                    elemData.pushY *= maxFlex / dist;
                }
            };
            for (i = 0; i < flexCount;
                ++i) {
                elemData = elemDataHash[actualFlexibleElementIds[i]];
                elemData.x = elemData.startX + elemData.pushX;
                elemData.y = elemData.startY + elemData.pushY;
            }
        };
        for (i = 0; i < actualFlexibleElementIds.length; i++) {
            id = actualFlexibleElementIds[i];
            elemData = elemDataHash[id];
            element = mElements[id];
            element.setFlexX(Math.round(elemData.x - elemData.startX));
            element.setFlexY(-Math.round(elemData.y - elemData.startY));
        };
        for (id in dependentHash) {
            var parentElement = mElements[id];
            var children = dependentHash[id];
            for (var i = 0; i < children.length;
                ++i) {
                var childElement = mElements[children[i]];
                childElement.setFlexX(parentElement.getFlexX());
                childElement.setFlexY(parentElement.getFlexY());
            }
        }
    };
    self.onMouseHover = function(evt) {
        if (mCurrentHoverArea != null && mCurrentHoverArea.hitTest && mCurrentHoverArea.hitTest(evt)) {
            if (mCandidateTimer != null) {
                window.clearTimeout(mCandidateTimer);
                mCandidateTimer = null;
            };
            return false;
        };
        evt = {
            relMouseX: evt.relMouseX,
            relMouseY: evt.relMouseY
        };
        var magnetic = (mCurrentHoverArea != null && mCurrentHoverArea.isMagnetic());
        var keepArea = false;
        var toShow = null;
        var toShowPriority = null;
        var minDistance = -1;
        var areas = [];
        var areaContent = {};
        var mapZoom = self.getMap().getVisibleZoom();
        for (var id in mHoverAreas) {
            var hoverArea = mHoverAreas[id];
            var distance = hoverArea.getSquareDistance(evt);
            if (distance >= 0 && hoverArea.getVisibleMinZoom() >= mapZoom && hoverArea.getVisibleMaxZoom() <= mapZoom) {
                areas.push(hoverArea);
                if (magnetic && hoverArea == mCurrentHoverArea) {
                    keepArea = true;
                };
                var priority = hoverArea.getPriority();
                if (toShowPriority != null && priority < toShowPriority) {
                    continue;
                };
                if (priority == toShowPriority && distance >= minDistance) {
                    continue;
                };
                minDistance = distance;
                toShow = hoverArea;
                toShowPriority = priority;
            }
        };
        if (keepArea) {
            toShow = mCurrentHoverArea;
        };
        if (mCandidateTimer != null && toShow != mCandidateHoverArea) {
            window.clearTimeout(mCandidateTimer);
            mCandidateTimer = null;
        };
        if (toShow != null) {
            var extendedEventInfo = toShow.getExtendedEventInfo();
            if (extendedEventInfo != null) {
                for (var key in extendedEventInfo) {
                    evt[key] = extendedEventInfo[key];
                }
            };
            var areaCount = areas.length;
            for (var i = 0; i < areaCount;
                ++i) {
                if (areas[i] == toShow) {
                    areas.splice(i, 1);
                    break;
                }
            };
            evt.otherAreas = areas;
            if (toShow == mCurrentHoverArea) {
                toShow.onHover(evt);
            } else {
                mCandidateEvent = evt;
                if (mCandidateTimer == null) {
                    mCandidateHoverArea = toShow;
                    mCandidateTimer = window.setTimeout(function() {
                        if (mCandidateTimer == null) {
                            return;
                        };
                        mCandidateTimer = null;
                        if (mCandidateHoverArea == null) {
                            return;
                        };
                        if (mCurrentHoverArea != null) {
                            mCurrentHoverArea.onUnhover(mCandidateEvent);
                        };
                        mCandidateHoverArea.onHover(mCandidateEvent);
                        mCurrentHoverArea = mCandidateHoverArea;
                    }, self.getHoverDelay());
                }
            }
        };
        if (toShow != mCurrentHoverArea) {
            if (mCurrentHoverArea != null && mCurrentHoverArea.testUnhover(evt)) {
                mCurrentHoverArea.onUnhover(evt);
                mCurrentHoverArea = null;
            }
        };
        return false;
    };
    self.onMouseDown = function(evt) {
        if (evt.shiftKey) {
            return true;
        };
        var target = (evt.srcElement ? evt.srcElement : evt.target);
        var ignore = false;
        while (target) {
            ignore = target._ignoreMouseDown;
            if (ignore) {
                break;
            };
            target = target.parentNode;
        };
        return (ignore ? true : false);
    };
    self.onMouseDblClick = function(evt) {
        var target = (evt.srcElement ? evt.srcElement : evt.target);
        var ignore = false;
        while (target) {
            ignore = target._ignoreMouseDown;
            if (ignore) {
                break;
            };
            target = target.parentNode;
        };
        return (ignore ? true : false);
    };
    self.onMouseWheel = function(evt) {
        var target = (evt.srcElement ? evt.srcElement : evt.target);
        var ignore = false;
        while (target) {
            ignore = target._ignoreMouseWheel;
            if (ignore) {
                break;
            };
            target = target.parentNode;
        };
        if (ignore) {
            evt.dontPreventDefault = true;
        };
        return (ignore ? true : false);
    };
    self.onMouseUp = function(evt) {
        var target = (evt.srcElement ? evt.srcElement : evt.target);
        var ignore = false;
        while (target) {
            ignore = target._ignoreMouseUp;
            if (ignore) {
                break;
            };
            target = target.parentNode;
        };
        return (ignore ? true : false);
    };
    self.onSelectStart = function(evt) {
        var target = (evt.srcElement ? evt.srcElement : evt.target);
        var allowSelection = false;
        while (target) {
            allowSelection = target._allowSelection;
            if (allowSelection) {
                break;
            };
            target = target.parentNode;
        };
        return (allowSelection ? true : false);
    };
    var onMouseClick = function(evt, clickAreas) {
        var clicked = null;
        var clickedPriority = null;
        var minDistance = -1;
        var mapZoom = self.getMap().getVisibleZoom();
        for (var id in clickAreas) {
            var clickArea = clickAreas[id];
            var distance = clickArea.getSquareDistance(evt);
            if (distance >= 0 && clickArea.getVisibleMinZoom() >= mapZoom && clickArea.getVisibleMaxZoom() <= mapZoom) {
                var priority = clickArea.getPriority();
                if (clickedPriority != null && priority < clickedPriority) {
                    continue;
                };
                if (priority == clickedPriority && distance >= minDistance) {
                    continue;
                };
                minDistance = distance;
                clicked = clickArea;
                clickedPriority = priority;
            }
        };
        if (clicked != null) {
            var extendedEventInfo = clicked.getExtendedEventInfo();
            if (extendedEventInfo != null) {
                for (var key in extendedEventInfo) {
                    evt[key] = extendedEventInfo[key];
                }
            };
            clicked.onClick(evt);
            return true;
        };
        return false;
    };
    self.onMouseClick = function(evt) {
        mInRemoveOnClick = true;
        for (var id in mRemoveOnClick) {
            self.removeElement(id);
        };
        mRemoveOnClick = {};
        mInRemoveOnClick = false;
        return onMouseClick(evt, mClickAreas);
    };
    self.onRightMouseClick = function(evt) {
        return onMouseClick(evt, mRightClickAreas);
    };
    self.addElement = function(element, deferSorting) {
        if (element instanceof map.vector.AggregateElement) {
            return self.addAggregateElement(element);
        };
        var id = element.getId();
        if (id == null) {
            id = getUniqueId();
            element.setId(id);
        };
        if (mElements[id] != null || mAggregateElements[id] != null) {
            self.removeElement(id);
        };
        if (deferSorting) {
            mElementIds.push(id);
            mElementIdsSorted = false;
        } else {
            var priority = element.getPriority();
            if (mElementIds.length == 0) {
                mElementIds.push(id);
            } else if (mElements[mElementIds[mElementIds.length - 1]].getPriority() <= priority) {
                mElementIds.push(id);
            } else {
                for (var i = 0; mElements[mElementIds[i]].getPriority() <= priority;
                    ++i);
                mElementIds.splice(i, 0, id);
            }
        };
        mElements[id] = element;
        element.fixPriority();
        if (element instanceof map.vector.AbstractHoverArea) {
            mHoverAreas[id] = element;
        };
        if (element instanceof map.vector.RightClickArea) {
            mRightClickAreas[id] = element;
        } else if (element instanceof map.vector.ClickArea) {
            mClickAreas[id] = element;
        };
        if (element.isPositionFlexible()) {
            mFlexibleElementIds.push(id);
        };
        element.setVectorLayer(self);
        self.onViewChanged();
        return id;
    };
    var removeElement = function(id) {
        var element = mElements[id];
        if (element != null) {
            for (var i = 0; i < mElementIds.length;
                ++i) {
                if (mElementIds[i] == id) {
                    mElementIds.splice(i, 1);
                    break;
                }
            };
            delete mElements[id];
        }
    };
    self.addAggregateElement = function(aggregateElement) {
        var id = aggregateElement.getId();
        if (id == null) {
            id = getUniqueId();
            aggregateElement.setId(id);
        };
        if (mAggregateElements[id] != null || mElements[id] != null) {
            self.removeElement(id);
        };
        mAggregateElements[id] = aggregateElement;
        aggregateElement.setVectorLayer(self);
        return id;
    };
    var removeAggregateElement = function(id) {
        var aggregateElement = mAggregateElements[id];
        if (aggregateElement != null) {
            aggregateElement.clear();
            delete mAggregateElements[id];
            if (aggregateElement.getAutoDispose()) {
                aggregateElement.dispose();
            };
            return true;
        };
        return false;
    };
    self.removeElement = function(id) {
        if (!mInRemoveOnClick) {
            delete mRemoveOnClick[id];
        };
        if (!removeAggregateElement(id)) {
            var element = mElements[id];
            if (element != null) {
                element.clear();
                removeElement(id);
                delete mHoverAreas[id];
                delete mClickAreas[id];
                delete mRightClickAreas[id];
                for (var i = 0; i < mFlexibleElementIds.length; i++) {
                    if (mFlexibleElementIds[i] == id) {
                        mFlexibleElementIds.splice(i, 1);
                        break;
                    }
                };
                if (element == mCurrentHoverArea) {
                    mCurrentHoverArea = null;
                };
                if (element == mCandidateHoverArea) {
                    mCandidateHoverArea = null;
                };
                if (element.getAutoDispose()) {
                    element.dispose();
                };
                self.onViewChanged();
            }
        }
    };
    self.hideElement = function(id) {
        self.removeElement(id);
    };
    self.removeAllElements = function() {
        var aggregateIds = [];
        for (var id in mAggregateElements) {
            aggregateIds.push(id);
        };
        var count = aggregateIds.length;
        for (var i = 0; i < count;
            ++i) {
            self.removeElement(aggregateIds[i]);
        }
        while (mElementIds.length > 0) {
            self.removeElement(mElementIds[0]);
        }
    };
    self.elementExists = function(id) {
        if (id in mAggregateElements) {
            return true;
        };
        return (id in mElements);
    };
    self.removeOnClick = function(id) {
        mRemoveOnClick[id] = null;
    };
    self.getElement = function(id) {
        var retVal = mAggregateElements[id];
        if (retVal != null) {
            return retVal;
        };
        return mElements[id];
    };
    self.showLine = function(color, pixelSize, coordinates, priority, id) {
        return self.addElement(new map.vector.Line(color, pixelSize, coordinates, priority, id));
    };
    self.showCircle = function(x, y, color, pixelSize, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.Circle(x, y, color, pixelSize, priority, id, isPositionFlexible));
    };
    self.showText = function(x, y, color, pixelSize, alignment, text, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.Text(x, y, color, pixelSize, alignment, text, priority, id, isPositionFlexible));
    };
    self.showPoly = function(color, coordinates, priority, id) {
        return self.addElement(new map.vector.Poly(color, coordinates, priority, id));
    };
    self.showImageMarker = function(x, y, url, alignment, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.ImageMarker(x, y, url, alignment, priority, id, isPositionFlexible));
    };
    self.showInfoBox = function(x, y, text, alignment, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.InfoBox(x, y, text, alignment, priority, id, isPositionFlexible));
    };
    self.showTooltip = function(x, y, maxZoom, tolerance, text, alignment, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.Tooltip(x, y, maxZoom, tolerance, text, alignment, priority, id, isPositionFlexible));
    };
    self.addHoverArea = function(x, y, maxZoom, tolerance, hoverHandler, unhoverHandler, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.HoverArea(x, y, maxZoom, tolerance, hoverHandler, unhoverHandler, priority, id, isPositionFlexible));
    };
    self.addClickArea = function(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.ClickArea(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible));
    };
    self.addRightClickArea = function(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.RightClickArea(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible));
    };
    self.showPOI = function(x, y, url, alignment, tooltipContent, infoBoxContent, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.POI(x, y, url, alignment, tooltipContent, infoBoxContent, priority, id, isPositionFlexible));
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        self.getMap().getController().removeEventListener("changeActiveLayer", onActiveLayerChanged);
        for (var id in mAggregateElements) {
            var aggregateElement = mAggregateElements[id];
            if (aggregateElement.getAutoDispose()) {
                aggregateElement.dispose();
            }
        };
        for (var id in mElements) {
            var element = mElements[id];
            if (element.getAutoDispose()) {
                element.dispose();
            }
        };
        if (mCandidateTimer != null) {
            window.clearTimeout(mCandidateTimer);
            mCandidateTimer = null;
        };
        mCandidateEvent = null;
        superDispose.call(self);
    };
});
qxp.OO.addProperty({
    name: "useAutoBulkMode",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "flexAtSamePosition",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "hoverDelay",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.Class.ALIGN_LEFT = 1;
qxp.Class.ALIGN_MID_HORIZ = 2;
qxp.Class.ALIGN_RIGHT = 4;
qxp.Class.ALIGN_TOP = 16;
qxp.Class.ALIGN_MID_VERT = 32;
qxp.Class.ALIGN_BOTTOM = 64;
qxp.Class.MAX_FLEX_DISTANCE = 50;




/* ID: com.ptvag.webcomponent.map.layer.MeasurementLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.MeasurementLayer", com.ptvag.webcomponent.map.layer.VectorLayer, function(floaterLayer, isSecondary) {
    com.ptvag.webcomponent.map.layer.VectorLayer.call(this, floaterLayer, (isSecondary == null ? true : isSecondary));
    var self = this;
    var mapPackage = com.ptvag.webcomponent.map;
    var vectorPackage = mapPackage.vector;
    var CoordUtil = mapPackage.CoordUtil;
    var mMouseDown = false;
    var mMeasurementLine = null;
    var mDistanceBox = null;
    var mStartPoint;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        self.getMap().addEventListener("changeUseMiles", fillDistanceBox);
    };
    var fillDistanceBox = function() {
        if (mDistanceBox == null) {
            return;
        };
        var distance = CoordUtil.distanceOfSmartUnitPoints(mStartPoint, mEndPoint);
        if (self.getMap().getUseMiles()) {
            var distanceMiles = distance / 1609.344;
            if (distanceMiles >= 1) {
                if (distanceMiles > 1000) {
                    var distanceText = "" + Math.round(distanceMiles);
                } else {
                    distanceMiles *= 10;
                    var roundedDist = Math.round(distanceMiles);
                    var fractionalPart = roundedDist % 10;
                    distanceText = parseInt(roundedDist / 10) + self.getMap().getDecimalSeparator() + fractionalPart;
                };
                distanceText += " mi";
            } else {
                distanceText = Math.round(distance / 0.9144) + " yd";
            }
        } else {
            if (distance > 1000) {
                if (distance >= 1000000) {
                    distanceText = "" + Math.round(distance / 1000);
                } else {
                    distance /= 100;
                    roundedDist = Math.round(distance);
                    fractionalPart = roundedDist % 10;
                    distanceText = parseInt(roundedDist / 10) + self.getMap().getDecimalSeparator() + fractionalPart;
                };
                distanceText += " km";
            } else {
                distanceText = Math.round(distance) + " m";
            }
        };
        var html = "<div _ptv_map_dontPrint='true' style='background-color:white;font-family:Verdana,Arial,sans-serif;font-size:10px;color:black;padding:2px;border:1px solid black'>" + distanceText + "</div>";
        var x = (mStartPoint.x + mEndPoint.x) / 2;
        var y = (mStartPoint.y + mEndPoint.y) / 2;
        mDistanceBox.updateProperties(x, y, null, html);
    };
    self.onMouseDown = function(evt) {
        if (!com.ptvag.webcomponent.util.EventUtils.isLeftMouseButton(evt)) {
            return false;
        };
        self.removeAllElements();
        mStartPoint = self.getMap().translateMouseCoords(evt);
        mEndPoint = mStartPoint;
        mMeasurementLine = new vectorPackage.Line("rgba(0, 0, 0, 1.0)", 2, [mStartPoint, mEndPoint]);
        mMeasurementLine.setId("measurementLine");
        mMeasurementLine.set({
            startArrowLength: 5,
            startArrowAngle: 180,
            endArrowLength: 5,
            endArrowAngle: 180
        });
        self.addElement(mMeasurementLine);
        mDistanceBox = new vectorPackage.HTML();
        mDistanceBox.setId("distanceBox");
        mDistanceBox.setAlignment(mapPackage.layer.VectorLayer.ALIGN_MID_HORIZ + mapPackage.layer.VectorLayer.ALIGN_MID_VERT);
        fillDistanceBox();
        self.addElement(mDistanceBox);
        mMouseDown = true;
        self.getMap().getController().setActiveLayer(self);
        return true;
    };
    self.onMouseMove = function(evt) {
        if (mMouseDown) {
            mEndPoint = self.getMap().translateMouseCoords(evt);
            mMeasurementLine.setCoordinates([mStartPoint, mEndPoint]);
            fillDistanceBox();
        };
        return false;
    };
    self.onMouseUp = function() {
        if (!mMouseDown) {
            return false;
        };
        mMouseDown = false;
        self.getMap().getController().setActiveLayer(null);
        return true;
    };
    self.onMouseOut = function() {
        if (mMouseDown) {
            self.removeAllElements();
            mMeasurementLine = null;
            mDistanceBox = null;
            mMouseDown = false;
            self.getMap().getController().setActiveLayer(null);
        };
        return false;
    };
    var superDoPrint = self.doPrint;
    self.doPrint = function(ctx, htmlContainer, htmlBackground) {
        superDoPrint.apply(self, arguments);
        if (mDistanceBox != null) {
            var distanceBoxDiv = self.getParentElement().getElementsByTagName("div")[0].firstChild;
            var left = parseInt(distanceBoxDiv.style.left);
            var top = parseInt(distanceBoxDiv.style.top);
            var width = distanceBoxDiv.offsetWidth - 1;
            var height = distanceBoxDiv.offsetHeight - 1;
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(left, top, width, height);
            ctx.fill();
            ctx.beginPath();
            ctx.rect(left, top, width, height);
            ctx.stroke();
            ctx.fontFamily = "sans-serif";
            ctx.fontStyle = "plain";
            ctx.fontSize = 10;
            ctx.textAlignment = 34;
            ctx.drawText(distanceBoxDiv.firstChild.firstChild.nodeValue, left + width / 2, top + height / 2);
        }
    };
    self.onKeyDown = function(evt) {
        var EventUtils = com.ptvag.webcomponent.util.EventUtils;
        if (mMouseDown) {
            self.onMouseOut();
            return true;
        };
        return false;
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        self.getMap().removeEventListener("changeUseMiles", fillDistanceBox);
        superDispose.call(self);
    };
});




/* ID: com.ptvag.webcomponent.map.layer.AddressLookupLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.AddressLookupLayer", com.ptvag.webcomponent.map.layer.VectorLayer, function(floaterLayer, isSecondary) {
    com.ptvag.webcomponent.map.layer.VectorLayer.call(this, floaterLayer, (isSecondary == null ? true : isSecondary));
    var self = this;
    var mapPackage = com.ptvag.webcomponent.map;
    var vectorPackage = mapPackage.vector;
    var CoordUtil = mapPackage.CoordUtil;
    var mAddressBox = null;
    var mCurrentCall = null;
    var locationCallback = function(result, exc) {
        mCurrentCall = null;
        var html = mapPackage.layer.AddressLookupLayer.formatAddress(result);
        mAddressBox.setText(html);
        self.addElement(mAddressBox);
    };
    self.onMouseClick = function(evt) {
        if (mCurrentCall != null) {
            mapPackage.SERVICE.abort(mCurrentCall);
            mCurrentCall = null;
        };
        if (mAddressBox != null) {
            self.removeElement(mAddressBox.getId());
            mAddressBox.dispose();
            mAddressBox = null;
        };
        var suPoint = self.getMap().translateMouseCoords(evt);
        var mercPoint = CoordUtil.smartUnit2Mercator(suPoint);
        mAddressBox = new vectorPackage.InfoBox(suPoint.x, suPoint.y);
        mAddressBox.setId("theBox");
        mCurrentCall = mapPackage.SERVICE.callAsync(locationCallback, "locationToAddress", mercPoint.x, mercPoint.y);
        return true;
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        if (mCurrentCall != null) {
            mapPackage.SERVICE.abort(mCurrentCall);
            mCurrentCall = null;
        };
        if (mAddressBox != null) {
            mAddressBox.dispose();
            mAddressBox = null;
        };
        superDispose.call(self);
    };
});
qxp.Class.formatAddress = function(address) {
    var MapUtil = com.ptvag.webcomponent.map.MapUtil;
    var html = "";
    if (address != null) {
        if (address.street) {
            var text = address.street;
            if (address.houseNumber) {
                text += " " + address.houseNumber;
            };
            html += MapUtil.escapeHTML(text);
        };
        text = "";
        if (address.postCode) {
            text += address.postCode;
        };
        if (address.city) {
            if (text.length > 0) {
                text += " ";
            };
            text += address.city;
        };
        if (text.length > 0) {
            html += "<br />";
            html += MapUtil.escapeHTML(text);
        }
    };
    if (html.length == 0) {
        html = "&#160;&#160;&#160;";
    };
    return html;
};




/* ID: com.ptvag.webcomponent.map.layer.AbstractMapLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.AbstractMapLayer", com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer, function(requestBuilder) {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mOverlayElem;
    var mStartMouseX;
    var mStartMouseY;
    var mInPanningMode = false;
    var mInZoomBoxMode = false;
    var mWheelTimeout = null;
    var mWheelTicks;
    var mNoAreaOpacityError = false;
    var superInit = self.init;
    self.init = function() {
        mNoAreaOpacityError = true;
        superInit.apply(self, arguments);
        var parentElement = self.getParentElement();
        var areaElem = document.createElement("div");
        areaElem.style.position = "absolute";
        areaElem.style.left = "0px";
        areaElem.style.top = "0px";
        if (!self.isRelative() && !self.getMap().getTileDebugMode()) {
            areaElem.style.overflow = "hidden";
        };
        var areaBorderWidth = self.getAreaBorderWidth();
        if (areaBorderWidth) {
            areaElem.style.border = areaBorderWidth + "px solid #808080";
        };
        parentElement.appendChild(areaElem);
        self._modifyOverlayOpacity(self.getOverlayOpacity());
        self._modifyLayerOpacity(self.getLayerOpacity());
        self.setAreaElement(areaElem);
        mNoAreaOpacityError = false;
    };
    var superModifyAreaOpacity = self._modifyAreaOpacity;
    self._modifyAreaOpacity = function() {
        if (!mNoAreaOpacityError) {
            throw new Error("Don't set the areaOpacity for map layers - use layerOpacity instead");
        };
        var needsOpacityHack = self.needsOpacityHack();
        if (needsOpacityHack) {
            self.setNeedsOpacityHack(false);
        };
        superModifyAreaOpacity.call(self, 1);
        if (needsOpacityHack) {
            self.setNeedsOpacityHack(needsOpacityHack);
        }
    };
    self._modifyLayerOpacity = function(propValue) {
        var parentElement = self.getParentElement();
        if (parentElement != null) {
            map.MapUtil.setElementOpacity(parentElement, propValue);
        }
    };
    self._modifyOverlayOpacity = function(propValue) {
        if (propValue == 0) {
            if (mOverlayElem != null) {
                mOverlayElem.parentNode.removeChild(mOverlayElem);
                mOverlayElem = null;
            }
        } else {
            if (mOverlayElem == null) {
                parentElement = self.getParentElement();
                if (parentElement != null) {
                    mOverlayElem = document.createElement("div");
                    mOverlayElem.style.position = "absolute";
                    if (self.isRelative() && !self.needsOpacityHack() && (!qxp.sys.Client.getInstance().isMshtml() || !com.ptvag.webcomponent.map.Map.IE_FAST_OPACITY)) {
                        var opacityHackSize = com.ptvag.webcomponent.map.Map.OPACITY_HACK_SIZE;
                        mOverlayElem.style.left = -opacityHackSize / 2 + "px";
                        mOverlayElem.style.top = -opacityHackSize / 2 + "px";
                        mOverlayElem.style.width = opacityHackSize + "px";
                        mOverlayElem.style.height = opacityHackSize + "px";
                    } else {
                        mOverlayElem.style.left = "0px";
                        mOverlayElem.style.top = "0px";
                        mOverlayElem.style.width = "100%";
                        mOverlayElem.style.height = "100%";
                    };
                    mOverlayElem.style.zIndex = 1;
                    mOverlayElem.style.backgroundColor = self.getOverlayColor();
                    map.MapUtil.setElementOpacity(mOverlayElem, propValue);
                    parentElement.appendChild(mOverlayElem);
                }
            } else {
                map.MapUtil.setElementOpacity(mOverlayElem, propValue);
            }
        }
    };
    self._modifyOverlayColor = function() {
        if (mOverlayElem != null) {
            mOverlayElem.style.backgroundColor = self.getOverlayColor();
        }
    };
    self.getShownZoom = function() {
        return self.getMap().getZoom();
    };
    self.getRequestBuilder = function() {
        return requestBuilder;
    };
    self.onMouseDown = function(evt) {
        var EventUtils = com.ptvag.webcomponent.util.EventUtils;
        if (evt.shiftKey || evt.altKey || evt.metaKey || (evt.ctrlKey && !qxp.sys.Client.getInstance().runsOnMacintosh())) {
            return false;
        };
        if (self.isPositionInArea(evt.relMouseX, evt.relMouseY)) {
            cancelMouseAction();
            var actionMode = self.getMap().getController().getActionMode();
            var actionModeMove = (actionMode == map.MapController.ACTION_MODE_MOVE);
            if (actionModeMove ? EventUtils.isLeftMouseButton(evt) : EventUtils.isRightMouseButton(evt)) {
                mInPanningMode = true;
                self.getMap().setCenterIsAdjusting(true);
                self.getMap().setConfigurableCursor("move");
            } else if (actionModeMove ? EventUtils.isRightMouseButton(evt) : EventUtils.isLeftMouseButton(evt)) {
                mInZoomBoxMode = true;
                self.getMap().setConfigurableCursor("zoom");
            } else {
                return false;
            };
            self.getMap().getController().setActiveLayer(self);
            mStartMouseX = evt.relMouseX;
            mStartMouseY = evt.relMouseY;
            return true;
        };
        return false;
    };
    self.onMouseUp = function(evt) {
        var retVal = false;
        if (mInPanningMode || mInZoomBoxMode) {
            retVal = true;
            var theMap = self.getMap();
            var distanceX = mStartMouseX - evt.relMouseX;
            var distanceY = mStartMouseY - evt.relMouseY;
            var distanceSquared = distanceX * distanceX + distanceY * distanceY;
            if (distanceSquared <= map.layer.AbstractMapLayer.MAX_CLICK_TOLERANCE_SQUARED) {
                retVal = false;
            };
            self.getMap().startLoggingAction(mInPanningMode ? "user:move" : "user:rectZoom");
            try {
                if (mInZoomBoxMode) {
                    cancelMouseAction();
                    var areaLeft = self.getComputedAreaLeft();
                    var areaTop = self.getComputedAreaTop();
                    var areaWidth = self.getComputedAreaWidth();
                    var areaHeight = self.getComputedAreaHeight();
                    var boxEndX = Math.max(areaLeft, Math.min(areaLeft + areaWidth, evt.relMouseX));
                    var boxEndY = Math.max(areaTop, Math.min(areaTop + areaHeight, evt.relMouseY));
                    var startRelPix = getPositionFromCenter({
                        x: mStartMouseX,
                        y: mStartMouseY
                    });
                    var endRelPix = getPositionFromCenter({
                        x: boxEndX,
                        y: boxEndY
                    });
                    var boxWidthPix = Math.abs(startRelPix.x - endRelPix.x);
                    var boxHeightPix = Math.abs(startRelPix.y - endRelPix.y);
                    var minBoxSize = map.layer.AbstractMapLayer.MIN_ZOOM_BOX_SIZE;
                    if (boxWidthPix > minBoxSize && boxHeightPix > minBoxSize) {
                        var shownZoom = self.getShownZoom();
                        var mapZoom = self.getMap().getZoom();
                        var zoomFactor = Math.pow(map.CoordUtil.ZOOM_LEVEL_FACTOR, shownZoom - mapZoom);
                        var mapCenterSu = self.getMap().getCenter();
                        var mapCenterAbsPix = map.CoordUtil.smartUnit2Pixel(mapCenterSu, shownZoom);
                        var boxCenterAbsPix = theMap.transformPixelCoords((startRelPix.x + endRelPix.x) / 2, (startRelPix.y + endRelPix.y) / 2, true, true, true);
                        boxCenterAbsPix.x = mapCenterAbsPix.x + boxCenterAbsPix.x;
                        boxCenterAbsPix.y = mapCenterAbsPix.y - boxCenterAbsPix.y;
                        var boxCenterSu = map.CoordUtil.pixel2SmartUnit(boxCenterAbsPix, shownZoom);
                        var suPerPixel = map.CoordUtil.getSmartUnitsPerPixel(shownZoom);
                        var boxWidthSu = boxWidthPix * suPerPixel;
                        var boxHeightSu = boxHeightPix * suPerPixel;
                        var newSuPerPixel;
                        if (self.getApplyZoomRectToMainMap()) {
                            var mapWidthPix = self.getMap().getWidth();
                            var mapHeightPix = self.getMap().getHeight();
                            newSuPerPixel = Math.max(boxWidthSu / mapWidthPix, boxHeightSu / mapHeightPix);
                        } else {
                            var scaledAreaWidthPix = areaWidth * zoomFactor;
                            var scaledAreaHeightPix = areaWidth * zoomFactor;
                            newSuPerPixel = Math.max(boxWidthSu / scaledAreaWidthPix, boxHeightSu / scaledAreaHeightPix);
                        };
                        var alreadyInBulkMode = self.getMap().inBulkMode();
                        if (!alreadyInBulkMode) {
                            self.getMap().startBulkMode();
                        };
                        self.getMap().setZoomInSmartUnitsPerPixel(newSuPerPixel);
                        self.getMap().setCenter(boxCenterSu);
                        if (!alreadyInBulkMode) {
                            self.getMap().endBulkMode();
                        }
                    }
                } else {
                    cancelMouseAction();
                }
            } finally {
                self.getMap().endLoggingAction();
            }
        };
        return retVal;
    };
    self.onMouseOut = function(evt) {
        if (mInPanningMode) {
            self.getMap().startLoggingAction("user:move");
            try {
                cancelMouseAction();
            } finally {
                self.getMap().endLoggingAction();
            }
        } else {
            cancelMouseAction();
        };
        return false;
    };
    self.onMouseMove = function(evt) {
        var mapInstance = self.getMap();
        var lastMousePos = mapInstance.getController().getLastMousePositon();
        if (mInPanningMode && lastMousePos.x && lastMousePos.y) {
            var shownZoom = self.getShownZoom();
            var centerSu = mapInstance.getCenter();
            var centerPix = map.CoordUtil.smartUnit2Pixel(centerSu, shownZoom);
            var offsetX = lastMousePos.x - evt.relMouseX;
            var offsetY = lastMousePos.y - evt.relMouseY;
            var rotatedCoords = mapInstance.transformPixelCoords(offsetX, offsetY, true, true, true);
            offsetX = rotatedCoords.x;
            offsetY = rotatedCoords.y;
            var newCenterPix = {
                x: centerPix.x + offsetX,
                y: centerPix.y - offsetY
            };
            var animate = mapInstance.getAnimate();
            if (animate) {
                mapInstance.setAnimate(false);
            };
            var autoBulkMode = mapInstance.getUseAutoBulkMode();
            if (autoBulkMode) {
                mapInstance.setUseAutoBulkMode(false);
            };
            var mapZoom = mapInstance.getZoom();
            if (shownZoom != mapZoom) {
                var shownTileWidth = map.CoordUtil.getTileWidth(shownZoom);
                var mapTileWidth = map.CoordUtil.getTileWidth(mapZoom);
                var factor = shownTileWidth / mapTileWidth;
                offsetX *= factor;
                offsetY *= factor;
            };
            var relativeOffset = mapInstance.getRelativeOffset();
            mapInstance.setRelativeOffset({
                x: relativeOffset.x + offsetX,
                y: relativeOffset.y + offsetY
            });
            mapInstance.setCenter(map.CoordUtil.pixel2SmartUnit(newCenterPix, shownZoom));
            if (animate) {
                mapInstance.setAnimate(true);
            };
            if (autoBulkMode) {
                mapInstance.setUseAutoBulkMode(true);
            }
        } else if (mInZoomBoxMode) {
            var areaLeft = self.getComputedAreaLeft();
            var areaTop = self.getComputedAreaTop();
            var areaWidth = self.getComputedAreaWidth();
            var areaHeight = self.getComputedAreaHeight();
            var boxEndX = Math.max(areaLeft, Math.min(areaLeft + areaWidth, evt.relMouseX));
            var boxEndY = Math.max(areaTop, Math.min(areaTop + areaHeight, evt.relMouseY));
            mapInstance.showZoomBox(mStartMouseX, mStartMouseY, boxEndX, boxEndY);
        };
        return false;
    };
    self.onMouseWheel = function(evt) {
        var theMap = self.getMap();
        var mapController = theMap.getController();
        var lastMousePos = mapController.getLastMousePositon();
        if (theMap.getAllowMouseWheelZoom() && self.isPositionInArea(lastMousePos.x, lastMousePos.y)) {
            if (mapController.getActiveLayer() == null) {
                var wheelTicks = evt.wheelTicks;
                if (theMap.getInverseWheelZoom()) {
                    wheelTicks = -wheelTicks;
                };
                if (mWheelTimeout != null) {
                    window.clearTimeout(mWheelTimeout);
                    mWheelTicks += wheelTicks;
                } else {
                    mWheelTicks = wheelTicks;
                };
                mWheelTimeout = window.setTimeout(function() {
                    if (mWheelTimeout == null) {
                        return;
                    };
                    mWheelTimeout = null;
                    var centerPos = getPositionFromCenter({
                        x: lastMousePos.x,
                        y: lastMousePos.y
                    });
                    theMap.zoomToPixelCoords(centerPos.x, centerPos.y, true, mWheelTicks, self.getShownZoom() - theMap.getZoom(), true);
                }, 150);
            };
            return true;
        };
        return false;
    };
    self.onMouseDblClick = function(evt) {
        var theMap = self.getMap();
        var mapController = theMap.getController();
        var lastMousePos = mapController.getLastMousePositon();
        if (theMap.getAllowDoubleClickZoom() && self.isPositionInArea(lastMousePos.x, lastMousePos.y)) {
            if (mapController.getActiveLayer() == null) {
                var centerPos = getPositionFromCenter({
                    x: lastMousePos.x,
                    y: lastMousePos.y
                });
                theMap.zoomToPixelCoords(centerPos.x, centerPos.y, true, -2, self.getShownZoom() - theMap.getZoom(), true);
            };
            return true;
        };
        return false;
    };
    self.onRightMouseDblClick = function(evt) {
        var theMap = self.getMap();
        var mapController = theMap.getController();
        var lastMousePos = mapController.getLastMousePositon();
        if (theMap.getAllowDoubleRightClickZoom() && self.isPositionInArea(lastMousePos.x, lastMousePos.y)) {
            if (mapController.getActiveLayer() == null) {
                var centerPos = getPositionFromCenter({
                    x: lastMousePos.x,
                    y: lastMousePos.y
                });
                theMap.zoomToPixelCoords(centerPos.x, centerPos.y, true, 2, self.getShownZoom() - theMap.getZoom(), true);
            };
            return true;
        };
        return false;
    };
    self.onKeyDown = function(evt) {
        var EventUtils = com.ptvag.webcomponent.util.EventUtils;
        var theMap = self.getMap();
        if (mInZoomBoxMode && evt.keyCode == EventUtils.KEY_CODE_ESC) {
            cancelMouseAction();
            theMap.getController().ignoreNextClick();
            return true;
        };
        if (!theMap.enableKeyboardControl()) {
            return false;
        };
        var consumed = false;
        if (evt.keyCode == EventUtils.KEY_CODE_LEFT) {
            theMap.moveCenterInPercent(-0.5, 0, true);
            consumed = true;
        } else if (evt.keyCode == EventUtils.KEY_CODE_RIGHT) {
            theMap.moveCenterInPercent(0.5, 0, true);
            consumed = true;
        } else if (evt.keyCode == EventUtils.KEY_CODE_UP) {
            theMap.moveCenterInPercent(0, 0.5, true);
            consumed = true;
        } else if (evt.keyCode == EventUtils.KEY_CODE_DOWN) {
            theMap.moveCenterInPercent(0, -0.5, true);
            consumed = true;
        } else if (evt.keyCode == EventUtils.KEY_CODE_PLUS || evt.keyCode == EventUtils.KEY_CODE_KEYPAD_PLUS) {
            theMap.setZoom(Math.ceil(theMap.getVisibleZoom() - 1));
            consumed = true;
        } else if (evt.keyCode == EventUtils.KEY_CODE_MINUS || evt.keyCode == EventUtils.KEY_CODE_KEYPAD_MINUS) {
            theMap.setZoom(Math.floor(theMap.getVisibleZoom() + 1));
            consumed = true;
        } else if (evt.keyCode == 88 && theMap.enableKeyboardRotation()) {
            theMap.setRotation((Math.floor(theMap.getVisibleRotation() / 15) + 1) * 15);
            consumed = true;
        } else if (evt.keyCode == 86 && theMap.enableKeyboardRotation()) {
            theMap.setRotation((Math.ceil(theMap.getVisibleRotation() / 15) - 1) * 15);
            consumed = true;
        };
        return consumed;
    };
    var getPositionFromCenter = function(relPixPoint) {
        return {
            x: relPixPoint.x - self.getComputedAreaLeft() - self.getComputedAreaWidth() / 2,
            y: relPixPoint.y - self.getComputedAreaTop() - self.getComputedAreaHeight() / 2
        };
    };
    var cancelMouseAction = function() {
        if (mInZoomBoxMode) {
            self.getMap().hideZoomBox();
        };
        self.getMap().setConfigurableCursor("default");
        self.getMap().setCenterIsAdjusting(false);
        self.getMap().getController().setActiveLayer(null);
        mInPanningMode = false;
        mInZoomBoxMode = false;
    };
    self.isInZoomBoxMode = function() {
        return mInZoomBoxMode;
    };
    self.setServerLayerVisible = function(layer, visible) {
        requestBuilder.setVisible(layer, visible);
    };
    self.doPrintStaticArea = function(ctx, htmlContainer, htmlBackground) {
        ctx.globalAlpha = self.getLayerOpacity();
        self.doPrintMap(ctx, htmlContainer, htmlBackground);
        var areaBorderWidth = self.getAreaBorderWidth();
        if (areaBorderWidth) {
            ctx.strokeStyle = "rgb(128, 128, 128)";
            ctx.lineWidth = areaBorderWidth;
            ctx.lineCap = "butt";
            ctx.lineJoin = "miter";
            ctx.beginPath();
            ctx.rect(parseInt(self.getComputedAreaLeft() + areaBorderWidth / 2), parseInt(self.getComputedAreaTop() + areaBorderWidth / 2), self.getComputedAreaWidth() - areaBorderWidth, self.getComputedAreaHeight() - areaBorderWidth);
            ctx.stroke();
        };
        var overlayOpacity = self.getOverlayOpacity();
        if (overlayOpacity != 0) {
            ctx.globalAlpha = overlayOpacity;
            ctx.fillStyle = self.getOverlayColor();
            ctx.beginPath();
            ctx.rect(self.getComputedAreaLeft(), self.getComputedAreaTop(), self.getComputedAreaWidth(), self.getComputedAreaHeight());
            ctx.fill();
        };
        ctx.globalAlpha = 1;
    };
    self.doPrintMap = function(ctx, htmlContainer, htmlBackground) {};
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        mOverlayElem = null;
        superDispose.call(self);
    };
});
qxp.Class.MIN_ZOOM_BOX_SIZE = 10;
qxp.Class.MAX_CLICK_TOLERANCE = 5;
qxp.Class.MAX_CLICK_TOLERANCE_SQUARED = qxp.Class.MAX_CLICK_TOLERANCE * qxp.Class.MAX_CLICK_TOLERANCE;
qxp.OO.changeProperty({
    name: "areaLeft",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0
});
qxp.OO.changeProperty({
    name: "areaRight",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0
});
qxp.OO.changeProperty({
    name: "areaTop",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0
});
qxp.OO.changeProperty({
    name: "areaBottom",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0
});
qxp.OO.changeProperty({
    name: "areaOpacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1
});
qxp.OO.addProperty({
    name: "overlayColor",
    type: qxp.constant.Type.STRING,
    defaultValue: "#000000"
});
qxp.OO.addProperty({
    name: "overlayOpacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "layerOpacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1
});
qxp.OO.addProperty({
    name: "applyZoomRectToMainMap",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});
qxp.OO.changeProperty({
    name: "autoRotate",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});




/* ID: com.ptvag.webcomponent.map.layer.TileMapLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.TileMapLayer", com.ptvag.webcomponent.map.layer.AbstractMapLayer, function(requestBuilder) {
    com.ptvag.webcomponent.map.layer.AbstractMapLayer.call(this, requestBuilder);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mImgLayer;
    var mBackgroundImgLayer;
    var mMapVersion = null;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        mMapVersion = self.getMap().getMapVersion();
        mImgLayer = createImgLayer(self.getMap().getZoom());
        if (self.isEnabled()) {
            updateContent({});
        }
    };
    var superOnViewChanged = self.onViewChanged;
    self.onViewChanged = function(evt) {
        superOnViewChanged(evt);
        updateContent(evt);
    };
    var updateContent = function(evt) {
        var imageLoader = self.getImageLoader();
        if (imageLoader == null) {
            imageLoader = map.ImageLoader;
        };
        var newZoom = self.getMap().getZoom();
        if (newZoom != mImgLayer.zoom || evt.clipRectChanged) {
            if (getLoadedFactor(mImgLayer) < map.layer.TileMapLayer.MIN_LOADED_FACTOR) {
                cleanUpImgLayer(mImgLayer);
                if (evt.clipRectChanged) {
                    cleanUpImgLayer(mBackgroundImgLayer);
                    mBackgroundImgLayer = null;
                }
            } else {
                cleanUpImgLayer(mBackgroundImgLayer);
                if (evt.clipRectChanged) {
                    cleanUpImgLayer(mImgLayer);
                    mImgLayer = null;
                };
                mBackgroundImgLayer = mImgLayer;
            };
            mImgLayer = createImgLayer(newZoom);
            if (mBackgroundImgLayer != null) {
                for (var y = 0; y < mBackgroundImgLayer.imgArr.length; y++) {
                    var imgRow = mBackgroundImgLayer.imgArr[y];
                    for (var x = 0; x < imgRow.length; x++) {
                        var imgElem = imgRow[x];
                        if (imgElem._imgId) {
                            imageLoader.abortLoading(imgElem._imgId);
                        }
                    }
                }
            }
        };
        var centerSuPt = self.getMap().getCenter();
        var centerPixPt = map.CoordUtil.smartUnit2Pixel(centerSuPt, newZoom);
        var tileWidth = map.CoordUtil.TILE_WIDTH;
        var borderTileCount = map.layer.TileMapLayer.BORDER_TILE_COUNT;
        var areaWidth = self.getComputedAreaWidth();
        var areaHeight = self.getComputedAreaHeight();
        var leftPix = centerPixPt.x - areaWidth / 2;
        var bottomPix = centerPixPt.y - areaHeight / 2;
        var leftTileOffset = leftPix % tileWidth;
        if (leftTileOffset < 0) {
            leftTileOffset += tileWidth;
        };
        leftTileOffset += borderTileCount * tileWidth;
        var bottomTileOffset = bottomPix % tileWidth;
        if (bottomTileOffset < 0) {
            bottomTileOffset += tileWidth;
        };
        bottomTileOffset += borderTileCount * tileWidth;
        var oldStartTileX = mImgLayer.startTileX;
        var oldStartTileY = mImgLayer.startTileY;
        mImgLayer.startTileX = Math.floor(leftPix / tileWidth) - borderTileCount;
        mImgLayer.startTileY = Math.floor(bottomPix / tileWidth) - borderTileCount;
        var oldTileXCount = mImgLayer.tileXCount;
        var oldTileYCount = mImgLayer.tileYCount;
        mImgLayer.tileXCount = Math.ceil((leftTileOffset + areaWidth) / tileWidth) + borderTileCount;
        mImgLayer.tileYCount = Math.ceil((bottomTileOffset + areaHeight) / tileWidth) + borderTileCount;
        var visibleCenter = self.getMap().getVisibleCenter();
        var visibleZoom = self.getMap().getVisibleZoom();
        if (mBackgroundImgLayer != null) {
            setVisibleZoomForImgLayer(mBackgroundImgLayer, visibleZoom);
            setCenterForImgLayer(mBackgroundImgLayer, visibleCenter);
        };
        setVisibleZoomForImgLayer(mImgLayer, visibleZoom);
        setCenterForImgLayer(mImgLayer, visibleCenter);
        if (mImgLayer.startTileX != oldStartTileX || mImgLayer.startTileY != oldStartTileY || oldTileXCount != mImgLayer.tileXCount || oldTileYCount != mImgLayer.tileYCount) {
            var imgJobArr = [];
            var deltaY = oldStartTileY - mImgLayer.startTileY;
            if (deltaY < 0) {
                var removeBeginRowCount = Math.min(-deltaY, mImgLayer.imgArr.length);
                for (var i = 0; i < removeBeginRowCount; i++) {
                    var imgRow = mImgLayer.imgArr.shift();
                    for (var x = 0; x < imgRow.length; x++) {
                        cleanUpImgElem(imgRow[x]);
                    }
                }
            } else {
                var addBeginRowCount = Math.min(deltaY, mImgLayer.tileYCount);
                for (var i = 0; i < addBeginRowCount; i++) {
                    mImgLayer.imgArr.unshift([]);
                }
            };
            var removeEndRowCount = mImgLayer.imgArr.length - mImgLayer.tileYCount;
            for (var i = 0; i < removeEndRowCount; i++) {
                var imgRow = mImgLayer.imgArr.pop();
                for (var x = 0; x < imgRow.length; x++) {
                    cleanUpImgElem(imgRow[x]);
                }
            };
            var deltaX = oldStartTileX - mImgLayer.startTileX;
            for (var y = mImgLayer.tileYCount - 1; y >= 0; y--) {
                var imgRow = mImgLayer.imgArr[y];
                if (imgRow == null) {
                    mImgLayer.imgArr[y] = imgRow = [];
                };
                if (deltaX < 0) {
                    var removeLeftCount = Math.min(-deltaX, imgRow.length);
                    for (var i = 0; i < removeLeftCount; i++) {
                        cleanUpImgElem(imgRow.shift());
                    }
                } else {
                    var addLeftCount = Math.min(deltaX, mImgLayer.tileXCount);
                    for (var x = addLeftCount - 1; x >= 0; x--) {
                        imgRow.unshift(createImgElem(mImgLayer, x, y, tileWidth, imgJobArr));
                    }
                };
                for (var x = imgRow.length; x < mImgLayer.tileXCount; x++) {
                    imgRow.push(createImgElem(mImgLayer, x, y, tileWidth, imgJobArr));
                };
                for (var i = imgRow.length - 1; i >= mImgLayer.tileXCount; i--) {
                    cleanUpImgElem(imgRow.pop());
                }
            };
            imgJobArr.sort(imageJobComparator);
            for (var i = 0; i < imgJobArr.length; i++) {
                var job = imgJobArr[i];
                job.imgElem._imgId = imageLoader.loadImage(job.imgElem, job.imgInfo.url, onImgLoaded, null, imageLoader.getDefaultTimeout() * 2, true);
                job.imgElem._clipTop = job.imgInfo.clipTop;
                job.imgElem._clipLeft = job.imgInfo.clipLeft;
                job.imgElem._width = job.imgInfo.width;
                job.imgElem._height = job.imgInfo.height;
            };
            updateTileOffsets(mImgLayer, tileWidth);
        }
    };
    var createImgElem = function(imgLayer, x, y, tileWidth, imgJobArr) {
        var imageLoader = self.getImageLoader();
        if (imageLoader == null) {
            imageLoader = map.ImageLoader;
        };
        var imgElem = imageLoader.createElement();
        imgElem.style.position = "absolute";
        imgElem.style.visibility = "hidden";
        imgElem.style.width = tileWidth + "px";
        imgElem.style.height = tileWidth + "px";
        imgElem.style.MozUserSelect = "none";
        imgElem._imgLayer = imgLayer;
        imgLayer.imgParent.appendChild(imgElem);
        if (self.showTileBoundaries()) {
            var debugElem = document.createElement("div");
            debugElem.style.position = "absolute";
            debugElem.style.width = tileWidth + "px";
            debugElem.style.height = tileWidth + "px";
            debugElem.style.MozBoxSizing = "border-box";
            debugElem.style.borderLeft = "1px dashed black";
            debugElem.style.borderTop = "1px dashed black";
            debugElem.style.zIndex = 1000;
            imgElem._debugElem = debugElem;
            imgLayer.imgParent.appendChild(debugElem);
        };
        var tilePoint = {
            x: (mImgLayer.startTileX + x),
            y: (mImgLayer.startTileY + y)
        };
        var zoomLevel = self.getMap().getZoom();
        var fromSuPoint = map.CoordUtil.tile2SmartUnit(tilePoint, zoomLevel);
        var fromMercPoint = map.CoordUtil.smartUnit2Mercator(fromSuPoint);
        var toTilePoint = {
            x: tilePoint.x + 1,
            y: tilePoint.y + 1
        };
        var toSuPoint = map.CoordUtil.tile2SmartUnit(toTilePoint, zoomLevel);
        var toMercPoint = map.CoordUtil.smartUnit2Mercator(toSuPoint);
        var left = fromMercPoint.x;
        var bottom = fromMercPoint.y;
        var right = toMercPoint.x;
        var top = toMercPoint.y;
        var imgInfo = requestBuilder.buildRequest(left, top, right, bottom, map.CoordUtil.TILE_WIDTH, map.CoordUtil.TILE_WIDTH, null, mMapVersion);
        if (!imgInfo.completelyClipped) {
            var distX = x + 0.5 - mImgLayer.tileXCount / 2;
            var distY = y + 0.5 - mImgLayer.tileYCount / 2;
            var centerDistance = distX * distX + distY * distY;
            imgJobArr.push({
                x: x,
                y: y,
                centerDistance: centerDistance,
                imgElem: imgElem,
                imgInfo: imgInfo
            });
            imgLayer.totalImageCount++;
        };
        return imgElem;
    };
    var cleanUpImgElem = function(imgElem, inDispose) {
        if (imgElem._imgId) {
            if (!imgElem._loaded || !inDispose) {
                var imageLoader = self.getImageLoader();
                if (imageLoader == null) {
                    imageLoader = map.ImageLoader;
                };
                imageLoader.abortLoading(imgElem._imgId, true);
            };
            imgElem._imgLayer.totalImageCount--;
            imgElem._imgId = null;
        };
        if (imgElem._loaded) {
            imgElem._imgLayer.loadedImageCount--;
        };
        imgElem._imgLayer = null;
        imgElem._debugElem = null;
        return imgElem;
    };
    var createImgLayer = function(zoom) {
        var imgParent = document.createElement("div");
        imgParent.style.position = "absolute";
        self.getAreaElement().appendChild(imgParent);
        return {
            imgParent: imgParent,
            imgArr: [],
            zoom: zoom,
            visibleZoom: zoom,
            scaleFactor: 1,
            tileWidthPix: map.CoordUtil.TILE_WIDTH,
            nativeTileWidthSu: map.CoordUtil.getTileWidth(zoom),
            totalImageCount: 0,
            loadedImageCount: 0
        };
    };
    var cleanUpImgLayer = function(imgLayer, inDispose) {
        if (imgLayer) {
            for (var y = 0; y < imgLayer.imgArr.length; y++) {
                var imgRow = imgLayer.imgArr[y];
                for (var x = 0; x < imgRow.length; x++) {
                    cleanUpImgElem(imgRow[x], inDispose);
                }
            };
            imgLayer.imgArr = [];
            if (!inDispose) {
                self.getAreaElement().removeChild(imgLayer.imgParent);
            };
            imgLayer.totalImageCount = 0;
            imgLayer.loadedImageCount = 0;
        }
    };
    var imageJobComparator = function(job1, job2) {
        return (job1.centerDistance > job2.centerDistance) ? 1 : -1;
    };
    var setVisibleZoomForImgLayer = function(imgLayer, zoom) {
        if (imgLayer.visibleZoom != zoom) {
            var scaleFactor = imgLayer.nativeTileWidthSu / map.CoordUtil.getTileWidth(zoom);
            var scaledTileWidth = Math.round(map.CoordUtil.TILE_WIDTH * scaleFactor);
            if (scaledTileWidth > map.MapUtil.MAX_IMAGE_SCALE_WIDTH || scaledTileWidth < map.MapUtil.MIN_IMAGE_SCALE_WIDTH) {
                imgLayer.imgParent.style.visibility = "hidden";
            } else {
                imgLayer.imgParent.style.visibility = "";
                updateTileOffsets(imgLayer, scaledTileWidth);
            };
            imgLayer.visibleZoom = zoom;
            imgLayer.scaleFactor = scaleFactor;
            imgLayer.tileWidthPix = scaledTileWidth;
        }
    };
    var setCenterForImgLayer = function(imgLayer, centerSuPt) {
        var tileWidthPix = imgLayer.tileWidthPix;
        var layerLeftPix = imgLayer.startTileX * tileWidthPix;
        var layerBottomPix = imgLayer.startTileY * tileWidthPix;
        var layerHeight = imgLayer.tileYCount * tileWidthPix;
        var layerTopPix = layerBottomPix + layerHeight;
        var tileWidthSu = imgLayer.nativeTileWidthSu * map.CoordUtil.TILE_WIDTH / tileWidthPix;
        var centerPixPt = map.CoordUtil.smartUnit2PixelByTileWidth(centerSuPt, tileWidthSu);
        var mapLeftPix = centerPixPt.x - self.getComputedAreaWidth() / 2;
        var mapTopPix = centerPixPt.y + self.getComputedAreaHeight() / 2;
        var offsetX = 0;
        var offsetY = 0;
        if (self.isRelative()) {
            var relativeOffset = self.getMap().getRelativeOffset();
            offsetX = Math.round(relativeOffset.x);
            offsetY = Math.round(relativeOffset.y);
        };
        var areaBorderWidth = self.getAreaBorderWidth();
        offsetX -= areaBorderWidth;
        offsetY -= areaBorderWidth;
        imgLayer.imgParent.style.left = offsetX + Math.round(layerLeftPix - mapLeftPix) + "px";
        imgLayer.imgParent.style.top = offsetY + Math.round(-(layerTopPix - mapTopPix)) + "px";
    };
    var updateTileOffsets = function(imgLayer, tileWidth) {
        var debugOffset = 0;
        var scaleFactor = tileWidth / map.CoordUtil.TILE_WIDTH;
        var rowCount = imgLayer.imgArr.length;
        for (var y = 0; y < rowCount; y++) {
            var imgRow = imgLayer.imgArr[y];
            for (var x = 0; x < imgRow.length; x++) {
                var imgElem = imgRow[x];
                if (imgElem._imgId != null) {
                    var left = Math.round(x * (tileWidth + debugOffset));
                    if (imgElem._clipLeft != 0) {
                        left += Math.ceil(imgElem._clipLeft * scaleFactor);
                    };
                    imgElem.style.left = left + "px";
                    var top = Math.round((rowCount - y - 1) * (tileWidth + debugOffset));
                    if (imgElem._clipTop != 0) {
                        top += Math.ceil(imgElem._clipTop * scaleFactor);
                    };
                    imgElem.style.top = top + "px";
                    if (imgElem._debugElem) {
                        if (scaleFactor == 1) {
                            imgElem._debugElem.style.left = left + "px";
                            imgElem._debugElem.style.top = top + "px";
                        } else {
                            imgElem._debugElem.style.visibility = "hidden";
                        }
                    };
                    imgElem.style.width = Math.round(imgElem._width * scaleFactor) + "px";
                    imgElem.style.height = Math.round(imgElem._height * scaleFactor) + "px";
                }
            }
        }
    };
    var onImgLoaded = function(imgElem, url, exc) {
        if (exc == null) {
            imgElem._loaded = true;
            window.setTimeout(function() {
                if (!self.getDisposed()) {
                    imgElem.style.visibility = "";
                }
            }, 50);
            if (imgElem._imgLayer != null) {
                imgElem._imgLayer.loadedImageCount++;
            };
            if (imgElem._imgLayer == mImgLayer) {
                if (mImgLayer.loadedImageCount == mImgLayer.totalImageCount) {
                    if (self.getRemoveUnusedElements()) {
                        cleanUpImgLayer(mBackgroundImgLayer);
                        mBackgroundImgLayer = null;
                    }
                }
            }
        }
    };
    var getLoadedFactor = function(imgLayer) {
        return (imgLayer.totalImageCount == 0) ? 0 : (imgLayer.loadedImageCount / imgLayer.totalImageCount);
    };
    self.repaint = function() {
        updateContent({
            clipRectChanged: true
        });
    };
    self.doPrintMap = function(ctx, htmlContainer, htmlBackground) {
        if (mImgLayer) {
            var offsetX = 0;
            var offsetY = 0;
            if (self.isRelative()) {
                var relativeOffset = self.getMap().getRelativeOffset();
                offsetX = Math.round(relativeOffset.x);
                offsetY = Math.round(relativeOffset.y);
            };
            var areaBorderWidth = self.getAreaBorderWidth();
            offsetX -= parseInt(mImgLayer.imgParent.style.left) + areaBorderWidth;
            offsetY -= parseInt(mImgLayer.imgParent.style.top) + areaBorderWidth;
            var mapWidth = self.getMap().getWidth();
            var mapHeight = self.getMap().getHeight();
            var imgRowCount = mImgLayer.imgArr.length;
            for (var i = 0; i < imgRowCount;
                ++i) {
                var imgRow = mImgLayer.imgArr[i];
                var imgCount = imgRow.length;
                for (var j = 0; j < imgCount;
                    ++j) {
                    var imgElem = imgRow[j];
                    if (imgElem._loaded) {
                        var left = self.getComputedAreaLeft() + parseInt(imgElem.style.left) - offsetX;
                        var top = self.getComputedAreaTop() + parseInt(imgElem.style.top) - offsetY;
                        var width = parseInt(imgElem.style.width);
                        var height = parseInt(imgElem.style.height);
                        var doDraw = (left < mapWidth && left + width > 0 && top < mapHeight && top + height > 0);
                        if (doDraw || (self.getAutoRotate() && self.getMap().getVisibleRotation() != 0)) {
                            ctx.drawImage(imgElem, 0, 0, imgElem._width, imgElem._height, self.getComputedAreaLeft() + parseInt(imgElem.style.left) - offsetX, self.getComputedAreaTop() + parseInt(imgElem.style.top) - offsetY, parseInt(imgElem.style.width), parseInt(imgElem.style.height));
                        }
                    }
                }
            }
        }
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        cleanUpImgLayer(mImgLayer, true);
        cleanUpImgLayer(mBackgroundImgLayer, true);
        superDispose.call(self);
    };
});
qxp.OO.addProperty({
    name: "removeUnusedElements",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "showTileBoundaries",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    getAlias: "showTileBoundaries"
});
qxp.OO.addProperty({
    name: "imageLoader",
    type: qxp.constant.Type.OBJECT,
    defaultValue: null
});
qxp.Class.BORDER_TILE_COUNT = 1;
qxp.Class.MIN_LOADED_FACTOR = 0.4;




/* ID: com.ptvag.webcomponent.map.PrintContext */
qxp.OO.defineClass("com.ptvag.webcomponent.map.PrintContext", qxp.core.Target, function(parentMap) {
    qxp.core.Target.apply(this, arguments);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var MapUtil = map.MapUtil;
    var mPrintService = null;
    var mPrintId = map.PrintContext.createPrintId();
    map.PrintContext.LAST_PRINT_ID = mPrintId;
    var mCommandQueue = ["refreshSession", {
        method: "begin",
        params: [parentMap.getWidth(), parentMap.getHeight()]
    }];
    var mCurrentCall;
    var mExc = null;
    var mStrokeStyle = "rgb(0, 0, 0)";
    var mFillStyle = "rgb(0, 0, 0)";
    var mLineWidth = 1;
    var mLineCap = "butt";
    var mLineJoin = "miter";
    var mFontFamily = "serif";
    var mFontStyle = "plain";
    var mFontSize = 10;
    var mTextAlignment = 34;
    var mGlobalAlpha = 1;
    self.strokeStyle = mStrokeStyle;
    self.fillStyle = mFillStyle;
    self.lineWidth = mLineWidth;
    self.lineCap = mLineCap;
    self.lineJoin = mLineJoin;
    self.fontFamily = mFontFamily;
    self.fontStyle = mFontStyle;
    self.fontSize = mFontSize;
    self.textAlignment = mTextAlignment;
    self.globalAlpha = mGlobalAlpha;
    var createMethod = function(name) {
        self[name] = function() {
            if (mStrokeStyle != self.strokeStyle) {
                mStrokeStyle = self.strokeStyle;
                var translatedColor = translateColor(mStrokeStyle);
                mCommandQueue.push({
                    method: "setStrokeStyle",
                    params: [translatedColor.r, translatedColor.g, translatedColor.b, translatedColor.a]
                });
            };
            if (mFillStyle != self.fillStyle) {
                mFillStyle = self.fillStyle;
                var translatedColor = translateColor(mFillStyle);
                mCommandQueue.push({
                    method: "setFillStyle",
                    params: [translatedColor.r, translatedColor.g, translatedColor.b, translatedColor.a]
                });
            };
            if (mLineWidth != self.lineWidth) {
                mLineWidth = self.lineWidth;
                mCommandQueue.push({
                    method: "setLineWidth",
                    params: [mLineWidth]
                });
            };
            if (mLineCap != self.lineCap) {
                mLineCap = self.lineCap;
                mCommandQueue.push({
                    method: "setLineCap",
                    params: [mLineCap]
                });
            };
            if (mLineJoin != self.lineJoin) {
                mLineJoin = self.lineJoin;
                mCommandQueue.push({
                    method: "setLineJoin",
                    params: [mLineJoin]
                });
            };
            if (name == "drawText") {
                if (mFontFamily != self.fontFamily) {
                    mFontFamily = self.fontFamily;
                    mCommandQueue.push({
                        method: "setFontFamily",
                        params: [mFontFamily]
                    });
                };
                if (mFontStyle != self.fontStyle) {
                    mFontStyle = self.fontStyle;
                    mCommandQueue.push({
                        method: "setFontStyle",
                        params: [mFontStyle]
                    });
                };
                if (mFontSize != self.fontSize) {
                    mFontSize = self.fontSize;
                    mCommandQueue.push({
                        method: "setFontSize",
                        params: [mFontSize]
                    });
                };
                if (mTextAlignment != self.textAlignment) {
                    mTextAlignment = self.textAlignment;
                    mCommandQueue.push({
                        method: "setTextAlignment",
                        params: [mTextAlignment]
                    });
                }
            };
            if (mGlobalAlpha != self.globalAlpha) {
                mGlobalAlpha = self.globalAlpha;
                mCommandQueue.push({
                    method: "setGlobalAlpha",
                    params: [mGlobalAlpha]
                });
            };
            mCommandQueue.push({
                method: name,
                params: arguments
            });
            self.processQueue();
        };
    };
    var translateColor = function(color) {
        var retVal = {
            a: 255
        };
        var match = MapUtil.RGB_REGEX.exec(color);
        if (match == null) {
            match = MapUtil.RGBA_REGEX.exec(color);
            if (match != null) {
                retVal.a = Math.round(parseFloat(match[4]) * 255);
            }
        };
        if (match == null) {
            var colorAsInt = parseInt(color.substring(1), 16);
            retVal.r = parseInt(colorAsInt / 65536);
            colorAsInt -= retVal.r * 65536;
            retVal.g = parseInt(colorAsInt / 256);
            retVal.b = colorAsInt - retVal.g * 256;
        } else {
            retVal.r = parseInt(match[1]);
            retVal.g = parseInt(match[2]);
            retVal.b = parseInt(match[3]);
        };
        return retVal;
    };
    createMethod("beginPath");
    createMethod("moveTo");
    createMethod("lineTo");
    createMethod("rect");
    createMethod("arc");
    createMethod("stroke");
    createMethod("fill");
    createMethod("drawText");
    createMethod("setClipRect");
    createMethod("clearClipRect");
    createMethod("setTransform");
    createMethod("save");
    createMethod("restore");
    self.drawImage = function(img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
        if (dx == null) {
            dx = sx;
            dy = sy;
            dwidth = swidth;
            dheight = sheight;
            sx = 0;
            sy = 0;
            swidth = -1;
            sheight = -1;
        };
        if (mGlobalAlpha != self.globalAlpha) {
            mGlobalAlpha = self.globalAlpha;
            mCommandQueue.push({
                method: "setGlobalAlpha",
                params: [mGlobalAlpha]
            });
        };
        var url = img.src;
        if (url.indexOf(qxp.core.ServerSettings.serverPathPrefix) == 0) {
            url = self.getPrintService().fixUrl(url);
        };
        mCommandQueue.push({
            method: "drawImage",
            params: [url, sx, sy, swidth, sheight, dx, dy, dwidth, dheight]
        });
        self.processQueue();
    };
    self.processQueue = function() {
        if (mCommandQueue.length == 0 || mCurrentCall != null || self.getDisposed()) {
            return;
        };
        var command = mCommandQueue[0];
        mCommandQueue.splice(0, 1);
        if (command != "refreshSession" && command.method != "drawImage") {
            for (var i = 0; i < self.getAggregateCommandCount() - 1;
                ++i) {
                if (mCommandQueue.length == 0) {
                    break;
                };
                var nextCommand = mCommandQueue[0];
                if (nextCommand.method == "drawImage") {
                    break;
                };
                mCommandQueue.splice(0, 1);
                command.method += "," + nextCommand.method;
                if (i == 0) {
                    command.params = [MapUtil.convertArray(command.params)];
                };
                command.params.push(MapUtil.convertArray(nextCommand.params));
            }
        };
        if (mExc != null) {
            window.setTimeout(self.processQueue, 0);
            return;
        };
        if (command == "refreshSession") {
            self._ptv_map_waitCounter += 1;
            mCurrentCall = "refreshSession";
            self.getPrintService().refreshSession(function(result, exc) {
                self._ptv_map_waitCounter -= 1;
                mCurrentCall = null;
                if (!result) {
                    exc = new Error("Error refreshing session");
                };
                mExc = exc;
                if (mExc != null && !self.getDisposed()) {
                    self.error(mExc);
                };
                self.processQueue();
            });
        } else {
            var commandParams = command.params;
            var commandParamCount = commandParams.length;
            var rpcArgs = new Array(commandParamCount + 2);
            rpcArgs[0] = function(result, exc) {
                self._ptv_map_waitCounter -= 1;
                mCurrentCall = null;
                mExc = exc;
                if (mExc != null && !self.getDisposed()) {
                    self.error(mExc);
                };
                self.processQueue();
            };
            rpcArgs[1] = command.method;
            for (var i = 0; i < commandParamCount;
                ++i) {
                rpcArgs[i + 2] = commandParams[i];
            };
            self._ptv_map_waitCounter += 1;
            var printService = self.getPrintService();
            mCurrentCall = printService.callAsync.apply(printService, rpcArgs);
        }
    };
    self.end = function() {
        mCommandQueue.push({
            method: "end",
            params: arguments
        });
        self.processQueue();
    };
    self.getError = function() {
        return mExc;
    };
    self.isIdle = function() {
        if (self._ptv_map_waitCounter == 0 && mCommandQueue.length == 0) {
            return true;
        };
        return false;
    };
    self.getPrintImageURL = function() {
        return map.MapUtil.rewriteURL("/MapServlet?special=printimg&printId=" + mPrintId + "&" + map.RequestBuilder.getTokenName() + "=" + encodeURIComponent(map.RequestBuilder.getTokenValue()), false, "");
    };
    self.getAggregateCommandCount = function() {
        return 8;
    };
    self.getPrintService = function() {
        if (mPrintService == null) {
            mPrintService = new map.Rpc(parentMap, qxp.io.remote.Rpc.makeServerURL("" + mPrintId), "com.ptvag.webcomponent.map.printing.PrintService");
            mPrintService.setTimeout(20000);
            if (map.SERVICE.getCrossDomain()) {
                mPrintService.setCrossDomain(true);
            }
        };
        return mPrintService;
    };
    self.getPrintId = function() {
        return mPrintId;
    };
    self.getNextCommandName = function() {
        if (mCommandQueue.length == 0) {
            return null;
        };
        var command = mCommandQueue[0];
        if (command == "refreshSession") {
            return command;
        };
        return command.method;
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        if (mPrintService != null) {
            mPrintService.dispose();
        };
        superDispose.apply(self, arguments);
    };
    self._ptv_map_waitCounter = 0;
    window.setTimeout(self.processQueue, 0);
});
qxp.Class.LAST_PRINT_ID = null;
qxp.Class.createPrintId = function() {
    var printId = (new Date()).getTime();
    if (com.ptvag.webcomponent.map.PrintContext.LAST_PRINT_ID == printId) {
        printId += 1;
    };
    return printId;
};




/* ID: com.ptvag.webcomponent.map.FlashPrintContext */
qxp.OO.defineClass("com.ptvag.webcomponent.map.FlashPrintContext", com.ptvag.webcomponent.map.PrintContext, function(parentMap) {
    var map = com.ptvag.webcomponent.map;
    map.PrintContext.apply(this, arguments);
    var self = this;
    var FlashPrintContext = map.FlashPrintContext;
    var mFlashContainer;
    var mURLsToUpload = {};
    var mUploadFinished = false;
    var mEndReceived = false;
    var mFlashContainerAdded = false;
    var mWidth = parentMap.getWidth();
    var mHeight = parentMap.getHeight();
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        if (mFlashContainer != null) {
            mFlashContainer.parentNode.removeChild(mFlashContainer);
            mFlashContainer = null;
        };
        superDispose.call(self);
    };
    var superDrawImage = self.drawImage;
    self.drawImage = function(img) {
        var url = img.src;
        if (url.indexOf(qxp.core.ServerSettings.serverPathPrefix) != 0) {
            mURLsToUpload[url] = null;
        };
        superDrawImage.apply(self, arguments);
    };
    var superEnd = self.end;
    self.end = function() {
        mEndReceived = true;
        superEnd.apply(self, arguments);
    };
    var superProcessQueue = self.processQueue;
    self.processQueue = function() {
        if (mUploadFinished || self.getNextCommandName() != "drawImage") {
            superProcessQueue.apply(self, arguments);
            return;
        };
        if (!mEndReceived) {
            return;
        };
        mUploadFinished = true;
        for (var url in mURLsToUpload) {
            mUploadFinished = false;
            break;
        };
        if (mUploadFinished) {
            superProcessQueue.apply(self, arguments);
            return;
        };
        if (mFlashContainerAdded) {
            return;
        };
        mFlashContainerAdded = true;
        mFlashContainer = document.createElement("div");
        mFlashContainer.style.position = "absolute";
        mFlashContainer.style.left = "-" + mWidth + "px";
        mFlashContainer.style.top = "-" + mHeight + "px";
        var callbackId = FlashPrintContext.flashCallBackId++;
        var flashVars = "callbackId=" + callbackId + "&urls=";
        var i = 0;
        for (url in mURLsToUpload) {
            if (i > 0) {
                flashVars += "+";
            };
            flashVars += encodeURIComponent(url);
            ++i;
        };
        var serverSettings = qxp.core.ServerSettings;
        flashVars += "&prefix=" + encodeURIComponent(serverSettings.serverPathPrefix);
        var suffix = serverSettings.serverPathSuffix;
        if (suffix.indexOf("?") == -1) {
            suffix += "?printId=" + self.getPrintId();
        } else {
            suffix += "&printId=" + self.getPrintId();
        };
        flashVars += "&suffix=" + encodeURIComponent(suffix);
        mFlashContainer.innerHTML = com.ptvag.webcomponent.util.Flash.getFlashContent("src", com.ptvag.webcomponent.map.MapUtil.rewriteURL("swf/com/ptvag/webcomponent/map/PrintHelper", true), "width", mWidth, "height", mHeight, "quality", "high", "allowScriptAccess", "sameDomain", "type", "application/x-shockwave-flash", "FlashVars", flashVars, "id", "_ptv_map_printHelper_" + callbackId, "pluginspage", "http://www.adobe.com/go/getflashplayer");
        FlashPrintContext.flashCallBackListeners[callbackId] = function(id, result, exc) {
            mUploadFinished = true;
            self.processQueue();
        };
        document.body.appendChild(mFlashContainer);
    };
});
qxp.Class.flashCallBack = function(id, result, exc) {
    var FlashPrintContext = com.ptvag.webcomponent.map.FlashPrintContext;
    id = parseInt(id);
    if (id > 2000000000) {
        FlashPrintContext.flashCallBackId = 0;
    };
    var listener = FlashPrintContext.flashCallBackListeners[id];
    if (listener != null) {
        delete FlashPrintContext.flashCallBackListeners[id];
        var listenersFound = false;
        for (var key in FlashPrintContext.flashCallBackListeners) {
            listenersFound = true;
            break;
        };
        if (!listenersFound) {
            FlashPrintContext.flashCallBackListeners = {};
        };
        window.setTimeout(function() {
            listener(id, result, exc);
        }, 0);
    }
};
qxp.Class.flashCallBackListeners = {};
qxp.Class.flashCallBackId = 0;




/* ID: com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryRound */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryRound", com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryDefault, function() {
    com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryDefault.call(this);
    var self = this;
    self.setTipMargin(6);
    self.createRoundCorner = function(lengthArray, bgcolor, opacities, color, flipH, flipV) {
        var size = lengthArray.length;
        var count = opacities.length;
        retVal = new Array(size + count + 2);
        retVal[0] = '<div style="background-color:transparent;width:' + size + 'px;height:' + size + 'px;position:relative">';
        for (var i = 0; i < size;
            ++i) {
            var length = lengthArray[flipV ? (size - i - 1) : i];
            retVal[i + 1] = '<div style="border-top:1px solid ' + bgcolor + ';position:absolute;top:' + i + 'px;left:' + (flipH ? 0 : (size - length)) + 'px;width:' + length + 'px;height:0px"></div>';
        };
        var clientInstance = qxp.sys.Client.getInstance();
        for (i = 0; i < count;
            ++i) {
            var opacity = opacities[i];
            if (opacity.o == 1) {
                var opacityCSS = "";
            } else {
                if (clientInstance.isGecko()) {
                    opacityCSS = "-moz-opacity:" + opacity.o + ";";
                } else if (clientInstance.isKhtml()) {
                    opacityCSS = "-khtml-opacity:" + opacity.o + ";";
                } else if (qxp.sys.Client.getInstance().isMshtml()) {
                    opacityCSS = "filter:alpha(opacity=" + opacity.o * 100 + ");";
                } else {
                    opacityCSS = "opacity:" + opacity.o + ";";
                }
            };
            retVal[i + 1 + size] = '<div style="' + opacityCSS + 'border-top:1px solid ' + color + ';position:absolute;left:' + (flipH ? (size - opacity.x - opacity.w) : opacity.x) + 'px;top:' + (flipV ? (size - opacity.y - 1) : opacity.y) + 'px;width:' + opacity.w + 'px;height:0px"></div>';
        };
        retVal[size + count + 1] = '</div>';
        return retVal.join("");
    };
    self.createContentBox = function(content, bgcolor, allowWrap) {
        if (allowWrap == null) {
            allowWrap = self.getAllowWrap();
        };
        var paddingLeft = self.getPaddingLeft();
        var paddingRight = self.getPaddingRight();
        var paddingTop = self.getPaddingTop();
        var paddingBottom = self.getPaddingBottom();
        var lengthArray = [3, 5, 5, 6, 6, 6];
        var opacities = [{
            x: 1,
            y: 0,
            o: 0.2,
            w: 1
        }, {
            x: 2,
            y: 0,
            o: 0.4,
            w: 1
        }, {
            x: 3,
            y: 0,
            o: 1.0,
            w: 3
        }, {
            x: 0,
            y: 1,
            o: 0.2,
            w: 1
        }, {
            x: 1,
            y: 1,
            o: 0.8,
            w: 1
        }, {
            x: 2,
            y: 1,
            o: 1.0,
            w: 1
        }, {
            x: 3,
            y: 1,
            o: 0.4,
            w: 1
        }, {
            x: 4,
            y: 1,
            o: 0.2,
            w: 1
        }, {
            x: 0,
            y: 2,
            o: 0.4,
            w: 1
        }, {
            x: 1,
            y: 2,
            o: 1.0,
            w: 1
        }, {
            x: 2,
            y: 2,
            o: 0.2,
            w: 1
        }, {
            x: 0,
            y: 3,
            o: 1.0,
            w: 1
        }, {
            x: 1,
            y: 3,
            o: 0.4,
            w: 1
        }, {
            x: 0,
            y: 4,
            o: 1.0,
            w: 1
        }, {
            x: 1,
            y: 4,
            o: 0.2,
            w: 1
        }, {
            x: 0,
            y: 5,
            o: 1.0,
            w: 1
        }];
        var borderColor = "#7f7f7f";
        var filler = '<span style="display:block;width:1px;height:1px"></span>';
        return '<td><table cellpadding="0" cellspacing="0"><tr>' + '<td>' + self.createRoundCorner(lengthArray, bgcolor, opacities, borderColor, false, false) + '</td>' + '<td bgcolor="' + bgcolor + '" style="border-top:1px solid ' + borderColor + ';font-size:2px">' + filler + '</td><td>' + self.createRoundCorner(lengthArray, bgcolor, opacities, borderColor, true, false) + '</td></tr><tr>' + '<td bgcolor="' + bgcolor + '" style="border-left:1px solid ' + borderColor + ';font-size:2px">' + filler + '</td>' + '<td bgcolor="' + bgcolor + '" style="' + 'padding-left:' + paddingLeft + ';padding-right:' + paddingRight + ';padding-top:' + paddingTop + ';padding-bottom:' + paddingBottom + (allowWrap ? '' : ';white-space:nowrap') + '">' + content + '</td><td bgcolor="' + bgcolor + '" style="border-right:1px solid ' + borderColor + ';font-size:2px">' + filler + '</td></tr><tr>' + '<td>' + self.createRoundCorner(lengthArray, bgcolor, opacities, borderColor, false, true) + '</td>' + '<td bgcolor="' + bgcolor + '" style="border-bottom:1px solid ' + borderColor + ';font-size:2px">' + filler + '</td><td>' + self.createRoundCorner(lengthArray, bgcolor, opacities, borderColor, true, true) + '</td></tr></table></td>';
    };
});
qxp.Class.getInstance = function() {
    var vector = com.ptvag.webcomponent.map.vector;
    var myClass = vector.InfoBoxElementFactoryRound;
    if (myClass.instance == null) {
        myClass.instance = new vector.InfoBoxElementFactoryRound();
    };
    return myClass.instance;
};



/* ID: com.ptvag.webcomponent.map.animator.Animator */
qxp.OO.defineClass("com.ptvag.webcomponent.map.animator.Animator", qxp.core.Object, function() {
    qxp.core.Object.call(this);
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    var self = this;
    var mStartTime;
    var mStartCenter;
    var mStartZoom;
    var mStartRotation;
    var mStopAnimation;
    var mFakeLastFrame;
    var mNextStepPlanned = false;
    self.onTargetChanged = function() {
        mStartTime = new Date().getTime();
        mStopAnimation = false;
        mFakeLastFrame = true;
        var map = self.getMap();
        mStartCenter = map.getVisibleCenter();
        mStartZoom = map.getVisibleZoom();
        mStartRotation = map.getVisibleRotation();
        if (mStartCenter == null || mStartZoom == null || mStartRotation == null) {
            map.setVisibleCenter(map.getCenter());
            map.setVisibleZoom(map.getZoom());
            map.setVisibleRotation(map.getRotation());
        } else if (!mNextStepPlanned) {
            if (self.getHaltLoadingDuringAnimation()) {
                com.ptvag.webcomponent.map.ImageLoader.setHaltLoading(true);
            };
            nextStep();
        }
    };
    self.stopAnimation = function() {
        com.ptvag.webcomponent.map.ImageLoader.setHaltLoading(false);
        mStopAnimation = true;
        var map = self.getMap();
        map.setVisibleCenter(map.getCenter());
        map.setVisibleZoom(map.getZoom());
        map.setVisibleRotation(map.getRotation());
    };
    self.stopAnimationAndKeepMapView = function() {
        mStopAnimation = true;
    };
    var nextStep = function() {
        mNextStepPlanned = false;
        if (mStopAnimation) {
            return;
        };
        var map = self.getMap();
        var animationTime = new Date().getTime() - mStartTime;
        var duration = self.getDuration();
        if (mFakeLastFrame && animationTime >= duration) {
            mFakeLastFrame = false;
            animationTime = duration - 1;
        };
        if (animationTime >= duration) {
            com.ptvag.webcomponent.map.ImageLoader.setHaltLoading(false);
        };
        var inBulkMode = map.inBulkMode();
        if (!inBulkMode) {
            map.startBulkMode();
        };
        var isFinished = self.doAnimation(animationTime);
        if (!inBulkMode) {
            map.endBulkMode();
        };
        if (!isFinished) {
            mNextStepPlanned = true;
            window.setTimeout(nextStep, 1);
        }
    };
    self.getStartCenter = function() {
        return mStartCenter;
    };
    self.getStartZoom = function() {
        return mStartZoom;
    };
    self.getStartRotation = function() {
        return mStartRotation;
    };
    self.doAnimation = function(animationTime) {
        throw new Error("doAnimation is abstract");
    };
    self.interpolatePoint = function(startPoint, endPoint, factor) {
        return {
            x: startPoint.x + (endPoint.x - startPoint.x) * factor,
            y: startPoint.y + (endPoint.y - startPoint.y) * factor
        };
    };
    self.interpolateZoom = function(startLevel, endLevel, factor) {
        if (factor == 0 || startLevel == endLevel) {
            return startLevel;
        };
        if (factor == 1) {
            return endLevel;
        };
        var startTileWidth = CoordUtil.getTileWidth(startLevel);
        var endTileWidth = CoordUtil.getTileWidth(endLevel);
        var visibleTileWidth = startTileWidth + (endTileWidth - startTileWidth) * factor;
        return CoordUtil.getLevelForTileWidth(visibleTileWidth);
    };
    self.interpolateRotation = function(startRotation, endRotation, factor) {
        if (endRotation > startRotation) {
            var diff = endRotation - startRotation;
            if (diff > 180) {
                startRotation += 360;
            }
        } else if (endRotation < startRotation) {
            diff = startRotation - endRotation;
            if (diff > 180) {
                endRotation += 360;
            }
        };
        return startRotation + (endRotation - startRotation) * factor;
    };
    self.setVisibleMapView = function(newCenter, newZoom, newRotation, forceExactCenter) {
        var theMap = self.getMap();
        var oldZoom = theMap.getVisibleZoom();
        if (oldZoom == newZoom && !forceExactCenter) {
            var oldCenter = theMap.getVisibleCenter();
            if (oldCenter.x != newCenter.x || oldCenter.y != newCenter.y) {
                var oldCenterPix = CoordUtil.smartUnit2Pixel(oldCenter, oldZoom);
                var newCenterPix = CoordUtil.smartUnit2Pixel(newCenter, newZoom);
                if (oldCenter.x != newCenter.x) {
                    newCenterPix.x = Math.round(newCenterPix.x) + 0.1;
                };
                if (oldCenter.y != newCenter.y) {
                    newCenterPix.y = Math.round(newCenterPix.y) + 0.1;
                };
                var relativeOffset = theMap.getRelativeOffset();
                var diffX = newCenterPix.x - oldCenterPix.x;
                var diffY = newCenterPix.y - oldCenterPix.y;
                theMap.setRelativeOffset({
                    x: Math.round(relativeOffset.x + diffX),
                    y: Math.round(relativeOffset.y - diffY)
                });
                newCenter = CoordUtil.pixel2SmartUnit(newCenterPix, newZoom);
            }
        };
        theMap.setVisibleCenter(newCenter);
        theMap.setVisibleZoom(newZoom);
        theMap.setVisibleRotation(newRotation);
    };
});
qxp.OO.addProperty({
    name: "map",
    type: qxp.constant.Type.OBJECT,
    allowNull: false
});
qxp.OO.addProperty({
    name: "haltLoadingDuringAnimation",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});




/* ID: com.ptvag.webcomponent.map.ImageLoader */
qxp.OO.defineClass("com.ptvag.webcomponent.map.ImageLoader", qxp.core.Object, function() {
    qxp.core.Object.call(this);
    var self = this;
    self.enableDebug = false;
    var mQueue = [];
    var mQueueLocked = false;
    var mRunningRequests = [];
    var mLastRequestTime = 0;
    var mQueueTimer = null;
    var mImageSizes = {};
    var mKnownFastUrls;
    var mCurrentFastUrlHash = 0;
    var mCurrentFastUrlCount = 0;
    var mErrorLog = null;
    var mCurrentErrorArray;
    var mBlankSrc = null;
    var mNonFastCount = 0;
    self._modifyHaltLoading = function(propValue) {
        if (!propValue) {
            processQueue();
        }
    };
    var createLogEntry = function(entry) {
        return {
            imageElement: (entry.imageElement ? "not null" : null),
            url: entry.url,
            priority: entry.priority,
            timeout: entry.timeout,
            fast: entry.fast,
            manageVisibility: entry.manageVisibility
        };
    };
    var logEntry = function(entry, error) {
        if (mErrorLog == null) {
            mErrorLog = new Array(10);
            mErrorLog[0] = new Array();
            mCurrentErrorArray = 0;
        };
        var currentErrorArray = mErrorLog[mCurrentErrorArray];
        var newEntry = createLogEntry(entry);
        newEntry.error = error;
        currentErrorArray.push(newEntry);
        if (currentErrorArray.length == 10) {
            mCurrentErrorArray = (mCurrentErrorArray + 1) % 10;
            mErrorLog[mCurrentErrorArray] = new Array();
        }
    };
    self.isIdle = function() {
        return (mRunningRequests.length == 0 && mQueue.length == 0);
    };
    self.getDebugInfo = function() {
        var retVal = {};
        var errorLog = [];
        if (mErrorLog != null) {
            var startIndex = (mCurrentErrorArray + 1) % 10;
            var currentIndex = startIndex;
            do {
                var array = mErrorLog[currentIndex];
                if (array != null) {
                    for (var i = 0; i < array.length;
                        ++i) {
                        errorLog.push(array[i]);
                    }
                };
                currentIndex = (currentIndex + 1) % 10;
            } while (currentIndex != startIndex);
        };
        retVal.errorLog = errorLog;
        var queue = [];
        for (var i = 0; i < mQueue.length;
            ++i) {
            queue.push(createLogEntry(mQueue[i]));
        };
        retVal.queue = queue;
        var runningRequests = [];
        for (var i = 0; i < mRunningRequests.length;
            ++i) {
            runningRequests.push(createLogEntry(mRunningRequests[i]));
        };
        retVal.runningRequests = runningRequests;
        return retVal;
    };
    var fastUrlKnown = function(url) {
        var hashCount = mKnownFastUrls.length;
        for (var i = 0; i < hashCount;
            ++i) {
            if (url in mKnownFastUrls[i]) {
                return true;
            }
        };
        return false;
    };
    var addFastUrl = function(url) {
        if (!(url in mKnownFastUrls[mCurrentFastUrlHash])) {
            mKnownFastUrls[mCurrentFastUrlHash][url] = null;
            ++mCurrentFastUrlCount;
            if (mCurrentFastUrlCount >= self.getKnownFastUrlsPerHash()) {
                mCurrentFastUrlCount = 0;
                mCurrentFastUrlHash = (mCurrentFastUrlHash + 1) % mKnownFastUrls.length;
                mKnownFastUrls[mCurrentFastUrlHash] = {};
            }
        }
    };
    self.getImageSize = function(url, handlerFunction, object) {
        var sizeData = mImageSizes[url];
        if (sizeData != null) {
            if (sizeData.width != null) {
                handlerFunction.call(object, url, sizeData.width, sizeData.height);
            } else {
                sizeData.handlers.push(handlerFunction);
                sizeData.objects.push(object);
            }
        } else {
            sizeData = {
                handlers: [handlerFunction],
                objects: [object]
            };
            mImageSizes[url] = sizeData;
            var tempImgElem = document.createElement("img");
            tempImgElem.style.position = "absolute";
            tempImgElem.style.visibility = "hidden";
            document.body.appendChild(tempImgElem);
            self.loadImage(tempImgElem, url, onSizeImageLoaded);
        }
    };
    var onSizeImageLoaded = function(imgElement, url, exc) {
        if (exc != null) {
            self.warn("Image size could not be detected for: " + url, exc);
        } else {
            var sizeData = mImageSizes[url];
            sizeData.width = imgElement.offsetWidth;
            sizeData.height = imgElement.offsetHeight;
            document.body.removeChild(imgElement);
            for (var i = 0; i < sizeData.handlers.length; i++) {
                sizeData.handlers[i].call(sizeData.objects[i], url, sizeData.width, sizeData.height);
            };
            sizeData.handlers = null;
            sizeData.objects = null;
        }
    };
    var cleanUpImage = function(imageElement) {
        imageElement.onload = null;
        imageElement.onerror = null;
        imageElement.onabort = null;
        if (imageElement._timeout) {
            window.clearTimeout(imageElement._timeout);
            imageElement._timeout = null;
        };
        if (imageElement._removeFromParent) {
            try {
                imageElement.parentNode.removeChild(imageElement);
            } catch (e) {}
        }
    };
    var removeFromQueue = function(queueEntry) {
        if (!queueEntry.fast) {
            --mNonFastCount;
        };
        for (var i = 0; i < mQueue.length;
            ++i) {
            if (mQueue[i] == queueEntry) {
                mQueue.splice(i, 1);
                return true;
            }
        };
        return false;
    };
    var removeFromRunningList = function(queueEntry) {
        if (!queueEntry.fast) {
            --mNonFastCount;
        };
        var retVal = false;
        for (var i = 0; i < mRunningRequests.length;
            ++i) {
            if (mRunningRequests[i] == queueEntry) {
                mRunningRequests.splice(i, 1);
                retVal = true;
                break;
            }
        };
        if (mQueueTimer == null) {
            mQueueTimer = window.setTimeout(function() {
                mQueueTimer = null;
                processQueue();
            }, 0);
        };
        return retVal;
    };
    var processQueue = function() {
        if (mQueueTimer != null || mQueue.length == 0 || self.getHaltLoading() || (mRunningRequests.length >= self.getMaxRequests() && !mQueue[0].fast)) {
            return;
        };
        var minWaitTime = self.getMinWaitTime();
        var currentTime = (new Date()).getTime();
        var timeDiff = currentTime - mLastRequestTime;
        var queueEntry = mQueue[0];
        if (!mQueueLocked && timeDiff >= minWaitTime) {
            mQueue.splice(0, 1);
            mRunningRequests.push(queueEntry);
            queueEntry.imageElement._timeout = window.setTimeout(function() {
                if (queueEntry.imageElement._timeout == null) {
                    return;
                };
                queueEntry.imageElement._timeout = null;
                if (self.enableDebug) {
                    logEntry(queueEntry, "timeout");
                };
                self.abortLoading(queueEntry);
                if (queueEntry.imageElement.onabort) {
                    queueEntry.imageElement.onabort(true);
                }
            }, queueEntry.timeout * 1000);
            self.setImageSrc(queueEntry.imageElement, com.ptvag.webcomponent.map.SERVICE.fixUrl(queueEntry.url));
            if (queueEntry.fast && queueEntry.manageVisibility) {
                queueEntry.imageElement.style.visibility = "visible";
            };
            mLastRequestTime = currentTime;
        };
        if (mQueue.length > 0 && mRunningRequests.length < self.getMaxRequests()) {
            var timeoutTime = minWaitTime;
            if (timeDiff <= timeoutTime) {
                timeoutTime -= timeDiff;
            };
            mLastRequestTime = 0;
            mQueueTimer = window.setTimeout(function() {
                mQueueTimer = null;
                processQueue();
            }, timeoutTime);
        }
    };
    var fillBlankSrc = function() {
        mBlankSrc = com.ptvag.webcomponent.map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/blank.gif", true);
    };
    var refreshSession = function() {
        if (!mQueueLocked) {
            mQueueLocked = true;
            var refreshRPC = com.ptvag.webcomponent.map.SERVICE;
            refreshRPC.refreshSession(function(result, exc) {
                if (!result || exc) {
                    self.error("Session refresh would be needed but didn't succeed!", exc);
                };
                mQueueLocked = false;
            });
        }
    };
    var retry = function(queueEntry) {
        if (queueEntry.fast) {
            var retries = self.getFastRetries();
        } else {
            retries = self.getRetries();
        };
        var count = queueEntry.retries;
        if (!count) {
            count = 1;
            queueEntry.origURL = queueEntry.url;
        } else {
            ++count;
        };
        queueEntry.retries = count;
        if (count > retries) {
            return false;
        };
        removeFromRunningList(queueEntry);
        var imageElement = queueEntry.imageElement;
        if (imageElement._timeout) {
            window.clearTimeout(imageElement._timeout);
            imageElement._timeout = null;
        };
        queueEntry.url = queueEntry.origURL + (queueEntry.origURL.indexOf("?") == -1 ? "/retryTime_" + (new Date()).getTime() + "/retry_" + count : "&retryTime=" + (new Date()).getTime() + "&retry=" + count);
        mQueue.splice(0, 0, queueEntry);
        processQueue();
        return true;
    };
    self.loadImage = function(imageElement, url, onloaded, priority, timeout, fast, manageVisibility) {
        if (timeout == null) {
            timeout = self.getDefaultTimeout();
        };
        priority = (priority == null ? 0 : priority);
        var actuallyFast = fast;
        var queueEntry = {
            imageElement: imageElement,
            url: url,
            priority: priority,
            timeout: timeout,
            fast: actuallyFast,
            manageVisibility: manageVisibility
        };
        if (!actuallyFast) {
            ++mNonFastCount;
        };
        refreshSession();
        if (mQueue.length == 0) {
            mQueue.push(queueEntry);
        } else if (mQueue[mQueue.length - 1].priority >= priority) {
            mQueue.push(queueEntry);
        } else {
            for (var i = 0; mQueue[i].priority > priority;
                ++i);
            mQueue.splice(i, 0, queueEntry);
        };
        cleanUpImage(imageElement);
        var actualLoadHandler = function() {
            if (imageElement.src == mBlankSrc) {
                return;
            };
            removeFromRunningList(queueEntry);
            cleanUpImage(imageElement);
            if (manageVisibility) {
                imageElement.style.visibility = "";
            };
            if (fast) {
                addFastUrl(url);
            };
            imageElement._loaded = true;
            try {
                if (onloaded) onloaded(imageElement, url, null);
            } catch (exc) {
                self.error("Handling image loaded failed", exc);
            }
        };
        var actualErrorHandler = function() {
            if (imageElement.src == mBlankSrc) {
                return;
            };
            if (retry(queueEntry)) {
                return;
            };
            if (self.enableDebug) {
                logEntry(queueEntry, "error");
            };
            removeFromRunningList(queueEntry);
            cleanUpImage(imageElement);
            try {
                if (onloaded) onloaded(imageElement, url, new Error("Error"));
            } catch (exc) {
                self.error("Handling image loading error failed", exc);
            }
        };
        var actualAbortHandler = function(explicit, dontBlankImage) {
            if (imageElement.src == mBlankSrc) {
                return;
            };
            if (!explicit) {
                if (retry(queueEntry)) {
                    return;
                }
            };
            removeFromRunningList(queueEntry);
            cleanUpImage(imageElement);
            if (!dontBlankImage) {
                if (mBlankSrc == null) {
                    fillBlankSrc();
                };
                self.clearImageSrc(imageElement, mBlankSrc);
            };
            try {
                if (onloaded) onloaded(imageElement, url, new Error("Abort"));
            } catch (exc) {
                self.error("Handling image loading abort failed", exc);
            }
        };
        imageElement.onload = actualLoadHandler;
        imageElement.onerror = actualErrorHandler;
        imageElement.onabort = actualAbortHandler;
        processQueue();
        return queueEntry;
    };
    self.abortLoading = function(queueEntry, removeFromParent) {
        var wasQueued = removeFromQueue(queueEntry);
        if (wasQueued) {
            if (queueEntry.imageElement.onabort) {
                queueEntry.imageElement.onabort(true, true);
            }
        } else {
            if (!queueEntry.imageElement._loaded) {
                if (queueEntry.imageElement.onabort) {
                    queueEntry.imageElement.onabort(true);
                } else {
                    if (mBlankSrc == null) {
                        fillBlankSrc();
                    };
                    self.clearImageSrc(queueEntry.imageElement, mBlankSrc);
                }
            }
        };
        if (removeFromParent) {
            if (qxp.sys.Client.getInstance().isMshtml() && queueEntry.imageElement.onabort) {
                var junkyard = document.getElementById("_junkyard");
                if (junkyard == null) {
                    junkyard = document.createElement("div");
                    junkyard.style.display = "none";
                    document.body.appendChild(junkyard);
                };
                queueEntry.imageElement.parentNode.removeChild(queueEntry.imageElement);
                junkyard.appendChild(queueEntry.imageElement);
                queueEntry.imageElement._removeFromParent = true;
                queueEntry.imageElement.style.display = "none";
            } else {
                queueEntry.imageElement.parentNode.removeChild(queueEntry.imageElement);
            }
        }
    };
    self.createElement = function() {
        return document.createElement("img");
    };
    self.setImageSrc = function(imageElement, src) {
        imageElement.src = src;
    };
    self.clearImageSrc = function(imageElement, blankSrc) {
        imageElement.src = blankSrc;
    };
    var init = function() {
        mKnownFastUrls = [];
        var hashCount = self.getKnownFastUrlHashes();
        for (var i = 0; i < hashCount;
            ++i) {
            mKnownFastUrls[i] = {};
        }
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        for (var i = 0; i < mQueue.length; i++) {
            cleanUpImage(mQueue[i].imageElement);
            mQueue[i].imageElement = null;
        };
        mQueue = [];
        for (var i = 0; i < mRunningRequests.length; i++) {
            cleanUpImage(mRunningRequests[i].imageElement);
            mRunningRequests[i].imageElement = null;
        };
        mRunningRequests = [];
        superDispose.call(self);
    };
    init();
});
qxp.OO.addProperty({
    name: "minWaitTime",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "maxRequests",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 3
});
qxp.OO.addProperty({
    name: "knownFastUrlHashes",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 10
});
qxp.OO.addProperty({
    name: "knownFastUrlsPerHash",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 100
});
qxp.OO.addProperty({
    name: "defaultTimeout",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 10
});
qxp.OO.addProperty({
    name: "retries",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 3
});
qxp.OO.addProperty({
    name: "fastRetries",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 3
});
qxp.OO.addProperty({
    name: "haltLoading",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: false
});
com.ptvag.webcomponent.map.ImageLoader = new com.ptvag.webcomponent.map.ImageLoader();




/* ID: com.ptvag.webcomponent.map.animator.LinearAnimator */
qxp.OO.defineClass("com.ptvag.webcomponent.map.animator.LinearAnimator", com.ptvag.webcomponent.map.animator.Animator, function() {
    com.ptvag.webcomponent.map.animator.Animator.call(this);
    var self = this;
    self.doAnimation = function(animationTime) {
        var theMap = self.getMap();
        var factor = Math.min(1, animationTime / self.getDuration());
        var newCenter = self.interpolatePoint(self.getStartCenter(), theMap.getCenter(), factor);
        var newZoom = self.interpolateZoom(self.getStartZoom(), theMap.getZoom(), factor);
        var newRotation = self.interpolateRotation(self.getStartRotation(), theMap.getRotation(), factor);
        self.setVisibleMapView(newCenter, newZoom, newRotation, factor == 1);
        return factor == 1;
    };
});
qxp.OO.addProperty({
    name: "duration",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 500
});




/* ID: com.ptvag.webcomponent.util.DomUtils */
qxp.OO.defineClass("com.ptvag.webcomponent.util.DomUtils");
qxp.Class.getChildElements = function(element) {
    var childNodes = element.childNodes;
    var childNodeCount = childNodes.length;
    var childNode;
    var retVal = new Array();
    for (var i = 0; i < childNodeCount;
        ++i) {
        childNode = childNodes.item(i);
        if (childNode.nodeType == 1) {
            retVal.push(childNode);
        }
    };
    return retVal;
};
qxp.Class.getAbsoluteX = function(element) {
    var x = 0;
    var testElem = element;
    while (testElem && testElem != document.body) {
        if (testElem.scrollLeft) {
            x -= testElem.scrollLeft;
        };
        testElem = testElem.parentNode;
    };
    testElem = element;
    while (testElem) {
        x += testElem.offsetLeft;
        if (testElem != element && testElem.clientLeft && testElem.nodeName != "TABLE") {
            x += testElem.clientLeft;
        };
        testElem = testElem.offsetParent;
    };
    if (!element.offsetParent && element.x) {
        x += element.x;
    };
    return x;
};
qxp.Class.getAbsoluteY = function(element) {
    var y = 0;
    var testElem = element;
    while (testElem && testElem != document.body) {
        if (testElem.scrollTop) {
            y -= testElem.scrollTop;
        };
        testElem = testElem.parentNode;
    };
    testElem = element;
    while (testElem) {
        var offsetTop;
        if (testElem.nodeName == "TR" && testElem.offsetHeight == 0) {
            offsetTop = testElem.offsetTop;
            var trs = testElem.parentNode.getElementsByTagName("tr");
            var trCount = trs.length;
            var tr;
            for (var i = 0; i < trCount;
                ++i) {
                tr = trs[i];
                if (tr == testElem) {
                    break;
                };
                offsetTop += com.ptvag.webcomponent.util.DomUtils.getAbsoluteHeight(tr);
            }
        } else {
            offsetTop = testElem.offsetTop;
        };
        y += offsetTop;
        if (testElem != element && testElem.clientTop && testElem.nodeName != "TABLE") {
            y += testElem.clientTop;
        };
        testElem = testElem.offsetParent;
    };
    if (!element.offsetParent && element.y) {
        y += element.y;
    };
    return y;
};
qxp.Class.getAbsoluteWidth = function(element) {
    if (qxp.sys.Client.getInstance().isWebkit()) {
        var pointer = element;
        while (pointer.parentNode && pointer.offsetWidth == 0) {
            pointer = pointer.parentNode;
        };
        return pointer.offsetWidth;
    } else {
        return element.offsetWidth;
    }
};
qxp.Class.getAbsoluteHeight = function(element) {
    var client = qxp.sys.Client.getInstance();
    if ((client.isGecko() && element.nodeName == "SPAN") || (client.isWebkit() && element.offsetHeight == 0 && element.nodeName == "TR")) {
        var DomUtils = com.ptvag.webcomponent.util.DomUtils;
        var elemY = DomUtils.getAbsoluteY(element);
        var maxHeight = element.offsetHeight;
        var children = DomUtils.getChildElements(element);
        for (var i = 0; i < children.length; i++) {
            var yDelta = DomUtils.getAbsoluteY(children[i]) - elemY;
            var height = DomUtils.getAbsoluteHeight(children[i]) + yDelta;
            if (maxHeight < height) {
                maxHeight = height;
            }
        };
        return maxHeight;
    } else if (client.isWebkit()) {
        var pointer = element;
        while (pointer.parentNode && pointer.offsetHeight == 0) {
            pointer = pointer.parentNode;
        };
        return pointer.offsetHeight;
    } else {
        return element.offsetHeight;
    }
};
qxp.Class.getScrollX = function(win) {
    if (win.pageXOffset != null) {
        return win.pageXOffset;
    };
    var scrollLeft1 = win.document.documentElement.scrollLeft;
    var scrollLeft2 = win.document.body.scrollLeft;
    return (win.scrollX != null ? win.scrollX : Math.max((scrollLeft1 != null ? scrollLeft1 : 0), (scrollLeft2 != null ? scrollLeft2 : 0)));
};
qxp.Class.getScrollY = function(win) {
    if (win.pageYOffset != null) {
        return win.pageYOffset;
    };
    var scrollTop1 = win.document.documentElement.scrollTop;
    var scrollTop2 = win.document.body.scrollTop;
    return (win.scrollY != null ? win.scrollY : Math.max((scrollTop1 != null ? scrollTop1 : 0) + (scrollTop2 != null ? scrollTop2 : 0)));
};




/* ID: com.ptvag.webcomponent.map.vector.VectorElement */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.VectorElement", qxp.core.Object, function(priority, id, isPositionFlexible) {
    qxp.core.Object.call(this);
    var self = this;
    var mMapZoom;
    var mPriorityFixed = false;
    var mInDispose = false;
    self._modifyPriority = function() {
        if (mPriorityFixed) {
            throw new Error("The element priority can't be changed after " + "it's been added to the vector layer");
        }
    };
    self._modifyPositionFlexible = function(propValue) {
        if (propValue && (self.getX == null || self.getY == null)) {
            throw new Error("This element doesn't support flexible positioning");
        };
        self.refresh();
    };
    self._modifyVectorLayer = function(propValue, propOldValue) {
        if (propOldValue != null && !mInDispose) {
            throw new Error("Changing the vector layer is not allowed once " + "it's been set");
        }
    };
    self.getZoomFactor = function() {
        var minFactor = self.getMinFactor();
        var maxFactor = self.getMaxFactor();
        var minZoom = self.getMinZoom();
        var maxZoom = self.getMaxZoom();
        if (mMapZoom <= maxZoom) {
            var factor = maxFactor;
        } else if (mMapZoom >= minZoom) {
            factor = minFactor;
        } else {
            factor = minFactor + (maxFactor - minFactor) * (minZoom - mMapZoom) / (minZoom - maxZoom);
        };
        return factor;
    };
    self.usesCanvas = function(ctx) {
        throw new Error("usesCanvas is abstract in VectorElement");
    };
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        mMapZoom = mapZoom;
    };
    self.clear = function(inDispose) {};
    self.fixPriority = function() {
        mPriorityFixed = true;
    };
    self.refresh = function() {
        var vectorLayer = self.getVectorLayer();
        if (vectorLayer) {
            self.clear();
            vectorLayer.onViewChanged();
        }
    };
    self.refreshOn = function() {
        var length = arguments.length;
        for (var i = 0; i < length;
            ++i) {
            self["_modify" + qxp.lang.String.toFirstUp(arguments[i])] = self.refresh;
        }
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        mInDispose = true;
        self.clear(true);
        self.setVectorLayer(null);
        superDispose.call(self);
    };
    if (priority != null) {
        self.setPriority(priority);
    };
    if (id != null) {
        self.setId(id);
    };
    if (isPositionFlexible != null) {
        self.setPositionFlexible(isPositionFlexible);
    };
    self.refreshOn("minFactor", "maxFactor", "minZoom", "maxZoom", "visibleMinZoom", "visibleMaxZoom");
});
qxp.OO.addProperty({
    name: "priority",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "id",
    allowNull: false,
    writeOnce: true
});
qxp.OO.addProperty({
    name: "positionFlexible",
    getAlias: "isPositionFlexible",
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "flexX",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "flexY",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "dependsOn",
    allowNull: true,
    defaultValue: null
});
qxp.OO.addProperty({
    name: "minFactor",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1.0,
    allowNull: false
});
qxp.OO.addProperty({
    name: "maxFactor",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1.0,
    allowNull: false
});
qxp.OO.addProperty({
    name: "minZoom",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 23,
    allowNull: false
});
qxp.OO.addProperty({
    name: "maxZoom",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0,
    allowNull: false
});
qxp.OO.addProperty({
    name: "visibleMinZoom",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1000,
    allowNull: false
});
qxp.OO.addProperty({
    name: "visibleMaxZoom",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0,
    allowNull: false
});
qxp.OO.addProperty({
    name: "autoDispose",
    allowNull: false,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "vectorLayer",
    allowNull: true,
    defaultValue: null
});




/* ID: com.ptvag.webcomponent.map.vector.SensitiveArea */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.SensitiveArea", com.ptvag.webcomponent.map.vector.VectorElement, function(x, y, maxZoom, tolerance, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mExtendedEventInfo;
    self.usesCanvas = function() {
        return false;
    };
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        var x = self.getX();
        if (x != null) {
            var suPoint = {
                x: x,
                y: self.getY()
            };
            var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
            var realX = pixCoords.x - mapLeft + self.getFlexX();
            var realY = mapTop - pixCoords.y + self.getFlexY();
            var coords = self.getVectorLayer().getMap().transformPixelCoords(realX, realY, false, false, true);
            self.setRealX(coords.x + self.getOffsetX());
            self.setRealY(coords.y + self.getOffsetY());
        };
        self.setMapLeft(mapLeft);
        self.setMapTop(mapTop);
        self.setMapZoom(mapZoom);
    };
    self.getSquareDistance = function(evt) {
        mExtendedEventInfo = null;
        var tolerance = self.getTolerance();
        var attachedElement = self.getAttachedElement();
        if (attachedElement != null) {
            var info = attachedElement.getSquareDistance(evt, tolerance);
            mExtendedEventInfo = info.extendedEventInfo;
            return info.squareDistance;
        };
        var distanceX = evt.relMouseX - self.getRealX();
        var distanceY = evt.relMouseY - self.getRealY();
        var squareDistance = distanceX * distanceX + distanceY * distanceY;
        if (squareDistance > tolerance * tolerance) {
            return -1;
        };
        return squareDistance;
    };
    self.getExtendedEventInfo = function() {
        return mExtendedEventInfo;
    };
    if (x != null) {
        self.setX(x);
    };
    if (y != null) {
        self.setY(y);
    };
    if (maxZoom != null) {
        self.setMaxZoom(maxZoom);
    };
    if (tolerance != null) {
        self.setTolerance(tolerance);
    };
    self.refreshOn("x", "y", "offsetX", "offsetY");
});
qxp.OO.addProperty({
    name: "x",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 4355664
});
qxp.OO.addProperty({
    name: "y",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 5464867
});
qxp.OO.addProperty({
    name: "offsetX",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "offsetY",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "realX",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "realY",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "mapLeft",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "mapTop",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "mapZoom",
    type: qxp.constant.Type.NUMBER
});
qxp.OO.addProperty({
    name: "maxZoom",
    type: qxp.constant.Type.NUMBER,
    allowNull: true
});
qxp.OO.addProperty({
    name: "tolerance",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 7
});
qxp.OO.addProperty({
    name: "attachedElement",
    type: qxp.constant.Type.OBJECT,
    allowNull: true
});




/* ID: com.ptvag.webcomponent.map.vector.AbstractHoverArea */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.AbstractHoverArea", com.ptvag.webcomponent.map.vector.SensitiveArea, function(x, y, maxZoom, tolerance, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.SensitiveArea.call(this, x, y, maxZoom, tolerance, priority, id, isPositionFlexible);
    var self = this;
    self.onHover = function(evt) {};
    self.onUnhover = function() {};
    self.testUnhover = function(evt) {
        return (self.getSquareDistance(evt) < 0);
    };
});
qxp.OO.addProperty({
    name: "magnetic",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    getAlias: "isMagnetic"
});




/* ID: com.ptvag.webcomponent.map.bing.RequestBuilder */
qxp.OO.defineClass("com.ptvag.webcomponent.map.bing.RequestBuilder", com.ptvag.webcomponent.map.RequestBuilder, function(parentMap, apiKey) {
    com.ptvag.webcomponent.map.RequestBuilder.call(this, parentMap, false);
    var self = this;
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    var MetaData = com.ptvag.webcomponent.map.bing.MetaData;
    var mMercEdge = CoordUtil.GEO_2_MERC_X_HELPER * 180 * 100000;
    var mMetaData = null;
    var mSubdomain = 0;
    self.buildRequest = function(left, top, right, bottom) {
        var mercWidth = right - left;
        var zoomLevel = 1 + Math.round(Math.log(mMercEdge / mercWidth) / Math.log(2));
        var x = Math.round((left + mMercEdge) / mercWidth);
        var y = Math.round((mMercEdge - top) / mercWidth);
        var digits = [];
        for (var i = zoomLevel - 1; i >= 0;
            --i) {
            digits.push(((x >> i) & 1) + (((y >> i) & 1) << 1));
        };
        var quadKey = digits.join("");
        if (mMetaData == null) {
            mMetaData = MetaData.getMetaData(apiKey);
        };
        var resources = mMetaData.resourceSets[0].resources[0];
        var subdomains = resources.imageUrlSubdomains;
        var subdomain = subdomains[mSubdomain];
        mSubdomain = (mSubdomain + 1) % subdomains.length;
        var url = resources.imageUrl.replace("{quadkey}", quadKey).replace("{subdomain}", subdomain) + "&key=" + apiKey;
        return {
            url: url,
            width: 256,
            height: 256,
            clipLeft: 0,
            clipTop: 0,
            clipRight: 0,
            clipBottom: 0
        };
    };
});




/* ID: com.ptvag.webcomponent.map.bing.MetaData */
qxp.OO.defineClass("com.ptvag.webcomponent.map.bing.MetaData", qxp.core.Object, function() {
    qxp.core.Object.call(this);
    var self = this;
    var mMetaData = {};
    var mRunningRequests = {};
    var mRequestCount = 0;
    var mLocationProtocol = false;
    applyLocationProtocol = function(metaDataObject, protocol) {
        for (var k in metaDataObject) {
            var v = metaDataObject[k];
            if (typeof v === "object") {
                applyLocationProtocol(v, protocol);
            } else if (typeof v === "string" && v.indexOf("http://") == 0) {
                metaDataObject[k] = protocol + v.substr(v.indexOf("://"));
            }
        }
    };
    self.setAPIKey = function(key, callback) {
        if (mMetaData[key]) {
            window.setTimeout(function() {
                callback(true);
            }, 0);
            return;
        };
        var runningRequest = mRunningRequests[key];
        if (runningRequest != null) {
            runningRequest.push(callback);
            return;
        };
        var ajaxMapsPrefix = qxp.core.ServerSettings.serverPathPrefix;
        var protocol = ajaxMapsPrefix.substring(0, ajaxMapsPrefix.indexOf(":"));
        var callbackName = "callback" + mRequestCount;
        ++mRequestCount;
        mRunningRequests[key] = [callback];
        self[callbackName] = function(result) {
            var callbacks = mRunningRequests[key];
            delete self[callbackName];
            delete mRunningRequests[key];
            var success = false;
            if (result != null && result.resourceSets != null && result.resourceSets.length == 1) {
                if (mLocationProtocol) {
                    applyLocationProtocol(result, protocol);
                };
                mMetaData[key] = result;
                success = true;
            };
            var callbackCount = callbacks.length;
            for (var i = 0; i < callbackCount;
                ++i) {
                callbacks[i](success);
            }
        };
        var url = (mLocationProtocol ? protocol : "http") + "://dev.virtualearth.net/REST/V1/Imagery/Metadata/" + "Aerial?o=json&jsonp=" + "com.ptvag.webcomponent.map.bing.MetaData." + callbackName + "&key=" + key;
        var scriptElement = document.createElement("script");
        scriptElement.charset = "utf-8";
        scriptElement.src = url;
        document.body.appendChild(scriptElement);
    };
    self.getMetaData = function(key) {
        return mMetaData[key];
    };
    self.useLocationProtocol = function(use) {
        if (use !== undefined) {
            mLocationProtocol = use;
        } else {
            mLocationProtocol = true;
        }
    }
});
com.ptvag.webcomponent.map.bing.MetaData = new com.ptvag.webcomponent.map.bing.MetaData();




/* ID: com.ptvag.webcomponent.map.animator.SimpleAnimator */
qxp.OO.defineClass("com.ptvag.webcomponent.map.animator.SimpleAnimator", com.ptvag.webcomponent.map.animator.Animator, function() {
    com.ptvag.webcomponent.map.animator.Animator.call(this);
    var self = this;
    self.doAnimation = function(animationTime) {
        var map = self.getMap();
        map.setVisibleCenter(map.getCenter());
        map.setVisibleZoom(map.getZoom());
        map.setVisibleRotation(map.getRotation());
        return true;
    };
});




/* ID: com.ptvag.webcomponent.map.vector.ClickArea */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.ClickArea", com.ptvag.webcomponent.map.vector.SensitiveArea, function(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.SensitiveArea.call(this, x, y, maxZoom, tolerance, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        superDraw(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom);
    };
    var superGetSquareDistance = self.getSquareDistance;
    self.getSquareDistance = function(evt) {
        if (self.getX() == null && self.getAttachedElement() == null) {
            return 10000 * 10000;
        };
        return superGetSquareDistance(evt);
    };
    self.onClick = function(evt) {
        var suCoords = self.getVectorLayer().getMap().translateMouseCoords(evt);
        var handler = self.getHandler();
        if (handler != null) {
            evt.clickX = suCoords.x;
            evt.clickY = suCoords.y;
            evt.areaX = self.getX();
            evt.areaY = self.getY();
            evt.id = self.getId();
            handler(evt);
        }
    };
    self.setX(x);
    self.setY(y);
    self.setHandler(handler);
});
qxp.OO.addProperty({
    name: "handler",
    type: qxp.constant.Type.FUNCTION,
    allowNull: true,
    defaultValue: null
});




/* ID: com.ptvag.webcomponent.map.vector.RightClickArea */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.RightClickArea", com.ptvag.webcomponent.map.vector.ClickArea, function(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.ClickArea.call(this, x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible);
});




/* ID: com.ptvag.webcomponent.map.layer.ImageLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.ImageLayer", com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer, function(imgUrl) {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mImgElem;
    var positionImage = function() {
        if (mImgElem == null) {
            return;
        };
        if (self.getAutoRotate()) {
            if (mImgElem.style.visibility != "hidden") {
                var areaWidth = self.getAreaWidth();
                var areaHeight = self.getAreaHeight();
                var computedAreaWidth = self.getComputedAreaWidth();
                var computedAreaHeight = self.getComputedAreaHeight();
                mImgElem.style.left = (computedAreaWidth - areaWidth) / 2 + "px";
                mImgElem.style.top = (computedAreaHeight - areaHeight) / 2 + "px";
            }
        } else {
            mImgElem.style.left = "0px";
            mImgElem.style.top = "0px";
        }
    };
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        var areaElem = self.getParentElement();
        areaElem.style.fontSize = "1px";
        self.setAreaElement(areaElem);
        mImgElem = document.createElement("img");
        mImgElem.style.visibility = "hidden";
        mImgElem.style.position = "absolute";
        mImgElem.style.left = "0px";
        mImgElem.style.top = "0px";
        areaElem.appendChild(mImgElem);
        map.ImageLoader.loadImage(mImgElem, imgUrl, function(elem, url, exc) {
            if (exc == null && !self.getDisposed()) {
                var width = mImgElem.offsetWidth;
                var height = mImgElem.offsetHeight;
                self.setAreaWidth(width);
                self.setAreaHeight(height);
                self.positionArea();
                mImgElem.style.visibility = "";
                positionImage();
            }
        }, 1000);
    };
    var superPositionArea = self.positionArea;
    self.positionArea = function(evt) {
        superPositionArea.apply(self, arguments);
        positionImage();
    };
    self.doPrintStaticArea = function(ctx, htmlContainer, htmlBackground) {
        if (mImgElem.style.visibility != "hidden") {
            var width = self.getAreaWidth();
            var height = self.getAreaHeight();
            ctx.drawImage(mImgElem, 0, 0, width, height, self.getComputedAreaLeft() + parseInt(mImgElem.style.left), self.getComputedAreaTop() + parseInt(mImgElem.style.top), width, height);
        }
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        mImgElem = null;
        superDispose.call(self);
    };
});
qxp.OO.changeProperty({
    name: "areaOpacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.5
});




/* ID: com.ptvag.webcomponent.map.vector.AbstractCircle */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.AbstractCircle", com.ptvag.webcomponent.map.vector.VectorElement, function(x, y, color, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    self.calculatePixelRadius = function(mapLeft, mapTop, mapZoom) {
        throw new Error("calculatePixelRadius is abstract in AbstractCircle");
    };
    self.usesCanvas = function() {
        return true;
    };
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        superDraw.apply(self, arguments);
        var suPoint = {
            x: self.getX(),
            y: self.getY()
        };
        var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
        var realX = pixCoords.x - mapLeft + self.getFlexX();
        var realY = mapTop - pixCoords.y + self.getFlexY();
        var radius = self.calculatePixelRadius(mapLeft, mapTop, mapZoom);
        ctx.fillStyle = self.getColor();
        ctx.beginPath();
        ctx.moveTo(realX, realY);
        ctx.arc(realX, realY, radius * self.getZoomFactor(), 0, 2 * Math.PI, false);
        ctx.fill();
    };
    if (x != null) {
        self.setX(x);
    };
    if (y != null) {
        self.setY(y);
    };
    if (color != null) {
        self.setColor(color);
    };
    self.refreshOn("x", "y", "color");
});
qxp.OO.addProperty({
    name: "x",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 4355664
});
qxp.OO.addProperty({
    name: "y",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 5464867
});
qxp.OO.addProperty({
    name: "color",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "rgba(255,0,0,0.7)"
});




/* ID: com.ptvag.webcomponent.map.vector.MeterCircle */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.MeterCircle", com.ptvag.webcomponent.map.vector.AbstractCircle, function(x, y, color, meterSize, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.AbstractCircle.call(this, x, y, color, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    self.calculatePixelRadius = function(mapLeft, mapTop, mapZoom) {
        var CoordUtil = map.CoordUtil;
        var suPerPixel = CoordUtil.getSmartUnitsPerPixel(mapZoom);
        var point1 = {
            x: self.getX(),
            y: self.getY()
        };
        var point2 = {
            x: point1.x + suPerPixel,
            y: point1.y
        };
        var metersPerPixel = CoordUtil.distanceOfSmartUnitPoints(point1, point2);
        return self.getMeterSize() / metersPerPixel / 2;
    };
    if (meterSize != null) {
        self.setMeterSize(meterSize);
    };
    self.refreshOn("meterSize");
});
qxp.OO.addProperty({
    name: "meterSize",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 2000
});




/* ID: com.ptvag.webcomponent.map.ServerDrawnObjectManager */
qxp.OO.defineClass("com.ptvag.webcomponent.map.ServerDrawnObjectManager", qxp.core.Target, function(requestBuilder, vectorLayer) {
    qxp.core.Target.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var clazz = map.ServerDrawnObjectManager;
    var mStaticPOIs = [];
    var mAdditionalPOIs = {};
    var LINE_PREFIX = "mapapi_staticpoi_line_";
    var CLICKAREA_PREFIX = "mapapi_staticpoi_clickarea_";
    var HOVERAREA_PREFIX = "mapapi_staticpoi_hoverarea_";
    var TOOLTIP_PREFIX = "mapapi_staticpoi_tooltip_";
    var CLICKAREA_PREFIX_LENGTH = CLICKAREA_PREFIX.length;
    var HOVERAREA_PREFIX_LENGTH = HOVERAREA_PREFIX.length;
    self.getRequestBuilder = function() {
        return requestBuilder;
    };
    var defaultStaticPOIFormatter = function(poiText) {
        var delimiter = self.getStaticPOIDelimiter();
        if (delimiter == null) {
            var components = [poiText];
        } else {
            components = poiText.split(delimiter);
        };
        return "<div style='font-family:Verdana,Arial,sans-serif;font-size:11px'>" + "<div style='font-weight:bold;padding-bottom:4px'>" + (components.length > 1 ? map.MapUtil.escapeHTML(components[1]) : map.MapUtil.escapeHTML(components[0])) + "</div><div>" + (components.length > 2 ? map.MapUtil.escapeHTML(components[2]) : "") + "</div></div>";
    };
    self.setStaticPOIFormatter(defaultStaticPOIFormatter);
    var clickOnPOI = function(evt) {
        var id = evt.id;
        var indexPos = id.lastIndexOf("_") + 1;
        var index = parseInt(id.substring(indexPos));
        if (indexPos != CLICKAREA_PREFIX_LENGTH) {
            id = id.substring(CLICKAREA_PREFIX_LENGTH, indexPos - 1);
            var poiArray = mAdditionalPOIs[id];
        } else {
            poiArray = mStaticPOIs;
        };
        self.createDispatchDataEvent(clazz.STATIC_POI_CLICKED, poiArray[index]);
    };
    var hoverOverPOI = function(evt) {
        var id = evt.id;
        var indexPos = id.lastIndexOf("_") + 1;
        var index = parseInt(id.substring(indexPos));
        if (indexPos != HOVERAREA_PREFIX_LENGTH) {
            id = id.substring(HOVERAREA_PREFIX_LENGTH, indexPos - 1);
            var poiArray = mAdditionalPOIs[id];
        } else {
            poiArray = mStaticPOIs;
        };
        self.createDispatchDataEvent(clazz.STATIC_POI_HOVERED, poiArray[index]);
    };
    var createLines = function(id) {
        var poiArray = (id == null ? mStaticPOIs : mAdditionalPOIs[id]);
        if (poiArray == null) {
            return;
        };
        var idString = (id == null ? "" : id + "_");
        for (var i = 0; i < poiArray.length;
            ++i) {
            var lineCoordinates = poiArray[i].lineCoordinates;
            if (lineCoordinates != null) {
                var count = lineCoordinates.length / 2;
                var suCoordinates = new Array(count * 2);
                for (var j = 0; j < count;
                    ++j) {
                    var suPoint = map.CoordUtil.mercator2SmartUnit({
                        x: lineCoordinates[j * 2],
                        y: lineCoordinates[j * 2 + 1]
                    });
                    suCoordinates[j * 2] = suPoint.x;
                    suCoordinates[j * 2 + 1] = suPoint.y;
                };
                var line = new map.vector.Line(null, null, suCoordinates, null, LINE_PREFIX + idString + i);
                line.setColor("rgba(0,0,0,0)");
                vectorLayer.addElement(line);
            }
        }
    };
    var createClickAreas = function(id) {
        var poiArray = (id == null ? mStaticPOIs : mAdditionalPOIs[id]);
        if (poiArray == null) {
            return;
        };
        var idString = (id == null ? "" : id + "_");
        if (!vectorLayer.elementExists(CLICKAREA_PREFIX + idString + "0")) {
            for (var i = 0; i < poiArray.length;
                ++i) {
                var clickArea = new map.vector.ClickArea(poiArray[i].x, poiArray[i].y, null, self.getClickTolerance(), clickOnPOI, null, CLICKAREA_PREFIX + idString + i);
                clickArea.setFlexX(poiArray[i].flexX);
                clickArea.setFlexY(poiArray[i].flexY);
                clickArea.setAttachedElement(vectorLayer.getElement(LINE_PREFIX + idString + i));
                vectorLayer.addElement(clickArea);
            }
        }
    };
    var createHoverAreas = function(id) {
        var poiArray = (id == null ? mStaticPOIs : mAdditionalPOIs[id]);
        if (poiArray == null) {
            return;
        };
        var idString = (id == null ? "" : id + "_");
        if (!vectorLayer.elementExists(HOVERAREA_PREFIX + idString + "0")) {
            for (var i = 0; i < poiArray.length;
                ++i) {
                var hoverArea = new map.vector.HoverArea(poiArray[i].x, poiArray[i].y, null, self.getHoverTolerance(), hoverOverPOI, null, null, HOVERAREA_PREFIX + idString + i);
                hoverArea.setFlexX(poiArray[i].flexX);
                hoverArea.setFlexY(poiArray[i].flexY);
                hoverArea.setAttachedElement(vectorLayer.getElement(LINE_PREFIX + idString + i));
                vectorLayer.addElement(hoverArea);
            }
        }
    };
    var createTooltips = function(id) {
        var poiArray = (id == null ? mStaticPOIs : mAdditionalPOIs[id]);
        if (poiArray == null) {
            return;
        };
        var idString = (id == null ? "" : id + "_");
        if (!vectorLayer.elementExists(TOOLTIP_PREFIX + idString + "0")) {
            for (var i = 0; i < poiArray.length;
                ++i) {
                var formattedText;
                var formatter = self.getStaticPOIFormatter();
                formattedText = formatter(poiArray[i].description);
                var tooltip = new map.vector.Tooltip(poiArray[i].x, poiArray[i].y, null, self.getHoverTolerance(), formattedText, null, null, TOOLTIP_PREFIX + idString + i);
                tooltip.setFlexX(poiArray[i].flexX);
                tooltip.setFlexY(poiArray[i].flexY);
                tooltip.setAttachedElement(vectorLayer.getElement(LINE_PREFIX + idString + i));
                vectorLayer.addElement(tooltip);
            }
        }
    };
    var removeElements = function(prefix, id, sparse) {
        var poiArray = (id == null ? mStaticPOIs : mAdditionalPOIs[id]);
        if (poiArray == null) {
            return;
        };
        var prefixString = (id == null ? prefix : prefix + id + "_");
        if (sparse || vectorLayer.elementExists(prefixString + "0")) {
            for (var i = 0; i < poiArray.length;
                ++i) {
                vectorLayer.hideElement(prefixString + i);
            }
        }
    };
    var handleNewPOIs = function(pois, id) {
        var alreadyInBulkMode = vectorLayer.inBulkMode();
        if (!alreadyInBulkMode) {
            vectorLayer.startBulkMode();
        };
        try {
            removeElements(LINE_PREFIX, id, true);
            removeElements(CLICKAREA_PREFIX, id);
            removeElements(HOVERAREA_PREFIX, id);
            removeElements(TOOLTIP_PREFIX, id);
            if (id == null) {
                mStaticPOIs = (pois == null ? [] : pois);
            } else {
                if (pois == null) {
                    delete mAdditionalPOIs[id];
                } else {
                    mAdditionalPOIs[id] = pois;
                }
            };
            createLines(id);
            if (self.hasEventListeners(clazz.STATIC_POI_CLICKED)) {
                createClickAreas(id);
            };
            if (self.hasEventListeners(clazz.STATIC_POI_HOVERED)) {
                createHoverAreas(id);
            };
            if (self.getDefaultStaticPOITooltips()) {
                createTooltips(id);
            }
        } finally {
            if (!alreadyInBulkMode) {
                vectorLayer.endBulkMode();
            }
        }
    };
    self.setStaticPOIs = function(pois, id) {
        if (pois != null) {
            for (var i = 0; i < pois.length;
                ++i) {
                var suPoint = map.CoordUtil.mercator2SmartUnit({
                    x: pois[i].x,
                    y: pois[i].y
                });
                pois[i].x = suPoint.x;
                pois[i].y = suPoint.y;
            }
        };
        handleNewPOIs(pois, id);
        var poiArrays = [];
        if (mStaticPOIs.length > 0) {
            poiArrays.push(mStaticPOIs);
        };
        for (var id in mAdditionalPOIs) {
            var poiArray = mAdditionalPOIs[id];
            if (poiArray.length > 0) {
                poiArrays.push(poiArray);
            }
        };
        var poiArrayCount = poiArrays.length;
        if (poiArrayCount == 0) {
            poiArray = poiArrays;
        } else if (poiArrayCount == 1) {
            poiArray = poiArrays[0];
        } else {
            poiArray = [];
            for (i = 0; i < poiArrayCount;
                ++i) {
                var poiArrayToCopy = poiArrays[i];
                var lengthToCopy = poiArrayToCopy.length;
                for (var j = 0; j < lengthToCopy;
                    ++j) {
                    poiArray.push(poiArrayToCopy[j]);
                }
            }
        };
        self.createDispatchDataEvent(clazz.STATIC_POIS_AVAILABLE, poiArray);
    };
    self.addPOICategory = function(provider, category) {
        requestBuilder.addPOICategory(provider, category);
    };
    self.removePOICategory = function(provider, category) {
        requestBuilder.removePOICategory(provider, category);
    };
    self.addSMOId = function(smoId) {
        requestBuilder.addSMOId(smoId);
    };
    self.removeSMOId = function(smoId) {
        requestBuilder.removeSMOId(smoId);
    };
    self._modifyDefaultStaticPOITooltips = function(propValue) {
        if (propValue) {
            createTooltips();
            for (var id in mAdditionalPOIs) {
                createTooltips(id);
            }
        } else {
            removeElements(TOOLTIP_PREFIX);
            for (var id in mAdditionalPOIs) {
                removeElements(TOOLTIP_PREFIX, id);
            }
        }
    };
    var superAddEventListener = self.addEventListener;
    self.addEventListener = function(vType, vFunction, vObject) {
        superAddEventListener.call(self, vType, vFunction, vObject);
        if (self.hasEventListeners(clazz.STATIC_POI_CLICKED)) {
            createClickAreas();
            for (var id in mAdditionalPOIs) {
                createClickAreas(id);
            }
        };
        if (self.hasEventListeners(clazz.STATIC_POI_HOVERED)) {
            createHoverAreas();
            for (var id in mAdditionalPOIs) {
                createHoverAreas(id);
            }
        }
    };
    var superRemoveEventListener = self.removeEventListener;
    self.removeEventListener = function(vType, vFunction, vObject) {
        superRemoveEventListener.call(self, vType, vFunction, vObject);
        if (!self.hasEventListeners(clazz.STATIC_POI_CLICKED)) {
            removeElements(CLICKAREA_PREFIX);
            for (var id in mAdditionalPOIs) {
                removeElements(CLICKAREA_PREFIX, id);
            }
        };
        if (!self.hasEventListeners(clazz.STATIC_POI_HOVERED)) {
            removeElements(HOVERAREA_PREFIX);
            for (var id in mAdditionalPOIs) {
                removeElements(HOVERAREA_PREFIX, id);
            }
        }
    };
});
qxp.Class.STATIC_POIS_AVAILABLE = "staticPOIsAvailable";
qxp.Class.STATIC_POI_CLICKED = "staticPOIClicked";
qxp.Class.STATIC_POI_HOVERED = "staticPOIHovered";
qxp.OO.addProperty({
    name: "defaultStaticPOITooltips",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "staticPOIFormatter",
    type: qxp.constant.Type.FUNCTION,
    allowNull: false
});
qxp.OO.addProperty({
    name: "staticPOIDelimiter",
    type: qxp.constant.Type.STRING,
    allowNull: true,
    defaultValue: "$\u00a7$"
});
qxp.OO.addProperty({
    name: "clickTolerance",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 7
});
qxp.OO.addProperty({
    name: "hoverTolerance",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 7
});




/* ID: com.ptvag.webcomponent.map.vector.Circle */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.Circle", com.ptvag.webcomponent.map.vector.AbstractCircle, function(x, y, color, pixelSize, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.AbstractCircle.call(this, x, y, color, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    self.calculatePixelRadius = function() {
        return self.getPixelSize() / 2;
    };
    if (pixelSize != null) {
        self.setPixelSize(pixelSize);
    };
    self.refreshOn("pixelSize");
});
qxp.OO.addProperty({
    name: "pixelSize",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 20
});




/* ID: com.ptvag.webcomponent.map.animator.AcceleratingAnimator */
qxp.OO.defineClass("com.ptvag.webcomponent.map.animator.AcceleratingAnimator", com.ptvag.webcomponent.map.animator.Animator, function() {
    com.ptvag.webcomponent.map.animator.Animator.call(this);
    var self = this;
    self.doAnimation = function(animationTime) {
        var theMap = self.getMap();
        var accelerationPart = self.getAccelerationPart();
        var decelerationPart = self.getDecelerationPart();
        var plateauPart = 1 - accelerationPart - decelerationPart;
        var maxSpeedPart = 1 - accelerationPart / 2 - decelerationPart / 2;
        var maxSpeed = 1 / maxSpeedPart;
        var timeFactor = Math.min(1, animationTime / self.getDuration());
        var pathFactor;
        if (timeFactor == 1) {
            pathFactor = 1;
        } else if (timeFactor < accelerationPart) {
            var acceleration = maxSpeed / accelerationPart;
            var height = timeFactor * acceleration;
            pathFactor = (timeFactor * height) / 2;
        } else {
            pathFactor = (accelerationPart * maxSpeed) / 2;
            if (timeFactor < 1 - decelerationPart) {
                var plateauTime = timeFactor - accelerationPart;
                pathFactor += plateauTime * maxSpeed;
            } else {
                pathFactor += plateauPart * maxSpeed;
                pathFactor += (decelerationPart * maxSpeed) / 2;
                var deceleration = maxSpeed / decelerationPart;
                var missingTime = (1 - timeFactor);
                var height = missingTime * deceleration;
                pathFactor -= (missingTime * height) / 2;
            }
        };
        var newCenter = self.interpolatePoint(self.getStartCenter(), theMap.getCenter(), pathFactor);
        var newZoom = self.interpolateZoom(self.getStartZoom(), theMap.getZoom(), pathFactor);
        var newRotation = self.interpolateRotation(self.getStartRotation(), theMap.getRotation(), pathFactor);
        self.setVisibleMapView(newCenter, newZoom, newRotation, timeFactor == 1);
        return timeFactor == 1;
    };
});
qxp.OO.addProperty({
    name: "duration",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 500
});
qxp.OO.addProperty({
    name: "accelerationPart",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0.3
});
qxp.OO.addProperty({
    name: "decelerationPart",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0.7
});




/* ID: com.ptvag.webcomponent.map.vector.ImageMarker */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.ImageMarker", com.ptvag.webcomponent.map.vector.VectorElement, function(x, y, url, alignment, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mImgElement = null;
    var mImgWidth = null;
    var mImgHeight = null;
    self._modifyOpacity = function(propValue) {
        if (mImgElement != null) {
            map.MapUtil.setElementOpacity(mImgElement, propValue);
        }
    };
    self._modifyUrl = function(propValue) {
        if (mImgElement != null) {
            var actualURL = resolveURL(propValue);
            mImgElement.src = actualURL;
            map.ImageLoader.getImageSize(actualURL, onImageSizeAvailable);
        }
    };
    var positionImage = function() {
        if (mImgElement != null && mImgWidth != null && mImgHeight != null) {
            var realX = self.getRealX();
            var realY = self.getRealY();
            if (realX != null && realY != null) {
                var offsetX = 0;
                var offsetY = 0;
                var alignment = self.getAlignment();
                if (alignment & map.layer.VectorLayer.ALIGN_MID_HORIZ) {
                    offsetX = -(mImgWidth) / 2;
                } else if (alignment & map.layer.VectorLayer.ALIGN_RIGHT) {
                    offsetX = -(mImgWidth);
                };
                if (alignment & map.layer.VectorLayer.ALIGN_MID_VERT) {
                    offsetY = -(mImgHeight) / 2;
                } else if (alignment & map.layer.VectorLayer.ALIGN_BOTTOM) {
                    offsetY = -(mImgHeight);
                };
                mImgElement.style.left = Math.round(realX + offsetX) + "px";
                mImgElement.style.top = Math.round(realY + offsetY) + "px";
            }
        }
    };
    var onImageSizeAvailable = function(url, width, height) {
        mImgWidth = width;
        mImgHeight = height;
        positionImage();
        if (mImgElement != null) {
            mImgElement.style.visibility = "visible";
        }
    };
    self.usesCanvas = function(ctx) {
        return (ctx instanceof map.PrintContext ? true : false);
    };
    var resolveURL = function(url) {
        if (url == null) {
            url = "img/com/ptvag/webcomponent/map/1downarrow.gif";
        };
        return map.MapUtil.resolveURL(url);
    };
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        var suPoint = {
            x: self.getX(),
            y: self.getY()
        };
        var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
        var realX = pixCoords.x - mapLeft + self.getFlexX();
        var realY = mapTop - pixCoords.y + self.getFlexY();
        var coords = self.getVectorLayer().getMap().transformPixelCoords(realX, realY, false, false, true);
        self.setRealX(coords.x + self.getOffsetX());
        self.setRealY(coords.y + self.getOffsetY());
        if (ctx instanceof map.PrintContext) {
            if (mImgElement != null && mImgWidth != null && mImgHeight != null) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(mImgElement, 0, 0, mImgWidth, mImgHeight, parseInt(mImgElement.style.left), parseInt(mImgElement.style.top), mImgWidth, mImgHeight);
                ctx.restore();
            }
        } else {
            if (mImgElement == null) {
                var actualURL = resolveURL(self.getUrl());
                mImgElement = document.createElement("img");
                mImgElement.setAttribute("_ptv_map_dontPrint", true);
                mImgElement.src = actualURL;
                mImgElement.style.position = "absolute";
                mImgElement.style.visibility = "hidden";
                mImgElement.style.zIndex = -2000000000 + self.getPriority();
                self._modifyOpacity(self.getOpacity());
                container.appendChild(mImgElement);
                map.ImageLoader.getImageSize(actualURL, onImageSizeAvailable);
            } else {
                positionImage();
            }
        }
    };
    self.clear = function(inDispose) {
        if (mImgElement != null) {
            if (!inDispose) {
                mImgElement.parentNode.removeChild(mImgElement);
            };
            mImgElement = null;
        }
    };
    if (x != null) {
        self.setX(x);
    };
    if (y != null) {
        self.setY(y);
    };
    if (url != null) {
        self.setUrl(url);
    };
    if (alignment != null) {
        self.setAlignment(alignment);
    };
    self.refreshOn("x", "y", "offsetX", "offsetY", "alignment");
});
qxp.OO.addProperty({
    name: "x",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 4355664
});
qxp.OO.addProperty({
    name: "y",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 5464867
});
qxp.OO.addProperty({
    name: "offsetX",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "offsetY",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "realX",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "realY",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "url",
    type: qxp.constant.Type.STRING,
    allowNull: true
});
qxp.OO.addProperty({
    name: "alignment",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 66
});
qxp.OO.addProperty({
    name: "opacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1,
    allowNull: false
});




/* ID: com.ptvag.webcomponent.map.layer.LabelLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.LabelLayer", com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer, function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);
    var self = this;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        var areaElem = self.getParentElement();
        areaElem.style.border = self.getAreaBorderWidth() + "px solid gray";
        areaElem.style.backgroundColor = "white";
        areaElem.style.fontFamily = "Verdana,Arial,sans-serif";
        areaElem.style.fontSize = "10px";
        self.setAreaElement(areaElem);
        if (self.isEnabled()) {
            updateContent();
        }
    };
    self._modifyText = function() {
        updateContent();
    };
    var updateContent = function() {
        var areaElem = self.getAreaElement();
        if (areaElem != null) {
            areaElem.style.width = "";
            areaElem.style.height = "";
            areaElem.innerHTML = self.getText();
            var width = areaElem.offsetWidth;
            var height = areaElem.offsetHeight;
            self.setAreaWidth(width);
            self.setAreaHeight(height);
            self.positionArea();
        }
    };
});
qxp.OO.changeProperty({
    name: "areaOpacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.8
});
qxp.OO.changeProperty({
    name: "areaBorderWidth",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1
});
qxp.OO.addProperty({
    name: "text",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: ""
});




/* ID: com.ptvag.webcomponent.map.vector.FlexMarker */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.FlexMarker", com.ptvag.webcomponent.map.vector.VectorElement, function(flexElementId, priority, id) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id);
    var self = this;
    self.setFlexElementId(flexElementId);
    self.refreshOn("flexElementId");
});
qxp.OO.addProperty({
    name: "flexElementId",
    allowNull: false
});




/* ID: com.ptvag.webcomponent.map.vector.FlexMarkerArrow */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.FlexMarkerArrow", com.ptvag.webcomponent.map.vector.FlexMarker, function(flexElementId, priority, id) {
    com.ptvag.webcomponent.map.vector.FlexMarker.call(this, flexElementId, priority, id);
    var self = this;
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    self.usesCanvas = function() {
        return true;
    };
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        superDraw.apply(self, arguments);
        var flexElement = self.getVectorLayer().getElement(self.getFlexElementId());
        var origPosition = {
            x: flexElement.getX(),
            y: flexElement.getY()
        };
        var origPositionPix = CoordUtil.smartUnit2Pixel(origPosition, mapZoom);
        origPositionPix.x -= mapLeft;
        origPositionPix.y = mapTop - origPositionPix.y;
        var vecX = -flexElement.getFlexY();
        var vecY = flexElement.getFlexX();
        var newPositionPix = {
            x: origPositionPix.x + vecY,
            y: origPositionPix.y - vecX
        };
        var vecLength = vecX * vecX + vecY * vecY;
        if (vecLength > 0) {
            vecLength = Math.sqrt(vecLength);
            if (vecLength > 0) {
                vecX *= 2 / vecLength;
                vecY *= 2 / vecLength;
                ctx.strokeStyle = '#000000';
                ctx.fillStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(origPositionPix.x, origPositionPix.y);
                ctx.lineTo(newPositionPix.x - vecX, newPositionPix.y - vecY);
                ctx.lineTo(newPositionPix.x + vecX, newPositionPix.y + vecY);
                ctx.lineTo(origPositionPix.x, origPositionPix.y);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(origPositionPix.x, origPositionPix.y);
                ctx.lineTo(newPositionPix.x - vecX, newPositionPix.y - vecY);
                ctx.lineTo(newPositionPix.x + vecX, newPositionPix.y + vecY);
                ctx.lineTo(origPositionPix.x, origPositionPix.y);
                ctx.stroke();
            }
        }
    };
});




/* ID: com.ptvag.webcomponent.map.vector.Line */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.Line", com.ptvag.webcomponent.map.vector.VectorElement, function(color, pixelSize, coordinates, priority, id) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var CoordUtil = map.CoordUtil;
    var mCoordinatesIterator = null;
    var mMapLeft;
    var mMapTop;
    var mMinX;
    var mMaxX;
    var mMinY;
    var mMaxY;
    self._modifyCoordinates = function(propValue) {
        if (mCoordinatesIterator != null) {
            mCoordinatesIterator.dispose();
        };
        mCoordinatesIterator = new map.PointListIterator(propValue);
        self.setZoomForPixelCoordinates(null);
        self.refresh();
    };
    self.usesCanvas = function() {
        return true;
    };
    var drawArrow = function(ctx, startX, startY, endX, endY, angle, length) {
        var x = endX - startX;
        var y = startY - endY;
        var lineAngle = Math.atan(y / x);
        if (x < 0) {
            lineAngle += Math.PI;
        };
        var halfAngleRad = angle / 360 * Math.PI;
        var newAngle1 = lineAngle + (Math.PI - halfAngleRad);
        var newAngle2 = lineAngle - (Math.PI - halfAngleRad);
        ctx.beginPath();
        ctx.moveTo(endX + length * Math.cos(newAngle1), endY - length * Math.sin(newAngle1));
        if (angle != 180) {
            ctx.lineTo(endX, endY);
        };
        ctx.lineTo(endX + length * Math.cos(newAngle2), endY - length * Math.sin(newAngle2));
        ctx.stroke();
    };
    self.drawArrowOnLine = function(ctx, x, y, dir) {
        var halfLineWidth = self.getPixelSize() / 2;
        ctx.beginPath();
        var x2 = x + halfLineWidth * 1.0 * Math.cos(dir);
        var y2 = y - halfLineWidth * 1.0 * Math.sin(dir);
        ctx.moveTo(x2, y2);
        var angleLeft = dir + Math.PI * 3.0 / 4.0;
        x2 = x + halfLineWidth * Math.SQRT2 * Math.cos(angleLeft);
        y2 = y - halfLineWidth * Math.SQRT2 * Math.sin(angleLeft);
        ctx.lineTo(x2, y2);
        var angleOpposite = dir + Math.PI;
        x2 = x + halfLineWidth * 0.5 * Math.cos(angleOpposite);
        y2 = y - halfLineWidth * 0.5 * Math.sin(angleOpposite);
        ctx.lineTo(x2, y2);
        var angleRight = dir + Math.PI * 5.0 / 4.0;
        x2 = x + halfLineWidth * Math.SQRT2 * Math.cos(angleRight);
        y2 = y - halfLineWidth * Math.SQRT2 * Math.sin(angleRight);
        ctx.lineTo(x2, y2);
        ctx.fill();
    };
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        superDraw.apply(self, arguments);
        mMapLeft = mapLeft;
        mMapTop = mapTop;
        var zoomFactor = self.getZoomFactor();
        var displacement = self.getDisplacement();
        var lineWidth = self.getPixelSize();
        if (lineWidth <= 0) {
            lineWidth = 5;
        };
        lineWidth *= zoomFactor;
        var halfLineWidth = lineWidth / 2;
        var endArrowLength = self.getEndArrowLength();
        if (endArrowLength == null) {
            endArrowLength = 0;
        } else {
            endArrowLength *= zoomFactor;
        };
        var startArrowLength = self.getStartArrowLength();
        if (startArrowLength == null) {
            startArrowLength = 0;
        } else {
            startArrowLength *= zoomFactor;
        };
        var arrowLength = Math.abs(startArrowLength) + Math.abs(endArrowLength);
        var width = parseInt(container.style.width);
        var height = parseInt(container.style.height);
        var testLeft = -halfLineWidth - arrowLength - displacement;
        var testTop = -halfLineWidth - arrowLength - displacement;
        var testRight = width + halfLineWidth + arrowLength + displacement;
        var testBottom = height + halfLineWidth + arrowLength + displacement;
        var rotation = self.getVectorLayer().getMap().getVisibleRotation();
        if (rotation != 0) {
            var max = Math.max(width, height);
            var min = Math.min(width, height);
            var sizeNeeded = (max * max + min * min) / max;
            var paddingX = Math.ceil((sizeNeeded - width) / 2);
            var paddingY = Math.ceil((sizeNeeded - height) / 2);
            testLeft -= paddingX;
            testRight += paddingX;
            testTop -= paddingY;
            testBottom += paddingY;
        };
        var realCoordinates;
        if (self.getZoomForPixelCoordinates() == mapZoom) {
            realCoordinates = self.getPixelCoordinates();
        } else {
            realCoordinates = [];
            self.setPixelCoordinates(realCoordinates);
            mMinX = null;
            mMaxX = null;
            mMinY = null;
            mMaxY = null;
            mCoordinatesIterator.reset();
            var realX = null;
            var realY = null;
            var nx = 0;
            var ny = 0;
            while (mCoordinatesIterator.iterate()) {
                var suPoint = {
                    x: mCoordinatesIterator.x,
                    y: mCoordinatesIterator.y
                };
                var pixCoords = CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
                if (realX != null) {
                    var distX = pixCoords.x - realX;
                    var distY = pixCoords.y - realY;
                    var dist = distX * distX + distY * distY;
                    if (dist < 1) {
                        continue;
                    };
                    if (displacement != 0) {
                        dist = Math.sqrt(dist);
                        var nxNext = -distY / dist;
                        var nyNext = distX / dist;
                        nx += nxNext;
                        ny += nyNext;
                        dist = Math.sqrt(nx * nx + ny * ny);
                        if (dist != 0) {
                            nx /= dist;
                            ny /= dist;
                        };
                        realX += nx * displacement;
                        realY += ny * displacement;
                        nx = nxNext;
                        ny = nyNext;
                    };
                    realCoordinates.push(realX);
                    realCoordinates.push(realY);
                };
                realX = pixCoords.x;
                realY = pixCoords.y;
                if (mMinX == null || realX < mMinX) {
                    mMinX = realX;
                };
                if (mMaxX == null || realX > mMaxX) {
                    mMaxX = realX;
                };
                if (mMinY == null || realY < mMinY) {
                    mMinY = realY;
                };
                if (mMaxY == null || realY > mMaxY) {
                    mMaxY = realY;
                }
            };
            if (realX != null) {
                realCoordinates.push(realX + nx * displacement);
                realCoordinates.push(realY + ny * displacement);
            };
            self.setZoomForPixelCoordinates(mapZoom);
        };
        if (mMinX == null || (mMaxX - mapLeft) < testLeft || (mMinX - mapLeft) > testRight || (mapTop - mMinY) < testTop || (mapTop - mMaxY) > testBottom) {
            return;
        };
        var bounds = {
            minX: testLeft,
            minY: testTop,
            maxX: testRight,
            maxY: testBottom
        };
        var startPoint = {
            x: 0,
            y: 0
        };
        var endPoint = {
            x: 0,
            y: 0
        };
        var realArrayLength = realCoordinates.length;
        var pathStarted = false;
        ctx.strokeStyle = self.getColor();
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        for (var i = 0; i < realArrayLength; i += 2) {
            var prevRealX = realX;
            var prevRealY = realY;
            realX = realCoordinates[i] - mapLeft;
            realY = mapTop - realCoordinates[i + 1];
            if (i > 0) {
                if (i == 2 && startArrowLength != 0 && (prevRealX != realX || prevRealY != realY)) {
                    drawArrow(ctx, realX, realY, prevRealX, prevRealY, self.getStartArrowAngle(), startArrowLength);
                };
                startPoint.x = prevRealX;
                startPoint.y = prevRealY;
                endPoint.x = realX;
                endPoint.y = realY;
                var clipResult = CoordUtil.clipLine(startPoint, endPoint, bounds);
                if (clipResult < 4) {
                    if (!pathStarted) {
                        pathStarted = true;
                        ctx.beginPath();
                    };
                    if (prevClipResult >= 2) {
                        ctx.moveTo(startPoint.x, startPoint.y);
                    };
                    ctx.lineTo(endPoint.x, endPoint.y);
                }
            } else {
                clipResult = 4;
            };
            var prevClipResult = clipResult;
        };
        if (pathStarted) {
            ctx.stroke();
        };
        if (endArrowLength != 0 && realArrayLength > 2 && (prevRealX != realX || prevRealY != realY)) {
            drawArrow(ctx, prevRealX, prevRealY, realX, realY, self.getEndArrowAngle(), endArrowLength);
        };
        if (self.getArrowsOnLine()) {
            ctx.fillStyle = self.getArrowsOnLineColor();
            var stride = self.getArrowsOnLineStride();
            var currentStartPix = null;
            var currentStartDistance = 0;
            var currentEndPix = null;
            var currentEndDistance = 0;
            var currentLength;
            var vx;
            var vy;
            var distance = 0;
            var i = 0;
            while (true) {
                var newEndNeeded = false;
                if (currentStartPix == null) {
                    if (i >= realArrayLength) {
                        break;
                    };
                    currentStartPix = {
                        x: realCoordinates[i++],
                        y: realCoordinates[i++]
                    };
                    newEndNeeded = true;
                } else if (distance >= currentEndDistance) {
                    newEndNeeded = true;
                };
                if (newEndNeeded) {
                    if (currentEndPix != null) {
                        currentStartPix = currentEndPix;
                        currentStartDistance = currentEndDistance;
                    };
                    if (i >= realArrayLength) {
                        break;
                    };
                    currentEndPix = {
                        x: realCoordinates[i++],
                        y: realCoordinates[i++]
                    };
                    vx = currentEndPix.x - currentStartPix.x;
                    vy = currentEndPix.y - currentStartPix.y;
                    currentLength = Math.sqrt(vx * vx + vy * vy);
                    currentEndDistance += currentLength;
                    if (distance >= currentEndDistance) {
                        continue;
                    }
                };
                var factor = (distance - currentStartDistance) / currentLength;
                var x = currentStartPix.x + factor * vx;
                var y = currentStartPix.y + factor * vy;
                x = x - mapLeft;
                y = mapTop - y;
                if (x >= testLeft && x <= testRight && y >= testTop && y <= testBottom && (vx != 0 || vy != 0)) {
                    var baseAngle = Math.atan2(vy, vx);
                    self.drawArrowOnLine(ctx, x, y, baseAngle);
                };
                distance += stride;
            }
        }
    };
    self.getSquareDistance = function(evt, tolerance) {
        var retVal = {
            squareDistance: -1
        };
        var zoomForPixelCoordinates = self.getZoomForPixelCoordinates();
        if (zoomForPixelCoordinates == null) {
            return retVal;
        };
        var realCoordinates = self.getPixelCoordinates();
        var lineSegmentCount = realCoordinates.length / 2 - 1;
        if (lineSegmentCount < 1) {
            return retVal;
        };
        var coords = self.getVectorLayer().getMap().transformPixelCoords(evt.relMouseX, evt.relMouseY, false, true, true);
        var mouseX = coords.x + mMapLeft;
        var mouseY = mMapTop - coords.y;
        var px = realCoordinates[0];
        var py = realCoordinates[1];
        var minSquareDistance = -1;
        for (var i = 0; i < lineSegmentCount;
            ++i) {
            var prevPx = px;
            var prevPy = py;
            px = realCoordinates[(i + 1) * 2];
            py = realCoordinates[(i + 1) * 2 + 1];
            var bx = px - prevPx;
            var by = py - prevPy;
            var vx = mouseX - prevPx;
            var vy = mouseY - prevPy;
            var t = (vx * bx + vy * by) / (bx * bx + by * by);
            if (t <= 0) {
                var nx = prevPx;
                var ny = prevPy;
            } else if (t >= 1) {
                nx = px;
                ny = py;
            } else {
                nx = prevPx + t * bx;
                ny = prevPy + t * by;
            };
            var distX = mouseX - nx;
            var distY = mouseY - ny;
            var squareDistance = distX * distX + distY * distY;
            if (minSquareDistance == -1 || squareDistance < minSquareDistance) {
                minSquareDistance = squareDistance;
                var nearestX = nx;
                var nearestY = ny;
                var lineSegment = i;
            }
        };
        if (minSquareDistance == -1 || minSquareDistance > tolerance * tolerance) {
            return retVal;
        };
        retVal.squareDistance = minSquareDistance;
        var nearestPoint = com.ptvag.webcomponent.map.CoordUtil.pixel2SmartUnit({
            x: nearestX,
            y: nearestY
        }, zoomForPixelCoordinates);
        retVal.extendedEventInfo = {
            nearestX: nearestPoint.x,
            nearestY: nearestPoint.y,
            lineSegment: lineSegment
        };
        return retVal;
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        mCoordinatesIterator.dispose();
        superDispose.call(self);
    };
    if (color != null) {
        self.setColor(color);
    };
    if (pixelSize != null) {
        self.setPixelSize(pixelSize);
    };
    if (coordinates != null) {
        self.setCoordinates(coordinates);
    } else {
        self._modifyCoordinates(self.getCoordinates());
    };
    self.refreshOn("color", "pixelSize", "endArrowLength", "endArrowAngle", "startArrowLength", "startArrowAngle", "displacement");
});
qxp.OO.addProperty({
    name: "color",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "rgba(10,10,255,0.5)"
});
qxp.OO.addProperty({
    name: "pixelSize",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 10
});
qxp.OO.addProperty({
    name: "coordinates",
    type: qxp.constant.Type.OBJECT,
    allowNull: false,
    defaultValue: []
});
qxp.OO.addProperty({
    name: "pixelCoordinates",
    type: qxp.constant.Type.OBJECT,
    allowNull: true
});
qxp.OO.addProperty({
    name: "zoomForPixelCoordinates",
    type: qxp.constant.Type.NUMBER,
    allowNull: true
});
qxp.OO.addProperty({
    name: "endArrowLength",
    type: qxp.constant.Type.NUMBER,
    allowNull: true
});
qxp.OO.addProperty({
    name: "endArrowAngle",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 60
});
qxp.OO.addProperty({
    name: "startArrowLength",
    type: qxp.constant.Type.NUMBER,
    allowNull: true
});
qxp.OO.addProperty({
    name: "startArrowAngle",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 60
});
qxp.OO.addProperty({
    name: "displacement",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "arrowsOnLine",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "arrowsOnLineColor",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "rgba(255,255,255,1.0)"
});
qxp.OO.addProperty({
    name: "arrowsOnLineStride",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 20
});




/* ID: com.ptvag.webcomponent.map.layer.TextInfoLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.TextInfoLayer", com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer, function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);
    var self = this;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        self.setLastMousePos({
            x: 0,
            y: 0
        });
        var areaElem = document.createElement("div");
        areaElem.style.position = "absolute";
        areaElem.style.left = "0px";
        areaElem.style.top = "0px";
        areaElem.style.fontName = "Arial";
        areaElem.style.fontSize = "10px";
        areaElem.style.color = "black";
        self.getParentElement().appendChild(areaElem);
        self.setAreaElement(areaElem);
    };
    var superOnMouseMove = self.onMouseMove;
    self.onMouseMove = function(evt) {
        superOnMouseMove(evt);
        if (self.getAreaElement() != null) {
            self.setLastMousePos({
                x: evt.relMouseX,
                y: evt.relMouseY
            });
            self.updateView();
        };
        return false;
    };
    self.onViewChanged = function(evt) {
        if (self.getAreaElement() != null) {
            self.updateView();
        }
    };
    self.updateView = function() {
        throw new Error("updateView is abstract");
    };
});
qxp.OO.changeProperty({
    name: "areaOpacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1
});
qxp.OO.addProperty({
    name: "lastMousePos"
});




/* ID: com.ptvag.webcomponent.map.layer.DebugLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.DebugLayer", com.ptvag.webcomponent.map.layer.TextInfoLayer, function() {
    com.ptvag.webcomponent.map.layer.TextInfoLayer.call(this);
    var self = this;
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        if (self.isEnabled()) {
            self.updateView();
        }
    };
    self.updateView = function() {
        var theMap = self.getMap();
        var lastMousePos = self.getLastMousePos();
        var rotatedCoords = theMap.transformPixelCoords(lastMousePos.x - theMap.getWidth() / 2, lastMousePos.y - theMap.getHeight() / 2, true, true, true);
        var suCenter = theMap.getVisibleCenter();
        var pixCenter = CoordUtil.smartUnit2Pixel(suCenter, theMap.getVisibleZoom());
        var pixPoint = {
            x: pixCenter.x + rotatedCoords.x,
            y: pixCenter.y - rotatedCoords.y
        };
        var suPoint = CoordUtil.pixel2SmartUnit(pixPoint, theMap.getZoom());
        var geoPoint = CoordUtil.smartUnit2GeoDecimal(suPoint);
        var mercPoint = CoordUtil.smartUnit2Mercator(suPoint);
        self.getAreaElement().innerHTML = "mouse pos (rel): " + Math.round(lastMousePos.x) + " / " + Math.round(lastMousePos.y) + "<br/>" + "mouse pos (pix): " + Math.round(pixPoint.x) + " / " + Math.round(pixPoint.y) + "<br/>" + "mouse pos (su): " + Math.round(suPoint.x) + " / " + Math.round(suPoint.y) + "<br/>" + "mouse pos (geo): " + Math.round(geoPoint.x) + " / " + Math.round(geoPoint.y) + "<br/>" + "mouse pos (merc): " + Math.round(mercPoint.x) + " / " + Math.round(mercPoint.y) + "<br/>" + "center: " + Math.round(theMap.getCenter().x) + " / " + Math.round(theMap.getCenter().y) + "<br/>" + "zoom: " + theMap.getZoom() + "<br/>" + "visible center: " + Math.round(theMap.getVisibleCenter().x) + " / " + Math.round(theMap.getVisibleCenter().y) + "<br/>" + "visible zoom: " + theMap.getVisibleZoom();
    };
    var init = function() {
        self.setAreaHeight(105);
    };
    init();
});




/* ID: com.ptvag.webcomponent.util.ObjectMap */
qxp.OO.defineClass("com.ptvag.webcomponent.util.ObjectMap", qxp.core.Object, function() {
    qxp.core.Object.call(this);
    var self = this;
    var _key = 0;
    var _keyMap = {};
    var _valueMap = {};
    var _size = 0;
    self.put = function(key, value) {
        var keyCandidates = _keyMap[key];
        var keyFound = false;
        var keyOrigPair = null;
        if (keyCandidates == null) {
            keyCandidates = [];
            _keyMap[key] = keyCandidates;
        } else {
            for (var i = 0; i < keyCandidates.length;
                ++i) {
                keyOrigPair = keyCandidates[i];
                if (keyOrigPair.orig == key) {
                    break;
                };
                keyOrigPair = null;
            }
        };
        if (keyOrigPair == null) {
            ++_key;
            ++_size;
            keyOrigPair = {
                "orig": key,
                "key": _key
            };
            keyCandidates.push(keyOrigPair);
        };
        var actualKey = keyOrigPair.key;
        var oldValue = _valueMap[actualKey];
        _valueMap[actualKey] = value;
        return oldValue;
    };
    self.get = function(key) {
        var keyCandidates = _keyMap[key];
        if (keyCandidates != null) {
            var keyOrigPair;
            for (var i = 0; i < keyCandidates.length;
                ++i) {
                keyOrigPair = keyCandidates[i];
                if (keyOrigPair.orig == key) {
                    return _valueMap[keyOrigPair.key];
                }
            }
        };
        return null;
    };
    self.remove = function(key) {
        var keyCandidates = _keyMap[key];
        if (keyCandidates != null) {
            var keyOrigPair;
            for (var i = 0; i < keyCandidates.length;
                ++i) {
                keyOrigPair = keyCandidates[i];
                if (keyOrigPair.orig == key) {
                    --_size;
                    var actualKey = keyOrigPair.key;
                    delete _valueMap[actualKey];
                    keyCandidates.splice(i, 1);
                    if (keyCandidates.length == 0) {
                        delete _keyMap[key];
                    };
                    return true;
                }
            }
        };
        return false;
    };
    self.size = function() {
        return _size;
    }
});




/* ID: com.ptvag.webcomponent.util.EventUtils */
qxp.OO.defineClass("com.ptvag.webcomponent.util.EventUtils");
qxp.Class.getEvent = function(evt) {
    if (evt) {
        return evt;
    } else {
        var win = window;
        return win.event;
    }
};
qxp.Class.needToAddScroll = function() {
    var clientInstance = qxp.sys.Client.getInstance();
    return !clientInstance.isWebkit() || parseInt(clientInstance.getMajor()) >= 500;
};
qxp.Class.getAbsoluteMouseX = function(evt) {
    var EventUtils = com.ptvag.webcomponent.util.EventUtils;
    var needToAddScroll = EventUtils.NEED_TO_ADD_SCROLL;
    if (needToAddScroll == null) {
        needToAddScroll = EventUtils.needToAddScroll();
        EventUtils.NEED_TO_ADD_SCROLL = needToAddScroll;
    };
    return EventUtils.getEvent(evt).clientX + (needToAddScroll ? com.ptvag.webcomponent.util.DomUtils.getScrollX(window) : 0);
};
qxp.Class.getAbsoluteMouseY = function(evt) {
    var EventUtils = com.ptvag.webcomponent.util.EventUtils;
    var needToAddScroll = EventUtils.NEED_TO_ADD_SCROLL;
    if (needToAddScroll == null) {
        needToAddScroll = EventUtils.needToAddScroll();
        EventUtils.NEED_TO_ADD_SCROLL = needToAddScroll;
    };
    return EventUtils.getEvent(evt).clientY + (needToAddScroll ? com.ptvag.webcomponent.util.DomUtils.getScrollY(window) : 0);
};
qxp.Class.getModifiers = function(evt) {
    var mask = 0;
    if (evt.shiftKey) mask |= com.ptvag.webcomponent.util.EventUtils.SHIFT_MASK;
    if (evt.ctrlKey) mask |= com.ptvag.webcomponent.util.EventUtils.CTRL_MASK;
    if (evt.altKey) mask |= com.ptvag.webcomponent.util.EventUtils.ALT_MASK;
    if (evt.metaKey) mask |= com.ptvag.webcomponent.util.EventUtils.META_MASK;
    return mask;
};
qxp.Class.getMouseButton = function(evt) {
    var EventUtils = com.ptvag.webcomponent.util.EventUtils;
    if (qxp.sys.Client.getInstance().isMshtml()) {
        var buttons = evt.buttons;
        if (buttons) {
            if (buttons & EventUtils.MOUSE_BUTTON_LEFT) {
                return EventUtils.MOUSE_BUTTON_LEFT;
            };
            if (buttons & EventUtils.MOUSE_BUTTON_RIGHT) {
                return EventUtils.MOUSE_BUTTON_RIGHT;
            };
            if (buttons & EventUtils.MOUSE_BUTTON_MIDDLE) {
                return EventUtils.MOUSE_BUTTON_MIDDLE;
            };
            return -1;
        };
        return evt.button;
    };
    switch (evt.which) {
        case 0:
            return 0;
        case 1:
            return EventUtils.MOUSE_BUTTON_LEFT;
        case 2:
            return EventUtils.MOUSE_BUTTON_MIDDLE;
        case 3:
            return EventUtils.MOUSE_BUTTON_RIGHT;
        default:
            return -1;
    }
};
qxp.Class.isLeftMouseButton = function(evt) {
    return com.ptvag.webcomponent.util.EventUtils.getMouseButton(evt) == com.ptvag.webcomponent.util.EventUtils.MOUSE_BUTTON_LEFT;
};
qxp.Class.isMiddleMouseButton = function(evt) {
    return com.ptvag.webcomponent.util.EventUtils.getMouseButton(evt) == com.ptvag.webcomponent.util.EventUtils.MOUSE_BUTTON_MIDDLE;
};
qxp.Class.isRightMouseButton = function(evt) {
    return com.ptvag.webcomponent.util.EventUtils.getMouseButton(evt) == com.ptvag.webcomponent.util.EventUtils.MOUSE_BUTTON_RIGHT;
};
qxp.Class.isCtrlOrCommandKey = function(evt) {
    if (qxp.sys.Client.getInstance().runsOnMacintosh()) {
        return evt.metaKey;
    };
    return evt.ctrlKey;
};
qxp.Class.stopEventPropagation = function(evt) {
    if (evt.stopPropagation) {
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true;
        evt.returnValue = false;
    }
};
qxp.Class.eventHandlerMap = {};
qxp.Class.callEventHandler = function(event, element, handler, functionName) {
    if (functionName == null) {
        return handler(event, element);
    };
    return handler[functionName].call(handler, event, element);
};
qxp.Class.mouseWheelHandler = function(event, element, handler, functionName) {
    event = com.ptvag.webcomponent.util.EventUtils.getEvent(event);
    if (event.wheelDelta != null) {
        var ticks = event.wheelDelta / -40;
        if (qxp.sys.Client.getInstance().isOpera()) {
            ticks = -ticks;
        };
        event.wheelTicks = ticks;
    } else {
        event.wheelTicks = event.detail;
    };
    var retVal = com.ptvag.webcomponent.util.EventUtils.callEventHandler(event, element, handler, functionName);
    if ((retVal == false) && event.preventDefault) {
        event.preventDefault();
    };
    return retVal;
};
qxp.Class.addEventHandler = function(element, handlerName, handler, functionName) {
    if (element == null) {
        throw "Adding event handler failed. element is null.";
    };
    var self = com.ptvag.webcomponent.util.EventUtils;
    var actualHandlerName = null;
    var actualHandler;
    if (handlerName == "onmousewheel" || handlerName == "mousewheel") {
        actualHandler = function(event) {
            return com.ptvag.webcomponent.util.EventUtils.mouseWheelHandler(event, element, handler, functionName);
        };
        if (qxp.sys.Client.getInstance().isGecko()) {
            actualHandlerName = "DOMMouseScroll";
        }
    } else {
        actualHandler = function(event) {
            return com.ptvag.webcomponent.util.EventUtils.callEventHandler(event, element, handler, functionName);
        };
    };
    var secondaryMap = self.eventHandlerMap[handlerName];
    if (secondaryMap == null) {
        secondaryMap = new com.ptvag.webcomponent.util.ObjectMap();
        self.eventHandlerMap[handlerName] = secondaryMap;
    };
    var tertiaryMap = secondaryMap.get(element);
    if (tertiaryMap == null) {
        tertiaryMap = new com.ptvag.webcomponent.util.ObjectMap();
        secondaryMap.put(element, tertiaryMap);
    };
    if (functionName == null) {
        tertiaryMap.put(handler, actualHandler);
    } else {
        var finalMap = tertiaryMap.get(handler);
        if (finalMap == null) {
            finalMap = {};
            tertiaryMap.put(handler, finalMap);
        };
        finalMap[functionName] = actualHandler;
    };
    if (element.addEventListener) {
        if (actualHandlerName == null) {
            if (handlerName.indexOf("on") == 0) {
                actualHandlerName = handlerName.substring(2);
            } else {
                actualHandlerName = handlerName;
            }
        };
        element.addEventListener(actualHandlerName, actualHandler, false);
    } else if (element.attachEvent) {
        if (actualHandlerName == null) {
            if (handlerName.indexOf("on") != 0) {
                actualHandlerName = "on" + handlerName;
            } else {
                actualHandlerName = handlerName;
            }
        };
        element.attachEvent(actualHandlerName, actualHandler);
    } else {
        throw "Unknown event listener model";
    }
};
qxp.Class.removeEventHandler = function(element, handlerName, handler, functionName) {
    if (element == null) {
        throw "Removing event handler failed. element is null.";
    };
    var self = com.ptvag.webcomponent.util.EventUtils;
    var actualHandlerName = null;
    var actualHandler;
    if (handlerName == "onmousewheel" || handlerName == "mousewheel") {
        if (qxp.sys.Client.getInstance().isGecko()) {
            actualHandlerName = "DOMMouseScroll";
        }
    };
    var secondaryMap = self.eventHandlerMap[handlerName];
    if (secondaryMap == null) {
        return false;
    };
    var tertiaryMap = secondaryMap.get(element);
    if (tertiaryMap == null) {
        return false;
    };
    if (functionName == null) {
        actualHandler = tertiaryMap.get(handler);
        if (actualHandler == null) {
            return false;
        };
        tertiaryMap.remove(handler);
    } else {
        var finalMap = tertiaryMap.get(handler);
        if (finalMap == null) {
            return false;
        };
        actualHandler = finalMap[functionName];
        if (actualHandler == null) {
            return false;
        };
        delete finalMap[functionName];
        var stillHasKeys = false;
        for (var i in finalMap) {
            stillHasKeys = true;
            break;
        };
        if (!stillHasKeys) {
            tertiaryMap.remove(handler);
        }
    };
    if (tertiaryMap.size() == 0) {
        secondaryMap.remove(element);
        if (secondaryMap.size() == 0) {
            delete self.eventHandlerMap[handlerName];
        }
    };
    if (element.removeEventListener) {
        if (actualHandlerName == null) {
            if (handlerName.indexOf("on") == 0) {
                actualHandlerName = handlerName.substring(2);
            } else {
                actualHandlername = handlerName;
            }
        };
        if (actualHandlerName != 'load' && actualHandlerName != 'unload') {
            element.removeEventListener(actualHandlerName, actualHandler, false);
        }
    } else if (element.detachEvent) {
        if (actualHandlerName == null) {
            if (handlerName.indexOf("on") != 0) {
                actualHandlerName = "on" + handlerName;
            } else {
                actualHandlerName = handlerName;
            }
        };
        element.detachEvent(actualHandlerName, actualHandler);
    } else {
        throw "Unknown event listener model";
    };
    return true;
};
qxp.Class.MOUSE_BUTTON_LEFT = 1;
qxp.Class.MOUSE_BUTTON_RIGHT = 2;
qxp.Class.MOUSE_BUTTON_MIDDLE = 4;
qxp.Class.SHIFT_MASK = 1;
qxp.Class.CTRL_MASK = 2;
qxp.Class.ALT_MASK = 4;
qxp.Class.META_MASK = 8;
qxp.Class.KEY_CODE_TAB = 9;
qxp.Class.KEY_CODE_ENTER = 13;
qxp.Class.KEY_CODE_ESC = 27;
qxp.Class.KEY_CODE_LEFT = 37;
qxp.Class.KEY_CODE_UP = 38;
qxp.Class.KEY_CODE_RIGHT = 39;
qxp.Class.KEY_CODE_DOWN = 40;
qxp.Class.KEY_CODE_PAGE_UP = 33;
qxp.Class.KEY_CODE_PAGE_DOWN = 34;
qxp.Class.KEY_CODE_SPACE = 32;
qxp.Class.KEY_CODE_POS1 = 36;
qxp.Class.KEY_CODE_END = 35;
qxp.Class.KEY_CODE_F1 = 112;
qxp.Class.KEY_CODE_F2 = 113;
qxp.Class.KEY_CODE_F3 = 114;
qxp.Class.KEY_CODE_F4 = 115;
qxp.Class.KEY_CODE_F5 = 116;
qxp.Class.KEY_CODE_F6 = 117;
qxp.Class.KEY_CODE_F7 = 118;
qxp.Class.KEY_CODE_F8 = 119;
qxp.Class.KEY_CODE_F9 = 120;
qxp.Class.KEY_CODE_F10 = 121;
qxp.Class.KEY_CODE_F11 = 122;
qxp.Class.KEY_CODE_F12 = 123;
qxp.Class.KEY_CODE_KEYPAD_PLUS = 107;
qxp.Class.KEY_CODE_KEYPAD_MINUS = 109;
qxp.Class.KEY_CODE_PLUS = 187;
qxp.Class.KEY_CODE_MINUS = 189;




/* ID: com.ptvag.webcomponent.map.PointListIterator */
qxp.OO.defineClass("com.ptvag.webcomponent.map.PointListIterator", qxp.core.Object, function(pointList) {
    qxp.core.Object.call(this);
    if (typeof pointList == "string") {
        pointList = pointList.split(" ");
        for (var i = 0; i < pointList.length; i++) {
            pointList[i] = parseFloat(pointList[i]);
        }
    };
    this._list = pointList;
    this._currentIndex = -1;
    if (pointList.length > 0) {
        var firstItem = pointList[0];
        if (isNaN(firstItem)) {
            this._isListOfPoints = (firstItem.x != null);
            this._isListOfVectorElems = (firstItem.getX != null);
        }
    }
});
qxp.Proto.reset = function() {
    this._currentIndex = -1;
};
qxp.Proto.iterate = function() {
    this._currentIndex++;
    if (this._currentIndex >= this._list.length) {
        return false;
    } else {
        if (this._isListOfPoints || this._isListOfVectorElems) {
            var item = this._list[this._currentIndex];
            if (this._isListOfPoints) {
                this.x = item.x;
                this.y = item.y;
            } else {
                this.x = item.getX();
                this.y = item.getY();
            };
            if (isNaN(this.x)) {
                throw new Error("Iterating point list failed: x value of point at index " + this._currentIndex + " is NaN: " + this.x);
            };
            if (isNaN(this.y)) {
                throw new Error("Iterating point list failed: y value of point at index " + this._currentIndex + " is NaN: " + this.y);
            }
        } else {
            this.x = this._list[this._currentIndex];
            this.y = this._list[this._currentIndex + 1];
            if (isNaN(this.x)) {
                throw new Error("Iterating point list failed: x value at index " + this._currentIndex + " is NaN: " + this.x);
            };
            if (isNaN(this.y)) {
                throw new Error("Iterating point list failed: y value at index " + (this._currentIndex + 1) + " is NaN: " + this.y);
            };
            this._currentIndex++;
        };
        return true;
    }
};
qxp.Proto.getX = function() {
    return this.x;
};
qxp.Proto.getY = function() {
    return this.y;
};




/* ID: com.ptvag.webcomponent.map.vector.Tooltip */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.Tooltip", com.ptvag.webcomponent.map.vector.AbstractHoverArea, function(x, y, maxZoom, tolerance, text, alignment, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.AbstractHoverArea.call(this, x, y, maxZoom, tolerance, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mTimer = null;
    var mTooltip = null;
    var mTooltipCreator = null;
    var mContainer = null;
    var mTooltipWidth = null;
    var mTooltipHeight = null;
    var mFadeTimer = null;
    var mCurrentOpacity = 0;
    var mTargetOpacity = 0;
    var mHovering = false;
    var mMapLeft;
    var mMapTop;
    var mMapZoom;
    var disableFilters = function() {
        if (qxp.sys.Client.getInstance().isMshtml() && mTooltip != null && !mTooltip._filtersDisabled) {
            var divs = mTooltip.getElementsByTagName("div");
            var divCount = divs.length;
            for (var i = 0; i < divCount;
                ++i) {
                var div = divs[i];
                if (div.style.filter != null && div.style.filter != "") {
                    div._preservedFilter = div.style.filter;
                    div.style.filter = "";
                }
            };
            mTooltip._filtersDisabled = true;
        }
    };
    var enableFilters = function() {
        if (qxp.sys.Client.getInstance().isMshtml() && mTooltip != null && mTooltip._filtersDisabled) {
            var divs = mTooltip.getElementsByTagName("div");
            var divCount = divs.length;
            for (var i = 0; i < divCount;
                ++i) {
                var div = divs[i];
                if (div._preservedFilter != null) {
                    div.style.filter = div._preservedFilter;
                    div._preservedFilter = null;
                }
            };
            mTooltip._filtersDisabled = null;
        }
    };
    var createTooltipElement = function(recreate) {
        if ((mTooltip == null || recreate) && mContainer != null) {
            mTooltipCreator = self.getInfoBoxElementFactory();
            if (mTooltipCreator == null) {
                mTooltipCreator = com.ptvag.webcomponent.map.vector.InfoBoxElementFactory;
            };
            mTooltip = mTooltipCreator.createInfoBoxElement(self.getRealX(), self.getRealY(), {
                text: self.getText(),
                background: self.getBackground()
            }, mContainer, true, mTooltip, self.getAllowWrap(), 0);
            mTooltip.style.zIndex = 2000000000 + self.getPriority();
        };
        return (mTooltip != null);
    };
    var destroyTooltipElement = function() {
        if (mTooltip != null) {
            mTooltipCreator.destroyInfoBoxElement(mTooltip);
            mTooltip = null;
            mTooltipCreator = null;
        }
    };
    var setOpacity = function() {
        if (createTooltipElement()) {
            if (mCurrentOpacity != 100) {
                disableFilters();
            };
            map.MapUtil.setElementOpacity(mTooltip, mCurrentOpacity / 100);
            if (mCurrentOpacity == 100) {
                enableFilters();
            }
        };
        if (mCurrentOpacity == mTargetOpacity) {
            if (mCurrentOpacity == 0) {
                destroyTooltipElement();
            };
            return true;
        };
        return (mTooltip == null);
    };
    var setFadeTimer = function() {
        if (mTargetOpacity >= mCurrentOpacity) {
            mFadeTimer = window.setTimeout(fade, self.getFadeIntervalIn());
        } else {
            mFadeTimer = window.setTimeout(fade, self.getFadeIntervalOut());
        }
    };
    var fade = function() {
        if (mFadeTimer == null) {
            return;
        };
        mFadeTimer = null;
        var diff = mTargetOpacity - mCurrentOpacity;
        var fadeStep = self.getFadeStep();
        if (diff <= fadeStep && diff >= -fadeStep) {
            mCurrentOpacity = mTargetOpacity;
        } else {
            if (diff < 0) {
                mCurrentOpacity -= fadeStep;
            } else {
                mCurrentOpacity += fadeStep;
            }
        };
        if (!setOpacity()) {
            setFadeTimer();
        }
    };
    var fadeTo = function(targetOpacity) {
        if (targetOpacity != mTargetOpacity) {
            if (mTimer != null) {
                window.clearTimeout(mTimer);
                mTimer = null;
            }
        };
        mTargetOpacity = targetOpacity;
        if (!setOpacity() && mFadeTimer == null) {
            setFadeTimer();
        }
    };
    var timeout = function() {
        fadeTo(0);
        mTimer = null;
    };
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        mMapZoom = mapZoom;
        mMapLeft = mapLeft;
        mMapTop = mapTop;
        superDraw(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom);
        mContainer = topLevelContainer;
    };
    self.onHover = function(evt, forceChange) {
        var nearestX = evt.nearestX;
        if (nearestX != null) {
            var nearestPoint = com.ptvag.webcomponent.map.CoordUtil.smartUnit2Pixel({
                x: nearestX,
                y: evt.nearestY
            }, mMapZoom);
            var realX = nearestPoint.x - mMapLeft;
            var realY = mMapTop - nearestPoint.y;
            var coords = self.getVectorLayer().getMap().transformPixelCoords(realX, realY, false, false, true);
            self.setRealX(coords.x);
            self.setRealY(coords.y);
        };
        if (mContainer != null) {
            mHovering = true;
            if (forceChange) {
                createTooltipElement(true);
            };
            fadeTo(self.getTargetOpacity());
        }
    };
    self.onUnhover = function(evt) {
        if (mHovering) {
            mHovering = false;
            fadeTo(0);
        }
    };
    self.clear = function() {
        mHovering = false;
        if (mTimer != null) {
            window.clearTimeout(mTimer);
            mTimer = null;
        };
        if (mFadeTimer != null) {
            window.clearTimeout(mFadeTimer);
            mFadeTimer = null;
        };
        destroyTooltipElement();
        mCurrentOpacity = 0;
    };
    self.testUnhover = function(evt) {
        if (mTooltip != null && mHovering) {
            return mTooltipCreator.testUnhover(evt, mTooltip, self.getTolerance());
        };
        return false;
    };
    self.refresh = function() {
        if (self.getVectorLayer()) {
            createTooltipElement(true);
            fadeTo(mTargetOpacity);
        }
    };
    self.hitTest = function(evt) {
        if (mTooltip != null && mHovering) {
            return mTooltipCreator.hitTest(evt, mTooltip);
        };
        return false;
    };
    if (text != null) {
        self.setText(text);
    };
    if (alignment != null) {
        self.setAlignment(alignment);
    };
    self.refreshOn("text", "alignment", "infoBoxElementFactory", "targetOpacity", "background");
});
qxp.Class.SHOW_TIME = 4000;
qxp.OO.addProperty({
    name: "text",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: ""
});
qxp.OO.addProperty({
    name: "alignment",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 66
});
qxp.OO.addProperty({
    name: "infoBoxElementFactory",
    type: qxp.constant.Type.OBJECT,
    allowNull: true,
    defaultValue: null
});
qxp.OO.addProperty({
    name: "fadeStep",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 20
});
qxp.OO.addProperty({
    name: "targetOpacity",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 100
});
qxp.OO.addProperty({
    name: "fadeIntervalOut",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 40
});
qxp.OO.addProperty({
    name: "fadeIntervalIn",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 5
});
qxp.OO.addProperty({
    name: "background",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "#ffffff"
});
qxp.OO.addProperty({
    name: "allowWrap",
    type: qxp.constant.Type.BOOLEAN
});




/* ID: com.ptvag.webcomponent.map.layer.TextLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.TextLayer", com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer, function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);
    var self = this;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        var areaElem = self.getParentElement();
        areaElem.style.border = self.getAreaBorderWidth() + "px solid gray";
        areaElem.style.backgroundColor = "white";
        areaElem.style.fontFamily = "Verdana,Arial,sans-serif";
        areaElem.style.fontSize = "10px";
        self.setAreaElement(areaElem);
        if (self.isEnabled()) {
            updateContent();
        }
    };
    self._modifyText = function() {
        updateContent();
    };
    var updateContent = function() {
        var areaElem = self.getAreaElement();
        if (areaElem != null) {
            areaElem.style.width = "";
            areaElem.style.height = "";
            areaElem.innerHTML = '<div style="margin-left:' + self.getMarginLeft() + 'px;margin-right:' + self.getMarginRight() + 'px;margin-top:' + self.getMarginTop() + 'px;margin-bottom:' + self.getMarginBottom() + 'px;white-space:nowrap">' + self.getText() + '</div>';
            var width = areaElem.offsetWidth;
            var height = areaElem.offsetHeight;
            self.setAreaWidth(width);
            self.setAreaHeight(height);
            self.positionArea();
        }
    };
    self.doPrintStaticArea = function(ctx, htmlContainer, htmlBackground) {
        var areaBorderWidth = self.getAreaBorderWidth();
        var left = self.getComputedAreaLeft();
        var top = self.getComputedAreaTop();
        var width = self.getComputedAreaWidth();
        var height = self.getComputedAreaHeight();
        ctx.strokeStyle = "rgb(128, 128, 128)";
        ctx.lineWidth = areaBorderWidth;
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.fill();
        ctx.beginPath();
        ctx.rect(parseInt(left + areaBorderWidth / 2), parseInt(top + areaBorderWidth / 2), width - areaBorderWidth, height - areaBorderWidth);
        ctx.stroke();
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.fontFamily = "sans-serif";
        ctx.fontStyle = "plain";
        ctx.fontSize = 10;
        ctx.textAlignment = 34;
        ctx.drawText(self.getText(), Math.round(left + width / 2), Math.round(top + height / 2));
    };
});
qxp.OO.changeProperty({
    name: "areaOpacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.8
});
qxp.OO.changeProperty({
    name: "areaBorderWidth",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1
});
qxp.OO.addProperty({
    name: "text",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: ""
});
qxp.OO.addProperty({
    name: "marginLeft",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 3
});
qxp.OO.addProperty({
    name: "marginRight",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 3
});
qxp.OO.addProperty({
    name: "marginTop",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "marginBottom",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1
});




/* ID: com.ptvag.webcomponent.util.ServerUtils */
qxp.OO.defineClass("com.ptvag.webcomponent.util.ServerUtils");
qxp.Class.basePath = "/webcomponent";
qxp.Class.rewriteURL = function(url, ignoreSuffix) {
    var actualURL;
    if (url.charAt(0) != "/") {
        actualURL = "/" + url;
    } else {
        actualURL = url;
    };
    var pos = -1;
    if (!ignoreSuffix) {
        pos = actualURL.indexOf("?");
    };
    if (pos == -1) {
        return qxp.core.ServerSettings.serverPathPrefix + com.ptvag.webcomponent.util.ServerUtils.basePath + actualURL + (ignoreSuffix ? "" : qxp.core.ServerSettings.serverPathSuffix);
    };
    return qxp.core.ServerSettings.serverPathPrefix + com.ptvag.webcomponent.util.ServerUtils.basePath + actualURL.substring(0, pos) + qxp.core.ServerSettings.serverPathSuffix + actualURL.substring(pos);
};




/* ID: com.ptvag.webcomponent.map.vector.DynamicTooltip */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.DynamicTooltip", com.ptvag.webcomponent.map.vector.Tooltip, function(x, y, maxZoom, tolerance, contentProvider, alignment, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.Tooltip.call(this, x, y, maxZoom, tolerance, "", alignment, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var superOnHover = self.onHover;
    self.onHover = function(evt) {
        var contentProvider = self.getContentProvider();
        var forceChange = false;
        if (contentProvider) {
            var newText = contentProvider(self, evt);
            if (newText != self.getText()) {
                self.setText(newText);
            }
        };
        superOnHover.call(this, evt);
    };
    self.setContentProvider(contentProvider);
});
qxp.OO.addProperty({
    name: "contentProvider",
    type: qxp.constant.Type.FUNCTION,
    allowNull: true,
    defaultValue: null
});




/* ID: com.ptvag.webcomponent.map.layer.SimpleMapLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.SimpleMapLayer", com.ptvag.webcomponent.map.layer.AbstractMapLayer, function(requestBuilder, options) {
    com.ptvag.webcomponent.map.layer.AbstractMapLayer.call(this, requestBuilder);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mRequestRunning = false;
    var mPendingRequest;
    var mImgInfo;
    var mLoadingImgInfo;
    var mLastRequestedImgInfo;
    var mVisibleSectionMarker;
    var mPOIService = null;
    var mPOICall = null;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        mPOIService = com.ptvag.webcomponent.map.SERVICE;
        mImgInfo = createImgInfo();
        mLoadingImgInfo = createImgInfo();
        mLastRequestedImgInfo = mImgInfo;
        self.getMap().getController().addEventListener("changeActiveLayer", onActiveLayerChanged);
        requestBuilder.addEventListener("poiCategoriesChanged", onPOICategoriesChanged);
        requestBuilder.addEventListener("changeHint", onHintChanged);
        self.getMap().addEventListener("newMapSession", onNewMapSession);
        var zoomDifference = self.getZoomDifference();
        if (zoomDifference != 0) {
            mVisibleSectionMarker = document.createElement("div");
            mVisibleSectionMarker.style.position = "absolute";
            mVisibleSectionMarker.style.border = "1px solid #808080";
            self.getAreaElement().appendChild(mVisibleSectionMarker);
            positionVisibleSectionMarker();
            self.getAreaElement().style.backgroundColor = "silver";
        };
        updateImage({});
    };
    var createImgInfo = function() {
        var imgElem = document.createElement("img");
        imgElem.style.position = "absolute";
        imgElem.style.MozUserSelect = "none";
        imgElem.style.visibility = "hidden";
        self.getAreaElement().appendChild(imgElem);
        return {
            imgElem: imgElem,
            center: {}
        };
    };
    var cleanUpImgInfo = function(imgInfo) {
        if (imgInfo) {
            imgInfo.imgElem = null;
        }
    };
    var positionVisibleSectionMarker = function() {
        if (mVisibleSectionMarker) {
            var mapWidth = self.getMap().getWidth();
            var mapHeight = self.getMap().getHeight();
            var zoomDifference = self.getZoomDifference();
            var zoomFactor = Math.pow(map.CoordUtil.ZOOM_LEVEL_FACTOR, zoomDifference);
            var markerWidth = mapWidth / zoomFactor + 2;
            var markerHeight = mapHeight / zoomFactor + 2;
            var areaWidth = self.getComputedAreaWidth();
            var areaHeight = self.getComputedAreaHeight();
            var areaBorderWidth = self.getAreaBorderWidth();
            if (map.MapUtil.isBorderBoxSizingActive()) {
                var elementWidth = markerWidth;
                var elementHeight = markerHeight;
            } else {
                elementWidth = markerWidth - 2;
                elementHeight = markerHeight - 2;
            };
            mVisibleSectionMarker.style.left = Math.round((areaWidth - markerWidth) / 2) - areaBorderWidth + "px";
            mVisibleSectionMarker.style.width = Math.round(elementWidth) + "px";
            mVisibleSectionMarker.style.top = Math.round((areaHeight - markerHeight) / 2) - areaBorderWidth + "px";
            mVisibleSectionMarker.style.height = Math.round(elementHeight) + "px";
        }
    };
    var superModifyComputedAreaWidth = self._modifyComputedAreaWidth;
    self._modifyComputedAreaWidth = function() {
        positionVisibleSectionMarker();
        superModifyComputedAreaWidth.apply(self, arguments);
    };
    var superModifyComputedAreaHeight = self._modifyComputedAreaHeight;
    self._modifyComputedAreaHeight = function() {
        positionVisibleSectionMarker();
        superModifyComputedAreaHeight.apply(self, arguments);
    };
    var onActiveLayerChanged = function(evt) {
        try {
            if (self.isNoLayerActive()) {
                updateImage({});
            }
        } catch (e) {
            self.error("Error in onActiveLayerChanged in SimpleMapLayer", e);
        }
    };
    var onPOICategoriesChanged = function(evt) {
        updateImage({}, true, "mapapi:poiCategoriesChanged");
    };
    var onHintChanged = function() {
        updateImage({}, true, "mapapi:hintChanged");
    };
    var onNewMapSession = function(evt) {
        if (requestBuilder.isTransparent()) {
            updateImage({}, true, "mapapi:session");
        }
    };
    var superOnViewChanged = self.onViewChanged;
    self.onViewChanged = function(evt) {
        superOnViewChanged.apply(self, arguments);
        updateImage(evt);
    };
    self.getShownZoom = function() {
        return self.getMap().getZoom() + self.getZoomDifference();
    };
    var superSetServerLayerVisible = self.setServerLayerVisible;
    self.setServerLayerVisible = function() {
        superSetServerLayerVisible.apply(self, arguments);
        updateImage({}, true, "mapapi:serverLayersChanged");
    };
    var updateImage = function(evt, forceUpdate, localLoggingInfo) {
        if (!self.isEnabled()) {
            return;
        };
        loadImage(forceUpdate || evt.clipRectChanged, localLoggingInfo);
        self.positionImage(mImgInfo);
        self.positionImage(mLoadingImgInfo, true);
    };
    var loadImage = function(forceUpdate, loggingInfo) {
        var theMap = self.getMap();
        centerSu = theMap.getCenter();
        zoom = self.getShownZoom();
        var rotation = theMap.getRotation();
        if (self.getAutoRotate()) {
            rotation = null;
        };
        var width = self.getComputedAreaWidth();
        var height = self.getComputedAreaHeight();
        var borderWidth = self.getBorderWidth();
        width += 2 * borderWidth;
        height += 2 * borderWidth;
        if (self.isNoLayerActive() && (forceUpdate || mLastRequestedImgInfo.zoom != zoom || mLastRequestedImgInfo.center.x != centerSu.x || mLastRequestedImgInfo.center.y != centerSu.y || mLastRequestedImgInfo.requestWidth != width || mLastRequestedImgInfo.requestHeight != height || mLastRequestedImgInfo.rotation != rotation)) {
            if (loggingInfo == null) {
                loggingInfo = self.getMap().getLoggingInfo();
            };
            if (mRequestRunning) {
                mPendingRequest = [forceUpdate, loggingInfo];
                return;
            }
        } else {
            return;
        };
        mRequestRunning = true;
        mLoadingImgInfo.center = centerSu;
        mLoadingImgInfo.zoom = zoom;
        mLoadingImgInfo.requestWidth = width;
        mLoadingImgInfo.requestHeight = height;
        mLoadingImgInfo.rotation = rotation;
        mLoadingImgInfo.loaded = null;
        mLastRequestedImgInfo = mLoadingImgInfo;
        var centerPix = map.CoordUtil.smartUnit2Pixel(centerSu, zoom);
        var fromPix = {
            x: centerPix.x - width / 2,
            y: centerPix.y - height / 2
        };
        var toPix = {
            x: centerPix.x + width / 2,
            y: centerPix.y + height / 2
        };
        var fromSu = map.CoordUtil.pixel2SmartUnit(fromPix, zoom);
        var toSu = map.CoordUtil.pixel2SmartUnit(toPix, zoom);
        var fromMerc = map.CoordUtil.smartUnit2Mercator(fromSu);
        var toMerc = map.CoordUtil.smartUnit2Mercator(toSu);
        var left = Math.round(fromMerc.x);
        var bottom = Math.round(fromMerc.y);
        var right = Math.round(toMerc.x);
        var top = Math.round(toMerc.y);
        var imgInfo = requestBuilder.buildRequest(left, top, right, bottom, width, height, loggingInfo, null, rotation);
        if (imgInfo.completelyClipped) {
            mRequestRunning = false;
        } else {
            mLoadingImgInfo.clipLeft = imgInfo.clipLeft;
            mLoadingImgInfo.clipTop = imgInfo.clipTop;
            mLoadingImgInfo.width = imgInfo.width;
            mLoadingImgInfo.height = imgInfo.height;
            mLoadingImgInfo.loaded = false;
            mLoadingImgInfo.imageId = imgInfo.imageId;
            mLoadingImgInfo.visibleZoom = null;
            mLoadingImgInfo.bbox = [fromSu, toSu];
            map.ImageLoader.loadImage(mLoadingImgInfo.imgElem, imgInfo.url, self.onImageLoaded, 100);
        }
    };
    var onPOIsLoaded = function(pois, exc) {
        mPOICall = null;
        if (exc != null) {
            var Rpc = qxp.io.remote.Rpc;
            if (exc.origin != Rpc.origin.local || exc.code != Rpc.localError.abort) {
                self.error("Error loading POI information", exc);
            }
        };
        var serverDrawnObjectManager = self.getMap().getServerDrawnObjectManager();
        if (serverDrawnObjectManager.getRequestBuilder() == requestBuilder) {
            serverDrawnObjectManager.setStaticPOIs(pois);
        } else {
            var layerName = self.getName();
            if (layerName == null) {
                layerName = "";
            };
            serverDrawnObjectManager.setStaticPOIs(pois, layerName);
        }
    };
    self.onImageLoaded = function(elem, url, exc) {
        if (exc == null) {
            var oldImgInfo = mImgInfo;
            mImgInfo = mLoadingImgInfo;
            mLoadingImgInfo = oldImgInfo;
            mImgInfo.loaded = true;
            mImgInfo.visibleZoom = null;
            mImgInfo.freshlyLoaded = true;
            self.onImagesSwapped(mImgInfo);
            self.positionImage(mImgInfo);
            mLoadingImgInfo.imgElem.style.visibility = "hidden";
            mLastRequestedImgInfo = mImgInfo;
            if (mPOICall != null) {
                mPOIService.abort(mPOICall);
                mPOICall = null;
            };
            if (requestBuilder.supportsServerDrawnObjects()) {
                if (mImgInfo.imageId != null && requestBuilder.hasPOICategories()) {
                    if (map.Map.STATELESS_MODE) {
                        var params = url.substring(url.indexOf("?") + 1);
                        mPOICall = mPOIService.callAsync(onPOIsLoaded, "getPOIsStateless", params);
                    } else {
                        mPOICall = mPOIService.callAsync(onPOIsLoaded, "getPOIs", mImgInfo.imageId);
                    }
                } else {
                    var serverDrawnObjectManager = self.getMap().getServerDrawnObjectManager();
                    if (serverDrawnObjectManager) {
                        serverDrawnObjectManager.setStaticPOIs([]);
                    }
                }
            }
        } else {
            window.setTimeout(function() {
                self.error("Could not load image", exc);
            }, 0);
        };
        mRequestRunning = false;
        if (mPendingRequest) {
            loadImage.apply(null, mPendingRequest);
            self.positionImage(mLoadingImgInfo, true);
            mPendingRequest = null;
        }
    };
    self.onImagesSwapped = function() {};
    self.positionImage = function(imgInfo, dontChangeVisibility) {
        if (imgInfo.loaded == null) {
            return;
        };
        var theMap = self.getMap();
        var visibleZoom = theMap.getVisibleZoom() + self.getZoomDifference();
        var visibleCenter = theMap.getVisibleCenter();
        var visibleWidth = self.getComputedAreaWidth();
        var visibleHeight = self.getComputedAreaHeight();
        var visibleRotation = theMap.getVisibleRotation();
        if (imgInfo.visibleZoom == visibleZoom && imgInfo.visibleCenter.x == visibleCenter.x && imgInfo.visibleCenter.y == visibleCenter.y && imgInfo.visibleWidth == visibleWidth && imgInfo.visibleHeight == visibleHeight && (imgInfo.visibleRotation != 0 || imgInfo.visibleRotation == visibleRotation)) {
            return;
        };
        imgInfo.visibleZoom = visibleZoom;
        imgInfo.visibleCenter = visibleCenter;
        imgInfo.visibleWidth = visibleWidth;
        imgInfo.visibleHeight = visibleHeight;
        imgInfo.visibleRotation = visibleRotation;
        var scaleFactor = map.CoordUtil.getTileWidth(imgInfo.zoom) / map.CoordUtil.getTileWidth(visibleZoom);
        var scaledWidth = Math.round(imgInfo.width * scaleFactor);
        var scaledHeight = Math.round(imgInfo.height * scaleFactor);
        if (scaledWidth > map.MapUtil.MAX_IMAGE_SCALE_WIDTH || scaledHeight > map.MapUtil.MAX_IMAGE_SCALE_WIDTH || scaledWidth < map.MapUtil.MIN_IMAGE_SCALE_WIDTH || scaledHeight < map.MapUtil.MIN_IMAGE_SCALE_WIDTH) {
            if (!dontChangeVisibility) {
                imgInfo.imgElem.style.visibility = "hidden";
            }
        } else {
            if (imgInfo.loaded && !dontChangeVisibility) {
                imgInfo.imgElem.style.visibility = "";
            };
            imgInfo.imgElem.style.width = scaledWidth + "px";
            imgInfo.imgElem.style.height = scaledHeight + "px";
            var imgCenterPix = map.CoordUtil.smartUnit2Pixel(imgInfo.center, visibleZoom);
            var mapCenterPix = map.CoordUtil.smartUnit2Pixel(visibleCenter, visibleZoom);
            var offsetX = 0;
            var offsetY = 0;
            if (self.isRelative()) {
                var relativeOffset = theMap.getRelativeOffset();
                offsetX = Math.round(relativeOffset.x);
                offsetY = Math.round(relativeOffset.y);
            };
            var areaBorderWidth = self.getAreaBorderWidth();
            offsetX -= areaBorderWidth;
            offsetY -= areaBorderWidth;
            offsetX += imgInfo.clipLeft * scaleFactor;
            offsetY += imgInfo.clipTop * scaleFactor;
            var centerOffsetX = imgCenterPix.x - mapCenterPix.x;
            var centerOffsetY = mapCenterPix.y - imgCenterPix.y;
            if (self.getAutoRotate()) {
                var rotatedOffsets = {
                    x: centerOffsetX,
                    y: centerOffsetY
                };
            } else {
                rotatedOffsets = theMap.transformPixelCoords(centerOffsetX, centerOffsetY, true, false, true);
            };
            var left = offsetX + rotatedOffsets.x - imgInfo.requestWidth * scaleFactor / 2 + visibleWidth / 2;
            var top = offsetY + rotatedOffsets.y - imgInfo.requestHeight * scaleFactor / 2 + visibleHeight / 2;
            imgInfo.imgElem.style.left = Math.round(left) + "px";
            imgInfo.imgElem.style.top = Math.round(top) + "px";
            if (self.getUseZoomTransparency()) {
                var opacity = 1 - Math.max(0, (Math.abs(1 - scaleFactor) * self.getZoomTransparencyFactor()));
                map.MapUtil.setElementOpacity(imgInfo.imgElem, Math.max(self.getMinZoomOpacity(), opacity));
            }
        }
    };
    self.doPrintMap = function(ctx, htmlContainer, htmlBackground) {
        var left = self.getComputedAreaLeft();
        var top = self.getComputedAreaTop();
        var width = self.getComputedAreaWidth();
        var height = self.getComputedAreaHeight();
        if (mImgInfo.loaded) {
            var offsetX = 0;
            var offsetY = 0;
            if (self.isRelative()) {
                var relativeOffset = self.getMap().getRelativeOffset();
                offsetX = Math.round(relativeOffset.x);
                offsetY = Math.round(relativeOffset.y);
            };
            var areaBorderWidth = self.getAreaBorderWidth();
            offsetX -= areaBorderWidth;
            offsetY -= areaBorderWidth;
            var url = mImgInfo.imgElem.src;
            url = url.replace(new RegExp("&loggingInfo=[^&]*"), "&loggingInfo=" + encodeURIComponent("mapapi:printMode"));
            ctx.drawImage({
                src: url
            }, 0, 0, mImgInfo.width, mImgInfo.height, left + parseInt(mImgInfo.imgElem.style.left) - offsetX, top + parseInt(mImgInfo.imgElem.style.top) - offsetY, parseInt(mImgInfo.imgElem.style.width), parseInt(mImgInfo.imgElem.style.height));
        } else {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.rect(left, top, width, height);
            ctx.fill();
        };
        if (mVisibleSectionMarker) {
            var zoomDifference = self.getZoomDifference();
            var zoomFactor = Math.pow(map.CoordUtil.ZOOM_LEVEL_FACTOR, zoomDifference);
            var mapWidth = self.getMap().getWidth();
            var mapHeight = self.getMap().getHeight();
            var markerWidth = mapWidth / zoomFactor + 2;
            var markerHeight = mapHeight / zoomFactor + 2;
            var markerLeft = Math.round((width - markerWidth) / 2);
            var markerTop = Math.round((height - markerHeight) / 2);
            ctx.strokeStyle = "rgb(128, 128, 128)";
            ctx.lineWidth = 1;
            ctx.lineCap = "butt";
            ctx.lineJoin = "miter";
            ctx.beginPath();
            ctx.rect(left + markerLeft, top + markerTop, Math.round(markerWidth - 1), Math.round(markerHeight - 1));
            ctx.stroke();
        }
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        if (mPOICall != null) {
            mPOIService.abort(mPOICall);
            mPOICall = null;
        };
        cleanUpImgInfo(mImgInfo);
        cleanUpImgInfo(mLoadingImgInfo);
        superDispose.call(self);
    };
    if (options) {
        self.set(options);
    }
});
qxp.OO.addProperty({
    name: "useZoomTransparency",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "zoomTransparencyFactor",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.8
});
qxp.OO.addProperty({
    name: "minZoomOpacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.2
});
qxp.OO.addProperty({
    name: "borderWidth",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0,
    allowNull: false
});
qxp.OO.addProperty({
    name: "zoomDifference",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0,
    allowNull: false
});




/* ID: com.ptvag.webcomponent.map.layer.StretchedMapLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.StretchedMapLayer", com.ptvag.webcomponent.map.layer.SimpleMapLayer, function(requestBuilder) {
    com.ptvag.webcomponent.map.layer.SimpleMapLayer.call(this, requestBuilder);
    var self = this;
    var superPositionImage = self.positionImage;
    self.positionImage = function(imgInfo, dontChangeVisibility) {
        if (imgInfo.loaded != null) {
            var areaWidth = self.getComputedAreaWidth();
            var areaHeight = self.getComputedAreaHeight();
            imgInfo.width = areaWidth;
            imgInfo.height = areaHeight;
        };
        superPositionImage.call(self, imgInfo, dontChangeVisibility);
    };
});




/* ID: com.ptvag.webcomponent.map.layer.RelativeLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.RelativeLayer", com.ptvag.webcomponent.map.layer.Layer, function() {
    com.ptvag.webcomponent.map.layer.Layer.call(this);
});




/* ID: com.ptvag.webcomponent.map.layer.ScaleLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.ScaleLayer", com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer, function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mScaleImgElem;
    var mScaleLabelElem;
    var mUpdateTimer = null;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        var areaElem = document.createElement("div");
        areaElem.style.position = "absolute";
        areaElem.style.left = "0px";
        areaElem.style.top = "0px";
        areaElem.style.border = self.getAreaBorderWidth() + "px solid #808080";
        areaElem.style.backgroundColor = "white";
        areaElem._ptv_map_printBackground = true;
        self.getParentElement().appendChild(areaElem);
        mScaleImgElem = document.createElement("img");
        mScaleImgElem.style.position = "absolute";
        areaElem.appendChild(mScaleImgElem);
        mScaleLabelElem = document.createElement("div");
        mScaleLabelElem.style.position = "absolute";
        mScaleLabelElem.style.fontFamily = "Verdana,Arial,sans-serif";
        mScaleLabelElem.style.fontSize = "10px";
        mScaleLabelElem.style.whiteSpace = "nowrap";
        mScaleLabelElem.innerHTML = "&#160;";
        areaElem.appendChild(mScaleLabelElem);
        self.setAreaElement(areaElem);
        if (self.isEnabled()) {
            updateScale();
        };
        var map = self.getMap();
        map.addEventListener("changeUseMiles", self._modifyScale);
        map.addEventListener("changeVisibleZoom", self._modifyScale);
        map.addEventListener("changeVisibleCenter", self._modifyScale);
        map.addEventListener("changeCenterIsAdjusting", self._modifyScale);
    };
    self._modifyScale = function() {
        if (mScaleImgElem && !self.getMap().getCenterIsAdjusting() && !mUpdateTimer) {
            mUpdateTimer = window.setTimeout(updateScale, 0);
        }
    };
    self._modifyUseMiles = function(propValue) {
        self.getMap().setUseMiles(propValue);
    };
    var updateScale = function() {
        mUpdateTimer = null;
        var useSimpleScale = self.getUseSimpleScale();
        var spacing = self.getSpacing();
        var areaBorderWidth = self.getAreaBorderWidth();
        var scaleBorderWidth = self.getScaleBorderWidth();
        var scaleHeight = self.getScaleHeight();
        var scaleMaxWidth = self.getScaleMaxWidth();
        var zoom = self.getMap().getVisibleZoom();
        var scaleMaxWidthSu = scaleMaxWidth * map.CoordUtil.getSmartUnitsPerPixel(zoom);
        var suPoint1 = self.getMap().getVisibleCenter();
        var suPoint2 = {
            x: suPoint1.x + scaleMaxWidthSu,
            y: suPoint1.y
        };
        var scaleMaxWidthMeter = map.CoordUtil.distanceOfSmartUnitPoints(suPoint1, suPoint2);
        if (self.getMap().getUseMiles()) {
            var scaleMaxWidthUnit = scaleMaxWidthMeter / 1609.344;
            var unitName = "mi";
            if (scaleMaxWidthUnit < 1) {
                scaleMaxWidthUnit = scaleMaxWidthMeter / 0.9144;
                unitName = "yd";
            }
        } else {
            if (scaleMaxWidthMeter >= 1000) {
                scaleMaxWidthUnit = scaleMaxWidthMeter / 1000;
                unitName = "km";
            } else {
                scaleMaxWidthUnit = scaleMaxWidthMeter;
                unitName = "m";
            }
        };
        var exp = Math.floor(Math.log(scaleMaxWidthUnit) / Math.LN10);
        var factor = Math.pow(10, exp);
        var mantisse = scaleMaxWidthUnit / factor;
        if (mantisse >= 5) {
            var base = 5;
        } else if (mantisse >= 2) {
            base = 2;
        } else {
            base = 1;
        };
        var scaleWidthUnit = Math.round(base * factor);
        var scaleWidth = Math.round(scaleMaxWidth * (scaleWidthUnit / scaleMaxWidthUnit));
        var borderStyle = scaleBorderWidth + "px solid #808080";
        mScaleImgElem.style.borderLeft = borderStyle;
        mScaleImgElem.style.borderRight = borderStyle;
        if (useSimpleScale) {
            var imgUrl = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/scale_simple.gif", true);
            mScaleImgElem.style.borderTop = "";
            mScaleImgElem.style.borderBottom = "";
            mScaleImgElem.style.height = (scaleHeight + 2 * scaleBorderWidth) + "px";
        } else {
            imgUrl = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/scale_base_" + base + ".gif", true);
            mScaleImgElem.style.borderTop = borderStyle;
            mScaleImgElem.style.borderBottom = borderStyle;
            mScaleImgElem.style.height = scaleHeight + "px";
        };
        mScaleImgElem.style.width = scaleWidth + "px";
        mScaleImgElem.style.top = spacing + "px";
        mScaleImgElem.style.left = spacing + "px";
        map.MapUtil.setImageSource(mScaleImgElem, imgUrl);
        mScaleLabelElem.style.top = parseInt((2 * (spacing + scaleBorderWidth) + scaleHeight - 10) / 2) - 2 + "px";
        mScaleLabelElem.style.left = 2 * spacing + scaleWidth + "px";
        var areaElement = self.getAreaElement();
        var oldWidth = areaElement.style.width;
        areaElement.style.width = "100%";
        mScaleLabelElem.firstChild.nodeValue = "\xa0" + scaleWidthUnit + " " + unitName;
        self.setAreaWidth(2 * areaBorderWidth + 3 * spacing + scaleWidth + mScaleLabelElem.offsetWidth);
        if (areaElement.style.width == "100%") {
            areaElement.style.width = oldWidth;
        };
        self.setAreaHeight(2 * areaBorderWidth + 2 * scaleBorderWidth + 2 * spacing + scaleHeight);
        self.positionArea();
    };
    self.doPrintStaticArea = function(ctx, htmlContainer, htmlBackground) {
        var areaBorderWidth = self.getAreaBorderWidth();
        var scaleBorderWidth = self.getScaleBorderWidth();
        var scaleHeight = self.getScaleHeight();
        var left = self.getComputedAreaLeft();
        var top = self.getComputedAreaTop();
        var width = self.getComputedAreaWidth();
        var height = self.getComputedAreaHeight();
        var spacing = self.getSpacing();
        var scaleWidth = parseInt(mScaleImgElem.style.width);
        var imgWidth = 8;
        var imgHeight = 8;
        var topBottomBorders = false;
        if (mScaleImgElem.src.indexOf("/scale_base_") != -1) {
            topBottomBorders = true;
            imgWidth = 50;
            imgHeight = 1;
            if (mScaleImgElem.src.indexOf("/scale_base_2.gif") != -1) {
                imgWidth = 40;
            }
        };
        ctx.strokeStyle = "rgb(128, 128, 128)";
        ctx.lineWidth = areaBorderWidth;
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.fill();
        ctx.beginPath();
        ctx.rect(parseInt(left + areaBorderWidth / 2), parseInt(top + areaBorderWidth / 2), width - areaBorderWidth, height - areaBorderWidth);
        ctx.stroke();
        ctx.lineWidth = scaleBorderWidth;
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        var lineTop = top + areaBorderWidth + spacing;
        var lineBottom = lineTop + scaleBorderWidth * 2 + scaleHeight;
        var lineLeft = left + areaBorderWidth + spacing + scaleBorderWidth / 2;
        ctx.drawImage(mScaleImgElem, 0, 0, imgWidth, imgHeight, lineLeft + scaleBorderWidth / 2, lineTop + scaleBorderWidth, scaleWidth, scaleHeight);
        ctx.moveTo(parseInt(lineLeft), lineTop);
        ctx.lineTo(parseInt(lineLeft), lineBottom);
        var lineLeft2 = lineLeft + scaleBorderWidth + scaleWidth;
        ctx.moveTo(parseInt(lineLeft2), lineTop);
        ctx.lineTo(parseInt(lineLeft2), lineBottom);
        if (topBottomBorders) {
            ctx.moveTo(lineLeft + scaleBorderWidth / 2, parseInt(lineTop + scaleBorderWidth / 2));
            ctx.lineTo(lineLeft2 - scaleBorderWidth / 2, parseInt(lineTop + scaleBorderWidth / 2));
            ctx.moveTo(lineLeft + scaleBorderWidth / 2, parseInt(lineBottom - scaleBorderWidth / 2));
            ctx.lineTo(lineLeft2 - scaleBorderWidth / 2, parseInt(lineBottom - scaleBorderWidth / 2));
        };
        ctx.stroke();
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.fontFamily = "sans-serif";
        ctx.fontStyle = "plain";
        ctx.fontSize = 10;
        ctx.textAlignment = 17;
        ctx.drawText(" " + mScaleLabelElem.firstChild.nodeValue.substring(1), left + areaBorderWidth + 2 * (spacing + scaleBorderWidth) + scaleWidth, top + areaBorderWidth + parseInt((2 * (spacing + scaleBorderWidth) + scaleHeight - 10) / 2) - 1);
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        if (mUpdateTimer != null) {
            window.clearTimeout(mUpdateTimer);
            mUpdateTimer = null;
        };
        var map = self.getMap();
        map.removeEventListener("changeUseMiles", self._modifyScale);
        map.removeEventListener("changeVisibleZoom", self._modifyScale);
        map.removeEventListener("changeVisibleCenter", self._modifyScale);
        map.removeEventListener("changeCenterIsAdjusting", self._modifyScale);
        mScaleImgElem = null;
        mScaleLabelElem = null;
        superDispose.call(self);
    };
});
qxp.OO.changeProperty({
    name: "areaOpacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 0.8
});
qxp.OO.changeProperty({
    name: "areaBorderWidth",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1
});
qxp.OO.addProperty({
    name: "scaleBorderWidth",
    impl: "scale",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 1
});
qxp.OO.addProperty({
    name: "scaleHeight",
    impl: "scale",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 6
});
qxp.OO.addProperty({
    name: "scaleMaxWidth",
    impl: "scale",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 100
});
qxp.OO.addProperty({
    name: "spacing",
    impl: "scale",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 2
});
qxp.OO.addProperty({
    name: "useMiles",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "useSimpleScale",
    impl: "scale",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});




/* ID: com.ptvag.webcomponent.map.vector.HoverArea */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.HoverArea", com.ptvag.webcomponent.map.vector.AbstractHoverArea, function(x, y, maxZoom, tolerance, hoverHandler, unhoverHandler, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.AbstractHoverArea.call(this, x, y, maxZoom, tolerance, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mHovering = false;
    self.onHover = function(evt) {
        mHovering = true;
        var hoverHandler = self.getHoverHandler();
        if (hoverHandler != null) {
            var suCoords = self.getVectorLayer().getMap().translateMouseCoords(evt);
            hoverHandler({
                hoverX: suCoords.x,
                hoverY: suCoords.y,
                areaX: self.getX(),
                areaY: self.getY(),
                id: self.getId()
            });
        }
    };
    self.onUnhover = function(evt) {
        if (mHovering) {
            mHovering = false;
            var unhoverHandler = self.getUnhoverHandler();
            if (unhoverHandler != null) {
                if (evt != null) {
                    var suCoords = self.getVectorLayer().getMap().translateMouseCoords(evt);
                } else {
                    suCoords = {
                        x: null,
                        y: null
                    };
                };
                unhoverHandler({
                    unhoverX: suCoords.x,
                    unhoverY: suCoords.y,
                    areaX: self.getX(),
                    areaY: self.getY(),
                    id: self.getId()
                });
            }
        }
    };
    self.clear = function(inDispose) {
        if (!inDispose) {
            self.onUnhover();
        }
    };
    self.setHoverHandler(hoverHandler);
    self.setUnhoverHandler(unhoverHandler);
});
qxp.OO.addProperty({
    name: "hoverHandler",
    type: qxp.constant.Type.FUNCTION,
    allowNull: true
});
qxp.OO.addProperty({
    name: "unhoverHandler",
    type: qxp.constant.Type.FUNCTION,
    allowNull: true
});




/* ID: com.ptvag.webcomponent.map.Rpc */
qxp.OO.defineClass("com.ptvag.webcomponent.map.Rpc", qxp.io.remote.Rpc, function(map, url, serviceName) {
    qxp.io.remote.Rpc.call(this, url, serviceName);
    var self = this;
    var setURLParameter = function(name, value) {
        var url = self.getUrl();
        var encodedValue = encodeURIComponent(value);
        var paramIndex = url.indexOf("?" + name + "=");
        if (paramIndex == -1) {
            paramIndex = url.indexOf("&" + name + "=");
        };
        if (paramIndex == -1) {
            url += (url.indexOf("?") == -1 ? "?" : "&") + name + "=" + encodedValue;
        } else {
            var startIndex = paramIndex + name.length + 2;
            var endIndex = url.indexOf("&", startIndex);
            if (endIndex == -1) {
                url = url.substring(0, startIndex) + encodedValue;
            } else {
                url = url.substring(0, startIndex) + encodedValue + url.substring(endIndex);
            }
        }
    };
    var superCallInternal = self._callInternal;
    self._callInternal = function() {
        setURLParameter("backendServer", map.getBackendServer());
        setURLParameter(com.ptvag.webcomponent.map.RequestBuilder.getTokenName(), com.ptvag.webcomponent.map.RequestBuilder.getTokenValue());
        return superCallInternal.apply(self, arguments);
    };
    var superRefreshSession = self.refreshSession;
    self.refreshSession = function(handler) {
        if (com.ptvag.webcomponent.map.Map.STATELESS_MODE) {
            handler(true);
        } else {
            superRefreshSession.apply(self, arguments);
        }
    };
});




/* ID: com.ptvag.webcomponent.map.layer.ZoomSliderLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.ZoomSliderLayer", com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer, function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mGrooveElem;
    var mKnobElem;
    var mPlusElem = null;
    var mMinusElem = null;
    var mGrooveWidth = 11;
    var mKnobWidth = 19;
    var mKnobHeight = 11;
    var mKnobPosition;
    var mTopOffset;
    var mGrooveHeight;
    var mButtonSize = 13;
    var mMouseOverPlus = false;
    var mMouseOverMinus = false;
    var mPlusPressed = false;
    var mMinusPressed = false;
    var mPlusImage;
    var mPlusOverImage;
    var mMinusImage;
    var mMinusOverImage;
    var mCurrentPlusImage = null;
    var mCurrentMinusImage = null;
    var mCurrentPlusOpacity = null;
    var mCurrentMinusOpacity = null;
    var mInKnobMoveMode;
    var mKnobMoveOffset = parseInt(mKnobHeight / 2);
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        self.getParentElement().style.cursor = "default";
        var areaElem = document.createElement("div");
        areaElem.style.position = "absolute";
        areaElem.style.left = "0px";
        areaElem.style.top = "0px";
        areaElem.style.width = self.getAreaWidth() + "px";
        areaElem.style.zIndex = self.getParentElement().style.zIndex;
        self.getParentElement().appendChild(areaElem);
        mGrooveElem = document.createElement("div");
        mGrooveElem.style.position = "absolute";
        mGrooveElem.style.left = ((mKnobWidth - mGrooveWidth) / 2) + "px";
        if (map.MapUtil.isBorderBoxSizingActive()) {
            mGrooveElem.style.width = mGrooveWidth + "px";
        } else {
            mGrooveElem.style.width = (mGrooveWidth - 2) + "px";
        };
        mGrooveElem.style.border = "1px solid gray";
        mGrooveElem.style.backgroundColor = "white";
        areaElem.appendChild(mGrooveElem);
        mKnobElem = document.createElement("img");
        mKnobElem.style.position = "absolute";
        mKnobElem.style.left = "0px";
        mKnobElem.style.width = mKnobWidth + "px";
        mKnobElem.style.height = mKnobHeight + "px";
        map.MapUtil.setImageSource(mKnobElem, map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/zoom_slider_knob.png", true));
        areaElem.appendChild(mKnobElem);
        mPlusImage = new Image();
        mPlusImage.src = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/zoom_slider_plus.gif", true);
        mPlusOverImage = new Image();
        mPlusOverImage.src = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/zoom_slider_plus_over.gif", true);
        mMinusImage = new Image();
        mMinusImage.src = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/zoom_slider_minus.gif", true);
        mMinusOverImage = new Image();
        mMinusOverImage.src = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/zoom_slider_minus_over.gif", true);
        var buttonOffset = parseInt((mKnobWidth - mButtonSize) / 2);
        mPlusElem = document.createElement("img");
        mPlusElem.style.position = "absolute";
        mPlusElem.style.left = buttonOffset + "px";
        mPlusElem.style.width = mButtonSize + "px";
        mPlusElem.style.height = mButtonSize + "px";
        mMinusElem = document.createElement("img");
        mMinusElem.style.position = "absolute";
        mMinusElem.style.left = buttonOffset + "px";
        mMinusElem.style.width = mButtonSize + "px";
        mMinusElem.style.height = mButtonSize + "px";
        self.getMap().addEventListener("changeInverseWheelZoom", redraw);
        self.setAreaElement(areaElem);
    };
    var superModifyAreaOpacity = self._modifyAreaOpacity;
    self._modifyAreaOpacity = function() {
        setButtonOpacity();
    };
    var setButtonOpacity = function() {
        var areaOpacity = self.getAreaOpacity();
        superModifyAreaOpacity.call(self, areaOpacity);
        var blendingOpacityOut = self.getBlendingOpacityOut();
        var zoom = self.getMap().getVisibleZoom();
        var maxZoom = map.CoordUtil.TILE_WIDTHS.length - 1;
        var img = mPlusImage;
        if (zoom == 0) {
            var opacity = blendingOpacityOut;
        } else {
            opacity = areaOpacity;
            if (mMouseOverPlus) {
                img = mPlusOverImage;
            }
        };
        if (mCurrentPlusImage != img) {
            map.MapUtil.setImageSource(mPlusElem, img.src);
            mCurrentPlusImage = img;
        };
        if (mCurrentPlusOpacity != opacity) {
            map.MapUtil.setElementOpacity(mPlusElem, opacity);
            mCurrentPlusOpacity = opacity;
        };
        img = mMinusImage;
        if (zoom == maxZoom) {
            opacity = blendingOpacityOut;
        } else {
            opacity = areaOpacity;
            if (mMouseOverMinus) {
                img = mMinusOverImage;
            }
        };
        if (mCurrentMinusImage != img) {
            map.MapUtil.setImageSource(mMinusElem, img.src);
            mCurrentMinusImage = img;
        };
        if (mCurrentMinusOpacity != opacity) {
            map.MapUtil.setElementOpacity(mMinusElem, opacity);
            mCurrentMinusOpacity = opacity;
        }
    };
    var redraw = function() {
        var areaHeight = self.getComputedAreaHeight();
        var parentElement = self.getParentElement();
        if (self.getShowZoomButtons()) {
            var inverseZoom = self.getMap().getInverseWheelZoom();
            var topElem = (inverseZoom ? mMinusElem : mPlusElem);
            var bottomElem = (inverseZoom ? mPlusElem : mMinusElem);
            topElem.style.top = "0px";
            bottomElem.style.top = (areaHeight - mButtonSize) + "px";
            var areaElement = self.getAreaElement();
            if (!mPlusElem.parentNode) {
                parentElement.appendChild(topElem);
                parentElement.appendChild(bottomElem);
            };
            mTopOffset = mButtonSize + mKnobMoveOffset;
        } else {
            if (mPlusElem.parentNode) {
                parentElement.removeChild(mPlusElem);
                parentElement.removeChild(mMinusElem);
            };
            mTopOffset = 0;
        };
        var height = areaHeight - mKnobHeight - mTopOffset * 2;
        mGrooveHeight = height;
        positionKnob();
        if (!map.MapUtil.isBorderBoxSizingActive()) {
            height -= 2;
        };
        mGrooveElem.style.top = mKnobMoveOffset + mTopOffset + "px";
        mGrooveElem.style.height = (height + 1) + "px";
        while (mGrooveElem.firstChild) {
            mGrooveElem.removeChild(mGrooveElem.firstChild);
        };
        if (self.getShowZoomSteps()) {
            var maxZoom = map.CoordUtil.TILE_WIDTHS.length - 1;
            for (var i = 1; i < maxZoom;
                ++i) {
                var step = document.createElement("div");
                step.style.position = "absolute";
                step.style.width = "100%";
                step.style.height = "1px";
                step.style.borderTop = "1px solid gray";
                step.style.left = "0px";
                step.style.top = Math.round(mGrooveHeight * i / maxZoom - 1) + "px";
                mGrooveElem.appendChild(step);
            }
        }
    };
    var superModifyComputedAreaHeight = self._modifyComputedAreaHeight;
    self._modifyComputedAreaHeight = function() {
        redraw();
        superModifyComputedAreaHeight.apply(self, arguments);
    };
    self._modifyShowZoomSteps = function() {
        redraw();
    };
    self._modifyShowZoomButtons = function() {
        mMouseOverPlus = false;
        mMouseOverMinus = false;
        mPlusPressed = false;
        mMinusPressed = false;
        redraw();
    };
    var superOnViewChanged = self.onViewChanged;
    self.onViewChanged = function(evt) {
        superOnViewChanged(evt);
        if (evt.zoomChanged || evt.heightChanged) {
            positionKnob();
        }
    };
    var positionKnob = function() {
        var zoom = self.getMap().getVisibleZoom();
        var maxZoom = map.CoordUtil.TILE_WIDTHS.length - 1;
        var pseudoZoom = zoom;
        if (self.getMap().getInverseWheelZoom()) {
            pseudoZoom = maxZoom - zoom;
        };
        mKnobPosition = Math.round(mGrooveHeight * pseudoZoom / maxZoom);
        mKnobElem.style.top = mKnobPosition + mTopOffset + "px";
        setButtonOpacity();
    };
    var setKnobToMouse = function(evt) {
        var newPos = evt.relMouseY - self.getComputedAreaTop() - mKnobMoveOffset;
        newPos -= mTopOffset;
        mKnobPosition = Math.max(0, Math.min(mGrooveHeight, newPos));
        mKnobElem.style.top = mKnobPosition + mTopOffset + "px";
        setButtonOpacity();
    };
    var superOnMouseMove = self.onMouseMove;
    self.onMouseMove = function(evt) {
        if (mInKnobMoveMode) {
            setKnobToMouse(evt);
            return false;
        } else if (self.getShowZoomButtons()) {
            var left = self.getComputedAreaLeft();
            var top = self.getComputedAreaTop();
            var width = self.getComputedAreaWidth();
            var height = self.getComputedAreaHeight();
            var buttonOffset = (mKnobWidth - mButtonSize) / 2;
            var inverseWheelZoom = self.getMap().getInverseWheelZoom();
            mMouseOverPlus = false;
            mMouseOverMinus = false;
            if (evt.relMouseX >= left + buttonOffset && evt.relMouseX < left + buttonOffset + mButtonSize) {
                if (evt.relMouseY >= top && evt.relMouseY < top + mButtonSize) {
                    if (inverseWheelZoom) {
                        if (!mPlusPressed) {
                            mMouseOverMinus = true;
                        }
                    } else {
                        if (!mMinusPressed) {
                            mMouseOverPlus = true;
                        }
                    }
                } else if (evt.relMouseY >= top + height - mButtonSize && evt.relMouseY < top + height) {
                    if (inverseWheelZoom) {
                        if (!mMinusPressed) {
                            mMouseOverPlus = true;
                        }
                    } else {
                        if (!mPlusPressed) {
                            mMouseOverMinus = true;
                        }
                    }
                }
            };
            setButtonOpacity();
        };
        return superOnMouseMove(evt);
    };
    var superOnMouseOut = self.onMouseOut;
    self.onMouseOut = function(evt) {
        superOnMouseOut(evt);
        if (mInKnobMoveMode) {
            mInKnobMoveMode = false;
            positionKnob();
        };
        mMouseOverPlus = false;
        mMouseOverMinus = false;
        mPlusPressed = false;
        mMinusPressed = false;
        setButtonOpacity();
        return false;
    };
    self.onMouseDown = function(evt) {
        self.onMouseMove(evt);
        var left = self.getComputedAreaLeft();
        var top = self.getComputedAreaTop();
        var width = self.getComputedAreaWidth();
        var height = self.getComputedAreaHeight();
        if (evt.relMouseX >= left && evt.relMouseX < left + width && evt.relMouseY >= top + mTopOffset && evt.relMouseY <= top + mTopOffset + mGrooveHeight + mKnobHeight) {
            setKnobToMouse(evt);
            mInKnobMoveMode = true;
            return true;
        } else if (mMouseOverPlus) {
            mPlusPressed = true;
            return true;
        } else if (mMouseOverMinus) {
            mMinusPressed = true;
            return true;
        };
        return false;
    };
    self.onMouseUp = function(evt) {
        self.onMouseMove(evt);
        var plusPressed = mPlusPressed;
        mPlusPressed = false;
        var minusPressed = mMinusPressed;
        mMinusPressed = false;
        var theMap = self.getMap();
        if (mInKnobMoveMode) {
            mInKnobMoveMode = false;
            var maxZoom = map.CoordUtil.TILE_WIDTHS.length - 1;
            var newZoom = Math.round(maxZoom * mKnobPosition / mGrooveHeight);
            if (theMap.getInverseWheelZoom()) {
                newZoom = maxZoom - newZoom;
            };
            if (newZoom == theMap.getZoom()) {
                positionKnob();
            } else {
                theMap.startLoggingAction("user:zoomSlider");
                try {
                    theMap.setZoom(newZoom);
                } finally {
                    theMap.endLoggingAction();
                }
            };
            return true;
        };
        if (mMouseOverPlus && plusPressed) {
            theMap.setZoom(theMap.getZoom() - 1);
            return true;
        };
        if (mMouseOverMinus && minusPressed) {
            theMap.setZoom(theMap.getZoom() + 1);
            return true;
        };
        return false;
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        self.getMap().removeEventListener("changeInverseWheelZoom", redraw);
        mGrooveElem = null;
        mKnobElem = null;
        mPlusElem = null;
        mMinusElem = null;
        mPlusImage = null;
        mPlusOverImage = null;
        mMinusImage = null;
        mMinusOverImage = null;
        mCurrentPlusImage = null;
        mCurrentMinusImage = null;
        superDispose.call(self);
    };
    var init = function() {
        self.setAreaWidth(mKnobWidth);
    };
    init();
});
qxp.OO.changeProperty({
    name: "useBlending",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "showZoomButtons",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "showZoomSteps",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: true
});




/* ID: com.ptvag.webcomponent.map.vector.InfoBox */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.InfoBox", com.ptvag.webcomponent.map.vector.VectorElement, function(x, y, text, alignment, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mInfoBoxElement = null;
    var mInfoBoxElementCreator = null;
    var closeWidgetHandler = function() {
        var customHandler = self.getCloseWidgetHandler();
        if (customHandler == null) {
            self.getVectorLayer().removeElement(self.getId());
        } else {
            customHandler(self);
        }
    };
    var positionBox = function() {
        if (mInfoBoxElement != null) {
            mInfoBoxElementCreator.positionInfoBoxElement(mInfoBoxElement, self.getRealX(), self.getRealY());
        }
    };
    self.usesCanvas = function() {
        return false;
    };
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        var suPoint = {
            x: self.getX(),
            y: self.getY()
        };
        var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
        var realX = pixCoords.x - mapLeft + self.getFlexX();
        var realY = mapTop - pixCoords.y + self.getFlexY();
        var coords = self.getVectorLayer().getMap().transformPixelCoords(realX, realY, false, false, true);
        realX = coords.x + self.getOffsetX();
        realY = coords.y + self.getOffsetY();
        self.setRealX(realX);
        self.setRealY(realY);
        if (mInfoBoxElement == null) {
            mInfoBoxElementCreator = self.getInfoBoxElementFactory();
            if (mInfoBoxElementCreator == null) {
                mInfoBoxElementCreator = com.ptvag.webcomponent.map.vector.InfoBoxElementFactory;
            };
            mInfoBoxElement = mInfoBoxElementCreator.createInfoBoxElement(realX, realY, {
                text: self.getText(),
                background: self.getBackground()
            }, topLevelContainer, true, null, self.getAllowWrap());
            if (self.getShowCloseWidget()) {
                mInfoBoxElementCreator.activateCloseWidget(mInfoBoxElement, closeWidgetHandler);
            };
            mInfoBoxElement.style.zIndex = 2000000000 + self.getPriority();
        } else {
            positionBox();
        }
    };
    self.clear = function() {
        if (mInfoBoxElement != null) {
            mInfoBoxElementCreator.destroyInfoBoxElement(mInfoBoxElement);
            mInfoBoxElement = null;
            mInfoBoxElementCreator = null;
        }
    };
    if (x != null) {
        self.setX(x);
    };
    if (y != null) {
        self.setY(y);
    };
    if (text != null) {
        self.setText(text);
    };
    if (alignment != null) {
        self.setAlignment(alignment);
    };
    self.refreshOn("x", "y", "offsetX", "offsetY", "text", "alignment", "showCloseWidget", "infoBoxElementFactory", "background");
});
qxp.OO.addProperty({
    name: "x",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 4355664
});
qxp.OO.addProperty({
    name: "y",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 5464867
});
qxp.OO.addProperty({
    name: "offsetX",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "offsetY",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "realX",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "realY",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "text",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: ""
});
qxp.OO.addProperty({
    name: "alignment",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 66
});
qxp.OO.addProperty({
    name: "showCloseWidget",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "closeWidgetHandler",
    type: qxp.constant.Type.FUNCTION,
    allowNull: true,
    defaultValue: null
});
qxp.OO.addProperty({
    name: "infoBoxElementFactory",
    type: qxp.constant.Type.OBJECT,
    allowNull: true,
    defaultValue: null
});
qxp.OO.addProperty({
    name: "background",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "#ffffff"
});
qxp.OO.addProperty({
    name: "allowWrap",
    type: qxp.constant.Type.BOOLEAN
});




/* ID: com.ptvag.webcomponent.util.Flash */
qxp.OO.defineClass("com.ptvag.webcomponent.util.Flash");
qxp.Class.getControlVersion = function() {
    var version;
    var axo;
    var e;
    try {
        axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        version = axo.GetVariable("$version");
    } catch (e) {};
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
            version = "WIN 6,0,21,0";
            axo.AllowScriptAccess = "always";
            version = axo.GetVariable("$version");
        } catch (e) {}
    };
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = axo.GetVariable("$version");
        } catch (e) {}
    };
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
            version = "WIN 3,0,18,0";
        } catch (e) {}
    };
    if (!version) {
        try {
            axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            version = "WIN 2,0,0,11";
        } catch (e) {
            version = -1;
        }
    };
    return version;
};
qxp.Class.getSwfVer = function() {
    var flashVer = -1;
    if (navigator.plugins != null && navigator.plugins.length > 0) {
        if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
            var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
            var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
            var descArray = flashDescription.split(" ");
            var tempArrayMajor = descArray[2].split(".");
            var versionMajor = tempArrayMajor[0];
            var versionMinor = tempArrayMajor[1];
            var versionRevision = descArray[3];
            if (versionRevision == "") {
                versionRevision = descArray[4];
            };
            if (versionRevision[0] == "d") {
                versionRevision = versionRevision.substring(1);
            } else if (versionRevision[0] == "r") {
                versionRevision = versionRevision.substring(1);
                if (versionRevision.indexOf("d") > 0) {
                    versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
                }
            };
            var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
        }
    } else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
    else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
    else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
    else if (qxp.sys.Client.getInstance().isMshtml()) {
        flashVer = com.ptvag.webcomponent.util.Flash.getControlVersion();
    };
    return flashVer;
};
qxp.Class.detectFlashVer = function(reqMajorVer, reqMinorVer, reqRevision) {
    versionStr = com.ptvag.webcomponent.util.Flash.getSwfVer();
    if (versionStr == -1) {
        return false;
    } else if (versionStr != 0) {
        if (qxp.sys.Client.getInstance().isMshtml()) {
            tempArray = versionStr.split(" ");
            tempString = tempArray[1];
            versionArray = tempString.split(",");
        } else {
            versionArray = versionStr.split(".");
        };
        var versionMajor = versionArray[0];
        var versionMinor = versionArray[1];
        var versionRevision = versionArray[2];
        if (versionMajor > parseFloat(reqMajorVer)) {
            return true;
        } else if (versionMajor == parseFloat(reqMajorVer)) {
            if (versionMinor > parseFloat(reqMinorVer)) return true;
            else if (versionMinor == parseFloat(reqMinorVer)) {
                if (versionRevision >= parseFloat(reqRevision)) return true;
            }
        };
        return false;
    }
};
qxp.Class.addExtension = function(src, ext) {
    if (src.indexOf('?') != -1) return src.replace(/\?/, ext + '?');
    else return src + ext;
};
qxp.Class.generateObj = function(objAttrs, params, embedAttrs) {
    var str = '';
    if (qxp.sys.Client.getInstance().isMshtml()) {
        str += '<object ';
        for (var i in objAttrs) str += i + '="' + objAttrs[i] + '" ';
        str += '>';
        for (var i in params) str += '<param name="' + i + '" value="' + params[i] + '" /> ';
        str += '</object>';
    } else {
        str += '<embed ';
        for (var i in embedAttrs) str += i + '="' + embedAttrs[i] + '" ';
        str += '> </embed>';
    };
    return str;
};
qxp.Class.getFlashContent = function() {
    var Flash = com.ptvag.webcomponent.util.Flash;
    var ret = Flash.getArgs(arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000", "application/x-shockwave-flash");
    return Flash.generateObj(ret.objAttrs, ret.params, ret.embedAttrs);
};
qxp.Class.getArgs = function(args, ext, srcParamName, classid, mimeType) {
    var Flash = com.ptvag.webcomponent.util.Flash;
    var ret = new Object();
    ret.embedAttrs = new Object();
    ret.params = new Object();
    ret.objAttrs = new Object();
    for (var i = 0; i < args.length; i = i + 2) {
        var currArg = args[i].toLowerCase();
        switch (currArg) {
            case "classid":
                break;
            case "pluginspage":
                ret.embedAttrs[args[i]] = args[i + 1];
                break;
            case "src":
            case "movie":
                args[i + 1] = Flash.addExtension(args[i + 1], ext);
                ret.embedAttrs["src"] = args[i + 1];
                ret.params[srcParamName] = args[i + 1];
                break;
            case "onafterupdate":
            case "onbeforeupdate":
            case "onblur":
            case "oncellchange":
            case "onclick":
            case "ondblClick":
            case "ondrag":
            case "ondragend":
            case "ondragenter":
            case "ondragleave":
            case "ondragover":
            case "ondrop":
            case "onfinish":
            case "onfocus":
            case "onhelp":
            case "onmousedown":
            case "onmouseup":
            case "onmouseover":
            case "onmousemove":
            case "onmouseout":
            case "onkeypress":
            case "onkeydown":
            case "onkeyup":
            case "onload":
            case "onlosecapture":
            case "onpropertychange":
            case "onreadystatechange":
            case "onrowsdelete":
            case "onrowenter":
            case "onrowexit":
            case "onrowsinserted":
            case "onstart":
            case "onscroll":
            case "onbeforeeditfocus":
            case "onactivate":
            case "onbeforedeactivate":
            case "ondeactivate":
            case "type":
            case "codebase":
                ret.objAttrs[args[i]] = args[i + 1];
                break;
            case "id":
            case "width":
            case "height":
            case "align":
            case "vspace":
            case "hspace":
            case "class":
            case "title":
            case "accesskey":
            case "name":
            case "tabindex":
                ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i + 1];
                break;
            default:
                ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i + 1];
        }
    };
    ret.objAttrs["classid"] = classid;
    if (mimeType) ret.embedAttrs["type"] = mimeType;
    return ret;
};




/* ID: com.ptvag.webcomponent.map.vector.Text */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.Text", com.ptvag.webcomponent.map.vector.VectorElement, function(x, y, color, pixelSize, alignment, text, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mTextElement = null;
    var mTextWidth = null;
    var mTextHeight = null;
    self._checkColor = function(propValue) {
        var translatedColor = map.MapUtil.translateColor(propValue);
        var opacity = translatedColor.opacity;
        if (opacity != null) {
            self.setOpacity(opacity);
        };
        return translatedColor.color;
    };
    var positionText = function() {
        if (mTextElement != null && mTextWidth != null && mTextHeight != null) {
            var realX = self.getRealX();
            var realY = self.getRealY();
            if (realX != null && realY != null) {
                var alignment = self.getAlignment();
                if (alignment & map.layer.VectorLayer.ALIGN_MID_HORIZ) {
                    mTextElement.style.left = Math.round(realX - (mTextWidth / 2)) + "px";
                } else if (alignment & map.layer.VectorLayer.ALIGN_RIGHT) {
                    mTextElement.style.left = Math.round(realX - mTextWidth) + "px";
                } else {
                    mTextElement.style.left = Math.round(realX) + "px";
                };
                if (alignment & map.layer.VectorLayer.ALIGN_MID_VERT) {
                    mTextElement.style.top = Math.round(realY - (mTextHeight * 0.8 / 2) + self.getVerticalAdjustment()) + "px";
                } else if (alignment & map.layer.VectorLayer.ALIGN_BOTTOM) {
                    mTextElement.style.top = Math.round(realY - mTextHeight) + "px";
                } else {
                    mTextElement.style.top = Math.round(realY) + "px";
                }
            }
        }
    };
    self.usesCanvas = function(ctx) {
        return (ctx instanceof map.PrintContext ? true : false);
    };
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        var suPoint = {
            x: self.getX(),
            y: self.getY()
        };
        var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
        var realX = pixCoords.x - mapLeft + self.getFlexX();
        var realY = mapTop - pixCoords.y + self.getFlexY();
        var coords = self.getVectorLayer().getMap().transformPixelCoords(realX, realY, false, false, true);
        realX = coords.x + self.getOffsetX();
        realY = coords.y + self.getOffsetY();
        self.setRealX(realX);
        self.setRealY(realY);
        if (ctx instanceof map.PrintContext) {
            if (mTextElement != null) {
                ctx.fontFamily = self.getFontFamily();
                if (self.getFontWeight() == "bold") {
                    ctx.fontStyle = "bold";
                } else {
                    ctx.fontStyle = "plain";
                };
                ctx.fontSize = self.getPixelSize();
                ctx.textAlignment = self.getAlignment() & ~112 | 16;
                ctx.strokeStyle = self.getColor();
                var oldGlobalAlpha = ctx.globalAlpha;
                ctx.globalAlpha *= self.getOpacity();
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawText(self.getText(), realX, parseInt(mTextElement.style.top));
                ctx.restore();
                ctx.globalAlpha = oldGlobalAlpha;
            }
        } else {
            if (mTextElement == null) {
                mTextElement = document.createElement("div");
                mTextElement.setAttribute("_ptv_map_dontPrint", true);
                mTextElement.style.position = "absolute";
                mTextElement.style.fontFamily = self.getFontFamily();
                mTextElement.style.fontSize = self.getPixelSize() + "px";
                mTextElement.style.fontWeight = self.getFontWeight();
                mTextElement.style.color = self.getColor();
                map.MapUtil.setElementOpacity(mTextElement, self.getOpacity());
                mTextElement.style.visibility = "hidden";
                mTextElement.style.zIndex = -2000000000 + self.getPriority();
                var text = document.createTextNode(self.getText());
                mTextElement.appendChild(text);
                container.appendChild(mTextElement);
                mTextWidth = mTextElement.offsetWidth;
                mTextHeight = mTextElement.offsetHeight;
                positionText();
                mTextElement.style.visibility = "visible";
            } else {
                positionText();
            }
        }
    };
    self.clear = function(inDispose) {
        if (mTextElement != null) {
            if (!inDispose) {
                mTextElement.parentNode.removeChild(mTextElement);
            };
            mTextElement = null;
        }
    };
    if (x != null) {
        self.setX(x);
    };
    if (y != null) {
        self.setY(y);
    };
    if (color != null && color != self.getColor()) {
        self.setColor(color);
    } else {
        self.setColor(self._checkColor(self.getColor()));
    };
    if (pixelSize != null) {
        self.setPixelSize(pixelSize);
    };
    if (alignment != null) {
        self.setAlignment(alignment);
    };
    if (text != null) {
        self.setText(text);
    };
    self.refreshOn("x", "y", "offsetX", "offsetY", "color", "opacity", "pixelSize", "alignment", "text", "fontFamily", "fontWeight", "verticalAdjustment");
});
qxp.OO.addProperty({
    name: "x",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 4355664
});
qxp.OO.addProperty({
    name: "y",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 5464867
});
qxp.OO.addProperty({
    name: "offsetX",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "offsetY",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "realX",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "realY",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "color",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "#000000"
});
qxp.OO.addProperty({
    name: "opacity",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 1
});
qxp.OO.addProperty({
    name: "pixelSize",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 12
});
qxp.OO.addProperty({
    name: "alignment",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 66
});
qxp.OO.addProperty({
    name: "text",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: ""
});
qxp.OO.addProperty({
    name: "fontFamily",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "Verdana,Arial,sans-serif"
});
qxp.OO.addProperty({
    name: "fontWeight",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "bold"
});
qxp.OO.addProperty({
    name: "verticalAdjustment",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: -1
});




/* ID: com.ptvag.webcomponent.map.layer.PositionInfoLayer */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.PositionInfoLayer", com.ptvag.webcomponent.map.layer.TextInfoLayer, function() {
    com.ptvag.webcomponent.map.layer.TextInfoLayer.call(this);
    var self = this;
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        self.getAreaElement().innerHTML = "&#160;";
        if (self.isEnabled()) {
            self.updateView();
        }
    };
    self.updateView = function() {
        var theMap = self.getMap();
        var pixPoint = theMap.relative2AbsolutePixel(self.getLastMousePos());
        var suPoint = CoordUtil.pixel2SmartUnit(pixPoint, theMap.getZoom());
        var geoPoint = CoordUtil.smartUnit2GeoDecimal(suPoint);
        self.getAreaElement().firstChild.nodeValue = beautifyGeo(Math.abs(geoPoint.y)) + (geoPoint.y > 0 ? " N" : " S") + ", " + beautifyGeo(Math.abs(geoPoint.x)) + (geoPoint.x > 0 ? " E" : " W");
    };
    var beautifyGeo = function(geoPos) {
        var degrees = parseInt(geoPos / 100000);
        var minutes = parseInt((geoPos / (100000 / 60)) % 60);
        var seconds = (geoPos / ((100000 / 60) / 60)) % 60;
        var roundedSecs = Math.round(seconds * 100) / 100;
        if (roundedSecs >= 60) {
            roundedSecs = 0;
            ++minutes;
            if (minutes >= 60) {
                minutes = 0;
                ++degrees;
            }
        };
        var formattedSecs = (seconds < 10 ? "0" : "") + roundedSecs;
        formattedSecs = formattedSecs.substring(0, 5);
        if (formattedSecs.length < 3) {
            formattedSecs += ".";
        }
        while (formattedSecs.length < 5) {
            formattedSecs += "0";
        };
        return degrees + "\u00b0 " + (minutes < 10 ? "0" : "") + minutes + "' " + formattedSecs + "\"";
    };
});




/* ID: com.ptvag.webcomponent.map.vector.ImageMarker2 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.ImageMarker2", com.ptvag.webcomponent.map.vector.VectorElement, function(x, y, url, alignment, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mImg = null;
    var mImgWidth = null;
    var mImgHeight = null;
    var mSizeRequested = false;
    var mCleared = false;
    var mInDraw = false;
    var mCtx;
    var drawImage = function() {
        if (mImg != null && mImgWidth != null && mImgHeight != null) {
            var width = mImgWidth;
            var height = mImgHeight;
            var factor = self.getZoomFactor();
            width *= factor;
            height *= factor;
            var realX = self.getRealX();
            var realY = self.getRealY();
            if (realX != null && realY != null) {
                var offsetX = 0;
                var offsetY = 0;
                var alignment = self.getAlignment();
                if (alignment & map.layer.VectorLayer.ALIGN_MID_HORIZ) {
                    offsetX = -(width) / 2;
                } else if (alignment & map.layer.VectorLayer.ALIGN_RIGHT) {
                    offsetX = -(width);
                };
                if (alignment & map.layer.VectorLayer.ALIGN_MID_VERT) {
                    offsetY = -(height) / 2;
                } else if (alignment & map.layer.VectorLayer.ALIGN_BOTTOM) {
                    offsetY = -(height);
                };
                var alignedX = Math.round(realX + offsetX);
                var alignedY = Math.round(realY + offsetY);
                mCtx.globalAlpha = self.getOpacity();
                mCtx.drawImage(mImg, alignedX, alignedY, width, height);
                mCtx.globalAlpha = 1;
            }
        }
    };
    var onImageSizeAvailable = function(url, width, height) {
        if (!mCleared) {
            mImgWidth = width;
            mImgHeight = height;
            if (mInDraw) {
                drawImage();
            } else {
                self.refresh();
            }
        }
    };
    self.usesCanvas = function() {
        return true;
    };
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        superDraw.apply(self, arguments);
        mCtx = ctx;
        mCleared = false;
        var suPoint = {
            x: self.getX(),
            y: self.getY()
        };
        var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
        self.setRealX(pixCoords.x - mapLeft + self.getFlexX());
        self.setRealY(mapTop - pixCoords.y + self.getFlexY());
        if (!mSizeRequested) {
            mSizeRequested = true;
            var actualURL = self.getUrl();
            if (actualURL == null) {
                actualURL = "img/com/ptvag/webcomponent/map/1downarrow.png";
            };
            actualURL = map.MapUtil.resolveURL(actualURL);
            var imagePool = map.vector.ImageMarker2.IMAGE_POOL;
            mImg = imagePool[actualURL];
            if (mImg == null) {
                mImg = new Image();
                mImg.src = actualURL;
                imagePool[actualURL] = mImg;
            };
            mInDraw = true;
            map.ImageLoader.getImageSize(actualURL, onImageSizeAvailable);
            mInDraw = false;
        } else {
            drawImage();
        }
    };
    self.clear = function() {
        mCleared = true;
        mCtx = null;
    };
    if (x != null) {
        self.setX(x);
    };
    if (y != null) {
        self.setY(y);
    };
    if (url != null) {
        self.setUrl(url);
    };
    if (alignment != null) {
        self.setAlignment(alignment);
    };
    self.refreshOn("x", "y", "url", "alignment", "opacity");
});
qxp.OO.addProperty({
    name: "x",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 4355664
});
qxp.OO.addProperty({
    name: "y",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 5464867
});
qxp.OO.addProperty({
    name: "realX",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "realY",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "url",
    type: qxp.constant.Type.STRING,
    allowNull: true
});
qxp.OO.addProperty({
    name: "alignment",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 66
});
qxp.OO.addProperty({
    name: "opacity",
    type: qxp.constant.Type.NUMBER,
    defaultValue: 1,
    allowNull: false
});
qxp.Class.IMAGE_POOL = {};




/* ID: com.ptvag.webcomponent.map.vector.AggregateElement */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.AggregateElement", com.ptvag.webcomponent.map.vector.VectorElement, function(id) {
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mManagedElementIds = [];
    var mVectorLayer = null;
    if (id != null && id instanceof map.layer.VectorLayer) {
        mVectorLayer = id;
        if (arguments.length >= 2) {
            id = arguments[1];
        } else {
            id = null;
        }
    };
    map.vector.VectorElement.call(this, null, id);
    var superModifyVectorLayer = self._modifyVectorLayer;
    self._modifyVectorLayer = function(propValue) {
        mVectorLayer = propValue;
        superModifyVectorLayer.apply(self, arguments);
    };
    self.remove = function() {
        for (var i = 0; i < mManagedElementIds.length; i++) {
            mVectorLayer.removeElement(mManagedElementIds[i]);
        };
        mManagedElementIds = [];
    };
    self.hide = function() {
        self.remove();
    };
    self.addElement = function(element, deferSorting) {
        var id = mVectorLayer.addElement(element, deferSorting);
        mManagedElementIds.push(id);
    };
    self.removeElement = function(id) {
        var managedElementCount = mManagedElementIds.length;
        for (var i = 0; i < managedElementCount;
            ++i) {
            if (mManagedElementIds[i] == id) {
                mManagedElementIds.splice(i, 1);
                mVectorLayer.removeElement(id);
                break;
            }
        }
    };
    self.usesCanvas = function() {
        return null;
    };
    self.clear = function(inDispose) {
        if (!inDispose) {
            self.remove();
        }
    };
});




/* ID: com.ptvag.webcomponent.map.vector.Poly */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.Poly", com.ptvag.webcomponent.map.vector.VectorElement, function(color, coordinates, priority, id) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var CoordUtil = map.CoordUtil;
    var mCoordinatesIterator;
    var mRealCoordinates = null;
    var mZoomForRealCoordinates = null;
    var mMapLeft;
    var mMapTop;
    var mMinX;
    var mMaxX;
    var mMinY;
    var mMaxY;
    self._modifyCoordinates = function(propValue) {
        if (mCoordinatesIterator != null) {
            mCoordinatesIterator.dispose();
        };
        mCoordinatesIterator = new map.PointListIterator(propValue);
        mZoomForRealCoordinates = null;
        self.refresh();
    };
    self.usesCanvas = function() {
        return true;
    };
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        superDraw.apply(self, arguments);
        mMapLeft = mapLeft;
        mMapTop = mapTop;
        var width = parseInt(container.style.width);
        var height = parseInt(container.style.height);
        var testLeft = 0;
        var testTop = 0;
        var testRight = width;
        var testBottom = height;
        var rotation = self.getVectorLayer().getMap().getVisibleRotation();
        if (rotation != 0) {
            var max = Math.max(width, height);
            var min = Math.min(width, height);
            var sizeNeeded = (max * max + min * min) / max;
            var paddingX = Math.ceil((sizeNeeded - width) / 2);
            var paddingY = Math.ceil((sizeNeeded - height) / 2);
            testLeft -= paddingX;
            testRight += paddingX;
            testTop -= paddingY;
            testBottom += paddingY;
        };
        if (mZoomForRealCoordinates != mapZoom) {
            mRealCoordinates = [];
            mMinX = null;
            mMaxX = null;
            mMinY = null;
            mMaxY = null;
            mCoordinatesIterator.reset();
            while (mCoordinatesIterator.iterate()) {
                var suPoint = {
                    x: mCoordinatesIterator.x,
                    y: mCoordinatesIterator.y
                };
                var pixCoords = CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
                var realX = pixCoords.x;
                var realY = pixCoords.y;
                if (mMinX == null || realX < mMinX) {
                    mMinX = realX;
                };
                if (mMaxX == null || realX > mMaxX) {
                    mMaxX = realX;
                };
                if (mMinY == null || realY < mMinY) {
                    mMinY = realY;
                };
                if (mMaxY == null || realY > mMaxY) {
                    mMaxY = realY;
                };
                mRealCoordinates.push(realX);
                mRealCoordinates.push(realY);
            };
            mZoomForRealCoordinates = mapZoom;
        };
        if (mMinX == null || (mMaxX - mapLeft) < testLeft || (mMinX - mapLeft) > testRight || (mapTop - mMinY) < testTop || (mapTop - mMaxY) > testBottom) {
            return;
        };
        ctx.fillStyle = self.getColor();
        var bounds = {
            minX: testLeft + mapLeft,
            minY: mapTop - testBottom,
            maxX: testRight + mapLeft,
            maxY: mapTop - testTop
        };
        var clippedPolys = CoordUtil.clipPoly(mRealCoordinates, bounds);
        for (var i = 0; i < clippedPolys.length;
            ++i) {
            ctx.beginPath();
            var poly = clippedPolys[i];
            var vertexCount = poly.length / 2;
            for (var j = 0; j < vertexCount;
                ++j) {
                if (j == 0) {
                    ctx.moveTo(poly[j * 2] - mapLeft, mapTop - poly[j * 2 + 1]);
                } else {
                    ctx.lineTo(poly[j * 2] - mapLeft, mapTop - poly[j * 2 + 1]);
                }
            };
            ctx.fill();
        }
    };
    self.getSquareDistance = function(evt, tolerance) {
        var retVal = {
            squareDistance: -1
        };
        if (mZoomForRealCoordinates == null) {
            return retVal;
        };
        var lineSegmentCount = mRealCoordinates.length / 2 - 1;
        if (lineSegmentCount < 1) {
            return retVal;
        };
        var coords = self.getVectorLayer().getMap().transformPixelCoords(evt.relMouseX, evt.relMouseY, false, true, true);
        var mouseX = coords.x + mMapLeft;
        var mouseY = mMapTop - coords.y;
        if (!CoordUtil.isPointInPoly(mouseX, mouseY, mRealCoordinates)) {
            return retVal;
        };
        retVal.squareDistance = 0;
        var nearestPoint = com.ptvag.webcomponent.map.CoordUtil.pixel2SmartUnit({
            x: mouseX,
            y: mouseY
        }, mZoomForRealCoordinates);
        retVal.extendedEventInfo = {
            nearestX: nearestPoint.x,
            nearestY: nearestPoint.y
        };
        return retVal;
    };
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        };
        mCoordinatesIterator.dispose();
        superDispose.call(self);
    };
    if (color != null) {
        self.setColor(color);
    };
    if (coordinates != null) {
        self.setCoordinates(coordinates);
    } else {
        self._modifyCoordinates(self.getCoordinates());
    };
    self.refreshOn("color");
});
qxp.OO.addProperty({
    name: "color",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: "rgba(127,255,0,0.7)"
});
qxp.OO.addProperty({
    name: "coordinates",
    type: qxp.constant.Type.OBJECT,
    allowNull: false,
    defaultValue: []
});




/* ID: com.ptvag.webcomponent.map.MapMobileController */
qxp.OO.defineClass("com.ptvag.webcomponent.map.MapMobileController", com.ptvag.webcomponent.map.MapController, function(targetMap, mainElement) {
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var CoordUtil = map.CoordUtil;
    var DomUtils = com.ptvag.webcomponent.util.DomUtils;
    map.MapController.call(self, targetMap, mainElement, false);
    var mMaxZoom = CoordUtil.TILE_WIDTHS.length - 1;
    var mMap = targetMap;
    var mMainElement = mainElement;
    var mTapCount = 0;
    var mTapTime = 0;
    var mLongPressTimeout = null;
    var mTapData;
    var mFakeActiveLayer = false;
    var mGestureStartData = null;
    var mGestureStartCenter;
    var mGestureStartZoom;
    var mMinimumMovement;
    var mMinimumZoomChange;
    var mTouchData;
    var mBaseOffsetX;
    var mBaseOffsetY;
    var mActivePointers;
    var swallowEvent = function(evt) {
        if (self.getSwallowEvents()) {
            evt.preventDefault();
        }
    };
    var updateTouches = function(evt, allowAdd) {
        if (!window.navigator.msPointerEnabled) {
            return false;
        };
        var pointerId = evt.pointerId;
        var pointerCount = mActivePointers.length;
        for (var i = 0; i < pointerCount;
            ++i) {
            var touch = mActivePointers[i];
            if (touch.pointerId == pointerId) {
                touch.pageX = evt.pageX;
                touch.pageY = evt.pageY;
                return false;
            }
        };
        if (i == pointerCount && allowAdd) {
            mActivePointers.push({
                pointerId: pointerId,
                pageX: evt.pageX,
                pageY: evt.pageY
            });
            return true;
        };
        return false;
    };
    var clearTouches = function() {
        if (window.navigator.msPointerEnabled) {
            mActivePointers = [];
        }
    };
    var getTouches = function(evt) {
        if (window.navigator.msPointerEnabled) {
            return mActivePointers;
        };
        return evt.touches;
    };
    var extractTouchData = function(evt) {
        var allTouches = getTouches(evt);
        if (allTouches == null) {
            return null;
        };
        var touchCount = allTouches.length;
        if (touchCount == 0) {
            return null;
        };
        var elementX = DomUtils.getAbsoluteX(mMainElement);
        var elementY = DomUtils.getAbsoluteY(mMainElement);
        var centerX = 0;
        var centerY = 0;
        var distance = 0;
        for (var i = 0; i < touchCount;
            ++i) {
            var touch = allTouches[i];
            var x = touch.pageX - elementX;
            var y = touch.pageY - elementY;
            centerX += x;
            centerY += y;
        };
        if (touchCount > 1) {
            centerX /= touchCount;
            centerY /= touchCount;
            for (var i = 0; i < touchCount;
                ++i) {
                var x = touch.pageX - elementX;
                var y = touch.pageY - elementY;
                var distX = x - centerX;
                var distY = y - centerY;
                distance += Math.sqrt(distX * distX + distY * distY);
            };
            distance /= touchCount;
        };
        return {
            centerX: Math.round(centerX),
            centerY: Math.round(centerY),
            distance: distance,
            touchCount: touchCount
        };
    };
    var minimumMovement = function(touchData1, touchData2) {
        var distX = touchData1.centerX - touchData2.centerX;
        var distY = touchData1.centerY - touchData2.centerY;
        var squareDist = distX * distX + distY * distY;
        if (squareDist >= 400) {
            return true;
        };
        return false;
    };
    var minimumZoomChange = function(touchData1, touchData2) {
        var diff = touchData1.distance - touchData2.distance;
        if (Math.abs(diff) * touchData1.touchCount >= 20) {
            return true;
        };
        return false;
    };
    var startGesture = function(evt) {
        if (mLongPressTimeout != null) {
            window.clearTimeout(mLongPressTimeout);
            mLongPressTimeout = null;
        };
        mGestureStartData = extractTouchData(evt);
        if (mGestureStartData == null) {
            return;
        };
        mMap.getAnimator().stopAnimationAndKeepMapView();
        mGestureStartCenter = mMap.getVisibleCenter();
        mGestureStartZoom = mMap.getVisibleZoom();
        mMinimumMovement = (mMap.getZoom() != mGestureStartZoom);
        mGestureStartZoom = CoordUtil.getSmartUnitsPerPixel(mGestureStartZoom);
        mMinimumZoomChange = false;
        mBaseOffsetX = 0;
        mBaseOffsetY = 0;
        var now = (new Date()).getTime();
        if (now - mTapTime > 400) {
            mTapCount = 0;
        };
        mTapTime = now;
        if (!map.MapMobileController.ENABLE_LONG_PRESS) {
            return;
        };
        mLongPressTimeout = window.setTimeout(function() {
            mLongPressTimeout = null;
            if (self.getDisposed()) {
                return;
            };
            if (mGestureStartData == null) {
                return;
            };
            if (mMinimumMovement || mGestureStartData.touchCount != 1) {
                return;
            };
            mGestureStartData.touchCount = 0;
            var now = (new Date()).getTime();
            var tapX = mGestureStartData.centerX;
            var tapY = mGestureStartData.centerY;
            var clientX = tapX + DomUtils.getAbsoluteX(mMainElement) - DomUtils.getScrollX(window);
            var clientY = tapY + DomUtils.getAbsoluteY(mMainElement) - DomUtils.getScrollY(window);
            var evt = {
                clientX: clientX,
                clientY: clientY,
                which: 1,
                buttons: 1,
                pressDuration: (now - mTapTime)
            };
            self.onComponentMouseDown(evt);
            self.onComponentMouseUp(evt);
        }, 500);
    };
    var endGesture = function() {
        if (mMinimumMovement) {
            mTapCount = 0;
            updateMap(true);
        } else {
            var now = (new Date()).getTime();
            if (now - mTapTime > 400) {
                mTapCount = 0;
            } else {
                if (mTapCount > 0) {
                    if (mTapData.touchCount != mGestureStartData.touchCount || minimumZoomChange(mTapData, mGestureStartData) || minimumMovement(mTapData, mGestureStartData)) {
                        mTapCount = 0;
                        mTapData = mGestureStartData;
                    }
                } else {
                    mTapData = mGestureStartData;
                }++mTapCount;
                var tapX = mTapData.centerX;
                var tapY = mTapData.centerY;
                var tapCount = mTapCount;
                var tapTouchCount = mTapData.touchCount;
                window.setTimeout(function() {
                    handleTap(tapX, tapY, tapCount, tapTouchCount);
                }, 0);
            }
        };
        if (mLongPressTimeout != null) {
            window.clearTimeout(mLongPressTimeout);
            mLongPressTimeout = null;
        };
        mGestureStartData = null;
    };
    var handleTap = function(tapX, tapY, tapCount, tapTouchCount) {
        if (self.getDisposed()) {
            return;
        };
        if (tapTouchCount == 1) {
            var clientX = tapX + DomUtils.getAbsoluteX(mMainElement) - DomUtils.getScrollX(window);
            var clientY = tapY + DomUtils.getAbsoluteY(mMainElement) - DomUtils.getScrollY(window);
            var evt = {
                clientX: clientX,
                clientY: clientY,
                which: 1,
                buttons: 1
            };
            for (var i = 0; i < tapCount;
                ++i) {
                self.onComponentMouseDown(evt);
                self.onComponentMouseUp(evt);
            };
            if (tapCount == 2) {
                zoom();
            }
        } else if (tapTouchCount == 2) {
            zoom(true);
        };

        function zoom(out) {
            if (self.getUpdateMap()) {
                mMap.zoomToPixelCoords(tapX, tapY, false, (out ? 2 : -2), 0, true);
            }
        }
    };
    var updateMap = function(finalize) {
        if (!self.getUpdateMap()) {
            return;
        };
        if (!mMinimumZoomChange && !finalize) {};
        var alreadyInBulkMode = mMap.inBulkMode();
        if (!alreadyInBulkMode) {
            mMap.startBulkMode();
        };
        var zoomFactor = 1;
        if (mMinimumZoomChange) {
            var startDistance = mGestureStartData.distance;
            if (startDistance < 1) {
                startDistance = 1;
            };
            var touchDistance = mTouchData.distance;
            if (touchDistance < 1) {
                touchDistance = 1;
            };
            zoomFactor = startDistance / touchDistance;
        };
        var newZoom = zoomFactor * mGestureStartZoom;
        var zoomLevel = CoordUtil.getLevelForSmartUnitsPerPixel(newZoom);
        var newZoomLevel = zoomLevel;
        if (finalize) {
            if (!minimumZoomChange(mTouchData, mGestureStartData)) {
                newZoomLevel = Math.round(newZoomLevel);
            } else if (zoomFactor > 1) {
                newZoomLevel = Math.ceil(newZoomLevel);
            } else {
                newZoomLevel = Math.floor(newZoomLevel);
            }
        };
        if (newZoomLevel < 0) {
            newZoomLevel = 0;
        } else if (newZoomLevel > mMaxZoom) {
            newZoomLevel = mMaxZoom;
        };
        if (newZoomLevel != zoomLevel) {
            newZoom = CoordUtil.getSmartUnitsPerPixel(newZoomLevel);
        };
        if (finalize) {
            mMap.setZoom(newZoomLevel);
        } else if (mMinimumZoomChange) {
            mMap.setVisibleZoom(newZoomLevel);
        };
        var touchX = mTouchData.centerX;
        var touchY = mTouchData.centerY;
        var movementX = mTouchData.centerX - mGestureStartData.centerX;
        var movementY = mTouchData.centerY - mGestureStartData.centerY;
        var movement = mMap.transformPixelCoords(movementX, movementY, true, true, true);
        var centerCorrectionX = touchX - mMap.getWidth() / 2;
        var centerCorrectionY = touchY - mMap.getHeight() / 2;
        var centerCorrection = mMap.transformPixelCoords(centerCorrectionX, centerCorrectionY, true, true, true);
        var newCenterX = mGestureStartCenter.x + centerCorrection.x * mGestureStartZoom - centerCorrection.x * newZoom - movement.x * mGestureStartZoom;
        var newCenterY = mGestureStartCenter.y - centerCorrection.y * mGestureStartZoom + centerCorrection.y * newZoom + movement.y * mGestureStartZoom;
        if (finalize) {
            if (mMap.getVisibleZoom() == newZoomLevel) {
                var oldAnimate = mMap.getAnimate();
                mMap.setAnimate(false);
                mMap.setCenter({
                    x: newCenterX + 0.001,
                    y: newCenterY
                });
                mMap.setAnimate(oldAnimate);
            } else {
                mMap.setCenter({
                    x: newCenterX + 0.001,
                    y: newCenterY
                });
            }
        } else {
            mMap.setVisibleCenter({
                x: newCenterX,
                y: newCenterY
            });
        };
        if (!alreadyInBulkMode) {
            mMap.endBulkMode();
        };
        mFakeActiveLayer = false;
    };
    var onTouchStart = function(evt) {
        updateTouches(evt, true);
        var touches = getTouches(evt);
        if (touches != null && touches.length == 1) {
            var element = touches[0].target;
            while (element && element.nodeType == 1) {
                var zIndex = element.style.zIndex;
                if (zIndex != null && zIndex > 2) {
                    mGestureStartData = null;
                    return;
                };
                element = element.parentNode;
            }
        };
        swallowEvent(evt);
        startGesture(evt);
    };
    var onTouchMove = function(evt) {
        updateTouches(evt, false);
        if (mGestureStartData == null) {
            return;
        };
        swallowEvent(evt);
        var touchData = extractTouchData(evt);
        if (touchData == null) {
            return;
        };
        if (touchData.touchCount != mGestureStartData.touchCount) {
            return;
        };
        if (!mMinimumZoomChange) {
            mMinimumZoomChange = minimumZoomChange(touchData, mGestureStartData);
            if (mMinimumZoomChange) {
                mMinimumMovement = true;
            }
        };
        if (!mMinimumMovement) {
            mMinimumMovement = minimumMovement(touchData, mGestureStartData);
        };
        if (mMinimumMovement) {
            mTouchData = touchData;
            updateMap(false);
        }
    };
    var onTouchEnd = function(evt) {
        clearTouches();
        if (mGestureStartData == null) {
            return;
        };
        swallowEvent(evt);
        endGesture();
    };
    var onTouchCancel = function(evt) {
        clearTouches();
        if (mGestureStartData == null) {
            return;
        };
        swallowEvent(evt);
        endGesture();
    };
    var onSelectStart = swallowEvent;
    var onGestureStart = swallowEvent;
    var onGestureChange = swallowEvent;
    var onGestureEnd = swallowEvent;
    var superGetActiveLayer = self.getActiveLayer;
    self.getActiveLayer = function() {
        if (mFakeActiveLayer) {
            return self;
        };
        return superGetActiveLayer.apply(self, arguments);
    };
    self.initEvents = function() {
        mMainElement.style.webkitUserSelect = "none";
        if (window.navigator.msPointerEnabled) {
            mMainElement.style.msTouchAction = "none";
            mActivePointers = [];
            mMainElement.addEventListener("MSPointerDown", onTouchStart, true);
            mMainElement.addEventListener("MSPointerMove", onTouchMove, true);
            mMainElement.addEventListener("MSPointerUp", onTouchEnd, true);
            mMainElement.addEventListener("MSPointerCancel", onTouchCancel, true);
        } else {
            mMainElement.addEventListener("touchstart", onTouchStart, true);
            mMainElement.addEventListener("touchmove", onTouchMove, true);
            mMainElement.addEventListener("touchend", onTouchEnd, true);
            mMainElement.addEventListener("touchcancel", onTouchCancel, true);
            mMainElement.addEventListener("gesturestart", onGestureStart, true);
            mMainElement.addEventListener("gesturechange", onGestureChange, true);
            mMainElement.addEventListener("gestureend", onGestureEnd, true);
        }
    };
    self.initEvents();
});
qxp.OO.addProperty({
    name: "updateMap",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: true
});
qxp.OO.addProperty({
    name: "swallowEvents",
    type: qxp.constant.Type.BOOLEAN,
    defaultValue: true
});
qxp.Class.ENABLE_LONG_PRESS = false;




/* ID: com.ptvag.webcomponent.map.vector.HTML */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.HTML", com.ptvag.webcomponent.map.vector.VectorElement, function(x, y, alignment, html, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var mElement = null;
    var mWidth = null;
    var mHeight = null;
    var mNoRefresh = false;
    var mNoClearOnRefresh = false;
    self.updateProperties = function(x, y, alignment, html) {
        mNoRefresh = true;
        if (x != null) {
            self.setX(x);
        };
        if (y != null) {
            self.setY(y);
        };
        if (alignment != null) {
            self.setAlignment(alignment);
        };
        if (html != null) {
            self.setHtml(html);
        };
        mNoRefresh = false;
        if (mElement != null) {
            mElement.innerHTML = self.getHtml();
            mWidth = mElement.offsetWidth;
            mHeight = mElement.offsetHeight;
            mNoClearOnRefresh = true;
            self.refresh();
            mNoClearOnRefresh = false;
        }
    };
    var positionElement = function() {
        if (mElement != null && mWidth != null && mHeight != null) {
            var realX = self.getRealX();
            var realY = self.getRealY();
            if (realX != null && realY != null) {
                var alignment = self.getAlignment();
                if (alignment & map.layer.VectorLayer.ALIGN_MID_HORIZ) {
                    mElement.style.left = Math.round(realX - (mWidth / 2)) + "px";
                } else if (alignment & map.layer.VectorLayer.ALIGN_RIGHT) {
                    mElement.style.left = Math.round(realX - mWidth) + "px";
                } else {
                    mElement.style.left = Math.round(realX) + "px";
                };
                if (alignment & map.layer.VectorLayer.ALIGN_MID_VERT) {
                    mElement.style.top = Math.round(realY - (mHeight / 2)) + "px";
                } else if (alignment & map.layer.VectorLayer.ALIGN_BOTTOM) {
                    mElement.style.top = Math.round(realY - mHeight) + "px";
                } else {
                    mElement.style.top = Math.round(realY) + "px";
                }
            }
        }
    };
    self.usesCanvas = function() {
        return false;
    };
    self.draw = function(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom) {
        var suPoint = {
            x: self.getX(),
            y: self.getY()
        };
        var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
        var realX = pixCoords.x - mapLeft + self.getFlexX();
        var realY = mapTop - pixCoords.y + self.getFlexY();
        var coords = self.getVectorLayer().getMap().transformPixelCoords(realX, realY, false, false, true);
        self.setRealX(coords.x + self.getOffsetX());
        self.setRealY(coords.y + self.getOffsetY());
        if (mElement == null) {
            mElement = document.createElement("div");
            mElement.style.position = "absolute";
            mElement.style.visibility = "hidden";
            mElement.innerHTML = self.getHtml();
            if (self.getTopLevel()) {
                mElement._ignoreMouseDown = true;
                mElement._ignoreMouseUp = true;
                mElement._allowSelection = true;
                mElement._ignoreMouseWheel = self.getAllowMouseWheel();
                mElement.style.zIndex = 2000000000 + self.getPriority();
                topLevelContainer.appendChild(mElement);
            } else {
                mElement.style.zIndex = -2000000000 + self.getPriority();
                container.appendChild(mElement);
            };
            mWidth = mElement.offsetWidth;
            mHeight = mElement.offsetHeight;
            positionElement();
            mElement.style.visibility = "visible";
        } else {
            positionElement();
        }
    };
    self.clear = function(inDispose) {
        if (mElement != null) {
            if (!inDispose) {
                mElement.parentNode.removeChild(mElement);
            };
            mElement = null;
        }
    };
    self.refresh = function() {
        if (mNoRefresh) {
            return;
        };
        var vectorLayer = self.getVectorLayer();
        if (vectorLayer) {
            if (!mNoClearOnRefresh) {
                self.clear();
            };
            vectorLayer.onViewChanged();
        }
    };
    self.updateProperties(x, y, alignment, html);
    self.refreshOn("x", "y", "offsetX", "offsetY", "alignment", "html", "topLevel", "allowMouseWheel");
});
qxp.OO.addProperty({
    name: "x",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 4355664
});
qxp.OO.addProperty({
    name: "y",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 5464867
});
qxp.OO.addProperty({
    name: "offsetX",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "offsetY",
    allowNull: false,
    defaultValue: 0
});
qxp.OO.addProperty({
    name: "realX",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "realY",
    type: qxp.constant.Type.NUMBER,
    allowNull: false
});
qxp.OO.addProperty({
    name: "alignment",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 66
});
qxp.OO.addProperty({
    name: "html",
    type: qxp.constant.Type.STRING,
    allowNull: false,
    defaultValue: ""
});
qxp.OO.addProperty({
    name: "topLevel",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});
qxp.OO.addProperty({
    name: "allowMouseWheel",
    type: qxp.constant.Type.BOOLEAN,
    allowNull: false,
    defaultValue: false
});




/* ID: com.ptvag.webcomponent.map.vector.POI */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.POI", com.ptvag.webcomponent.map.vector.AggregateElement, function(x, y, url, alignment, tooltipContent, infoBoxContent, priority, id, isPositionFlexible) {
    var self = this;
    var map = com.ptvag.webcomponent.map;
    if (x != null && x instanceof map.layer.VectorLayer) {
        if (arguments.length >= 2) {
            x = arguments[1];
        } else {
            x = null;
        };
        if (arguments.length >= 3) {
            y = arguments[2];
        } else {
            y = null;
        };
        if (arguments.length >= 4) {
            url = arguments[3];
        } else {
            url = null;
        };
        if (arguments.length >= 5) {
            alignment = arguments[4];
        } else {
            alignment = null;
        };
        if (arguments.length >= 6) {
            tooltipContent = arguments[5];
        } else {
            tooltipContent = null;
        };
        if (arguments.length >= 7) {
            infoBoxContent = arguments[6];
        } else {
            infoBoxContent = null;
        };
        if (arguments.length >= 8) {
            priority = arguments[7];
        } else {
            priority = null;
        };
        if (arguments.length >= 9) {
            id = arguments[8];
        } else {
            id = null;
        };
        if (arguments.length >= 10) {
            isPositionFlexible = arguments[9];
        } else {
            isPositionFlexible = null;
        }
    };
    map.vector.AggregateElement.call(this, id);
    var createElements = function(vectorLayer) {
        var visibleMinZoom = self.getVisibleMinZoom();
        var visibleMaxZoom = self.getVisibleMaxZoom();
        var id = self.getId();
        var imageMarker = self.createVisibleElement();
        var markerId = imageMarker.getId();
        if (markerId == null) {
            markerId = id + "_POI_internal_ImageMarker";
            imageMarker.setId(markerId);
        };
        imageMarker.setVisibleMinZoom(visibleMinZoom);
        imageMarker.setVisibleMaxZoom(visibleMaxZoom);
        imageMarker.setMinFactor(self.getMinFactor());
        imageMarker.setMaxFactor(self.getMaxFactor());
        imageMarker.setMinZoom(self.getMinZoom());
        imageMarker.setMaxZoom(self.getMaxZoom());
        self.addElement(imageMarker);
        if (self.getTooltipContent() != null) {
            var tooltip = self.createTooltip();
            tooltip.setVisibleMinZoom(visibleMinZoom);
            tooltip.setVisibleMaxZoom(visibleMaxZoom);
            tooltip.setDependsOn(markerId);
            self.addElement(tooltip);
        };
        if (self.isPositionFlexible()) {
            var flexMarker = self.createFlexMarker(markerId);
            if (flexMarker != null) {
                flexMarker.setVisibleMinZoom(visibleMinZoom);
                flexMarker.setVisibleMaxZoom(visibleMaxZoom);
                self.addElement(flexMarker);
            }
        };
        if (self.getInfoBoxContent() != null) {
            var clickHandler = function() {
                var infoBox = self.createInfoBox();
                var infoBoxId = infoBox.getId();
                if (infoBoxId == null) {
                    infoBoxId = id + "_POI_internal";
                    infoBox.setId(infoBoxId);
                };
                infoBox.setVisibleMinZoom(visibleMinZoom);
                infoBox.setVisibleMaxZoom(visibleMaxZoom);
                infoBox.setDependsOn(markerId);
                self.addElement(infoBox);
                vectorLayer.removeOnClick(infoBoxId);
            };
            var clickArea = self.createClickArea(clickHandler);
            clickArea.setVisibleMinZoom(visibleMinZoom);
            clickArea.setVisibleMaxZoom(visibleMaxZoom);
            clickArea.setDependsOn(markerId);
            self.addElement(clickArea);
        }
    };
    var superModifyVectorLayer = self._modifyVectorLayer;
    self._modifyVectorLayer = function(propValue) {
        superModifyVectorLayer.apply(self, arguments);
        if (propValue != null) {
            createElements(propValue);
        }
    };
    self.refresh = function() {
        var vectorLayer = self.getVectorLayer();
        if (vectorLayer) {
            self.clear();
            createElements(vectorLayer);
        }
    };
    self.createVisibleElement = function() {
        return new map.vector.ImageMarker2(self.getX(), self.getY(), self.getUrl(), self.getAlignment(), self.getPriority(), null, self.isPositionFlexible());
    };
    self.createTooltip = function() {
        return new map.vector.Tooltip(self.getX(), self.getY(), null, self.getTolerance(), self.getTooltipContent(), self.getAlignment(), self.getPriority(), null, self.isPositionFlexible());
    };
    self.createClickArea = function(clickHandler) {
        return new map.vector.ClickArea(self.getX(), self.getY(), null, self.getTolerance(), clickHandler, self.getPriority(), null, self.isPositionFlexible());
    };
    self.createInfoBox = function() {
        return new map.vector.InfoBox(self.getX(), self.getY(), self.getInfoBoxContent(), self.getAlignment(), self.getPriority(), null, self.isPositionFlexible());
    };
    self.createFlexMarker = function(visibleElementId) {
        return new map.vector.FlexMarkerArrow(visibleElementId, self.getPriority() - 1);
    };
    if (x != null) {
        self.setX(x);
    };
    if (y != null) {
        self.setY(y);
    };
    if (url != null) {
        self.setUrl(url);
    };
    if (alignment != null) {
        self.setAlignment(alignment);
    };
    if (tooltipContent != null) {
        self.setTooltipContent(tooltipContent);
    };
    if (infoBoxContent != null) {
        self.setInfoBoxContent(infoBoxContent);
    };
    if (priority != null) {
        self.setPriority(priority);
    };
    if (isPositionFlexible != null) {
        self.setPositionFlexible(isPositionFlexible);
    };
    self.refreshOn("x", "y", "url", "alignment", "tooltipContent", "infoBoxContent", "tolerance");
});
qxp.OO.addProperty({
    name: "x",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 4355664
});
qxp.OO.addProperty({
    name: "y",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 5464867
});
qxp.OO.addProperty({
    name: "url",
    type: qxp.constant.Type.STRING,
    allowNull: true
});
qxp.OO.addProperty({
    name: "alignment",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 66
});
qxp.OO.addProperty({
    name: "tooltipContent",
    type: qxp.constant.Type.STRING,
    allowNull: true
});
qxp.OO.addProperty({
    name: "infoBoxContent",
    type: qxp.constant.Type.STRING,
    allowNull: true
});
qxp.OO.addProperty({
    name: "tolerance",
    type: qxp.constant.Type.NUMBER,
    allowNull: false,
    defaultValue: 7
});

com.ptvag.webcomponent.map.Map.SETTINGS_OK = true;
com.ptvag.webcomponent.map.Map.MAP_VERSION = "1";
com.ptvag.webcomponent.map.Map.STATIC_SERVER = null;
com.ptvag.webcomponent.map.Map.ADDRESS_LOOKUP_ENABLED = false;
com.ptvag.webcomponent.map.Map.MAP_API_VERSION = "3.5.5.0";
com.ptvag.webcomponent.map.Map.STATELESS_MODE = true;
com.ptvag.webcomponent.map.RequestBuilder.SERVER1 = "http://ajaxbg1-eu-n-test.cloud.ptvgroup.com/ajaxmaps";
com.ptvag.webcomponent.map.RequestBuilder.SERVER2 = "http://ajaxbg2-eu-n-test.cloud.ptvgroup.com/ajaxmaps";
com.ptvag.webcomponent.map.RequestBuilder.SERVER3 = "http://ajaxbg3-eu-n-test.cloud.ptvgroup.com/ajaxmaps";
qxp.core.ServerSettings.serverPathPrefix = "https://ajaxfg-eu-n-test.cloud.ptvgroup.com/ajaxmaps";
com.ptvag.webcomponent.map.RequestBuilder.X_TOKEN = 204109275126088;