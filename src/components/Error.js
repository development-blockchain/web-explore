export default function Error() {
  return (
    <main className="bg-img-hero-center" style={{backgroundImage: 'url(/images/error-404.svg)'}} role="main">
      <div className="container d-lg-flex align-items-lg-center min-height-100vh">
        <div className="w-lg-60 w-xl-50">
          <div className="mb-5">
            <h1 className="text-secondary font-weight-normal">
              <span className="font-weight-semi-bold mr-2">Sorry!</span>We encountered an unexpected error.
            </h1>
            <p className="mb-0">
              An unexpected error occurred. <br />
              Please check back later
            </p>
          </div>
          <a className="btn btn-primary btn-wide transition-3d-hover" href="/">
            Back Home
          </a>
        </div>
      </div>
    </main>
  );
}
