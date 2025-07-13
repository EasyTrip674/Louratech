import React from 'react';

type DatePickerProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  className?: string;
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, className }) => {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <input
        type="date"
        value={value ? value.toISOString().substring(0, 10) : ''}
        onChange={e => {
          const val = e.target.value;
          onChange(val ? new Date(val) : null);
        }}
        className="input-filter"
      />
    </div>
  );
};

export default DatePicker; 