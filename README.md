# yip

**Tiny custom elements for the web.** Yip is a JavaScript library/demo which supports:

* Registering new custom elements elements
* Using `<template>` for element templates
* Pluggable template transform
* Building an element in shadow dom
* Scoped styles
* Custom events

Note: Yip uses Custom Elements v1 API. Polyfilling that to older browsers is
left as an exercise for the brave user.


### Quick

* [Github](https://github.com/aliafshar/yip)
* [Docs](https://yipjs-7c3d2.firebaseapp.com/)
* [Demo](https://yipjs-7c3d2.firebaseapp.com/demo)
* [License](https://github.com/aliafshar/yip/blob/master/LICENSE) (spoiler:
  Apache2)

### Start now

To get started we are going to create a custom element `my-note` that will
render as an HTML `<aside>` element. That's all.

First, subclass `yip.Element` to create your custom element, then register it
with yip.

```
class Note extends yip.Element {

  yipChildName() { return 'aside'; }

}

yip.Add('my-note', Note);
```

Now you can use your elements with:

```
<my-note>yo!</my-note>
```

And they will render as:

```
<aside>yo!</aside>
```

### Applying Element Classes and Attribute Handling

You might want to add attribute handling to your element. The
attributes are your API. So, say I want to handle an attribute `warning` in
order to read:

```
<my-note warning>meep!</my-note>
```

I might likely want to apply a class to the child aside in order to affect how it
looks. To set styles conditionally, override `yipChildClasses` on your element
to provide a list of classes. Here we add `warning`, `error` and `note`.

```
class Note extends yip.Element {

  yipChildName() {
    return 'aside'
  }

  yipChildClasses() {
    return {
      'my-note': true,
      'warning': this.attributes.warning,
      'error': this.attributes.error,
      'note': !(this.attributes.error &&
                this.attributes.warning),
    }
  }
  
}

yip.add('my-note', Note);
```

Now, using the markup 
```
<my-note>yo!</my-note>
<my-note warning>meep!</my-note>
<my-note error>ohnoes!</my-note>
```

### Using `<template>`s

You might want a more complicated UI, and decide to write it in a template:


```
<template id="my-note-template">
  <aside>
    <div class="aside-content">
      <slot></slot>
    </div>
    <div cass="aside-actions">
      <button>Ok</button>
      <button>Not Ok</button>
    </div>
  </aside>
</template>
```
You can then use this template:

```
class Note extends yip.Element {

  yipChildTemplate() { return '#my-note-template'; }

}
```
The template should have a single child element, and that element will become
the element's child.

### Applying an external template transformer

You might decide that you want more complicated templating. Plug in whatever you
like by overriding `yipRenderTemplate`. For example to use doT templates:

```
class Note extends yip.Element {

  yipChildTemplate() { return '#my-note-template'; }

  yipRenderTemplate(input) {
    return doT.template(input)({'element': this});
  }

}
```

Now we can have all kinds of crazy templates. The example above passes the
element into the template, so it can get used as the `it.element` by doT.

```
<template id="my-note-template">
  <aside>
    Is this a warning?
    {{= it.element.attributes.warning  }}
  </aside>
</template>
```
Bring your own templating system, and hook it in. No need for plugins
or anything.

### Adding element-specific styles

To a stylesheet to be scoped to the element, override `yipChildStyles()` to
return the selector of the style sheet you want.

First create the styles:
```
<style id="my-note-styles">
  .my-note { ... }
</style>
```

Then specify them.
```
class Note extends yip.Element {

  yipChildStyles() { return '#my-note-styles'; }


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

`yipConnect` is called after the entire dom has been created, so use it to
connected internal events.


<hr />

*Note: yip is not an official Google product. Didn't wanna be one anyway, so
there.*

![yip logo](https://yipjs-7c3d2.firebaseapp.com/art/alien.png)
