import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addDays, endOfWeek, addWeeks } from 'date-fns';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ selected, onSelect, placeholder = "Pick a date", className = '' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onSelect(date);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelect(undefined);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      >
        {selected ? format(selected, 'PPP') : placeholder}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-md">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Select Due Date
          </h3>

          {/* Quick Date Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelect(new Date())}
              className="text-left justify-start"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelect(addDays(new Date(), 1))}
              className="text-left justify-start"
            >
              Tomorrow
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelect(endOfWeek(new Date()))}
              className="text-left justify-start"
            >
              This Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelect(endOfWeek(addWeeks(new Date(), 1)))}
              className="text-left justify-start"
            >
              Next Week
            </Button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            className="border-0"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />

          <div className="flex justify-between">
            <Button variant="ghost" onClick={handleClear}>
              Clear Date
            </Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}