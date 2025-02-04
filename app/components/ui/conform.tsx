import * as React from "react";
import { type FieldConfig } from "@conform-to/react";
import { Input } from "./input";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { MultiSelect } from "./multi-select";
import { Combobox } from "./combobox";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

interface FormFieldProps<T extends string | string[] | number | undefined> extends React.HTMLAttributes<HTMLDivElement> {
  config: FieldConfig<T>;
  label?: string;
  description?: string;
  type?: string;
}

export function ConformInput<T extends string | string[] | number | undefined>({
  config,
  label,
  description,
  className,
	type,
  ...props
}: FormFieldProps<T>) {
  return (
    <FormItem className={className} {...props}>
      {label && <FormLabel htmlFor={config.id}>{label}</FormLabel>}
      <FormControl>
        <Input 
          name={config.name}
          id={config.id}
          defaultValue={config.defaultValue}
          required={config.required}
          aria-invalid={Boolean(config.error)}
          type={type}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{config.error}</FormMessage>
    </FormItem>
  );
}

export function ConformTextarea<T extends string | string[] | number | undefined>({
  config,
  label,
  description,
  className,
  ...props
}: FormFieldProps<T>) {
  return (
    <FormItem className={className} {...props}>
      {label && <FormLabel htmlFor={config.id}>{label}</FormLabel>}
      <FormControl>
        <Textarea 
          name={config.name}
          id={config.id}
          defaultValue={config.defaultValue}
          required={config.required}
          aria-invalid={Boolean(config.error)}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{config.error}</FormMessage>
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
  config,
  label,
  description,
  options,
  placeholder,
  className,
  ...props
}: ConformSelectProps<T>) {
  return (
    <FormItem className={className} {...props}>
      {label && <FormLabel htmlFor={config.id}>{label}</FormLabel>}
      <Select
        name={config.name}
        defaultValue={config.defaultValue}
      >
        <FormControl>
          <SelectTrigger id={config.id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{config.error}</FormMessage>
    </FormItem>
  );
}

interface ConformMultiSelectProps<T extends string[] | undefined> extends FormFieldProps<T> {
  options: SelectOption[];
  placeholder?: string;
  maxCount?: number;
	onValueChange?: (values: string[]) => void;
}

export function ConformMultiSelect<T extends  string[] | undefined>({
  config,
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
      {label && <FormLabel htmlFor={config.id}>{label}</FormLabel>}
      <FormControl>
        <MultiSelect
          name={config.name}
          id={config.id}
          options={options}
          defaultValue={typeof config.defaultValue === "string" ? config.defaultValue?.split(",") : config.defaultValue}
          placeholder={placeholder}
          maxCount={maxCount}
          onValueChange={onValueChange}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{config.error}</FormMessage>
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
  config,
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
      {label && <FormLabel htmlFor={config.id}>{label}</FormLabel>}
      <FormControl>
        <Combobox
          options={options}
          value={config.defaultValue ? [config.defaultValue] : []}
          onSelect={(value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = config.name;
            input.value = value;
            input.form?.requestSubmit();
          }}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{config.error}</FormMessage>
    </FormItem>
  );
} 