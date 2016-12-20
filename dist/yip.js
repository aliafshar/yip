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
 * class YipNote extends YipController {
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
 * class YipNoteController extends YipController {
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





/**
 * Yip element class.
 *
 * You can subclass this if you want, but then you will need to handle
 * registration youself.
 *
 * Yip can create an element that uses the specific controller you pass.
 */
class Element extends HTMLElement {

  constructor() {
    super();
    this.yipRoot = this.yipBuildRoot();
    this.yipChild = this.yipBuildchild();
    this.yipApplyClasses();
    this.yipApplyStyles();
    this.yipChild.append(this.yipBuildSlot());
    this.yipRoot.append(this.yipChild);
  }


  
  /**
   * Apply the configured classes the the child element.
   */
  yipApplyClasses() {
    const classes = this.yipChildClasses();
    for (let className in classes) {
      if (classes[className]) {
        this.yipChild.classList.add(className);
      }
    }
  }

  /**
   * Apply the configured style sheets the the child element.
   */
  yipApplyStyles(styles) {
    const styleSelector = this.yipChildStyles();
    console.log(styleSelector);
    if (styleSelector) {
      const styleNode = document.querySelector(styleSelector);
      const newStyleNode = styleNode.cloneNode(true);
      newStyleNode.id = '';
      this.yipRoot.append(newStyleNode);
    }
  }


  yipBuildRoot() {
    return this.attachShadow({mode: 'open'});
  }

  /**
   * Called to build the element that is attached to the DOM.
   *
   * If overriding, you must ensure that if you want child elements, to attach
   * the `<slot></slot>` element as a child.
   */
  yipBuildchild() {
    return document.createElement(this.yipChildName());
  }

  yipBuildSlot() {
    return document.createElement('slot');
  }

  yipChildName() {
    return 'div';
  }

  yipChildStyles() {
    return null;
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
  yipChildClasses() {
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
function add(elementName, elementType) {
  customElements.define(elementName, elementType);
  return elementType;
}

exports.Element = Element;
exports.add = add;

}((this.yip = this.yip || {})));
