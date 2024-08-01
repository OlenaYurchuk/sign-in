import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { logIn } from "../../redux/auth/operations";
import { useDispatch } from "react-redux";

export default function LoginForm() {
	const dispatch = useDispatch();

	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.email('Invalid email address')
			.required('Email is required'),
		password: Yup.string()
			.required('Password is required')
			.min(8, 'Password must be at least 8 characters')
			.matches(
				/^(?=.*[A-Za-z])(?=.*\d)/,
				'Password must contain at least one letter and one number'
			),
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

	return (
		<div>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label>Email</label>
					<input type="email" {...register('email')} placeholder="Enter your email" />
					{errors.email && <p>{errors.email.message}</p>}
				</div>
				<div>
					<label>Password</label>
					<input type="password" {...register('password')} placeholder="Enter your password" />
					{errors.password && <p>{errors.password.message}</p>}
				</div>
				<button type="submit" disabled={isSubmitting}>Sign In</button>
			</form>
		</div>
	);

}