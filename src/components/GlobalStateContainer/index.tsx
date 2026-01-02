import Notification from '@/components/Notification';
import { PropsWithChildren } from 'react';

export default function GlobalStateContainer(props: PropsWithChildren) {
    return (
        <>
            <Notification />
            {props.children}
        </>
    );
}
