require('../dist/js-year-calendar');

// Import all files in the locales folder
require('fs').readdirSync(__dirname + '/../locales/').forEach(function(file) {
    require('../locales/' + file);
});

var languages = Object.keys(Calendar.locales);

test.each(languages)('check locale %s', language => {
    expect(Calendar.locales[language].days.length).toEqual(7);
    expect(Calendar.locales[language].daysShort.length).toEqual(7);
    expect(Calendar.locales[language].daysMin.length).toEqual(7);
    expect(Calendar.locales[language].months.length).toEqual(12);
    expect(Calendar.locales[language].monthsShort.length).toEqual(12);
    expect(Calendar.locales[language].weekShort.length).toBeGreaterThanOrEqual(1)
    expect(Calendar.locales[language].weekShort.length).toBeLessThanOrEqual(2);
    expect(Calendar.locales[language].weekStart).toBeGreaterThanOrEqual(0)
    expect(Calendar.locales[language].weekStart).toBeLessThanOrEqual(6);
});