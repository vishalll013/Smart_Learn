const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get Student dashboard details
// @route   GET /api/dashboard/student
// @access  Private (Student only)
router.get('/student', protect, authorize('student'), async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const progress = await Progress.findOne({ userId: req.user.id })
      .populate('courseProgress.courseId', 'title category difficulty duration thumbnail');
    
    // AI course recommendation simulator
    // Recommends courses in category student has NOT completed or has highest activity
    const enrolledIds = progress ? progress.courseProgress.map(cp => cp.courseId._id) : [];
    const recommended = await Course.find({ _id: { $nin: enrolledIds } })
      .limit(3)
      .select('title category difficulty duration thumbnail');

    res.json({
      success: true,
      stats: {
        points: student.points,
        streak: student.streak,
        completedLessons: student.completedLessons,
        dailyGoal: student.dailyGoal,
        badgesCount: student.badges.length,
        badges: student.badges,
      },
      courseProgress: progress ? progress.courseProgress : [],
      quizHistory: progress ? progress.quizHistory : [],
      gameHistory: progress ? progress.gameHistory : [],
      certificates: progress ? progress.certificates : [],
      recommended,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get Parent dashboard details (children monitoring)
// @route   GET /api/dashboard/parent
// @access  Private (Parent only)
router.get('/parent', protect, authorize('parent'), async (req, res) => {
  try {
    // Populate children list
    const parent = await User.findById(req.user.id).populate({
      path: 'childrenIds',
      select: 'name email points streak badges completedLessons',
    });

    const childrenProgressList = [];

    // Loop children to query progress details
    for (const child of parent.childrenIds) {
      const progress = await Progress.findOne({ userId: child._id })
        .populate('courseProgress.courseId', 'title category');
      
      childrenProgressList.push({
        childId: child._id,
        name: child.name,
        email: child.email,
        points: child.points,
        streak: child.streak,
        badges: child.badges,
        courseProgress: progress ? progress.courseProgress : [],
        quizHistory: progress ? progress.quizHistory : [],
        gameHistory: progress ? progress.gameHistory : [],
        certificates: progress ? progress.certificates : [],
      });
    }

    res.json({
      success: true,
      children: childrenProgressList,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get Teacher dashboard analytics
// @route   GET /api/dashboard/teacher
// @access  Private (Teacher only)
router.get('/teacher', protect, authorize('teacher'), async (req, res) => {
  try {
    // Courses created by this teacher
    const courses = await Course.find({ createdBy: req.user.id });
    const courseIds = courses.map(c => c._id);

    // Quizzes created by this teacher
    const quizzes = await Quiz.find({ createdBy: req.user.id });

    // Students enrolled in this teacher's courses
    const allProgress = await Progress.find({
      'courseProgress.courseId': { $in: courseIds }
    }).populate('userId', 'name email points streak completedLessons');

    const studentsReport = allProgress.map(p => {
      const teacherCoursesProgress = p.courseProgress.filter(
        cp => courseIds.some(id => id.toString() === cp.courseId.toString())
      );
      
      return {
        studentId: p.userId._id,
        name: p.userId.name,
        email: p.userId.email,
        points: p.userId.points,
        completedLessonsTotal: p.userId.completedLessons,
        courseEnrolledCount: teacherCoursesProgress.length,
        quizScores: p.quizHistory,
      };
    });

    const announcements = await Announcement.find({ createdBy: req.user.id });

    res.json({
      success: true,
      stats: {
        coursesCount: courses.length,
        quizzesCount: quizzes.length,
        studentsCount: studentsReport.length,
        announcementsCount: announcements.length,
      },
      courses,
      quizzes,
      announcements,
      students: studentsReport,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get Admin dashboard complete metrics
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
router.get('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'student' });
    const parentsCount = await User.countDocuments({ role: 'parent' });
    const teachersCount = await User.countDocuments({ role: 'teacher' });
    
    const coursesCount = await Course.countDocuments();
    const quizzesCount = await Quiz.countDocuments();
    const announcementsCount = await Announcement.countDocuments();

    // Fetch system-wide recent quiz attempts
    const allProgress = await Progress.find({}).populate('userId', 'name email');
    const recentActivity = [];
    allProgress.forEach(p => {
      p.quizHistory.forEach(q => {
        recentActivity.push({
          studentName: p.userId ? p.userId.name : 'Unknown Student',
          type: 'Quiz Completed',
          details: `Completed "${q.quizTitle}" with score ${q.score}/${q.maxScore}`,
          date: q.completedAt,
        });
      });
      p.certificates.forEach(c => {
        recentActivity.push({
          studentName: p.userId ? p.userId.name : 'Unknown Student',
          type: 'Certificate Earned',
          details: `Earned certificate for "${c.courseTitle}"`,
          date: c.issuedAt,
        });
      });
    });

    // Sort recent activities by date
    recentActivity.sort((a,b) => b.date - a.date);

    res.json({
      success: true,
      stats: {
        totalUsers,
        studentsCount,
        parentsCount,
        teachersCount,
        coursesCount,
        quizzesCount,
        announcementsCount,
      },
      recentActivity: recentActivity.slice(0, 15),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
