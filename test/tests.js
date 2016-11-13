test("default", function(assert) {
  assert.ok(
    $('#qunit-fixture').reveal().data('reveal'),
    "Instance should have been created.'"
  );
});
