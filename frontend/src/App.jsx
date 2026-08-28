import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    Age: 40,
    RestingBP: 120,
    Cholesterol: 200,
    FastingBS: 0,
    MaxHR: 150,
    Oldpeak: 1.0,

    Sex: "M",
    ChestPainType: "ATA",
    RestingECG: "Normal",
    ExerciseAngina: "N",
    ST_Slope: "Up",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    // Convert frontend values into the exact
    // one-hot encoded columns used by your model
    const modelData = {
      Age: Number(formData.Age),
      RestingBP: Number(formData.RestingBP),
      Cholesterol: Number(formData.Cholesterol),
      FastingBS: Number(formData.FastingBS),
      MaxHR: Number(formData.MaxHR),
      Oldpeak: Number(formData.Oldpeak),

      Sex_M: formData.Sex === "M" ? 1 : 0,

      ChestPainType_ATA:
        formData.ChestPainType === "ATA" ? 1 : 0,

      ChestPainType_NAP:
        formData.ChestPainType === "NAP" ? 1 : 0,

      ChestPainType_TA:
        formData.ChestPainType === "TA" ? 1 : 0,

      RestingECG_Normal:
        formData.RestingECG === "Normal" ? 1 : 0,

      RestingECG_ST:
        formData.RestingECG === "ST" ? 1 : 0,

      ExerciseAngina_Y:
        formData.ExerciseAngina === "Y" ? 1 : 0,

      ST_Slope_Flat:
        formData.ST_Slope === "Flat" ? 1 : 0,

      ST_Slope_Up:
        formData.ST_Slope === "Up" ? 1 : 0,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modelData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Prediction failed"
        );
      }

      setResult(data);
    } catch (error) {
      console.error(error);

      setResult({
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f16] text-white px-5 py-8">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <h1 className="text-4xl md:text-6xl font-extrabold text-center">
          Heart Disease Prediction
        </h1>

        <div className="text-center text-6xl mt-4">
          ❤️
        </div>

        <p className="text-xl md:text-2xl text-gray-300 mt-8 mb-10">
          Provide the following details
        </p>


        <form onSubmit={handleSubmit}>

          {/* AGE */}

          <div className="mb-8">

            <label className="block text-xl font-medium mb-4">
              Age
            </label>

            <div className="flex items-center gap-4">

              <input
                type="range"
                min="18"
                max="100"
                value={formData.Age}
                onChange={(e) =>
                  handleChange("Age", e.target.value)
                }
                className="w-full accent-red-500"
              />

              <span className="text-2xl font-bold text-red-400 w-12">
                {formData.Age}
              </span>

            </div>

            <div className="flex justify-between text-gray-300 mt-2">
              <span>18</span>
              <span>100</span>
            </div>

          </div>


          {/* SEX */}

          <SelectField
            label="SEX"
            value={formData.Sex}
            onChange={(value) =>
              handleChange("Sex", value)
            }
            options={[
              { value: "M", label: "Male" },
              { value: "F", label: "Female" },
            ]}
          />


          {/* CHEST PAIN */}

          <SelectField
            label="CHEST PAIN TYPE"
            value={formData.ChestPainType}
            onChange={(value) =>
              handleChange("ChestPainType", value)
            }
            options={[
              {
                value: "ATA",
                label: "Atypical Angina",
              },
              {
                value: "NAP",
                label: "Non-Anginal Pain",
              },
              {
                value: "TA",
                label: "Typical Angina",
              },
              {
                value: "ASY",
                label: "Asymptomatic",
              },
            ]}
          />


          {/* RESTING BP */}

          <NumberField
            label="RESTING BLOOD PRESSURE"
            value={formData.RestingBP}
            min="80"
            max="220"
            onChange={(value) =>
              handleChange("RestingBP", value)
            }
          />


          {/* CHOLESTEROL */}

          <NumberField
            label="CHOLESTEROL"
            value={formData.Cholesterol}
            min="50"
            max="600"
            onChange={(value) =>
              handleChange("Cholesterol", value)
            }
          />


          {/* FASTING BS */}

          <SelectField
            label="FASTING BLOOD SUGAR"
            value={formData.FastingBS}
            onChange={(value) =>
              handleChange("FastingBS", Number(value))
            }
            options={[
              {
                value: 0,
                label: "≤ 120 mg/dl",
              },
              {
                value: 1,
                label: "> 120 mg/dl",
              },
            ]}
          />


          {/* MAX HEART RATE */}

          <NumberField
            label="MAXIMUM HEART RATE"
            value={formData.MaxHR}
            min="60"
            max="220"
            onChange={(value) =>
              handleChange("MaxHR", value)
            }
          />


          {/* OLDPEAK */}

          <NumberField
            label="OLDPEAK"
            value={formData.Oldpeak}
            min="0"
            max="10"
            step="0.1"
            onChange={(value) =>
              handleChange("Oldpeak", value)
            }
          />


          {/* RESTING ECG */}

          <SelectField
            label="RESTING ECG"
            value={formData.RestingECG}
            onChange={(value) =>
              handleChange("RestingECG", value)
            }
            options={[
              {
                value: "Normal",
                label: "Normal",
              },
              {
                value: "ST",
                label: "ST-T Wave Abnormality",
              },
              {
                value: "LVH",
                label: "Left Ventricular Hypertrophy",
              },
            ]}
          />


          {/* EXERCISE ANGINA */}

          <SelectField
            label="EXERCISE INDUCED ANGINA"
            value={formData.ExerciseAngina}
            onChange={(value) =>
              handleChange("ExerciseAngina", value)
            }
            options={[
              {
                value: "N",
                label: "No",
              },
              {
                value: "Y",
                label: "Yes",
              },
            ]}
          />


          {/* ST SLOPE */}

          <SelectField
            label="ST SLOPE"
            value={formData.ST_Slope}
            onChange={(value) =>
              handleChange("ST_Slope", value)
            }
            options={[
              {
                value: "Up",
                label: "Upsloping",
              },
              {
                value: "Flat",
                label: "Flat",
              },
              {
                value: "Down",
                label: "Downsloping",
              },
            ]}
          />


          {/* PREDICT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-xl font-bold transition"
          >
            {loading
              ? "Predicting..."
              : "Predict Heart Disease"}
          </button>

        </form>


        {/* RESULT */}

        {result && !result.error && (

          <div className="mt-10 bg-[#1b1d26] rounded-2xl p-8 text-center">

            <h2 className="text-3xl font-bold mb-6">
              Prediction Result
            </h2>

            {result.prediction === 1 ? (

              <div>
                <div className="text-5xl mb-4">
                  ⚠️
                </div>

                <p className="text-3xl font-bold text-red-400">
                  Heart Disease Detected
                </p>
              </div>

            ) : (

              <div>
                <div className="text-5xl mb-4">
                  💚
                </div>

                <p className="text-3xl font-bold text-green-400">
                  No Heart Disease Detected
                </p>
              </div>

            )}

            <p className="text-gray-300 mt-6">
              Prediction Probability
            </p>

            <p className="text-2xl font-bold mt-2">
              {(Math.max(...result.probability) * 100).toFixed(2)}%
            </p>

          </div>

        )}


        {/* ERROR */}

        {result?.error && (

          <div className="mt-8 bg-red-900/40 border border-red-500 rounded-xl p-5">

            <p className="text-red-300">
              Error: {result.error}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}


/* =========================================
   SELECT FIELD
========================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="mb-8">

      <label className="block text-xl font-medium mb-3">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full bg-[#252731] border border-gray-700 rounded-xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-red-500"
      >

        {options.map((option) => (

          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>

        ))}

      </select>

    </div>
  );
}


/* =========================================
   NUMBER FIELD
========================================= */

function NumberField({
  label,
  value,
  min,
  max,
  step = "1",
  onChange,
}) {
  return (
    <div className="mb-8">

      <label className="block text-xl font-medium mb-3">
        {label}
      </label>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full bg-[#252731] border border-gray-700 rounded-xl px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-red-500"
      />

    </div>
  );
}

export default App;