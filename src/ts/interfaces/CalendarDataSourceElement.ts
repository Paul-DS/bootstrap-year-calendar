/**
 * Represent an element to display in the calendar.
 */
export default interface CalendarDataSourceElement {
	/**
     * The name of the element. Used for context menu or specific events.
     */
    name?: string;

    /**
     * The color of the element. This property will be computed automatically if not defined.
     */
    color?: string;
	
    /**
     * The date of the beginning of the element range.
     */
    startDate: Date;

    /**
     * The date of the end of the element range.
     */
    endDate: Date;
	
	/**
     * Indicates whether only the half of start day of the element range should be rendered.
     */
    startHalfDay?: boolean;

    /**
     * Indicates whether only the half of last day of the element range should be rendered.
     */
    endHalfDay?: boolean;
}