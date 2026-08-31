export default function LoginForm({ formState, errors, onChange, onSubmit, onForgotPassword, onGoogleSignIn, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-cinema-white">Email</label>
        <input
          name="email"
          type="email"
          value={formState.email}
          onChange={onChange}
          onBlur={onChange}
          className="w-full rounded-2xl border border-theme bg-[#0f172a] px-4 py-3 text-sm text-cinema-white placeholder:text-cinema-muted focus:border-cinema-blue focus:outline-none"
          placeholder="you@example.com"
          aria-label="Email"
        />
        {errors.email && <p className="mt-2 text-xs text-cinema-red">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-cinema-white">Password</label>
        <input
          name="password"
          type="password"
          value={formState.password}
          onChange={onChange}
          onBlur={onChange}
          className="w-full rounded-2xl border border-theme bg-[#0f172a] px-4 py-3 text-sm text-cinema-white placeholder:text-cinema-muted focus:border-cinema-blue focus:outline-none"
          placeholder="Enter your password"
          aria-label="Password"
        />
        {errors.password && <p className="mt-2 text-xs text-cinema-red">{errors.password}</p>}
      </div>

      <div className="flex items-center justify-between text-sm text-cinema-muted">
        <button type="button" onClick={onForgotPassword} className="font-medium text-cinema-white hover:text-cinema-blue">
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-cinema-red px-4 py-3 text-sm font-semibold text-cinema-white transition hover:bg-cinema-red-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <button
        type="button"
        onClick={onGoogleSignIn}
        className="w-full rounded-2xl border border-theme bg-transparent px-4 py-3 text-sm font-semibold text-cinema-white transition hover:border-cinema-blue"
      >
        Continue with Google
      </button>
    </form>
  )
}

// ✅ src/components/auth/LoginForm.jsx complete
