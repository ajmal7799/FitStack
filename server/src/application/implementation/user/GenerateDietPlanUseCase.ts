import { IGenerateDietPlanUseCase } from '../../useCase/user/IGenerateDietPlanUseCase';
import { IUserProfileRepository } from '../../../domain/interfaces/repositories/IUserProfileRepository';
import { InvalidDataException, NotFoundException } from '../../constants/exceptions';
import { USER_ERRORS } from '../../../shared/constants/error';
import { IDietPlanProvider } from '../../../domain/interfaces/services/IDietPlanAiProvider';
import { IDietPlanRepository } from '../../../domain/interfaces/repositories/IDietPlanRepository';
import { CreatedietPlanDTO } from '../../dto/user/dietPlanDTO';

export class GenerateDietPlanUseCase implements IGenerateDietPlanUseCase {
    constructor(
    private _userProfileRepository: IUserProfileRepository,
    private _dietPlanProviderService: IDietPlanProvider,
    private _dietPlanRepository: IDietPlanRepository,
    ) {}

    async generateDietPlan(userId: string): Promise<CreatedietPlanDTO> {

        const userProfile = await this._userProfileRepository.findByUserId(userId);

        if (!userProfile) {
            throw new NotFoundException(USER_ERRORS.USER_PROFILE_NOT_FOUND);
        }

        const plan = await this._dietPlanProviderService.generateDietPlan(userProfile);

        if (!plan) {
            throw new InvalidDataException(USER_ERRORS.USER_GENERATE_DIET_PLAN_FAILED);
        }

        const dietPlan = await this._dietPlanRepository.saveDietPlan(userId, plan);

        if (!dietPlan) {
            throw new InvalidDataException(USER_ERRORS.USER_GENERATE_DIET_PLAN_FAILED);
        }

        return {
            dietPlan,
        } as CreatedietPlanDTO;

    }
}
