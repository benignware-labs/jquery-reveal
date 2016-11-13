# jquery-reveal

> Reveals elements on scroll

Usage
-----

```js
$('.reveal').reveal({
  animationClass: 'bounceIn',
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
    <td>animationClass</td><td>The css class which refers to the css animation</td>
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
