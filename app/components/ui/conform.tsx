import * as React from 'react';
import { useState } from 'react';
import { type FieldMetadata } from '@conform-to/react';
import { cn } from '~/lib/utils';
import { Combobox } from './combobox';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './form';
import { Input } from './input';
import { MinutesSecondsInput } from './minutes-seconds-input';
import { MultiSelect } from './multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Textarea } from './textarea';
import { ToggleGroup } from './toggle-group';

interface FormFieldProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  meta: FieldMetadata<T>;
  label?: string;
  description?: string;
  type?: string;
}

export function ConformInput<T extends string | string[] | number | undefined>({
  meta,
  label,
  description,
  className,
  type,
  ...props
}: FormFieldProps<T>) {
  return (
    <FormItem className={className} {...props}>
      {label && <FormLabel htmlFor={meta.id}>{label}</FormLabel>}
      <FormControl>
        <Input
          name={meta.name}
          id={meta.id}
          defaultValue={meta.initialValue?.toString()}
          required={meta.required}
          aria-invalid={Boolean(meta.errors)}
          type={type}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{meta.errors}</FormMessage>
    </FormItem>
  );
}

export function ConformTextarea<T extends string | string[] | number | undefined>({
  meta,
  label,
  description,
  className,
  ...props
}: FormFieldProps<T>) {
  return (
    <FormItem className={className} {...props}>
      {label && <FormLabel htmlFor={meta.id}>{label}</FormLabel>}
      <FormControl>
        <Textarea
          name={meta.name}
          id={meta.id}
          defaultValue={meta.initialValue?.toString()}
          required={meta.required}
          aria-invalid={Boolean(meta.errors)}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{meta.errors}</FormMessage>
    </FormItem>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface ConformSelectProps<T extends string | undefined> extends FormFieldProps<T> {
  options: SelectOption[];
  placeholder?: string;
}

export function ConformSelect<T extends string | undefined>({
  meta,
  label,
  description,
  options,
  placeholder,
  className,
  ...props
}: ConformSelectProps<T>) {
  return (
    <FormItem className={className} {...props}>
      {label && <FormLabel htmlFor={meta.id}>{label}</FormLabel>}
      <Select name={meta.name} defaultValue={meta.initialValue?.toString()}>
        <FormControl>
          <SelectTrigger id={meta.id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{meta.errors}</FormMessage>
    </FormItem>
  );
}

interface ConformMultiSelectProps<T extends string[] | undefined> extends FormFieldProps<T> {
  options: SelectOption[];
  placeholder?: string;
  maxCount?: number;
  onValueChange?: (values: string[]) => void;
}

export function ConformMultiSelect<T extends string[] | undefined>({
  meta,
  label,
  description,
  options,
  placeholder,
  maxCount,
  className,
  onValueChange,
  ...props
}: ConformMultiSelectProps<T>) {
  return (
    <FormItem className={className} {...props}>
      {label && <FormLabel htmlFor={meta.id}>{label}</FormLabel>}
      <FormControl>
        <MultiSelect
          name={meta.name}
          id={meta.id}
          options={options}
          defaultValue={
            typeof meta.initialValue === 'string'
              ? meta.initialValue.split(',')
              : (meta.initialValue as string[])
          }
          placeholder={placeholder}
          maxCount={maxCount}
          onValueChange={onValueChange}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{meta.errors}</FormMessage>
    </FormItem>
  );
}

interface ConformComboboxProps<T extends string | undefined> extends FormFieldProps<T> {
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function ConformCombobox<T extends string | undefined>({
  meta,
  label,
  description,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  className,
  ...props
}: ConformComboboxProps<T>) {
  return (
    <FormItem className={className} {...props}>
      {label && <FormLabel htmlFor={meta.id}>{label}</FormLabel>}
      <FormControl>
        <Combobox
          options={options}
          value={meta.initialValue ? [meta.initialValue.toString()] : []}
          onSelect={value => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = meta.name;
            input.value = value;
            input.form?.requestSubmit();
          }}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{meta.errors}</FormMessage>
    </FormItem>
  );
}

export function ConformMinutesSecondsInput<T extends string | undefined>({
  meta,
  label,
  description,
  className,
  numberOfRounds,
  ...props
}: FormFieldProps<T> & { numberOfRounds: number }) {
  const initialValues = meta.initialValue ? JSON.parse(meta.initialValue as string) : {};
  const [scores, setScores] = useState<{ [key: number]: number }>(initialValues);

  return (
    <FormItem className={className} {...props}>
      <input type="hidden" name={meta.name} value={JSON.stringify(scores)} />
      {label && <FormLabel htmlFor={meta.id}>{label}</FormLabel>}
      <FormControl>
        <div className="flex flex-col gap-4">
          {Array.from({ length: !!numberOfRounds ? numberOfRounds : 1 }).map((_, index) => (
            <MinutesSecondsInput
              key={`${meta.id}-${index}`}
              defaultValue={initialValues?.[index] ?? undefined}
              onChange={({ minutes, seconds }) => {
                console.log(minutes, seconds);
                setScores(prev => ({ ...prev, [index]: (minutes ?? 0) * 60 + (seconds ?? 0) }));
              }}
            />
          ))}
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{meta.errors}</FormMessage>
    </FormItem>
  );
}

export function ConformToggleGroup<T extends string | undefined>({
  meta,
  label,
  description,
  className,
  children,
  size,
  ...props
}: FormFieldProps<T> & { children: React.ReactNode; size?: 'default' | 'sm' | 'lg' }) {

  console.log({value: meta.value})
  return (
    <FormItem className={cn('flex flex-col gap-2', className)} {...props}>
      {label && <FormLabel htmlFor={meta.id}>{label}</FormLabel>}
      <FormControl>
        <ToggleGroup
          type="single"
          size={size}
          className="w-fit"
        >
          {children}
        </ToggleGroup>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{meta.errors}</FormMessage>
    </FormItem>
  );
}
