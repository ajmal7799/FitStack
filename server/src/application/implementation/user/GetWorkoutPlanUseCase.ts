// import { workoutPlanResponseDTO } from "../../dto/user/workoutPlanDTO";
import { IGetWorkoutPlanUseCase } from '../../useCase/user/IGetWorkoutPlanUseCase';
import { IWorkoutPlanRepository } from '../../../domain/interfaces/repositories/IWorkoutPlanRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { USER_ERRORS } from '../../../shared/constants/error';
import { NotFoundException } from '../../constants/exceptions';
import { WorkoutPlanMapper } from '../../mappers/workouPlanMappers';
import { WorkoutPlanResponseDto } from '../../dto/user/workoutPlanDTO';

export class GetWorkoutPlanUseCase implements IGetWorkoutPlanUseCase {
    constructor(
        private _workoutPlanRepository: IWorkoutPlanRepository, 
        private _userRepository: IUserRepository,
    ) {}

    async  execute(userId: string): Promise<WorkoutPlanResponseDto> {
        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
        }

        const workoutPlan = await this._workoutPlanRepository.findByUserId(userId);

        if (!workoutPlan) {
            throw new NotFoundException(USER_ERRORS.USER_WORKOUT_PLAN_NOT_FOUND);
        }

        return WorkoutPlanMapper.toResponseDto(workoutPlan);


    }
}