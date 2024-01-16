export default function NotFoundPage() {
  return (
    <main className="bg-neutral p-10 rounded-xl">
      <h1 className="m-10 text-center text-9xl">404</h1>
      <p className="m-auto max-w-[700px] text-center text-3xl">
        Page not found, please check the url and try again.
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
