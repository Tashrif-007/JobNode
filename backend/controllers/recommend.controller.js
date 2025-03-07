import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRecommendedJobs = async(req,res) => {
    try {
        const jobSeekerId = req.params.jobSeekerId;
        const response = await fetch(`http://localhost:7900/recommend/${jobSeekerId}`);
        const recommendedJobs = await response.json();
        // if(jobSeekerId==='6') return res.status(200).json({recommendedJob: [5,8]});
        // else if(jobSeekerId==='5') res.status(200).json({recommendedJob: [6,7]});
        // else {
        //     const randomJob = Math.floor(Math.random() * 8) + 1;
            res.status(200).json({recommendedJob: [recommendedJobs]});
        
    } catch (error) {
        console.error(error.message);
    }
}