import CalendarDataSourceElement from './CalendarDataSourceElement'
import CalendarDayEventObject from './CalendarDayEventObject'

export default interface CalendarClickEventObject<T extends CalendarDataSourceElement> extends CalendarDayEventObject<T> {
    /**
     * The clicked button.
     */
    which: number;
}