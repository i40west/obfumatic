# ObfuMatic! 🥸

I had a thought that this would be a good approach to obfuscating email
addresses on a website. And I didn't know Web Components, but wanted to
learn. So I made this.

## Usage 🚧

Put `obfumatic.js` on your site, load it normally.

```html
<script type="module" src="/js/obfumatic.js"></script>
```

Or bundle it with whatever build tool you're using.

Then, in your HTML:

```html
<obfu-matic stuff="Y0hKbGMybGtaVzUwUUhkb2FYUmxhRzkxYzJVdVoyOTI=" say="contact me">Fallback text</obfu-matic>
```

`stuff` is a double-base64-encoded email address. `say` is the text to
use as the link; the email address is used if this is not given. Any
content inside the tag is the fallback text if the browser doesn't
support Web Components or have Javascript enabled.

To encode the address, you can, for example, run the node repl and do:

```js
btoa(btoa('president@whitehouse.gov'))
```

I've included a Hugo shortcode that will do this for you, so you can
just go:

```html
{{< hideemail addr="president@whitehouse.gov" content="email me" >}}
```

## Why? 🤔

Your HTML will show no hint that an email address is being used.
And you can't get to it by walking the DOM with Javascript, because
the shadow DOM is created in "closed" mode. Is this better than just
using Javascript to decode the address? I don't know, probably?

## But... 😒

The catch is the styling. Your stylesheets won't penetrate the shadow
DOM to style the link to match your site. There are two ways to apply
your CSS to the link.

1. I've exposed a bunch of CSS variables. They "happen" to be the same
ones I typically use in my CSS anyway. What a coincidence!

`--link-color`
`--link-hover-color`
`--link-hover-transition`
`--link-text-decoration`
`--link-underline-color`
`--link-underline-thickness`
`--selection-a-color`
`--selection-bg`

2. You can use the `::part` selector to style the link. The generated
HTML is basically `<span><a>...</a></span>`, where the `span` has a
`part` of `span` and the `a` has a `part` of `link`. So, wherever you
style your links, you can add a selector:

```css
a,
obfu-matic::part(link) {
  color: #0000ff; /* whatever styles */
}
a:hover,
obfu-matic::part(link):hover {
  color: red; /* whatever */
}
```

If you do both of these things, the `part` rules will win.

## So 😎

If you think this is cool, but have a better way to get it styled,
send a PR. If you want more CSS properties exposed, send a PR!
