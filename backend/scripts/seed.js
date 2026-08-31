const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const Announcement = require('../models/Announcement');
const Resource = require('../models/Resource');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartlearn';

const seedData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear collections
    await User.deleteMany({});
    await Course.deleteMany({});
    await Quiz.deleteMany({});
    await Progress.deleteMany({});
    await Announcement.deleteMany({});
    await Resource.deleteMany({});
    console.log('🧹 Existing data cleared.');

    // 1. Create Default Users
    // Admin
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@smartlearn.com',
      password: 'password123',
      role: 'admin',
      points: 500,
    });

    // Teacher
    const teacher = await User.create({
      name: 'Ms. Emily Harris',
      email: 'teacher@smartlearn.com',
      password: 'password123',
      role: 'teacher',
      points: 300,
    });

    // Parent
    const parent = await User.create({
      name: 'Robert Parker',
      email: 'parent@smartlearn.com',
      password: 'password123',
      role: 'parent',
      points: 200,
    });

    // Student (linked to Parent)
    const student = await User.create({
      name: 'Timmy Parker',
      email: 'student@smartlearn.com',
      password: 'password123',
      role: 'student',
      parentId: parent._id,
      points: 240,
      streak: 5,
      completedLessons: 4,
      badges: [
        { name: 'First Step', description: 'Completed your first lesson!', icon: '🎯' },
        { name: 'Curious Mind', description: 'Completed 5 lessons!', icon: '📚' }
      ]
    });

    // Link Parent to Student
    parent.childrenIds.push(student._id);
    await parent.save();

    console.log('👤 Default users created.');

    // 2. Create Courses
    const coursesData = [
      {
        title: 'Coding Adventures with Scratch',
        category: 'Coding for Kids',
        description: 'Learn block-based coding and build your very first interactive story and games with Scratch!',
        difficulty: 'Beginner',
        duration: '3 hours',
        thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=400&auto=format&fit=crop',
        createdBy: teacher._id,
        lessons: [
          {
            title: 'Welcome to Scratch Interface',
            type: 'video',
            content: 'In this video lesson, we explore the Scratch editor. Learn about the Sprite Stage, Block Palettes, and Script Area. Discover how dragging blocks blocks controls character movement.',
            videoUrl: 'https://www.youtube.com/embed/t894eG_2aY4',
            durationMinutes: 10,
          },
          {
            title: 'Your First Motion Blocks',
            type: 'reading',
            content: 'Learn how to make your cat sprite walk, bounce off edges, and rotate! Motion blocks are colored blue and allow you to set positions and turns. Exercise: Try moving 50 steps!',
            durationMinutes: 12,
          },
          {
            title: 'Loops and Events Control',
            type: 'interactive',
            content: 'Get control of timing! Using "when green flag clicked" starts the program, and "forever" loops repeat scripts infinitely. Let us link key presses to controls.',
            durationMinutes: 15,
          }
        ]
      },
      {
        title: 'Fun with Fractions & Numbers',
        category: 'Mathematics',
        description: 'Understand fractions through visuals, interactive pizza slicers, and real-life mathematical situations!',
        difficulty: 'Beginner',
        duration: '2 hours',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&auto=format&fit=crop',
        createdBy: teacher._id,
        lessons: [
          {
            title: 'What is a Fraction?',
            type: 'reading',
            content: 'A fraction represents a part of a whole. It consists of a numerator (top number) and a denominator (bottom number). Imagine a pizza cut into 4 slices: 1 slice is 1/4 of the pizza!',
            durationMinutes: 15,
          },
          {
            title: 'Numerator vs Denominator',
            type: 'video',
            content: 'Watch this visual explanation to see how numerator and denominators change as parts are colored or removed.',
            videoUrl: 'https://www.youtube.com/embed/n0FZhQ_GkKw',
            durationMinutes: 8,
          }
        ]
      },
      {
        title: 'Space Explorers: Our Solar System',
        category: 'Science',
        description: 'Launch into orbit and explore the sun, 8 planets, asteroid belts, and moon cycles in our solar system!',
        difficulty: 'Intermediate',
        duration: '4 hours',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop',
        createdBy: teacher._id,
        lessons: [
          {
            title: 'Our Star: The Sun',
            type: 'reading',
            content: 'The sun is a hot ball of glowing gases at the heart of our solar system. Its gravity holds everything in orbit. Without the sun, life on Earth would not exist!',
            durationMinutes: 15,
          },
          {
            title: 'The Inner Rocky Planets',
            type: 'reading',
            content: 'Learn about Mercury, Venus, Earth, and Mars. They are rocky, dense, and closest to the sun. Earth is the only planet containing liquid oceans and living creatures!',
            durationMinutes: 20,
          },
          {
            title: 'The Gas Giants',
            type: 'video',
            content: 'Take a virtual tour of Jupiter, Saturn, Uranus, and Neptune. These massive cold gas spheres feature large wind storms and icy ring tracks.',
            videoUrl: 'https://www.youtube.com/embed/libKVRa01L8',
            durationMinutes: 15,
          }
        ]
      }
    ];

    const courses = await Course.insertMany(coursesData);
    console.log('📚 Courses created.');

    // 3. Create Quizzes
    const quizzesData = [
      {
        title: 'Scratch Coding Basics',
        category: 'Coding for Kids',
        courseId: courses[0]._id,
        difficulty: 'Beginner',
        timeLimitSeconds: 60,
        createdBy: teacher._id,
        questions: [
          {
            questionText: 'What color are Motion blocks in Scratch?',
            options: ['Green', 'Blue', 'Purple', 'Orange'],
            correctAnswerIndex: 1,
            explanation: 'Motion blocks are colored blue and allow sprites to rotate or change coordinate position.'
          },
          {
            questionText: 'Which block is used to repeat commands forever?',
            options: ['If-Then block', 'Repeat 10 block', 'Forever block', 'Wait 1 Sec block'],
            correctAnswerIndex: 2,
            explanation: 'The Forever loop runs the blocks placed inside it continuously until the stop button is pressed.'
          },
          {
            questionText: 'What represents the background stage of a Scratch project?',
            options: ['Sprite', 'Costume', 'Backdrop', 'Block'],
            correctAnswerIndex: 2,
            explanation: 'Backdrops are images displayed on the stage background.'
          }
        ]
      },
      {
        title: 'Fractions Discovery Quiz',
        category: 'Mathematics',
        courseId: courses[1]._id,
        difficulty: 'Beginner',
        timeLimitSeconds: 45,
        createdBy: teacher._id,
        questions: [
          {
            questionText: 'What is the top number of a fraction called?',
            options: ['Denominator', 'Integers', 'Numerator', 'Division'],
            correctAnswerIndex: 2,
            explanation: 'The top number is the Numerator representing selected parts. The bottom is the Denominator.'
          },
          {
            questionText: 'If you eat 3 out of 8 slices of a pizza, what fraction did you eat?',
            options: ['3/8', '8/3', '5/8', '1/3'],
            correctAnswerIndex: 0,
            explanation: '3 represents the parts eaten (numerator) and 8 represents total parts (denominator), giving 3/8.'
          }
        ]
      },
      {
        title: 'Solar System Voyage Quiz',
        category: 'Science',
        courseId: courses[2]._id,
        difficulty: 'Intermediate',
        timeLimitSeconds: 90,
        createdBy: teacher._id,
        questions: [
          {
            questionText: 'Which planet is closest to the Sun?',
            options: ['Venus', 'Earth', 'Mercury', 'Mars'],
            correctAnswerIndex: 2,
            explanation: 'Mercury orbits closest to the Sun, completing a year in just 88 Earth days.'
          },
          {
            questionText: 'What is the largest planet in our solar system?',
            options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
            correctAnswerIndex: 1,
            explanation: 'Jupiter is a massive gas giant, larger than all other planets combined.'
          },
          {
            questionText: 'Which planet is famous for its gorgeous rings?',
            options: ['Mars', 'Jupiter', 'Saturn', 'Mercury'],
            correctAnswerIndex: 2,
            explanation: 'Saturn features spectacular rings composed of trillions of ice chunks and rock particles.'
          }
        ]
      }
    ];

    await Quiz.insertMany(quizzesData);
    console.log('✍️ Quizzes created.');

    // 4. Create Student Progress Details
    // Timmy has finished "Fun with Fractions" course and attempted Fractions quiz.
    // Also partially complete with Scratch course
    await Progress.create({
      userId: student._id,
      courseProgress: [
        {
          courseId: courses[0]._id,
          progressPercent: 33,
          completedLessons: [courses[0].lessons[0]._id],
          lastAccessed: Date.now() - 3600000 * 2,
        },
        {
          courseId: courses[1]._id,
          progressPercent: 100,
          completedLessons: [courses[1].lessons[0]._id, courses[1].lessons[1]._id],
          lastAccessed: Date.now() - 3600000 * 24,
        }
      ],
      quizHistory: [
        {
          quizId: new mongoose.Types.ObjectId(), // Dummy ID to satisfy model
          quizTitle: 'Fractions Discovery Quiz',
          score: 2,
          maxScore: 2,
          completedAt: Date.now() - 3600000 * 24,
        }
      ],
      gameHistory: [
        {
          gameName: 'Math Explorer',
          score: 85,
          completedAt: Date.now() - 3600000 * 4,
        },
        {
          gameName: 'Memory Match',
          score: 120,
          completedAt: Date.now() - 3600000 * 12,
        }
      ],
      certificates: [
        {
          courseId: courses[1]._id,
          courseTitle: 'Fun with Fractions & Numbers',
          issuedAt: Date.now() - 3600000 * 24,
          certificateId: 'CERT-FRACT123'
        }
      ]
    });
    console.log('📈 Timmy progress history loaded.');

    // 5. Create Resources
    const resourcesData = [
      {
        title: 'Fun Math Worksheets: Fractions Coloring',
        description: 'Printable color-by-numbers fractions workbook for elementary students.',
        category: 'Mathematics',
        type: 'worksheet',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        size: '1.4 MB',
        downloadsCount: 154,
        createdBy: teacher._id,
      },
      {
        title: 'Scratch Cheat Sheet: Block Categories Reference',
        description: 'A 1-page quick PDF reference of all block color definitions and syntax.',
        category: 'Coding for Kids',
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        size: '800 KB',
        downloadsCount: 92,
        createdBy: teacher._id,
      },
      {
        title: 'Solar System Study Planner & Fact Card Set',
        description: 'Beautiful printable layout cards about all planets and moons.',
        category: 'Science',
        type: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        size: '2.5 MB',
        downloadsCount: 78,
        createdBy: teacher._id,
      }
    ];

    await Resource.insertMany(resourcesData);
    console.log('📂 Resources created.');

    // 6. Create Announcements
    const announcementsData = [
      {
        title: 'Weekly Math Challenge Starts Monday!',
        content: 'Hey students! Make sure to check the Math Explorer game. Top 3 scores on the leaderboard this Friday get 100 extra learning points!',
        roleTarget: 'all',
        createdBy: teacher._id,
      },
      {
        title: 'Upcoming Parent-Teacher Conferences',
        content: 'Dear Parents, please select your timeslot in the messaging dashboard for our quarterly review on July 10th. We will discuss course progressions and streaks.',
        roleTarget: 'parent',
        createdBy: admin._id,
      },
      {
        title: 'Welcome to Smart Learn!',
        content: 'Explore courses, play coding mini-games, and complete quizzes to earn badges and rise in points!',
        roleTarget: 'student',
        createdBy: admin._id,
      }
    ];

    await Announcement.insertMany(announcementsData);
    console.log('📣 Announcements created.');

    console.log('✨ Seeding completed successfully!');
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    mongoose.disconnect();
  }
};

seedData();
