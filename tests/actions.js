require('../dist/js-year-calendar');

beforeEach(() => {
    document.body.innerHTML = '<div id="calendar"></div>';
});

const getDay = (month, day) => {
    return document.querySelectorAll(`#calendar .month-container:nth-child(${month + 1}) .day:not(.old):not(.new)`)[day - 1];
};

const currentYear = new Date().getFullYear();

const triggerEvent = (el, eventToTrigger) => {
    var ev = new MouseEvent(eventToTrigger, { which: 1, bubbles: true, cancelable: true });
    el.dispatchEvent(ev);
};

test('click on previous year', done => {
    const calendar = new Calendar('#calendar');

    // Previous year
    document.querySelectorAll('.year-neighbor')[0].click();
    setTimeout(() => {
        expect(calendar.getYear()).toEqual(currentYear - 1);
        done();
    }, 200);
});

test('click on next year', done => {
    const calendar = new Calendar('#calendar');

    // Previous year
    document.querySelectorAll('.year-neighbor')[1].click();
    setTimeout(() => {
        expect(calendar.getYear()).toEqual(currentYear + 1);
        done();
    }, 200);
});

test('click on previous 2 year', done => {
    const calendar = new Calendar('#calendar');

    // Previous year
    document.querySelectorAll('.year-neighbor2')[0].click();
    setTimeout(() => {
        expect(calendar.getYear()).toEqual(currentYear - 2);
        done();
    }, 200);
});

test('click on next 2 year', done => {
    const calendar = new Calendar('#calendar');

    // Previous year
    document.querySelectorAll('.year-neighbor2')[1].click();
    setTimeout(() => {
        expect(calendar.getYear()).toEqual(currentYear + 2);
        done();
    }, 200);
});


test('click on previous arrow', done => {
    const calendar = new Calendar('#calendar');

    // Previous year
    document.querySelector('.prev').click();
    setTimeout(() => {
        expect(calendar.getYear()).toEqual(currentYear - 1);
        done();
    }, 200);
});

test('click on next arrow', done => {
    const calendar = new Calendar('#calendar');

    // Previous year
    document.querySelector('.next').click();
    setTimeout(() => {
        expect(calendar.getYear()).toEqual(currentYear + 1);
        done();
    }, 200);
});

test('range selection without option', () => {
    const calendar = new Calendar('#calendar');

    var begin = getDay(2, 2);
    var end = getDay(2, 10);
    triggerEvent(begin, 'mousedown');
    triggerEvent(end, 'mouseenter');

    // Option enable range selection is not enabled. The range shouldn't exist.
    expect(begin.classList).not.toContain('range');
    expect(end.classList).not.toContain('range');
});

test('range selection with option', () => {
    const calendar = new Calendar('#calendar', { enableRangeSelection: true });

    var begin = getDay(2, 2);
    var end = getDay(2, 10);
    triggerEvent(begin, 'mousedown');
    triggerEvent(end, 'mouseenter');

    expect(getDay(2, 1).classList).not.toContain('range');
    expect(begin.classList).toContain('range');
    expect(begin.classList).toContain('range-start');
    expect(getDay(2, 5).classList).toContain('range');
    expect(end.classList).toContain('range');
    expect(end.classList).toContain('range-end');
    expect(getDay(2, 11).classList).not.toContain('range');
});

test('range selection without overlap', () => {
    const calendar = new Calendar('#calendar', {
        enableRangeSelection: true,
        allowOverlap: false,
        dataSource: [
            { startDate: new Date(currentYear, 2, 6), endDate: new Date(currentYear, 2, 15) }
        ]
    });

    var begin = getDay(2, 2);
    var end = getDay(2, 10);
    triggerEvent(begin, 'mousedown');
    triggerEvent(end, 'mouseenter');

    expect(getDay(2, 5).classList).toContain('range');
    expect(getDay(2, 5).classList).toContain('range-end');
    expect(getDay(2, 7).classList).not.toContain('range');
    expect(end.classList).not.toContain('range');
});

test('range selection with overlap', () => {
    const calendar = new Calendar('#calendar', {
        enableRangeSelection: true,
        allowOverlap: true,
        dataSource: [
            { startDate: new Date(currentYear, 2, 6), endDate: new Date(currentYear, 2, 15)}
        ]
    });

    var begin = getDay(2, 2);
    var end = getDay(2, 10);
    triggerEvent(begin, 'mousedown');
    triggerEvent(end, 'mouseenter');

    expect(getDay(2, 5).classList).toContain('range');
    expect(getDay(2, 5).classList).not.toContain('range-end');
    expect(end.classList).toContain('range');
    expect(end.classList).toContain('range-end');
});

test('context menu', () => {
    const calendar = new Calendar('#calendar', {
        enableContextMenu: false,
        contextMenuItems: [
            {
                text: 'Test 1',
                items: [{ text: 'Subtest 1'}] 
            },
            { text: 'Test 2' }
        ],
        dataSource: [
            { name: 'Event 1', startDate: new Date(currentYear, 2, 6), endDate: new Date(currentYear, 2, 15)}
        ]
    });

    var checkContextMenuVisible = () =>
        document.querySelector('.calendar-context-menu')
            && document.querySelector('.calendar-context-menu').style.display == 'block';

    // Context menu not enabled
    triggerEvent(getDay(2, 10), 'contextmenu');
    expect(checkContextMenuVisible()).toBeFalsy();

    calendar.setEnableContextMenu(true);

    // Day with no event
    triggerEvent(getDay(2, 2), 'contextmenu');
    expect(checkContextMenuVisible()).toBeFalsy();

    // Day with events
    triggerEvent(getDay(2, 10), 'contextmenu');
    expect(checkContextMenuVisible()).toBeTruthy();
    expect(document.querySelector('.calendar-context-menu').children.length).toEqual(1);
    expect(document.querySelector('.calendar-context-menu > .item > .content > .text').textContent).toEqual('Event 1');
    expect(document.querySelectorAll('.calendar-context-menu > .item > .submenu > .item').length).toEqual(2);
    expect(document.querySelector('.calendar-context-menu > .item > .submenu > .item:first-child > .content > .text').textContent).toEqual('Test 1');
    expect(document.querySelectorAll('.calendar-context-menu > .item > .submenu > .item:first-child > .submenu > .item').length).toEqual(1);
    expect(document.querySelector('.calendar-context-menu > .item > .submenu > .item:first-child > .submenu > .item > .content > .text').textContent).toEqual('Subtest 1');
    expect(document.querySelector('.calendar-context-menu > .item > .submenu > .item:nth-child(2) > .content > .text').textContent).toEqual('Test 2');
});