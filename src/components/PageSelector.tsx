'use client';

import { redirect } from 'next/navigation';
import { useTransition } from 'react';

interface PageSelector {
  currentPage: number;
  totalPages: number;
}

export default function PageSelector({
  currentPage,
  totalPages,
}: PageSelector) {
  const [isPending, startTransition] = useTransition();
  const allPageLinks: JSX.Element[] = [];

  for (let page = 1; page <= totalPages; page++) {
    allPageLinks.push(
      <option value={page} key={page}>
        {page}
      </option>,
    );
  }

  return (
    <div className="dropdown dropdown-top join-item">
      <button tabIndex={0} className="btn join-item">
        ...
        <select
          className="collapse-content dropdown-content join-item select select-bordered w-full bg-base-300 text-white shadow"
          defaultValue={currentPage}
          onChange={(e) => {
            startTransition( async () => {              
              await redirect(`?page=${e.currentTarget.value}`)
            })
          }}
        >
          {allPageLinks}
        </select>
      </button>
    </div>
  );
}
