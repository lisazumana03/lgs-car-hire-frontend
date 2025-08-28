import './index.css';

function LoginButton({ onClick }) {
  return (
    <button type="button" className="login-btn" onClick={onClick}>
      Login
    </button>
  );
}

export default LoginButton;
