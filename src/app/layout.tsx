export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white text-black font-mono">
      {children}
    </div>
  );
}
