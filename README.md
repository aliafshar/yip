
# yip

[Github](https://github.com/aliafshar/yip)
| [Docs](https://yipjs-7c3d2.firebaseapp.com/)
| [Demo](https://yipjs-7c3d2.firebaseapp.com/demo/)
| [Tests](https://yipjs-7c3d2.firebaseapp.com/test/)
| [License](https://github.com/aliafshar/yip/blob/master/LICENSE)


**Tiny custom element toolbox for the web.**

Yip is a JavaScript library/demo which provides:

* Creating and registering new custom elements
* Shadow DOM manipulation and generation library
* Event handling and emitting

For interacting with the Shadow DOM, there are a number of features:

* Create and add DOM
* Create and manage the `<slot>`
* Add stylesheets, scripts or templates
* Support any template engine without a plugin

Note: Yip uses Custom Elements v1 API. Polyfilling that to older browsers is
left as an exercise for the brave user.


### Start now

To get started we are going to create a custom element `my-note` that will
render as an HTML `<aside>` element. That's all.

First, subclass [`yip.Element`](/Element.html) to create your custom element,
then call [`yip.register`](/globals.html#register) to register your new
custom element.

Now you can describe how to build the DOM for your element by overriding
`yipBuild`. For our `<my-note>` use-case, you would build it like:

```javascript
class Note extends yip.Element {
  yipBuild() {
    this.yipAddElement('aside');
  }
}

yip.register('my-note', Note);
```

Now you can use your elements with:

```html
<my-note>yo!</my-note>
```

And they will render as:

```html
<aside>yo!</aside>
```

or in reality, looks like:

```html
<my-note>[#shadow]<aside><slot>yo!</slot></aside>[/shadow]</my-note>
```

But that's the whole point of the shadow DOM, and slots and things.

### Applying Element Classes and Attribute Handling

You might want to add attribute handling to your element. The
attributes are your API. So, say I want to handle an attribute `warning` in
order to read:

```html
<my-note warning>meep!</my-note>
```

I might likely want to apply a class to the child aside in order to affect how it
looks. Let's apply the `warning-text` class.

To do this call `yipApplyClasses`:

```javascript
class Note extends yip.Element {
  yipBuild() {
    this.yipAddElement('aside');
    this.yipApplyClasses({'warning-text': this.attributes.warning});
  }
}

yip.register('my-note', Note);
```

Now, using the markup 
```html
<my-note>yo!</my-note>
<my-note warning>meep!</my-note>
<my-note error>ohnoes!</my-note>
```

### Using templates

You might want a more complicated UI, and decide to write it in a template:


```javascript
const t = `<aside>
            <div class="aside-content">
              <slot></slot>
            </div>
            <div cass="aside-actions">
              <button>Ok</button>
              <button>Not Ok</button>
            </div>
          </aside>`;
```
You can then use this template:

```javascript
class Note extends yip.Element {
  yipBuild() {
    this.yipAdd(t);
  }
}

yip.register('my-note', Note);
```
### Applying an external template transformer

You might decide that you want more complicated templating. Plug in whatever you
like by overriding `yipRenderTemplate`. For example to use doT templates:

```javascript
class Note extends yip.Element {
  yipTemplate() {
    return doT.template(t)({'element': this});
  }
  yipBuild() {
    this.yipAdd(this.yipTemplate());
  }
}

yip.register('my-note', Note);
```

Now we can have all kinds of crazy templates. The example above passes the
element into the template, so it can get used as the `it.element` by doT.

```javascript
const t = `<template id="my-note-template">
            <aside>
              Is this a warning?
              {{= it.element.attributes.warning  }}
            </aside>`;
```
Bring your own templating system, and hook it in. No need for plugins
or anything.

### Adding element-specific styles

First from a loaded external stylesheet.

```javascript
class Note extends yip.Element {
  yipBuild() {
    this.yipAddStyleLink('css/mystyles.css');
  }
}
```

### Child handling

Because you are in the shadow DOM, an Element's children will not return what
you want. What you usually want is the children of the slot. For this we added
`yipChildren`, an attribute that returns the assigned nodes of the element's
slot.

### Emiting custom events

Elements should emit events. You can easily dispatch an event on your custom
element, like:

```javascript
el.addEventListener('action-clicked', () => {});
el.yipEmit('action-clicked');
```

### Connecting internal events

Just connect them in `yipBuild` sometime after you have created the elements.

### Using Slots

Slots are amazing. They tell the browser where in your shadow DOM children of
your element should be added. You should probably define a `<slot>` element in
every template you pass.

You can of course have multiple slots. Yip will only manage the first (default)
slot. Please read [an article about slots](https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom#composition_slot)
if you care.


If you call `yipAddElement` a slot will be added for
you.

<hr />

*Note: yip is not an official Google product. Didn't wanna be one anyway, so
there.*

