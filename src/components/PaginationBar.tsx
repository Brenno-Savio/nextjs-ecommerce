import Link from 'next/link';
import PageSelector from './PageSelector';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
}
export default function PaginationBar({
  currentPage,
  totalPages,
}: PaginationBarProps) {
  !Number.isInteger(totalPages)
    ? (totalPages = Number(totalPages.toFixed(0)))
    : totalPages;

  const maxPage = Math.min(totalPages, currentPage + 2);
  const minPage = Math.max(1, currentPage - 2);

  const numberedPageItems: JSX.Element[] = [];

  for (let page = minPage; page <= maxPage; page++) {
    numberedPageItems.push(
      <Link
        href={`?page=${page}`}
        key={page}
        className={`btn join-item ${currentPage === page ? 'btn-active pointer-events-none' : ''}`}
      >
        {page}
      </Link>,
    );
  }

  return (
    <>
      <div className="join hidden sm:block">
        {currentPage > 1 && (
          <Link href={`?page=${1}`} className="btn join-item">
            «
          </Link>
        )}
        {minPage > 1 && (
          <PageSelector currentPage={currentPage} totalPages={totalPages} />
        )}
        {numberedPageItems}
        {maxPage < totalPages && (
          <PageSelector currentPage={currentPage} totalPages={totalPages} />
        )}
        {currentPage < totalPages && (
          <Link href={`?page=${totalPages}`} className="btn join-item">
            »
          </Link>
        )}
      </div>
      <div className="join block sm:hidden">
        {currentPage > 1 && (
          <Link href={`?page=${currentPage - 1}`} className="btn join-item">
            «
          </Link>
        )}
        <button className="btn join-item pointer-events-none">
          {' '}
          Page {currentPage}
        </button>
        {currentPage < totalPages && (
          <Link href={`?page=${currentPage + 1}`} className="btn join-item">
            »
          </Link>
        )}
      </div>
    </>
  );
}
