import gsap from 'gsap';
import { useEffect, useRef } from 'react';

type Point = readonly [number, number];

const joints: Point[] = [
  [369, 105],
  [369, 177],
  [369, 268],
  [369, 368],
  [289, 208],
  [242, 298],
  [149, 267],
  [447, 205],
  [499, 290],
  [583, 241],
  [322, 385],
  [268, 506],
  [207, 651],
  [414, 383],
  [473, 517],
  [538, 660],
];

const connections = [
  [0, 1],
  [1, 2],
  [2, 3],
  [1, 4],
  [4, 5],
  [5, 6],
  [1, 7],
  [7, 8],
  [8, 9],
  [3, 10],
  [10, 11],
  [11, 12],
  [3, 13],
  [13, 14],
  [14, 15],
] as const;

function Pose({ className }: { className: string }) {
  return (
    <g className={className}>
      {connections.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          x1={joints[from][0]}
          y1={joints[from][1]}
          x2={joints[to][0]}
          y2={joints[to][1]}
        />
      ))}
    </g>
  );
}

export default function MotionSignalVisual() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const flow = svg?.querySelector<SVGPathElement>('.home-signal__flow');
    if (!svg || !flow) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const length = flow.getTotalLength();
      const context = gsap.context(() => {
        gsap.fromTo(
          flow,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' },
        );
        gsap.from(svg.querySelectorAll('.home-signal__node'), {
          opacity: 0,
          scale: 0.25,
          transformOrigin: 'center center',
          duration: 0.65,
          stagger: 0.045,
          ease: 'back.out(1.8)',
        });
      }, svg);
      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <div className="home-signal" aria-hidden="true">
      <svg ref={svgRef} viewBox="0 0 720 720" fill="none">
        <defs>
          <linearGradient
            id="home-signal-gradient"
            x1="35"
            y1="350"
            x2="675"
            y2="350"
          >
            <stop stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.28" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="0.72" stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="home-signal__axis" d="M43 351H676M368 35V681" />
        <Pose className="home-signal__echo home-signal__echo--far" />
        <Pose className="home-signal__echo home-signal__echo--near" />
        <Pose className="home-signal__figure" />
        <path
          className="home-signal__flow"
          d="M16 325C86 339 113 261 151 267C214 276 245 328 289 208C321 120 407 124 447 205C490 294 528 283 584 241C627 209 649 192 704 205"
        />
        {joints.map(([cx, cy], index) => (
          <g className="home-signal__node" key={`${cx}-${cy}`}>
            <circle
              className="home-signal__node-halo"
              cx={cx}
              cy={cy}
              r={index < 4 ? 13 : 10}
            />
            <circle
              className="home-signal__node-core"
              cx={cx}
              cy={cy}
              r={index < 4 ? 4 : 3.5}
            />
          </g>
        ))}
        <path
          className="home-signal__corner"
          d="M58 86V58H86M662 634V662H634"
        />
      </svg>
    </div>
  );
}
