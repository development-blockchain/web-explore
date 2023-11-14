export function CardHead({children}) {
  return <div className="card-header d-flex justify-content-between align-items-center p-0">{children}</div>;
}

export function Card({children}) {
  return <div className="card">{children}</div>;
}
