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