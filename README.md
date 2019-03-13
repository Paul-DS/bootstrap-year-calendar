# js-year-calendar
A fully customizable year calendar widget

![alt tag](http://www.bootstrap-year-calendar.com/img/calendar.png)

[![CircleCI](https://img.shields.io/circleci/project/github/year-calendar/js-year-calendar/master.svg)](https://circleci.com/gh/year-calendar/js-year-calendar/tree/master)
[![CodeCov](https://img.shields.io/codecov/c/github/year-calendar/js-year-calendar/master.svg)](https://codecov.io/gh/year-calendar/js-year-calendar)

## Requirements

This plugin uses pure javascript. No library is required.
## Installation
You can get the widget using the following methods:
- From the [GitHub repository](https://github.com/year-calendar/js-year-calendar/releases)
- From the Node package manager, using the following command: `npm install js-year-calendar`
- From Yarn, using the following command: `yarn add js-year-calendar`
- From the CDN, by adding the following script directly in your HTML page: `<script src="https://unpkg.com/js-year-calendar@latest/dist/year-calendar.js"></script>`

## Usage

You can create a calendar using the following javascript code :
```
new Calendar('.calendar')
```

Or

```
new Calendar(document.querySelector('.calendar'));
```

Where `.calendar` is the selector of a `DIV` element that should contain your calendar.

You can also use the following HTML if you don't want to use javascript to initialize the calendar
```
<div data-provide="calendar"></div>
```
The calendar will be automatically created when the page will finish loading

## Using options

You can specify options to customize the calendar:
```
new Calendar('.calendar', {
    style: 'background',
    minDate: new Date()
})
```

You can find the exhaustive list of options in the [documentation](/documentation).

## Updating calendar

You can update the calendar after being instantiated:
```
const calendar = new Calendar('.calendar');

calendar.setStyle('background');
calendar.setMaxDate(new Date());
```

You can find the exhaustive list of methods in the [documentation](/documentation).

## Events

You can bind events to the calendar at initialization
```
const calendar = new Calendar('.calendar', {
    clickDay: function(e) {
        alert('Click on day ' + e.date.toString());
    }
});
```

or later

```
new Calendar('.calendar');
document.querySelector('.calendar').addEventListener('clickDay', function(e) {
    alert('Click on day ' + e.date.toString());
});
```

You can find the exhaustive list of events in the [documentation](/documentation).

## Migrating from bootstrap-year-calendar

This widget is based on the [bootstrap-year-calendar](https://github.com/Paul-DS/bootstrap-year-calendar) widget.
If you were using this widget, these are the modifications to apply to successfully migrate your project:

### Initialization

The project doesn't use jQuery anymore, so the initialization of the calendar will be using pure Javascript.

The old code:
```
$('.calendar').calendar({ /* Options */ })
```

Will be replaced by:
```
new Calendar('.calendar', { /* Options */ });
```

Or 

```
new Calendar($('.calendar').get(0), { /* Options */ });
// Use ".get(0)" to get the DOM element from the jQuery element
```

### Get the calendar from the DOM element

Given that the widget doesn't rely on jQuery, it won't be possible to get the calendar instance from the DOM element anymore:
```
$('.calendar').data('calendar').set...();
```

You will have to store the instance of the calendar by yourself:
```
const calendar = new Calendar('.calendar');

...

calendar.set...();
```