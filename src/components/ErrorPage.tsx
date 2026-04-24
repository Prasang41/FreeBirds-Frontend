import { useRouteError, useNavigate } from 'react-router-dom'

function ErrorPage() {
  const error = useRouteError() as { status?: number; statusText?: string; message?: string };
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f4f0] font-sans flex items-center justify-center px-6">
      <div className="max-w-md w-full flex flex-col items-center gap-8 text-center">

        <div className="w-full bg-[#1a1a1a] rounded-3xl p-10 flex flex-col items-center gap-4 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <span
            className="relative text-7xl font-extrabold leading-none"
            style={{ WebkitTextStroke: '2px rgba(255,255,255,0.6)', color: 'transparent' }}
          >
            {error?.status ?? '404'}
          </span>
          <p className="relative text-sm text-white/40 uppercase tracking-widest">
            {error?.statusText ?? 'Page not found'}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Something went wrong</h1>
          <p className="text-sm text-[#999] leading-relaxed">
            {error?.message ?? "The page you're looking for doesn't exist or you may need to log in first."}
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[#e0e0da] text-[#555] hover:border-[#1a1a1a] hover:text-[#1a1a1a] active:scale-95 transition-all duration-150"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#1a1a1a] text-white hover:bg-[#333] active:scale-95 transition-all duration-150"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage