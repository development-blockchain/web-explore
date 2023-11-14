export default function Loading() {
  return (
    <div style={{position: 'relative', minHeight: '160px'}}>
      <div style={{position: 'absolute', left: '50%', marginLeft: '-31px'}}>
        <div className="py-3 text-center">
          <img src="/assets/images/main/loadingblock.svg" alt="Loading" />
        </div>
      </div>
    </div>
  );
}
