const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createStudentParticipationNews() {
  try {
    console.log('Creating DVtools Student Activity Participation Guidelines news article...');

    // Find admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { role: 'SUPERADMIN' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (!adminUser) {
      console.error('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log(`✅ Found admin user: ${adminUser.email}`);

    // Create or find categories
    const newsCategory = await prisma.category.upsert({
      where: { slug: 'news' },
      update: {},
      create: {
        name: 'News',
        slug: 'news',
        description: 'Latest news and announcements from DVtools',
        color: '#3b82f6',
        icon: '📰',
        sortOrder: 1,
        isVisible: true,
      },
    });

    const studentCategory = await prisma.category.upsert({
      where: { slug: 'student-activities' },
      update: {},
      create: {
        name: 'Student Activities',
        slug: 'student-activities',
        description: 'Activities, contests, and programs for students',
        color: '#8b5cf6',
        icon: '🎓',
        sortOrder: 3,
        isVisible: true,
      },
    });

    const announcementCategory = await prisma.category.upsert({
      where: { slug: 'announcements' },
      update: {},
      create: {
        name: 'Announcements',
        slug: 'announcements',
        description: 'Important announcements and updates',
        color: '#ef4444',
        icon: '📢',
        sortOrder: 2,
        isVisible: true,
      },
    });

    console.log('✅ Categories created/updated');

    // Create tags with better SEO keywords
    const tags = await Promise.all([
      prisma.tag.upsert({
        where: { slug: 'student-contest' },
        update: { useCount: { increment: 1 } },
        create: { name: 'Student Contest', slug: 'student-contest', color: '#ec4899', description: 'Student contests and competitions' },
      }),
      prisma.tag.upsert({
        where: { slug: 'participation-guidelines' },
        update: { useCount: { increment: 1 } },
        create: { name: 'Participation Guidelines', slug: 'participation-guidelines', color: '#3b82f6', description: 'Guidelines for participation' },
      }),
      prisma.tag.upsert({
        where: { slug: 'developer-tools' },
        update: { useCount: { increment: 1 } },
        create: { name: 'Developer Tools', slug: 'developer-tools', color: '#10b981', description: 'Developer tools and resources' },
      }),
      prisma.tag.upsert({
        where: { slug: 'cash-prize' },
        update: { useCount: { increment: 1 } },
        create: { name: 'Cash Prize', slug: 'cash-prize', color: '#f59e0b', description: 'Cash prizes and rewards' },
      }),
      prisma.tag.upsert({
        where: { slug: 'certificates' },
        update: { useCount: { increment: 1 } },
        create: { name: 'Certificates', slug: 'certificates', color: '#6366f1', description: 'Certificates and recognition' },
      }),
      prisma.tag.upsert({
        where: { slug: 'november-2025' },
        update: { useCount: { increment: 1 } },
        create: { name: 'November 2025', slug: 'november-2025', color: '#8b5cf6', description: 'November 2025 events' },
      }),
    ]);

    console.log('✅ Tags created/updated');

    // Check if post already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug: 'dvtools-student-participation-guidelines-november-2025' }
    });

    if (existingPost) {
      console.log('⚠️  Post already exists. Updating...');
      
      const updatedPost = await prisma.post.update({
        where: { id: existingPost.id },
        data: {
          title: 'DVtools Student Activity – Participation Guidelines & Win ₹5,000 Cash Prize',
          excerpt: 'Complete guide for students to participate in DVtools activity. Explore developer tools, create content, win ₹5,000 cash prize and earn certificates. Open to all students!',
          content: generateFullContent(),
          markdownContent: generateMarkdownContent(),
          type: 'NEWS',
          status: 'PUBLISHED',
          featured: true,
          isPinned: true,
          publishedAt: new Date(),
          metaTitle: 'DVtools Student Participation Guidelines 2025 - Win ₹5,000 | Developer Tools Contest',
          metaDescription: 'Join DVtools student activity! Complete participation guidelines: explore 50+ developer tools, create videos, LinkedIn posts. Win ₹5,000 cash prize + certificates. All students eligible.',
          metaKeywords: 'DVtools student contest, developer tools competition, student participation guidelines, win cash prize, developer tools for students, free certificates, LinkedIn contest, video creation contest, student developer program, DVtools activity 2025',
          ogImage: '/news/student-participation-guidelines.jpg',
          views: existingPost.views,
          likes: existingPost.likes,
          shares: existingPost.shares,
        },
      });

      console.log(`✅ Post updated: ${updatedPost.title}`);
      console.log(`🔗 Slug: ${updatedPost.slug}`);
      console.log(`🌐 URL: https://dvtools.dev/news/${updatedPost.slug}`);

    } else {
      // Create the news post
      const post = await prisma.post.create({
        data: {
          title: 'DVtools Student Activity – Participation Guidelines & Win ₹5,000 Cash Prize',
          slug: 'dvtools-student-participation-guidelines-november-2025',
          excerpt: 'Complete guide for students to participate in DVtools activity. Explore developer tools, create content, win ₹5,000 cash prize and earn certificates. Open to all students!',
          content: generateFullContent(),
          markdownContent: generateMarkdownContent(),
          type: 'NEWS',
          status: 'PUBLISHED',
          featured: true,
          isPinned: true,
          authorId: adminUser.id,
          publishedAt: new Date(),
          
          // Enhanced SEO fields
          metaTitle: 'DVtools Student Participation Guidelines 2025 - Win ₹5,000 | Developer Tools Contest',
          metaDescription: 'Join DVtools student activity! Complete participation guidelines: explore 50+ developer tools, create videos, LinkedIn posts. Win ₹5,000 cash prize + certificates. All students eligible.',
          metaKeywords: 'DVtools student contest, developer tools competition, student participation guidelines, win cash prize, developer tools for students, free certificates, LinkedIn contest, video creation contest, student developer program, DVtools activity 2025',
          ogImage: '/news/student-participation-guidelines.jpg',
          
          // Engagement settings
          allowComments: true,
          views: 0,
          likes: 0,
          shares: 0,
        },
      });

      // Link categories to post
      await Promise.all([
        prisma.postCategory.create({
          data: {
            postId: post.id,
            categoryId: newsCategory.id,
          },
        }),
        prisma.postCategory.create({
          data: {
            postId: post.id,
            categoryId: studentCategory.id,
          },
        }),
        prisma.postCategory.create({
          data: {
            postId: post.id,
            categoryId: announcementCategory.id,
          },
        }),
      ]);

      // Link tags to post
      await Promise.all(
        tags.map((tag) =>
          prisma.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id,
            },
          })
        )
      );

      console.log('✅ Post created successfully!');
      console.log(`📝 Title: ${post.title}`);
      console.log(`🔗 Slug: ${post.slug}`);
      console.log(`🌐 URL: https://dvtools.dev/news/${post.slug}`);
      console.log(`📅 Published: ${post.publishedAt}`);
      console.log(`⭐ Featured: ${post.featured}`);
      console.log(`📌 Pinned: ${post.isPinned}`);
    }

    console.log('\n✨ Remember to add the image file at: public/news/student-participation-guidelines.jpg');
    console.log('   Recommended size: 1200x630px for optimal social media sharing');

  } catch (error) {
    console.error('❌ Error creating post:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

function generateFullContent() {
  return `
<article class="news-article student-participation-guidelines">
  <div class="article-hero">
    <img src="/news/student-participation-guidelines.jpg" alt="DVtools Student Activity Participation Guidelines" class="hero-image" />
  </div>

  <div class="article-content">
    <h2>🎓 DVtools Student Activity – Participation Guidelines</h2>
    
    <p class="lead">We're excited to invite all students to participate in the DVtools Student Activity! This is your opportunity to explore cutting-edge developer tools, showcase your skills, and win amazing prizes including a ₹5,000 cash prize for the best performer.</p>

    <div class="highlight-box">
      <h3>🏆 Prizes & Recognition</h3>
      <ul>
        <li><strong>Best Performer:</strong> ₹5,000 Cash Prize 💰</li>
        <li><strong>All Participants:</strong> Certificate of Participation 📜</li>
        <li><strong>Selected Candidates:</strong> Potential internship opportunities 🚀</li>
      </ul>
    </div>

    <h3>🔹 Who Can Participate?</h3>
    <p>All students from any college, department, or year are eligible and encouraged to participate. Whether you're a computer science student or from any other discipline, if you're interested in developer tools and technology, this activity is for you!</p>

    <h3>🔹 Activity Requirements</h3>
    <p>To participate and be eligible for prizes, you must complete <strong>ALL</strong> of the following steps:</p>

    <div class="requirement-section">
      <h4>1️⃣ DVtools Exploration & Testing</h4>
      <ul>
        <li>Use <strong>all available tools</strong> in DVtools platform (50+ developer tools)</li>
        <li>Explore various categories:
          <ul>
            <li>Code formatters & beautifiers</li>
            <li>API testing & simulation tools</li>
            <li>Database query runners</li>
            <li>Image optimization tools</li>
            <li>Security testing tools</li>
            <li>DevOps utilities</li>
            <li>And many more!</li>
          </ul>
        </li>
        <li>Prepare a <strong>detailed document</strong> covering:
          <ul>
            <li>List of tools you explored and their features</li>
            <li>How each tool is used (step-by-step if possible)</li>
            <li>How it is useful for you (in academics, projects, or learning)</li>
            <li>Any feedback, suggestions, or errors/bugs you encountered</li>
            <li>Screenshots or examples of your usage</li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="requirement-section">
      <h4>2️⃣ LinkedIn Task</h4>
      <ul>
        <li>Create <strong>one professional LinkedIn post</strong> sharing your experience using DVtools</li>
        <li><strong>Follow</strong> the official DVtools LinkedIn page: <a href="https://www.linkedin.com/company/dvtools" target="_blank" rel="noopener">linkedin.com/company/dvtools</a></li>
        <li>Mention <strong>#DVtools</strong> hashtag in your post</li>
        <li>Additional suggested hashtags: #DeveloperTools #StudentDeveloper #TechTools #CodingTools</li>
        <li>Tag @DVtools in your post for better visibility</li>
        <li>Share your genuine experience and insights</li>
      </ul>
    </div>

    <div class="requirement-section">
      <h4>3️⃣ Video Creation</h4>
      <ul>
        <li>Create a <strong>short video</strong> (5-15 minutes) explaining:
          <ul>
            <li>What is DVtools and its purpose</li>
            <li>Demonstration of at least 5-10 tools</li>
            <li>Your personal experience and feedback</li>
            <li>How students can benefit from these tools</li>
          </ul>
        </li>
        <li>The video can be <strong>faceless</strong> – voiceover or screen recording is perfectly acceptable!</li>
        <li>Ensure good audio quality and clear explanations</li>
        <li>Upload to <strong>Google Drive</strong></li>
        <li>Set sharing permissions to: <strong>"Anyone with the link can view"</strong></li>
        <li>Video formats accepted: MP4, MOV, AVI</li>
      </ul>
    </div>

    <h3>🔹 Submission Details</h3>
    <div class="submission-box">
      <p><strong>Email all materials to:</strong> <a href="mailto:connect@dvtools.in">📩 connect@dvtools.in</a></p>
      
      <p><strong>Your submission must include:</strong></p>
      <ol>
        <li><strong>Documentation</strong> (PDF or Word format)
          <ul>
            <li>Should be well-formatted and professional</li>
            <li>Include table of contents</li>
            <li>Add screenshots where relevant</li>
          </ul>
        </li>
        <li><strong>LinkedIn post link</strong>
          <ul>
            <li>Direct URL to your LinkedIn post</li>
            <li>Ensure the post is public</li>
          </ul>
        </li>
        <li><strong>Google Drive video link</strong>
          <ul>
            <li>Shareable link with view permissions</li>
            <li>Test the link before submitting</li>
          </ul>
        </li>
        <li><strong>Participant details:</strong>
          <ul>
            <li>Full Name</li>
            <li>College Name</li>
            <li>Department & Year (e.g., CSE - 3rd Year)</li>
            <li>Contact Number (with WhatsApp if different)</li>
            <li>Email Address</li>
            <li>LinkedIn Profile URL</li>
          </ul>
        </li>
      </ol>

      <p class="deadline"><strong>⏰ Submission Deadline:</strong> November 30, 2025, 11:59 PM IST</p>
    </div>

    <h3>🔹 Evaluation Criteria</h3>
    <p>Submissions will be evaluated based on the following criteria:</p>
    <div class="criteria-grid">
      <div class="criterion">
        <h4>🎯 Tool Exploration (30%)</h4>
        <p>Depth and breadth of tool usage, understanding of features</p>
      </div>
      <div class="criterion">
        <h4>📄 Documentation Quality (25%)</h4>
        <p>Completeness, clarity, professionalism, and insights</p>
      </div>
      <div class="criterion">
        <h4>🎥 Video Quality (25%)</h4>
        <p>Creativity, clarity, demonstration skills, and presentation</p>
      </div>
      <div class="criterion">
        <h4>💼 LinkedIn Engagement (20%)</h4>
        <p>Post quality, reach, professional presentation</p>
      </div>
    </div>

    <h3>📊 Why Participate?</h3>
    <ul class="benefits-list">
      <li>🏆 <strong>Win ₹5,000</strong> cash prize as the best performer</li>
      <li>📜 <strong>Earn a certificate</strong> to boost your resume</li>
      <li>💼 <strong>Potential internship</strong> opportunities with DVtools</li>
      <li>🛠️ <strong>Hands-on experience</strong> with 50+ professional developer tools</li>
      <li>📈 <strong>Enhance your skills</strong> in various development domains</li>
      <li>🌐 <strong>Build your portfolio</strong> and online presence</li>
      <li>🤝 <strong>Network</strong> with fellow student developers</li>
      <li>🎓 <strong>Stand out</strong> in placements and interviews</li>
    </ul>

    <h3>❓ Frequently Asked Questions</h3>
    <div class="faq-section">
      <div class="faq-item">
        <h4>Q: Do I need to use ALL tools on DVtools?</h4>
        <p>A: Yes, we encourage you to explore and document all available tools. However, your video can focus on demonstrating 5-10 key tools in detail.</p>
      </div>
      <div class="faq-item">
        <h4>Q: Can I participate as a team?</h4>
        <p>A: This is an individual activity. Each student must submit their own unique content.</p>
      </div>
      <div class="faq-item">
        <h4>Q: What if I don't have prior coding experience?</h4>
        <p>A: That's perfectly fine! Many of our tools are beginner-friendly. This is a great learning opportunity.</p>
      </div>
      <div class="faq-item">
        <h4>Q: Is the video mandatory?</h4>
        <p>A: Yes, all three components (documentation, LinkedIn post, and video) are mandatory for eligibility.</p>
      </div>
      <div class="faq-item">
        <h4>Q: When will results be announced?</h4>
        <p>A: Results will be announced within 2 weeks after the submission deadline.</p>
      </div>
    </div>

    <div class="cta-section">
      <h3>🚀 Ready to Get Started?</h3>
      <p>Don't miss this opportunity to enhance your skills, win prizes, and earn recognition!</p>
      <div class="cta-buttons">
        <a href="https://dvtools.dev/tools" class="btn btn-primary">Explore DVtools</a>
        <a href="https://www.linkedin.com/company/dvtools" class="btn btn-secondary">Follow on LinkedIn</a>
        <a href="mailto:connect@dvtools.in" class="btn btn-accent">Contact Us</a>
      </div>
    </div>

    <div class="contact-section">
      <h3>📞 Need Help?</h3>
      <p>If you have any questions or need clarification, feel free to reach out:</p>
      <ul>
        <li>📧 Email: <a href="mailto:connect@dvtools.in">connect@dvtools.in</a></li>
        <li>🔗 LinkedIn: <a href="https://www.linkedin.com/company/dvtools">linkedin.com/company/dvtools</a></li>
        <li>🌐 Website: <a href="https://dvtools.dev">dvtools.dev</a></li>
      </ul>
    </div>

    <footer class="article-footer">
      <p><strong>Good luck to all participants! We're excited to see your creativity and skills in action! 🎉</strong></p>
      <p class="hashtags">#DVtools #StudentContest #DeveloperTools #WinCashPrize #StudentDevelopers #CodingTools #TechContest #FreeCertificates</p>
    </footer>
  </div>
</article>

<style>
.news-article { max-width: 900px; margin: 0 auto; }
.article-hero img { width: 100%; height: auto; border-radius: 12px; margin-bottom: 2rem; }
.lead { font-size: 1.2em; line-height: 1.6; color: #4b5563; margin-bottom: 2rem; }
.highlight-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; margin: 2rem 0; }
.highlight-box h3 { color: white; margin-top: 0; }
.requirement-section { background: #f9fafb; border-left: 4px solid #3b82f6; padding: 1.5rem; margin: 1.5rem 0; border-radius: 8px; }
.requirement-section h4 { color: #1e40af; margin-top: 0; }
.submission-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 2rem; border-radius: 12px; margin: 2rem 0; }
.deadline { background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; font-weight: bold; text-align: center; margin-top: 1rem; }
.criteria-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
.criterion { background: white; border: 2px solid #e5e7eb; padding: 1.5rem; border-radius: 8px; }
.criterion h4 { color: #1f2937; margin-top: 0; }
.benefits-list { list-style: none; padding: 0; }
.benefits-list li { background: #f0fdf4; border-left: 4px solid #10b981; padding: 1rem; margin: 0.5rem 0; border-radius: 4px; }
.faq-section { margin: 2rem 0; }
.faq-item { background: white; border: 1px solid #e5e7eb; padding: 1.5rem; margin: 1rem 0; border-radius: 8px; }
.faq-item h4 { color: #6366f1; margin-top: 0; }
.cta-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem; border-radius: 12px; text-align: center; margin: 3rem 0; }
.cta-section h3 { color: white; }
.cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem; }
.btn { padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: bold; transition: transform 0.2s; }
.btn-primary { background: white; color: #667eea; }
.btn-secondary { background: #fbbf24; color: #1f2937; }
.btn-accent { background: #10b981; color: white; }
.btn:hover { transform: translateY(-2px); }
.contact-section { background: #eff6ff; border: 2px solid #3b82f6; padding: 2rem; border-radius: 12px; margin: 2rem 0; }
.article-footer { text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 2px solid #e5e7eb; }
.hashtags { color: #6b7280; font-size: 0.9em; }
</style>
  `;
}

function generateMarkdownContent() {
  return `# 🎓 DVtools Student Activity – Participation Guidelines

We're excited to invite all students to participate in the DVtools Student Activity! This is your opportunity to explore cutting-edge developer tools, showcase your skills, and win amazing prizes including a **₹5,000 cash prize** for the best performer.

## 🏆 Prizes & Recognition

- **Best Performer:** ₹5,000 Cash Prize 💰
- **All Participants:** Certificate of Participation 📜
- **Selected Candidates:** Potential internship opportunities 🚀

## 🔹 Who Can Participate?

All students from any college, department, or year are eligible and encouraged to participate. Whether you're a computer science student or from any other discipline, if you're interested in developer tools and technology, this activity is for you!

## 🔹 Activity Requirements

To participate and be eligible for prizes, you must complete **ALL** of the following steps:

### 1️⃣ DVtools Exploration & Testing

- Use **all available tools** in DVtools platform (50+ developer tools)
- Explore various categories:
  - Code formatters & beautifiers
  - API testing & simulation tools
  - Database query runners
  - Image optimization tools
  - Security testing tools
  - DevOps utilities
  - And many more!

- Prepare a **detailed document** covering:
  - List of tools you explored and their features
  - How each tool is used (step-by-step if possible)
  - How it is useful for you (in academics, projects, or learning)
  - Any feedback, suggestions, or errors/bugs you encountered
  - Screenshots or examples of your usage

### 2️⃣ LinkedIn Task

- Create **one professional LinkedIn post** sharing your experience using DVtools
- **Follow** the official DVtools LinkedIn page: [linkedin.com/company/dvtools](https://www.linkedin.com/company/dvtools)
- Mention **#DVtools** hashtag in your post
- Additional suggested hashtags: #DeveloperTools #StudentDeveloper #TechTools #CodingTools
- Tag @DVtools in your post for better visibility
- Share your genuine experience and insights

### 3️⃣ Video Creation

- Create a **short video** (5-15 minutes) explaining:
  - What is DVtools and its purpose
  - Demonstration of at least 5-10 tools
  - Your personal experience and feedback
  - How students can benefit from these tools

- The video can be **faceless** – voiceover or screen recording is perfectly acceptable!
- Ensure good audio quality and clear explanations
- Upload to **Google Drive**
- Set sharing permissions to: **"Anyone with the link can view"**
- Video formats accepted: MP4, MOV, AVI

## 🔹 Submission Details

**Email all materials to:** 📩 connect@dvtools.in

**Your submission must include:**

1. **Documentation** (PDF or Word format)
   - Should be well-formatted and professional
   - Include table of contents
   - Add screenshots where relevant

2. **LinkedIn post link**
   - Direct URL to your LinkedIn post
   - Ensure the post is public

3. **Google Drive video link**
   - Shareable link with view permissions
   - Test the link before submitting

4. **Participant details:**
   - Full Name
   - College Name
   - Department & Year (e.g., CSE - 3rd Year)
   - Contact Number (with WhatsApp if different)
   - Email Address
   - LinkedIn Profile URL

**⏰ Submission Deadline:** November 30, 2025, 11:59 PM IST

## 🔹 Evaluation Criteria

Submissions will be evaluated based on the following criteria:

- **🎯 Tool Exploration (30%)** - Depth and breadth of tool usage, understanding of features
- **📄 Documentation Quality (25%)** - Completeness, clarity, professionalism, and insights
- **🎥 Video Quality (25%)** - Creativity, clarity, demonstration skills, and presentation
- **💼 LinkedIn Engagement (20%)** - Post quality, reach, professional presentation

## 📊 Why Participate?

- 🏆 **Win ₹5,000** cash prize as the best performer
- 📜 **Earn a certificate** to boost your resume
- 💼 **Potential internship** opportunities with DVtools
- 🛠️ **Hands-on experience** with 50+ professional developer tools
- 📈 **Enhance your skills** in various development domains
- 🌐 **Build your portfolio** and online presence
- 🤝 **Network** with fellow student developers
- 🎓 **Stand out** in placements and interviews

## ❓ Frequently Asked Questions

**Q: Do I need to use ALL tools on DVtools?**
A: Yes, we encourage you to explore and document all available tools. However, your video can focus on demonstrating 5-10 key tools in detail.

**Q: Can I participate as a team?**
A: This is an individual activity. Each student must submit their own unique content.

**Q: What if I don't have prior coding experience?**
A: That's perfectly fine! Many of our tools are beginner-friendly. This is a great learning opportunity.

**Q: Is the video mandatory?**
A: Yes, all three components (documentation, LinkedIn post, and video) are mandatory for eligibility.

**Q: When will results be announced?**
A: Results will be announced within 2 weeks after the submission deadline.

## 🚀 Ready to Get Started?

Don't miss this opportunity to enhance your skills, win prizes, and earn recognition!

- [Explore DVtools](https://dvtools.dev/tools)
- [Follow on LinkedIn](https://www.linkedin.com/company/dvtools)
- [Contact Us](mailto:connect@dvtools.in)

## 📞 Need Help?

If you have any questions or need clarification, feel free to reach out:

- 📧 Email: connect@dvtools.in
- 🔗 LinkedIn: linkedin.com/company/dvtools
- 🌐 Website: dvtools.dev

**Good luck to all participants! We're excited to see your creativity and skills in action! 🎉**

#DVtools #StudentContest #DeveloperTools #WinCashPrize #StudentDevelopers #CodingTools #TechContest #FreeCertificates
`;
}

// Run the function
createStudentParticipationNews();
