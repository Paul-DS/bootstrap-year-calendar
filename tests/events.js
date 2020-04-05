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

const testDayEvent = (eventName, eventToTrigger) => {
    const simplifyEventsParams = e => ({ calendar: e.calendar, date: e.date, eltId: e.element.id, events: e.events.map(ev => ev.name) });

    const eventInit = jest.fn(simplifyEventsParams);
    const eventAdded = jest.fn(simplifyEventsParams);

    document.querySelector('#calendar').addEventListener(eventName, eventAdded);

    const calendar = new Calendar('#calendar', {
        [eventName]: eventInit,
        dataSource: [
            {
                name: "test1",
                startDate: new Date(currentYear, 6, 10),
                endDate: new Date(currentYear, 6, 20)
            },
            {
                name: "test2",
                startDate: new Date(currentYear, 7, 10),
                endDate: new Date(currentYear, 7, 20)
            }
        ]
    });

    let dayElt = getDay(6, 8);
    dayElt.id = "test1";
    triggerEvent(dayElt, eventToTrigger);
    expect(eventInit).toHaveNthReturnedWith(1, { calendar, date: new Date(currentYear, 6, 8), eltId: "test1", events: [] });
    expect(eventAdded).toHaveNthReturnedWith(1, { calendar,date: new Date(currentYear, 6, 8), eltId: "test1", events: [] });

    dayElt = getDay(6, 12);
    dayElt.id = "test2";
    triggerEvent(dayElt, eventToTrigger);
    expect(eventInit).toHaveNthReturnedWith(2, { calendar, date: new Date(currentYear, 6, 12), eltId: "test2", events: ['test1'] });
    expect(eventAdded).toHaveNthReturnedWith(2, { calendar, date: new Date(currentYear, 6, 12), eltId: "test2", events: ['test1'] });
};

test('click day event', () => {
    testDayEvent('clickDay', 'click');
});

test('day context menu event', () => {
    testDayEvent('dayContextMenu', 'contextmenu');
});

test('mouse on day event', () => {
    testDayEvent('mouseOnDay', 'mouseenter');
});

test('mouse out day event', () => {
    testDayEvent('mouseOutDay', 'mouseleave');
});

test('render end event', () => {
    const renderEndInit = jest.fn(e => ({ calendar: e.calendar, currentYear: e.currentYear, startDate: e.startDate, endDate: e.endDate }));
    const renderEndAdded = jest.fn(e => ({ calendar: e.calendar, currentYear: e.currentYear, startDate: e.startDate, endDate: e.endDate }));

    document.querySelector('#calendar').addEventListener('renderEnd', renderEndAdded);
    const calendar = new Calendar('#calendar', { renderEnd: renderEndInit });

    calendar.setYear(2000);

    let endDate = new Date(currentYear + 1, 0, 1);
    endDate.setTime(endDate.getTime() - 1);
    expect(renderEndInit).toHaveNthReturnedWith(1, { calendar, currentYear, startDate: new Date(currentYear, 0, 1), endDate: endDate });
    expect(renderEndAdded).toHaveNthReturnedWith(1, { calendar, currentYear, startDate: new Date(currentYear, 0, 1), endDate: endDate });

    endDate = new Date(2001, 0, 1);
    endDate.setTime(endDate.getTime() - 1);
    expect(renderEndInit).toHaveNthReturnedWith(2, { calendar, currentYear: 2000, startDate: new Date(2000, 0, 1), endDate: endDate });
    expect(renderEndAdded).toHaveNthReturnedWith(2, { calendar, currentYear: 2000, startDate: new Date(2000, 0, 1), endDate: endDate });
});


test('select range event', () => {
    const selectRangeInit = jest.fn(e => ({ calendar: e.calendar, startDate: e.startDate, endDate: e.endDate }));
    const selectRangeAdded = jest.fn(e => ({ calendar: e.calendar, startDate: e.startDate, endDate: e.endDate }));

    document.querySelector('#calendar').addEventListener('selectRange', selectRangeAdded);
    const calendar = new Calendar('#calendar', { enableRangeSelection: true, selectRange: selectRangeInit });

    triggerEvent(getDay(8, 10), "mousedown");
    triggerEvent(getDay(9, 20), "mouseenter");
    triggerEvent(getDay(9, 20), "mouseup");

    expect(selectRangeInit).toHaveNthReturnedWith(1, { calendar, startDate: new Date(currentYear, 8, 10), endDate: new Date(currentYear, 9, 20) });
    expect(selectRangeAdded).toHaveNthReturnedWith(1, { calendar, startDate: new Date(currentYear, 8, 10), endDate: new Date(currentYear, 9, 20) });
});

test('year changed event', () => {
    const yearChangedInit = jest.fn(e => ({ calendar: e.calendar, currentYear: e.currentYear }));
    const yearChangedAdded = jest.fn(e =>  ({ calendar: e.calendar, currentYear: e.currentYear }));

    document.querySelector('#calendar').addEventListener('yearChanged', yearChangedAdded);
    const calendar = new Calendar(document.querySelector('#calendar'), { yearChanged: yearChangedInit });

    calendar.setYear(2000);

    expect(yearChangedInit).toHaveNthReturnedWith(1, { calendar, currentYear });
    expect(yearChangedAdded).toHaveNthReturnedWith(1, { calendar, currentYear });

    expect(yearChangedInit).toHaveNthReturnedWith(2, { calendar, currentYear: 2000 });
    expect(yearChangedAdded).toHaveNthReturnedWith(2, { calendar, currentYear: 2000 });
});