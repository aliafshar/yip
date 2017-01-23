'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (exports) {
  'use strict';

  /**
   * Copyright 2016 Google Inc.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  /**
   * Utilities for manipulating the shadow DOM used by custom yip elements.
   */

  var util = function () {
    function util() {
      _classCallCheck(this, util);
    }

    _createClass(util, null, [{
      key: 'addTemplate',


      /**
       * Parse and add a chunk of html to the given root element.
       *
       * @param {HTMLElement} root
       *
       *    The element to add the template to.
       *
       * @param {string} templateText
       *
       *    The template string to add.
       */
      value: function addTemplate(root, templateText) {
        var p = new DOMParser();
        var d = p.parseFromString(templateText, 'text/html');
        var child = d.body.firstChild;
        root.append(child);
        return child;
      }
    }, {
      key: 'buildSlot',
      value: function buildSlot() {
        return document.createElement('slot');
      }
    }, {
      key: 'addElement',
      value: function addElement(root, elementName) {
        var hasSlot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        var node = document.createElement(elementName);
        if (hasSlot) {
          node.append(buildSlot());
        }
        root.append(node);
        return node;
      }

      /**
       * TODO
       */

    }, {
      key: 'addScript',
      value: function addScript(root, scriptText) {}

      /**
       * TODO
       */

    }, {
      key: 'addScriptLink',
      value: function addScriptLink(root, scriptUrl) {}
    }, {
      key: 'addStyleLink',
      value: function addStyleLink(root, styleUrl) {
        var node = document.createElement('link');
        node.rel = "stylesheet";
        node.href = styleUrl;
        root.append(node);
        return node;
      }

      /**
       * TODO
       */

    }, {
      key: 'addStyle',
      value: function addStyle(root, styleText) {}

      /**
       * TODO
       */

    }, {
      key: 'addStyleSelector',
      value: function addStyleSelector(root, selector) {}

      /**
       * Apply classes to the given node.
       * 
       * @param {HTMLElement} targetNode
       *
       *    The element to apply classes to.
       *
       * @param {object} classes
       *
       *    An object containing the class definitions in the format
       *    className: true/false as to whether the class should be applied.
       *
       */

    }, {
      key: 'applyClasses',
      value: function applyClasses(targetNode, classes) {
        for (var className in classes) {
          if (classes[className]) {
            targetNode.classList.add(className);
          }
        }
      }
    }, {
      key: 'copyAttrs',
      value: function copyAttrs(targetNode, sourceNode, attrsList) {
        for (var i = 0; i < attrsList.length; i++) {
          var attrName = attrsList[i];
          var val = sourceNode.getAttribute(attrName);
          if (val || val == '') {
            targetNode.setAttribute(attrName, val);
          }
        }
      }
    }]);

    return util;
  }();

  /**
   * Yip element class.
   *
   * You should subclass this to create a new element type to add DOM, behaviour,
   * styling, etc.
   *
   * Configuring your element is done exclusively with overriding methods that
   * return options. Yes, this might seem annoying, but it is unambiguously the
   * one way to do it in this library.
   *
   */


  var Element = function (_HTMLElement) {
    _inherits(Element, _HTMLElement);

    /**
     * Creates a new Element.
     *
     * This constructor is never called directly. Instead, use {@link
     * document.createElement('my-element-name') }
     */
    function Element() {
      _classCallCheck(this, Element);

      // These are the main yip state variables

      /**
       * The Shadow root.
       *
       * This is a DOM node that is rendered in place of this element. You can
       * treat it as the parent node for this element. All yipAdd* methods append
       * nodes to this element.
       */
      var _this = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this));

      _this.yipRoot = _this.yipBuildRoot();

      /**
       * The main renderable node.
       *
       * All yipAdd* methods set this attribute. If you don't use them, you should
       * set the attribute yourself as the main renderable node.
       */
      _this.yipNode = null;

      /**
       * The default slot.
       *
       * The slot element is where child nodes will be added to your custom
       * element. It is critical t add if you wish your element to contain other
       * elements.
       *
       * All yipAdd* methods set this attribute.
       */
      _this.yipSlot = null;

      // Build the thing!
      _this.yipBuild();

      return _this;
    }

    /**
     * Override to build the DOM.
     *
     * This method is called by the constructor, and is the main entry point for
     * building the element behind the scences.
     *
     * You should override it to do anything, for example:
     *
     *     yipBuild {
     *       this.yipAddElement('button');
     *     }
     */


    _createClass(Element, [{
      key: 'yipBuild',
      value: function yipBuild() {}

      /**
       * The default template.
       *
       *   @return {string} The template's content as a string.
       *
       * Override this to return a string that is the template to be parsed and
       * rendered. You don't need to include the `<template>` tags or anything like
       * that. Just a string of any DOM.
       *
       * This is just a convention, really. You can pass any string into
       * {@link yipAdd} to ad that template instead or also.
       */

    }, {
      key: 'yipTemplate',
      value: function yipTemplate() {
        return '';
      }

      /**
       * Add the template string as HTML to the shadowDom.
       *
       * @param {string} templateContent
       *
       *     The content of the template to load and add to the shadow root.
       *
       *     If !templateContent, the value will be grabbed from calling
       *     {@link yipTemplate}. But that's implicit and nasty, so possibly pass it
       *     in explicitly.
       */

    }, {
      key: 'yipAdd',
      value: function yipAdd(templateContent) {
        if (!templateContent) {
          templateContent = this.yipTemplate();
        }
        this.yipNode = util.addTemplate(this.yipRoot, templateContent);
      }

      /**
       * Create and add an element to the shadow root.
       *
       * @param {string} elementName
       *
       *     The element to create, e.g. `'div'`.
       *
       * @param {boolean} hasSlot
       *
       *     Whether to create and add a slot to the child. Usually for single
       *     node elements, you will just use the default `true` to enable your
       *     element to have children.
       *
       * This simply creates
       */

    }, {
      key: 'yipAddElement',
      value: function yipAddElement(elementName) {
        var hasSlot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        this.yipNode = addElement(this.yipRoot, elementName, hasSlot);
        return this.yipNode;
      }

      /**
       * The children of this element.
       *
       * This is really just the default slot's assigned nodes.
       */

    }, {
      key: 'yipCopyAttrs',


      /**
       * Copy attributes to the element's node.
       */
      value: function yipCopyAttrs(attrsList) {
        copyAttrs(this.yipNode, this, attrsList);
      }

      /**
       * Apply classes to the element's main node.
       *
       * @param {object} classes
       *
       *    An object containing the class definitions in the format
       *    className: true/false as to whether the class should be applied.
       *
       * You should use this method to apply conditional classes to the element's
       * main node during {@link yipBuild}, for example:
       *
       *     this.yipApplyClasses({
       *         isBlinking: this.attributes.blinking
       *     })
       *
       * which when an element is created:
       *
       *     <my-element blinking>
       *
       * The class `isBlinking` will be applied to the main node.
       *
       *
       */

    }, {
      key: 'yipApplyClasses',
      value: function yipApplyClasses(classes) {
        util.applyClasses(this.yipNode, classes);
      }
    }, {
      key: 'yipAddStyleLink',
      value: function yipAddStyleLink(styleUrl) {
        util.addStyleLink(this.yipRoot, styleUrl);
      }

      /**
       * Build the shadow root.
       */

    }, {
      key: 'yipBuildRoot',
      value: function yipBuildRoot() {
        return this.attachShadow({ mode: 'open' });
      }

      /**
       * Emit a custom event.
       */

    }, {
      key: 'yipEmit',
      value: function yipEmit(name) {
        this.dispatchEvent(new Event(name));
      }
    }, {
      key: 'yipChildren',
      get: function get() {
        return this.yipSlot.assignedNodes();
      }

      /**
       * The first child of this element, i.e. in the slot.
       */

    }, {
      key: 'yipFirstChild',
      get: function get() {
        return this.yipChildren[0];
      }
    }]);

    return Element;
  }(HTMLElement);

  /**
   * Add a new Yip Element.
   *
   * @param {String} elementName
   *
   *   The name of the element to register
   *
   * @param {class} controllerType
   *
   *   The type of the controller.
   *
   */


  function register(elementName, elementType) {
    customElements.define(elementName, elementType);
    return elementType;
  }

  exports.util = util;
  exports.Element = Element;
  exports.register = register;
})(undefined.yip = undefined.yip || {});

