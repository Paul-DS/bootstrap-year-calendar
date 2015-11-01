/* =========================================================
 * bootstrap-simple-calender.js
 * Repo: https://github.com/Paul-DS/bootstrap-simple-calendar
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
 
 (function($) {
	var Calendar = function(element, options) {
		this.element = element;
		this.options = options;
			
		this.element.addClass('calendar');
		this._render();
	};
 
	Calendar.prototype = {
		constructor: Calendar,
		_render: function() {
			this.element.empty();
			this._renderHeader();
			this._renderYear();
			this.element.find('.months-container').hide();
			this._renderMonth();
			this._applyEvents();
			this.element.find('.months-container').fadeIn(500);
		},
		_renderHeader: function() {
			var header = $(document.createElement('div'));
			header.addClass('calendar-header panel panel-default');
			
			var headerTable = $(document.createElement('table'));
			
			var prevDiv = $(document.createElement('th'));
			prevDiv.addClass('prev');
			
			var prevIcon = $(document.createElement('span'));
			prevIcon.addClass('glyphicon glyphicon-chevron-left');
			
			prevDiv.append(prevIcon);
			
			headerTable.append(prevDiv);
			
			var prev2YearDiv = $(document.createElement('th'));
			prev2YearDiv.addClass('year-title year-neighbor2 hidden-sm hidden-xs');
			prev2YearDiv.text(this.options.startYear - 2);
			
			headerTable.append(prev2YearDiv);
			
			var prevYearDiv = $(document.createElement('th'));
			prevYearDiv.addClass('year-title year-neighbor hidden-xs');
			prevYearDiv.text(this.options.startYear - 1);
			
			headerTable.append(prevYearDiv);
			
			var yearDiv = $(document.createElement('th'));
			yearDiv.addClass('year-title');
			yearDiv.text(this.options.startYear);
			
			headerTable.append(yearDiv);
			
			var nextYearDiv = $(document.createElement('th'));
			nextYearDiv.addClass('year-title year-neighbor hidden-xs');
			nextYearDiv.text(this.options.startYear + 1);
			
			headerTable.append(nextYearDiv);
			
			var next2YearDiv = $(document.createElement('th'));
			next2YearDiv.addClass('year-title year-neighbor2 hidden-sm hidden-xs');
			next2YearDiv.text(this.options.startYear + 2);
			
			headerTable.append(next2YearDiv);
			
			var nextDiv = $(document.createElement('th'));
			nextDiv.addClass('next');
			
			var nextIcon = $(document.createElement('span'));
			nextIcon.addClass('glyphicon glyphicon-chevron-right');
			
			nextDiv.append(nextIcon);
			
			headerTable.append(nextDiv);
			
			header.append(headerTable);
			
			this.element.append(header);
		},
		_renderYear: function() {
			var monthsDiv = $(document.createElement('div'));
			monthsDiv.addClass('months-container');
			
			for(var i = 0; i < 12; i++) {
				var monthDiv = $(document.createElement('div'));
				monthDiv.addClass('month-container col-lg-2 col-md-3 col-sm-3 col-xs-4')
				monthDiv.data('monthId', i);
				monthsDiv.append(monthDiv);
			}
			
			this.element.append(monthsDiv);
		},
		_renderMonth: function() {
			var _this = this;
		
			this.element.children('.months-container').children('.month-container').each(function() {
				var monthNumber = $(this).data('monthId');
				
				var firstDate = new Date(_this.options.startYear, monthNumber, 1);
				
				var table = $(document.createElement('table'));
				table.addClass('month');
				
				var thead = $(document.createElement('thead'));
				
				var titleRow = $(document.createElement('tr'));
				
				var titleCell = $(document.createElement('th'));
				titleCell.addClass('month-title');
				titleCell.attr('colspan', 7);
				titleCell.text(dates[_this.options.language].months[monthNumber]);
				
				titleRow.append(titleCell);
				thead.append(titleRow);
				
				var headerRow = $(document.createElement('tr'));
				
				var d = dates[_this.options.language].weekStart;
				do
				{
					var headerCell = $(document.createElement('th'));
					headerCell.text(dates[_this.options.language].daysMin[d]);
					
					headerRow.append(headerCell);
					
					d++;
					if(d >= 7)
						d = 0;
				}
				while(d != dates[_this.options.language].weekStart)
				
				thead.append(headerRow);
				table.append(thead);
				
				var currentDate = new Date(firstDate.getTime());
				var lastDate = new Date(_this.options.startYear, monthNumber + 1, 0);
				
				while(currentDate.getDay() != dates[_this.options.language].weekStart)
				{
					currentDate.setDate(currentDate.getDate() - 1);
				}
				
				while(currentDate < lastDate)
				{
					var row = $(document.createElement('tr'));
				
					do
					{
						var cell = $(document.createElement('td'));
						cell.addClass('day');
						
						if(currentDate < firstDate) {
							cell.addClass('old');
						}
						else if(currentDate > lastDate) {
							cell.addClass('new');
						}
						else {
							cell.text(currentDate.getDate());
						}
						
						row.append(cell);
						
						currentDate.setDate(currentDate.getDate() + 1);
					}
					while(currentDate.getDay() != dates[_this.options.language].weekStart)
					
					table.append(row);
				}
				
				$(this).append(table);
			});
		},
		_applyEvents: function () {
			var _this = this;
			this.element.find('.year-neighbor, .year-neighbor2').click(function() {
				_this.setYear(parseInt($(this).text()));
			});
			
			this.element.find('.calendar-header .prev').click(function() {
				_this.element.find('.months-container').animate({'margin-left':'100%'},100, function() {
					_this.element.find('.months-container').hide();
					_this.element.find('.months-container').css('margin-left', '0');
					_this.setYear(_this.options.startYear - 1);
				});
				
			});
			
			this.element.find('.calendar-header .next').click(function() {
				_this.element.find('.months-container').animate({'margin-left':'-100%'},100, function() {
					_this.element.find('.months-container').hide();
					_this.element.find('.months-container').css('margin-left', '0');
					_this.setYear(_this.options.startYear + 1);
				});
			});
		},
		setYear: function(year) {
			this.options.startYear = year;
			this._render();
		}
	}
 
	$.fn.calendar = function (options) {
		var calendar = new Calendar($(this) ,options);
		$(this).data('calendar', calendar);
	}
	
	var dates = $.fn.calendar.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		}
	};
 }(window.jQuery));