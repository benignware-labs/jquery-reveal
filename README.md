# jquery-reveal

> Reveals elements on scroll

Usage
-----

```html

<div class="js_reveal fadeInLeft">
  <h1>Hello World</h1>
</div>
```

```css
@keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

.fadeInLeft {
  opacity: 0;
  -webkit-animation-name: fadeInLeft;
  animation-name: fadeInLeft;
}


.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
```


```js
$('.js_reveal').reveal({
  animatedClass: 'animated'
  delay: 250,
  offset: 150
});
```

Options
-------
<table>
  <tr>
    <th>Name</th><th>Description</th>
  </tr>
  <tr>
    <td>animatedClass</td><td>The css class which triggers the animation</td>
  </tr>
  <tr>
    <td>delay</td><td>Delay is ms after which the animation gets triggered</td>
  </tr>
  <tr>
    <td>offset</td><td>Screen offset to bottom viewport</td>
  </tr>
  <tr>
    <td>skipInitial</td><td>Skip animations for the initial viewport. Defaults to `false`</td>
  </tr>
</table>
