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
			
		this.element.empty();
		this._renderHeader();
		this._renderYear();
		this._renderMonth();
	};
 
	Calendar.prototype = {
		constructor: Calendar,
		_renderHeader: function() {
			var header = $(document.createElement('table'));
			header.addClass('calendar-header');
			
			var prevDiv = $(document.createElement('th'));
			prevDiv.addClass('prev');
			
			var prevIcon = $(document.createElement('span'));
			prevIcon.addClass('glyphicon glyphicon-chevron-left');
			
			prevDiv.append(prevIcon);
			
			header.append(prevDiv);
			
			var titleDiv = $(document.createElement('th'));
			titleDiv.addClass('year-title');
			titleDiv.text(this.options.startYear);
			
			header.append(titleDiv);
			
			var nextDiv = $(document.createElement('th'));
			nextDiv.addClass('next');
			
			var nextIcon = $(document.createElement('span'));
			nextIcon.addClass('glyphicon glyphicon-chevron-right');
			
			nextDiv.append(nextIcon);
			
			header.append(nextDiv);
			
			this.element.append(header);
		},
		_renderYear: function() {
			for(var i = 0; i < 12; i++) {
				var monthDiv = $(document.createElement('div'));
				monthDiv.addClass('month-container col-lg-2 col-md-3 col-sm-3 col-xs-4')
				monthDiv.data('monthId', i);
				this.element.append(monthDiv);
			}
		},
		_renderMonth: function() {
			var _this = this;
		
			this.element.children('.month-container').each(function() {
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
				
				while(currentDate.getUTCDay() != dates[_this.options.language].weekStart)
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
						cell.text(currentDate.getDate());
						
						if(currentDate < firstDate) {
							cell.addClass('old');
							debugger
						}
						else if(currentDate > lastDate) {
							cell.addClass('new');
						}
						
						row.append(cell);
						
						currentDate.setDate(currentDate.getDate() + 1);
					}
					while(currentDate.getUTCDay() != dates[_this.options.language].weekStart)
					
					table.append(row);
				}
				
				$(this).append(table);
			});
		},
			if (!date)
				return '';
			var val = {
				d: date.getUTCDate(),
				D: dates[this.options.language].daysShort[date.getUTCDay()],
				DD: dates[this.options.language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[this.options.language].monthsShort[date.getUTCMonth()],
				MM: dates[this.options.language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
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