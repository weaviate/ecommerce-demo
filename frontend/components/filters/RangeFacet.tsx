import React from "react";

import { Facet } from "../../types/searchResponse";

interface RangeFacetProps {
  facet: Facet;
  onApply: () => void;
  onLoad: boolean;
  onRangeChange: (facet: Facet, newUpper: number) => void;
}

const RangeFacet: React.FC<RangeFacetProps> = ({
  facet,
  onApply,
  onLoad,
  onRangeChange,
}) => {
  const lower = facet.lower ?? 0;
  const upper = facet.upper ?? 0;
  const selectedLower = facet.selected_lower ?? lower;
  const selectedUpper = facet.selected_upper ?? upper;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onRangeChange(facet, newValue);
  };

  return (
    <>
      <div className="mb-3 flex gap-2 items-end">
        <p className="text-sm text-black">
          {facet.name.charAt(0).toUpperCase() + facet.name.slice(1)}
        </p>
        <p className="text-xs opacity-50 font-light">{`0$ - ${selectedUpper}$`}</p>
      </div>

      <input
        type="range"
        className="range range-sm"
        min={lower}
        max={upper}
        value={selectedUpper}
        onChange={handleChange}
        disabled={onLoad}
      />

      <div className="flex justify-end mt-2">
        <button
          className="btn btn-sm btn-ghost font-normal text-primary hover:bg-transparent hover:underline"
          onClick={onApply}
          disabled={onLoad}
        >
          Apply
        </button>
      </div>
    </>
  );
};

export default RangeFacet;
