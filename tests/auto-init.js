require('../dist/js-year-calendar');

test('instantiate calendar with selector', () => {
    document.body.innerHTML = '<div id="calendar" data-provide="calendar"></div>';

    // Manually trigger the DOMContentLoaded event
    var event = new Event("Event");
    event.initEvent("DOMContentLoaded", true, true);
    document.dispatchEvent(event);

    expect(document.querySelector('#calendar').children.length).toEqual(2);
});