import CalendarDataSourceElement from './CalendarDataSourceElement'

export default interface CalendarDayEventObject<T extends CalendarDataSourceElement> {
    /**
     * The element that contain the fired day.
     */
    element: HTMLElement;

    /**
     * The fired date.
     */
    date: Date;
	
	/**
     * The data source elements present on the fired day.
     */
    events: T[];
}