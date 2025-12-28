export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex justify-center">
      <article className="prose max-w-2xl px-4 py-8">{children}</article>
    </main>
  );
}
