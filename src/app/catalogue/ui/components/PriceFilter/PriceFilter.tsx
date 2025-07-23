// src/app/catalogue/ui/components/PriceFilter/PriceFilter.tsx
'use client';

import { useCallback, useEffect, useState, useRef } from "react";
import { Button, Input } from "@/app/ui/components";
import "./PriceFilter.scss";
import { cn } from "@/utils/helpers";

type TProps = {
  min: number; // Absolute min value for the range slider
  max: number; // Absolute max value for the range slider
  className?: string;
  minVal: number; // Current controlled min value
  maxVal: number; // Current controlled max value
  onMinChange: (value: number) => void; // Callback for min value change
  onMaxChange: (value: number) => void; // Callback for max value change
  onApply?: (min: number, max: number) => void; // Optional callback for applying filter
}

export const PriceFilter = ({
  min,
  max,
  className,
  minVal,
  maxVal,
  onMinChange,
  onMaxChange,
  onApply,
}: TProps) => {
  // Internal state for slider and input values, synced with props
  const [currentMinVal, setCurrentMinVal] = useState(minVal);
  const [currentMaxVal, setCurrentMaxVal] = useState(maxVal);

  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef<HTMLDivElement>(null);

  // Sync internal state with external props
  useEffect(() => {
    setCurrentMinVal(minVal);
  }, [minVal]);

  useEffect(() => {
    setCurrentMaxVal(maxVal);
  }, [maxVal]);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const handleMinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), currentMaxVal - 1);
    setCurrentMinVal(value);
    minValRef.current = value;
    onMinChange(value); // Emit change immediately
  };

  const handleMaxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value > max) return; // Prevent exceeding absolute max

    const newValue = Math.max(value, currentMinVal + 1); // Ensure max is always > min
    setCurrentMaxVal(newValue);
    maxValRef.current = newValue;
    onMaxChange(newValue); // Emit change immediately
  };

  // Update slider range position for min value
  useEffect(() => {
    const minPercent = getPercent(currentMinVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [currentMinVal, getPercent]);

  // Update slider range position for max value
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(currentMaxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [currentMaxVal, getPercent]);

  const handleApplyClick = () => {
    if (onApply) {
      onApply(currentMinVal, currentMaxVal);
    }
  };

  return (
    <section className={cn("max-w-64 w-full", className)}>
      <p className="mb-4 font-medium">Ціна</p>
      <div className="flex items-center justify-between gap-2 mb-6 mx-auto">
        <Input className="max-w-17 px-2" onChange={handleMinInputChange} value={currentMinVal}/>
        <p> - </p>
        <Input className="max-w-17 px-2" onChange={handleMaxInputChange} value={currentMaxVal}/>
        <Button className="w-17 px-4 ml-3" onClick={handleApplyClick}>Ок</Button> {/* Apply button */}
      </div>

      <div className="container">
        <input
          type="range"
          min={min}
          max={max}
          value={currentMinVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), currentMaxVal - 1);
            setCurrentMinVal(value);
            minValRef.current = value;
            onMinChange(value); // Emit change immediately
          }}
          className="thumb thumb--left"
          style={{ zIndex: currentMinVal > max - 100 ? "5" : undefined }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={currentMaxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), currentMinVal + 1);
            setCurrentMaxVal(value);
            maxValRef.current = value;
            onMaxChange(value); // Emit change immediately
          }}
          className="thumb thumb--right"
        />

        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />
        </div>
      </div>
    </section>
  );
};
