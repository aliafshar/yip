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
 * @fileoverview
 *
 * Yip is a micro (read featureless) library for creating custom elements.
 *
 * https://github.com/aliafshar/yip
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
    this.yipChild = this.yipBuildChild();
    this.yipApplyClasses();
    this.yipApplyStyles();
    this.yipConnect();
    this.yipRoot.append(this.yipChild);
  }

  /**
   * Called to transform a template.
   *
   * Override it to add your own templating system if you want to do
   * interpolation.
   */
  yipRenderTemplate(input) {
    return output;
  }

  yipChildTemplate() {
    return null;
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
  yipBuildChild() {
    if (this.yipChildTemplate()) {
      let child = this.yipBuildTemplateChild();
      if (!child) {
        child = document.createElement('div');
        child.textContent = 'template error';
      }
      return child;
    } else {
      const child = this.yipBuildElementChild();
      child.append(this.yipBuildSlot());
      return child;
    }
  }

  yipBuildTemplateChild() {
    const childTemplate = document.querySelector(this.yipChildTemplate());
    if (childTemplate) {
      if (childTemplate.content.children.length != 1) {
        console.warn('Template has != 1 children');
        return;
      }
      const copyTemplate = childTemplate.cloneNode(true);
      copyTemplate.innerHTML = this.yipRenderTemplate(copyTemplate.innerHTML);
      return copyTemplate.content.children[0].cloneNode(true);
    } else {
      console.warn('Template not found.', this.yipChildTemplate());
      return;
    }
  }

  yipBuildElementChild() {
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

  yipConnect() {
  }

  yipEmit(name) {
    this.dispatchEvent(new Event(name));
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
