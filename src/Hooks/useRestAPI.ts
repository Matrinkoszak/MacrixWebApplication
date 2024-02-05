import { RestApiService } from '../Services/RestAPIService';

export const useRestAPI = () => {
    const restAPIService = new RestApiService();

    const getPeople = async (): Promise<object> => {
        const response = await restAPIService.getPeople();
        //console.log(response);
        return response;
    }

    return {
        getPeople
    };
};