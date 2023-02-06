import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useEffectOnce } from 'usehooks-ts';

export interface AlertToastProps {
    id: string|number;
    show: boolean;
    onHide?: () => void;
    text: string;
    variant?: string;
}

export function AlertToast(props: AlertToastProps) {
    const [ show, setShow ] = useState(props.show);

    useEffectOnce(() => {
        setTimeout(() => {
            setShow(false);
            props.onHide?.();
        }, 4000);
    });

    function handleClose() {
        setShow(false);
        props.onHide?.();
    }

    return (
        <>
            {show && <div className="toast-alert" role="alert">
                <Alert show={show} variant={props.variant ?? 'primary'} dismissible onClose={handleClose}>
                    <p>{props.text}</p>
                </Alert>
            </div>}
        </>
    );
}
