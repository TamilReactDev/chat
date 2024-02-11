import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, CardBody, Form, Spinner } from 'react-bootstrap';
import InputComponent from '../component/InputComponent';
import { CgProfile } from 'react-icons/cg';
import { createUserWithEmailAndPassword,updateProfile  } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';




const USER_REG = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;

const PASS_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;

const EMAIL_REG = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;


const Register = () => {

    const userRef = useRef();



    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [image, setImage] = useState('');
    const [file, setFile] = useState(null);
    const [imageName, setImageName] = useState('')

    const [isError, setIsError] = useState(false);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();


    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        const validateName = USER_REG.test(name);
        setIsValidName(validateName);
    }, [name]);

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
    }, [name, password, email, imageName]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file?.size > (5 * 1024 * 1024)) {
                setIsError(true);
                setError({ message: 'image size less then 2 mb' });

            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            }

            reader.readAsDataURL(file);
            setImageName(file?.name);
            setFile(file);
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const isValidName = USER_REG.test(name);
        const isValidEmail = EMAIL_REG.test(email);
        const isValidPassword = PASS_REG.test(password);

        if (!isValidName || !isValidEmail || !isValidPassword || !imageName || isError) {
            setIsError(true);
            setError({ message: 'Invalid Entry' });
            return;
        }
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const storageRef = ref(storage,'images/'+name);
           await uploadBytesResumable(storageRef, file).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    await updateProfile(user, {
                        displayName: name, photoURL:downloadURL,
                    });
                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        uid:userCredential.user.uid,
                        name,
                        email,
                        photoUrl:downloadURL
                    });
                    await setDoc(doc(db,'userChats',userCredential.user.uid),{});
                    navigate('/');
                }).catch(err => alert(err));

           })
            setLoading(false);

        } catch (error) {
            setIsError(true);
            setError({ message: error.message })

        } finally {
            setLoading(false);
        }


    }


    //  return


    return (
        <div className='body'>
            <Card className='shadow'>
                <CardBody>
                    <div className='text-center'>
                        <h3>Register Here</h3>
                    </div>
                    <Form onSubmit={handleFormSubmit}>
                        {
                            isError &&

                            (<Alert className='w-100' variant='danger'>
                                <p>{error?.message}</p>
                            </Alert>)
                        }
                        <InputComponent
                            label='User Name'
                            type='text'
                            placeholder='Enter Name'
                            id='user-name'
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                            ref={userRef}
                            state={name}
                            focus={nameFocus}
                            isValid={isValidName}
                            atertText={<p> 4 to 24 characters <br />
                                Must begin with a letter <br />
                                Letter,number, underscores,hyphens allowed</p>
                            }
                        />
                        <InputComponent
                            label='Enter Email'
                            type='email'
                            placeholder='Enter Email'
                            id='email'
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

                        <label htmlFor='profile-image' className='mt-1'>
                            <span>choose profile image <span style={{ color: 'red', fontSize: '20px' }}>*</span></span><CgProfile style={{ fontSize: '45px' }} />
                            {image && (<div><img src={image} className='profile-img' alt='profile-img' width={50} height={50}></img> <p>{imageName}</p> </div>)}
                        </label>
                        <input type="file" id='profile-image' onChange={handleImage} style={{ display: 'none' }} />

                        <Button
                            disabled={!isValidName || !isValidEmail || !isValidPassword || loading ? true : false} type='submit' className='w-50 mt-2 d-flex justify-content-center m-auto' variant='primary'>
                            {loading && <Spinner />}
                            Register</Button>

                    </Form>
                </CardBody>
            </Card>
        </div>
    )
}

export default Register
