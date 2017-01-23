# yip

**Tiny custom elements for the web.**

Yip is a JavaScript library/demo which provides:

* Creating and registering new custom elements
* Shadow DOM manipulation and generation library

For interacting with the Shadow DOM, there are a number of features:

Note: Yip uses Custom Elements v1 API. Polyfilling that to older browsers is
left as an exercise for the brave user.


### Quick Links

* [Github](https://github.com/aliafshar/yip)
* [Docs](https://yipjs-7c3d2.firebaseapp.com/)
* [Demo](https://yipjs-7c3d2.firebaseapp.com/demo)
* [License (Apache2)](https://github.com/aliafshar/yip/blob/master/LICENSE)

### Start now

To get started we are going to create a custom element `my-note` that will
render as an HTML `<aside>` element. That's all.

First, subclass `yip.Element` to create your custom element, then register it
with yip. It doesn't do anything for now.

```
class Note extends yip.Element {
  yipBuild() {
    // ... build and configure your element here
  }
}

yip.register('my-note', Note);
```

Now you can describe how to build the dom for your element by overriding
`yipBuild`. For our aside use-case, you would build it like:

```
class Note extends yip.Element {
  yipBuild() {
    this.yipAddElement('aside');
  }
}

yip.register('my-note', Note);
```

Now you can use your elements with:

```
<my-note>yo!</my-note>
```

And they will render as:

```
<aside>yo!</aside>
```

or in reality, looks like:

```
<my-note><shadow><aside><slot>yo!</slot></aside></shadow></my-note>
```

### Applying Element Classes and Attribute Handling

You might want to add attribute handling to your element. The
attributes are your API. So, say I want to handle an attribute `warning` in
order to read:

```
<my-note warning>meep!</my-note>
```

I might likely want to apply a class to the child aside in order to affect how it
looks. Let's apply the `warning-text` class.

To do this call `yipApplyClasses`:

```
class Note extends yip.Element {
  yipBuild() {
    this.yipAddElement('aside');
    this.yipApplyClasses({'warning-text': this.attributes.warning});
  }
}

yip.register('my-note', Note);
```

Now, using the markup 
```
<my-note>yo!</my-note>
<my-note warning>meep!</my-note>
<my-note error>ohnoes!</my-note>
```

### Using templates

You might want a more complicated UI, and decide to write it in a template:


```
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

```
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

```
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

```
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

```
class Note extends yip.Element {
  yipBuild() {
    this.yipAddStyleLink('css/mystyles.css');
  }
}
```

### Emiting custom events

Elements should emit events. You can easily dispatch an event on your custom
element, like:

```
el.addEventListener('action-clicked', () => {});
el.yipEmit('action-clicked');
```

### Connecting internal events

Just connect them in `yipBuild` sometime after you have created the elements.

<hr />

*Note: yip is not an official Google product. Didn't wanna be one anyway, so
there.*

