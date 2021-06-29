import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    "Hello"
  )
}

export default Home;
