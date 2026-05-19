// This layout is intentionally minimal — PublicLayout is applied inside page.tsx
// to allow conditional rendering based on auth state
export default function VflixPublicLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
