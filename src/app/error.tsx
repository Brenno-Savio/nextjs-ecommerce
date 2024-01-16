'use client';

export default function ErrorPage() {
  return (
    <main className="bg-neutral p-10 rounded-xl">
      <h1 className="m-10 text-center text-9xl">Error!</h1>
      <p className="m-auto max-w-[700px] text-center text-3xl">
        An error has occurred, please refresh the page and if the error
        persists, contact support
      </p>
      <a
        className=" btn btn-primary m-auto mt-24 flex w-40 text-white"
        href="/"
      >
        Return Home
      </a>
    </main>
  );
}
