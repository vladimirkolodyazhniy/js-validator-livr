(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){"use strict";var LIVR={rules:{}};LIVR.rules.common=require("./LIVR/Rules/Common");LIVR.rules.string=require("./LIVR/Rules/String");LIVR.rules.numeric=require("./LIVR/Rules/Numeric");LIVR.rules.special=require("./LIVR/Rules/Special");LIVR.rules.helper=require("./LIVR/Rules/Helper");LIVR.rules.filters=require("./LIVR/Rules/Filters");LIVR.Validator=require("./LIVR/Validator");LIVR.Validator.registerDefaultRules({required:LIVR.rules.common.required,not_empty:LIVR.rules.common.not_empty,not_empty_list:LIVR.rules.common.not_empty_list,one_of:LIVR.rules.string.one_of,max_length:LIVR.rules.string.max_length,min_length:LIVR.rules.string.min_length,length_equal:LIVR.rules.string.length_equal,length_between:LIVR.rules.string.length_between,like:LIVR.rules.string.like,integer:LIVR.rules.numeric.integer,positive_integer:LIVR.rules.numeric.positive_integer,decimal:LIVR.rules.numeric.decimal,positive_decimal:LIVR.rules.numeric.positive_decimal,max_number:LIVR.rules.numeric.max_number,min_number:LIVR.rules.numeric.min_number,number_between:LIVR.rules.numeric.number_between,email:LIVR.rules.special.email,equal_to_field:LIVR.rules.special.equal_to_field,url:LIVR.rules.special.url,iso_date:LIVR.rules.special.iso_date,nested_object:LIVR.rules.helper.nested_object,list_of:LIVR.rules.helper.list_of,list_of_objects:LIVR.rules.helper.list_of_objects,list_of_different_objects:LIVR.rules.helper.list_of_different_objects,trim:LIVR.rules.filters.trim,to_lc:LIVR.rules.filters.to_lc,to_uc:LIVR.rules.filters.to_uc,remove:LIVR.rules.filters.remove,leave_only:LIVR.rules.filters.leave_only});module.exports=LIVR},{"./LIVR/Rules/Common":2,"./LIVR/Rules/Filters":3,"./LIVR/Rules/Helper":4,"./LIVR/Rules/Numeric":5,"./LIVR/Rules/Special":6,"./LIVR/Rules/String":7,"./LIVR/Validator":8}],2:[function(require,module,exports){"use strict";var util=require("../util");module.exports={required:function(){return function(value){if(util.isNoValue(value)){return"REQUIRED"}return}},not_empty:function(){return function(value){if(value!==null&&value!==undefined&&value===""){return"CANNOT_BE_EMPTY"}return}},not_empty_list:function(){return function(list){if(list===undefined||list==="")return"CANNOT_BE_EMPTY";if(!Array.isArray(list))return"WRONG_FORMAT";if(list.length<1)return"CANNOT_BE_EMPTY";return}}}},{"../util":9}],3:[function(require,module,exports){"use strict";var util=require("../util");module.exports={trim:function(){return function(value,params,outputArr){if(util.isNoValue(value)||typeof value==="object")return;value+="";outputArr.push(value.replace(/^\s*/,"").replace(/\s*$/,""))}},to_lc:function(){return function(value,params,outputArr){if(util.isNoValue(value)||typeof value==="object")return;value+="";outputArr.push(value.toLowerCase())}},to_uc:function(){return function(value,params,outputArr){if(util.isNoValue(value)||typeof value==="object")return;value+="";outputArr.push(value.toUpperCase())}},remove:function(chars){chars=util.escapeRegExp(chars);var re=new RegExp("["+chars+"]","g");return function(value,params,outputArr){if(util.isNoValue(value)||typeof value==="object")return;value+="";outputArr.push(value.replace(re,""))}},leave_only:function(chars){chars=util.escapeRegExp(chars);var re=new RegExp("[^"+chars+"]","g");return function(value,params,outputArr){if(util.isNoValue(value)||typeof value==="object")return;value+="";outputArr.push(value.replace(re,""))}}}},{"../util":9}],4:[function(require,module,exports){"use strict";var Validator=require("../Validator");var util=require("../util");module.exports={nested_object:function(livr,ruleBuilders){var validator=new Validator(livr).registerRules(ruleBuilders).prepare();return function(nestedObject,params,outputArr){if(util.isNoValue(nestedObject))return;if(typeof nestedObject!=="object")return"FORMAT_ERROR";var result=validator.validate(nestedObject);if(result){outputArr.push(result);return}else{return validator.getErrors()}}},list_of:function(rules,ruleBuilders){if(!Array.isArray(rules)){rules=Array.prototype.slice.call(arguments);ruleBuilders=rules.pop()}var livr={field:rules};var validator=new Validator(livr).registerRules(ruleBuilders).prepare();return function(values,params,outputArr){if(util.isNoValue(values))return;if(!Array.isArray(values))return"FORMAT_ERROR";var results=[];var errors=[];var hasErrors=false;for(var i=0;i<values.length;i++){var result=validator.validate({field:values[i]});if(result){results.push(result.field);errors.push(null)}else{hasErrors=true;errors.push(validator.getErrors().field);results.push(null)}}if(hasErrors){return errors}else{outputArr.push(results);return}}},list_of_objects:function(livr,ruleBuilders){var validator=new Validator(livr).registerRules(ruleBuilders).prepare();return function(objects,params,outputArr){if(util.isNoValue(objects))return;if(!Array.isArray(objects))return"FORMAT_ERROR";var results=[];var errors=[];var hasErrors=false;for(var i=0;i<objects.length;i++){var result=validator.validate(objects[i]);if(result){results.push(result);errors.push(null)}else{hasErrors=true;errors.push(validator.getErrors());results.push(null)}}if(hasErrors){return errors}else{outputArr.push(results);return}}},list_of_different_objects:function(selectorField,livrs,ruleBuilders){var validators={};for(var selectorValue in livrs){var validator=new Validator(livrs[selectorValue]).registerRules(ruleBuilders).prepare();validators[selectorValue]=validator}return function(objects,params,outputArr){if(util.isNoValue(objects))return;if(!Array.isArray(objects))return"FORMAT_ERROR";var results=[];var errors=[];var hasErrors=false;for(var i=0;i<objects.length;i++){var object=objects[i];if(typeof object!="object"||!object[selectorField]||!validators[object[selectorField]]){errors.push("FORMAT_ERROR");continue}var validator=validators[object[selectorField]];var result=validator.validate(object);if(result){results.push(result);errors.push(null)}else{hasErrors=true;errors.push(validator.getErrors());results.push(null)}}if(hasErrors){return errors}else{outputArr.push(results);return}}}}},{"../Validator":8,"../util":9}],5:[function(require,module,exports){"use strict";var util=require("../util");module.exports={integer:function(){return function(value){if(util.isNoValue(value))return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";value+="";if(!value.match(/^\-?[0-9]+$/))return"NOT_INTEGER";return}},positive_integer:function(){return function(value){if(util.isNoValue(value))return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";value+="";if(!/^[1-9][0-9]*$/.test(value))return"NOT_POSITIVE_INTEGER";return}},decimal:function(){return function(value){if(util.isNoValue(value))return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";value+="";if(!/^(?:\-?(?:[0-9]+\.[0-9]+)|(?:[0-9]+))$/.test(value))return"NOT_DECIMAL";return}},positive_decimal:function(){return function(value){if(util.isNoValue(value))return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";value+="";if(!/^(?:(?:[0-9]*\.[0-9]+)|(?:[1-9][0-9]*))$/.test(value))return"NOT_POSITIVE_DECIMAL";return}},max_number:function(maxNumber){return function(value){if(util.isNoValue(value))return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";if(+value>+maxNumber)return"TOO_HIGH";return}},min_number:function(minNumber){return function(value){if(util.isNoValue(value))return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";if(+value<+minNumber)return"TOO_LOW";return}},number_between:function(minNumber,maxNumber){return function(value){if(util.isNoValue(value))return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";if(+value<+minNumber)return"TOO_LOW";if(+value>+maxNumber)return"TOO_HIGH";return}}}},{"../util":9}],6:[function(require,module,exports){"use strict";var util=require("../util");module.exports={email:function(){var emailRe=/^([\w\-_+]+(?:\.[\w\-_+]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;return function(value){if(value===undefined||value===null||value==="")return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";value+="";if(!emailRe.test(value))return"WRONG_EMAIL";if(/\@.*\@/.test(value))return"WRONG_EMAIL";if(/\@.*_/.test(value))return"WRONG_EMAIL";return}},equal_to_field:function(field){return function(value,params){if(value===undefined||value===null||value==="")return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";if(value!=params[field])return"FIELDS_NOT_EQUAL";return}},url:function(){var urlReStr="^(?:(?:http|https)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$";var urlRe=new RegExp(urlReStr,"i");return function(value){if(value===undefined||value===null||value==="")return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";if(value.length<2083&&urlRe.test(value))return;return"WRONG_URL"}},iso_date:function(){return function(value){if(value===undefined||value===null||value==="")return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";var matched=value.match(/^(\d{4})-([0-1][0-9])-([0-3][0-9])$/);if(matched){var epoch=Date.parse(value);if(!epoch&&epoch!==0)return"WRONG_DATE";var d=new Date(epoch);d.setTime(d.getTime()+d.getTimezoneOffset()*60*1e3);if(d.getFullYear()==matched[1]&&d.getMonth()+1==+matched[2]&&d.getDate()==+matched[3]){return}}return"WRONG_DATE"}}}},{"../util":9}],7:[function(require,module,exports){"use strict";var util=require("../util");module.exports={one_of:function(allowedValues){if(!Array.isArray(allowedValues)){allowedValues=Array.prototype.slice.call(arguments);allowedValues.pop()}return function(value){if(value===undefined||value===null||value==="")return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";for(var i=0;i<allowedValues.length;i++){if(value==allowedValues[i]){return}}return"NOT_ALLOWED_VALUE"}},max_length:function(maxLength){return function(value){if(value===undefined||value===null||value==="")return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";value+="";if(value.length>maxLength)return"TOO_LONG";return}},min_length:function(minLength){return function(value){if(value===undefined||value===null||value==="")return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";value+="";if(value.length<minLength)return"TOO_SHORT";return}},length_equal:function(length){return function(value){if(value===undefined||value===null||value==="")return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";value+="";if(value.length<length)return"TOO_SHORT";if(value.length>length)return"TOO_LONG";return}},length_between:function(minLength,maxLength){return function(value){if(value===undefined||value===null||value==="")return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";value+="";if(value.length<minLength)return"TOO_SHORT";if(value.length>maxLength)return"TOO_LONG";return}},like:function(reStr,flags){var isIgnoreCase=arguments.length===3&&flags.match("i");var re=new RegExp(reStr,isIgnoreCase?"i":"");return function(value){if(value===undefined||value===null||value==="")return;if(!util.isNumberOrString(value))return"FORMAT_ERROR";value+="";if(!value.match(re))return"WRONG_FORMAT";return}}}},{"../util":9}],8:[function(require,module,exports){"use strict";var util=require("./util");var DEFAULT_RULES={};var IS_DEFAULT_AUTO_TRIM=0;function Validator(livrRules,isAutoTrim){this.isPrepared=false;this.livrRules=livrRules;this.validators={};this.validatorBuilders={};this.errors=null;if(isAutoTrim!==null&&isAutoTrim!==undefined){this.isAutoTrim=isAutoTrim}else{this.isAutoTrim=IS_DEFAULT_AUTO_TRIM}this.registerRules(DEFAULT_RULES)}Validator.registerDefaultRules=function(rules){for(var ruleName in rules){DEFAULT_RULES[ruleName]=rules[ruleName]}};Validator.registerAliasedDefaultRule=function(alias){if(!alias.name)throw"Alias name required";DEFAULT_RULES[alias.name]=Validator._buildAliasedRule(alias)};Validator._buildAliasedRule=function(alias){if(!alias.name)throw"Alias name required";if(!alias.rules)throw"Alias rules required";var livr={value:alias.rules};return function(ruleBuilders){var validator=new Validator(livr).registerRules(ruleBuilders).prepare();return function(value,params,outputArr){var result=validator.validate({value:value});if(result){outputArr.push(result.value);return}else{return alias.error||validator.getErrors().value}}}};Validator.defaultAutoTrim=function(isAutoTrim){IS_DEFAULT_AUTO_TRIM=!!isAutoTrim};Validator.prototype={prepare:function(){var allRules=this.livrRules;for(var field in allRules){var fieldRules=allRules[field];if(!Array.isArray(fieldRules)){fieldRules=[fieldRules]}var validators=[];for(var i=0;i<fieldRules.length;i++){var parsed=this._parseRule(fieldRules[i]);validators.push(this._buildValidator(parsed.name,parsed.args))}this.validators[field]=validators}this.isPrepared=true;return this},validate:function(data){if(!this.isPrepared)this.prepare();if(!util.isObject(data)){this.errors="FORMAT_ERROR";return}if(this.isAutoTrim){data=this._autoTrim(data)}var errors={},result={};for(var fieldName in this.validators){var validators=this.validators[fieldName];if(!validators||!validators.length)continue;var value=data[fieldName];for(var i=0;i<validators.length;i++){var fieldResultArr=[];var errCode=validators[i](result.hasOwnProperty(fieldName)?result[fieldName]:value,data,fieldResultArr);if(errCode){errors[fieldName]=errCode;break}else if(data.hasOwnProperty(fieldName)){if(fieldResultArr.length){result[fieldName]=fieldResultArr[0]}else if(!result.hasOwnProperty(fieldName)){result[fieldName]=value}}}}if(util.isEmptyObject(errors)){this.errors=null;return result}else{this.errors=errors;return false}},getErrors:function(){return this.errors},registerRules:function(rules){for(var ruleName in rules){this.validatorBuilders[ruleName]=rules[ruleName]}return this},registerAliasedRule:function(alias){if(!alias.name)throw"Alias name required";this.validatorBuilders[alias.name]=Validator._buildAliasedRule(alias);return this},getRules:function(){return this.validatorBuilders},_parseRule:function(livrRule){var name,args;if(util.isObject(livrRule)){name=Object.keys(livrRule)[0];args=livrRule[name];if(!Array.isArray(args))args=[args]}else{name=livrRule;args=[]}return{name:name,args:args}},_buildValidator:function(name,args){if(!this.validatorBuilders[name]){throw"Rule ["+name+"] not registered"}var allArgs=[];allArgs.push.apply(allArgs,args);allArgs.push(this.getRules());return this.validatorBuilders[name].apply(null,allArgs)},_autoTrim:function(data){var dataType=typeof data;if(dataType!=="object"&&data){if(data.replace){return data.replace(/^\s*/,"").replace(/\s*$/,"")}else{return data}}else if(dataType=="object"&&Array.isArray(data)){var trimmedData=[];for(var i=0;i<data.length;i++){trimmedData[i]=this._autoTrim(data[i])}return trimmedData}else if(dataType=="object"&&util.isObject(data)){var trimmedData={};for(var key in data){if(data.hasOwnProperty(key)){trimmedData[key]=this._autoTrim(data[key])}}return trimmedData}return data}};module.exports=Validator},{"./util":9}],9:[function(require,module,exports){"use strict";module.exports={isNumberOrString:function(value){if(typeof value=="string")return true;if(typeof value=="number"&&isFinite(value))return true;return false},isObject:function(obj){return obj===Object(obj)},isEmptyObject:function(map){for(var key in map){if(map.hasOwnProperty(key)){return false}}return true},escapeRegExp:function(str){return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},isNoValue:function(value){return value===undefined||value===null||value===""}}},{}],10:[function(require,module,exports){window.LIVR=require("../lib/LIVR")},{"../lib/LIVR":1}]},{},[10]);