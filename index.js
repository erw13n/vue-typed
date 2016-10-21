/**
  * vue-typed 1.0.3
  * The vue-class-component in typescript favor
  * https://github.com/budiadiono/vue-typed
  
  * Copyright 2016, [object Object]
  * Released under the MIT license.
  '*/
define(['exports', 'vue'], function (exports, Vue) { 'use strict';

function Action(action) {
    return function (target, key, descriptor) {
        if (!target['vuex']) {
            target['vuex'] = {};
        }
        if (!target['vuex']['actions']) {
            target['vuex']['actions'] = {};
        }
        if (!target['vuex']['actions'][key]) {
            target['vuex']['actions'][key] = action;
        }
    };
}

function Data() {
    return function (target, key) {
        if (target['data'] && target['data'] instanceof Function) {
            throw "vue-typed error: [" + target.constructor.name + "]: You can't use @data attribute while you have already data() function in your class.";
        }
        if (!target['data']) {
            target['data'] = {};
        }
        if (!target['data'][key]) {
            target['data'][key] = key;
        }
    };
}

function Getter(getter) {
    return function (target, key) {
        if (!target['vuex']) {
            target['vuex'] = {};
        }
        if (!target['vuex']['getters']) {
            target['vuex']['getters'] = {};
        }
        if (!target['vuex']['getters'][key]) {
            target['vuex']['getters'][key] = getter;
        }
    };
}

function Component(options) {
    var internalHooks = [
        'activate',
        'init',
        'ready',
        'beforeCompile',
        'compiled',
        'attached',
        'detached',
        'created',
        'beforeDestroy',
        'destroyed',
        'props',
        'watch',
        'data',
        'beforeCreate',
        'beforeMount',
        'mounted',
        'beforeUpdate',
        'updated',
        'activated',
        'deactivated',
        'render',
        'el',
        'vuex',
    ];
    var factory = function (Component, options) {
        if (!options) {
            options = {};
        }
        options.name = options.name || Component.name;
        var proto = Component.prototype;
        var constructor = new proto.constructor();
        var vueKeys = [];
        if (proto.vuex) {
            var protoVue = proto.vuex;
            if (protoVue['getters']) {
                Object.getOwnPropertyNames(protoVue['getters']).forEach((k) => {
                    vueKeys.push(k);
                });
            }
            if (protoVue['actions']) {
                Object.getOwnPropertyNames(protoVue['actions']).forEach((k) => {
                    vueKeys.push(k);
                });
            }
        }
        Object.getOwnPropertyNames(proto).forEach(function (key) {
            if (key === 'constructor') {
                return;
            }
            if (internalHooks.indexOf(key) > -1) {
                if (!(proto[key] instanceof Function) && key == 'data') {
                    var data_keys = Object.getOwnPropertyNames(proto[key]);
                    delete proto[key];
                    options[key] = () => {
                        var data_obj = {};
                        for (var i = 0; i < data_keys.length; i++) {
                            var prop = data_keys[i];
                            data_obj[prop] = constructor[prop];
                        }
                        return data_obj;
                    };
                }
                else {
                    if (key == 'props' && constructor) {
                        Object.getOwnPropertyNames(proto[key]).forEach(function (prop) {
                            var val = constructor[prop];
                            if (val) {
                                if (typeof proto[key][prop] != 'object') {
                                    proto[key][prop] = {
                                        default: val
                                    };
                                }
                                else {
                                    if (!proto[key][prop]['default']) {
                                        proto[key][prop]['default'] = val;
                                    }
                                    else {
                                        console.error('[Vue-typed warn]: You have defined default value for Props both in options and constructor. (found in component: <' + Component.name + '>, props: <' + prop + '>)');
                                    }
                                }
                            }
                        });
                    }
                    options[key] = proto[key];
                }
                return;
            }
            var descriptor = Object.getOwnPropertyDescriptor(proto, key);
            if (typeof descriptor.value === 'function') {
                if (vueKeys.indexOf(key) > -1)
                    return;
                (options.methods || (options.methods = {}))[key] = descriptor.value;
            }
            else if (descriptor.get || descriptor.set) {
                (options.computed || (options.computed = {}))[key] = {
                    get: descriptor.get,
                    set: descriptor.set
                };
            }
        });
        var superProto = Object.getPrototypeOf(proto);
        var Super = superProto instanceof Vue
            ? superProto.constructor
            : Vue;
        return Super.extend(options);
    };
    if (options instanceof Function) {
        return factory(options);
    }
    return function (Component) {
        return factory(Component, options);
    };
}

function Prop(options) {
    return function (target, key) {
        if (target['props'] && target['props'] instanceof Function) {
            throw "vue-typed error: [" + target.constructor.name + "]: You can't use @props attribute while you have already props() function in your class.";
        }
        if (!target['props']) {
            target['props'] = {};
        }
        if (!target['props'][key]) {
            if (options) {
                target['props'][key] = options;
            }
            else {
                target['props'][key] = true;
            }
        }
    };
}

function Watch(property, deep) {
    return function (target, key) {
        if (!target['watch']) {
            target['watch'] = {};
        }
        if (!target['watch'][property]) {
            var watcher;
            if (deep !== undefined) {
                watcher = {
                    handler: target[key],
                    deep: deep
                };
            }
            else {
                watcher = target[key];
            }
            target['watch'][property] = watcher;
        }
    };
}

exports.Action = Action;
exports.Data = Data;
exports.Getter = Getter;
exports.Component = Component;
exports.Prop = Prop;
exports.Watch = Watch;

Object.defineProperty(exports, '__esModule', { value: true });

});
