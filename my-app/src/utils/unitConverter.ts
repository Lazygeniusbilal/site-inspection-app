const API_URL = "https://site-inspection-backend.onrender.com";

export interface UnitConversionRequest {
  value: number;
  unit_from: string;
  unit_to: string;
}

export interface UnitConversionResponse {
  message: {
    input: string;
    output: string;
  };
}

export const convertUnit = async (
  value: number,
  unitFrom: string,
  unitTo: string
): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/unit_convertor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value,
        unit_from: unitFrom,
        unit_to: unitTo,
      }),
    });

    if (!response.ok) {
      throw new Error("Unit conversion failed");
    }

    const data: UnitConversionResponse = await response.json();
    return data.message.output;
  } catch (error) {
    throw new Error(`Conversion error: ${error}`);
  }
};
