import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
export default function PriceSlider({ initialMax }: { initialMax: number }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const URLmin = searchParams.get("minPrice");
  const URLmax = searchParams.get("maxPrice");

  const [min, setMin] = useState<number>(
    URLmin && parseFloat(URLmin) > 0 ? parseFloat(URLmin) : 0
  );
  const [max, setMax] = useState<number>(
    URLmax && parseFloat(URLmax) <= initialMax ? parseFloat(URLmax) : initialMax
  );
  const [isDraggingLeft, setIsDraggingLeft] = useState<boolean>(false);
  const [isDraggingRight, setIsDraggingRight] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const leftHandleRef = useRef<HTMLDivElement>(null);
  const rightHandleRef = useRef<HTMLDivElement>(null);

  // Calculate positions based on values
  const getLeftPosition = () => {
    return (min / initialMax) * 100;
  };

  const getRightPosition = () => {
    return (max / initialMax) * 100;
  };

  // Handle mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = rect.width;
      const offsetX = e.clientX - rect.left;
      const percentage = Math.min(
        Math.max((offsetX / sliderWidth) * 100, 0),
        100
      );
      const value = Number(((percentage / 100) * initialMax).toPrecision(2));

      if (isDraggingLeft) {
        if (value < max) {
          setMin(value);
        }
      } else if (isDraggingRight) {
        if (value > min) {
          setMax(value);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);

      const newParams = new URLSearchParams(searchParams);

      // Update minPrice and maxPrice
      newParams.set("minPrice", min.toString());
      newParams.set("maxPrice", max.toString());

      // Update the URL without refreshing the page
      setSearchParams(newParams);
    };

    if (isDraggingLeft || isDraggingRight) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight, min, max, initialMax]);

  // Handle input changes
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value < max) {
      setMin(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == "") {
      setMax(0);
      return;
    }
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > min && value <= initialMax) {
      setMax(value);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md">
      <div
        ref={sliderRef}
        className="relative w-full bg-gray-200 h-2 rounded-full my-4"
      >
        {/* Selected range */}
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{
            left: `${getLeftPosition()}%`,
            right: `${100 - getRightPosition()}%`,
          }}
        ></div>

        {/* Left handle */}
        <div
          ref={leftHandleRef}
          className="absolute top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 bg-white rounded-full border-2 border-blue-500 cursor-grab shadow-md flex items-center justify-center"
          style={{ left: `${getLeftPosition()}%` }}
          onMouseDown={() => setIsDraggingLeft(true)}
        >
          <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
        </div>

        {/* Right handle */}
        <div
          ref={rightHandleRef}
          className="absolute top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 bg-white rounded-full border-2 border-blue-500 cursor-grab shadow-md flex items-center justify-center"
          style={{ left: `${getRightPosition()}%` }}
          onMouseDown={() => setIsDraggingRight(true)}
        >
          <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="flex flex-col w-1/2">
          <label htmlFor="min" className="text-sm text-gray-600 mb-1">
            Min
          </label>
          <input
            id="min"
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2 hide-arrow after:content-['€']"
            value={min}
            onChange={handleMinChange}
          />
        </div>
        <div className="flex flex-col w-1/2">
          <label htmlFor="max" className="text-sm text-gray-600 mb-1">
            Max
          </label>
          <input
            id="max"
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2 hide-arrow"
            value={max}
            onChange={handleMaxChange}
          />
        </div>
      </div>
    </div>
  );
}
