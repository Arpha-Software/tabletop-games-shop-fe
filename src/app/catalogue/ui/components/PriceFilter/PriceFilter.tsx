'use client';

import { useCallback, useEffect, useState, useRef } from "react";

import { Button, Input } from "@/app/ui/components";

import "./PriceFilter.scss";
import { cn } from "@/utils/helpers";

type TProps = {
  min: number;
  max: number;
  className?: string;
}

export const PriceFilter = ({ min, max, className }: TProps) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: any) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const onChangeMin = (event: any) => {
    const value = Math.min(Number(event.target.value), maxVal - 1);

    setMinVal(value);
    minValRef.current = value;
  }

  const onChangeMax = (event: any) => {
    const value = Number(event.target.value);

    if (value > max) return;

    if (value >= minVal) {
      setMaxVal(value);
      maxValRef.current = value;
    }
  }

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  return (
    <section className={cn("max-w-64 w-full", className)}>
      <p className="mb-4 font-medium">Ціна</p>
      <div className="flex items-center justify-between gap-2 mb-6 mx-auto">
        <Input className="max-w-17 px-2" onChange={onChangeMin} value={minVal}/>
        <p> - </p>
        <Input className="max-w-17 px-2" onChange={onChangeMax} value={maxVal}/>
        <Button className="w-17 px-4 ml-3">Ок</Button>
      </div>

      <div className="container">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className="thumb thumb--left"
          style={{ zIndex: minVal > max - 100 ? "5" : undefined }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
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
