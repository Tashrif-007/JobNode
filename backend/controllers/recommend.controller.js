import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRecommendedJobs = async(req,res) => {
    try {
        const jobSeekerId = req.params.jobSeekerId;
        const response = await fetch(`http://localhost:7900/recommend/${jobSeekerId}`);
        const recommendedJobs = await response.json();
        res.status(200).json({jobid: jobSeekerId, recommendedjobs: recommendedJobs});
    } catch (error) {
        console.error(error.message);
    }
}