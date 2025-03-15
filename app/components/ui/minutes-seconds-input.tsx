import { useId, useState } from 'react';
import { scoreToMinutesAndSeconds } from '~/utils/scoreToMinutesSeconds';
import { Input } from './input';
import { Label } from './label';

export function MinutesSecondsInput({
  defaultValue = 0,
  onChange,
}: {
  defaultValue?: number;
  onChange: (value: { minutes: number; seconds: number }) => void;
}) {
  const id = useId();
  const { minutes: defaultMinutes, seconds: defaultSeconds } =
    scoreToMinutesAndSeconds(defaultValue);
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [seconds, setSeconds] = useState(defaultSeconds);

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let newValue;
    if (rawValue === '' || rawValue === undefined) {
      newValue = 0;
    } else {
      newValue = Number(rawValue);
    }
    setMinutes(newValue);
    onChange({ minutes: newValue, seconds });
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let newValue;
    if (rawValue === '' || rawValue === undefined) {
      newValue = 0;
    } else {
      newValue = Number(rawValue);
    }
    setSeconds(newValue);
    onChange({ minutes, seconds: newValue });
  };

  return (
    <div className="flex gap-4 w-full">
      <div className="w-24">
        <Label htmlFor={`${id}-minutes`}>Minutes</Label>
        <Input
          type="number"
          min={0}
          id={`${id}-minutes`}
          value={minutes}
          onChange={handleMinutesChange}
          className="w-full"
        />
      </div>
      <div className="w-24">
        <Label htmlFor={`${id}-seconds`}>Seconds</Label>
        <Input
          type="number"
          min={0}
          max={59}
          id={`${id}-seconds`}
          value={seconds}
          onChange={handleSecondsChange}
          className="w-full"
        />
      </div>
    </div>
  );
}
