test("default", function(assert) {
  assert.ok(
    $('#qunit-fixture').plugin().data('plugin'),
    "Instance should have been created.'"
  );
});