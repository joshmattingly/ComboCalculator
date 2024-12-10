import React, { useState } from "react";

function App() {
  const initialAspects = [
    { name: "Fool", remaining: 12, selected: 0 },
    { name: "Magician", remaining: 12, selected: 0 },
    { name: "High Priestess", remaining: 11, selected: 1 },
    { name: "Empress", remaining: 9, selected: 3 },
    { name: "Emperor", remaining: 10, selected: 2 },
    { name: "Hierophant", remaining: 11, selected: 1 },
    { name: "Hermit", remaining: 11, selected: 1 },
    { name: "Hanged One", remaining: 10, selected: 2 },
  ];

  const [aspects, setAspects] = useState(initialAspects);
  const [selectedAspects, setSelectedAspects] = useState([]);

  const handleSelectedChange = (index, newSelected) => {
    const newAspects = [...aspects];
    const clampedSelected = Math.min(12, Math.max(0, newSelected));
    newAspects[index] = {
      ...newAspects[index],
      selected: clampedSelected,
      remaining: 12 - clampedSelected,
    };
    setAspects(newAspects);
  };

  const toggleAspectSelection = (index) => {
    const newSelected = [...selectedAspects];
    if (newSelected.includes(index)) {
      newSelected.splice(newSelected.indexOf(index), 1);
    } else {
      if (newSelected.length < 4) {
        newSelected.push(index);
      }
    }
    setSelectedAspects(newSelected);
  };

  const calculateTotalWays = () => {
    const activeAspects =
      selectedAspects.length === 0 ? aspects : selectedAspects.map((index) => aspects[index]);
    const combinations = activeAspects.map(() => binomialCoefficient(12, 6));
    return combinations.reduce((total, combo) => total * combo, 1);
  };

  const calculateWaysNoSelected = () => {
    const activeAspects =
      selectedAspects.length === 0 ? aspects : selectedAspects.map((index) => aspects[index]);
    const combinations = activeAspects.map((aspect) =>
      binomialCoefficient(aspect.remaining, 6)
    );
    return combinations.reduce((total, combo) => total * combo, 1);
  };

  const calculateWaysAtLeastOne = () => {
    const totalWays = calculateTotalWays();
    const waysNoSelected = calculateWaysNoSelected();
    return totalWays - waysNoSelected;
  };

  const calculateRatio = () => {
    const waysNoSelected = calculateWaysNoSelected();
    const waysAtLeastOne = calculateWaysAtLeastOne();

    if (waysNoSelected === 0) return "N/A";
    return `1 : ${(waysAtLeastOne / waysNoSelected).toFixed(2)}`;
  };

  const binomialCoefficient = (n, k) => {
    if (k > n) return 0;
    let result = 1;
    for (let i = 0; i < k; i++) {
      result = (result * (n - i)) / (i + 1);
    }
    return result;
  };

  const formatScientific = (num) => {
    return num.toExponential(2); // Convert to scientific notation with 2 decimal places
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Aspect Probability Calculator</h1>
      </div>
      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "10px", border: "1px solid #ccc", fontWeight: "bold" }}>
              Choose at Least 1 Selected
            </td>
            <td style={{ padding: "10px", border: "1px solid #ccc" }}>
              {formatScientific(calculateWaysAtLeastOne())}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "10px", border: "1px solid #ccc", fontWeight: "bold" }}>
              Choose None Selection
            </td>
            <td style={{ padding: "10px", border: "1px solid #ccc" }}>
              {formatScientific(calculateWaysNoSelected())}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "10px", border: "1px solid #ccc", fontWeight: "bold" }}>
              Ratio (None:At Least 1)
            </td>
            <td style={{ padding: "10px", border: "1px solid #ccc" }}>
              {calculateRatio()}
            </td>
          </tr>
        </tbody>
      </table>
      {aspects.map((aspect, index) => (
        <div
          key={index}
          style={{
            marginBottom: "10px",
            border: "1px solid #ccc",
            backgroundColor: selectedAspects.includes(index) ? "#e0f7fa" : "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "0",
            }}
          >
            <h3 style={{ margin: 0 }}>{aspect.name}</h3>
            <button
              onClick={() => toggleAspectSelection(index)}
              style={{
                padding: "5px 10px",
                backgroundColor: selectedAspects.includes(index)
                  ? "#00796b"
                  : "#00897b",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {selectedAspects.includes(index) ? "Deselect" : "Select"}
            </button>
          </div>
          <div style={{ padding: "10px" }}>
            <label>Selected Powers:</label>
            <input
              type="number"
              value={aspect.selected}
              onChange={(e) =>
                handleSelectedChange(index, parseInt(e.target.value, 10))
              }
              min="0"
              max="12"
              style={{ marginLeft: "10px" }}
            />
            <span> | {aspect.remaining} Remaining Powers</span>
          </div>
        </div>
      ))}
      <p style={{ textAlign: "center" }}>
        {selectedAspects.length === 0
          ? "Using all 8 aspects for calculations."
          : `Using ${selectedAspects.length} selected aspects for calculations.`}
      </p>
    </div>
  );
}

export default App;
