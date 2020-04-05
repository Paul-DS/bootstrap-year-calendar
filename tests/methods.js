require('../dist/js-year-calendar');
require('../locales/js-year-calendar.fr');

beforeEach(() => {
    document.body.innerHTML = '<div id="calendar"></div>';
});

const currentYear = new Date().getFullYear();

test('get / set allow overlap method', () => {
    const calendar = new Calendar('#calendar', { allowOverlap: true });
  
    expect(calendar.getAllowOverlap()).toEqual(true);

    calendar.setAllowOverlap(false);
    expect(calendar.getAllowOverlap()).toEqual(false);

    calendar.setAllowOverlap(true);
    expect(calendar.getAllowOverlap()).toEqual(true);
});

test('get / set always half day method', () => {
    const calendar = new Calendar('#calendar', { alwaysHalfDay: true });
  
    expect(calendar.getAlwaysHalfDay()).toEqual(true);

    calendar.setAlwaysHalfDay(false);
    expect(calendar.getAlwaysHalfDay()).toEqual(false);

    calendar.setAlwaysHalfDay(true);
    expect(calendar.getAlwaysHalfDay()).toEqual(true);
});

test('get / set context menu items method', () => {
    const items = [{ name: 'test1'}, { name: 'test2' }];

    const calendar = new Calendar('#calendar', { contextMenuItems: items });
  
    expect(calendar.getContextMenuItems()).toEqual(items);

    calendar.setContextMenuItems([]);
    expect(calendar.getContextMenuItems()).toEqual([]);

    calendar.setContextMenuItems(items);
    expect(calendar.getContextMenuItems()).toEqual(items);
});

test('get / set custom datasource renderer method', () => {
    const customRenderer = () => {};

    const calendar = new Calendar('#calendar', { customDataSourceRenderer: customRenderer });
  
    expect(calendar.getCustomDataSourceRenderer()).toEqual(customRenderer);

    calendar.setCustomDataSourceRenderer(null);
    expect(calendar.getCustomDataSourceRenderer()).toEqual(null);

    calendar.setCustomDataSourceRenderer(customRenderer);
    expect(calendar.getCustomDataSourceRenderer()).toEqual(customRenderer);
});

test('get / set custom day renderer method', () => {
    const customRenderer = () => {};

    const calendar = new Calendar('#calendar', { customDayRenderer: customRenderer });
  
    expect(calendar.getCustomDayRenderer()).toEqual(customRenderer);

    calendar.setCustomDayRenderer(null);
    expect(calendar.getCustomDayRenderer()).toEqual(null);

    calendar.setCustomDayRenderer(customRenderer);
    expect(calendar.getCustomDayRenderer()).toEqual(customRenderer);
});

test('get / set datasource method', () => {
    const items = [{ name: 'test1'}, { name: 'test2' }];

    const calendar = new Calendar('#calendar', { dataSource: items });
  
    expect(calendar.getDataSource()).toEqual(items);

    calendar.setDataSource([]);
    expect(calendar.getDataSource()).toEqual([]);

    calendar.setDataSource(items);
    expect(calendar.getDataSource()).toEqual(items);

    // Dynamic data source
    const dataSource = jest.fn(() => []);
    calendar.setDataSource(dataSource);
    expect(calendar.getDataSource()).toEqual(dataSource);

    expect(dataSource).toHaveBeenCalledTimes(1);
    const endDate = new Date(currentYear + 1, 0, 1);
    endDate.setTime(endDate.getTime() - 1);
    expect(dataSource).toHaveBeenLastCalledWith({ year: currentYear, startDate: new Date(currentYear, 0, 1), endDate });
});

test('get / set disabled days method', () => {
    const items = [new Date(2000, 1, 2), new Date(2020, 5, 8)];

    const calendar = new Calendar('#calendar', { disabledDays: items });
  
    expect(calendar.getDisabledDays()).toEqual(items);

    calendar.setDisabledDays([]);
    expect(calendar.getDisabledDays()).toEqual([]);

    calendar.setDisabledDays(items);
    expect(calendar.getDisabledDays()).toEqual(items);
});

test('get / set disabled week days method', () => {
    const items = [1, 5];

    const calendar = new Calendar('#calendar', { disabledWeekDays: items });
  
    expect(calendar.getDisabledWeekDays()).toEqual(items);

    calendar.setDisabledWeekDays([]);
    expect(calendar.getDisabledWeekDays()).toEqual([]);

    calendar.setDisabledWeekDays(items);
    expect(calendar.getDisabledWeekDays()).toEqual(items);
});

test('get / set display disabled data source method', () => {
    const calendar = new Calendar('#calendar', { displayDisabledDataSource: true });
  
    expect(calendar.getDisplayDisabledDataSource()).toEqual(true);

    calendar.setDisplayDisabledDataSource(false);
    expect(calendar.getDisplayDisabledDataSource()).toEqual(false);

    calendar.setDisplayDisabledDataSource(true);
    expect(calendar.getDisplayDisabledDataSource()).toEqual(true);
});

test('get / set display header method', () => {
    const calendar = new Calendar('#calendar', { displayHeader: true });
  
    expect(calendar.getDisplayHeader()).toEqual(true);

    calendar.setDisplayHeader(false);
    expect(calendar.getDisplayHeader()).toEqual(false);

    calendar.setDisplayHeader(true);
    expect(calendar.getDisplayHeader()).toEqual(true);
});

test('get / set display week number method', () => {
    const calendar = new Calendar('#calendar', { displayWeekNumber: true });
  
    expect(calendar.getDisplayWeekNumber()).toEqual(true);

    calendar.setDisplayWeekNumber(false);
    expect(calendar.getDisplayWeekNumber()).toEqual(false);

    calendar.setDisplayWeekNumber(true);
    expect(calendar.getDisplayWeekNumber()).toEqual(true);
});

test('get / set enable context menu method', () => {
    const calendar = new Calendar('#calendar', { enableContextMenu: true });
  
    expect(calendar.getEnableContextMenu()).toEqual(true);

    calendar.setEnableContextMenu(false);
    expect(calendar.getEnableContextMenu()).toEqual(false);

    calendar.setEnableContextMenu(true);
    expect(calendar.getEnableContextMenu()).toEqual(true);
});

test('get / set enable range selection method', () => {
    const calendar = new Calendar('#calendar', { enableRangeSelection: true });
  
    expect(calendar.getEnableRangeSelection()).toEqual(true);

    calendar.setEnableRangeSelection(false);
    expect(calendar.getEnableRangeSelection()).toEqual(false);

    calendar.setEnableRangeSelection(true);
    expect(calendar.getEnableRangeSelection()).toEqual(true);
});

test('get events method', () => {
    const calendar = new Calendar('#calendar', {
        dataSource: [
			{
				startDate: new Date(currentYear, 6, 10),
				endDate: new Date(currentYear, 6, 20)
            },
            {
				startDate: new Date(currentYear, 6, 19),
				endDate: new Date(currentYear, 6, 20)
            },
            {
				startDate: new Date(currentYear, 6, 20),
				endDate: new Date(currentYear, 6, 20)
			}
		]
    });
  
    expect(calendar.getEvents(new Date(currentYear, 6, 9)).length).toEqual(0);
    expect(calendar.getEvents(new Date(currentYear, 6, 18)).length).toEqual(1);
    expect(calendar.getEvents(new Date(currentYear, 6, 19)).length).toEqual(2);
    expect(calendar.getEvents(new Date(currentYear, 6, 20)).length).toEqual(3);
});

test('get events on range method', () => {
    const calendar = new Calendar('#calendar', {
        dataSource: [
			{
				startDate: new Date(currentYear, 6, 10),
				endDate: new Date(currentYear, 6, 15)
            },
            {
				startDate: new Date(currentYear, 6, 20),
				endDate: new Date(currentYear, 6, 22)
            },
            {
				startDate: new Date(currentYear, 6, 25),
				endDate: new Date(currentYear, 6, 27)
			}
		]
    });
  
    expect(calendar.getEventsOnRange(new Date(currentYear, 6, 5), new Date(currentYear, 6, 8)).length).toEqual(0);
    expect(calendar.getEventsOnRange(new Date(currentYear, 6, 8), new Date(currentYear, 6, 12)).length).toEqual(1);
    expect(calendar.getEventsOnRange(new Date(currentYear, 6, 8), new Date(currentYear, 6, 18)).length).toEqual(1);
    expect(calendar.getEventsOnRange(new Date(currentYear, 6, 8), new Date(currentYear, 6, 20, 1)).length).toEqual(2);
    expect(calendar.getEventsOnRange(new Date(currentYear, 6, 8), new Date(currentYear, 7, 1)).length).toEqual(3);
});

test('get / set hidden week days method', () => {
    const items = [1, 5];

    const calendar = new Calendar('#calendar', { hiddenWeekDays: items });
  
    expect(calendar.getHiddenWeekDays()).toEqual(items);

    calendar.setHiddenWeekDays([]);
    expect(calendar.getHiddenWeekDays()).toEqual([]);

    calendar.setHiddenWeekDays(items);
    expect(calendar.getHiddenWeekDays()).toEqual(items);
});

test('get / set language method', () => {
    const calendar = new Calendar('#calendar', { language: 'fr' });
  
    expect(calendar.getLanguage()).toEqual('fr');

    calendar.setLanguage('en');
    expect(calendar.getLanguage()).toEqual('en');

    // Non existent language, should keep english
    calendar.setLanguage('zz');
    expect(calendar.getLanguage()).toEqual('en');
});

test('get / set loading template method', () => {
    const calendar = new Calendar('#calendar', { loadingTemplate: 'Test' });
  
    expect(calendar.getLoadingTemplate()).toEqual('Test');

    calendar.setLoadingTemplate(null);
    expect(calendar.getLoadingTemplate()).toBeNull;

    calendar.setLoadingTemplate('Test 2');
    expect(calendar.getLoadingTemplate()).toEqual('Test 2');
});

test('get / set max date method', () => {
    const date = new Date(2010, 2, 5);
    const calendar = new Calendar('#calendar', { maxDate: date });
  
    expect(calendar.getMaxDate()).toEqual(date);

    calendar.setMaxDate(null);
    expect(calendar.getMaxDate()).toEqual(null);

    calendar.setMaxDate(date);
    expect(calendar.getMaxDate()).toEqual(date);
});

test('get / set min date method', () => {
    const date = new Date(2010, 2, 5);
    const calendar = new Calendar('#calendar', { minDate: date });
  
    expect(calendar.getMinDate()).toEqual(date);

    calendar.setMinDate(null);
    expect(calendar.getMinDate()).toEqual(null);

    calendar.setMinDate(date);
    expect(calendar.getMinDate()).toEqual(date);
});

test('get / set round range limits method', () => {
    const calendar = new Calendar('#calendar', { roundRangeLimits: true });
  
    expect(calendar.getRoundRangeLimits()).toEqual(true);

    calendar.setRoundRangeLimits(false);
    expect(calendar.getRoundRangeLimits()).toEqual(false);

    calendar.setRoundRangeLimits(true);
    expect(calendar.getRoundRangeLimits()).toEqual(true);
});

test('get / set style method', () => {
    const calendar = new Calendar('#calendar', { style: 'custom' });
  
    expect(calendar.getStyle()).toEqual('custom');

    calendar.setStyle('background');
    expect(calendar.getStyle()).toEqual('background');

    // Invalid style
    calendar.setStyle('test');
    expect(calendar.getStyle()).toEqual('border');

    // Invalid style
    calendar.setStyle(1);
    expect(calendar.getStyle()).toEqual('border');
});

test('get week number method', () => {
    const calendar = new Calendar('#calendar');
  
    expect(calendar.getWeekNumber(new Date(2000, 0, 1))).toEqual(52);
    expect(calendar.getWeekNumber(new Date(2000, 0, 5))).toEqual(1);
});

test('get / set week start method', () => {
    const calendar = new Calendar('#calendar', { weekStart: 5 });
  
    expect(calendar.getWeekStart()).toEqual(5);

    calendar.setWeekStart(2);
    expect(calendar.getWeekStart()).toEqual(2);

    calendar.setWeekStart(null);
    expect(calendar.getWeekStart()).toEqual(0);

    calendar.setLanguage('fr');
    expect(calendar.getWeekStart()).toEqual(1); // By default, it will take the week start of the current locale
});

test('get / set year method', () => {
    const calendar = new Calendar('#calendar', { startYear: 2000 });
  
    expect(calendar.getYear()).toEqual(2000);

    calendar.setYear(2010);
    expect(calendar.getYear()).toEqual(2010);

    calendar.setYear('test');
    expect(calendar.getYear()).toEqual(2010);
});

test('add events method', () => {
    const calendar = new Calendar('#calendar', {
        dataSource: [
			{
				startDate: new Date(currentYear, 6, 10),
				endDate: new Date(currentYear, 6, 20)
            }
		]
    });
  
    calendar.addEvent({ startDate: new Date(currentYear, 7, 1), endDate: new Date(currentYear, 8, 1) });
    expect(calendar.getDataSource().length).toEqual(2);
});