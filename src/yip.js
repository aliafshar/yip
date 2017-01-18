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
export class Element extends HTMLElement {

  /**
   * Creates a new Element.
   *
   * This constructor is never called directly. Instead, use {@link
   * document.createElement('my-element-name') }
   */
  constructor() {
    super();
    this.yipRoot = this.yipBuildRoot();
    this.yipChild = this.yipBuildChild();
    this.yipApplyClasses();
    this.yipApplyStyles();
    this.yipConnect();
    this.yipRoot.append(this.yipChild);
  }

  connectedCallback() {
  }

  /**
   * Called to transform a template.
   *
   * Override it to add your own templating system if you want to do
   * interpolation.
   */
  yipRenderTemplate(input) {
    return input;
  }

  /**
   * Called to get the template element selector.
   *
   * Override it to use a template for creating the DOM instead building the
   * element. The function should return a selector, usually an ID makes
   * most sense here. If you don't wants to use a template, just ignore this.
   *
   * @return {string} The selector for the template element to use. OR null to
   * imply that there will be no template and DOM will be created manually.
   */
  yipChildTemplate() {
    return null;
  }

  yipUpdate() {
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
      return child;
    }
  }

  /**
   * Called to build the child element from a template.
   */
  yipBuildTemplateChild() {
    const childTemplate = document.querySelector(this.yipChildTemplate());
    if (childTemplate) {
      if (childTemplate.content.children.length != 1) {
        console.warn('Template has != 1 children');
        return;
      }
      const copyTemplate = childTemplate.cloneNode(true);
      copyTemplate.innerHTML = this.yipRenderTemplate(childTemplate.innerHTML);
      return copyTemplate.content.children[0].cloneNode(true);
    } else {
      console.warn('Template not found.', this.yipChildTemplate());
      return;
    }
  }

  /**
   * Called to create the Element's entire DOM.
   *
   * Override this to create a more complicated DOM than just a single element.
   * The default implementation creates a single element of {@link yipChildName}
   * but any DOM can be used.
   *
   * You should also be responsible for creating a slot element as a child if
   * you wish your custom element to have child nodes.
   *
   * **Note: If a template is defined, this method will not be called.**
   *
   * @return {HTMLElement} The newly created DOM.
   */
  yipBuildElementChild() {
    const el = document.createElement(this.yipChildName());
    el.append(this.yipBuildSlot());
    return el;
  }

  /**
   * Called to build the slot for an element.
   *
   * The default implementation is called by {@link yipBuildChild} and produces
   * a single `<slot></slot>` element as the child of the child.
   */
  yipBuildSlot() {
    return document.createElement('slot');
  }

  /**
   * Called when building a child element to get its name.
   */
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
export function add(elementName, elementType) {
  customElements.define(elementName, elementType);
  return elementType;
}

