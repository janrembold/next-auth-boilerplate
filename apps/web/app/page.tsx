import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>
        Go to <Link href="/unprotected">Unprotected Page</Link>
      </p>
      <p>
        Go to{" "}
        <Link href="/protected">Protected Page (withPageAuthRequired)</Link>
      </p>
    </div>
  );
}
