import { IGetDietPlanUseCase } from '../../useCase/user/IGetDietPlanUseCase';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { IDietPlanRepository } from '../../../domain/interfaces/repositories/IDietPlanRepository';
import { USER_ERRORS } from '../../../shared/constants/error';
import { NotFoundException } from '../../constants/exceptions';
import { DietPlanMapper } from '../../mappers/dietPlanMappers';
import { DietPlanResponseDto } from '../../dto/user/dietPlanDTO';

export class GetDietPlanUseCase implements IGetDietPlanUseCase {
    constructor(
    private _userRepository: IUserRepository,
    private _dietPlanRepository: IDietPlanRepository,
    ) {}

    async excute(userId: string): Promise<DietPlanResponseDto> {
        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }

        const dietPlan = await this._dietPlanRepository.findByUserId(userId);

        if (!dietPlan) {
            throw new NotFoundException(USER_ERRORS.USER_DIET_PLAN_NOT_FOUND);
        }

        return DietPlanMapper.toResponseDTO(dietPlan);
    }
}
