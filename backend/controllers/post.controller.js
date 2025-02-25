import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const verifyToken = (token) => {
  if (!token) {
    throw new Error('Authorization token missing');
  }
  return jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
};

const validateJobPostData = ({ name, position, salary, experience, location, skills }) => {
  if (!name || !position || !salary || !experience || !location) {
    throw new Error('All fields are required');
  }
  if (!Array.isArray(skills) || skills.length === 0) {
    throw new Error('At least one skill is required');
  }
};

const upsertSkills = async (skills) => {
  return Promise.all(
    skills.map(async (skillName) => {
      const skill = await prisma.skills.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName },
      });
      return skill;
    })
  );
};

export const createPost = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = verifyToken(token);

    if (decoded.userType !== 'Company') {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const { name, position, salary, experience, location, skills } = req.body;
    validateJobPostData({ name, position, salary, experience, location, skills });

    const skillRecords = await upsertSkills(skills);

    const jobPost = await prisma.jobPost.create({
      data: {
        name,
        position,
        salary: parseFloat(salary),
        experience: parseInt(experience),
        location,
        userId: decoded.userId,
        requiredSkills: {
          create: skillRecords.map((skill) => ({ skillId: skill.id })),
        },
      },
      include: {
        requiredSkills: { include: { skill: true } },
      },
    });

    res.status(201).json(jobPost);
  } catch (error) {
    if (error.code === 'P2002' && error.meta.target.includes('name')) {
      return res.status(409).json({ error: 'Job post with this name already exists' });
    }
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Controller to get all posts (initial load)
export const getAllPosts = async (req, res) => {
  try {
    const jobPosts = await prisma.jobPost.findMany({
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
        user: {
          include: {
            company: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.status(200).json(jobPosts);
  } catch (error) {
    console.error('Error in getAllPosts:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Controller to search posts based on search parameter
export const searchPosts = async (req, res) => {
  const { search } = req.query;

  try {
    const posts = await prisma.jobPost.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search.toLowerCase(),
            },
          },
          {
            location: {
              contains: search.toLowerCase(),
            },
          },
          {
            requiredSkills: {
              some: {
                skill: {
                  name: {
                    contains: search.toLowerCase(),
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        requiredSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPost = await prisma.jobPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        requiredSkills: { include: { skill: true } },
        user: true,
      },
    });

    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    res.status(200).json(jobPost);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// This function handles filtering the job posts based on the query parameters
export const searchFilteredPosts = async (req, res) => {
  try {
    const { search, salary, experience, location, skills } = req.query;

    // Start building the query for job posts
    const query = {
      where: {
        AND: [],
      },
      include: {
        requiredSkills: { // Ensure requiredSkills are included in the response
          include: {
            skill: true, // Include the related skill data
          },
        },
      },
    };

    // Handle search query for title, description, and location
    if (search) {
      const searchTerm = search.toLowerCase();
      query.where.AND.push({
        OR: [
          { name: { contains: searchTerm } },
          { location: { contains: searchTerm } },
        ],
      });
    }

    // Filter by salary (using salary range format 100-200)
    if (salary) {
      const [minSalary, maxSalary] = salary.split("-").map((value) => parseFloat(value));
      query.where.AND.push({
        salary: {
          gte: minSalary,
          lte: maxSalary,
        },
      });
    }

    // Filter by experience
    if (experience) {
      query.where.AND.push({
        experience: { gte: parseInt(experience) },
      });
    }

    // Filter by location
    if (location) {
      const locationTerm = location.toLowerCase();
      query.where.AND.push({
        location: { contains: locationTerm },
      });
    }

    // Filter by skills - Resolving skill names to IDs first
    if (skills) {
      const skillNames = skills.split(",").map((name) => name.trim().toLowerCase()); // Handle multiple skill names

      // Fetch skill IDs based on skill names
      const skillRecords = await prisma.skills.findMany({
        where: {
          name: {
            in: skillNames,
          },
        },
      });

      const skillIds = skillRecords.map((skill) => skill.id); // Get the skill IDs

      if (skillIds.length > 0) {
        query.where.AND.push({
          requiredSkills: {
            some: {
              skillId: { in: skillIds }, // Use the skill IDs for filtering
            },
          },
        });
      }
    }
    
    // Fetch posts from the database with requiredSkills included
    const posts = await prisma.jobPost.findMany(query);

    // Return filtered posts with requiredSkills data
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    return res.status(500).json({ error: "An error occurred while fetching posts." });
  }
};
