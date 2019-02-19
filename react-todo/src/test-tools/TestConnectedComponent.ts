import { Dispatch } from 'redux';
import { connect } from 'react-redux';

type functionComponent<T> = (props: T) => JSX.Element;

const getTestConnectedComponent = <T>(component: functionComponent<T>) => {
    const mapStateToProps = (state: T) => state;
    const mapDispatchToProps = (dispatch: Dispatch) => ({});

    return connect(mapStateToProps, mapDispatchToProps)(component);
};

export { getTestConnectedComponent };
