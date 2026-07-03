import styles from "./Error.module.css";

type ErrorStateProps = {
    title?: string;
    message?: string;
    className?: string;
};

export default function ErrorState({ title = "Oops...", message = "Looks like something went wrong.", className = "", }: ErrorStateProps) {
    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.icon} aria-hidden="true">
                    ×
            </div>

            <h3 className={styles.title}>{title}</h3>

            <p className={styles.message}>{message}</p>
        </div>
    );
}