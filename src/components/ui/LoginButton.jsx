function LoginButton({ isLoading = false, disabled = false }) {
  return (
    <button
      type="submit"
      className="btn-primary"
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span className="btn-spinner"></span>
          Signing in...
        </>
      ) : (
        'Sign in'
      )}
    </button>
  );
}

export default LoginButton;
