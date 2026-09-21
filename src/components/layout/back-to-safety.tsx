import Link from "next/link";

export function BackToSafety() {
  return (
    <p className="text-sm font-medium text-muted-foreground">
      <Link href="/safety" className="font-semibold text-primary underline-offset-2 hover:underline">
        ← Back to Safety hub
      </Link>
    </p>
  );
}
