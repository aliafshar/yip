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
 *
 * @fileoverview
 *
 * Yip is a micro (read featureless) library for creating custom elements.
 *
 * ## Get started
 *
 * to get started, for example
 *
 * ```
 *
 * class YipNote extends Yip.Controller {
 *   childName() {
 *     return 'aside'
 *   }
 *   childClasses() {
 *     return {
 *       'warning': this.element.attributes.warning,
 *       'note': this.element.attributes.note,
 *     }
 *   }        
 * }
 *
 * Yip.add('yip-note', YipNote);
 * ```
 * Now, using the markup 
 * ```
 * <yip-note>
 * Hi!
 * </yip-note>
 *
 * <yip-note warning>
 * Beware!
 * </yip-note>
 * ```
 *
 * That's all really.
 *
 * Configuring the shadow element
 *
 * There is always going to be a top-level element in the shadow dom. This gets
 * rendered by your element. Yip always refers to the element as the "child" of
 * the custom element.
 *
 * You should configure the child based on attributes and other things applied
 * to the element. For example
 *
 * ```
 * <yip-note warning>Yikes!</yip-note>
 * ```
 *
 * Element might actually translate into a child like:
 * ```
 * <div class="yip-note yip-note-warning">Yikes!</div>
 * ```
 *
 * Class names should be applied by overriding the controller's
 * childClasses method, like:
 * 
 * ```
 * class YipNoteController extends Yip.Controller {
 *  childClasses() {
 *   return {
 *    // Always apply this class.
 *    'yip-note': true,
 *
 *    // Only apply this class if the `warning` attribute is present.
 *    'yip-note-warning': this.element.attributes['warning']
 *   }
 *  }
 * }
* ```
 *
 *
 * ### How does it work?
 *
 * It uses the custom elements v1 API, so you should probably check
 * http://caniuse.com/#feat=custom-elementsv1 because at the moment there are
 * not many browsers supporting it and the pollyfill is not quite there. Onwards
 * and upwards though.
 *
 * The library takes care of creating a custom element with a shadowdom, from
 * some configuation options. All the options are retrieved from a controller
 * instance, which exists 1:1 per element.
 *
 * # API
 *
 */

"use strict";


/**
 * @namespace Yip
 */
const Yip = {};



/** A Yip controller. Subclass this to create a controller for your custom
 * element.
 *
 */
Yip.Controller  = class {
  constructor(element) {
    this.element = element;
    this.root = this.buildRoot();
    this.child = this.buildChild();
    this.applyClasses();
    this.applyStyles();
    this.child.append(this.buildSlot());
    this.root.append(this.child);
  }

  connectedCallback() {
  }

  applyClasses() {
    const classes = this.childClasses();
    for (let className in classes) {
      if (classes[className]) {
        this.child.classList.add(className);
      }
    }
  }

  applyStyles(styles) {
    const styleSelector = this.childStyles();
    if (styleSelector) {
      const styleNode = document.querySelector(styleSelector);
      const newStyleNode = styleNode.cloneNode(true);
      newStyleNode.id = '';
      this.root.append(newStyleNode);
    }
  }

  /**
   * Called to retrieve the actual element's name.
   * 
   * This will default to create a div as `<div></div>`. Replacing this with a
   * different existing element's name will create that element. 
   *
   * @returns {String} The name of the actual element to create.
   */
  elementName() {
    return 'yip-unnamed-element';
  }

  buildRoot() {
    return this.element.attachShadow({mode: 'open'});
  }

  /**
   * Called to build the element that is attached to the DOM.
   *
   * If overriding, you must ensure that if you want child elements, to attach
   * the `<slot></slot>` element as a child.
   */
  buildChild() {
    return document.createElement(this.childName());
  }

  buildSlot() {
    return document.createElement('slot');
  }

  childName() {
    return 'div';
  }

  childStyles() {
    return {};
  }

  /**
   * Called to retrieve a list of classes that will be applied to the shadow
   * element.
   *
   * All of the custom element's definition is available, and can be used to
   * conditionally add classes to the child element.
   *
   * @return {object} Mapping class names to a boolean value of whether to
   * apply the class or not.
   */
  childClasses() {
    return {};
  }

  set innerHTML(value) {
    this.child.innerHTML = value;
  }

  get innerHTML() {
    return this.child.innerHTML;
  }
}


/**
 * Yip element class.
 */
Yip.Element = class extends HTMLElement {
  constructor() {
    super();
    this.Yip = this._YipBuildController();
  }

  _yipBuildController() {
    return new Yip.Controller(this);
  }

  connectedCallback() {
    return this.Yip.connectedCallback();
  }

}


/**
 * Create a new element type.
 *
 *
 * @param {class} controllerType
 *                  This is the type that will control the creation and
 *                  lifecycle of this element. It should extend Yip.Controller.
 * @return {class}
 *                  A newly created HTMLElement subclass that has been registered
 *                  with the pased controller.
 */
Yip.New = function(controllerType) {
  class _NewYipElement extends Yip.Element {
    _YipBuildController() {
      return new controllerType(this);
    }
  }
  return _NewYipElement;
}

/**
 * Add a new Yip Element.
 *
 *
 */
Yip.Add = function(elementName, controllerType) {
    const elementType = Yip.New(controllerType);
    customElements.define(elementName, elementType);
    return elementType;
}

const myExports = exports || {};
myExports.Yip = Yip;
