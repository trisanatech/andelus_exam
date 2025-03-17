export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="container flex-1 flex flex-col items-center justify-center text-center py-20 px-6">
        <div className="h-24 w-24 flex items-center justify-center rounded-full border-4 border-primary text-primary font-bold text-3xl mb-8">
          A
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
          Andelus School Exam Management System <br /> for Grade 12th
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-4">
          A seamless platform to create, manage, and analyze exams efficiently.
        </p>
      </section>

      {/* Footer */}
      <footer className="container py-4 border-t flex flex-col items-center text-sm">
        <div className="flex flex-col items-center gap-1">
          <span>© 2025 TRISANA TECH</span>
          <span className="text-muted-foreground">All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}
