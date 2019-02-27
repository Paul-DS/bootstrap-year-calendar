/**
 * Represent a context menu item for the calendar.
 */
export default interface CalendarContextMenuItem<T> {
    /**
     * The text of the menu item.
     */
    text: string;

    /**
     * A function to be called when the item is clicked.
     */
    click?: (event: T) => void;

    /**
     * The list of sub menu items.
     */
    items?: CalendarContextMenuItem<T>[];

     /**
     * Indicates if the item should be visible
     */
    visible?: boolean | Function;
}
