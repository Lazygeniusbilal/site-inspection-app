"use client";
import { useState } from "react";
import { convertUnit } from "@/utils/unitConverter";

export default function Calculator() {
  const [display, setDisplay] = useState<string>("0");
  const [prev, setPrev] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"calc" | "convert">("calc");
  const [convertValue, setConvertValue] = useState<string>("");
  const [convertFrom, setConvertFrom] = useState<string>("m");
  const [convertTo, setConvertTo] = useState<string>("ft");
  const [convertResult, setConvertResult] = useState<string>("");

  const buttonClass =
    "px-6 py-4 bg-blue-500 text-white font-bold text-2xl rounded-lg transition hover:scale-105 hover:bg-blue-600 active:scale-95";

  const operationClass =
    "px-6 py-4 bg-orange-500 text-white font-bold text-2xl rounded-lg transition hover:scale-105 hover:bg-orange-600 active:scale-95";

  const handleNumber = (num: number) => {
    setDisplay(display === "0" ? String(num) : display + num);
  };

  const handleOperation = (op: string) => {
    setPrev(display);
    setOperation(op);
    setDisplay("0");
  };

  const handleEquals = () => {
    if (!operation || !prev) return;
    const result = eval(`${prev}${operation}${display}`);
    setDisplay(String(result));
    setOperation(null);
    setPrev(null);
  };

  const handleClear = () => {
    setDisplay("0");
    setPrev(null);
    setOperation(null);
  };

  const handleConvert = async () => {
    if (!convertValue) return;
    try {
      const result = await convertUnit(
        parseFloat(convertValue),
        convertFrom,
        convertTo
      );
      setConvertResult(result);
    } catch (error) {
      setConvertResult(
        "Error: " + (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <section className="h-screen grid place-items-center bg-white">
      <div className="w-96 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("calc")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              activeTab === "calc"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab("convert")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              activeTab === "convert"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Unit Convert
          </button>
        </div>

        {activeTab === "calc" ? (
          <>
            <div className="bg-gray-950 text-white text-5xl p-6 rounded-xl mb-6 text-right font-mono overflow-hidden">
              {display}
            </div>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={handleClear}
                className={`${operationClass} col-span-2`}
              >
                AC
              </button>
              <button
                onClick={() => handleOperation("/")}
                className={operationClass}
              >
                ÷
              </button>
              <button
                onClick={() => handleOperation("*")}
                className={operationClass}
              >
                ×
              </button>

              <button onClick={() => handleNumber(7)} className={buttonClass}>
                7
              </button>
              <button onClick={() => handleNumber(8)} className={buttonClass}>
                8
              </button>
              <button onClick={() => handleNumber(9)} className={buttonClass}>
                9
              </button>
              <button
                onClick={() => handleOperation("-")}
                className={operationClass}
              >
                −
              </button>

              <button onClick={() => handleNumber(4)} className={buttonClass}>
                4
              </button>
              <button onClick={() => handleNumber(5)} className={buttonClass}>
                5
              </button>
              <button onClick={() => handleNumber(6)} className={buttonClass}>
                6
              </button>
              <button
                onClick={() => handleOperation("+")}
                className={operationClass}
              >
                +
              </button>

              <button onClick={() => handleNumber(1)} className={buttonClass}>
                1
              </button>
              <button onClick={() => handleNumber(2)} className={buttonClass}>
                2
              </button>
              <button onClick={() => handleNumber(3)} className={buttonClass}>
                3
              </button>
              <button
                onClick={handleEquals}
                className={`${operationClass} row-span-2`}
              >
                =
              </button>

              <button
                onClick={() => handleNumber(0)}
                className={`${buttonClass} col-span-3`}
              >
                0
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Value
              </label>
              <input
                type="number"
                value={convertValue}
                onChange={(e) => setConvertValue(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Enter value"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  From
                </label>
                <select
                  value={convertFrom}
                  onChange={(e) => setConvertFrom(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="m">Meters (m)</option>
                  <option value="ft">Feet (ft)</option>
                  <option value="km">Kilometers (km)</option>
                  <option value="mi">Miles (mi)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="C">Celsius (C)</option>
                  <option value="F">Fahrenheit (F)</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  To
                </label>
                <select
                  value={convertTo}
                  onChange={(e) => setConvertTo(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="m">Meters (m)</option>
                  <option value="ft">Feet (ft)</option>
                  <option value="km">Kilometers (km)</option>
                  <option value="mi">Miles (mi)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="C">Celsius (C)</option>
                  <option value="F">Fahrenheit (F)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleConvert}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Convert
            </button>

            {convertResult && (
              <div className="bg-gray-800 p-4 rounded-lg border border-green-500">
                <p className="text-white text-center font-semibold">
                  {convertResult}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
