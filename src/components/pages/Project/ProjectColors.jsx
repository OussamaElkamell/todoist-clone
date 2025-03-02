import React, { useState } from "react";
import { Select } from "antd";
import { colorOptions } from "../../../context/ColorOptions";

const ProjectColors = ({ selectedColor, setSelectedColor }) => {
  console.log(selectedColor);

  return (
    <div className="mt-4">
      <label className="font-semibold">Color</label>
      <Select
        value={selectedColor}
        onChange={(value) => setSelectedColor(value)}
        style={{ width: "100%" }}
        optionLabelProp="label"
      >
        {colorOptions.map((color) => (
          <Select.Option
            key={color.value}
            value={color.value}
            label={color.label}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: color.color,
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              />
              {color.label}
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default ProjectColors;
