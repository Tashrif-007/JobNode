import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRecommendedJobs = async (req, res) => {
    try {
        const jobSeekerId = req.params.jobSeekerId;

        // Fetch the recommended job IDs
        const response = await fetch(`http://localhost:7900/recommend/${jobSeekerId}`);
        const recommendedJobs = await response.json();

        // Get the top job IDs and convert them to an array of strings
        const topJobIds = recommendedJobs.top_jobs.map(String); // Convert each job ID to string

        // Fetch multiple job posts where the job ID is one of the topJobIds (now in string format)
        const jobPosts = await prisma.jobPost.findMany({
            where: {
                jobPostId: {
                    in: topJobIds, // Fetch job posts where the ID matches any in top_jobs
                },
            },
            include: {
                requiredSkills: { include: { skill: true } },
                user: true,
              },
        });

        // If there are no job posts found, return a message
        if (jobPosts.length === 0) {
            return res.status(404).json({ message: 'No job posts found for the recommended jobs.' });
        }

        // Return the matching job posts in the response
        res.status(200).json( jobPosts );

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export const fetchJobPost = async (req,res) => {
    const {postId} = req.params;
    try {
        const posts = await prisma.jobPost.findMany({
            where: {jobPostId: postId},
            include: {requiredSkills: true}
        });
        res.status(200).json(posts);
    } catch (error) {
        
    }
}