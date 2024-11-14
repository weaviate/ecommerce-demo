import React from "react";
import Slider from "@mui/material/Slider";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { primary } from "../../types/colors";
import { Facet } from "../../types/searchResponse";

const theme = createTheme({
  palette: {
    primary: primary,
  },
});

interface RangeFacetProps {
  facet: Facet;
  onApply: () => void;
  onLoad: boolean;
  onRangeChange: (facet: Facet, newLower: number, newUpper: number) => void;
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

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const [newLower, newUpper] = newValue;
      onRangeChange(facet, newLower, newUpper);
    }
  };

  const handleApply = () => {
    onApply();
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="mb-3 flex gap-2 items-end">
        <p className="text-sm text-black">
          {facet.name.charAt(0).toUpperCase() + facet.name.slice(1)}
        </p>
        <p className="text-xs opacity-50 font-light">{`${selectedLower}$ - ${selectedUpper}$`}</p>
      </div>

      <div style={{ padding: "0 22px" }}>
        <Slider
          getAriaLabel={() => facet.name}
          value={[selectedLower, selectedUpper]}
          min={lower}
          max={upper}
          disabled={onLoad}
          color="primary"
          onChange={handleChange}
          valueLabelDisplay="auto"
          disableSwap
        />
      </div>
      <div className="flex justify-end mt-2">
        <button
          className="btn btn-sm btn-ghost font-normal text-primary hover:bg-transparent hover:underline"
          onClick={handleApply}
          disabled={onLoad}
        >
          Apply
        </button>
      </div>
    </ThemeProvider>
  );
};

export default RangeFacet;
