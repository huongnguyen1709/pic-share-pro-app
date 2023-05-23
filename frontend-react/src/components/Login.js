import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();

  const googleSuccess = (response) => {
    const decoded = jwt_decode(response.credential);

    const { name, picture, sub: googleId } = decoded;
    localStorage.setItem('user', JSON.stringify({ name, picture, googleId }));

    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  };

  const googleFailure = (error) => {
    console.log('Error', error);
  };

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          muted
          autoPlay
          className='w-full h-full object-cover'
        />

        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} alt='logo' width='130px' />
          </div>

          <div className='shadow-2xl'>
            <GoogleLogin
              className='bg-mainColor flex justify-center item-center p-3 rounded-lg cursor-pointer outline-none'
              onSuccess={(response) => googleSuccess(response)}
              onError={(error) => googleFailure(error)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
