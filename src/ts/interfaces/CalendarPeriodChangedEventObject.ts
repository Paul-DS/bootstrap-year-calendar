export default interface CalendarPeriodChangedEventObject {
    /**
     * The beginning of the new period.
     */
    startDate: Date;

    /**
     * The end of the new period.
     */
    endDate: Date;
	
	/**
     * Indicates whether the automatic render after period changing must be prevented.
     */
    preventRendering: boolean;
}