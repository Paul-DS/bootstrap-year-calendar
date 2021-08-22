import CalendarDataSourceElement from './CalendarDataSourceElement'
import CalendarContextMenuItem from './CalendarContextMenuItem'
import CalendarDayEventObject from './CalendarDayEventObject'
import CalendarRenderEndEventObject from './CalendarRenderEndEventObject'
import CalendarRangeEventObject from './CalendarRangeEventObject'
import CalendarYearChangedEventObject from './CalendarYearChangedEventObject'
import CalendarPeriodChangedEventObject from './CalendarPeriodChangedEventObject'

/**
 * Options used for calendar customization.
 */
export default interface CalendarOptions<T extends CalendarDataSourceElement> {

    /**
     * Specifies whether the user can select a range which overlapping an other element present in the datasource.
     */
    allowOverlap?: boolean;

	/**
     * Specifies whether the beginning and the end of each range should be displayed as half selected day.
     */
    alwaysHalfDay?: boolean;
	
    /**
     * Specifies the items of the default context menu.
     */
    contextMenuItems?: CalendarContextMenuItem<T>[];
	
	/**
     * Specify a custom renderer for days.
     * 
     * The HTML Element passed in parameter represent a sub element of the "day" div. If you need to access the "day" div, use `element.parentElement`.
     * 
	 * This function is called during render for each day.
     */
    customDayRenderer?: (element: HTMLElement, currentDate: Date) => void;
	
	/**
     * Specify a custom renderer for data source. Works only with the style set to "custom".
     * 
     * The HTML Element passed in parameter represent a sub element of the "day" div. If you need to access the "day" div, use `element.parentElement`.
     * 
	 * This function is called during render for each day containing at least one event.
     */
    customDataSourceRenderer?: (element: HTMLElement, currentDate: Date, events: T[]) => void;

    /**
     * The elements that must be displayed on the calendar.
     * 
     * Could be:
     * - The datasource
     * - A function that returns the datasource
     * - An async function that will call the callback function with the datasource
     * - An async function that returns a Promise to get the datasource
     */
    dataSource?: T[] | ((currentYear: number) => T[] | Promise<T[]>) | ((currentYear: number, done: (result: T[]) => void) => void);

    /**
     * The days that must be displayed as disabled.
     */
    disabledDays?: Date[];
	
	/**
     * The days of the week that must be displayed as disabled (0 for Sunday, 1 for Monday, etc.).
     */
    disabledWeekDays?: number[];
	
	/**
     * The days of the week that must not be displayed (0 for Sunday, 1 for Monday, etc.).
     */
    hiddenWeekDays?: number[];

	/**
     * Specifies whether the data source must be rendered on disabled days.
     */
    displayDisabledDataSource?: boolean;
	
    /**
     * Specifies whether the weeks number are displayed.
     */
    displayWeekNumber?: boolean;
	
	/**
     * Specifies whether the calendar header is displayed.
     */
    displayHeader?: boolean;

    /**
     * Specifies whether the default context menu must be displayed when right clicking on a day.
     */
    enableContextMenu?: boolean;

    /**
     * Specifies whether the range selection is enabled.
     */
    enableRangeSelection?: boolean;

    /**
     * The language/culture used for calendar rendering.
     * Don't forget to import the corresponding language file. For more information, check the language section of the readme.
     */
    language?: string;

    /**
     * The HTML used to render the loading component.
     */
    loadingTemplate: string | HTMLElement;

    /**
     * The date until which days are enabled.
     */
    maxDate?: Date;

    /**
     * The date from which days are enabled.
     */
    minDate?: Date;

    /**
     * The number of months displayed by the calendar.
     */
    numberMonthsDisplayed?: number;
	
	/**
     * Specifies whether the beginning and the end of each range should be displayed as rounded cells.
     */
    roundRangeLimits?: boolean;

    /**
     * The date on which the calendar should be opened.
     * The day is not considered (only the month and the year).
     */
    startDate?: Date;

    /**
     * The year on which the calendar should be opened.
     * If `startDate` is provided, this option will be ignored.
     */
    startYear?: number;

    /**
     * Specifies the style used for displaying datasource ("background", "border" or "custom").
     */
    style?: string;
	
	/**
     * The starting day of the week. This option overrides the parameter define in the language file.
     */
    weekStart?: number;
	
    /**
     * Function fired when a day is clicked.
     */
    clickDay?: (e: CalendarDayEventObject<T>) => void;

    /**
     * Function fired when a day is right clicked.
     */
    dayContextMenu?: (e: CalendarDayEventObject<T>) => void;

    /**
     * Function fired when the mouse enter on a day.
     */
    mouseOnDay?: (e: CalendarDayEventObject<T>) => void;

    /**
     * Function fired when the mouse leaves a day.
     */
    mouseOutDay?: (e: CalendarDayEventObject<T>) => void;

    /**
     * Function fired when the calendar rendering is ended.
     */
    renderEnd?: (e: CalendarRenderEndEventObject) => void;

    /**
     * Function fired when a date range is selected.
     */
    selectRange?: (e: CalendarRangeEventObject) => void;
    
    /**
     * Function fired when the visible year of the calendar is changed.
     * This function will be fired only if the calendar is used in a full year mode. Otherwise, use `periodChanged` event.
     */
    yearChanged?: (e: CalendarYearChangedEventObject) => void;

	/**
     * Function fired when the visible period of the calendar is changed.
     */
    periodChanged?: (e: CalendarPeriodChangedEventObject) => void;
}