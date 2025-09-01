import { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
  disabled?: boolean;
}

/**
 * Date picker component with HTML5 date input
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, value, onChange, placeholder = 'Select date', error, disabled, ...props }, ref) => {
    const handleChange = (e: import('react').ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value;
      onChange?.(date);
    };

    // Convert ISO string to date input format (YYYY-MM-DD)
    const inputValue = value ? format(new Date(value), 'yyyy-MM-dd') : '';

    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          ref={ref}
          type="date"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'pl-9',
            error && 'border-destructive',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

/**
 * Get today's date in ISO format
 */
export function getTodayISO(): string {
  return new Date().toISOString();
}

/**
 * Format date for display
 */
export function formatDisplayDate(date: string): string {
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
}

/**
 * Check if date is today
 */
export function isToday(date: string): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === yesterday.getDate() &&
    checkDate.getMonth() === yesterday.getMonth() &&
    checkDate.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Get relative date string (Today, Yesterday, or formatted date)
 */
export function getRelativeDateString(date: string): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDisplayDate(date);
}
