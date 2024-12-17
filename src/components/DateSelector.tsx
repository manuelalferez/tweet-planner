import React, { forwardRef } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format, addDays, startOfDay } from 'date-fns';

interface DateSelectorProps {
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string;
}

export const DateSelector = forwardRef<HTMLSelectElement, DateSelectorProps>(
  ({ onChange, defaultValue }, ref) => {
    const generateDates = () => {
      const dates = [];
      const today = startOfDay(new Date());

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

    const dates = generateDates();
    const defaultDate = dates[0].value;

    return (
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-gray-400" />
        <select
          ref={ref}
          className="w-full p-2 border rounded-lg"
          defaultValue={defaultValue || defaultDate}
          onChange={onChange}
        >
          {dates.map(({ value, label }) => (
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