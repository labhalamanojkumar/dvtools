const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createContestPost() {
  try {
    console.log('Creating DVtools Student Activity Contest post...');

    // First, find or create the admin user (you'll need to replace with actual admin user ID)
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { role: 'SUPERADMIN' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Create or find categories
    const newsCategory = await prisma.category.upsert({
      where: { slug: 'news' },
      update: {},
      create: {
        name: 'News',
        slug: 'news',
        description: 'Latest news and announcements',
        color: '#3b82f6',
        icon: '📰',
        sortOrder: 1,
        isVisible: true,
      },
    });

    const contestCategory = await prisma.category.upsert({
      where: { slug: 'contests' },
      update: {},
      create: {
        name: 'Contests',
        slug: 'contests',
        description: 'Contests and competitions',
        color: '#ec4899',
        icon: '🏆',
        sortOrder: 2,
        isVisible: true,
      },
    });

    const studentCategory = await prisma.category.upsert({
      where: { slug: 'student-activities' },
      update: {},
      create: {
        name: 'Student Activities',
        slug: 'student-activities',
        description: 'Activities and programs for students',
        color: '#8b5cf6',
        icon: '🎓',
        sortOrder: 3,
        isVisible: true,
      },
    });

    // Create tags
    const tags = await Promise.all([
      prisma.tag.upsert({
        where: { slug: 'contest' },
        update: { useCount: { increment: 1 } },
        create: { name: 'Contest', slug: 'contest', color: '#ec4899' },
      }),
      prisma.tag.upsert({
        where: { slug: 'students' },
        update: { useCount: { increment: 1 } },
        create: { name: 'Students', slug: 'students', color: '#3b82f6' },
      }),
      prisma.tag.upsert({
        where: { slug: 'prize' },
        update: { useCount: { increment: 1 } },
        create: { name: 'Prize', slug: 'prize', color: '#22c55e' },
      }),
      prisma.tag.upsert({
        where: { slug: 'november-2024' },
        update: { useCount: { increment: 1 } },
        create: { name: 'November 2024', slug: 'november-2024', color: '#f59e0b' },
      }),
      prisma.tag.upsert({
        where: { slug: 'participate' },
        update: { useCount: { increment: 1 } },
        create: { name: 'Participate', slug: 'participate', color: '#8b5cf6' },
      }),
    ]);

    // Create the blog post
    const post = await prisma.post.create({
      data: {
        title: 'DVtools Student Activity Contest 2024 - Win ₹5,000 Cash Prize!',
        slug: 'dvtools-student-activity-contest-2024-november',
        excerpt: 'Join the DVtools Student Activity Contest this November 2024! Explore all our developer tools, create content, and win ₹5,000 cash prize. All participants receive certificates, and selected candidates get internship opportunities.',
        content: `# DVtools Student Activity Contest 2024 - Win ₹5,000 Cash Prize! 🏆

Are you a student passionate about technology and development tools? Here's your chance to explore **DVtools**, showcase your skills, and **win ₹5,000 cash prize**! Plus, all participants will receive a **Certificate of Participation**, and exceptional performers may be offered **internship opportunities**.

## 🎯 Contest Overview

The **DVtools Student Activity Contest** is running throughout **November 2024**, giving students a platform to explore our comprehensive suite of developer tools while building their portfolio and gaining recognition.

## 💰 Prizes & Recognition

- 🥇 **Best Performer**: ₹5,000 Cash Prize
- 📜 **All Participants**: Certificate of Participation
- 💼 **Exceptional Candidates**: Internship/Job Opportunities at DVtools

## 🔹 Who Can Participate?

**All students are eligible and encouraged to participate!** Whether you're pursuing:
- Computer Science & Engineering
- Information Technology
- Electronics & Communication
- Any other discipline with interest in technology

This contest is open to students from all backgrounds and year levels.

## 📋 Activity Requirements

To participate successfully, you must complete **all** of the following steps:

### 1️⃣ DVtools Exploration & Testing

**Objective**: Use and evaluate all available tools in DVtools

**Required Deliverable**: A comprehensive documentation covering:

- **Complete Tool List**: Document all tools you explored
- **Feature Analysis**: Detailed description of each tool's features and capabilities
- **Usage Guide**: Explain how each tool is used with examples
- **Personal Impact**: Describe how these tools are useful for you in:
  - Academic projects
  - Personal coding projects
  - Learning and skill development
- **Feedback & Bug Reports**: Share your honest feedback and report any errors or bugs you encounter

**💡 Pro Tip**: The more detailed and insightful your documentation, the better your chances of winning!

### 2️⃣ LinkedIn Task

**Objective**: Share your DVtools experience on LinkedIn

**Requirements**:
1. ✅ Create **one LinkedIn post** sharing your experience using DVtools
2. ✅ Follow the [official DVtools LinkedIn page](https://www.linkedin.com/company/dvtools)
3. ✅ Include the hashtag **#dvtools** in your post
4. ✅ Tag DVtools in your post for maximum visibility

**Content Suggestions**:
- Share which tools you found most useful
- Explain how DVtools helped you in your projects
- Include screenshots or examples (if applicable)
- Be authentic and creative!

### 3️⃣ Video Creation

**Objective**: Create a video explaining DVtools

**Requirements**:
- 📹 Create a **short video** (3-10 minutes recommended) explaining:
  - What is DVtools?
  - Your experience using the platform
  - Demonstration of your favorite tools
  - How it benefits students and developers

**Video Format**:
- ✅ **Faceless videos are allowed** - you can use:
  - Voiceover with screen recording
  - Animated presentations
  - Screen capture with narration
- ✅ Upload to **Google Drive**
- ✅ Set sharing permissions to **"Anyone with the link can view"**

**💡 Quality Tips**:
- Clear audio is essential
- Well-structured content
- Good pacing (not too fast or slow)
- Professional presentation

## 📧 Submission Details

**Email all required materials to**: 📩 **connect@dvtools.in**

**Subject Line**: DVtools Student Contest - [Your Name] - [College Name]

**Email must include**:

1. 📄 **Documentation** (PDF or Word format)
2. 🔗 **LinkedIn post link**
3. 🎥 **Google Drive video link** (with proper sharing permissions)
4. 📝 **Participant Details**:
   - Full Name
   - College/University Name
   - Department & Year of Study
   - Contact Number (WhatsApp preferred)
   - Email Address

**⚠️ Important**: Incomplete submissions will not be considered for evaluation.

## 🏆 Evaluation Criteria

Your submission will be judged based on:

### 1. Tool Understanding (30%)
- Proper use and understanding of DVtools features
- Depth of exploration across different tools
- Technical accuracy in documentation

### 2. Documentation Quality (25%)
- Completeness and organization
- Clarity of explanations
- Quality of examples and use cases
- Constructive feedback and insights

### 3. Video Content (25%)
- Creativity and presentation quality
- Clarity and comprehensiveness
- Technical demonstration
- Engagement and communication skills

### 4. LinkedIn Engagement (20%)
- Professionalism of the post
- Quality of content
- Engagement (likes, comments, shares)
- Authentic experience sharing

## 📅 Important Dates

- **Contest Start**: November 1, 2024
- **Submission Deadline**: November 30, 2024 (11:59 PM IST)
- **Winner Announcement**: December 7, 2024

## 🎯 Why Participate?

### For Your Resume
- 📜 Certificate of Participation from DVtools
- 🏆 Recognition as a contest winner (if selected)
- 💼 Potential internship/job opportunity

### For Your Skills
- 🛠️ Hands-on experience with 30+ developer tools
- 📊 Portfolio content (video and documentation)
- 🌐 LinkedIn presence and professional networking

### For Your Future
- 💰 Cash prize for best performer
- 🤝 Connection with the DVtools team
- 🚀 Early career opportunities in tech

## 🛠️ Available Tools on DVtools

Explore our comprehensive suite of developer tools including:

### Frontend Development
- 🎨 **Component Playground**: Test and prototype UI components
- 🎨 **Theme Builder**: Create custom themes
- 📱 **Responsive Design Tester**: Test responsive layouts
- ♿ **Accessibility Scanner**: Check accessibility compliance
- 🎨 **Design to Code Exporter**: Convert designs to code

### Backend & API Tools
- 🔧 **API Simulator**: Test API endpoints
- 📊 **Database Query Runner**: Execute database queries
- 🔄 **Migration Manager**: Manage database migrations
- 🎯 **Rate Limiter Dashboard**: Monitor rate limiting
- 🔐 **Secrets Vault Interface**: Manage environment secrets

### Data & Analytics
- 📊 **Usage Analytics Explorer**: Analyze user data
- 📝 **Log Viewer & Search**: Search and analyze logs
- 📈 **CSV/Excel Inspector**: Inspect and manipulate data
- 🔗 **Data Connector Hub**: Connect to various data sources
- 🤖 **ML Playground**: Experiment with machine learning
- 📊 **A/B Test Manager**: Manage A/B tests

### Developer Utilities
- 📝 **JSON Formatter**: Format and validate JSON
- 🔐 **Base64 Encoder/Decoder**: Encode/decode Base64
- ✨ **Code Beautifier**: Format and beautify code
- 🔗 **URL Encoder/Decoder**: Encode/decode URLs
- 🔑 **JWT Decoder**: Decode JWT tokens
- 🔍 **RegExp Tester**: Test regular expressions
- 💾 **Mock Data Generator**: Generate test data
- 📝 **Lorem Ipsum Generator**: Generate placeholder text
- 🖼️ **Image Editor**: Edit and optimize images
- 🎨 **Color Palette Studio**: Create color palettes
- 📚 **Icon Library**: Browse and use icons

### Performance & Optimization
- ⚡ **Performance Profiler**: Profile application performance
- 🖼️ **Image Optimizer & Converter**: Optimize images
- 🎨 **CSS Linter & Optimizer**: Optimize CSS code

And many more tools to explore!

## ❓ Frequently Asked Questions

### Q: Can I participate if I'm in my first year?
**A**: Absolutely! This contest is open to students from all years and disciplines.

### Q: Is there a participation fee?
**A**: No, participation is completely **FREE**!

### Q: Can I work in a team?
**A**: This is an **individual contest**. Each participant must submit their own work.

### Q: What if I find bugs in DVtools?
**A**: Great! Report them in your documentation. Quality bug reports are valued in the evaluation.

### Q: Can I submit after the deadline?
**A**: Unfortunately, late submissions will not be accepted. Please ensure timely submission.

### Q: How will I know if I've won?
**A**: Winners will be announced on December 7, 2024, via email and on our official channels.

## 📞 Contact & Support

Have questions? Need help?

- 📧 **Email**: connect@dvtools.in
- 🌐 **Website**: [www.dvtools.in](https://www.dvtools.in)
- 💼 **LinkedIn**: [DVtools Official](https://www.linkedin.com/company/dvtools)

## 🚀 Ready to Get Started?

1. **Visit**: [https://www.dvtools.in](https://www.dvtools.in)
2. **Explore**: All the amazing developer tools
3. **Document**: Your experience and insights
4. **Create**: Engaging LinkedIn post and video
5. **Submit**: Everything to connect@dvtools.in before November 30, 2024

## 🎓 Final Note

This contest is not just about winning prizes—it's about:
- **Learning** new tools and technologies
- **Building** your professional portfolio
- **Networking** with the developer community
- **Growing** your skills and confidence

We look forward to seeing your creativity, technical skills, and unique perspectives on DVtools!

**Good luck, and happy exploring!** 🚀

---

*#DVtools #StudentContest #DeveloperTools #TechContest #StudentActivity #CodingContest #WebDevelopment #Programming #TechEducation #CareerOpportunity*

---

**Disclaimer**: This contest is subject to the terms and conditions available on our website. DVtools reserves the right to modify contest rules or disqualify submissions that don't meet the requirements.`,
        markdownContent: `# DVtools Student Activity Contest 2024 - Win ₹5,000 Cash Prize! 🏆

[Full markdown content as above...]`,
        type: 'NEWS',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: adminUser.id,
        
        // SEO fields
        metaTitle: 'DVtools Student Activity Contest 2024 - Win ₹5,000 | November 2024',
        metaDescription: 'Join DVtools Student Contest 2024! Win ₹5,000 cash prize, certificates & internship opportunities. Explore 30+ developer tools. Open to all students. Deadline: Nov 30, 2024.',
        metaKeywords: 'dvtools contest, student contest 2024, coding contest, tech contest, win cash prize, programming contest, web development, november 2024, student competition',
        ogImage: '/blog/dvtools-student-contest-2024.svg',
        
        // Engagement
        featured: true,
        isPinned: true,
        allowComments: true,
        views: 0,
        likes: 0,
        shares: 0,
        
        // Relations
        categories: {
          create: [
            { categoryId: newsCategory.id },
            { categoryId: contestCategory.id },
            { categoryId: studentCategory.id },
          ],
        },
        tags: {
          create: tags.map(tag => ({
            tagId: tag.id,
          })),
        },
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    console.log('✅ Contest post created successfully!');
    console.log('Post ID:', post.id);
    console.log('Slug:', post.slug);
    console.log('Title:', post.title);
    console.log('Categories:', post.categories.map(c => c.category.name).join(', '));
    console.log('Tags:', post.tags.map(t => t.tag.name).join(', '));
    console.log('\nPost URL: /blog/' + post.slug);
    console.log('News URL: /news (will show as NEWS type)');

  } catch (error) {
    console.error('Error creating contest post:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createContestPost()
  .then(() => {
    console.log('\n✨ Done! The contest post is now live.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create contest post:', error);
    process.exit(1);
  });
