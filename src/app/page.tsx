export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container py-20">
        <div className="flex flex-col items-center text-center gap-8">
          <h1 className="text-5xl font-bold max-w-2xl leading-tight">
            ANDELUS SCHOOL EXAM MANAGEMENT SYSTEM FOR GRADE 12TH
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Create, manage, and analyze exams with our all-in-one platform
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container justify-items-center py-2 border-t">
        <div className="space-y-4">
          <span className="text-sm ">© 2025 TRISANA TECH. </span>
          <span className="text-sm text-muted-foreground">All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}
