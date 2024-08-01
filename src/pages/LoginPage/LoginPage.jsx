import LoginForm from "../../components/LoginForm/LoginForm";
import { Link } from "react-router-dom";
import css from './LoginPage.module.css';

export default function LoginPage() {
	return (
		<div>
			<div className={css.container}>
				<h2 className={css.title}>Sign In</h2>
				<LoginForm />
				<p>Don`t have an account? <Link to="/signup">Sign Up</Link></p>
			</div>
		</div>
	);
}