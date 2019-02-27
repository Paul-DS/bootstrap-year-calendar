export default interface CalendarYearChangedEventObject {
    /**
     * The new year.
     */
    currentYear: number;
	
	/**
     * Indicates whether the automatic render after year changing must be prevented.
     */
    preventRendering: boolean;
}