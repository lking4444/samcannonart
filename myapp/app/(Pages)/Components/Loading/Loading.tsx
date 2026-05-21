import styles from './Loading.module.css'

type LoadingProps = {
    small?: boolean
}

export default function Loading({small}: LoadingProps){
    return (<div className={small ? styles.smallSpinner : styles.spinner} />)
}