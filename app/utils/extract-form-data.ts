import { output, z, ZodTypeAny } from 'zod';

import { workoutSchema } from '~/schemas/models';

type ParsedData<T extends ZodTypeAny> = output<T>;

export function extractFormData<T extends ZodTypeAny>(
  zodSchema: T,
  formData: FormData
): ParsedData<T> {
  const data = [...formData.entries()].reduce<
    Record<string, FormDataEntryValue | FormDataEntryValue[]>
  >(
    (data, [key, value]) => ({
      ...data,
      [key]:
        key in data
          ? Array.isArray(data[key])
            ? [...data[key], value]
            : [data[key], value]
          : value,
    }),
    {}
  );

  return zodSchema.parse(data);
}
