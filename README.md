# bootstrap-year-calendar
A fully customizable year calendar widget, for boostrap !
You can find all details on the [official website](http://www.bootstrap-year-calendar.com/).


![alt tag](http://www.bootstrap-year-calendar.com/img/calendar.png)

## Requirements

This plugin requires the following libraries :
- Bootstrap v3.0.0 or later
- jQuery v1.8.0 or later

## Installation
You can get the widget using the following methods:
- From the [GitHub repository](https://github.com/Paul-DS/bootstrap-year-calendar/releases) or the [official website](http://www.bootstrap-year-calendar.com/#Download).
- From the Node package manager, using the following command: `npm install bootstrap-year-calendar`
- From Bower, using the following command: `bower install bootstrap-year-calendar`

## Usage

### jQuery

You can create a calendar using the following javascript code :
```
$('.calendar').calendar()
```
or
```
$('.calendar').calendar(options)
```
or with the `data-provide` html attribute 
```
<div data-provide="calendar"></div>
```

### TypeScript
- Include the typings file from *typescript* folder into your typings directory (ex. MyProject\typings\globals\bootstrap-year-calendar.d.ts)
- Modify your typings file index.d.ts to include it (ex. MyProject\typings\index.d.ts)
```
/// <reference path="globals/jquery/jquery.d.ts" />
/// <reference path="globals/bootstrap-year-calendar/bootstrap-year-calendar.d.ts" />
```
- Import the module and use the classes in your app (ex. app.component.ts)
```
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BaseCalendar } from 'bootstrap-year-calendar';

declare let $: JQueryStatic;

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `<div #calendarTS></div>`
})
export class AppComponent implements AfterViewInit {
  @ViewChild('calendarTS') calendar: ElementRef;

  ngAfterViewInit(): void {
    let currentYear = new Date().getFullYear();

    $(this.calendar.nativeElement).calendar({
      enabledDays: [
        new Date(currentYear, 1, 2),
        new Date(currentYear, 1, 3),
        new Date(currentYear, 1, 8),
        new Date(currentYear, 1, 9)
        ]
    });
    
    let calendar: BaseCalendar = $(this.calendar.nativeElement).data('calendar');

    if (calendar) {
      calendar.setYear(2016);
    }
  }
}
```