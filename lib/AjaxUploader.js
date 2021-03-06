'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uid = require('./uid');

var _uid2 = _interopRequireDefault(_uid);

var AjaxUploader = _react2['default'].createClass({
  displayName: 'AjaxUploader',

  propTypes: {
    multiple: _react.PropTypes.bool,
    onStart: _react.PropTypes.func,
    data: _react.PropTypes.object,
    headers: _react.PropTypes.object,
    beforeUpload: _react.PropTypes.func,
    withCredentials: _react.PropTypes.bool
  },

  onChange: function onChange(e) {
    var files = e.target.files;
    this.uploadFiles(files);
  },

  onClick: function onClick() {
    var el = this.refs.file;
    if (!el) {
      return;
    }
    el.click();
    el.value = '';
  },

  onKeyDown: function onKeyDown(e) {
    if (e.key === 'Enter') {
      this.onClick();
    }
  },

  onFileDrop: function onFileDrop(e) {
    if (e.type === 'dragover') {
      return e.preventDefault();
    }

    var files = e.dataTransfer.files;
    this.uploadFiles(files);

    e.preventDefault();
  },

  uploadFiles: function uploadFiles(files) {
    var len = files.length;
    if (len > 0) {
      for (var i = 0; i < len; i++) {
        var file = files.item(i);
        file.uid = (0, _uid2['default'])();
        this.upload(file);
      }
      if (this.props.multiple) {
        this.props.onStart(Array.prototype.slice.call(files));
      } else {
        this.props.onStart(Array.prototype.slice.call(files)[0]);
      }
    }
  },

  upload: function upload(file) {
    var _this = this;

    var props = this.props;
    if (!props.beforeUpload) {
      return this.post(file);
    }

    var before = props.beforeUpload(file);
    if (before && before.then) {
      before.then(function () {
        _this.post(file);
      });
    } else if (before !== false) {
      this.post(file);
    }
  },

  post: function post(file) {
    var props = this.props;
    var data = props.data;
    if (typeof data === 'function') {
      data = data();
    }

    (0, _request2['default'])({
      action: props.action,
      filename: props.name,
      file: file,
      data: data,
      headers: props.headers,
      withCredentials: props.withCredentials,
      onProgress: function onProgress(e) {
        props.onProgress(e, file);
      },
      onSuccess: function onSuccess(ret) {
        props.onSuccess(ret, file);
      },
      onError: function onError(err, ret) {
        props.onError(err, ret, file);
      }
    });
  },

  render: function render() {
    var hidden = { display: 'none' };
    var props = this.props;
    return _react2['default'].createElement(
      'span',
      {
        onClick: this.onClick,
        onKeyDown: this.onKeyDown,
        onDrop: this.onFileDrop,
        onDragOver: this.onFileDrop,
        role: 'button',
        tabIndex: '0'
      },
      _react2['default'].createElement('input', { type: 'file',
        ref: 'file',
        style: hidden,
        accept: props.accept,
        multiple: this.props.multiple,
        onChange: this.onChange }),
      props.children
    );
  }
});

exports['default'] = AjaxUploader;
module.exports = exports['default'];