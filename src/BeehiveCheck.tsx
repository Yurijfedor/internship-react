import { useState } from "react";
import { askAIJSON } from "./iaService";
import type { HiveData } from "./utils/types/hive";
import { isHiveData, isHiveDataValid } from "./utils/validators/hiveValidator";

function BeehiveCheck() {
  const [hiveNumber, setHiveNumber] = useState("");
  const [data, setData] = useState<HiveData | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    setLoading(true);
    const prompt = `Create JSON for a beehive check. Fields: hiveNumber (number), strength (1-5), queenStatus (good/medium/bad), honey (kg). Use hiveNumber ${hiveNumber}.  Provide only JSON.`;
    const result = await askAIJSON(prompt);

    if (isHiveData(result) && isHiveDataValid(result)) {
      setData(result);
    } else {
      console.error("Invalid hive data received from AI");
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>Beehive Check AI</h2>
      <input
        type="number"
        placeholder="Hive number"
        value={hiveNumber}
        onChange={(e) => setHiveNumber(e.target.value)}
      />
      <button onClick={handleCheck} disabled={loading}>
        Check Hive
      </button>

      {loading && <p>Thinking...</p>}

      {data && (
        <div>
          <p>Hive Number: {data.hiveNumber}</p>
          <p>Strength: {data.strength}</p>
          <p>Queen Status: {data.queenStatus}</p>
          <p>Honey: {data.honey} kg</p>
        </div>
      )}
    </div>
  );
}

export default BeehiveCheck;
