from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = joblib.load("best_knn.pkl")
scaler = joblib.load("scaler.pkl")
columns = joblib.load("columns.pkl")


print("Model loaded successfully")
print("Scaler loaded successfully")
print("Columns:", columns)



# INPUT DATA

class HeartData(BaseModel):

    Age: float
    RestingBP: float
    Cholesterol: float
    FastingBS: float
    MaxHR: float
    Oldpeak: float

    Sex_M: float

    ChestPainType_ATA: float
    ChestPainType_NAP: float
    ChestPainType_TA: float

    RestingECG_Normal: float
    RestingECG_ST: float

    ExerciseAngina_Y: float

    ST_Slope_Flat: float
    ST_Slope_Up: float



# HOME ROUTE

@app.get("/")
def home():

    return {
        "message": "Heart Disease Prediction API is running"
    }



# PREDICTION ROUTE

@app.post("/predict")
def predict(data: HeartData):

    # Convert request data into dictionary

    input_data = {
        "Age": data.Age,
        "RestingBP": data.RestingBP,
        "Cholesterol": data.Cholesterol,
        "FastingBS": data.FastingBS,
        "MaxHR": data.MaxHR,
        "Oldpeak": data.Oldpeak,

        "Sex_M": data.Sex_M,

        "ChestPainType_ATA": data.ChestPainType_ATA,
        "ChestPainType_NAP": data.ChestPainType_NAP,
        "ChestPainType_TA": data.ChestPainType_TA,

        "RestingECG_Normal": data.RestingECG_Normal,
        "RestingECG_ST": data.RestingECG_ST,

        "ExerciseAngina_Y": data.ExerciseAngina_Y,

        "ST_Slope_Flat": data.ST_Slope_Flat,
        "ST_Slope_Up": data.ST_Slope_Up
    }


    input_df = pd.DataFrame([input_data])


    # Arrange columns in EXACT same order as training data

    input_df = input_df[columns]


    #Apply SAME scaler used during training
  
    input_scaled = scaler.transform(input_df)



    # Prediction

    prediction = model.predict(input_scaled)[0]


   
    # Prediction probability

    probability = model.predict_proba(input_scaled)[0]


  
    # Return response

    return {
        "prediction": int(prediction),
        "probability": probability.tolist()
    }