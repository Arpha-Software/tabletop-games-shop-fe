// src/app/catalogue/ui/components/PriceFilter/PriceFilter.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input } from '@/app/ui/components';
import { cn } from '@/utils/helpers';
import './PriceFilter.scss';

type TProps = {
  min: number;
  max: number;
  className?: string;
  minVal: number;
  maxVal: number;
  onApply: (min: number, max: number) => void;
};

const STEP = 0.01;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const round2 = (v: number) => Math.round(v * 100) / 100;

export const PriceFilter = ({ min, max, className, minVal, maxVal, onApply }: TProps) => {
  const [currentMinVal, setCurrentMinVal] = useState(round2(clamp(minVal, min, max)));
  const [currentMaxVal, setCurrentMaxVal] = useState(round2(clamp(maxVal, min, max)));

  const minRef = useRef(currentMinVal);
  const maxRef = useRef(currentMaxVal);
  const range = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = round2(clamp(minVal, min, max));
    setCurrentMinVal(v);
    minRef.current = v;
  }, [min, max, minVal]);

  useEffect(() => {
    const v = round2(clamp(maxVal, min, max));
    setCurrentMaxVal(v);
    maxRef.current = v;
  }, [min, max, maxVal]);

  const getPercent = useCallback(
    (value: number) => clamp(((value - min) / (max - min)) * 100, 0, 100),
    [min, max]
  );

  // reflect handles on track
  useEffect(() => {
    if (!range.current) return;
    const left = getPercent(currentMinVal);
    const right = getPercent(maxRef.current);
    range.current.style.left = `${left}%`;
    range.current.style.width = `${right - left}%`;
  }, [currentMinVal, getPercent]);

  useEffect(() => {
    if (!range.current) return;
    const left = getPercent(minRef.current);
    const right = getPercent(currentMaxVal);
    range.current.style.width = `${right - left}%`;
  }, [currentMaxVal, getPercent]);

  const apply = () => onApply(currentMinVal, currentMaxVal);

  return (
    <section className={cn('price-filter w-full min-w-0', className)}>
      {/* inputs row */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_1fr] items-center gap-2 mb-3">
        <span className="text-sm text-gray-600">Від</span>
        <Input
          className="px-2 py-2 w-full"
          value={currentMinVal}
          inputMode="decimal"
          onChange={(e) => {
            const raw = Number(e.target.value);
            const v = round2(clamp(raw, min, currentMaxVal - STEP));
            setCurrentMinVal(v);
            minRef.current = v;
          }}
        />
        <span className="text-sm text-gray-600">до</span>
        <Input
          className="px-2 py-2 w-full"
          value={currentMaxVal}
          inputMode="decimal"
          onChange={(e) => {
            const raw = Number(e.target.value);
            const v = round2(clamp(raw, currentMinVal + STEP, max));
            setCurrentMaxVal(v);
            maxRef.current = v;
          }}
        />
      </div>

      <div className="pf-slider">
        <div className="pf-track" />
        <div ref={range} className="pf-range" />

        <input
          type="range"
          className="pf-input pf-input--left"
          min={min}
          max={max}
          step={STEP}
          value={currentMinVal}
          onChange={(e) => {
            const v = round2(clamp(Number(e.target.value), min, currentMaxVal - STEP));
            setCurrentMinVal(v);
            minRef.current = v;
          }}
          aria-label="Мінімальна ціна"
        />

        <input
          type="range"
          className="pf-input pf-input--right"
          min={min}
          max={max}
          step={STEP}
          value={currentMaxVal}
          onChange={(e) => {
            const v = round2(clamp(Number(e.target.value), currentMinVal + STEP, max));
            setCurrentMaxVal(v);
            maxRef.current = v;
          }}
          aria-label="Максимальна ціна"
        />
      </div>

      <div className="mt-3 flex justify-end sm:justify-end">
        <Button className="w-full px-4 py-2 text-sm" onClick={apply}>Застосувати</Button>
      </div>
    </section>
  );
};
