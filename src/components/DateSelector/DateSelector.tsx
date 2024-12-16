import React, { forwardRef } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format, addDays } from 'date-fns';

interface DateSelectorProps {
  defaultValue?: string;
}

export const DateSelector = forwardRef<HTMLSelectElement, DateSelectorProps>(
  ({ defaultValue }, ref) => {
    const generateDates = () => {
      const dates = [];
      const today = new Date();

      for (let i = 0; i < 8; i++) {
        const date = addDays(today, i);
        dates.push({
          value: date.toISOString(),
          label: i === 0 ? 'Today' : 
                 i === 1 ? 'Tomorrow' : 
                 format(date, 'EEEE, MMM d')
        });
      }

      return dates;
    };

    return (
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-gray-400" />
        <select
          ref={ref}
          defaultValue={defaultValue}
          className="flex-1 p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {generateDates().map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

DateSelector.displayName = 'DateSelector'; 