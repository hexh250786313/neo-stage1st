import useAppInit from '@/hooks/useAppInit';
import useNavigationTrack from '@/hooks/useNavigationTrack';
import { ComponentType, PropsWithChildren } from 'react';
import Color from '../Color';
import GlobalStateContainer from '../GlobalStateContainer';
import SafeAreaWrapper from '../SafeAreaWrapper';
import Scroller from '../Scroller';

const CommonWrapper: ComponentType<PropsWithChildren> = (props: PropsWithChildren) => {
    useAppInit();
    useNavigationTrack();

    return (
        <GlobalStateContainer>
            <Color>
                <SafeAreaWrapper>
                    <Scroller>{props.children}</Scroller>
                </SafeAreaWrapper>
            </Color>
        </GlobalStateContainer>
    );
};

export default CommonWrapper;
