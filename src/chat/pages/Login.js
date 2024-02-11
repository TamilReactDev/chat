import React, { useEffect, useState,useRef} from 'react'
import { Alert, Button, Card, CardBody, Form, Spinner } from 'react-bootstrap';
import InputComponent from '../component/InputComponent';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';



const PASS_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;

const EMAIL_REG = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const Login = () => { 

    const emailRef = useRef(null);
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [isError, setIsError] = useState(false);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    useEffect(() => {
        const validateEmail = EMAIL_REG.test(email);
        setIsValidEmail(validateEmail);
    }, [email])

    useEffect(() => {
        const validatePass = PASS_REG.test(password);
        setIsValidPassword(validatePass);
    }, [password]);

    useEffect(() => {
        setIsError(false);
        setError({});
    }, [password, email]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const isValidEmail = EMAIL_REG.test(email);
        const isValidPassword = PASS_REG.test(password);

        if(!isValidEmail || !isValidPassword || isError ){
            setIsError(true);
            setError({ message: 'Invalid Entry' });
            return;
        }
        try {
            setLoading(true);
           const userCredential = await signInWithEmailAndPassword(auth,email,password);
            navigate('/');  
        } catch (error) {
            setIsError(true);
            setError({ message: error.message })
        }finally{
            setLoading(false);
        }

    }



  return (
    <div className='body'>
    <Card className='shadow'>
        <CardBody>
            <div className='text-center'>
                <h3>Login Here</h3>
            </div>
            <Form onSubmit={handleFormSubmit}>
                {
                    isError &&

                    (<Alert className='w-100' variant='danger'>
                        <p>{error?.message}</p>
                    </Alert>)
                }
                <InputComponent
                    label='Enter Email'
                    type='email'
                    placeholder='Enter Email'
                    id='email'
                    ref={emailRef}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    state={email}
                    focus={emailFocus}
                    isValid={isValidEmail}
                    atertText={<p>please Enter valid email address</p>}
                />

                <InputComponent
                    label='Enter password'
                    type='password'
                    placeholder='Enter password'
                    id='password'
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                    state={password}
                    focus={passwordFocus}
                    isValid={isValidPassword}
                    atertText={<p>
                        8 to 24 character  <br />
                        Must include upperCase,and lowerCase letter,a number and special character.<br />
                        Allowed special character:!@#%$
                    </p>}
                />


                <Button
                    disabled={!isValidEmail || !isValidPassword || loading ? true : false} type='submit' className='w-50 mt-3 d-flex justify-content-center m-auto' variant='primary'>
                    {loading && <Spinner />}
                    Login
                </Button>

                <p className='text-center mt-3'>you don't have an account ? <Link to='/register'>Register Here</Link></p>

            </Form>
        </CardBody>
    </Card>
</div>

  )
}

export default Login