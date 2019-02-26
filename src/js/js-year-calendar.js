/* =========================================================
 * JS year calendar v0.1.0
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
 
export default class Calendar {

	static locales = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			weekShort: 'W',
			weekStart:0
		}
	};

	static colors = ['#2C8FC9', '#9CB703', '#F5BB00', '#FF4A32', '#B56CE2', '#45A597'];
	
	constructor(element, options) {
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
		this.setYear(this.options.startYear);
	}
 
	
	_initializeOptions(opt) {
		if (opt == null) {
			opt = [];
		}
	
		this.options = {
			startYear: !isNaN(parseInt(opt.startYear)) ? parseInt(opt.startYear) : new Date().getFullYear(),
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
			dataSource: opt.dataSource instanceof Array ? opt.dataSource : [],
			style: opt.style == 'background' || opt.style == 'border' || opt.style == 'custom' ? opt.style : 'border',
			enableContextMenu: opt.enableContextMenu != null ? opt.enableContextMenu : false,
			contextMenuItems: opt.contextMenuItems instanceof Array ? opt.contextMenuItems : [],
			customDayRenderer : typeof opt.customDayRenderer === "function" ? opt.customDayRenderer : null,
			customDataSourceRenderer : typeof opt.customDataSourceRenderer === "function" ? opt.customDataSourceRenderer : null,
			weekStart: !isNaN(parseInt(opt.weekStart)) ? parseInt(opt.weekStart) : null
		};
		
		this._initializeDatasourceColors();
	}

	_initializeEvents(opt) {
		if (opt == null) {
			opt = [];
		}
	
		if (opt.yearChanged) { this.element.addEventListener('yearChanged', opt.yearChanged); }
		if (opt.renderEnd) { this.element.addEventListener('renderEnd', opt.renderEnd); }
		if (opt.clickDay) { this.element.addEventListener('clickDay', opt.clickDay); }
		if (opt.dayContextMenu) { this.element.addEventListener('dayContextMenu', opt.dayContextMenu); }
		if (opt.selectRange) { this.element.addEventListener('selectRange', opt.selectRange); }
		if (opt.mouseOnDay) { this.element.addEventListener('mouseOnDay', opt.mouseOnDay); }
		if (opt.mouseOutDay) { this.element.addEventListener('mouseOutDay', opt.mouseOutDay); }
	}

	_initializeDatasourceColors() {
		for (var i = 0; i < this.options.dataSource.length; i++) {
			if (this.options.dataSource[i].color == null) {
				this.options.dataSource[i].color = Calendar.colors[i % Calendar.colors.length];
			}
		}
	}

	render() {
		// Clear the calendar (faster method)
		while (this.element.firstChild) {
			this.element.removeChild(this.element.firstChild);
		}
		
		if (this.options.displayHeader) {
			this._renderHeader();
		}
		
		this._renderBody();
		this._renderDataSource();
		
		this._applyEvents();

		// Fade animation
		var months = this.element.querySelector('.months-container');
		months.style.opacity = 0;
		months.style.display = 'block';
		months.style.transition = 'opacity 0.5s';
		setTimeout(() => {
			months.style.opacity = 1;

			setTimeout(() => months.style.transition = '', 500);
		}, 0);
		
		this._triggerEvent('renderEnd', { currentYear: this.options.startYear });
	}

	_renderHeader() {
		var header = document.createElement('div');
		header.classList.add('calendar-header');
		
		var headerTable = document.createElement('table');
		
		var prevDiv = document.createElement('th');
		prevDiv.classList.add('prev');
		
		if (this.options.minDate != null && this.options.minDate > new Date(this.options.startYear - 1, 11, 31)) {
			prevDiv.classList.add('disabled');
		}
		
		var prevIcon = document.createElement('span');
		prevIcon.innerHTML = "&lsaquo;";
		
		prevDiv.appendChild(prevIcon);
		
		headerTable.appendChild(prevDiv);
		
		var prev2YearDiv = document.createElement('th');
		prev2YearDiv.classList.add('year-title', 'year-neighbor2', 'hidden-sm', 'hidden-xs');
		prev2YearDiv.textContent = this.options.startYear - 2;
		
		if (this.options.minDate != null && this.options.minDate > new Date(this.options.startYear - 2, 11, 31)) {
			prev2YearDiv.classList.add('disabled');
		}
		
		headerTable.appendChild(prev2YearDiv);
		
		var prevYearDiv = document.createElement('th');
		prevYearDiv.classList.add('year-title', 'year-neighbor', 'hidden-xs');
		prevYearDiv.textContent = this.options.startYear - 1;
		
		if (this.options.minDate != null && this.options.minDate > new Date(this.options.startYear - 1, 11, 31)) {
			prevYearDiv.classList.add('disabled');
		}
		
		headerTable.appendChild(prevYearDiv);
		
		var yearDiv = document.createElement('th');
		yearDiv.classList.add('year-title');
		yearDiv.textContent = this.options.startYear;
		
		headerTable.appendChild(yearDiv);
		
		var nextYearDiv = document.createElement('th');
		nextYearDiv.classList.add('year-title', 'year-neighbor', 'hidden-xs');
		nextYearDiv.textContent = this.options.startYear + 1;
		
		if (this.options.maxDate != null && this.options.maxDate < new Date(this.options.startYear + 1, 0, 1)) {
			nextYearDiv.classList.add('disabled');
		}
		
		headerTable.appendChild(nextYearDiv);
		
		var next2YearDiv = document.createElement('th');
		next2YearDiv.classList.add('year-title', 'year-neighbor2', 'hidden-sm', 'hidden-xs');
		next2YearDiv.textContent = this.options.startYear + 2;
		
		if (this.options.maxDate != null && this.options.maxDate < new Date(this.options.startYear + 2, 0, 1)) {
			next2YearDiv.classList.add('disabled');
		}
		
		headerTable.appendChild(next2YearDiv);
		
		var nextDiv = document.createElement('th');
		nextDiv.classList.add('next');
		
		if (this.options.maxDate != null && this.options.maxDate < new Date(this.options.startYear + 1, 0, 1)) {
			nextDiv.classList.add('disabled');
		}
		
		var nextIcon = document.createElement('span');
		nextIcon.innerHTML = "&rsaquo;";
		
		nextDiv.appendChild(nextIcon);
		
		headerTable.appendChild(nextDiv);
		
		header.appendChild(headerTable);
		
		this.element.appendChild(header);
	}

	_renderBody() {
		var monthsDiv = document.createElement('div');
		monthsDiv.classList.add('months-container');
		
		for (var m = 0; m < 12; m++) {
			/* Container */
			var monthDiv = document.createElement('div');
			monthDiv.classList.add('month-container');
			monthDiv.dataset.monthId = m;
			
			var firstDate = new Date(this.options.startYear, m, 1);
			
			var table = document.createElement('table');
			table.classList.add('month');
			
			/* Month header */
			var thead = document.createElement('thead');
			
			var titleRow = document.createElement('tr');
			
			var titleCell = document.createElement('th');
			titleCell.classList.add('month-title');
			titleCell.setAttribute('colspan', this.options.displayWeekNumber ? 8 : 7);
			titleCell.textContent = Calendar.locales[this.options.language].months[m];
			
			titleRow.appendChild(titleCell);
			thead.appendChild(titleRow);
			
			var headerRow = document.createElement('tr');
			
			if (this.options.displayWeekNumber) {
				var weekNumberCell = document.createElement('th');
				weekNumberCell.classList.add('week-number');
				weekNumberCell.textContent = Calendar.locales[this.options.language].weekShort;
				headerRow.appendChild(weekNumberCell);
			}
			
			var weekStart = this.options.weekStart ? this.options.weekStart : Calendar.locales[this.options.language].weekStart;
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
			var currentDate = new Date(firstDate.getTime());
			var lastDate = new Date(this.options.startYear, m + 1, 0);
			
			while (currentDate.getDay() != weekStart)
			{
				currentDate.setDate(currentDate.getDate() - 1);
			}
			
			while (currentDate <= lastDate)
			{
				var row = document.createElement('tr');
				
				if (this.options.displayWeekNumber) {
					var weekNumberCell = document.createElement('td');
					weekNumberCell.classList.add('week-number');
					weekNumberCell.textContent = this.getWeekNumber(currentDate);
					row.appendChild(weekNumberCell);
				}
			
				do
				{
					var cell = document.createElement('td');
					cell.classList.add('day');
					
					if (this._isHidden(currentDate.getDay())) {
						cell.classList.add('hidden');
					}
					
					if (currentDate < firstDate) {
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
						cellContent.textContent = currentDate.getDate();
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
		}
		
		this.element.appendChild(monthsDiv);
	}

	_renderDataSource() {
		if (this.options.dataSource != null && this.options.dataSource.length > 0) {
			this.element.querySelectorAll('.month-container').forEach(month => {
				var monthId = month.dataset.monthId;
				
				var firstDate = new Date(this.options.startYear, monthId, 1);
				var lastDate = new Date(this.options.startYear, monthId + 1, 1);
				
				if ((this.options.minDate == null || lastDate > this.options.minDate) && (this.options.maxDate == null || firstDate <= this.options.maxDate))
				{
					var monthData = [];
				
					for (var i = 0; i < this.options.dataSource.length; i++) {
						if (!(this.options.dataSource[i].startDate >= lastDate) || (this.options.dataSource[i].endDate < firstDate)) {
							monthData.push(this.options.dataSource[i]);
						}
					}
					
					if (monthData.length > 0) {
						month.querySelectorAll('.day-content').forEach(day => {
							var currentDate = new Date(this.options.startYear, monthId, day.textContent);
							var nextDate = new Date(this.options.startYear, monthId, currentDate.getDate() + 1);
							
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

	_renderDataSourceDay(elt, currentDate, events) {
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
					elt.parentNode.style.boxShadow = 'inset 0 -4px 0 0 black';
				}
				
				if (weight > 0)
				{
					var boxShadow = '';
				
					for (var i = 0; i < events.length; i++)
					{
						if (boxShadow != '') {
							boxShadow += ",";
						}
						
						boxShadow += 'inset 0 -' + (parseInt(i) + 1) * weight + 'px 0 0 ' + events[i].color;
					}
					
					elt.parentNode.style.boxShadow = boxShadow;
				}
				break;
		
			case 'background':
				elt.parentNode.style.backgroundColor = events[events.length - 1].color;
				
				var currentTime = currentDate.getTime();
				
				if (events[events.length - 1].startDate.getTime() == currentTime)
				{
					elt.parentNode.classList.add('day-start');
					
					if (events[events.length - 1].startHalfDay || this.options.alwaysHalfDay) {
						elt.parentNode.classList.add('day-half');
						
						// Find color for other half
						var otherColor = 'transparent';
						for (var i = events.length - 2; i >= 0; i--) {
							if (events[i].startDate.getTime() != currentTime || (!events[i].startHalfDay && !this.options.alwaysHalfDay)) {
								otherColor = events[i].color;
								break;
							}
						}
						
						elt.parentNode.style.background = `linear-gradient(-45deg, ${events[events.length - 1].color}, ${events[events.length - 1].color} 49%, ${otherColor} 51%, ${otherColor})`;
					}
					else if (this.options.roundRangeLimits) {
						elt.parentNode.classList.add('round-left');
					}
				}
				else if (events[events.length - 1].endDate.getTime() == currentTime)
				{
					elt.parentNode.classList.add('day-end');
					
					if (events[events.length - 1].endHalfDay || this.options.alwaysHalfDay) {
						elt.parentNode.classList.add('day-half');
						
						// Find color for other half
						var otherColor = 'transparent';
						for (var i = events.length - 2; i >= 0; i--) {
							if (events[i].endDate.getTime() != currentTime || (!events[i].endHalfDay &&  !this.options.alwaysHalfDay)) {
								otherColor = events[i].color;
								break;
							}
						}
						
						elt.parentNode.style.background = `linear-gradient(135deg, ${events[events.length - 1].color}, ${events[events.length - 1].color} 49%, ${otherColor} 51%, ${otherColor})`;
					}
					else if (this.options.roundRangeLimits) {
						elt.parentNode.classList.add('round-right');
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

	_applyEvents () {
		if (this.options.displayHeader) {
			/* Header buttons */
			this.element.querySelectorAll('.year-neighbor, .year-neighbor2').forEach(element => {
				element.addEventListener('click', e => {
					if (!e.currentTarget.classList.contains('disabled')) {
						this.setYear(parseInt(e.currentTarget.textContent));
					}
				});
			});
			
			this.element.querySelector('.calendar-header .prev').addEventListener('click', e => {
				if (!e.currentTarget.classList.contains('disabled')) {
					var months = this.element.querySelector('.months-container');

					months.style.transition = 'margin-left 0.1s';
					months.style.marginLeft = '100%';
					setTimeout(() => {
						months.style.visibility = 'hidden';
						months.style.transition = '';
						months.style.marginLeft = 0;

						setTimeout(() => { 
							this.setYear(this.options.startYear - 1);
						}, 50);
					}, 100);
				}
			});
			
			this.element.querySelector('.calendar-header .next').addEventListener('click', e => {
				if (!e.currentTarget.classList.contains('disabled')) {
					var months = this.element.querySelector('.months-container');

					months.style.transition = 'margin-left 0.1s';
					months.style.marginLeft = '-100%';
					setTimeout(() => {
						months.style.visibility = 'hidden';
						months.style.transition = '';
						months.style.marginLeft = 0;

						setTimeout(() => { 
							this.setYear(this.options.startYear + 1);
						}, 50);
					}, 100);
				}
			});
		}
		
		var cells = this.element.querySelectorAll('.day:not(.old):not(.new):not(.disabled)');
		
		cells.forEach(cell => {
			/* Click on date */
			cell.addEventListener('click', e => {
				e.stopPropagation();

				var date = this._getDate(e.currentTarget);
				this._triggerEvent('clickDay', {
					element: e.currentTarget,
					which: e.which,
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
						this._openContextMenu(e.currentTarget);
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
				cell.addEventListener('mousedown', e => {
					if (e.which == 1) {
						var currentDate = this._getDate(e.currentTarget);
					
						if (this.options.allowOverlap || this.getEvents(currentDate).length == 0)
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
									if (this.getEvents(nextDate).length > 0)
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
									if (this.getEvents(nextDate).length > 0)
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
		setInterval(() => {
			var calendarSize = this.element.offsetWidth;
			var monthSize = this.element.querySelector('.month').offsetWidth + 10;
			var col = null;
			
			if (monthSize * 6 < calendarSize) {
				col = 2;
			}
			else if (monthSize * 4 < calendarSize) {
				col = 3;
			}
			else if (monthSize * 3 < calendarSize) {
				col = 4
			}
			else if (monthSize * 2 < calendarSize) {
				col = 6
			}
			else {
				col = 12;
			}

			this.element.querySelectorAll('.month-container').forEach(month => {
				if (!month.classList.contains(`month-${col}`)) {
					month.classList.remove('month-2', 'month-3', 'month-4', 'month-6', 'month-12');
					month.classList.add(`month-${col}`);
				}
			});
		}, 300);
	}

	_refreshRange () {
		this.element.querySelectorAll('td.day.range').forEach(day => day.classList.remove('range'));
		this.element.querySelectorAll('td.day.range-start').forEach(day => day.classList.remove('range-start'));
		this.element.querySelectorAll('td.day.range-end').forEach(day => day.classList.remove('range-end'));

		if (this._mouseDown) {
			var minDate = this._rangeStart < this._rangeEnd ? this._rangeStart : this._rangeEnd;
			var maxDate = this._rangeEnd > this._rangeStart ? this._rangeEnd : this._rangeStart;

			this.element.querySelectorAll('.month-container').forEach(month => {
				var monthId = month.dataset.monthId;

				if (minDate.getMonth() <= monthId && maxDate.getMonth() >= monthId) {
					month.querySelectorAll('td.day:not(.old, .new)').forEach(day => {
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

	_openContextMenu(elt) {
		var contextMenu = document.querySelector('.calendar-context-menu');
		
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
			eventItem.style.borderLeft = `4px solid ${events[i].color}`;
			
			var eventItemContent = document.createElement('div');
			eventItemContent.classList.add('content');
			eventItemContent.textContent = events[i].name;
			
			eventItem.appendChild(eventItemContent);
			
			var icon = document.createElement('span');
			icon.innerHTML = "&rsaquo;";
			
			eventItem.appendChild(icon);
			
			this._renderContextMenuItems(eventItem, this.options.contextMenuItems, events[i]);
			
			contextMenu.appendChild(eventItem);
		}
		
		if (contextMenu.children.length > 0) {
			contextMenu.style.left = (elt.offsetLeft + 25) + 'px';
			contextMenu.style.top = (elt.offsetTop + 25) + 'px';
			contextMenu.style.display = 'block';
			
			window.addEventListener('mouseup', () => {
				contextMenu.style.display = 'none';
			}, { once: true });
		}
	}

	_renderContextMenuItems(parent, items, evt) {
		var subMenu = document.createElement('div');
		subMenu.classList.add('submenu');
		
		for (var i = 0; i < items.length; i++) {
			if (!items[i].visible || items[i].visible(evt)) {
				var menuItem = document.createElement('div');
				menuItem.classList.add('item');
				
				var menuItemContent = document.createElement('div');
				menuItemContent.classList.add('content');
				menuItemContent.textContent = items[i].text;
				
				menuItem.appendChild(menuItemContent);
				
				if (items[i].click) {
					(function(index) {
						menuItem.click(() => {
							items[index].click(evt);
						});
					})(i);
				}
				
				var icon = document.createElement('span');
				icon.innerHTML = "&rsaquo;";
				
				menuItem.appendChild(icon);
				
				if (items[i].items && items[i].items.length > 0) {
					this._renderContextMenuItems(menuItem, items[i].items, evt);
				}
				
				subMenu.appendChild(menuItem);
			}
		}
		
		if (subMenu.children.length > 0)
		{
			parent.appendChild(subMenu);
		}
	}

	_getDate(elt) {
		var day = elt.querySelectorAll(':scope > .day-content').textContent;
		var month = elt.closest('.month-container').dataset.monthId;
		var year = this.options.startYear;

		return new Date(year, month, day);
	}

	_triggerEvent(eventName, parameters) {
		var event = new Event(eventName);
		
		for (var i in parameters) {
			event[i] = parameters[i];
		}
		
		this.element.dispatchEvent(event);
		
		return event;
	}

	_isDisabled(date) {
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
	
	_isHidden(day) {
		if (this.options.hiddenWeekDays.length > 0) {
			for (var d = 0; d < this.options.hiddenWeekDays.length; d++) {
				if (day == this.options.hiddenWeekDays[d]) {
					return true;
				}
			}
		}
		
		return false;
	}

	getWeekNumber(date) {
		var tempDate = new Date(date.getTime());
		tempDate.setHours(0, 0, 0, 0);
		tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
		var week1 = new Date(tempDate.getFullYear(), 0, 4);
		return 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
	}

	getEvents(date) {
		return this.getEventsOnRange(date, new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
	}

	getEventsOnRange(startDate, endDate) {
		var events = [];
		
		if (this.options.dataSource && startDate && endDate) {
			for (var i = 0; i < this.options.dataSource.length; i++) {
				if (this.options.dataSource[i].startDate < endDate && this.options.dataSource[i].endDate >= startDate) {
					events.push(this.options.dataSource[i]);
				}
			}
		}
		
		return events;
	}

	getYear() {
		return this.options.startYear;
	}

	setYear(year) {
		var parsedYear = parseInt(year);
		if (!isNaN(parsedYear)) {
			this.options.startYear = parsedYear;
							
			// Clear the calendar (faster method)
			while (this.element.firstChild) {
				this.element.removeChild(this.element.firstChild);
			}
		
			if (this.options.displayHeader) {
				this._renderHeader();
			}
			
			var eventResult = this._triggerEvent('yearChanged', { currentYear: this.options.startYear, preventRendering: false });
			
			if (!eventResult.preventRendering) {
				this.render();
			}
		}
	}

	getMinDate() {
		return this.options.minDate;
	}

	setMinDate(date, preventRendering) {
		if (date instanceof Date) {
			this.options.minDate = date;
			
			if (!preventRendering) {
				this.render();
			}
		}
	}

	getMaxDate() {
		return this.options.maxDate;
	}

	setMaxDate(date, preventRendering) {
		if (date instanceof Date) {
			this.options.maxDate = date;
			
			if (!preventRendering) {
				this.render();
			}
		}
	}

	getStyle() {
		return this.options.style;
	}

	setStyle(style, preventRendering) {
		this.options.style = style == 'background' || style == 'border' || style == 'custom' ? style : 'border';
		
		if (!preventRendering) {
			this.render();
		}
	}

	getAllowOverlap() {
		return this.options.allowOverlap;
	}

	setAllowOverlap(allowOverlap) {
		this.options.allowOverlap = allowOverlap;
	}

	getDisplayWeekNumber() {
		return this.options.displayWeekNumber;
	}

	setDisplayWeekNumber(displayWeekNumber, preventRendering) {
		this.options.displayWeekNumber = displayWeekNumber;
		
		if (!preventRendering) {
			this.render();
		}
	}

	getDisplayHeader() {
		return this.options.displayHeader;
	}

	setDisplayHeader(displayHeader, preventRendering) {
		this.options.displayHeader = displayHeader;
		
		if (!preventRendering) {
			this.render();
		}
	}

	getDisplayDisabledDataSource() {
		return this.options.displayDisabledDataSource;
	}

	setDisplayDisabledDataSource(displayDisabledDataSource, preventRendering) {
		this.options.displayDisabledDataSource = displayDisabledDataSource;
		
		if (!preventRendering) {
			this.render();
		}
	}

	getAlwaysHalfDay() {
		return this.options.alwaysHalfDay;
	}

	setAlwaysHalfDay(alwaysHalfDay, preventRendering) {
		this.options.alwaysHalfDay = alwaysHalfDay;
		
		if (!preventRendering) {
			this.render();
		}
	}

	getEnableRangeSelection() {
		return this.options.enableRangeSelection;
	}

	setEnableRangeSelection(enableRangeSelection, preventRendering) {
		this.options.enableRangeSelection = enableRangeSelection;
		
		if (!preventRendering) {
			this.render();
		}
	}

	getDisabledDays() {
		return this.options.disabledDays;
	}

	setDisabledDays(disabledDays, preventRendering) {
		this.options.disabledDays = disabledDays instanceof Array ? disabledDays : [];
		
		if (!preventRendering) {
			this.render();
		}
	}

	getDisabledWeekDays() {
		return this.options.disabledWeekDays;
	}

	setDisabledWeekDays(disabledWeekDays, preventRendering) {
		this.options.disabledWeekDays = disabledWeekDays instanceof Array ? disabledWeekDays : [];
		
		if (!preventRendering) {
			this.render();
		}
	}

	getHiddenWeekDays() {
		return this.options.hiddenWeekDays;
	}

	setHiddenWeekDays(hiddenWeekDays, preventRendering) {
		this.options.hiddenWeekDays = hiddenWeekDays instanceof Array ? hiddenWeekDays : [];
		
		if (!preventRendering) {
			this.render();
		}
	}

	getRoundRangeLimits() {
		return this.options.roundRangeLimits;
	}

	setRoundRangeLimits(roundRangeLimits, preventRendering) {
		this.options.roundRangeLimits = roundRangeLimits;
		
		if (!preventRendering) {
			this.render();
		}
	}

	getEnableContextMenu() {
		return this.options.enableContextMenu;
	}

	setEnableContextMenu(enableContextMenu, preventRendering) {
		this.options.enableContextMenu = enableContextMenu;
		
		if (!preventRendering) {
			this.render();
		}
	}

	getContextMenuItems() {
		return this.options.contextMenuItems;
	}

	setContextMenuItems(contextMenuItems, preventRendering) {
		this.options.contextMenuItems = contextMenuItems instanceof Array ? contextMenuItems : [];
		
		if (!preventRendering) {
			this.render();
		}
	}

	getCustomDayRenderer() {
		return this.options.customDayRenderer;
	}

	setCustomDayRenderer(customDayRenderer, preventRendering) {
		this.options.customDayRenderer = typeof customDayRenderer === "function" ? customDayRenderer : null;
		
		if (!preventRendering) {
			this.render();
		}
	}

	getCustomDataSourceRenderer() {
		return this.options.customDataSourceRenderer;
	}

	setCustomDataSourceRenderer(customDataSourceRenderer, preventRendering) {
		this.options.customDataSourceRenderer = typeof customDataSourceRenderer === "function" ? customDataSourceRenderer : null;
		
		if (!preventRendering) {
			this.render();
		}
	}

	getLanguage() {
		return this.options.language;
	}

	setLanguage(language, preventRendering) {
		if (language != null && Calendar.locales[language] != null) {
			this.options.language = language;
			
			if (!preventRendering) {
				this.render();
			}
		}
	}

	getDataSource() {
		return this.options.dataSource;
	}

	setDataSource(dataSource, preventRendering) {
		this.options.dataSource = dataSource instanceof Array ? dataSource : [];
		this._initializeDatasourceColors();
		
		if (!preventRendering) {
			this.render();
		}
	}

	getWeekStart() {
		return this.options.weekStart ? this.options.weekStart : Calendar.locales[this.options.language].weekStart;
	}

	setWeekStart(weekStart, preventRendering) {
		this.options.weekStart = !isNaN(parseInt(weekStart)) ? parseInt(weekStart) : null;

		if (!preventRendering) {
			this.render();
		}
	}

	addEvent(evt, preventRendering) {
		this.options.dataSource.push(evt);
		
		if (!preventRendering) {
			this.render();
		}
	}
};

if (typeof window === "object") {
	window.Calendar = Calendar;

	document.addEventListener("DOMContentLoaded", () => { 
		document.querySelectorAll('[data-provide="calendar"]').forEach(element => new Calendar(element));
	});
}