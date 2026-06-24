import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.post.deleteMany();
  await prisma.page.deleteMany();
  await prisma.category.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();

  // Admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin@123456",
    12
  );

  const admin = await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME || "Admin",
      email: process.env.ADMIN_EMAIL || "admin@gmail.com",
      password: hashedPassword,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Technology", slug: "technology" } }),
    prisma.category.create({ data: { name: "Design", slug: "design" } }),
    prisma.category.create({ data: { name: "Business", slug: "business" } }),
    prisma.category.create({ data: { name: "Tutorials", slug: "tutorials" } }),
    prisma.category.create({ data: { name: "News", slug: "news" } }),
  ]);
  console.log("✅ 5 categories created");

  // Posts
  const postData = [
    {
      title: "Getting Started with Next.js 15 App Router",
      slug: "getting-started-nextjs-15-app-router",
      excerpt: "A comprehensive guide to building modern web applications with the Next.js 15 App Router and React Server Components.",
      content: `<h2>Introduction</h2><p>Next.js 15 brings powerful new features to web development. The App Router revolutionizes how we think about routing and data fetching in React applications.</p><h2>Key Features</h2><ul><li>React Server Components by default</li><li>Streaming and Suspense support</li><li>Nested layouts and parallel routes</li><li>Server Actions for form handling</li></ul><h2>Getting Started</h2><p>To create a new Next.js 15 project, run:</p><pre><code>npx create-next-app@latest my-app --typescript --tailwind --app</code></pre><p>This sets up a production-ready project with TypeScript, Tailwind CSS, and the App Router enabled.</p><h2>Conclusion</h2><p>The App Router is a significant leap forward for Next.js development. It makes building scalable, performant applications more intuitive than ever.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      published: true,
      categoryId: categories[0].id,
    },
    {
      title: "Mastering TypeScript: Advanced Patterns",
      slug: "mastering-typescript-advanced-patterns",
      excerpt: "Deep dive into TypeScript's most powerful features including generics, utility types, and conditional types.",
      content: `<h2>Why TypeScript?</h2><p>TypeScript has become the de facto standard for large-scale JavaScript applications. It brings type safety, better tooling, and improved developer experience.</p><h2>Advanced Generics</h2><p>Generics allow you to create reusable components that work with any type while maintaining type safety.</p><pre><code>function identity&lt;T&gt;(arg: T): T {\n  return arg;\n}</code></pre><h2>Utility Types</h2><p>TypeScript provides built-in utility types like <code>Partial</code>, <code>Required</code>, <code>Pick</code>, and <code>Omit</code> that make type manipulation expressive and concise.</p><h2>Conditional Types</h2><p>Conditional types enable you to create types that depend on other types, unlocking powerful type-level programming.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
      published: true,
      categoryId: categories[0].id,
    },
    {
      title: "Design Systems: Building for Scale",
      slug: "design-systems-building-for-scale",
      excerpt: "How to build a comprehensive design system that scales across your entire product suite.",
      content: `<h2>What is a Design System?</h2><p>A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.</p><h2>Core Components</h2><ul><li>Color palette and typography</li><li>Spacing and layout grid</li><li>Component library</li><li>Documentation and guidelines</li></ul><h2>Implementation Strategy</h2><p>Start with your most-used components and establish clear naming conventions. Consistency is key to a successful design system.</p><h2>Tooling</h2><p>Modern design systems use tools like Storybook for documentation, Figma for design, and component libraries like our very own built with Tailwind CSS.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      published: true,
      categoryId: categories[1].id,
    },
    {
      title: "Tailwind CSS Tips & Tricks",
      slug: "tailwind-css-tips-tricks",
      excerpt: "Unlock the full potential of Tailwind CSS with these professional tips and lesser-known utilities.",
      content: `<h2>Beyond the Basics</h2><p>Tailwind CSS is more than just utility classes. Let's explore some advanced patterns that will elevate your UI development.</p><h2>Arbitrary Values</h2><p>Use square brackets for one-off values: <code>w-[37px]</code>, <code>bg-[#1da1f2]</code>, <code>grid-cols-[1fr_auto]</code>.</p><h2>Custom Plugins</h2><p>Extend Tailwind with custom utilities using the plugin API. This is perfect for your design system's unique tokens.</p><h2>Performance Tips</h2><p>Always purge unused styles in production. Use JIT mode for lightning-fast builds and on-demand utility generation.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      published: true,
      categoryId: categories[1].id,
    },
    {
      title: "SaaS Business Model Fundamentals",
      slug: "saas-business-model-fundamentals",
      excerpt: "Understanding the core mechanics of SaaS businesses: MRR, churn, LTV, and growth strategies.",
      content: `<h2>The SaaS Opportunity</h2><p>Software as a Service has transformed how software is built, sold, and consumed. The recurring revenue model creates predictable, scalable businesses.</p><h2>Key Metrics</h2><ul><li><strong>MRR</strong>: Monthly Recurring Revenue</li><li><strong>ARR</strong>: Annual Recurring Revenue</li><li><strong>Churn Rate</strong>: Percentage of customers who cancel</li><li><strong>LTV</strong>: Lifetime Value of a customer</li><li><strong>CAC</strong>: Customer Acquisition Cost</li></ul><h2>Growth Strategies</h2><p>Focus on reducing churn before scaling acquisition. A leaky bucket will drain your resources no matter how much you pour in.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      published: true,
      categoryId: categories[2].id,
    },
    {
      title: "Building a REST API with Node.js and Prisma",
      slug: "building-rest-api-nodejs-prisma",
      excerpt: "Step-by-step tutorial on building a production-ready REST API using Node.js, Express, and Prisma ORM.",
      content: `<h2>Setup</h2><p>First, initialize your project and install dependencies:</p><pre><code>npm init -y\nnpm install express prisma @prisma/client\nnpm install -D typescript @types/express ts-node</code></pre><h2>Database Schema</h2><p>Define your Prisma schema with models that reflect your domain:</p><pre><code>model Post {\n  id        String   @id @default(cuid())\n  title     String\n  content   String\n  createdAt DateTime @default(now())\n}</code></pre><h2>Building Endpoints</h2><p>Create RESTful endpoints with proper error handling, validation, and response formatting.</p><h2>Deployment</h2><p>Deploy to Railway, Render, or Vercel with environment variables properly configured.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
      published: true,
      categoryId: categories[3].id,
    },
    {
      title: "React Performance Optimization Techniques",
      slug: "react-performance-optimization",
      excerpt: "Practical techniques to optimize React application performance including memoization, code splitting, and virtual lists.",
      content: `<h2>Why Performance Matters</h2><p>Poor performance leads to high bounce rates and poor user experience. Even 100ms delays can impact conversion rates significantly.</p><h2>React.memo and useMemo</h2><p>Use React.memo to prevent unnecessary re-renders of components whose props haven't changed. Use useMemo for expensive computations.</p><h2>Code Splitting</h2><p>Use dynamic imports and React.lazy to split your bundle and load code on demand:</p><pre><code>const HeavyComponent = React.lazy(() => import('./HeavyComponent'));</code></pre><h2>Virtual Lists</h2><p>For long lists, use virtualization libraries like react-window or react-virtual to only render visible items.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
      published: true,
      categoryId: categories[3].id,
    },
    {
      title: "AI Tools Transforming Modern Development",
      slug: "ai-tools-transforming-modern-development",
      excerpt: "How AI-powered tools like GitHub Copilot, Claude, and ChatGPT are changing the developer workflow.",
      content: `<h2>The AI Revolution in Development</h2><p>AI tools have dramatically accelerated software development. From code completion to full feature generation, these tools are reshaping the industry.</p><h2>GitHub Copilot</h2><p>Powered by OpenAI Codex, GitHub Copilot suggests entire functions and blocks of code based on context and comments.</p><h2>Claude for Development</h2><p>Anthropic's Claude excels at understanding complex codebases, debugging intricate issues, and explaining architectural decisions.</p><h2>The Future</h2><p>AI won't replace developers — it will amplify their capabilities, allowing small teams to build products that previously required entire engineering organizations.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
      published: true,
      categoryId: categories[4].id,
    },
    {
      title: "PostgreSQL Performance Tuning Guide",
      slug: "postgresql-performance-tuning-guide",
      excerpt: "Essential PostgreSQL optimization techniques including indexing strategies, query optimization, and configuration tuning.",
      content: `<h2>Understanding Query Plans</h2><p>Use EXPLAIN ANALYZE to understand how PostgreSQL executes your queries. Look for sequential scans on large tables as a red flag.</p><h2>Indexing Strategy</h2><ul><li>Create indexes on columns used in WHERE clauses</li><li>Use composite indexes for multi-column queries</li><li>Consider partial indexes for filtered queries</li><li>Monitor index usage with pg_stat_user_indexes</li></ul><h2>Connection Pooling</h2><p>Use PgBouncer or a connection pooler to manage database connections efficiently, especially in serverless environments.</p><h2>Vacuuming</h2><p>Configure autovacuum properly to prevent table bloat and maintain statistics for the query planner.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
      published: true,
      categoryId: categories[0].id,
    },
    {
      title: "The Art of Remote Team Leadership",
      slug: "art-of-remote-team-leadership",
      excerpt: "Strategies for leading distributed teams effectively: communication, culture, and productivity.",
      content: `<h2>The Remote Leadership Challenge</h2><p>Leading remote teams requires intentionality. The absence of physical presence means you must be more deliberate about communication, culture, and recognition.</p><h2>Asynchronous Communication</h2><p>Establish clear communication norms. Default to async communication with well-written documentation over synchronous meetings for most decisions.</p><h2>Building Culture Remotely</h2><p>Invest in virtual team building, celebrate wins publicly, and create spaces for informal conversation. Culture doesn't happen by accident — it requires active cultivation.</p><h2>Measuring Output, Not Hours</h2><p>Focus on outcomes and results rather than hours worked. Trust your team and evaluate them on what they deliver, not when they're online.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      published: false,
      categoryId: categories[2].id,
    },
  ];

  await Promise.all(postData.map((p) => prisma.post.create({ data: p })));
  console.log("✅ 10 posts created");

  // Pages
  const pagesData = [
    {
      title: "About Us",
      slug: "about",
      content: `<div style="max-width: 700px;"><h1>About PremiumCMS</h1><p>PremiumCMS is a modern, open-source content management system built with Next.js 15, Prisma, and PostgreSQL. It combines the power of a headless CMS with a beautiful, production-ready admin interface.</p><h2>Our Mission</h2><p>We believe great content deserves great tools. PremiumCMS gives creators and developers the perfect platform to publish, manage, and grow their digital presence.</p><h2>Built With</h2><ul><li>Next.js 15 App Router</li><li>TypeScript for type safety</li><li>Tailwind CSS for styling</li><li>Prisma ORM for database management</li><li>PostgreSQL for reliable data storage</li><li>NextAuth.js for authentication</li><li>Framer Motion for animations</li></ul></div>`,
      published: true,
    },
    {
      title: "Contact",
      slug: "contact",
      content: `<div style="max-width: 600px;"><h1>Contact Us</h1><p>Have questions or feedback? We'd love to hear from you.</p><h2>Get in Touch</h2><p>Email us at <a href="mailto:hello@premiumcms.dev">hello@premiumcms.dev</a></p><p>We typically respond within 24 hours on business days.</p><h2>Support</h2><p>For technical support and bug reports, please open an issue on our GitHub repository.</p></div>`,
      published: true,
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      content: `<div style="max-width: 700px;"><h1>Privacy Policy</h1><p><em>Last updated: ${new Date().toLocaleDateString()}</em></p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account or contact us for support.</p><h2>How We Use Information</h2><p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p><h2>Data Security</h2><p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p><h2>Contact</h2><p>If you have questions about this Privacy Policy, please contact us at privacy@premiumcms.dev</p></div>`,
      published: true,
    },
    {
      title: "Terms of Service",
      slug: "terms",
      content: `<div style="max-width: 700px;"><h1>Terms of Service</h1><p><em>Last updated: ${new Date().toLocaleDateString()}</em></p><h2>Acceptance of Terms</h2><p>By accessing and using PremiumCMS, you agree to be bound by these Terms of Service.</p><h2>Use of Service</h2><p>You may use our services only for lawful purposes and in accordance with these terms.</p><h2>Intellectual Property</h2><p>The service and its original content remain the property of PremiumCMS and its licensors.</p><h2>Limitation of Liability</h2><p>PremiumCMS shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p></div>`,
      published: true,
    },
    {
      title: "Changelog",
      slug: "changelog",
      content: `<div style="max-width: 700px;"><h1>Changelog</h1><h2>v1.0.0 – Initial Release</h2><ul><li>Full admin dashboard with posts, pages, categories management</li><li>Rich text editor with Tiptap</li><li>Beautiful public blog interface</li><li>SEO optimization with metadata API</li><li>Custom CSS/JS injection via site settings</li><li>NextAuth.js authentication</li><li>Prisma ORM with PostgreSQL</li><li>Framer Motion animations</li><li>Fully responsive design</li></ul></div>`,
      published: false,
    },
  ];

  await Promise.all(pagesData.map((p) => prisma.page.create({ data: p })));
  console.log("✅ 5 pages created");

  // Site settings
  await prisma.siteSettings.create({
    data: {
      customCss: "/* Custom styles added via Settings */\n:root { --brand: #6366f1; }",
      customJs: "/* Custom scripts added via Settings */\nconsole.log('PremiumCMS loaded');",
    },
  });
  console.log("✅ Site settings created");

  console.log("\n🎉 Database seeded successfully!");
  console.log(`\n📧 Admin credentials:`);
  console.log(`   Email:    ${process.env.ADMIN_EMAIL || "admin@gmail.com"}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || "Admin@123456"}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
