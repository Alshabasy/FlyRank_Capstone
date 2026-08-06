export default function RegisterForm({ formState, errors, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-cinema-white">Display Name</label>
        <input
          name="displayName"
          type="text"
          value={formState.displayName}
          onChange={onChange}
          onBlur={onChange}
          className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white placeholder:text-cinema-muted focus:border-cinema-blue focus:outline-none"
          placeholder="Your name"
          aria-label="Display Name"
        />
        {errors.displayName && <p className="mt-2 text-xs text-cinema-red">{errors.displayName}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-cinema-white">Email</label>
        <input
          name="email"
          type="email"
          value={formState.email}
          onChange={onChange}
          onBlur={onChange}
          className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white placeholder:text-cinema-muted focus:border-cinema-blue focus:outline-none"
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
          className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white placeholder:text-cinema-muted focus:border-cinema-blue focus:outline-none"
          placeholder="Create a password"
          aria-label="Password"
        />
        {errors.password && <p className="mt-2 text-xs text-cinema-red">{errors.password}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-cinema-white">Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          value={formState.confirmPassword}
          onChange={onChange}
          onBlur={onChange}
          className="w-full rounded-2xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white placeholder:text-cinema-muted focus:border-cinema-blue focus:outline-none"
          placeholder="Confirm password"
          aria-label="Confirm Password"
        />
        {errors.confirmPassword && <p className="mt-2 text-xs text-cinema-red">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-cinema-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-cinema-red-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}

// ✅ src/components/auth/RegisterForm.jsx complete
