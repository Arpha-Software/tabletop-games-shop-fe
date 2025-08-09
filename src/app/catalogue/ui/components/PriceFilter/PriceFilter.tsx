'use client';

import { useCallback, useEffect, useState, useRef } from "react";
import { Button, Input } from "@/app/ui/components";
import "./PriceFilter.scss";
import { cn } from "@/utils/helpers";

type TProps = {
  min: number;
  max: number;
  className?: string;
  minVal: number;
  maxVal: number;
  onApply: (min: number, max: number) => void;
};

// крок у гривнях з копійками
const STEP = 0.01;

// clamp helper
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
// округляємо до 2 знаків, щоб уникати 3998.45999999
const round2 = (v: number) => Math.round(v * 100) / 100;

export const PriceFilter = ({
  min,
  max,
  className,
  minVal,
  maxVal,
  onApply,
}: TProps) => {
  const [currentMinVal, setCurrentMinVal] = useState(round2(clamp(minVal, min, max)));
  const [currentMaxVal, setCurrentMaxVal] = useState(round2(clamp(maxVal, min, max)));

  const minValRef = useRef(currentMinVal);
  const maxValRef = useRef(currentMaxVal);
  const range = useRef<HTMLDivElement>(null);

  // sync з батьком
  useEffect(() => {
    const v = round2(clamp(minVal, min, max));
    setCurrentMinVal(v);
    minValRef.current = v;
  }, [min, max, minVal]);

  useEffect(() => {
    const v = round2(clamp(maxVal, min, max));
    setCurrentMaxVal(v);
    maxValRef.current = v;
  }, [min, max, maxVal]);

  const getPercent = useCallback(
    (value: number) => {
      const p = ((value - min) / (max - min)) * 100;
      return clamp(p, 0, 100); // без Math.round — плавніше і без обрізання
    },
    [min, max]
  );

  // текстові інпути
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const v = round2(clamp(raw, min, currentMaxVal - STEP));
    setCurrentMinVal(v);
    minValRef.current = v;
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    // не "return", а клампимо до max
    const v = round2(clamp(raw, currentMinVal + STEP, max));
    setCurrentMaxVal(v);
    maxValRef.current = v;
  };

  // оновлення видимого діапазону
  useEffect(() => {
    const minPercent = getPercent(currentMinVal);
    const maxPercent = getPercent(maxValRef.current);
    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [currentMinVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(currentMaxVal);
    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [currentMaxVal, getPercent]);

  const handleApplyClick = () => onApply(currentMinVal, currentMaxVal);

  return (
    <section className={cn("pricefilter max-w-64 w-full", className)}>
      <p className="mb-4 font-medium">Ціна</p>

      <div className="flex items-center justify-between gap-2 mb-6">
        <Input
          className="max-w-17 px-2"
          value={currentMinVal}
          inputMode="decimal"
          onChange={handleMinInputChange}
        />
        <p> - </p>
        <Input
          className="max-w-17 px-2"
          value={currentMaxVal}
          inputMode="decimal"
          onChange={handleMaxInputChange}
        />
        <Button className="w-17 px-4 ml-3" onClick={handleApplyClick}>
          Ок
        </Button>
      </div>

      <div className="container">
        <div className="slider">
          <div className="slider__track" />
          <div ref={range} className="slider__range" />

          {/* Лівий повзунок */}
          <input
            type="range"
            min={min}
            max={max}
            step={STEP}
            value={currentMinVal}
            onChange={(e) => {
              const raw = Number(e.target.value);
              const v = round2(clamp(raw, min, currentMaxVal - STEP));
              setCurrentMinVal(v);
              minValRef.current = v;
            }}
            className="thumb thumb--left"
            aria-label="Мінімальна ціна"
          />

          {/* Правий повзунок */}
          <input
            type="range"
            min={min}
            max={max}
            step={STEP}
            value={currentMaxVal}
            onChange={(e) => {
              const raw = Number(e.target.value);
              const v = round2(clamp(raw, currentMinVal + STEP, max));
              setCurrentMaxVal(v);
              maxValRef.current = v;
            }}
            className="thumb thumb--right"
            aria-label="Максимальна ціна"
          />
        </div>
      </div>
    </section>
  );
};
