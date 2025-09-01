import { forwardRef, InputHTMLAttributes } from 'react';
import { DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

/**
 * Currency input component with proper formatting and validation
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, error, ...props }, ref) => {
    const handleInput = (e: import('react').FormEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      let value = target.value;

      // Remove any non-digit and non-decimal characters
      value = value.replace(/[^0-9.]/g, '');

      // Ensure only one decimal point
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
      }

      // Limit to 2 decimal places
      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].slice(0, 2);
      }

      target.value = value;
      
      // Call original onChange if provided
      if (props.onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...target, value },
        } as import('react').ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }
    };

    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          className={cn(
            'pl-9',
            error && 'border-destructive',
            className
          )}
          onInput={handleInput}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

/**
 * Format number as currency for display
 */
export function formatCurrency(
  amount: number | string,
  currencyCode = 'USD',
  locale = 'en-US'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '$0.00';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
