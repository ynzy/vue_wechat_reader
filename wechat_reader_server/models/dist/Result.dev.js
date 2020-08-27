"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../utils/constant'),
    CODE_ERROR = _require.CODE_ERROR,
    CODE_SUCCESS = _require.CODE_SUCCESS,
    CODE_TOKEN_EXPIRED = _require.CODE_TOKEN_EXPIRED;

var Result =
/*#__PURE__*/
function () {
  function Result(data) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '操作成功';
    var options = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, Result);

    this.data = null;

    if (arguments.length === 0) {
      this.msg = '操作成功';
    } else if (arguments.length === 1) {
      this.msg = data;
    } else {
      this.data = data;
      this.msg = msg;

      if (options) {
        this.options = options;
      }
    }
  }

  _createClass(Result, [{
    key: "createResult",
    value: function createResult() {
      if (!this.code) {
        this.code = CODE_SUCCESS;
      }

      var base = {
        code: this.code,
        msg: this.msg
      };

      if (this.data) {
        base.data = this.data;
      }

      if (this.options) {
        base = _objectSpread({}, base, {}, this.options);
      }

      console.log(base);
      return base;
    }
  }, {
    key: "json",
    value: function json(res) {
      res.json(this.createResult());
    }
  }, {
    key: "success",
    value: function success(res) {
      // 处理过程抛出异常，会在router/index.js中的全局异常进行处理
      // throw new Error('...err')
      this.code = CODE_SUCCESS;
      this.json(res);
    }
  }, {
    key: "fail",
    value: function fail(res) {
      this.code = CODE_ERROR;
      this.json(res);
    }
  }, {
    key: "jwtError",
    value: function jwtError(res) {
      this.code = CODE_TOKEN_EXPIRED;
      this.json(res);
    }
  }]);

  return Result;
}();

module.exports = Result;