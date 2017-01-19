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


export function addTemplate(root, template) {
    const p = new DOMParser();
    const d = p.parseFromString(template, 'text/html');
    const child = d.body.firstChild;
    root.append(child);
    return child;
}


export function applyClasses(targetNode, classes) {
  for (let className in classes) {
    if (classes[className]) {
      targetNode.classList.add(className);
    }
  }
}

export function copyAttrs(targetNode, sourceNode, attrsList) {
    for (let i = 0; i < attrsList.length; i++) {
      const attrName = attrsList[i];
      const val = sourceNode.getAttribute(attrName);
      if (val || val == '') {
        targetNode.setAttribute(attrName, val);
      }
    }
  }


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
    
    // These are the main yip state variables
    this.yipRoot = this.yipBuildRoot();
    this.yipNode = null;
    this.yipSlot = null;

    this.yipBuild();
    
  }

  /**
   * Override to build the DOM.
   */
  yipBuild() {
  }

  /**
   * Override to return the default template.
   */
  yipTemplate() {
    return '';
  }

  /**
   * Add the template string as HTML to the shadowDom.
   */
  yipAdd(templateContent) {
    if (!templateContent) {
      templateContent = this.yipTemplate();
    }
    this.yipNode = addTemplate(this.yipRoot, templateContent);
  }

  /**
   * Create and add a named element to the shadow root.
   */
  yipAddElement(elementName, hasSlot=true) {
    const el = document.createElement(elementName);
    if (hasSlot) {
      el.append(this.yipBuildSlot());
    }
    this.yipNode = el;
    this.yipRoot.append(el);
    return el;
  }

  /**
   * The children of this element. i.e. the slot's assigned nodes.
   */
  get yipChildren() {
    return this.yipSlot.assignedNodes();
  }

  /**
   * The first child of this element, i.e. in the slot.
   */
  get yipFirstChild() {
    return this.yipChildren[0]
  }

  yipCopyAttrs(attrsList) {
    copyAttrs(this.yipNode, this, attrsList);
  }

  yipApplyClasses(classes) {
    applyClasses(this.yipNode, classes);
  }

  yipAddStylesheet(styleUrl) {
    const node = document.createElement('link');
    node.rel = "stylesheet";
    node.href = styleUrl;
    this.yipRoot.append(node)
  }

  yipAddScript(scriptUrl) {
    const node = document.createElement('script');
    node.src = scriptUrl;
    this.yipRoot.append;
  }

  yipBuildRoot() {
    return this.attachShadow({mode: 'open'});
  }

  /**
   * Called to build the slot for an element.
   *
   * The default implementation is called by {@link yipAddElement} and produces
   * a single `<slot></slot>` element as the child of the child.
   */
  yipBuildSlot() {
    return document.createElement('slot');
  }

  /**
   * Emit a custom event.
   */
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
export function register(elementName, elementType) {
  customElements.define(elementName, elementType);
  return elementType;
}

