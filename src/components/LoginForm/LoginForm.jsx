import { Controller, useForm } from "react-hook-form";
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
	const [type, setType] = useState("password");
	const [touchedFields, setTouchedFields] = useState({ email: false, password: false });

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

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		trigger,
		reset
	} = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const onSubmit = async (values) => {
		try {
			const result = await dispatch(logIn(values)).unwrap();
			localStorage.setItem('token', result.data.accessToken);
			toast.success('Successfully logged in!');
		} catch (error) {
			toast.error(error?.message || 'Incorrect login or password');
		} finally {
			reset();
		}
	};

	const handleToggle = () => {
		setType(type === "password" ? "text" : "password");
	}

	const handleBlur = async (field) => {
		setTouchedFields(prev => ({ ...prev, [field]: true }));
		await trigger(field);
	};

	return (
		<div className={css.formWrap}>
			<Toaster position="top-center" reverseOrder={false} />
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="on" className={css.form}>
				<h2 className={css.title}>Sign In</h2>
				<div className={css.wrap}>
					<label htmlFor="email" className={css.label}>Email</label>
					<Controller
						name='email'
						control={control}
						render={({ field }) => {
							const error = errors.email;
							const isTouched = touchedFields.email;
							const isError = error && isTouched;
							return (
								<input
									{...field}
									className={`${css.input} ${isTouched && isError ? css.errorInput : ''}`}
									type="email"
									id="email"
									placeholder="Enter your email"
									autoComplete="username"
									aria-invalid={errors.email ? "true" : "false"}
									aria-describedby={errors.email ? "email-error" : undefined}
									onBlur={() => handleBlur('email')}
								/>
							)
						}}
					/>
					{touchedFields.email && errors.email && (
						<p id="email-error" className={css.error}>{errors.email.message}</p>
					)}
				</div>
				<div className={css.wrap}>
					<label htmlFor="password" className={css.label}>Password</label>
					<div className={css.passwordBox}>
						<Controller
							name="password"
							control={control}
							render={({ field }) => {
								const error = errors.password;
								const isTouched = touchedFields.password;
								const isError = error && isTouched;
								return (
									<input
										{...field}
										type={type}
										className={`${css.input} ${isTouched && isError ? css.errorInput : ''}`}
										id="password"
										autoComplete="current-password"
										placeholder="Enter your password"
										onBlur={() => handleBlur('password')}
									/>
								);
							}}
						/>
						<button
							type="button"
							className={css.iconButton}
							onClick={handleToggle}
							aria-label="Toggle password visibility">
							{type === "password" ? <FiEyeOff /> : <FiEye />}
						</button>
					</div>
					{touchedFields.password && errors.password && (
						<p id="password-error" className={css.error}>{errors.password.message}</p>
					)}
				</div>
				<button className={css.btn} type="submit" disabled={isSubmitting}>Sign In</button>
			</form>
		</div>
	);

}