from fastapi import FastAPI, HTTPException
import numpy as np
import pandas as pd

app = FastAPI()

data = np.load("../model/svd_model.npz")
U = data["U"]
sigma = data["sigma"]
Vt = data["Vt"]
user_index = data["user_index"]
job_index = data["job_index"]

predicted_matrix = np.dot(np.dot(U,sigma),Vt)

predicted_df = pd.DataFrame(predicted_matrix, index=user_index, columns=job_index)

@app.get("/recommend/{jobSeeker_id}")
def getRecommendedJob(jobSeeker_id: int, N: int = 5):
    if jobSeeker_id not in predicted_df.index:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_pred = predicted_df.loc[jobSeeker_id]

    top_jobs = user_pred.nlargest(N).index.to_list()

    return {"jobSeeker_id": jobSeeker_id, "top_jobs": top_jobs}

@app.get("/")
def hello():
    return {"message": "Welcome to the job recommendation API!"}