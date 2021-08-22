/* =========================================================
 * JS year calendar v1.0.0
 * Repo: https://github.com/year-calendar/js-year-calendar
 * =========================================================
 * Created by Paul David-Sivelle
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

import CalendarContextMenuItem from './interfaces/CalendarContextMenuItem';
import CalendarDataSourceElement from './interfaces/CalendarDataSourceElement';
import CalendarOptions from './interfaces/CalendarOptions';
import CalendarYearChangedEventObject from './interfaces/CalendarYearChangedEventObject';
import CalendarPeriodChangedEventObject from './interfaces/CalendarPeriodChangedEventObject';
import CalendarDayEventObject from './interfaces/CalendarDayEventObject';
import CalendarRenderEndEventObject from './interfaces/CalendarRenderEndEventObject';
import CalendarRangeEventObject from './interfaces/CalendarRangeEventObject';

// NodeList forEach() polyfill
if (typeof NodeList !== "undefined" && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}

// Element closest() polyfill
if (typeof Element !== "undefined" && !Element.prototype.matches) {
	const prototype:any = Element.prototype;
    Element.prototype.matches = prototype.msMatchesSelector || prototype.webkitMatchesSelector;
}

if (typeof Element !== "undefined" && !Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType == 1); 
        return null;
	};
}

/**
 * Calendar instance.
 */
export default class Calendar<T extends CalendarDataSourceElement> {
	protected element: HTMLElement;
	protected options: CalendarOptions<T>;
	protected _startDate: Date;
	protected _dataSource: T[];
	protected _mouseDown: boolean;
	protected _rangeStart: Date;
	protected _rangeEnd: Date;
	protected _responsiveInterval: any;
	protected _nbCols: number;

	protected static locales = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			weekShort: 'W',
			weekStart:0
		}
	};

	protected static colors = ['#2C8FC9', '#9CB703', '#F5BB00', '#FF4A32', '#B56CE2', '#45A597'];

	/**
	 * Fired when a day is clicked.
	 * @event
	 * @example
	 * ```
	 * 
	 * document.querySelector('.calendar').addEventListener('clickDay', function(e) {
	 *   console.log("Click on day: " + e.date + " (" + e.events.length + " events)");
	 * })
	 * ```
	 */
	public clickDay: CalendarDayEventObject<T>;
	
	/**
	 * Fired when a day is right clicked.
	 * @event
	 * @example
	 * ```
	 * 
	 * document.querySelector('.calendar').addEventListener('clickDay', function(e) {
	 *   console.log("Right click on day: " + e.date + " (" + e.events.length + " events)");
	 * })
	 * ```
	 */
	public dayContextMenu: CalendarDayEventObject<T>;
	
	/**
	 * Fired when the mouse enter in a day.
	 * @event
	 * @example
	 * ```
	 * 
	 * document.querySelector('.calendar').addEventListener('mouseOnDay', function(e) {
	 *   console.log("Mouse enter in a day: " + e.date + " (" + e.events.length + " events)");
	 * })
	 * ```
	 */
	public mouseOnDay: CalendarDayEventObject<T>;
	
	/**
	 * Fired when the mouse leave a day.
	 * @event
	 * @example
	 * ```
	 * 
	 * document.querySelector('.calendar').addEventListener('mouseOutDay', function(e) {
	 *   console.log("Mouse leave a day: " + e.date + " (" + e.events.length + " events)");
	 * })
	 * ```
	 */
	public mouseOutDay: CalendarDayEventObject<T>;
	
	/**
	 * Fired when the calendar rendering is ended.
	 * @event
	 * @example
	 * ```
	 * 
	 * document.querySelector('.calendar').addEventListener('renderEnd', function(e) {
	 *   console.log("Render end for year: " + e.currentYear);
	 * })
	 * ```
	 */
	public renderEnd: CalendarRenderEndEventObject;
	
	/**
	 * Fired when a date range is selected.
	 * 
	 * Don't forget to enable the `enableRangeSelection` option to be able to use the range selection functionality.
	 * @event
	 * @example
	 * ```
	 * 
	 * document.querySelector('.calendar').addEventListener('selectRange', function(e) {
	 *   console.log("Select the range: " + e.startDate + " - " + e.endDate);
	 * })
	 * ```
	 */
	public selectRange: CalendarRangeEventObject;	
	
	/**
	 * Triggered after the changing the current year.
	 * Works only if the calendar is used in a full year mode. Otherwise, use `periodChanged` event.
	 * @event
	 * @example
	 * ```
	 * 
	 * document.querySelector('.calendar').addEventListener('yearChanged', function(e) {
	 *   console.log("New year selected: " + e.currentYear);
	 * })
	 * ```
	 */
	public yearChanged: CalendarYearChangedEventObject;
	
	/**
	 * Triggered after the changing the visible period.
	 * @event
	 * @example
	 * ```
	 * 
	 * document.querySelector('.calendar').addEventListener('periodChanged', function(e) {
	 *   console.log(`New period selected: ${e.startDate} ${e.endDate}`);
	 * })
	 * ```
	 */
	public periodChanged: CalendarPeriodChangedEventObject;
	
	/**
	 * Create a new calendar.
	 * @param element The element (or the selector to an element) in which the calendar should be created.
	 * @param options [Optional] The options used to customize the calendar
	 */
	constructor(element: HTMLElement|string, options: CalendarOptions<T> = null) {
		if (element instanceof HTMLElement) {
			this.element = element;
		}
		else if (typeof element === "string") {
			this.element = document.querySelector(element);
		}
		else {
			throw new Error("The element parameter should be a DOM node or a selector");
		}

		this.element.classList.add('calendar');
		
		this._initializeEvents(options);
		this._initializeOptions(options);

		let startYear = new Date().getFullYear();
		let startMonth = 0;

		if (this.options.startDate) {
			startYear = this.options.startDate.getFullYear();
			startMonth = this.options.startDate.getMonth();
		}
		else if (this.options.startYear) {
			startYear = this.options.startYear;
		}

		this.setStartDate(new Date(startYear, startMonth, 1));
	}
	
	protected _initializeOptions(opt: any): void {
		if (opt == null) {
			opt = {};
		}
	
		this.options = {
			startYear: !isNaN(parseInt(opt.startYear)) ? parseInt(opt.startYear) : null,
			startDate: opt.startDate instanceof Date ? opt.startDate : null,
			numberMonthsDisplayed: !isNaN(parseInt(opt.numberMonthsDisplayed)) && opt.numberMonthsDisplayed > 0 && opt.numberMonthsDisplayed <= 12 ? parseInt(opt.numberMonthsDisplayed) : 12,
			minDate: opt.minDate instanceof Date ? opt.minDate : null,
			maxDate: opt.maxDate instanceof Date ? opt.maxDate : null,
			language: (opt.language != null && Calendar.locales[opt.language] != null) ? opt.language : 'en',
			allowOverlap: opt.allowOverlap != null ? opt.allowOverlap : true,
			displayWeekNumber: opt.displayWeekNumber != null ? opt.displayWeekNumber : false,
			displayDisabledDataSource: opt.displayDisabledDataSource != null ? opt.displayDisabledDataSource : false,
			displayHeader: opt.displayHeader != null ? opt.displayHeader : true,
			alwaysHalfDay: opt.alwaysHalfDay != null ? opt.alwaysHalfDay : false,
			enableRangeSelection: opt.enableRangeSelection != null ? opt.enableRangeSelection : false,
			disabledDays: opt.disabledDays instanceof Array ? opt.disabledDays : [],
			disabledWeekDays: opt.disabledWeekDays instanceof Array ? opt.disabledWeekDays : [],
			hiddenWeekDays: opt.hiddenWeekDays instanceof Array ? opt.hiddenWeekDays : [],
			roundRangeLimits: opt.roundRangeLimits != null ? opt.roundRangeLimits : false,
			dataSource: opt.dataSource instanceof Array || typeof opt.dataSource === "function"  ? opt.dataSource : [],
			style: opt.style == 'background' || opt.style == 'border' || opt.style == 'custom' ? opt.style : 'border',
			enableContextMenu: opt.enableContextMenu != null ? opt.enableContextMenu : false,
			contextMenuItems: opt.contextMenuItems instanceof Array ? opt.contextMenuItems : [],
			customDayRenderer : typeof opt.customDayRenderer === "function" ? opt.customDayRenderer : null,
			customDataSourceRenderer : typeof opt.customDataSourceRenderer === "function" ? opt.customDataSourceRenderer : null,
			weekStart: !isNaN(parseInt(opt.weekStart)) ? parseInt(opt.weekStart) : null,
			loadingTemplate: typeof opt.loadingTemplate === "string" || opt.loadingTemplate instanceof HTMLElement ? opt.loadingTemplate : null
		};

		if (this.options.dataSource instanceof Array) {
			this._dataSource = this.options.dataSource;
			this._initializeDatasourceColors();
		}
	}

	protected _initializeEvents(opt): void {
		if (opt == null) {
			opt = [];
		}
	
		if (opt.yearChanged) { this.element.addEventListener('yearChanged', opt.yearChanged); }
		if (opt.periodChanged) { this.element.addEventListener('periodChanged', opt.periodChanged); }
		if (opt.renderEnd) { this.element.addEventListener('renderEnd', opt.renderEnd); }
		if (opt.clickDay) { this.element.addEventListener('clickDay', opt.clickDay); }
		if (opt.dayContextMenu) { this.element.addEventListener('dayContextMenu', opt.dayContextMenu); }
		if (opt.selectRange) { this.element.addEventListener('selectRange', opt.selectRange); }
		if (opt.mouseOnDay) { this.element.addEventListener('mouseOnDay', opt.mouseOnDay); }
		if (opt.mouseOutDay) { this.element.addEventListener('mouseOutDay', opt.mouseOutDay); }
	}

	protected _fetchDataSource(callback: (dataSource: T[]) => void) {
		if (typeof this.options.dataSource === "function") {
			const getDataSource:any = this.options.dataSource;
			const currentPeriod = this.getCurrentPeriod();
			const fetchParameters = {
				year: currentPeriod.startDate.getFullYear(),
				startDate: currentPeriod.startDate,
				endDate: currentPeriod.endDate,
			};

			if (getDataSource.length == 2) {
				// 2 parameters, means callback method
				getDataSource(fetchParameters, callback);
			}
			else {
				// 1 parameter, means synchronous or promise method
				var result = getDataSource(fetchParameters);

				if (result instanceof Array) {
					callback(result);
				}
				if (result && result.then) {
					result.then(callback);
				}
			}
		}
		else {
			callback(this.options.dataSource);
		}
	}

	protected _initializeDatasourceColors(): void {
		for (var i = 0; i < this._dataSource.length; i++) {
			if (this._dataSource[i].color == null) {
				this._dataSource[i].color = Calendar.colors[i % Calendar.colors.length];
			}
		}
	}

	/**
     * Renders the calendar.
     */
	public render(isLoading: boolean = false): void {
		// Clear the calendar (faster method)
		while (this.element.firstChild) {
			this.element.removeChild(this.element.firstChild);
		}
		
		if (this.options.displayHeader) {
			this._renderHeader();
		}

		if (isLoading) {
			this._renderLoading();
		}
		else {
			this._renderBody();
			this._renderDataSource();
			
			this._applyEvents();

			// Fade animation
			var months = this.element.querySelector('.months-container') as HTMLElement;
			months.style.opacity = '0';
			months.style.display = 'flex';
			months.style.transition = 'opacity 0.5s';
			setTimeout(() => {
				months.style.opacity = '1';

				setTimeout(() => months.style.transition = '', 500);
			}, 0);
			
			const currentPeriod = this.getCurrentPeriod();
			this._triggerEvent('renderEnd', {
				currentYear: currentPeriod.startDate.getFullYear(),
				startDate: currentPeriod.startDate,
				endDate: currentPeriod.endDate
			});
		}
	}

	protected _renderHeader(): void {
		var header = document.createElement('div');
		header.classList.add('calendar-header');
		
		var headerTable = document.createElement('table');

		const period = this.getCurrentPeriod();
		
		// Left arrow
		var prevDiv = document.createElement('th');
		prevDiv.classList.add('prev');
		
		if (this.options.minDate != null && this.options.minDate >= period.startDate) {
			prevDiv.classList.add('disabled');
		}
		
		var prevIcon = document.createElement('span');
		prevIcon.innerHTML = "&lsaquo;";
		
		prevDiv.appendChild(prevIcon);
		
		headerTable.appendChild(prevDiv);
		
		if (this._isFullYearMode()) {
			// Year N-2
			var prev2YearDiv = document.createElement('th');
			prev2YearDiv.classList.add('year-title');
			prev2YearDiv.classList.add('year-neighbor2');
			prev2YearDiv.textContent = (this._startDate.getFullYear() - 2).toString();
			
			if (this.options.minDate != null && this.options.minDate > new Date(this._startDate.getFullYear() - 2, 11, 31)) {
				prev2YearDiv.classList.add('disabled');
			}
			
			headerTable.appendChild(prev2YearDiv);
			
			// Year N-1
			var prevYearDiv = document.createElement('th');
			prevYearDiv.classList.add('year-title');
			prevYearDiv.classList.add('year-neighbor');
			prevYearDiv.textContent = (this._startDate.getFullYear() - 1).toString();
			
			if (this.options.minDate != null && this.options.minDate > new Date(this._startDate.getFullYear() - 1, 11, 31)) {
				prevYearDiv.classList.add('disabled');
			}
		
			headerTable.appendChild(prevYearDiv);
		}
		
		// Current year
		var yearDiv = document.createElement('th');
		yearDiv.classList.add('year-title');

		if (this._isFullYearMode()) {
			yearDiv.textContent = this._startDate.getFullYear().toString();
		}
		else if (this.options.numberMonthsDisplayed == 12) {
			yearDiv.textContent = `${period.startDate.getFullYear()} - ${(period.endDate.getFullYear())}`;
		}
		else if (this.options.numberMonthsDisplayed > 1) {
			yearDiv.textContent = 
				`${Calendar.locales[this.options.language].months[period.startDate.getMonth()]} ${period.startDate.getFullYear()} - ${Calendar.locales[this.options.language].months[period.endDate.getMonth()]} ${period.endDate.getFullYear()}`;
		}
		else {
			yearDiv.textContent = `${Calendar.locales[this.options.language].months[period.startDate.getMonth()]} ${period.startDate.getFullYear()}`;
		}
		
		headerTable.appendChild(yearDiv);

		if (this._isFullYearMode()) {
			// Year N+1
			var nextYearDiv = document.createElement('th');
			nextYearDiv.classList.add('year-title');
			nextYearDiv.classList.add('year-neighbor');
			nextYearDiv.textContent = (this._startDate.getFullYear() + 1).toString();
			
			if (this.options.maxDate != null && this.options.maxDate < new Date(this._startDate.getFullYear() + 1, 0, 1)) {
				nextYearDiv.classList.add('disabled');
			}
			
			headerTable.appendChild(nextYearDiv);
			
			// Year N+2
			var next2YearDiv = document.createElement('th');
			next2YearDiv.classList.add('year-title');
			next2YearDiv.classList.add('year-neighbor2');
			next2YearDiv.textContent = (this._startDate.getFullYear() + 2).toString();
			
			if (this.options.maxDate != null && this.options.maxDate < new Date(this._startDate.getFullYear() + 2, 0, 1)) {
				next2YearDiv.classList.add('disabled');
			}
			
			headerTable.appendChild(next2YearDiv);
		}
		
		// Right arrow
		var nextDiv = document.createElement('th');
		nextDiv.classList.add('next');
		
		if (this.options.maxDate != null && this.options.maxDate <= period.endDate) {
			nextDiv.classList.add('disabled');
		}
		
		var nextIcon = document.createElement('span');
		nextIcon.innerHTML = "&rsaquo;";
		
		nextDiv.appendChild(nextIcon);
		
		headerTable.appendChild(nextDiv);
		
		header.appendChild(headerTable);
		
		this.element.appendChild(header);
	}

	protected _renderBody(): void {
		var monthsDiv = document.createElement('div');
		monthsDiv.classList.add('months-container');

		let monthStartDate = new Date(this._startDate.getTime());
		
		for (var m = 0; m < this.options.numberMonthsDisplayed; m++) {
			/* Container */
			var monthDiv = document.createElement('div');
			monthDiv.classList.add('month-container');
			monthDiv.dataset.monthId = m.toString();

			if (this._nbCols) {
				monthDiv.classList.add(`month-${this._nbCols}`);
			}
			
			var table = document.createElement('table');
			table.classList.add('month');
			
			/* Month header */
			var thead = document.createElement('thead');
			
			var titleRow = document.createElement('tr');
			
			var titleCell = document.createElement('th');
			titleCell.classList.add('month-title');
			titleCell.setAttribute('colspan', this.options.displayWeekNumber ? '8' : '7');
			titleCell.textContent = Calendar.locales[this.options.language].months[monthStartDate.getMonth()];
			
			titleRow.appendChild(titleCell);
			thead.appendChild(titleRow);
			
			var headerRow = document.createElement('tr');
			
			if (this.options.displayWeekNumber) {
				var weekNumberCell = document.createElement('th');
				weekNumberCell.classList.add('week-number');
				weekNumberCell.textContent = Calendar.locales[this.options.language].weekShort;
				headerRow.appendChild(weekNumberCell);
			}
			
			var weekStart = this.getWeekStart();
			var d = weekStart;
			do
			{
				var headerCell = document.createElement('th');
				headerCell.classList.add('day-header');
				headerCell.textContent = Calendar.locales[this.options.language].daysMin[d];
				
				if (this._isHidden(d)) {
					headerCell.classList.add('hidden');
				}
				
				headerRow.appendChild(headerCell);
				
				d++;
				if (d >= 7)
					d = 0;
			}
			while (d != weekStart)
			
			thead.appendChild(headerRow);
			table.appendChild(thead);
			
			/* Days */
			var currentDate = new Date(monthStartDate.getTime());
			var lastDate = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 0);
			
			while (currentDate.getDay() != weekStart)
			{
				currentDate.setDate(currentDate.getDate() - 1);
			}
			
			while (currentDate <= lastDate)
			{
				var row = document.createElement('tr');
				
				if (this.options.displayWeekNumber) {
					var weekNumberCell = document.createElement('td');
					var currentThursday = new Date(currentDate.getTime()); // Week number is computed based on the thursday
					currentThursday.setDate(currentThursday.getDate() - weekStart + 4);
					weekNumberCell.classList.add('week-number');
					weekNumberCell.textContent = this.getWeekNumber(currentThursday).toString();
					row.appendChild(weekNumberCell);
				}
			
				do
				{
					var cell = document.createElement('td');
					cell.classList.add('day');
					
					if (this._isHidden(currentDate.getDay())) {
						cell.classList.add('hidden');
					}
					
					if (currentDate < monthStartDate) {
						cell.classList.add('old');
					}
					else if (currentDate > lastDate) {
						cell.classList.add('new');
					}
					else {
						if (this._isDisabled(currentDate)) {
							cell.classList.add('disabled');
						}
					
						var cellContent = document.createElement('div');
						cellContent.classList.add('day-content');
						cellContent.textContent = currentDate.getDate().toString();
						cell.appendChild(cellContent);
						
						if (this.options.customDayRenderer) {
							this.options.customDayRenderer(cellContent, currentDate);
						}
					}
					
					row.appendChild(cell);
					
					currentDate.setDate(currentDate.getDate() + 1);
				}
				while (currentDate.getDay() != weekStart)
				
				table.appendChild(row);
			}
			
			monthDiv.appendChild(table);
			
			monthsDiv.appendChild(monthDiv);

			monthStartDate.setMonth(monthStartDate.getMonth() + 1);
		}
		
		this.element.appendChild(monthsDiv);
	}

	protected _renderLoading(): void {
		var container = document.createElement('div');
		container.classList.add('calendar-loading-container');
		container.style.minHeight = (this._nbCols * 200) + 'px';

		var loading = document.createElement('div');
		loading.classList.add('calendar-loading');

		if (this.options.loadingTemplate) {
			if (typeof this.options.loadingTemplate === "string") {
				loading.innerHTML = this.options.loadingTemplate;
			}
			else if (this.options.loadingTemplate instanceof HTMLElement) {
				loading.appendChild(this.options.loadingTemplate);
			}
		}
		else {
			var spinner = document.createElement('div');
			spinner.classList.add('calendar-spinner');

			for (let i = 1; i <= 3; i++) {
				var bounce = document.createElement('div');
				bounce.classList.add(`bounce${i}`);
				spinner.appendChild(bounce);
			}

			loading.appendChild(spinner);
		}

		container.appendChild(loading);
		this.element.appendChild(container);
	}

	protected _renderDataSource(): void {
		if (this._dataSource != null && this._dataSource.length > 0) {
			this.element.querySelectorAll('.month-container').forEach((month: HTMLElement) => {
				var monthId = parseInt(month.dataset.monthId);
				const currentYear = this._startDate.getFullYear();
				const currentMonth = this._startDate.getMonth() + monthId;
				
				var firstDate = new Date(currentYear, currentMonth, 1);
				var lastDate = new Date(currentYear, currentMonth + 1, 1);
				
				if ((this.options.minDate == null || lastDate > this.options.minDate) && (this.options.maxDate == null || firstDate <= this.options.maxDate))
				{
					var monthData = [];
				
					for (var i = 0; i < this._dataSource.length; i++) {
						if (!(this._dataSource[i].startDate >= lastDate) || (this._dataSource[i].endDate < firstDate)) {
							monthData.push(this._dataSource[i]);
						}
					}
					
					if (monthData.length > 0) {
						month.querySelectorAll('.day-content').forEach((day: HTMLElement) => {
							var currentDate = new Date(currentYear, currentMonth, parseInt(day.textContent));
							var nextDate = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
							
							var dayData = [];
							
							if ((this.options.minDate == null || currentDate >= this.options.minDate) && (this.options.maxDate == null || currentDate <= this.options.maxDate))
							{
								for (var i = 0; i < monthData.length; i++) {
									if (monthData[i].startDate < nextDate && monthData[i].endDate >= currentDate) {
										dayData.push(monthData[i]);
									}
								}
								
								if (dayData.length > 0 && (this.options.displayDisabledDataSource || !this._isDisabled(currentDate)))
								{
									this._renderDataSourceDay(day, currentDate, dayData);
								}
							}
						});
					}
				}
			});
		}
	}

	protected _renderDataSourceDay(elt: HTMLElement, currentDate: Date, events: T[]): void {
		const parent = elt.parentElement;

		switch (this.options.style)
		{
			case 'border':
				var weight = 0;
		
				if (events.length == 1) {
					weight = 4;
				}
				else if (events.length <= 3) {
					weight = 2;
				}
				else {
					parent.style.boxShadow = 'inset 0 -4px 0 0 black';
				}
				
				if (weight > 0)
				{
					var boxShadow = '';
				
					for (var i = 0; i < events.length; i++)
					{
						if (boxShadow != '') {
							boxShadow += ",";
						}
						
						boxShadow += `inset 0 -${(i + 1) * weight}px 0 0 ${events[i].color}`;
					}
					
					parent.style.boxShadow = boxShadow;
				}
				break;
		
			case 'background':
				parent.style.backgroundColor = events[events.length - 1].color;
				
				var currentTime = currentDate.getTime();
				
				if (events[events.length - 1].startDate.getTime() == currentTime)
				{
					parent.classList.add('day-start');
					
					if (events[events.length - 1].startHalfDay || this.options.alwaysHalfDay) {
						parent.classList.add('day-half');
						
						// Find color for other half
						var otherColor = 'transparent';
						for (var i = events.length - 2; i >= 0; i--) {
							if (events[i].startDate.getTime() != currentTime || (!events[i].startHalfDay && !this.options.alwaysHalfDay)) {
								otherColor = events[i].color;
								break;
							}
						}
						
						parent.style.background = `linear-gradient(-45deg, ${events[events.length - 1].color}, ${events[events.length - 1].color} 49%, ${otherColor} 51%, ${otherColor})`;
					}
					else if (this.options.roundRangeLimits) {
						parent.classList.add('round-left');
					}
				}
				else if (events[events.length - 1].endDate.getTime() == currentTime)
				{
					parent.classList.add('day-end');
					
					if (events[events.length - 1].endHalfDay || this.options.alwaysHalfDay) {
						parent.classList.add('day-half');
						
						// Find color for other half
						var otherColor = 'transparent';
						for (var i = events.length - 2; i >= 0; i--) {
							if (events[i].endDate.getTime() != currentTime || (!events[i].endHalfDay &&  !this.options.alwaysHalfDay)) {
								otherColor = events[i].color;
								break;
							}
						}
						
						parent.style.background = `linear-gradient(135deg, ${events[events.length - 1].color}, ${events[events.length - 1].color} 49%, ${otherColor} 51%, ${otherColor})`;
					}
					else if (this.options.roundRangeLimits) {
						parent.classList.add('round-right');
					}
				}
				break;
				
			case 'custom':
				if (this.options.customDataSourceRenderer) {
					this.options.customDataSourceRenderer.call(this, elt, currentDate, events);
				}
				break;
		}
	}

	protected _applyEvents(): void {
		if (this.options.displayHeader) {
			/* Header buttons */
			this.element.querySelectorAll('.year-neighbor, .year-neighbor2').forEach(element => {
				element.addEventListener('click', e => {
					if (!(e.currentTarget as HTMLElement).classList.contains('disabled')) {
						this.setYear(parseInt((e.currentTarget as HTMLElement).textContent));
					}
				});
			});
			
			this.element.querySelector('.calendar-header .prev').addEventListener('click', e => {
				if (!(e.currentTarget as HTMLElement).classList.contains('disabled')) {
					var months = this.element.querySelector('.months-container') as HTMLElement;

					months.style.transition = 'margin-left 0.1s';
					months.style.marginLeft = '100%';
					setTimeout(() => {
						months.style.visibility = 'hidden';
						months.style.transition = '';
						months.style.marginLeft = '0';

						setTimeout(() => { 
							this.setStartDate(new Date(this._startDate.getFullYear(), this._startDate.getMonth() - this.options.numberMonthsDisplayed, 1));
						}, 50);
					}, 100);
				}
			});
			
			this.element.querySelector('.calendar-header .next').addEventListener('click', e => {
				if (!(e.currentTarget as HTMLElement).classList.contains('disabled')) {
					var months = this.element.querySelector('.months-container') as HTMLElement;

					months.style.transition = 'margin-left 0.1s';
					months.style.marginLeft = '-100%';
					setTimeout(() => {
						months.style.visibility = 'hidden';
						months.style.transition = '';
						months.style.marginLeft = '0';

						setTimeout(() => { 
							this.setStartDate(new Date(this._startDate.getFullYear(), this._startDate.getMonth() + this.options.numberMonthsDisplayed, 1));
						}, 50);
					}, 100);
				}
			});
		}
		
		var cells = this.element.querySelectorAll('.day:not(.old):not(.new):not(.disabled)');
		
		cells.forEach(cell => {
			/* Click on date */
			cell.addEventListener('click', (e: MouseEvent) => {
				e.stopPropagation();

				var date = this._getDate(e.currentTarget);
				this._triggerEvent('clickDay', {
					element: e.currentTarget,
					date: date,
					events: this.getEvents(date)
				});
			});
		
			/* Click right on date */
			cell.addEventListener('contextmenu', e => {
				if (this.options.enableContextMenu)
				{
					e.preventDefault();
					if (this.options.contextMenuItems.length > 0)
					{
						this._openContextMenu(e.currentTarget as HTMLElement);
					}
				}
					
				var date = this._getDate(e.currentTarget);
				this._triggerEvent('dayContextMenu', {
					element: e.currentTarget,
					date: date,
					events: this.getEvents(date)
				});
			});
		
			/* Range selection */
			if (this.options.enableRangeSelection) {
				cell.addEventListener('mousedown', (e: MouseEvent) => {
					if (e.which == 1) {
						var currentDate = this._getDate(e.currentTarget);
					
						if (this.options.allowOverlap || this.isThereFreeSlot(currentDate))
						{
							this._mouseDown = true;
							this._rangeStart = this._rangeEnd = currentDate;
							this._refreshRange();
						}
					}
				});

				cell.addEventListener('mouseenter', e => {
					if (this._mouseDown) {
						var currentDate = this._getDate(e.currentTarget);
						
						if (!this.options.allowOverlap)
						{
							var newDate =  new Date(this._rangeStart.getTime());
							
							if (newDate < currentDate) {
								var nextDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
								while (newDate < currentDate) {
									if (!this.isThereFreeSlot(nextDate, false))
									{
										break;
									}
								
									newDate.setDate(newDate.getDate() + 1);
									nextDate.setDate(nextDate.getDate() + 1);
								}
							}
							else {
								var nextDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() - 1);
								while (newDate > currentDate) {
									if (!this.isThereFreeSlot(nextDate, true))
									{
										break;
									}
								
									newDate.setDate(newDate.getDate() - 1);
									nextDate.setDate(nextDate.getDate() - 1);
								}
							}
							
							currentDate = newDate;
						}
					
						var oldValue = this._rangeEnd;
						this._rangeEnd = currentDate;

						if (oldValue.getTime() != this._rangeEnd.getTime()) {
							this._refreshRange();
						}
					}
				});
			}

			/* Hover date */
			cell.addEventListener('mouseenter', e => {
				if (!this._mouseDown)
				{
					var date = this._getDate(e.currentTarget);
					this._triggerEvent('mouseOnDay', {
						element: e.currentTarget,
						date: date,
						events: this.getEvents(date)
					});
				}
			});
			
			cell.addEventListener('mouseleave', e => {
				var date = this._getDate(e.currentTarget);
				this._triggerEvent('mouseOutDay', {
					element: e.currentTarget,
					date: date,
					events: this.getEvents(date)
				});
			});
		});

		if (this.options.enableRangeSelection) {
			// Release range selection
			window.addEventListener('mouseup', e => {
				if (this._mouseDown) {
					this._mouseDown = false;
					this._refreshRange();

					var minDate = this._rangeStart < this._rangeEnd ? this._rangeStart : this._rangeEnd;
					var maxDate = this._rangeEnd > this._rangeStart ? this._rangeEnd : this._rangeStart;

					this._triggerEvent('selectRange', { 
						startDate: minDate, 
						endDate: maxDate,
						events: this.getEventsOnRange(minDate, new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate() + 1))
					});
				}
			});
		}
		
		/* Responsive management */
		if (this._responsiveInterval) {
			clearInterval(this._responsiveInterval);
			this._responsiveInterval = null;
		}

		this._responsiveInterval = setInterval(() => {
			if (this.element.querySelector('.month') == null) {
				return;
			}

			var calendarSize = this.element.offsetWidth;
			var monthSize = (this.element.querySelector('.month') as HTMLElement).offsetWidth + 10;
			this._nbCols = null;
			
			if (monthSize * 6 < calendarSize && this.options.numberMonthsDisplayed >= 6) {
				this._nbCols = 2;
			}
			else if (monthSize * 4 < calendarSize && this.options.numberMonthsDisplayed >= 4) {
				this._nbCols = 3;
			}
			else if (monthSize * 3 < calendarSize && this.options.numberMonthsDisplayed >= 3) {
				this._nbCols = 4;
			}
			else if (monthSize * 2 < calendarSize && this.options.numberMonthsDisplayed >= 2) {
				this._nbCols = 6;
			}
			else {
				this._nbCols = 12;
			}

			this.element.querySelectorAll('.month-container').forEach(month => {
				if (!month.classList.contains(`month-${this._nbCols}`)) {
					['month-2', 'month-3', 'month-4', 'month-6', 'month-12'].forEach(className => {
						month.classList.remove(className);
					});
					month.classList.add(`month-${this._nbCols}`);
				}
			});
		}, 300);
	}

	protected _refreshRange(): void {
		this.element.querySelectorAll('td.day.range').forEach(day => day.classList.remove('range'));
		this.element.querySelectorAll('td.day.range-start').forEach(day => day.classList.remove('range-start'));
		this.element.querySelectorAll('td.day.range-end').forEach(day => day.classList.remove('range-end'));

		if (this._mouseDown) {
			var minDate = this._rangeStart < this._rangeEnd ? this._rangeStart : this._rangeEnd;
			var maxDate = this._rangeEnd > this._rangeStart ? this._rangeEnd : this._rangeStart;

			this.element.querySelectorAll('.month-container').forEach((month: HTMLElement) => {
				var monthId = parseInt(month.dataset.monthId);
				const monthStartDate = new Date(this._startDate.getFullYear(), this._startDate.getMonth() + monthId, 1);
				const monthEndDate = new Date(this._startDate.getFullYear(), this._startDate.getMonth() + monthId + 1, 1);

				if (minDate.getTime() < monthEndDate.getTime() && maxDate.getTime() >= monthStartDate.getTime()) {
					month.querySelectorAll('td.day:not(.old):not(.new)').forEach(day => {
						var date = this._getDate(day);
						if (date >= minDate && date <= maxDate) {
							day.classList.add('range');

							if (date.getTime() == minDate.getTime()) {
								day.classList.add('range-start');
							}

							if (date.getTime() == maxDate.getTime()) {
								day.classList.add('range-end');
							}
						}
					});
				}
			});
		}
	}

	protected _getElementPosition(element: HTMLElement): {top: number, left: number} {
		let top = 0, left = 0;

		do {
			top += element.offsetTop  || 0;
			left += element.offsetLeft || 0;
			element = element.offsetParent as HTMLElement;
		} while(element);
	
		return { top, left };
	}

	protected _openContextMenu(elt: HTMLElement): void {
		var contextMenu = document.querySelector('.calendar-context-menu') as HTMLElement;
		
		if (contextMenu !== null) {
			contextMenu.style.display = 'none';

			// Clear the context menu (faster method)
			while (contextMenu.firstChild) {
				contextMenu.removeChild(contextMenu.firstChild);
			}
		}
		else {
			contextMenu = document.createElement('div');
			contextMenu.classList.add('calendar-context-menu');
			document.body.appendChild(contextMenu);
		}
		
		var date = this._getDate(elt);
		var events = this.getEvents(date);
		
		for (var i = 0; i < events.length; i++) {
			var eventItem = document.createElement('div');
			eventItem.classList.add('item');
			eventItem.style.paddingLeft = '4px';
			eventItem.style.boxShadow = `inset 4px 0 0 0 ${events[i].color}`;
			
			var eventItemContent = document.createElement('div');
			eventItemContent.classList.add('content');

			var text = document.createElement('span');
			text.classList.add('text');
			text.textContent = events[i].name;
			eventItemContent.appendChild(text);
			
			var icon = document.createElement('span');
			icon.classList.add('arrow');
			icon.innerHTML = "&rsaquo;";
			eventItemContent.appendChild(icon);

			eventItem.appendChild(eventItemContent);
			
			this._renderContextMenuItems(eventItem, this.options.contextMenuItems, events[i]);
			
			contextMenu.appendChild(eventItem);
		}

		if (contextMenu.children.length > 0) {
			const position = this._getElementPosition(elt);
			contextMenu.style.left = (position.left + 25) + 'px';
			contextMenu.style.right = '';
			contextMenu.style.top = (position.top + 25) + 'px';
			contextMenu.style.display = 'block';

			if (contextMenu.getBoundingClientRect().right > document.body.offsetWidth) {
				contextMenu.style.left = '';
				contextMenu.style.right = '0';
			}

			// Launch the position check once the whole context menu tree will be rendered
			setTimeout(() => this._checkContextMenuItemsPosition(), 0);
			
			const closeContextMenu = (event: Event) => {
				if (event.type !== 'click' || !contextMenu.contains((event as MouseEvent).target as Node)) {
					contextMenu.style.display = 'none';

					window.removeEventListener('click', closeContextMenu);
					window.removeEventListener('resize', closeContextMenu);
					window.removeEventListener('scroll', closeContextMenu);
				}
			};

			window.addEventListener('click', closeContextMenu);
			window.addEventListener('resize', closeContextMenu);
			window.addEventListener('scroll', closeContextMenu);
		}
	}

	protected _renderContextMenuItems(parent: HTMLElement, items: CalendarContextMenuItem<T>[], evt: T): void {
		var subMenu = document.createElement('div');
		subMenu.classList.add('submenu');
		
		for (var i = 0; i < items.length; i++) {
			if (items[i].visible === false || (typeof items[i].visible === "function" && !(items[i] as any).visible(evt))) {
				continue;
			}

			var menuItem = document.createElement('div');
			menuItem.classList.add('item');
			
			var menuItemContent = document.createElement('div');
			menuItemContent.classList.add('content');

			var text = document.createElement('span');
			text.classList.add('text');
			text.textContent = items[i].text;
			menuItemContent.appendChild(text);
						
			if (items[i].click) {
				(function(index) {
					menuItemContent.addEventListener('click', () => {
						(document.querySelector('.calendar-context-menu') as HTMLElement).style.display = 'none';
						items[index].click(evt);
					});
				})(i);
			}

			menuItem.appendChild(menuItemContent);
			
			if (items[i].items && items[i].items.length > 0) {
				var icon = document.createElement('span');
				icon.classList.add('arrow');
				icon.innerHTML = "&rsaquo;";
				menuItemContent.appendChild(icon);

				this._renderContextMenuItems(menuItem, items[i].items, evt);
			}
			
			subMenu.appendChild(menuItem);
		}
		
		if (subMenu.children.length > 0)
		{
			parent.appendChild(subMenu);
		}
	}

	protected _checkContextMenuItemsPosition(): void {
		const menus = document.querySelectorAll('.calendar-context-menu .submenu');

		menus.forEach(menu => {
			const htmlMenu = menu as HTMLElement;
			htmlMenu.style.display = 'block';
			htmlMenu.style.visibility = 'hidden';
		});

		menus.forEach(menu => {
			const htmlMenu = menu as HTMLElement;
			if (htmlMenu.getBoundingClientRect().right > document.body.offsetWidth) {
				htmlMenu.classList.add('open-left');
			} else {
				htmlMenu.classList.remove('open-left');
			}
		});

		menus.forEach(menu => {
			const htmlMenu = menu as HTMLElement;
			htmlMenu.style.display = '';
			htmlMenu.style.visibility = '';
		});
	}

	protected _getDate(elt): Date {
		var day = elt.querySelector('.day-content').textContent;
		var monthId = parseInt(elt.closest('.month-container').dataset.monthId);

		return new Date(this._startDate.getFullYear(), this._startDate.getMonth() + monthId, day);
	}

	protected _triggerEvent(eventName: string, parameters: any) {
		var event:any = null;

		if (typeof Event === "function") {
			event = new Event(eventName);
		}
		else {
			event = document.createEvent('Event');
			event.initEvent(eventName, false, false);
		}

		event.calendar = this;
		
		for (var i in parameters) {
			event[i] = parameters[i];
		}
		
		this.element.dispatchEvent(event);
		
		return event;
	}

	protected _isDisabled(date: Date): boolean {
		if ((this.options.minDate != null && date < this.options.minDate) || (this.options.maxDate != null && date > this.options.maxDate))
		{
			return true;
		}
		
		if (this.options.disabledWeekDays.length > 0) {
			for (var d = 0; d < this.options.disabledWeekDays.length; d++) {
				if (date.getDay() == this.options.disabledWeekDays[d]) {
					return true;
				}
			}
		}
		
		if (this.options.disabledDays.length > 0) {
			for (var d = 0; d < this.options.disabledDays.length; d++) {
				if (date.getTime() == this.options.disabledDays[d].getTime()) {
					return true;
				}
			}
		}
		
		return false;
	}
	
	protected _isHidden(day: number): boolean {
		if (this.options.hiddenWeekDays.length > 0) {
			for (var d = 0; d < this.options.hiddenWeekDays.length; d++) {
				if (day == this.options.hiddenWeekDays[d]) {
					return true;
				}
			}
		}
		
		return false;
	}

	protected _isFullYearMode(): boolean {
		return this._startDate.getMonth() == 0 && this.options.numberMonthsDisplayed == 12;
	}

	/**
     * Gets the week number for a specified date.
     *
     * @param date The specified date.
     */
	public getWeekNumber(date: Date): number {
		// Algorithm from https://weeknumber.net/how-to/javascript
		var workingDate = new Date(date.getTime());
		workingDate.setHours(0, 0, 0, 0);
		// Thursday in current week decides the year.
		workingDate.setDate(workingDate.getDate() + 3 - (workingDate.getDay() + 6) % 7);
		// January 4 is always in week 1.
		var week1 = new Date(workingDate.getFullYear(), 0, 4);
		// Adjust to Thursday in week 1 and count number of weeks from date to week1.
		return 1 + Math.round(((workingDate.getTime() - week1.getTime()) / 86400000
			- 3 + (week1.getDay() + 6) % 7) / 7);
	}

	/**
     * Gets the data source elements for a specified day.
     *
     * @param date The specified day.
     */
	public getEvents(date: Date): T[] {
		return this.getEventsOnRange(date, new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
	}

	/**
     * Gets the data source elements for a specified range of days.
     *
     * @param startDate The beginning of the day range (inclusive).
	 * @param endDate The end of the day range (non inclusive).
     */
	public getEventsOnRange(startDate: Date, endDate: Date): T[] {
		var events = [];
		
		if (this._dataSource && startDate && endDate) {
			for (var i = 0; i < this._dataSource.length; i++) {
				if (this._dataSource[i].startDate < endDate && this._dataSource[i].endDate >= startDate) {
					events.push(this._dataSource[i]);
				}
			}
		}
		
		return events;
	}

	/**
     * Check if there is no event on the first part, last part or on the whole specified day.
     *
     * @param date The specified day.
     * @param after Whether to check for a free slot on the first part (if `false`) or the last part (if `true`) of the day. If `null`, this will check on the whole day.
	 * 
	 * Usefull only if using the `alwaysHalfDay` option of the calendar, or the `startHalfDay` or `endHalfDay` option of the datasource.
     */
	public isThereFreeSlot(date: Date, after: Boolean = null): Boolean {
		const events = this.getEvents(date);

		if (after === true) {
			return !events.some(evt => (!this.options.alwaysHalfDay && !evt.endHalfDay) || evt.endDate > date);
		}
		else if (after === false) {
			return !events.some(evt => (!this.options.alwaysHalfDay && !evt.startHalfDay) || evt.startDate < date);
		}
		else {
			return this.isThereFreeSlot(date, false) || this.isThereFreeSlot(date, true);
		}
	}

	/**
     * Gets the period displayed on the calendar.
     */
	public getCurrentPeriod(): { startDate: Date, endDate: Date } {
		const startDate = new Date(this._startDate.getTime());
		const endDate = new Date(this._startDate.getTime());
		endDate.setMonth(endDate.getMonth() + this.options.numberMonthsDisplayed);
		endDate.setTime(endDate.getTime() - 1);

		return { startDate, endDate };
	}

	/**
     * Gets the year displayed on the calendar.
	 * If the calendar is not used in a full year configuration, this will return the year of the first date displayed in the calendar.
     */
	public getYear(): number | null {
		return this._isFullYearMode() ? this._startDate.getFullYear() : null;
	}

	/**
     * Sets the year displayed on the calendar.
	 * If the calendar is not used in a full year configuration, this will set the start date to January 1st of the given year.
     *
     * @param year The year to displayed on the calendar.
     */
	public setYear(year: number | string): void {
		var parsedYear = parseInt(year as string);
		if (!isNaN(parsedYear)) {
			this.setStartDate(new Date(parsedYear, 0 , 1));
		}
	}

	/**
     * Gets the first date displayed on the calendar.
     */
	public getStartDate(): Date {
		return this._startDate;
	}

	/**
     * Sets the first date that should be displayed on the calendar.
     *
     * @param startDate The first date that should be displayed on the calendar.
     */
	public setStartDate(startDate: Date): void {
		if (startDate instanceof Date) {
			this.options.startDate = startDate;
			this._startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
							
			// Clear the calendar (faster method)
			while (this.element.firstChild) {
				this.element.removeChild(this.element.firstChild);
			}

			if (this.options.displayHeader) {
				this._renderHeader();
			}
			
			const newPeriod = this.getCurrentPeriod();
			const periodEventResult = this._triggerEvent('periodChanged', { startDate: newPeriod.startDate, endDate: newPeriod.endDate, preventRendering: false });
			let yearEventResult = null;

			if (this._isFullYearMode()) {
				yearEventResult = this._triggerEvent('yearChanged', { currentYear: this._startDate.getFullYear(), preventRendering: false });
			}

			if (typeof this.options.dataSource === "function") {
				this.render(true);

				this._fetchDataSource(dataSource => {
					this._dataSource = dataSource;
					this._initializeDatasourceColors();
					this.render(false);
				})
			}
			else {
				if (!periodEventResult.preventRendering && (!yearEventResult || !yearEventResult.preventRedering)) {
					this.render();
				}
			}
		}
	}

	/**
     * Gets the number of months displayed by the calendar.
     */
	public getNumberMonthsDisplayed(): number {
		return this.options.numberMonthsDisplayed;
	}

	/**
     * Sets the number of months displayed that should be displayed by the calendar.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param numberMonthsDisplayed Number of months that should be displayed by the calendar.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setNumberMonthsDisplayed(numberMonthsDisplayed: number | string, preventRendering: boolean = false): void {
		var parsedNumber = parseInt(numberMonthsDisplayed as string);
		if (!isNaN(parsedNumber) && parsedNumber > 0 && parsedNumber <= 12) {
			this.options.numberMonthsDisplayed = parsedNumber;

			if (!preventRendering) {
				this.render();
			}
		}
	}

	/**
     * Gets the minimum date of the calendar.
     */
	public getMinDate(): Date {
		return this.options.minDate;
	}

	/**
     * Sets the minimum date of the calendar.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param minDate The minimum date to set.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setMinDate(date: Date, preventRendering: boolean = false): void {
		if (date instanceof Date || date === null) {
			this.options.minDate = date;
			
			if (!preventRendering) {
				this.render();
			}
		}
	}

	/**
     * Gets the maximum date of the calendar.
     */
	public getMaxDate(): Date {
		return this.options.maxDate;
	}

	/**
     * Sets the maximum date of the calendar. 
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param maxDate The maximum date to set.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setMaxDate(date: Date, preventRendering: boolean = false): void {
		if (date instanceof Date || date === null) {
			this.options.maxDate = date;
			
			if (!preventRendering) {
				this.render();
			}
		}
	}

	/**
     * Gets the current style used for displaying data source.
     */
	public getStyle(): string {
		return this.options.style;
	}

	/**
     * Sets the style to use for displaying data source. 
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param style The style to use for displaying data source ("background", "border" or "custom").
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setStyle(style: string, preventRendering: boolean = false): void {
		this.options.style = style == 'background' || style == 'border' || style == 'custom' ? style : 'border';
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets a value indicating whether the user can select a range which overlapping an other element present in the datasource.
     */
	public getAllowOverlap(): boolean {
		return this.options.allowOverlap;
	}

	/**
     * Sets a value indicating whether the user can select a range which overlapping an other element present in the datasource.
     *
     * @param allowOverlap Indicates whether the user can select a range which overlapping an other element present in the datasource.
     */
	public setAllowOverlap(allowOverlap: boolean): void {
		this.options.allowOverlap = allowOverlap;
	}

	/**
     * Gets a value indicating whether the weeks number are displayed.
     */
	public getDisplayWeekNumber(): boolean {
		return this.options.displayWeekNumber;
	}

	/**
     * Sets a value indicating whether the weeks number are displayed.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param  displayWeekNumber Indicates whether the weeks number are displayed.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setDisplayWeekNumber(displayWeekNumber: boolean, preventRendering: boolean = false): void {
		this.options.displayWeekNumber = displayWeekNumber;
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets a value indicating whether the calendar header is displayed.
     */
	public getDisplayHeader(): boolean {
		return this.options.displayHeader;
	}

	/**
     * Sets a value indicating whether the calendar header is displayed.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param displayHeader Indicates whether the calendar header is displayed.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setDisplayHeader(displayHeader: boolean, preventRendering: boolean = false): void {
		this.options.displayHeader = displayHeader;
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets a value indicating whether the data source must be rendered on disabled days.
     */
	public getDisplayDisabledDataSource(): boolean {
		return this.options.displayDisabledDataSource;
	}

	/**
     * Sets a value indicating whether the data source must be rendered on disabled days.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param displayDisabledDataSource Indicates whether the data source must be rendered on disabled days.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setDisplayDisabledDataSource(displayDisabledDataSource: boolean, preventRendering: boolean = false): void {
		this.options.displayDisabledDataSource = displayDisabledDataSource;
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets a value indicating whether the beginning and the end of each range should be displayed as half selected day.
     */
	public getAlwaysHalfDay(): boolean {
		return this.options.alwaysHalfDay;
	}

	/**
     * Sets a value indicating whether the beginning and the end of each range should be displayed as half selected day.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param alwaysHalfDay Indicates whether the beginning and the end of each range should be displayed as half selected day.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setAlwaysHalfDay(alwaysHalfDay: boolean, preventRendering: boolean = false): void {
		this.options.alwaysHalfDay = alwaysHalfDay;
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets a value indicating whether the user can make range selection.
     */
	public getEnableRangeSelection(): boolean {
		return this.options.enableRangeSelection;
	}

	/**
     * Sets a value indicating whether the user can make range selection.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param enableRangeSelection Indicates whether the user can make range selection.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setEnableRangeSelection(enableRangeSelection: boolean, preventRendering: boolean = false): void {
		this.options.enableRangeSelection = enableRangeSelection;
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets the disabled days.
     */
	public getDisabledDays(): Date[] {
		return this.options.disabledDays;
	}

	/**
     * Sets the disabled days.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param disableDays The disabled days to set.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setDisabledDays(disabledDays: Date[], preventRendering: boolean = false): void {
		this.options.disabledDays = disabledDays instanceof Array ? disabledDays : [];
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets the disabled days of the week.
     */
	public getDisabledWeekDays(): number[] {
		return this.options.disabledWeekDays;
	}

	/**
     * Sets the disabled days of the week.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param disabledWeekDays The disabled days of the week to set.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setDisabledWeekDays(disabledWeekDays: number[], preventRendering: boolean = false): void {
		this.options.disabledWeekDays = disabledWeekDays instanceof Array ? disabledWeekDays : [];
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets the hidden days of the week.
     */
	public getHiddenWeekDays(): number[] {
		return this.options.hiddenWeekDays;
	}

	/**
     * Sets the hidden days of the week.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param hiddenWeekDays The hidden days of the week to set.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setHiddenWeekDays(hiddenWeekDays: number[], preventRendering: boolean = false): void {
		this.options.hiddenWeekDays = hiddenWeekDays instanceof Array ? hiddenWeekDays : [];
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets a value indicating whether the beginning and the end of each range should be displayed as rounded cells.
     */
	public getRoundRangeLimits(): boolean {
		return this.options.roundRangeLimits;
	}

	/**
     * Sets a value indicating whether the beginning and the end of each range should be displayed as rounded cells.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param roundRangeLimits Indicates whether the beginning and the end of each range should be displayed as rounded cells. 
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setRoundRangeLimits(roundRangeLimits: boolean, preventRendering: boolean = false): void {
		this.options.roundRangeLimits = roundRangeLimits;
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets a value indicating whether the default context menu must be displayed when right clicking on a day.
     */
	public getEnableContextMenu(): boolean {
		return this.options.enableContextMenu;
	}

	/**
     * Sets a value indicating whether the default context menu must be displayed when right clicking on a day. 
     * 
	 * This method causes a refresh of the calendar.
     * 
     * @param enableContextMenu Indicates whether the default context menu must be displayed when right clicking on a day.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setEnableContextMenu(enableContextMenu: boolean, preventRendering: boolean = false): void {
		this.options.enableContextMenu = enableContextMenu;
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets the context menu items.
     */
	public getContextMenuItems(): CalendarContextMenuItem<T>[] {
		return this.options.contextMenuItems;
	}

	/**
     * Sets new context menu items.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param contextMenuItems The new context menu items.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setContextMenuItems(contextMenuItems: CalendarContextMenuItem<T>[], preventRendering: boolean = false): void {
		this.options.contextMenuItems = contextMenuItems instanceof Array ? contextMenuItems : [];
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets the custom day renderer.
     */
	public getCustomDayRenderer(): (element: HTMLElement, currentDate: Date) => void {
		return this.options.customDayRenderer;
	}

	/**
     * Sets the custom day renderer.
	 * 
	 * This method causes a refresh of the calendar.
	 *
	 * @param handler The function used to render the days. This function is called during render for each day.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setCustomDayRenderer(customDayRenderer: (element: HTMLElement, currentDate: Date) => void, preventRendering: boolean = false): void {
		this.options.customDayRenderer = typeof customDayRenderer === "function" ? customDayRenderer : null;
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets the custom data source renderer.
     */
	public getCustomDataSourceRenderer(): (element: HTMLElement, currentDate: Date, events: T[]) => void {
		return this.options.customDataSourceRenderer;
	}

	/**
     * Sets the custom data source renderer. Works only with the style set to "custom".
	 * 
	 * This method causes a refresh of the calendar.
	 *
	 * @param handler The function used to render the data source. This function is called during render for each day containing at least one event.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setCustomDataSourceRenderer(customDataSourceRenderer: (element: HTMLElement, currentDate: Date, events: T[]) => void, preventRendering: boolean = false): void {
		this.options.customDataSourceRenderer = typeof customDataSourceRenderer === "function" ? customDataSourceRenderer : null;
		
		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets the language used for calendar rendering.
     */
	public getLanguage(): string {
		return this.options.language;
	}

	/**
     * Sets the language used for calendar rendering.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param language The language to use for calendar redering.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setLanguage(language: string, preventRendering: boolean = false): void {
		if (language != null && Calendar.locales[language] != null) {
			this.options.language = language;
			
			if (!preventRendering) {
				this.render();
			}
		}
	}

	/**
     * Gets the current data source.
     */
	public getDataSource(): T[] | ((currentYear: number) => T[] | Promise<T[]>) | ((currentYear: number, done: (result: T[]) => void) => void) {
		return this.options.dataSource;
	}

	/**
     * Sets a new data source.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param dataSource The new data source.
	 * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setDataSource(dataSource: T[] | ((currentYear: number) => T[] | Promise<T[]>) | ((currentYear: number, done: (result: T[]) => void) => void), preventRendering: boolean = false): void {
		this.options.dataSource = dataSource instanceof Array || typeof dataSource === "function" ? dataSource : [];

		if (typeof this.options.dataSource === "function") {
			this.render(true);

			this._fetchDataSource(dataSource => {
				this._dataSource = dataSource;
				this._initializeDatasourceColors();
				this.render(false);
			});
		}
		else {
			this._dataSource = this.options.dataSource;
			this._initializeDatasourceColors();
			if (!preventRendering) {
				this.render();
			}
		}
	}

	/**
     * Gets the starting day of the week.
     */
	public getWeekStart(): number {
		return this.options.weekStart !== null ? this.options.weekStart : Calendar.locales[this.options.language].weekStart;
	}

	/**
     * Sets the starting day of the week.
	 * 
	 * This method causes a refresh of the calendar.
     *
     * @param weekStart The starting day of the week. This option overrides the parameter define in the language file.
     * @param preventRedering Indicates whether the rendering should be prevented after the property update.
     */
	public setWeekStart(weekStart: number | string, preventRendering: boolean = false): void {
		this.options.weekStart = !isNaN(parseInt(weekStart as string)) ? parseInt(weekStart as string) : null;

		if (!preventRendering) {
			this.render();
		}
	}

	/**
     * Gets the loading template.
     */
	public getLoadingTemplate(): string | HTMLElement {
		return this.options.loadingTemplate;
	}

	/**
     * Sets the loading template.
     *
     * @param loadingTemplate The loading template.
     */
	public setLoadingTemplate(loadingTemplate: string | HTMLElement): void {
		this.options.loadingTemplate = typeof loadingTemplate === "string" || loadingTemplate instanceof HTMLElement ? loadingTemplate : null;
	}

	/**
	 * 
     * Add a new element to the data source.
	 * 
	 * This method causes a refresh of the calendar.
     * 
     * @param element The element to add.
	 * @param preventRendering Indicates whether the calendar shouldn't be refreshed once the event added.
     */
	public addEvent(evt: T, preventRendering: boolean = false) {
		this._dataSource.push(evt);
		
		if (!preventRendering) {
			this.render();
		}
	}
}

declare global {
    interface Window { Calendar: any; }
}

if (typeof window === "object") {
	window.Calendar = Calendar;

	document.addEventListener("DOMContentLoaded", () => {
		document.querySelectorAll('[data-provide="calendar"]').forEach((element: HTMLElement) => new Calendar(element));
	});
}
