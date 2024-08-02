import LoginForm from "../../components/LoginForm/LoginForm";
import Logo from "../../components/Logo/Logo";
import { Link } from "react-router-dom";
import css from './LoginPage.module.css';

export default function LoginPage() {
	return (
		<div className={css.wrapper}>
			<div className={css.logoBox}>
				<Logo />
			</div>
			<div className={css.container}>
				<LoginForm />
				<p className={css.text}>Don`t have an account? <Link to="/signup" className={css.link}>Sign Up</Link></p>
			</div>
		</div>
	);
}