// IMPROVED: use Noto Serif variable from root layout — avoids duplicate font fetch on blog routes
export default function BlogRouteGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
