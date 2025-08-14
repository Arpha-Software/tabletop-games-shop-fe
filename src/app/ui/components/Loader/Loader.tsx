// components/RubikLoader.tsx
"use client";

import React, { useMemo, useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* ==================== Base loader (cube) ==================== */

type FaceColors = { front?: string; right?: string; top?: string };

export type RubikLoaderProps = {
  size?: number;          // px
  gap?: number;           // px
  durationMs?: number;    // full loop length
  delayStepMs?: number;   // stagger between tiles
  colors?: FaceColors;    // face colors
  grid?: number;          // keep 3 for Rubik look
  wobble?: boolean;       // subtle wobble
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
};

const defaultColors: Required<FaceColors> = {
  front: "#eca207",
  right: "#e74c3c",
  top:   "#ffffff",
};

type FaceSpec = {
  name: "front" | "right" | "top";
  color: string;
  offset: { dx: number; dy: number; dz: number };
  faceDelay: number;
};

function seededJitter(i: number, amplitude = 3) {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  const frac = s - Math.floor(s);
  return (frac * 2 - 1) * amplitude;
}

export function RubikLoader({
  size = 140,
  gap = 5,
  durationMs = 2600,
  delayStepMs = 90,
  colors = defaultColors,
  grid = 3,
  wobble = true,
  ariaLabel = "Loading",
  className,
  style,
}: RubikLoaderProps) {
  const { front, right, top } = { ...defaultColors, ...colors };
  const faceStride = grid + 4;

  const faces: FaceSpec[] = useMemo(
    () => [
      { name: "front", color: front, offset: { dx: 0,  dy: 18, dz: -42 }, faceDelay: 0 },
      { name: "right", color: right, offset: { dx: 42, dy: 8,  dz: -24 }, faceDelay: faceStride },
      { name: "top",   color: top,   offset: { dx: 0,  dy: -44, dz: 0 },  faceDelay: faceStride * 2 },
    ],
    [front, right, top, faceStride]
  );

  const tiles = useMemo(() => {
    const items: { face: "front" | "right" | "top"; style: React.CSSProperties; key: string }[] = [];
    const mid = (grid - 1) / 2;
    let idx = 0;

    faces.forEach(({ name, color, offset, faceDelay }) => {
      for (let r = 0; r < grid; r++) {
        for (let c = 0; c < grid; c++) {
          const wave = r + c + faceDelay;
          const delay = wave * delayStepMs;

          const j = seededJitter(idx);
          const dx = offset.dx + (c - mid) * 6 + j;
          const dy = offset.dy + (r - mid) * 6 + seededJitter(idx + 1);
          const dz = offset.dz + seededJitter(idx + 2);

          items.push({
            face: name,
            key: `${name}-${r}-${c}`,
            style: {
              ["--delay" as any]: `${delay}ms`,
              ["--color" as any]: color,
              ["--dx" as any]: `${dx}px`,
              ["--dy" as any]: `${dy}px`,
              ["--dz" as any]: `${dz}px`,
            },
          });
          idx += 3;
        }
      }
    });
    return items;
  }, [faces, grid, delayStepMs]);

  const rootVars: React.CSSProperties = {
    ["--size" as any]: `${size}px`,
    ["--gap" as any]: `${gap}px`,
    ["--duration" as any]: `${durationMs}ms`,
    ["--sticker-shadow" as any]: "rgba(0,0,0,.25)",
    ["--sticker-edge" as any]: "rgba(0,0,0,.35)",
    ["--light" as any]: "rgba(255,255,255,.5)",
    ...(style || {}),
  };

  return (
    <div
      className={`rubik-loader ${className ?? ""}`.trim()}
      style={rootVars}
      role="img"
      aria-label={ariaLabel}
    >
      <div className={`scene${wobble ? " wobble" : ""}`}>
        <div className="face front">
          {tiles.filter(t => t.face === "front").map(t => <div className="tile" key={t.key} style={t.style} />)}
        </div>
        <div className="face right">
          {tiles.filter(t => t.face === "right").map(t => <div className="tile" key={t.key} style={t.style} />)}
        </div>
        <div className="face top">
          {tiles.filter(t => t.face === "top").map(t => <div className="tile" key={t.key} style={t.style} />)}
        </div>
      </div>

      <style jsx>{`
        .rubik-loader {
          width: calc(var(--size) * 1.25);
          height: calc(var(--size) * 1.25);
          display: inline-grid;
          place-items: center;
          perspective: 800px;
        }
        .scene {
          width: var(--size);
          height: var(--size);
          position: relative;
          transform-style: preserve-3d;
        }
        .scene.wobble {
          animation: wobble var(--duration) ease-in-out infinite;
        }
        @keyframes wobble {
          0%, 100% { transform: rotateX(-30deg) rotateY(45deg) }
          50%      { transform: rotateX(-26deg) rotateY(49deg) }
        }

        .face {
          position: absolute;
          width: var(--size);
          height: var(--size);
          display: grid;
          grid-template-columns: repeat(${3}, 1fr);
          grid-auto-rows: 1fr;
          gap: var(--gap);
          transform-style: preserve-3d;
        }
        .front { transform: translateZ(calc(var(--size) / 2)); }
        .right { transform: rotateY(90deg) translateZ(calc(var(--size) / 2)); }
        .top   { transform: rotateX(90deg) translateZ(calc(var(--size) / 2)); }

        .tile {
          position: relative;
          border-radius: 6px;
          box-shadow:
            inset 0 0 0 1px var(--sticker-edge),
            inset 0 6px 12px -6px var(--light),
            0 2px 4px var(--sticker-shadow);
          transform-style: preserve-3d;
          animation: pop var(--duration) ease-in-out infinite;
          animation-delay: var(--delay, 0ms);
          opacity: 0;
        }
        .tile::before {
          content: "";
          position: absolute; inset: 0;
          border-radius: 6px;
          background: var(--color);
          background-image: linear-gradient(135deg, rgba(255,255,255,.18), rgba(0,0,0,.08));
          pointer-events: none;
        }
        @keyframes pop {
          0%, 12% {
            opacity: 0;
            transform: translate3d(var(--dx,0), var(--dy,0), var(--dz,0)) scale(0.2);
          }
          25%, 55% {
            opacity: 1;
            transform: translate3d(0,0,0) scale(1);
          }
          68%, 88% {
            opacity: 0;
            transform: translate3d(calc(var(--dx,0) * -1), calc(var(--dy,0) * -1), calc(var(--dz,0) * -1)) scale(0.2);
          }
          100% {
            opacity: 0;
            transform: translate3d(calc(var(--dx,0) * -1), calc(var(--dy,0) * -1), calc(var(--dz,0) * -1)) scale(0.2);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scene.wobble { animation: none }
          .tile { animation: none; opacity: 1 }
        }
      `}</style>
    </div>
  );
}

/* ==================== Wrapper (overlay over children) ==================== */

export type RubikLoadableProps = RubikLoaderProps & {
  loading: boolean;
  children: React.ReactNode;
  /** Show after N ms to avoid flicker */
  delayMs?: number;
  /** Dim background color under the loader (false = no dim) */
  dim?: false | string;
  /** Block pointer events while loading */
  blockEvents?: boolean;
  /** Make it fullscreen using a portal to <body> */
  fullscreen?: boolean;
  /** z-index for overlay */
  zIndex?: number;
  /** Wrapper className (when not fullscreen) */
  wrapperClassName?: string;
  /** Wrapper style (when not fullscreen) */
  wrapperStyle?: React.CSSProperties;
};

export function RubikLoadable({
  loading,
  delayMs = 120,
  dim = "rgba(8,11,18,.35)",
  blockEvents = true,
  fullscreen = false,
  zIndex = 9999,
  wrapperClassName,
  wrapperStyle,
  children,
  ...loaderProps
}: RubikLoadableProps) {
  const [mounted, setMounted] = useState(false); // for portals
  const [visible, setVisible] = useState(loading);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let t: any;
    if (loading) {
      if (delayMs > 0) t = setTimeout(() => setVisible(true), delayMs);
      else setVisible(true);
    } else {
      // fade-out duration should match CSS transition below
      t = setTimeout(() => setVisible(false), 180);
    }
    return () => clearTimeout(t);
  }, [loading, delayMs]);

  const overlay = (
    <div
      className={`rubik-overlay ${loading ? "enter" : "leave"}`}
      aria-hidden={!loading}
      style={{
        position: fullscreen ? "fixed" : "absolute",
        inset: 0,
        display: visible ? "grid" : "none",
        placeItems: "center",
        background: dim || "transparent",
        zIndex,
        transition: "opacity 180ms ease",
        opacity: loading ? 1 : 0,
        pointerEvents: loading && blockEvents ? "auto" : "none",
      }}
    >
      <RubikLoader {...loaderProps} />
      <style jsx>{`
        .rubik-overlay.enter { opacity: 1; }
        .rubik-overlay.leave { opacity: 0; }
      `}</style>
    </div>
  );

  if (fullscreen) {
    return (
      <>
        {!mounted ? null : createPortal(overlay, document.body)}
        {/* still render children underneath in normal flow */}
        {children}
      </>
    );
  }

  // Relative overlay: stack on top of children
  return (
    <div
      className={wrapperClassName}
      style={{ position: "relative", ...wrapperStyle }}
      aria-busy={loading || undefined}
    >
      {children}
      {overlay}
    </div>
  );
}
