require('../dist/js-year-calendar');
require('../locales/js-year-calendar.fr');

beforeEach(() => {
    document.body.innerHTML = '<div id="calendar"></div>';
});

const getDay = (month, day) => {
    return document.querySelectorAll(`#calendar .month-container:nth-child(${month + 1}) .day:not(.old):not(.new)`)[day - 1];
};

const currentYear = new Date().getFullYear();

test('instantiate calendar with element', () => {
    const calendar = new Calendar(document.querySelector('#calendar'));
  
    expect(document.querySelector('#calendar').children.length).toEqual(2);

    // Header
    expect(document.querySelector('#calendar .calendar-header')).not.toBeNull();
    expect(document.querySelector('#calendar .calendar-header .prev')).not.toBeNull();
    expect(document.querySelector('#calendar .calendar-header .next')).not.toBeNull();
    expect(document.querySelectorAll('#calendar .year-neighbor').length).toEqual(2);
    expect(document.querySelectorAll('#calendar .year-neighbor2').length).toEqual(2);
    expect(document.querySelector('#calendar .year-title:not(.year-neighbor):not(.year-neighbor2').textContent).toEqual(currentYear.toString());

    // Body
    expect(document.querySelector('#calendar .months-container')).not.toBeNull();
    expect(document.querySelector('#calendar .months-container').children.length).toEqual(12);

    const currentDate = new Date();
    currentDate.setMonth(0);
    currentDate.setDate(1);

    while (currentDate.getFullYear() == currentYear) {
        expect(getDay(currentDate.getMonth(), currentDate.getDate()).textContent).toEqual(currentDate.getDate().toString());
        currentDate.setDate(currentDate.getDate() + 1);
    }
});

test('instantiate calendar with selector', () => {
    const calendar = new Calendar('#calendar');
  
    expect(document.querySelector('#calendar').children.length).toEqual(2);
});

test('instantiate calendar with other', () => {
    expect(() => new Calendar(null)).toThrow();
});

test('instantiate calendar with start date', () => {
    const calendar = new Calendar('#calendar', { startDate: new Date(2000, 5, 1) });
  
    expect(document.querySelectorAll('#calendar .year-title').length).toEqual(1);
    expect(document.querySelector('#calendar .year-title').textContent).toEqual("2000 - 2001");
    expect(document.querySelectorAll('#calendar .month').length).toEqual(12);
});

test('instantiate calendar with start date and number months displayed', () => {
    const calendar = new Calendar('#calendar', { startDate: new Date(2000, 10, 1), numberMonthsDisplayed: 3 });
  
    expect(document.querySelectorAll('#calendar .year-title').length).toEqual(1);
    expect(document.querySelector('#calendar .year-title').textContent).toEqual("November 2000 - January 2001");
    expect(document.querySelectorAll('#calendar .month').length).toEqual(3);
});

test('instantiate calendar with start date and single month displayed', () => {
    const calendar = new Calendar('#calendar', { startDate: new Date(2000, 5, 1), numberMonthsDisplayed: 1 });
  
    expect(document.querySelectorAll('#calendar .year-title').length).toEqual(1);
    expect(document.querySelector('#calendar .year-title').textContent).toEqual("June 2000");
    expect(document.querySelectorAll('#calendar .month').length).toEqual(1);
});

test('instantiate calendar with start year', () => {
    const calendar = new Calendar('#calendar', { startYear: 2000 });
  
    expect(document.querySelectorAll('#calendar .year-title').length).toEqual(5);
    expect(document.querySelector('#calendar .year-title:not(.year-neighbor):not(.year-neighbor2').textContent).toEqual("2000");
    expect(document.querySelectorAll('#calendar .month').length).toEqual(12);
});

test('instantiate calendar with min date', () => {
    const calendar = new Calendar('#calendar', { minDate: new Date(currentYear, 2, 5) });
  
    expect(Array.from(getDay(2, 4).classList)).toContain('disabled');
    expect(Array.from(getDay(2, 5).classList)).not.toContain('disabled');

    calendar.setYear(currentYear - 1);

    expect(Array.from(getDay(0, 1).classList)).toContain('disabled');
    expect(Array.from(getDay(11, 31).classList)).toContain('disabled');

    calendar.setYear(currentYear + 1);

    expect(Array.from(getDay(0, 1).classList)).not.toContain('disabled');
    expect(Array.from(getDay(11, 31).classList)).not.toContain('disabled');
});

test('instantiate calendar with max date', () => {
    const calendar = new Calendar('#calendar', { maxDate: new Date(currentYear, 7, 18) });
  
    expect(Array.from(getDay(7, 18).classList)).not.toContain('disabled');
    expect(Array.from(getDay(7, 19).classList)).toContain('disabled');

    calendar.setYear(currentYear - 1);

    expect(Array.from(getDay(0, 1).classList)).not.toContain('disabled');
    expect(Array.from(getDay(11, 31).classList)).not.toContain('disabled');

    calendar.setYear(currentYear + 1);

    expect(Array.from(getDay(0, 1).classList)).toContain('disabled');
    expect(Array.from(getDay(11, 31).classList)).toContain('disabled');
});

test('instantiate calendar with language', () => {
    const calendar = new Calendar('#calendar', { language: 'fr' });
  
    expect(document.querySelector('.month-container:first-child .month-title').textContent).toEqual("Janvier");
    expect(document.querySelectorAll('.month-container:first-child .day-header')[0].textContent).toEqual("L");
});

test('instantiate calendar with default style', () => {
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

    expect(getDay(6, 9).style.boxShadow).toBeFalsy();

    for (let i = 10; i <= 18; i++) {
        expect(getDay(6, i).style.boxShadow).toBeTruthy();
        expect(getDay(6, i).style.boxShadow.split(',').length).toEqual(1);
    }

    expect(getDay(6, 19).style.boxShadow).toBeTruthy();
    expect(getDay(6, 19).style.boxShadow.split(',').length).toEqual(2);

    expect(getDay(6, 20).style.boxShadow).toBeTruthy();
    expect(getDay(6, 20).style.boxShadow.split(',').length).toEqual(3);

    expect(getDay(6, 21).style.boxShadow).toBeFalsy();
});

test('instantiate calendar with background style', () => {
    const calendar = new Calendar('#calendar', {
		style: 'background',
		dataSource: [
			{
				startDate: new Date(currentYear, 6, 10),
				endDate: new Date(currentYear, 6, 20)
			}
		]
    });

    expect(getDay(6, 9).style.backgroundColor).toBeFalsy();

    for (let i = 10; i <= 20; i++) {
        expect(getDay(6, i).style.backgroundColor).toBeTruthy();
    }

    expect(getDay(6, 21).style.backgroundColor).toBeFalsy();
});

test('instantiate calendar with no header', () => {
    const calendar = new Calendar('#calendar', { displayHeader: false });

    expect(document.querySelector('#calendar').children.length).toEqual(1);
    expect(Array.from(document.querySelector('#calendar').children[0].classList)).toContain('months-container');
});

test('instantiate calendar with week numbers', () => {
    const calendar = new Calendar('#calendar', { displayWeekNumber: true });

    expect(document.querySelector('.month-container:first-child .week-number').textContent).toEqual("W");

    document.querySelectorAll('.month-container tr:not(:first-child)').forEach(tr => {
        expect(tr.children.length).toEqual(8);
    })
});

test('instantiate calendar with round limits', () => {
    const calendar = new Calendar('#calendar', {
        style: 'background',
        roundRangeLimits: true,
		dataSource: [
			{
				startDate: new Date(currentYear, 6, 10),
				endDate: new Date(currentYear, 6, 20)
			}
		]
    });

    expect(Array.from(getDay(6, 10).classList)).toContain("round-left");
    expect(Array.from(getDay(6, 20).classList)).toContain("round-right");
});

test('instantiate calendar with disable days', () => {
    const calendar = new Calendar('#calendar', {
		disabledDays: [
            new Date(currentYear, 4, 1),
            new Date(currentYear, 5, 1)
        ]
    });

    expect(Array.from(getDay(4, 1).classList)).toContain("disabled");
    expect(Array.from(getDay(4, 2).classList)).not.toContain("disabled");

    expect(Array.from(getDay(5, 1).classList)).toContain("disabled");
    expect(Array.from(getDay(5, 2).classList)).not.toContain("disabled");
});

test('instantiate calendar with disabled week days', () => {
    const calendar = new Calendar('#calendar', {
		disabledWeekDays: [1, 3, 5]
    });
    
    const currentDate = new Date();
    currentDate.setMonth(0);
    currentDate.setDate(1);

    while (currentDate.getFullYear() == currentYear) {
        var check = expect(Array.from(getDay(currentDate.getMonth(), currentDate.getDate()).classList));

        if (currentDate.getDay() == 1 || currentDate.getDay() == 3 || currentDate.getDay() == 5) {
            check.toContain('disabled');
        }
        else {
            check.not.toContain('disabled');
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }
});

test('instantiate calendar with hidden week days', () => {
    const calendar = new Calendar('#calendar', {
		hiddenWeekDays: [0, 2, 4]
    });
    
    const currentDate = new Date();
    currentDate.setMonth(0);
    currentDate.setDate(1);

    while (currentDate.getFullYear() == currentYear) {
        var check = expect(Array.from(getDay(currentDate.getMonth(), currentDate.getDate()).classList));

        if (currentDate.getDay() == 0 || currentDate.getDay() == 2 || currentDate.getDay() == 4) {
            check.toContain('hidden');
        }
        else {
            check.not.toContain('hidden');
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }
});

test('instantiate calendar with display disabled data source', () => {
    const calendar = new Calendar('#calendar', {
        style: 'background',
        disabledDays: [new Date(currentYear, 6, 15)],
        displayDisabledDataSource: true,
		dataSource: [
			{
				startDate: new Date(currentYear, 6, 10),
				endDate: new Date(currentYear, 6, 20)
			}
		]
    });
    
    expect(getDay(6, 14).style.backgroundColor).toBeTruthy();
    expect(getDay(6, 15).style.backgroundColor).toBeTruthy();

    calendar.setDisplayDisabledDataSource(false);

    expect(getDay(6, 14).style.backgroundColor).toBeTruthy();
    expect(getDay(6, 15).style.backgroundColor).toBeFalsy();
});

test('instantiate calendar with data source function', () => {
    const dataSource = jest.fn(period => [
        {
            startDate: new Date(period.year, 6, period.year - 2000),
            endDate: new Date(period.year, 6, period.year - 2000)
        }
    ]);

    const calendar = new Calendar('#calendar', {
        startYear: 2001,
		dataSource: dataSource
    });
    
    expect(dataSource).toHaveBeenCalledTimes(1);
    
    let endDate = new Date(2002, 0, 1);
    endDate.setTime(endDate.getTime() - 1);
    expect(dataSource).toHaveBeenLastCalledWith({ year: 2001, startDate: new Date(2001, 0, 1), endDate });
    expect(getDay(6, 1).style.boxShadow).toBeTruthy();
    expect(getDay(6, 2).style.boxShadow).toBeFalsy();
    
    calendar.setYear(2002);
    expect(dataSource).toHaveBeenCalledTimes(2);
    endDate.setFullYear(2002);
    expect(dataSource).toHaveBeenLastCalledWith({ year: 2002, startDate: new Date(2002, 0, 1), endDate });
    expect(getDay(6, 1).style.boxShadow).toBeFalsy();
    expect(getDay(6, 2).style.boxShadow).toBeTruthy();
});

test('instantiate calendar with data source function and custom period', () => {
    const dataSource = jest.fn(period => [
        {
            startDate: new Date(period.startDate.getFullYear(), period.startDate.getMonth(), period.startDate.getMonth()),
            endDate: new Date(period.startDate.getFullYear(), period.startDate.getMonth(), period.startDate.getMonth()),
        }
    ]);

    const calendar = new Calendar('#calendar', {
        startDate: new Date(2001, 2, 1),
        numberMonthsDisplayed: 2,
		dataSource: dataSource
    });
    
    expect(dataSource).toHaveBeenCalledTimes(1);
    
    let endDate = new Date(2001, 4, 1);
    endDate.setTime(endDate.getTime() - 1);
    expect(dataSource).toHaveBeenLastCalledWith({ year: 2001, startDate: new Date(2001, 2, 1), endDate });
    expect(getDay(0, 2).style.boxShadow).toBeTruthy();
    expect(getDay(0, 6).style.boxShadow).toBeFalsy();
    
    calendar.setStartDate(new Date(2001, 6, 1));
    expect(dataSource).toHaveBeenCalledTimes(2);
    endDate = new Date(2001, 8, 1);
    endDate.setTime(endDate.getTime() - 1);
    expect(dataSource).toHaveBeenLastCalledWith({ year: 2001, startDate: new Date(2001, 6, 1), endDate });
    expect(getDay(0, 2).style.boxShadow).toBeFalsy();
    expect(getDay(0, 6).style.boxShadow).toBeTruthy();
});

test('instantiate calendar with data source callback function', () => {
    const dataSource = jest.fn((period, callback) => {
        callback([
            {
                startDate: new Date(period.year, 6, period.year - 2000),
                endDate: new Date(period.year, 6, period.year - 2000)
            }
        ]);
    });

    const calendar = new Calendar('#calendar', {
        startYear: 2001,
		dataSource: dataSource
    });
    
    expect(dataSource).toHaveBeenCalledTimes(1);
    expect(getDay(6, 1).style.boxShadow).toBeTruthy();
    expect(getDay(6, 2).style.boxShadow).toBeFalsy();
    
    calendar.setYear(2002);
    expect(dataSource).toHaveBeenCalledTimes(2);
    expect(getDay(6, 1).style.boxShadow).toBeFalsy();
    expect(getDay(6, 2).style.boxShadow).toBeTruthy();
});

test('instantiate calendar with data source promise function', done => {
    const dataSource = jest.fn(period => new Promise((resolve, reject) => {
        resolve([
            {
                startDate: new Date(period.year, 6, period.year - 2000),
                endDate: new Date(period.year, 6, period.year - 2000)
            }
        ]);
    }));

    const calendar = new Calendar('#calendar', {
        startYear: 2001,
		dataSource: dataSource
    });

    expect(dataSource).toHaveBeenCalledTimes(1);
    const endDate = new Date(2002, 0, 1);
    endDate.setTime(endDate.getTime() - 1);
    expect(dataSource).toHaveBeenLastCalledWith({ year: 2001, startDate: new Date(2001, 0, 1), endDate });

    setTimeout(() => {
        expect(getDay(6, 1).style.boxShadow).toBeTruthy();
        expect(getDay(6, 2).style.boxShadow).toBeFalsy();
        
        calendar.setYear(2002);
        expect(dataSource).toHaveBeenCalledTimes(2);
        endDate.setFullYear(2002);
        expect(dataSource).toHaveBeenLastCalledWith({ year: 2002, startDate: new Date(2002, 0, 1), endDate });

        setTimeout(() => {
            expect(getDay(6, 1).style.boxShadow).toBeFalsy();
            expect(getDay(6, 2).style.boxShadow).toBeTruthy();
            done();
        }, 0);
    }, 0);
});