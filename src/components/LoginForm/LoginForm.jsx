import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { logIn } from "../../redux/auth/operations";
import { useDispatch } from "react-redux";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import css from "./LoginForm.module.css";
import { useState } from "react";

export default function LoginForm() {
	const [password, setPassword] = useState("");
	const [type, setType] = useState("password");

	const dispatch = useDispatch();

	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.email()
			.matches('^(?!.*@[^,]*,)', 'Invalid email')
			.required('Email is required'),
		password: Yup.string()
			.required('Password is required')
			.min(8, 'Password must be at least 8 characters')
			.matches(
				/^(?=.*[A-Za-z])(?=.*\d)/,
				'Password must contain at least one letter and one number'
			)
			.matches('[a-zA-Z]', 'Password can only contain Latin letters.'),
	});

	const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
		resolver: yupResolver(validationSchema)
	});

	const onSubmit = (values) => {
		dispatch(logIn(values))
			.unwrap()
			.then(originalPromiseResult => {
				localStorage.setItem('token', originalPromiseResult.token);
				toast.success(`${originalPromiseResult.user.name} welcome back!`);
			})
			.catch(() => {
				toast.error('Incorrect login or password');
			})
			.finally(() => {
				reset();
			});
	};

	const handleToggle = () => {
		setType(type === "password" ? "text" : "password");
	}

	return (
		<div>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="on" className={css.form}>
				<div className={css.wrap}>
					<label htmlFor="email" className={css.label}>Email</label>
					<input className={css.input}
						type="email" {...register('email')}
						id="email" name="email"
						placeholder="Enter your email"
						autoComplete="user's email" />
					{errors.email && <p className={css.error}>{errors.email.message}</p>}
				</div>
				<div className={css.wrap}>
					<label htmlFor="password" className={css.label}>Password</label>
					<div className={css.passwordBox}>
						<input className={css.input}
							type={type} {...register('password')}
							id="password"
							name="password"
							value={password}
							placeholder="Enter your password"
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current password" />
						<button type="button" className={css.iconButton} onClick={handleToggle} aria-label="Toggle password visibility">
							{type === "password" ? <FiEyeOff /> : <FiEye />}
						</button>
					</div>
					{errors.password && <p className={css.error}>{errors.password.message}</p>}
				</div>
				<button className={css.btn} type="submit" disabled={isSubmitting}>Sign In</button>
			</form>
		</div>
	);

}