import { useOperatorContext } from '../context/OperatorContext';

const useOperator = () => {
    return useOperatorContext();
};

export default useOperator;
