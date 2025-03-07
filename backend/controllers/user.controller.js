import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateProfile = async (req, res) => {
try {
    const { userId } = req.params;
    const { name, email, salaryExpectation, location, experience, skills } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: { jobSeeker: true }
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Update User common fields
    const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { name, email }
    });

    // Update JobSeeker details if user is a job seeker
    if (user.userType === "JobSeeker") {
        const updatedJobSeeker = await prisma.jobSeeker.upsert({
            where: { userId: parseInt(userId) },
            update: { salaryExpectation, location, experience},
            create: { userId: parseInt(userId), salaryExpectation, location, experience}
        });

        // Update skills
        if (skills && Array.isArray(skills)) {
            await prisma.jobSeekerReqSkills.deleteMany({ where: { jobSeekerId: updatedJobSeeker.id } });
            const skillRecords = await Promise.all(skills.map(async (skillName) => {
                let skill = await prisma.skills.findUnique({ where: { name: skillName } });
                if (!skill) {
                    skill = await prisma.skills.create({ data: { name: skillName } });
                }
                return { jobSeekerId: updatedJobSeeker.id, skillId: skill.id };
            }));
            await prisma.jobSeekerReqSkills.createMany({ data: skillRecords });
        }
    }

    res.status(200).json({ message: "Profile updated successfully" });
} catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
}
};


export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),  // Convert userId to an integer if passed as string
      },
      include: {
        jobSeeker: {   // Include related JobSeeker tuple
          include: {
            requiredSkills: {  // Include related skills for the JobSeeker
              include: {
                skill: true,  // Fetch the skills themselves
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return only the required data: User, JobSeeker, and Skills
    const response = {
      name: user.name,
      email: user.email,
      location: user.jobSeeker.location,
      experience: user.jobSeeker.experience,
      salaryExpectation: user.jobSeeker.salaryExpectation,
      skills: user.jobSeeker?.requiredSkills.map(skillRel => skillRel.skill.name),
      userType: user.userType
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
